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
        "title": "客户洞察",
        "desc": "深度洞察客户商业信息",
        "icon": "🔍",
        "link": "http://8.137.89.236/"
      },
      {
        "title": "伙伴展业常见问题",
        "desc": "展业常见问题解答汇总",
        "icon": "❓",
        "link": "https://alidocs.dingtalk.com/i/nodes/0eMKjyp813y4eq01CKKMw6ygVxAZB1Gv"
      }
    ],
    "knowledge": [],
    "knowledgeBaseLink": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview",
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
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
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
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
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
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
      },
      {
        "id": "ecommerce",
        "icon": "🛒",
        "name": "赛道4 · 电商/跨境电商",
        "desc": "AI赋能电商与跨境电商全链路，从智能选品、内容生成到客服运营，助力商家降本增效出海",
        "scenarios": [
          "AI商品图与商品视频生成",
          "AI智能选品与市场趋势分析",
          "商品自动上架与多语言文案生成（标题/详情）",
          "智能客服与多语言售后支持",
          "商品图侵权检测与跨境合规智能报关"
        ],
        "products": [
          "通义千问API",
          "机器翻译",
          "智能客服",
          "向量检索服务"
        ],
        "cases": "跨境电商客户接入AI多语言客服后，客服响应效率提升60%，人力成本降低40%",
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
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
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
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
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
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
  initSiteStats();
  renderHome();
  renderWeapons();
  renderMaas();
  renderRank();
  renderStats();
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
// 格式提示已移至后端 systemPrompt，前端不再重复追加（减少 token 消耗，加快响应）

function handleCustomerAnalysis() {
  const val = document.getElementById('analysisInput').value.trim();
  if (!val) { showToast('请输入客户公司全称'); return; }
  const productName = (document.getElementById('analysisProduct') || {}).value || '';
  const website = (document.getElementById('analysisWebsite') || {}).value || '';

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

  var inputPayload = { customerName: val, productName: productName.trim(), website: website.trim() };

  // 错开调用各模型（间隔6秒，避免触发百炼API并发限流）
  selectedModels.forEach((m, index) => {
    setTimeout(() => {
      const panelId = 'panel-customer-' + m;
      const statusId = 'status-customer-' + m;
      const fileName = '客户分析报告_' + val + '_' + (MODEL_LABELS[m] || m);
      const retryKey = 'customer_' + m + '_' + Date.now();
      const reportTitle = '【' + val + '】客户分析报告';
      _retryRegistry[retryKey] = { type: 'customer_analysis', input: inputPayload, model: m, panelId: panelId, statusId: statusId, fileName: fileName, reportTitle: reportTitle };

      callWithRetry('customer_analysis', inputPayload, m, panelId, statusId)
        .then(() => {
          const statusEl = document.getElementById(statusId);
          if (statusEl) { statusEl.textContent = '✅ 已完成'; statusEl.className = 'output-tab-status done'; }
          insertExportToolbar(panelId, fileName);
          injectReportTitle(panelId, reportTitle);
          delete _retryRegistry[retryKey];
        })
        .catch(err => {
          renderFailPanel(panelId, statusId, err.message, retryKey);
        });
    }, index * 6000);
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

  // 错开调用各模型（间隔6秒，避免触发百炼API并发限流）
  const sceneLabels = { first: '首次拜访', progress: '商机推进', executive: '高层拜访' };
  const sceneName = sceneLabels[scene] || '客户拜访';
  const firstInputVal = inputs.length > 0 ? inputs[0].value.trim() : '';

  selectedModels.forEach((m, index) => {
    setTimeout(() => {
      const panelId = 'panel-visit-' + m;
      const statusId = 'status-visit-' + m;
      const fileName = '拜访计划_' + (MODEL_LABELS[m] || m);
      const retryKey = 'visit_' + m + '_' + Date.now();
      const reportTitle = firstInputVal + ' ' + sceneName + ' 拜访计划';
      _retryRegistry[retryKey] = { type: 'visit_plan', input: { scene, role: roleSelect.value, details: details }, model: m, panelId: panelId, statusId: statusId, fileName: fileName, reportTitle: reportTitle };

      callWithRetry('visit_plan', { scene, role: roleSelect.value, details: details }, m, panelId, statusId)
        .then(() => {
          const statusEl = document.getElementById(statusId);
          if (statusEl) { statusEl.textContent = '✅ 已完成'; statusEl.className = 'output-tab-status done'; }
          insertExportToolbar(panelId, fileName);
          injectReportTitle(panelId, reportTitle);
          delete _retryRegistry[retryKey];
        })
        .catch(err => {
          renderFailPanel(panelId, statusId, err.message, retryKey);
        });
    }, index * 6000);
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
  const company = document.getElementById('feedbackCompany').value.trim();
  if (!company) { showToast('请输入所属伙伴公司'); return; }
  const name = document.getElementById('feedbackName').value.trim() || '匿名伙伴';
  const author = name + ' · ' + company;
  document.getElementById('feedbackContent').value = '';
  document.getElementById('feedbackName').value = '';
  document.getElementById('feedbackCompany').value = '';
  showToast('感谢反馈！已通知管理员');
  sendFeedbackToAdmin(author, content);
}

// ===== AI API Call =====
const MODEL_LABELS = {
  qwen35plus: 'Qwen3.5-Plus',
  qwenmax:    'Qwen-Max',
  kimi:       'Kimi-K2.5',
  deepseek:   'DeepSeek-V3',
};

// 格式化AI输出内容
// 优先使用 marked.js，否则使用内置简易 Markdown 渲染器
// ===== 清理模型输出内容 =====
// 1. 去除思考过程（正文第一个 # 标题之前的内容）
// 2. 去除工具调用标签（<tool_code>、<tool_call>、<minimax:tool_call> 等）
function cleanAIContent(text) {
  if (!text) return text;
  // 去除工具调用标签
  text = text.replace(/<\/?minimax:tool_call>/g, '');
  text = text.replace(/<invoke\s+name="[^"]*">/g, '');
  text = text.replace(/<\/invoke>/g, '');
  text = text.replace(/<parameter\s+name="[^"]*">[^<]*<\/parameter>/g, '');
  text = text.replace(/<\|plugin\|>[\s\S]*?<\|\/plugin\|>/g, '');
  text = text.replace(/<tool_call>[\s\S]*?<\/tool_call>/g, '');
  text = text.replace(/<function_call>[\s\S]*?<\/function_call>/g, '');
  text = text.replace(/<tool_code>[\s\S]*?<\/tool_code>/g, '');
  text = text.replace(/<tool_code>[\s\S]*$/g, '');
  text = text.replace(/<query>[^<]*<\/query>/g, '');
  // 去除思考过程：找到第一个 Markdown 标题，去掉前面的文字
  var headingMatch = text.match(/(^|\n)(#{1,2}\s+.+)/);
  if (headingMatch && headingMatch.index !== undefined) {
    var preambleEnd = headingMatch.index + (headingMatch[1] === '\n' ? 1 : 0);
    var preamble = text.substring(0, preambleEnd);
    if (preamble.trim().length > 15) {
      text = text.substring(preambleEnd);
    }
  }
  return text.trim();
}

function formatAIOutput(content) {
  if (!content) return '';

  // 先清理思考过程和工具标签
  content = cleanAIContent(content);

  // 优先使用 marked 库（如果加载成功）
  if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
    try {
      var rendered = marked.parse(content);
      return '<div class="ai-markdown-output">' + rendered + '</div>';
    } catch (e) {
      console.error('[formatAIOutput] marked.parse 出错, 降级到内置渲染:', e);
    }
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

// ===== 自动重试包装器 =====
// 对 callAIStream 做顶层重试：失败后等待 delay 再试，最多 maxRetries 次
var _retryRegistry = {}; // 存储重试参数，避免 onclick 中复杂的 JSON 转义

async function callWithRetry(type, input, model, panelId, statusId, maxRetries, delay) {
  maxRetries = maxRetries || 2;
  delay = delay || 8000;
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const statusEl = document.getElementById(statusId);
        if (statusEl) { statusEl.textContent = '⏳ 重试中(' + attempt + '/' + maxRetries + ')'; statusEl.className = 'output-tab-status'; }
        const panelEl = document.getElementById(panelId);
        if (panelEl) panelEl.innerHTML = '<span class="spinner"></span> 第' + (attempt + 1) + '次尝试，请稍候...';
        console.log('[callWithRetry] model=' + model + ' retry ' + attempt + '/' + maxRetries + ', waiting ' + delay + 'ms');
        await new Promise(r => setTimeout(r, delay));
      }
      return await callAIStream(type, input, model, panelId);
    } catch (err) {
      lastError = err;
      console.error('[callWithRetry] model=' + model + ' attempt=' + attempt + ' failed:', err.message);
    }
  }
  throw lastError || new Error('所有重试均失败');
}

// 渲染失败面板（含重试按钮）
function renderFailPanel(panelId, statusId, errMsg, retryKey) {
  const panel = document.getElementById(panelId);
  const friendlyMsg = friendlyError(errMsg);
  if (panel) {
    panel.innerHTML = '<div style="color:#ef4444;">⚠ ' + escapeHtml(friendlyMsg) + '</div>' +
      '<button class="retry-btn" onclick="retryModel(\'' + retryKey + '\')">🔄 重试该模型</button>';
  }
  const statusEl = document.getElementById(statusId);
  if (statusEl) { statusEl.textContent = '❌ 失败'; statusEl.className = 'output-tab-status error'; }
}

// 手动重试按钮回调
function retryModel(retryKey) {
  var params = _retryRegistry[retryKey];
  if (!params) { showToast('重试参数丢失，请重新提交'); return; }
  var type = params.type, input = params.input, model = params.model;
  var panelId = params.panelId, statusId = params.statusId, fileName = params.fileName;

  const statusEl = document.getElementById(statusId);
  if (statusEl) { statusEl.textContent = '⏳ 重试中'; statusEl.className = 'output-tab-status'; }
  const panelEl = document.getElementById(panelId);
  if (panelEl) panelEl.innerHTML = '<span class="spinner"></span> 正在重试...';

  callWithRetry(type, input, model, panelId, statusId, 2, 5000)
    .then(function() {
      if (statusEl) { statusEl.textContent = '✅ 已完成'; statusEl.className = 'output-tab-status done'; }
      insertExportToolbar(panelId, fileName);
      if (params.reportTitle) injectReportTitle(panelId, params.reportTitle);
    })
    .catch(function(err) {
      renderFailPanel(panelId, statusId, err.message, retryKey);
    });
}

// ===== 流式 AI 调用（SSE）=====
// 流式调用：内容逐步显示，大幅降低等待时间
// onChunk(content) 在每次收到新内容时调用
async function callAIStream(type, input, model, panelId) {
  const isLocal = window.location.protocol === 'file:' ||
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';

  // 流式只支持 Netlify Edge Function，本地走非流式
  const streamEndpoint = isLocal ? null : '/api/ai-proxy';
  const fallbackEndpoints = isLocal ? [
    'https://ai-proxy-ejcdenashk.cn-beijing.fcapp.run'
  ] : [
    'https://ai-proxy-ejcdenashk.cn-beijing.fcapp.run'
  ];

  const panelEl = document.getElementById(panelId);

  // 尝试流式调用
  if (streamEndpoint) {
    try {
      console.log(`[stream] model=${model} endpoint=${streamEndpoint}`);
      // 流式超时 120s（千问模型首 token 延迟可达 30-40s）
      const streamCtrl = new AbortController();
      const streamTimeout = setTimeout(() => streamCtrl.abort(), 120000);
      const resp = await fetch(streamEndpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify({ type, input, model: model || 'qwen35plus', stream: true }),
        signal: streamCtrl.signal
      });

      if (!resp.ok) {
        const errText = await resp.text();
        let errMsg = '请求失败 HTTP ' + resp.status;
        try { const j = JSON.parse(errText); errMsg = j.error || errMsg; } catch(e) {}
        throw new Error(errMsg);
      }

      // 读取 SSE 流
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';
      let renderTimer = null;

      // 节流渲染：最多每200ms渲染一次
      function scheduleRender() {
        if (renderTimer) return;
        renderTimer = setTimeout(() => {
          renderTimer = null;
          if (panelEl) panelEl.innerHTML = formatAIOutput(fullContent);
        }, 200);
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.type === 'chunk' && data.content) {
                fullContent += data.content;
                scheduleRender();
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch (e) {
              if (e.message && !e.message.includes('JSON')) throw e;
            }
          }
        }
      }

      // 最终完整渲染
      clearTimeout(streamTimeout);
      if (renderTimer) { clearTimeout(renderTimer); renderTimer = null; }
      if (!fullContent) throw new Error('未收到有效内容');
      if (panelEl) panelEl.innerHTML = formatAIOutput(fullContent);
      if (typeof incrementAICalls === 'function') incrementAICalls();
      return { content: fullContent, model: model };
    } catch (err) {
      console.error(`[stream] 流式调用失败:`, err.message, '降级到非流式');
      // 流式失败，降级到非流式 fallback
    }
  }

  // 非流式 fallback（本地 file:// 或流式失败时）
  const MAX_RETRIES = 2;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    let lastError = null;
    for (const endpoint of fallbackEndpoints) {
      try {
        console.log(`[callAI] attempt=${attempt} model=${model} endpoint=${endpoint}`);
        if (panelEl) panelEl.innerHTML = '<span class="spinner"></span> AI正在生成中（非流式模式）...';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 150000);

        const resp = await fetch(endpoint, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ type, input, model: model || 'qwen35plus' }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const text = await resp.text();
        let data;
        try { data = JSON.parse(text); } catch (e) {
          throw new Error('返回的不是有效JSON: ' + text.substring(0, 100));
        }
        if (!resp.ok || data.error) throw new Error(data.error || '请求失败 HTTP ' + resp.status);
        if (panelEl) panelEl.innerHTML = formatAIOutput(data.content);
        if (typeof incrementAICalls === 'function') incrementAICalls();
        return { content: data.content, model: data.model };
      } catch (err) {
        lastError = err;
        console.error(`[callAI] Endpoint ${endpoint} failed:`, err.message);
        continue;
      }
    }
    attempt++;
    if (attempt <= MAX_RETRIES) {
      console.log(`[callAI] 所有端点失败，3秒后重试 (${attempt}/${MAX_RETRIES})...`);
      await new Promise(r => setTimeout(r, 3000));
    } else {
      throw lastError || new Error('所有AI端点均不可用');
    }
  }
}

