/* ==================================================================
   chrome.js —— 全站通用文案（导航 / 页脚 / 辅助 / 详情页标签）
   所有页面都会加载；首页的正文文案见 assets/i18n/*.js
   ================================================================== */
(function () {
  if (!window.I18N) return;
  var R = I18N.register;

  /* 简体中文（默认语言）：保留原始的中英结合排版，不整体中文化 */
  R("zh-CN", { chrome: {
    nav: { about: "关于", mindvr: "MindVR", skills: "技能", lab: "画布", gesture: "凌空", contact: "联系我" },
    footer: { place: "Open Source · MIT", home: "首页", awards: "获奖", email: "Email", github: "GitHub", arxiv: "arXiv" },
    a11y: { backtop: "回到顶部", langOpen: "切换语言", langMenu: "选择语言" },
    cursor: { view: "查看", draw: "拖动", copy: "复制" },
    doc: {
      l: { Time: "时间", Role: "角色", Venue: "会议", Stack: "技术栈", Level: "级别", Advisor: "指导教师", Affiliation: "单位", Award: "奖项", IP: "知识产权", Entity: "主体" }, time: "时间", role: "角色", venue: "会议", stack: "技术栈", notice: "本页正文为中文原文" },
    copy: { done: "已复制 ✓", failed: "复制失败，请手动选中" },
    pager: { back: "← 返回", next: "下一篇 →", all: "返回全部作品" },
    hud: { local: "本地" },
    lang: { title: "语言 / Language", open: "切换语言" }
  }});

  R("zh-TW", { chrome: {
    nav: { about: "關於", mindvr: "MindVR", skills: "技能", lab: "畫布", gesture: "凌空", contact: "聯絡我" },
    footer: { place: "Open Source · MIT", home: "首頁", awards: "獲獎", email: "Email", github: "GitHub", arxiv: "arXiv" },
    a11y: { backtop: "回到頂端", langOpen: "切換語言", langMenu: "選擇語言" },
    cursor: { view: "檢視", draw: "拖曳", copy: "複製" },
    doc: {
      l: { Time: "時間", Role: "角色", Venue: "會議", Stack: "技術棧", Level: "級別", Advisor: "指導教師", Affiliation: "單位", Award: "獎項", IP: "智慧財產", Entity: "主體" }, time: "時間", role: "角色", venue: "會議", stack: "技術棧", notice: "本頁正文為中文原文" },
    copy: { done: "已複製 ✓", failed: "複製失敗，請手動選取" },
    pager: { back: "← 返回", next: "下一篇 →", all: "返回全部作品" },
    hud: { local: "本地" },
    lang: { title: "語言 / Language", open: "切換語言" }
  }});

  R("en", { chrome: {
    nav: { about: "About", mindvr: "MindVR", skills: "Skills", lab: "Canvas", gesture: "Spatial", contact: "Contact" },
    footer: { place: "Open Source · MIT", home: "Home", awards: "Awards", email: "Email", github: "GitHub", arxiv: "arXiv" },
    a11y: { backtop: "Back to top", langOpen: "Switch language", langMenu: "Choose language" },
    cursor: { view: "View", draw: "Drag", copy: "Copy" },
    doc: {
      l: { Time: "Time", Role: "Role", Venue: "Venue", Stack: "Stack", Level: "Level", Advisor: "Advisor", Affiliation: "Affiliation", Award: "Award", IP: "IP", Entity: "Entity" }, time: "Time", role: "Role", venue: "Venue", stack: "Stack", notice: "Original write-up in Chinese" },
    copy: { done: "Copied ✓", failed: "Copy failed — please select the text manually" },
    pager: { back: "← Back", next: "Next →", all: "All work" },
    hud: { local: "LOCAL" },
    lang: { title: "Language", open: "Switch language" }
  }});

  R("ja", { chrome: {
    nav: { about: "私について", mindvr: "MindVR", skills: "スキル", lab: "キャンバス", gesture: "空間", contact: "お問い合わせ" },
    footer: { place: "Open Source · MIT", home: "ホーム", awards: "受賞", email: "Email", github: "GitHub", arxiv: "arXiv" },
    a11y: { backtop: "トップへ戻る", langOpen: "言語を切り替え", langMenu: "言語を選択" },
    cursor: { view: "見る", draw: "ドラッグ", copy: "コピー" },
    doc: {
      l: { Time: "時期", Role: "役割", Venue: "発表先", Stack: "技術スタック", Level: "級", Advisor: "指導教員", Affiliation: "所属", Award: "受賞", IP: "知財", Entity: "実施主体" }, time: "時期", role: "役割", venue: "発表先", stack: "技術スタック", notice: "本文は中国語原文です" },
    copy: { done: "コピーしました ✓", failed: "コピーできません。手動で選択してください" },
    pager: { back: "← 戻る", next: "次へ →", all: "すべての作品" },
    hud: { local: "現地" },
    lang: { title: "言語", open: "言語を切り替え" }
  }});

  R("fr", { chrome: {
    nav: { about: "À propos", mindvr: "MindVR", skills: "Compétences", lab: "Canevas", gesture: "Spatial", contact: "Contact" },
    footer: { place: "Open Source · MIT", home: "Accueil", awards: "Prix", email: "Email", github: "GitHub", arxiv: "arXiv" },
    a11y: { backtop: "Haut de page", langOpen: "Changer de langue", langMenu: "Choisir la langue" },
    cursor: { view: "Voir", draw: "Dessiner", copy: "Copier" },
    doc: {
      l: { Time: "Période", Role: "Rôle", Venue: "Lieu", Stack: "Technos", Level: "Niveau", Advisor: "Encadrant", Affiliation: "Établissement", Award: "Prix", IP: "PI", Entity: "Structure" }, time: "Période", role: "Rôle", venue: "Lieu", stack: "Technos", notice: "Texte original en chinois" },
    copy: { done: "Copié ✓", failed: "Copie impossible — sélectionnez le texte" },
    pager: { back: "← Retour", next: "Suivant →", all: "Tous les projets" },
    hud: { local: "LOCAL" },
    lang: { title: "Langue", open: "Changer de langue" }
  }});

  R("es", { chrome: {
    nav: { about: "Sobre mí", mindvr: "MindVR", skills: "Habilidades", lab: "Lienzo", gesture: "Espacial", contact: "Contacto" },
    footer: { place: "Open Source · MIT", home: "Inicio", awards: "Premios", email: "Email", github: "GitHub", arxiv: "arXiv" },
    a11y: { backtop: "Volver arriba", langOpen: "Cambiar idioma", langMenu: "Elegir idioma" },
    cursor: { view: "Ver", draw: "Dibujar", copy: "Copiar" },
    doc: {
      l: { Time: "Periodo", Role: "Rol", Venue: "Lugar", Stack: "Tecnologías", Level: "Nivel", Advisor: "Tutor", Affiliation: "Institución", Award: "Premio", IP: "PI", Entity: "Entidad" }, time: "Periodo", role: "Rol", venue: "Lugar", stack: "Tecnologías", notice: "Texto original en chino" },
    copy: { done: "Copiado ✓", failed: "No se pudo copiar — selecciona el texto" },
    pager: { back: "← Volver", next: "Siguiente →", all: "Todos los proyectos" },
    hud: { local: "LOCAL" },
    lang: { title: "Idioma", open: "Cambiar idioma" }
  }});

  R("de", { chrome: {
    nav: { about: "Über mich", mindvr: "MindVR", skills: "Kenntnisse", lab: "Zeichenfläche", gesture: "Räumlich", contact: "Kontakt" },
    footer: { place: "Open Source · MIT", home: "Startseite", awards: "Auszeichnungen", email: "Email", github: "GitHub", arxiv: "arXiv" },
    a11y: { backtop: "Nach oben", langOpen: "Sprache wechseln", langMenu: "Sprache wählen" },
    cursor: { view: "Ansehen", draw: "Zeichnen", copy: "Kopieren" },
    doc: {
      l: { Time: "Zeitraum", Role: "Rolle", Venue: "Ort", Stack: "Technik", Level: "Stufe", Advisor: "Betreuer", Affiliation: "Hochschule", Award: "Preis", IP: "IP", Entity: "Träger" }, time: "Zeitraum", role: "Rolle", venue: "Ort", stack: "Technik", notice: "Originaltext auf Chinesisch" },
    copy: { done: "Kopiert ✓", failed: "Kopieren fehlgeschlagen — bitte manuell markieren" },
    pager: { back: "← Zurück", next: "Weiter →", all: "Alle Projekte" },
    hud: { local: "LOKAL" },
    lang: { title: "Sprache", open: "Sprache wechseln" }
  }});
})();
