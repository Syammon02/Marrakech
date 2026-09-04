import { HOTEL, CATEGORIES, POIS, WIKI, SOURCES, RELEVE } from "./data.js";

/* =====================================================================
   Utilitaires
   ===================================================================== */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const mouvementReduit = matchMedia("(prefers-reduced-motion: reduce)");
/* Déplacement de carte : animé par défaut, instantané si l'utilisateur a demandé
   moins de mouvement au niveau du système. */
function allerA(lat, lng, zoom) {
  if (!carteDispo) return;
  if (mouvementReduit.matches) map.setView([lat, lng], zoom);
  else map.flyTo([lat, lng], zoom, { duration: .8 });
}

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

/* Taux fixe relevé le 4 septembre 2026 (1 EUR = 10,82 MAD). Volontairement figé :
   l'app doit fonctionner hors ligne dans la médina, et un ordre de grandeur suffit
   pour décider si on prend le taxi ou pas. */
const TAUX_EUR = 10.82;
const TAUX_DATE = "4 septembre 2026";

/* Thème : trois positions, la préférence système par défaut. Le choix manuel
   est enregistré sur la racine du document, ce que la feuille de styles lit. */
const THEME_KEY = "mrk.theme.v1";
const THEMES = [
  { val: "auto",  icone: "◐", label: "Thème automatique, selon le système" },
  { val: "light", icone: "☀", label: "Thème clair" },
  { val: "dark",  icone: "☾", label: "Thème sombre" }
];
let theme = "auto";
try { theme = ["light", "dark"].includes(localStorage.getItem(THEME_KEY))
  ? localStorage.getItem(THEME_KEY) : "auto"; } catch {}

const sombreSysteme = matchMedia("(prefers-color-scheme: dark)");
const estSombre = () => theme === "dark" || (theme === "auto" && sombreSysteme.matches);

function appliquerTheme() {
  const r = document.documentElement;
  if (theme === "auto") r.removeAttribute("data-theme");
  else r.dataset.theme = theme;
  const t = THEMES.find(x => x.val === theme);
  const b = document.getElementById("btn-theme");
  if (b) { b.textContent = t.icone; b.setAttribute("aria-label", t.label); }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = estSombre() ? "#1C1411" : "#241611";
  majFondCarte();
}

function cyclerTheme() {
  const i = THEMES.findIndex(x => x.val === theme);
  theme = THEMES[(i + 1) % THEMES.length].val;
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
  appliquerTheme();
  toast(THEMES.find(x => x.val === theme).label);
}

const DEVISE_KEY = "mrk.devise.v1";
let devise = "MAD";
try { devise = localStorage.getItem(DEVISE_KEY) === "EUR" ? "EUR" : "MAD"; } catch {}

/* Arrondi à l'euro entier : ces montants servent à décider si on prend un taxi,
   pas à tenir une comptabilité. Une décimale seulement sous 2 €. */
function enEuros(mad) {
  const e = mad / TAUX_EUR;
  return e < 2 ? e.toFixed(1).replace(".", ",") : String(Math.round(e));
}

/* Un montant en dirhams, affiché dans la devise active. */
function prix(mad) {
  return devise === "EUR" ? `${enEuros(mad)} €` : `${Math.round(mad)} MAD`;
}

function fourchette(a, b) {
  return devise === "EUR"
    ? `${enEuros(a)}-${enEuros(b)} €`
    : `${Math.round(a)}-${Math.round(b)} MAD`;
}

/* Convertit les montants écrits en toutes lettres dans les textes sourcés
   (« 100 MAD adulte, 30 MAD enfant ») sans toucher au reste de la phrase. */
function convertirTexte(txt) {
  if (devise !== "EUR" || !txt) return txt;
  return txt.replace(/(\d[\d\s\u00a0\u202f]*)\s*(MAD|dirhams?|DH|dhs)/gi,
    (m, n) => `${enEuros(parseFloat(n.replace(/[\s\u00a0\u202f]/g, "")))} €`);
}

