/* Données POI, Marrakech, séjour d'une semaine.
   Base de calcul des trajets : Hôtel Riu Tikida Garden, Circuit de la Palmeraie.
   Les notes sont l'appréciation de ce guide. Ce ne sont pas des moyennes d'avis
   Google ou TripAdvisor : aucun chiffre d'audience n'est affiché, faute de source
   vérifiable. Les prix de taxi sont des estimations de négociation. */

export const HOTEL = {
  name: "Riu Tikida Garden",
  address: "Circuit de la Palmeraie, 40000 Marrakech",
  lat: 31.6597,
  lng: -7.9752
};

export const CATEGORIES = {
  /* Quatre teintes seulement (terre, safran, zellige, menthe), déclinées en deux
     valeurs chacune : huit catégories restent distinguables sur la carte sans
     faire exploser la palette. */
  resto:    { label: "Restaurants",  icon: "🍽️", color: "#C1543A" },
  souk:     { label: "Souks & shop", icon: "🧺", color: "#9C3F2B" },
  activite: { label: "Activités",    icon: "🐫", color: "#D99A0B" },
  cafe:     { label: "Cafés",        icon: "☕", color: "#8A5A22" },
  monument: { label: "Monuments",    icon: "🕌", color: "#1F6F78" },
  bar:      { label: "Bars & toits", icon: "🍸", color: "#14565E" },
  jardin:   { label: "Jardins",      icon: "🌿", color: "#3E8E7E" },
  escapade: { label: "Escapades",    icon: "🏔️", color: "#2A6350" }
};

/* champs :
   id, nom, cat, lat, lng, note (/5, appréciation de ce guide), prix (1-4), duree,
   desc, tips (array), horaires, reserver (bool), taxi (override optionnel {jour,nuit,note}) */

