/**
 * AI先锋·伙伴之家 - Main Application Logic
 * ====================================================
 * 【技术小白更新指南】
 *   要更新网站内容，请打开 admin.html 管理后台修改数据。
 *   或者直接修改下方 SITE_DATA 对象中的数据。
 * ====================================================
 */

// ===== 网站数据（直接修改这里即可更新内容） =====
const SITE_DATA = {
  "site": {
    "name": "AI先锋·伙伴之家",
    "slogan": "西部大区伙伴赋能平台",
    "adminEmail": "admin@example.com"
  },
  "hotSearch": [
    "最新AI大单案例",
    "通义千问接入指南",
    "云服务器选型"
  ],
  "announcements": [
    {
      "id": 1,
      "text": "2026年Q1伙伴激励政策已发布，点击查看详情",
      "link": "#",
      "date": "2025-03-01"
    },
    {
      "id": 2,
      "text": "本周五直播预告：大模型在游戏场景的落地实践",
      "link": "#",
      "date": "2025-03-05"
    }
  ],
  "quickLinks": [
    {
      "icon": "🧰",
      "title": "打单兵器",
      "desc": "业务规则·常用工具·生态知识库",
      "tab": "weapons"
    },
    {
      "icon": "🚀",
      "title": "赢战MaaS",
      "desc": "财税·AI短剧·智能语音赛道",
      "tab": "maas"
    },
    {
      "icon": "🎯",
      "title": "拜访教练",
      "desc": "甄选客户·拜访计划·AI助手",
      "tab": "guide"
    },
    {
      "icon": "🏆",
      "title": "龙虎榜",
      "desc": "Token排行·案例贡献·学习时长",
      "tab": "rank"
    },
    {
      "icon": "💬",
      "title": "回音壁",
      "desc": "留言反馈·建议吐槽·需求收集",
      "tab": "feedback"
    }
  ],
  "weapons": {
    "rules": [
      {
        "title": "阿里云生态伙伴平台-信息公告",
        "size": "",
        "date": "",
        "link": "https://aps.aliyun.com",
        "type": ""
      }
    ],
    "tools": [
      {
        "title": "MaaS价格核算",
        "desc": "快速核算MaaS产品价格",
        "icon": "🧮",
        "link": "https://www.maas-nexus.top/"
      },
      {
        "title": "竞品对比工具",
        "desc": "阿里云 vs 友商能力对比",
        "icon": "⚔️",
        "link": "#"
      },
      {
        "title": "AI Demo体验",
        "desc": "一键体验通义系列产品",
        "icon": "🤖",
        "link": "#"
      },
      {
        "title": "方案模板库",
        "desc": "行业解决方案PPT模板",
        "icon": "📑",
        "link": "#"
      }
    ],
    "knowledge": [],
    "knowledgeBaseLink": "https://alidocs.dingtalk.com/i/spaces/nb9XJJ5P1yPLVXyA/overview",
    "liveTrainings": [
      {
        "title": "AI短剧解决方案、AI Coding产品方案选型推荐",
        "date": "2026-01-09",
        "speaker": "李阳(山樵)",
        "link": "https://n.dingtalk.com/dingding/live-room/index.html?roomId=MIzQRx84Yo&liveUuid=34080b76-8c46-45de-a7a6-8a8d11e501a6",
        "cover": ""
      },
      {
        "title": "Qoder产品售卖策略&Coding plan售卖策略及话术推荐",
        "date": "2026-03-13",
        "speaker": "王永刚、何家丞",
        "link": "https://n.dingtalk.com/dingding/live-room/index.html?roomId=t2m6NntuWo&liveUuid=b8d9b66e-2aa8-4600-85a9-b3839be12b06",
        "cover": ""
      },
      {
        "title": "AI 智能硬件客户案例分享&无影云电脑应用案例与 AI 价值增量路径",
        "date": "2026-03-06",
        "speaker": "袁艺青、舟木",
        "link": "https://n.dingtalk.com/dingding/live-room/index.html?roomId=D66G4xLuWq&liveUuid=b6f12927-d5b7-4314-8baa-425702cd6d6d",
        "cover": ""
      }
    ],
    "moreLiveLink": "https://qr.dingtalk.com/action/joingroup?code=v1,k1,k5NQoHBel/zRbku22VcQ6CfqRS7mdpeOFTg8GOING1A=&_dt_no_comment=1&origin=11"
  },
  "guide": {},
  "maas": {
    "tracks": [
      {
        "id": "tax",
        "icon": "💰",
        "name": "赛道1 · 财税",
        "desc": "面向财税行业的MaaS解决方案，助力伙伴快速拓展财税数字化市场",
        "scenarios": [
          "智能发票识别与录入",
          "财务报表自动生成",
          "税务风险AI预警",
          "智能记账与对账"
        ],
        "products": [
          "通义千问API",
          "OCR文字识别",
          "智能对话机器人"
        ],
        "cases": "已有3家伙伴落地财税AI项目，累计合同额超200万",
        "link": "https://alidocs.dingtalk.com/i/spaces/nb9XJJ5P1yPLVXyA/overview"
      },
      {
        "id": "drama",
        "icon": "🎬",
        "name": "赛道2 · AI短剧",
        "desc": "AI驱动短剧/漫剧内容生产，从剧本到成片全链路赋能",
        "scenarios": [
          "AI剧本创作与改编",
          "AI角色形象生成",
          "智能配音与语音合成",
          "AI视频剪辑与特效"
        ],
        "products": [
          "通义万相",
          "CosyVoice语音合成",
          "通义千问API"
        ],
        "cases": "AI短剧制作成本降低60%，单集产出效率提升5倍",
        "link": "https://alidocs.dingtalk.com/i/spaces/nb9XJJ5P1yPLVXyA/overview"
      },
      {
        "id": "voice",
        "icon": "🎙️",
        "name": "赛道3 · 智能语音",
        "desc": "基于大模型的智能语音解决方案，覆盖客服、外呼、质检等场景",
        "scenarios": [
          "智能客服语音机器人",
          "AI外呼与营销",
          "通话质检与合规分析",
          "语音转文字与会议纪要"
        ],
        "products": [
          "语音识别ASR",
          "语音合成TTS",
          "通义千问API"
        ],
        "cases": "智能语音客服替代率达70%，客户满意度提升25%",
        "link": "https://alidocs.dingtalk.com/i/spaces/nb9XJJ5P1yPLVXyA/overview"
      },
      {
        "id": "data",
        "icon": "🏷️",
        "name": "赛道4 · 数据标注",
        "desc": "专业数据标注与数据工程服务，为大模型训练提供高质量数据支撑",
        "scenarios": [
          "图像分类与目标检测标注",
          "文本标注与NER命名实体",
          "语音数据采集与转写",
          "大模型指令微调数据构建"
        ],
        "products": [
          "数据标注平台",
          "通义千问API",
          "模型微调服务"
        ],
        "cases": "已服务5个大模型训练项目，标注准确率超98%",
        "link": "https://alidocs.dingtalk.com/i/spaces/nb9XJJ5P1yPLVXyA/overview"
      },
      {
        "id": "social",
        "icon": "💬",
        "name": "赛道5 · 社交陪伴",
        "desc": "AI驱动的虚拟陪伴与社交互动解决方案，覆盖情感陪伴、虚拟角色、社群运营等场景",
        "scenarios": [
          "AI虚拟伴侣与情感陪伴",
          "虚拟IP角色对话互动",
          "智能社群运营与管理",
          "游戏NPC智能对话"
        ],
        "products": [
          "通义千问API",
          "语音合成TTS",
          "数字人形象生成"
        ],
        "cases": "虚拟陪伴用户日均使用时长超2小时，用户留存率提升40%",
        "link": "https://alidocs.dingtalk.com/i/spaces/nb9XJJ5P1yPLVXyA/overview"
      },
      {
        "id": "saasagent",
        "icon": "🤖",
        "name": "赛道6 · SaaS Agent",
        "desc": "基于大模型的智能SaaS助手，为各类SaaS产品注入AI能力，提升用户体验与效率",
        "scenarios": [
          "智能文档助手与内容生成",
          "数据分析与可视化洞察",
          "自动化工作流与任务执行",
          "智能客服与工单处理"
        ],
        "products": [
          "通义千问API",
          "Function Calling工具调用",
          "知识库RAG检索"
        ],
        "cases": "SaaS产品接入AI助手后，用户付费转化率提升35%，操作效率提升3倍",
        "link": "https://alidocs.dingtalk.com/i/spaces/nb9XJJ5P1yPLVXyA/overview"
      }
    ]
  },
  "rank": {
    "tokenRank": [
      {
        "rank": 1,
        "name": "四川捷云",
        "score": "25%"
      },
      {
        "rank": 2,
        "name": "成都端木",
        "score": "17%"
      },
      {
        "rank": 3,
        "name": "长虹佳华",
        "score": "14%"
      },
      {
        "rank": 4,
        "name": "四川柏盛云途",
        "score": "14%"
      },
      {
        "rank": 5,
        "name": "重庆羋游",
        "score": "10%"
      },
      {
        "rank": 6,
        "name": "重庆云之渝",
        "score": "9%"
      },
      {
        "rank": 7,
        "name": "重庆典名",
        "score": "8%"
      }
    ],
    "caseRank": [
      {
        "rank": 1,
        "name": "重庆典名",
        "score": ""
      },
      {
        "rank": 2,
        "name": "数联创新",
        "score": 18
      },
      {
        "rank": 3,
        "name": "云翔信息",
        "score": 15
      },
      {
        "rank": 4,
        "name": "天行数据",
        "score": 12
      },
      {
        "rank": 5,
        "name": "智源网络",
        "score": 9
      }
    ],
    "studyRank": [
      {
        "rank": 1,
        "name": "云翔信息",
        "score": "42h"
      },
      {
        "rank": 2,
        "name": "锐智科技",
        "score": "38h"
      },
      {
        "rank": 3,
        "name": "智源网络",
        "score": "35h"
      },
      {
        "rank": 4,
        "name": "数联创新",
        "score": "31h"
      },
      {
        "rank": 5,
        "name": "天行数据",
        "score": "28h"
      }
    ],
    "certRank": [
      {
        "rank": 1,
        "name": "锐智科技",
        "score": "92%"
      },
      {
        "rank": 2,
        "name": "云翔信息",
        "score": "85%"
      },
      {
        "rank": 3,
        "name": "天行数据",
        "score": "78%"
      },
      {
        "rank": 4,
        "name": "数联创新",
        "score": "73%"
      },
      {
        "rank": 5,
        "name": "智源网络",
        "score": "68%"
      }
    ],
    "battleReports": [
      {
        "title": "重庆典名签约XX客户千万级数据集建设项目",
        "amount": "千万级",
        "date": "2026-03-2"
      },
      {
        "title": "四川捷云信通抓住 OpenClaw 爆发机遇，7 天狂揽 200+ 新客户！",
        "amount": "--",
        "date": "2026-03-10"
      },
      {
        "title": "成都慕创中标XX一体机项目",
        "amount": "百万级",
        "date": "2026-03-12"
      }
    ]
  },
  "feedback": {
    "messages": [
      {
        "id": 1,
        "author": "张伟 · 锐智科技",
        "content": "希望能增加更多金融行业的案例资料",
        "date": "2025-02-28",
        "likes": 12
      },
      {
        "id": 2,
        "author": "李娜 · 云翔信息",
        "content": "周五培训非常实用，希望能有回放",
        "date": "2025-02-27",
        "likes": 8
      },
      {
        "id": 3,
        "author": "王磊 · 数联创新",
        "content": "报价工具建议增加批量导出功能",
        "date": "2025-02-26",
        "likes": 5
      }
    ]
  }
};


