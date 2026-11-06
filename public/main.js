
/* À MODIFIER : numéro WhatsApp (format international, sans + ni espaces) et e-mail de D.M.M DECO */
var CONFIG = { whatsapp: "212774425807", email: "d.m.m.deco26@gmail.com" };
var selectedModel = "";
var selectedModelPiece = "";


function openCanapesModal(){
  var m = document.getElementById("canapes-modal");
  m.classList.add("open");
  m.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  var search = document.getElementById("model-search");
  if (search) { setTimeout(function(){ search.focus(); }, 50); }
}
function closeCanapesModal(){
  var m = document.getElementById("canapes-modal");
  m.classList.remove("open");
  m.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
document.getElementById("canapes-modal").addEventListener("click", function(e){
  if (e.target === this) closeCanapesModal();
});

/* Recherche + favoris dans la galerie des canapés */
(function () {
  var input = document.getElementById("model-search");
  var grid = document.getElementById("models-grid");
  var countEl = document.getElementById("model-count");
  var emptyEl = document.getElementById("model-empty");
  var favBtn = document.getElementById("fav-filter-btn");
  var favCountEl = document.getElementById("fav-count");
  if (!input || !grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".model"));
  var total = cards.length;

  var FAV_KEY = "dmmdeco_favoris";
  function getFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch (e) { return []; } }
  function setFavs(list) { try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (e) {} }
  window.dmmGetFavoris = getFavs;

  function render() {
    var q = input.value.trim().toLowerCase();
    var onlyFavs = grid.classList.contains("favs-only");
    var shown = 0;
    cards.forEach(function (card) {
      var name = (card.querySelector("h3") || {}).textContent || "";
      var desc = (card.querySelector("p") || {}).textContent || "";
      var matchQ = !q || (name + " " + desc).toLowerCase().indexOf(q) !== -1;
      var matchFav = !onlyFavs || card.classList.contains("is-fav");
      var match = matchQ && matchFav;
      card.classList.toggle("hide", !match);
      if (match) shown++;
    });
    countEl.textContent = q ? (shown + " modèle" + (shown > 1 ? "s" : "") + " sur " + total) : (total + " modèles à découvrir");
    emptyEl.classList.toggle("show", shown === 0);
  }
  window.dmmRenderModels = render;
  input.addEventListener("input", render);

  /* Bouton cœur sur chaque photo */
  var favs = getFavs();
  cards.forEach(function (card) {
    var name = (card.querySelector("h3") || {}).textContent || "";
    var shot = card.querySelector(".shot");
    if (!shot || !name) return;
    var isFav = favs.indexOf(name) !== -1;
    card.classList.toggle("is-fav", isFav);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fav-btn" + (isFav ? " active" : "");
    btn.setAttribute("aria-pressed", isFav ? "true" : "false");
    btn.setAttribute("aria-label", (isFav ? "Retirer " : "Ajouter ") + name + " de mes favoris");
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4.5 5.5 4c2-.3 3.8.7 6.5 3.3C14.7 4.7 16.5 3.7 18.5 4c3.5.5 5.1 4 3.5 7.7C19.5 16.4 12 21 12 21z"/></svg>';
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var list = getFavs();
      var idx = list.indexOf(name);
      var nowFav = idx === -1;
      if (nowFav) { list.push(name); } else { list.splice(idx, 1); }
      setFavs(list);
      btn.classList.toggle("active", nowFav);
      btn.setAttribute("aria-pressed", nowFav ? "true" : "false");
      btn.setAttribute("aria-label", (nowFav ? "Retirer " : "Ajouter ") + name + " de mes favoris");
      card.classList.toggle("is-fav", nowFav);
      updateFavCount();
      render();
    });
    shot.appendChild(btn);
  });

  function updateFavCount() {
    var n = getFavs().length;
    if (favCountEl) { favCountEl.textContent = n; favCountEl.hidden = n === 0; }
  }
  updateFavCount();

  if (favBtn) {
    favBtn.addEventListener("click", function () {
      var active = grid.classList.toggle("favs-only");
      favBtn.setAttribute("aria-pressed", active ? "true" : "false");
      render();
    });
  }

  render();
})();

/* Aperçu agrandi (lightbox) */
(function () {
  var grid = document.getElementById("models-grid");
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lightbox-img");
  var caption = document.getElementById("lightbox-caption");
  var closeBtn = document.getElementById("lightbox-close");
  if (!grid || !box) return;
  function openLightbox(shot) {
    var src = shot.querySelector("img").getAttribute("src");
    var name = (shot.closest(".model").querySelector("h3") || {}).textContent || "";
    img.setAttribute("src", src);
    img.setAttribute("alt", name);
    caption.textContent = name;
    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
    img.setAttribute("src", "");
  }
  grid.addEventListener("click", function (e) {
    var shot = e.target.closest(".shot");
    if (shot) openLightbox(shot);
  });
  closeBtn.addEventListener("click", closeLightbox);
  box.addEventListener("click", function (e) { if (e.target === box) closeLightbox(); });
  window.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (box.classList.contains("open")) closeLightbox();
    else if (document.getElementById("canapes-modal").classList.contains("open")) closeCanapesModal();
  });
})();

/* Menu mobile */
(function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
  }
  function toggleNav() {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }
  toggle.addEventListener("click", toggleNav);
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
  window.addEventListener("resize", function () { if (window.innerWidth > 820) closeNav(); });
})();

