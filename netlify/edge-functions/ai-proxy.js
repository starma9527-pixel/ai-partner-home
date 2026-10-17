/**
 * Netlify Edge Function: AI Proxy for DashScope
 * 支持流式输出 (SSE) + 非流式输出
 * 支持 qwen3.8-max / qwen3.8-flash / deepseek-v4-pro / ZHIPU-GLM-5.3 多模型
 *
 * 模型选型说明（2026年10月，依据阿里云百炼官方文档核实）：
 *   qwen38max     → qwen3.8-max              2026-08-02上架旗舰，支持联网搜索/深度思考/视觉理解，
 *                                            单客户分析与批量分析首选
 *   qwen38flash   → qwen3.8-flash            2026-08-26上架，1M上下文/128K输出，支持联网搜索，
 *                                            响应速度快，拜访计划与批量分析的高性价比选择
 *   deepseekv4pro → deepseek-v4-pro-0813     2026-08-14上架，1.6T MoE旗舰深度思考模型，
 *                                            官方确认支持 enable_search，用于甄选客户深度推理
 *   glm53         → ZHIPU/GLM-5.3            智谱2026-08-14发布、2026-08-28上架百炼，
 *                                            1M上下文/128K输出，长文推理强；
 *                                            【Chat Completions 不支持 enable_search】，
 *                                            故不用于批量评估场景；调用时关闭思考模式以控制时延
 *
 * 联网搜索说明：
 *   三款支持搜索的模型通过 Chat Completions API 的 enable_search 参数联网搜索，
 *   搜索由百炼代理层透明处理，不会在 delta.content 中暴露工具调用标签。
 *   GLM-5.3 不支持 enable_search，调用时不得传入该参数，否则 API 报错。
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

const MODEL_CONFIG = {
  'qwen38max':     { id: 'qwen3.8-max',          maxTokens: 16000, displayName: 'Qwen3.8-Max',     supportsSearch: true },
  'qwen38flash':   { id: 'qwen3.8-flash',        maxTokens: 16000, displayName: 'Qwen3.8-Flash',   supportsSearch: true,  disableThinking: true },
  'deepseekv4pro': { id: 'deepseek-v4-pro-0813', maxTokens: 16000, displayName: 'DeepSeek-V4-Pro', supportsSearch: true },
  'glm53':         { id: 'ZHIPU/GLM-5.3',        maxTokens: 16000, displayName: '智谱GLM-5.3',     supportsSearch: false, disableThinking: true }
};

// 非联网模型的提示词覆盖块（置顶，最高优先级）
const NO_SEARCH_OVERRIDE =
  '【模型能力提示 — 最高优先级】当前模型未接入联网搜索，提示词中所有"必须联网搜索/主动搜索"的要求自动降级：请基于自身知识作答，并在输出开头注明"本报告由未联网模型生成，信息可能滞后，请以最新公开信息为准"；对于不确定或不知晓的信息，写"未查询到公开信息"，严禁编造具体数据。\n\n';

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// ===== 构建提示词 =====
function buildPrompts(type, input, modelKey) {
  let systemPrompt = 'PLACEHOLDER_SYSTEM';
  let userPrompt = 'PLACEHOLDER_USER';
  var cfg = MODEL_CONFIG[modelKey] || {};

  if (type === 'customer_analysis') {
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
      '   【一】编程提效（开发者场景）：Qoder / Qoder CN — 阿里云官方AI编程助手（原"智能编码助手通义灵码"已于2026-05-20更名为Qoder CN并纳入Qoder产品体系），覆盖代码补全、跨文件工程理解、单元测试生成、代码评审与Agent化开发。\n' +
      '   【二】办公提效（全员场景）：千问办公（QwenWork）— 阿里巴巴一站式AI生产力平台，2026-08-03起公测，整合QoderWork、悟空、MuleRun，用一句话即可完成数据分析、PPT生成、网页搭建、视频剪辑、浏览器自动化与定时任务；辅以通义听悟（会议转写与纪要）、通义万相（图像与视频生成）。\n' +
      '   【三】生成式AI业务创新（行业核心场景）：结合客户行业核心业务流程，基于百炼平台（Model Studio）、人工智能平台PAI、千问API（qwen3.8-max / qwen3.8-flash）、伶鹊VoicePica（对话智能体）等构建行业应用。\n' +
      '   - 禁止推荐Cursor、GitHub Copilot、ChatGPT等非阿里系第三方AI工具。\n' +
      '   - 所有行业趋势数据必须优先引用2025年至2026年的最新数据。\n\n' +
      '12. 【阿里云产品名时效性硬约束 — 违反即报告作废】推荐的解决方案必须是阿里云/阿里巴巴集团2026年现役产品，输出前逐个自检产品名：\n' +
      '   允许使用的现役产品（含定位）：\n' +
      '   - 千问办公（QwenWork）：一站式AI生产力平台、AI Agent办公，全员提效首选\n' +
      '   - Qoder、Qoder CN：AI编程助手（Qoder CN 为原通义灵码）\n' +
      '   - 大模型服务平台百炼（Model Studio）、千问API（qwen3.8-max / qwen3.8-flash）\n' +
      '   - 人工智能平台PAI（DSW/DLC/EAS，模型微调与推理部署）\n' +
      '   - 伶鹊（VoicePica）：企业级对话智能体平台，覆盖智能客服、营销外呼、对话分析\n' +
      '   - 通义听悟（会议转写纪要）、通义万相（图像视频生成）、智能语音交互、机器翻译、OCR、智能对话机器人\n' +
      '   - 通用云底座：函数计算FC、OSS、ECS、PolarDB、AnalyticDB、向量检索服务DashVector\n' +
      '   绝对禁止再出现的过时/已更名产品名：通义灵码、通义小蜜、通义晓蜜、云小蜜、DataWorks旧版机器人。凡出现上述旧名，必须替换为对应现役产品名。\n' +
      '   每个场景须写清「产品名 + 具体能力 + 接入方式（API/控制台/私有化）+ 可量化收益」，不得只列产品名。\n\n' +
      '请生成一份专业的客户云与AI合作战略分析报告，严格按以下结构输出：\n\n' +
      '# 输出1：客户营收基础信息\n' +
      '## 公司基本信息\n' +
      '【必须联网搜索】用Markdown表格展示：公司全称、成立时间、注册资本、法定代表人、注册地址、是否上市、员工规模、所属行业。注明数据来源。\n\n' +
      '## 近3年营收数据\n' +
      '用Markdown表格展示：年份、国内营收、海外营收、总营收、营收同比增速、净利润、利润同比增速。\n' +
      '## 业务收入结构分析\n用Markdown表格展示各业务板块收入占比。\n' +
      '## 招投标信息检索\n如有用表格展示，如无写"暂无公开招投标信息"。\n' +
      '## 股权信息检索\n【必须联网搜索】控股人背景、集团与分/子公司、股权分布。注明数据来源。\n\n' +
      '## 组织架构与决策链分析\n' +
      '【必须联网搜索】搜索"公司全称 高管 团队 组织架构 事业部 中心 部门 总经理 CTO CIO 数字化负责人"以及官网"关于我们/管理团队/新闻中心"页面，还原客户真实的部门设置与关键人名。\n' +
      '### 组织架构图\n' +
      '必须用三个反引号包裹的 mermaid 代码块（首行 ```mermaid，末行 ```）绘制组织架构框线图，前端会把它渲染成图。严格遵守以下语法，违反将导致渲染失败：\n' +
      'a) 代码块第一行固定为 graph TD；禁止 subgraph、style、classDef、linkStyle、direction 等一切额外指令。\n' +
      'b) 节点ID只用小写英文字母与数字（如 ceo、cto、rd1），禁止中文ID。\n' +
      'c) 节点标签统一写成 节点ID["部门或职务｜姓名"]，标签内只允许中文、字母、数字和全角竖线｜；严禁出现英文双引号、单引号、圆括号、方括号、大括号、半角冒号、半角竖线、半角括号、# 和分号。\n' +
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
      '紧接架构图后，用Markdown表格逐条列出，列包含：层级、部门/业务线、职务、姓名、公开信息来源、置信度（公开信息/行业推断）。查不到的姓名填"未查询到公开信息"，禁止编造。\n' +
      '### 决策链与AI预算路径\n' +
      '用列表分析：谁掌握数字化/AI预算、谁做技术评估、谁是最终使用方、谁可能一票否决，并给出本单"优先触达的3个角色"及触达理由。\n' +
      '### 组织信息缺口\n' +
      '若公开渠道查不到完整架构，必须先基于行业同规模公司惯例给出一版推断架构（表格置信度列标注"行业推断"），并列出建议通过何种渠道核实（如天眼查高管列表、官网新闻、招投标联系人）。\n\n' +
      '# 输出2：客户商业模式分析报告\n' +
      '## 1. 客户业务概况\n分别用 ### 列出：商业模式与盈利模式、核心客户群体、主要产品/服务、市场竞争格局、客户触达与服务模式、企业战略方向、2026年工作重点\n' +
      '## 2. 影响客户业务的关键行业趋势（未来6-24个月）\n用表格展示3-5个趋势，优先引用2025-2026年数据\n' +
      '## 3. 从客户视角分析的机会与挑战\n分"关键业务机会"和"主要挑战"各3-5项\n' +
      '## 4. 从"用户结果"反推关键举措、指标和 Use Cases\n用表格展示\n' +
      '## 5. 公共云与 GenAI+Agent 应用构想\n' +
      '### 5.1 编程提效（开发者场景）— Qoder / Qoder CN\n' +
      '### 5.2 办公提效（全员场景）— 千问办公（QwenWork）为主，辅以通义听悟\n' +
      '### 5.3 生成式AI业务创新（行业核心场景）— 百炼 / PAI / 千问API / 伶鹊\n' +
      '每个子标题下用Markdown表格输出2-3个场景，列包含：场景名称、业务痛点、阿里云解决方案（2026现役产品名）、预期价值与指标。\n' +
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
      '【第三步：搜索组织架构 — 同样必须执行】\n' +
      '5. "[确认的工商全称] 高管 团队 总经理 CTO CIO"\n' +
      '6. "[确认的工商全称] 组织架构 事业部 部门 中心"\n' +
      '7. "[确认的工商全称] 数字化 AI 负责人 招标 联系人"\n' +
      '把搜到的部门名称与人名用于"组织架构与决策链分析"章节，并绘制 mermaid 组织架构图。\n\n' +
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
      '- 决策地图、信息获取、信息分享、议程、自检、缺失信息等多维度内容一律使用Markdown表格\n' +
      '- 中文输出，清晰小标题+编号，便于直接复制到拜访计划文档；全文控制在2000字以内，每章只写对该场景真正有用的内容\n\n' +
      '【重要规则】\n' +
      '1. 所有内容必须紧密围绕用户提供的具体客户信息，不要给出泛化的通用建议。\n' +
      '2. 内容必须结合"项目阶段+拜访对象角色+触发事件"，禁止通用套话。\n' +
      '3. 行动建议必须具体到可执行的步骤，含负责人与时间点。\n' +
      '4. 【客户信息准确性】引用客户公司的具体事实（成立时间、业务范围、营收规模、市场地位、组织架构、人名、竞争格局等）必须来自本次联网搜索，不得依赖训练数据。\n' +
      '5. 【禁止编造数据与人名】不要虚构财务数字、员工人数、市场份额百分比、竞品名称或任何姓名与职务。查不到就在表格中写"未查询到公开信息"，并纳入第八章补齐建议。\n' +
      '6. 【行业趋势须有依据】提及的行业趋势或市场动态应基于2025年至2026年真实、可验证的事件或报告，并注明来源，不要使用泛泛的通用趋势描述。\n' +
      '7. 【不确定信息处理】不要简单标注"待核实"。必须先穷尽搜索；确实无法确认时列入第八章，并给出具体验证方法（如"建议通过天眼查搜索XX关键词核实"）。\n' +
      '8. 【阿里云产品时效性】方案与价值点必须使用阿里云/阿里巴巴集团2026年现役产品名：千问办公（QwenWork，一站式AI生产力平台）、Qoder 与 Qoder CN（AI编程助手，Qoder CN 即原通义灵码）、大模型服务平台百炼（Model Studio）、千问API（qwen3.8-max / qwen3.8-flash）、人工智能平台PAI、伶鹊VoicePica（企业级对话智能体，原通义晓蜜）、通义听悟、通义万相、智能语音交互、函数计算FC。严禁再使用"通义灵码""通义小蜜""通义晓蜜""云小蜜"等已更名或过时名称；不得推荐Cursor、GitHub Copilot、ChatGPT等非阿里系工具。\n' +
      '9. 【输出格式禁令】绝对禁止在输出中包含任何XML标签或工具调用代码。所有信息直接融入正文。\n\n' +
      '请生成一份专业的拜访计划，严格按以下9个章节结构输出：\n' +
      '## 一、拜访目标与本阶段核心命题\n先用一句话写出本阶段核心命题（这个阶段必须证明什么才能往前推进），再从五类目标中选择1个主目标+1个辅目标（认知塑造与教育、商机确认、决策推进、价值交付与风险管理、关系与影响力拓展），输出一句SMART化的目标陈述，含可验证的结果。\n' +
      '## 二、决策地图与角色定位\n说明拜访对象在客户组织中的位置、汇报关系与影响圈；用Markdown表格列出本场需覆盖的角色，列包含：角色、部门与职务、姓名、决策定位（经济买家/技术评估者/最终使用方/内部推动者/可能否决者）、他的KPI与关注点、忌讳与风险。人名一律以搜索结果为准。\n' +
      '## 三、客户行动承诺（Customer Commitment）\n这是客户（被拜访方）的行动承诺，不是阿里云的承诺。用表格设计最高承诺（理想）与最低承诺（保底），列包含：承诺内容、客户侧负责人、截止时间、交付物、如何验证已兑现。承诺必须与项目阶段匹配。\n' +
      '## 四、信息获取清单（What we need to learn）\n用Markdown表格输出4-6条，列包含：序号、信息点、MEDDPICC维度（可量化指标/经济买家/决策标准/决策流程/纸面竞争/痛点/内部推动者/竞对）、优先级（Must/Should/Could）、向谁确认、为什么重要。至少覆盖公司相关、项目相关、用户观点三个方面。\n' +
      '## 五、信息分享与价值主张（What we deliver）\n先输出一句话核心价值主张（站在客户收益视角，不堆产品术语）。再用表格输出3-5个价值点，列包含：序号、价值点、证据形态（案例/数据/演示/白皮书）、对应解决的问题、所用阿里云现役产品。表格后单独输出：1条紧迫感表述（必须基于2025-2026年可验证事实并注明来源）、1条相对腾讯云/华为云/火山引擎的差异化表述。\n' +
      '## 六、会议议程与提问话术（Meeting Agenda）\n先列出参会人角色，然后用Markdown表格输出分段议程，列包含：时段、时长、议题、我方动作、对方需给的信息或决策、预期产出；最后一段必须是确认下一步与行动承诺。表格后再给出4条现场话术：2条开放式或SPIN式提问、1条应对"我们已经在用别家"的话术、1条收尾索取承诺的话术。\n' +
      '## 七、一致性自检\n用Markdown表格做清单校验，列包含：检查项、状态、说明。至少校验：目标与承诺是否闭环、议程能否支撑承诺获取、信息分享是否对准该角色的KPI、是否存在阶段错配（如首次拜访就索要合同承诺）。\n' +
      '## 八、缺失信息与会前补齐建议（Top 5）\n用Markdown表格列出5条缺失信息，列包含：序号、缺失信息、影响风险、会前补齐动作（写明具体搜索关键词或核实渠道）。\n' +
      '## 九、会后48小时跟进\n用有序列表给出会后24小时内与48小时内的具体动作（纪要与承诺回执、材料投递、下一会议邀约、内部商机系统更新），每条含负责人与时间点。';
    userPrompt = '拜访场景：' + sceneName + '\n拜访对象角色：' + (input.role || '') + '\n' + (input.details || '') +
      '\n\n【执行顺序】1) 先联网搜索客户业务/组织/在用云现状；2) 再按9个章节输出拜访计划；3) 所有事实与人名必须来自搜索结果，查不到写"未查询到公开信息"。' +
      '\n请严格按照Markdown格式输出，包含##章节标题、###子标题、**加粗**、列表和表格。';

  } else if (type === 'batch_analysis') {
    // 批量评估强依赖联网搜索与严格JSON输出，仅 Qwen 系列适用（GLM-5.3 不支持联网搜索，已在主入口拦截）。
    // 旧 MiniMax/DeepSeek 精简版 Prompt 已随模型下线移除，历史版本见 docs/batch-analysis-prompt.md。
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
      userPrompt = '联网搜索以下公司情报并输出JSON：\n公司名称：' + (input.customerName || '') +
        (input.productName ? '\n产品：' + input.productName : '') +
        (input.website ? '\n官网：' + input.website : '') +
        '\n\n【最高优先级】1.公司名必须原样搜索，禁止替换为同名大公司。2.搜不到的字段必须填空字符串或null，禁止编造。3._emptyFields必须列出所有因搜不到而留空的字段名。\n\n直接输出JSON。';

  } else {
    return null;
  }

  // 不支持联网搜索的模型（GLM-5.3）：置顶注入能力提示，降级提示词中的"必须联网搜索"要求
  if (cfg && cfg.supportsSearch === false) {
    systemPrompt = NO_SEARCH_OVERRIDE + systemPrompt;
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
  // MiniMax tool_code 格式
  text = text.replace(new RegExp(LT + 'tool_code' + GT + '[\\s\\S]*?' + LT + '\\/tool_code' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'tool_code' + GT + '[\\s\\S]*', 'gi'), '');
  // 插件标签
  text = text.replace(new RegExp(LT + '\\|plugin\\|' + GT + '[\\s\\S]*?' + LT + '\\|\\/plugin\\|' + GT, 'gi'), '');
  // 孤立的闭合标签
  text = text.replace(new RegExp(LT + '\\/invoke' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'parameter[^' + GT + ']*' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + '\\/parameter' + GT, 'gi'), '');
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
async function callDashScope(systemPrompt, userPrompt, modelKey, stream, type) {
  var config = MODEL_CONFIG[modelKey] || MODEL_CONFIG['qwen38max'];
  var apiKey = Deno.env.get('DASHSCOPE_API_KEY');
  if (!apiKey) throw new Error('DASHSCOPE_API_KEY 未配置');

  var isBatch = (type === 'batch_analysis');
  var body = {
    model: config.id,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: isBatch ? 32000 : config.maxTokens,
    temperature: isBatch ? 0.1 : 0.5,
    stream: !!stream
  };
  // 联网搜索仅对支持 enable_search 的模型传入（qwen3.8-max / qwen3.8-flash / deepseek-v4-pro-0813）
  // ZHIPU/GLM-5.3 在 Chat Completions 协议下不支持 enable_search，传入会导致 API 报错，故不传
  if (config.supportsSearch) {
    body.enable_search = true;
    // forced_search 强制模型先搜索再回答；batch_analysis 使用 pro 策略获得更深入的搜索结果
    body.search_options = {
      forced_search: true,
      search_strategy: isBatch ? 'pro' : 'standard'
    };
  }
  // 默认开启思考模式的模型（qwen3.8-flash / GLM-5.3）：本场景只需最终正文，
  // 关闭思考以控制首字时延、避免非流式调用报错并节省输出费用
  if (config.disableThinking) {
    body.enable_thinking = false;
  }

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
async function handleStream(systemPrompt, userPrompt, modelKey, type) {
  var resp = await callDashScope(systemPrompt, userPrompt, modelKey, true, type);
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
async function handleNonStream(systemPrompt, userPrompt, modelKey, type) {
  var resp = await callDashScope(systemPrompt, userPrompt, modelKey, false, type);
  var data = await resp.json();
  var config = MODEL_CONFIG[modelKey] || MODEL_CONFIG['qwen38max'];
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
    var modelKey = body.model || 'qwen38max';
    var stream = body.stream || false;
    // batch_analysis 需要 JSON 输出，强制走非流式路径以避免流式 chunk 拆分导致的 tool_call 标签残留
    if (type === 'batch_analysis') stream = false;
    // GLM-5.3 不支持 enable_search，而批量评估强依赖联网搜索，直接拦截并给出明确提示
    if (type === 'batch_analysis' && MODEL_CONFIG[modelKey] && MODEL_CONFIG[modelKey].supportsSearch === false) {
      return new Response(JSON.stringify({ error: MODEL_CONFIG[modelKey].displayName + ' 不支持联网搜索，无法用于批量客户评估，请改用 Qwen3.8-Max 或 Qwen3.8-Flash' }), {
        status: 400,
        headers: Object.assign({}, CORS_HEADERS, { 'Content-Type': 'application/json' })
      });
    }
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
      return await handleStream(prompts.systemPrompt, prompts.userPrompt, modelKey, type);
    } else {
      return await handleNonStream(prompts.systemPrompt, prompts.userPrompt, modelKey, type);
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
