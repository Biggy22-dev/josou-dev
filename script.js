/* =========================================================
   Réseau Bot - Josou Tech
   Boutons + saisie libre + images + questions de suite.
   ========================================================= */

// 1. LES DONNÉES
// question : la question telle qu'elle s'affiche sur un bouton
// mots     : mots-clés repérés dans la saisie libre (sans accent, en minuscules)
// texte    : la réponse du bot
// images   : (facultatif) { src, alt, legende }
// suites   : (facultatif) clés des questions proposées après la réponse.
//            Pas de "suites" = rien n'est proposé après.
const sujets = {
  dhcp: {
    question: "Qu'est-ce que le DHCP ?",
    mots: ["dhcp", "attribution automatique"],
    texte: "Le DHCP (Dynamic Host Configuration Protocol) donne automatiquement à chaque appareil sa configuration réseau : adresse IP, masque, passerelle et serveur DNS. Sans lui, il faudrait tout configurer à la main sur chaque machine.",
    liens: [
      { type: "video", titre: "Le DHCP expliqué en vidéo", url: "https://www.youtube.com/watch?v=ID_DE_LA_VIDEO" },
      { type: "site", titre: "Le DHCP sur Wikipédia", url: "https://fr.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol" }
    ],
    suites: ["dora", "ip"]
  },
  dora: {
    question: "Comment fonctionne le DORA ?",
    mots: ["dora"],
    texte: "DORA désigne les 4 messages échangés entre un appareil et le serveur DHCP : Discover (l'appareil cherche un serveur), Offer (le serveur propose une adresse), Request (l'appareil demande à l'utiliser), Acknowledge (le serveur confirme). L'adresse est alors prêtée pour une durée appelée bail.",
    suites: ["dns"]
  },
  dns: {
    question: "Qu'est-ce que le DNS ?",
    mots: ["dns", "nom de domaine", "resolution de nom"],
    texte: "Le DNS (Domain Name System) est l'annuaire d'Internet. Il traduit un nom facile à retenir, comme google.com, en adresse IP que les machines comprennent. Quand tu tapes une adresse dans ton navigateur, c'est la première chose qui se passe.",
    suites: ["ip", "ping"]
  },
  // ip-privee est placé AVANT ip : en cas d'égalité de score, le premier gagne
  "ip-privee": {
    question: "IP privée ou publique : quelle différence ?",
    mots: ["ip privee", "ip publique", "adresse privee", "adresse publique"],
    texte: "Une adresse IP privée (192.168.x.x, 10.x.x.x, 172.16 à 172.31.x.x) ne sert qu'à l'intérieur d'un réseau local et peut être réutilisée par tout le monde. Une IP publique est unique sur Internet et fournie par ton fournisseur d'accès. Le routeur fait le lien entre les deux grâce au NAT.",
    suites: ["nat"]
  },
  ip: {
    question: "Qu'est-ce qu'une adresse IP ?",
    mots: ["ip", "ipv4", "ipv6", "masque", "sous reseau", "subnet", "cidr"],
    texte: "Une adresse IP identifie un appareil sur un réseau, comme une adresse postale. En IPv4, elle s'écrit en 4 nombres de 0 à 255 (ex : 192.168.1.10).",
    suites: ["ip-privee", "nat"]
  },
  vlan: {
    question: "Qu'est-ce qu'un VLAN ?",
    mots: ["vlan", "segmentation", "isoler", "trunk"],
    texte: "Un VLAN (Virtual LAN) découpe un seul réseau physique en plusieurs réseaux logiques isolés. Par exemple, séparer les ordinateurs de la comptabilité de ceux des invités sur le même switch. Ça améliore la sécurité et réduit le trafic inutile.",
    suites: ["routeur-switch", "pare-feu"]
  },
  nat: {
    question: "Qu'est-ce que le NAT ?",
    mots: ["nat", "pat", "traduction d adresse"],
    texte: "Le NAT (Network Address Translation) permet à plusieurs appareils d'un réseau local, qui ont des adresses privées, de sortir sur Internet avec une seule adresse IP publique. Le routeur garde en mémoire qui a demandé quoi, pour renvoyer chaque réponse au bon appareil.",
    suites: ["ip-privee", "pare-feu"]
  },
  "routeur-switch": {
    question: "Routeur ou switch : quelle différence ?",
    mots: ["routeur", "router", "switch", "commutateur", "passerelle"],
    texte: "Le switch relie des appareils au sein d'un même réseau local et envoie les données directement au bon appareil grâce aux adresses MAC. Le routeur, lui, relie des réseaux différents entre eux (par exemple ton réseau local et Internet) en s'appuyant sur les adresses IP.",
    images: [
      { src: "images/routeur.svg", alt: "Un routeur Wi-Fi avec ses antennes", legende: "Routeur" },
      { src: "images/switch.svg", alt: "Un switch réseau avec une rangée de ports", legende: "Switch" }
    ],
    suites: ["mac", "vlan"]
  },
  mac: {
    question: "C'est quoi une adresse MAC ?",
    mots: ["mac", "adresse mac"],
    texte: "Une adresse MAC est l'identifiant physique d'une carte réseau, attribué à sa fabrication (ex : A4:5E:60:C1:2B:7F). Contrairement à l'IP, qui change selon le réseau, elle identifie la carte elle-même. Les switchs s'en servent pour savoir sur quel port envoyer chaque trame.",
    suites: ["ip", "vlan"]
  },
  ping: {
    question: "À quoi sert la commande ping ?",
    mots: ["ping", "icmp", "latence"],
    texte: "La commande ping envoie un petit message (ICMP) à une machine et attend sa réponse. Elle permet de vérifier qu'un appareil est joignable et de mesurer la latence, c'est-à-dire le temps d'aller-retour, en millisecondes. C'est le premier réflexe quand on dépanne un réseau.",
    suites: ["pare-feu"]
  },
  // Pas de "suites" ici : après cette réponse, rien n'est proposé
  "pare-feu": {
    question: "Qu'est-ce qu'un pare-feu ?",
    mots: ["pare feu", "parefeu", "firewall"],
    texte: "Un pare-feu (firewall) filtre le trafic réseau selon des règles : il autorise ou bloque les connexions en fonction des adresses, des ports ou des protocoles. Il protège un réseau en ne laissant passer que ce qui est utile."
  }
};