/* Ombre de l'en-tête au défilement */
(function () {
  var header = document.getElementById("site-header");
  if (!header) return;
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* Bouton retour en haut */
(function () {
  var btn = document.getElementById("scroll-top");
  if (!btn) return;
  function onScroll() {
    btn.classList.toggle("show", window.scrollY > 600);
  }
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(function () {
  function val(name) {
    var c = document.querySelector('input[name="' + name + '"]:checked');
    return c ? c.value : "";
  }
  function setDd(id, v) {
    var el = document.getElementById(id);
    el.textContent = v || "À choisir";
    el.classList.toggle("empty", !v);
  }
  function message() {
    var housse = document.getElementById("housse").checked;
    var isHs = /^Housse/.test(val("piece"));
    var lines = [
      "Bonjour D.M.M DECO, je souhaite recevoir un devis.",
      "",
      "Meuble : " + (val("piece") || "à préciser"),
      (selectedModel ? "Modèle : " + selectedModel : (val("piece") ? "Modèle : au choix" : null)),
      (isHs ? "Matière / couleur : " + (val("tissu") || "à préciser") : "Bois : " + (val("bois") || "à préciser")),
      (isHs ? null : "Tissu : " + (val("tissu") || "à préciser")),
      (isHs ? null : "Housse de protection offerte : " + (housse ? "oui" : "non")),
      "Précisions : " + (document.getElementById("dims").value.trim() || "aucune"),
      (window.dmmGetFavoris && window.dmmGetFavoris().length ? "Modèles favoris repérés : " + window.dmmGetFavoris().join(", ") : null),
      "",
      "Nom : " + (document.getElementById("nom").value.trim() || "-"),
      "Téléphone : " + (document.getElementById("tel").value.trim() || "-")
    ];
    return lines.filter(function (l) { return l !== null; }).join("\n");
  }
  function update() {
    if (val("piece") !== selectedModelPiece) { selectedModel = ""; }
    setDd("s-piece", val("piece"));
    document.getElementById("model-row").hidden = !selectedModel;
    document.getElementById("s-model").textContent = selectedModel;
    setDd("s-bois", val("bois"));
    setDd("s-tissu", val("tissu"));
    document.getElementById("s-housse").textContent = document.getElementById("housse").checked ? "Offerte" : "Non souhaitée";
    var woodClass = { "Bois rouge": "d-rouge", "Noyer": "d-noyer", "Chêne": "d-chene", "Thuya": "d-thuya", "Cèdre de l'Atlas": "d-cedre", "Hêtre": "d-hetre", "Frêne": "d-frene", "Acajou": "d-acajou", "Teck": "d-teck" }[val("bois")];
    var fabricClass = { "Velours": "sw-velours", "Lin": "sw-lin", "Bouclé": "sw-boucle", "Chenille": "sw-chenille", "Cuir": "sw-cuir", "Jacquard": "sw-jacquard", "Tweed ou coton": "sw-tweed", "Velours côtelé": "sw-cotele", "Suédine": "sw-suedine", "Sabra": "sw-sabra", "Laine berbère": "sw-berbere", "Brocart": "sw-brocart", "Similicuir": "sw-simili", "Outdoor déperlant": "sw-outdoor", "Imprimé zellige": "sw-zellige" }[val("tissu")];
    var comboWood = document.getElementById("combo-wood");
    var comboFabric = document.getElementById("combo-fabric");
    var comboPreview = document.getElementById("combo-preview");
    if (comboWood && comboFabric && comboPreview) {
      comboWood.className = "combo-wood" + (woodClass ? " " + woodClass : "");
      comboFabric.className = "combo-fabric" + (fabricClass ? " " + fabricClass : "");
      comboPreview.classList.toggle("ready", !!(woodClass && fabricClass));
    }
    var msg = message();
    document.getElementById("send-wa").href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
    document.getElementById("send-mail").href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(CONFIG.email) + "&su=" + encodeURIComponent("Demande de devis D.M.M DECO") + "&body=" + encodeURIComponent(msg);
    document.getElementById("foot-wa").href = "https://wa.me/" + CONFIG.whatsapp;
    var waFloat = document.getElementById("wa-float");
    if (waFloat) { waFloat.href = "https://wa.me/" + CONFIG.whatsapp; }
    var footMail = document.getElementById("foot-mail");
    if (footMail) { footMail.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(CONFIG.email); footMail.target = "_blank"; footMail.rel = "noopener"; }
  }
  var form = document.getElementById("quote-form");
  form.addEventListener("input", update);
  form.addEventListener("change", update);

  document.querySelectorAll("[data-piece]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var v = btn.getAttribute("data-piece");
      selectedModel = btn.getAttribute("data-model") || "";
      selectedModelPiece = v;
      closeCanapesModal();
      var radio = document.querySelector('input[name="piece"][value="' + v + '"]');
      if (radio) { radio.checked = true; }
      update();
      document.getElementById("devis").scrollIntoView();
    });
  });
  window.dmmPickModel = function (v, model) {
    selectedModel = model || ""; selectedModelPiece = v;
    closeCanapesModal();
    if (window.closeModelsModal) { closeModelsModal(); }
    var radio = document.querySelector('input[name="piece"][value="' + v + '"]');
    if (radio) { radio.checked = true; }
    update();
    document.getElementById("devis").scrollIntoView();
  };
  update();
})();

(function () {
  if (!("IntersectionObserver" in window)) return;
  var targets = document.querySelectorAll(".sec-head, .promise > div, .piece, .wood, .commit > div, .faq-item, .board");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
})();

;

/* Catalogue illustré D.M.M DECO : modèles originaux dessinés en SVG */
var DMM = (function () {
  var WOODS = { rouge: "#8B3123", noyer: "#52352A", chene: "#C39A62" };
  var WOODN = { rouge: "Bois rouge", noyer: "Noyer", chene: "Chêne" };
  var FAB = {
    velours_em: { c: "#1F5A49", n: "Velours émeraude" },
    velours_bx: { c: "#7A2636", n: "Velours bordeaux" },
    velours_bp: { c: "#2F5964", n: "Velours bleu pétrole" },
    velours_rose: { c: "#D3A99D", n: "Velours rose poudré" },
    lin: { c: "#D4C8AE", n: "Lin naturel" },
    lin_sauge: { c: "#8D9C7F", n: "Lin sauge" },
    boucle: { c: "#E9DECE", n: "Bouclé ivoire" },
    chenille: { c: "#2E3555", n: "Chenille nuit" },
    cuir: { c: "#A9663A", n: "Cuir cognac" },
    jacquard: { c: "#CDB88B", n: "Jacquard champagne" },
    tweed: { c: "#B8AE9A", n: "Tweed sable" }
  };
  var BGS = ["#EFE6D6", "#E8E3D6", "#EBE0D3", "#E3E6DD", "#EDE3DD", "#E9E4DC"];

  /* ---------- couleurs ---------- */
  function h2r(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function r2h(r, g, b) {
    return "#" + [r, g, b].map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join("");
  }
  function mix(a, b, t) { var A = h2r(a), B = h2r(b); return r2h(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
  function lt(c, t) { return mix(c, "#ffffff", t); }
  function dk(c, t) { return mix(c, "#000000", t); }

  /* ---------- primitives ---------- */
  function P(d, fill, x) { return '<path d="' + d + '" fill="' + fill + '" ' + (x || "") + "/>"; }
  function R(x, y, w, h, rx, fill, ex) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + fill + '" ' + (ex || "") + "/>"; }
  function E(cx, cy, rx, ry, fill, ex) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" ' + (ex || "") + "/>"; }
  function C(cx, cy, r, fill, ex) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" ' + (ex || "") + "/>"; }
  function POLY(pts, fill, ex) { return '<polygon points="' + pts + '" fill="' + fill + '" ' + (ex || "") + "/>"; }
  function LINE(x1, y1, x2, y2, stroke, w, op) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + stroke + '" stroke-width="' + (w || 1) + '" stroke-opacity="' + (op == null ? 1 : op) + '" stroke-linecap="round"/>'; }
  function leg(x1, y1, x2, y2, w1, w2, fill) {
    return POLY([x1 - w1 / 2, y1, x1 + w1 / 2, y1, x2 + w2 / 2, y2, x2 - w2 / 2, y2].join(" "), fill || "url(#wg)");
  }
  function shadow(cx, rx, ry) { return E(cx, 262, rx, ry || 8, "rgba(30,20,10,.34)", 'filter="url(#bl)"'); }
  function knob(x, y) { return C(x, y, 2.6, "#E2C27A", 'stroke="#9C4524" stroke-width=".8"'); }

  function defs(f, w) {
    return (
      '<linearGradient id="fv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + lt(f, 0.12) + '"/><stop offset="1" stop-color="' + dk(f, 0.14) + '"/></linearGradient>' +
      '<linearGradient id="fh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + dk(f, 0.12) + '"/><stop offset=".45" stop-color="' + lt(f, 0.1) + '"/><stop offset="1" stop-color="' + dk(f, 0.18) + '"/></linearGradient>' +
      '<linearGradient id="fd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + dk(f, 0.3) + '"/><stop offset="1" stop-color="' + dk(f, 0.18) + '"/></linearGradient>' +
      '<linearGradient id="wg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + lt(w, 0.14) + '"/><stop offset=".55" stop-color="' + w + '"/><stop offset="1" stop-color="' + dk(w, 0.22) + '"/></linearGradient>' +
      '<linearGradient id="wd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + dk(w, 0.18) + '"/><stop offset="1" stop-color="' + dk(w, 0.38) + '"/></linearGradient>' +
      '<linearGradient id="wv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + lt(w, 0.22) + '"/><stop offset="1" stop-color="' + lt(w, 0.04) + '"/></linearGradient>' +
      '<linearGradient id="mir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F8F7"/><stop offset=".5" stop-color="#B4C2C5"/><stop offset="1" stop-color="#E6EEED"/></linearGradient>' +
      '<linearGradient id="lin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6F1E6"/><stop offset="1" stop-color="#DDD3BE"/></linearGradient>'
    );
  }
  function wrap(bg, f, w, body) {
    var floor = dk(bg, 0.08);
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs>' + defs(f, w) +
      '<radialGradient id="bgr" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="' + lt(bg, 0.4) + '"/><stop offset="1" stop-color="' + bg + '"/></radialGradient>' +
      '<filter id="bl" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
      '<rect width="400" height="300" fill="url(#bgr)"/>' +
      '<rect y="258" width="400" height="42" fill="' + floor + '"/><rect y="257" width="400" height="1.5" fill="' + dk(floor, 0.08) + '"/>' +
      body + "</svg>"
    );
  }

  /* ================= FAUTEUILS ================= */
  var seatArm = {
    barrel: function (c) {
      return shadow(200, 118) +
        leg(122, 238, 114, 260, 13, 9) + leg(278, 238, 286, 260, 13, 9) +
        P("M92,232V148C92,102,140,78,200,78C260,78,308,102,308,148V232Q308,242,296,242H104Q92,242,92,232Z", "url(#fh)", c.st) +
        P("M122,208V152C122,124,156,104,200,104C244,104,278,124,278,152V208Z", "url(#fd)") +
        R(116, 198, 168, 42, 14, "url(#fv)", c.st) +
        LINE(126, 207, 274, 207, lt(c.f, 0.4), 1, 0.5);
    },
    wing: function (c) {
      return shadow(200, 126) +
        leg(110, 242, 104, 260, 11, 8) + leg(290, 242, 296, 260, 11, 8) +
        P("M102,100C102,78,126,66,142,70V178H102Z", "url(#fh)", c.st) + P("M298,100C298,78,274,66,258,70V178H298Z", "url(#fh)", c.st) +
        P("M138,60C138,46,162,40,200,40C238,40,262,46,262,60V192H138Z", "url(#fv)", c.st) +
        P("M154,72C154,62,172,58,200,58C228,58,246,62,246,72V192H154Z", "url(#fd)") +
        R(122, 188, 156, 52, 10, "url(#fv)", c.st) +
        R(84, 150, 42, 94, 19, "url(#fh)", c.st) + R(274, 150, 42, 94, 19, "url(#fh)", c.st) +
        LINE(96, 160, 114, 160, lt(c.f, 0.4), 1.2, 0.5) + LINE(286, 160, 304, 160, lt(c.f, 0.4), 1.2, 0.5);
    },
    club: function (c) {
      return shadow(200, 130) +
        R(102, 238, 14, 20, 2, "url(#wg)") + R(284, 238, 14, 20, 2, "url(#wg)") +
        R(88, 112, 224, 130, 12, "url(#fv)", c.st) +
        R(122, 128, 156, 66, 8, "url(#fd)") +
        R(122, 190, 156, 50, 8, "url(#fv)", c.st) +
        R(88, 152, 36, 90, 10, "url(#fh)", c.st) + R(276, 152, 36, 90, 10, "url(#fh)", c.st) +
        LINE(200, 190, 200, 240, dk(c.f, 0.4), 1, 0.4);
    },
    lounge: function (c) {
      return shadow(200, 126) +
        leg(116, 232, 102, 260, 12, 8) + leg(284, 232, 298, 260, 12, 8) +
        R(100, 224, 200, 14, 5, "url(#wg)") +
        R(112, 82, 176, 108, 18, "url(#fv)", c.st) +
        R(110, 184, 180, 46, 12, "url(#fv)", c.st) +
        R(92, 150, 14, 86, 4, "url(#wg)") + R(294, 150, 14, 86, 4, "url(#wg)") +
        R(84, 142, 36, 11, 5, "url(#wg)") + R(280, 142, 36, 11, 5, "url(#wg)") +
        LINE(200, 92, 200, 180, dk(c.f, 0.35), 1, 0.35);
    },
    bubble: function (c) {
      return shadow(200, 120) +
        leg(138, 236, 134, 258, 14, 9) + leg(262, 236, 266, 258, 14, 9) +
        P("M98,230V160A102,102,0,0,1,302,160V230Z", "url(#fh)", c.st) +
        P("M128,214V164A72,72,0,0,1,272,164V214Z", "url(#fd)") +
        C(118, 202, 34, "url(#fv)", c.st) + C(282, 202, 34, "url(#fv)", c.st) +
        R(124, 198, 152, 42, 21, "url(#fv)", c.st);
    }
  };

  /* ================= CHAISES ================= */
  function chairFront(c) {
    return (
      R(128, 186, 144, 10, 3, "url(#wg)") +
      leg(138, 192, 134, 258, 10, 6) + leg(262, 192, 266, 258, 10, 6) +
      R(124, 160, 152, 28, 11, "url(#fv)", c.st)
    );
  }
  function chairBack(c) {
    return shadow(200, 94, 7) + leg(148, 180, 150, 258, 8, 6, "url(#wd)") + leg(252, 180, 250, 258, 8, 6, "url(#wd)");
  }
  var chairs = {
    aria: function (c) {
      return chairBack(c) +
        P("M138,170V70C138,38,160,30,200,30C240,30,262,38,262,70V170Z", "url(#wg)") +
        P("M152,166V72C152,52,168,44,200,44C232,44,248,52,248,72V166Z", "url(#fv)", c.st) +
        chairFront(c);
    },
    lucca: function (c) {
      var s = "";
      [164, 182, 200, 218, 236].forEach(function (x) { s += R(x - 3.5, 50, 7, 116, 3, "url(#wg)"); });
      return chairBack(c) +
        R(138, 36, 12, 134, 4, "url(#wg)") + R(250, 36, 12, 134, 4, "url(#wg)") + s +
        R(138, 32, 124, 14, 6, "url(#wg)") +
        chairFront(c);
    },
    noor: function (c) {
      return chairBack(c) +
        P("M140,172V70C140,44,168,34,200,34C232,34,260,44,260,70V172Z", "url(#fv)", c.st) +
        LINE(168, 48, 168, 160, dk(c.f, 0.4), 1, 0.35) + LINE(200, 38, 200, 160, dk(c.f, 0.4), 1, 0.35) + LINE(232, 48, 232, 160, dk(c.f, 0.4), 1, 0.35) +
        chairFront(c);
    },
    selma: function (c) {
      var s = "";
      [54, 80, 106, 132].forEach(function (y) { s += R(146, y, 108, 13, 4, "url(#wg)"); });
      return chairBack(c) +
        R(138, 38, 12, 132, 4, "url(#wg)") + R(250, 38, 12, 132, 4, "url(#wg)") + s +
        chairFront(c);
    },
    venise: function (c) {
      var pts = [[184, 76], [216, 76], [168, 104], [200, 104], [232, 104], [184, 132], [216, 132], [168, 150], [200, 150], [232, 150]];
      var d = "";
      pts.forEach(function (p) { d += C(p[0], p[1], 2.6, dk(c.f, 0.45)); });
      return chairBack(c) +
        P("M136,170V66C136,34,162,24,200,24C238,24,264,34,264,66V170Z", "url(#wg)") +
        P("M150,166V68C150,46,170,38,200,38C230,38,250,46,250,68V166Z", "url(#fv)", c.st) +
        LINE(184, 76, 168, 104, dk(c.f, 0.4), 1, 0.4) + LINE(216, 76, 232, 104, dk(c.f, 0.4), 1, 0.4) + LINE(184, 76, 200, 104, dk(c.f, 0.4), 1, 0.4) + LINE(216, 76, 200, 104, dk(c.f, 0.4), 1, 0.4) +
        LINE(168, 104, 184, 132, dk(c.f, 0.4), 1, 0.4) + LINE(200, 104, 184, 132, dk(c.f, 0.4), 1, 0.4) + LINE(200, 104, 216, 132, dk(c.f, 0.4), 1, 0.4) + LINE(232, 104, 216, 132, dk(c.f, 0.4), 1, 0.4) +
        d + chairFront(c);
    }
  };

  /* ================= CHAISES DE BAR ================= */
  function stoolLegs(c, backless) {
    return shadow(200, 92, 7) +
      leg(150, 140, 152, 258, 7, 5, "url(#wd)") + leg(250, 140, 248, 258, 7, 5, "url(#wd)") +
      R(142, 206, 116, 6, 3, "url(#wg)") +
      leg(140, 148, 130, 258, 10, 6) + leg(260, 148, 270, 258, 10, 6);
  }
  var bars = {
    bistrot: function (c) {
      return stoolLegs(c) +
        P("M138,124C138,72,166,50,200,50C234,50,262,72,262,124L246,124C246,84,228,66,200,66C172,66,154,84,154,124Z", "url(#fv)", c.st) +
        R(122, 122, 156, 30, 13, "url(#fv)", c.st);
    },
    comptoir: function (c) {
      return stoolLegs(c) +
        R(144, 44, 9, 88, 3, "url(#wg)") + R(247, 44, 9, 88, 3, "url(#wg)") +
        R(152, 46, 96, 68, 14, "url(#fv)", c.st) +
        LINE(200, 54, 200, 106, dk(c.f, 0.4), 1, 0.35) +
        R(122, 122, 156, 30, 13, "url(#fv)", c.st);
    },
    zinc: function (c) {
      return stoolLegs(c) +
        R(128, 118, 144, 36, 18, "url(#fv)", c.st) +
        LINE(140, 130, 260, 130, lt(c.f, 0.4), 1, 0.45);
    },
    marbella: function (c) {
      return shadow(200, 96, 7) +
        leg(150, 150, 140, 258, 8, 5, "url(#wd)") + leg(250, 150, 260, 258, 8, 5, "url(#wd)") +
        R(140, 206, 120, 6, 3, "url(#wg)") +
        leg(144, 154, 124, 258, 11, 6) + leg(256, 154, 276, 258, 11, 6) +
        P("M124,128C112,76,146,40,200,40C254,40,288,76,276,128Z", "url(#fv)", c.st) +
        P("M142,126C136,88,160,60,200,60C240,60,264,88,258,126Z", "url(#fd)") +
        R(120, 122, 160, 32, 15, "url(#fv)", c.st);
    }
  };

  /* ================= TABLES ================= */
  function vase(x, y) {
    return P("M" + (x - 6) + "," + y + "C" + (x - 12) + "," + (y - 12) + "," + (x - 8) + "," + (y - 24) + "," + (x - 3) + "," + (y - 30) + "H" + (x + 3) + "C" + (x + 8) + "," + (y - 24) + "," + (x + 12) + "," + (y - 12) + "," + (x + 6) + "," + y + "Z", "#EFE7D8", 'stroke="#B9AE98" stroke-width=".8"') +
      LINE(x, y - 30, x - 8, y - 56, "#5B6B4C", 1.6) + LINE(x, y - 30, x + 9, y - 52, "#5B6B4C", 1.6) +
      C(x - 8, y - 58, 4, "#C97B6A") + C(x + 9, y - 54, 4, "#D9A15A");
  }
  var tables = {
    aurore: function (c) {
      return shadow(200, 150) +
        leg(86, 118, 92, 258, 12, 8) + leg(314, 118, 308, 258, 12, 8) +
        R(92, 198, 216, 7, 2, "url(#wg)") +
        R(70, 108, 260, 10, 2, "url(#wg)") + R(60, 96, 280, 13, 3, "url(#wv)") +
        vase(268, 96) + R(98, 80, 46, 8, 1, "#C9BFA9") + R(104, 72, 38, 8, 1, "#9E8F78");
    },
    pivoine: function (c) {
      return shadow(200, 100) +
        E(200, 252, 66, 10, "url(#wd)") + E(200, 248, 66, 10, "url(#wg)") +
        P("M190,240C192,204,192,176,194,148H206C208,176,208,204,210,240Z", "url(#wg)") +
        P("M104,136V146A96,16,0,0,0,296,146V136Z", "url(#wg)") + E(200, 136, 96, 16, "url(#wv)") +
        vase(236, 136);
    },
    nuit: function (c) {
      return shadow(200, 96) +
        leg(146, 170, 150, 258, 10, 7) + leg(254, 170, 250, 258, 10, 7) +
        R(150, 206, 100, 7, 2, "url(#wg)") +
        R(138, 124, 124, 48, 3, "url(#wg)") + R(146, 131, 108, 34, 2, "url(#wv)") + knob(200, 148) +
        R(124, 110, 152, 14, 3, "url(#wv)") +
        R(168, 88, 28, 22, 3, "#C9BFA9") + R(172, 70, 20, 18, 2, "#9E8F78");
    },
    palais: function (c) {
      var fl = "";
      [74, 78.5, 83].forEach(function (x) { fl += LINE(x, 172, x, 254, dk(c.w, 0.35), 1, 0.5); });
      [317, 321.5, 326].forEach(function (x) { fl += LINE(x, 172, x, 254, dk(c.w, 0.35), 1, 0.5); });
      return shadow(200, 160) +
        R(66, 164, 20, 94, 3, "url(#wg)") + R(314, 164, 20, 94, 3, "url(#wg)") + fl +
        R(74, 114, 252, 56, 3, "url(#wg)") +
        R(82, 122, 112, 40, 3, "url(#wv)") + R(206, 122, 112, 40, 3, "url(#wv)") + knob(138, 142) + knob(262, 142) +
        R(52, 98, 296, 16, 4, "url(#wv)") +
        vase(300, 98) + E(124, 94, 22, 4, "#FBF1E6", 'stroke="#B9AE98" stroke-width=".8"');
    }
  };

  /* ================= TABLES À MANGER ================= */
  function plates(xs, y, rx) {
    var s = "";
    xs.forEach(function (x) { s += E(x, y, rx, rx / 4.6, "#F6F1E6", 'stroke="#BFB49B" stroke-width=".8"') + E(x, y, rx * 0.6, rx / 7.5, "none", 'stroke="#D6CCB6" stroke-width=".8"'); });
    return s;
  }
  var dining = {
    royale: function (c) {
      return shadow(200, 168) +
        leg(88, 106, 90, 232, 10, 7, "url(#wd)") + leg(312, 106, 310, 232, 10, 7, "url(#wd)") +
        POLY("76,104 324,104 360,126 40,126", "url(#wv)") +
        plates([130, 270], 114, 26) + plates([200], 110, 18) +
        R(40, 126, 320, 13, 2, "url(#wg)") +
        leg(58, 138, 60, 258, 16, 10) + leg(342, 138, 340, 258, 16, 10) +
        R(180, 100, 3, 8, 0, "#EFE7D8") + C(181.5, 98, 2.5, "#E4B24F");
    },
    orion: function (c) {
      return shadow(200, 120) +
        E(200, 254, 62, 9, "url(#wd)") +
        P("M178,150H222C220,190,218,222,240,248H160C182,222,180,190,178,150Z", "url(#wg)") +
        P("M52,120V132A148,26,0,0,0,348,132V120Z", "url(#wg)") + E(200, 120, 148, 26, "url(#wv)") +
        plates([130, 270], 122, 24) + plates([200], 130, 20) + vase(200, 118);
    },
    cedre: function (c) {
      return shadow(200, 140) +
        R(76, 244, 62, 12, 3, "url(#wg)") + R(262, 244, 62, 12, 3, "url(#wg)") +
        P("M96,150H124V248H96Z", "url(#wg)") + P("M276,150H304V248H276Z", "url(#wg)") +
        R(124, 176, 152, 9, 2, "url(#wd)") +
        P("M44,118V130A156,24,0,0,0,356,130V118Z", "url(#wg)") + E(200, 118, 156, 24, "url(#wv)") +
        plates([120, 280], 120, 24) + plates([200], 124, 20) + vase(200, 112);
    },
    medina: function (c) {
      var g = "";
      [92, 100, 108, 116].forEach(function (x) { g += LINE(x, 140, x, 250, dk(c.w, 0.35), 1, 0.35); });
      [284, 292, 300, 308].forEach(function (x) { g += LINE(x, 140, x, 250, dk(c.w, 0.35), 1, 0.35); });
      return shadow(200, 160) +
        R(84, 124, 40, 134, 2, "url(#wg)") + R(276, 124, 40, 134, 2, "url(#wg)") + g +
        R(36, 100, 328, 28, 4, "url(#wv)") + R(36, 120, 328, 8, 3, "url(#wg)") +
        plates([120, 280], 98, 24) + plates([200], 99, 18) + vase(200, 100);
    }
  };

  /* ================= TABLES BASSES ================= */
  var coffee = {
    lune: function (c) {
      return shadow(200, 138, 9) +
        leg(116, 192, 110, 256, 12, 8, "url(#wd)") + leg(284, 192, 290, 256, 12, 8, "url(#wd)") +
        leg(200, 208, 200, 258, 12, 8) +
        P("M70,170V181A130,32,0,0,0,330,181V170Z", "url(#wg)") + E(200, 170, 130, 32, "url(#wv)") +
        E(160, 166, 34, 6, "none", 'stroke="' + dk(c.w, 0.2) + '" stroke-opacity=".25"') +
        vase(244, 168);
    },
    galet: function (c) {
      return shadow(200, 120, 9) +
        E(200, 254, 62, 8, "url(#wd)") +
        P("M164,214C172,230,168,242,150,252H250C232,242,228,230,236,214Z", "url(#wg)") +
        P("M80,182C80,156,140,144,210,146C290,148,330,162,326,186C322,210,260,220,190,218C120,216,80,206,80,182Z", "url(#wd)", 'transform="translate(0,10)"') +
        P("M80,182C80,156,140,144,210,146C290,148,330,162,326,186C322,210,260,220,190,218C120,216,80,206,80,182Z", "url(#wv)") +
        R(120, 152, 44, 7, 1, "#C9BFA9", 'transform="rotate(-4 142 155)"') + R(124, 145, 36, 7, 1, "#9E8F78", 'transform="rotate(-4 142 148)"');
    },
    prisme: function (c) {
      return shadow(200, 150, 9) +
        leg(120, 180, 122, 234, 9, 6, "url(#wd)") + leg(292, 180, 290, 234, 9, 6, "url(#wd)") +
        POLY("112,150 300,150 346,186 66,186", "url(#wv)") +
        R(66, 186, 280, 13, 2, "url(#wg)") +
        leg(80, 198, 82, 258, 12, 8) + leg(332, 198, 330, 258, 12, 8) +
        POLY("150,166 214,166 224,176 140,176", "none", 'stroke="' + dk(c.w, 0.2) + '" stroke-opacity=".25"') +
        vase(250, 168);
    },
    duo: function (c) {
      return shadow(190, 160, 9) +
        leg(98, 196, 94, 256, 10, 7, "url(#wd)") + leg(206, 196, 210, 256, 10, 7, "url(#wd)") +
        P("M54,178V188A92,22,0,0,0,238,188V178Z", "url(#wg)") + E(146, 178, 92, 22, "url(#wv)") +
        leg(264, 222, 260, 258, 9, 6, "url(#wd)") + leg(336, 222, 340, 258, 9, 6, "url(#wd)") +
        P("M236,208V216A64,15,0,0,0,364,216V208Z", "url(#wg)") + E(300, 208, 64, 15, "url(#wv)") +
        vase(146, 176);
    }
  };

  /* ================= BUREAUX ================= */
  function drawers(x, y, w, n, h, gap) {
    var s = "";
    for (var i = 0; i < n; i++) { s += R(x + 7, y + 7 + i * (h + gap), w - 14, h, 2, "url(#wv)") + knob(x + w / 2, y + 7 + i * (h + gap) + h / 2); }
    return s;
  }
  function lamp(x, y) {
    return R(x - 8, y - 4, 16, 4, 2, "#B9AE98") + LINE(x, y - 4, x - 2, y - 36, "#8F8472", 2.4) + P("M" + (x - 18) + "," + (y - 34) + "L" + (x + 14) + "," + (y - 40) + "L" + (x + 4) + "," + (y - 56) + "L" + (x - 14) + "," + (y - 52) + "Z", "#E8DEC6", 'stroke="#B9AE98" stroke-width=".8"');
  }
  var desks = {
    directeur: function (c) {
      return shadow(200, 168) +
        POLY("66,106 334,106 366,128 34,128", "url(#wv)") +
        POLY("110,112 290,112 312,124 88,124", c.f, c.st) +
        R(34, 128, 332, 10, 2, "url(#wg)") +
        R(136, 138, 128, 70, 0, "url(#wd)") +
        R(44, 138, 92, 120, 2, "url(#wg)") + R(264, 138, 92, 120, 2, "url(#wg)") +
        drawers(44, 138, 92, 3, 30, 5) + drawers(264, 138, 92, 3, 30, 5) +
        lamp(330, 106) + R(70, 96, 38, 8, 1, "#C9BFA9") + R(74, 88, 30, 8, 1, "#9E8F78");
    },
    atelier: function (c) {
      return shadow(200, 160) +
        leg(86, 112, 88, 232, 10, 7, "url(#wd)") + leg(314, 112, 312, 232, 10, 7, "url(#wd)") +
        POLY("70,108 330,108 362,130 38,130", "url(#wv)") +
        R(38, 130, 324, 10, 2, "url(#wg)") +
        R(128, 140, 144, 28, 2, "url(#wg)") + R(135, 146, 130, 16, 2, "url(#wv)") + knob(200, 154) +
        leg(60, 138, 64, 258, 14, 9) + leg(340, 138, 336, 258, 14, 9) +
        R(236, 100, 64, 8, 2, "#CFC9BE") + R(244, 78, 48, 22, 2, "#BDB6A8") + lamp(104, 112);
    },
    scribe: function (c) {
      return shadow(200, 130) +
        leg(116, 140, 100, 258, 10, 7, "url(#wd)") + leg(284, 140, 300, 258, 10, 7, "url(#wd)") +
        POLY("108,116 292,116 322,136 78,136", "url(#wv)") +
        R(78, 136, 244, 9, 2, "url(#wg)") +
        R(150, 145, 100, 20, 2, "url(#wg)") + R(156, 150, 88, 11, 2, "url(#wv)") + knob(200, 155) +
        leg(98, 144, 86, 258, 12, 8) + leg(302, 144, 314, 258, 12, 8) +
        R(180, 109, 40, 7, 1, "#C9BFA9") + R(240, 112, 34, 4, 1, "#9E8F78") + lamp(130, 116);
    },
    notaire: function (c) {
      return shadow(200, 160) +
        POLY("70,110 330,110 362,132 38,132", "url(#wv)") +
        POLY("120,116 288,116 310,128 98,128", c.f, c.st) +
        R(38, 132, 324, 10, 2, "url(#wg)") +
        R(150, 142, 164, 12, 2, "url(#wg)") +
        leg(332, 142, 336, 258, 14, 9) + leg(254, 154, 252, 258, 10, 7, "url(#wd)") +
        R(48, 142, 100, 116, 2, "url(#wg)") + drawers(48, 142, 100, 3, 29, 5) +
        lamp(318, 110) + R(76, 102, 40, 8, 1, "#C9BFA9");
    }
  };

  /* ================= COIFFEUSES ================= */
  function vanityTable(c) {
    return (
      leg(100, 214, 106, 258, 10, 7) + leg(300, 214, 294, 258, 10, 7) +
      R(90, 176, 220, 40, 3, "url(#wg)") + R(98, 183, 98, 26, 2, "url(#wv)") + R(204, 183, 98, 26, 2, "url(#wv)") + knob(147, 196) + knob(253, 196) +
      R(80, 164, 240, 12, 3, "url(#wv)")
    );
  }
  function pouf(c) {
    return leg(168, 244, 166, 258, 7, 5) + leg(232, 244, 234, 258, 7, 5) +
      P("M160,232V246A40,9,0,0,0,240,246V232Z", "url(#fh)", c.st) + E(200, 232, 40, 9, "url(#fv)", c.st);
  }
  function perfume(x, y) { return R(x - 7, y - 20, 14, 20, 3, "#E4DACA", 'stroke="#B9AE98" stroke-width=".8"') + R(x - 3, y - 27, 6, 7, 1, "#C9A24B"); }
  var vanities = {
    garance: function (c) {
      return shadow(200, 130) + vanityTable(c) +
        R(190, 150, 20, 14, 2, "url(#wd)") +
        C(200, 98, 64, "url(#wg)") + C(200, 98, 55, "url(#mir)") +
        LINE(166, 76, 188, 58, "#fff", 3, 0.6) +
        perfume(262, 164) + perfume(284, 164) + pouf(c);
    },
    opale: function (c) {
      return shadow(200, 130) + vanityTable(c) +
        P("M138,166V92C138,52,166,36,200,36C234,36,262,52,262,92V166Z", "url(#wg)") +
        P("M149,162V94C149,60,172,47,200,47C228,47,251,60,251,94V162Z", "url(#mir)") +
        LINE(166, 78, 182, 62, "#fff", 3, 0.6) +
        perfume(114, 164) + pouf(c);
    },
    josephine: function (c) {
      return shadow(200, 130) + vanityTable(c) +
        P("M104,72L154,58V164L104,158Z", "url(#wg)") + P("M112,80L148,70V156L112,152Z", "url(#mir)") +
        P("M296,72L246,58V164L296,158Z", "url(#wg)") + P("M288,80L252,70V156L288,152Z", "url(#mir)") +
        R(150, 52, 100, 114, 4, "url(#wg)") + R(160, 62, 80, 94, 3, "url(#mir)") +
        LINE(170, 80, 188, 66, "#fff", 3, 0.6) +
        perfume(288, 164) + pouf(c);
    },
    capucine: function (c) {
      return shadow(200, 130) + vanityTable(c) +
        R(128, 44, 144, 124, 10, "url(#wg)") + R(140, 56, 120, 100, 5, "url(#mir)") +
        LINE(158, 76, 176, 62, "#fff", 3, 0.6) +
        perfume(108, 164) + perfume(292, 164) + pouf(c);
    }
  };

  /* ================= TÊTES DE LIT ================= */
  function bed(c) {
    return (
      R(48, 244, 16, 14, 2, "url(#wg)") + R(336, 244, 16, 14, 2, "url(#wg)") +
      R(44, 214, 312, 34, 5, "url(#wg)") +
      R(52, 190, 296, 36, 12, "url(#lin)", 'stroke="#CFC4AE" stroke-width="1"') +
      R(76, 168, 104, 34, 15, "#FAF6EC", 'stroke="#D7CDB6" stroke-width="1"') + R(220, 168, 104, 34, 15, "#FAF6EC", 'stroke="#D7CDB6" stroke-width="1"') +
      LINE(100, 184, 156, 184, "#D7CDB6", 1, 0.8) + LINE(244, 184, 300, 184, "#D7CDB6", 1, 0.8)
    );
  }
  var heads = {
    versailles: function (c) {
      var d = "", l = "", pts = [], r, k, x, y;
      for (r = 0; r < 3; r++) {
        pts[r] = [];
        for (k = 0; k < 6; k++) { x = 88 + k * 44 + (r % 2 ? 22 : 0); y = 90 + r * 32; if (x < 330) pts[r].push([x, y]); }
      }
      for (r = 0; r < 3; r++) pts[r].forEach(function (p, i) {
        d += C(p[0], p[1], 3, dk(c.f, 0.5), 'fill-opacity=".8"');
        if (r < 2) {
          var nx = pts[r + 1];
          nx.forEach(function (q) { if (Math.abs(q[0] - p[0]) < 24) l += LINE(p[0], p[1], q[0], q[1], dk(c.f, 0.45), 1, 0.4); });
        }
      });
      return shadow(200, 170) +
        P("M48,216V96C48,70,66,58,92,58H308C334,58,352,70,352,96V216Z", "url(#fv)", c.st) +
        l + d + bed(c);
    },
    cannelle: function (c) {
      var s = "";
      for (var i = 0; i < 16; i++) s += R(58 + i * 17.5, 70, 15.5, 150, 7, "url(#fh)", c.st.replace('1.2"', '.6"'));
      return shadow(200, 170) + R(50, 62, 300, 160, 16, "url(#fd)") + s + bed(c);
    },
    eclipse: function (c) {
      return shadow(200, 170) +
        P("M52,216V160A148,104,0,0,1,348,160V216Z", "url(#fv)", c.st) +
        P("M76,216V162A124,84,0,0,1,324,162V216Z", "url(#fh)", 'stroke="' + lt(c.f, 0.3) + '" stroke-width="1.2" stroke-opacity=".6"') +
        bed(c);
    },
    serenite: function (c) {
      return shadow(200, 170) +
        R(50, 96, 74, 124, 14, "url(#fh)", c.st) + R(276, 96, 74, 124, 14, "url(#fh)", c.st) +
        R(108, 50, 184, 170, 12, "url(#fv)", c.st) +
        R(122, 64, 156, 142, 8, "none", 'stroke="' + lt(c.f, 0.3) + '" stroke-width="1.2" stroke-opacity=".55"') +
        LINE(200, 68, 200, 204, dk(c.f, 0.4), 1, 0.3) + bed(c);
    }
  };

  /* ================= FOOTSTOOLS ================= */
  var stools = {
    perle: function (c) {
      return shadow(200, 124) +
        leg(132, 226, 124, 258, 13, 9) + leg(268, 226, 276, 258, 13, 9) + leg(200, 238, 200, 258, 13, 9) +
        P("M104,148V212A96,24,0,0,0,296,212V148Z", "url(#fh)", c.st) +
        E(200, 148, 96, 24, "url(#fv)", c.st) +
        E(200, 148, 90, 20, "none", 'stroke="' + lt(c.f, 0.35) + '" stroke-opacity=".5"') +
        C(200, 148, 3.4, dk(c.f, 0.45)) +
        P("M104,206A96,24,0,0,0,296,206", "none", 'stroke="' + dk(c.f, 0.35) + '" stroke-opacity=".5"');
    },
    ottoman: function (c) {
      return shadow(200, 150) +
        R(72, 232, 18, 24, 3, "url(#wg)") + R(310, 232, 18, 24, 3, "url(#wg)") +
        R(54, 176, 292, 60, 8, "url(#fh)", c.st) +
        POLY("96,136 304,136 346,178 54,178", "url(#fv)", c.st) +
        C(126, 152, 3, dk(c.f, 0.5)) + C(200, 152, 3, dk(c.f, 0.5)) + C(274, 152, 3, dk(c.f, 0.5)) +
        C(96, 166, 3, dk(c.f, 0.5)) + C(163, 166, 3, dk(c.f, 0.5)) + C(237, 166, 3, dk(c.f, 0.5)) + C(304, 166, 3, dk(c.f, 0.5)) +
        LINE(126, 152, 96, 166, dk(c.f, 0.4), 1, 0.35) + LINE(126, 152, 163, 166, dk(c.f, 0.4), 1, 0.35) + LINE(200, 152, 163, 166, dk(c.f, 0.4), 1, 0.35) + LINE(200, 152, 237, 166, dk(c.f, 0.4), 1, 0.35) + LINE(274, 152, 237, 166, dk(c.f, 0.4), 1, 0.35) + LINE(274, 152, 304, 166, dk(c.f, 0.4), 1, 0.35);
    },
    lotus: function (c) {
      return shadow(200, 150) +
        R(100, 222, 200, 7, 2, "url(#wd)") +
        leg(84, 198, 74, 258, 15, 9) + leg(316, 198, 326, 258, 15, 9) +
        R(60, 186, 280, 14, 4, "url(#wg)") +
        R(66, 146, 268, 44, 20, "url(#fv)", c.st) +
        LINE(90, 158, 310, 158, lt(c.f, 0.4), 1, 0.4);
    },
    de: function (c) {
      return shadow(200, 130) +
        R(96, 234, 22, 22, 11, "url(#wg)") + R(282, 234, 22, 22, 11, "url(#wg)") +
        R(82, 150, 236, 88, 8, "url(#fh)", c.st) +
        POLY("118,112 282,112 318,150 82,150", "url(#fv)", c.st) +
        C(200, 131, 3.4, dk(c.f, 0.5)) +
        LINE(200, 131, 118, 112, dk(c.f, 0.4), 1, 0.3) + LINE(200, 131, 282, 112, dk(c.f, 0.4), 1, 0.3) + LINE(200, 131, 82, 150, dk(c.f, 0.4), 1, 0.3) + LINE(200, 131, 318, 150, dk(c.f, 0.4), 1, 0.3) +
        C(200, 194, 3.4, dk(c.f, 0.5)) + LINE(200, 150, 200, 238, dk(c.f, 0.35), 1, 0.3);
    }
  };

  /* ================= CATALOGUE ================= */
  function M(name, draw, wood, fab, desc) { return { name: name, draw: draw, wood: wood, fab: fab, desc: desc }; }
  var CATALOG = {
    fauteuil: { scale: 1.12, piece: "Fauteuil", title: "Nos modèles de fauteuils", intro: "Du club profond au fauteuil de lecture, chaque modèle se fabrique sur commande dans le bois et le tissu de votre choix.", search: "Rechercher un fauteuil (Alphonse, cuir, bouclé…)", fn: seatArm, items: [
      M("Opéra", "barrel", "noyer", "velours_em", "Dossier enveloppant en demi-lune et assise profonde, pour un fauteuil de salon qui invite à s'attarder."),
      M("Cassia", "wing", "rouge", "lin", "Haut dossier à oreilles et accoudoirs roulés, idéal pour la lecture au coin du feu."),
      M("Atlas", "club", "noyer", "cuir", "Un club aux volumes nets, généreusement rembourré et habillé de cuir qui se patine."),
      M("Zéphyr", "lounge", "chene", "lin_sauge", "Structure en bois apparente et coussins moelleux, pour une détente aux lignes scandinaves."),
      M("Mirabelle", "bubble", "chene", "boucle", "Une silhouette ronde et douce, en bouclé ivoire, qui adoucit n'importe quel salon.")
    ] },
    chaise: { scale: 1.06, piece: "Chaise", title: "Nos modèles de chaises", intro: "Pour la salle à manger, le bureau ou le salon : choisissez la forme, puis le bois et le tissu.", search: "Rechercher une chaise (Dalida, bois, tissu…)", fn: chairs, items: [
      M("Aria", "aria", "noyer", "velours_bp", "Dossier galbé entièrement tapissé, confortable pour de longs dîners."),
      M("Lucca", "lucca", "chene", "lin", "Dossier à barreaux en bois massif et assise garnie, simple et chaleureuse."),
      M("Noor", "noor", "rouge", "velours_em", "Haut dossier cannelé, pour une table à manger de caractère."),
      M("Selma", "selma", "noyer", "tweed", "Dossier à lattes horizontales, d'un graphisme léger et élégant."),
      M("Venise", "venise", "rouge", "jacquard", "Dossier capitonné à boutons, d'inspiration classique et raffinée.")
    ] },
    chaisebar: { scale: 1.1, piece: "Chaise de bar", title: "Nos modèles de chaises de bar", intro: "Hauteur comptoir ou îlot, avec repose-pieds : des assises faites pour qu'on y reste.", search: "Rechercher une chaise de bar (Bistrot, cuir…)", fn: bars, items: [
      M("Bistrot", "bistrot", "chene", "cuir", "Dossier arrondi qui enveloppe le dos et repose-pieds, pour l'îlot de cuisine."),
      M("Comptoir", "comptoir", "noyer", "chenille", "Haut dossier rembourré et assise confortable, pour y rester longtemps."),
      M("Zinc", "zinc", "rouge", "velours_bx", "Tabouret sans dossier, compact, qui se glisse sous le comptoir."),
      M("Marbella", "marbella", "chene", "boucle", "Assise coque généreuse, piètement évasé et repose-pieds en bois.")
    ] },
    table: { scale: 1.12, piece: "Table", title: "Nos modèles de tables", intro: "Consoles, guéridons et tables d'appoint : les pièces qui complètent un salon, une entrée ou une chambre.", search: "Rechercher une table (console, guéridon…)", fn: tables, items: [
      M("Aurore", "aurore", "chene", null, "Console fine avec tablette basse, idéale pour une entrée."),
      M("Pivoine", "pivoine", "noyer", null, "Guéridon à pied central, parfait près d'un fauteuil."),
      M("Nuit", "nuit", "rouge", null, "Table d'appoint à tiroir, à glisser près du canapé ou du lit."),
      M("Palais", "palais", "noyer", null, "Console à deux tiroirs et pieds cannelés, pour un hall d'entrée de caractère.")
    ] },
    tablemanger: { scale: 1.1, piece: "Table à manger", title: "Nos modèles de tables à manger", intro: "Rondes, ovales ou rectangulaires : la table qui réunit, dimensionnée pour le nombre de convives.", search: "Rechercher une table à manger (ronde, ovale…)", fn: dining, items: [
      M("Royale", "royale", "noyer", null, "Grande table rectangulaire sur pieds massifs, pour 8 à 10 convives."),
      M("Orion", "orion", "chene", null, "Table ronde à pied central, conviviale pour 4 à 6 personnes."),
      M("Cèdre", "cedre", "rouge", null, "Plateau ovale sur piètement en traîneau, pour 6 à 8 convives."),
      M("Médina", "medina", "noyer", null, "Plateau épais sur pieds blocs, une présence sculpturale dans la pièce.")
    ] },
    tablebasse: { scale: 1.12, piece: "Table basse", title: "Nos modèles de tables basses", intro: "Rondes, ovales, carrées ou gigognes : à l'échelle de votre salon et de votre canapé.", search: "Rechercher une table basse (ronde, gigogne…)", fn: coffee, items: [
      M("Lune", "lune", "chene", null, "Plateau rond sur trois pieds fuselés, léger et lumineux."),
      M("Galet", "galet", "noyer", null, "Une forme organique de galet, posée sur un socle sculpté."),
      M("Prisme", "prisme", "rouge", null, "Lignes droites et piètement fin pour un salon contemporain."),
      M("Duo", "duo", "chene", null, "Deux tables gigognes à associer ou à séparer selon les envies.")
    ] },
    bureau: { scale: 1.08, piece: "Bureau", title: "Nos modèles de bureaux", intro: "Plateau généreux, tiroirs et rangements : des bureaux pour travailler dans de belles conditions.", search: "Rechercher un bureau (Directeur, tiroirs…)", fn: desks, items: [
      M("Directeur", "directeur", "noyer", "cuir", "Large plateau à sous-main en cuir et deux caissons de tiroirs."),
      M("Atelier", "atelier", "chene", null, "Bureau épuré à tiroir central et pieds fuselés."),
      M("Scribe", "scribe", "rouge", null, "Bureau d'écriture compact, pour un coin de chambre ou de salon."),
      M("Notaire", "notaire", "noyer", "tweed", "Caisson de tiroirs à gauche, jambes libres à droite, sous-main en tissu.")
    ] },
    coiffeuse: { scale: 1.08, piece: "Coiffeuse", title: "Nos modèles de coiffeuses", intro: "Miroir, tiroirs et pouf assorti : chaque coiffeuse se compose avec le bois et le tissu de votre choix.", search: "Rechercher une coiffeuse (miroir rond, arche…)", fn: vanities, items: [
      M("Garance", "garance", "chene", "boucle", "Miroir rond, deux tiroirs et son pouf assorti."),
      M("Opale", "opale", "noyer", "velours_rose", "Miroir en arche et plateau généreux pour tout ranger à portée de main."),
      M("Joséphine", "josephine", "rouge", "velours_em", "Miroir triptyque pour se voir sous tous les angles."),
      M("Capucine", "capucine", "chene", "lin", "Miroir rectangulaire encadré de bois, deux tiroirs et pouf en lin.")
    ] },
    tetelit: { scale: 1.1, piece: "Tête de lit", title: "Nos modèles de têtes de lit", intro: "Capitonnées, cannelées ou arrondies : à la largeur exacte de votre lit.", search: "Rechercher une tête de lit (capitonnée, arche…)", fn: heads, items: [
      M("Versailles", "versailles", "rouge", "velours_bx", "Capitonnage à boutons et lignes classiques, pour une chambre digne d'un grand hôtel."),
      M("Cannelle", "cannelle", "chene", "lin", "Cannelures verticales et finition soignée, une élégance sobre."),
      M("Éclipse", "eclipse", "noyer", "boucle", "Une arche douce et enveloppante, en bouclé ivoire."),
      M("Sérénité", "serenite", "chene", "lin_sauge", "Dossier à ailes latérales, pour créer un véritable cocon de chambre.")
    ] },
    canape: { scale: 1.1, piece: "Canapé", title: "Nos modèles de canapés", intro: "Deux, trois ou quatre places, droits ou d'angle : bois et tissu à votre choix.", search: "Rechercher un canapé (Floyd, cuir, angle…)", fn: heads, items: [] },
    footstool: { scale: 1.25, piece: "Footstool", title: "Nos modèles de footstools", intro: "Repose-pieds, poufs et banquettes : à assortir à vos fauteuils ou à glisser au pied du lit.", search: "Rechercher un footstool (pouf, banquette…)", fn: stools, items: [
      M("Perle", "perle", "noyer", "velours_em", "Pouf rond à passepoil sur pieds en bois, le complément d'un fauteuil."),
      M("Ottoman", "ottoman", "chene", "cuir", "Ottoman capitonné en cuir, à glisser au pied du canapé."),
      M("Lotus", "lotus", "chene", "lin", "Banquette basse sur cadre en bois, parfaite au pied du lit."),
      M("Dé", "de", "rouge", "chenille", "Pouf cube compact et polyvalent, siège d'appoint ou repose-pieds.")
    ] }
  };

  function svgFor(catKey, idx) {
    var cat = CATALOG[catKey], m = cat.items[idx];
    var wood = WOODS[m.wood];
    var fab = m.fab ? FAB[m.fab].c : lt(wood, 0.1);
    var c = { f: fab, w: wood, st: 'stroke="' + dk(fab, 0.45) + '" stroke-opacity=".55" stroke-width="1.2"' };
    var bg = BGS[(idx + catKey.length) % BGS.length];
    var extra = catKey === "chaisebar" ? R(0, 98, 400, 11, 0, lt(wood, 0.3)) + R(0, 109, 400, 149, 0, dk(bg, 0.05)) + R(0, 109, 400, 5, 0, "rgba(0,0,0,.07)") : "";
    var sc = cat.scale || 1;
    var body = extra + '<g transform="translate(200 258) scale(' + sc + ') translate(-200 -258)">' + cat.fn[m.draw](c) + "</g>";
    return wrap(bg, fab, wood, body);
  }
  function dataUri(svg) { return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); }

  return { CATALOG: CATALOG, WOODS: WOODS, WOODN: WOODN, FAB: FAB, svgFor: svgFor, dataUri: dataUri };
})();
if (typeof module !== "undefined") module.exports = DMM;
var DMM_PHOTO_ITEMS = {"tablebasse": [{"name": "Zoulou", "photo": "zoulou", "desc": "Plateau en bois massif en lames épaisses, posé sur deux pieds en acier : une table basse robuste et chaleureuse."}, {"name": "Smile", "photo": "smile", "desc": "Plateau effilé aux pieds sculptés en bois, avec une niche centrale : une silhouette légère, très graphique."}, {"name": "Seoul", "photo": "seoul", "desc": "Longue table basse en bois, aux gros pieds carrés, rehaussée de deux inserts noirs."}, {"name": "Tetrix", "photo": "tetrix", "desc": "Volumes en bois qui s'étagent comme des blocs, pour une table basse sculpturale."}, {"name": "Tutsi", "photo": "tutsi", "desc": "Plateau en carrés de bois posés comme une mosaïque, sur deux pieds sombres."}, {"name": "Racine", "photo": "racine", "desc": "Une table basse taillée dans une racine massive, chaque pièce est unique."}, {"name": "Tatohi", "photo": "tatohi", "desc": "Deux plateaux ronds superposés : l'un sombre sur fin cadre noir, l'autre en bois sur fût cannelé."}, {"name": "Yin & Yang", "photo": "yinyang", "desc": "Deux tables basses jumelles, plateaux laqués de couleur et piètement en treillis de bois."}, {"name": "Vaz", "photo": "vaz", "desc": "Trio de tables rondes de hauteurs différentes, plateaux en bois ou en émail, pieds tournés."}, {"name": "Pigu", "photo": "pigu", "desc": "Trois tables rondes de tailles différentes, à pied conique, qui se déclinent en jeu."}], "table": [{"name": "Tambour", "photo": "tambour", "desc": "Table d'appoint en bois ajouré en losanges, plateau et base arrondis, inspirée des tambours."}, {"name": "Tonneau", "photo": "tonneau", "desc": "Chevet rond à structure en tonneau, plateau en bois massif aux reflets profonds."}, {"name": "Siry", "photo": "siry", "desc": "Table d'appoint facettée, en bois clair veiné ou en finition noire."}, {"name": "Yoyo", "photo": "yoyo", "desc": "Paire de tables d'appoint à fût cannelé et plateau en demi-lune."}, {"name": "Senna", "photo": "senna", "desc": "Guéridon laqué blanc à fût conique et plateau rond, très épuré."}, {"name": "Trinity", "photo": "trinity", "desc": "Trio de bouts de canapé en bois clair, plateaux laqués blancs, de hauteurs différentes."}, {"name": "Zellige Yoda", "photo": "zellige", "desc": "Table ronde à plateau en zellige et piètement en fer forgé entrelacé (Ø 90 cm, hauteur 65 cm)."}, {"name": "Table de coin", "photo": "coin", "desc": "Meuble d'angle arrondi en bois, portes en cannage (L 65 × P 65 × H 65 cm)."}], "tablemanger": [{"name": "Pied parachute", "photo": "parachute", "desc": "Plateau rond en bois massif, posé sur un fût cylindrique en métal ou en bois, en plusieurs finitions."}, {"name": "Royère", "photo": "royere", "desc": "Grande table à manger sur piétement en sphères de métal, plateau en bois ou en pierre."}]};
var DMM_PHOTOS = {"zoulou": "/photos/zoulou.jpg", "smile": "/photos/smile.jpg", "seoul": "/photos/seoul.jpg", "tetrix": "/photos/tetrix.jpg", "tutsi": "/photos/tutsi.jpg", "racine": "/photos/racine.jpg", "tatohi": "/photos/tatohi.jpg", "yinyang": "/photos/yinyang.jpg", "vaz": "/photos/vaz.jpg", "pigu": "/photos/pigu.jpg", "tambour": "/photos/tambour.jpg", "tonneau": "/photos/tonneau.jpg", "siry": "/photos/siry.jpg", "yoyo": "/photos/yoyo.jpg", "senna": "/photos/senna.jpg", "trinity": "/photos/trinity.jpg", "zellige": "/photos/zellige.jpg", "coin": "/photos/coin.jpg", "parachute": "/photos/parachute.jpg", "royere": "/photos/royere.jpg"};
var DMM_REPLACE = {fauteuil:1, chaise:1, chaisebar:1, table:1, tablemanger:1, tablebasse:1, bureau:1, coiffeuse:1, tetelit:1, footstool:1, canape:1};
var DMM_PHOTO_ITEMS2 = {"tablebasse": [{"name": "Hercule", "photo": "hercule", "desc": "Très long plateau en bois clair posé sur un piétement en acier noir aux branches croisées."}, {"name": "Jeu en résine", "photo": "resine", "desc": "Trio de tables rondes en résine à fines cannelures, à associer à plusieurs hauteurs."}, {"name": "Koya", "photo": "koya", "desc": "Plateau laqué noir aux angles arrondis, sur un piétement en bois massif aux veines marquées."}, {"name": "Mariage frère", "photo": "mariage", "desc": "Grand plateau de service en bois cintré avec poignées, sur un piétement en croix en métal."}, {"name": "Mariella", "photo": "mariella", "desc": "Plateau ovale en bois sur un piétement en métal dessinant un huit, avec sa petite table assortie."}, {"name": "Mediator", "photo": "mediator", "desc": "Tables gigognes en forme de galet, plateaux en bois et pieds fuselés."}, {"name": "Rose et marbre", "photo": "rosemarbre", "desc": "Deux tables en pierre claire et marbre, plateau rose poudré aux angles adoucis."}, {"name": "Nalos", "photo": "nalos", "desc": "Plateaux ronds sur pied conique en bois, avec un plateau en émail vert profond."}, {"name": "Nénuphar", "photo": "nenuphar", "desc": "Deux plateaux ronds à hauteurs différentes, l'un en bois, l'autre laqué blanc, sur pied en croix."}, {"name": "Opéra", "photo": "opera_t", "desc": "Trio de plateaux en bois, un rond et deux en forme de galet, sur pieds fuselés."}, {"name": "Paris", "photo": "paris", "desc": "Structure en métal bronzé à deux niveaux, plateaux en bois."}, {"name": "Patish", "photo": "patish", "desc": "Trio de tables à plateaux ronds et ovale, pieds cylindriques, en plusieurs teintes."}, {"name": "Peco", "photo": "peco", "desc": "Tables rondes sur piétement en fil de métal en sablier, plateau en bois massif."}, {"name": "Panda", "photo": "panda", "desc": "Plateau en dalles de pierre claire, posé sur des pieds en métal sombre."}, {"name": "Bali", "photo": "bali", "desc": "Table basse carrée à plateau en zellige, posée sur un pied en bois en forme de dôme (110 × 110 cm, hauteur 45 cm)."}], "table": [{"name": "Girafe", "photo": "girafe", "desc": "Table d'appoint en C, plateau en bois assemblé et structure en métal noir, qui se glisse sous le canapé."}, {"name": "Gustave", "photo": "gustave", "desc": "Chevet tourné en forme de sablier, en bois massif (Ø 60 cm, hauteur 60 cm)."}, {"name": "Lizzy", "photo": "lizzy", "desc": "Deux plateaux en bois décalés, posés sur un pied en métal noir."}, {"name": "Pacifique", "photo": "pacifique", "desc": "Table d'appoint à hauteur réglable, plateau carré sur colonne en métal."}, {"name": "Courbevoie", "photo": "courbevoie", "desc": "Petite table à plateau laqué et rebord en laiton, sur un pied rond en laiton patiné."}]};
Object.keys(DMM_PHOTO_ITEMS2).forEach(function (c) { DMM_PHOTO_ITEMS[c] = DMM_PHOTO_ITEMS[c].concat(DMM_PHOTO_ITEMS2[c]); });
var DMM_PHOTOS2 = {"hercule": "/photos/hercule.jpg", "resine": "/photos/resine.jpg", "koya": "/photos/koya.jpg", "mariage": "/photos/mariage.jpg", "mariella": "/photos/mariella.jpg", "mediator": "/photos/mediator.jpg", "rosemarbre": "/photos/rosemarbre.jpg", "nalos": "/photos/nalos.jpg", "nenuphar": "/photos/nenuphar.jpg", "opera_t": "/photos/opera_t.jpg", "paris": "/photos/paris.jpg", "patish": "/photos/patish.jpg", "peco": "/photos/peco.jpg", "panda": "/photos/panda.jpg", "bali": "/photos/bali.jpg", "girafe": "/photos/girafe.jpg", "gustave": "/photos/gustave.jpg", "lizzy": "/photos/lizzy.jpg", "pacifique": "/photos/pacifique.jpg", "courbevoie": "/photos/courbevoie.jpg"};
Object.keys(DMM_PHOTOS2).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS2[k]; });
var DMM_PHOTO_ITEMS3 = {"tablebasse": [{"name": "Alfred", "photo": "alfred", "desc": "Très long plateau ovale en bois posé sur un piétement en acier noir aux lames croisées."}, {"name": "Arbre du monde", "photo": "arbre", "desc": "Plateau en bois aux contours ondulés, posé sur un socle aux courbes organiques."}, {"name": "Arc", "photo": "arc", "desc": "Plateau ovale en bois sur des pieds en lamelles de bois cintrées."}, {"name": "Bobi", "photo": "bobi", "desc": "Plateau ovale en bois massif, en léger porte-à-faux sur un volume plein."}, {"name": "Buki", "photo": "buki", "desc": "Table basse en bois massif avec tiroirs et niche ouverte, sur pieds fuselés."}, {"name": "Cannelé", "photo": "cannele", "desc": "Grand plateau carré en mosaïque de matières, sur un pied central en laiton aux plis anguleux."}, {"name": "Carron", "photo": "carron", "desc": "Plateau rond laqué rose, posé sur un fût cylindrique en laiton patiné."}, {"name": "Chacha", "photo": "chacha", "desc": "Trio de tables rondes à plateaux en bois, sur fins pieds métalliques noirs."}, {"name": "Cid", "photo": "cid", "desc": "Plateau en marbre clair sur un piétement en baguettes de bois clair."}, {"name": "Diamant", "photo": "diamant", "desc": "Plateau en bois clair sur un cadre en métal, avec un cône inversé en bois en dessous."}, {"name": "Gigi", "photo": "gigi", "desc": "Tables rondes sur piétement en lattes de bois, plateau en marbre ou en bois."}, {"name": "Edisson", "photo": "edisson", "desc": "Table basse en forme de bol en bois, avec son tabouret assorti (Ø 120 cm, hauteur 45 cm)."}, {"name": "Calice", "photo": "calice", "desc": "Table basse à plateau en forme de coupe, posée sur un pied conique (Ø 80 cm, hauteur 45 cm)."}], "table": [{"name": "Ava", "photo": "ava", "desc": "Table d'appoint carrée en sablier, associant bois et pierre foncée (50 × 50 cm, hauteur 80 cm)."}, {"name": "Bibo", "photo": "bibo", "desc": "Trio de tables rondes à plateau en bois ou en mosaïque de zellige, sur pied en bois massif."}, {"name": "Bijou", "photo": "bijou", "desc": "Table ronde à piétement en fil de laiton en sablier, plateau laqué."}, {"name": "Biz", "photo": "biz", "desc": "Table d'appoint ronde à plateau en bois et pied central en métal noir."}, {"name": "Chevet Cannelé", "photo": "chevetcannele", "desc": "Chevet en bois massif à fût cannelé et plateau en coupe."}, {"name": "Coco", "photo": "coco", "desc": "Tables d'appoint à fût conique en lattes de bois, plateau bordé de cannage ou en bois."}, {"name": "Échec", "photo": "echec", "desc": "Table d'appoint tournée en bois massif, aux volumes empilés comme un pion d'échecs."}]};
Object.keys(DMM_PHOTO_ITEMS3).forEach(function (c) { DMM_PHOTO_ITEMS[c] = DMM_PHOTO_ITEMS[c].concat(DMM_PHOTO_ITEMS3[c]); });
var DMM_PHOTOS3 = {"alfred": "/photos/alfred.jpg", "arbre": "/photos/arbre.jpg", "arc": "/photos/arc.jpg", "bobi": "/photos/bobi.jpg", "buki": "/photos/buki.jpg", "cannele": "/photos/cannele.jpg", "carron": "/photos/carron.jpg", "chacha": "/photos/chacha.jpg", "cid": "/photos/cid.jpg", "diamant": "/photos/diamant.jpg", "gigi": "/photos/gigi.jpg", "edisson": "/photos/edisson.jpg", "calice": "/photos/calice.jpg", "ava": "/photos/ava.jpg", "bibo": "/photos/bibo.jpg", "bijou": "/photos/bijou.jpg", "biz": "/photos/biz.jpg", "chevetcannele": "/photos/chevetcannele.jpg", "coco": "/photos/coco.jpg", "echec": "/photos/echec.jpg"};
Object.keys(DMM_PHOTOS3).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS3[k]; });
var DMM_PHOTO_ITEMS4 = {"fauteuil": [{"name": "Alphonse", "photo": "alphonse", "desc": "Fauteuil bas en cuir plissé, aux volumes généreux et enveloppants."}, {"name": "Aviateur", "photo": "aviateur", "desc": "Fauteuil aux accoudoirs en bois galbés, assise et dossier moelleux, sur pieds fuselés."}, {"name": "Erica", "photo": "erica", "desc": "Fauteuil à coque en lanières tressées, avec coussins d'assise et de dossier."}, {"name": "Balou", "photo": "balou", "desc": "Fauteuil enveloppant en laine bouclée ou en peau de mouton, sur pieds en bois (L 80 × P 75 × H 80 cm)."}, {"name": "Baseball", "photo": "baseball", "desc": "Fauteuil rond en cuir vieilli, clin d'œil à une balle de baseball."}, {"name": "Bloom", "photo": "bloom", "desc": "Fauteuil pivotant aux courbes arrondies, en tissu bouclé clair, sur socle."}, {"name": "Bob", "photo": "bob", "desc": "Large fauteuil aux lignes enveloppantes et au dossier haut (L 150 × P 95 × H 80 cm)."}, {"name": "Boudoir", "photo": "boudoir", "desc": "Fauteuil club aux accoudoirs carrés, tissu rouge profond, socle en bois."}, {"name": "Bowie", "photo": "bowie", "desc": "Petit fauteuil au dossier enveloppant, en tissu rouge."}, {"name": "Carlota", "photo": "carlota", "desc": "Fauteuil rond en tissu bouclé, avec accoudoirs en bois massif."}, {"name": "Cask", "photo": "cask", "desc": "Fauteuil à armature en bois à barreaux, assise et dossier en coussins moelleux."}, {"name": "Cigogne", "photo": "cigogne", "desc": "Fauteuil au dossier arrondi, tissu bouclé, pieds en bois en V."}, {"name": "Clavius", "photo": "clavius", "desc": "Fauteuil club au dossier cannelé, cadre en bois sombre, pieds fuselés."}, {"name": "Club", "photo": "club", "desc": "Fauteuil club aux accoudoirs arrondis, en bouclé clair ou en tissu bleu."}, {"name": "Cocktail", "photo": "cocktail", "desc": "Petit fauteuil cocktail au dossier galbé, tissu à carreaux, pieds fuselés."}, {"name": "Coolio", "photo": "coolio", "desc": "Fauteuil à structure en bois et sangles, avec de gros coussins moelleux."}, {"name": "Delphine", "photo": "delphine", "desc": "Fauteuil crapaud en tissu beige, dossier enveloppant, pieds en bois."}, {"name": "Doudou", "photo": "doudou", "desc": "Fauteuil pivotant en tissu bouclé blanc, formes rondes et enveloppantes."}, {"name": "Dumbo", "photo": "dumbo", "desc": "Fauteuil en velours vert, accoudoirs en cannage, pieds en bois évasés."}], "chaise": [{"name": "Dalida", "photo": "dalida", "desc": "Chaise basse en bois massif, piétement en traîneau, assise tapissée."}]};
Object.keys(DMM_PHOTO_ITEMS4).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS4[c]); });
var DMM_PHOTOS4 = {"alphonse": "/photos/alphonse.jpg", "aviateur": "/photos/aviateur.jpg", "erica": "/photos/erica.jpg", "balou": "/photos/balou.jpg", "baseball": "/photos/baseball.jpg", "bloom": "/photos/bloom.jpg", "bob": "/photos/bob.jpg", "boudoir": "/photos/boudoir.jpg", "bowie": "/photos/bowie.jpg", "carlota": "/photos/carlota.jpg", "cask": "/photos/cask.jpg", "cigogne": "/photos/cigogne.jpg", "clavius": "/photos/clavius.jpg", "club": "/photos/club.jpg", "cocktail": "/photos/cocktail.jpg", "coolio": "/photos/coolio.jpg", "delphine": "/photos/delphine.jpg", "doudou": "/photos/doudou.jpg", "dumbo": "/photos/dumbo.jpg", "dalida": "/photos/dalida.jpg"};
Object.keys(DMM_PHOTOS4).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS4[k]; });
var DMM_PHOTO_ITEMS5 = {"fauteuil": [{"name": "Eddy", "photo": "eddy", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Eloro", "photo": "eloro", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Emilie", "photo": "emilie", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Ercolani", "photo": "ercolani", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Falcon", "photo": "falcon", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Fly", "photo": "fly", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Ginette", "photo": "ginette", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Gray", "photo": "gray", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Hashtag", "photo": "hashtag", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Jane", "photo": "jane", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Lady", "photo": "lady", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Leny", "photo": "leny", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Louis 50", "photo": "louis50", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Mad chair", "photo": "madchair", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Mad Queen", "photo": "madqueen", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Mini Club", "photo": "miniclub", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Monroe", "photo": "monroe", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Mushroom", "photo": "mushroom", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Nounours", "photo": "nounours", "desc": "Sur mesure, bois et tissu au choix."}], "chaise": [{"name": "Lulu", "photo": "lulu", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS5).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS5[c]); });
var DMM_PHOTOS5 = {"eddy": "/photos/eddy.jpg", "eloro": "/photos/eloro.jpg", "emilie": "/photos/emilie.jpg", "ercolani": "/photos/ercolani.jpg", "falcon": "/photos/falcon.jpg", "fly": "/photos/fly.jpg", "ginette": "/photos/ginette.jpg", "gray": "/photos/gray.jpg", "hashtag": "/photos/hashtag.jpg", "jane": "/photos/jane.jpg", "lady": "/photos/lady.jpg", "leny": "/photos/leny.jpg", "louis50": "/photos/louis50.jpg", "madchair": "/photos/madchair.jpg", "madqueen": "/photos/madqueen.jpg", "miniclub": "/photos/miniclub.jpg", "monroe": "/photos/monroe.jpg", "mushroom": "/photos/mushroom.jpg", "nounours": "/photos/nounours.jpg", "lulu": "/photos/lulu.jpg"};
Object.keys(DMM_PHOTOS5).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS5[k]; });
var DMM_PHOTO_ITEMS6 = {"fauteuil": [{"name": "Nuvala", "photo": "nuvala", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Retro 30", "photo": "retro30", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Retro 70", "photo": "retro70", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Sally", "photo": "sally", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Santa Monica", "photo": "santamonica", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Siam", "photo": "siam", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Simon", "photo": "simon", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Spine", "photo": "spine", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Teddy", "photo": "teddy", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Trobo", "photo": "trobo", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Yul", "photo": "yul", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS6).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS6[c]); });
var DMM_PHOTOS6 = {"nuvala": "/photos/nuvala.jpg", "retro30": "/photos/retro30.jpg", "retro70": "/photos/retro70.jpg", "sally": "/photos/sally.jpg", "santamonica": "/photos/santamonica.jpg", "siam": "/photos/siam.jpg", "simon": "/photos/simon.jpg", "spine": "/photos/spine.jpg", "teddy": "/photos/teddy.jpg", "trobo": "/photos/trobo.jpg", "yul": "/photos/yul.jpg"};
Object.keys(DMM_PHOTOS6).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS6[k]; });
var DMM_PHOTO_ITEMS7 = {"chaisebar": [{"name": "Buddha", "photo": "buddha", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Lapo", "photo": "lapo", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Master Stark", "photo": "masterstark", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Sol y Luna", "photo": "solyluna", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Stanley", "photo": "stanley", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS7).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS7[c]); });
var DMM_PHOTOS7 = {"buddha": "/photos/buddha.jpg", "lapo": "/photos/lapo.jpg", "masterstark": "/photos/masterstark.jpg", "solyluna": "/photos/solyluna.jpg", "stanley": "/photos/stanley.jpg"};
Object.keys(DMM_PHOTOS7).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS7[k]; });
var DMM_PHOTO_ITEMS8 = {"chaise": [{"name": "Arman", "photo": "arman", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Bascule Gervasoni", "photo": "basculeg", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Bascule V2", "photo": "basculev2", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Calin", "photo": "calin", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Crapaud", "photo": "crapaud", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Fabricius & Kastholm", "photo": "fabricius", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Gobi", "photo": "gobi", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Kettal Bita", "photo": "kettal", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Luisa", "photo": "luisa", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Naboo", "photo": "naboo", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Navarro", "photo": "navarro", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Paris", "photo": "paris_ch", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Piloti", "photo": "piloti", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Poliform", "photo": "poliform", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS8).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS8[c]); });
var DMM_PHOTOS8 = {"arman": "/photos/arman.jpg", "basculeg": "/photos/basculeg.jpg", "basculev2": "/photos/basculev2.jpg", "calin": "/photos/calin.jpg", "crapaud": "/photos/crapaud.jpg", "fabricius": "/photos/fabricius.jpg", "gobi": "/photos/gobi.jpg", "kettal": "/photos/kettal.jpg", "luisa": "/photos/luisa.jpg", "naboo": "/photos/naboo.jpg", "navarro": "/photos/navarro.jpg", "paris_ch": "/photos/paris_ch.jpg", "piloti": "/photos/piloti.jpg", "poliform": "/photos/poliform.jpg"};
Object.keys(DMM_PHOTOS8).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS8[k]; });
var DMM_PHOTO_ITEMS9 = {"tablemanger": [{"name": "Art déco", "photo": "artdeco", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Bilboquet", "photo": "bilboquet", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Colette", "photo": "colette", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Domino", "photo": "domino", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Marylin", "photo": "marylin", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Mia", "photo": "mia", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Minerve", "photo": "minerve", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Pion d'échec", "photo": "pionechec", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Prouvé", "photo": "prouve", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Révolution", "photo": "revolution", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Spin", "photo": "spin", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Cayenne", "photo": "cayenne", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Zellige S.A.M", "photo": "zelligesam", "desc": "Sur mesure, bois et tissu au choix."}], "table": [{"name": "Bridge", "photo": "bridge", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS9).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS9[c]); });
var DMM_PHOTOS9 = {"artdeco": "/photos/artdeco.jpg", "bilboquet": "/photos/bilboquet.jpg", "colette": "/photos/colette.jpg", "domino": "/photos/domino.jpg", "marylin": "/photos/marylin.jpg", "mia": "/photos/mia.jpg", "minerve": "/photos/minerve.jpg", "pionechec": "/photos/pionechec.jpg", "prouve": "/photos/prouve.jpg", "revolution": "/photos/revolution.jpg", "spin": "/photos/spin.jpg", "cayenne": "/photos/cayenne.jpg", "zelligesam": "/photos/zelligesam.jpg", "bridge": "/photos/bridge.jpg"};
Object.keys(DMM_PHOTOS9).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS9[k]; });
var DMM_PHOTO_ITEMS10 = {"footstool": [{"name": "Cosi", "photo": "cosi", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Michelin", "photo": "michelin", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Paul", "photo": "paul", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "TV Drucker", "photo": "drucker", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS10).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS10[c]); });
var DMM_PHOTOS10 = {"cosi": "/photos/cosi.jpg", "michelin": "/photos/michelin.jpg", "paul": "/photos/paul.jpg", "drucker": "/photos/drucker.jpg"};
Object.keys(DMM_PHOTOS10).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS10[k]; });
var DMM_PHOTO_ITEMS11 = {"bureau": [{"name": "Fanfan", "photo": "fanfan", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Galet", "photo": "galet", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Galo", "photo": "galo", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Hydre", "photo": "hydre", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Notaire", "photo": "notaire", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Panama", "photo": "panama", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Scène de lin", "photo": "scene", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Zoé", "photo": "zoe", "desc": "Sur mesure, bois et tissu au choix."}], "coiffeuse": [{"name": "Rétro 30", "photo": "retro30_coiffeuse", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS11).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS11[c]); });
var DMM_PHOTOS11 = {"fanfan": "/photos/fanfan.jpg", "galet": "/photos/galet.jpg", "galo": "/photos/galo.jpg", "hydre": "/photos/hydre.jpg", "notaire": "/photos/notaire.jpg", "panama": "/photos/panama.jpg", "scene": "/photos/scene.jpg", "zoe": "/photos/zoe.jpg", "retro30_coiffeuse": "/photos/retro30_coiffeuse.jpg"};
Object.keys(DMM_PHOTOS11).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS11[k]; });
var DMM_PHOTO_ITEMS12 = {"footstool": [{"name": "Ceinture noyer", "photo": "ceinture", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Daisy", "photo": "daisy", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Laurel & Hardy", "photo": "laurel", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Léon", "photo": "leon", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Polotte", "photo": "polotte", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Tonneau métal", "photo": "tonneau_metal", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Tricot", "photo": "tricot", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS12).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS12[c]); });
var DMM_PHOTOS12 = {"ceinture": "/photos/ceinture.jpg", "daisy": "/photos/daisy.jpg", "laurel": "/photos/laurel.jpg", "leon": "/photos/leon.jpg", "polotte": "/photos/polotte.jpg", "tonneau_metal": "/photos/tonneau_metal.jpg", "tricot": "/photos/tricot.jpg"};
Object.keys(DMM_PHOTOS12).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS12[k]; });
var DMM_PHOTO_ITEMS13 = {"canape": [{"name": "Adèle", "photo": "cn_adele", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Arthur", "photo": "cn_arthur", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Austin", "photo": "cn_austin", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "B&B Erica", "photo": "cn_erica", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Bean", "photo": "cn_bean", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Bouli", "photo": "cn_bouli", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Bristol", "photo": "cn_bristol", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Cask", "photo": "cn_cask", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Claudia", "photo": "cn_claudia", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Club", "photo": "cn_club", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Cocpet", "photo": "cn_cocpet", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Colette", "photo": "cn_colette", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Cube", "photo": "cn_cube", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Eloro", "photo": "cn_eloro", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Ercolani", "photo": "cn_ercolani", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Floyd", "photo": "cn_floyd", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Fly", "photo": "cn_fly", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Gatsby", "photo": "cn_gatsby", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS13).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS13[c]); });
var DMM_PHOTOS13 = {"cn_adele": "/photos/cn_adele.jpg", "cn_arthur": "/photos/cn_arthur.jpg", "cn_austin": "/photos/cn_austin.jpg", "cn_erica": "/photos/cn_erica.jpg", "cn_bean": "/photos/cn_bean.jpg", "cn_bouli": "/photos/cn_bouli.jpg", "cn_bristol": "/photos/cn_bristol.jpg", "cn_cask": "/photos/cn_cask.jpg", "cn_claudia": "/photos/cn_claudia.jpg", "cn_club": "/photos/cn_club.jpg", "cn_cocpet": "/photos/cn_cocpet.jpg", "cn_colette": "/photos/cn_colette.jpg", "cn_cube": "/photos/cn_cube.jpg", "cn_eloro": "/photos/cn_eloro.jpg", "cn_ercolani": "/photos/cn_ercolani.jpg", "cn_floyd": "/photos/cn_floyd.jpg", "cn_fly": "/photos/cn_fly.jpg", "cn_gatsby": "/photos/cn_gatsby.jpg"};
Object.keys(DMM_PHOTOS13).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS13[k]; });
var DMM_PHOTO_ITEMS14 = {"canape": [{"name": "Hamper", "photo": "cn_hamper", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "John", "photo": "cn_john", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "JR", "photo": "cn_jr", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Kelly", "photo": "cn_kelly", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Kettal Vemini", "photo": "cn_kettalv", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Knoll", "photo": "cn_knoll", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "La Mise", "photo": "cn_lamise", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Linda", "photo": "cn_linda", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Lomou", "photo": "cn_lomou", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "London", "photo": "cn_london", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Lucian", "photo": "cn_lucian", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Mexcube", "photo": "cn_mexcube", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Miloe", "photo": "cn_miloe", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Mondrian", "photo": "cn_mondrian", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Nest", "photo": "cn_nest", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Nuvala Navone", "photo": "cn_nuvala", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Picadilly", "photo": "cn_picadilly", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Piko", "photo": "cn_piko", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS14).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS14[c]); });
var DMM_PHOTOS14 = {"cn_hamper": "/photos/cn_hamper.jpg", "cn_john": "/photos/cn_john.jpg", "cn_jr": "/photos/cn_jr.jpg", "cn_kelly": "/photos/cn_kelly.jpg", "cn_kettalv": "/photos/cn_kettalv.jpg", "cn_knoll": "/photos/cn_knoll.jpg", "cn_lamise": "/photos/cn_lamise.jpg", "cn_linda": "/photos/cn_linda.jpg", "cn_lomou": "/photos/cn_lomou.jpg", "cn_london": "/photos/cn_london.jpg", "cn_lucian": "/photos/cn_lucian.jpg", "cn_mexcube": "/photos/cn_mexcube.jpg", "cn_miloe": "/photos/cn_miloe.jpg", "cn_mondrian": "/photos/cn_mondrian.jpg", "cn_nest": "/photos/cn_nest.jpg", "cn_nuvala": "/photos/cn_nuvala.jpg", "cn_picadilly": "/photos/cn_picadilly.jpg", "cn_piko": "/photos/cn_piko.jpg"};
Object.keys(DMM_PHOTOS14).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS14[k]; });
var DMM_PHOTO_ITEMS15 = {"canape": [{"name": "Pinto", "photo": "cn_pinto", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Saint Germain", "photo": "cn_stgermain", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Sophie", "photo": "cn_sophie", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Tribeca", "photo": "cn_tribeca", "desc": "Sur mesure, bois et tissu au choix."}, {"name": "Troki", "photo": "cn_troki", "desc": "Sur mesure, bois et tissu au choix."}]};
Object.keys(DMM_PHOTO_ITEMS15).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS15[c]); });
var DMM_PHOTOS15 = {"cn_pinto": "/photos/cn_pinto.jpg", "cn_stgermain": "/photos/cn_stgermain.jpg", "cn_sophie": "/photos/cn_sophie.jpg", "cn_tribeca": "/photos/cn_tribeca.jpg", "cn_troki": "/photos/cn_troki.jpg"};
Object.keys(DMM_PHOTOS15).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS15[k]; });
var DMM_PHOTO_ITEMS16 = {"tetelit": [{"name": "Amara", "photo": "th_amara", "desc": "Lin beige capitonné à boutons, dossier galbé.", "cover": true}, {"name": "Soren", "photo": "th_soren", "desc": "Chêne massif aux lignes droites, finition naturelle.", "cover": true}, {"name": "Soren flottante", "photo": "th_soren2", "desc": "Chêne suspendu au mur, avec éclairage LED intégré.", "cover": true}, {"name": "Elara", "photo": "th_elara", "desc": "Velours bleu royal et cadre en laiton, motif en éventail.", "cover": true}, {"name": "Mira", "photo": "th_mira", "desc": "Rotin naturel et bois clair, forme arrondie.", "cover": true}, {"name": "Émeraude", "photo": "th_emeraude", "desc": "Panneaux verticaux en velours vert, du sol au plafond.", "cover": true}, {"name": "Loft", "photo": "th_loft", "desc": "Panneaux gris anthracite et cadre en laiton, esprit loft.", "cover": true}]};
Object.keys(DMM_PHOTO_ITEMS16).forEach(function (c) { DMM_PHOTO_ITEMS[c] = (DMM_PHOTO_ITEMS[c] || []).concat(DMM_PHOTO_ITEMS16[c]); });
var DMM_PHOTOS16 = {"th_amara": "/photos/th_amara.jpg", "th_soren": "/photos/th_soren.jpg", "th_soren2": "/photos/th_soren2.jpg", "th_elara": "/photos/th_elara.jpg", "th_mira": "/photos/th_mira.jpg", "th_emeraude": "/photos/th_emeraude.jpg", "th_loft": "/photos/th_loft.jpg"};
Object.keys(DMM_PHOTOS16).forEach(function (k) { DMM_PHOTOS[k] = DMM_PHOTOS16[k]; });

