// ===== 导出功能（Word / PDF）=====
// Word 导出用的自包含样式（硬编码颜色，不依赖 CSS 变量）
var EXPORT_STYLES =
  'body{font-family:"Microsoft YaHei","PingFang SC",sans-serif;padding:32px 40px;color:#222;line-height:1.8;max-width:800px;margin:0 auto;}' +
  'h1{font-size:20px;font-weight:700;color:#4f46e5;border-bottom:2px solid #4f46e5;padding-bottom:6px;margin:28px 0 14px;}' +
  'h2{font-size:17px;font-weight:700;color:#6d28d9;margin:22px 0 10px;}' +
  'h3{font-size:15px;font-weight:700;color:#333;margin:16px 0 8px;}' +
  'h4,h5,h6{font-size:14px;font-weight:700;color:#444;margin:12px 0 6px;}' +
  'p{margin:4px 0 8px;}' +
  'table{border-collapse:collapse;width:100%;margin:12px 0;font-size:13px;}' +
  'th{background:#f3f0ff;color:#4f46e5;padding:8px 10px;border:1px solid #ddd;text-align:left;font-weight:700;}' +
  'td{padding:8px 10px;border:1px solid #ddd;}' +
  'tr:nth-child(even){background:#fafafa;}' +
  'ul,ol{padding-left:20px;margin:8px 0;}' +
  'li{margin:4px 0;}' +
  'strong,b{font-weight:700;color:#1a1a2e;}' +
  'blockquote{border-left:3px solid #7c3aed;padding:8px 16px;margin:10px 0;background:#f9f7ff;color:#555;}' +
  'code{background:#f0f0f5;padding:2px 6px;border-radius:3px;font-size:0.9em;}' +
  'pre{background:#f5f5f5;padding:12px;border-radius:6px;overflow-x:auto;font-size:0.85em;}' +
  'hr{border:none;border-top:1px solid #e5e5e5;margin:20px 0;}' +
  'a{color:#4f46e5;text-decoration:underline;}';

