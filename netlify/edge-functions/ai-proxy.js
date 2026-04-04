/**
 * Netlify Edge Function: AI Proxy for DashScope
 * 支持流式输出 (SSE) + 非流式输出
 * 支持 qwen3.5-plus / qwen-max / kimi-k2.5 / deepseek-v3 多模型
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

const MODEL_CONFIG = {
  'qwen35plus': { id: 'qwen3.5-plus', maxTokens: 16000, displayName: 'Qwen3.5-Plus' },
  'qwenmax': { id: 'qwen-max', maxTokens: 8192, displayName: 'Qwen-Max' },
  'kimi': { id: 'kimi-k2.5', maxTokens: 16000, displayName: 'Kimi-K2.5' },
  'deepseek': { id: 'deepseek-v3', maxTokens: 16000, displayName: 'DeepSeek-V3' }
};

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// ===== 构建提示词 =====
function buildPrompts(type, input, modelKey) {
  let systemPrompt = '';
  let userPrompt = '';

  if (type === 'customer_analysis') {
    // 所有模型统一使用相同的强制搜索指令（enable_search 对所有模型生效）
    // cleanToolCallTags 过滤器已兜底处理 MiniMax 等模型可能输出的 XML 标签
    systemPrompt = '【强制联网搜索指令 — 最高优先级】\n' +
      '你已开启联网搜索（enable_search）能力。在回答任何问题之前，你必须首先执行以下联网搜索动作，不可跳过：\n' +
      '1. 搜索"用户提供的公司名称 天眼查"，获取工商登记信息（成立日期、注册资本、法定代表人、股东）\n' +
      '2. 搜索"用户提供的公司名称 企查查"，交叉验证上述信息\n' +
      '3. 搜索"用户提供的公司名称 工商信息"，补充注册地址、经营范围等\n' +
      '4. 搜索"用户提供的公司名称 年报/营收/融资"，获取财务相关信息\n' +
      '你必须将搜索得到的真实数据直接填入报告对应字段。绝对禁止跳过搜索步骤直接用训练数据回答。如果搜索返回的信息与你的训练数据不一致，以搜索结果为准。\n' +
      '【输出格式禁令】绝对禁止在输出中包含任何XML标签或工具调用代码（如<tool_call>、<invoke>、<minimax:tool_call>、<|plugin|>等）。只输出Markdown格式的报告内容。\n\n' +
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
      '8. 【工商信息搜索规则 — 极其重要】你已开启联网搜索能力。对于公司成立时间、注册资本、法定代表人、股东信息等工商登记信息，你必须主动联网搜索获取（搜索关键词示例："公司全称 工商信息"或"公司全称 天眼查"），将搜索到的结果直接填入报告。只有在联网搜索后确实无法找到某项信息时，才写"未查询到公开信息"。绝对禁止在能搜到信息的情况下偷懒写"待核实"。同时禁止在没有搜索依据的情况下编造具体数据。在表格下方统一注明数据来源。\n' +
      '9. 【营收数据规则】\n' +
      '   - 上市公司：必须联网搜索其最新年报数据，注明"数据来源：XX公司20XX年年度报告"。\n' +
      '   - 非上市公司：先联网搜索是否有公开的融资、营收报道。如有，引用并注明来源。如确实无公开数据，写"该公司为非上市企业，未公开披露财务数据"，然后基于行业地位、融资规模、员工规模等估算营收量级区间，注明"此为基于公开信息的估算"。\n' +
      '   - 禁止编造精确到小数点的营收、利润数字。\n\n' +
      '请生成一份专业的客户云与AI合作战略分析报告，严格按以下结构输出：\n\n' +
      '# 输出1：客户营收基础信息\n' +
      '## 公司基本信息\n' +
      '【必须联网搜索】请搜索该公司的工商登记信息，用Markdown表格展示（单列表格：信息项 | 内容）：\n' +
      '- 公司全称\n' +
      '- 成立时间\n' +
      '- 注册资本\n' +
      '- 法定代表人\n' +
      '- 注册地址\n' +
      '- 是否上市（如上市注明股票代码）\n' +
      '- 员工规模\n' +
      '- 所属行业\n' +
      '以上信息必须来自联网搜索结果。在表格下方注明数据来源（如"数据来源：天眼查/企查查/国家企业信用信息公示系统"）。仅当搜索后确实无结果时才写"未查询到公开信息"。\n\n' +
      '## 近3年营收数据\n' +
      '用Markdown表格展示该公司近3年的营收数据，列包含：年份、国内营收（亿元）、海外营收（亿元）、总营收（亿元）、营收同比增速、净利润（亿元）、利润同比增速。\n' +
      '- 上市公司：基于公开财报数据，在表格下方注明"数据来源：XX公司年度报告"\n' +
      '- 非上市公司：写明"该公司为非上市企业，未公开披露财务数据"，然后基于融资轮次、行业地位、员工规模等公开信息估算营收量级区间，注明"此为估算值"\n' +
      '## 业务收入结构分析\n' +
      '分析该公司主要业务板块的收入占比，必须使用Markdown表格展示，列包含：业务板块、主要产品/服务、收入占比（估算）、同比趋势、备注说明。如无精确数据，可基于公开信息合理估算并注明。\n' +
      '## 招投标信息检索\n' +
      '检索该公司近1-3年的招投标信息。如有招投标记录，用Markdown表格展示，列包含：招标项目名称、招标时间、中标公司、中标金额、信息来源链接。【重要】如果无法检索到招投标信息，直接写"暂无公开招投标信息"，不要编造或推测。\n' +
      '## 股权信息检索\n' +
      '【必须联网搜索】请搜索该公司的股权结构信息（搜索关键词："公司全称 股东信息"或"公司全称 股权结构"），分以下子项用列表详细展开：\n' +
      '- 控股人及其背景\n' +
      '- 集团公司与分/子公司列表，用Markdown表格展示，列包含：公司名称、类型（母公司/子公司/分公司）、持股比例\n' +
      '- 股权分布（主要股东及持股比例，用列表展示）\n' +
      '以上信息必须基于联网搜索结果填写，注明数据来源。如该公司确实搜不到股权信息（如极小型企业），写"未查询到公开股权信息，建议通过国家企业信用信息公示系统(gsxt.gov.cn)查询"。\n\n' +
      '# 输出2：客户商业模式分析报告\n' +
      '## 1. 客户业务概况\n' +
      '分别用 ### 三级标题列出以下子项，每个子项下用列表展开：商业模式与盈利模式、核心客户群体与细分市场、主要产品/服务的功能与市场定位、市场竞争格局与主要竞争对手分析、客户触达与服务模式、企业整体业务方向与中长期发展战略、2026年工作重点\n' +
      '## 2. 影响客户业务的关键行业趋势（未来 6-24 个月）\n' +
      '用Markdown表格展示3-5个趋势，列包含：趋势名称、内涵与逻辑、与客户的相关性\n' +
      '## 3. 从客户视角分析的机会与挑战\n' +
      '分"关键业务机会"和"主要挑战"两个 ### 子标题，各用列表展开3-5项\n' +
      '## 4. 从"用户结果"反推关键举措、指标和 Use Cases\n' +
      '用Markdown表格展示，列包含：用户结果目标、关键战略举措、KPIs、典型Use Case\n' +
      '## 5. 公共云与生成式 AI（GenAI）的应用构想\n' +
      '先用 ### 子标题说明公有云潜在价值，再用Markdown表格展示3-5个GenAI应用场景，列包含：场景、业务痛点、解决思路、预期价值与指标。最后可简要讨论实施路径和关键成功要素';
    userPrompt = '【搜索指令 — 请立即执行】\n' +
      '在生成报告前，请先联网搜索以下关键词获取该公司的真实工商信息：\n' +
      '1. "' + input.customerName + ' 天眼查"\n' +
      '2. "' + input.customerName + ' 企查查"\n' +
      '3. "' + input.customerName + ' 工商信息 成立时间 注册资本 法定代表人"\n' +
      '4. "' + input.customerName + ' 股东信息 股权结构"\n' +
      '将搜索到的成立时间、注册资本、法定代表人、股东持股比例等信息直接填入报告的"公司基本信息"和"股权信息"表格中。\n\n' +
      '请分析以下客户的AI转型潜力：\n客户公司全称：' + input.customerName +
      (input.productName ? '\n产品/APP名称：' + input.productName : '') +
      (input.website ? '\n公司官网：' + input.website : '') +
      '\n\n请务必先识别出该客户的完整公司名称，然后进行深入分析。' +
      (input.productName ? '请特别关注其产品"' + input.productName + '"的业务模式和AI应用潜力。' : '') +
      (input.website ? '可参考其官网获取更多信息。' : '') +
      '请严格按照Markdown格式输出，包含#一级标题、##二级标题、###三级标题、**加粗**、列表和表格。';

  } else if (type === 'visit_plan') {
    const sceneLabels = { first: '首次拜访', progress: '商机推进', executive: '高层拜访' };
    const sceneName = sceneLabels[input.scene] || '客户拜访';
    systemPrompt = '你是阿里云西部大区资深AI销售教练，擅长帮助渠道伙伴制定高质量的客户拜访计划。\n\n' +
      '【会前调研规则】\n' +
      '在生成拜访计划前，你必须先基于用户提供的客户名称，联网搜索该公司的真实业务信息，包括但不限于：主营业务、行业地位、近期新闻动态、融资/上市状态、业务规模。将这些真实信息融入拜访计划各章节，特别是"信息分享"和"会议议程"部分，确保价值点和议题基于客户的实际业务场景，而非通用模板。\n\n' +
      '【格式要求】请严格使用Markdown格式输出，确保层级分明、重点突出：\n' +
      '- 使用 ## 作为每个章节的标题（如 ## 一、拜访目标）\n' +
      '- 使用 ### 作为章节内的子标题\n' +
      '- 使用 **加粗** 突出关键信息、承诺内容、时间节点\n' +
      '- 使用 - 作为无序列表的每一项\n' +
      '- 使用 1. 2. 作为有序编号列表\n' +
      '- 信息获取、信息分享等多维度内容使用Markdown表格（| 列1 | 列2 | 列3 |）\n' +
      '- 会议议程必须使用Markdown表格展示\n' +
      '- 中文输出，清晰小标题+编号，便于直接复制到拜访计划文档\n\n' +
      '【重要规则】\n' +
      '1. 所有内容必须紧密围绕用户提供的具体客户信息，不要给出泛化的通用建议。\n' +
      '2. 内容必须结合"项目阶段+拜访对象角色+触发事件"，禁止通用套话。\n' +
      '3. 行动建议必须具体到可执行的步骤。\n' +
      '4. 【客户信息准确性】当拜访计划中引用客户公司的具体事实（成立时间、业务范围、营收规模、市场地位、竞争格局等），必须使用联网搜索获取的信息，不要依赖训练数据编造。如果无法核实某项信息，标注"⚠ 建议会前通过天眼查/企查查核实"。\n' +
      '5. 【禁止编造数据】不要虚构具体的财务数字、员工人数、市场份额百分比或竞品公司名称。无法获取时，将其列为"缺失信息"纳入第七章"会前补齐建议"。\n' +
      '6. 【行业趋势须有依据】提及的行业趋势或市场动态应基于真实、可验证的事件或报告，不要使用泛泛的通用趋势描述。\n' +
      '7. 【不确定信息标注】对于无法高度确信的客户相关信息，必须标注"待核实"，不要当作已确认事实呈现。\n\n' +
      '请生成一份专业的拜访计划，严格按以下7个章节结构输出：\n' +
      '## 一、拜访目标\n从以下目标类型中选择1-2个主目标，输出一句话目标陈述。可选目标类型：认知塑造与教育（先教后卖）、商机确认（资格验证：需求/决策链/预算/时间）、决策推进（明确路径并获取下一步承诺）、价值交付与风险管理（交付价值/风险化解）、关系与影响力拓展（关键人覆盖与信任强化）。\n' +
      '## 二、用户行动承诺（Customer Commitment）\n这是客户（被拜访方）的行动承诺，不是阿里云的承诺。为这场拜访设计两层承诺，用表格展示：最高承诺（理想）和最低承诺（保底），每条承诺包含：用户做什么/谁负责/截止时间/交付物。承诺必须与项目阶段匹配。\n' +
      '## 三、信息获取（What we need to learn）\n用Markdown表格输出3-6条信息点，列包含：序号、信息点、优先级（Must/Should/Could）、向谁确认、为什么重要。信息维度至少覆盖公司相关、项目相关、用户观点三个方面。\n' +
      '## 四、信息分享（What we deliver / Value provided）\n用Markdown表格输出3-5个价值点，列包含：序号、价值点、证据形态、对应解决的问题。表格后单独输出"紧迫感"表述1条。\n' +
      '## 五、会议议程（Meeting Agenda）\n先列出参会人角色，然后用Markdown表格输出分段议程，列包含：时段、时长、议题、我方动作、对方需给的信息/决策、预期产出。最后一段必须是确认下一步计划与行动承诺。\n' +
      '## 六、一致性检查\n用Markdown表格做清单校验，列包含：检查项、状态（✅/⚠️）、说明。如发现不一致，指出并给出调整建议。\n' +
      '## 七、缺失信息与会前补齐建议（Top 5）\n用Markdown表格列出5条缺失信息，列包含：序号、缺失信息、影响风险、会前补齐动作。';
    userPrompt = '拜访场景：' + sceneName + '\n拜访对象角色：' + (input.role || '') + '\n' + (input.details || '') + '\n\n请严格按照Markdown格式输出，包含##章节标题、###子标题、**加粗**、列表和表格。';

  } else {
    return null;
  }

  return { systemPrompt, userPrompt };
}

// ===== 清理模型幻觉的 tool_call XML 标签 =====
function cleanToolCallTags(text) {
  if (!text) return text;
  text = text.replace(/<\/?minimax:tool_call>/g, '');
  text = text.replace(/<invoke\s+name="[^"]*">/g, '');
  text = text.replace(/<\/invoke>/g, '');
  text = text.replace(/<parameter\s+name="[^"]*">[^<]*<\/parameter>/g, '');
  text = text.replace(/<\|plugin\|>[\s\S]*?<\|\/plugin\|>/g, '');
  text = text.replace(/<tool_call>[\s\S]*?<\/tool_call>/g, '');
  text = text.replace(/<function_call>[\s\S]*?<\/function_call>/g, '');
  // MiniMax 的 <tool_code>...</tool_code> 格式
  text = text.replace(/<tool_code>[\s\S]*?<\/tool_code>/g, '');
  text = text.replace(/<tool_code>[\s\S]*$/g, '');
  text = text.replace(/<query>[^<]*<\/query>/g, '');
  return text;
}

// ===== 去除模型输出中混入正文的"思考过程" =====
// 规则：找到第一个 Markdown 标题（# 或 ##），去掉前面的思考文本
function stripThinkingPreamble(text) {
  if (!text) return text;
  var match = text.match(/(^|\n)(#{1,2}\s+.+)/);
  if (match && match.index !== undefined) {
    var preambleEnd = match.index + (match[1] === '\n' ? 1 : 0);
    var preamble = text.substring(0, preambleEnd);
    if (preamble.trim().length > 15) {
      return text.substring(preambleEnd);
    }
  }
  return text;
}

// ===== 流式处理：转发 DashScope SSE 到客户端 =====
function handleStream(apiResponse, cfg) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      // 先发送模型信息
      controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'start', model: cfg.displayName }) + '\n\n'));

      const reader = apiResponse.body.getReader();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed === 'data: [DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              continue;
            }

            if (trimmed.startsWith('data: ')) {
              try {
                const json = JSON.parse(trimmed.slice(6));
                const delta = json.choices && json.choices[0] && json.choices[0].delta;
                if (delta) {
                  // 只取 content，不取 reasoning_content（那是思考过程，不应展示）
                  let content = delta.content || '';
                  content = cleanToolCallTags(content);
                  if (content) {
                    controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'chunk', content }) + '\n\n'));
                  }
                }
              } catch (e) {
                // 忽略解析错误的行
              }
            }
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'error', error: err.message }) + '\n\n'));
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// ===== 主处理函数 =====
export default async (request, context) => {
  // GET - 健康检查
  if (request.method === 'GET') {
    const API_KEY = Deno.env.get('DASHSCOPE_API_KEY');
    return new Response(JSON.stringify({
      status: 'Edge Function is working!',
      hasApiKey: !!API_KEY,
      streaming: true,
      timestamp: new Date().toISOString()
    }, null, 2), { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
  }

  // OPTIONS - CORS
  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  const API_KEY = Deno.env.get('DASHSCOPE_API_KEY');
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'ENV_MISSING: 服务端未配置 DASHSCOPE_API_KEY' }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'PARSE_ERROR: 请求格式错误' }), {
      status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  const { type, input, model: modelKey, stream: useStream } = body;
  const cfg = MODEL_CONFIG[modelKey] || MODEL_CONFIG['qwen35plus'];
  const prompts = buildPrompts(type, input, modelKey);

  if (!prompts) {
    return new Response(JSON.stringify({ error: 'INVALID_TYPE: 未知的请求类型' }), {
      status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  // enable_search: 所有模型均开启 DashScope 平台级联网搜索
  // 平台会在模型收到请求前执行搜索并注入结果，对 Qwen/Kimi/MiniMax 均有效
  // MiniMax 可能输出 tool_call XML 标签的问题已通过 cleanToolCallTags 过滤器解决
  const apiBody = {
    model: cfg.id,
    messages: [
      { role: 'system', content: prompts.systemPrompt },
      { role: 'user', content: prompts.userPrompt }
    ],
    temperature: 0.7,
    max_tokens: cfg.maxTokens,
    stream: !!useStream,
    enable_search: true
  };

  try {
    // 显式超时控制（流式模式下给更充足的时间，千问模型首 token 延迟可达 30-40s）
    const timeoutMs = useStream ? 120000 : 60000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify(apiBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({
        error: 'API_ERROR: 模型API返回 ' + response.status,
        detail: errText.substring(0, 500)
      }), { status: response.status, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    }

    // 流式输出
    if (useStream) {
      return handleStream(response, cfg);
    }

    // 非流式输出（兼容旧版前端）
    const data = await response.json();
    const message = data.choices && data.choices[0] && data.choices[0].message;
    // 只取 content，不取 reasoning_content（那是思考过程，不应展示）
    let content = message
      ? (message.content || '未能生成内容，请重试')
      : '未能生成内容，请重试';
    content = cleanToolCallTags(content);
    content = stripThinkingPreamble(content);

    return new Response(JSON.stringify({ content, model: cfg.displayName || cfg.id }), {
      status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    const isAbort = err.name === 'AbortError' || (err.message && err.message.includes('aborted'));
    const errorMsg = isAbort
      ? '模型响应超时(25秒)，该模型可能正忙，请稍后重试'
      : err.message;
    return new Response(JSON.stringify({ error: 'ERROR: ' + errorMsg }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
};

export const config = { path: "/api/ai-proxy" };
