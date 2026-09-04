# Marrakech, le guide de la semaine

Application web (PWA) pour une semaine à Marrakech, avec une carte interactive des
meilleures adresses de la ville et des environs, et le coût du taxi calculé depuis
l'hôtel **Riu Tikida Garden** (Circuit de la Palmeraie).

## Ce que fait l'app

- **Carte interactive** : 64 adresses géolocalisées, épingles par catégorie, hôtel repéré.
- **8 catégories** : restaurants, cafés, bars et rooftops, monuments, jardins, activités,
  souks et shopping, escapades à proximité (Agafay, Ourika, Imlil, Essaouira, Ouzoud…).
- **Photos réelles** depuis Wikipédia pour les 20 lieux qui ont leur propre article,
  visuel zellige généré pour les autres : jamais une photo qui ne serait pas celle du lieu.
- **Fiche complète** par adresse : photo, note du guide, niveau de prix, durée
  conseillée, description, conseils de terrain, horaires, coordonnées GPS.
- **Coût du taxi** pour chaque adresse : tarif de journée et tarif après 21 h, calculés
  depuis l'hôtel. Les excursions lointaines utilisent un forfait grand taxi ou une
  alternative (bus, navette) quand elle est plus intelligente.
- **Guidage** : ouverture de l'itinéraire dans Google Maps (voiture ou à pied), Waze ou
  Apple Plans, au départ de l'hôtel ou de la position réelle. Copie des coordonnées à
  montrer au chauffeur.
- **Wishlist** : cœur sur chaque adresse, liste dédiée, budget taxi cumulé, partage de la
  liste en un message.
- **Tri et recherche** : par distance ou par note, recherche plein texte.
- **PWA** : installable sur l'écran d'accueil, service worker, tuiles de carte et photos
  mises en cache pour survivre à une 4G capricieuse dans la médina.
- **Thème clair et sombre** automatiques, selon la préférence du système, fond de carte
  compris.
- **Accessibilité** : navigation complète au clavier, cibles tactiles de 44 px minimum,
  contrastes vérifiés au-dessus de 4,5:1 dans les deux thèmes, `prefers-reduced-motion`
  respecté.
- **Responsive** : du Galaxy Fold fermé (280 px) au bureau, avec bottom sheet à trois
  positions sur mobile et panneau latéral sur grand écran.

## Précision sur les données

Trois niveaux d'information, séparés à l'écran :

1. **Faits relevés en ligne** (adresse, horaires, tarif, téléphone, site, note avec sa
   source et son nombre d'avis) : recherchés en septembre 2026, pour **48 adresses sur
   64**. Une donnée introuvable reste absente, elle n'est jamais estimée.
2. **Note** : quand elle vient de Tripadvisor, elle porte la pastille de sa source et son
   nombre d'avis (11 adresses). Sinon c'est mon appréciation, libellée « note du guide ».
3. **Mon avis** : mon opinion et mes conseils, dans un bloc distinct, sur les 64 adresses.

Chaque fiche indique si ses informations ont été relevées en ligne ou non.

Les prix de taxi sont des **estimations** : environ
11 MAD du kilomètre routier en petit taxi négocié, minimum de course 40 MAD, majoration
de 50 % après 21 h. Au compteur, c'est presque toujours moins cher. Négociez toujours
avant de monter.

## Hébergement

Le site est statique et se publie sur GitHub Pages via le workflow
`.github/workflows/pages.yml`.

Pour l'activer : **Settings → Pages → Source : GitHub Actions**. Le workflow se
déclenche à chaque push sur la branche de développement ou sur `main`.

## Développement local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Aucune dépendance à installer, aucun build. Leaflet et les polices sont chargés depuis
un CDN, et l'app reste utilisable (liste, fiches, prix, guidage) même si la carte ne
charge pas.

## Structure

```
DESIGN.md                direction artistique, dials et justification des choix
index.html               interface
assets/style.css         direction artistique (ocre, zellige, safran)
assets/app.js            logique : carte, filtres, wishlist, taxi, guidage
assets/data.js           les 65 adresses et l'hôtel
manifest.webmanifest     PWA
sw.js                    cache hors ligne
```

Pour ajouter une adresse : une entrée dans `POIS` (`assets/data.js`). Le coût du taxi
et la distance sont calculés automatiquement, sauf si vous fournissez un champ `taxi`.
