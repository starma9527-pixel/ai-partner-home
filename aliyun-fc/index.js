'use strict';

// 阿里云 FC - AI 代理函数
// 兼容 FC 2.0 (httpMethod) 和 FC 3.0 (requestContext.http.method)

// 清理模型幻觉的 tool_call XML 标签（MiniMax 等模型可能输出原始工具调用标签）
function cleanToolCallTags(text) {
  if (!text) return text;
  text = text.replace(/<\/?minimax:tool_call>/g, '');
  text = text.replace(/<invoke\s+name="[^"]*">/g, '');
  text = text.replace(/<\/invoke>/g, '');
  text = text.replace(/<parameter\s+name="[^"]*">[^<]*<\/parameter>/g, '');
  text = text.replace(/<\|plugin\|>[\s\S]*?<\|\/plugin\|>/g, '');
  // 动态构建含尖括号的正则，避免源码中直接出现 XML 标签
  var LT = String.fromCodePoint(60);  // <
  var GT = String.fromCodePoint(62);  // >
  var tcO = LT + 'tool_call' + GT;
  var tcC = LT + '/tool_call' + GT;
  var tcEither = LT + '/?tool_call' + GT;
  var fcO = LT + 'function_call' + GT;
  var fcC = LT + '/function_call' + GT;
  var fcEither = LT + '/?function_call' + GT;
  var cdO = LT + 'tool_code' + GT;
  var cdC = LT + '/tool_code' + GT;
  var qO = LT + 'query' + GT;
  var qC = LT + '/query' + GT;
  // 有配对闭合标签的情况
  text = text.replace(new RegExp(tcO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + tcC.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  // 无配对闭合标签：匹配开标签到文本末尾
  text = text.replace(new RegExp(tcO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*', 'g'), '');
  // 仅剩孤立的开/闭标签
  text = text.replace(new RegExp(tcEither.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  text = text.replace(new RegExp(fcO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + fcC.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  text = text.replace(new RegExp(fcEither.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  // MiniMax 的 tool_code 格式
  text = text.replace(new RegExp(cdO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + cdC.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  text = text.replace(new RegExp(cdO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*$', 'g'), '');
  text = text.replace(new RegExp(qO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^' + LT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']*' + qC.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  // think 思考标签（qwen3-max 等思考模型可能输出）
  var thO = LT + 'think' + GT;
  var thC = LT + '/think' + GT;
  text = text.replace(new RegExp(thO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + thC.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
  text = text.replace(new RegExp(thO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*', 'gi'), '');
  // search_result / execution_result 标签
  var srO = LT + 'search_result' + GT;
  var srC = LT + '/search_result' + GT;
  var erO = LT + 'execution_result' + GT;
  var erC = LT + '/execution_result' + GT;
  text = text.replace(new RegExp(srO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + srC.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
  text = text.replace(new RegExp(erO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + erC.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
  return text;
}

// 去除模型输出中混入正文的"思考过程"
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

const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';


exports.handler = async (event, context) => {
  // FC 3.0: event 可能是 Buffer，需要先转为对象
  let evt = event;
  if (Buffer.isBuffer(evt)) {
    try { evt = JSON.parse(evt.toString()); } catch (e) { evt = {}; }
  } else if (typeof evt === 'string') {
    try { evt = JSON.parse(evt); } catch (e) { evt = {}; }
  }

  console.log('=== FC Function Called ===');
  console.log('Event keys:', Object.keys(evt));

  // 注意：不在代码中设置 CORS 头！
  // 阿里云 FC 平台的函数URL会自动处理 CORS，如果代码也加 CORS 头，
  // 会导致重复的 Access-Control-Allow-Origin 头，浏览器会拒绝请求。
  // CORS 请在 FC 控制台的「函数URL」→「CORS配置」中设置。

  // 响应头只保留 Content-Type
  const responseHeaders = {
    'Content-Type': 'application/json'
  };

  // 统一响应格式
  const resp = (statusCode, data) => ({
    isBase64Encoded: false,
    statusCode,
    headers: responseHeaders,
    body: typeof data === 'string' ? data : JSON.stringify(data)
  });

  // ===== 判断调用方式 =====
  // 1) 直接调用 / FC控制台测试：event 直接就是业务JSON {type, input, model}
  // 2) HTTP触发器 FC 2.0：event 有 httpMethod 字段
  // 3) HTTP触发器 FC 3.0 / 函数URL：event 有 requestContext.http.method
  const isDirectInvoke = evt.type && (evt.type === 'customer_analysis' || evt.type === 'visit_plan' || evt.type === 'batch_analysis');
  const httpMethod = isDirectInvoke ? 'POST' : (
    evt.httpMethod ||
    evt.requestContext?.http?.method ||
    (evt.body ? 'POST' : 'GET')
  ).toUpperCase();

  console.log('HTTP Method:', httpMethod, 'isDirectInvoke:', isDirectInvoke);

  // OPTIONS - CORS 预检
  if (httpMethod === 'OPTIONS') {
    return resp(200, { status: 'OK' });
  }

  // GET - 健康检查
  if (httpMethod === 'GET') {
    return resp(200, {
      status: 'AI Proxy is working',
      hasApiKey: !!process.env.DASHSCOPE_API_KEY,
      apiKeyLength: process.env.DASHSCOPE_API_KEY ? process.env.DASHSCOPE_API_KEY.length : 0,
      timestamp: new Date().toISOString()
    });
  }

  // POST - AI 调用
  if (httpMethod !== 'POST') {
    return resp(405, { error: 'Method not allowed: ' + httpMethod });
  }

  // 解析请求体 - 兼容多种格式
  let body;
  try {
    if (isDirectInvoke) {
      // 直接调用：event 本身就是请求体
      body = evt;
    } else if (evt.body) {
      const rawBody = evt.body;
      if (typeof rawBody === 'object') {
        body = rawBody;
      } else if (evt.isBase64Encoded) {
        body = JSON.parse(Buffer.from(rawBody, 'base64').toString());
      } else {
        body = JSON.parse(rawBody);
      }
    } else {
      body = evt;
    }
  } catch (e) {
    console.error('Parse error:', e.message);
    return resp(400, { error: 'Invalid JSON: ' + e.message });
  }

  const { type, input, model } = body;
  console.log('Request:', { type, model, inputKeys: input ? Object.keys(input) : null });

  const DASHSCOPE_KEY = process.env.DASHSCOPE_API_KEY;
  if (!DASHSCOPE_KEY) {
    return resp(500, { error: 'DASHSCOPE_API_KEY not configured' });
  }

  // 模型映射（前端 key → 百炼模型 ID）
  const MODEL_CONFIG = {
    'qwen37max':    { id: 'qwen3.7-max',      maxTokens: 16000, displayName: 'Qwen3.7-Max' },
    'qwen3max':     { id: 'qwen3-max',        maxTokens: 16000, displayName: 'Qwen3-Max' },
    'qwenplus':     { id: 'qwen-plus',        maxTokens: 16000, displayName: 'Qwen3-Plus' },
    'minimax':      { id: 'MiniMax-M2.1',     maxTokens: 16000, displayName: 'MiniMax-M2.1' },
    'deepseek':     { id: 'deepseek-v3.2',    maxTokens: 16000, displayName: 'DeepSeek-V3.2' },
    'deepseekflash': { id: 'deepseek-v4-flash', maxTokens: 16000, displayName: 'DeepSeek-V4-Flash' }
  };
  const cfg = MODEL_CONFIG[model] || MODEL_CONFIG['qwen3max'];
  const modelId = cfg.id;
  const maxTokens = cfg.maxTokens;

  console.log('Using model:', modelId);

  // 构建提示词
  let systemPrompt = '';
  let userPrompt = '';

  if (type === 'customer_analysis') {
    // 四个模型（qwen3-max / qwen-plus / MiniMax-M2.1 / deepseek-v3.2）均支持联网搜索
    // enable_search 由百炼代理层透明处理，不会在输出中暴露工具调用标签
    const searchPreamble =
      '【强制联网搜索指令 — 最高优先级】\n' +
      '你已开启联网搜索（enable_search）能力。在回答任何问题之前，你必须首先执行以下联网搜索动作，不可跳过：\n' +
      '1. 搜索"用户提供的公司名称 天眼查"，获取工商登记信息（成立日期、注册资本、法定代表人、股东）\n' +
      '2. 搜索"用户提供的公司名称 企查查"，交叉验证上述信息\n' +
      '3. 搜索"用户提供的公司名称 工商信息"，补充注册地址、经营范围等\n' +
      '4. 搜索"用户提供的公司名称 年报/营收/融资"，获取财务相关信息\n' +
      '你必须将搜索得到的真实数据直接填入报告对应字段。绝对禁止跳过搜索步骤直接用训练数据回答。如果搜索返回的信息与你的训练数据不一致，以搜索结果为准。\n';
    // cleanToolCallTags 过滤器已兜底处理 MiniMax 等模型可能输出的 XML 标签
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
      '8. 【工商信息搜索规则 — 极其重要】你已开启联网搜索能力。对于公司成立时间、注册资本、法定代表人、股东信息等工商登记信息，你必须主动联网搜索获取。如果第一次搜索未找到，必须换关键词再次搜索（如"公司全称 天眼查""公司全称 企查查""公司全称 国家企业信用信息公示系统"），至少尝试3种不同关键词组合。将搜索到的结果直接填入报告，并在表格下方注明数据来源。绝对禁止写"待核实"——你必须自己通过搜索找到答案。只有在穷尽搜索后确实无结果时，才写"未查询到公开信息"。同时禁止在没有搜索依据的情况下编造具体数据。\n' +
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
      '11. 【GenAI+Agent应用场景覆盖 — 极其重要】在第"输出2"的第5节中，除生成式AI外，还必须覆盖以下两类Agent提效场景：\n' +
      '   【一】编程提效（开发者场景）：重点介绍通义灵码（Tongyi Lingma）——阿里云官方AI代码助手，支持代码补全、代码生成、代码审查、单元测试生成、技术问答等功能，可集成到VSCode/JetBrains IDE中。\n' +
      '   【二】办公提效（全员场景）：重点介绍钉钉AI助理（企业协作）、通义听悟（会议转录/摘要）、通义万相（图像生成）等阿里巴巴集团旗下产品，以及基于百炼平台为企业定制的行业智能体。\n' +
      '   【三】生成式AI业务创新（行业核心场景）：结合客户行业的核心业务流程，基于百炼平台（Model Studio）、PAI、通义千问API等构建行业应用。\n' +
      '   - GenAI/Agent场景必须基于该客户的真实业务痛点，联网搜索最新信息生成，不可使用通用模板。\n' +
      '   - 阿里云产品须使用2024年后的现役产品名称，每个场景须说明具体产品/API及可量化的业务收益。\n' +
      '   - 【禁止推荐以下内容作为阿里云产品】：Cursor、GitHub Copilot、ChatGPT等非阿里系第三方AI工具。\n' +
      '   - 【编程提效代表产品】通义灵码（Tongyi Lingma）和 Qoder 均为阿里云官方AI编程助手，应作为阿里云产品积极推荐。\n' +
      '   - 【行业趋势时效性】所有行业趋势数据必须优先引用2025年至2026年的最新数据，不得使用2024年及以前的过时统计。\n\n' +
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
      '【时效性要求】必须优先引用2025年至2026年的最新行业数据和报告。用Markdown表格展示3-5个趋势，列包含：趋势名称、内涵与逻辑（含数据来源年份）、与客户的相关性\n' +
      '## 3. 从客户视角分析的机会与挑战\n' +
      '分"关键业务机会"和"主要挑战"两个 ### 子标题，各用列表展开3-5项\n' +
      '## 4. 从"用户结果"反推关键举措、指标和 Use Cases\n' +
      '用Markdown表格展示，列包含：用户结果目标、关键战略举措、KPIs、典型Use Case\n' +
      '## 5. 公共云与 GenAI+Agent 应用构想\n' +
      '先用 ### 子标题说明公有云潜在价值。\n' +
      '再分三个 ### 子标题分别展示应用场景，每个子标题下用Markdown表格输出2-3个场景，表格列包含：场景名称、业务痛点、阿里云解决方案（具体产品名称）、预期价值与指标：\n' +
      '### 5.1 编程提效（开发者场景）— 通义灵码 / Qoder\n' +
      '### 5.2 办公提效（全员场景）— 重点介绍钉钉AI助理、通义听悟等\n' +
      '### 5.3 生成式AI业务创新（行业核心场景）— 基于百炼/PAI/Qwen API\n' +
      '【重要】所有场景须：(1)基于客户真实业务痛点而非通用模板；(2)使用阿里云或阿里巴巴集团现役产品；(3)包含可量化的业务收益；(4)不推荐Cursor、GitHub Copilot等非阿里系第三方AI工具。\n' +
      '最后简要讨论实施路径和关键成功要素';
    userPrompt = '【第一步：确认公司全称 — 最高优先级】\n' +
      '用户输入的名称是："' + (input?.customerName || '未知') + '"。\n' +
      '这可能是简称、品牌名或产品名。你必须先搜索"' + (input?.customerName || '未知') + ' 工商注册全称"，确认该公司在国家企业信用信息公示系统中的**完整工商注册名称**（含"有限公司""股份有限公司"等后缀）。\n' +
      '后续所有搜索都必须使用确认后的工商全称，不要用简称搜索（简称容易匹配到错误的公司）。\n\n' +
      '【第二步：搜索工商信息 — 请立即执行】\n' +
      '确认工商全称后，请搜索以下关键词获取该公司的真实工商信息：\n' +
      '1. "[确认的工商全称] 天眼查"\n' +
      '2. "[确认的工商全称] 企查查"\n' +
      '3. "[确认的工商全称] 成立时间 注册资本 法定代表人"\n' +
      '4. "[确认的工商全称] 股东信息 股权结构"\n' +
      '将搜索到的成立时间、注册资本、法定代表人、股东持股比例等信息直接填入报告中。\n\n' +
      '【数据来源硬性约束 — 极其重要】\n' +
      '1. 公司基本信息表格中的每一项（成立时间、注册资本、法定代表人、注册地址等）必须且只能来自本次联网搜索返回的结果。\n' +
      '2. 你的训练数据中可能存储了过时或错误的公司信息，绝对禁止使用训练数据中的工商信息。\n' +
      '3. 判断标准：如果某项数据不在本次搜索结果中出现，就写"未查询到公开信息"，不要凭记忆填写。\n' +
      '4. 每条工商信息后面必须标注来源（如 "来源：天眼查" 或 "来源：企查查"）。\n' +
      '5. 【防混淆】如果搜索结果中出现多家名称相似的公司，必须选择与用户输入最匹配的那一家，并在报告开头说明"经搜索确认，该公司工商全称为：XXX"。\n\n' +
      '请分析以下客户的AI转型潜力：\n客户名称：' + (input?.customerName || '未知') +
      (input?.productName ? '\n产品/APP名称：' + input.productName : '') +
      (input?.website ? '\n公司官网：' + input.website : '') +
      '\n\n请务必先通过搜索识别出该客户的完整工商注册名称，然后基于该全称进行所有后续搜索和分析。' +
      (input?.productName ? '请特别关注其产品"' + input.productName + '"的业务模式和AI应用潜力。' : '') +
      (input?.website ? '可参考其官网获取更多信息。' : '') +
      '请严格按照Markdown格式输出，包含#一级标题、##二级标题、###三级标题、**加粗**、列表和表格。';

  } else if (type === 'visit_plan') {
    const sceneLabels = { first: '首次拜访', progress: '商机推进', executive: '高层拜访' };
    const sceneName = sceneLabels[input?.scene] || '客户拜访';
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
      '4. 【客户信息准确性】当拜访计划中引用客户公司的具体事实（成立时间、业务范围、营收规模、市场地位、竞争格局等），必须使用联网搜索获取的信息，不要依赖训练数据编造。如果第一次搜索未找到，换关键词再搜（如加"天眼查""企查查""官网"等后缀），主动多次尝试直到找到答案。\n' +
      '5. 【禁止编造数据】不要虚构具体的财务数字、员工人数、市场份额百分比或竞品公司名称。无法获取时，将其列为"缺失信息"纳入第七章"会前补齐建议"。\n' +
      '6. 【行业趋势须有依据】提及的行业趋势或市场动态应基于2025年至2026年真实、可验证的事件或报告，不要使用泛泛的通用趋势描述。\n' +
      '7. 【不确定信息处理】遇到不确定的客户信息时，不要简单标注"待核实"。你必须先尝试通过搜索找到答案。只有在穷尽搜索仍无法确认时，才将该信息列入第七章"缺失信息与会前补齐建议"，并给出具体的验证方法（如"建议通过天眼查搜索XX关键词核实"）。\n\n' +
      '请生成一份专业的拜访计划，严格按以下7个章节结构输出：\n' +
      '## 一、拜访目标\n从以下目标类型中选择1-2个主目标，输出一句话目标陈述。可选目标类型：认知塑造与教育（先教后卖）、商机确认（资格验证：需求/决策链/预算/时间）、决策推进（明确路径并获取下一步承诺）、价值交付与风险管理（交付价值/风险化解）、关系与影响力拓展（关键人覆盖与信任强化）。\n' +
      '## 二、用户行动承诺（Customer Commitment）\n这是客户（被拜访方）的行动承诺，不是阿里云的承诺。为这场拜访设计两层承诺，用表格展示：最高承诺（理想）和最低承诺（保底），每条承诺包含：用户做什么/谁负责/截止时间/交付物。承诺必须与项目阶段匹配。\n' +
      '## 三、信息获取（What we need to learn）\n用Markdown表格输出3-6条信息点，列包含：序号、信息点、优先级（Must/Should/Could）、向谁确认、为什么重要。信息维度至少覆盖公司相关、项目相关、用户观点三个方面。\n' +
      '## 四、信息分享（What we deliver / Value provided）\n用Markdown表格输出3-5个价值点，列包含：序号、价值点、证据形态、对应解决的问题。表格后单独输出"紧迫感"表述1条。\n' +
      '## 五、会议议程（Meeting Agenda）\n先列出参会人角色，然后用Markdown表格输出分段议程，列包含：时段、时长、议题、我方动作、对方需给的信息/决策、预期产出。最后一段必须是确认下一步计划与行动承诺。\n' +
      '## 六、一致性检查\n用Markdown表格做清单校验，列包含：检查项、状态、说明。如发现不一致，指出并给出调整建议。\n' +
      '## 七、缺失信息与会前补齐建议（Top 5）\n用Markdown表格列出5条缺失信息，列包含：序号、缺失信息、影响风险、会前补齐动作。';
    userPrompt = '拜访场景：' + sceneName + '\n拜访对象角色：' + (input?.role || '') + '\n' + (input?.details || '') + '\n\n请严格按照Markdown格式输出，包含##章节标题、###子标题、**加粗**、列表和表格。';

  } else if (type === 'batch_analysis') {
    const isSimplifiedModel = (model === 'minimax' || model === 'deepseek' || model === 'deepseekflash');
    if (isSimplifiedModel) {
      // === MiniMax/DeepSeek 简化版：5轮搜索 + 25个JSON字段 ===
      systemPrompt =
        '你是阿里云的企业情报分析师。通过联网搜索调研目标公司，评估其云计算与AI采购潜力，以JSON格式输出。\n\n' +
        '【输出格式】只输出一个JSON对象，不要输出任何其他内容。\n\n' +
        '【搜索流程 — 5轮】\n' +
        '第1轮【工商基础】："{公司名} 天眼查" → 工商全称、成立时间、注册资本、法定代表人、注册地址、省市\n' +
        '第2轮【母公司】："{公司名} 母公司 集团" → 如有母公司，搜索母公司营收和规模\n' +
        '第3轮【营收员工】："{公司名} 营收 员工人数 规模 上市" → 营收、员工数、是否上市\n' +
        '第4轮【AI信号】："{公司名} AI 大模型 技术团队 招聘" → AI活跃度\n' +
        '第5轮【竞对+动态】："{公司名} 腾讯云 华为云 AWS 云服务" + "{公司名} 2025 2026 新闻" → 竞对使用、近期动态\n\n' +
        '【防混淆 — 最高优先级】\n' +
        '1. 搜索必须用用户输入的完整公司名，禁止替换为同名大公司（如"成都字节流"绝不能替换为"字节跳动"）。\n' +
        '2. 搜不到填""或null，禁止用其他公司数据替代。\n' +
        '3. companyName必须填用户输入公司的工商全称，搜不到则填原始名称。\n\n' +
        'JSON结构：\n' +
        '{\n' +
        '  "companyName": "工商全称",\n' +
        '  "establishedDate": "成立时间",\n' +
        '  "legalRepresentative": "法定代表人",\n' +
        '  "registeredCapital": "注册资本",\n' +
        '  "address": "注册地址",\n' +
        '  "province": "省份",\n' +
        '  "city": "城市",\n' +
        '  "isListed": "是否上市，未上市填未上市",\n' +
        '  "companyStrengthScore": 1到10整数,\n' +
        '  "industry": "所属行业",\n' +
        '  "employeeRange": "员工数范围",\n' +
        '  "employeeNumber": 员工数或null,\n' +
        '  "revenue": "年营收描述",\n' +
        '  "revenueNumber": 营收亿元或null,\n' +
        '  "aiActivityLevel": "高/中/低",\n' +
        '  "aiSignals": "AI信号",\n' +
        '  "competitorCloudUsage": "竞对云/AI产品，无则填无竞对使用记录",\n' +
        '  "parentCompany": "母公司，无则填无",\n' +
        '  "parentCompanyRevenue": "母公司营收，无则填无",\n' +
        '  "parentEmployeeNumber": 母公司员工数或null,\n' +
        '  "groupCloudAiUsage": "集团云AI使用，无则填无",\n' +
        '  "cloudAiAnnualBudget": "云+AI年消费预估含依据",\n' +
        '  "growthTrend": "高增长/稳健/平稳/下滑",\n' +
        '  "effectiveEmployeeNumber": 有效员工数或null,\n' +
        '  "effectiveRevenueNumber": 有效营收亿元或null\n' +
        '}\n只输出JSON。';
      userPrompt = '请搜索以下公司情报并输出JSON：\n公司名称：' + (input?.customerName || '') +
        (input?.productName ? '\n产品：' + input.productName : '') +
        (input?.website ? '\n官网：' + input.website : '') +
        '\n\n【防混淆】公司名称必须原样搜索，禁止替换为相似大公司。直接输出JSON。';
    } else {
      // === Qwen 旗舰完整版：10轮搜索 + 35个JSON字段 ===
      systemPrompt =
        '你是阿里云西部大区的企业情报分析师。你的任务是通过多轮联网搜索，对目标公司及其母公司/集团进行全面情报调研，评估其云计算与AI大模型的采购潜力，并以严格的JSON格式输出结果。\n\n' +
        '【输出格式 — 最高优先级】你必须且只能输出一个合法的JSON对象，不要输出任何Markdown标记、代码块符号（如```）、标题、解释文字或任何其他内容。直接输出JSON。\n\n' +
        '【多轮搜索流程 — 必须按顺序执行，每轮必须实际搜索】\n' +
        '第1轮【工商基础】："{公司名} 天眼查"、"{公司名} 企查查" → 获取工商全称、成立时间、注册资本、法定代表人、注册地址\n' +
        '第2轮【集团股权】："{公司名} 母公司"、"{公司名} 控股股东"、"{公司名} 所属集团" → 找出母公司/集团，判断是否是大集团子公司\n' +
        '第3轮【公司实力】："{公司名} 融资 上市 营收 规模 所在省 所在市" → 省市地域、实力评分参考、规模标签\n' +
        '第4轮【营收规模】："{公司名} 年报 营收 净利润 2025 2026" → 最新营收数据，上市公司取年报，非上市公司取公开估算\n' +
        '第5轮【员工规模】："{公司名} 员工人数 团队规模 招聘" → 员工数范围\n' +
        '第6轮【AI战略信号】："{公司名} AI 大模型 招聘 技术团队" → AI活跃度（高/中/低）、具体信号（如招聘AI工程师、自研大模型、发布AI产品等）\n' +
        '第7轮【竞对渗透】："{公司名} 腾讯云 百度智能云 华为云 AWS Azure OpenAI 火山引擎 讯飞星火" → 是否已使用竞对云/AI产品，记录具体产品名\n' +
        '第8轮【近期动态】："{公司名} 2025 2026 新闻 合作 发布" → 最新战略动态、合作消息、产品发布\n' +
        '第9轮【技术栈】："{公司名} 技术架构 云服务 IaaS PaaS" → 已知使用的云/AI技术栈\n' +
        '第10轮【集团云AI】（如有母公司）："{集团名} 营收"、"{集团名} AIGC"、"{集团名} 云计算" → 集团整体规模和云AI使用情况\n' +
        '【关键判断原则】：子公司的采购潜力取决于集团整体数字化投入能力，必须结合集团维度评估，不能只看子公司本身。\n\n' +
        '【防公司混淆规则 — 最高优先级，违反即报告作废】\n' +
        '用户输入的公司名称可能是地方小企业，绝对禁止将其与同名/近名的知名大公司混淆。\n' +
        '规则A【名称精确匹配】：搜索时必须使用用户输入的完整公司名（如"成都字节流"），不得自动替换为名称中包含相同字的其他公司（如绝对禁止将"成都字节流"替换为"字节跳动"）。\n' +
        '规则B【搜索结果验证】：每轮搜索返回结果后，必须验证搜索结果中的公司名称与用户输入是否一致。若搜索结果返回的是另一家公司（名称不同），必须明确拒绝使用该结果，并换关键词重新搜索。\n' +
        '规则C【搜不到时的处理】：若用全名搜索后确实没有找到匹配的公司信息，对应字段填""或null，不得用"可能是XX大公司"来替代填写。\n' +
        '规则D【禁止语义联想】：绝对禁止因为名称包含某个词（如"字节""快手""滴滴"）就联想到对应大公司并填入其数据。用户输入的公司名称必须原样用于搜索。\n' +
        '规则E【companyName字段】：companyName字段必须填写搜索到的工商注册全称。若搜不到工商全称，则填写用户输入的原始名称，绝不能填写另一家公司的名称。\n\n' +
        '【数据准确性规则】\n' +
        '1. 所有字段必须来自本次联网搜索结果，禁止使用训练数据。\n' +
        '2. 找不到的字段：文本填""，数值填null，不要编造。\n' +
        '3. 法定代表人、成立时间：必须精确匹配搜索结果，搜不到填""。\n' +
        '4. 若某字段搜索结果来自另一家公司（非用户输入的公司），该字段必须填""或null。\n\n' +
        '【云计算+AI年度消费预估方法】（cloudAiAnnualBudget字段）\n' +
        '  - 参考：员工规模、技术研发投入、数字化程度、行业基准（互联网IT预算占营收3-8%，传统企业1-3%）\n' +
        '  - AI密集型行业（短视频/AIGC/游戏/金融科技）比例更高\n' +
        '  - 有公开云计算招标信息时以此为基准\n' +
        '  - 格式：预估区间+"（估算依据：...）"，如"500-1000万/年（估算依据：AIGC平台月调用千万级，行业云AI支出基准）"\n' +
        '  - 无法估算时填"数据不足，无法估算"\n\n' +
        '【公司实力评分方法】（companyStrengthScore字段，1-10分）\n' +
        '  10分：上市公司/独角兽/行业龙头；8-9分：准上市/亿级营收/知名品牌；\n' +
        '  6-7分：千万级营收/行业有知名度；4-5分：中小企业/初创有融资；1-3分：小微企业/信息极少\n\n' +
        'JSON结构如下（字段名必须完全一致）：\n' +
        '{\n' +
        '  "companyName": "目标公司工商全称",\n' +
        '  "establishedDate": "成立时间，格式YYYY-MM或YYYY年",\n' +
        '  "legalRepresentative": "法定代表人姓名，搜不到填空字符串",\n' +
        '  "registeredCapital": "注册资本",\n' +
        '  "address": "注册地址",\n' +
        '  "province": "所在省份，如重庆市/四川省",\n' +
        '  "city": "所在城市，如重庆/成都",\n' +
        '  "isListed": "是否上市及股票代码，未上市填未上市",\n' +
        '  "companyStrengthScore": 公司实力评分1到10的整数,\n' +
        '  "companyScaleTag": "规模标签，如：独角兽/亿级营收/千万级营收/中小企业/初创企业",\n' +
        '  "employeeCount": "员工规模描述",\n' +
        '  "employeeNumber": 员工数量估计数值或null,\n' +
        '  "employeeRange": "员工数范围描述，如50-200人或500-1000人",\n' +
        '  "industry": "所属行业（如：互联网/AIGC/短视频/金融科技/制造业等）",\n' +
        '  "bizType": "业务模式：ToB/ToC/ToG/ToB+ToC，多个用加号连接",\n' +
        '  "revenue": "年营收描述",\n' +
        '  "revenueNumber": 营收数值亿元或null,\n' +
        '  "revenueYear": "营收数据对应年份，如2025或2026",\n' +
        '  "website": "公司官网URL",\n' +
        '  "businessModel": "核心商业模式一句话概述",\n' +
        '  "mainProducts": "主营产品或服务",\n' +
        '  "biddingInfo": "招投标信息摘要，无则填暂无公开招投标信息",\n' +
        '  "shareholders": "主要股东及持股比例",\n' +
        '  "aiActivityLevel": "AI战略活跃度：高/中/低",\n' +
        '  "aiSignals": "AI战略信号描述，如：已招聘AI工程师50人、自研大模型发布、与某AI厂商合作等，搜不到填无明显AI信号",\n' +
        '  "competitorCloudUsage": "已使用的竞对云/AI产品，如：腾讯云-企业微信、华为云-OBS、AWS-EC2等，未发现则填无竞对使用记录",\n' +
        '  "techStack": "已知云/AI技术栈，如：自建机房+阿里云CDN、微软Azure+OpenAI API等，搜不到填未知",\n' +
        '  "recentNews": "2025/2026最新动态摘要，包含重要合作、产品发布、融资等，搜不到填无近期重要动态",\n' +
        '  "parentCompany": "母公司或控股集团全称，如无则填无",\n' +
        '  "parentCompanyBusiness": "母公司/集团的主营业务和规模概述，如无则填无",\n' +
        '  "parentCompanyRevenue": "母公司/集团年营收描述，搜不到填无",\n' +
        '  "parentCompanyRevenueNumber": 母公司集团营收数值亿元或null,\n' +
        '  "parentEmployeeNumber": 母公司集团员工总数估计数值或null,\n' +
        '  "groupCloudAiUsage": "集团或母公司已知的云计算/AI使用情况，如AIGC使用量、云服务商合作等，搜不到填无",\n' +
        '  "cloudAiOpportunities": "结合目标公司+集团，云与AI大模型合作机会2到3个要点，具体到场景",\n' +
        '  "cloudAiAnnualBudget": "云计算+AI大模型年度消费预估，含估算依据",\n' +
        '  "growthTrend": "综合公司和集团的增长趋势：高增长/稳健/平稳/下滑",\n' +
        '  "effectiveEmployeeNumber": 用于评分的有效员工数（优先集团数，无则本公司数）数值或null,\n' +
        '  "effectiveRevenueNumber": 用于评分的有效营收亿元（优先集团数，无则本公司数）数值或null\n' +
        '}\n\n' +
        '再次强调：只输出JSON对象，不要输出任何其他内容。';
      userPrompt = '请执行全部10轮搜索流程，联网搜索以下公司及其集团的完整情报，严格按JSON格式输出：\n' +
        '公司名称：' + (input?.customerName || '') +
        (input?.productName ? '\n产品/APP名称：' + input.productName : '') +
        (input?.website ? '\n公司官网：' + input.website : '') +
        '\n\n【严重警告 — 防混淆，最高优先级】上方"公司名称"必须原样用于所有搜索，绝对禁止替换为名称相似的知名大公司。例如：搜索"成都字节流"时，若结果显示的是"字节跳动"，必须拒绝使用该结果并重新换关键词搜索；搜索"重庆七豆豆"时不能混入其他豆类公司数据。companyName字段必须填写与用户输入匹配的工商全称，搜不到就填用户输入的原始名称，绝不能填另一家公司的名称。\n\n【提示】搜索时先查股权关系，判断是否有母公司/集团，有则继续搜集团规模和云AI情况。特别关注：竞对云/AI产品使用、AI战略信号、近期动态。\n\n请直接输出JSON对象，不要包含任何其他文字。';
    }

  } else {
    return resp(400, { error: 'INVALID_TYPE: 未知的请求类型 ' + type });
  }

  try {
    console.log('Calling DashScope API...');

    // 构建 API 请求体
    const apiBodyPayload = {
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.5
    };

    // enable_search: 所有模型均通过百炼 Chat Completions API 支持联网搜索
    // forced_search=true：仅 Qwen 系列支持，强制模型在回答前执行联网搜索
    // MiniMax/DeepSeek/DeepSeek-Flash 仅使用 enable_search，不设置 forced_search
    apiBodyPayload.enable_search = true;
    if (model === 'qwen37max' || model === 'qwen3max' || model === 'qwenplus') {
      apiBodyPayload.search_options = {
        forced_search: true,
        search_strategy: 'standard'
      };
    }

    const apiResponse = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DASHSCOPE_KEY
      },
      body: JSON.stringify(apiBodyPayload)
    });

    console.log('API status:', apiResponse.status);

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error('API error:', errText);
      return resp(apiResponse.status, {
        error: 'DashScope API error: ' + apiResponse.status,
        detail: errText.substring(0, 300)
      });
    }

    const data = await apiResponse.json();
    const message = data.choices?.[0]?.message;
    // 只取 content，不取 reasoning_content（那是思考过程，不应展示）
    let content = message
      ? (message.content || '未能生成内容，请重试')
      : '未能生成内容，请重试';
    content = cleanToolCallTags(content);
    content = stripThinkingPreamble(content);

    console.log('Success, content length:', content.length);

    return resp(200, {
      content,
      model: cfg.displayName,
      usage: data.usage
    });

  } catch (err) {
    console.error('Error:', err.name, err.message);
    return resp(500, { error: err.name + ': ' + err.message });
  }
};