// ===== Global State =====
let siteData = null;

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadSiteData();
  initTabs();
  initRankTabs();
  initSceneSelector();
  renderHome();
  renderWeapons();
  renderMaas();
  renderRank();
  renderFeedback();
});

// ===== Load Data =====
async function loadSiteData() {
  try {
    const resp = await fetch('data/site-data.json');
    if (resp.ok) {
      siteData = await resp.json();
      return;
    }
  } catch (e) {}
  siteData = SITE_DATA;
}

// ===== Tab Navigation =====
function initTabs() {
  const nav = document.getElementById('pillNav');
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-btn');
    if (!btn) return;
    const tab = btn.dataset.tab;
    switchTab(tab);
  });
}

// 切换标签页（首页卡片和导航栏共用）
function switchTab(tab) {
  const nav = document.getElementById('pillNav');
  nav.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  const targetBtn = nav.querySelector(`.pill-btn[data-tab="${tab}"]`);
  if (targetBtn) targetBtn.classList.add('active');
  // 手机端导航也同步
  document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
  const mobileBtn = document.querySelector(`.mobile-nav-btn[data-tab="${tab}"]`);
  if (mobileBtn) mobileBtn.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Rank Sub-tabs =====
function initRankTabs() {
  const tabs = document.getElementById('rankTabs');
  if (!tabs) return;
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.rank-tab');
    if (!btn) return;
    const rank = btn.dataset.rank;
    tabs.querySelectorAll('.rank-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.rank-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('rank-' + rank).classList.add('active');
  });
}

