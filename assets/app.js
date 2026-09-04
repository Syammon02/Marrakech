import { HOTEL, CATEGORIES, POIS, WIKI } from "./data.js";

/* =====================================================================
   Utilitaires
   ===================================================================== */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const R_TERRE = 6371;
function distanceKm(a, b) {
  const rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_TERRE * Math.asin(Math.sqrt(h));
}

/* Estimation taxi depuis l'hôtel.
   Base : petit taxi marrakchi négocié, ~11 MAD du kilomètre routier (prix négocié, pas au compteur),
   minimum de course 40 MAD, tarif de nuit (21 h - 6 h) majoré de 50 %.
   Un POI peut fournir un override (grand taxi, excursion, transfert inclus). */
const TARIF_KM = 11, MINI = 40, SINUOSITE = 1.35, VITESSE = 21;

function round5(n) { return Math.max(5, Math.round(n / 5) * 5); }

function taxiInfo(poi) {
  const volOiseau = distanceKm(HOTEL, poi);
  const km = volOiseau * SINUOSITE;
  const minutes = Math.max(4, Math.round(km / VITESSE * 60));
  if (poi.taxi) {
    return { km, minutes, ...poi.taxi, forfait: true,
             jourTxt: poi.taxi.jour === 0 ? "Inclus" : `~${poi.taxi.jour} MAD`,
             nuitTxt: poi.taxi.nuit ? `~${poi.taxi.nuit} MAD` : "—" };
  }
  const base = Math.max(MINI, km * TARIF_KM);
  const jour = round5(base);
  const nuit = round5(base * 1.5);
  return {
    km, minutes, jour, nuit, forfait: false,
    jourTxt: `${round5(jour * .85)}-${round5(jour * 1.2)} MAD`,
    nuitTxt: `${round5(nuit * .85)}-${round5(nuit * 1.2)} MAD`,
    note: km < 1.6
      ? "Moins de 2 km : la marche est plus rapide qu'un taxi coincé dans la circulation."
      : "Petit taxi, prix négocié avant de monter. Exigez le compteur si le chauffeur l'accepte, c'est presque toujours moins cher."
  };
}

const fmtPrix = n => n ? "€".repeat(n) : "Gratuit";

/* =====================================================================
   Visuels : motif zellige généré (toujours disponible, même hors ligne)
   + photo Wikimedia superposée quand le réseau le permet.
   ===================================================================== */