export const POIS = [
  /* ============ MONUMENTS & PATRIMOINE ============ */
  { id:"jemaa", nom:"Place Jemaa el-Fna", cat:"monument", lat:31.6258, lng:-7.9891,
    note:4.5, prix:0, duree:"1 h à 3 h",
    desc:"Le cœur battant de Marrakech, classée au patrimoine immatériel de l'UNESCO. Vide et écrasée de soleil l'après-midi, elle se remplit vers 18 h : charmeurs de serpents, conteurs, gnaouas, stands de jus d'orange et cuisines de rue montées en vingt minutes.",
    tips:["Y aller au coucher du soleil, jamais à 14 h.","Toute photo d'un animal ou d'un artiste se paie : ayez de la petite monnaie, sinon on n'approche pas.","Les stands de nourriture de la place sont folkloriques mais moyens : mieux vaut manger autour."],
    horaires:"Permanent, magique de 18 h à minuit", reserver:false },

  { id:"koutoubia", nom:"Mosquée Koutoubia", cat:"monument", lat:31.6236, lng:-7.9934,
    note:4.6, prix:0, duree:"30 min",
    desc:"Le minaret almohade du XIIe siècle, 77 m, mètre-étalon de toute l'architecture marocaine et grande sœur de la Giralda de Séville. L'intérieur est fermé aux non-musulmans, mais les jardins qui l'entourent se visitent librement.",
    tips:["Les jardins côté sud au coucher du soleil : la lumière rase sur l'ocre est le meilleur cliché de la ville.","Repère infaillible pour se réorienter quand on est perdu."],
    horaires:"Jardins : 8 h - 20 h", reserver:false },

  { id:"bahia", nom:"Palais de la Bahia", cat:"monument", lat:31.6215, lng:-7.9829,
    note:4.4, prix:1, duree:"1 h",
    desc:"Palais de la fin du XIXe siècle construit pour le grand vizir Ba Ahmed : 150 pièces, huit hectares, des plafonds en cèdre peint et des cours à orangers. Le plus abouti des palais visitables de la médina.",
    tips:["Ouvrir à 9 h pile pour avoir les patios à soi.","Des guides attendent à l'entrée, facultatifs et à négocier.","Se combine parfaitement avec Dar Si Said à 300 m."],
    horaires:"9 h - 17 h, tous les jours", reserver:false },

  { id:"badi", nom:"Palais El Badi", cat:"monument", lat:31.6183, lng:-7.9862,
    note:4.3, prix:1, duree:"1 h",
    desc:"Une ruine grandiose. Le palais du sultan saadien Ahmed al-Mansour, dépouillé de ses marbres par Moulay Ismaïl, ne garde que ses murs de pisé, ses bassins et ses cigognes. La montée sur les remparts offre le meilleur panorama sur la médina et l'Atlas.",
    tips:["Y aller en fin de journée pour la lumière sur les murailles.","Le minbar de la Koutoubia est exposé dans une salle annexe, ne pas le rater."],
    horaires:"9 h - 17 h", reserver:false },

  { id:"saadiens", nom:"Tombeaux Saadiens", cat:"monument", lat:31.6172, lng:-7.9890,
    note:4.2, prix:1, duree:"45 min",
    desc:"Nécropole murée redécouverte en 1917, avec la salle des Douze Colonnes en marbre de Carrare et stuc ciselé, sommet de l'art saadien. Le site est petit, la file peut être longue.",
    tips:["Arriver à l'ouverture : après 11 h on piétine 40 min pour 90 secondes devant la salle.","Juste à côté de la Kasbah et de Bab Agnaou, à enchaîner."],
    horaires:"9 h - 17 h", reserver:false },

  { id:"benyoussef", nom:"Médersa Ben Youssef", cat:"monument", lat:31.6318, lng:-7.9866,
    note:4.7, prix:1, duree:"1 h",
    desc:"L'ancienne plus grande école coranique du Maghreb, rouverte en 2022 après quatre ans de restauration. Cour de marbre, zelliges, cèdre sculpté et 130 cellules d'étudiants à l'étage : c'est le plus beau monument de la ville, sans discussion.",
    tips:["Le clou du séjour côté patrimoine, à ne pas sacrifier.","Monter à l'étage dans les cellules, presque personne ne le fait.","Billet combiné possible avec le Musée de Marrakech voisin."],
    horaires:"9 h - 18 h", reserver:false },

  { id:"darelbacha", nom:"Dar El Bacha, Musée des Confluences", cat:"monument", lat:31.6320, lng:-7.9925,
    note:4.5, prix:1, duree:"1 h",
    desc:"L'ancienne résidence du pacha Thami El Glaoui, restaurée avec un soin rare. Patio à zelliges noir et blanc, expositions temporaires, et surtout le Bacha Coffee installé dans une aile du palais.",
    tips:["Visite + café dans la foulée : la meilleure heure et demie de la médina.","Fermé le mardi."],
    horaires:"10 h - 18 h, fermé mardi", reserver:false },

  { id:"maisonphoto", nom:"Maison de la Photographie", cat:"monument", lat:31.6325, lng:-7.9855,
    note:4.6, prix:1, duree:"1 h",
    desc:"Un riad transformé en fonds photographique : 10 000 clichés du Maroc de 1870 à 1950, tirages d'époque et un film rare de Daniel Chicault sur le Haut Atlas des années 50. Petite terrasse-café au sommet avec vue sur les toits.",
    tips:["Peu fréquenté, parfait quand la médina sature.","La terrasse fait un déjeuner léger et calme."],
    horaires:"9 h 30 - 19 h", reserver:false },

  { id:"darsisaid", nom:"Musée Dar Si Saïd", cat:"monument", lat:31.6236, lng:-7.9840,
    note:4.3, prix:1, duree:"45 min",
    desc:"Musée national du tapis et des arts du bois, dans un palais du XIXe. Collections d'artisanat berbère de l'Atlas et du Sud, présentées dans une scénographie enfin moderne.",
    tips:["À 5 min à pied de la Bahia, à combiner.","Excellent avant d'aller acheter un tapis : on apprend à lire les motifs."],
    horaires:"9 h - 17 h, fermé mardi", reserver:false },

  { id:"babagnaou", nom:"Bab Agnaou & Kasbah", cat:"monument", lat:31.6180, lng:-7.9903,
    note:4.3, prix:0, duree:"30 min",
    desc:"La plus belle porte almohade de la ville, en grès bleuté, entrée monumentale du quartier de la Kasbah. Autour : la mosquée de la Kasbah, un souk local moins touristique et de bonnes adresses de rue.",
    tips:["Quartier idéal pour un début de matinée tranquille.","Se traverse pour rejoindre les Tombeaux Saadiens."],
    horaires:"Permanent", reserver:false },

  { id:"tanneries", nom:"Tanneries de Bab Debbagh", cat:"monument", lat:31.6353, lng:-7.9800,
    note:3.6, prix:1, duree:"45 min",
    desc:"Les bassins de teinture à ciel ouvert, en activité depuis le Moyen Âge. Spectaculaire visuellement, éprouvant olfactivement, et surtout le terrain de chasse le plus agressif de la ville pour les faux guides.",
    tips:["Vraie mise en garde : ne suivez personne qui vous aborde dans la rue. Passez par une tannerie qui affiche un tarif à l'entrée.","Compter 50 MAD de pourboire, pas 500.","Le bouquet de menthe donné à l'entrée n'est pas un cadeau : il se paie."],
    horaires:"8 h - 17 h, le matin est le plus actif", reserver:false },

  { id:"remparts", nom:"Remparts & Bab Doukkala", cat:"monument", lat:31.6330, lng:-7.9975,
    note:4.2, prix:0, duree:"1 h",
    desc:"19 km de murailles de pisé ocre du XIIe siècle, ponctuées de portes monumentales. Le tour en calèche depuis la place des Ferblantiers est le cliché assumé qui fonctionne quand même.",
    tips:["Calèche à négocier avant de monter, jamais après.","Meilleure lumière : une heure avant le coucher du soleil."],
    horaires:"Permanent", reserver:false },

  /* ============ JARDINS ============ */
  { id:"majorelle", nom:"Jardin Majorelle", cat:"jardin", lat:31.6417, lng:-8.0033,
    note:4.5, prix:2, duree:"1 h 30",
    desc:"Le jardin d'atelier de Jacques Majorelle, sauvé par Yves Saint Laurent et Pierre Bergé. Bambouseraie, cactées, bassins et le fameux bleu outremer. Ultra fréquenté, mais la densité végétale rachète tout.",
    tips:["Réserver en ligne, créneau 8 h : c'est la seule façon de le voir sans la foule.","Billet combiné avec le musée Berbère et le YSL voisin.","Prévoir 1 h de battement entre Majorelle et YSL."],
    horaires:"8 h - 18 h", reserver:true },

  { id:"ysl", nom:"Musée Yves Saint Laurent", cat:"jardin", lat:31.6410, lng:-8.0027,
    note:4.5, prix:2, duree:"1 h",
    desc:"Un bâtiment de brique en dentelle signé Studio KO, abritant une sélection tournante de la garde-robe haute couture d'YSL, une salle d'exposition temporaire, une librairie et un très bon café.",
    tips:["À 100 m de Majorelle, même billetterie combinée.","Le café du musée est un repli au calme, climatisé, pour la mi-journée."],
    horaires:"10 h - 18 h 30, fermé mercredi", reserver:true },

  { id:"jardinsecret", nom:"Le Jardin Secret", cat:"jardin", lat:31.6295, lng:-7.9885,
    note:4.5, prix:1, duree:"1 h",
    desc:"Un riad-palais du XIXe restauré au cœur de la médina, avec deux jardins, l'un islamique, l'autre exotique, et une tour de 17 m qui offre une vue plongeante sur les toits.",
    tips:["Le meilleur endroit pour souffler entre deux souks.","Monter la tour, supplément modique mais vue imbattable.","Le café-terrasse sert un bon thé, sans arnaque."],
    horaires:"9 h 30 - 18 h 30", reserver:false },

  { id:"menara", nom:"Jardins de la Ménara", cat:"jardin", lat:31.6136, lng:-8.0219,
    note:4.1, prix:0, duree:"1 h",
    desc:"Un immense bassin almohade bordé d'oliviers, avec le pavillon saadien et, les jours clairs, l'Atlas enneigé en arrière-plan. Simple, vaste, très fréquenté par les familles marrakchies le week-end.",
    tips:["Le parc est gratuit, seul le pavillon est payant.","Fin d'après-midi : reflet de l'Atlas dans le bassin."],
    horaires:"7 h - 18 h", reserver:false },

  { id:"cyberpark", nom:"Cyber Parc Arsat Moulay Abdeslam", cat:"jardin", lat:31.6255, lng:-7.9950,
    note:4.2, prix:0, duree:"30 min",
    desc:"Jardin historique reconverti en parc public arboré, entre la Koutoubia et Gueliz. Ombre, wifi gratuit, allées calmes : le meilleur raccourci piéton entre la médina et la ville nouvelle.",
    tips:["Traversée à pied gratuite et ombragée plutôt que le trottoir de l'avenue Mohammed V."],
    horaires:"8 h - 18 h 30", reserver:false },

  { id:"palmeraie", nom:"La Palmeraie", cat:"jardin", lat:31.6790, lng:-7.9500,
    note:3.9, prix:0, duree:"2 h",
    desc:"13 000 hectares de palmiers au nord de la ville, votre quartier. Balade à dromadaire au coucher du soleil, quads, buggies et clubs de plage-piscine. Touristique et assumé, mais tout est à cinq minutes de l'hôtel.",
    tips:["Vous logez dedans : c'est l'activité la moins chère du séjour en taxi.","Dromadaire au coucher du soleil, prix à négocier avant de monter."],
    horaires:"Permanent", reserver:false },

  /* ============ SOUKS & SHOPPING ============ */
  { id:"souks", nom:"Souks de la médina", cat:"souk", lat:31.6285, lng:-7.9878,
    note:4.3, prix:0, duree:"2 h à 4 h",
    desc:"Un labyrinthe organisé par corporations : Semmarine (textile), Attarine (épices), Haddadine (fer), Cherratine (cuir), Chouari (bois). Le vrai plaisir est de s'y perdre volontairement une matinée.",
    tips:["Négocier : partir à 30-40 % du prix annoncé, viser 50 %.","Payer en liquide, avoir de la petite monnaie.","Refuser poliment les guides spontanés : « non merci » et continuer sans s'arrêter."],
    horaires:"9 h - 20 h, plus calme le vendredi midi", reserver:false },

  { id:"rahba", nom:"Rahba Lakdima (place aux épices)", cat:"souk", lat:31.6296, lng:-7.9873,
    note:4.4, prix:0, duree:"1 h",
    desc:"La petite place des herboristes et des vanniers, entourée de terrasses. Point de repère indispensable dans le dédale et un des meilleurs endroits pour observer sans être happé.",
    tips:["Le Nomad et le Café des Épices donnent tous les deux dessus.","Bons paniers en palmier, à négocier fermement."],
    horaires:"9 h - 19 h", reserver:false },

  { id:"soukelkhemis", nom:"Souk El Khemis (brocante)", cat:"souk", lat:31.6470, lng:-7.9820,
    note:4.0, prix:0, duree:"1 h 30",
    desc:"Le marché aux puces du nord de la médina : portes anciennes, luminaires, mobilier chiné, quincaillerie. Zéro tourisme, prix réels, mais il faut aimer fouiller.",
    tips:["Aller le matin.","Prévoir un taxi qui attend : peu de retours faciles depuis là-bas."],
    horaires:"9 h - 17 h", reserver:false },

  { id:"33rueMajorelle", nom:"33 Rue Majorelle (concept store)", cat:"souk", lat:31.6414, lng:-8.0022,
    note:4.4, prix:3, duree:"45 min",
    desc:"Un concept store qui réunit une centaine de créateurs marocains : babouches revisitées, bijoux, céramiques, prêt-à-porter. Prix fixes et élevés, mais qualité et sourcing irréprochables.",
    tips:["Idéal pour les cadeaux quand on n'a plus l'énergie de négocier.","Juste en face de Majorelle, à enchaîner."],
    horaires:"9 h 30 - 19 h", reserver:false },

  { id:"ensemble", nom:"Ensemble Artisanal", cat:"souk", lat:31.6273, lng:-7.9955,
    note:3.9, prix:2, duree:"45 min",
    desc:"Coopérative d'État avec prix affichés et artisans au travail dans des ateliers ouverts. On n'y fait pas la meilleure affaire, mais on y apprend les vrais niveaux de prix avant d'attaquer les souks.",
    tips:["Faites-y votre repérage tarifaire le premier jour, vous négocierez mieux ensuite."],
    horaires:"9 h - 19 h", reserver:false },

  /* ============ RESTAURANTS ============ */
  { id:"nomad", nom:"Nomad", cat:"resto", lat:31.6296, lng:-7.9871,
    note:4.4, prix:3, duree:"1 h 30",
    desc:"L'adresse qui a lancé la cuisine marocaine moderne à Marrakech. Quatre niveaux de terrasses au-dessus de la place aux épices, carte courte et nette : calamars grillés au cumin, tajine d'agneau revisité, salades croquantes.",
    tips:["Réserver impérativement, et demander le dernier niveau.","Coucher de soleil vers 18 h 30 : la meilleure table de la médina à cette heure-là.","Compter 250-350 MAD par personne."],
    horaires:"12 h - 23 h", reserver:true },

  { id:"lejardin", nom:"Le Jardin", cat:"resto", lat:31.6304, lng:-7.9884,
    note:4.3, prix:2, duree:"1 h 30",
    desc:"Une cour verte à bananiers dissimulée derrière une porte anonyme du souk, avec des tortues qui traversent la salle. Cuisine simple et fraîche, service détendu, boutique de fringues à l'étage.",
    tips:["Parfait pour un déjeuner à l'ombre au milieu d'une matinée de souks.","Même maison que Nomad, mêmes standards."],
    horaires:"12 h - 23 h", reserver:true },

  { id:"terrasseepices", nom:"La Terrasse des Épices", cat:"resto", lat:31.6310, lng:-7.9880,
    note:4.2, prix:2, duree:"1 h 30",
    desc:"Grand rooftop en L avec des alcôves privatives et souvent un musicien en fin de semaine. Cuisine marocaine et méditerranéenne honnête, ambiance sûre pour un premier soir.",
    tips:["Demander une alcôve d'angle côté Atlas.","Moins couru que Nomad, donc réservable plus tard."],
    horaires:"12 h - 23 h", reserver:true },

  { id:"daryacout", nom:"Dar Yacout", cat:"resto", lat:31.6355, lng:-7.9905,
    note:4.4, prix:4, duree:"3 h",
    desc:"Le grand dîner marocain à l'ancienne, dans un palais signé Bill Willis : apéritif sur le toit face à l'Atlas, puis descente vers une enfilade de salons pour un menu unique en dix services. Théâtral, cher, mémorable.",
    tips:["À réserver plusieurs jours à l'avance, menu unique et addition élevée.","Faites-vous déposer place Bab Doukkala, l'accès est un dédale de ruelles.","Tenue soignée."],
    horaires:"Dîner uniquement, 19 h 30 - 23 h, fermé lundi", reserver:true },

  { id:"foundouk", nom:"Le Foundouk", cat:"resto", lat:31.6320, lng:-7.9860,
    note:4.3, prix:3, duree:"2 h",
    desc:"Un ancien caravansérail transformé en restaurant sur trois niveaux, décor noir et lanternes, carte franco-marocaine. Une des valeurs les plus sûres de la médina nord, à deux pas de Ben Youssef.",
    tips:["Le rooftop en haut est la meilleure partie.","Idéal en dîner après une journée médersa + musées."],
    horaires:"12 h - 0 h, fermé lundi", reserver:true },

  { id:"alfassia", nom:"Al Fassia", cat:"resto", lat:31.6373, lng:-8.0110,
    note:4.4, prix:3, duree:"2 h",
    desc:"Restaurant entièrement tenu par des femmes depuis 1987, et la référence de la cuisine fassie à Marrakech. Pas de menu imposé, on commande à la carte : tajine d'agneau aux coings, pastilla de pigeon, mechoui.",
    tips:["La meilleure cuisine marocaine traditionnelle de la ville, loin du folklore.","Réserver 2-3 jours avant, surtout la maison de Gueliz.","Le tajine d'agneau aux coings n'est pas négociable."],
    horaires:"12 h - 14 h 30 et 19 h 30 - 23 h, fermé mardi", reserver:true },

  { id:"amal", nom:"Amal Association (restaurant solidaire)", cat:"resto", lat:31.6389, lng:-8.0142,
    note:4.7, prix:1, duree:"1 h",
    desc:"Une association qui forme des femmes en difficulté aux métiers de la restauration. Menu du jour qui change quotidiennement, cuisine familiale marocaine excellente, prix dérisoires, terrasse simple sous les arbres.",
    tips:["Le meilleur rapport qualité-prix-sens du séjour.","Déjeuner uniquement, arriver avant 13 h.","Ils proposent aussi des cours de cuisine le matin, à réserver."],
    horaires:"12 h - 15 h 30", reserver:false },

  { id:"latrattoria", nom:"La Trattoria", cat:"resto", lat:31.6350, lng:-8.0090,
    note:4.4, prix:3, duree:"2 h",
    desc:"Institution italienne de Gueliz depuis 1993, dans une villa décorée par Bill Willis, avec piscine éclairée et bar à cocktails. La respiration idéale au milieu d'une semaine de tajines.",
    tips:["Table au bord de la piscine à demander.","Carte des vins marocains sérieuse."],
    horaires:"19 h 30 - 23 h 30", reserver:true },

  { id:"plus61", nom:"+61", cat:"resto", lat:31.6362, lng:-8.0131,
    note:4.5, prix:3, duree:"2 h",
    desc:"Bistrot australo-méditerranéen de Gueliz : produits du marché, cuisson au feu de bois, petites assiettes à partager, vins nature. Le repas le plus contemporain de Marrakech.",
    tips:["Réserver, la salle est petite.","Parfait si vous saturez de la cuisine traditionnelle en milieu de séjour."],
    horaires:"19 h - 23 h, fermé dimanche", reserver:true },

  { id:"mechoui", nom:"Mechoui Alley (Chez Lamine)", cat:"resto", lat:31.6266, lng:-7.9887,
    note:4.3, prix:1, duree:"45 min",
    desc:"La ruelle des fours à mechoui, juste au nord de Jemaa el-Fna : l'agneau cuit toute la nuit dans un four enterré, servi au poids avec du pain, du cumin et du sel. Debout ou sur un banc, sans chichi.",
    tips:["Y aller vers 12 h 30 : à 14 h l'agneau est épuisé.","On paie au poids : un demi-kilo suffit pour deux.","L'expérience de rue la plus authentique de la ville."],
    horaires:"11 h - 15 h", reserver:false },

  { id:"cafeclock", nom:"Café Clock (Kasbah)", cat:"resto", lat:31.6178, lng:-7.9877,
    note:4.3, prix:2, duree:"1 h 30",
    desc:"Maison culturelle autant que restaurant : burger de chameau, cours de calligraphie, concerts gnaoua le soir et sessions de contes en darija et en anglais. Public mêlé de locaux et de voyageurs.",
    tips:["Regarder leur programme de la semaine en arrivant, les concerts sont gratuits.","Terrasse au dernier étage."],
    horaires:"9 h - 22 h", reserver:false },

  { id:"naranj", nom:"Naranj", cat:"resto", lat:31.6249, lng:-7.9840,
    note:4.5, prix:2, duree:"1 h 30",
    desc:"Le meilleur libanais de la médina, sur la rue Riad Zitoun Jdid : mezzés, houmous, taboulé et grillades impeccables dans une salle claire et climatisée.",
    tips:["Excellent déjeuner en sortant du palais de la Bahia, à 200 m.","Pas d'alcool, service rapide."],
    horaires:"12 h - 23 h", reserver:false },

  { id:"salama", nom:"Le Salama", cat:"resto", lat:31.6262, lng:-7.9884,
    note:4.1, prix:3, duree:"2 h",
    desc:"À deux pas de Jemaa el-Fna, un décor colonial années 30 sur trois étages, carte marocaine solide, bar à cocktails et rooftop avec vue directe sur la place. Une des rares adresses qui sert de l'alcool en pleine médina.",
    tips:["Y monter pour un verre à l'heure où la place s'allume.","La cuisine est correcte sans plus : venir surtout pour la vue."],
    horaires:"12 h - 1 h", reserver:true },

  { id:"pepenero", nom:"Pepe Nero", cat:"resto", lat:31.6229, lng:-7.9836,
    note:4.4, prix:4, duree:"2 h",
    desc:"Dans un riad du Riad Zitoun, un menu qui joue sur deux tableaux : moitié italien, moitié marocain, autour d'une piscine éclairée aux bougies. Le dîner romantique classique de la médina.",
    tips:["Réserver une table au bord du bassin.","Tenue correcte exigée, ambiance feutrée."],
    horaires:"19 h 30 - 23 h, fermé lundi", reserver:true },

  { id:"beldi", nom:"Beldi Country Club", cat:"resto", lat:31.5822, lng:-8.0328,
    note:4.6, prix:4, duree:"Une journée",
    desc:"À 10 km au sud, une roseraie de trois hectares avec deux piscines, un hammam, des ateliers de tissage et un restaurant sous les oliviers. La journée d'échappée la plus civilisée depuis Marrakech.",
    tips:["À réserver : les day pass partent vite le week-end.","Le meilleur plan pour la journée la plus chaude de la semaine.","Demander au taxi de revenir vous chercher à heure fixe."],
    horaires:"10 h - 19 h", reserver:true },

  /* ============ CAFÉS ============ */
  { id:"bacha", nom:"Bacha Coffee", cat:"cafe", lat:31.6320, lng:-7.9924,
    note:4.5, prix:3, duree:"1 h",
    desc:"Dans une aile de Dar El Bacha, plus de 200 cafés d'origine servis dans des théières dorées, salle jaune et noire spectaculaire, brunch et pâtisseries. Ni discret ni bon marché, mais visuellement imparable.",
    tips:["File d'attente réelle : venir à l'ouverture ou après 16 h.","À enchaîner avec la visite du musée, même bâtiment.","Leurs cafés en boîte font un très bon souvenir à rapporter."],
    horaires:"10 h - 19 h", reserver:false },

  { id:"cafeepices", nom:"Café des Épices", cat:"cafe", lat:31.6297, lng:-7.9872,
    note:4.2, prix:1, duree:"45 min",
    desc:"Le café-terrasse historique de la place aux épices : trois niveaux, jus frais, sandwichs, wifi et une vue plongeante sur les vanniers. Simple, pas cher, toujours plein.",
    tips:["Le poste d'observation le moins cher de la médina.","Nescafé au menu, mais aussi de vrais espressos, préciser."],
    horaires:"9 h - 22 h", reserver:false },

  { id:"grandcafeposte", nom:"Grand Café de la Poste", cat:"cafe", lat:31.6337, lng:-8.0059,
    note:4.2, prix:3, duree:"1 h 30",
    desc:"Brasserie de 1925 en plein Gueliz, ventilateurs au plafond, banquettes de cuir et service en tenue. Bon petit-déjeuner, bon bar en soirée, ambiance Casablanca assumée.",
    tips:["Le meilleur petit-déjeuner à l'européenne de la ville.","Bar animé après 19 h."],
    horaires:"8 h - 1 h", reserver:false },

  { id:"cafearabe", nom:"Café Arabe", cat:"cafe", lat:31.6312, lng:-7.9877,
    note:4.2, prix:2, duree:"1 h",
    desc:"Riad du souk avec patio à bassin au rez-de-chaussée et rooftop au sommet. Carte italo-marocaine, cocktails servis, et une des rares terrasses qui reste agréable en plein après-midi.",
    tips:["Alcool servi, ce qui est rare dans ce périmètre.","Vue dégagée sur la Koutoubia et l'Atlas depuis le toit."],
    horaires:"11 h - 0 h", reserver:false },

  { id:"lmida", nom:"L'Mida Rooftop", cat:"cafe", lat:31.6288, lng:-7.9861,
    note:4.4, prix:2, duree:"1 h 30",
    desc:"Petite terrasse contemporaine face aux toits de la médina, cuisine marocaine légère et bien tournée, déco vert et terracotta très photogénique.",
    tips:["Réserver pour le coucher du soleil, il n'y a qu'une douzaine de tables.","Bonne alternative quand Nomad est complet."],
    horaires:"11 h - 23 h", reserver:true },

  { id:"16cafe", nom:"Café 16", cat:"cafe", lat:31.6344, lng:-8.0083,
    note:4.0, prix:2, duree:"45 min",
    desc:"Sur la place du 16 Novembre à Gueliz, terrasse ombragée, glaces, pâtisseries et un excellent poste d'observation de la Marrakech qui travaille.",
    tips:["Pause climatisée entre deux courses à Gueliz.","Wifi correct pour bosser une heure."],
    horaires:"7 h - 23 h", reserver:false },

  /* ============ BARS & ROOFTOPS ============ */
  { id:"elfenn", nom:"Rooftop El Fenn", cat:"bar", lat:31.6265, lng:-7.9926,
    note:4.6, prix:4, duree:"2 h",
    desc:"Le plus beau rooftop de la médina : 600 m² de terrasses blanches et roses au-dessus des toits, face à la Koutoubia, dans un riad-hôtel bourré d'art contemporain. Cocktails soignés, déjeuner léger, musique douce.",
    tips:["Y aller pour le coucher du soleil, réserver, minimum de consommation possible en haute saison.","Le plus beau moment du séjour pour un apéro à deux.","Visiter la collection d'art dans les couloirs en montant."],
    horaires:"11 h - 23 h", reserver:true },

  { id:"kabana", nom:"Kabana Rooftop", cat:"bar", lat:31.6241, lng:-7.9915,
    note:4.3, prix:3, duree:"2 h",
    desc:"Rooftop face à la Koutoubia, DJ dès la fin d'après-midi, cuisine fusion et cocktails. Plus jeune et plus sonore qu'El Fenn, très efficace pour un apéro qui glisse vers la soirée.",
    tips:["Vue frontale sur le minaret éclairé.","Réserver le week-end, ça se remplit vite après 19 h."],
    horaires:"12 h - 1 h", reserver:true },

  { id:"barometre", nom:"Le Baromètre", cat:"bar", lat:31.6356, lng:-8.0104,
    note:4.6, prix:3, duree:"2 h",
    desc:"Bar à cocktails de laboratoire, à Gueliz : mixologie moléculaire, épices marocaines, alambics et service au comptoir. Le meilleur bar à cocktails de la ville, sans discussion.",
    tips:["S'installer au bar plutôt qu'en salle et laisser le barman choisir.","Réserver le week-end, la salle est minuscule."],
    horaires:"18 h - 1 h, fermé dimanche", reserver:true },

  { id:"skybarpearl", nom:"Sky Bar (The Pearl)", cat:"bar", lat:31.6333, lng:-8.0053,
    note:4.2, prix:4, duree:"2 h",
    desc:"Bar de piscine au sommet d'un hôtel de Gueliz, vue à 360° sur la ville et l'Atlas, ambiance lounge. Cher, mais le panorama vaut le premier verre.",
    tips:["Arriver 30 min avant le coucher du soleil pour la table de bord.","Tenue soignée."],
    horaires:"17 h - 1 h", reserver:true },

  { id:"bozin", nom:"Bô & Zin", cat:"bar", lat:31.5925, lng:-8.0005,
    note:4.3, prix:4, duree:"3 h",
    desc:"Sur la route de l'Ourika, un restaurant-jardin qui bascule en club après minuit : cuisine asiatique, feux, live band puis DJ. L'institution de la nuit marrakchie depuis vingt ans.",
    tips:["Dîner 21 h, ambiance à partir de 23 h 30.","Négocier le retour avec le taxi à l'aller, ou faire appeler un taxi par l'établissement.","Compter le double du tarif taxi après minuit."],
    horaires:"19 h 30 - 3 h", reserver:true },

  { id:"theatro", nom:"Théâtro", cat:"bar", lat:31.6288, lng:-8.0122,
    note:4.2, prix:4, duree:"4 h",
    desc:"Ancien théâtre transformé en club, dans l'Hivernage : scénographie de spectacle, performeurs, house et hits internationaux. La grosse nuit de Marrakech.",
    tips:["Rien ne commence avant 1 h du matin.","Entrée souvent 200-300 MAD avec conso.","Prévoir le retour : taxi négocié à la sortie, tarif de nuit."],
    horaires:"0 h - 5 h", reserver:false },

  /* ============ ACTIVITÉS ============ */
  { id:"hammambains", nom:"Les Bains de Marrakech", cat:"activite", lat:31.6190, lng:-7.9868,
    note:4.5, prix:3, duree:"2 h",
    desc:"Spa haut de gamme de la Kasbah : hammam traditionnel, gommage au savon noir, enveloppement au ghassoul, massage à l'huile d'argan, piscine. Le rituel complet, en version confortable.",
    tips:["Le tarif dépend du nombre de soins enchaînés.","Réserver 48 h à l'avance.","À caler le jour où vous êtes épuisés par les souks, pas le premier jour."],
    horaires:"9 h - 20 h", reserver:true },

  { id:"hammamrose", nom:"Hammam de la Rose", cat:"activite", lat:31.6318, lng:-7.9930,
    note:4.6, prix:2, duree:"1 h 30",
    desc:"Hammam de quartier haut de gamme mais accessible, très bien noté, produits naturels et personnel formé. Le meilleur rapport qualité-prix de la médina pour un premier hammam.",
    tips:["Formules bien moins chères que les grands spas.","Réserver la veille, créneaux séparés hommes et femmes selon les heures."],
    horaires:"10 h - 20 h", reserver:true },

  { id:"cuisineamal", nom:"Cours de cuisine (Amal / La Maison Arabe)", cat:"activite", lat:31.6330, lng:-7.9930,
    note:4.8, prix:2, duree:"3 h",
    desc:"Deux formules : chez Amal, atelier associatif simple et chaleureux le matin ; à La Maison Arabe, cours en cuisine professionnelle avec dada, tajine et pastilla, puis déjeuner de ce qu'on a préparé.",
    tips:["Deux niveaux de prix très différents selon la formule.","Réserver 3-4 jours avant.","On repart avec les recettes et de quoi refaire un vrai tajine à Rouen."],
    horaires:"Sessions à 9 h 30 et 15 h", reserver:true },

  { id:"calèche", nom:"Calèche autour des remparts", cat:"activite", lat:31.6215, lng:-7.9860,
    note:4.0, prix:2, duree:"1 h",
    desc:"Départ de la place des Ferblantiers ou de Jemaa el-Fna, tour des remparts, de la Ménara et de Gueliz. Kitsch, lent, et pourtant la meilleure façon de comprendre la géographie de la ville.",
    tips:["Fixez le prix avant de monter, les tarifs annoncés varient du simple au triple.","Vérifier l'état du cheval avant de monter, tous les cochers ne se valent pas."],
    horaires:"9 h - 20 h", reserver:false },

  { id:"montgolfiere", nom:"Vol en montgolfière", cat:"activite", lat:31.7550, lng:-7.9500,
    note:4.7, prix:4, duree:"4 h avec transferts",
    desc:"Décollage au lever du soleil au nord de la ville, une heure de vol au-dessus de la palmeraie, des villages berbères et de la plaine du Haouz avec l'Atlas en fond, puis petit-déjeuner sous tente.",
    tips:["Les transferts depuis l'hôtel sont compris dans le prix.","Départ vers 5 h 30 du matin, à caler en milieu de séjour.","Réserver au moins 3 jours avant, annulé si vent."],
    horaires:"Lever du soleil", reserver:true,
    taxi:{ jour:0, nuit:0, note:"Transfert aller-retour à l'hôtel inclus dans la prestation" } },

  { id:"quad", nom:"Quad & dromadaire en Palmeraie", cat:"activite", lat:31.6820, lng:-7.9460,
    note:4.3, prix:2, duree:"2 h",
    desc:"Circuits de quad ou de buggy dans les pistes de la palmeraie, souvent combinés avec une balade à dromadaire et un thé sous tente berbère. C'est juste derrière votre hôtel.",
    tips:["Le prix se négocie sur place, comparez deux prestataires.","Prendre le créneau de fin d'après-midi, il fait moins chaud et la lumière est meilleure.","Lunettes et foulard indispensables, ça poussière sévèrement."],
    horaires:"9 h - 18 h", reserver:true },

  { id:"golfamelkis", nom:"Golf d'Amelkis", cat:"activite", lat:31.5938, lng:-7.9541,
    note:4.4, prix:4, duree:"Une demi-journée",
    desc:"27 trous dessinés par Cabell Robinson, palmiers, oliviers et l'Atlas en toile de fond, sur la route de Ouarzazate. Un des plus beaux parcours du Maroc.",
    tips:["Clubs en location sur place, inutile d'emporter les vôtres.","Réserver le départ, 7 h 30 en été."],
    horaires:"7 h - 18 h", reserver:true },

  /* ============ ESCAPADES À PROXIMITÉ ============ */
  { id:"agafay", nom:"Désert d'Agafay", cat:"escapade", lat:31.4650, lng:-8.1520,
    note:4.5, prix:3, duree:"Demi-journée ou nuit",
    desc:"À 35 km, un désert de pierre et de collines lunaires avec l'Atlas en arrière-plan. Camps de tentes de luxe, dîner au coucher du soleil, feu, musique gnaoua et ciel étoilé. Ce n'est pas le Sahara, mais c'est à 45 minutes.",
    tips:["Les camps assurent le transfert depuis l'hôtel, vérifiez-le avant de réserver.","Les nuits sont froides même en été, prendre une veste."],
    horaires:"Départ 16 h pour le coucher du soleil", reserver:true,
    taxi:{ jour:450, nuit:600, note:"Aller-retour grand taxi avec attente, ou transfert inclus dans la formule du camp" } },

  { id:"ourika", nom:"Vallée de l'Ourika & Setti Fatma", cat:"escapade", lat:31.2242, lng:-7.7929,
    note:4.4, prix:2, duree:"Une journée",
    desc:"À 65 km au sud, une vallée verte le long de l'oued, des villages berbères, des cafés-terrasses les pieds dans l'eau et la randonnée des sept cascades depuis Setti Fatma. L'échappée fraîcheur classique.",
    tips:["Partir tôt, 8 h, pour éviter la foule du week-end.","Un guide local aux cascades est utile, le sentier glisse.","Chaussures fermées obligatoires."],
    horaires:"Journée", reserver:false,
    taxi:{ jour:600, nuit:0, note:"Grand taxi à la journée avec chauffeur et attente, à négocier la veille" } },

  { id:"anima", nom:"Jardin Anima d'André Heller", cat:"escapade", lat:31.4556, lng:-7.9373,
    note:4.6, prix:2, duree:"3 h",
    desc:"À 27 km sur la route de l'Ourika, un jardin d'artiste onirique : sculptures de Keith Haring et Picasso, bambous, cactées géantes, salle vidéo souterraine et café-restaurant. Beaucoup moins couru que Majorelle et bien plus fort.",
    tips:["La navette aller-retour est comprise dans le billet, au départ du parking de la Koutoubia.","Le meilleur jardin des environs, très loin devant la Ménara.","Prévoir le déjeuner sur place, le Paul Bowles Café est bon."],
    horaires:"9 h - 17 h 30", reserver:true,
    taxi:{ jour:350, nuit:0, note:"Aller-retour avec attente, ou navette gratuite du jardin depuis le centre-ville" } },

  { id:"takerkoust", nom:"Lac Lalla Takerkoust", cat:"escapade", lat:31.3604, lng:-8.1331,
    note:4.3, prix:2, duree:"Une journée",
    desc:"À 40 km, un lac de barrage bordé de guinguettes, de terrasses au bord de l'eau, de jet-ski et de quads. Déjeuner de poisson grillé face à l'Atlas, bien plus calme qu'Agafay.",
    tips:["Se combine très bien avec Agafay dans la même journée.","Le Relais du Lac et Le Flouka pour déjeuner."],
    horaires:"Journée", reserver:false,
    taxi:{ jour:500, nuit:0, note:"Grand taxi à la journée avec attente" } },

  { id:"imlil", nom:"Imlil & Haut Atlas", cat:"escapade", lat:31.1370, lng:-7.9190,
    note:4.7, prix:3, duree:"Une journée",
    desc:"À 65 km, le village de départ des ascensions du Toubkal, à 1 740 m : sentiers muletiers, cascades, villages berbères en terrasses et déjeuner chez l'habitant. Vingt degrés de moins qu'en ville.",
    tips:["Randonnée facile Imlil-Aroumd, 2 h aller-retour, faisable sans guide.","Prendre un guide local sur place pour monter plus haut.","Prévoir une polaire même en juin."],
    horaires:"Journée", reserver:false,
    taxi:{ jour:700, nuit:0, note:"Grand taxi à la journée avec chauffeur et attente" } },

  { id:"ouzoud", nom:"Cascades d'Ouzoud", cat:"escapade", lat:32.0155, lng:-6.7195,
    note:4.5, prix:3, duree:"Journée complète",
    desc:"À 150 km au nord-est, 110 m de chutes en trois paliers, des macaques de Barbarie en liberté, des barques au pied des cascades et des restaurants en surplomb. Longue route, mais spectaculaire.",
    tips:["3 h de route à l'aller : départ 7 h impératif.","Passer par une excursion organisée est plus rentable qu'un taxi privé.","Ne pas nourrir les singes."],
    horaires:"Journée complète", reserver:true,
    taxi:{ jour:900, nuit:0, note:"Excursion organisée à 25-45 € par personne, déjeuner compris : bien plus rentable que le taxi privé" } },

  { id:"essaouira", nom:"Essaouira", cat:"escapade", lat:31.5085, lng:-9.7595,
    note:4.7, prix:3, duree:"Journée ou 2 jours",
    desc:"À 175 km, la cité portuaire fortifiée d'Orson Welles et de Jimi Hendrix : remparts blancs et bleus, port de pêche, poissons grillés sur le quai, plage de kitesurf et médina classée UNESCO. Le contrepoint parfait à la chaleur de Marrakech.",
    tips:["3 h de route. Supratours dépose en plein centre, CTM non.","Si vous avez une seule escapade à faire, hésitez entre celle-ci et l'Atlas.","Idéalement y dormir une nuit plutôt que faire l'aller-retour."],
    horaires:"Journée complète", reserver:false,
    taxi:{ jour:1400, nuit:0, note:"Taxi privé aller-retour. Le bus est très largement préférable : 90 MAD chez CTM, 100 à 140 MAD chez Supratours" } }
];