// On donne à chaque sujet sa propre clé (utile pour se souvenir de ce qui a été vu)
for (const cle in sujets) {
  sujets[cle].cle = cle;
}

// Réponses spéciales (pas de clé, pas de suites)
const salutation = { texte: "Salut 👋 Pose-moi une question sur le réseau (DHCP, DNS, VLAN, NAT, IP…) ou écris-la ci-dessous." };
const remerciement = { texte: "Avec plaisir ! N'hésite pas si tu as d'autres questions sur le réseau 🙂" };
const inconnu = { texte: "Je n'ai pas de réponse précise à cette question pour l'instant. Essaie avec un mot-clé (DHCP, DNS, VLAN, NAT, IP, ping, pare-feu…). Pour une question plus poussée, écris-moi sur WhatsApp." };

// 2. LES ÉLÉMENTS DE LA PAGE
const chat = document.querySelector(".chat");
const zoneMessages = document.getElementById("messages");
const zoneOptions = document.getElementById("options");
const formulaire = document.getElementById("formulaire");
const champ = document.getElementById("champ");

let botOccupe = false;
const dejaVus = new Set(); // clés des sujets déjà expliqués

// 3. LES FONCTIONS

function defilerEnBas() {
  zoneMessages.scrollTop = zoneMessages.scrollHeight;
}

function ajouterMessage(texte, auteur) {
  const bulle = document.createElement("div");
  bulle.classList.add("bulle", auteur);
  bulle.textContent = texte;
  zoneMessages.appendChild(bulle);
  defilerEnBas();
  return bulle;
}

function ajouterImages(images) {
  const bulle = document.createElement("div");
  bulle.classList.add("bulle", "bot", "bulle-images");

  images.forEach(function (image) {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.addEventListener("load", defilerEnBas);
    figure.appendChild(img);

    if (image.legende) {
      const legende = document.createElement("figcaption");
      legende.textContent = image.legende;
      figure.appendChild(legende);
    }

    bulle.appendChild(figure);
  });

  zoneMessages.appendChild(bulle);
  defilerEnBas();
}

// Retourne le nom de domaine d'une URL (ex : "fr.wikipedia.org")
function domaine(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (erreur) {
    return "";
  }
}

// Affiche des cartes-liens (vidéo ou site) après le texte et les images
function ajouterLiens(liens) {
  const bloc = document.createElement("div");
  bloc.classList.add("liens");

  liens.forEach(function (lien) {
    const estVideo = lien.type === "video";

    const a = document.createElement("a");
    a.classList.add("lien", estVideo ? "video" : "site");
    a.href = lien.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer"; // sécurité : le site ouvert n'a pas accès à ta page

    const icone = document.createElement("span");
    icone.classList.add("lien-icone");
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = estVideo ? "▶" : "🌐";

    const texte = document.createElement("span");
    texte.classList.add("lien-texte");

    const titre = document.createElement("span");
    titre.classList.add("lien-titre");
    titre.textContent = lien.titre;

    const source = document.createElement("span");
    source.classList.add("lien-source");
    source.textContent = domaine(lien.url);

    texte.appendChild(titre);
    texte.appendChild(source);

    const fleche = document.createElement("span");
    fleche.classList.add("lien-fleche");
    fleche.setAttribute("aria-hidden", "true");
    fleche.textContent = "↗";

    a.appendChild(icone);
    a.appendChild(texte);
    a.appendChild(fleche);
    bloc.appendChild(a);
  });

  zoneMessages.appendChild(bloc);
  defilerEnBas();
}