function motif(poi) {
  const c = CATEGORIES[poi.cat].color;
  const seed = [...poi.id].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const rot = seed % 45;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#241611"/>
      </linearGradient>
      <pattern id="p" width="46" height="46" patternUnits="userSpaceOnUse"
               patternTransform="rotate(${rot})">
        <rect width="46" height="46" fill="none"/>
        <path d="M23 3 L29 17 L43 23 L29 29 L23 43 L17 29 L3 23 L17 17 Z"
              fill="none" stroke="#F6EDDF" stroke-width="1.1" opacity=".38"/>
        <circle cx="23" cy="23" r="3.4" fill="#F6EDDF" opacity=".22"/>
      </pattern>
    </defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <rect width="400" height="300" fill="url(#p)"/>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const PHOTO_CACHE = "mrk.photos.v1";
const MAX_PARALLELE = 4;
let enVol = 0;
const file = [];
function planifier(tache) {
  file.push(tache);
  videFile();
}
function videFile() {
  while (enVol < MAX_PARALLELE && file.length) {
    enVol++;
    file.shift()().finally(() => { enVol--; videFile(); });
  }
}
let photos = {};
try { photos = JSON.parse(localStorage.getItem(PHOTO_CACHE) || "{}"); } catch {}
const enCours = new Set();

function savePhotos() {
  try { localStorage.setItem(PHOTO_CACHE, JSON.stringify(photos)); } catch {}
}

/* Renvoie l'URL photo si connue, sinon la cherche et rappelle le callback. */
function photoDe(poi, cb) {
  const slug = WIKI[poi.id];
  if (!slug) return null;
  if (photos[poi.id] !== undefined) return photos[poi.id] || null;
  if (enCours.has(poi.id) || !navigator.onLine) return null;
  enCours.add(poi.id);
  planifier(() =>
    fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}?origin=*`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const src = d && (d.originalimage?.source || d.thumbnail?.source);
        photos[poi.id] = src ? src.replace(/\/\d+px-/, "/800px-") : "";
        savePhotos();
        if (photos[poi.id] && cb) cb(photos[poi.id]);
      })
      .catch(() => {})
      .finally(() => enCours.delete(poi.id)));
  return null;
}

/* Applique une image à un <img> : motif immédiat, photo en fondu si trouvée. */
function charge(el, u) {
  const test = new Image();
  test.onload = () => { el.src = u; };
  test.src = u;
}

const observateur = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        observateur.unobserve(e.target);
        const poi = parId[e.target.dataset.poi];
        if (!poi) return;
        const url = photoDe(poi, u => charge(e.target, u));
        if (url) charge(e.target, url);
      });
    }, { rootMargin: "300px" })
  : null;

/* Motif zellige tout de suite, photo réelle en fondu quand la vignette approche
   du champ de vision. On ne déclenche jamais 65 requêtes d'un coup. */
function peupleImage(img, poi, immediat = false) {
  img.src = motif(poi);
  img.classList.add("ok");
  img.dataset.poi = poi.id;
  const connue = photos[poi.id];
  if (connue) return charge(img, connue);
  if (immediat || !observateur) {
    const url = photoDe(poi, u => charge(img, u));
    if (url) charge(img, url);
  } else observateur.observe(img);
}

/* =====================================================================
   État
   ===================================================================== */
const FAV_KEY = "mrk.wishlist.v1";
let favoris = new Set();
try { favoris = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); } catch {}
const sauveFav = () => localStorage.setItem(FAV_KEY, JSON.stringify([...favoris]));

const etat = {
  cat: "tous",
  q: "",
  tri: "distance",     // distance | note
  wishlist: false,
  actif: null,
  origine: "hotel",    // hotel | moi
  maPosition: null
};

const enrichis = POIS.map(p => ({ ...p, _taxi: taxiInfo(p), _dist: distanceKm(HOTEL, p) }));
const parId = Object.fromEntries(enrichis.map(p => [p.id, p]));

/* =====================================================================
   Carte
   ===================================================================== */
let map, marqueurs = {}, moiMarker = null;
const carteDispo = typeof L !== "undefined";

/* Si le CDN Leaflet ne répond pas (réseau marocain capricieux, mode avion),
   l'app doit rester utilisable : on affiche un repli et la liste continue de vivre. */
function replisCarte() {
  const el = document.getElementById("map");
  el.innerHTML = `<div style="height:100%;display:grid;place-items:center;text-align:center;
      padding:24px;color:#7A6A5D;font-size:14px;line-height:1.6">
      <div><div style="font-size:30px">🗺️</div>
      La carte n'a pas pu se charger.<br>Les fiches, les prix de taxi et le guidage
      fonctionnent normalement.</div></div>`;
}

function initCarte() {
  if (!carteDispo) return replisCarte();
  map = L.map("map", { zoomControl: false, attributionControl: true })
         .setView([HOTEL.lat, HOTEL.lng], 13);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  L.marker([HOTEL.lat, HOTEL.lng], {
    zIndexOffset: 1000,
    icon: L.divIcon({ className: "", html: `<div class="pin-hotel">🏨</div>`,
                      iconSize: [40, 40], iconAnchor: [20, 20] })
  }).addTo(map).bindPopup(`<b>${HOTEL.name}</b><br><span style="color:#7A6A5D">${HOTEL.address}</span><br><small>Point de départ de tous les tarifs taxi</small>`);

  enrichis.forEach(p => {
    const m = L.marker([p.lat, p.lng], {
      icon: iconePoi(p),
      title: p.nom
    }).addTo(map);
    m.on("click", () => ouvrirDetail(p.id, false));
    marqueurs[p.id] = m;
  });
}

function iconePoi(p) {
  const c = CATEGORIES[p.cat].color;
  const fav = favoris.has(p.id) ? " fav" : "";
  return L.divIcon({
    className: "pin-wrap" + (etat.actif === p.id ? " actif" : ""),
    html: `<div class="pin${fav}" style="background:${c}"><span>${CATEGORIES[p.cat].icon}</span></div>`,
    iconSize: [34, 34], iconAnchor: [17, 32], popupAnchor: [0, -30]
  });
}

function rafraichirMarqueur(id) {
  if (!carteDispo) return;
  const m = marqueurs[id];
  if (m) m.setIcon(iconePoi(parId[id]));
}

function majVisibilite() {
  if (!carteDispo) return;
  const visibles = new Set(filtrer().map(p => p.id));
  enrichis.forEach(p => {
    const m = marqueurs[p.id];
    if (!m) return;
    const el = m.getElement();
    if (el) el.style.display = visibles.has(p.id) ? "" : "none";
  });
}

/* =====================================================================
   Filtrage et rendu de la liste
   ===================================================================== */
function filtrer() {
  const q = etat.q.trim().toLowerCase();
  return enrichis
    .filter(p => !etat.wishlist || favoris.has(p.id))
    .filter(p => etat.wishlist || etat.cat === "tous" || p.cat === etat.cat)
    .filter(p => !q || (p.nom + " " + p.desc + " " + CATEGORIES[p.cat].label).toLowerCase().includes(q))
    .sort((a, b) => etat.tri === "note" ? b.note - a.note : a._dist - b._dist);
}

function carteHTML(p) {
  const t = p._taxi;
  return `
    <button class="card${etat.actif === p.id ? " actif" : ""}" data-id="${p.id}">
      <div class="thumb"><img alt="" loading="lazy" data-poi="${p.id}"></div>
      <div class="card-body">
        <h3>${p.nom}</h3>
        <div class="meta">
          <span class="note"><b>★</b> ${p.note.toFixed(1)}</span>
          <span>·</span><span>${p.avis} avis</span>
          <span>·</span><span>${fmtPrix(p.prix)}</span>
        </div>
        <div class="meta">
          <span class="tag">${CATEGORIES[p.cat].icon} ${CATEGORIES[p.cat].label}</span>
          <span class="taxi-badge">🚕 ${t.forfait && t.jour === 0 ? "inclus" : t.jourTxt.replace(" MAD", "")} <span style="opacity:.7;font-weight:600">MAD</span></span>
        </div>
      </div>
      <span class="fav${favoris.has(p.id) ? " on" : ""}" data-fav="${p.id}" role="button"
            aria-label="Ajouter à la wishlist">${favoris.has(p.id) ? "♥" : "♡"}</span>
    </button>`;
}

function rendreListe() {
  const res = filtrer();
  const liste = $("#liste");
  if (!res.length) {
    liste.innerHTML = etat.wishlist
      ? `<div class="vide"><span class="e">♡</span>Votre wishlist est vide.<br>Touchez le cœur sur une adresse pour la garder de côté et voir le budget taxi de la semaine.</div>`
      : `<div class="vide"><span class="e">🔍</span>Rien ne correspond.<br>Essayez un autre mot ou changez de catégorie.</div>`;
  } else {
    liste.innerHTML = res.map(carteHTML).join("");
    $$("#liste img[data-poi]").forEach(img => peupleImage(img, parId[img.dataset.poi]));
  }

  $("#compte").textContent = res.length + (res.length > 1 ? " adresses" : " adresse");
  $("#titre-liste").textContent = etat.wishlist
    ? "Ma wishlist"
    : etat.cat === "tous" ? "Tout Marrakech" : CATEGORIES[etat.cat].label;

  // budget taxi cumulé de la wishlist
  const budget = $("#budget");
  if (etat.wishlist && res.length) {
    const total = res.reduce((s, p) => s + (p._taxi.forfait ? p._taxi.jour : p._taxi.jour), 0);
    budget.hidden = false;
    budget.textContent = `Budget taxi aller simple, tout compris : ~${Math.round(total / 10) * 10} MAD (~${Math.round(total / 11)} €)`;
  } else budget.hidden = true;
  $("#wl-actions").hidden = !(etat.wishlist && res.length);

  majVisibilite();
  majCompteurFav();
}

function majCompteurFav() {
  const c = $("#fav-count");
  c.textContent = favoris.size;
  c.hidden = favoris.size === 0;
}

function basculeFav(id) {
  if (favoris.has(id)) { favoris.delete(id); toast("Retiré de la wishlist"); }
  else { favoris.add(id); toast("Ajouté à la wishlist ♥"); }
  sauveFav();
  rafraichirMarqueur(id);
  rendreListe();
  const d = $("#d-fav");
  if (etat.actif === id && d) {
    d.classList.toggle("on", favoris.has(id));
    d.textContent = favoris.has(id) ? "♥" : "♡";
  }
}

/* =====================================================================
   Fiche détail
   ===================================================================== */
function ouvrirDetail(id, recentre = true) {
  const p = parId[id];
  if (!p) return;
  const ancien = etat.actif;
  etat.actif = id;
  if (ancien) rafraichirMarqueur(ancien);
  rafraichirMarqueur(id);

  const t = p._taxi;
  const marche = t.km < 1.6;

  $("#detail").innerHTML = `
    <div class="detail-scroll">
      <div class="hero">
        <img id="d-hero" alt="${p.nom}">
        <div class="hero-top">
          <button class="icon-btn" id="d-close" aria-label="Fermer">✕</button>
          <span style="flex:1"></span>
          <button class="icon-btn" id="d-share" aria-label="Partager">↗</button>
        </div>
        <div class="hero-txt">
          <div class="kicker">${CATEGORIES[p.cat].icon} ${CATEGORIES[p.cat].label}</div>
          <h2>${p.nom}</h2>
          <div class="meta">
            <span class="note"><b>★</b> ${p.note.toFixed(1)}</span>
            <span>${p.avis} avis</span><span>·</span>
            <span>${fmtPrix(p.prix)}</span>
          </div>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><div class="k">Durée</div><div class="v">${p.duree}</div></div>
        <div class="stat"><div class="k">Distance</div><div class="v">${t.km.toFixed(1)} km</div></div>
        <div class="stat"><div class="k">Trajet</div><div class="v">${t.minutes} min</div></div>
      </div>

      <div class="taxi-card">
        <div class="hd">🚕 Taxi depuis le Riu Tikida Garden</div>
        <div class="taxi-grid">
          <div><div class="k">Journée</div><div class="v">${t.jourTxt}</div></div>
          <div><div class="k">Après 21 h</div><div class="v">${t.nuitTxt}</div></div>
        </div>
        <div class="taxi-note">${t.note || ""}${marche ? "" : ""}</div>
      </div>

      <div class="section">
        <h4>L'endroit</h4>
        <p>${p.desc}</p>
      </div>

      <div class="section">
        <h4>Bon à savoir</h4>
        <ul class="tips">${p.tips.map(x => `<li>${x}</li>`).join("")}</ul>
      </div>

      <div class="section">
        <h4>Pratique</h4>
        <p style="font-size:14px">
          <b>Horaires :</b> ${p.horaires}<br>
          <b>Réservation :</b> ${p.reserver ? "recommandée, voire indispensable" : "pas nécessaire"}<br>
          <b>Coordonnées :</b> ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}
        </p>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary" id="d-go">🧭 <span>Lancer le guidage</span></button>
      <button class="btn btn-ghost${favoris.has(p.id) ? " on" : ""}" id="d-fav"
              aria-label="Wishlist">${favoris.has(p.id) ? "♥" : "♡"}</button>
      <button class="btn btn-ghost" id="d-map" aria-label="Voir sur la carte">📍</button>
    </div>`;

  peupleImage($("#d-hero"), p, true);
  $("#detail").classList.add("open");
  document.body.style.overflow = "hidden";

  $("#d-close").onclick = fermerDetail;
  $("#d-fav").onclick = () => basculeFav(p.id);
  $("#d-go").onclick = () => ouvrirGuidage(p);
  $("#d-map").onclick = () => { fermerDetail(); carteDispo && map.flyTo([p.lat, p.lng], 16, { duration: .8 }); };
  $("#d-share").onclick = () => partager(p);

  if (!carteDispo) {} else if (recentre) map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 15), { duration: .8 });
  else if (carteDispo) map.panTo([p.lat, p.lng], { animate: true });

  history.replaceState(null, "", "#" + p.id);
  rendreListe();
}

function fermerDetail() {
  $("#detail").classList.remove("open");
  document.body.style.overflow = "";
  const a = etat.actif; etat.actif = null;
  if (a) rafraichirMarqueur(a);
  history.replaceState(null, "", location.pathname);
  rendreListe();
}

async function partager(p) {
  const txt = `${p.nom} — ${CATEGORIES[p.cat].label} à Marrakech\n★ ${p.note}/5 · taxi depuis l'hôtel ~${p._taxi.jourTxt}\nhttps://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  if (navigator.share) { try { await navigator.share({ title: p.nom, text: txt }); return; } catch {} }
  try { await navigator.clipboard.writeText(txt); toast("Copié dans le presse-papier"); }
  catch { toast("Impossible de partager"); }
}

