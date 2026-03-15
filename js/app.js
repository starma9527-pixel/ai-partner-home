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
        "link": "http://47.109.203.32/"
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
        "title": "重庆典名签约XX私有云项目",
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

// Code part could not be loaded. Please paste the full app.js manually.