// 获取面板中 AI 输出的 HTML 正文内容
function getExportContent(panelId) {
  var panel = document.getElementById(panelId);
  if (!panel) return '';
  // 优先取 .ai-markdown-output 中的内容
  var contentEl = panel.querySelector('.ai-markdown-output');
  if (contentEl && contentEl.innerHTML.trim()) {
    var clone = contentEl.cloneNode(true);
    var toggleBtn = clone.querySelector('.collapse-toggle-all');
    if (toggleBtn) toggleBtn.remove();
    return clone.innerHTML;
  }
  // 降级：克隆整个面板，移除工具栏后取 innerHTML
  var clone = panel.cloneNode(true);
  var tb = clone.querySelector('.export-toolbar');
  if (tb) tb.remove();
  var spinner = clone.querySelector('.spinner');
  if (spinner) spinner.remove();
  return clone.innerHTML.trim();
}

// 在指定面板底部插入导出工具栏
function insertExportToolbar(panelId, fileName) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  // 防止重复插入
  if (panel.querySelector('.export-toolbar')) return;
  var toolbar = document.createElement('div');
  toolbar.className = 'export-toolbar';
  toolbar.innerHTML =
    '<button class="btn-export" onclick="exportToWord(\'' + panelId + '\', \'' + fileName.replace(/'/g, "\\'") + '\')">📄 导出 Word</button>' +
    '<button class="btn-export" onclick="exportToPDF(\'' + panelId + '\', \'' + fileName.replace(/'/g, "\\'") + '\')">📑 导出 PDF</button>';
  panel.appendChild(toolbar);
  // 插入导出工具栏后，添加折叠功能
  addCollapsibleSections(panelId);
}

// ===== 报告章节折叠/展开功能 =====
// 将 h1 标题变为可点击的折叠控件，点击后折叠/展开该章节的内容

// 在报告顶部注入居中总标题
function injectReportTitle(panelId, title) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  var mdOutput = panel.querySelector('.ai-markdown-output');
  if (!mdOutput) return;
  // 防止重复注入
  if (mdOutput.querySelector('.report-main-title')) return;
  var titleEl = document.createElement('div');
  titleEl.className = 'report-main-title';
  titleEl.textContent = title;
  mdOutput.insertBefore(titleEl, mdOutput.firstChild);
}