// Affiche les questions de suite juste après la réponse.
// On ignore celles déjà vues ; s'il n'en reste aucune, on n'affiche rien.
function ajouterSuites(cles) {
  const disponibles = (cles || []).filter(function (cle) {
    return sujets[cle] && !dejaVus.has(cle);
  });
  if (disponibles.length === 0) return;

  const bloc = document.createElement("div");
  bloc.classList.add("suites");

  const titre = document.createElement("p");
  titre.classList.add("suites-titre");
  titre.textContent = "Pour aller plus loin";
  bloc.appendChild(titre);

  disponibles.forEach(function (cle) {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.dataset.cle = cle;
    bouton.textContent = sujets[cle].question;
    bloc.appendChild(bouton);
  });

  zoneMessages.appendChild(bloc);
  defilerEnBas();
}

function afficherSaisie() {
  const bulle = document.createElement("div");
  bulle.classList.add("bulle", "bot", "saisie");
  bulle.setAttribute("aria-label", "Le bot écrit");
  bulle.innerHTML = "<span></span><span></span><span></span>";
  zoneMessages.appendChild(bulle);
  defilerEnBas();
  return bulle;
}

function bloquerInterface(etat) {
  document.querySelectorAll(".chat button[data-cle]").forEach(function (bouton) {
    bouton.disabled = etat;
  });
  champ.disabled = etat;
  formulaire.querySelector("button").disabled = etat;
}

function normaliser(texte) {
  return " " + texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim() + " ";
}

function contientMot(texte, mot) {
  if (mot.length <= 3) return texte.includes(" " + mot + " ");
  return texte.includes(" " + mot);
}

function trouverReponse(question) {
  const texte = normaliser(question);

  let meilleurScore = 0;
  let meilleurSujet = null;

  for (const cle in sujets) {
    let score = 0;
    sujets[cle].mots.forEach(function (mot) {
      if (contientMot(texte, mot)) score++;
    });
    if (score > meilleurScore) {
      meilleurScore = score;
      meilleurSujet = sujets[cle];
    }
  }

  if (meilleurSujet) return meilleurSujet;

  if (["bonjour", "salut", "coucou", "hello", "bonsoir"].some(function (m) { return contientMot(texte, m); })) {
    return salutation;
  }
  if (contientMot(texte, "merci")) return remerciement;

  return inconnu;
}

function poserQuestion(question, sujet) {
  if (botOccupe) return;

  botOccupe = true;
  bloquerInterface(true);

  // Le menu de départ et les anciennes suites disparaissent
  zoneOptions.remove();
  zoneMessages.querySelectorAll(".suites").forEach(function (bloc) {
    bloc.remove();
  });

  ajouterMessage(question, "user");
  const saisie = afficherSaisie();

  const delai = Math.min(800 + sujet.texte.length * 4, 2000);

  setTimeout(function () {
    saisie.remove();
    ajouterMessage(sujet.texte, "bot");

    if (sujet.images && sujet.images.length > 0) {
      ajouterImages(sujet.images);
    }

    if (sujet.liens && sujet.liens.length > 0) {
      ajouterLiens(sujet.liens);
    }

    if (sujet.cle) dejaVus.add(sujet.cle);
    ajouterSuites(sujet.suites);

    botOccupe = false;
    bloquerInterface(false);
  }, delai);
}

// 4. LES ÉVÉNEMENTS

// Un seul écouteur sur tout le chat : il gère le menu de départ
// ET les boutons de suite créés plus tard
chat.addEventListener("click", function (evenement) {
  const bouton = evenement.target.closest("button[data-cle]");
  if (!bouton) return;

  const sujet = sujets[bouton.dataset.cle];
  if (!sujet) return;

  poserQuestion(bouton.textContent.trim(), sujet);
});

formulaire.addEventListener("submit", function (evenement) {
  evenement.preventDefault();

  const question = champ.value.trim();
  if (question === "") return;

  champ.value = "";
  poserQuestion(question, trouverReponse(question));
});