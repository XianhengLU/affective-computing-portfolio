/* English — home page copy */
I18N.register("en", { home: {
  title: "Xianheng Lu — Affective Computing Portfolio",
  desc: "Portfolio of Xianheng Lu: research and engineering in multimodal affective computing, emotion recognition and mental-health assessment.",

  intro: { loading: "composing particles" },

  hero: {
    eyebrow: "Portfolio · 2026",
    l1: "Affective", l2: "Computing", l3: "& Emotion AI",
    meta: "Xianheng Lu — Beijing Information Science & Technology University. I work on affective computing: helping machines hear the voice, see the face and read the words, then understand how a person actually feels.",
    badges: ["MoE<b>·</b>Expert fusion", "VLM<b>·</b>Distillation", "AU<b>·</b>Temporal model", "Mental<b>·</b>Assessment"]
  },

  marquee: {
    r1: ["Multimodal Fusion", "Emotion Recognition", "Mixture of Experts", "Action Units"],
    r2: ["Audio · Visual · Text", "Affective Computing", "Mental Health", "Virtual Reality"]
  },

  about: {
    eyebrow: "About",
    h2: "Turning emotion<br><span class=\"grad\">into computable signals</span>",
    lead1: "I am Xianheng Lu, and my research area is affective computing — making machines understand how people feel. Rather than simply concatenating modalities, I care about two things: letting each expert do what it is good at and then voting on the final emotion, and distilling the commonsense knowledge of large vision-language models into lightweight recognition models.",
    lead2: "Directions I have worked on include audio-visual-text emotion recognition, temporal modelling of facial action units, and depression-risk analysis over interview corpora. I am also exploring affective computing and psychological assessment inside virtual reality.",
    tags: ["Multimodal features", "MoE fusion", "Preference alignment", "AU sequences", "VLM distillation", "Cross-subject evaluation"],
    stats: [
      { v: "04", unit: "", label: "Fused modalities<br>Audio / Vision / Text / AU" },
      { v: "2025", unit: "", label: "Multimodal perception<br>still evolving" },
      { v: "1", unit: "set", label: "MindVR demo<br>interview → mental state" },
      { v: "BISTU", unit: "", label: "Beijing Information<br>Science & Technology Univ." }
    ]
  },

  mindvr: {
    eyebrow: "Live demo",
    h2: "MindVR<br><span class=\"grad\">Multimodal Mental State Sensing</span>",
    lead: "A mental-state sensing demo built on interview transcripts and multimodal features. Run the built-in example, or paste a transcript on the right to analyse it.",
    open: "Open full screen",
    note: "Results are for academic research only and are not a medical diagnosis."
  },

  work: {
    eyebrow: "Selected Work",
    h2: "Things I have built",
    lead: "Research projects and engineering practice, from challenge submissions to small interactive tools.",
    cta: "View details",
    ctaAll: "See all",
    items: [
      { title: "MoE Multimodal Emotion Recognition", sub: "MER2025-SEMI · MRAC @ ACM MM 2025",
        desc: "A more-is-better approach: audio, vision, text and facial action units become four independent experts, while a large vision-language model supplies commonsense knowledge and preference alignment for routing and fusion. I reproduced the pipeline and ran unimodal baselines and ablations.",
        tags: ["PyTorch", "MoE", "VLM", "Action Unit"] },
      { title: "Multimodal VR Mental Health Assessment", sub: "National-level student research · Project lead",
        desc: "A low-cost, real-time mental health assessment system built on multimodal sensing and immersive VR: heart rate, skin conductance, eye tracking and facial expression captured in sync, standardised VR scenes eliciting genuine emotion, with quantified anxiety and depression read-outs.",
        tags: ["VR · Unity", "Multimodal sensing", "Machine learning", "National project"] },
      { title: "Micro-seismic Inspection · O&M Guardian", sub: "2026 Challenge Cup · Municipal First Prize",
        desc: "A safety inspection system built on high-precision signal monitoring and UAV-borne communication links. The team registered a company and filed invention patents; I contributed technical writing, the pitch and patent drafting.",
        tags: ["Signal monitoring", "UAV links", "Invention patent"] },
      { title: "Speech Analysis of Depression Risk", sub: "DAIC-WOZ · interview corpus · ongoing",
        desc: "A pipeline for depression-risk analysis over semi-structured interview audio: acoustic and linguistic feature extraction, subject-level splits and cross-subject evaluation, with a focus on small sample sizes and large individual differences.",
        tags: ["Speech features", "Feature engineering", "Cross-subject"] },
      { title: "Multimodal Feature Toolchain", sub: "Feature Pipeline",
        desc: "Feature-dimension self-checks, dataset splitting and fast unimodal evaluation scripts. Repetitive feature and evaluation work collapsed into reusable, config-driven tooling.",
        tags: ["Python", "Shell", "conda"] },
      { title: "Awards & Honours", sub: "4 national · 8 provincial · 5 school",
        desc: "Robotics competitions, innovation and entrepreneurship contests and coursework: 4 national, 8 provincial or municipal and 5 school-level awards, plus a journal paper, patents and software copyrights.",
        tags: ["RAICOM silver", "RST silver", "Challenge Cup"], all: true }
    ]
  },

  skills: {
    eyebrow: "Toolbox", h2: "Technical stack",
    groups: [
      { group: "Languages", c: "", items: [
        { n: "Python", v: 92 }, { n: "Shell / PowerShell", v: 76 },
        { n: "C / Embedded", v: 70 }, { n: "JavaScript", v: 64 } ] },
      { group: "ML Frameworks", c: "lime", items: [
        { n: "PyTorch", v: 88 }, { n: "NumPy / pandas", v: 86 },
        { n: "Transformers", v: 78 }, { n: "conda / environments", v: 82 } ] },
      { group: "Research", c: "", items: [
        { n: "Multimodal features", v: 88 }, { n: "MoE / fusion strategy", v: 80 },
        { n: "VLM prompting & distillation", v: 74 }, { n: "Experiment design & ablation", v: 78 } ] },
      { group: "Tooling", c: "pink", items: [
        { n: "Git / GitHub", v: 84 }, { n: "Linux servers", v: 76 },
        { n: "Jupyter", v: 86 }, { n: "Data visualisation", v: 80 } ] }
    ]
  },

  paper: {
    eyebrow: "Publications", h2: "Papers & preprints",
    items: [
      { kind: "[C] 2025",
        title: "More Is Better: A MoE-Based Emotion Recognition Framework with Human Preference Alignment",
        note: "MRAC @ ACM MM 2025 · MER2025-SEMI challenge submission (runner-up) · arXiv:2508.06036" },
      { kind: "[R] 2026 under review",
        title: "CORAL-Guided Unsupervised Temperature Selection for Cross-Domain Acoustic Emotion Sensing",
        note: "IEEE Sensors Letters · under review (initial submission, Jul 2026) · unsupervised temperature selection for cross-domain acoustic emotion sensing" },
      { kind: "[W] in progress",
        title: "Multimodal emotion recognition with fine-grained action units and VLM knowledge",
        note: "In preparation — happy to discuss over email" }
    ]
  },

  bottle: {
    eyebrow: "Drift Bottle",
    h2: "Send a note down the river",
    lead: "When something weighs on you and there is no one to say it to, write it down. It folds into a note, goes into a bottle, and drops into the river below. Whoever picks it up may write back — and the reply stays inside the bottle, waiting for you.",
    qph: "Something that has been on my mind lately…",
    throw: "Fold it and throw it in",
    throwing: "Folding the note…",
    okSent: "The bottle is in the river · SENT",
    errShort: "Nothing written yet — start with what's troubling you.",
    errLong: "That's a bit long — trim it down and throw it again.",
    errRate: "Too many bottles at once. Try again in an hour.",
    netFail: "The mailbox is unreachable right now. Please try again later."
  },

  river: {
    eyebrow: "River",
    h2: "Bottles drifting on the river",
    lead: "Pick one up — inside might be someone's worry, or a letter written to a stranger.",
    random: "Fish one out",
    empty: "The water is still quiet — be the first to send a bottle?",
    countPrefix: "",
    countUnit: " bottles adrift",
    note: "Bottle · note",
    close: "Close",
    replyTo: "Your reply stays inside this bottle — anyone who fishes it out later will read it.",
    replies: "Replies",
    anonymous: "Anonymous",
    open: "Pick it up",
    lift: "Pick up",
    replyph: "Write what you want to say to them…",
    nickph: "Your name (optional)",
    send: "Put the reply in the bottle",
    done: "Your reply is in the bottle — anyone who picks it up later will read it.",
    replyShort: "Nothing written yet.",
    replyLong: "Your reply is a bit long — trim it down.",
    replyRate: "Too many replies in a row. Take a moment.",
    replyFull: "This bottle already holds as many replies as it can — try another one."
  },

  lab: {
    eyebrow: "Playground", h2: "Draw something",
    lead: "Press and drag — the colour follows your stroke. Went off track? Rub it out with the eraser.",
    hint: "DRAG TO DRAW", eraser: "Eraser", eraserOn: "Erasing", clear: "Clear",
    aria: "A canvas you can draw on freely"
  },
  gesture: {
    eyebrow: "Punching Bag", h2: "Digital Punching Bag",
    lead: "A core of a few thousand glimmers hangs in the middle, like a breathing emotion core. It is a punching bag — when you feel bottled up, raise your hand and swing hard: move fast enough and it bursts apart into a screenful of fragments, then gravity slowly pulls it back for your next punch. No camera? Flick the mouse instead. Everything runs on your device, nothing is uploaded.",
    veilH: "Let it see you",
    veilP: "The camera feed is processed entirely on your device. Nothing is recorded or uploaded. You can stop at any time.",
    start: "Enable gesture", stop: "Stop gesture",
    aria: "An emotion core made of thousands of particles",
    fps: "fps", privacy: "on-device",
    "state": "STATE", "charge": "CHARGE",
    stGather: "Gather", stCharged: "Charged", stImpact: "Impact", stExplode: "Explode",
    chipOpen: "Palm open", chipPinch: "Pinching", chipMove: "Moving", chipSteady: "Still",
    trackYes: "tracked", trackNo: "no hand",
    modeAria: "Cursor scope", modeRegion: "Follow in area", modeGlobal: "Take over cursor",
    camTag: "CAMERA · LOCAL",
    noteIdle: "Gesture is off — flick the mouse to shatter it too.",
    noteAsking: "Asking for camera permission…",
    noteReady: "Hand locked on — sweep through fast to shatter it.",
    noteNoHand: "No hand in view — raise it into frame, about 40–80 cm from the camera.",
    noteMouse: "Mouse mode — sweep across the core fast to shatter it.",
    noteGlobal: "Cursor taken over — point at a button and pinch to click. Switch back to hand it over.",
    noteDenied: "Camera permission was denied — allow it from the address bar and try again.",
    noteNoCam: "No camera found — try the mouse instead.",
    noteUnsupported: "This browser or device can't do camera gestures — the mouse works just as well.",
    noteFail: "Gesture didn't start — a network or device limit. The mouse still works.",
    noteCharged: "The core is charging — go faster and strike.",
    noteScatter: "Shattered — gravity is pulling it back together.",
    noteScatterMouse: "Shattered — wait for it to gather again.",
    playAria: "Choose a game", playBag: "Punching Bag", playFruit: "Fruit Slicer",
    fruitCombo: "Combo", fruitScore: "pts",
    fruitOverH: "Knives down!", fruitOverP: "Quick hands. Go again?", fruitRestart: "Play again",
    fruitNoteIdle: "Fruit flies up from below — slice it, dodge the bombs. Five hearts and you're out.",
    fruitNoteReady: "Hand locked — swipe through the fruit. Don't touch the bombs.",
    fruitNoteMouse: "Swipe with the mouse to slice. Dodge bombs, slice medkits to heal.",
    fruitNoteNoHand: "No hand visible — raise it into frame and swipe.",
    fruitNoteCombo: "Combo ×{n} — keep it alive.",
    fruitNoteMiss: "Missed one — combo broken.",
    fruitNoteBomb: "You hit a bomb — lost a heart.",
    fruitNoteMed: "Medkit — heart restored.",
    fruitNoteMedFull: "Already full — medkit is worth 3 points.",
    fruitNoteSliced: "Clean cut.",
fruitNoteOver: "Knives down — hit Play again for another round.",
    playVb: "E-Volleyball",
    vbRally: "Streak",
    vbMiss: "Missed",
    vbOverH: "Ball down",
    vbOverP: "Nice rally. Go again?",
    vbRestart: "Serve again",
    vbNoteIdle: "The ball tosses itself up — swing your hand to bump it over the net; don't let it land.",
    vbNoteReady: "Hand locked — swing upward to bump the ball over the net.",
    vbNoteMoveTo: "Move your hand onto the ball and push up — the dot only needs to touch it.",
    vbNoteMouse: "Flick the mouse across the ball to bump it up.",
    vbNoteNoHand: "No hand in view — raise it into the frame first.",
    vbNoteHit: "Nice touch.",
    vbNoteMiss: "The ball landed — {n} chances left.",
    vbNoteOver: "The ball landed — tap “Serve again” for another round.",
    vbAria: "Gesture-controlled electronic volleyball; swing to bump the ball over the net"
  },

  contact: {
    eyebrow: "Get in touch",
    h2: "Let's talk <span class=\"grad\">emotion</span>",
    lead: "Interested in multimodal affective computing, mental-health assessment or data collaboration? Just send an email.",
    copyTitle: "Click to copy the email address",
    hint: "Click the button to copy my address · or <a href=\"mailto:luxianheng@bistu.edu.cn\">open it in your mail app</a>"
  }
}});
