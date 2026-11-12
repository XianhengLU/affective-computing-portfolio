/* 简体中文 —— 首页正文
   默认语言刻意保留「中英结合」的原始排版风格：
   英文标题 / 英文技术名词 / 英文分组名 原样保留，中文做解释与叙述。
   仅英语、日语、繁体中文、法语、西班牙语、德语走全量翻译。 */
I18N.register("zh-CN", { home: {
  title: "Xianheng Lu — Affective Computing Portfolio",
  desc: "Xianheng Lu（鲁先珩）的作品集：Multimodal Affective Computing、情感识别与心理评估方向的研究与工程实践。",

  intro: { loading: "聚合粒子中 · CONVERGING" },

  hero: {
    eyebrow: "Portfolio · 作品集 · 2026",
    l1: "Affective", l2: "Computing", l3: "& Emotion AI",
    meta: "Xianheng Lu — 北京信息科技大学 · BISTU。研究 Affective Computing（情感计算）：让机器同时听懂声音、看懂表情、读懂文字，然后理解人的情绪。",
    badges: ["MoE<b>·</b>多专家融合", "VLM<b>·</b>知识蒸馏", "AU<b>·</b>时序建模", "Mental<b>·</b>心理评估"]
  },

  marquee: {
    r1: ["Multimodal Fusion", "Emotion Recognition", "Mixture of Experts", "Action Units"],
    r2: ["Audio · Visual · Text", "Affective Computing", "Mental Health", "Virtual Reality"]
  },

  about: {
    eyebrow: "About",
    h2: "把情绪，<br><span class=\"grad\">变成可计算的信号</span>",
    lead1: "我是 Xianheng Lu，研究方向是情感计算（Affective Computing）——让机器理解人的情绪。比起把各模态简单拼接，我更关注两件事：如何让不同的 Expert 各自擅长、再投票决定最终情绪；以及如何把大视觉语言模型 VLM 的常识知识，蒸馏进轻量的识别模型中。",
    lead2: "做过的方向包括 Audio-Visual-Text 多模态情感识别、面部动作单元 Action Unit（AU）时序建模，以及基于访谈语料的抑郁风险分析；也在探索 Virtual Reality 场景下的情感计算与心理评估。",
    tags: ["多模态特征工程", "MoE 融合策略", "Preference Alignment", "AU 时序", "VLM 蒸馏", "跨被试评估"],
    stats: [
      { v: "04", unit: "", label: "融合模态<br>Audio / Visual / Text / AU" },
      { v: "2025", unit: "", label: "多模态感知<br>持续迭代中" },
      { v: "1", unit: "套", label: "MindVR 演示<br>访谈 → 心理状态" },
      { v: "BISTU", unit: "", label: "北京信息科技大学<br>在读研究" }
    ]
  },

  mindvr: {
    eyebrow: "交互演示",
    h2: "MindVR<br><span class=\"grad\">多模态心理状态感知</span>",
    lead: "基于访谈文本与多模态特征的心理状态感知演示。可以直接运行内置示例，也可以在右侧粘贴访谈转写文本进行分析。",
    open: "全屏打开",
    note: "演示结果仅用于学术研究，不构成医学诊断。"
  },

  work: {
    eyebrow: "Selected Work",
    h2: "做过的事情",
    lead: "研究型项目与技术实践，从 Challenge 方案到可交互的小工具。",
    cta: "查看详情",
    ctaAll: "查看全部",
    items: [
      { title: "MoE 多模态情感识别框架", sub: "MER2025-SEMI · MRAC @ ACM MM 2025",
        desc: "以「More Is Better」为思路，把 Audio、Visual、Text 与 Action Unit 组织成四路独立 Expert，引入 VLM 的常识知识与 Preference Alignment 来做路由与融合，完成方案复现、单模态对照与消融分析。",
        tags: ["PyTorch", "MoE", "VLM", "Action Unit"] },
      { title: "多模态 VR 心理健康评估系统", sub: "国家级大创 · 项目负责人",
        desc: "基于多模态感知与 VR 沉浸交互的低成本实时心理健康评估系统：心率、皮电、眼动、面部表情同步采集，VR 标准化场景诱发真实情绪，实时输出焦虑 / 抑郁量化评估。",
        tags: ["VR · Unity", "多模态感知", "Machine Learning", "国家级大创"] },
      { title: "微震巡检 · 运维守护者", sub: "2026 挑战杯 · 市级一等奖",
        desc: "基于高精度信号监测与无人机载通信的安全运维系统。团队孵化注册公司并布局发明专利；我参与技术材料撰写、路演与专利文书。",
        tags: ["Signal Monitoring", "无人机通信", "发明专利"] },
      { title: "抑郁倾向的语音分析", sub: "DAIC-WOZ · 访谈语料 · 进行中",
        desc: "面向半结构化访谈音频的抑郁风险分析流程：声学与语言学特征提取、被试级数据切分、跨被试评估，重点处理样本量小与个体差异大的问题。",
        tags: ["语音特征", "Feature Engineering", "跨被试评估"] },
      { title: "多模态特征工具链", sub: "Feature Pipeline",
        desc: "多模态特征维度自检、数据集切分、单模态快速评测脚本。把重复的特征与评测流程收敛成可复用的配置驱动工具，减少实验踩坑。",
        tags: ["Python", "Shell", "conda"] },
      { title: "获奖与荣誉", sub: "国家级 4 · 省市级 8 · 校级 5",
        desc: "机器人竞赛、创新创业赛事与课程实践的完整记录：国家级 4 项、省 / 市级 8 项、校级 5 项，以及论文、专利与软著成果。",
        tags: ["RAICOM 国二", "RST 国二", "挑战杯市一"], all: true }
    ]
  },

  skills: {
    eyebrow: "Toolbox", h2: "技术栈",
    groups: [
      { group: "Languages", c: "", items: [
        { n: "Python", v: 92 }, { n: "Shell / PowerShell", v: 76 },
        { n: "C / 嵌入式", v: 70 }, { n: "JavaScript", v: 64 } ] },
      { group: "ML Frameworks", c: "lime", items: [
        { n: "PyTorch", v: 88 }, { n: "NumPy / pandas", v: 86 },
        { n: "Transformers", v: 78 }, { n: "conda / 环境管理", v: 82 } ] },
      { group: "Research", c: "", items: [
        { n: "多模态特征工程", v: 88 }, { n: "MoE / 融合策略", v: 80 },
        { n: "VLM 调用与蒸馏", v: 74 }, { n: "实验设计与消融", v: 78 } ] },
      { group: "Tooling", c: "pink", items: [
        { n: "Git / GitHub", v: 84 }, { n: "Linux 服务器", v: 76 },
        { n: "Jupyter", v: 86 }, { n: "数据可视化", v: 80 } ] }
    ]
  },

  paper: {
    eyebrow: "Papers", h2: "论文与预印本",
    items: [
      { kind: "[C] 2025",
        title: "More Is Better: A MoE-Based Emotion Recognition Framework with Human Preference Alignment",
        note: "MRAC @ ACM MM 2025 · MER2025-SEMI 挑战赛参赛方案（runner-up）· arXiv:2508.06036" },
      { kind: "[R] 2026 在审",
        title: "CORAL-Guided Unsupervised Temperature Selection for Cross-Domain Acoustic Emotion Sensing",
        note: "IEEE Sensors Letters · 投稿在审（Initial Submission, 2026-07）· 跨域声学情绪感知的无监督温度选择" },
      { kind: "[W] 进行中",
        title: "细粒度动作单元与 VLM 知识协同的多模态情感识别",
        note: "整理中 —— 欢迎邮件交流想法" }
    ]
  },

  bottle: {
    eyebrow: "Drift Bottle",
    h2: "把心事写进瓶子",
    lead: "心里有事、又不知道跟谁说的时候，就写下来。折成纸条、塞进瓶子，扔进下面那条河。路过的人捞到它，也许会回你一封 —— 回信就留在瓶子里，随时回来看看。",
    qph: "最近让我困扰的一件事是……",
    throw: "折成纸条投进河里",
    throwing: "正在折纸条…",
    okSent: "瓶子已经扔进河里了 · SENT",
    errShort: "还没写呢 —— 先写下让你困扰的事吧。",
    errLong: "写得有点太长了，精简一下再投吧。",
    errRate: "投瓶太频繁了，过一个小时再来。",
    netFail: "信箱暂时连不上，稍后再试。"
  },

  river: {
    eyebrow: "River",
    h2: "河上漂着的瓶子",
    lead: "随手捞一个看看 —— 里面可能是别人的心事，也可能是一封写给陌生人的信。",
    random: "随机捞一个",
    empty: "河面还很安静 —— 来做第一个投瓶的人？",
    countPrefix: "河上共 ",
    countUnit: " 个瓶子",
    note: "Bottle · 纸条",
    close: "关闭",
    replyTo: "回信会留在这个瓶子里 —— 之后捞到它的人都能看到。",
    replies: "回信",
    anonymous: "匿名 · Anonymous",
    open: "捞起来看看",
    lift: "捞起来",
    replyph: "写点你想对 TA 说的话……",
    nickph: "留个名字（可留空）",
    send: "把回信放进瓶子",
    done: "回信已经放进瓶子了 —— 之后捞到它的人都能看到。",
    replyShort: "还没写呢。",
    replyLong: "回信写得有点太长了，精简一下。",
    replyRate: "回信太频繁了，缓一缓再写。",
    replyFull: "这个瓶子的回信已经满了，换一个瓶子吧。"
  },

  lab: {
    eyebrow: "Playground", h2: "随便画两笔",
    lead: "按住拖动，颜色会随你的笔迹流动。画歪了就用橡皮擦抹掉。",
    hint: "按住拖动", eraser: "橡皮擦", eraserOn: "擦除中", clear: "清空",
    aria: "可自由涂鸦的画布"
  },
  gesture: {
    eyebrow: "Punching Bag", h2: "电子沙袋",
    lead: "一团几千颗微光凝成的核悬在中间，像一颗有呼吸的情绪核心。它就是个沙袋 —— 心里堵得慌的话，抬手狠狠挥过去：手速够快时它会整个炸开，散成满屏碎片，再被引力慢慢吸回来，等你的下一拳。不开摄像头也能玩，甩鼠标一样能打。画面只在你本机处理，不会被上传。",
    veilH: "让 TA 看见你",
    veilP: "摄像头画面全程只在你本机运算，不录制、不上传。随时可以关掉。",
    start: "开启手势", stop: "关掉手势",
    aria: "情绪发泄用的电子沙袋，由数千颗粒子聚成",
    fps: "fps", privacy: "本地运算",
    "state": "STATE", "charge": "蓄力",
    stGather: "聚拢", stCharged: "蓄力", stImpact: "冲击", stExplode: "爆发",
    chipOpen: "掌心朝我", chipPinch: "捏住", chipMove: "挥动", chipSteady: "静下来",
    trackYes: "已锁定", trackNo: "未锁定",
    modeAria: "光标作用范围", modeRegion: "区域内跟随", modeGlobal: "接管整个光标",
    camTag: "CAMERA · LOCAL",
    noteIdle: "手势未开启 —— 甩鼠标也能出气。",
    noteAsking: "正在请求摄像头权限……",
    noteReady: "已锁定你的手 —— 狠狠挥过去，打散它。",
    noteNoHand: "没看到手 —— 把手抬到画面里，离摄像头 40~80 厘米。",
    noteMouse: "鼠标模式 —— 快速划过沙袋，也能一拳打散它。",
    noteGlobal: "已接管整个光标 —— 用手指指向按钮，捏合即点击。再切回区域内即可交还。",
    noteDenied: "摄像头权限被拒绝了 —— 想玩的话在地址栏允许摄像头后重试。",
    noteNoCam: "没找到摄像头设备 —— 用鼠标一样能出气。",
    noteUnsupported: "这个浏览器或设备不支持摄像头手势 —— 用鼠标一样可以玩。",
    noteFail: "手势没启动起来 —— 网络或设备限制，用鼠标也能玩。",
    noteCharged: "沙袋在蓄力 —— 再快一点，打过去。",
    noteScatter: "打散了 —— 引力正在把它吸回来。",
    noteScatterMouse: "打散了 —— 等它自己聚回来，再补一拳。",
    playAria: "选择玩法", playBag: "电子沙袋", playFruit: "快刀切水果",
    fruitCombo: "连击", fruitScore: "分",
    fruitOverH: "收刀！", fruitOverP: "这一局手速不错，再来一把？", fruitRestart: "再来一局",
    fruitNoteIdle: "水果会从下面抛上来 —— 切水果、躲炸弹，五颗心掉光就收刀。",
    fruitNoteReady: "看到手了 —— 快速划过水果就能切开，炸弹碰不得。",
    fruitNoteMouse: "挥动鼠标划过水果就能切开。躲开炸弹，切中医疗包回血。",
    fruitNoteNoHand: "没看到手 —— 把手抬到画面里再挥。",
    fruitNoteCombo: "连击 ×{n} —— 别断。",
    fruitNoteMiss: "漏了一个 —— 连击断了。",
    fruitNoteBomb: "切到炸弹了 —— 炸掉一颗心。",
    fruitNoteMed: "医疗包 —— 补回一颗心。",
    fruitNoteMedFull: "已经满血 —— 医疗包换成 3 分。",
    fruitNoteSliced: "切得漂亮。",
fruitNoteOver: "收刀了 —— 想再来一局就点「再来一局」。",
    playVb: "电子排球",
    vbRally: "连续",
    vbMiss: "失误",
    vbOverH: "落地了",
    vbOverP: "这一轮垫得不错，再来一次？",
    vbRestart: "再来一球",
    vbNoteIdle: "球会自己抛起来 —— 挥手把它垫过网，别让它落地。",
    vbNoteReady: "看到手了 —— 往上挥手把球垫过网。",
    vbNoteMoveTo: "把手移到球上、往上托 —— 光点碰到球就算垫到。",
    vbNoteMouse: "甩动鼠标划过球就能把它垫起来。",
    vbNoteNoHand: "没看到手 —— 把手抬到画面里再垫。",
    vbNoteHit: "垫到了。",
    vbNoteMiss: "球落地了 —— 还剩 {n} 次机会。",
    vbNoteOver: "球落地了 —— 想再来一轮就点「再来一球」。",
    vbAria: "手势控制的电子排球，挥手把球垫过网"
  },

  contact: {
    eyebrow: "Get in Touch",
    h2: "一起聊聊<span class=\"grad\">情绪</span>",
    lead: "对 Multimodal Affective Computing、心理评估或数据合作感兴趣，欢迎直接发邮件。",
    copyTitle: "点击复制邮箱地址",
    hint: "点击按钮复制邮箱地址 · 或 <a href=\"mailto:luxianheng@bistu.edu.cn\">用邮件客户端写信</a>"
  }
}});
