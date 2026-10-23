(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Alle Neune: das Kegelbild ---------- */
  var KEGEL = [
    { t: "Festsaal", nr: "Kegel 1", txt: "Bis zu 180 Gäste. Moderne Raumteiler machen den Saal so groß, wie Ihre Feier ist: Hochzeit, Geburtstag, Familien- oder Firmenfeier.", bild: "img/saal-rund.jpg", link: "#feiern", lt: "Zum Festsaal" },
    { t: "Gastraum", nr: "Kegel 2", txt: "Aufwendig renoviert und 2022 neu eröffnet. In der gemütlichen Kneipe etwas essen oder einfach ein paar kühle Getränke.", leer: "Platz für Fotos vom neuen Gastraum", link: "#besuch", lt: "Öffnungszeiten" },
    { t: "Biergarten", nr: "Kegel 3", txt: "In der warmen Jahreszeit draußen in der Sonne sitzen. Unter den Sonnenschirmen gibt es immer ein schattiges Plätzchen.", bild: "img/biergarten-2.jpg", link: "#besuch", lt: "Besuch planen" },
    { t: "Zwei Kegelbahnen", nr: "Kegel 4", txt: "Zwei Bundeskegelbahnen für Ihren Kegelclub, den Kegeltreff oder einen Abend mit Spiel und Spaß.", bild: "img/kegel-1.jpg", link: "#kegeln", lt: "Zu den Kegelbahnen" },
    { t: "Sie feiern, wir machen den Rest!", nr: "Der König", txt: "Wünsche für Speisen, Dekoration und Service besprechen wir vorher mit Ihnen. Die komplette Bewirtung kommt aus einer Hand.", bild: "img/tisch.jpg", link: "#anfrage", lt: "Feier anfragen", koenig: true },
    { t: "Gutbürgerliche Küche", nr: "Kegel 6", txt: "Tägliche Karte mit gutbürgerlicher Küche und kleinen Snacks. Für Ihre Feier stellen wir ein ganz individuelles Menü zusammen.", bild: "img/buffet-2.jpg", link: "#karte", lt: "Aus der Karte" },
    { t: "Frisch vom Fass", nr: "Kegel 7", txt: "Krombacher Pils sowie die lokalen Spezialitäten Pott's Landbier und Rolinck Pilsener.", bild: "img/theke.jpg", link: "#karte", lt: "Zur Küche" },
    { t: "Befreundete Vereine", nr: "Kegel 8", txt: "Vom Schützenverein über die Karnevalsfreunde bis zum Shanty-Chor: Für Sitzung, Jahresfeier oder Kegeltreff ist Platz.", bild: "img/saal-abend.jpg", link: "#vereine", lt: "Zu den Vereinen" },
    { t: "Seit über 50 Jahren", nr: "Kegel 9", txt: "Gastgeber in Gronau, Gluckstraße 22-24. Mittwoch bis Sonntag ab 17 Uhr und nach Vereinbarung.", bild: "img/eingang.jpg", link: "#besuch", lt: "So finden Sie uns" }
  ];
  // Raute aus Sicht der Kugel: u quer, v Tiefe (0 = Vorderkegel)
  var POS = [[0, 0], [-1, 1], [1, 1], [-2, 2], [0, 2], [2, 2], [-1, 3], [1, 3], [0, 4]];
  var W = [0, 50, 45, 40, 0], BASE = [378, 340, 306, 277, 252], SKAL = [1.0, .92, .85, .79, .74];
  var PIN = "M0,-100C5,-100 8,-96 8,-90C8,-84 5,-81 4.6,-76C4.2,-70 14,-56 14.5,-40C15,-24 10,-8 8.5,0L-8.5,0C-10,-8 -15,-24 -14.5,-40C-14,-56 -4.2,-70 -4.6,-76C-5,-81 -8,-84 -8,-90C-8,-96 -5,-100 0,-100Z";

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function baueKegelbild() {
    var svg = $("kegelbild");
    if (!svg) return;
    if (window.matchMedia("(max-width: 640px)").matches) svg.setAttribute("viewBox", "150 140 300 252");
    var defs = el("defs", {}, svg);
    defs.innerHTML =
      '<linearGradient id="wand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A0F0A"/><stop offset="1" stop-color="#2E1D14"/></linearGradient>' +
      '<linearGradient id="boden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E4A2C"/><stop offset=".35" stop-color="#B98A57"/><stop offset="1" stop-color="#D9AE77"/></linearGradient>' +
      '<radialGradient id="licht" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#FFE3B0" stop-opacity=".42"/><stop offset=".5" stop-color="#FFD9A0" stop-opacity=".1"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="pin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E826D"/><stop offset=".16" stop-color="#D9CFBC"/><stop offset=".38" stop-color="#FFFDF6"/><stop offset=".6" stop-color="#EFE6D4"/><stop offset=".86" stop-color="#BFB29A"/><stop offset="1" stop-color="#857963"/></linearGradient>' +
      '<linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A1219"/><stop offset=".38" stop-color="#B8323F"/><stop offset="1" stop-color="#4E0F16"/></linearGradient>' +
      '<linearGradient id="goldband" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A5A22"/><stop offset=".4" stop-color="#F0D28F"/><stop offset="1" stop-color="#6E5020"/></linearGradient>' +
      '<radialGradient id="glanz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD98F" stop-opacity=".75"/><stop offset="1" stop-color="#FFD98F" stop-opacity="0"/></radialGradient>' +
      '<filter id="weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>' +
      '<filter id="maser" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.02" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .25 0 0 0 0 .14 0 0 0 0 .06 0 0 0 .55 0"/></filter>' +
      '<clipPath id="pinform"><path d="' + PIN + '"/></clipPath>' +
      '<clipPath id="bodenform"><polygon points="40,400 560,400 452,214 148,214"/></clipPath>';

    el("rect", { x: 0, y: 0, width: 600, height: 400, fill: "url(#wand)" }, svg);
    // Kegelfang (Polsterwand hinten)
    el("rect", { x: 140, y: 150, width: 320, height: 66, rx: 3, fill: "#160C07" }, svg);
    for (var i = 0; i < 8; i++) el("rect", { x: 140 + i * 40, y: 150, width: 39, height: 66, fill: i % 2 ? "#1E120B" : "#1B100A" }, svg);
    // Bahnboden mit Brettern
    el("polygon", { points: "40,400 560,400 452,214 148,214", fill: "url(#boden)" }, svg);
    var g = el("g", { "clip-path": "url(#bodenform)" }, svg);
    el("rect", { x: 0, y: 200, width: 600, height: 200, filter: "url(#maser)" }, g);
    for (var b = 0; b <= 26; b++) {
      var xb = 40 + b * 20, xt = 148 + b * (304 / 26);
      el("line", { x1: xb, y1: 400, x2: xt, y2: 214, stroke: "#5B3A20", "stroke-opacity": ".28", "stroke-width": ".8" }, g);
    }
    el("polygon", { points: "0,400 40,400 148,214 120,214", fill: "#120A06", opacity: ".8" }, svg);
    el("polygon", { points: "600,400 560,400 452,214 480,214", fill: "#120A06", opacity: ".8" }, svg);
    el("rect", { x: 0, y: 0, width: 600, height: 400, fill: "url(#licht)" }, svg);

    // Kegel von hinten nach vorn zeichnen
    var reihenfolge = [8, 6, 7, 3, 4, 5, 1, 2, 0];
    reihenfolge.forEach(function (idx, n) {
      var p = POS[idx], v = p[1], x = 300 + p[0] * W[v], y = BASE[v], s = SKAL[v] * 1.12, k = KEGEL[idx];
      var grp = el("g", { "class": "kegel kegel-start", transform: "translate(" + x + " " + y + ") scale(" + s + ")", tabindex: "0", role: "button", "aria-label": k.t, "data-i": idx }, svg);
      el("ellipse", { "class": "glanz", cx: 0, cy: 0, rx: 34, ry: 9, fill: "url(#glanz)" }, grp);
      el("ellipse", { cx: 2, cy: 1, rx: 16, ry: 3.6, fill: "#000", opacity: ".5", filter: "url(#weich)" }, grp);
      var kp = el("g", { "class": "koerper" }, grp);
      el("path", { d: PIN, fill: "url(#pin)" }, kp);
      var cl = el("g", { "clip-path": "url(#pinform)" }, kp);
      if (k.koenig) {
        el("rect", { x: -20, y: -100, width: 40, height: 9.5, fill: "url(#band)" }, cl);
        el("rect", { x: -20, y: -90.5, width: 40, height: 2.2, fill: "url(#goldband)" }, cl);
      }
      el("rect", { x: -20, y: -75, width: 40, height: 2.6, fill: "url(#band)" }, cl);
      el("rect", { x: -20, y: -70.6, width: 40, height: 2.6, fill: "url(#band)" }, cl);
      el("path", { d: PIN, fill: "none", stroke: "#5C5243", "stroke-opacity": ".55", "stroke-width": ".6" }, kp);
      el("path", { "class": "ring", d: PIN, transform: "scale(1.12) translate(0 4)" }, kp);
      var t = el("title", {}, grp); t.textContent = k.t;
      setTimeout(function () { grp.classList.add("da"); }, 120 + n * 90);
      setTimeout(function () { grp.classList.remove("kegel-start", "da"); }, 1400 + n * 90);
    });

    svg.addEventListener("click", function (e) {
      var k = e.target.closest(".kegel"); if (k) waehle(+k.getAttribute("data-i"), true);
    });
    svg.addEventListener("keydown", function (e) {
      var k = e.target.closest(".kegel");
      if (k && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); waehle(+k.getAttribute("data-i"), true); }
    });
    waehle(4, false);
  }

  var aktiv = -1;
  function waehle(i, animiert) {
    if (i === aktiv) return;
    aktiv = i;
    document.querySelectorAll(".kegel").forEach(function (g) {
      var an = +g.getAttribute("data-i") === i;
      g.classList.toggle("aktiv", an);
      g.setAttribute("aria-pressed", an ? "true" : "false");
    });
    var k = KEGEL[i], inhalt = $("kk-inhalt"), bild = $("kk-bild");
    var setzen = function () {
      $("kk-nr").textContent = k.nr;
      $("kk-titel").textContent = k.t;
      $("kk-text").textContent = k.txt;
      var a = $("kk-link"); a.textContent = k.lt + " →"; a.setAttribute("href", k.link);
      if (k.bild) { bild.className = "bild"; bild.style.backgroundImage = "url(" + k.bild + ")"; bild.textContent = ""; }
      else { bild.className = "bild leer"; bild.style.backgroundImage = ""; bild.textContent = k.leer; }
      inhalt.classList.remove("weg");
    };
    if (animiert) { inhalt.classList.add("weg"); setTimeout(setzen, 180); } else setzen();
  }

  /* ---------- Festsaal-Varianten ---------- */
  document.querySelectorAll(".varianten button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".varianten button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      var img = $("variante-bild");
      img.style.opacity = 0;
      setTimeout(function () { img.src = btn.dataset.bild; img.alt = btn.dataset.alt; img.onload = function () { img.style.opacity = 1; }; }, 200);
    });
  });

  /* ---------- Öffnungszeiten ---------- */
  var ZEITEN = { 3: [17, 23], 4: [17, 23], 5: [17, 25], 6: [17, 25], 0: [17, 22] };
  var TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  function uhr(h) { return (h % 24) + " Uhr"; }
  function status() {
    var jetzt = new Date(), d = jetzt.getDay(), h = jetzt.getHours() + jetzt.getMinutes() / 60;
    var gestern = (d + 6) % 7, text, offen = false;
    if (ZEITEN[gestern] && ZEITEN[gestern][1] > 24 && h < ZEITEN[gestern][1] - 24) { offen = true; text = "Jetzt geöffnet bis " + uhr(ZEITEN[gestern][1]); }
    else if (ZEITEN[d] && h >= ZEITEN[d][0] && h < ZEITEN[d][1]) { offen = true; text = "Jetzt geöffnet bis " + uhr(ZEITEN[d][1]); }
    else if (ZEITEN[d] && h < ZEITEN[d][0]) text = "Heute ab " + ZEITEN[d][0] + " Uhr geöffnet";
    else { for (var i = 1; i < 8; i++) { var n = (d + i) % 7; if (ZEITEN[n]) { text = (i === 1 ? "Morgen" : TAGE[n]) + " ab " + ZEITEN[n][0] + " Uhr geöffnet"; break; } } }
    var s = $("status"); s.classList.toggle("offen", offen); s.querySelector("span").textContent = text;
    var zeile = document.querySelector('#zeiten tr[data-tag="' + d + '"]'); if (zeile) zeile.classList.add("heute");
  }

  /* ---------- Anfrage ---------- */
  var anlass = "", typ = "", personenAngefasst = false;
  var STANDARD = { Hochzeit: 80, Geburtstag: 40, Familienfeier: 40, Firmenfeier: 50, Vereinsabend: 30, Kegelabend: 12, Tisch: 4 };
  var personen = $("personen");

  function waehleAnlass(a) {
    var btn = document.querySelector('#anlaesse button[data-a="' + a + '"]');
    if (!btn) return;
    document.querySelectorAll("#anlaesse button").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    anlass = a; typ = btn.dataset.typ;
    if (!personenAngefasst) personen.value = STANDARD[a] || 20;
    $("f-essen").classList.toggle("versteckt", typ === "tisch");
    $("f-rhythmus").classList.toggle("versteckt", typ !== "kegel");
    $("f-kegel").classList.toggle("versteckt", typ !== "feier");
    aktualisiere();
  }
  document.querySelectorAll("#anlaesse button").forEach(function (b) { b.addEventListener("click", function () { waehleAnlass(b.dataset.a); }); });
  document.querySelectorAll("[data-anlass]").forEach(function (a) {
    a.addEventListener("click", function () { if (a.dataset.anlass) waehleAnlass(a.dataset.anlass); });
  });
  $("minus").addEventListener("click", function () { personenAngefasst = true; personen.value = Math.max(1, (+personen.value || 1) - 1); aktualisiere(); });
  $("plus").addEventListener("click", function () { personenAngefasst = true; personen.value = Math.min(400, (+personen.value || 0) + 1); aktualisiere(); });
  personen.addEventListener("input", function () { personenAngefasst = true; });
  $("formular").addEventListener("input", aktualisiere);
  $("formular").addEventListener("change", aktualisiere);

  function datumText() {
    var v = $("datum").value; if (!v) return "";
    var d = new Date(v + "T12:00:00");
    return TAGE[d.getDay()] + ", " + d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function aktualisiere() {
    var p = +personen.value || 0, tipp = $("tipp-text"), html;
    if (!typ) html = "Wählen Sie oben Ihren Anlass, dann sehen Sie hier, welcher Raum passt.";
    else if (typ === "feier") html = p > 180 ? "<b>Mehr als 180 Gäste?</b> Rufen Sie uns kurz an, dann finden wir gemeinsam eine Lösung." : "<b>Festsaal:</b> Mit den Raumteilern passt sich der Saal an Ihre " + p + " Gäste an.";
    else if (typ === "kegel") html = "<b>Kegelbahn:</b> Zwei Bundeskegelbahnen im Haus. Für einen festen Clubtermin wählen Sie oben den Rhythmus.";
    else html = "<b>Tisch im Gastraum:</b> Mittwoch bis Sonntag ab 17 Uhr. In der warmen Jahreszeit auch im Biergarten.";
    var v = $("datum").value;
    if (v) { var wd = new Date(v + "T12:00:00").getDay(); if (wd === 1 || wd === 2) html += " <br><b>Hinweis:</b> Montag und Dienstag ist Ruhetag, nach Vereinbarung sind wir aber auch dann für Sie da."; }
    tipp.innerHTML = html;

    var z = $("zettel");
    if (!anlass) { z.innerHTML = '<span class="leer">Wählen Sie einen Anlass, dann füllt sich dieser Zettel.</span>'; return; }
    z.textContent = text();
  }

  function text() {
    var t = [];
    t.push("Anfrage: " + (anlass === "Tisch" ? "Tischreservierung" : anlass));
    t.push("Termin: " + (datumText() || "noch offen") + ($("uhrzeit").value ? ", ab " + $("uhrzeit").value + " Uhr" : ""));
    t.push("Personen: " + (personen.value || "?"));
    if (typ === "kegel") t.push("Rhythmus: " + $("rhythmus").value);
    if (typ !== "tisch") t.push("Essen: " + $("essen").value);
    if (typ === "feier" && $("kegeldazu").value !== "Nein") t.push("Kegelbahn: " + $("kegeldazu").value);
    t.push("");
    t.push("Name: " + ($("name").value || "…"));
    t.push("Telefon: " + ($("telefon").value || "…"));
    if ($("nachricht").value.trim()) t.push("Wünsche: " + $("nachricht").value.trim());
    return t.join("\n");
  }

  $("senden").addEventListener("click", function () {
    var fehlt = [];
    if (!anlass) fehlt.push("Anlass");
    if (!$("datum").value) fehlt.push("Wunschtermin");
    if (!$("name").value.trim()) fehlt.push("Name");
    if (!$("telefon").value.trim()) fehlt.push("Telefon");
    var m = $("demo-meldung");
    m.classList.remove("versteckt");
    m.textContent = fehlt.length ? "Bitte noch ausfüllen: " + fehlt.join(", ") + "." : "Entwurf: Hier wird nichts versendet. Auf der fertigen Seite öffnet sich Ihr E-Mail-Programm mit diesem Text an info@restaurant-nienhaus.de.";
  });

  baueKegelbild();
  status();
  aktualisiere();
})();
