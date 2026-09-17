import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  absences as absencesSeed,
  candidats as candidatsSeed,
  collaborateurs as collaborateursSeed,
  conversations as conversationsSeed,
  demandes as demandesSeed,
  documents as documentsSeed,
  emails as emailsSeed,
  entretiens as entretiensSeed,
  evenements as evenementsSeed,
  notificationsInitiales,
  onboardings as onboardingsSeed,
} from "@/data/mock";
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
} from "@/data/types";

interface AppState {
  collaborateurs: Collaborateur[];
  absences: Absence[];
  evenements: EvenementRH[];
  candidats: Candidat[];
  entretiens: Entretien[];
  documents: DocumentRH[];
  demandes: Demande[];
  emails: EmailEntrant[];
  conversations: Conversation[];
  onboardings: Onboarding[];
  notifications: NotificationItem[];

  ajouterCollaborateur: (c: Omit<Collaborateur, "id" | "matricule">) => void;
  majCollaborateur: (id: string, patch: Partial<Collaborateur>) => void;
  supprimerCollaborateur: (id: string) => void;

  ajouterAbsence: (a: Omit<Absence, "id">) => void;
  majAbsence: (id: string, patch: Partial<Absence>) => void;
  supprimerAbsence: (id: string) => void;

  ajouterEvenement: (e: Omit<EvenementRH, "id">) => void;
  majEvenement: (id: string, patch: Partial<EvenementRH>) => void;
  supprimerEvenement: (id: string) => void;

  majCandidat: (id: string, patch: Partial<Candidat>) => void;
  ajouterEntretien: (e: Omit<Entretien, "id">) => void;
  majEntretien: (id: string, patch: Partial<Entretien>) => void;
  supprimerEntretien: (id: string) => void;

  ajouterDocument: (d: Omit<DocumentRH, "id">) => void;
  supprimerDocument: (id: string) => void;

  majDemande: (id: string, patch: Partial<Demande>) => void;
  ajouterNoteDemande: (id: string, texte: string, auteur: string) => void;
  supprimerDemande: (id: string) => void;

  majEmail: (id: string, patch: Partial<EmailEntrant>) => void;
  ajouterMessageConversation: (id: string, texte: string) => void;
  majConversation: (id: string, patch: Partial<Conversation>) => void;
  majTacheOnboarding: (onboardingId: string, tacheId: string, statut: Onboarding["taches"][number]["statut"]) => void;

  ajouterNotification: (n: Omit<NotificationItem, "id" | "lue">) => void;
  marquerNotificationLue: (id: string) => void;
  toutMarquerLu: () => void;
}

const AppContext = createContext<AppState | null>(null);

let compteur = 1000;
const nextId = (prefix: string) => `${prefix}-${++compteur}`;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>(collaborateursSeed);
  const [absences, setAbsences] = useState<Absence[]>(absencesSeed);
  const [evenements, setEvenements] = useState<EvenementRH[]>(evenementsSeed);
  const [candidats, setCandidats] = useState<Candidat[]>(candidatsSeed);
  const [entretiens, setEntretiens] = useState<Entretien[]>(entretiensSeed);
  const [documents, setDocuments] = useState<DocumentRH[]>(documentsSeed);
  const [demandes, setDemandes] = useState<Demande[]>(demandesSeed);
  const [emails, setEmails] = useState<EmailEntrant[]>(emailsSeed);
  const [conversations, setConversations] = useState<Conversation[]>(conversationsSeed);
  const [onboardings, setOnboardings] = useState<Onboarding[]>(onboardingsSeed);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsInitiales);

  const ajouterNotification = useCallback((n: Omit<NotificationItem, "id" | "lue">) => {
    setNotifications((prev) => [{ ...n, id: nextId("NOTIF"), lue: false }, ...prev]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      collaborateurs,
      absences,
      evenements,
      candidats,
      entretiens,
      documents,
      demandes,
      emails,
      conversations,
      onboardings,
      notifications,

      ajouterCollaborateur: (c) =>
        setCollaborateurs((prev) => [
          {
            ...c,
            id: nextId("COL"),
            matricule: `LM${1000 + prev.length + 1}`,
          },
          ...prev,
        ]),
      majCollaborateur: (id, patch) =>
        setCollaborateurs((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      supprimerCollaborateur: (id) => setCollaborateurs((prev) => prev.filter((c) => c.id !== id)),

      ajouterAbsence: (a) => setAbsences((prev) => [{ ...a, id: nextId("ABS") }, ...prev]),
      majAbsence: (id, patch) => setAbsences((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a))),
      supprimerAbsence: (id) => setAbsences((prev) => prev.filter((a) => a.id !== id)),

      ajouterEvenement: (e) => setEvenements((prev) => [{ ...e, id: nextId("EVT") }, ...prev]),
      majEvenement: (id, patch) => setEvenements((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      supprimerEvenement: (id) => setEvenements((prev) => prev.filter((e) => e.id !== id)),

      majCandidat: (id, patch) => setCandidats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      ajouterEntretien: (e) => setEntretiens((prev) => [{ ...e, id: nextId("ENT") }, ...prev]),
      majEntretien: (id, patch) => setEntretiens((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      supprimerEntretien: (id) => setEntretiens((prev) => prev.filter((e) => e.id !== id)),

      ajouterDocument: (d) => setDocuments((prev) => [{ ...d, id: nextId("DOC") }, ...prev]),
      supprimerDocument: (id) => setDocuments((prev) => prev.filter((d) => d.id !== id)),

      majDemande: (id, patch) => setDemandes((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d))),
      ajouterNoteDemande: (id, texte, auteur) =>
        setDemandes((prev) =>
          prev.map((d) =>
            d.id === id
              ? {
                  ...d,
                  notes: [...d.notes, { auteur, date: new Date().toISOString().slice(0, 10), texte }],
                  historique: [
                    ...d.historique,
                    { date: new Date().toISOString().slice(0, 10), action: "Note interne ajoutée", auteur },
                  ],
                }
              : d,
          ),
        ),
      supprimerDemande: (id) => setDemandes((prev) => prev.filter((d) => d.id !== id)),

      majEmail: (id, patch) => setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      ajouterMessageConversation: (id, texte) =>
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  dernierMessage: texte,
                  messages: [
                    ...c.messages,
                    {
                      auteur: "Agent IA" as const,
                      texte,
                      heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                    },
                  ],
                }
              : c,
          ),
        ),
      majConversation: (id, patch) => setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      majTacheOnboarding: (onboardingId, tacheId, statut) =>
        setOnboardings((prev) =>
          prev.map((o) => {
            if (o.id !== onboardingId) return o;
            const taches = o.taches.map((t) => (t.id === tacheId ? { ...t, statut } : t));
            return {
              ...o,
              taches,
              progression: Math.round((taches.filter((t) => t.statut === "Terminé").length / taches.length) * 100),
            };
          }),
        ),

      ajouterNotification,
      marquerNotificationLue: (id) =>
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lue: true } : n))),
      toutMarquerLu: () => setNotifications((prev) => prev.map((n) => ({ ...n, lue: true }))),
    }),
    [
      collaborateurs,
      absences,
      evenements,
      candidats,
      entretiens,
      documents,
      demandes,
      emails,
      conversations,
      onboardings,
      notifications,
      ajouterNotification,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore doit être utilisé dans AppStoreProvider");
  return ctx;
}
