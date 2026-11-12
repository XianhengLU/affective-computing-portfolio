/* Español — textos de la página de inicio */
I18N.register("es", { home: {
  title: "Xianheng Lu — Portafolio de computación afectiva",
  desc: "Portafolio de Xianheng Lu: investigación e ingeniería en computación afectiva multimodal, reconocimiento de emociones y evaluación de salud mental.",

  intro: { loading: "componiendo partículas" },

  hero: {
    eyebrow: "Portafolio · 2026",
    l1: "Computación", l2: "Afectiva", l3: "& IA Emocional",
    meta: "Xianheng Lu — Universidad de Ciencia y Tecnología de la Información de Pekín. Trabajo en computación afectiva (Affective Computing): que la máquina oiga la voz, vea el rostro y lea las palabras, y después entienda lo que siente la persona.",
    badges: ["MoE<b>·</b>Expertos", "VLM<b>·</b>Destilación", "AU<b>·</b>Temporal", "Mental<b>·</b>Evaluación"]
  },

  marquee: {
    r1: ["Fusión multimodal", "Reconocimiento de emociones", "Mezcla de expertos", "Unidades de acción"],
    r2: ["Audio · Visual · Texto", "Computación afectiva", "Salud mental", "Realidad virtual"]
  },

  about: {
    eyebrow: "Sobre mí",
    h2: "Convertir la emoción<br><span class=\"grad\">en señal computable</span>",
    lead1: "Soy Xianheng Lu y mi línea de investigación es la computación afectiva: lograr que las máquinas comprendan las emociones humanas. Más que concatenar modalidades, me importan dos cosas: que cada experto haga aquello en lo que es bueno y luego se vote la emoción final, y destilar el conocimiento de sentido común de los grandes modelos visión-lenguaje en modelos de reconocimiento ligeros.",
    lead2: "He trabajado en reconocimiento de emociones audio-visual-texto, modelado temporal de unidades de acción faciales y análisis de riesgo de depresión sobre corpus de entrevistas. También exploro la computación afectiva y la evaluación psicológica en realidad virtual.",
    tags: ["Rasgos multimodales", "Fusión MoE", "Alineación de preferencias", "Secuencias AU", "Destilación VLM", "Evaluación entre sujetos"],
    stats: [
      { v: "04", unit: "", label: "Modalidades fusionadas<br>Audio / Visión / Texto / AU" },
      { v: "2025", unit: "", label: "Percepción multimodal<br>en evolución" },
      { v: "1", unit: "set", label: "Demo MindVR<br>entrevista → estado mental" },
      { v: "BISTU", unit: "", label: "Univ. de Ciencia y Tecnología<br>de la Información de Pekín" }
    ]
  },

  mindvr: {
    eyebrow: "Demo interactiva",
    h2: "MindVR<br><span class=\"grad\">Percepción multimodal del estado mental</span>",
    lead: "Una demo de percepción del estado mental basada en transcripciones de entrevistas y rasgos multimodales. Ejecuta el ejemplo integrado o pega una transcripción a la derecha para analizarla.",
    open: "Abrir a pantalla completa",
    note: "Los resultados son solo para investigación académica y no constituyen un diagnóstico médico."
  },

  work: {
    eyebrow: "Trabajos", h2: "Lo que he construido",
    lead: "Proyectos de investigación y práctica de ingeniería, desde propuestas de competición hasta pequeñas herramientas interactivas.",
    cta: "Ver detalle",
    ctaAll: "Ver todo",
    items: [
      { title: "Reconocimiento multimodal de emociones con MoE", sub: "MER2025-SEMI · MRAC @ ACM MM 2025",
        desc: "Un enfoque de «cuanto más, mejor»: audio, visión, texto y unidades de acción facial se organizan en cuatro expertos independientes, mientras un gran modelo visión-lenguaje aporta conocimiento de sentido común y alineación de preferencias para el enrutado y la fusión. Reproduje la propuesta y realicé comparaciones unimodales y ablaciones.",
        tags: ["PyTorch", "MoE", "VLM", "Unidad de acción"] },
      { title: "Evaluación de salud mental con RV multimodal", sub: "Investigación nacional · Líder de proyecto",
        desc: "Un sistema de evaluación psicológica en tiempo real y de bajo coste basado en percepción multimodal y RV inmersiva: frecuencia cardiaca, conductancia de la piel, seguimiento ocular y expresión facial capturados en sincronía, escenas VR estandarizadas que provocan emoción real y medidas cuantificadas de ansiedad y depresión.",
        tags: ["RV · Unity", "Percepción multimodal", "Aprendizaje automático", "Proyecto nacional"] },
      { title: "Inspección microsísmica · Guardián de operación", sub: "Challenge Cup 2026 · Primer premio municipal",
        desc: "Un sistema de inspección basado en monitorización de señal de alta precisión y enlace de comunicación por dron. El equipo registró una empresa y presentó patentes; yo contribuí en la redacción técnica, la presentación y los documentos de patente.",
        tags: ["Monitorización de señal", "Enlace con dron", "Patente de invención"] },
      { title: "Análisis de voz del riesgo de depresión", sub: "DAIC-WOZ · corpus de entrevistas · en curso",
        desc: "Un flujo de análisis del riesgo de depresión sobre audio de entrevistas semiestructuradas: extracción de rasgos acústicos y lingüísticos, partición por sujeto y evaluación entre sujetos, con atención a muestras pequeñas y grandes diferencias individuales.",
        tags: ["Rasgos de voz", "Ingeniería de rasgos", "Entre sujetos"] },
      { title: "Cadena de herramientas multimodal", sub: "Feature Pipeline",
        desc: "Autocomprobación de dimensiones de rasgos, partición de conjuntos de datos y scripts de evaluación unimodal rápida. El trabajo repetitivo se agrupa en herramientas reutilizables guiadas por configuración.",
        tags: ["Python", "Shell", "conda"] },
      { title: "Premios y distinciones", sub: "4 nacional · 8 provincial · 5 universitario",
        desc: "Competiciones de robótica, concursos de innovación y trabajos de curso: 4 premios nacionales, 8 provinciales o municipales y 5 universitarios, además de un artículo, patentes y registros de software.",
        tags: ["RAICOM plata", "RST plata", "Challenge Cup"], all: true }
    ]
  },

  skills: {
    eyebrow: "Caja de herramientas", h2: "Stack técnico",
    groups: [
      { group: "Lenguajes", c: "", items: [
        { n: "Python", v: 92 }, { n: "Shell / PowerShell", v: 76 },
        { n: "C / Embebido", v: 70 }, { n: "JavaScript", v: 64 } ] },
      { group: "Frameworks ML", c: "lime", items: [
        { n: "PyTorch", v: 88 }, { n: "NumPy / pandas", v: 86 },
        { n: "Transformers", v: 78 }, { n: "conda / entornos", v: 82 } ] },
      { group: "Investigación", c: "", items: [
        { n: "Rasgos multimodales", v: 88 }, { n: "MoE / estrategia de fusión", v: 80 },
        { n: "Prompting VLM y destilación", v: 74 }, { n: "Diseño experimental y ablación", v: 78 } ] },
      { group: "Herramientas", c: "pink", items: [
        { n: "Git / GitHub", v: 84 }, { n: "Servidores Linux", v: 76 },
        { n: "Jupyter", v: 86 }, { n: "Visualización", v: 80 } ] }
    ]
  },

  paper: {
    eyebrow: "Publicaciones", h2: "Artículos y preimpresiones",
    items: [
      { kind: "[C] 2025",
        title: "More Is Better: A MoE-Based Emotion Recognition Framework with Human Preference Alignment",
        note: "MRAC @ ACM MM 2025 · propuesta al reto MER2025-SEMI (runner-up) · arXiv:2508.06036" },
      { kind: "[R] 2026 en revisión",
        title: "CORAL-Guided Unsupervised Temperature Selection for Cross-Domain Acoustic Emotion Sensing",
        note: "IEEE Sensors Letters · en revisión (envío inicial, jul. 2026) · selección de temperatura no supervisada para percepción de emociones acústicas entre dominios" },
      { kind: "[W] en curso",
        title: "Reconocimiento multimodal de emociones con unidades de acción finas y conocimiento VLM",
        note: "En preparación — escríbeme para comentarlo" }
    ]
  },

  bottle: {
    eyebrow: "Mensaje en una botella",
    h2: "Confía tus pensamientos a una botella",
    lead: "Cuando algo te pesa y no hay con quién hablarlo, escríbelo. Se dobla en una nota, entra en una botella y cae al río. Quien la recoja quizá te responda, y la respuesta se queda dentro de la botella.",
    qph: "Algo que me preocupa últimamente…",
    throw: "Plegar y lanzar al río",
    throwing: "Plegando la nota…",
    okSent: "La botella ya está en el río · SENT",
    errShort: "Aún no has escrito nada: empieza por lo que te preocupa.",
    errLong: "Es un poco largo: recórtalo antes de lanzarlo.",
    errRate: "Demasiadas botellas de golpe. Inténtalo en una hora.",
    netFail: "El buzón no está disponible ahora. Inténtalo más tarde."
  },

  river: {
    eyebrow: "Río",
    h2: "Botellas a la deriva",
    lead: "Recoge una — dentro puede estar la preocupación de alguien o una carta a un desconocido.",
    random: "Pescar una",
    empty: "El agua está tranquila — ¿quieres ser la primera botella?",
    countPrefix: "",
    countUnit: " botellas a la deriva",
    note: "Botella · nota",
    close: "Cerrar",
    replyTo: "Tu respuesta se queda en esta botella: quien la recoja después podrá leerla.",
    replies: "Respuestas",
    anonymous: "Anónimo",
    open: "Recogerla",
    lift: "Recoger",
    replyph: "Escribe lo que quieras decirle…",
    nickph: "Tu nombre (opcional)",
    send: "Dejar la respuesta",
    done: "Respuesta entregada: quien recoja la botella después podrá leerla.",
    replyShort: "Aún no has escrito nada.",
    replyLong: "Tu respuesta es un poco larga: recórtala.",
    replyRate: "Demasiadas respuestas seguidas. Espera un poco.",
    replyFull: "Esta botella ya tiene demasiadas respuestas. Prueba con otra."
  },

  lab: {
    eyebrow: "Zona de juego", h2: "Dibuja algo",
    lead: "Mantén pulsado y arrastra: el color sigue tu trazo. ¿Te has salido? Bórralo con la goma.",
    hint: "ARRASTRA PARA DIBUJAR", eraser: "Goma", eraserOn: "Borrando", clear: "Borrar",
    aria: "Un lienzo para dibujar libremente"
  },
  gesture: {
    eyebrow: "Punching Bag", h2: "Saco de boxeo digital",
    lead: "Un núcleo de unos miles de destellos flota en el centro, como un núcleo de emoción que respira. Es un saco de boxeo — cuando te sientas agobiado, levanta la mano y golpea fuerte: si vas lo bastante rápido estalla en una pantalla llena de fragmentos y luego la gravedad lo atrae de vuelta para tu siguiente golpe. ¿Sin cámara? Golpéalo con el ratón. Todo se calcula en tu equipo, nada se sube.",
    veilH: "Deja que te vea",
    veilP: "La imagen de la cámara se procesa por completo en tu dispositivo. No se graba ni se sube nada. Puedes parar cuando quieras.",
    start: "Activar gesto", stop: "Detener gesto",
    aria: "Un núcleo de emoción hecho de miles de partículas",
    fps: "fps", privacy: "en local",
    "state": "ESTADO", "charge": "CARGA",
    stGather: "Reúne", stCharged: "Cargado", stImpact: "Impacto", stExplode: "Estalla",
    chipOpen: "Palma abierta", chipPinch: "Pellizca", chipMove: "Se mueve", chipSteady: "Quieta",
    trackYes: "detectada", trackNo: "sin mano",
    modeAria: "Alcance del cursor", modeRegion: "Seguir en el área", modeGlobal: "Tomar el cursor",
    camTag: "CAMERA · LOCAL",
    noteIdle: "Gesto desactivado — barre con el ratón para romperlo.",
    noteAsking: "Pidiendo permiso para la cámara…",
    noteReady: "Mano fijada — barre rápido para romperlo.",
    noteNoHand: "No se ve la mano — súbela al encuadre, a 40–80 cm de la cámara.",
    noteMouse: "Modo ratón — cruza el núcleo rápido para romperlo.",
    noteGlobal: "Cursor tomado — apunta a un botón y pellizca para hacer clic. Vuelve al área para devolverlo.",
    noteDenied: "Permiso de cámara denegado — autorízala en la barra de direcciones y reintenta.",
    noteNoCam: "No se encontró cámara — prueba con el ratón.",
    noteUnsupported: "Este navegador o dispositivo no admite gestos con cámara — el ratón funciona igual.",
    noteFail: "El gesto no arrancó — límite de red o del dispositivo. El ratón sigue funcionando.",
    noteCharged: "El núcleo está cargando — más rápido, golpea.",
    noteScatter: "Roto — la gravedad lo está atrayendo de vuelta.",
    noteScatterMouse: "Roto — espera a que se reúna otra vez.",
    playAria: "Elegir juego", playBag: "Saco de boxeo", playFruit: "Corta-frutas",
    fruitCombo: "Combo", fruitScore: "pts",
    fruitOverH: "¡Cuchillos fuera!", fruitOverP: "Buenas manos. ¿Otra ronda?", fruitRestart: "Otra vez",
    fruitNoteIdle: "La fruta sube desde abajo — córtala, esquiva las bombas. Cinco corazones y se acaba.",
    fruitNoteReady: "Mano detectada — desliza para cortar. No toques las bombas.",
    fruitNoteMouse: "Desliza el ratón para cortar. Esquiva las bombas, corta los botiquines para curarte.",
    fruitNoteNoHand: "No se ve la mano — súbela al encuadre y desliza.",
    fruitNoteCombo: "Combo ×{n} — no lo cortes.",
    fruitNoteMiss: "Se te escapó una — combo roto.",
    fruitNoteBomb: "Tocaste una bomba — pierdes un corazón.",
    fruitNoteMed: "Botiquín — recuperas un corazón.",
    fruitNoteMedFull: "Ya estás al máximo — el botiquín vale 3 puntos.",
    fruitNoteSliced: "Buen corte.",
fruitNoteOver: "Se acabó — pulsa Otra vez para otra ronda.",
    playVb: "Vóley electrónico",
    vbRally: "Racha",
    vbMiss: "Fallos",
    vbOverH: "Balón al suelo",
    vbOverP: "Buen intercambio. ¿Otra vez?",
    vbRestart: "Otro saque",
    vbNoteIdle: "La pelota se lanza sola — agita la mano para pasarla sobre la red, sin dejarla caer.",
    vbNoteReady: "Mano detectada — agita hacia arriba para pasar la pelota.",
    vbNoteMoveTo: "Lleva la mano al balón y empuja hacia arriba — basta con que el punto lo toque.",
    vbNoteMouse: "Desliza el ratón sobre la pelota para elevarla.",
    vbNoteNoHand: "No se ve la mano — ponla dentro del encuadre.",
    vbNoteHit: "Buen toque.",
    vbNoteMiss: "La pelota cayó — quedan {n} oportunidades.",
    vbNoteOver: "La pelota cayó — pulsa «Otro saque» para otra ronda.",
    vbAria: "Vóley electrónico controlado por gestos"
  },

  contact: {
    eyebrow: "Contacto",
    h2: "Hablemos de <span class=\"grad\">emoción</span>",
    lead: "Si te interesa la computación afectiva multimodal, la evaluación psicológica o colaborar con datos, escríbeme.",
    copyTitle: "Haz clic para copiar la dirección de correo",
    hint: "Pulsa el botón para copiar mi dirección · o <a href=\"mailto:luxianheng@bistu.edu.cn\">escribir en tu app de correo</a>"
  }
}});
