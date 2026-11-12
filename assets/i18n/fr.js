/* Français — textes de la page d'accueil */
I18N.register("fr", { home: {
  title: "Xianheng Lu — Portfolio d'informatique affective",
  desc: "Portfolio de Xianheng Lu : recherche et ingénierie en informatique affective multimodale, reconnaissance des émotions et évaluation de la santé mentale.",

  intro: { loading: "composition des particules" },

  hero: {
    eyebrow: "Portfolio · 2026",
    l1: "Informatique", l2: "Affective", l3: "& IA émotionnelle",
    meta: "Xianheng Lu — Université de science et technologie de l'information de Pékin. Je travaille sur l'informatique affective (Affective Computing) : permettre à la machine d'entendre la voix, de voir le visage et de lire les mots, puis de comprendre ce que ressent réellement la personne.",
    badges: ["MoE<b>·</b>Experts", "VLM<b>·</b>Distillation", "AU<b>·</b>Temporel", "Mental<b>·</b>Évaluation"]
  },

  marquee: {
    r1: ["Fusion multimodale", "Reconnaissance des émotions", "Mélange d'experts", "Unités d'action"],
    r2: ["Audio · Visuel · Texte", "Informatique affective", "Santé mentale", "Réalité virtuelle"]
  },

  about: {
    eyebrow: "À propos",
    h2: "Transformer l'émotion<br><span class=\"grad\">en signal calculable</span>",
    lead1: "Je suis Xianheng Lu, et mon domaine de recherche est l'informatique affective — faire comprendre les émotions humaines aux machines. Plutôt que de concaténer simplement les modalités, je m'intéresse à deux choses : laisser chaque expert faire ce qu'il sait faire puis voter sur l'émotion finale, et distiller les connaissances de bon sens des grands modèles vision-langage dans des modèles de reconnaissance légers.",
    lead2: "J'ai travaillé sur la reconnaissance audio-vidéo-texte des émotions, la modélisation temporelle des unités d'action faciales et l'analyse du risque de dépression à partir de corpus d'entretiens. J'explore aussi l'informatique affective et l'évaluation psychologique en réalité virtuelle.",
    tags: ["Caractéristiques multimodales", "Fusion MoE", "Alignement de préférences", "Séquences AU", "Distillation VLM", "Évaluation inter-sujets"],
    stats: [
      { v: "04", unit: "", label: "Modalités fusionnées<br>Audio / Vision / Texte / AU" },
      { v: "2025", unit: "", label: "Perception multimodale<br>en évolution" },
      { v: "1", unit: "jeu", label: "Démo MindVR<br>entretien → état mental" },
      { v: "BISTU", unit: "", label: "Univ. de science et technologie<br>de l'information de Pékin" }
    ]
  },

  mindvr: {
    eyebrow: "Démo interactive",
    h2: "MindVR<br><span class=\"grad\">Perception multimodale de l'état mental</span>",
    lead: "Une démo de perception de l'état mental fondée sur des transcriptions d'entretien et des caractéristiques multimodales. Lancez l'exemple intégré ou collez une transcription à droite pour l'analyser.",
    open: "Ouvrir en plein écran",
    note: "Les résultats sont destinés à la recherche académique uniquement et ne constituent pas un diagnostic médical."
  },

  work: {
    eyebrow: "Sélection", h2: "Ce que j'ai construit",
    lead: "Projets de recherche et pratique d'ingénierie, des soumissions de concours aux petits outils interactifs.",
    cta: "Voir le détail",
    ctaAll: "Tout voir",
    items: [
      { title: "Reconnaissance multimodale des émotions par MoE", sub: "MER2025-SEMI · MRAC @ ACM MM 2025",
        desc: "Une approche « more is better » : audio, vision, texte et unités d'action deviennent quatre experts indépendants, tandis qu'un grand modèle vision-langage apporte connaissances de bon sens et alignement de préférences pour le routage et la fusion. J'ai reproduit la méthode et mené comparaisons unimodales et ablations.",
        tags: ["PyTorch", "MoE", "VLM", "Unités d'action"] },
      { title: "Évaluation de santé mentale en RV multimodale", sub: "Recherche étudiante nationale · Chef de projet",
        desc: "Un système d'évaluation psychologique temps réel et peu coûteux, fondé sur la perception multimodale et la RV immersive : fréquence cardiaque, conductance cutanée, oculométrie et expression faciale synchronisées, scènes VR standardisées pour susciter une émotion authentique, avec des mesures quantifiées d'anxiété et de dépression.",
        tags: ["RV · Unity", "Perception multimodale", "Apprentissage automatique", "Projet national"] },
      { title: "Inspection micro-sismique · Gardien d'exploitation", sub: "Challenge Cup 2026 · Premier prix municipal",
        desc: "Un système de surveillance fondé sur un suivi de signal haute précision et une liaison de communication par drone. L'équipe a créé une société et déposé des brevets ; j'ai contribué à la rédaction technique, au pitch et aux dossiers de brevet.",
        tags: ["Suivi de signal", "Liaison drone", "Brevet d'invention"] },
      { title: "Analyse vocale du risque de dépression", sub: "DAIC-WOZ · corpus d'entretiens · en cours",
        desc: "Un pipeline d'analyse du risque de dépression sur des entretiens semi-structurés : extraction de caractéristiques acoustiques et linguistiques, découpage par sujet et évaluation inter-sujets, avec un focus sur les petits échantillons et les fortes différences individuelles.",
        tags: ["Caractéristiques vocales", "Ingénierie de features", "Inter-sujets"] },
      { title: "Chaîne d'outils multimodale", sub: "Feature Pipeline",
        desc: "Contrôle automatique des dimensions de caractéristiques, découpage des jeux de données et scripts d'évaluation unimodale rapide. Le travail répétitif est regroupé dans des outils réutilisables pilotés par configuration.",
        tags: ["Python", "Shell", "conda"] },
      { title: "Distinctions et honneurs", sub: "4 national · 8 provincial · 5 universitaire",
        desc: "Compétitions de robotique, concours d'innovation et travaux de cours : 4 prix nationaux, 8 prix provinciaux ou municipaux et 5 prix universitaires, ainsi qu'un article, des brevets et des logiciels enregistrés.",
        tags: ["RAICOM argent", "RST argent", "Challenge Cup"], all: true }
    ]
  },

  skills: {
    eyebrow: "Boîte à outils", h2: "Stack technique",
    groups: [
      { group: "Langages", c: "", items: [
        { n: "Python", v: 92 }, { n: "Shell / PowerShell", v: 76 },
        { n: "C / Embarqué", v: 70 }, { n: "JavaScript", v: 64 } ] },
      { group: "Frameworks ML", c: "lime", items: [
        { n: "PyTorch", v: 88 }, { n: "NumPy / pandas", v: 86 },
        { n: "Transformers", v: 78 }, { n: "conda / environnements", v: 82 } ] },
      { group: "Recherche", c: "", items: [
        { n: "Caractéristiques multimodales", v: 88 }, { n: "MoE / stratégie de fusion", v: 80 },
        { n: "Prompting VLM et distillation", v: 74 }, { n: "Plan d'expérience et ablation", v: 78 } ] },
      { group: "Outils", c: "pink", items: [
        { n: "Git / GitHub", v: 84 }, { n: "Serveurs Linux", v: 76 },
        { n: "Jupyter", v: 86 }, { n: "Visualisation", v: 80 } ] }
    ]
  },

  paper: {
    eyebrow: "Publications", h2: "Articles et prépublications",
    items: [
      { kind: "[C] 2025",
        title: "More Is Better: A MoE-Based Emotion Recognition Framework with Human Preference Alignment",
        note: "MRAC @ ACM MM 2025 · soumission au challenge MER2025-SEMI (runner-up) · arXiv:2508.06036" },
      { kind: "[R] 2026 en évaluation",
        title: "CORAL-Guided Unsupervised Temperature Selection for Cross-Domain Acoustic Emotion Sensing",
        note: "IEEE Sensors Letters · en évaluation (soumission initiale, juil. 2026) · sélection de température non supervisée pour la détection d'émotions acoustiques inter-domaines" },
      { kind: "[W] en cours",
        title: "Reconnaissance multimodale des émotions par unités d'action fines et connaissances VLM",
        note: "En préparation — écrivez-moi pour en discuter" }
    ]
  },

  bottle: {
    eyebrow: "Bouteille à la mer",
    h2: "Confiez vos pensées à une bouteille",
    lead: "Quand quelque chose vous pèse et que personne ne peut l'entendre, écrivez-le. Le mot se plie, entre dans une bouteille et tombe dans la rivière. Qui le repêchera vous répondra peut-être — et la réponse reste dans la bouteille.",
    qph: "Ce qui me préoccupe ces derniers temps…",
    throw: "Plier et jeter à l'eau",
    throwing: "Pliage du mot…",
    okSent: "La bouteille est dans la rivière · SENT",
    errShort: "Rien d'écrit pour l'instant — commencez par ce qui vous pèse.",
    errLong: "C'est un peu long — raccourcissez avant de le jeter.",
    errRate: "Trop de bouteilles d'un coup. Réessayez dans une heure.",
    netFail: "Boîte aux lettres injoignable pour le moment. Réessayez plus tard."
  },

  river: {
    eyebrow: "Rivière",
    h2: "Des bouteilles à la dérive",
    lead: "Ramassez-en une — il y a peut-être l'inquiétude de quelqu'un, ou une lettre à un inconnu.",
    random: "En pêcher une",
    empty: "L'eau est encore calme — soyez la première bouteille ?",
    countPrefix: "",
    countUnit: " bouteilles à la dérive",
    note: "Bouteille · mot",
    close: "Fermer",
    replyTo: "Votre réponse reste dans cette bouteille — tous ceux qui la repêcheront la liront.",
    replies: "Réponses",
    anonymous: "Anonyme",
    open: "La ramasser",
    lift: "Ramasser",
    replyph: "Écrivez ce que vous voulez lui dire…",
    nickph: "Votre nom (facultatif)",
    send: "Déposer la réponse",
    done: "Réponse déposée — tous ceux qui repêcheront la bouteille la liront.",
    replyShort: "Rien d'écrit pour l'instant.",
    replyLong: "Votre réponse est un peu longue — raccourcissez-la.",
    replyRate: "Trop de réponses d'affilée. Patientez un peu.",
    replyFull: "Cette bouteille a déjà trop de réponses — essayez-en une autre."
  },

  lab: {
    eyebrow: "Terrain de jeu", h2: "Dessinez un peu",
    lead: "Maintenez et glissez : la couleur suit votre tracé. Un dérapage ? Gomme-le avec la gomme.",
    hint: "GLISSEZ POUR DESSINER", eraser: "Gomme", eraserOn: "Gommage", clear: "Effacer",
    aria: "Un canevas sur lequel dessiner librement"
  },
  gesture: {
    eyebrow: "Punching Bag", h2: "Sac de frappe numérique",
    lead: "Un noyau de quelques milliers de lueurs flotte au centre, comme un noyau d'émotion qui respire. C'est un sac de frappe — quand tu te sens à cran, lève la main et frappe fort : assez vite et il éclate en une plein écran de fragments, puis la gravité le ramène lentement pour ton prochain coup. Pas de caméra ? Frappe à la souris. Tout se calcule en local, rien n'est envoyé.",
    veilH: "Laisse-la te voir",
    veilP: "Le flux caméra est traité entièrement sur ton appareil. Rien n'est enregistré ni envoyé. Tu peux arrêter à tout moment.",
    start: "Activer le geste", stop: "Arrêter le geste",
    aria: "Un noyau d'émotion fait de milliers de particules",
    fps: "i/s", privacy: "en local",
    "state": "ÉTAT", "charge": "CHARGE",
    stGather: "Condense", stCharged: "Chargé", stImpact: "Impact", stExplode: "Explose",
    chipOpen: "Paume ouverte", chipPinch: "Pince", chipMove: "Bouge", chipSteady: "Immobile",
    trackYes: "suivi", trackNo: "pas de main",
    modeAria: "Portée du curseur", modeRegion: "Suivre dans la zone", modeGlobal: "Prendre le curseur",
    camTag: "CAMERA · LOCAL",
    noteIdle: "Geste désactivé — balaie à la souris pour le briser.",
    noteAsking: "Demande d'accès à la caméra…",
    noteReady: "Main verrouillée — balaie vite pour le briser.",
    noteNoHand: "Aucune main visible — place-la dans le cadre, à 40–80 cm de la caméra.",
    noteMouse: "Mode souris — traverse le noyau vite pour le briser.",
    noteGlobal: "Curseur pris en main — pointe un bouton et pince pour cliquer. Reviens en zone pour le rendre.",
    noteDenied: "Accès à la caméra refusé — autorise-la depuis la barre d'adresse et réessaie.",
    noteNoCam: "Aucune caméra détectée — essaie la souris.",
    noteUnsupported: "Ce navigateur ou appareil ne gère pas les gestes caméra — la souris marche aussi.",
    noteFail: "Le geste n'a pas démarré — limite réseau ou matérielle. La souris fonctionne toujours.",
    noteCharged: "Le noyau se charge — plus vite, frappe.",
    noteScatter: "Brisé — la gravité le ramène peu à peu.",
    noteScatterMouse: "Brisé — attends qu'il se reforme.",
    playAria: "Choisir un jeu", playBag: "Sac de frappe", playFruit: "Tranche-fruits",
    fruitCombo: "Combo", fruitScore: "pts",
    fruitOverH: "On range les couteaux !", fruitOverP: "Belle dextérité. On remet ça ?", fruitRestart: "Rejouer",
    fruitNoteIdle: "Les fruits montent du bas — tranchez-les, évitez les bombes. Cinq cœurs et c'est fini.",
    fruitNoteReady: "Main détectée — balayez pour trancher. Ne touchez pas aux bombes.",
    fruitNoteMouse: "Balayez à la souris pour trancher. Évitez les bombes, tranchez les trousses de soin pour vous soigner.",
    fruitNoteNoHand: "Aucune main visible — lève-la devant la caméra et balaie.",
    fruitNoteCombo: "Combo ×{n} — garde-le vivant.",
    fruitNoteMiss: "Un fruit manqué — combo brisé.",
    fruitNoteBomb: "Bombe touchée — un cœur perdu.",
    fruitNoteMed: "Trousse de soin — un cœur récupéré.",
    fruitNoteMedFull: "Déjà plein — la trousse vaut 3 points.",
    fruitNoteSliced: "Bien tranché.",
fruitNoteOver: "Terminé — clique sur Rejouer pour une autre manche.",
    playVb: "Volley électronique",
    vbRally: "Série",
    vbMiss: "Ratés",
    vbOverH: "Ballon au sol",
    vbOverP: "Bel échange. On recommence ?",
    vbRestart: "Nouveau service",
    vbNoteIdle: "Le ballon se lance tout seul — agitez la main pour le renvoyer au-dessus du filet, sans le laisser tomber.",
    vbNoteReady: "Main détectée — agitez vers le haut pour passer le ballon.",
    vbNoteMoveTo: "Amenez la main sur le ballon et poussez vers le haut — le point doit juste le toucher.",
    vbNoteMouse: "Balayez la souris sur le ballon pour le renvoyer.",
    vbNoteNoHand: "Aucune main détectée — placez-la dans le cadre.",
    vbNoteHit: "Bien joué.",
    vbNoteMiss: "Le ballon est tombé — {n} essais restants.",
    vbNoteOver: "Le ballon est tombé — appuyez sur « Nouveau service ».",
    vbAria: "Volley électronique contrôlé aux gestes"
  },

  contact: {
    eyebrow: "Me contacter",
    h2: "Parlons <span class=\"grad\">émotion</span>",
    lead: "Un intérêt pour l'informatique affective multimodale, l'évaluation psychologique ou une collaboration sur les données ? Écrivez-moi.",
    copyTitle: "Cliquer pour copier l'adresse e-mail",
    hint: "Cliquez sur le bouton pour copier mon adresse · ou <a href=\"mailto:luxianheng@bistu.edu.cn\">écrire dans votre application mail</a>"
  }
}});