/* Photos : slug d'article Wikipédia. L'app charge la vignette via l'API REST de
   Wikipédia et la met en cache. Si le réseau est coupé ou l'article sans image,
   on retombe sur le visuel zellige généré. */
export const WIKI = {
  /* Uniquement les lieux qui ont leur propre article : la vignette montre alors
     bien ce lieu. Les slugs génériques (Café, Riad, Tajine) ont été retirés,
     ils affichaient une photo sans rapport avec l'adresse. Les autres gardent
     le visuel zellige généré, qui n'induit personne en erreur. */
  jemaa:"Place_Jemaa_el-Fna",
  koutoubia:"Koutoubia",
  bahia:"Palais_de_la_Bahia",
  badi:"Palais_El_Badi",
  saadiens:"Tombeaux_saadiens",
  benyoussef:"Médersa_Ben_Youssef",
  darelbacha:"Dar_el_Bacha",
  darsisaid:"Musée_Dar_Si_Saïd",
  babagnaou:"Bab_Agnaou",
  remparts:"Médina_de_Marrakech",
  majorelle:"Jardin_Majorelle",
  ysl:"Musée_Yves_Saint_Laurent_de_Marrakech",
  menara:"Ménara_(Marrakech)",
  palmeraie:"Palmeraie_de_Marrakech",
  agafay:"Désert_d'Agafay",
  ourika:"Ourika",
  takerkoust:"Barrage_Lalla_Takerkoust",
  imlil:"Imlil",
  ouzoud:"Cascades_d'Ouzoud",
  essaouira:"Essaouira"
};