async function partagerWishlist() {
  const liste = filtrer();
  if (!liste.length) return;
  const total = liste.reduce((s, p) => s + p._taxi.jour, 0);
  const txt = "Notre semaine à Marrakech\n\n" +
    liste.map(p => `• ${p.nom} (${CATEGORIES[p.cat].label}, ★${p.note}) — taxi ~${p._taxi.jourTxt}\n  https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`).join("\n") +
    `\n\nBudget taxi aller simple : ~${Math.round(total / 10) * 10} MAD`;
  if (navigator.share) { try { await navigator.share({ title: "Wishlist Marrakech", text: txt }); return; } catch {} }
  try { await navigator.clipboard.writeText(txt); toast("Wishlist copiée"); }
  catch { toast("Copie impossible"); }
}

/* =====================================================================
   Guidage
   ===================================================================== */
let poiGuide = null;

function ouvrirGuidage(p) {
  poiGuide = p;
  const menu = $("#nav-menu");
  $("#nav-titre").textContent = p.nom;
  $("#nav-sub").textContent = `${p._taxi.km.toFixed(1)} km · environ ${p._taxi.minutes} min de trajet`;
  menu.classList.add("open");
  majLiensGuidage();
}

function origine() {
  if (etat.origine === "moi" && etat.maPosition) return etat.maPosition;
  return HOTEL;
}