function basculerDevise() {
  devise = devise === "MAD" ? "EUR" : "MAD";
  try { localStorage.setItem(DEVISE_KEY, devise); } catch {}
  rendreListe();
  if (etat.actif) ouvrirDetail(etat.actif, false);
  toast(devise === "EUR"
    ? `Prix en euros, au taux du ${TAUX_DATE}`
    : "Prix en dirhams");
}

function round5(n) { return Math.max(5, Math.round(n / 5) * 5); }

function taxiInfo(poi) {
  const volOiseau = distanceKm(HOTEL, poi);
  const km = volOiseau * SINUOSITE;
  const minutes = Math.max(4, Math.round(km / VITESSE * 60));
  if (poi.taxi) return { km, minutes, ...poi.taxi, forfait: true };
  const base = Math.max(MINI, km * TARIF_KM);
  const jour = round5(base);
  const nuit = round5(base * 1.5);
  return {
    km, minutes, jour, nuit, forfait: false,
    bas: round5(jour * .85), haut: round5(jour * 1.2),
    basNuit: round5(nuit * .85), hautNuit: round5(nuit * 1.2),
    note: km < 1.6
      ? "Moins de 2 km : la marche est plus rapide qu'un taxi coincé dans la circulation."
      : "Petit taxi, prix négocié avant de monter. Exigez le compteur si le chauffeur l'accepte, c'est presque toujours moins cher."
  };
}

const fmtPrix = n => n ? "€".repeat(n) : "Gratuit";

/* Le tarif taxi d'un POI, dans la devise active. */
function taxiJour(t) {
  if (t.forfait) return t.jour === 0 ? "Inclus" : `~${prix(t.jour)}`;
  return fourchette(t.bas, t.haut);
}
function taxiNuit(t) {
  if (t.forfait) return t.nuit ? `~${prix(t.nuit)}` : "sans objet";
  return fourchette(t.basNuit, t.hautNuit);
}
const fmtNote = n => n.toFixed(1).replace(".", ",");
const fmtNb = n => n.toLocaleString("fr-FR");

/* Renvoie la note à afficher, avec sa provenance. Jamais de note orpheline :
   soit elle vient d'une source nommée, soit elle est signée comme la mienne. */
function noteAffichee(p) {
  if (p.avis && p.avis.note) return { val: p.avis.note, src: p.avis.src, nb: p.avis.nb };
  if (p.note) return { val: p.note, src: "guide" };
  return null;
}
const fmtKm = n => n.toFixed(1).replace(".", ",");

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

/* Les données vérifiées écrasent les valeurs éditoriales de départ : une
   adresse ou des horaires relevés priment toujours sur ce que j'avais écrit. */
const enrichis = POIS.map(p => {
  const src = SOURCES[p.id] || {};
  /* « vérifié » veut dire qu'un fait a été relevé en ligne (adresse, horaires,
     tarif, contact, note). Une entrée qui ne contient que mon avis ne compte pas. */
  const verifie = !!(src.adresse || src.horaires || src.tarif || src.tel || src.site || src.avis);
  return { ...p, ...src, _src: verifie, _taxi: taxiInfo(p), _dist: distanceKm(HOTEL, p) };
});
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
  const c = document.getElementById("map-load");
  if (c) c.hidden = true;
  el.innerHTML = `<div style="height:100%;display:grid;place-items:center;text-align:center;
      padding:24px;color:#7A6A5D;font-size:14px;line-height:1.6">
      <div><div style="font-size:30px">🗺️</div>
      La carte n'a pas pu se charger.<br>Les fiches, les prix de taxi et le guidage
      fonctionnent normalement.</div></div>`;
}

let tuiles = null, coucheMarqueurs = null;

/* Fond de carte accordé au thème. Positron et Dark Matter sont des fonds
   quasi monochromes : sur une carte couverte d'épingles de couleur, ils se
   lisent bien mieux que Voyager, qui colore déjà routes, parcs et bâtiments. */
function urlFond() {
  return `https://{s}.basemaps.cartocdn.com/${estSombre() ? "dark_all" : "light_all"}/{z}/{x}/{y}{r}.png`;
}

