/* 繁體中文 — 首頁正文 */
I18N.register("zh-TW", { home: {
  title: "Xianheng Lu — 情感運算作品集",
  desc: "Xianheng Lu（魯先珩）的作品集：多模態情感運算、情感辨識與心理評估方向的研究與工程實作。",

  intro: { loading: "正在聚合粒子" },

  hero: {
    eyebrow: "作品集 · 2026",
    l1: "情感", l2: "運算", l3: "與情緒智能",
    meta: "Xianheng Lu — 北京信息科技大學。研究情感運算（Affective Computing）：讓機器同時聽懂聲音、看懂表情、讀懂文字，然後理解人的情緒。",
    badges: ["MoE<b>·</b>多專家融合", "VLM<b>·</b>知識蒸餾", "AU<b>·</b>時序建模", "Mental<b>·</b>心理評估"]
  },

  marquee: {
    r1: ["多模態融合", "情感辨識", "專家混合", "臉部動作單元"],
    r2: ["音訊 · 視覺 · 文字", "情感運算", "心理健康", "虛擬實境"]
  },

  about: {
    eyebrow: "關於",
    h2: "把情緒，<br><span class=\"grad\">變成可計算的訊號</span>",
    lead1: "我是 Xianheng Lu，研究方向是情感運算（Affective Computing）——讓機器理解人的情緒。比起把各模態簡單拼接，我更關注兩件事：如何讓不同的「專家」各自擅長、再投票決定最終情緒；以及如何把大視覺語言模型的常識知識，蒸餾進輕量的辨識模型中。",
    lead2: "做過的方向包括音視訊文字多模態情感辨識、臉部動作單元（AU）時序建模，以及基於訪談語料的憂鬱風險分析；也在探索虛擬實境場景下的情感運算與心理評估。",
    tags: ["多模態特徵工程", "MoE 融合策略", "偏好對齊", "AU 時序", "VLM 蒸餾", "跨受試者評估"],
    stats: [
      { v: "04", unit: "", label: "融合模態<br>音訊 / 視覺 / 文字 / AU" },
      { v: "2025", unit: "", label: "多模態感知<br>持續迭代中" },
      { v: "1", unit: "套", label: "MindVR 示範<br>訪談 → 心理狀態" },
      { v: "BISTU", unit: "", label: "北京信息科技大學<br>在讀研究" }
    ]
  },

  mindvr: {
    eyebrow: "互動示範",
    h2: "MindVR<br><span class=\"grad\">多模態心理狀態感知</span>",
    lead: "基於訪談文本與多模態特徵的心理狀態感知示範。可以直接執行內建範例，也可以在右側貼上訪談轉寫文本進行分析。",
    open: "全螢幕開啟",
    note: "示範結果僅供學術研究，不構成醫學診斷。"
  },

  work: {
    eyebrow: "精選作品",
    h2: "做過的事情",
    lead: "研究型專案與技術實作，從挑戰賽方案到可互動的小工具。",
    cta: "檢視詳情",
    ctaAll: "檢視全部",
    items: [
      { title: "MoE 多模態情感辨識框架", sub: "MER2025-SEMI · MRAC @ ACM MM 2025",
        desc: "以「更多即更好」為思路，把音訊、視覺、文字與臉部動作單元組織成四路獨立專家，引入大視覺語言模型的常識知識與偏好對齊來做路由與融合，完成方案復現、單模態對照與消融分析。",
        tags: ["PyTorch", "MoE", "VLM", "Action Unit"] },
      { title: "多模態 VR 心理健康評估系統", sub: "國家級大創 · 專案負責人",
        desc: "基於多模態感知與 VR 沉浸式互動的低成本即時心理健康評估系統：心率、膚電、眼動、臉部表情同步擷取，VR 標準化場景誘發真實情緒，即時輸出焦慮 / 憂鬱量化評估。",
        tags: ["VR · Unity", "多模態感知", "機器學習", "國家級大創"] },
      { title: "微震巡檢 · 運維守護者", sub: "2026 挑戰盃 · 市級一等獎",
        desc: "基於高精度訊號監測與無人機載通訊的安全運維系統。團隊孵化註冊公司並布局發明專利；我參與技術文件撰寫、簡報與專利文書。",
        tags: ["訊號監測", "無人機通訊", "發明專利"] },
      { title: "憂鬱傾向的語音分析", sub: "DAIC-WOZ · 訪談語料 · 進行中",
        desc: "面向半結構化訪談音訊的憂鬱風險分析流程：聲學與語言學特徵擷取、受試者級資料切分、跨受試者評估，重點處理樣本量小與個體差異大的問題。",
        tags: ["語音特徵", "特徵工程", "跨受試者評估"] },
      { title: "多模態特徵工具鏈", sub: "Feature Pipeline",
        desc: "多模態特徵維度自檢、資料集切分、單模態快速評測腳本。把重複的特徵與評測流程收斂成可重用的設定驅動工具，減少實驗踩坑。",
        tags: ["Python", "Shell", "conda"] },
      { title: "獲獎與榮譽", sub: "國家級 4 · 省市級 8 · 校級 5",
        desc: "機器人競賽、創新創業賽事與課程實踐的完整記錄：國家級 4 項、省 / 市級 8 項、校級 5 項，以及論文、專利與軟體著作成果。",
        tags: ["RAICOM 國二", "RST 國二", "挑戰盃市一"], all: true }
    ]
  },

  skills: {
    eyebrow: "工具箱", h2: "技術棧",
    groups: [
      { group: "Languages", c: "", items: [
        { n: "Python", v: 92 }, { n: "Shell / PowerShell", v: 76 },
        { n: "C / 嵌入式", v: 70 }, { n: "JavaScript", v: 64 } ] },
      { group: "ML Frameworks", c: "lime", items: [
        { n: "PyTorch", v: 88 }, { n: "NumPy / pandas", v: 86 },
        { n: "Transformers", v: 78 }, { n: "conda / 環境管理", v: 82 } ] },
      { group: "Research", c: "", items: [
        { n: "多模態特徵工程", v: 88 }, { n: "MoE / 融合策略", v: 80 },
        { n: "VLM 呼叫與蒸餾", v: 74 }, { n: "實驗設計與消融", v: 78 } ] },
      { group: "Tooling", c: "pink", items: [
        { n: "Git / GitHub", v: 84 }, { n: "Linux 伺服器", v: 76 },
        { n: "Jupyter", v: 86 }, { n: "資料視覺化", v: 80 } ] }
    ]
  },

  paper: {
    eyebrow: "論文", h2: "論文與預印本",
    items: [
      { kind: "[C] 2025",
        title: "More Is Better: A MoE-Based Emotion Recognition Framework with Human Preference Alignment",
        note: "MRAC @ ACM MM 2025 · MER2025-SEMI 挑戰賽參賽方案（runner-up）· arXiv:2508.06036" },
      { kind: "[R] 2026 在審",
        title: "CORAL-Guided Unsupervised Temperature Selection for Cross-Domain Acoustic Emotion Sensing",
        note: "IEEE Sensors Letters · 投稿在審（Initial Submission, 2026-07）· 跨域聲學情緒感知的無監督溫度選擇" },
      { kind: "[W] 進行中",
        title: "細粒度動作單元與 VLM 知識協同的多模態情感辨識",
        note: "整理中 —— 歡迎來信交流想法" }
    ]
  },

  bottle: {
    eyebrow: "Drift Bottle",
    h2: "把心事寫進瓶子",
    lead: "心裡有事、又不知道跟誰說的時候，就寫下來。折成紙條、塞進瓶子，扔進下面那條河。路過的人撈到它，也許會回你一封 —— 回信就留在瓶子裡，隨時回來看看。",
    qph: "最近讓我困擾的一件事是……",
    throw: "折成紙條投進河裡",
    throwing: "正在折紙條…",
    okSent: "瓶子已經扔進河裡了 · SENT",
    errShort: "還沒寫呢 —— 先寫下讓你困擾的事吧。",
    errLong: "寫得有點太長了，精簡一下再投吧。",
    errRate: "投瓶太頻繁了，過一個小時再來。",
    netFail: "信箱暫時連不上，稍後再試。"
  },

  river: {
    eyebrow: "River",
    h2: "河上漂著的瓶子",
    lead: "隨手撈一個看看 —— 裡面可能是別人的心事，也可能是一封寫給陌生人的信。",
    random: "隨機撈一個",
    empty: "河面還很安靜 —— 來做第一個投瓶的人？",
    countPrefix: "河上共 ",
    countUnit: " 個瓶子",
    note: "Bottle · 紙條",
    close: "關閉",
    replyTo: "回信會留在這個瓶子裡 —— 之後撈到它的人都能看到。",
    replies: "回信",
    anonymous: "匿名 · Anonymous",
    open: "撈起來看看",
    lift: "撈起來",
    replyph: "寫點你想對 TA 說的話……",
    nickph: "留個名字（可留空）",
    send: "把回信放進瓶子",
    done: "回信已經放進瓶子了 —— 之後撈到它的人都能看到。",
    replyShort: "還沒寫呢。",
    replyLong: "回信寫得有點太長了，精簡一下。",
    replyRate: "回信太頻繁了，緩一緩再寫。",
    replyFull: "這個瓶子的回信已經滿了，換一個瓶子吧。"
  },

  lab: {
    eyebrow: "遊樂場", h2: "隨便畫兩筆",
    lead: "按住拖曳，顏色會隨你的筆跡流動。畫歪了就用橡皮擦抹掉。",
    hint: "按住拖曳", eraser: "橡皮擦", eraserOn: "擦除中", clear: "清空",
    aria: "可自由塗鴉的畫布"
  },
  gesture: {
    eyebrow: "Punching Bag", h2: "電子沙袋",
    lead: "一團幾千顆微光凝成的核懸在中間，像一顆有呼吸的情緒核心。它就是個沙袋 —— 心裡堵得慌的話，抬手狠狠揮過去：手速夠快時它會整個炸開，散成滿屏碎片，再被引力慢慢吸回來，等你的下一拳。不開攝影機也能玩，甩滑鼠一樣能打。畫面只在你本機處理，不會被上傳。",
    veilH: "讓 TA 看見你",
    veilP: "攝影機畫面全程只在你本機運算，不錄製、不上傳。隨時可以關掉。",
    start: "開啟手勢", stop: "關掉手勢",
    aria: "由數千顆粒子聚成的情緒核心",
    fps: "fps", privacy: "本機運算",
    "state": "STATE", "charge": "蓄力",
    stGather: "聚攏", stCharged: "蓄力", stImpact: "衝擊", stExplode: "爆發",
    chipOpen: "掌心朝我", chipPinch: "捏住", chipMove: "揮動", chipSteady: "靜下來",
    trackYes: "已鎖定", trackNo: "未鎖定",
    modeAria: "游標作用範圍", modeRegion: "區域內跟隨", modeGlobal: "接管整個游標",
    camTag: "CAMERA · LOCAL",
    noteIdle: "手勢未開啟 —— 甩滑鼠也能把它打散。",
    noteAsking: "正在請求攝影機權限……",
    noteReady: "已鎖定你的手 —— 快速揮過去就能把它打散。",
    noteNoHand: "沒看到手 —— 把手抬到畫面裡，離攝影機 40~80 公分。",
    noteMouse: "滑鼠模式 —— 快速劃過核心，也能把它打散。",
    noteGlobal: "已接管整個游標 —— 用手指指向按鈕，捏合即點擊。再切回區域內即可交還。",
    noteDenied: "攝影機權限被拒絕了 —— 想玩的話在網址列允許攝影機後重試。",
    noteNoCam: "找不到攝影機裝置 —— 用滑鼠試試。",
    noteUnsupported: "這個瀏覽器或裝置不支援攝影機手勢 —— 用滑鼠一樣可以玩。",
    noteFail: "手勢沒啟動起來 —— 網路或裝置限制，用滑鼠也能玩。",
    noteCharged: "核在蓄力 —— 再快一點，打過去。",
    noteScatter: "打散了 —— 引力正在把它吸回來。",
    noteScatterMouse: "打散了 —— 等它自己聚回來。",
    playAria: "選擇玩法", playBag: "電子沙袋", playFruit: "快刀切水果",
    fruitCombo: "連擊", fruitScore: "分",
    fruitOverH: "收刀！", fruitOverP: "這一局手速不錯，再來一把？", fruitRestart: "再來一局",
    fruitNoteIdle: "水果會從下面拋上來 —— 切水果、躲炸彈，五顆心掉光就收刀。",
    fruitNoteReady: "看到手了 —— 快速劃過水果就能切開，炸彈碰不得。",
    fruitNoteMouse: "揮動滑鼠劃過水果就能切開。躲開炸彈，切中醫療包回血。",
    fruitNoteNoHand: "沒看到手 —— 把手抬到畫面裡再揮。",
    fruitNoteCombo: "連擊 ×{n} —— 別斷。",
    fruitNoteMiss: "漏了一個 —— 連擊斷了。",
    fruitNoteBomb: "切到炸彈了 —— 炸掉一顆心。",
    fruitNoteMed: "醫療包 —— 補回一顆心。",
    fruitNoteMedFull: "已經滿血 —— 醫療包換成 3 分。",
    fruitNoteSliced: "切得漂亮。",
fruitNoteOver: "收刀了 —— 想再來一局就點「再來一局」。",
    playVb: "電子排球",
    vbRally: "連續",
    vbMiss: "失誤",
    vbOverH: "落地了",
    vbOverP: "這一輪墊得不錯，再來一次？",
    vbRestart: "再來一球",
    vbNoteIdle: "球會自己拋起來 —— 揮手把它墊過網，別讓它落地。",
    vbNoteReady: "看到手了 —— 往上揮手把球墊過網。",
    vbNoteMoveTo: "把手移到球上、往上托 —— 光點碰到球就算墊到。",
    vbNoteMouse: "甩動滑鼠划過球就能把它墊起來。",
    vbNoteNoHand: "沒看到手 —— 把手抬到畫面裡再墊。",
    vbNoteHit: "墊到了。",
    vbNoteMiss: "球落地了 —— 還剩 {n} 次機會。",
    vbNoteOver: "球落地了 —— 想再來一輪就點「再來一球」。",
    vbAria: "手勢控制的電子排球，揮手把球墊過網"
  },

  contact: {
    eyebrow: "保持聯絡",
    h2: "一起聊聊<span class=\"grad\">情緒</span>",
    lead: "對多模態情感運算、心理評估或資料合作感興趣，歡迎直接寄信。",
    copyTitle: "點擊複製電子郵件地址",
    hint: "點擊按鈕複製信箱 · 或 <a href=\"mailto:luxianheng@bistu.edu.cn\">用郵件軟體寫信</a>"
  }
}});
