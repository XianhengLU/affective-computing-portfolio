/* Deutsch — Texte der Startseite */
I18N.register("de", { home: {
  title: "Xianheng Lu — Portfolio Affective Computing",
  desc: "Portfolio von Xianheng Lu: Forschung und Entwicklung zu multimodalam affektivem Computing, Emotionserkennung und psychischer Einschätzung.",

  intro: { loading: "Partikel werden gesetzt" },

  hero: {
    eyebrow: "Portfolio · 2026",
    l1: "Affektives", l2: "Rechnen", l3: "& Emotions-KI",
    meta: "Xianheng Lu — Universität für Informationswissenschaft und -technologie Peking. Ich arbeite an Affective Computing: Maschinen sollen die Stimme hören, das Gesicht sehen und den Text lesen — und danach verstehen, wie ein Mensch sich wirklich fühlt.",
    badges: ["MoE<b>·</b>Experten-Fusion", "VLM<b>·</b>Destillation", "AU<b>·</b>Zeitmodell", "Mental<b>·</b>Bewertung"]
  },

  marquee: {
    r1: ["Multimodale Fusion", "Emotionserkennung", "Mixture of Experts", "Action Units"],
    r2: ["Audio · Visuell · Text", "Affective Computing", "Psychische Gesundheit", "Virtual Reality"]
  },

  about: {
    eyebrow: "Über mich",
    h2: "Emotion<br><span class=\"grad\">berechenbar machen</span>",
    lead1: "Ich bin Xianheng Lu, mein Forschungsgebiet ist Affective Computing — Maschinen sollen menschliche Emotionen verstehen. Statt Modalitäten einfach zu verketten, sind mir zwei Dinge wichtig: jeder Experte soll das tun, was er gut kann, und danach wird über die endgültige Emotion abgestimmt; und das Alltagswissen großer Vision-Language-Modelle soll in leichte Erkennungsmodelle destilliert werden.",
    lead2: "Ich habe an audio-visuell-textueller Emotionserkennung, an der zeitlichen Modellierung fazialer Action Units und an Depressionsrisiko-Analysen über Interviewkorpora gearbeitet. Derzeit erkunde ich Affective Computing und psychologische Einschätzung in virtueller Realität.",
    tags: ["Multimodale Merkmale", "MoE-Fusion", "Präferenzabgleich", "AU-Sequenzen", "VLM-Destillation", "Probandenübergreifende Evaluation"],
    stats: [
      { v: "04", unit: "", label: "Fusionierte Modalitäten<br>Audio / Bild / Text / AU" },
      { v: "2025", unit: "", label: "Multimodale Wahrnehmung<br>in Entwicklung" },
      { v: "1", unit: "Set", label: "MindVR-Demo<br>Interview → Gemütszustand" },
      { v: "BISTU", unit: "", label: "Univ. für Informationswissenschaft<br>und -technologie Peking" }
    ]
  },

  mindvr: {
    eyebrow: "Live-Demo",
    h2: "MindVR<br><span class=\"grad\">Multimodale Wahrnehmung des Gemütszustands</span>",
    lead: "Eine Demo zur Wahrnehmung des Gemütszustands auf Basis von Interviewtranskripten und multimodalen Merkmalen. Starten Sie das integrierte Beispiel oder fügen Sie rechts ein Transkript ein.",
    open: "Im Vollbild öffnen",
    note: "Ergebnisse dienen nur der akademischen Forschung und sind keine medizinische Diagnose."
  },

  work: {
    eyebrow: "Ausgewählte Arbeiten", h2: "Was ich gebaut habe",
    lead: "Forschungsprojekte und Entwicklungspraxis, von Wettbewerbsbeiträgen bis zu kleinen interaktiven Werkzeugen.",
    cta: "Details ansehen",
    ctaAll: "Alle ansehen",
    items: [
      { title: "Multimodale Emotionserkennung mit MoE", sub: "MER2025-SEMI · MRAC @ ACM MM 2025",
        desc: "Ein Ansatz nach dem Motto „mehr ist besser“: Audio, Bild, Text und faziale Action Units werden zu vier unabhängigen Experten, während ein großes Vision-Language-Modell Alltagswissen und Präferenzabgleich für Routing und Fusion beisteuert. Ich habe die Methode reproduziert sowie unimodale Vergleiche und Ablationen durchgeführt.",
        tags: ["PyTorch", "MoE", "VLM", "Action Units"] },
      { title: "Multimodale VR-Bewertung der psychischen Gesundheit", sub: "Nationales Studierendenprojekt · Projektleitung",
        desc: "Ein kostengünstiges Echtzeit-System zur psychischen Einschätzung auf Basis multimodaler Sensorik und immersiver VR: Herzfrequenz, Hautleitwert, Eye-Tracking und Mimik synchron erfasst, standardisierte VR-Szenen als Emotionsauslöser, quantifizierte Ausgabe zu Angst und Depression.",
        tags: ["VR · Unity", "Multimodale Sensorik", "Maschinelles Lernen", "Nationales Projekt"] },
      { title: "Mikroseismische Inspektion · Betriebswächter", sub: "Challenge Cup 2026 · Erster Preis auf Stadtebene",
        desc: "Ein Sicherheitssystem auf Basis hochpräziser Signalüberwachung und drohnengestützter Kommunikation. Das Team hat eine Firma gegründet und Patente angemeldet; ich habe technische Texte, den Pitch und die Patentunterlagen beigesteuert.",
        tags: ["Signalüberwachung", "Drohnenfunk", "Erfindungspatent"] },
      { title: "Sprachanalyse des Depressionsrisikos", sub: "DAIC-WOZ · Interviewkorpus · laufend",
        desc: "Eine Pipeline zur Depressionsrisiko-Analyse halbstrukturierter Interviewaufnahmen: akustische und linguistische Merkmalsextraktion, Aufteilung pro Proband und probandenübergreifende Evaluation, mit Fokus auf kleine Stichproben und große individuelle Unterschiede.",
        tags: ["Sprachmerkmale", "Feature Engineering", "Probandenübergreifend"] },
      { title: "Multimodale Feature-Toolchain", sub: "Feature Pipeline",
        desc: "Selbstprüfung der Merkmalsdimensionen, Aufteilung der Datensätze und schnelle unimodale Evaluationsskripte. Wiederkehrende Arbeit wurde in wiederverwendbare, konfigurationsgesteuerte Werkzeuge überführt.",
        tags: ["Python", "Shell", "conda"] },
      { title: "Preise und Ehrungen", sub: "4 national · 8 Landes-/Stadtebene · 5 Hochschule",
        desc: "Robotikwettbewerbe, Innovationswettbewerbe und Studienprojekte: 4 nationale, 8 Landes- bzw. Stadtebene und 5 hochschulinterne Preise, dazu ein Fachartikel, Patente und Softwareeintragungen.",
        tags: ["RAICOM Silber", "RST Silber", "Challenge Cup"], all: true }
    ]
  },

  skills: {
    eyebrow: "Werkzeugkasten", h2: "Technischer Stack",
    groups: [
      { group: "Sprachen", c: "", items: [
        { n: "Python", v: 92 }, { n: "Shell / PowerShell", v: 76 },
        { n: "C / Embedded", v: 70 }, { n: "JavaScript", v: 64 } ] },
      { group: "ML-Frameworks", c: "lime", items: [
        { n: "PyTorch", v: 88 }, { n: "NumPy / pandas", v: 86 },
        { n: "Transformers", v: 78 }, { n: "conda / Umgebungen", v: 82 } ] },
      { group: "Forschung", c: "", items: [
        { n: "Multimodale Merkmale", v: 88 }, { n: "MoE / Fusionsstrategie", v: 80 },
        { n: "VLM-Prompting und Destillation", v: 74 }, { n: "Versuchsplanung und Ablation", v: 78 } ] },
      { group: "Werkzeuge", c: "pink", items: [
        { n: "Git / GitHub", v: 84 }, { n: "Linux-Server", v: 76 },
        { n: "Jupyter", v: 86 }, { n: "Visualisierung", v: 80 } ] }
    ]
  },

  paper: {
    eyebrow: "Publikationen", h2: "Paper und Preprints",
    items: [
      { kind: "[C] 2025",
        title: "More Is Better: A MoE-Based Emotion Recognition Framework with Human Preference Alignment",
        note: "MRAC @ ACM MM 2025 · Beitrag zum MER2025-SEMI-Challenge (runner-up) · arXiv:2508.06036" },
      { kind: "[R] 2026 in Begutachtung",
        title: "CORAL-Guided Unsupervised Temperature Selection for Cross-Domain Acoustic Emotion Sensing",
        note: "IEEE Sensors Letters · in Begutachtung (Ersteinreichung, Juli 2026) · unüberwachte Temperaturwahl für domänenübergreifendes akustisches Emotion Sensing" },
      { kind: "[W] laufend",
        title: "Multimodale Emotionserkennung mit feinen Action Units und VLM-Wissen",
        note: "In Vorbereitung — schreiben Sie mir gern" }
    ]
  },

  bottle: {
    eyebrow: "Flaschenpost",
    h2: "Vertrau deine Gedanken einer Flasche an",
    lead: "Wenn dich etwas bedrückt und niemand da ist, dem du es sagen kannst, schreib es auf. Es faltet sich zu einem Zettel, kommt in eine Flasche und fällt in den Fluss. Wer sie herausfischt, antwortet dir vielleicht – und die Antwort bleibt in der Flasche.",
    qph: "Was mich in letzter Zeit beschäftigt…",
    throw: "Falten und hineinwerfen",
    throwing: "Zettel wird gefaltet…",
    okSent: "Die Flasche ist im Fluss · SENT",
    errShort: "Noch nichts geschrieben – fang mit dem an, was dich belastet.",
    errLong: "Etwas zu lang – kürze es, bevor du es wirfst.",
    errRate: "Zu viele Flaschen auf einmal. Versuch es in einer Stunde erneut.",
    netFail: "Das Postfach ist gerade nicht erreichbar. Bitte später erneut versuchen."
  },

  river: {
    eyebrow: "Fluss",
    h2: "Flaschen treiben im Fluss",
    lead: "Fisch eine heraus – darin steckt vielleicht die Sorge eines Menschen oder ein Brief an einen Fremden.",
    random: "Eine herausfischen",
    empty: "Das Wasser ist noch still – möchtest du die erste Flasche sein?",
    countPrefix: "",
    countUnit: " Flaschen treiben",
    note: "Flasche · Zettel",
    close: "Schließen",
    replyTo: "Deine Antwort bleibt in dieser Flasche – wer sie später herausfischt, liest sie.",
    replies: "Antworten",
    anonymous: "Anonym",
    open: "Herausfischen",
    lift: "Herausfischen",
    replyph: "Schreib, was du ihr oder ihm sagen möchtest…",
    nickph: "Dein Name (optional)",
    send: "Antwort hineinlegen",
    done: "Antwort abgelegt – wer die Flasche später herausfischt, liest sie.",
    replyShort: "Noch nichts geschrieben.",
    replyLong: "Deine Antwort ist etwas zu lang – kürze sie.",
    replyRate: "Zu viele Antworten hintereinander. Kurz warten.",
    replyFull: "Diese Flasche hat schon zu viele Antworten – nimm eine andere."
  },

  lab: {
    eyebrow: "Spielwiese", h2: "Einfach mal zeichnen",
    lead: "Gedrückt halten und ziehen — die Farbe folgt Ihrer Linie. Danebengegangen? Mit dem Radierer wegradieren.",
    hint: "ZIEHEN ZUM ZEICHNEN", eraser: "Radierer", eraserOn: "Radieren", clear: "Leeren",
    aria: "Eine Leinwand zum freien Zeichnen"
  },
  gesture: {
    eyebrow: "Punching Bag", h2: "Digitaler Sandsack",
    lead: "Ein Kern aus ein paar tausend Schimmern schwebt in der Mitte, wie ein atmender Emotionskern. Er ist ein Sandsack — wenn dir alles zu viel wird, heb die Hand und schlag kräftig zu: schnell genug und er zerplatzt in einen bildschirmfüllenden Schwarm aus Fragmenten, dann zieht ihn die Gravitation langsam zurück für deinen nächsten Schlag. Keine Kamera? Dann schlag mit der Maus zu. Alles läuft auf deinem Gerät, nichts wird hochgeladen.",
    veilH: "Lass es dich sehen",
    veilP: "Das Kamerabild wird vollständig auf deinem Gerät verarbeitet. Nichts wird aufgezeichnet oder hochgeladen. Du kannst jederzeit stoppen.",
    start: "Geste aktivieren", stop: "Geste beenden",
    aria: "Ein Emotionskern aus tausenden Partikeln",
    fps: "fps", privacy: "lokal",
    "state": "STATUS", "charge": "LADUNG",
    stGather: "Sammeln", stCharged: "Geladen", stImpact: "Einschlag", stExplode: "Explosion",
    chipOpen: "Handfläche offen", chipPinch: "Kneift", chipMove: "Bewegt sich", chipSteady: "Still",
    trackYes: "erfasst", trackNo: "keine Hand",
    modeAria: "Reichweite des Cursors", modeRegion: "Im Bereich folgen", modeGlobal: "Cursor übernehmen",
    camTag: "CAMERA · LOCAL",
    noteIdle: "Geste ist aus — wisch mit der Maus, um ihn zu zerschlagen.",
    noteAsking: "Kameraberechtigung wird angefragt …",
    noteReady: "Hand erfasst — fahr schnell hindurch, um ihn zu zerschlagen.",
    noteNoHand: "Keine Hand im Bild — halt sie 40–80 cm vor die Kamera.",
    noteMouse: "Mausmodus — fahr schnell über den Kern, um ihn zu zerschlagen.",
    noteGlobal: "Cursor übernommen — zeig auf einen Knopf und kneif zum Klicken. Zurück im Bereich gibst du ihn ab.",
    noteDenied: "Kamerazugriff abgelehnt — erlaube ihn in der Adressleiste und versuch es erneut.",
    noteNoCam: "Keine Kamera gefunden — versuch es mit der Maus.",
    noteUnsupported: "Dieser Browser oder dieses Gerät kann keine Kameragesten — die Maus geht genauso.",
    noteFail: "Die Geste startete nicht — Netzwerk- oder Gerätelimit. Die Maus funktioniert weiter.",
    noteCharged: "Der Kern lädt — schneller, schlag zu.",
    noteScatter: "Zerschlagen — die Gravitation zieht ihn zurück.",
    noteScatterMouse: "Zerschlagen — warte, bis er sich wieder sammelt.",
    playAria: "Spiel wählen", playBag: "Digitaler Sandsack", playFruit: "Obstschneider",
    fruitCombo: "Combo", fruitScore: "Pkt.",
    fruitOverH: "Messer weg!", fruitOverP: "Schnelle Hand. Noch eine Runde?", fruitRestart: "Nochmal",
    fruitNoteIdle: "Obst fliegt von unten hoch — schneide es, weiche den Bomben aus. Fünf Herzen und Schluss.",
    fruitNoteReady: "Hand erkannt — schnell durchschneiden. Bomben nicht berühren.",
    fruitNoteMouse: "Mit der Maus durchschneiden. Bomben ausweichen, Verbandkästen bringen Herzen.",
    fruitNoteNoHand: "Keine Hand sichtbar — halt sie ins Bild und wisch.",
    fruitNoteCombo: "Combo ×{n} — halte sie am Leben.",
    fruitNoteMiss: "Eins verpasst — Combo unterbrochen.",
    fruitNoteBomb: "Bombe getroffen — ein Herz verloren.",
    fruitNoteMed: "Verbandkasten — ein Herz zurück.",
    fruitNoteMedFull: "Schon voll — der Verbandkasten zählt 3 Punkte.",
    fruitNoteSliced: "Sauberer Schnitt.",
fruitNoteOver: "Vorbei — für eine neue Runde auf Nochmal tippen.",
    playVb: "E-Volleyball",
    vbRally: "Serie",
    vbMiss: "Fehler",
    vbOverH: "Ball am Boden",
    vbOverP: "Schöne Rallye. Nochmal?",
    vbRestart: "Neuer Aufschlag",
    vbNoteIdle: "Der Ball wirft sich selbst hoch — wische mit der Hand, um ihn übers Netz zu spielen, ohne dass er landet.",
    vbNoteReady: "Hand erkannt — nach oben wischen und den Ball übers Netz spielen.",
    vbNoteMoveTo: "Hand auf den Ball und nach oben drücken — der Punkt muss ihn nur berühren.",
    vbNoteMouse: "Maus über den Ball ziehen, um ihn hochzuspielen.",
    vbNoteNoHand: "Keine Hand im Bild — halte sie in den Rahmen.",
    vbNoteHit: "Sauber gespielt.",
    vbNoteMiss: "Ball gelandet — noch {n} Versuche.",
    vbNoteOver: "Ball gelandet — für eine neue Runde „Neuer Aufschlag“ tippen.",
    vbAria: "Gesteingesteuerter E-Volleyball"
  },

  contact: {
    eyebrow: "Kontakt",
    h2: "Sprechen wir über <span class=\"grad\">Emotion</span>",
    lead: "Interesse an multimodalam Affective Computing, psychologischer Einschätzung oder Datenkooperation? Schreiben Sie einfach eine E-Mail.",
    copyTitle: "Klicken, um die E-Mail-Adresse zu kopieren",
    hint: "Button klicken kopiert meine Adresse · oder <a href=\"mailto:luxianheng@bistu.edu.cn\">im Mailprogramm schreiben</a>"
  }
}});