// ===== Scene Selector (Visit Plan) =====
function initSceneSelector() {
  const sel = document.getElementById('sceneSelector');
  if (!sel) return;
  sel.addEventListener('click', (e) => {
    const btn = e.target.closest('.scene-btn');
    if (!btn) return;
    const scene = btn.dataset.scene;
    sel.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.scene-form').forEach(f => f.classList.remove('active'));
    document.getElementById('form-' + scene).classList.add('active');
  });
}

// ===== Render: Home =====
function renderHome() {
  const announcements = siteData.announcements || [];
  if (announcements.length > 0) {
    const textEl = document.getElementById('announceText');
    if (textEl) {
      let idx = 0;
      function showAnnounce() {
        textEl.textContent = announcements[idx].text;
        idx = (idx + 1) % announcements.length;
      }
      showAnnounce();
      if (announcements.length > 1) setInterval(showAnnounce, 5000);
    }
  }
}

// ===== Render: Weapons =====
function renderWeapons() {
  const weapons = siteData.weapons || {};
  const rulesList = document.getElementById('rulesList');
  (weapons.rules || []).forEach(item => {
    rulesList.innerHTML += `
      <div class="doc-item">
        <div class="doc-icon">📋</div>
        <div class="doc-info">
          <div class="doc-name">${item.title}</div>
          <div class="doc-meta">${[item.type, item.size, item.date].filter(Boolean).join(' · ')}</div>
        </div>
        <a href="${item.link}" class="btn-dl" target="_blank">查看</a>
      </div>
    `;
  });
  const toolGrid = document.getElementById('toolGrid');
  (weapons.tools || []).forEach(item => {
    toolGrid.innerHTML += `
      <div class="tool-card" onclick="window.open('${item.link}', '_blank')">
        <div class="tool-icon">${item.icon}</div>
        <div class="tool-name">${item.title}</div>
        <div class="tool-desc">${item.desc}</div>
      </div>
    `;
  });
  const knowledgeList = document.getElementById('knowledgeList');
  (weapons.knowledge || []).forEach(item => {
    const isVideo = item.type === 'VIDEO';
    knowledgeList.innerHTML += `
      <div class="doc-item">
        <div class="doc-icon">${isVideo ? '🎬' : '📄'}</div>
        <div class="doc-info">
          <div class="doc-name">${item.title}</div>
          <div class="doc-meta">${item.type} · ${isVideo ? item.duration : item.size} · ${item.date}</div>
        </div>
        <a href="${item.link}" class="btn-dl" target="_blank">${isVideo ? '观看' : '下载'}</a>
      </div>
    `;
  });
  const kbLink = document.getElementById('kbLink');
  if (weapons.knowledgeBaseLink) kbLink.href = weapons.knowledgeBaseLink;

  // Render Live Trainings (moved from Guide to Weapons)
  const liveGrid = document.getElementById('liveGrid');
  if (liveGrid) {
    (weapons.liveTrainings || []).forEach(item => {
      liveGrid.innerHTML += `
        <a href="${item.link}" class="live-card" target="_blank">
          <div class="live-thumb">🎓<span class="live-badge">直播</span></div>
          <div class="live-info">
            <div class="live-title">${item.title}</div>
            <div class="live-meta">🕐 ${item.date} · 讲师：${item.speaker}</div>
          </div>
        </a>
      `;
    });
  }
  const moreLiveLink = document.getElementById('moreLiveLink');
  if (weapons.moreLiveLink && moreLiveLink) moreLiveLink.href = weapons.moreLiveLink;
}