/* =====================================================================
   Données vérifiées par recherche web, relevées en septembre 2026.
   Chaque entrée ne contient que ce qui a été trouvé et recoupé : adresse,
   téléphone, site, horaires, tarif d'entrée, et note avec sa source et son
   nombre d'avis. Rien n'est extrapolé : une adresse absente reste absente,
   une note absente n'est pas remplacée par une estimation.
   `monAvis` est mon appréciation personnelle, clairement séparée des faits.
   ===================================================================== */
export const RELEVE = "septembre 2026";

export const SOURCES = {
  nomad: {
    adresse: "1 Derb Aarjane, Rahba Lakdima, médina",
    site: "nomadmarrakech.com",
    monAvis: "Réservez une bonne semaine à l'avance et demandez explicitement le dernier niveau, sinon vous dînerez au premier étage sans vue et vous vous demanderez pourquoi tout le monde en parle. Visez 18 h 30 pour le coucher du soleil."
  },
  lejardin: {
    adresse: "32 Souk El Jeld, Sidi Abdelaziz, médina",
    tel: "+212 5 24 37 82 95",
    horaires: "10 h - 23 h, tous les jours",
    avis: { src: "Tripadvisor", note: 4.0 },
    monAvis: "Une cour de bananiers derrière une porte anonyme, avec des tortues qui traversent la salle. La cuisine ne vous marquera pas, l'ombre à midi entre deux souks, si."
  },
  terrasseepices: {
    adresse: "15 Souk Cherifia, Sidi Abdelaziz, médina",
    tel: "+212 5 24 37 59 04",
    site: "terrassedesepices.com",
    horaires: "12 h - 17 h et 18 h 30 - 0 h",
    avis: { src: "Tripadvisor", note: 4.2, nb: 5759 },
    monAvis: "Valeur sûre pour un premier soir : on y mange correctement, on voit l'Atlas, et c'est plus facile à réserver que Nomad. Demandez une alcôve d'angle."
  },
  daryacout: {
    adresse: "79 Derb Sidi Ahmed Soussi, Bab Doukkala, médina",
    tel: "+212 5 24 38 29 29",
    site: "daryacout.com",
    horaires: "19 h - 23 h, fermé le lundi",
    avis: { src: "Tripadvisor", note: 4.1, nb: 1324 },
    monAvis: "On y va pour la mise en scène, pas pour la finesse des plats : le menu unique est long et copieux, la note est élevée, et 4,1 sur Tripadvisor traduit bien ce décalage. Faites-vous déposer à Bab Doukkala, l'accès est un dédale et aucun taxi ne trouvera la porte."
  },
  foundouk: {
    adresse: "55 Souk Hal Fassi, Kat Bennahid, médina",
    site: "foundouk.com",
    horaires: "12 h - 0 h, fermé le lundi",
    avis: { src: "Tripadvisor", nb: 3563, txt: "256e sur 1 806 restaurants, Travellers' Choice 2025" },
    monAvis: "Montez directement au rooftop, le rez-de-chaussée ne vaut pas le déplacement. C'est le dîner logique du jour où vous faites Ben Youssef et le musée, ils sont à trois minutes à pied."
  },
  alfassia: {
    adresse: "55 boulevard Mohammed Zerktouni, Guéliz",
    avis: { src: "Tripadvisor", note: 4.3, nb: 376 },
    monAvis: "Tenu par des femmes depuis 1987, et la meilleure cuisine fassie de la ville. Si vous ne faites qu'un seul vrai repas marocain de la semaine, faites-le ici, et prenez le tajine d'agneau aux coings."
  },
  amal: {
    adresse: "Rue Allal Ben Ahmed, angle rue Ibn Sina, Guéliz",
    tel: "+212 5 24 44 68 96",
    site: "amalnonprofit.org",
    horaires: "12 h - 15 h 30, fermé le dimanche",
    avis: { src: "Tripadvisor", txt: "Travellers' Choice 2025" },
    monAvis: "Le meilleur rapport qualité-prix-sens du séjour, et de loin. Visez le vendredi pour le couscous, arrivez avant 13 h, et sachez que ça ferme le dimanche : c'est le piège classique."
  },
  latrattoria: {
    adresse: "179 rue Mohammed El Beqal, Guéliz",
    tel: "+212 5 24 43 26 41",
    horaires: "12 h - 1 h",
    avis: { src: "Tripadvisor", note: 4.5, nb: 1442 },
    monAvis: "La respiration italienne au milieu d'une semaine de tajines, dans une villa décorée par Bill Willis. Demandez une table au bord de la piscine éclairée."
  },
  plus61: {
    adresse: "96 rue Mohammed El Beqal, Guéliz, face au cinéma Colisée",
    tel: "+212 5 24 20 70 20",
    avis: { src: "Tripadvisor", note: 4.6, nb: 269, txt: "31e des MENA's 50 Best Restaurants 2026" },
    monAvis: "Bistrot australien qui fait son pain, ses pâtes, son fromage et son yaourt sur place. C'est le repas le plus contemporain de Marrakech, et la salle est petite : réservez."
  },
  naranj: {
    adresse: "84 rue Riad Zitoun Jdid, médina",
    tel: "+212 5 24 38 68 05",
    site: "naranj.ma",
    horaires: "12 h 30 - 22 h 30, tous les jours",
    avis: { src: "Tripadvisor", note: 4.7, nb: 3000, txt: "Travellers' Choice 2025" },
    monAvis: "4,7 sur plus de 3 000 avis, c'est l'une des meilleures notes de la ville et elle est méritée. Faites-en votre déjeuner du jour des palais : c'est à 200 m de la Bahia, c'est climatisé, et on en ressort en vingt minutes si besoin."
  },
  cafearabe: {
    adresse: "184 rue Mouassine, médina",
    monAvis: "Une des rares terrasses du souk qui sert de l'alcool, avec vue dégagée sur la Koutoubia. Le patio du bas reste frais quand le toit est écrasé de soleil."
  },
  bacha: {
    adresse: "Rue Dar el Bacha, médina, dans une aile du palais",
    monAvis: "La file est réelle et la carte fait 200 cafés : venez à l'ouverture ou après 16 h, et prenez le temps de lire la carte avant de commander. Enchaînez avec le musée, c'est le même bâtiment et le même billet de temps."
  },
  elfenn: {
    adresse: "Derb Moulay Abdullah Ben Hezzian, accès par la boutique rue Lalla Fatima Zahra, près de Bab Laksour",
    site: "el-fenn.com",
    horaires: "12 h jusqu'au soir, dernières commandes à 22 h 30",
    avis: { src: "Tripadvisor", note: 3.8 },
    monAvis: "1 300 m² de terrasses face à la Koutoubia, dans un riad bourré d'art contemporain : c'est le plus beau toit de la médina, et la note moyenne ne le reflète pas, parce qu'on y vient pour le lieu plus que pour l'assiette. Pas de réservation, capacité limitée : arrivez tôt pour le coucher du soleil."
  },
  bahia: {
    adresse: "5 Rue Riad Zitoun el Jdid, médina",
    horaires: "9 h - 17 h, tous les jours",
    tarif: "100 MAD adulte, 30 MAD enfant",
    monAvis: "Le plus abouti des palais visitables. Ouvrez la journée avec, à 9 h pile, vous aurez les patios pour vous, et enchaînez avec Dar Si Saïd à 300 m."
  },
  badi: {
    horaires: "9 h - 17 h, tous les jours",
    tarif: "100 MAD adulte, 50 MAD enfant de 7 à 13 ans",
    monAvis: "Une ruine grandiose plutôt qu'un palais : on y vient pour les remparts, les cigognes et le panorama sur la médina en fin de journée. Ne ratez pas le minbar de la Koutoubia, exposé dans une salle annexe."
  },
  saadiens: {
    horaires: "9 h - 17 h, tous les jours",
    tarif: "100 MAD",
    monAvis: "Le site est minuscule et la file peut coûter 40 minutes pour 90 secondes devant la salle des Douze Colonnes. À l'ouverture, ou pas du tout."
  },
  benyoussef: {
    site: "medersabenyoussef.ma",
    horaires: "9 h - 19 h, 9 h - 16 h 30 pendant le Ramadan",
    tarif: "50 MAD adulte, 10 MAD moins de 12 ans",
    monAvis: "Le plus beau monument de la ville depuis sa réouverture en 2022, et le moins cher des grands sites à 50 MAD. Montez à l'étage dans les cellules d'étudiants, presque personne ne le fait."
  },
  jardinsecret: {
    horaires: "9 h 30 - 18 h 30 en février et octobre, 9 h 30 - 19 h 30 de mars à septembre, 9 h 30 - 18 h de novembre à janvier",
    tarif: "100 MAD le jardin, 40 MAD de plus pour la tour",
    monAvis: "Le meilleur endroit pour souffler entre deux souks. Les 40 MAD de la tour sont les mieux dépensés de la médina : c'est la seule vue plongeante à 360° du quartier."
  },
  majorelle: {
    site: "tickets.jardinmajorelle.com",
    horaires: "8 h 30 - 18 h, dernier accès à 17 h 30",
    tarif: "150 MAD le jardin seul, 850 MAD le billet combiné avec les musées Berbère et YSL",
    monAvis: "Billets strictement nominatifs, par créneau, avec 15 minutes de tolérance, et uniquement sur le site officiel. Prenez le créneau de 8 h 30 : c'est la seule façon de voir le bleu sans la foule."
  },
  ysl: {
    horaires: "10 h - 18 h, fermé le mercredi",
    monAvis: "Le bâtiment de brique en dentelle de Studio KO vaut à lui seul la visite, et son café climatisé est le meilleur repli de la mi-journée dans ce quartier."
  },
  hammambains: {
    adresse: "2 Derb Sedra, Bab Agnaou, médina",
    site: "lesbainsdemarrakech.com",
    tarif: "de 650 MAD (1 h, un soin) à 1 700 MAD (4 h, quatre soins)",
    monAvis: "Le spa le plus complet de la médina, avec piscine. À caler le jour où les souks vous auront épuisés, pas le premier jour."
  },
  hammamrose: {
    tarif: "environ 300 à 500 MAD selon la formule",
    monAvis: "Moitié moins cher que les grands spas pour un rituel très correct. C'est le bon premier hammam si vous n'en avez jamais fait."
  },
  /* ---- seconde vague de vérifications ---- */
  jemaa: {
    monAvis: "Inscrite au patrimoine mondial depuis 1985, et son espace culturel au patrimoine immatériel (proclamé en 2001, inscrit en 2008). Concrètement : elle est vide et écrasée de soleil l'après-midi, et elle devient un spectacle à partir de 18 h. N'y allez pas à 14 h, vous ne comprendriez pas ce que les gens lui trouvent."
  },
  koutoubia: {
    monAvis: "Minaret almohade de 77 m achevé vers 1199 sous Yacoub al-Mansour. L'intérieur est fermé aux non-musulmans, alors visez les jardins côté sud une heure avant le coucher du soleil : c'est le plus beau cliché de la ville, et c'est gratuit."
  },
  darelbacha: {
    adresse: "Rue Dar el Bacha, quartier Mouassine, médina",
    horaires: "10 h - 18 h, fermé le lundi",
    tarif: "60 MAD étrangers, 25 MAD nationaux, 15 MAD moins de 18 ans (tarifs relevés en 2024)",
    monAvis: "Visite du palais puis café dans l'aile du Bacha Coffee : c'est la meilleure heure et demie de la médina, et ça tombe bien, tout est dans le même bâtiment. Fermé le lundi, ne calez pas votre journée musées ce jour-là."
  },
  maisonphoto: {
    adresse: "46 rue Ahal Fès, médina, près de la médersa Ben Youssef",
    horaires: "9 h 30 - 19 h, tous les jours",
    tarif: "50 MAD, gratuit pour les moins de 15 ans",
    monAvis: "Trois étages de tirages de 1870 à 1950 dans un ancien fondouk, et presque personne. C'est le musée à garder en réserve pour l'heure où la médina sature, et sa terrasse fait un déjeuner calme avec vue sur l'Atlas."
  },
  darsisaid: {
    horaires: "10 h - 18 h, fermé le mardi",
    tarif: "30 MAD adulte, 10 MAD moins de 12 ans",
    monAvis: "30 MAD pour la meilleure collection de tapis et de bois sculpté du pays, c'est l'entrée la moins chère de la médina. Faites-le avant d'acheter un tapis : vous saurez lire les motifs et vous négocierez autrement."
  },
  menara: {
    horaires: "Jardins 8 h - 19 h, pavillon 9 h - 17 h",
    tarif: "Jardins gratuits, pavillon 50 MAD adulte, 20 MAD moins de 12 ans",
    monAvis: "Honnêtement, c'est un grand bassin et des oliviers : on y va pour le reflet de l'Atlas en fin d'après-midi et pour voir les familles marrakchies le week-end, pas pour le monument. Le pavillon à 50 MAD est dispensable."
  },
  cyberpark: {
    horaires: "7 h 30 - 18 h 30, tous les jours",
    tarif: "Parc gratuit, 5 MAD pour l'espace Internet",
    monAvis: "Le meilleur raccourci de la ville : au lieu de longer l'avenue Mohammed V au soleil entre la médina et Guéliz, on le traverse à l'ombre, gratuitement."
  },
  tanneries: {
    monAvis: "Le terrain de chasse le plus agressif de la ville. La règle est simple : ne suivez personne qui vous aborde dans la rue, dites « la choukran » et continuez sans ralentir. Un « gardien » vous dira que c'est fermé ou que vous vous trompez de chemin, c'est faux. Achetez votre bouquet de menthe avant d'entrer, et donnez 10 à 20 MAD, pas plus. Si ce bras de fer ne vous tente pas, passez par un guide officiel."
  },
  souks: {
    monAvis: "Partez à 30 ou 40 % du prix annoncé et visez la moitié, en liquide et avec de la petite monnaie. Perdez-vous volontairement une matinée : c'est là que ça se passe, pas sur l'axe balisé Semmarine."
  },
  soukelkhemis: {
    horaires: "10 h - 19 h, plus animé le jeudi et le dimanche matin, certaines échoppes fermées le vendredi",
    monAvis: "Marché aux puces au nord de Bab El Khemis : zéro tourisme, prix réels, mais il faut aimer fouiller. Prévoyez un taxi qui attend, les retours sont difficiles depuis là-bas."
  },
  "33rueMajorelle": {
    adresse: "33 rue Yves Saint Laurent, face au Jardin Majorelle",
    horaires: "9 h - 19 h, tous les jours",
    tel: "+212 5 24 31 41 95",
    site: "33ruemajorelle.com",
    monAvis: "Prix fixes et élevés, mais une centaine de créateurs marocains sur deux étages. C'est l'adresse cadeaux du jour où vous n'aurez plus l'énergie de négocier, et c'est juste en face de Majorelle."
  },
  ensemble: {
    adresse: "Avenue Mohammed V, Guéliz",
    horaires: "9 h 30 - 19 h du lundi au samedi, 9 h - 14 h le dimanche",
    monAvis: "Prix fixes affichés et artisans au travail. Vous n'y ferez pas la bonne affaire, mais faites-y votre repérage tarifaire le premier jour : vous saurez ensuite ce que vaut vraiment un plateau ou une babouche."
  },
  cafeclock: {
    adresse: "224 Derb Chtouka, quartier de la Kasbah, médina",
    tel: "+212 5 24 37 83 67",
    monAvis: "Une ancienne école transformée en maison culturelle : concerts gnaoua, contes en darija et en anglais, burger de chameau. Regardez le programme de la semaine en arrivant, les concerts sont souvent gratuits."
  },
  salama: {
    adresse: "40 rue des Banques, à deux pas de Jemaa el-Fna",
    site: "lesalamamarrakech.com",
    horaires: "11 h - 2 h, spectacle de danse orientale à 21 h",
    avis: { src: "Tripadvisor", txt: "avis partagés : le décor séduit, le spectacle et la terrasse déçoivent souvent" },
    monAvis: "Montez pour un verre à l'heure où la place s'allume, et ne comptez pas sur l'assiette ni sur le spectacle. C'est l'une des rares adresses qui sert de l'alcool en pleine médina, c'est déjà beaucoup."
  },
  pepenero: {
    adresse: "17 Derb Cherkaoui, Douar Graoua, médina",
    tel: "+212 5 24 38 90 67",
    horaires: "12 h 30 - 15 h 30 et 18 h - 23 h 30",
    monAvis: "L'ancienne résidence du pacha, à cinq minutes à pied de Jemaa el-Fna, avec un bassin éclairé aux bougies. Demandez une table au bord de l'eau et prévoyez une tenue correcte."
  },
  beldi: {
    horaires: "Accès day pass de 10 h à 17 h",
    tarif: "370 MAD le day pass avec déjeuner trois plats, piscine, transat et serviette. 100 MAD la piscine seule, 270 MAD le déjeuner seul",
    site: "beldicountryclub.com",
    monAvis: "370 MAD pour une roseraie de trois hectares, deux piscines et un déjeuner sous les oliviers, c'est le meilleur plan de la journée la plus chaude de la semaine. Demandez au taxi de revenir vous chercher à heure fixe, il n'y a pas de circulation là-bas."
  },
  cafeepices: {
    adresse: "75 Rahba Lakdima, médina",
    horaires: "9 h - 23 h, tous les jours",
    site: "cafedesepices.ma",
    monAvis: "Le poste d'observation le moins cher de la médina : trois niveaux au-dessus de la place aux vanniers, jus frais et sandwichs. Précisez « espresso » si vous ne voulez pas un Nescafé."
  },
  grandcafeposte: {
    adresse: "Angle boulevard El Mansour Eddahbi et rue Imam Malik, Guéliz",
    horaires: "9 h - 1 h, tous les jours",
    site: "grandcafedelaposte.restaurant",
    monAvis: "Une brasserie de 1925 avec ventilateurs au plafond et service en tenue. Le meilleur petit-déjeuner à l'européenne de la ville, et un bar qui s'anime après 19 h."
  },
  lmida: {
    adresse: "78 bis Derb Nkhel, Rahba Kedima, médina",
    horaires: "12 h - 23 h, sept jours sur sept",
    site: "lmidamarrakech.com",
    monAvis: "Une douzaine de tables seulement sur une terrasse contemporaine face aux toits. Réservez pour le coucher du soleil : c'est la meilleure alternative quand Nomad est complet."
  },
  kabana: {
    adresse: "Kissariat Ben Khaled, 1 rue Fatima Ezzahra, quartier R'mila",
    horaires: "11 h - 2 h, tous les jours",
    site: "kabana-marrakech.com",
    monAvis: "Vue frontale sur la Koutoubia et DJ dès la fin d'après-midi. C'est plus jeune et plus sonore qu'El Fenn : parfait pour un apéro qui glisse vers la soirée, à réserver le week-end."
  },
  barometre: {
    adresse: "Rue Moulay Ali, Résidence Al Houda, Guéliz, en bas d'un escalier derrière une porte non signalée",
    horaires: "18 h 30 - 1 h, plus 12 h - 1 h du lundi au samedi",
    monAvis: "Le premier bar de mixologie de Marrakech, ouvert en 2016, et toujours le meilleur. Installez-vous au comptoir plutôt qu'en salle et laissez le barman choisir. La salle est minuscule, réservez le week-end."
  },
  skybarpearl: {
    adresse: "Avenue Echouhada, angle rue des Temples, Hivernage",
    monAvis: "Bar de piscine au sommet, vue à 360° sur la ville et l'Atlas. C'est cher et un peu m'as-tu-vu, mais arrivez 30 minutes avant le coucher du soleil et le premier verre se justifie. Quinze minutes à pied de Jemaa el-Fna."
  },
  bozin: {
    adresse: "Route de l'Ourika, km 3,5",
    tel: "+212 5 24 38 80 12",
    horaires: "20 h - 4 h, tous les jours",
    monAvis: "Dîner asiatique à 21 h, ambiance à partir de 23 h 30, club jusqu'à 4 h. Négociez le retour avec le taxi dès l'aller ou faites-en appeler un par l'établissement : après minuit, le tarif double."
  },
  theatro: {
    horaires: "23 h 30 - 5 h, tous les soirs",
    tarif: "200 à 300 MAD selon la soirée, parfois avec une consommation",
    site: "theatromarrakech.com",
    monAvis: "Un ancien théâtre de l'hôtel Es Saadi transformé en club à scénographie. Rien ne commence avant 1 h du matin, et prévoyez le retour : tarif de nuit à la sortie."
  },
  cuisineamal: {
    tarif: "600 MAD par personne à La Maison Arabe. L'atelier de l'association Amal finance directement la formation d'une femme",
    monAvis: "Deux formules très différentes : Amal, associatif, chaleureux et utile, ou La Maison Arabe, en cuisine professionnelle avec une dada. On repart avec les recettes, et c'est le seul souvenir de Marrakech qui ne prend pas de place dans la valise."
  },
  "calèche": {
    tarif: "compter 200 MAD l'heure environ pour quatre personnes, de 300 MAD l'heure à 750 MAD les trois heures chez les prestataires. Le tarif officiel de 80 MAD l'heure ne s'applique qu'à la demi-journée ou à la journée",
    monAvis: "Kitsch et lent, et pourtant c'est la meilleure façon de comprendre la géographie de la ville en une heure. Fixez le prix avant de monter, et regardez l'état du cheval : tous les cochers ne se valent pas."
  },
  montgolfiere: {
    tarif: "environ 2 400 MAD par personne pour un vol classique, transferts inclus. De 190 à 680 € selon la formule, de la nacelle collective au vol privé",
    monAvis: "Départ vers 5 h 30 du matin, une heure de vol au-dessus de la palmeraie et de la plaine du Haouz, petit-déjeuner sous tente au retour. Réservez en milieu de séjour : si le vent annule, il vous reste des jours pour reprogrammer."
  },
  quad: {
    tarif: "environ 200 MAD les 2 h de quad avec guide et pause thé",
    monAvis: "200 MAD les deux heures, c'est l'activité la moins chère du séjour, et elle est juste derrière votre hôtel. Prenez le créneau de fin d'après-midi pour la lumière, et prévoyez lunettes et foulard : ça poussière sévèrement."
  },
  golfamelkis: {
    tarif: "green fee 700 MAD, 400 MAD pour les résidents",
    monAvis: "27 trous dessinés par Cabell Robinson avec l'Atlas en toile de fond. Réservez un départ tôt, 7 h 30 en été, et louez les clubs sur place plutôt que de porter les vôtres."
  },
  agafay: {
    monAvis: "45 minutes de route, et ce n'est pas le Sahara : c'est un désert de pierre, pas de dunes. Comptez 60 à 80 € pour deux en demi-journée avec transfert, dîner et spectacle, et 150 à 250 € pour deux la nuit en camp. Prenez une veste, les nuits y sont froides même en été."
  },
  ourika: {
    monAvis: "60 km et une heure de route au sud, dans une vallée verte le long de l'oued. Partez à 8 h pour éviter la foule du week-end, prenez un guide local aux cascades de Setti Fatma (100 à 150 MAD, le sentier glisse) et mettez des chaussures fermées. Balade à dromadaire au bord de la rivière dès 25 € par personne."
  },
  anima: {
    horaires: "9 h - 17 h 30",
    tarif: "140 MAD adulte, 60 MAD de 12 à 16 ans, Marocains, résidents et étudiants. Navette aller-retour comprise dans le billet",
    site: "anima-garden.com",
    monAvis: "Le meilleur jardin des environs, très loin devant la Ménara, et bien moins couru que Majorelle. Surtout : la navette est comprise dans le billet, départs du parking de la Koutoubia à 9 h 30, 11 h 30 et 14 h 30. C'est la seule escapade du séjour qui ne coûte pas un dirham de taxi."
  },
  takerkoust: {
    monAvis: "Une cinquantaine de minutes de route, un lac de barrage bordé de terrasses face à l'Atlas. Déjeunez au Flouka au bord de l'eau, et combinez avec Agafay dans la même journée : c'est sur la même route."
  },
  imlil: {
    monAvis: "64 km et 1 h 30 de route, à 1 740 m : vingt degrés de moins qu'en ville. La balade Imlil-Aroumd, deux heures aller-retour, se fait sans guide. Pour monter plus haut, prenez un guide local sur place. Excursion à la journée dès 35 € par personne à six."
  },
  ouzoud: {
    monAvis: "150 km et 2 h 30 à 3 h de route : départ à 7 h impératif, sinon vous passerez la journée en voiture. L'excursion organisée à 25-45 € par personne, déjeuner et tour en barque compris, est bien plus rentable qu'un taxi privé. Et ne nourrissez pas les singes."
  },
  babagnaou: {
    monAvis: "La plus belle porte almohade de la ville, en grès bleuté, et le quartier le moins harcelant de la médina. Commencez votre matinée Kasbah par là avant d'enchaîner sur les Tombeaux Saadiens, à cinq minutes."
  },
  remparts: {
    monAvis: "19 km de murailles de pisé : on ne les visite pas, on les longe. Une heure avant le coucher du soleil, l'ocre vire à l'orange et c'est là que la calèche prend tout son sens."
  },
  palmeraie: {
    monAvis: "Vous logez dedans, donc c'est l'activité la moins chère du séjour en taxi. C'est touristique et assumé, mais un dromadaire au coucher du soleil à cinq minutes de votre chambre, ça ne se refuse pas un soir de la semaine."
  },
  rahba: {
    monAvis: "La petite place des herboristes et des vanniers, et surtout le meilleur point de repère du dédale : quand vous êtes perdus, demandez Rahba Lakdima. Le Nomad et le Café des Épices donnent tous les deux dessus."
  },
  mechoui: {
    monAvis: "L'expérience de rue la plus authentique de la ville : l'agneau cuit toute la nuit dans un four enterré, servi au poids avec du pain, du cumin et du sel. Arrivez vers 12 h 30, à 14 h il n'y a plus rien."
  },
  "16cafe": {
    monAvis: "Rien d'exceptionnel, mais une terrasse ombragée sur la place du 16 Novembre et un bon poste d'observation de la Marrakech qui travaille. Wifi correct si vous devez bosser une heure."
  },
  essaouira: {
    monAvis: "175 km par une bonne route, 3 h de bus. Supratours vous dépose en plein centre, CTM non : 90 MAD chez CTM, 100 à 140 MAD chez Supratours, sept départs par jour à partir de 7 h 45. Si vous ne faites qu'une escapade, hésitez entre celle-ci et l'Atlas, et si vous choisissez Essaouira, dormez-y une nuit plutôt que de faire l'aller-retour."
  }
};