(function () {
  var modal = document.getElementById("models-modal");
  var grid = document.getElementById("mm-grid");
  var input = document.getElementById("mm-search");
  var countEl = document.getElementById("mm-count");
  var emptyEl = document.getElementById("mm-empty");
  var favBtn = document.getElementById("mm-fav-btn");
  var favCountEl = document.getElementById("mm-fav-count");
  var customBtn = document.getElementById("mm-custom");
  var lb = document.getElementById("lightbox");
  var cur = null, onlyFavs = false;
  var KEY = "dmmdeco_favoris_mobilier";
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function getFavs() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function setFavs(l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} }
  function favId(name) { return cur.piece + " " + name; }
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4.5 5.5 4c2-.3 3.8.7 6.5 3.3C14.7 4.7 16.5 3.7 18.5 4c3.5.5 5.1 4 3.5 7.7C19.5 16.4 12 21 12 21z"/></svg>';

  function build() {
    var favs = getFavs();
    grid.innerHTML = cur.items.map(function (it, i) {
      var w = it.photo ? null : DMM.WOODS[it.wood], f = (it.photo || !it.fab) ? null : DMM.FAB[it.fab];
      var fav = favs.indexOf(favId(it.name)) !== -1;
      var hay = (it.name + " " + it.desc + " " + (it.photo ? "" : DMM.WOODN[it.wood]) + " " + (f ? f.n : "")).toLowerCase();
      return '<article class="model' + (fav ? " is-fav" : "") + '" data-i="' + i + '" data-hay="' + esc(hay) + '">' +
        '<figure class="shot art' + (it.photo ? " photo" : "") + (it.cover ? " cover" : "") + '"><img loading="lazy" alt="' + esc(cur.piece + " " + it.name) + '" src="' + (it.photo ? DMM_PHOTOS[it.photo] : DMM.dataUri(DMM.svgFor(cur.key, it.ci))) + '">' + (it.photo ? "" : '<span class="illu-tag">Illustration</span>') +
        '<button type="button" class="fav-btn' + (fav ? " active" : "") + '" aria-pressed="' + fav + '" aria-label="' + (fav ? "Retirer " : "Ajouter ") + esc(it.name) + ' de mes favoris">' + HEART + '</button></figure>' +
        '<div class="cap"><h3>' + esc(it.name) + '</h3><p>' + esc(it.desc) + '</p>' +
        (it.photo ? "" : '<div class="combo"><span class="chip-s"><i style="background:' + w + '"></i>' + esc(DMM.WOODN[it.wood]) + '</span>' + (f ? '<span class="chip-s"><i style="background:' + f.c + '"></i>' + esc(f.n) + '</span>' : '') + '</div>') +
        '<div class="row"><span class="price">Sur devis</span><button type="button" class="btn ghost small" data-piece="' + esc(cur.piece) + '" data-model="' + esc(it.name) + '">Demander un devis</button></div><a class="wa-model" target="_blank" rel="noopener" href="https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent('Bonjour, je souhaite un devis pour : ' + cur.piece + ' ' + it.name + '.\nDimensions souhaitées : \nBois / tissu : ') + '">Devis rapide sur WhatsApp</a></div></article>';
    }).join("");
  }
  function render() {
    var q = input.value.trim().toLowerCase(), shown = 0;
    Array.prototype.forEach.call(grid.children, function (c) {
      var ok = (!q || c.getAttribute("data-hay").indexOf(q) !== -1) && (!onlyFavs || c.classList.contains("is-fav"));
      c.classList.toggle("hide", !ok);
      if (ok) shown++;
    });
    var tot = cur.items.length;
    countEl.textContent = q ? (shown + " modèle" + (shown > 1 ? "s" : "") + " sur " + tot) : (tot + " modèles à découvrir");
    emptyEl.classList.toggle("show", shown === 0);
  }
  function favCount() {
    var n = getFavs().filter(function (x) { return x.indexOf(cur.piece + " ") === 0; }).length;
    favCountEl.textContent = n; favCountEl.hidden = n === 0;
  }
  window.openModels = function (key) {
    var c = DMM.CATALOG[key]; if (!c) return;
    var ph = (DMM_PHOTO_ITEMS[key] || []).map(function (p) { return { name: p.name, desc: p.desc, photo: p.photo, cover: p.cover }; });
    var il = DMM_REPLACE[key] ? [] : c.items.map(function (it, ci) { it.ci = ci; return it; });
    cur = { key: key, piece: c.piece, items: ph.concat(il) };
    document.getElementById("mm-title").textContent = c.title;
    document.getElementById("mm-intro").textContent = c.intro;
    input.placeholder = c.search;
    input.setAttribute("aria-label", "Rechercher parmi les modèles");
    customBtn.setAttribute("data-piece", c.piece);
    customBtn.removeAttribute("data-model");
    input.value = ""; onlyFavs = false; favBtn.setAttribute("aria-pressed", "false");
    build(); render(); favCount();
    var hasIl = cur.items.some(function (x) { return !x.photo; });
    document.getElementById("mm-note").style.display = hasIl ? "" : "none";
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-box").scrollTop = 0; modal.scrollTop = 0;
    setTimeout(function () { input.focus(); }, 50);
  };
  window.closeModelsModal = function () {
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  input.addEventListener("input", render);
  favBtn.addEventListener("click", function () {
    onlyFavs = !onlyFavs; favBtn.setAttribute("aria-pressed", onlyFavs ? "true" : "false"); render();
  });
  modal.addEventListener("click", function (e) {
    if (e.target === modal) { closeModelsModal(); return; }
    var fb = e.target.closest(".fav-btn");
    if (fb) {
      e.stopPropagation();
      var card = fb.closest(".model"), name = cur.items[+card.getAttribute("data-i")].name, id = favId(name);
      var l = getFavs(), ix = l.indexOf(id), now = ix === -1;
      if (now) l.push(id); else l.splice(ix, 1);
      setFavs(l);
      fb.classList.toggle("active", now); fb.setAttribute("aria-pressed", now ? "true" : "false");
      card.classList.toggle("is-fav", now);
      favCount(); render(); return;
    }
    var pb = e.target.closest("[data-piece]");
    if (pb) { window.dmmPickModel(pb.getAttribute("data-piece"), pb.getAttribute("data-model") || ""); return; }
    var shot = e.target.closest(".shot");
    if (shot) {
      var img = shot.querySelector("img"), nm = shot.closest(".model").querySelector("h3").textContent;
      var li = document.getElementById("lightbox-img");
      li.setAttribute("src", img.getAttribute("src")); li.setAttribute("alt", nm);
      document.getElementById("lightbox-caption").textContent = cur.piece + " " + nm;
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    }
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open") && !lb.classList.contains("open")) closeModelsModal();
  }, true);

  var MAP = { "Fauteuil":"fauteuil","Chaise":"chaise","Chaise de bar":"chaisebar","Table":"table","Table à manger":"tablemanger","Table basse":"tablebasse","Bureau":"bureau","Coiffeuse":"coiffeuse","Canapé":"canape","Tête de lit":"tetelit","Tête de lit":"tetelit","Footstool":"footstool" };
  Object.keys(MAP).forEach(function (piece) {
    var key = MAP[piece];
    document.querySelectorAll('.piece [data-cat="' + key + '"]').forEach(function (b) {
      b.addEventListener("click", function () { openModels(key); });
    });
  });
})();