// ===== Render: MaaS =====
function renderMaas() {
  const maas = siteData.maas || {};
  const trackGrid = document.getElementById('trackGrid');
  if (!trackGrid) return;

  (maas.tracks || []).forEach(track => {
    const scenariosHtml = (track.scenarios || []).map(s => `<li>${s}</li>`).join('');
    const productsHtml = (track.products || []).map(p => `<span class="product-tag">${p}</span>`).join('');

    trackGrid.innerHTML += `
      <div class="track-card">
        <div class="track-header">
          <span class="track-icon">${track.icon}</span>
          <span class="track-name">${track.name}</span>
        </div>
        <div class="track-desc">${track.desc}</div>
        <div class="track-section">
          <div class="track-label">核心场景</div>
          <ul class="track-scenarios">${scenariosHtml}</ul>
        </div>
        <div class="track-section">
          <div class="track-label">推荐产品</div>
          <div class="track-products">${productsHtml}</div>
        </div>
        <div class="track-cases">${track.cases}</div>
        <a href="${track.link}" class="track-btn" target="_blank">了解详情 →</a>
      </div>
    `;
  });
}

// ===== Render: Guide =====
function renderGuide() {
  const guide = siteData.guide || {};
  const liveGrid = document.getElementById('liveGrid');
  (guide.liveTrainings || []).forEach(item => {
    liveGrid.innerHTML += `
      <a href="${item.link}" class="live-card" target="_blank">
        <div class="live-thumb">🎓<span class="live-badge">直播</span></div>
        <div class="live-info">
          <div class="live-title">${item.title}</div>
          <div class="live-meta">🕐 ${item.date} · 讲师：${item.speaker}</div>
        </div>
      </a>
    `;
  });
  const moreLiveLink = document.getElementById('moreLiveLink');
  if (guide.moreLiveLink && moreLiveLink) moreLiveLink.href = guide.moreLiveLink;
}

