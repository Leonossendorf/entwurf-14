(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Alle Neune: das Kegelbild ---------- */
  var KEGEL = [
    { kurz: "Festsaal", t: "Festsaal", nr: "Kegel 1", txt: "Bis zu 180 Gäste. Moderne Raumteiler machen den Saal so groß, wie Ihre Feier ist: Hochzeit, Geburtstag, Familien- oder Firmenfeier.", bild: "img/saal-rund.jpg", link: "#feiern", lt: "Zum Festsaal" },
    { kurz: "Gastraum", t: "Gastraum", nr: "Kegel 2", txt: "Aufwendig renoviert und 2022 neu eröffnet. In der gemütlichen Kneipe etwas essen oder einfach ein paar kühle Getränke.", leer: "Platz für Fotos vom neuen Gastraum", link: "#besuch", lt: "Öffnungszeiten" },
    { kurz: "Biergarten", t: "Biergarten", nr: "Kegel 3", txt: "In der warmen Jahreszeit draußen in der Sonne sitzen. Unter den Sonnenschirmen gibt es immer ein schattiges Plätzchen.", bild: "img/biergarten-2.jpg", link: "#besuch", lt: "Besuch planen" },
    { kurz: "Kegelbahnen", t: "Zwei Kegelbahnen", nr: "Kegel 4", txt: "Zwei Bundeskegelbahnen für Ihren Kegelclub, den Kegeltreff oder einen Abend mit Spiel und Spaß.", bild: "img/kegel-1.jpg", link: "#kegeln", lt: "Zu den Kegelbahnen" },
    { kurz: "Der König", t: "Sie feiern, wir machen den Rest!", nr: "Kegel 5 · der König", txt: "Wünsche für Speisen, Dekoration und Service besprechen wir vorher mit Ihnen. Die komplette Bewirtung kommt aus einer Hand.", bild: "img/tisch.jpg", link: "#anfrage", lt: "Feier anfragen", koenig: true },
    { kurz: "Küche", t: "Gutbürgerliche Küche", nr: "Kegel 6", txt: "Tägliche Karte mit gutbürgerlicher Küche und kleinen Snacks. Für Ihre Feier stellen wir ein ganz individuelles Menü zusammen.", bild: "img/buffet-2.jpg", link: "#karte", lt: "Aus der Karte" },
    { kurz: "Fassbier", t: "Frisch vom Fass", nr: "Kegel 7", txt: "Krombacher Pils sowie die lokalen Spezialitäten Pott's Landbier und Rolinck Pilsener.", bild: "img/theke.jpg", link: "#karte", lt: "Zur Küche" },
    { kurz: "Vereine", t: "Befreundete Vereine", nr: "Kegel 8", txt: "Vom Schützenverein über die Karnevalsfreunde bis zum Shanty-Chor: Für Sitzung, Jahresfeier oder Kegeltreff ist Platz.", bild: "img/saal-abend.jpg", link: "#vereine", lt: "Zu den Vereinen" },
    { kurz: "50 Jahre", t: "Seit über 50 Jahren", nr: "Kegel 9", txt: "Gastgeber in Gronau, Gluckstraße 22-24. Mittwoch bis Sonntag ab 17 Uhr und nach Vereinbarung.", bild: "img/eingang.jpg", link: "#besuch", lt: "So finden Sie uns" }
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
      '<linearGradient id="pinRot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E0D14"/><stop offset=".16" stop-color="#8E2430"/><stop offset=".38" stop-color="#D9545F"/><stop offset=".6" stop-color="#B8323F"/><stop offset=".86" stop-color="#7A1A24"/><stop offset="1" stop-color="#4A0C13"/></linearGradient>' +
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
    // Spur auf dem Bahnboden: liegt hinter den Kegeln und führt zur Beschreibung
    el("path", { id: "spur", "class": "spur" }, svg);

    // Kegel von hinten nach vorn zeichnen
    var reihenfolge = [8, 6, 7, 3, 4, 5, 1, 2, 0];
    reihenfolge.forEach(function (idx, n) {
      var p = POS[idx], v = p[1], x = 300 + p[0] * W[v], y = BASE[v], s = SKAL[v] * 1.12, k = KEGEL[idx];
      var grp = el("g", { "class": "kegel kegel-start", transform: "translate(" + x + " " + y + ") scale(" + s + ")", tabindex: "0", role: "button", "aria-label": k.t, "data-i": idx }, svg);
      el("ellipse", { "class": "glanz", cx: 0, cy: 0, rx: 34, ry: 9, fill: "url(#glanz)" }, grp);
      el("ellipse", { cx: 2, cy: 1, rx: 16, ry: 3.6, fill: "#000", opacity: ".5", filter: "url(#weich)" }, grp);
      var kp = el("g", { "class": "koerper" }, grp);
      el("path", { "class": "haut", d: PIN, fill: "url(#pin)" }, kp);
      var cl = el("g", { "clip-path": "url(#pinform)" }, kp);
      if (k.koenig) {
        el("rect", { x: -20, y: -100, width: 40, height: 9.5, fill: "url(#band)" }, cl);
        el("rect", { x: -20, y: -90.5, width: 40, height: 2.2, fill: "url(#goldband)" }, cl);
      }
      el("rect", { "class": "band", x: -20, y: -75, width: 40, height: 2.6, fill: "url(#band)" }, cl);
      el("rect", { "class": "band", x: -20, y: -70.6, width: 40, height: 2.6, fill: "url(#band)" }, cl);
      el("path", { d: PIN, fill: "none", stroke: "#5C5243", "stroke-opacity": ".55", "stroke-width": ".6" }, kp);
      el("path", { "class": "ring", d: PIN, transform: "scale(1.12) translate(0 4)" }, kp);
      var z = el("text", { "class": "zahl", x: 0, y: -30, "text-anchor": "middle" }, kp); z.textContent = idx + 1;
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
    // Legende: alle neun Namen sichtbar
    var leg = $("legende");
    KEGEL.forEach(function (k, i) {
      var li = document.createElement("li"), b = document.createElement("button");
      b.type = "button"; b.setAttribute("data-i", i); b.setAttribute("aria-pressed", "false");
      b.innerHTML = "<b>" + (i + 1) + "</b><span>" + k.kurz + "</span>";
      b.addEventListener("click", function () { waehle(i, true); });
      li.appendChild(b); leg.appendChild(li);
    });
    window.addEventListener("resize", function () { zeichneVerbinder(false); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { zeichneVerbinder(false); });
    waehle(4, false);
  }

  /* Linie vom gewählten Kegel zur Beschreibung */
  function zeichneVerbinder(animiert) {
    var svg = $("kegelbild"), bahn = $("bahn"), karte = $("karte-kegel"), titel = $("kk-titel");
    if (!svg || aktiv < 0) return;
    var p = POS[aktiv], v = p[1], x = 300 + p[0] * W[v], y = BASE[v] + 2;
    var nebeneinander = getComputedStyle(bahn).gridTemplateColumns.split(" ").length > 1;
    var br = bahn.getBoundingClientRect(), sr = svg.getBoundingClientRect(), kr = karte.getBoundingClientRect(), tr = titel.getBoundingClientRect();
    var ctm = svg.getScreenCTM(), inv = ctm.inverse(), pt = svg.createSVGPoint();
    pt.x = x; pt.y = y; var bs = pt.matrixTransform(ctm);
    pt.x = sr.right; pt.y = sr.bottom; var ecke = pt.matrixTransform(inv);
    var spur = $("spur");
    spur.setAttribute("d", nebeneinander ? "M" + x + " " + y + " H" + (ecke.x + 2) : "M" + x + " " + y + " V" + (ecke.y + 2));
    var sx = bs.x - br.left, sy = bs.y - br.top, a, e, pfad;
    if (nebeneinander) {
      a = { x: sr.right - br.left, y: sy };
      e = { x: kr.left - br.left, y: tr.top + tr.height / 2 - br.top };
      var mx = (a.x + e.x) / 2;
      pfad = "M" + a.x + " " + a.y + " C" + mx + " " + a.y + " " + mx + " " + e.y + " " + e.x + " " + e.y;
    } else {
      a = { x: sx, y: sr.bottom - br.top };
      e = { x: sx, y: kr.top - br.top };
      pfad = "M" + a.x + " " + a.y + " V" + e.y;
    }
    var linie = $("verbinder-linie");
    linie.setAttribute("d", pfad);
    var punktA = $("verbinder-a"), punktB = $("verbinder-b");
    punktA.setAttribute("cx", a.x); punktA.setAttribute("cy", a.y); punktA.setAttribute("r", 0);
    punktB.setAttribute("cx", e.x); punktB.setAttribute("cy", e.y);
    [spur, linie].forEach(function (l) {
      var len = l.getTotalLength();
      l.style.transition = "none"; l.style.strokeDasharray = len; l.style.strokeDashoffset = animiert ? len : 0;
      if (animiert) { l.getBoundingClientRect(); l.style.transition = "stroke-dashoffset .5s ease"; l.style.strokeDashoffset = 0; }
    });
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
    document.querySelectorAll("#legende button").forEach(function (b) { b.setAttribute("aria-pressed", +b.getAttribute("data-i") === i ? "true" : "false"); });
    $("karte-kegel").classList.add("aktiv");
    var k = KEGEL[i], inhalt = $("kk-inhalt"), bild = $("kk-bild");
    var setzen = function () {
      $("kk-nr").textContent = k.nr;
      $("kk-titel").textContent = k.t;
      $("kk-text").textContent = k.txt;
      var a = $("kk-link"); a.textContent = k.lt + " →"; a.setAttribute("href", k.link);
      if (k.bild) { bild.className = "bild"; bild.style.backgroundImage = "url(" + k.bild + ")"; bild.textContent = ""; }
      else { bild.className = "bild leer"; bild.style.backgroundImage = ""; bild.textContent = k.leer; }
      inhalt.classList.remove("weg"); bild.classList.remove("weg");
      zeichneVerbinder(animiert);
    };
    if (animiert) { inhalt.classList.add("weg"); bild.classList.add("weg"); setTimeout(setzen, 180); } else setzen();
  }


  /* ---------- Vereine: Stoffwimpel an der Holzwand ---------- */
  function baueWimpel() {
    var schmal = window.matchMedia("(max-width: 640px)").matches;
    var liste = document.querySelectorAll("#wimpel li");
    liste.forEach(function (li, n) {
      var stoff = li.dataset.stoff, schrift = li.dataset.schrift, akzent = li.dataset.akzent;
      var namen = li.dataset.name.split("|"), sub = li.dataset.sub ? li.dataset.sub.split("|") : [];
      var id = "w" + n, svg = el("svg", { viewBox: "0 0 200 292", role: "img", "aria-label": namen.join("").replace(/-(?=[a-zäöü])/g, "") + (sub.length ? ", " + sub.join(" ") : "") });
      var defs = el("defs", {}, svg);
      defs.innerHTML =
        '<linearGradient id="' + id + 'f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".18" stop-color="#000" stop-opacity=".07"/><stop offset=".36" stop-color="#fff" stop-opacity=".12"/><stop offset=".56" stop-color="#000" stop-opacity=".1"/><stop offset=".76" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>' +
        '<linearGradient id="' + id + 'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".08" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>' +
        '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B07A47"/><stop offset=".5" stop-color="#7A4B27"/><stop offset="1" stop-color="#4E2E16"/></linearGradient>' +
        '<radialGradient id="' + id + 'k" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#F6E3B0"/><stop offset=".6" stop-color="#B8924A"/><stop offset="1" stop-color="#6E5020"/></radialGradient>' +
        '<filter id="' + id + 't" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1 .9" numOctaves="2" seed="' + (n + 3) + '"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .16 0"/></filter>' +
        '<clipPath id="' + id + 'c"><path d="M26,46H174V196L100,268L26,196Z"/></clipPath>';
      // Nagel und Kordel
      el("path", { d: "M100,11 L30,44 M100,11 L170,44", stroke: "#3E2A18", "stroke-width": "1.8", fill: "none", "stroke-linecap": "round" }, svg);
      el("circle", { cx: 100, cy: 11, r: 4, fill: "url(#" + id + "k)" }, svg);
      // Fransen
      var fr = el("g", { "stroke-linecap": "round" }, svg);
      function kante(x1, y1, x2, y2, nx, ny, schritt) {
        var len = Math.hypot(x2 - x1, y2 - y1), anz = Math.floor(len / schritt);
        for (var i = 0; i <= anz; i++) {
          var t = i / anz, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, l = 9 + Math.sin(i * 2.7 + n) * 1.8;
          el("line", { x1: x + nx * .5, y1: y + ny * .5 + 1, x2: x + nx * l + .6, y2: y + ny * l + 1.4, stroke: "#000", "stroke-opacity": ".25", "stroke-width": "1.6" }, fr);
          el("line", { x1: x, y1: y, x2: x + nx * l, y2: y + ny * l, stroke: akzent, "stroke-width": "1.4" }, fr);
        }
      }
      var d = Math.SQRT1_2;
      kante(26, 56, 26, 196, -1, 0, 3.2); kante(174, 56, 174, 196, 1, 0, 3.2);
      kante(26, 196, 100, 268, -d, d, 3.2); kante(100, 268, 174, 196, d, d, 3.2);
      // Stoff
      el("path", { d: "M26,46H174V196L100,268L26,196Z", fill: stoff }, svg);
      var g = el("g", { "clip-path": "url(#" + id + "c)" }, svg);
      el("rect", { x: 0, y: 40, width: 200, height: 240, filter: "url(#" + id + "t)" }, g);
      el("rect", { x: 0, y: 40, width: 200, height: 240, fill: "url(#" + id + "f)" }, g);
      el("rect", { x: 0, y: 40, width: 200, height: 240, fill: "url(#" + id + "v)" }, g);
      // Borte mit Steppnaht
      el("path", { d: "M34,54H166V192L100,256L34,192Z", fill: "none", stroke: akzent, "stroke-width": "2.4", "stroke-opacity": ".95" }, svg);
      el("path", { d: "M39,59H161V190L100,249L39,190Z", fill: "none", stroke: akzent, "stroke-width": ".8", "stroke-dasharray": "2.2 2.2", "stroke-opacity": ".8" }, svg);
      // Quaste
      el("path", { d: "M100,266 V276", stroke: akzent, "stroke-width": "1.6" }, svg);
      el("path", { d: "M94,288 Q93,281 96,277 H104 Q107,281 106,288 Z", fill: akzent, stroke: "#000", "stroke-opacity": ".2", "stroke-width": ".6" }, svg);
      el("rect", { x: 95.5, y: 275, width: 9, height: 3, rx: 1.5, fill: "url(#" + id + "k)" }, svg);
      // Stange
      el("rect", { x: 20, y: 40, width: 160, height: 8, rx: 4, fill: "url(#" + id + "h)" }, svg);
      el("circle", { cx: 18, cy: 44, r: 5.5, fill: "url(#" + id + "k)" }, svg);
      el("circle", { cx: 182, cy: 44, r: 5.5, fill: "url(#" + id + "k)" }, svg);
      // Schrift
      var y = 96;
      namen.forEach(function (z) {
        var t = el("text", { x: 100, y: y, "text-anchor": "middle", "font-family": "DM Serif Display, Georgia, serif", "font-size": z.length > 13 ? 15.5 : (z.length > 11 ? 17 : 19.5), fill: schrift }, svg);
        t.textContent = z; y += 22;
      });
      el("path", { d: "M76," + (y - 8) + " H94 M106," + (y - 8) + " H124", stroke: akzent, "stroke-width": "1", "stroke-opacity": ".8" }, svg);
      el("path", { d: "M100," + (y - 12) + " l4,4 l-4,4 l-4,-4z", fill: akzent }, svg);
      y += 10;
      sub.forEach(function (z) {
        var t = el("text", { x: 100, y: y, "text-anchor": "middle", "font-family": "Source Sans 3, sans-serif", "font-weight": "600", "font-size": schmal ? 13.5 : 12, fill: schrift, "fill-opacity": ".92" }, svg);
        t.textContent = z; y += 15;
      });
      li.appendChild(svg);
    });
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

  baueWimpel();
  baueKegelbild();
  status();
  aktualisiere();
})();
