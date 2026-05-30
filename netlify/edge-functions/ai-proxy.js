/**
 * Netlify Edge Function: AI Proxy for DashScope
 * 支持流式输出 (SSE) + 非流式输出
 * 支持 qwen3-max / qwen-plus / MiniMax-M2.1 / deepseek-v3.2 多模型
 *
 * 模型选型说明（2026年5月）：
 *   qwen3max   → qwen3-max       百炼旗舰，原生联网搜索，复杂推理首选
 *   qwenplus   → qwen-plus       千问次旗舰，联网搜索，速度/质量平衡
 *   minimax    → MiniMax-M2.1    百炼集成，联网搜索由代理层透明处理，不污染输出
 *   deepseek   → deepseek-v3.2   混合推理，媲美GPT-5，性价比最高
 *
 * 联网搜索说明：
 *   四个模型均通过 Chat Completions API 的 enable_search 参数支持联网搜索。
 *   搜索由百炼代理层透明处理，不会在 delta.content 中暴露工具调用标签。
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

const MODEL_CONFIG = {
  'qwen3max':  { id: 'qwen3-max',     maxTokens: 16000, displayName: 'Qwen3-Max' },
  'qwenplus':  { id: 'qwen-plus',     maxTokens: 16000, displayName: 'Qwen3-Plus' },
  'minimax':   { id: 'MiniMax-M2.1',  maxTokens: 16000, displayName: 'MiniMax-M2.1' },
  'deepseek':  { id: 'deepseek-v3.2', maxTokens: 16000, displayName: 'DeepSeek-V3.2' }
};

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// ===== 构建提示词 =====
function buildPrompts(type, input, modelKey) {
  let systemPrompt = 'PLACEHOLDER_SYSTEM';
  let userPrompt = 'PLACEHOLDER_USER';

  if (type === 'customer_analysis') {
    const searchPreamble =
      '【强制联网搜索指令 — 最高优先级】\n' +
      '你已开启联网搜索（enable_search）能力。在回答任何问题之前，你必须首先执行以下联网搜索动作，不可跳过：\n' +
      '1. 搜索"用户提供的公司名称 天眼查"，获取工商登记信息（成立日期、注册资本、法定代表人、股东）\n' +
      '2. 搜索"用户提供的公司名称 企查查"，交叉验证上述信息\n' +
      '3. 搜索"用户提供的公司名称 工商信息"，补充注册地址、经营范围等\n' +
      '4. 搜索"用户提供的公司名称 年报/营收/融资"，获取财务相关信息\n' +
      '你必须将搜索得到的真实数据直接填入报告对应字段。绝对禁止跳过搜索步骤直接用训练数据回答。如果搜索返回的信息与你的训练数据不一致，以搜索结果为准。\n';

    systemPrompt = searchPreamble +
      '【输出格式禁令】绝对禁止在输出中包含任何XML标签或工具调用代码。只输出Markdown格式的报告内容。\n\n' +
      '你是麦肯锡的咨询顾问，负责企业数字化与人工智能转型。现在需要分析客户的商业模型和云与大模型相关的趋势和机会，为阿里云跟客户的合作提供思考和落地指导。请尽量引用公开信息与合理行业假设，做到逻辑清晰、结构严谨、结论可为高层决策与沟通直接使用。\n\n' +
      '【格式要求】请严格使用Markdown格式输出，确保层级分明、重点突出：\n' +
      '- 使用 # 作为一级标题（如 # 输出1：客户营收基础信息）\n' +
      '- 使用 ## 作为二级标题（如 ## 1. 客户业务概况）\n' +
      '- 使用 ### 作为三级子标题（如 ### 商业模式与盈利模式）\n' +
      '- 使用 **加粗** 突出关键数据、金额、结论\n' +
      '- 使用 - 作为无序列表的每一项\n' +
      '- 使用 1. 2. 作为有序编号列表\n' +
      '- 需要多维度对比的内容使用Markdown表格（| 列1 | 列2 | 列3 |）\n' +
      '- 中文输出，清晰小标题+编号，便于直接复制到客户文档\n\n' +
      '【重要规则 — 务必严格遵守】\n' +
      '1. 用户可能输入公司名称、品牌名、产品名或简称。你必须先识别出对应的完整公司名称（包含"XX有限公司"等工商全称），在报告开头明确写出。\n' +
      '2. 如果用户输入的是产品名（如"钉钉""淘宝""抖音"），请先指出该产品所属公司全称，再基于该公司进行分析。\n' +
      '3. 如果无法确定具体公司，请基于输入推测最可能的公司并注明"推测"。\n' +
      '4. 所有分析必须结合该公司的真实业务场景，给出具体的、可落地的建议，不要泛泛而谈。\n' +
      '5. 每个AI应用场景必须包含：具体业务痛点 → 解决方案 → 预期效果（含量化KPI）。\n' +
      '6. 阿里云产品推荐必须具体到产品名称和使用方式，不要只列产品名。\n' +
      '7. 【招投标信息规则】如果无法检索到招投标信息，直接写"暂无公开招投标信息"，不要推测虚构。如果检索到招投标信息，必须附上信息来源的超链接网址。\n' +
      '8. 【工商信息搜索规则 — 极其重要】你已开启联网搜索能力。对于公司成立时间、注册资本、法定代表人、股东信息等工商登记信息，你必须主动联网搜索获取。如果第一次搜索未找到，必须换关键词再次搜索，至少尝试3种不同关键词组合。将搜索到的结果直接填入报告，并在表格下方注明数据来源。绝对禁止写"待核实"。只有在穷尽搜索后确实无结果时，才写"未查询到公开信息"。同时禁止在没有搜索依据的情况下编造具体数据。\n' +
      '9. 【工商信息防幻觉规则 — 最高优先级，违反即报告作废】\n' +
      '   对于公司工商登记信息（成立时间、法定代表人、注册资本、注册地址、统一社会信用代码等），执行以下硬性规则：\n' +
      '   a) 每个字段必须独立从搜索结果中提取。如果搜索结果中未包含某个具体字段，该字段必须写"未查询到公开信息"。\n' +
      '   b) 绝对禁止凭训练数据"补全"工商信息——训练数据中的公司信息大概率是过时的或张冠李戴的。\n' +
      '   c) 绝对禁止编造看似合理的数据（如随意写一个成立年份、编一个人名作为法定代表人）。\n' +
      '   d) 如果搜索结果只返回了公司名称但没有返回具体工商信息，所有工商字段都必须写"未查询到公开信息"。\n' +
      '   e) 法定代表人姓名：必须精确匹配搜索结果，不得猜测。如果搜索结果中没有出现法定代表人姓名，写"未查询到公开信息"。\n' +
      '   f) 成立时间：必须精确到年月，从搜索结果中直接提取。如果搜索结果中没有明确成立日期，写"未查询到公开信息"。\n' +
      '   g) 如果你不确定某条工商信息是否来自搜索结果，就不要写入报告。\n' +
      '10. 【营收数据规则】\n' +
      '   - 上市公司：必须联网搜索其最新年报数据，注明"数据来源：XX公司20XX年年度报告"。\n' +
      '   - 非上市公司：先联网搜索是否有公开的融资、营收报道。如有，引用并注明来源。如确实无公开数据，写"该公司为非上市企业，未公开披露财务数据"，然后基于行业地位、融资规模、员工规模等估算营收量级区间，注明"此为基于公开信息的估算"。\n' +
      '   - 禁止编造精确到小数点的营收、利润数字。\n' +
      '11. 【GenAI+Agent应用场景覆盖 — 极其重要】除生成式AI外，还必须覆盖以下两类Agent提效场景：\n' +
      '   【一】编程提效（开发者场景）：重点介绍通义灵码（Tongyi Lingma）和 Qoder — 阿里云官方AI编程助手。\n' +
      '   【二】办公提效（全员场景）：重点介绍钉钉AI助理、通义听悟、通义万相等。\n' +
      '   【三】生成式AI业务创新（行业核心场景）：结合客户行业核心业务流程，基于百炼平台、PAI、通义千问API等构建行业应用。\n' +
      '   - 禁止推荐Cursor、GitHub Copilot、ChatGPT等非阿里系第三方AI工具。\n' +
      '   - 所有行业趋势数据必须优先引用2024年至2025年的最新数据。\n\n' +
      '请生成一份专业的客户云与AI合作战略分析报告，严格按以下结构输出：\n\n' +
      '# 输出1：客户营收基础信息\n' +
      '## 公司基本信息\n' +
      '【必须联网搜索】用Markdown表格展示：公司全称、成立时间、注册资本、法定代表人、注册地址、是否上市、员工规模、所属行业。注明数据来源。\n\n' +
      '## 近3年营收数据\n' +
      '用Markdown表格展示：年份、国内营收、海外营收、总营收、营收同比增速、净利润、利润同比增速。\n' +
      '## 业务收入结构分析\n用Markdown表格展示各业务板块收入占比。\n' +
      '## 招投标信息检索\n如有用表格展示，如无写"暂无公开招投标信息"。\n' +
      '## 股权信息检索\n【必须联网搜索】控股人背景、集团与分/子公司、股权分布。注明数据来源。\n\n' +
      '# 输出2：客户商业模式分析报告\n' +
      '## 1. 客户业务概况\n分别用 ### 列出：商业模式与盈利模式、核心客户群体、主要产品/服务、市场竞争格局、客户触达与服务模式、企业战略方向、2026年工作重点\n' +
      '## 2. 影响客户业务的关键行业趋势（未来6-24个月）\n用表格展示3-5个趋势，优先引用2024-2025年数据\n' +
      '## 3. 从客户视角分析的机会与挑战\n分"关键业务机会"和"主要挑战"各3-5项\n' +
      '## 4. 从"用户结果"反推关键举措、指标和 Use Cases\n用表格展示\n' +
      '## 5. 公共云与 GenAI+Agent 应用构想\n' +
      '### 5.1 编程提效（开发者场景）— 通义灵码 / Qoder\n' +
      '### 5.2 办公提效（全员场景）— 钉钉AI助理、通义听悟等\n' +
      '### 5.3 生成式AI业务创新（行业核心场景）— 基于百炼/PAI/Qwen API\n' +
      '最后简要讨论实施路径和关键成功要素';

    userPrompt = '【第一步：确认公司全称 — 最高优先级】\n' +
      '用户输入的名称是："' + (input.customerName || '未知') + '"。\n' +
      '这可能是简称、品牌名或产品名。你必须先搜索确认该公司的**完整工商注册名称**。\n' +
      '后续所有搜索都必须使用确认后的工商全称。\n\n' +
      '【第二步：搜索工商信息 — 请立即执行】\n' +
      '确认工商全称后，请搜索以下关键词获取真实工商信息：\n' +
      '1. "[确认的工商全称] 天眼查"\n' +
      '2. "[确认的工商全称] 企查查"\n' +
      '3. "[确认的工商全称] 成立时间 注册资本 法定代表人"\n' +
      '4. "[确认的工商全称] 股东信息 股权结构"\n\n' +
      '【数据来源硬性约束 — 极其重要】\n' +
      '1. 公司基本信息表格中的每一项必须且只能来自本次联网搜索返回的结果。\n' +
      '2. 绝对禁止使用训练数据中的工商信息。\n' +
      '3. 如果某项数据不在搜索结果中，就写"未查询到公开信息"。\n' +
      '4. 每条工商信息后面必须标注来源。\n' +
      '5. 如果搜索结果中有多家名称相似的公司，必须选择与用户输入最匹配的那一家。\n\n' +
      '请分析以下客户的AI转型潜力：\n客户名称：' + (input.customerName || '未知') +
      (input.productName ? '\n产品/APP名称：' + input.productName : '') +
      (input.website ? '\n公司官网：' + input.website : '') +
      '\n\n请务必先通过搜索识别出该客户的完整工商注册名称，然后基于该全称进行所有后续搜索和分析。' +
      (input.productName ? '请特别关注其产品"' + input.productName + '"的业务模式和AI应用潜力。' : '') +
      (input.website ? '可参考其官网获取更多信息。' : '') +
      '\n请严格按照Markdown格式输出，包含#一级标题、##二级标题、###三级标题、**加粗**、列表和表格。';

  } else if (type === 'visit_plan') {
    const sceneLabels = { first: '首次拜访', progress: '商机推进', executive: '高层拜访' };
    const sceneName = sceneLabels[input.scene] || '客户拜访';
    systemPrompt =
      '你是阿里云西部大区资深AI销售教练，擅长帮助渠道伙伴制定高质量的客户拜访计划。\n' +
      '【输出格式禁令】绝对禁止在输出中包含任何XML标签或工具调用代码。所有信息直接融入正文。';
    userPrompt = '拜访场景：' + sceneName + '\n拜访对象角色：' + (input.role || '') + '\n' + (input.details || '') + '\n\n请严格按照Markdown格式输出。';

  } else if (type === 'batch_analysis') {
    systemPrompt =
      '你是一个企业信息分析助手。你的任务是通过联网搜索获取目标公司的关键信息，并以严格的JSON格式输出。\n\n' +
      '【输出格式 — 最高优先级】你必须且只能输出一个合法的JSON对象，不要输出任何Markdown标记、代码块符号（如```）、标题、解释文字或任何其他内容。直接输出JSON。\n\n' +
      '【数据准确性规则 — 极其重要】\n' +
      '1. 所有字段必须来自本次联网搜索结果，禁止使用训练数据。\n' +
      '2. 如果某个字段在搜索结果中找不到，文本字段填空字符串""，数值字段填null。\n' +
      '3. 绝对禁止编造任何数据（成立日期、法人姓名、营收数字等）。\n' +
      '4. 法定代表人：必须精确匹配搜索结果，搜不到就填""。\n' +
      '5. 成立时间：从搜索结果中提取，格式"YYYY-MM"或"YYYY年"，搜不到就填""。\n' +
      '6. 营收数据：上市公司搜年报数据，非上市公司搜公开报道的估算值，搜不到revenue填""。\n\n' +
      'JSON结构如下（字段名必须完全一致）：\n' +
      '{\n' +
      '  "companyName": "公司工商全称",\n' +
      '  "establishedDate": "成立时间",\n' +
      '  "legalRepresentative": "法定代表人姓名",\n' +
      '  "registeredCapital": "注册资本",\n' +
      '  "address": "注册地址",\n' +
      '  "isListed": "是否上市及股票代码，未上市填未上市",\n' +
      '  "employeeCount": "员工规模描述",\n' +
      '  "employeeNumber": 员工数量估计数值或null,\n' +
      '  "industry": "所属行业",\n' +
      '  "revenue": "年总营收描述",\n' +
      '  "revenueNumber": 营收数值亿元或null,\n' +
      '  "website": "公司官网URL",\n' +
      '  "businessModel": "核心商业模式一句话概述",\n' +
      '  "mainProducts": "主营产品或服务",\n' +
      '  "biddingInfo": "招投标信息摘要，无则填暂无公开招投标信息",\n' +
      '  "shareholders": "主要股东及持股比例",\n' +
      '  "cloudAiOpportunities": "云计算与AI大模型潜在合作机会，2到3个要点",\n' +
      '  "growthTrend": "增长趋势：高增长/稳健/平稳/下滑"\n' +
      '}\n\n' +
      '再次强调：只输出JSON对象，不要输出任何其他内容。';
    userPrompt = '请联网搜索以下公司的关键信息，并严格按JSON格式输出：\n' +
      '公司名称：' + (input.customerName || '') +
      (input.productName ? '\n产品/APP名称：' + input.productName : '') +
      (input.website ? '\n公司官网：' + input.website : '') +
      '\n\n请直接输出JSON对象，不要包含任何其他文字。';

  } else {
    return null;
  }

  return { systemPrompt, userPrompt };
}

// ===== 清理工具调用标签 =====
function cleanToolCallTags(text) {
  if (!text) return text;
  var LT = String.fromCodePoint(60);
  var GT = String.fromCodePoint(62);
  text = text.replace(new RegExp(LT + 'think' + GT + '[\\s\\S]*?' + LT + '\\/think' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'think' + GT + '[\\s\\S]*', 'gi'), '');
  text = text.replace(new RegExp(LT + 'tool_call' + GT + '[\\s\\S]*?' + LT + '\\/tool_call' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'function_call' + GT + '[\\s\\S]*?' + LT + '\\/function_call' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + '\\/?tool_call' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + '\\/?function_call' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + '\\/?minimax:tool_call' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'invoke[^' + GT + ']*' + GT + '[\\s\\S]*?' + LT + '\\/invoke' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'parameter[^' + GT + ']*' + GT + '[^' + LT + ']*' + LT + '\\/parameter' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'query' + GT + '[\\s\\S]*?' + LT + '\\/query' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'search_result' + GT + '[\\s\\S]*?' + LT + '\\/search_result' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'execution_result' + GT + '[\\s\\S]*?' + LT + '\\/execution_result' + GT, 'gi'), '');
  return text;
}

function stripThinkingPreamble(text) {
  if (!text) return text;
  var match = text.match(/(^|\n)(#{1,2}\s+.+)/);
  if (match && match.index !== undefined) {
    var end = match.index + (match[1] === '\n' ? 1 : 0);
    var preamble = text.substring(0, end);
    if (preamble.trim().length > 30) text = text.substring(end);
  }
  return text;
}

// ===== 调用 DashScope API =====
async function callDashScope(systemPrompt, userPrompt, modelKey, stream) {
  var config = MODEL_CONFIG[modelKey] || MODEL_CONFIG['qwen3max'];
  var apiKey = Deno.env.get('DASHSCOPE_API_KEY');
  if (!apiKey) throw new Error('DASHSCOPE_API_KEY 未配置');

  var body = {
    model: config.id,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: config.maxTokens,
    temperature: 0.5,
    stream: !!stream,
    enable_search: true,
    search_options: {
      forced_search: false,
      search_strategy: 'standard'
    }
  };

  var resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    var errText = '';
    try { errText = await resp.text(); } catch(e) {}
    throw new Error('DashScope API 错误 ' + resp.status + ': ' + errText.substring(0, 500));
  }

  return resp;
}

// ===== 流式处理（SSE）=====
async function handleStream(systemPrompt, userPrompt, modelKey) {
  var resp = await callDashScope(systemPrompt, userPrompt, modelKey, true);
  var reader = resp.body.getReader();
  var decoder = new TextDecoder();
  var encoder = new TextEncoder();

  var readable = new ReadableStream({
    async start(controller) {
      var buffer = '';
      try {
        while (true) {
          var result = await reader.read();
          if (result.done) break;
          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line || line === 'data: [DONE]') continue;
            if (line.startsWith('data: ')) {
              try {
                var json = JSON.parse(line.slice(6));
                var delta = json.choices && json.choices[0] && json.choices[0].delta;
                var content = delta && delta.content;
                if (content) {
                  var cleaned = cleanToolCallTags(content);
                  if (cleaned) {
                    controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'chunk', content: cleaned }) + '\n\n'));
                  }
                }
              } catch (e) {}
            }
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'error', error: err.message }) + '\n\n'));
        controller.close();
      }
    }
  });

  return new Response(readable, {
    headers: Object.assign({}, CORS_HEADERS, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
  });
}

// ===== 非流式处理 =====
async function handleNonStream(systemPrompt, userPrompt, modelKey) {
  var resp = await callDashScope(systemPrompt, userPrompt, modelKey, false);
  var data = await resp.json();
  var config = MODEL_CONFIG[modelKey] || MODEL_CONFIG['qwen3max'];
  var content = '';
  if (data.choices && data.choices[0]) {
    content = data.choices[0].message && data.choices[0].message.content || '';
  }
  content = cleanToolCallTags(content);
  content = stripThinkingPreamble(content);
  return new Response(JSON.stringify({ content: content, model: config.displayName }), {
    headers: Object.assign({}, CORS_HEADERS, { 'Content-Type': 'application/json' })
  });
}

// ===== 主入口 =====
export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (request.method === 'GET') {
    return new Response(JSON.stringify({ status: 'ok', models: Object.keys(MODEL_CONFIG) }), {
      headers: Object.assign({}, CORS_HEADERS, { 'Content-Type': 'application/json' })
    });
  }
  try {
    var body = await request.json();
    var type = body.type;
    var input = body.input;
    var modelKey = body.model || 'qwen3max';
    var stream = body.stream || false;
    // batch_analysis 需要 JSON 输出，强制走非流式路径以避免流式 chunk 拆分导致的 tool_call 标签残留
    if (type === 'batch_analysis') stream = false;
    if (!type || !input) {
      return new Response(JSON.stringify({ error: '缺少必要参数 type 或 input' }), {
        status: 400,
        headers: Object.assign({}, CORS_HEADERS, { 'Content-Type': 'application/json' })
      });
    }
    var prompts = buildPrompts(type, input, modelKey);
    if (!prompts) {
      return new Response(JSON.stringify({ error: '不支持的请求类型: ' + type }), {
        status: 400,
        headers: Object.assign({}, CORS_HEADERS, { 'Content-Type': 'application/json' })
      });
    }
    if (stream) {
      return await handleStream(prompts.systemPrompt, prompts.userPrompt, modelKey);
    } else {
      return await handleNonStream(prompts.systemPrompt, prompts.userPrompt, modelKey);
    }
  } catch (err) {
    console.error('[ai-proxy] Error:', err);
    return new Response(JSON.stringify({
      error: err.message || 'Internal Server Error',
      detail: '请检查 API Key 配置和网络连接'
    }), {
      status: 500,
      headers: Object.assign({}, CORS_HEADERS, { 'Content-Type': 'application/json' })
    });
  }
};