function addCollapsibleSections(panelId) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  var mdOutput = panel.querySelector('.ai-markdown-output');
  if (!mdOutput) return;
  // 防止重复处理
  if (mdOutput.dataset.collapsible === 'true') return;
  mdOutput.dataset.collapsible = 'true';

  // 自动检测顶层标题级别：客户分析用 h1，拜访计划用 h2
  var headings = mdOutput.querySelectorAll('h1');
  var headingTag = 'H1';
  if (headings.length === 0) {
    headings = mdOutput.querySelectorAll('h2');
    headingTag = 'H2';
  }
  if (headings.length === 0) return;

  // 对每个顶层标题，收集它后面到下一个同级标题之间的所有元素，包裹在一个 section 中
  for (var i = 0; i < headings.length; i++) {
    var heading = headings[i];
    // 添加折叠指示器和样式
    heading.classList.add('collapsible-header');
    heading.setAttribute('title', '点击折叠/展开');
    // 创建展开/折叠指示器
    var indicator = document.createElement('span');
    indicator.className = 'collapse-indicator';
    indicator.textContent = '▼';
    heading.insertBefore(indicator, heading.firstChild);

    // 创建内容包裹容器
    var section = document.createElement('div');
    section.className = 'collapsible-section';

    // 收集标题后面到下一个同级标题之间的所有兄弟节点
    var next = heading.nextSibling;
    while (next) {
      var current = next;
      next = current.nextSibling;
      // 遇到下一个同级标题就停止
      if (current.nodeType === 1 && current.tagName === headingTag) break;
      section.appendChild(current);
    }

    // 将 section 插入到标题后面
    heading.parentNode.insertBefore(section, heading.nextSibling);

    // 绑定点击事件
    (function(header, content, ind) {
      header.addEventListener('click', function() {
        var isCollapsed = content.classList.toggle('collapsed');
        ind.textContent = isCollapsed ? '▶' : '▼';
        header.classList.toggle('is-collapsed', isCollapsed);
      });
    })(heading, section, indicator);
  }

  // 插入"全部折叠/全部展开"按钮
  var toggleBtn = document.createElement('button');
  toggleBtn.className = 'collapse-toggle-all';
  toggleBtn.innerHTML = '📖 全部折叠';
  toggleBtn.dataset.collapsed = 'false';

  var titleEl = mdOutput.querySelector('.report-main-title');
  if (titleEl && titleEl.nextSibling) {
    mdOutput.insertBefore(toggleBtn, titleEl.nextSibling);
  } else {
    mdOutput.insertBefore(toggleBtn, mdOutput.firstChild);
  }

  toggleBtn.addEventListener('click', function() {
    var sections = mdOutput.querySelectorAll('.collapsible-section');
    var headers = mdOutput.querySelectorAll('.collapsible-header');
    var shouldCollapse = toggleBtn.dataset.collapsed === 'false';

    for (var j = 0; j < sections.length; j++) {
      if (shouldCollapse) sections[j].classList.add('collapsed');
      else sections[j].classList.remove('collapsed');
    }
    for (var j = 0; j < headers.length; j++) {
      var ind = headers[j].querySelector('.collapse-indicator');
      if (ind) ind.textContent = shouldCollapse ? '▶' : '▼';
      if (shouldCollapse) headers[j].classList.add('is-collapsed');
      else headers[j].classList.remove('is-collapsed');
    }

    toggleBtn.dataset.collapsed = shouldCollapse ? 'true' : 'false';
    toggleBtn.innerHTML = shouldCollapse ? '📕 全部展开' : '📖 全部折叠';
  });
}