// ===== Render: Rank =====
function renderRank() {
  const rank = siteData.rank || {};
  function renderRankList(containerId, data, unit) {
    const el = document.getElementById(containerId);
    (data || []).forEach(item => {
      el.innerHTML += `
        <div class="rank-item">
          <div class="rank-num">${item.rank}</div>
          <div class="rank-name">${item.name}</div>
          <div class="rank-score">${typeof item.score === 'number' ? item.score.toLocaleString() + (unit || '') : item.score}</div>
        </div>
      `;
    });
  }
  renderRankList('tokenRankList', rank.tokenRank, '');
  renderRankList('caseRankList', rank.caseRank, ' 个案例');
  renderRankList('studyRankList', rank.studyRank);
  renderRankList('certRankList', rank.certRank);
  const battleList = document.getElementById('battleList');
  (rank.battleReports || []).forEach(item => {
    battleList.innerHTML += `
      <div class="battle-item">
        <div class="battle-icon">🏅</div>
        <div class="battle-info">
          <div class="battle-title">${item.title}</div>
          <div class="battle-meta">${item.date}</div>
        </div>
        <div class="battle-amount">${item.amount}</div>
      </div>
    `;
  });
}

// ===== Render: Feedback =====
function renderFeedback() {
  const messages = (siteData.feedback && siteData.feedback.messages) || [];
  const msgList = document.getElementById('msgList');
  messages.forEach(item => {
    msgList.innerHTML += `
      <div class="msg-item">
        <div class="msg-header">
          <span class="msg-author">${item.author}</span>
          <span class="msg-date">${item.date}</span>
        </div>
        <div class="msg-content">${item.content}</div>
        <div class="msg-footer">
          <button class="btn-like" onclick="handleLike(this, ${item.likes})">❤️ ${item.likes}</button>
        </div>
      </div>
    `;
  });
}

// ===== Mobile Navigation =====
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  const btn = document.getElementById('hamburgerBtn');
  nav.classList.toggle('show');
  overlay.classList.toggle('show');
  btn.classList.toggle('open');
}

function mobileNavTo(tab) {
  const btn = document.querySelector('.pill-btn[data-tab="' + tab + '"]');
  if (btn) btn.click();
  // Update mobile nav active state
  document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.mobile-nav-btn[data-tab="' + tab + '"]').classList.add('active');
  toggleMobileNav();
}

// ===== 客户分析报告（多模型Tab切换）=====
// Markdown 格式指令，附加到前端请求确保 AI 返回格式化内容
const MD_FORMAT_HINT_CUSTOMER = '\n\n【输出格式要求】请严格使用Markdown格式输出，确保层级分明、重点突出：\n' +
  '- 使用 # 作为一级标题（如 # 输出1：云+AI预算评估）\n' +
  '- 使用 ## 作为二级标题（如 ## 1. 客户业务概况）\n' +
  '- 使用 ### 作为三级子标题\n' +
  '- 使用 **加粗** 突出关键数据和结论\n' +
  '- 使用 - 作为无序列表，1. 2. 作为有序列表\n' +
  '- 多维度对比内容使用Markdown表格（| 列1 | 列2 |）\n' +
  '请务必在每个章节标题前加 # 或 ## 符号，不要输出纯文本。';

const MD_FORMAT_HINT_VISIT = '\n\n【输出格式要求】请严格使用Markdown格式输出：\n' +
  '- 使用 ## 作为每个章节标题（如 ## 一、拜访目标）\n' +
  '- 使用 ### 作为子标题\n' +
  '- 使用 **加粗** 突出关键信息\n' +
  '- 使用 - 作为无序列表，1. 2. 作为有序列表\n' +
  '- 信息获取、会议议程等使用Markdown表格（| 列1 | 列2 |）\n' +
  '请务必在每个章节标题前加 ## 符号，不要输出纯文本。';

