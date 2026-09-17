import type {
  Absence,
  Candidat,
  Collaborateur,
  Conversation,
  Demande,
  DocumentRH,
  EmailEntrant,
  Entretien,
  EvenementRH,
  NotificationItem,
  Onboarding,
} from "./types";

/* ------------------------------------------------------------------ */
/* Générateur pseudo-aléatoire déterministe (mêmes données à chaque rendu) */
/* ------------------------------------------------------------------ */
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const rng = createRng(20260917);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)]!;
const int = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

export const AUJOURDHUI = new Date("2026-09-17T09:00:00Z");

function dateDecalee(jours: number): string {
  const d = new Date(AUJOURDHUI);
  d.setDate(d.getDate() + jours);
  return d.toISOString().slice(0, 10);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateLongue(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function initiales(prenom: string, nom: string) {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Référentiels                                                        */
/* ------------------------------------------------------------------ */
export const SERVICES = [
  "Direction",
  "Enseignement Primaire",
  "Enseignement Secondaire",
  "Vie Scolaire",
  "Administration & Finances",
  "Ressources Humaines",
  "Informatique & Numérique",
  "Maintenance & Logistique",
  "Restauration",
  "Santé & Infirmerie",
  "Admissions & Communication",
  "Transport Scolaire",
] as const;

export const FONCTIONS: Record<string, string[]> = {
  Direction: ["Proviseur", "Directeur adjoint", "Chef d'établissement adjoint", "Assistant de direction"],
  "Enseignement Primaire": [
    "Professeur des écoles",
    "Professeur des écoles - PS/MS",
    "Professeur d'anglais primaire",
    "Professeur d'arabe primaire",
    "ASEM",
  ],
  "Enseignement Secondaire": [
    "Professeur de mathématiques",
    "Professeur de français",
    "Professeur d'histoire-géographie",
    "Professeur de SVT",
    "Professeur de physique-chimie",
    "Professeur d'EPS",
    "Professeur d'espagnol",
    "Professeur de philosophie",
    "Professeur de SES",
  ],
  "Vie Scolaire": ["CPE", "Assistant d'éducation", "Surveillant", "Responsable vie scolaire"],
  "Administration & Finances": ["Comptable", "Responsable financier", "Gestionnaire administratif", "Agent d'accueil"],
  "Ressources Humaines": ["Responsable RH", "Chargé de recrutement", "Gestionnaire paie", "Assistant RH"],
  "Informatique & Numérique": ["Technicien support", "Administrateur systèmes", "Référent numérique"],
  "Maintenance & Logistique": ["Agent de maintenance", "Électricien", "Jardinier", "Agent d'entretien"],
  Restauration: ["Chef de cuisine", "Cuisinier", "Agent de restauration"],
  "Santé & Infirmerie": ["Infirmière scolaire", "Psychologue scolaire", "Médecin scolaire"],
  "Admissions & Communication": ["Chargé d'admissions", "Chargé de communication", "Conseiller familles"],
  "Transport Scolaire": ["Responsable transport", "Chauffeur de bus", "Accompagnateur bus"],
};

const PRENOMS_F = [
  "Salma","Imane","Nadia","Fatima Zahra","Sofia","Yasmine","Leïla","Hajar","Meryem","Camille","Claire","Aurélie",
  "Sarah","Khadija","Ghita","Amina","Ines","Manon","Élodie","Hind","Loubna","Rim","Zineb","Nora","Charlotte","Sana",
];
const PRENOMS_M = [
  "Youssef","Karim","Mehdi","Anas","Omar","Rachid","Hamza","Adam","Julien","Thomas","Pierre","Nicolas","Ayoub",
  "Reda","Ismail","Othmane","Said","Mohamed","Antoine","Laurent","Bilal","Hicham","Tarik","Simon","Marc","Yassine",
];
const NOMS = [
  "Benali","El Amrani","Tazi","Bennani","Alaoui","Chraibi","Berrada","Lahlou","Fassi","Sebti","Idrissi","Kettani",
  "Moreau","Dubois","Lefèvre","Girard","Rousseau","Bernard","Martin","Petit","Durand","Lemoine","Ouazzani","Cherkaoui",
  "Naciri","Belkadi","Haddad","Saidi","Rami","El Khatib","Zerouali","Bouzidi","Mansouri","Radi","Skalli","Benjelloun",
  "Guerraoui","Amrani","Bouhlal","Filali","Harrouch","Laraki","Marrakchi","Slaoui","Tahiri","Ziani","Bencheikh",
];

const RESPONSABLES = [
  "Nadia Berrada",
  "Pierre Moreau",
  "Karim Lahlou",
  "Claire Dubois",
  "Youssef Tazi",
  "Salma Bennani",
];

export const UTILISATEUR_COURANT = {
  nom: "Nadia Berrada",
  fonction: "Responsable RH",
  service: "Ressources Humaines",
  email: "n.berrada@lfilm.org",
  initiales: "NB",
};

/* ------------------------------------------------------------------ */
/* Collaborateurs (349)                                                */
/* ------------------------------------------------------------------ */
function genererCollaborateurs(): Collaborateur[] {
  const liste: Collaborateur[] = [];
  const repartition: Record<string, number> = {
    Direction: 8,
    "Enseignement Primaire": 92,
    "Enseignement Secondaire": 118,
    "Vie Scolaire": 27,
    "Administration & Finances": 21,
    "Ressources Humaines": 9,
    "Informatique & Numérique": 8,
    "Maintenance & Logistique": 26,
    Restauration: 18,
    "Santé & Infirmerie": 6,
    "Admissions & Communication": 10,
    "Transport Scolaire": 6,
  };

  let i = 0;
  for (const service of SERVICES) {
    const nb = repartition[service] ?? 5;
    for (let k = 0; k < nb; k++) {
      i++;
      const femme = rng() > 0.45;
      const prenom = femme ? pick(PRENOMS_F) : pick(PRENOMS_M);
      const nom = pick(NOMS);
      const anneeArrivee = int(2004, 2026);
      const moisArrivee = int(1, 12);
      const jourArrivee = int(1, 28);
      const statutTirage = rng();
      liste.push({
        id: `COL-${String(i).padStart(3, "0")}`,
        matricule: `LM${String(1000 + i)}`,
        nom,
        prenom,
        email: `${prenom.toLowerCase().replace(/[^a-z]/g, "").charAt(0)}.${nom.toLowerCase().replace(/[^a-z]/g, "")}@lfilm.org`,
        telephone: `+212 6 ${int(10, 99)} ${int(10, 99)} ${int(10, 99)} ${int(10, 99)}`,
        service,
        fonction: pick(FONCTIONS[service] ?? ["Agent"]),
        contrat: rng() > 0.78 ? (rng() > 0.5 ? "CDD" : rng() > 0.5 ? "Détachement" : "Vacataire") : "CDI",
        dateArrivee: `${anneeArrivee}-${String(moisArrivee).padStart(2, "0")}-${String(jourArrivee).padStart(2, "0")}`,
        dateNaissance: `${int(1968, 2000)}-${String(int(1, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
        statut: statutTirage > 0.94 ? "En congé" : statutTirage > 0.985 ? "Inactif" : "Actif",
        responsable: pick(RESPONSABLES),
        site: rng() > 0.12 ? "Bouskoura – Ville Verte" : "Casa Anfa",
        soldeConges: int(3, 26),
        adresse: pick([
          "Bouskoura, Ville Verte",
          "Casablanca, Anfa",
          "Casablanca, Californie",
          "Dar Bouazza",
          "Casablanca, Gauthier",
          "Bouskoura Centre",
        ]),
      });
    }
  }
  return liste;
}

export const collaborateurs: Collaborateur[] = genererCollaborateurs();

export const getCollaborateur = (id: string) => collaborateurs.find((c) => c.id === id);
export const nomComplet = (id: string) => {
  const c = getCollaborateur(id);
  return c ? `${c.prenom} ${c.nom}` : "—";
};

/* ------------------------------------------------------------------ */
/* Absences & congés                                                   */
/* ------------------------------------------------------------------ */
const MOTIFS: Record<string, string[]> = {
  "Congé annuel": ["Congés d'automne", "Congés famille", "Voyage planifié", "Repos annuel"],
  Maladie: ["Arrêt maladie – grippe", "Certificat médical 3 jours", "Convalescence post-opératoire", "Migraine sévère"],
  "Absence exceptionnelle": ["Décès d'un proche", "Mariage", "Naissance", "Déménagement"],
  Télétravail: ["Préparation pédagogique à distance", "Travail administratif à distance", "Grève des transports"],
  "Autorisation d'absence": ["Rendez-vous administratif", "Convocation préfecture", "Rendez-vous médical enfant"],
};

function genererAbsences(): Absence[] {
  const types = Object.keys(MOTIFS) as Absence["type"][];
  const sources: Absence["source"][] = ["Portail RH", "Email", "WhatsApp", "Saisie manuelle"];
  const items: Absence[] = [];
  for (let i = 1; i <= 78; i++) {
    const type = pick(types);
    const debutOffset = int(-45, 35);
    const duree = type === "Congé annuel" ? int(2, 12) : int(1, 4);
    const source = pick(sources);
    const statut: Absence["statut"] =
      debutOffset < -2 ? (rng() > 0.12 ? "Approuvé" : "Refusé") : debutOffset <= 0 ? "En cours" : rng() > 0.45 ? "En attente" : "Approuvé";
    items.push({
      id: `ABS-${String(i).padStart(3, "0")}`,
      collaborateurId: `COL-${String(int(1, 349)).padStart(3, "0")}`,
      type,
      dateDebut: dateDecalee(debutOffset),
      dateFin: dateDecalee(debutOffset + duree),
      duree,
      source,
      statut,
      motif: pick(MOTIFS[type]!),
      detectionIA:
        source === "Email"
          ? "Demande extraite automatiquement d'un email entrant (confiance 96 %)."
          : source === "WhatsApp"
            ? "Message WhatsApp interprété par l'IA : type et dates détectés (confiance 91 %)."
            : undefined,
    });
  }
  return items;
}

export const absences: Absence[] = genererAbsences();

/* ------------------------------------------------------------------ */
/* Événements RH                                                       */
/* ------------------------------------------------------------------ */
function genererEvenements(): EvenementRH[] {
  const types: EvenementRH["type"][] = [
    "Visite médicale",
    "Formation",
    "Entretien annuel",
    "Renouvellement de document",
    "Échéance de contrat",
    "Certification",
    "Évaluation",
  ];
  const intitules: Record<string, string[]> = {
    "Visite médicale": ["Visite médicale annuelle", "Visite de reprise", "Visite d'embauche"],
    Formation: [
      "Formation premiers secours (SST)",
      "Formation numérique éducatif",
      "Formation gestion de classe",
      "Formation sécurité incendie",
    ],
    "Entretien annuel": ["Entretien annuel d'évaluation", "Entretien professionnel"],
    "Renouvellement de document": ["Renouvellement carte de séjour", "Mise à jour casier judiciaire", "Renouvellement titre de travail"],
    "Échéance de contrat": ["Fin de CDD", "Échéance période d'essai", "Renouvellement de contrat"],
    Certification: ["Certification Cambridge", "Habilitation électrique", "Certification HACCP"],
    Évaluation: ["Évaluation pédagogique", "Inspection pédagogique"],
  };
  const items: EvenementRH[] = [];
  for (let i = 1; i <= 46; i++) {
    const type = pick(types);
    const offset = int(-25, 70);
    items.push({
      id: `EVT-${String(i).padStart(3, "0")}`,
      intitule: pick(intitules[type]!),
      collaborateurId: `COL-${String(int(1, 349)).padStart(3, "0")}`,
      type,
      date: dateDecalee(offset),
      responsable: pick(RESPONSABLES),
      statut: offset < -5 ? (rng() > 0.2 ? "Terminé" : "En retard") : offset < 0 ? "En cours" : rng() > 0.35 ? "Planifié" : "À planifier",
    });
  }
  return items;
}

export const evenements: EvenementRH[] = genererEvenements();

/* ------------------------------------------------------------------ */
/* Recrutement                                                         */
/* ------------------------------------------------------------------ */
const POSTES = [
  "Professeur de mathématiques (secondaire)",
  "Professeur des écoles (cycle 2)",
  "Chargé de recrutement RH",
  "Technicien support informatique",
  "Infirmière scolaire",
  "Comptable fournisseurs",
  "Assistant d'éducation",
  "Professeur d'anglais",
  "Chargé d'admissions",
  "Responsable maintenance",
];

const COMPETENCES_POOL = [
  "Pédagogie différenciée",
  "Programmes AEFE",
  "Gestion de classe",
  "Anglais courant",
  "Arabe classique",
  "Suite Google Workspace",
  "Pronote",
  "SIRH",
  "Droit du travail marocain",
  "Paie",
  "Recrutement",
  "Réseaux & systèmes",
  "Support utilisateur",
  "Comptabilité générale",
  "Sage X3",
  "Relation familles",
  "Communication digitale",
  "Premiers secours",
];

function genererCandidats(): Candidat[] {
  const etapes: Candidat["etape"][] = [
    "Nouveau",
    "Préqualification",
    "Screening IA",
    "Entretien",
    "Entretien final",
    "Sélectionné",
    "Onboarding",
  ];
  const items: Candidat[] = [];
  for (let i = 1; i <= 26; i++) {
    const femme = rng() > 0.5;
    const prenom = femme ? pick(PRENOMS_F) : pick(PRENOMS_M);
    const nom = pick(NOMS);
    const score = int(52, 97);
    const comps = [...new Set([pick(COMPETENCES_POOL), pick(COMPETENCES_POOL), pick(COMPETENCES_POOL), pick(COMPETENCES_POOL)])];
    items.push({
      id: `CND-${String(i).padStart(3, "0")}`,
      nom,
      prenom,
      poste: pick(POSTES),
      dateCandidature: dateDecalee(-int(1, 60)),
      experience: int(1, 18),
      scoreIA: score,
      etape: pick(etapes),
      responsable: pick(RESPONSABLES),
      prochaineAction: pick([
        "Planifier un entretien",
        "Analyser le CV",
        "Relancer le candidat",
        "Vérifier les références",
        "Envoyer la proposition",
        "Constituer le dossier d'intégration",
      ]),
      competences: comps,
      pointsForts: [
        `${int(3, 15)} ans d'expérience dans le secteur éducatif`,
        comps[0] ?? "Pédagogie",
        rng() > 0.5 ? "Expérience en établissement du réseau AEFE/MLF" : "Bilingue français / anglais",
      ],
      pointsFaibles: [
        rng() > 0.5 ? "Pas d'expérience sur le cycle demandé" : "Disponibilité à confirmer",
        rng() > 0.5 ? "Références professionnelles manquantes" : "Maîtrise partielle des outils numériques internes",
      ],
      recommandationIA:
        score >= 85
          ? "Profil fortement recommandé : à convoquer en entretien sous 5 jours."
          : score >= 70
            ? "Profil intéressant : préqualification téléphonique recommandée."
            : "Profil en retrait par rapport au poste : à conserver en vivier.",
      email: `${prenom.toLowerCase().replace(/[^a-z]/g, "")}.${nom.toLowerCase().replace(/[^a-z]/g, "")}@email.com`,
      telephone: `+212 6 ${int(10, 99)} ${int(10, 99)} ${int(10, 99)} ${int(10, 99)}`,
    });
  }
  return items;
}

export const candidats: Candidat[] = genererCandidats();

export const entretiens: Entretien[] = candidats.slice(0, 14).map((c, i) => ({
  id: `ENT-${String(i + 1).padStart(3, "0")}`,
  candidatId: c.id,
  poste: c.poste,
  recruteur: pick(RESPONSABLES),
  date: dateDecalee(int(-8, 21)),
  heure: pick(["09:00", "10:30", "11:00", "14:00", "15:30", "16:00"]),
  mode: pick(["Présentiel", "Visioconférence", "Téléphone"] as const),
  statut: pick(["Planifié", "Planifié", "Terminé", "En attente"] as const),
}));

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */
export const documents: DocumentRH[] = Array.from({ length: 28 }, (_, i) => {
  const type = pick([
    "Contrat",
    "Attestation de travail",
    "Attestation de salaire",
    "Convocation",
    "Courrier RH",
    "Certificat",
    "Lettre administrative",
  ] as const);
  const colId = `COL-${String(int(1, 349)).padStart(3, "0")}`;
  return {
    id: `DOC-${String(i + 1).padStart(3, "0")}`,
    nom: `${type} – ${nomComplet(colId)}`,
    type,
    collaborateurId: colId,
    date: dateDecalee(-int(0, 90)),
    statut: pick(["Généré", "Signé", "Brouillon"] as const),
    echeance: rng() > 0.55 ? dateDecalee(int(3, 60)) : undefined,
  };
});

/* ------------------------------------------------------------------ */
/* Demandes & réclamations                                             */
/* ------------------------------------------------------------------ */
const SUJETS_DEMANDE: { sujet: string; categorie: Demande["categorie"]; service: string; message: string }[] = [
  {
    sujet: "Documents nécessaires pour une inscription en CP",
    categorie: "Admission",
    service: "Admissions & Communication",
    message: "Bonjour, je souhaite connaître les documents nécessaires pour inscrire mon enfant en CP à la rentrée prochaine.",
  },
  {
    sujet: "Retard récurrent du bus scolaire ligne 4",
    categorie: "Transport",
    service: "Transport Scolaire",
    message: "Le bus de la ligne 4 arrive systématiquement avec 20 minutes de retard depuis deux semaines.",
  },
  {
    sujet: "Demande d'attestation de scolarité",
    categorie: "Documents",
    service: "Administration & Finances",
    message: "Pourriez-vous m'établir une attestation de scolarité pour ma fille en 5ème B ?",
  },
  {
    sujet: "Facturation du 2ème trimestre",
    categorie: "Finance",
    service: "Administration & Finances",
    message: "Je n'ai pas reçu la facture du deuxième trimestre, pouvez-vous me la renvoyer ?",
  },
  {
    sujet: "Allergie alimentaire non prise en compte à la cantine",
    categorie: "Cantine",
    service: "Restauration",
    message: "Mon fils est allergique aux fruits à coque, le menu de mardi n'était pas adapté.",
  },
  {
    sujet: "Demande d'attestation de travail",
    categorie: "RH",
    service: "Ressources Humaines",
    message: "Je souhaite obtenir une attestation de travail pour une démarche bancaire.",
  },
  {
    sujet: "Inscription aux activités périscolaires",
    categorie: "Vie scolaire",
    service: "Vie Scolaire",
    message: "Comment inscrire mon enfant au club théâtre du mercredi après-midi ?",
  },
  {
    sujet: "Suivi de ma candidature spontanée",
    categorie: "Information générale",
    service: "Ressources Humaines",
    message: "J'ai envoyé ma candidature pour un poste de professeur de mathématiques il y a trois semaines.",
  },
  {
    sujet: "Comportement inapproprié dans la cour",
    categorie: "Réclamation",
    service: "Vie Scolaire",
    message: "Ma fille subit des moqueries répétées pendant la récréation, je demande une intervention.",
  },
  {
    sujet: "Erreur sur le bulletin de paie de septembre",
    categorie: "RH",
    service: "Ressources Humaines",
    message: "Les heures supplémentaires de septembre n'apparaissent pas sur mon bulletin.",
  },
  {
    sujet: "Demande de rendez-vous avec la direction",
    categorie: "Information générale",
    service: "Direction",
    message: "Je souhaiterais rencontrer la direction au sujet de l'orientation de mon fils en seconde.",
  },
  {
    sujet: "Problème d'accès au portail parents",
    categorie: "Inscription",
    service: "Informatique & Numérique",
    message: "Impossible de me connecter au portail famille depuis la mise à jour.",
  },
];

const DEMANDEURS = [
  "M. Karim Belkadi (parent)",
  "Mme Sophie Girard (parent)",
  "M. Rachid Naciri (parent)",
  "Mme Hajar El Amrani (parent)",
  "M. Thomas Lefèvre (collaborateur)",
  "Mme Imane Sebti (collaboratrice)",
  "M. Anas Tahiri (candidat)",
  "Mme Leïla Cherkaoui (parent)",
  "M. Julien Rousseau (parent)",
  "Mme Zineb Filali (parent)",
];

export const demandes: Demande[] = Array.from({ length: 34 }, (_, i) => {
  const base = SUJETS_DEMANDE[i % SUJETS_DEMANDE.length]!;
  const priorite = pick(["Basse", "Normale", "Normale", "Haute", "Urgente"] as const);
  const statut = pick(["Nouveau", "En cours", "En attente", "Résolu", "Fermé"] as const);
  const date = dateDecalee(-int(0, 40));
  return {
    id: `DEM-${String(i + 1).padStart(4, "0")}`,
    demandeur: pick(DEMANDEURS),
    sujet: base.sujet,
    categorie: base.categorie,
    canal: pick(["WhatsApp", "Site web", "Email", "Réseaux sociaux", "Accueil"] as const),
    priorite,
    responsable: pick(RESPONSABLES),
    date,
    statut,
    service: base.service,
    message: base.message,
    reclamation: base.categorie === "Réclamation" || priorite === "Urgente",
    notes: [
      { auteur: "Agent IA", date, texte: `Catégorie détectée automatiquement : ${base.categorie}. Service orienté : ${base.service}.` },
      ...(statut !== "Nouveau"
        ? [{ auteur: pick(RESPONSABLES), date: dateDecalee(-int(0, 5)), texte: "Prise en charge, réponse en cours de préparation." }]
        : []),
    ],
    historique: [
      { date, action: "Demande reçue", auteur: "Système" },
      { date, action: "Classification IA", auteur: "Agent IA" },
      ...(statut === "Résolu" || statut === "Fermé"
        ? [{ date: dateDecalee(-int(0, 3)), action: "Demande clôturée", auteur: pick(RESPONSABLES) }]
        : []),
    ],
  };
});

/* ------------------------------------------------------------------ */
/* Emails                                                              */
/* ------------------------------------------------------------------ */
const EMAILS_BASE = [
  {
    objet: "Où en est ma demande de congé ?",
    corps: "Bonjour, je souhaite savoir où en est ma demande de congé déposée le 2 septembre. Merci d'avance.",
    categorieIA: "Congé",
    service: "Ressources Humaines",
    actionIA: "Vérifier la demande de congé associée",
    reponseSuggeree:
      "Bonjour,\n\nVotre demande de congé du 2 septembre est actuellement en attente de validation par votre responsable de service. Vous recevrez une notification dès sa validation, sous 48 heures.\n\nBien cordialement,\nService Ressources Humaines – LFILM",
  },
  {
    objet: "Demande d'inscription en petite section",
    corps: "Bonjour, nous souhaitons inscrire notre fille en petite section pour la rentrée 2027. Quelle est la procédure ?",
    categorieIA: "Admission",
    service: "Admissions & Communication",
    actionIA: "Envoyer le dossier d'admission",
    reponseSuggeree:
      "Bonjour,\n\nNous vous remercions pour votre intérêt. La procédure d'admission en petite section débute en janvier : dossier en ligne, pièces justificatives, puis rencontre avec l'équipe pédagogique.\n\nBien cordialement,\nService Admissions – LFILM",
  },
  {
    objet: "Certificat médical – arrêt de travail",
    corps: "Bonjour, veuillez trouver ci-joint mon certificat médical pour un arrêt de 3 jours à compter d'aujourd'hui.",
    categorieIA: "Absence",
    service: "Ressources Humaines",
    actionIA: "Créer automatiquement l'absence maladie",
    reponseSuggeree:
      "Bonjour,\n\nNous accusons réception de votre certificat médical. Votre absence a été enregistrée du jour pour une durée de 3 jours.\n\nBon rétablissement,\nService Ressources Humaines – LFILM",
  },
  {
    objet: "Réclamation : facturation en double",
    corps: "Bonjour, j'ai été prélevé deux fois pour la cantine du mois de septembre. Merci de régulariser rapidement.",
    categorieIA: "Réclamation",
    service: "Administration & Finances",
    actionIA: "Ouvrir une réclamation prioritaire",
    reponseSuggeree:
      "Bonjour,\n\nNous sommes désolés pour ce désagrément. Une vérification comptable est engagée et le remboursement interviendra sous 5 jours ouvrés.\n\nBien cordialement,\nService Comptabilité – LFILM",
  },
  {
    objet: "Candidature – Professeur de physique-chimie",
    corps: "Madame, Monsieur, je vous adresse ma candidature pour un poste de professeur de physique-chimie. CV en pièce jointe.",
    categorieIA: "Recrutement",
    service: "Ressources Humaines",
    actionIA: "Créer la candidature et lancer le screening IA",
    reponseSuggeree:
      "Bonjour,\n\nNous accusons réception de votre candidature. Votre dossier est transmis à notre équipe recrutement et sera étudié sous 10 jours.\n\nBien cordialement,\nService Recrutement – LFILM",
  },
  {
    objet: "Attestation de salaire pour dossier bancaire",
    corps: "Bonjour, j'aurais besoin d'une attestation de salaire des trois derniers mois pour un dossier de crédit.",
    categorieIA: "Documents",
    service: "Ressources Humaines",
    actionIA: "Générer l'attestation de salaire",
    reponseSuggeree:
      "Bonjour,\n\nVotre attestation de salaire est en cours d'édition et vous sera transmise sous 48 heures via le portail RH.\n\nBien cordialement,\nService Ressources Humaines – LFILM",
  },
  {
    objet: "Sortie scolaire – autorisation parentale",
    corps: "Bonjour, où puis-je récupérer le formulaire d'autorisation pour la sortie au parc de la Ligue Arabe ?",
    categorieIA: "Vie scolaire",
    service: "Vie Scolaire",
    actionIA: "Envoyer le formulaire d'autorisation",
    reponseSuggeree:
      "Bonjour,\n\nLe formulaire d'autorisation est disponible dans l'espace famille, rubrique « Sorties scolaires ». Il est à retourner signé avant le 25 septembre.\n\nBien cordialement,\nVie Scolaire – LFILM",
  },
  {
    objet: "Changement d'arrêt de bus",
    corps: "Bonjour, nous déménageons à Dar Bouazza, est-il possible de changer l'arrêt de bus de notre fils ?",
    categorieIA: "Transport",
    service: "Transport Scolaire",
    actionIA: "Transmettre au responsable transport",
    reponseSuggeree:
      "Bonjour,\n\nUn changement d'arrêt est possible sous réserve de disponibilité sur la ligne desservant Dar Bouazza. Notre responsable transport vous recontacte cette semaine.\n\nBien cordialement,\nService Transport – LFILM",
  },
];

export const emails: EmailEntrant[] = Array.from({ length: 32 }, (_, i) => {
  const base = EMAILS_BASE[i % EMAILS_BASE.length]!;
  const femme = rng() > 0.5;
  const prenom = femme ? pick(PRENOMS_F) : pick(PRENOMS_M);
  const nom = pick(NOMS);
  return {
    id: `MAIL-${String(i + 1).padStart(3, "0")}`,
    expediteur: `${prenom} ${nom}`,
    emailExpediteur: `${prenom.toLowerCase().replace(/[^a-z]/g, "")}.${nom.toLowerCase().replace(/[^a-z]/g, "")}@gmail.com`,
    objet: base.objet,
    date: dateDecalee(-int(0, 20)),
    categorieIA: base.categorieIA,
    priorite: pick(["Basse", "Normale", "Normale", "Haute", "Urgente"] as const),
    service: base.service,
    statut: pick(["Traité", "Non traité", "Non traité", "En cours"] as const),
    corps: base.corps,
    actionIA: base.actionIA,
    reponseSuggeree: base.reponseSuggeree,
  };
});

/* ------------------------------------------------------------------ */
/* Conversations multicanal                                            */
/* ------------------------------------------------------------------ */
export const conversations: Conversation[] = [
  {
    id: "CONV-001",
    interlocuteur: "Mme Hajar El Amrani",
    canal: "WhatsApp",
    profil: "Parent",
    categorie: "Admission",
    priorite: "Normale",
    service: "Admissions & Communication",
    statut: "En cours",
    dernierMessage: "Je souhaite connaître les documents nécessaires pour inscrire mon enfant.",
    date: dateDecalee(0),
    messages: [
      { auteur: "Demandeur", texte: "Bonjour, je souhaite connaître les documents nécessaires pour inscrire mon enfant en CE1.", heure: "08:42" },
      {
        auteur: "Agent IA",
        texte:
          "Bonjour Madame El Amrani. Pour une inscription en CE1 il vous faut : acte de naissance, certificat de scolarité de l'année en cours, bulletins des deux derniers trimestres, copie CIN des parents, 2 photos et le carnet de vaccination. Souhaitez-vous que je vous transmette le dossier complet ?",
        heure: "08:42",
      },
      { auteur: "Demandeur", texte: "Oui merci, et quels sont les délais ?", heure: "08:47" },
      {
        auteur: "Agent IA",
        texte:
          "Le dossier est à déposer avant le 15 février. Je transmets votre demande au service Admissions qui vous recontactera sous 48 heures pour convenir d'un rendez-vous.",
        heure: "08:48",
      },
    ],
  },
  {
    id: "CONV-002",
    interlocuteur: "M. Thomas Lefèvre",
    canal: "Site web",
    profil: "Collaborateur",
    categorie: "RH",
    priorite: "Normale",
    service: "Ressources Humaines",
    statut: "Résolu",
    dernierMessage: "Comment obtenir une attestation de travail ?",
    date: dateDecalee(-1),
    messages: [
      { auteur: "Demandeur", texte: "Comment obtenir une attestation de travail ?", heure: "14:12" },
      {
        auteur: "Agent IA",
        texte:
          "Bonjour, l'attestation de travail se demande depuis le portail RH, rubrique « Mes documents ». Le délai d'édition est de 48 heures. Souhaitez-vous que je lance la demande pour vous ?",
        heure: "14:12",
      },
      { auteur: "Demandeur", texte: "Oui s'il vous plaît.", heure: "14:15" },
      { auteur: "Agent IA", texte: "Demande DEM-0031 créée et transmise au service RH. Vous recevrez le document par email.", heure: "14:15" },
    ],
  },
  {
    id: "CONV-003",
    interlocuteur: "M. Rachid Naciri",
    canal: "WhatsApp",
    profil: "Parent",
    categorie: "Transport",
    priorite: "Haute",
    service: "Transport Scolaire",
    statut: "En cours",
    dernierMessage: "Le bus de la ligne 4 est encore en retard ce matin.",
    date: dateDecalee(0),
    messages: [
      { auteur: "Demandeur", texte: "Le bus de la ligne 4 est encore en retard ce matin, 25 minutes !", heure: "07:58" },
      {
        auteur: "Agent IA",
        texte:
          "Bonjour Monsieur Naciri, je comprends votre désagrément. Votre signalement est enregistré en priorité haute et transmis au responsable transport. Une réclamation a été ouverte sous la référence DEM-0002.",
        heure: "07:58",
      },
    ],
  },
  {
    id: "CONV-004",
    interlocuteur: "Mme Sophie Girard",
    canal: "Réseaux sociaux",
    profil: "Visiteur",
    categorie: "Information générale",
    priorite: "Basse",
    service: "Admissions & Communication",
    statut: "Nouveau",
    dernierMessage: "Organisez-vous des journées portes ouvertes ?",
    date: dateDecalee(0),
    messages: [
      { auteur: "Demandeur", texte: "Bonjour, organisez-vous des journées portes ouvertes cette année ?", heure: "18:31" },
      {
        auteur: "Agent IA",
        texte:
          "Bonjour, la prochaine journée portes ouvertes du campus de Bouskoura – Ville Verte se tiendra le samedi 14 novembre de 9h à 13h. Souhaitez-vous être inscrite à la liste de rappel ?",
        heure: "18:31",
      },
    ],
  },
  {
    id: "CONV-005",
    interlocuteur: "M. Anas Tahiri",
    canal: "Email",
    profil: "Candidat",
    categorie: "Recrutement",
    priorite: "Normale",
    service: "Ressources Humaines",
    statut: "En cours",
    dernierMessage: "Suivi de ma candidature de professeur de mathématiques.",
    date: dateDecalee(-2),
    messages: [
      { auteur: "Demandeur", texte: "Bonjour, je souhaite avoir un retour sur ma candidature de professeur de mathématiques.", heure: "10:04" },
      {
        auteur: "Agent IA",
        texte:
          "Bonjour Monsieur Tahiri, votre candidature est actuellement à l'étape « Screening IA » avec un score de correspondance de 88 %. Le service recrutement vous recontactera sous 7 jours.",
        heure: "10:05",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Onboarding                                                          */
/* ------------------------------------------------------------------ */
const TACHES_ONBOARDING = [
  "Documents administratifs",
  "Contrat signé",
  "Création du compte",
  "Accès informatique",
  "Badge",
  "Présentation équipe",
  "Formation",
  "Rendez-vous RH",
  "Visite médicale",
];

export const onboardings: Onboarding[] = Array.from({ length: 8 }, (_, i) => {
  const colId = `COL-${String(int(1, 349)).padStart(3, "0")}`;
  const col = getCollaborateur(colId)!;
  const avancement = int(2, 9);
  const taches = TACHES_ONBOARDING.map((libelle, k) => ({
    id: `ONB-${i + 1}-${k + 1}`,
    libelle,
    statut: (k < avancement ? "Terminé" : k === avancement ? "En cours" : rng() > 0.7 ? "En retard" : "À planifier") as
      | "Terminé"
      | "En cours"
      | "En retard"
      | "À planifier",
    echeance: dateDecalee(k * 3 - 6),
    responsable: pick(RESPONSABLES),
  }));
  return {
    id: `ONB-${String(i + 1).padStart(3, "0")}`,
    collaborateurId: colId,
    poste: col.fonction,
    dateArrivee: dateDecalee(-int(0, 25)),
    progression: Math.round((taches.filter((t) => t.statut === "Terminé").length / taches.length) * 100),
    taches,
  };
});

/* ------------------------------------------------------------------ */
/* Séries pour les graphiques                                          */
/* ------------------------------------------------------------------ */
export const effectifsParMois = [
  { mois: "Oct", effectif: 336, recrutements: 4, departs: 2 },
  { mois: "Nov", effectif: 338, recrutements: 3, departs: 1 },
  { mois: "Déc", effectif: 339, recrutements: 2, departs: 1 },
  { mois: "Jan", effectif: 341, recrutements: 5, departs: 3 },
  { mois: "Fév", effectif: 343, recrutements: 4, departs: 2 },
  { mois: "Mar", effectif: 344, recrutements: 3, departs: 2 },
  { mois: "Avr", effectif: 345, recrutements: 4, departs: 3 },
  { mois: "Mai", effectif: 346, recrutements: 3, departs: 2 },
  { mois: "Juin", effectif: 344, recrutements: 2, departs: 4 },
  { mois: "Juil", effectif: 342, recrutements: 1, departs: 3 },
  { mois: "Août", effectif: 345, recrutements: 6, departs: 3 },
  { mois: "Sep", effectif: 349, recrutements: 9, departs: 5 },
];

export const absenteismeParMois = [
  { mois: "Oct", taux: 3.1, enseignants: 2.8, administratif: 3.9 },
  { mois: "Nov", taux: 3.6, enseignants: 3.2, administratif: 4.4 },
  { mois: "Déc", taux: 4.2, enseignants: 3.9, administratif: 5.1 },
  { mois: "Jan", taux: 4.8, enseignants: 4.4, administratif: 5.8 },
  { mois: "Fév", taux: 4.1, enseignants: 3.7, administratif: 5.0 },
  { mois: "Mar", taux: 3.5, enseignants: 3.1, administratif: 4.3 },
  { mois: "Avr", taux: 3.2, enseignants: 2.9, administratif: 4.0 },
  { mois: "Mai", taux: 3.4, enseignants: 3.0, administratif: 4.2 },
  { mois: "Juin", taux: 3.9, enseignants: 3.5, administratif: 4.8 },
  { mois: "Juil", taux: 2.6, enseignants: 2.2, administratif: 3.4 },
  { mois: "Août", taux: 1.9, enseignants: 1.5, administratif: 2.6 },
  { mois: "Sep", taux: 3.8, enseignants: 3.2, administratif: 5.6 },
];

export const repartitionAbsences = [
  { type: "Congé annuel", valeur: 38 },
  { type: "Maladie", valeur: 27 },
  { type: "Absence exceptionnelle", valeur: 14 },
  { type: "Télétravail", valeur: 12 },
  { type: "Autorisation d'absence", valeur: 9 },
];

export const turnoverParTrimestre = [
  { periode: "T4 2025", entrees: 9, sorties: 4, turnover: 1.2 },
  { periode: "T1 2026", entrees: 12, sorties: 7, turnover: 2.0 },
  { periode: "T2 2026", entrees: 9, sorties: 9, turnover: 2.6 },
  { periode: "T3 2026", entrees: 16, sorties: 11, turnover: 3.1 },
];

export const effectifsParService = SERVICES.map((service) => ({
  service,
  effectif: collaborateurs.filter((c) => c.service === service).length,
}));

export const reclamationsParCategorie = [
  { categorie: "Transport", valeur: 9 },
  { categorie: "Cantine", valeur: 7 },
  { categorie: "Finance", valeur: 6 },
  { categorie: "Vie scolaire", valeur: 5 },
  { categorie: "RH", valeur: 4 },
  { categorie: "Admission", valeur: 3 },
];

export const recrutementsParPoste = [
  { poste: "Enseignement", ouverts: 7, pourvus: 4 },
  { poste: "Vie scolaire", ouverts: 3, pourvus: 2 },
  { poste: "Administration", ouverts: 2, pourvus: 1 },
  { poste: "Technique", ouverts: 2, pourvus: 2 },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */
export const notificationsInitiales: NotificationItem[] = [
  {
    id: "NOTIF-1",
    titre: "5 demandes de congés à valider",
    description: "Elles attendent votre validation depuis plus de 48 heures.",
    date: "Il y a 12 min",
    lien: "/rh/absences",
    ton: "alerte",
    lue: false,
  },
  {
    id: "NOTIF-2",
    titre: "3 contrats arrivent à échéance",
    description: "Échéances dans moins de 15 jours – service Enseignement Secondaire.",
    date: "Il y a 1 h",
    lien: "/rh/evenements",
    ton: "alerte",
    lue: false,
  },
  {
    id: "NOTIF-3",
    titre: "2 visites médicales cette semaine",
    description: "À confirmer auprès de la médecine du travail.",
    date: "Il y a 3 h",
    lien: "/rh/evenements",
    ton: "info",
    lue: false,
  },
  {
    id: "NOTIF-4",
    titre: "4 nouvelles candidatures",
    description: "Reçues via le site institutionnel, screening IA disponible.",
    date: "Hier",
    lien: "/recrutement/candidatures",
    ton: "info",
    lue: false,
  },
  {
    id: "NOTIF-5",
    titre: "3 réclamations prioritaires",
    description: "Transport scolaire et facturation – SLA dépassé.",
    date: "Hier",
    lien: "/demandes/reclamations",
    ton: "alerte",
    lue: true,
  },
];