function majFondCarte() {
  if (!carteDispo || !map || !tuiles) return;
  tuiles.setUrl(urlFond());
}

function initCarte() {
  if (!carteDispo) return replisCarte();
  map = L.map("map", { zoomControl: false, attributionControl: true })
         .setView([HOTEL.lat, HOTEL.lng], 13);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.control.scale({ position: "bottomleft", imperial: false, maxWidth: 120 }).addTo(map);

  tuiles = L.tileLayer(urlFond(), {
    maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);
  sombreSysteme.addEventListener("change", () => { if (theme === "auto") appliquerTheme(); });

  const chargement = document.getElementById("map-load");
  tuiles.on("load", () => { if (chargement) chargement.hidden = true; });
  setTimeout(() => { if (chargement) chargement.hidden = true; }, 6000);

  L.marker([HOTEL.lat, HOTEL.lng], {
    zIndexOffset: 1000,
    icon: L.divIcon({ className: "", html: `<div class="pin-hotel">🏨</div>`,
                      iconSize: [40, 40], iconAnchor: [20, 20] })
  }).addTo(map).bindPopup(`<b>${HOTEL.name}</b><br><span style="color:#7A6A5D">${HOTEL.address}</span><br><small>Point de départ de tous les tarifs taxi</small>`);

  coucheMarqueurs = L.layerGroup().addTo(map);
  map.on("zoomend moveend", dessinerMarqueurs);

  /* Cadrage d'ouverture : l'hôtel et la ville, sans les escapades lointaines
     qui dézoomeraient jusqu'à Essaouira et rendraient la carte inutile. */
  const ville = enrichis.filter(p => p._dist < 12).map(p => [p.lat, p.lng]);
  map.fitBounds(L.latLngBounds([[HOTEL.lat, HOTEL.lng], ...ville]).pad(0.06),
                { animate: false });

  dessinerMarqueurs();
}

function iconePoi(p, avecNom) {
  const c = CATEGORIES[p.cat].color;
  const fav = favoris.has(p.id) ? " fav" : "";
  const actif = etat.actif === p.id;
  return L.divIcon({
    className: "pin-wrap" + (actif ? " actif" : ""),
    html: `<div class="pin${fav}" style="background:${c}"><span>${CATEGORIES[p.cat].icon}</span></div>` +
          (avecNom || actif ? `<b class="pin-nom">${p.nom}</b>` : ""),
    iconSize: [34, 34], iconAnchor: [17, 32], popupAnchor: [0, -30]
  });
}

/* Regroupement par grille de pixels. Une trentaine d'adresses tiennent dans
   le kilomètre carré de la médina : sans regroupement, les épingles se
   recouvrent et la carte devient illisible en dessous du zoom 16. */
const CELLULE = 52;

function grouper(liste, zoom) {
  const cases = new Map();
  liste.forEach(p => {
    const pt = map.project([p.lat, p.lng], zoom);
    const cle = `${Math.floor(pt.x / CELLULE)}:${Math.floor(pt.y / CELLULE)}`;
    if (!cases.has(cle)) cases.set(cle, []);
    cases.get(cle).push(p);
  });
  return [...cases.values()];
}

/* Le chiffre doit rester lisible sur la couleur de la catégorie : blanc sur les
   teintes sombres, encre sur le safran, qui tomberait à 2,1:1 avec du blanc. */
function surCouleur(hex) {
  const v = [1, 3, 5].map(i => {
    const c = parseInt(hex.substr(i, 2), 16) / 255;
    return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  });
  const lum = .2126 * v[0] + .7152 * v[1] + .0722 * v[2];
  return lum > .32 ? "#241611" : "#fff";
}

function iconeGroupe(groupe) {
  const cats = {};
  groupe.forEach(p => { cats[p.cat] = (cats[p.cat] || 0) + 1; });
  const dominante = Object.entries(cats).sort((a, b) => b[1] - a[1])[0][0];
  const taille = groupe.length > 9 ? 42 : 36;
  return L.divIcon({
    className: "groupe-wrap",
    html: `<div class="groupe" style="background:${CATEGORIES[dominante].color};
             color:${surCouleur(CATEGORIES[dominante].color)};
             width:${taille}px;height:${taille}px">${groupe.length}</div>`,
    iconSize: [taille, taille], iconAnchor: [taille / 2, taille / 2]
  });
}

function dessinerMarqueurs() {
  if (!carteDispo || !coucheMarqueurs) return;
  coucheMarqueurs.clearLayers();
  marqueurs = {};
  const zoom = map.getZoom();
  /* On ne dessine que ce qui est dans le champ, avec une marge : sans cela on
     fabrique des épingles pour Essaouira et Ouzoud à chaque déplacement. */
  const champ = map.getBounds().pad(0.3);
  const visibles = filtrer().filter(p => champ.contains([p.lat, p.lng]));
  /* Les noms n'apparaissent qu'au zoom de la rue, et seulement s'ils ne se
     marchent pas dessus : au-delà d'une douzaine d'épingles, on les coupe. */
  const avecNom = zoom >= 16 && visibles.length <= 12;

  grouper(visibles, zoom).forEach(groupe => {
    if (groupe.length === 1 || zoom >= 17) {
      groupe.forEach(p => {
        const m = L.marker([p.lat, p.lng], { icon: iconePoi(p, avecNom), title: p.nom })
                   .on("click", () => ouvrirDetail(p.id, false));
        coucheMarqueurs.addLayer(m);
        marqueurs[p.id] = m;
      });
      return;
    }
    const centre = groupe.reduce((a, p) => [a[0] + p.lat / groupe.length,
                                            a[1] + p.lng / groupe.length], [0, 0]);
    const m = L.marker(centre, {
      icon: iconeGroupe(groupe),
      title: `${groupe.length} adresses : ${groupe.slice(0, 4).map(p => p.nom).join(", ")}${groupe.length > 4 ? "…" : ""}`
    }).on("click", () => {
      const bornes = L.latLngBounds(groupe.map(p => [p.lat, p.lng]));
      map.flyToBounds(bornes.pad(0.4), { maxZoom: 17, duration: mouvementReduit.matches ? 0 : .7 });
    });
    coucheMarqueurs.addLayer(m);
  });
}

function rafraichirMarqueur() {
  dessinerMarqueurs();
}

function majVisibilite() {
  dessinerMarqueurs();
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
  const dedans = favoris.has(p.id);
  return `
    <article class="card${etat.actif === p.id ? " actif" : ""}">
      <button class="card-main" data-id="${p.id}">
      <div class="thumb"><img alt="" loading="lazy" data-poi="${p.id}"></div>
      <div class="card-body">
        <h3>${p.nom}</h3>
        <div class="meta">
          ${(() => { const n = noteAffichee(p); return n
            ? `<span class="note" title="${n.src === "guide" ? "Note du guide" : "Note " + n.src}">
                 <b>★</b> ${fmtNote(n.val)}${n.src === "guide" ? "" : `<i>${n.src.slice(0, 2)}</i>`}</span>`
            : ""; })()}
          <span aria-hidden="true">·</span><span>${fmtPrix(p.prix)}</span>
          <span aria-hidden="true">·</span><span>${p.duree}</span>
        </div>
        <div class="meta">
          <span class="tag">${CATEGORIES[p.cat].icon} ${CATEGORIES[p.cat].label}</span>
          <span class="taxi-badge" data-devise
                title="Toucher pour basculer entre dirhams et euros">🚕 ${taxiJour(t)}</span>
        </div>
      </div>
      </button>
      <button class="fav${dedans ? " on" : ""}" data-fav="${p.id}"
              aria-pressed="${dedans}"
              aria-label="${dedans ? "Retirer" : "Ajouter"} ${p.nom} ${dedans ? "de" : "à"} la wishlist"
      >${dedans ? "♥" : "♡"}</button>
    </article>`;
}

function rendreListe() {
  const res = filtrer();
  const liste = $("#liste");
  if (!res.length) {
    liste.innerHTML = etat.wishlist
      ? `<div class="vide"><span class="e">♡</span>
           <p>Votre wishlist est vide.<br>Touchez le cœur sur une adresse pour la garder
           de côté et voir le budget taxi de la semaine.</p>
           <button class="btn-vide" id="vide-cta">Parcourir les 65 adresses</button></div>`
      : `<div class="vide"><span class="e">🔍</span>
           <p>Rien ne correspond à « ${etat.q} ».<br>Essayez un autre mot ou changez de catégorie.</p>
           <button class="btn-vide" id="vide-cta">Tout réafficher</button></div>`;
    const cta = $("#vide-cta");
    if (cta) cta.onclick = reinitialiser;
  } else {
    liste.innerHTML = res.map(carteHTML).join("") + `
      <p class="source">Les notes marquées <b>Tr</b> viennent de Tripadvisor, relevées en
      ${RELEVE}. Les autres sont mon appréciation, pas une moyenne d'avis. Les prix de
      taxi sont estimés à partir de la distance depuis l'hôtel, à négocier avant de monter.
      Touchez un prix pour basculer entre dirhams et euros${devise === "EUR"
        ? `, au taux du ${TAUX_DATE}` : ""}.</p>`;
    $$("#liste img[data-poi]").forEach(img => peupleImage(img, parId[img.dataset.poi]));
  }

  $("#compte").textContent = res.length === 0 ? "aucune adresse"
    : res.length + (res.length > 1 ? " adresses" : " adresse");
  $("#titre-liste").textContent = etat.wishlist
    ? "Ma wishlist"
    : etat.cat === "tous" ? "Tout Marrakech" : CATEGORIES[etat.cat].label;

  // budget taxi cumulé de la wishlist
  const budget = $("#budget");
  if (etat.wishlist && res.length) {
    const total = res.reduce((s, p) => s + p._taxi.jour, 0);
    budget.hidden = false;
    budget.textContent = `Budget taxi aller simple, tout compris : ~${
      devise === "EUR" ? `${enEuros(total)} €` : `${Math.round(total / 10) * 10} MAD`}`;
    budget.setAttribute("data-devise", "");
    budget.title = "Toucher pour basculer entre dirhams et euros";
  } else budget.hidden = true;
  $("#wl-actions").hidden = !(etat.wishlist && res.length);

  majVisibilite();
  majCompteurFav();
}

function reinitialiser() {
  etat.q = ""; $("#q").value = ""; majClear();
  etat.cat = "tous"; etat.wishlist = false;
  $("#btn-wishlist").classList.remove("on");
  $("#btn-wishlist").setAttribute("aria-pressed", "false");
  $$("#filtres .chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.cat === "tous")));
  $("#filtres").scrollLeft = 0;
  rendreListe();
}

function majClear() {
  $("#q-clear").hidden = !$("#q").value;
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
            ${(() => { const n = noteAffichee(p); return n
              ? `<span class="note"><b>★</b> ${fmtNote(n.val)}<small>${
                  n.src === "guide" ? " note du guide"
                  : ` sur ${n.src}${n.nb ? `, ${fmtNb(n.nb)} avis` : ""}`}</small></span>
                 <span aria-hidden="true">·</span>`
              : ""; })()}
            <span>${fmtPrix(p.prix)}</span>
          </div>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><div class="k">Durée</div><div class="v">${p.duree}</div></div>
        <div class="stat"><div class="k">Distance</div><div class="v">${fmtKm(t.km)} km</div></div>
        <div class="stat"><div class="k">Trajet</div><div class="v">${t.minutes} min<small> en taxi</small></div></div>
        ${marche ? `<div class="stat"><div class="k">À pied</div><div class="v">${Math.round(t.km / 4.5 * 60)} min<small> de marche</small></div></div>` : ""}
      </div>

      <div class="taxi-card">
        <div class="hd">🚕 Taxi depuis le Riu Tikida Garden
          <button class="devise-btn" id="d-devise"
                  aria-label="Afficher les prix en ${devise === "MAD" ? "euros" : "dirhams"}"
          >${devise === "MAD" ? "€" : "MAD"}</button>
        </div>
        <div class="taxi-grid">
          <div data-devise title="Toucher pour basculer entre dirhams et euros">
            <div class="k">Journée</div><div class="v">${taxiJour(t)}</div></div>
          <div data-devise title="Toucher pour basculer entre dirhams et euros">
            <div class="k">Après 21 h</div><div class="v">${taxiNuit(t)}</div></div>
        </div>
        <div class="taxi-note">${t.note || ""}${devise === "EUR"
          ? ` Converti au taux du ${TAUX_DATE}, 1 € = ${String(TAUX_EUR).replace(".", ",")} MAD.` : ""}</div>
      </div>

      <div class="section">
        <h4>L'endroit</h4>
        <p>${p.desc}</p>
      </div>

      ${p.monAvis ? `
      <div class="section mon-avis">
        <h4>Mon avis</h4>
        <p>${convertirTexte(p.monAvis)}</p>
      </div>` : ""}

      <div class="section">
        <h4>Bon à savoir</h4>
        <ul class="tips">${p.tips.map(x => `<li>${convertirTexte(x)}</li>`).join("")}</ul>
      </div>

      <div class="section">
        <h4>Pratique</h4>
        <dl class="pratique">
          ${p.adresse ? `<dt>Adresse</dt><dd>${p.adresse}</dd>` : ""}
          <dt>Horaires</dt><dd>${p.horaires}</dd>
          ${p.tarif ? `<dt>Tarif</dt><dd data-devise
             title="Toucher pour basculer entre dirhams et euros">${convertirTexte(p.tarif)}</dd>` : ""}
          ${p.tel ? `<dt>Téléphone</dt><dd><a href="tel:${p.tel.replace(/ /g, "")}">${p.tel}</a></dd>` : ""}
          ${p.site ? `<dt>Site</dt><dd><a href="https://${p.site}" target="_blank" rel="noopener">${p.site}</a></dd>` : ""}
          <dt>Réservation</dt><dd>${p.reserver ? "recommandée, voire indispensable" : "pas nécessaire"}</dd>
          <dt>Coordonnées</dt><dd>${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}</dd>
        </dl>
        <p class="releve">${p._src
          ? `Adresse, horaires et tarifs relevés en ${RELEVE} par recherche web. Vérifiez avant de vous déplacer, les horaires marrakchis bougent.`
          : `Horaires et informations issus de ma documentation, non revérifiés en ligne pour cette adresse. Confirmez avant de vous déplacer.`}</p>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary" id="d-go">🧭 <span>Lancer le guidage</span></button>
      <button class="btn btn-ghost${favoris.has(p.id) ? " on" : ""}" id="d-fav"
              aria-label="Wishlist">${favoris.has(p.id) ? "♥" : "♡"}</button>
      <button class="btn btn-ghost" id="d-map" aria-label="Voir sur la carte">📍</button>
    </div>`;

  peupleImage($("#d-hero"), p, true);
  const d = $("#detail");
  d.classList.add("open");
  d.setAttribute("aria-modal", "true");
  d.setAttribute("role", "dialog");
  d.setAttribute("aria-label", p.nom);
  document.body.style.overflow = "hidden";
  focusAvant = document.activeElement;
  setTimeout(() => $("#d-close").focus(), 60);

  $("#d-close").onclick = fermerDetail;
  $("#d-fav").onclick = () => basculeFav(p.id);
  $("#d-devise").onclick = basculerDevise;
  $("#d-go").onclick = () => ouvrirGuidage(p);
  $("#d-map").onclick = () => { fermerDetail(); allerA(p.lat, p.lng, 16); };
  $("#d-share").onclick = () => partager(p);

  if (recentre) allerA(p.lat, p.lng, Math.max(carteDispo ? map.getZoom() : 15, 15));
  else if (carteDispo) map.panTo([p.lat, p.lng], { animate: !mouvementReduit.matches });

  history.replaceState(null, "", "#" + p.id);
  rendreListe();
}

let focusAvant = null;

function fermerDetail() {
  const d = $("#detail");
  d.classList.remove("open");
  d.removeAttribute("aria-modal");
  document.body.style.overflow = "";
  const a = etat.actif; etat.actif = null;
  if (a) rafraichirMarqueur(a);
  history.replaceState(null, "", location.pathname);
  rendreListe();
  /* la liste est re-rendue à la fermeture : le noeud d'origine n'existe plus,
     on rend donc le focus à la carte correspondante, pas au body */
  const cible = (a && $(`.card-main[data-id="${a}"]`))
    || (focusAvant && document.contains(focusAvant) ? focusAvant : null);
  if (cible) cible.focus({ preventScroll: false });
  focusAvant = null;
}

async function partager(p) {
  const txt = `${p.nom} : ${CATEGORIES[p.cat].label} à Marrakech\n★ ${fmtNote(p.note)}/5 selon ce guide · taxi depuis l'hôtel ~${taxiJour(p._taxi)}\nhttps://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  if (navigator.share) { try { await navigator.share({ title: p.nom, text: txt }); return; } catch {} }
  try { await navigator.clipboard.writeText(txt); toast("Copié dans le presse-papier"); }
  catch { toast("Impossible de partager"); }
}

async function partagerWishlist() {
  const liste = filtrer();
  if (!liste.length) return;
  const total = liste.reduce((s, p) => s + p._taxi.jour, 0);
  const txt = "Notre semaine à Marrakech\n\n" +
    liste.map(p => `• ${p.nom} (${CATEGORIES[p.cat].label}, ★${fmtNote(p.note)} selon ce guide) : taxi ~${taxiJour(p._taxi)}\n  https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`).join("\n") +
    `\n\nBudget taxi aller simple : ~${devise === "EUR" ? enEuros(total) + " €" : Math.round(total / 10) * 10 + " MAD"}`;
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
  setTimeout(() => $("#nav-gmaps").focus(), 60);
}

function fermerGuidage() {
  $("#nav-menu").classList.remove("open");
  const b = $("#d-go");
  if (b) b.focus();
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
  const majOffset = () => document.documentElement.style.setProperty(
    "--sheet-offset", sheet.getBoundingClientRect().height + "px");
  const applique = () => {
    sheet.classList.remove("peek", "full");
    if (etats[idx]) sheet.classList.add(etats[idx]);
    setTimeout(() => { majOffset(); map && map.invalidateSize(); }, 300);
  };
  majOffset();
  addEventListener("resize", majOffset);
  let y0 = null, h0 = 0;
  grab.addEventListener("pointerdown", e => {
    y0 = e.clientY; h0 = sheet.getBoundingClientRect().height;
    sheet.style.transition = "none"; grab.setPointerCapture(e.pointerId);
  });
  grab.addEventListener("pointermove", e => {
    if (y0 === null) return;
    const h = Math.min(innerHeight - 92, Math.max(100, h0 - (e.clientY - y0)));
    sheet.style.height = h + "px";
    majOffset();
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
/* Un toast porteur d'une action annulable expose cette action en bouton,
   et reste affiché plus longtemps pour laisser le temps de l'attraper. */
function toast(msg, action) {
  const el = $("#toast");
  el.innerHTML = "";
  el.classList.toggle("centre", !action);
  const span = document.createElement("span");
  span.className = "toast-msg";
  span.textContent = msg;
  el.append(span);
  if (action) {
    const b = document.createElement("button");
    b.className = "toast-action";
    b.textContent = action.label;
    b.onclick = () => { el.classList.remove("show"); action.run(); };
    el.append(b);
  }
  el.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove("show"), action ? 7000 : 2600);
}

function initFiltres() {
  const wrap = $("#filtres");
  const cats = [["tous", { label: "Tout", icon: "" }], ...Object.entries(CATEGORIES)];
  wrap.innerHTML = cats.map(([k, v]) =>
    `<button class="chip" data-cat="${k}" aria-pressed="${k === "tous"}">
       ${v.icon ? `<span class="e" aria-hidden="true">${v.icon}</span>` : ""}${v.label}</button>`).join("");
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
    const c = e.target.closest(".card-main");
    if (c) ouvrirDetail(c.dataset.id);
  });

  const input = $("#q");
  input.addEventListener("input", () => { etat.q = input.value; majClear(); rendreListe(); });
  majClear();
  $("#q-clear").addEventListener("click", () => {
    input.value = ""; etat.q = ""; majClear(); rendreListe(); input.focus();
  });

  $("#btn-wishlist").addEventListener("click", () => {
    etat.wishlist = !etat.wishlist;
    $("#btn-wishlist").classList.toggle("on", etat.wishlist);
    $("#btn-wishlist").setAttribute("aria-pressed", String(etat.wishlist));
    if (etat.wishlist) {
      $$("#filtres .chip").forEach(c => c.setAttribute("aria-pressed", "false"));
      $("#sheet").classList.remove("peek");
      $("#filtres").scrollLeft = 0;
    } else {
      etat.cat = "tous";
      $$("#filtres .chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.cat === "tous")));
    }
    rendreListe();
  });

  $("#wl-share").addEventListener("click", partagerWishlist);
  $("#wl-clear").addEventListener("click", () => {
    if (!favoris.size) return;
    const ids = [...favoris];
    favoris.clear(); sauveFav();
    ids.forEach(rafraichirMarqueur);
    rendreListe();
    toast(`${ids.length} adresse${ids.length > 1 ? "s retirées" : " retirée"}`, {
      label: "Annuler",
      run: () => {
        ids.forEach(id => favoris.add(id));
        sauveFav(); ids.forEach(rafraichirMarqueur); rendreListe();
        toast("Wishlist restaurée");
      }
    });
  });

  $("#btn-theme").addEventListener("click", cyclerTheme);

  $("#btn-hotel").addEventListener("click", () => {
    allerA(HOTEL.lat, HOTEL.lng, 15);
    toast("Riu Tikida Garden, votre camp de base");
  });

  $("#tri").addEventListener("click", () => {
    etat.tri = etat.tri === "distance" ? "note" : "distance";
    $("#tri").textContent = etat.tri === "distance" ? "⇅ Les plus proches" : "⇅ Les mieux notés";
    rendreListe();
  });

  $("#nav-menu").addEventListener("click", e => {
    if (e.target.id === "nav-menu" || e.target.closest("[data-close]")) fermerGuidage();
  });
  $$(".nav-from button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.from === "moi" && !etat.maPosition) return demanderPosition();
    etat.origine = b.dataset.from; majLiensGuidage();
  }));
  $$("#nav-menu a").forEach(a => a.addEventListener("click", () => {
    setTimeout(() => $("#nav-menu").classList.remove("open"), 150);
  }));
  $("#nav-copy").addEventListener("click", async () => {
    if (!poiGuide) return;
    try { await navigator.clipboard.writeText(`${poiGuide.lat},${poiGuide.lng}`); toast("Coordonnées copiées"); }
    catch { toast("Copie impossible"); }
  });

  /* Un clic sur n'importe quel montant bascule dirhams et euros, partout et
     durablement. La délégation couvre la liste comme la fiche, qui sont
     re-rendues à chaque bascule. */
  document.addEventListener("click", e => {
    const cible = e.target.closest("[data-devise]");
    if (!cible) return;
    e.preventDefault();
    e.stopPropagation();
    basculerDevise();
  }, true);

  addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if ($("#nav-menu").classList.contains("open")) fermerGuidage();
    else if ($("#detail").classList.contains("open")) fermerDetail();
  });

  addEventListener("resize", () => map && map.invalidateSize());
}

/* =====================================================================
   Démarrage
   ===================================================================== */
function suivreReseau() {
  const maj = () => {
    const off = !navigator.onLine;
    $("#offline").hidden = !off;
    if (off) toast("Hors ligne : la carte et les photos déjà consultées restent disponibles.");
  };
  addEventListener("online", maj);
  addEventListener("offline", maj);
  $("#offline").hidden = navigator.onLine;
}

function demarrer() {
  appliquerTheme();
  suivreReseau();
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
