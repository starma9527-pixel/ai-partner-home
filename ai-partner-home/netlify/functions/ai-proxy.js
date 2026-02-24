/**
 * Netlify Function: AI Proxy for DashScope (通义千问)
 * 支持多模型选择，优化 Prompt 提升输出质量
 */
const https = require('https');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const MODEL_CONFIG = {
  'turbo':  { id: 'qwen-turbo',  maxTokens: 2000, timeout: 9000 },
  'plus':   { id: 'qwen-plus',   maxTokens: 2000, timeout: 9000 },
  'max':    { id: 'qwen-max',    maxTokens: 2000, timeout: 9000 }
};

function makeRequest(url, options, postData, timeout) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', (err) => reject(err));
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error('普通Function超时(请确认Edge Function已部署)'));
    });
    if (postData) req.write(postData);
    req.end();
  });
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const API_KEY = process.env.DASHSCOPE_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: '服务端未配置API Key' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch (e) { return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '请求格式错误' }) }; }

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
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '未知请求类型' }) };
  }

  const postBody = JSON.stringify({
    model: cfg.id,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: cfg.maxTokens
  });

  try {
    const response = await makeRequest(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY,
          'Content-Length': Buffer.byteLength(postBody)
        }
      },
      postBody,
      cfg.timeout
    );

    if (response.statusCode !== 200) {
      return {
        statusCode: response.statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'API返回' + response.statusCode + ': ' + response.body.substring(0, 300) })
      };
    }

    let data;
    try { data = JSON.parse(response.body); }
    catch (e) { return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: '无法解析API响应' }) }; }

    const content = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '未能生成内容，请重试';

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ content, model: cfg.id }) };

  } catch (err) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
