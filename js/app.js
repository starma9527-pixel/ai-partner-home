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
        "title": "伙伴返佣政策 2025版",
        "size": "2.3MB",
        "date": "2025-02-20",
        "link": "#",
        "type": "PDF"
      },
      {
        "title": "AI大模型产品定价表",
        "size": "1.1MB",
        "date": "2025-02-15",
        "link": "#",
        "type": "PDF"
      },
      {
        "title": "云产品折扣审批流程",
        "size": "800KB",
        "date": "2025-01-10",
        "link": "#",
        "type": "PDF"
      }
    ],
    "tools": [
      {
        "title": "报价计算器",
        "desc": "快速生成客户报价单",
        "icon": "🧮",
        "link": "#"
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
    "knowledge": [
      {
        "title": "教育行业大模型落地案例",
        "type": "VIDEO",
        "date": "2025-02-10",
        "link": "#",
        "duration": ""
      },
      {
        "title": "制造业AI质检实战分享",
        "type": "VIDEO",
        "date": "2025-01-15",
        "link": "#",
        "duration": ""
      },
      {
        "title": "零售行业智能客服部署手册",
        "type": "PDF",
        "date": "2025-01-08",
        "link": "#",
        "size": "2.7MB"
      },
      {
        "title": "短剧/漫剧行业拓展一指禅",
        "type": "PDF",
        "date": "2025-03-01",
        "link": "https://alidocs.dingtalk.com/i/nodes/AR4GpnMqJzKpOoklFErwr23q8Ke0xjE3?corpId=dingd8e1123006514592&utm_medium=im_card&cid=284546643%3A2767829485&iframeQuery=utm_medium%3Dim_card%26utm_source%3Dim&utm_scene=person_space&utm_source=im",
        "size": "3.5MB"
      }
    ],
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
        "title": "伙伴如何快速上手通义千问API",
        "date": "2025-03-14 14:00",
        "speaker": "李四",
        "link": "#",
        "cover": ""
      },
      {
        "title": "云服务器选型与报价实战",
        "date": "2025-03-21 14:00",
        "speaker": "王五",
        "link": "#",
        "cover": ""
      }
    ],
    "moreLiveLink": "#"
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
        "link": "#"
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
        "link": "#"
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
        "link": "#"
      }
    ]
  },
  "rank": {
    "tokenRank": [
      {
        "rank": 1,
        "name": "重庆典名",
        "score": 128000
      },
      {
        "rank": 2,
        "name": "成都慕创",
        "score": 95000
      },
      {
        "rank": 3,
        "name": "重庆云之渝",
        "score": 87000
      },
      {
        "rank": 4,
        "name": "XXX",
        "score": 72000
      },
      {
        "rank": 5,
        "name": "XXX",
        "score": 65000
      }
    ],
    "caseRank": [
      {
        "rank": 1,
        "name": "锐智科技",
        "score": 23
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
        "title": "锐智科技签约XX医院智慧医疗项目",
        "amount": "230万",
        "date": "2025-02-28"
      },
      {
        "title": "云翔信息拿下XX教育局AI教学平台",
        "amount": "180万",
        "date": "2025-02-25"
      },
      {
        "title": "数联创新交付XX银行智能风控系统",
        "amount": "350万",
        "date": "2025-02-20"
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
  renderGuide();
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
    nav.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    window.scrollTo({ top: document.querySelector('.search-bar-area').offsetTop - 60, behavior: 'smooth' });
  });
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
  const hotDiv = document.getElementById('hotSearch');
  (siteData.hotSearch || []).forEach(tag => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = '#' + tag;
    a.onclick = (e) => { e.preventDefault(); document.getElementById('heroSearchInput').value = tag; handleSearch(); };
    hotDiv.appendChild(a);
  });
  const announcements = siteData.announcements || [];
  if (announcements.length > 0) {
    const textEl = document.getElementById('announceText');
    let idx = 0;
    function showAnnounce() {
      textEl.textContent = announcements[idx].text;
      idx = (idx + 1) % announcements.length;
    }
    showAnnounce();
    if (announcements.length > 1) setInterval(showAnnounce, 5000);
  }
  const grid = document.getElementById('quickGrid');
  (siteData.quickLinks || []).forEach(item => {
    const div = document.createElement('div');
    div.className = 'quick-card';
    div.innerHTML = `
      <div class="card-icon">${item.icon}</div>
      <div>
        <div class="card-title">${item.title}</div>
        <div class="card-desc">${item.desc}</div>
      </div>
    `;
    div.onclick = () => {
      const btn = document.querySelector(`.pill-btn[data-tab="${item.tab}"]`);
      if (btn) btn.click();
    };
    grid.appendChild(div);
  });
  const recGrid = document.getElementById('recommendGrid');
  const knowledge = (siteData.weapons && siteData.weapons.knowledge) || [];
  knowledge.slice(0, 4).forEach(item => {
    const isVideo = item.type === 'VIDEO';
    const div = document.createElement('div');
    div.className = 'rec-card';
    div.innerHTML = `
      <div class="rec-thumb">${isVideo ? '🎬' : '📄'}</div>
      <div class="rec-info">
        <div class="rec-title">${item.title}</div>
        <div class="rec-meta">
          <span class="rec-type ${isVideo ? 'type-video' : 'type-pdf'}">${item.type}</span>
          ${isVideo ? item.duration : item.size} · ${item.date}
        </div>
        <a href="${item.link}" class="btn-action" target="_blank">${isVideo ? '▶ 观看' : '📥 查看'}</a>
      </div>
    `;
    recGrid.appendChild(div);
  });
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
          <div class="doc-meta">${item.type} · ${item.size} · ${item.date}</div>
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
  renderRankList('tokenRankList', rank.tokenRank, ' tokens');
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