function majLiensGuidage() {
  const p = poiGuide; if (!p) return;
  const o = origine();
  const dest = `${p.lat},${p.lng}`;
  const from = `${o.lat},${o.lng}`;
  $("#nav-gmaps").href  = `https://www.google.com/maps/dir/?api=1&origin=${from}&destination=${dest}&travelmode=driving`;
  $("#nav-walk").href   = `https://www.google.com/maps/dir/?api=1&origin=${from}&destination=${dest}&travelmode=walking`;
  $("#nav-waze").href   = `https://waze.com/ul?ll=${dest}&navigate=yes`;
  $("#nav-apple").href  = `https://maps.apple.com/?saddr=${from}&daddr=${dest}&dirflg=d`;
  $$(".nav-from button").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.from === etat.origine)));
}

function demanderPosition() {
  if (!navigator.geolocation) return toast("Géolocalisation indisponible");
  toast("Localisation en cours…");
  navigator.geolocation.getCurrentPosition(pos => {
    etat.maPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    etat.origine = "moi";
    majLiensGuidage();
    if (carteDispo) {
      if (moiMarker) map.removeLayer(moiMarker);
      moiMarker = L.circleMarker([etat.maPosition.lat, etat.maPosition.lng], {
        radius: 8, color: "#fff", weight: 3, fillColor: "#1F6F78", fillOpacity: 1
      }).addTo(map).bindPopup("Vous êtes ici");
    }
    toast("Position trouvée");
  }, () => {
    etat.origine = "hotel"; majLiensGuidage();
    toast("Position refusée, départ depuis l'hôtel");
  }, { enableHighAccuracy: true, timeout: 8000 });
}

