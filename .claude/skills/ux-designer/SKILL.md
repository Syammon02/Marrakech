---
name: ux-designer
description: Audit et amélioration UX/UI d'une interface web. Utiliser avant ou après avoir écrit une interface, pour vérifier accessibilité (WCAG 2.2 AA), cibles tactiles, hiérarchie visuelle, états vides, états de chargement, retours d'action, gestion du hors ligne et respect des préférences système. Déclencher sur : revue de design, passe UX, polish d'interface, accessibilité, responsive, mobile.
---

# Passe UX / UI

Adapté de [szilu/ux-designer-skill](https://github.com/szilu/ux-designer-skill), qui
synthétise les Laws of UX, la Nielsen Norman Group, WCAG 2.2, Material Design et les
Human Interface Guidelines.

## Philosophie

La clarté cognitive prime sur la richesse sensorielle. Le mouvement, la couleur et la
densité doivent gagner leur place en aidant à comprendre, pas en impressionnant.

Hiérarchie des besoins, dans l'ordre : ça marche, c'est fiable, c'est utilisable,
c'est sans friction, c'est agréable. On ne passe pas à l'étage suivant avant d'avoir
réglé le précédent.

## Valeurs de référence

| Métrique | Valeur | Contexte |
|---|---|---|
| Cible tactile | 44 × 44 px (24 px absolu minimum WCAG 2.2) | Toute zone cliquable |
| Espacement entre cibles | 8 px minimum | Évite les erreurs de tap |
| Texte courant | 16 px minimum | Lisibilité |
| Interligne | 1,2 à 1,45 | Lecture confortable |
| Longueur de ligne | 50 à 75 caractères | Confort de lecture |
| Contraste | 4,5:1 texte normal, 3:1 grand texte | WCAG AA |
| Retour tactile | moins de 100 ms | Perçu comme instantané |
| Animation | 300 à 500 ms | Durée naturelle |
| Toast | 4 à 8 s | Auto-disparition |
| Éléments de navigation | 7 ± 2 | Loi de Miller |

## Checklist de revue

### Accessibilité
- [ ] Tout élément interactif est atteignable et actionnable au clavier
- [ ] Chaque contrôle a un nom accessible et un rôle exposés aux lecteurs d'écran
- [ ] La couleur n'est jamais le seul porteur d'information
- [ ] Les états de focus sont visibles
- [ ] Pas de bouton imbriqué dans un bouton, pas de `role="button"` sur un enfant de bouton
- [ ] Les overlays sont `role="dialog"` + `aria-modal`, le focus y entre et en revient
- [ ] `prefers-reduced-motion` respecté

### Interaction
- [ ] Une action dominante par écran, la plus visible
- [ ] Actions importantes dans la zone du pouce (bas de l'écran sur mobile)
- [ ] Chaque interaction produit un retour visible
- [ ] Une action destructrice est annulable, ou confirmée sans friction inutile
- [ ] Un toast porteur d'une action annulable expose cette action en bouton

### États
- [ ] État vide : explique et propose l'action suivante, ne se contente pas de constater
- [ ] État de chargement : jamais d'écran figé sans indication
- [ ] État hors ligne : signalé explicitement, jamais silencieux
- [ ] État d'erreur : message près de la cause, en langage humain

### Visuel
- [ ] Espacements issus d'une seule échelle (base 4 ou 8 px)
- [ ] Typographie cohérente, pas de tailles inventées au cas par cas
- [ ] Pas de mur de texte sans hiérarchie ni découpage

### Mobile
- [ ] Testé en portrait et en paysage
- [ ] Safe areas gérées (encoche, barre de geste)
- [ ] Testé en réseau lent et hors ligne
- [ ] Pas de conflit de gestes (scroll interne contre glissement de feuille)

## Anti-patterns à éliminer

1. Cibles tactiles trop petites
2. Retour uniquement par la couleur
3. Absence d'état de chargement
4. Absence d'indication hors ligne
5. Modales à outrance qui interrompent le flux
6. Boutons désactivés sans explication
7. Murs de texte sans hiérarchie
8. Navigation cachée derrière un hamburger sur grand écran
9. Confirmation culpabilisante sur les boutons de refus
10. Chaînes de caractères en dur dans le code ou dans les images
