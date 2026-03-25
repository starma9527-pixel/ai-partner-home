/**
 * Feedback Edge Function
 * 接收回音壁反馈并发送邮件通知
 *
 * 环境变量 (在 Netlify 后台设置):
 *   FEEDBACK_EMAIL   - 接收邮件地址 (默认 maxing.mx@alibaba-inc.com)
 *   RESEND_API_KEY   - Resend.com API Key (免费 100封/天)
 */

export default async (request, context) => {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json();
    const { name, company, content, author } = body;

    if (!content || !content.trim()) {
      return new Response(JSON.stringify({ error: '反馈内容不能为空' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const toEmail = Deno.env.get('FEEDBACK_EMAIL') || 'maxing.mx@alibaba-inc.com';
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    // 构建邮件内容
    const emailBody = [
      `<h2>AI先锋·伙伴之家 - 新反馈通知</h2>`,
      `<table style="border-collapse:collapse;width:100%;max-width:600px;">`,
      `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">提交时间</td><td style="padding:8px;border:1px solid #ddd;">${timestamp}</td></tr>`,
      `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">提交人</td><td style="padding:8px;border:1px solid #ddd;">${author || name || '匿名'}</td></tr>`,
      company ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">所属公司</td><td style="padding:8px;border:1px solid #ddd;">${company}</td></tr>` : '',
      `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">反馈内容</td><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap;">${content}</td></tr>`,
      `</table>`,
    ].join('\n');

    // 如果配置了 Resend API Key，发送邮件
    if (resendKey) {
      const emailResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AI伙伴之家 <onboarding@resend.dev>',
          to: [toEmail],
          subject: `[伙伴反馈] ${(name || '匿名')} - ${content.substring(0, 30)}...`,
          html: emailBody,
        }),
      });

      if (emailResp.ok) {
        console.log('[Feedback] 邮件发送成功 -> ' + toEmail);
        return new Response(JSON.stringify({ success: true, method: 'email' }), { headers: corsHeaders });
      } else {
        const errText = await emailResp.text();
        console.error('[Feedback] Resend API 失败:', errText);
        return new Response(JSON.stringify({ success: false, error: '邮件发送失败', detail: errText }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // 没有 API Key 时，只记录日志并返回成功（依赖 Netlify Forms 捕获）
    console.log('[Feedback] 无 RESEND_API_KEY，仅日志记录:', JSON.stringify({ name, company, content, timestamp }));
    return new Response(JSON.stringify({ success: true, method: 'log', note: '反馈已记录，请在 Netlify 后台配置 RESEND_API_KEY 以启用邮件通知' }), {
      headers: corsHeaders,
    });

  } catch (err) {
    console.error('[Feedback] Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const config = { path: '/api/feedback' };