/* =====================================================================
   Bottom sheet (mobile)
   ===================================================================== */
function initSheet() {
  const sheet = $("#sheet"), grab = $("#grabber");
  const etats = ["peek", "", "full"];
  let idx = 1;
  const applique = () => {
    sheet.classList.remove("peek", "full");
    if (etats[idx]) sheet.classList.add(etats[idx]);
    setTimeout(() => map && map.invalidateSize(), 300);
  };
  let y0 = null, h0 = 0;
  grab.addEventListener("pointerdown", e => {
    y0 = e.clientY; h0 = sheet.getBoundingClientRect().height;
    sheet.style.transition = "none"; grab.setPointerCapture(e.pointerId);
  });
  grab.addEventListener("pointermove", e => {
    if (y0 === null) return;
    const h = Math.min(innerHeight - 92, Math.max(100, h0 - (e.clientY - y0)));
    sheet.style.height = h + "px";
  });
  grab.addEventListener("pointerup", e => {
    if (y0 === null) return;
    const h = sheet.getBoundingClientRect().height, vh = innerHeight;
    sheet.style.transition = ""; sheet.style.height = "";
    idx = h < vh * .28 ? 0 : h > vh * .68 ? 2 : 1;
    applique(); y0 = null;
  });
  grab.addEventListener("click", () => { idx = (idx + 1) % 3; applique(); });
}

/* =====================================================================
   Divers UI
   ===================================================================== */
let toastT;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg; el.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove("show"), 2200);
}