// 导出 Word（.doc 格式，Word 可直接打开的 HTML）
function exportToWord(panelId, fileName) {
  var content = getExportContent(panelId);
  if (!content) { showToast('没有可导出的内容'); return; }
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<style>' + EXPORT_STYLES + '</style></head><body>' +
    content + '</body></html>';
  var blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = (fileName || '报告') + '.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Word 文件已开始下载');
}

// 导出 PDF：使用 html2canvas 1.4.1 + jsPDF 2.5.1（独立组合，非 html2pdf.js）
function exportToPDF(panelId, fileName) {
  if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
    showToast('PDF 库尚未加载完成，请稍后重试');
    return;
  }

  var content = getExportContent(panelId);
  if (!content) { showToast('没有可导出的内容'); return; }

  // ——— 关键：用 iframe 创建完全隔离的渲染环境 ———
  // 这样 html2canvas 不会受到主页面 CSS 变量、overflow、z-index 等影响
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:0;top:0;width:800px;border:none;z-index:99999;opacity:1;background:#fff;';
  document.body.appendChild(iframe);

  var iDoc = iframe.contentDocument || iframe.contentWindow.document;
  iDoc.open();
  iDoc.write(
    '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' +
    'body{margin:0;padding:32px 40px;background:#fff;color:#222;' +
    'font-family:"Microsoft YaHei","PingFang SC","Segoe UI",sans-serif;' +
    'line-height:1.8;font-size:14px;}' +
    EXPORT_STYLES +
    '</style></head><body>' + content + '</body></html>'
  );
  iDoc.close();

  showToast('正在生成 PDF，请稍候...');

  // 等待 iframe 完成渲染
  setTimeout(function() {
    // 设置 iframe 高度匹配内容
    var bodyH = iDoc.body.scrollHeight;
    iframe.style.height = bodyH + 'px';

    // 用最新版 html2canvas 截图 iframe 内的 body
    html2canvas(iDoc.body, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 700,
      height: bodyH,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 800,
      windowHeight: bodyH,
      logging: false
    }).then(function(canvas) {
      // canvas → 多页 PDF
      var jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF('p', 'mm', 'a4');
      var pageW = 210, pageH = 297, margin = 15;
      var usableW = pageW - 2 * margin;
      var usableH = pageH - 2 * margin;
      var imgW = usableW;
      var imgH = (canvas.height / canvas.width) * imgW;
      var imgData = canvas.toDataURL('image/jpeg', 0.95);

      var heightLeft = imgH;
      var yOffset = margin;

      // 首页
      pdf.addImage(imgData, 'JPEG', margin, yOffset, imgW, imgH);
      heightLeft -= usableH;

      // 后续页
      while (heightLeft > 0) {
        pdf.addPage();
        yOffset = margin - (imgH - heightLeft);
        pdf.addImage(imgData, 'JPEG', margin, yOffset, imgW, imgH);
        heightLeft -= usableH;
      }

      pdf.save((fileName || '报告') + '.pdf');
      document.body.removeChild(iframe);
      showToast('PDF 文件已开始下载');
    }).catch(function(err) {
      document.body.removeChild(iframe);
      console.error('[PDF export] html2canvas error:', err);
      showToast('PDF 导出失败：' + err.message);
    });
  }, 600);
}