// ===== Action Handlers =====
function handleSearch() {
  const val = document.getElementById('heroSearchInput').value.trim();
  if (!val) { showToast('请输入搜索内容'); return; }
  showToast('AI搜索功能将在二期上线，敬请期待');
}

function handleCustomerAnalysis() {
  const val = document.getElementById('customerInput').value.trim();
  if (!val) { showToast('请输入客户名称'); return; }
  const outputDiv = document.getElementById('customerOutput');
  const contentDiv = document.getElementById('customerOutputContent');
  outputDiv.classList.add('show');
  contentDiv.innerHTML = '<span class="spinner"></span>AI正在深度分析中，请稍候（约15-30秒）...';
  callAI('customer_analysis', { customerName: val })
    .then(text => { contentDiv.textContent = text; })
    .catch(err => {
      contentDiv.textContent = '⚠ AI接口调用失败：' + err.message + '\n\n以下为离线模板报告：\n\n' + generateCustomerReport(val);
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
  const outputDiv = document.getElementById('visitOutput');
  const contentDiv = document.getElementById('visitOutputContent');
  outputDiv.classList.add('show');
  contentDiv.innerHTML = '<span class="spinner"></span>AI教练正在生成拜访计划，请稍候（约15-30秒）...';
  const details = Array.from(inputs).map(inp => {
    const label = inp.closest('.form-group')?.querySelector('label')?.textContent || '';
    return label.replace(' *', '') + '：' + inp.value;
  }).join('\n');
  callAI('visit_plan', { scene, role: roleSelect.value, details })
    .then(text => { contentDiv.textContent = text; })
    .catch(err => {
      contentDiv.textContent = '⚠ AI接口调用失败：' + err.message + '\n\n以下为离线模板计划：\n\n' + generateVisitPlan(scene, form, roleSelect.value);
    });
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
async function callAI(type, input) {
  const resp = await fetch('/api/ai-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, input })
  });
  const data = await resp.json();
  if (!resp.ok || data.error) throw new Error(data.error || '请求失败');
  return data.content;
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
    '二、用户行动承诺\n  最高：安排POC测试\n  最低：安排二次会议\n\n' +
    '三、信息获取\n  1. 决策链路\n  2. 预算状况\n\n' +
    '⚠ 部署到 Netlify 并配置 API Key 后即可使用 AI 实时生成拜访计划。';
}