;

(function () {
  var LAB = {fauteuil:"Fauteuil",chaise:"Chaise",chaisebar:"Chaise de bar",table:"Table",tablemanger:"Table à manger",tablebasse:"Table basse",bureau:"Bureau",coiffeuse:"Coiffeuse",footstool:"Footstool",canape:"Canapé",tetelit:"Tête de lit"};
  var ITEMS = window.DMM_PHOTO_ITEMS || {}, PH = window.DMM_PHOTOS || {};
  function find(cat, name) {
    var l = ITEMS[cat] || [];
    for (var i = 0; i < l.length; i++) { if (l[i].name === name && PH[l[i].photo]) return l[i]; }
    for (var j = 0; j < l.length; j++) { if (PH[l[j].photo]) return l[j]; }
    return null;
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  var total = 0; Object.keys(ITEMS).forEach(function (c) { total += ITEMS[c].length; });
  var cg = document.querySelectorAll("#models-grid .model").length; total += cg;
  var st = document.getElementById("st-models"); if (st && total) { st.textContent = (Math.floor(total / 10) * 10) + "+"; }

  /* sélection */
  var PICKS = [["fauteuil","Lady"],["tablemanger","Révolution"],["chaise","Gobi"],["fauteuil","Mad Queen"],["footstool","Laurel & Hardy"],["bureau","Notaire"],["chaisebar","Sol y Luna"],["tablebasse","Zoulou"],["fauteuil","Mushroom"],["table","Zellige Yoda"],["chaise","Luisa"],["fauteuil","Yul"]];
  var picks = PICKS.map(function (p) { var it = find(p[0], p[1]); return it && it.name === p[1] ? {cat:p[0], it:it} : null; }).filter(Boolean);

  /* hero */
  var frame = document.getElementById("sc-frame"), dots = document.getElementById("sc-dots"), cap = document.getElementById("sc-cap");
  if (frame && picks.length) {
    var hs = picks.slice(0, 8), cur = 0, timer = null;
    hs.forEach(function (p, i) {
      var im = document.createElement("img"); im.className = "slide" + (i === 0 ? " on" : ""); im.src = PH[p.it.photo]; im.alt = p.it.name + ", " + LAB[p.cat].toLowerCase() + " sur mesure"; frame.appendChild(im);
      var d = document.createElement("button"); d.type = "button"; d.setAttribute("aria-label", p.it.name); if (i === 0) d.className = "on";
      d.addEventListener("click", function () { show(i); restart(); }); dots.appendChild(d);
    });
    function show(i) {
      cur = i; var sl = frame.querySelectorAll(".slide"), ds = dots.querySelectorAll("button");
      sl.forEach(function (e, k) { e.classList.toggle("on", k === i); }); ds.forEach(function (e, k) { e.classList.toggle("on", k === i); });
      cap.innerHTML = "<strong>" + esc(hs[i].it.name) + "</strong> · " + LAB[hs[i].cat] + ". Prix sur devis.";
    }
    function restart() { clearInterval(timer); if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(function () { show((cur + 1) % hs.length); }, 4500); }
    show(0); restart();
    document.getElementById("showcase").addEventListener("mouseenter", function () { clearInterval(timer); });
    document.getElementById("showcase").addEventListener("mouseleave", restart);
  }

  var box = document.getElementById("picks");
  if (box) {
    picks.forEach(function (p) {
      var a = document.createElement("article"); a.className = "pick";
      a.innerHTML = '<div class="ph"><img src="' + PH[p.it.photo] + '" alt="' + esc(p.it.name) + '" loading="lazy"></div><div class="cap"><small>' + LAB[p.cat] + '</small><h3>' + esc(p.it.name) + '</h3><button type="button" class="btn ghost small">Demander ce modèle</button></div>';
      a.querySelector("button").addEventListener("click", function () { if (window.dmmPickModel) window.dmmPickModel(LAB[p.cat], p.it.name); });
      box.appendChild(a);
    });
    function by(dir) { box.scrollBy({left: dir * (box.clientWidth * .8), behavior: "smooth"}); }
    document.getElementById("picks-prev").onclick = function () { by(-1); };
    document.getElementById("picks-next").onclick = function () { by(1); };
  }

  /* couvertures des cartes collections */
  var COV = {fauteuil:"Lady", chaise:"Gobi", chaisebar:"Sol y Luna", table:"Yoyo", tablemanger:"Révolution", tablebasse:"Zoulou", bureau:"Notaire", coiffeuse:"Rétro 30", footstool:"Léon", canape:"Cask", tetelit:"Elara"};
  document.querySelectorAll(".piece button[data-cat]").forEach(function (b) {
    var cat = b.getAttribute("data-cat"), it = find(cat, COV[cat]); if (!it) return;
    var art = b.closest(".piece").querySelector(".art"); if (!art) return;
    art.classList.add("ph"); art.innerHTML = '<img src="' + PH[it.photo] + '" alt="' + esc(it.name) + '" loading="lazy">';
  });
  var cb = document.querySelector('.piece button[onclick*="openCanapesModal"]'), c1 = document.querySelector("#models-grid .model img");
  if (cb && c1) { var ca = cb.closest(".piece").querySelector(".art"); ca.classList.add("ph"); ca.innerHTML = '<img class="cover" src="' + c1.src + '" alt="Canapé sur mesure" loading="lazy">'; }

  /* recherche globale */
  var gi = document.getElementById("gs-input"), gr = document.getElementById("gs-results");
  if (gi && gr) {
    function norm(t) { return String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    var all = []; Object.keys(ITEMS).forEach(function (c) { ITEMS[c].forEach(function (it) { if (PH[it.photo]) all.push({cat:c, it:it, n:norm(it.name)}); }); });
    gi.addEventListener("input", function () {
      var q = norm(gi.value.trim()); if (q.length < 2) { gr.hidden = true; return; }
      var r = all.filter(function (x) { return x.n.indexOf(q) !== -1 || norm(LAB[x.cat]).indexOf(q) !== -1; }).slice(0, 14);
      gr.innerHTML = r.length ? r.map(function (x, i) { return '<button type="button" data-i="' + i + '"><img src="' + PH[x.it.photo] + '" alt=""><span><b>' + esc(x.it.name) + '</b><small>' + LAB[x.cat] + '</small></span></button>'; }).join("") : '<p class="none">Aucun modèle trouvé. Décrivez-nous votre idée, nous la fabriquons sur mesure.</p>';
      gr.hidden = false;
      gr.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () {
        var x = r[+b.getAttribute("data-i")]; gr.hidden = true;
        if (window.openModels) { openModels(x.cat); setTimeout(function () { var m = document.getElementById("mm-search"); if (m) { m.value = x.it.name; m.dispatchEvent(new Event("input", {bubbles:true})); } }, 60); }
      }); });
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".gsearch")) gr.hidden = true; });
    gi.addEventListener("keydown", function (e) { if (e.key === "Escape") { gr.hidden = true; } });
  }
  var io2 = ("IntersectionObserver" in window) ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io2.unobserve(e.target); } }); }, {threshold: .1}) : null;
  document.querySelectorAll(".pick").forEach(function (t) { if (io2) { t.classList.add("reveal"); io2.observe(t); } });
})();