function handleCustomerAnalysis() {
  const val = document.getElementById('analysisInput').value.trim();
  if (!val) { showToast('请输入客户名称'); return; }

  // 读取选中的模型
  const checked = document.querySelectorAll('input[name="analysisModel"]:checked');
  const selectedModels = Array.from(checked).map(cb => cb.value);
  if (selectedModels.length === 0) { showToast('请至少选择一个AI模型'); return; }

  const outputDiv = document.getElementById('customerOutput');
  const contentDiv = document.getElementById('customerOutputContent');
  outputDiv.classList.add('show');

  // 构建Tab切换布局（单宫格）
  contentDiv.innerHTML =
    '<div class="output-tabs" id="customerOutputTabs">' +
      selectedModels.map((m, i) =>
        '<button class="output-tab' + (i === 0 ? ' active' : '') + '" data-model="' + m + '" onclick="switchOutputTab(\'customer\', \'' + m + '\')">' +
          '<span class="output-tab-name">' + (MODEL_LABELS[m] || m) + '</span>' +
          '<span class="output-tab-status" id="status-customer-' + m + '">⏳ 生成中</span>' +
        '</button>'
      ).join('') +
    '</div>' +
    '<div class="output-panels" id="customerOutputPanels">' +
      selectedModels.map((m, i) =>
        '<div class="output-panel' + (i === 0 ? ' active' : '') + '" id="panel-customer-' + m + '">' +
          '<span class="spinner"></span> AI正在分析中，请稍候...' +
        '</div>'
      ).join('') +
    '</div>';

  // 并行调用所有选中的模型
  selectedModels.forEach(m => {
    callAI('customer_analysis', { customerName: val + MD_FORMAT_HINT_CUSTOMER }, m)
      .then(result => {
        document.getElementById('panel-customer-' + m).innerHTML = formatAIOutput(result.content);
        const statusEl = document.getElementById('status-customer-' + m);
        statusEl.textContent = '✅ 已完成';
        statusEl.className = 'output-tab-status done';
      })
      .catch(err => {
        document.getElementById('panel-customer-' + m).innerHTML = '<div style="color:#ef4444;">⚠ 调用失败：' + escapeHtml(err.message) + '</div>';
        const statusEl = document.getElementById('status-customer-' + m);
        statusEl.textContent = '❌ 失败';
        statusEl.className = 'output-tab-status error';
      });
  });
}

function handleVisitPlan() {
  const activeScene = document.querySelector('.scene-btn.active');
  if (!activeScene) return;
  const scene = activeScene.dataset.scene;
  const form = document.getElementById('form-' + scene);
  const roleSelect = document.getElementById('visitRole');
  const inputs = form.querySelectorAll('input, select');
  let valid = true;
  if (!roleSelect.value.trim()) { valid = false; roleSelect.style.borderColor = '#f87171'; }
  else { roleSelect.style.borderColor = ''; }
  inputs.forEach(inp => {
    if (!inp.value.trim()) { valid = false; inp.style.borderColor = '#f87171'; }
    else { inp.style.borderColor = ''; }
  });
  if (!valid) { showToast('请填写所有必填项'); return; }

  // 读取选中的模型
  const checked = document.querySelectorAll('input[name="visitModel"]:checked');
  const selectedModels = Array.from(checked).map(cb => cb.value);
  if (selectedModels.length === 0) { showToast('请至少选择一个AI模型'); return; }

  const outputDiv = document.getElementById('visitOutput');
  const contentDiv = document.getElementById('visitOutputContent');
  outputDiv.classList.add('show');

  const details = Array.from(inputs).map(inp => {
    const label = inp.closest('.form-group')?.querySelector('label')?.textContent || '';
    return label.replace(' *', '') + '：' + inp.value;
  }).join('\n');

  // 构建Tab切换布局（单宫格）
  contentDiv.innerHTML =
    '<div class="output-tabs" id="visitOutputTabs">' +
      selectedModels.map((m, i) =>
        '<button class="output-tab' + (i === 0 ? ' active' : '') + '" data-model="' + m + '" onclick="switchOutputTab(\'visit\', \'' + m + '\')">' +
          '<span class="output-tab-name">' + (MODEL_LABELS[m] || m) + '</span>' +
          '<span class="output-tab-status" id="status-visit-' + m + '">⏳ 生成中</span>' +
        '</button>'
      ).join('') +
    '</div>' +
    '<div class="output-panels" id="visitOutputPanels">' +
      selectedModels.map((m, i) =>
        '<div class="output-panel' + (i === 0 ? ' active' : '') + '" id="panel-visit-' + m + '">' +
          '<span class="spinner"></span> AI教练正在生成计划...' +
        '</div>'
      ).join('') +
    '</div>';

  // 并行调用所有选中的模型
  selectedModels.forEach(m => {
    callAI('visit_plan', { scene, role: roleSelect.value, details: details + MD_FORMAT_HINT_VISIT }, m)
      .then(result => {
        document.getElementById('panel-visit-' + m).innerHTML = formatAIOutput(result.content);
        const statusEl = document.getElementById('status-visit-' + m);
        statusEl.textContent = '✅ 已完成';
        statusEl.className = 'output-tab-status done';
      })
      .catch(err => {
        document.getElementById('panel-visit-' + m).innerHTML = '<div style="color:#ef4444;">⚠ 调用失败：' + escapeHtml(err.message) + '</div>';
        const statusEl = document.getElementById('status-visit-' + m);
        statusEl.textContent = '❌ 失败';
        statusEl.className = 'output-tab-status error';
      });
  });
}