// ===== Helpers =====
// 将技术错误信息转为用户友好的提示
function friendlyError(msg) {
  if (!msg) return '未知错误，请重试';
  if (msg.includes('aborted') || msg.includes('abort'))
    return '模型响应超时，当前模型可能排队中，请稍后重试或换一个模型';
  if (msg.includes('429') || msg.includes('rate') || msg.includes('limit'))
    return 'API调用频率超限，请稍后再试';
  if (msg.includes('timeout') || msg.includes('超时'))
    return '请求超时，请稍后重试';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('网络'))
    return '网络连接失败，请检查网络后重试';
  return msg;
}
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
  const name = document.getElementById('feedbackName').value.trim() || '匿名伙伴';
  const company = document.getElementById('feedbackCompany').value.trim() || '';

  // 1) 尝试 Netlify Forms（部署到 Netlify 后自动生效）
  const formData = new URLSearchParams();
  formData.append('form-name', 'feedback');
  formData.append('name', name);
  formData.append('company', company);
  formData.append('content', content);

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  }).then(resp => {
    if (resp.ok) console.log('[Feedback] Netlify Forms 提交成功');
    else console.warn('[Feedback] Netlify Forms 提交失败:', resp.status);
  }).catch(err => {
    console.warn('[Feedback] Netlify Forms 不可用:', err.message);
  });

  // 2) 尝试 Edge Function 发送邮件
  const isLocal = window.location.protocol === 'file:';
  if (!isLocal) {
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, content, author })
    }).then(resp => resp.json()).then(data => {
      if (data.success) console.log('[Feedback] 邮件发送成功');
      else console.warn('[Feedback] 邮件发送失败:', data.error);
    }).catch(err => {
      console.warn('[Feedback] Edge Function 不可用:', err.message);
    });
  }
}

