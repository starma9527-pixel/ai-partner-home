/**
 * Netlify Edge Function: AI Proxy for DashScope (通义千问)
 * Edge Function 基于 Deno 运行时，超时限制远大于普通 Functions 的 10 秒
 * 支持 qwen-turbo / qwen-plus / qwen-max 多模型选择
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const MODEL_CONFIG = {
  // 4个模型都通过阿里云百炼调用（统一使用 DASHSCOPE_API_KEY）
  'qwen35plus': { 
    id: 'qwen-plus', 
    maxTokens: 2000,
    displayName: 'Qwen-Plus'
  },
  'qwenmax': { 
    id: 'qwen-max', 
    maxTokens: 2000,
    displayName: 'Qwen-Max'
  },
  'kimi': { 
    id: 'kimi-k2.5',  // 百炼支持的Kimi模型
    maxTokens: 2000,
    displayName: 'Kimi-K2.5'
  },
  'minimax': { 
    id: 'MiniMax-M2.5',  // 百炼支持的MiniMax模型
    maxTokens: 2000,
    displayName: 'MiniMax-M2.5'
  }
};

export default async (request, context) => {
  // GET request for testing / diagnostics
  if (request.method === 'GET') {
    const API_KEY = Deno.env.get('DASHSCOPE_API_KEY');
    const hasKey = !!API_KEY;
    const diagnostics = { status: 'Edge Function is working!', hasApiKey: hasKey, timestamp: new Date().toISOString() };
    
    // Quick connectivity test to DashScope API
    try {
      const testCtrl = new AbortController();
      const testTimeout = setTimeout(() => testCtrl.abort(), 8000);
      const testResp = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/models', {
        headers: { 'Authorization': 'Bearer ' + (API_KEY || 'test') },
        signal: testCtrl.signal
      });
      clearTimeout(testTimeout);
      diagnostics.intlApi = { reachable: true, status: testResp.status };
    } catch (e) {
      diagnostics.intlApi = { reachable: false, error: e.name + ': ' + e.message };
    }
    
    try {
      const testCtrl2 = new AbortController();
      const testTimeout2 = setTimeout(() => testCtrl2.abort(), 8000);
      const testResp2 = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/models', {
        headers: { 'Authorization': 'Bearer ' + (API_KEY || 'test') },
        signal: testCtrl2.signal
      });
      clearTimeout(testTimeout2);
      diagnostics.cnApi = { reachable: true, status: testResp2.status };
    } catch (e) {
      diagnostics.cnApi = { reachable: false, error: e.name + ': ' + e.message };
    }
    
    return new Response(JSON.stringify(diagnostics, null, 2), { status: 200, headers: CORS_HEADERS });
  }

  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: CORS_HEADERS
    });
  }

  const API_KEY = Deno.env.get('DASHSCOPE_API_KEY');
  if (!API_KEY) {
    return new Response(JSON.stringify({
      error: 'ENV_MISSING: 服务端未配置 DASHSCOPE_API_KEY 环境变量'
    }), { status: 500, headers: CORS_HEADERS });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({
      error: 'PARSE_ERROR: 请求格式错误'
    }), { status: 400, headers: CORS_HEADERS });
  }

  const { type, input, model: modelKey } = body;
  const cfg = MODEL_CONFIG[modelKey] || MODEL_CONFIG['turbo'];

  let systemPrompt = '';
  let userPrompt = '';

  if (type === 'customer_analysis') {
    systemPrompt = `你是阿里云西部大区资深AI销售教练，拥有丰富的行业洞察和阿里云全线产品知识。

【重要规则】
1. 用户可能输入公司名称、品牌名、产品名或简称。你必须先识别出对应的完整公司名称（包含"XX有限公司"等工商全称），在报告开头明确写出。
2. 如果用户输入的是产品名（如"钉钉""淘宝""抖音"），请先指出该产品所属公司全称，再基于该公司进行分析。
3. 如果无法确定具体公司，请基于输入推测最可能的公司并注明"推测"。
4. 所有分析必须结合该公司的真实业务场景，给出具体的、可落地的建议，不要泛泛而谈。
5. 每个AI应用场景必须包含：具体业务痛点 → 解决方案 → 预期效果（含量化KPI）。
6. 阿里云产品推荐必须具体到产品名称和使用方式，不要只列产品名。

请生成一份专业的客户AI潜力评估报告，严格按以下结构输出，除了一级标题加粗加黑，其他内容都正常展示，确保文字的上下间距紧凑：
输出1：用户在【云计算和AI板块】的年度预算金额：单位是人民币万
输出2：紧跟着在下文输出 客户分析报告，用结构化方式输出（分章节），内容包括但不限于以下五部分：
1. 客户业务概况：商业模式与盈利模式、核心客户群体与细分市场、主要产品/服务的功能与市场定位、市场竞争格局与主要竞争对手分析、他们目前如何触达和服务客户（渠道、触点、服务模式）、企业整体业务方向与中长期发展战略、如有公开信息，请重点梳理 2025 年的工作重点（如研发方向、重点投资计划、数字化/智能化布局等）
2. 影响客户业务的关键行业趋势（未来 6–24 个月）：提炼 3–5 个与客户高度相关、且在未来 6–24 个月内预计会对其业务产生重大影响的行业或市场趋势，对每个趋势，简要说明趋势内涵、发展逻辑及与客户的相关性
3. 从客户视角分析的机会与挑战：站在客户管理层视角，结合上述趋势，提炼 3–5 个最关键的业务机会，同时分析对应的主要挑战或风险（如组织能力、资金投入、技术门槛、合规风险等）
4. 从“用户结果”反推关键举措、指标和 Use Cases：先明确客户在“用户结果”（如用户体验、产品创新、内部员工效率等）层面的目标，基于这些目标，提出 3–6 个关键战略举措（initiatives），并为每个举措设计：关键业务指标（KPIs），可落地的典型数字化/AI Use Cases（用例描述、涉及流程、预期价值）。
5. 公共云与生成式 AI（GenAI）的应用构想：结合上述分析，说明公有云在基础设施、数据平台、安全合规等层面的潜在价值，设计 3–5 个适合客户的 GenAI 典型应用场景（如智能客服、营销内容生成、知识问答、运营优化、研发辅助等），并说明：业务痛点、解决思路与方案构想、预期业务价值与衡量指标。如有必要，可简要讨论实施路径（短期试点–中期扩展–长期变革）和关键成功要素;
    userPrompt = '请分析以下客户的AI转型潜力：' + input.customerName + '\n\n请务必先识别出该客户的完整公司名称，然后进行深入分析。';

  } else if (type === 'visit_plan') {
    const sceneLabels = { first: '首次拜访', progress: '商机推进', executive: '高层拜访' };
    const sceneName = sceneLabels[input.scene] || '客户拜访';
    systemPrompt = `你是阿里云西部大区资深AI销售教练，擅长帮助渠道伙伴制定高质量的客户拜访计划。

【重要规则】
1. 所有内容必须紧密围绕用户提供的具体客户信息，不要给出泛化的通用建议。
2. 行动建议必须具体到可执行的步骤，包含话术示例。

请生成一份专业的拜访计划，严格按以下结构输出，除了一级标题加粗加黑，其他内容都正常展示，确保文字的上下间距紧凑。

一、拜访目标
  - 核心目标（1句话）
  - 成功标志（可衡量的结果）

二、行动承诺
  - 最高承诺（理想结果）
  - 最低承诺（保底结果）

三、关键信息获取（5项）
  每项包含：信息点 | 优先级(Must/Should/Could) | 获取方式

四、价值传递（3个价值点）
  每个包含：
  - 客户痛点
  - 我方价值主张
  - 支撑证据（案例/数据）
  - 参考话术（1-2句）


六、风险预案
  - 可能遇到的异议（2-3个）
  - 应对策略和话术

七、会前准备清单（5项具体待办）`;
    userPrompt = '拜访场景：' + sceneName + '\n拜访对象角色：' + input.role + '\n' + input.details;

  } else {
    return new Response(JSON.stringify({
      error: 'INVALID_TYPE: 未知的请求类型'
    }), { status: 400, headers: CORS_HEADERS });
  }

  try {
    // 设置 50 秒超时（Netlify Edge Function 最大约 50 秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);

    let response = null;
    let lastError = null;
    
    // 所有模型都通过阿里云百炼调用
    // 优先使用中国区端点（API Key 在中国区有效）
    const API_URLS = [
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions'
    ];
    
    for (const apiUrl of API_URLS) {
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
          },
          body: JSON.stringify({
            model: cfg.id,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: cfg.maxTokens
          }),
          signal: controller.signal
        });
        if (response.status === 401) {
          lastError = 'AUTH_FAIL on ' + apiUrl;
          response = null;
          continue;
        }
        break;
      } catch (fetchErr) {
        lastError = fetchErr.message;
        response = null;
        continue;
      }
    }

    clearTimeout(timeoutId);

    if (!response) {
      return new Response(JSON.stringify({
        error: 'API_CONNECT_ERROR: 无法连接API，' + (lastError || '未知错误')
      }), { status: 502, headers: CORS_HEADERS });
    }

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({
        error: 'API_ERROR: 模型API返回 ' + response.status,
        detail: errText.substring(0, 500)
      }), { status: response.status, headers: CORS_HEADERS });
    }

    const data = await response.json();
    const message = data.choices && data.choices[0] && data.choices[0].message;
    const content = message
      ? (message.content || message.reasoning_content || '未能生成内容，请重试')
      : '未能生成内容，请重试';

    return new Response(JSON.stringify({ content, model: cfg.displayName || cfg.id }), {
      status: 200, headers: CORS_HEADERS
    });

  } catch (err) {
    const errorMsg = err.name === 'AbortError' 
      ? '请求超时(50秒)，请稍后重试'
      : err.message;
    return new Response(JSON.stringify({
      error: 'ERROR: ' + errorMsg
    }), { status: 500, headers: CORS_HEADERS });
  }
};

export const config = { path: "/api/ai-proxy" };