// ===== Tab切换输出面板 =====
function switchOutputTab(prefix, model) {
  // 更新Tab按钮状态
  const tabsContainer = document.getElementById(prefix + 'OutputTabs');
  tabsContainer.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
  tabsContainer.querySelector('.output-tab[data-model="' + model + '"]').classList.add('active');
  // 更新面板显示
  const panelsContainer = document.getElementById(prefix + 'OutputPanels');
  panelsContainer.querySelectorAll('.output-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + prefix + '-' + model).classList.add('active');
}

function handleFeedback() {
  const content = document.getElementById('feedbackContent').value.trim();
  if (!content) { showToast('请输入反馈内容'); return; }
  const name = document.getElementById('feedbackName').value.trim() || '匿名伙伴';
  const company = document.getElementById('feedbackCompany').value.trim();
  const author = company ? name + ' · ' + company : name;
  const today = new Date().toISOString().split('T')[0];
  const msgList = document.getElementById('msgList');
  const newMsg = document.createElement('div');
  newMsg.className = 'msg-item';
  newMsg.innerHTML = `
    <div class="msg-header">
      <span class="msg-author">${author}</span>
      <span class="msg-date">${today}</span>
    </div>
    <div class="msg-content">${escapeHtml(content)}</div>
    <div class="msg-footer">
      <button class="btn-like" onclick="handleLike(this, 0)">❤️ 0</button>
    </div>
  `;
  msgList.insertBefore(newMsg, msgList.firstChild);
  document.getElementById('feedbackContent').value = '';
  document.getElementById('feedbackName').value = '';
  document.getElementById('feedbackCompany').value = '';
  showToast('感谢反馈！已通知管理员');
  sendFeedbackToAdmin(author, content);
}

function handleLike(btn, currentLikes) {
  if (btn.dataset.liked) return;
  btn.dataset.liked = '1';
  btn.textContent = '❤️ ' + (currentLikes + 1);
  btn.style.background = 'rgba(239,68,68,0.2)';
}

// ===== AI API Call =====
const MODEL_LABELS = {
  qwen35plus: 'Qwen3.5-Plus',
  qwenmax:    'Qwen-Max',
  kimi:       'Kimi-K2.5',
  minimax:    'MiniMax-M2.5',
};

// 格式化AI输出内容
// 优先使用 marked.js，否则使用内置简易 Markdown 渲染器
function formatAIOutput(content) {
  if (!content) return '';

  // 优先使用 marked 库（如果加载成功）
  if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
    try {
      var rendered = marked.parse(content);
      console.log('[formatAIOutput] 使用 marked.js 渲染');
      return '<div class="ai-markdown-output">' + rendered + '</div>';
    } catch (e) {
      console.error('[formatAIOutput] marked.parse 出错, 降级到内置渲染:', e);
    }
  } else {
    console.log('[formatAIOutput] marked.js 未加载, 使用内置渲染器');
  }

  // 内置简易 Markdown 渲染器（不依赖外部库）
  return '<div class="ai-markdown-output">' + simpleMarkdownRender(content) + '</div>';
}

// ===== 内置简易 Markdown 渲染器 =====
function simpleMarkdownRender(text) {
  if (!text) return '';
  var lines = text.split('\n');
  var html = [];
  var inUl = false, inOl = false, inTable = false, isFirstTableRow = true;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var trimmed = line.trim();

    // 空行：关闭打开的块元素
    if (!trimmed) {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
      if (inTable) { html.push('</tbody></table>'); inTable = false; isFirstTableRow = true; }
      continue;
    }

    // 表格：以 | 开头和结尾
    if (trimmed.charAt(0) === '|' && trimmed.charAt(trimmed.length - 1) === '|') {
      // 跳过分隔行 |---|---|
      if (/^\|[\s\-:|\s]+\|$/.test(trimmed)) continue;
      var cells = trimmed.slice(1, -1).split('|');
      if (!inTable) {
        // 第一行作为表头
        html.push('<table><thead><tr>');
        for (var c = 0; c < cells.length; c++) {
          html.push('<th>' + mdInline(cells[c].trim()) + '</th>');
        }
        html.push('</tr></thead><tbody>');
        inTable = true;
        isFirstTableRow = false;
        continue;
      }
      html.push('<tr>');
      for (var c = 0; c < cells.length; c++) {
        html.push('<td>' + mdInline(cells[c].trim()) + '</td>');
      }
      html.push('</tr>');
      continue;
    }
    // 非表格行时关闭表格
    if (inTable) { html.push('</tbody></table>'); inTable = false; isFirstTableRow = true; }

    // 标题：# ## ### #### ##### ######
    var hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
      var lvl = hMatch[1].length;
      html.push('<h' + lvl + '>' + mdInline(hMatch[2]) + '</h' + lvl + '>');
      continue;
    }

    // 水平线
    if (/^[-*_]{3,}\s*$/.test(trimmed)) {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
      html.push('<hr>');
      continue;
    }

    // 无序列表：- 或 * 或 + 开头
    if (/^[-*+]\s+/.test(trimmed)) {
      if (inOl) { html.push('</ol>'); inOl = false; }
      if (!inUl) { html.push('<ul>'); inUl = true; }
      html.push('<li>' + mdInline(trimmed.replace(/^[-*+]\s+/, '')) + '</li>');
      continue;
    }

    // 有序列表：数字. 开头
    if (/^\d+\.\s+/.test(trimmed)) {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (!inOl) { html.push('<ol>'); inOl = true; }
      html.push('<li>' + mdInline(trimmed.replace(/^\d+\.\s+/, '')) + '</li>');
      continue;
    }

    // 引用：> 开头
    if (trimmed.charAt(0) === '>') {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
      html.push('<blockquote>' + mdInline(trimmed.replace(/^>\s*/, '')) + '</blockquote>');
      continue;
    }

    // 关闭列表
    if (inUl) { html.push('</ul>'); inUl = false; }
    if (inOl) { html.push('</ol>'); inOl = false; }

    // 普通段落
    html.push('<p>' + mdInline(trimmed) + '</p>');
  }

  // 关闭尾部未关闭的块
  if (inUl) html.push('</ul>');
  if (inOl) html.push('</ol>');
  if (inTable) html.push('</tbody></table>');

  return html.join('\n');
}

