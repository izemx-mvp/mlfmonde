export type Statut =
  | "En attente"
  | "Approuvé"
  | "Refusé"
  | "En cours"
  | "Terminé"
  | "Planifié"
  | "Nouveau"
  | "Résolu"
  | "Fermé"
  | "Actif"
  | "Inactif"
  | "En congé"
  | "À planifier"
  | "En retard"
  | "Signé"
  | "Brouillon"
  | "Généré"
  | "Traité"
  | "Non traité";

export type Priorite = "Basse" | "Normale" | "Haute" | "Urgente";

export interface Collaborateur {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  service: string;
  fonction: string;
  contrat: "CDI" | "CDD" | "Détachement" | "Vacataire" | "Stage";
  dateArrivee: string;
  dateNaissance: string;
  statut: "Actif" | "En congé" | "Inactif";
  responsable: string;
  site: "Bouskoura – Ville Verte" | "Casa Anfa";
  soldeConges: number;
  adresse: string;
}

export interface Absence {
  id: string;
  collaborateurId: string;
  type: "Congé annuel" | "Maladie" | "Absence exceptionnelle" | "Télétravail" | "Autorisation d'absence";
  dateDebut: string;
  dateFin: string;
  duree: number;
  source: "Portail RH" | "Email" | "WhatsApp" | "Saisie manuelle";
  statut: "En attente" | "Approuvé" | "Refusé" | "En cours";
  motif: string;
  detectionIA?: string | undefined;
}

export interface EvenementRH {
  id: string;
  intitule: string;
  collaborateurId: string;
  type:
    | "Visite médicale"
    | "Formation"
    | "Entretien annuel"
    | "Renouvellement de document"
    | "Échéance de contrat"
    | "Certification"
    | "Évaluation";
  date: string;
  responsable: string;
  statut: "Planifié" | "En cours" | "Terminé" | "À planifier" | "En retard";
}

export interface Candidat {
  id: string;
  nom: string;
  prenom: string;
  poste: string;
  dateCandidature: string;
  experience: number;
  scoreIA: number;
  etape:
    | "Nouveau"
    | "Préqualification"
    | "Screening IA"
    | "Entretien"
    | "Entretien final"
    | "Sélectionné"
    | "Onboarding";
  responsable: string;
  prochaineAction: string;
  competences: string[];
  pointsForts: string[];
  pointsFaibles: string[];
  recommandationIA: string;
  email: string;
  telephone: string;
}

export interface Entretien {
  id: string;
  candidatId: string;
  poste: string;
  recruteur: string;
  date: string;
  heure: string;
  mode: "Présentiel" | "Visioconférence" | "Téléphone";
  statut: "Planifié" | "Terminé" | "En attente" | "Refusé";
}

export interface DocumentRH {
  id: string;
  nom: string;
  type:
    | "Contrat"
    | "Attestation de travail"
    | "Attestation de salaire"
    | "Convocation"
    | "Courrier RH"
    | "Certificat"
    | "Lettre administrative";
  collaborateurId: string;
  date: string;
  statut: "Généré" | "Signé" | "Brouillon";
  echeance?: string | undefined;
}

export interface Demande {
  id: string;
  demandeur: string;
  sujet: string;
  categorie:
    | "Admission"
    | "Inscription"
    | "RH"
    | "Finance"
    | "Vie scolaire"
    | "Transport"
    | "Cantine"
    | "Documents"
    | "Réclamation"
    | "Information générale";
  canal: "WhatsApp" | "Site web" | "Email" | "Réseaux sociaux" | "Accueil";
  priorite: Priorite;
  responsable: string;
  date: string;
  statut: "Nouveau" | "En cours" | "En attente" | "Résolu" | "Fermé";
  service: string;
  message: string;
  reclamation: boolean;
  notes: { auteur: string; date: string; texte: string }[];
  historique: { date: string; action: string; auteur: string }[];
}

export interface EmailEntrant {
  id: string;
  expediteur: string;
  emailExpediteur: string;
  objet: string;
  date: string;
  categorieIA: string;
  priorite: Priorite;
  service: string;
  statut: "Traité" | "Non traité" | "En cours";
  corps: string;
  actionIA: string;
  reponseSuggeree: string;
}

export interface Conversation {
  id: string;
  interlocuteur: string;
  canal: "WhatsApp" | "Site web" | "Email" | "Réseaux sociaux";
  profil: "Parent" | "Candidat" | "Collaborateur" | "Visiteur";
  categorie: string;
  priorite: Priorite;
  service: string;
  statut: "Nouveau" | "En cours" | "Résolu";
  dernierMessage: string;
  date: string;
  messages: { auteur: "Demandeur" | "Agent IA"; texte: string; heure: string }[];
}

export interface TacheOnboarding {
  id: string;
  libelle: string;
  statut: "Terminé" | "En cours" | "En retard" | "À planifier";
  echeance: string;
  responsable: string;
}

export interface Onboarding {
  id: string;
  collaborateurId: string;
  poste: string;
  dateArrivee: string;
  progression: number;
  taches: TacheOnboarding[];
}

export interface NotificationItem {
  id: string;
  titre: string;
  description: string;
  date: string;
  lien: string;
  ton: "info" | "alerte" | "succes";
  lue: boolean;
}
