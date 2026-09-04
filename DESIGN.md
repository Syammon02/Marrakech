# Direction artistique

## Lecture du projet (Design Read)

Carte-guide de voyage personnelle, pour deux voyageurs sur place à Marrakech pendant
une semaine, dans un langage visuel emprunté à l'artisanat marocain (ocre, zellige,
safran, cèdre), dials **ENERGY 2 / RHYTHM 2 / MOTION 1**.

- **ENERGY 2** : l'app doit avoir un caractère, mais elle se consulte debout dans un
  souk, sous le soleil, avec une main. La lisibilité passe avant l'effet.
- **RHYTHM 2** : une trame constante (liste de cartes homogènes) avec deux ruptures
  assumées : la barre haute sombre à motif, et la fiche détail à grande image.
- **MOTION 1** : transitions d'état seulement (feuille, fiche, toast). Aucune
  animation décorative, et `prefers-reduced-motion` coupe tout.

## Motif d'identité

L'étoile à huit branches du zellige. Elle apparaît à quatre endroits et nulle part
ailleurs : l'icône de l'app, l'écran d'accueil, la trame de la barre haute, et le
visuel généré de chaque adresse. C'est ce qui fait que l'app appartient à ce voyage
et pas à un template de guide.

## Décisions et raisons

| Décision | Raison |
|---|---|
| Palette : terre `#C1543A`, zellige `#1F6F78`, safran `#D99A0B`, menthe `#3E8E7E` sur sable `#F6EDDF` | Les quatre couleurs du zellige et du pisé marrakchi. Trois teintes de base plus un accent, pas de cinquième couleur. |
| Huit catégories, quatre teintes déclinées en deux valeurs | Rester distinguable sur la carte sans faire exploser la palette (R-29). |
| Accent safran réservé aux notes, au compteur de wishlist et à l'anneau de focus | Un seul accent, employé aux moments décisifs, jamais en décoration. |
| Titres en Marcellus | Ses empattements évasés rappellent le plâtre sculpté et la calligraphie coufique. Choisi pour ce caractère, pas par défaut. |
| Interface en DM Sans | Chiffres tabulaires lisibles pour les prix et les distances, bonne tenue à 12 px. |
| Fond de la barre haute en trame zellige sombre | Motif d'identité, et fond sombre nécessaire pour que la carte claire ne soit pas éblouissante juste en dessous. |
| Feuille glissante à trois positions sur mobile | La carte et la liste doivent cohabiter sur un écran de téléphone sans changer de page. |
| Panneau latéral fixe à partir de 900 px | Sur grand écran, cacher la liste derrière un geste n'a plus de sens. |
| Cartes de liste toutes identiques | C'est une liste à parcourir, pas une grille de fonctionnalités : l'uniformité sert le balayage visuel. La hiérarchie se fait par le tri, pas par la taille des cartes. |
| Bouton d'action principal en bas de la fiche | Zone du pouce. Le guidage est l'action pour laquelle on ouvre une fiche. |
| Ombres : une seule par niveau (carte, feuille, bouton principal) | L'ombre marque l'élévation, elle n'est pas un effet appliqué partout. |
| Rayons : 10 px badges, 12 à 14 px boutons, 16 px cartes, 22 px feuille | Échelle croissante avec la taille de l'élément, pas de pilule généralisée. |
| Dégradé uniquement sur l'image d'en-tête et le visuel généré | Sur l'en-tête, il garantit le contraste du texte blanc. Sur le visuel, il différencie les catégories. Nulle part ailleurs. |
| Thème clair, sombre ou automatique | L'app se consulte le soir sur une terrasse. Mêmes teintes, valeurs inversées, fond de carte sombre assorti. |
| Fond de carte Positron et Dark Matter | Quasi monochromes. Sur une carte couverte d'épingles de couleur, ils se lisent bien mieux que Voyager, qui colore déjà routes, parcs et bâtiments. |
| Regroupement des épingles par grille de 52 px | Une trentaine d'adresses tiennent dans le kilomètre carré de la médina : sans regroupement, la carte est illisible sous le zoom 16. |
| Noms affichés seulement au zoom 16 et au-delà, et à moins de douze épingles | Une étiquette par épingle est utile quand on cherche une rue, illisible quand tout se chevauche. |
| Emoji comme pictogrammes de catégorie | Universels, sans dépendance à une bibliothèque d'icônes, et chacun est relié à son contenu (dromadaire pour les activités, pas une étoile magique). |

## Ce que l'app ne fait pas, volontairement

- Aucune statistique d'audience, aucun nombre d'avis : il n'existe pas de source
  vérifiable pour ces chiffres. Les notes sont assumées comme éditoriales et
  libellées comme telles dans l'interface.
- Aucun témoignage, aucun logo de partenaire, aucune promesse de performance.
- Les prix de taxi sont présentés comme des estimations calculées, avec la méthode
  écrite dans le README.