// 行内 Markdown 格式化：加粗、斜体、行内代码
function mdInline(text) {
  if (!text) return '';
  // 转义 HTML 特殊字符
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // 行内代码 `code`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // 加粗 **text** 或 __text__
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // 斜体 *text* 或 _text_
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');
  return text;
}

async function callAI(type, input, model) {
  // 智能选择 API 端点
  // - 本地文件 (file://) 或 localhost：使用阿里云 FC
  // - Netlify 域名：使用 /api/ai-proxy
  const isLocal = window.location.protocol === 'file:' ||
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';

  const endpoints = isLocal ? [
    'https://ai-proxy-ejcdenashk.cn-beijing.fcapp.run'  // 本地：只用阿里云 FC
  ] : [
    '/api/ai-proxy',  // Netlify：优先使用 Edge Function
    'https://ai-proxy-ejcdenashk.cn-beijing.fcapp.run'  // 备用：阿里云 FC
  ];

  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      console.log(`[callAI] Trying endpoint: ${endpoint}`);
      console.log(`[callAI] Request body:`, { type, input, model: model || 'qwen35plus' });

      const resp = await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ type, input, model: model || 'qwen35plus' })
      });

      console.log(`[callAI] Response status: ${resp.status}`);
      console.log(`[callAI] Response headers:`, [...resp.headers.entries()]);

      const text = await resp.text();
      console.log(`[callAI] Raw response:`, text.substring(0, 500));

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('返回的不是有效JSON: ' + text.substring(0, 100));
      }

      if (!resp.ok || data.error) throw new Error(data.error || '请求失败');
      return { content: data.content, model: data.model };
    } catch (err) {
      lastError = err;
      console.error(`[callAI] Endpoint ${endpoint} failed:`, err.message);
      continue; // 尝试下一个端点
    }
  }
  throw lastError || new Error('所有AI端点均不可用');
}

// ===== Helpers =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function sendFeedbackToAdmin(author, content) {
  console.log('[Feedback]', author, content);
}

// ===== Offline AI Templates (fallback) =====
function generateCustomerReport(name) {
  return '📊 ' + name + ' — AI潜力评估报告（离线模板）\n\n' +
    '一、客户业务概况\n  • 商业模式：待补充\n  • 核心客户群体：待调研\n\n' +
    '二、关键行业趋势\n  1. AI大模型规模化落地\n  2. 云原生架构演进\n\n' +
    '三、机会与挑战\n  机会：AI赋能业务流程\n  挑战：数字化人才储备\n\n' +
    '⚠ 部署到 Netlify 并配置 API Key 后即可使用 AI 实时生成报告。';
}

function generateVisitPlan(scene, form, role) {
  const sceneLabels = { first: '首次拜访', progress: '商机推进', executive: '高层拜访' };
  return '🎯 ' + (sceneLabels[scene] || '客户拜访') + '计划（离线模板）\n\n' +
    '一、拜访目标：认知塑造与教育\n\n' +
    '二、客户行动承诺\n  最高：客户同意安排POC测试\n  最低：客户同意参加下次技术交流会\n\n' +
    '三、信息获取\n  1. 决策链路\n  2. 预算状况\n\n' +
    '⚠ 部署到 Netlify 并配置 API Key 后即可使用 AI 实时生成拜访计划。';
}
