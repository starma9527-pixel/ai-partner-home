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
        "scenarios": ["智能发票识别与录入","财务报表自动生成","税务风险AI预警","智能记账与对账"],
        "products": ["通义千问API","OCR文字识别","智能对话机器人"],
        "cases": "已有3家伙伴落地财税AI项目，累计合同额超200万",
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
      },
      {
        "id": "drama",
        "icon": "🎬",
        "name": "赛道2 · AI短剧",
        "desc": "AI驱动短剧/漫剧内容生产，从剧本到成片全链路赋能",
        "scenarios": ["AI剧本创作与改编","AI角色形象生成","智能配音与语音合成","AI视频剪辑与特效"],
        "products": ["通义万相","CosyVoice语音合成","通义千问API"],
        "cases": "AI短剧制作成本降低60%，单集产出效率提升5倍",
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
      },
      {
        "id": "voice",
        "icon": "🎙️",
        "name": "赛道3 · 智能语音",
        "desc": "基于大模型的智能语音解决方案，覆盖客服、外呼、质检等场景",
        "scenarios": ["智能客服语音机器人","AI外呼与营销","通话质检与合规分析","语音转文字与会议纪要"],
        "products": ["语音识别ASR","语音合成TTS","通义千问API"],
        "cases": "智能语音客服替代率达70%，客户满意度提升25%",
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
      },
      {
        "id": "ecommerce",
        "icon": "🛒",
        "name": "赛道4 · 电商/跨境电商",
        "desc": "AI赋能电商与跨境电商全链路，从智能选品、内容生成到客服运营，助力商家降本增效出海",
        "scenarios": ["AI商品图与商品视频生成","AI智能选品与市场趋势分析","商品自动上架与多语言文案生成（标题/详情）","智能客服与多语言售后支持","商品图侵权检测与跨境合规智能报关"],
        "products": ["通义千问API","机器翻译","智能客服","向量检索服务"],
        "cases": "跨境电商客户接入AI多语言客服后，客服响应效率提升60%，人力成本降低40%",
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
      },
      {
        "id": "social",
        "icon": "💬",
        "name": "赛道5 · 社交陪伴",
        "desc": "AI驱动的虚拟陪伴与社交互动解决方案，覆盖情感陪伴、虚拟角色、社群运营等场景",
        "scenarios": ["AI虚拟伴侣与情感陪伴","虚拟IP角色对话互动","智能社群运营与管理","游戏NPC智能对话"],
        "products": ["通义千问API","语音合成TTS","数字人形象生成"],
        "cases": "虚拟陪伴用户日均使用时长超2小时，用户留存率提升40%",
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
      },
      {
        "id": "saasagent",
        "icon": "🤖",
        "name": "赛道6 · SaaS Agent",
        "desc": "基于大模型的智能SaaS助手，为各类SaaS产品注入AI能力，提升用户体验与效率",
        "scenarios": ["智能文档助手与内容生成","数据分析与可视化洞察","自动化工作流与任务执行","智能客服与工单处理"],
        "products": ["通义千问API","Function Calling工具调用","知识库RAG检索"],
        "cases": "SaaS产品接入AI助手后，用户付费转化率提升35%，操作效率提升3倍",
        "link": "https://alidocs.dingtalk.com/i/spaces/O5pXB2qoKqZoBX7Z/overview"
      }
    ]
  },
  "rank": {
    "tokenRank": [
      {"rank":1,"name":"四川捷云","score":"25%"},
      {"rank":2,"name":"成都端木","score":"17%"},
      {"rank":3,"name":"长虹佳华","score":"14%"},
      {"rank":4,"name":"四川柏盛云途","score":"14%"},
      {"rank":5,"name":"重庆羋游","score":"10%"},
      {"rank":6,"name":"重庆云之渝","score":"9%"},
      {"rank":7,"name":"重庆典名","score":"8%"}
    ],
    "caseRank": [
      {"rank":1,"name":"重庆典名","score":""},
      {"rank":2,"name":"数联创新","score":18},
      {"rank":3,"name":"云翔信息","score":15},
      {"rank":4,"name":"天行数据","score":12},
      {"rank":5,"name":"智源网络","score":9}
    ],
    "studyRank": [
      {"rank":1,"name":"云翔信息","score":"42h"},
      {"rank":2,"name":"锐智科技","score":"38h"},
      {"rank":3,"name":"智源网络","score":"35h"},
      {"rank":4,"name":"数联创新","score":"31h"},
      {"rank":5,"name":"天行数据","score":"28h"}
    ],
    "certRank": [
      {"rank":1,"name":"锐智科技","score":"92%"},
      {"rank":2,"name":"云翔信息","score":"85%"},
      {"rank":3,"name":"天行数据","score":"78%"},
      {"rank":4,"name":"数联创新","score":"73%"},
      {"rank":5,"name":"智源网络","score":"68%"}
    ],
    "battleReports": [
      {"title":"重庆典名签约XX客户千万级数据集建设项目","amount":"千万级","date":"2026-03-2"},
      {"title":"四川捷云信通抓住 OpenClaw 爆发机遇，7 天狂揽 200+ 新客户！","amount":"--","date":"2026-03-10"},
      {"title":"成都慕创中标XX一体机项目","amount":"百万级","date":"2026-03-12"}
    ]
  },
  "feedback": {
    "messages": [
      {"id":1,"author":"张伟 · 锐智科技","content":"希望能增加更多金融行业的案例资料","date":"2025-02-28","likes":12},
      {"id":2,"author":"李娜 · 云翔信息","content":"周五培训非常实用，希望能有回放","date":"2025-02-27","likes":8},
      {"id":3,"author":"王磊 · 数联创新","content":"报价工具建议增加批量导出功能","date":"2025-02-26","likes":5}
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
  initBatchUpload();
  renderHome();
  renderWeapons();
  renderMaas();
  renderRank();
});

// ===== Load Data =====
async function loadSiteData() {
  try {
    const resp = await fetch('data/site-data.json');
    if (resp.ok) { siteData = await resp.json(); return; }
  } catch (e) {}
  siteData = SITE_DATA;
}

// ===== Tab Navigation =====
function initTabs() {
  const nav = document.getElementById('pillNav');
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-btn');
    if (!btn) return;
    switchTab(btn.dataset.tab);
  });
}

function switchTab(tab) {
  const nav = document.getElementById('pillNav');
  nav.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  const targetBtn = nav.querySelector(`.pill-btn[data-tab="${tab}"]`);
  if (targetBtn) targetBtn.classList.add('active');
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
    tabs.querySelectorAll('.rank-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.rank-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('rank-' + btn.dataset.rank).classList.add('active');
  });
}