// ===== 网站活跃度统计 (服务端全局统计 — 所有用户汇总) =====
var _sessionStart = Date.now();
var _sessionTimer = null;
var _statsAPI = '/api/stats';
var _STATS_LOCAL_KEY = 'siteStats_local_v2';
var _serverAvailable = false; // 标记服务端是否可用
var _cachedStats = {
  today: { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 },
  week:  { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 },
  month: { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 },
  year:  { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 }
};

// ---- 时间周期 key（与服务端逻辑一致） ----
function _getTimeKeys() {
  var now = new Date();
  var y = now.getFullYear();
  var m = String(now.getMonth() + 1).padStart(2, '0');
  var d = String(now.getDate()).padStart(2, '0');
  // ISO week
  var tmp = new Date(now);
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
  var week1 = new Date(tmp.getFullYear(), 0, 4);
  var wn = 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return {
    day:   y + '-' + m + '-' + d,
    week:  y + '-W' + String(wn).padStart(2, '0'),
    month: y + '-' + m,
    year:  '' + y
  };
}

// ---- localStorage 本地统计 ----
function _loadLocalStats() {
  try {
    var s = localStorage.getItem(_STATS_LOCAL_KEY);
    if (s) return JSON.parse(s);
  } catch(e) {}
  return {};
}
function _saveLocalStats(store) {
  try { localStorage.setItem(_STATS_LOCAL_KEY, JSON.stringify(store)); } catch(e) {}
}

// 从本地统计构建与服务端相同格式的 stats 对象
function _buildLocalCachedStats() {
  var store = _loadLocalStats();
  var keys = _getTimeKeys();
  var EMPTY = { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 };
  return {
    today: store[keys.day]   || { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 },
    week:  store[keys.week]  || { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 },
    month: store[keys.month] || { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 },
    year:  store[keys.year]  || { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 }
  };
}

// 本地记录事件（各时间周期同步累加）
function _trackEventsLocally(events) {
  if (!events || events.length === 0) return;
  var store = _loadLocalStats();
  var keys = _getTimeKeys();
  var allKeys = [keys.day, keys.week, keys.month, keys.year];
  for (var k = 0; k < allKeys.length; k++) {
    var key = allKeys[k];
    if (!store[key]) store[key] = { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 };
    for (var i = 0; i < events.length; i++) {
      var evt = events[i];
      if (evt === 'visit') store[key].visits += 1;
      else if (evt === 'pageView') store[key].pageViews += 1;
      else if (evt === 'aiCall') store[key].aiCalls += 1;
      else if (typeof evt === 'string' && evt.indexOf('duration:') === 0) {
        store[key].duration += (parseInt(evt.split(':')[1], 10) || 0);
      }
    }
  }
  _saveLocalStats(store);
}

// ---- 服务端上报（POST 后直接从响应获取最新全局统计数据） ----
function _trackEvents(events) {
  if (!events || events.length === 0) return;
  // 本地缓冲（仅作为事件暂存，不用于渲染）
  _trackEventsLocally(events);
  // POST 到服务端，响应中包含更新后的全局统计数据
  fetch(_statsAPI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: events })
  }).then(function(resp) {
    if (!resp.ok) {
      console.warn('[stats] POST ' + resp.status);
      // POST 失败也尝试 GET 拉取当前全局数据
      _fetchAndRenderStats();
      return;
    }
    return resp.json();
  }).then(function(data) {
    if (data && data.stats) {
      _serverAvailable = true;
      _cachedStats = data.stats;
      renderStats();
      console.log('[stats] server global data updated');
    }
  }).catch(function(err) {
    console.warn('[stats] POST error:', err.message);
    // 网络错误也尝试 GET
    _fetchAndRenderStats();
  });
}