function initFiltres() {
  const wrap = $("#filtres");
  const cats = [["tous", { label: "Tout", icon: "✳️" }], ...Object.entries(CATEGORIES)];
  wrap.innerHTML = cats.map(([k, v]) =>
    `<button class="chip" data-cat="${k}" aria-pressed="${k === "tous"}">
       <span class="e">${v.icon}</span>${v.label}</button>`).join("");
  wrap.addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    etat.cat = b.dataset.cat; etat.wishlist = false;
    $("#btn-wishlist").classList.remove("on");
    $$("#filtres .chip").forEach(c => c.setAttribute("aria-pressed", String(c === b)));
    rendreListe();
  });
}

function initEvenements() {
  $("#liste").addEventListener("click", e => {
    const f = e.target.closest("[data-fav]");
    if (f) { e.stopPropagation(); basculeFav(f.dataset.fav); return; }
    const c = e.target.closest(".card");
    if (c) ouvrirDetail(c.dataset.id);
  });

  const input = $("#q");
  input.addEventListener("input", () => { etat.q = input.value; rendreListe(); });
  $("#q-clear").addEventListener("click", () => { input.value = ""; etat.q = ""; rendreListe(); input.focus(); });

  $("#btn-wishlist").addEventListener("click", () => {
    etat.wishlist = !etat.wishlist;
    $("#btn-wishlist").classList.toggle("on", etat.wishlist);
    if (etat.wishlist) {
      $$("#filtres .chip").forEach(c => c.setAttribute("aria-pressed", "false"));
      $("#sheet").classList.remove("peek");
      $("#filtres").scrollTo({ left: 0, behavior: "smooth" });
    } else {
      etat.cat = "tous";
      $$("#filtres .chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.cat === "tous")));
    }
    rendreListe();
  });

  $("#wl-share").addEventListener("click", partagerWishlist);
  $("#wl-clear").addEventListener("click", () => {
    if (!favoris.size) return;
    if (!confirm("Vider complètement la wishlist ?")) return;
    const ids = [...favoris];
    favoris.clear(); sauveFav();
    ids.forEach(rafraichirMarqueur);
    rendreListe(); toast("Wishlist vidée");
  });

  $("#btn-hotel").addEventListener("click", () => {
    if (carteDispo) map.flyTo([HOTEL.lat, HOTEL.lng], 15, { duration: .8 });
    toast("Riu Tikida Garden, votre camp de base");
  });

  $("#tri").addEventListener("click", () => {
    etat.tri = etat.tri === "distance" ? "note" : "distance";
    $("#tri").textContent = etat.tri === "distance" ? "⇅ Les plus proches" : "⇅ Les mieux notés";
    rendreListe();
  });

  $("#nav-menu").addEventListener("click", e => {
    if (e.target.id === "nav-menu" || e.target.closest("[data-close]")) $("#nav-menu").classList.remove("open");
  });
  $$(".nav-from button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.from === "moi" && !etat.maPosition) return demanderPosition();
    etat.origine = b.dataset.from; majLiensGuidage();
  }));
  $("#nav-copy").addEventListener("click", async () => {
    if (!poiGuide) return;
    try { await navigator.clipboard.writeText(`${poiGuide.lat},${poiGuide.lng}`); toast("Coordonnées copiées"); }
    catch { toast("Copie impossible"); }
  });

  addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if ($("#nav-menu").classList.contains("open")) $("#nav-menu").classList.remove("open");
    else if ($("#detail").classList.contains("open")) fermerDetail();
  });

  addEventListener("resize", () => map && map.invalidateSize());
}

/* =====================================================================
   Démarrage
   ===================================================================== */
function demarrer() {
  initCarte();
  initFiltres();
  initSheet();
  initEvenements();
  rendreListe();

  const id = location.hash.slice(1);
  if (parId[id]) setTimeout(() => ouvrirDetail(id), 400);

  setTimeout(() => {
    $("#intro").classList.add("hide");
    setTimeout(() => $("#intro").remove(), 600);
  }, 900);

  let inviteInstall = null;
  addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); inviteInstall = e;
    const b = $("#btn-install"); b.hidden = false;
    b.onclick = async () => {
      b.hidden = true;
      inviteInstall.prompt();
      await inviteInstall.userChoice;
      inviteInstall = null;
    };
  });

  if ("serviceWorker" in navigator) {
    addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
}

demarrer();
