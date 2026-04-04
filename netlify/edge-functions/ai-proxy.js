/**
 * Netlify Edge Function: AI Proxy for DashScope
 * 支持流式输出 (SSE) + 非流式输出
 * 支持 qwen3.5-plus / qwen-max / kimi-k2.5 / MiniMax-M2.5 多模型
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

const MODEL_CONFIG = {
  'qwen35plus': { id: 'qwen3.5-plus', maxTokens: 8000, displayName: 'Qwen3.5-Plus' },
  'qwenmax': { id: 'qwen-max', maxTokens: 8000, displayName: 'Qwen-Max' },
  'kimi': { id: 'kimi-k2.5', maxTokens: 8000, displayName: 'Kimi-K2.5' },
  'minimax': { id: 'MiniMax-M2.5', maxTokens: 8000, displayName: 'MiniMax-M2.5' }
};

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// ===== 构建提示词 =====
function buildPrompts(type, input) {
  let systemPrompt = '';
  let userPrompt = '';

  if (type === 'customer_analysis') {
    systemPrompt = '你是麦肯锡的咨询顾问，负责企业数字化与人工智能转型。现在需要分析客户的商业模型和云与大模型相关的趋势和机会，为阿里云跟客户的合作提供思考和落地指导。请尽量引用公开信息与合理行业假设，做到逻辑清晰、结构严谨、结论可为高层决策与沟通直接使用。\n\n' +
      '【格式要求】请严格使用Markdown格式输出，确保层级分明、重点突出：\n' +
      '- 使用 # 作为一级标题（如 # 输出1：客户营收基础信息）\n' +
      '- 使用 ## 作为二级标题（如 ## 1. 客户业务概况）\n' +
      '- 使用 ### 作为三级子标题（如 ### 商业模式与盈利模式）\n' +
      '- 使用 **加粗** 突出关键数据、金额、结论\n' +
      '- 使用 - 作为无序列表的每一项\n' +
      '- 使用 1. 2. 作为有序编号列表\n' +
      '- 需要多维度对比的内容使用Markdown表格（| 列1 | 列2 | 列3 |）\n' +
      '- 中文输出，清晰小标题+编号，便于直接复制到客户文档\n\n' +
      '【重要规则】\n' +
      '1. 用户可能输入公司名称、品牌名、产品名或简称。你必须先识别出对应的完整公司名称（包含"XX有限公司"等工商全称），在报告开头明确写出。\n' +
      '2. 如果用户输入的是产品名（如"钉钉""淘宝""抖音"），请先指出该产品所属公司全称，再基于该公司进行分析。\n' +
      '3. 如果无法确定具体公司，请基于输入推测最可能的公司并注明"推测"。\n' +
      '4. 所有分析必须结合该公司的真实业务场景，给出具体的、可落地的建议，不要泛泛而谈。\n' +
      '5. 每个AI应用场景必须包含：具体业务痛点 → 解决方案 → 预期效果（含量化KPI）。\n' +
      '6. 阿里云产品推荐必须具体到产品名称和使用方式，不要只列产品名。\n' +
      '7. 【招投标信息规则】如果无法检索到招投标信息，直接写"暂无公开招投标信息"，不要推测虚构。如果检索到招投标信息，必须附上信息来源的超链接网址。\n' +
      '8. 【股权信息规则】股权、法人等工商信息请标注数据来源（如"数据来源：天眼查/企查查/国家企业信用信息公示系统"），并注明"以上信息仅供参考，请以官方工商登记为准"。\n\n' +
      '请生成一份专业的客户云与AI合作战略分析报告，严格按以下结构输出：\n\n' +
      '# 输出1：客户营收基础信息\n' +
      '## 近3年营收数据（2023-2025）\n' +
      '用Markdown表格展示该公司近3年的营收数据，列包含：年份、国内营收（亿元）、海外营收（亿元）、总营收（亿元）、营收同比增速、净利润（亿元）、利润同比增速。\n' +
      '- 上市公司：基于公开财报数据，注明数据来源\n' +
      '- 非上市公司：基于行业规模、员工数量、融资情况等进行合理推测，并明确注明"推测值"\n' +
      '## 业务收入结构分析\n' +
      '分析该公司主要业务板块的收入占比，用列表或表格展示各业务线的营收贡献。\n' +
      '## 招投标信息检索\n' +
      '检索该公司近1-3年的招投标信息。如有招投标记录，用Markdown表格展示，列包含：招标项目名称、招标时间、中标公司、中标金额、信息来源链接。【重要】如果无法检索到招投标信息，直接写"暂无公开招投标信息"，不要编造或推测。\n' +
      '## 股权信息检索\n' +
      '检索该公司的股权结构信息（数据来源：天眼查/企查查/国家企业信用信息公示系统），分以下子项用列表详细展开：\n' +
      '- 控股人及其背景（个人或企业控股人的基本信息、行业背景）\n' +
      '- 集团公司与分/子公司列表，用Markdown表格展示，列包含：公司名称、类型（母公司/子公司/分公司）、持股比例\n' +
      '- 股权分布（主要股东及持股比例，用列表展示）\n' +
      '**注意：以上股权信息仅供参考，请以国家企业信用信息公示系统官方数据为准。**\n\n' +
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
    userPrompt = '请分析以下客户的AI转型潜力：\n客户公司全称：' + input.customerName +
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
      '3. 行动建议必须具体到可执行的步骤。\n\n' +
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
                  const content = delta.content || delta.reasoning_content || '';
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
  const prompts = buildPrompts(type, input);

  if (!prompts) {
    return new Response(JSON.stringify({ error: 'INVALID_TYPE: 未知的请求类型' }), {
      status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  const apiBody = {
    model: cfg.id,
    messages: [
      { role: 'system', content: prompts.systemPrompt },
      { role: 'user', content: prompts.userPrompt }
    ],
    temperature: 0.7,
    max_tokens: cfg.maxTokens,
    stream: !!useStream
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
    const content = message
      ? (message.content || message.reasoning_content || '未能生成内容，请重试')
      : '未能生成内容，请重试';

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
