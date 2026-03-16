'use strict';

// 阿里云 FC - AI 代理函数
// 兼容 FC 2.0 (httpMethod) 和 FC 3.0 (requestContext.http.method)

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
  const isDirectInvoke = evt.type && (evt.type === 'customer_analysis' || evt.type === 'visit_plan');
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
  const models = {
    qwen35plus: 'qwen-plus',
    qwenmax: 'qwen-max',
    kimi: 'kimi-k2.5',
    minimax: 'MiniMax-M2.5'
  };
  const modelId = models[model] || 'qwen-plus';

  // 模型显示名称
  const displayNames = {
    'qwen-plus': 'Qwen-Plus',
    'qwen-max': 'Qwen-Max',
    'kimi-k2.5': 'Kimi-K2.5',
    'MiniMax-M2.5': 'MiniMax-M2.5'
  };

  console.log('Using model:', modelId);

  // 构建提示词
  let systemPrompt = '';
  let userPrompt = '';

  if (type === 'customer_analysis') {
    systemPrompt = '你是阿里云西部大区资深AI销售教练，拥有丰富的行业洞察和阿里云全线产品知识。\n\n' +
      '【格式要求】请使用纯文本输出，不要使用任何Markdown格式符号（如#、*、-、>等），不要使用加粗、斜体、列表符号。标题直接用文字表达即可。\n\n' +
      '【重要规则】\n' +
      '1. 用户可能输入公司名称、品牌名、产品名或简称。你必须先识别出对应的完整公司名称（包含"XX有限公司"等工商全称），在报告开头明确写出。\n' +
      '2. 如果用户输入的是产品名（如"钉钉""淘宝""抖音"），请先指出该产品所属公司全称，再基于该公司进行分析。\n' +
      '3. 如果无法确定具体公司，请基于输入推测最可能的公司并注明"推测"。\n' +
      '4. 所有分析必须结合该公司的真实业务场景，给出具体的、可落地的建议，不要泛泛而谈。\n' +
      '5. 每个AI应用场景必须包含：具体业务痛点 → 解决方案 → 预期效果（含量化KPI）。\n' +
      '6. 阿里云产品推荐必须具体到产品名称和使用方式，不要只列产品名。\n\n' +
      '请生成一份专业的客户AI潜力评估报告，确保文字的上下间距紧凑：\n' +
      '输出1：用户【云计算+AI】年度预算：单位是人民币万。\n' +
      '输出2：紧跟着在下文输出 客户分析报告，用结构化方式输出（分章节），内容包括但不限于以下五部分：\n' +
      '1. 客户业务概况：商业模式与盈利模式、核心客户群体与细分市场、主要产品/服务的功能与市场定位、市场竞争格局与主要竞争对手分析\n' +
      '2. 影响客户业务的关键行业趋势（未来 6–24 个月）\n' +
      '3. 从客户视角分析的机会与挑战\n' +
      '4. 从"用户结果"反推关键举措、指标和 Use Cases\n' +
      '5. 公共云与生成式 AI（GenAI）的应用构想';
    userPrompt = '请分析以下客户的AI转型潜力：' + (input?.customerName || '未知') + '\n\n请务必先识别出该客户的完整公司名称，然后进行深入分析。';

  } else if (type === 'visit_plan') {
    const sceneLabels = { first: '首次拜访', progress: '商机推进', executive: '高层拜访' };
    const sceneName = sceneLabels[input?.scene] || '客户拜访';
    systemPrompt = '你是阿里云西部大区资深AI销售教练，擅长帮助渠道伙伴制定高质量的客户拜访计划。\n\n' +
      '【格式要求】请使用纯文本输出，不要使用任何Markdown格式符号（如#、*、-、>等），不要使用加粗、斜体、列表符号。标题直接用文字表达即可。\n\n' +
      '【重要规则】\n' +
      '1. 所有内容必须紧密围绕用户提供的具体客户信息，不要给出泛化的通用建议。\n' +
      '2. 行动建议必须具体到可执行的步骤，包含话术示例。\n\n' +
      '请生成一份专业的拜访计划，严格按以下结构输出，每行文字之间的上下间距紧凑：\n' +
      '一、拜访目标：核心目标（1句话）、成功标志（可衡量的结果）。\n' +
      '二、行动承诺：这里的行动承诺是指【客户】（被拜访方）对阿里云做出的行动承诺，用于验证客户对本次拜访的认可度和合作意愿。不是阿里云对客户的承诺。最高承诺（理想结果，如客户同意安排POC测试、签署合作意向书、引荐更高层决策者等）、最低承诺（保底结果，如客户同意参加下次技术交流会、提供技术对接人联系方式、同意试用产品等）。\n' +
      '三、关键信息获取（5项），每项包含：信息点、优先级(Must/Should/Could)、获取方式。\n' +
      '四、价值传递（3个价值点），每个包含：客户痛点、我方价值主张、支撑证据（案例/数据）、参考话术（1-2句）。\n' +
      '五、风险预案：可能遇到的异议（2-3个）、应对策略和话术。\n' +
      '六、会前准备清单（5项具体待办）';
    userPrompt = '拜访场景：' + sceneName + '\n拜访对象角色：' + (input?.role || '') + '\n' + (input?.details || '');

  } else {
    return resp(400, { error: 'INVALID_TYPE: 未知的请求类型 ' + type });
  }

  try {
    console.log('Calling DashScope API...');

    const apiResponse = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DASHSCOPE_KEY
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
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
    const content = message
      ? (message.content || message.reasoning_content || '未能生成内容，请重试')
      : '未能生成内容，请重试';

    console.log('Success, content length:', content.length);

    return resp(200, {
      content,
      model: displayNames[modelId] || modelId,
      usage: data.usage
    });

  } catch (err) {
    console.error('Error:', err.name, err.message);
    return resp(500, { error: err.name + ': ' + err.message });
  }
};
