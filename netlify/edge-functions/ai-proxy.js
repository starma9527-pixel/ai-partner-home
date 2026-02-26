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
  'turbo': { id: 'qwen-turbo', maxTokens: 2000 },
  'plus':  { id: 'qwen-plus',  maxTokens: 1200 },
  'max':   { id: 'qwen-max',   maxTokens: 1000 },
  'think': { id: 'qwq-plus', maxTokens: 1500 }
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

请生成一份专业的客户AI潜力评估报告，严格按以下结构输出：

一、客户基本信息
  - 公司全称：
  - 所属行业：
  - 主营业务：
  - 商业模式：
  - 核心客户群体：

二、行业AI趋势（未来6-24个月，至少3个具体趋势，每个带简要说明）

三、云+AI转型机会与挑战
  机会（至少3个具体机会点，与该公司业务直接相关）
  挑战（至少2个该公司可能面临的具体障碍）

四、AI应用场景建议（3个场景）
  每个场景包含：
  - 场景名称
  - 业务痛点
  - AI解决方案
  - 预期KPI提升

五、阿里云产品组合推荐（3套方案）
  每套包含：
  - 方案名称
  - 核心产品（具体阿里云产品名）
  - 解决的痛点
  - 实施路径（1-2句话）
  - 预估投入范围`;
    userPrompt = '请分析以下客户的AI转型潜力：' + input.customerName + '\n\n请务必先识别出该客户的完整公司名称，然后进行深入分析。';

  } else if (type === 'visit_plan') {
    const sceneLabels = { first: '首次拜访', progress: '商机推进', executive: '高层拜访' };
    const sceneName = sceneLabels[input.scene] || '客户拜访';
    systemPrompt = `你是阿里云西部大区资深AI销售教练，擅长帮助渠道伙伴制定高质量的客户拜访计划。

【重要规则】
1. 所有内容必须紧密围绕用户提供的具体客户信息，不要给出泛化的通用建议。
2. 行动建议必须具体到可执行的步骤，包含话术示例。
3. 议程安排必须精确到分钟，每个阶段有明确的动作和预期产出。

请生成一份专业的${sceneName}计划，严格按以下结构输出：

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

五、会议议程（60分钟）
  分5个阶段，每阶段包含：时间分配 | 具体动作 | 预期产出

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
    // 设置 25 秒超时（Netlify Edge Function 限制约 30 秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    // DashScope 中国区端点（用户 API Key 为中国区）
    const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

    const response = await fetch(API_URL, {
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

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({
        error: 'API_ERROR: 通义千问返回 ' + response.status,
        detail: errText.substring(0, 500)
      }), { status: response.status, headers: CORS_HEADERS });
    }

    const data = await response.json();
    const message = data.choices && data.choices[0] && data.choices[0].message;
    // QwQ deep thinking models may return content in reasoning_content + content
    const content = message
      ? (message.content || message.reasoning_content || '未能生成内容，请重试')
      : '未能生成内容，请重试';

    return new Response(JSON.stringify({ content, model: cfg.id }), {
      status: 200, headers: CORS_HEADERS
    });

  } catch (err) {
    const errorMsg = err.name === 'AbortError' 
      ? '请求超时(45秒)，该模型响应较慢，建议使用 Qwen-Turbo'
      : err.message;
    return new Response(JSON.stringify({
      error: 'ERROR: ' + errorMsg
    }), { status: 500, headers: CORS_HEADERS });
  }
};

export const config = { path: "/api/ai-proxy" };