// ===== Scene Selector =====
function initSceneSelector() {
  const sel = document.getElementById('sceneSelector');
  if (!sel) return;
  sel.addEventListener('click', (e) => {
    const btn = e.target.closest('.scene-btn');
    if (!btn) return;
    sel.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.scene-form').forEach(f => f.classList.remove('active'));
    document.getElementById('form-' + btn.dataset.scene).classList.add('active');
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
      </div>`;
  });
  const toolGrid = document.getElementById('toolGrid');
  (weapons.tools || []).forEach(item => {
    toolGrid.innerHTML += `
      <div class="tool-card" onclick="window.open('${item.link}', '_blank')">
        <div class="tool-icon">${item.icon}</div>
        <div class="tool-name">${item.title}</div>
        <div class="tool-desc">${item.desc}</div>
      </div>`;
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
      </div>`;
  });
  const kbLink = document.getElementById('kbLink');
  if (weapons.knowledgeBaseLink) kbLink.href = weapons.knowledgeBaseLink;
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
        </a>`;
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
      </div>`;
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
      </a>`;
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
        </div>`;
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
      </div>`;
  });
}

// ===== Mobile Navigation =====
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('show');
  document.getElementById('mobileNavOverlay').classList.toggle('show');
  document.getElementById('hamburgerBtn').classList.toggle('open');
}

function mobileNavTo(tab) {
  const btn = document.querySelector('.pill-btn[data-tab="' + tab + '"]');
  if (btn) btn.click();
  document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.mobile-nav-btn[data-tab="' + tab + '"]').classList.add('active');
  toggleMobileNav();
}

// ===== 客户分析报告（多模型Tab切换）=====
function handleCustomerAnalysis() {
  const val = document.getElementById('analysisInput').value.trim();
  if (!val) { showToast('请输入客户公司全称'); return; }
  const productName = (document.getElementById('analysisProduct') || {}).value || '';
  const website = (document.getElementById('analysisWebsite') || {}).value || '';
  const checked = document.querySelectorAll('input[name="analysisModel"]:checked');
  const selectedModels = Array.from(checked).map(cb => cb.value);
  if (selectedModels.length === 0) { showToast('请至少选择一个AI模型'); return; }
  const outputDiv = document.getElementById('customerOutput');
  const contentDiv = document.getElementById('customerOutputContent');
  outputDiv.classList.add('show');
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
        .catch(err => { renderFailPanel(panelId, statusId, err.message, retryKey); });
    }, index * 3000);
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
        .catch(err => { renderFailPanel(panelId, statusId, err.message, retryKey); });
    }, index * 3000);
  });
}

// ===== Tab切换输出面板 =====
function switchOutputTab(prefix, model) {
  const tabsContainer = document.getElementById(prefix + 'OutputTabs');
  if (!tabsContainer) return;
  tabsContainer.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
  const activeTab = tabsContainer.querySelector('.output-tab[data-model="' + model + '"]');
  if (activeTab) activeTab.classList.add('active');
  const panelsContainer = document.getElementById(prefix + 'OutputPanels');
  if (!panelsContainer) return;
  panelsContainer.querySelectorAll('.output-panel').forEach(p => p.classList.remove('active'));
  const activePanel = document.getElementById('panel-' + prefix + '-' + model);
  if (activePanel) activePanel.classList.add('active');
}

function handleFeedback() {
  const content = document.getElementById('feedbackContent').value.trim();
  if (!content) { showToast('请输入反馈内容'); return; }
  const company = document.getElementById('feedbackCompany').value.trim();
  if (!company) { showToast('请输入所属伙伴公司'); return; }
  const name = document.getElementById('feedbackName').value.trim() || '匿名伙伴';
  document.getElementById('feedbackContent').value = '';
  document.getElementById('feedbackName').value = '';
  document.getElementById('feedbackCompany').value = '';
  showToast('感谢反馈！已通知管理员');
  sendFeedbackToAdmin(name + ' · ' + company, content);
}

// ===== AI API Call =====
const MODEL_LABELS = { qwen37max: 'Qwen3.7-Max', qwen3max: 'Qwen3-Max', qwenplus: 'Qwen3-Plus', minimax: 'MiniMax-M2.1', deepseek: 'DeepSeek-V3.2', deepseekflash: 'DeepSeek-V4-Flash' };

// ===== 清理模型输出内容 =====
// 去除工具调用标签和思考过程
function cleanAIContent(text) {
  if (!text) return text;
  // 去除工具调用标签
  var LT = String.fromCodePoint(60);
  var GT = String.fromCodePoint(62);
  text = text.replace(new RegExp(LT + '\\/?minimax:tool_call' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + 'invoke\\s+name="[^"]*"' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + '\\/invoke' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + 'parameter\\s+name="[^"]*"' + GT + '[^' + LT + ']*' + LT + '\\/parameter' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + '\\|plugin\\|' + GT + '[\\s\\S]*?' + LT + '\\|\\/plugin\\|' + GT, 'g'), '');
  var _tc = LT + 'tool_call' + GT;
  var _fc = LT + 'function_call' + GT;
  text = text.replace(new RegExp(_tc + '[\\s\\S]*?' + LT + '\\/tool_call' + GT, 'g'), '');
  text = text.replace(new RegExp(_tc + '[\\s\\S]*', 'g'), '');
  text = text.replace(new RegExp(LT + '\\/?tool_call' + GT, 'g'), '');
  text = text.replace(new RegExp(_fc + '[\\s\\S]*?' + LT + '\\/function_call' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + '\\/?function_call' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + 'query' + GT + '[^' + LT + ']*' + LT + '\\/query' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + 'search_result' + GT + '[\\s\\S]*?' + LT + '\\/search_result' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + 'execution_result' + GT + '[\\s\\S]*?' + LT + '\\/execution_result' + GT, 'g'), '');
  // think 思考标签（qwen3-max 等思考模型）
  text = text.replace(new RegExp(LT + 'think' + GT + '[\\s\\S]*?' + LT + '\\/think' + GT, 'gi'), '');
  text = text.replace(new RegExp(LT + 'think' + GT + '[\\s\\S]*', 'gi'), '');
  // MiniMax tool_code 格式
  text = text.replace(new RegExp(LT + 'tool_code' + GT + '[\\s\\S]*?' + LT + '\\/tool_code' + GT, 'g'), '');
  text = text.replace(new RegExp(LT + 'tool_code' + GT + '[\\s\\S]*', 'g'), '');
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
  content = cleanAIContent(content);
  if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
    try {
      var rendered = marked.parse(content);
      return '<div class="ai-markdown-output">' + rendered + '</div>';
    } catch (e) {
      console.error('[formatAIOutput] marked.parse 出错, 降级到内置渲染:', e);
    }
  }
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
    if (!trimmed) {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
      if (inTable) { html.push('</tbody></table>'); inTable = false; isFirstTableRow = true; }
      continue;
    }
    if (trimmed.charAt(0) === '|' && trimmed.charAt(trimmed.length - 1) === '|') {
      if (/^\|[\s\-:|\s]+\|$/.test(trimmed)) continue;
      var cells = trimmed.slice(1, -1).split('|');
      if (!inTable) {
        html.push('<table><thead><tr>');
        for (var c = 0; c < cells.length; c++) html.push('<th>' + mdInline(cells[c].trim()) + '</th>');
        html.push('</tr></thead><tbody>');
        inTable = true; isFirstTableRow = false; continue;
      }
      html.push('<tr>');
      for (var c = 0; c < cells.length; c++) html.push('<td>' + mdInline(cells[c].trim()) + '</td>');
      html.push('</tr>'); continue;
    }
    if (inTable) { html.push('</tbody></table>'); inTable = false; isFirstTableRow = true; }
    var hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
      html.push('<h' + hMatch[1].length + '>' + mdInline(hMatch[2]) + '</h' + hMatch[1].length + '>');
      continue;
    }
    if (/^[-*_]{3,}\s*$/.test(trimmed)) {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
      html.push('<hr>'); continue;
    }
    if (/^[-*+]\s+/.test(trimmed)) {
      if (inOl) { html.push('</ol>'); inOl = false; }
      if (!inUl) { html.push('<ul>'); inUl = true; }
      html.push('<li>' + mdInline(trimmed.replace(/^[-*+]\s+/, '')) + '</li>'); continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (!inOl) { html.push('<ol>'); inOl = true; }
      html.push('<li>' + mdInline(trimmed.replace(/^\d+\.\s+/, '')) + '</li>'); continue;
    }
    if (trimmed.charAt(0) === '>') {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
      html.push('<blockquote>' + mdInline(trimmed.replace(/^>\s*/, '')) + '</blockquote>'); continue;
    }
    if (inUl) { html.push('</ul>'); inUl = false; }
    if (inOl) { html.push('</ol>'); inOl = false; }
    html.push('<p>' + mdInline(trimmed) + '</p>');
  }
  if (inUl) html.push('</ul>');
  if (inOl) html.push('</ol>');
  if (inTable) html.push('</tbody></table>');
  return html.join('\n');
}

function mdInline(text) {
  if (!text) return '';
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');
  return text;
}

// ===== 自动重试包装器 =====
var _retryRegistry = {};

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
    .catch(function(err) { renderFailPanel(panelId, statusId, err.message, retryKey); });
}

// ===== 流式 AI 调用（SSE）=====
async function callAIStream(type, input, model, panelId) {
  const isLocal = window.location.protocol === 'file:' ||
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';
  const streamEndpoint = isLocal ? null : '/api/ai-proxy';
  const fallbackEndpoints = isLocal ? [
    'https://ai-proxy-ejcdenashk.cn-beijing.fcapp.run'
  ] : [
    'https://ai-proxy-ejcdenashk.cn-beijing.fcapp.run'
  ];
  const panelEl = document.getElementById(panelId);

  if (streamEndpoint && type !== 'batch_analysis') {
    try {
      console.log('[stream] model=' + model + ' endpoint=' + streamEndpoint);
      var streamTimeout = 120000;
      // 批量模式放宽超时至 180s
      if (typeof _batchRunning !== 'undefined' && _batchRunning) streamTimeout = 180000;
      const streamCtrl = new AbortController();
      const streamTimer = setTimeout(() => streamCtrl.abort(), streamTimeout);
      const resp = await fetch(streamEndpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify({ type, input, model: model || 'qwen3max', stream: true }),
        signal: streamCtrl.signal
      });
      if (!resp.ok) {
        const errText = await resp.text();
        let errMsg = '请求失败 HTTP ' + resp.status;
        try { const j = JSON.parse(errText); errMsg = j.error || errMsg; if (j.detail) errMsg += '\n' + j.detail; } catch(e) {}
        throw new Error(errMsg);
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';
      let renderTimer = null;
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
      clearTimeout(streamTimer);
      if (renderTimer) { clearTimeout(renderTimer); renderTimer = null; }
      if (!fullContent) throw new Error('未收到有效内容');
      if (panelEl) panelEl.innerHTML = formatAIOutput(fullContent);
      return { content: fullContent, model: model };
    } catch (err) {
      console.error('[stream] 流式调用失败:', err.message, '降级到非流式');
    }
  }

  // 非流式 fallback
  const MAX_RETRIES = 2;
  let attempt = 0;
  while (attempt <= MAX_RETRIES) {
    let lastError = null;
    for (const endpoint of fallbackEndpoints) {
      try {
        console.log('[callAI] attempt=' + attempt + ' model=' + model + ' endpoint=' + endpoint);
        if (panelEl) panelEl.innerHTML = '<span class="spinner"></span> AI正在生成中（非流式模式）...';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 150000);
        const resp = await fetch(endpoint, {
          method: 'POST', mode: 'cors', credentials: 'omit',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ type, input, model: model || 'qwen3max' }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const text = await resp.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { throw new Error('返回的不是有效JSON: ' + text.substring(0, 100)); }
        if (!resp.ok || data.error) throw new Error(data.error || '请求失败 HTTP ' + resp.status);
        if (panelEl) panelEl.innerHTML = formatAIOutput(data.content);
        return { content: data.content, model: data.model };
      } catch (err) {
        lastError = err;
        console.error('[callAI] Endpoint ' + endpoint + ' failed:', err.message);
        continue;
      }
    }
    attempt++;
    if (attempt <= MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 3000));
    } else {
      throw lastError || new Error('所有AI端点均不可用');
    }
  }
}

// ===== 导出功能 =====
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

function getExportContent(panelId) {
  var panel = document.getElementById(panelId);
  if (!panel) return '';
  var contentEl = panel.querySelector('.ai-markdown-output');
  if (contentEl && contentEl.innerHTML.trim()) {
    var clone = contentEl.cloneNode(true);
    var toggleBtn = clone.querySelector('.collapse-toggle-all');
    if (toggleBtn) toggleBtn.remove();
    return clone.innerHTML;
  }
  var clone = panel.cloneNode(true);
  var tb = clone.querySelector('.export-toolbar');
  if (tb) tb.remove();
  var spinner = clone.querySelector('.spinner');
  if (spinner) spinner.remove();
  return clone.innerHTML.trim();
}

function insertExportToolbar(panelId, fileName) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  if (panel.querySelector('.export-toolbar')) return;
  var toolbar = document.createElement('div');
  toolbar.className = 'export-toolbar';
  toolbar.innerHTML =
    '<button class="btn-export" onclick="exportToWord(\'' + panelId + '\', \'' + fileName.replace(/'/g, "\\'") + '\')">📄 导出 Word</button>' +
    '<button class="btn-export" onclick="exportToPDF(\'' + panelId + '\', \'' + fileName.replace(/'/g, "\\'") + '\')">📑 导出 PDF</button>';
  panel.appendChild(toolbar);
  addCollapsibleSections(panelId);
}

function injectReportTitle(panelId, title) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  var mdOutput = panel.querySelector('.ai-markdown-output');
  if (!mdOutput) return;
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
  if (mdOutput.dataset.collapsible === 'true') return;
  mdOutput.dataset.collapsible = 'true';
  var headings = mdOutput.querySelectorAll('h1');
  var headingTag = 'H1';
  if (headings.length === 0) { headings = mdOutput.querySelectorAll('h2'); headingTag = 'H2'; }
  if (headings.length === 0) return;
  for (var i = 0; i < headings.length; i++) {
    var heading = headings[i];
    heading.classList.add('collapsible-header');
    heading.setAttribute('title', '点击折叠/展开');
    var indicator = document.createElement('span');
    indicator.className = 'collapse-indicator';
    indicator.textContent = '▼';
    heading.insertBefore(indicator, heading.firstChild);
    var section = document.createElement('div');
    section.className = 'collapsible-section';
    var next = heading.nextSibling;
    while (next) {
      var current = next;
      next = current.nextSibling;
      if (current.nodeType === 1 && current.tagName === headingTag) break;
      section.appendChild(current);
    }
    heading.parentNode.insertBefore(section, heading.nextSibling);
    (function(header, content, ind) {
      header.addEventListener('click', function() {
        var isCollapsed = content.classList.toggle('collapsed');
        ind.textContent = isCollapsed ? '▶' : '▼';
        header.classList.toggle('is-collapsed', isCollapsed);
      });
    })(heading, section, indicator);
  }
  var toggleBtn = document.createElement('button');
  toggleBtn.className = 'collapse-toggle-all';
  toggleBtn.innerHTML = '📖 全部折叠';
  toggleBtn.dataset.collapsed = 'false';
  var titleEl = mdOutput.querySelector('.report-main-title');
  if (titleEl && titleEl.nextSibling) mdOutput.insertBefore(toggleBtn, titleEl.nextSibling);
  else mdOutput.insertBefore(toggleBtn, mdOutput.firstChild);
  toggleBtn.addEventListener('click', function() {
    var sections = mdOutput.querySelectorAll('.collapsible-section');
    var headers = mdOutput.querySelectorAll('.collapsible-header');
    var shouldCollapse = toggleBtn.dataset.collapsed === 'false';
    for (var j = 0; j < sections.length; j++) {
      if (shouldCollapse) sections[j].classList.add('collapsed'); else sections[j].classList.remove('collapsed');
    }
    for (var j = 0; j < headers.length; j++) {
      var ind = headers[j].querySelector('.collapse-indicator');
      if (ind) ind.textContent = shouldCollapse ? '▶' : '▼';
      if (shouldCollapse) headers[j].classList.add('is-collapsed'); else headers[j].classList.remove('is-collapsed');
    }
    toggleBtn.dataset.collapsed = shouldCollapse ? 'true' : 'false';
    toggleBtn.innerHTML = shouldCollapse ? '📕 全部展开' : '📖 全部折叠';
  });
}

function exportToWord(panelId, fileName) {
  var content = getExportContent(panelId);
  if (!content) { showToast('没有可导出的内容'); return; }
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + EXPORT_STYLES + '</style></head><body>' + content + '</body></html>';
  var blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = (fileName || '报告') + '.doc';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Word 文件已开始下载');
}

function exportToPDF(panelId, fileName) {
  if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
    showToast('PDF 库尚未加载完成，请稍后重试'); return;
  }
  var content = getExportContent(panelId);
  if (!content) { showToast('没有可导出的内容'); return; }
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:0;top:0;width:800px;border:none;z-index:99999;opacity:1;background:#fff;';
  document.body.appendChild(iframe);
  var iDoc = iframe.contentDocument || iframe.contentWindow.document;
  iDoc.open();
  iDoc.write('<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:32px 40px;background:#fff;color:#222;font-family:"Microsoft YaHei","PingFang SC","Segoe UI",sans-serif;line-height:1.8;font-size:14px;}' + EXPORT_STYLES + '</style></head><body>' + content + '</body></html>');
  iDoc.close();
  showToast('正在生成 PDF，请稍候...');
  setTimeout(function() {
    var bodyH = iDoc.body.scrollHeight;
    iframe.style.height = bodyH + 'px';
    html2canvas(iDoc.body, { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 700, height: bodyH, scrollX: 0, scrollY: 0, windowWidth: 800, windowHeight: bodyH, logging: false }).then(function(canvas) {
      var jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF('p', 'mm', 'a4');
      var pageW = 210, pageH = 297, margin = 15;
      var usableW = pageW - 2 * margin, usableH = pageH - 2 * margin;
      var imgW = usableW, imgH = (canvas.height / canvas.width) * imgW;
      var imgData = canvas.toDataURL('image/jpeg', 0.95);
      var heightLeft = imgH, yOffset = margin;
      pdf.addImage(imgData, 'JPEG', margin, yOffset, imgW, imgH);
      heightLeft -= usableH;
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
  // 从 author 参数解析 name 和 company（格式："name · company"）
  var parts = author.split(' · ');
  var name = parts[0] || '匿名伙伴';
  var company = parts[1] || '';
  const formData = new URLSearchParams();
  formData.append('form-name', 'feedback');
  formData.append('name', name);
  formData.append('company', company);
  formData.append('content', content);
  fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() })
    .then(resp => { if (resp.ok) console.log('[Feedback] Netlify Forms 提交成功'); else console.warn('[Feedback] Netlify Forms 提交失败:', resp.status); })
    .catch(err => { console.warn('[Feedback] Netlify Forms 不可用:', err.message); });
  const isLocal = window.location.protocol === 'file:';
  if (!isLocal) {
    fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, company, content, author }) })
      .then(resp => resp.json()).then(data => { if (data.success) console.log('[Feedback] 邮件发送成功'); else console.warn('[Feedback] 邮件发送失败:', data.error); })
      .catch(err => { console.warn('[Feedback] Edge Function 不可用:', err.message); });
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

// ===== 批量客户分析 =====
var _batchCustomers = [];
var _batchResults   = [];
var _batchAbortFlag = false;
var _batchRunning   = false;
var _batchSelectedModels = [];
var _batchModelRegistry  = {};
var _batchCurrentModel    = '';

function initBatchUpload() {
  var zone = document.getElementById('batchUploadZone');
  if (!zone) return;
  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('drag-over'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault(); zone.classList.remove('drag-over');
    var file = e.dataTransfer.files[0];
    if (file) processExcelFile(file);
  });
}

function parseExcelFile(input) {
  var file = input.files[0];
  if (!file) return;
  processExcelFile(file);
  input.value = '';
}

function processExcelFile(file) {
  if (typeof XLSX === 'undefined') { showToast('Excel 解析库尚未加载，请稍后重试'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: 'array' });
      var sheet = workbook.Sheets[workbook.SheetNames[0]];
      var rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      var added = 0;
      // 表头检测
      var headerRow = null;
      var startRow = 0;
      var headerKeywords = ['客户', '公司', '名称', '全称', 'company', 'name'];
      for (var h = 0; h < Math.min(rows.length, 5); h++) {
        var firstCell = String(rows[h][0] || '').trim().toLowerCase();
        if (headerKeywords.some(function(kw) { return firstCell.indexOf(kw) >= 0; })) {
          headerRow = rows[h];
          startRow = h + 1;
          break;
        }
      }
      // 列校验
      var colName = 0, colProduct = 1, colWebsite = 2;
      if (headerRow) {
        for (var c = 0; c < headerRow.length; c++) {
          var cell = String(headerRow[c] || '').trim().toLowerCase();
          if (cell.indexOf('公司') >= 0 || cell.indexOf('名称') >= 0 || cell.indexOf('全称') >= 0 || cell === 'name' || cell === 'company') colName = c;
          if (cell.indexOf('产品') >= 0 || cell.indexOf('app') >= 0 || cell === 'product') colProduct = c;
          if (cell.indexOf('官网') >= 0 || cell.indexOf('网址') >= 0 || cell.indexOf('url') >= 0 || cell === 'website') colWebsite = c;
        }
      }
      rows.forEach(function(row, idx) {
        if (idx < startRow) return;
        var name = String(row[colName] || '').trim();
        if (!name) return;
        var exists = _batchCustomers.some(function(c) { return c.name === name; });
        if (!exists) {
          _batchCustomers.push({ name: name, product: String(row[colProduct] || '').trim(), website: String(row[colWebsite] || '').trim() });
          added++;
        }
      });
      renderBatchPreview();
      showToast('已导入 ' + added + ' 位客户，共 ' + _batchCustomers.length + ' 位');
    } catch (err) { showToast('Excel 解析失败：' + err.message); }
  };
  reader.readAsArrayBuffer(file);
}

function renderBatchPreview() {
  var preview = document.getElementById('batchPreview');
  var tagList = document.getElementById('batchTagList');
  var countEl = document.getElementById('batchPreviewCount');
  var modelSel = document.getElementById('batchModelSelector');
  if (_batchCustomers.length === 0) {
    if (preview) preview.style.display = 'none';
    if (modelSel) modelSel.style.display = 'none';
    return;
  }
  if (preview) preview.style.display = '';
  if (modelSel) modelSel.style.display = '';
  if (countEl) countEl.textContent = '已导入 ' + _batchCustomers.length + ' 位客户';
  if (!tagList) return;
  tagList.innerHTML = '';
  _batchCustomers.forEach(function(c, idx) {
    var tag = document.createElement('span');
    tag.className = 'batch-customer-tag';
    tag.innerHTML = escapeHtml(c.name) + '<span class="tag-remove" onclick="removeBatchCustomer(' + idx + ')">✕</span>';
    tagList.appendChild(tag);
  });
}

function removeBatchCustomer(idx) {
  if (_batchRunning) { showToast('分析进行中，无法删除'); return; }
  _batchCustomers.splice(idx, 1);
  renderBatchPreview();
}

function clearBatchCustomers() {
  if (_batchRunning) { showToast('分析进行中，请先停止后再清空'); return; }
  _batchCustomers = []; _batchResults = [];
  _batchSelectedModels = []; _batchModelRegistry = {}; _batchCurrentModel = '';
  renderBatchPreview();
  var results = document.getElementById('batchResults');
  if (results) results.innerHTML = '';
  var progress = document.getElementById('batchProgress');
  if (progress) progress.style.display = 'none';
  var summary = document.getElementById('batchSummary');
  if (summary) { summary.style.display = 'none'; document.getElementById('batchSummaryTableWrap').innerHTML = ''; }
  var exportBtn = document.getElementById('batchExportBtn');
  if (exportBtn) exportBtn.style.display = 'none';
}

// ===== 批量评估：评分计算 =====
function calculateBatchScore(d) {
  var aiScore = 0, cloudScore = 0;
  // 维度1：员工规模（优先集团数）最高25分
  var emp = d.effectiveEmployeeNumber || d.parentEmployeeNumber || d.employeeNumber || 0;
  if (emp >= 10000) aiScore += 25;
  else if (emp >= 1000) aiScore += 20;
  else if (emp >= 200) aiScore += 15;
  else if (emp >= 50) aiScore += 10;
  else if (emp >= 10) aiScore += 5;
  else aiScore += 2;
  // 维度2：营收规模（优先集团数）最高20分
  var rev = d.effectiveRevenueNumber || d.parentCompanyRevenueNumber || d.revenueNumber || 0;
  if (rev >= 100) aiScore += 20;
  else if (rev >= 10) aiScore += 16;
  else if (rev >= 1) aiScore += 12;
  else if (rev >= 0.1) aiScore += 8;
  else if (rev > 0) aiScore += 4;
  else aiScore += 2;
  // 维度3：上市/融资状态 最高10分
  var listed = (d.isListed || '').toLowerCase();
  if (listed.indexOf('未上市') < 0 && listed.length > 0 && listed !== '否') aiScore += 10;
  else aiScore += 3;
  // 维度4：增长趋势 最高12分
  var trend = d.growthTrend || '';
  if (trend.indexOf('高增长') >= 0) aiScore += 12;
  else if (trend.indexOf('稳健') >= 0) aiScore += 9;
  else if (trend.indexOf('平稳') >= 0) aiScore += 6;
  else if (trend.indexOf('下滑') >= 0) aiScore += 2;
  else aiScore += 5;
  // 维度5：行业AI密集度 最高15分
  var ind = (d.industry || '').toLowerCase();
  if (/aigc|短视频|直播|动漫|内容创作/.test(ind)) aiScore += 15;
  else if (/金融科技|人工智能|大模型|云计算|ai/.test(ind)) aiScore += 15;
  else if (/电商|游戏|教育|医疗|制造|物流|汽车/.test(ind)) aiScore += 11;
  else if (/零售|文娱|社交|农业|建筑|能源/.test(ind)) aiScore += 8;
  else aiScore += 6;
  // 维度6：AI战略活跃度（新）最高10分
  var aiLevel = (d.aiActivityLevel || '').toLowerCase();
  if (aiLevel.indexOf('高') >= 0) aiScore += 10;
  else if (aiLevel.indexOf('中') >= 0) aiScore += 6;
  else if (aiLevel.indexOf('低') >= 0) aiScore += 2;
  else aiScore += 3;
  // 维度7：竞对渗透（新）—— 有竞对使用反而是机会，加5分；无记录加2分
  var competitor = (d.competitorCloudUsage || '').toLowerCase();
  if (competitor && competitor !== '无竞对使用记录' && competitor.length > 5) aiScore += 5;
  else aiScore += 2;
  // 维度8：集团云AI使用（加分项）最高5分
  var groupUsage = (d.groupCloudAiUsage || '').toLowerCase();
  if (groupUsage && groupUsage !== '无' && groupUsage.length > 3) aiScore += 5;
  // 维度9：公司实力评分（新）最高8分
  var strength = d.companyStrengthScore || 0;
  aiScore += Math.round(strength * 0.8);
  cloudScore = Math.round(aiScore * 0.85 + 5);
  var composite = Math.round(aiScore * 0.55 + cloudScore * 0.45);
  return { aiScore: Math.min(aiScore, 100), cloudScore: Math.min(cloudScore, 100), composite: Math.min(composite, 100) };
}

var _batchSummaryHeaders = [
  '序号', '公司全称', '省市', '成立时间', '法定代表人', '注册资本',
  '员工规模', '员工数范围', '所属行业', '业务模式',
  '营收', '营收年份', '是否上市', '实力评分', '规模标签', '官网',
  'AI活跃度', 'AI信号', '竞对云/AI',
  '技术栈', '近期动态',
  '母公司/集团', '集团业务', '集团云AI使用',
  '核心商业模式', '招投标信息', '主要股东',
  '增长趋势', '云与AI合作机会', '年消费预估', 'AI潜力分', '云计算潜力分', '综合评分', '状态'
];

function renderBatchSummaryTable(container, model) {
  var wrap = container || document.getElementById('batchSummaryTableWrap');
  if (!wrap) return;
  var modelPrefix = model ? (model + '-') : '';
  var html = '<table class="batch-summary-table"><thead><tr>';
  _batchSummaryHeaders.forEach(function(h) { html += '<th>' + h + '</th>'; });
  html += '</tr></thead><tbody id="batchSummaryBody' + (model ? '-' + model : '') + '">';
  _batchCustomers.forEach(function(c, idx) {
    html += '<tr id="batch-row-' + modelPrefix + idx + '">';
    html += '<td>' + (idx + 1) + '</td>';
    html += '<td>' + escapeHtml(c.name) + '</td>';
    for (var col = 2; col < _batchSummaryHeaders.length - 1; col++) html += '<td>-</td>';
    html += '<td><span class="status-tag s-pending">等待中</span></td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

function updateBatchSummaryRow(idx, data, status, model) {
  var modelPrefix = model ? (model + '-') : '';
  var row = document.getElementById('batch-row-' + modelPrefix + idx);
  if (!row) return;
  var scores = data ? calculateBatchScore(data) : { aiScore: 0, cloudScore: 0, composite: 0 };
  var scoreClass = scores.composite >= 60 ? 'score-high' : (scores.composite >= 40 ? 'score-mid' : 'score-low');
  var statusHtml = '';
  if (status === 'done') statusHtml = '<span class="status-tag s-done">完成</span>';
  else if (status === 'running') statusHtml = '<span class="status-tag s-running">分析中</span>';
  else if (status === 'error') statusHtml = '<span class="status-tag s-error">失败</span>';
  else statusHtml = '<span class="status-tag s-pending">等待中</span>';
  var cells = [
    idx + 1,
    escapeHtml((data && data.companyName) || _batchCustomers[idx].name),
    escapeHtml(data ? ((data.province || '') + (data.city ? ' ' + data.city : '')) : '-') || '-',
    escapeHtml((data && data.establishedDate) || '-'),
    escapeHtml((data && data.legalRepresentative) || '-'),
    escapeHtml((data && data.registeredCapital) || '-'),
    escapeHtml((data && data.employeeCount) || '-'),
    escapeHtml((data && data.employeeRange) || '-'),
    escapeHtml((data && data.industry) || '-'),
    escapeHtml((data && data.bizType) || '-'),
    escapeHtml((data && data.revenue) || '-'),
    escapeHtml((data && data.revenueYear) || '-'),
    escapeHtml((data && data.isListed) || '-'),
    data ? '<span class="score-cell ' + (data.companyStrengthScore >= 8 ? 'score-high' : data.companyStrengthScore >= 5 ? 'score-mid' : 'score-low') + '">' + (data.companyStrengthScore || '-') + '</span>' : '-',
    escapeHtml((data && data.companyScaleTag) || '-'),
    escapeHtml((data && data.website) || '-'),
    data ? '<span class="status-tag ' + ((data.aiActivityLevel || '').indexOf('高') >= 0 ? 's-done' : (data.aiActivityLevel || '').indexOf('中') >= 0 ? 's-running' : 's-pending') + '">' + escapeHtml(data.aiActivityLevel || '-') + '</span>' : '-',
    escapeHtml((data && data.aiSignals) || '-'),
    escapeHtml((data && data.competitorCloudUsage) || '-'),
    escapeHtml((data && data.techStack) || '-'),
    escapeHtml((data && data.recentNews) || '-'),
    escapeHtml((data && data.parentCompany) || '-'),
    escapeHtml((data && data.parentCompanyBusiness) || '-'),
    escapeHtml((data && data.groupCloudAiUsage) || '-'),
    escapeHtml((data && data.businessModel) || '-'),
    escapeHtml((data && data.biddingInfo) || '-'),
    escapeHtml((data && data.shareholders) || '-'),
    data ? '<span class="status-tag ' + ((data.growthTrend || '').indexOf('高增长') >= 0 ? 's-done' : (data.growthTrend || '').indexOf('下滑') >= 0 ? 's-error' : 's-pending') + '">' + escapeHtml(data.growthTrend || '-') + '</span>' : '-',
    escapeHtml((data && data.cloudAiOpportunities) || '-'),
    escapeHtml((data && data.cloudAiAnnualBudget) || '-'),
    '<span class="score-cell ' + scoreClass + '">' + scores.aiScore + '</span>',
    '<span class="score-cell ' + scoreClass + '">' + scores.cloudScore + '</span>',
    '<span class="score-cell ' + scoreClass + '">' + scores.composite + '</span>',
    statusHtml
  ];
  row.innerHTML = cells.map(function(c) { return '<td>' + c + '</td>'; }).join('');
}

function batchExportExcel() {
  if (typeof XLSX === 'undefined') { showToast('Excel 库尚未加载'); return; }
  var headers = _batchSummaryHeaders.slice(0, -1);
  var colWidths = [
    { wch: 4 },  { wch: 26 }, { wch: 12 }, { wch: 10 }, { wch: 8 },  { wch: 10 },
    { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 10 },
    { wch: 14 }, { wch: 8 },  { wch: 10 }, { wch: 8 },  { wch: 12 }, { wch: 22 },
    { wch: 8 },  { wch: 30 }, { wch: 28 },
    { wch: 28 }, { wch: 36 },
    { wch: 22 }, { wch: 28 }, { wch: 28 },
    { wch: 28 }, { wch: 20 }, { wch: 22 },
    { wch: 10 }, { wch: 36 }, { wch: 22 },
    { wch: 8 },  { wch: 8 },  { wch: 8 }
  ];
  var wb = XLSX.utils.book_new();
  var modelsToExport = _batchSelectedModels.length > 1 ? _batchSelectedModels : [_batchCurrentModel || _batchSelectedModels[0] || 'qwen3max'];
  var totalCustomers = 0;
  var sheetCount = 0;
  function buildRows(results) {
    var rows = [];
    results.forEach(function(r, idx) {
      if (r.status !== 'done') return;
      var d = r.data || {};
      var scores = calculateBatchScore(d);
      rows.push([
        idx + 1, d.companyName || _batchCustomers[idx].name,
        (d.province || '') + (d.city ? ' ' + d.city : ''),
        d.establishedDate || '', d.legalRepresentative || '', d.registeredCapital || '',
        d.employeeCount || '', d.employeeRange || '', d.industry || '', d.bizType || '',
        d.revenue || '', d.revenueYear || '', d.isListed || '',
        d.companyStrengthScore || '', d.companyScaleTag || '', d.website || '',
        d.aiActivityLevel || '', d.aiSignals || '', d.competitorCloudUsage || '',
        d.techStack || '', d.recentNews || '',
        d.parentCompany || '', d.parentCompanyBusiness || '', d.groupCloudAiUsage || '',
        d.businessModel || '', d.biddingInfo || '', d.shareholders || '',
        d.growthTrend || '', d.cloudAiOpportunities || '', d.cloudAiAnnualBudget || '',
        scores.aiScore, scores.cloudScore, scores.composite
      ]);
    });
    rows.sort(function(a, b) { return b[32] - a[32]; });
    return rows;
  }
  modelsToExport.forEach(function(model) {
    var results = (_batchModelRegistry[model] && _batchModelRegistry[model].results) || [];
    var doneCount = results.filter(function(r) { return r.status === 'done'; }).length;
    if (doneCount === 0) return;
    var rows = buildRows(results);
    totalCustomers += rows.length;
    var wsData = [headers].concat(rows);
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = colWidths;
    var sheetName = (MODEL_LABELS[model] || model).substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    sheetCount++;
  });
  if (sheetCount === 0) { showToast('没有可导出的数据'); return; }
  var dateStr = new Date().toLocaleDateString('zh-CN').replace(/\//g, '');
  XLSX.writeFile(wb, '批量客户潜力评估_' + dateStr + '.xlsx');
  showToast('Excel 下载已开始，共 ' + totalCustomers + ' 条记录（' + sheetCount + ' 个模型）');
}

function handleBatchAnalysis() {
  if (_batchRunning) { showToast('批量分析正在进行中'); return; }
  if (_batchCustomers.length === 0) { showToast('请先上传 Excel 文件'); return; }
  var checked = document.querySelectorAll('input[name="batchModel"]:checked');
  var selectedModels = Array.from(checked).map(function(cb) { return cb.value; });
  if (selectedModels.length === 0) { showToast('请至少选择一个AI模型'); return; }
  _batchSelectedModels = selectedModels;
  var isMulti = selectedModels.length > 1;
  _batchAbortFlag = false; _batchRunning = true;
  _batchModelRegistry = {};
  var startBtn = document.getElementById('batchStartBtn');
  var stopBtn = document.getElementById('batchStopBtn');
  if (startBtn) startBtn.style.display = 'none';
  if (stopBtn) stopBtn.style.display = '';
  // 断点恢复检测（仅单模型）
  var resumeIdx = -1;
  if (!isMulti) {
    _batchCurrentModel = selectedModels[0];
    var hasResults = _batchResults.length === _batchCustomers.length &&
      _batchResults.some(function(r) { return r.status === 'done'; });
    if (hasResults) {
      for (var v = 0; v < _batchResults.length; v++) {
        if (_batchResults[v].status === 'done' &&
            (!_batchResults[v].customer || _batchResults[v].customer.name !== _batchCustomers[v].name)) {
          hasResults = false; break;
        }
      }
    }
    if (hasResults) {
      for (var j = 0; j < _batchResults.length; j++) {
        if (_batchResults[j].status !== 'done') { resumeIdx = j; break; }
      }
    }
  }
  var progressEl = document.getElementById('batchProgress');
  if (progressEl) progressEl.style.display = '';
  var oldResults = document.getElementById('batchResults');
  if (oldResults) oldResults.style.display = 'none';
  var summaryDiv = document.getElementById('batchSummary');
  var wrap = document.getElementById('batchSummaryTableWrap');
  if (summaryDiv) summaryDiv.style.display = '';
  if (isMulti) {
    // === 多模型模式：创建 Tab UI ===
    var tabHtml = '<div class="output-tabs" id="batchOutputTabs">';
    selectedModels.forEach(function(m, i) {
      tabHtml += '<button class="output-tab' + (i === 0 ? ' active' : '') + '" data-model="' + m + '" onclick="switchOutputTab(\'batch\', \'' + m + '\')">' +
        '<span class="output-tab-name">' + (MODEL_LABELS[m] || m) + '</span>' +
        '<span class="output-tab-status" id="status-batch-' + m + '">⏳ 等待中</span>' +
      '</button>';
    });
    tabHtml += '</div><div class="output-panels" id="batchOutputPanels">';
    selectedModels.forEach(function(m, i) {
      tabHtml += '<div class="output-panel' + (i === 0 ? ' active' : '') + '" id="panel-batch-' + m + '"></div>';
    });
    tabHtml += '</div>';
    if (wrap) wrap.innerHTML = tabHtml;
    // 初始化每个模型的注册表和结果表
    selectedModels.forEach(function(m) {
      _batchModelRegistry[m] = { results: [] };
      var panel = document.getElementById('panel-batch-' + m);
      if (panel) renderBatchSummaryTable(panel, m);
      _batchCustomers.forEach(function(c) {
        _batchModelRegistry[m].results.push({ customer: c, data: null, status: 'pending' });
      });
    });
    updateBatchProgress(0, _batchCustomers.length * selectedModels.length, '启动中...');
    // 顺序执行每个模型
    (async function() {
      var totalDone = 0;
      for (var mi = 0; mi < selectedModels.length; mi++) {
        if (_batchAbortFlag) break;
        var m = selectedModels[mi];
        _batchCurrentModel = m;
        _batchResults = _batchModelRegistry[m].results;
        var statusEl = document.getElementById('status-batch-' + m);
        if (statusEl) { statusEl.textContent = '🔄 分析中'; statusEl.className = 'output-tab-status'; }
        // 切换到当前模型 tab
        switchOutputTab('batch', m);
        updateBatchProgress(totalDone, _batchCustomers.length * selectedModels.length,
          '模型 ' + (MODEL_LABELS[m] || m) + '（' + (mi + 1) + '/' + selectedModels.length + '）');
        await runBatchLoop(m, 0);
        var modelDone = _batchModelRegistry[m].results.filter(function(r) { return r.status === 'done'; }).length;
        totalDone += modelDone;
        if (statusEl) {
          statusEl.textContent = modelDone === _batchCustomers.length ? '✅ 完成' : '⚠️ ' + modelDone + '/' + _batchCustomers.length;
          statusEl.className = 'output-tab-status done';
        }
        updateBatchProgress(totalDone, _batchCustomers.length * selectedModels.length,
          '模型 ' + (MODEL_LABELS[m] || m) + ' 完成');
      }
      // 全部完成，切回第一个 tab
      if (selectedModels.length > 0) switchOutputTab('batch', selectedModels[0]);
      var wasAborted = _batchAbortFlag;
      _batchRunning = false; _batchAbortFlag = false;
      _batchResults = []; // 多模型模式下清除单一引用，后续统一从 _batchModelRegistry 读取
      if (startBtn) startBtn.style.display = '';
      if (stopBtn) stopBtn.style.display = 'none';
      var allDone = 0;
      selectedModels.forEach(function(m) {
        allDone += _batchModelRegistry[m].results.filter(function(r) { return r.status === 'done'; }).length;
      });
      var totalExpected = _batchCustomers.length * selectedModels.length;
      updateBatchProgress(totalDone, totalExpected, '全部完成 ' + allDone + '/' + totalExpected);
      var exportBtn = document.getElementById('batchExportBtn');
      if (exportBtn && allDone > 0) {
        exportBtn.style.display = '';
        document.getElementById('batchSummaryTitle').textContent = '评估结果（' + selectedModels.length + ' 个模型，共 ' + allDone + ' 条记录）';
      }
      if (wasAborted && allDone < totalExpected) {
        showToast('已停止，完成 ' + allDone + '/' + totalExpected);
      } else if (allDone === totalExpected) {
        showToast('全部完成！' + selectedModels.length + ' 个模型，' + allDone + ' 条记录');
      } else {
        showToast('批量评估结束，完成 ' + allDone + '/' + totalExpected);
      }
    })();
  } else {
    // === 单模型模式（原有逻辑）===
    _batchCurrentModel = selectedModels[0];
    _batchModelRegistry[selectedModels[0]] = { results: _batchResults };
    if (resumeIdx >= 0) {
      var doneCount = _batchResults.filter(function(r) { return r.status === 'done'; }).length;
      showToast('从第 ' + (resumeIdx + 1) + ' 位客户继续（已完成 ' + doneCount + '/' + _batchCustomers.length + '）');
      for (var k = resumeIdx; k < _batchResults.length; k++) {
        _batchResults[k] = { customer: _batchCustomers[k], data: null, status: 'pending' };
        updateBatchSummaryRow(k, null, 'pending');
      }
      updateBatchProgress(resumeIdx, _batchCustomers.length, '继续评估...');
      renderBatchSummaryTable();
      runBatchLoop(selectedModels[0], resumeIdx);
    } else {
      _batchResults = [];
      _batchModelRegistry[selectedModels[0]].results = _batchResults;
      updateBatchProgress(0, _batchCustomers.length, '启动中...');
      renderBatchSummaryTable();
      _batchCustomers.forEach(function(c) {
        _batchResults.push({ customer: c, data: null, status: 'pending' });
      });
      _batchModelRegistry[selectedModels[0]].results = _batchResults;
      runBatchLoop(selectedModels[0], 0);
    }
  }
}

async function runBatchLoop(model, startIdx) {
  var isMulti = _batchSelectedModels.length > 1;
  var modelPrefix = isMulti ? (model + '-') : '';
  for (var i = startIdx; i < _batchCustomers.length; i++) {
    if (_batchAbortFlag) break;
    var c = _batchCustomers[i];
    updateBatchSummaryRow(i, null, 'running', isMulti ? model : '');
    if (!isMulti) updateBatchProgress(i, _batchCustomers.length, '正在评估：' + c.name);
    var retries = 2;
    for (var r = 0; r <= retries; r++) {
      try {
        if (r > 0) {
          if (!isMulti) updateBatchProgress(i, _batchCustomers.length, '重试：' + c.name + ' (' + r + '/' + retries + ')');
          await new Promise(function(rr) { setTimeout(rr, 8000); });
        }
        var panelId = 'batch-panel-' + (isMulti ? model + '-' : '') + i;
        var result = await callAIStream('batch_analysis', { customerName: c.name, productName: c.product, website: c.website }, model, panelId);
        var rawContent = result ? (result.content || '') : '';
        // 清理残留的 tool_call 标签和思考过程
        var cleanedContent = cleanAIContent(rawContent);
        var parsed = null;
        try {
          parsed = JSON.parse(cleanedContent);
        } catch (e1) {
          var jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try { parsed = JSON.parse(jsonMatch[0]); } catch (e2) { /* ignore */ }
          }
        }
        _batchResults[i].data = parsed;
        _batchResults[i].status = parsed ? 'done' : 'error';
        _batchResults[i].content = rawContent;
        updateBatchSummaryRow(i, parsed, parsed ? 'done' : 'error', isMulti ? model : '');
        if (parsed) break;
        if (!parsed && r === retries) {
          updateBatchSummaryRow(i, null, 'error', isMulti ? model : '');
        }
      } catch (err) {
        console.error('[batch] customer=' + c.name + ' retry=' + r + ' error:', err.message);
        if (r === retries) {
          _batchResults[i].status = 'error';
          _batchResults[i].data = null;
          updateBatchSummaryRow(i, null, 'error', isMulti ? model : '');
        }
      }
    }
    if (i < _batchCustomers.length - 1 && !_batchAbortFlag) {
      await new Promise(function(r) { setTimeout(r, 5000); });
    }
  }
  // 同步注册表（单模型模式下确保 registry 和 _batchResults 保持一致）
  if (_batchModelRegistry[model]) {
    _batchModelRegistry[model].results = _batchResults;
  }
  // 仅单模型模式才管理按钮和完成提示（多模型由 handleBatchAnalysis 统一管理）
  if (!isMulti) {
    var wasAborted = _batchAbortFlag;
    _batchRunning = false; _batchAbortFlag = false;
    var startBtn = document.getElementById('batchStartBtn');
    var stopBtn = document.getElementById('batchStopBtn');
    if (startBtn) startBtn.style.display = '';
    if (stopBtn) stopBtn.style.display = 'none';
    var done = _batchResults.filter(function(r) { return r.status === 'done'; }).length;
    var pending = _batchResults.filter(function(r) { return r.status !== 'done'; }).length;
    updateBatchProgress(_batchCustomers.length, _batchCustomers.length, '完成 ' + done + '/' + _batchCustomers.length + ' 位客户');
    var exportBtn = document.getElementById('batchExportBtn');
    if (exportBtn && done > 0) {
      exportBtn.style.display = '';
      document.getElementById('batchSummaryTitle').textContent = '评估结果（' + done + '/' + _batchCustomers.length + ' 完成）';
    }
    if (wasAborted && pending > 0) {
      showToast('已停止，完成 ' + done + '/' + _batchCustomers.length + '。再次点击可继续剩余');
    } else if (done === _batchCustomers.length) {
      showToast('批量评估全部完成！' + done + '/' + _batchCustomers.length);
    } else {
      showToast('批量评估结束，完成 ' + done + '/' + _batchCustomers.length);
    }
  }
}

function stopBatchAnalysis() {
  _batchAbortFlag = true;
  showToast('正在停止，当前客户完成后可继续');
}

function updateBatchProgress(done, total, statusText) {
  var textEl = document.getElementById('batchProgressText');
  var barEl = document.getElementById('batchProgressBar');
  var statusEl = document.getElementById('batchProgressStatus');
  if (textEl) textEl.textContent = done + ' / ' + total;
  if (statusEl) statusEl.textContent = statusText || '';
  if (barEl) barEl.style.width = (total > 0 ? Math.round(done / total * 100) : 0) + '%';
}
