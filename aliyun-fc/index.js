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
  // think 思考标签（qwen3.8-max / GLM 等思考模型可能输出）
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
  // 2026年10月依据阿里云百炼官方文档核实：
  //   qwen3.8-max          2026-08-02上架旗舰，支持联网搜索/深度思考/视觉理解
  //   qwen3.8-flash        2026-08-26上架，1M上下文，支持联网搜索，速度优先
  //   deepseek-v4-pro-0813 2026-08-14上架，DeepSeek现役旗舰，官方确认支持 enable_search
  //   ZHIPU/GLM-5.3        智谱2026-08-14发布、2026-08-28上架百炼，1M上下文/128K输出；
  //                        【Chat Completions 不支持 enable_search】，不用于批量评估
  const MODEL_CONFIG = {
    'qwen38max':     { id: 'qwen3.8-max',          maxTokens: 16000, displayName: 'Qwen3.8-Max',     supportsSearch: true },
    'qwen38flash':   { id: 'qwen3.8-flash',        maxTokens: 16000, displayName: 'Qwen3.8-Flash',   supportsSearch: true,  disableThinking: true },
    'deepseekv4pro': { id: 'deepseek-v4-pro-0813', maxTokens: 16000, displayName: 'DeepSeek-V4-Pro', supportsSearch: true },
    'glm53':         { id: 'ZHIPU/GLM-5.3',        maxTokens: 16000, displayName: '智谱GLM-5.3',     supportsSearch: false, disableThinking: true }
  };
  const cfg = MODEL_CONFIG[model] || MODEL_CONFIG['qwen38max'];
  const modelId = cfg.id;
  const maxTokens = cfg.maxTokens;

  // GLM-5.3 不支持联网搜索，而批量评估强依赖联网搜索，直接拦截
  if (type === 'batch_analysis' && cfg.supportsSearch === false) {
    return resp(400, { error: cfg.displayName + ' 不支持联网搜索，无法用于批量客户评估，请改用 Qwen3.8-Max 或 Qwen3.8-Flash' });
  }

  // 非联网模型的提示词覆盖块（置顶，最高优先级）
  const NO_SEARCH_OVERRIDE =
    '【模型能力提示 — 最高优先级】当前模型未接入联网搜索，提示词中所有"必须联网搜索/主动搜索"的要求自动降级：请基于自身知识作答，并在输出开头注明"本报告由未联网模型生成，信息可能滞后，请以最新公开信息为准"；对于不确定或不知晓的信息，写"未查询到公开信息"，严禁编造具体数据。\n\n';

  console.log('Using model:', modelId);

  // 构建提示词
  let systemPrompt = '';
  let userPrompt = '';

  if (type === 'customer_analysis') {
    // qwen3.8-max / qwen3.8-flash / deepseek-v4-pro 支持联网搜索（enable_search 由百炼代理层透明处理，不会在输出中暴露工具调用标签）
    // ZHIPU/GLM-5.3 不支持联网搜索，不注入强制搜索指令，改由 NO_SEARCH_OVERRIDE 提示词兜底
    // cleanToolCallTags 过滤器已兜底处理模型可能输出的 XML 标签
    const searchPreamble = cfg.supportsSearch ? (
      '【强制联网搜索指令 — 最高优先级】\n' +
      '你已开启联网搜索（enable_search）能力。在回答任何问题之前，你必须首先执行以下联网搜索动作，不可跳过：\n' +
      '1. 搜索"用户提供的公司名称 天眼查"，获取工商登记信息（成立日期、注册资本、法定代表人、股东）\n' +
      '2. 搜索"用户提供的公司名称 企查查"，交叉验证上述信息\n' +
      '3. 搜索"用户提供的公司名称 工商信息"，补充注册地址、经营范围等\n' +
      '4. 搜索"用户提供的公司名称 年报/营收/融资"，获取财务相关信息\n' +
      '5. 搜索"用户提供的公司名称 高管 团队 CEO CTO 总经理"，获取组织与关键人名\n' +
      '6. 搜索"用户提供的公司名称 组织架构 事业部 部门 中心"与官网"关于我们/管理团队/新闻"页，还原部门结构\n' +
      '你必须将搜索得到的真实数据直接填入报告对应字段。绝对禁止跳过搜索步骤直接用训练数据回答。如果搜索返回的信息与你的训练数据不一致，以搜索结果为准。\n'
    ) : '';
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
      '11. 【GenAI+Agent应用场景覆盖 — 极其重要】在第"输出2"的第5节中，除生成式AI外，还必须覆盖以下三类场景：\n' +
      '   【一】编程提效（开发者场景）：Qoder 与 Qoder CN — 阿里云官方AI编程助手（原"智能编码助手通义灵码"已于2026-05-20更名为Qoder CN并纳入Qoder产品体系），覆盖代码补全、跨文件工程理解、单元测试生成、代码评审、Agent化开发，可集成 VSCode / JetBrains。\n' +
      '   【二】办公提效（全员场景）：千问办公（QwenWork）— 阿里巴巴一站式AI生产力平台，2026-08-03起公测，整合QoderWork、悟空、MuleRun三款智能体产品，用一句话即可完成数据分析、PPT生成、网页搭建、视频剪辑、浏览器自动化与定时任务，深度绑定企业IM生态；辅以通义听悟（会议转录与纪要）、通义万相（图像视频生成），以及基于百炼平台定制的行业智能体。\n' +
      '   【三】生成式AI业务创新（行业核心场景）：结合客户行业的核心业务流程，基于百炼平台（Model Studio）、人工智能平台PAI、千问API（qwen3.8-max / qwen3.8-flash）、伶鹊VoicePica（企业级对话智能体，原通义晓蜜）等构建行业应用。\n' +
      '   - GenAI/Agent场景必须基于该客户的真实业务痛点，联网搜索最新信息生成，不可使用通用模板。\n' +
      '   - 每个场景须说明具体产品/API及可量化的业务收益。\n' +
      '   - 【禁止推荐以下内容作为阿里云产品】：Cursor、GitHub Copilot、ChatGPT等非阿里系第三方AI工具。\n' +
      '   - 【行业趋势时效性】所有行业趋势数据必须优先引用2025年至2026年的最新数据，不得使用2024年及以前的过时统计。\n\n' +
      '12. 【阿里云产品名时效性硬约束 — 违反即报告作废】推荐方案必须使用阿里云/阿里巴巴集团2026年现役产品名，输出前逐个自检产品名：\n' +
      '   允许使用的现役产品（含定位）：\n' +
      '   - 千问办公（QwenWork）：一站式AI生产力平台、AI Agent办公，全员办公提效首选\n' +
      '   - Qoder、Qoder CN：AI编程助手（Qoder CN 为原通义灵码）\n' +
      '   - 大模型服务平台百炼（Model Studio）、千问API（qwen3.8-max / qwen3.8-flash）\n' +
      '   - 人工智能平台PAI（DSW/DLC/EAS，模型微调与推理部署）\n' +
      '   - 伶鹊（VoicePica）：企业级对话智能体平台，覆盖智能客服、营销外呼、对话分析\n' +
      '   - 通义听悟（会议转写纪要）、通义万相（图像视频生成）、智能语音交互、机器翻译、OCR、智能对话机器人\n' +
      '   - 通用云底座：函数计算FC、OSS、ECS、PolarDB、AnalyticDB、向量检索服务DashVector\n' +
      '   绝对禁止再出现的过时/已更名产品名：通义灵码、通义小蜜、通义晓蜜、云小蜜。凡出现上述旧名，必须替换为对应现役产品名（如通义灵码→Qoder CN，通义小蜜/通义晓蜜→伶鹊）。\n\n' +
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
      '## 组织架构与决策链分析\n' +
      '【必须联网搜索】搜索"公司全称 高管 团队 组织架构 事业部 中心 部门 总经理 CTO CIO 数字化负责人"以及官网"关于我们/管理团队/新闻中心"页面，还原客户真实的部门设置与关键人名。\n' +
      '### 组织架构图\n' +
      '必须用三个反引号包裹的 mermaid 代码块（首行 ```mermaid，末行 ```）绘制组织架构框线图，前端会把它渲染成图。严格遵守以下语法，违反将导致渲染失败：\n' +
      'a) 代码块第一行固定为 graph TD；禁止 subgraph、style、classDef、linkStyle、direction 等一切额外指令。\n' +
      'b) 节点ID只用小写英文字母与数字（如 ceo、cto、rd1），禁止中文ID。\n' +
      'c) 节点标签统一写成 节点ID["部门或职务｜姓名"]，标签内只允许中文、字母、数字和全角竖线｜；严禁出现英文双引号、单引号、圆括号、方括号、大括号、半角冒号、半角竖线、# 和分号。\n' +
      'd) 每条父子关系单独一行，格式 父节点ID --> 子节点ID；层级不超过4层，节点总数不超过25个，单个标签不超过16个字。\n' +
      'e) 姓名确实查不到时标签写"未公开"，不得编造人名。\n' +
      '严格按此示例格式输出（内容替换为搜索所得的真实信息）：\n' +
      'graph TD\n' +
      'ceo["董事长兼总经理｜张三"]\n' +
      'cto["技术中心｜李四"]\n' +
      'rd["研发部｜未公开"]\n' +
      'ceo --> cto\n' +
      'cto --> rd\n' +
      '### 高管与部门清单\n' +
      '紧接架构图后，用Markdown表格逐条列出，列包含：层级、部门/业务线、职务、姓名、公开信息来源、置信度（公开信息/行业推断）。查不到的姓名写"未查询到公开信息"，禁止编造人名。\n' +
      '### 决策链与AI预算路径\n' +
      '用列表分析：谁掌握数字化/AI预算、谁做技术评估、谁是最终使用方、谁可能一票否决，并给出本单"优先触达的3个角色"及触达理由。\n' +
      '### 组织信息缺口\n' +
      '若公开渠道查不到完整架构，必须先基于行业同规模公司惯例给出一版推断架构（表格置信度列标注"行业推断"），并列出建议通过何种渠道核实（如天眼查高管列表、官网新闻、招投标联系人）。\n\n' +
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
      '### 5.1 编程提效（开发者场景）— Qoder / Qoder CN\n' +
      '### 5.2 办公提效（全员场景）— 千问办公（QwenWork）为主，辅以通义听悟\n' +
      '### 5.3 生成式AI业务创新（行业核心场景）— 百炼 / PAI / 千问API / 伶鹊\n' +
      '【重要】所有场景须：(1)基于客户真实业务痛点而非通用模板；(2)使用第12条列出的阿里云或阿里巴巴集团2026年现役产品名；(3)包含可量化的业务收益；(4)不推荐Cursor、GitHub Copilot等非阿里系第三方AI工具。\n' +
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
      '【第三步：搜索组织架构 — 同样必须执行】\n' +
      '5. "[确认的工商全称] 高管 团队 总经理 CTO CIO"\n' +
      '6. "[确认的工商全称] 组织架构 事业部 部门 中心"\n' +
      '7. "[确认的工商全称] 数字化 AI 负责人 招标 联系人"\n' +
      '把搜到的部门名称与人名用于"组织架构与决策链分析"章节，并按要求的 mermaid 语法绘制组织架构图；查不到的姓名一律写"未查询到公开信息"，严禁编造人名。\n\n' +
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
    systemPrompt = '你是阿里云西部大区资深AI销售教练，长期陪跑渠道伙伴打单，擅长把一次拜访从"关系维护"升级为"可验证的销售推进"。\n\n' +
      '【会前调研规则】\n' +
      '生成计划前，必须先基于用户提供的客户名称联网搜索真实信息，覆盖：主营业务与行业地位、近期新闻与融资/上市状态、业务规模、高管与组织架构（总经理/CTO/CIO/数字化负责人及部门设置）、现有云厂商与技术栈、公开招投标记录。把搜索到的事实融入各章节，特别是"决策地图""信息分享"和"会议议程"，确保价值点和议题基于客户实际业务场景，而非通用模板。第一次搜不到就换关键词再搜（加"天眼查""企查查""官网""招聘"等后缀）。\n\n' +
      '【场景差异化要求】\n' +
      '首次拜访：以认知塑造与需求探索为主，禁止直接索要商务承诺，重点把行业趋势与客户业务痛点对上，并建立后续触达的正当理由。\n' +
      '商机推进：聚焦决策标准与决策流程，必须设计可验证的下一步动作（POC、技术评估会、样板点参观、商务比价），并识别纸面竞争对手。\n' +
      '高层拜访：站在战略与ROI视角，围绕业务增量、AI投入产出与竞对格局展开，避免技术细节，落点是高层互访或战略共创。\n\n' +
      '【格式要求】请严格使用Markdown格式输出，确保层级分明、重点突出：\n' +
      '- 使用 ## 作为每个章节的标题（如 ## 一、拜访目标与本阶段核心命题）\n' +
      '- 使用 ### 作为章节内的子标题\n' +
      '- 使用 **加粗** 突出关键信息、承诺内容、时间节点\n' +
      '- 使用 - 作为无序列表的每一项\n' +
      '- 使用 1. 2. 作为有序编号列表\n' +
      '- 决策地图、信息获取、信息分享、议程、自检、缺失信息等多维度内容一律使用Markdown表格（| 列1 | 列2 | 列3 |）\n' +
      '- 会议议程必须使用Markdown表格展示\n' +
      '- 中文输出，清晰小标题+编号，便于直接复制到拜访计划文档；全文控制在2000字以内，每章只写对该场景真正有用的内容\n\n' +
      '【重要规则】\n' +
      '1. 所有内容必须紧密围绕用户提供的具体客户信息，不要给出泛化的通用建议。\n' +
      '2. 内容必须结合"项目阶段+拜访对象角色+触发事件"，禁止通用套话。\n' +
      '3. 行动建议必须具体到可执行的步骤，含负责人与时间点。\n' +
      '4. 【客户信息准确性】当拜访计划中引用客户公司的具体事实（成立时间、业务范围、营收规模、市场地位、组织架构、人名、竞争格局等），必须使用本次联网搜索获取的信息，不要依赖训练数据编造。\n' +
      '5. 【禁止编造数据与人名】不要虚构具体的财务数字、员工人数、市场份额百分比、竞品公司名称或任何姓名与职务。查不到就在表格中写"未查询到公开信息"，并纳入第八章"会前补齐建议"。\n' +
      '6. 【行业趋势须有依据】提及的行业趋势或市场动态应基于2025年至2026年真实、可验证的事件或报告，并注明来源，不要使用泛泛的通用趋势描述。\n' +
      '7. 【不确定信息处理】遇到不确定的客户信息时，不要简单标注"待核实"。你必须先尝试通过搜索找到答案。只有在穷尽搜索仍无法确认时，才将该信息列入第八章"缺失信息与会前补齐建议"，并给出具体的验证方法（如"建议通过天眼查搜索XX关键词核实"）。\n' +
      '8. 【阿里云产品时效性】方案与价值点必须使用阿里云/阿里巴巴集团2026年现役产品名：千问办公（QwenWork，一站式AI生产力平台）、Qoder 与 Qoder CN（AI编程助手，Qoder CN 即原通义灵码）、大模型服务平台百炼（Model Studio）、千问API（qwen3.8-max / qwen3.8-flash）、人工智能平台PAI、伶鹊VoicePica（企业级对话智能体，原通义晓蜜）、通义听悟、通义万相、智能语音交互、函数计算FC。严禁再使用"通义灵码""通义小蜜""通义晓蜜""云小蜜"等已更名或过时名称；不得推荐Cursor、GitHub Copilot、ChatGPT等非阿里系工具。\n' +
      '9. 【输出格式禁令】绝对禁止在输出中包含任何XML标签或工具调用代码。所有信息直接融入正文。\n\n' +
      '请生成一份专业的拜访计划，严格按以下9个章节结构输出：\n' +
      '## 一、拜访目标与本阶段核心命题\n先用一句话写出本阶段核心命题（这个阶段必须证明什么才能往前推进），再从五类目标中选择1个主目标+1个辅目标（认知塑造与教育、商机确认、决策推进、价值交付与风险管理、关系与影响力拓展），输出一句SMART化的目标陈述，含可验证的结果。\n' +
      '## 二、决策地图与角色定位\n说明拜访对象在客户组织中的位置、汇报关系与影响圈；用Markdown表格列出本场需覆盖的角色，列包含：角色、部门与职务、姓名、决策定位（经济买家/技术评估者/最终使用方/内部推动者/可能否决者）、他的KPI与关注点、忌讳与风险。人名一律以搜索结果为准，查不到写"未查询到公开信息"。\n' +
      '## 三、客户行动承诺（Customer Commitment）\n这是客户（被拜访方）的行动承诺，不是阿里云的承诺。用表格设计最高承诺（理想）与最低承诺（保底），列包含：承诺内容、客户侧负责人、截止时间、交付物、如何验证已兑现。承诺必须与项目阶段匹配。\n' +
      '## 四、信息获取清单（What we need to learn）\n用Markdown表格输出4-6条，列包含：序号、信息点、MEDDPICC维度（可量化指标/经济买家/决策标准/决策流程/纸面竞争/痛点/内部推动者/竞对）、优先级（Must/Should/Could）、向谁确认、为什么重要。至少覆盖公司相关、项目相关、用户观点三个方面。\n' +
      '## 五、信息分享与价值主张（What we deliver）\n先输出一句话核心价值主张（站在客户收益视角，不堆产品术语）。再用表格输出3-5个价值点，列包含：序号、价值点、证据形态（案例/数据/演示/白皮书）、对应解决的问题、所用阿里云2026现役产品。表格后单独输出：1条紧迫感表述（必须基于2025-2026年可验证事实并注明来源）、1条相对腾讯云/华为云/火山引擎的差异化表述。\n' +
      '## 六、会议议程与提问话术（Meeting Agenda）\n先列出参会人角色，然后用Markdown表格输出分段议程，列包含：时段、时长、议题、我方动作、对方需给的信息/决策、预期产出；最后一段必须是确认下一步计划与行动承诺。表格后再给出4条现场话术：2条开放式或SPIN式提问、1条应对"我们已经在用别家"的重构话术、1条收尾索取承诺的话术。\n' +
      '## 七、一致性自检\n用Markdown表格做清单校验，列包含：检查项、状态、说明。至少校验：目标与承诺是否闭环、议程能否支撑承诺获取、信息分享是否对准该角色的KPI、是否存在阶段错配（如首次拜访就索要合同承诺）。\n' +
      '## 八、缺失信息与会前补齐建议（Top 5）\n用Markdown表格列出5条缺失信息，列包含：序号、缺失信息、影响风险、会前补齐动作（写明具体搜索关键词或核实渠道）。\n' +
      '## 九、会后48小时跟进\n用有序列表给出会后24小时内与48小时内的具体动作（纪要与承诺回执、材料投递、下一会议邀约、内部商机系统更新），每条含负责人与时间点。';
    userPrompt = '拜访场景：' + sceneName + '\n拜访对象角色：' + (input?.role || '') + '\n' + (input?.details || '') +
      '\n\n【执行顺序】1) 先联网搜索客户业务/组织架构/在用云现状；2) 再按9个章节输出拜访计划；3) 所有事实与人名必须来自搜索结果，查不到写"未查询到公开信息"。' +
      '\n请严格按照Markdown格式输出，包含##章节标题、###子标题、**加粗**、列表和表格。';

  } else if (type === 'batch_analysis') {
    // 批量评估强依赖联网搜索与严格JSON输出，仅 Qwen 系列适用（GLM-5.3 不支持联网搜索，已在主入口拦截）。
    // 历史 Prompt 版本见 docs/batch-analysis-prompt.md。
    // === Qwen 完整版：6轮深度搜索 + 26个JSON字段 + 来源溯源 ===
      systemPrompt =
        '你是企业情报分析师。通过联网搜索调研目标公司，输出严格JSON。\n\n' +
        '【铁律 — 违反任何一条即报告作废】\n' +
        '1. 每个字段必须来自本次搜索结果。搜索结果中没有的信息，该字段必须填""（文本）或null（数值）。绝对禁止用训练数据填充。\n' +
        '2. 法定代表人、成立时间、注册资本、注册地址：这四个字段必须逐字匹配搜索结果原文。搜索结果中没出现就填""。\n' +
        '3. 搜索时必须使用用户输入的完整公司名原样搜索，禁止替换为同名大公司。\n' +
        '4. 每轮搜索后验证：搜索结果中的公司名是否与用户输入一致？不一致则丢弃该结果，换关键词重搜。\n' +
        '5. 输出合法JSON，不含Markdown、代码块符号、解释文字。\n\n' +
        '【搜索流程 — 6轮，每轮必须实际执行】\n' +
        '第1轮 工商基础：搜"{公司名} 天眼查"和"{公司名} 企查查"→全称、成立时间、注册资本、法定代表人、地址、省市\n' +
        '第2轮 股权集团：搜"{公司名} 股东 母公司 集团"→母公司、股东、集团规模\n' +
        '第3轮 营收员工：搜"{公司名} 营收 员工 规模 上市"→营收、员工数、上市状态\n' +
        '第4轮 AI信号：搜"{公司名} AI 大模型 招聘 技术"→AI活跃度、技术栈\n' +
        '第5轮 竞对动态：搜"{公司名} 腾讯云 华为云 AWS"和"{公司名} 2025 2026 新闻"→竞对使用、近期动态\n' +
        '第6轮 集团补充（如有母公司）：搜"{集团名} 营收 员工 云计算"→集团规模、云AI使用\n\n' +
        '【评分标准】companyStrengthScore 1-10分：10=上市/独角兽/龙头，8-9=准上市/亿级，6-7=千万级，4-5=中小/有融资，1-3=小微/信息少\n' +
        '【消费预估】cloudAiAnnualBudget：参考员工规模×行业基准（互联网3-8%，传统1-3%），无法估算填"数据不足"\n\n' +
        'JSON结构（字段名必须完全一致）：\n' +
        '{\n' +
        '  "companyName": "工商全称，搜不到填原始名称",\n' +
        '  "establishedDate": "YYYY-MM或YYYY年，搜不到填空字符串",\n' +
        '  "legalRepresentative": "法定代表人，搜不到填空字符串",\n' +
        '  "registeredCapital": "注册资本，搜不到填空字符串",\n' +
        '  "address": "注册地址，搜不到填空字符串",\n' +
        '  "province": "省份",\n' +
        '  "city": "城市",\n' +
        '  "isListed": "上市状态，未上市填未上市",\n' +
        '  "companyStrengthScore": 1到10整数,\n' +
        '  "companyScaleTag": "独角兽/亿级营收/千万级营收/中小企业/初创企业",\n' +
        '  "employeeCount": "员工规模描述",\n' +
        '  "employeeNumber": 员工数或null,\n' +
        '  "employeeRange": "如50-200人",\n' +
        '  "industry": "所属行业",\n' +
        '  "bizType": "ToB/ToC/ToG/ToB+ToC",\n' +
        '  "revenue": "年营收描述",\n' +
        '  "revenueNumber": 营收亿元或null,\n' +
        '  "revenueYear": "如2025或2026",\n' +
        '  "shareholders": "主要股东，搜不到填空字符串",\n' +
        '  "aiActivityLevel": "高/中/低",\n' +
        '  "aiSignals": "AI信号，搜不到填无明显AI信号",\n' +
        '  "competitorCloudUsage": "竞对云/AI，搜不到填无竞对使用记录",\n' +
        '  "techStack": "云/AI技术栈，搜不到填未知",\n' +
        '  "recentNews": "近期动态，搜不到填无近期重要动态",\n' +
        '  "parentCompany": "母公司全称，无则填无",\n' +
        '  "parentCompanyBusiness": "母公司业务概述，无则填无",\n' +
        '  "parentCompanyRevenue": "母公司营收，搜不到填无",\n' +
        '  "parentCompanyRevenueNumber": 母公司营收亿元或null,\n' +
        '  "parentEmployeeNumber": 母公司员工数或null,\n' +
        '  "groupCloudAiUsage": "集团云AI使用，搜不到填无",\n' +
        '  "cloudAiOpportunities": "云与AI合作机会2-3个要点",\n' +
        '  "cloudAiAnnualBudget": "云+AI年消费预估含依据",\n' +
        '  "growthTrend": "高增长/稳健/平稳/下滑",\n' +
        '  "effectiveEmployeeNumber": 有效员工数或null,\n' +
        '  "effectiveRevenueNumber": 有效营收亿元或null,\n' +
        '  "_searchFound": true或false表示是否搜到该公司的工商信息,\n' +
        '  "_emptyFields": 因搜索无结果而留空的字段名列表如["legalRepresentative","registeredCapital"]\n' +
        '}\n只输出JSON。';
      userPrompt = '联网搜索以下公司情报并输出JSON：\n' +
        '公司名称：' + (input?.customerName || '') +
        (input?.productName ? '\n产品：' + input.productName : '') +
        (input?.website ? '\n官网：' + input.website : '') +
        '\n\n【最高优先级】1.公司名必须原样搜索，禁止替换为同名大公司。2.搜不到的字段必须填空字符串或null，禁止编造。3._emptyFields必须列出所有因搜不到而留空的字段名。\n\n直接输出JSON。';

  } else {
    return resp(400, { error: 'INVALID_TYPE: 未知的请求类型 ' + type });
  }

  // 不支持联网搜索的模型（GLM-5.3）：置顶注入能力提示，降级提示词中的"必须联网搜索"要求
  if (cfg.supportsSearch === false) {
    systemPrompt = NO_SEARCH_OVERRIDE + systemPrompt;
  }

  try {
    console.log('Calling DashScope API...');

    // 构建 API 请求体
    const isBatch = (type === 'batch_analysis');
    const apiBodyPayload = {
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: isBatch ? 32000 : maxTokens,
      temperature: isBatch ? 0.1 : 0.5
    };

    // enable_search: 仅对支持联网搜索的模型传入（qwen3.8-max / qwen3.8-flash / deepseek-v4-pro-0813）
    // ZHIPU/GLM-5.3 在 Chat Completions 协议下不支持 enable_search，传入会导致 API 报错，故不传
    if (cfg.supportsSearch) {
      apiBodyPayload.enable_search = true;
      apiBodyPayload.search_options = {
        forced_search: true,
        // batch_analysis 使用 pro 策略以获得更深入的搜索结果
        search_strategy: isBatch ? 'pro' : 'standard'
      };
    }
    // 默认开启思考模式的模型（qwen3.8-flash / GLM-5.3）：本场景只需最终正文，
    // 关闭思考以控制首字时延、避免非流式调用报错并节省输出费用
    if (cfg.disableThinking) {
      apiBodyPayload.enable_thinking = false;
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