// 从服务端拉取统计数据（只显示全局数据，不回退到本地个人数据）
function _fetchAndRenderStats() {
  fetch(_statsAPI).then(function(resp) {
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return resp.json();
  }).then(function(data) {
    if (data && data.today) {
      _serverAvailable = true;
      _cachedStats = data;
      renderStats();
      console.log('[stats] server global data loaded');
    }
  }).catch(function(err) {
    console.warn('[stats] server unavailable:', err.message);
    _serverAvailable = false;
    // 不回退到 localStorage 个人数据，保持显示 '--' 或上次服务端数据
  });
}

function initSiteStats() {
  _sessionStart = Date.now();

  // 上报访问+页面浏览到服务端，POST 响应中直接返回更新后的全局统计数据并渲染
  // 不再单独发 GET 请求，避免 GET/POST 竞态导致显示 0

  // 上报访问+页面浏览
  _trackEvents(['visit', 'pageView']);

  // 每30秒上报一次使用时长
  _sessionTimer = setInterval(function() {
    _trackEvents(['duration:30']);
  }, 30000);

  // 页面关闭/刷新前，上报当前会话剩余时长到服务端
  window.addEventListener('beforeunload', function() {
    var elapsed = Math.floor((Date.now() - _sessionStart) / 1000);
    var reported = Math.floor(elapsed / 30) * 30;
    var remaining = elapsed - reported;
    if (remaining > 0) {
      // sendBeacon 不阻塞页面关闭，确保全局计数器累加
      if (navigator.sendBeacon) {
        navigator.sendBeacon(_statsAPI, new Blob(
          [JSON.stringify({ events: ['duration:' + remaining] })],
          { type: 'application/json' }
        ));
      }
      _trackEventsLocally(['duration:' + remaining]);
    }
  });

  // 每秒更新所有行的时长显示（今日 + 本周 + 本月 + 年度）
  setInterval(function() {
    var localSecs = Math.floor((Date.now() - _sessionStart) / 1000);
    var pairs = [
      ['statTodayDuration', _cachedStats.today],
      ['statWeekDuration',  _cachedStats.week],
      ['statMonthDuration', _cachedStats.month],
      ['statYearDuration',  _cachedStats.year]
    ];
    for (var i = 0; i < pairs.length; i++) {
      var el = document.getElementById(pairs[i][0]);
      var data = pairs[i][1];
      if (el && data) {
        el.textContent = formatDuration((data.duration || 0) + localSecs);
      }
    }
  }, 1000);
}

// Tab 切换时记录页面浏览
var _origSwitchTab = switchTab;
switchTab = function(tab) {
  _origSwitchTab(tab);
  _trackEvents(['pageView']);
};

// AI 调用计数（公开函数供 callAIStream 调用）
function incrementAICalls() {
  _trackEvents(['aiCall']);
}

function formatDuration(totalSecs) {
  if (totalSecs < 60) return totalSecs + '秒';
  var m = Math.floor(totalSecs / 60);
  var s = totalSecs % 60;
  if (m < 60) return m + '分' + (s > 0 ? s + '秒' : '');
  var h = Math.floor(m / 60);
  m = m % 60;
  return h + '时' + (m > 0 ? m + '分' : '');
}

function renderStats() {
  if (!_cachedStats) return;
  var rows = [
    { prefix: 'Today', data: _cachedStats.today },
    { prefix: 'Week',  data: _cachedStats.week },
    { prefix: 'Month', data: _cachedStats.month },
    { prefix: 'Year',  data: _cachedStats.year }
  ];

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var p = r.data || { visits: 0, duration: 0, pageViews: 0, aiCalls: 0 };
    var el;
    el = document.getElementById('stat' + r.prefix + 'Visits');
    if (el) el.textContent = p.visits || 0;
    el = document.getElementById('stat' + r.prefix + 'Duration');
    if (el) el.textContent = formatDuration(p.duration || 0);
    el = document.getElementById('stat' + r.prefix + 'PageViews');
    if (el) el.textContent = p.pageViews || 0;
    el = document.getElementById('stat' + r.prefix + 'AICalls');
    if (el) el.textContent = p.aiCalls || 0;
  }
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
