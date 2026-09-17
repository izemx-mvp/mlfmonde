import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ChatInterface, type MessageChat } from "@/components/shared/chat-interface";
import { StatusBadge } from "@/components/shared/status-badge";

export const Route = createFileRoute("/assistants/employe")({
  head: () => ({
    meta: [
      { title: "AI Employee Assistant — LFILM Smart School" },
      { name: "description", content: "Assistant RH conversationnel pour les collaborateurs du LFILM : congés, documents, visites médicales et procédures." },
      { property: "og:title", content: "AI Employee Assistant — LFILM" },
      { property: "og:description", content: "Assistant RH conversationnel pour les équipes du lycée." },
    ],
  }),
  component: PageAssistantEmploye,
});

const SUGGESTIONS = [
  "Combien de jours de congés me reste-t-il ?",
  "Comment demander un congé ?",
  "Quels documents dois-je fournir ?",
  "Comment obtenir une attestation de travail ?",
  "Quand est ma prochaine visite médicale ?",
];

const BASE_CONNAISSANCE: { motsCles: string[]; reponse: string }[] = [
  {
    motsCles: ["reste", "solde", "combien de jours"],
    reponse:
      "Il vous reste **14 jours** de congés annuels sur votre droit de 26 jours pour l'année scolaire 2026-2027.\n\nDétail :\n• 8 jours pris en décembre 2025\n• 4 jours pris en avril 2026\n• 3 jours en attente de validation (du 28/09 au 02/10)\n\nVotre solde est mis à jour automatiquement après chaque validation.",
  },
  {
    motsCles: ["demander un congé", "demander un conge", "poser un congé", "procédure congé"],
    reponse:
      "Pour demander un congé :\n1. Rendez-vous dans le module « Absences & Congés » puis cliquez sur « Nouvelle demande ».\n2. Choisissez le type (congé annuel, maladie, absence exceptionnelle, télétravail).\n3. Indiquez les dates et le motif.\n4. Votre responsable de service reçoit une notification et dispose de 48 heures pour valider.\n\nVous pouvez aussi envoyer simplement un email ou un message WhatsApp : l'IA détecte la demande et la crée automatiquement pour vous.",
  },
  {
    motsCles: ["documents", "fournir", "dossier"],
    reponse:
      "Pour compléter votre dossier RH, les pièces suivantes sont attendues :\n• Copie de la CIN ou du passeport en cours de validité\n• Contrat de travail signé\n• RIB au format marocain\n• Diplômes et attestations de travail antérieures\n• Certificat médical d'aptitude\n• 2 photos d'identité\n\nÀ ce jour, il manque à votre dossier : **le RIB mis à jour**.",
  },
  {
    motsCles: ["attestation de travail", "attestation"],
    reponse:
      "L'attestation de travail se demande en deux clics :\n1. Module « Documents » → « AI HR Document Generator »\n2. Type : Attestation de travail → sélectionnez votre nom → Générer\n\nLe document est prérempli avec vos informations contractuelles et signé électroniquement par le service RH. Délai d'édition : **48 heures ouvrées**. Souhaitez-vous que je lance la demande maintenant ?",
  },
  {
    motsCles: ["visite médicale", "visite medicale", "médecin"],
    reponse:
      "Votre prochaine **visite médicale annuelle** est prévue le **8 octobre 2026 à 10h30**, à l'infirmerie du campus de Bouskoura – Ville Verte.\n\nMerci de vous présenter avec votre carnet de suivi. Un rappel automatique vous sera envoyé 48 heures avant le rendez-vous.",
  },
  {
    motsCles: ["paie", "salaire", "bulletin"],
    reponse:
      "Votre bulletin de paie de septembre 2026 sera disponible le **28 septembre** sur le portail RH, rubrique « Mes documents ». En cas d'écart constaté (heures supplémentaires, primes), ouvrez une demande auprès du service RH : le délai de traitement moyen est de 3 jours ouvrés.",
  },
  {
    motsCles: ["formation"],
    reponse:
      "Deux formations sont ouvertes aux inscriptions ce trimestre :\n• Numérique éducatif — 12 et 13 octobre (14 h)\n• Premiers secours SST — 5 novembre (7 h)\n\nL'inscription se fait auprès de votre responsable de service, qui valide la demande dans le module « Événements RH ».",
  },
];

function PageAssistantEmploye() {
  const [messages, setMessages] = useState<MessageChat[]>([
    {
      id: "m0",
      auteur: "ia",
      texte:
        "Bonjour Nadia 👋 Je suis l'assistant RH du Lycée Louis-Massignon. Je peux vous renseigner sur vos congés, vos documents, vos formations et vos rendez-vous médicaux. Que puis-je faire pour vous ?",
      heure: "09:00",
    },
  ]);
  const [chargement, setChargement] = useState(false);

  const heure = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const envoyer = (texte: string) => {
    setMessages((p) => [...p, { id: `u-${Date.now()}`, auteur: "utilisateur", texte, heure: heure() }]);
    setChargement(true);
    const trouvee = BASE_CONNAISSANCE.find((b) => b.motsCles.some((m) => texte.toLowerCase().includes(m)));
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: `i-${Date.now()}`,
          auteur: "ia",
          texte:
            trouvee?.reponse ??
            "Je n'ai pas trouvé d'information précise sur ce point dans la base RH du lycée. Je transmets votre question au service Ressources Humaines : vous recevrez une réponse sous 48 heures. Vous pouvez aussi m'interroger sur vos congés, vos documents, votre paie, vos formations ou votre visite médicale.",
          heure: heure(),
        },
      ]);
      setChargement(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Assistants IA"
        titre="AI Employee Assistant"
        description="Assistant conversationnel interne : il répond aux questions RH des collaborateurs du lycée à partir de leur dossier et des procédures en vigueur."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChatInterface
            messages={messages}
            onEnvoyer={envoyer}
            enChargement={chargement}
            suggestions={SUGGESTIONS}
            hauteur="h-[620px]"
            entete={
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-petrol text-petrol-foreground">
                  <Bot className="size-4" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-navy">Assistant RH LFILM</p>
                  <p className="text-xs text-muted-foreground">Connecté à votre dossier collaborateur · Réponses instantanées</p>
                </div>
                <StatusBadge value="En ligne" ton="succes" className="ml-auto" />
              </div>
            }
          />
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 font-display text-sm font-semibold tracking-wide text-navy uppercase">Mon dossier en un coup d'œil</h2>
            <ul className="space-y-2 text-sm">
              <Ligne libelle="Solde de congés" valeur="14 / 26 jours" />
              <Ligne libelle="Demandes en attente" valeur="1 demande" />
              <Ligne libelle="Prochaine visite médicale" valeur="08/10/2026" />
              <Ligne libelle="Dernière formation" valeur="Numérique éducatif" />
              <Ligne libelle="Documents manquants" valeur="RIB à mettre à jour" />
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 font-display text-sm font-semibold tracking-wide text-navy uppercase">Historique des conversations</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="rounded-lg border border-border bg-surface/60 p-2.5">
                <p className="font-medium text-foreground">Demande d'attestation de travail</p>
                <p className="text-xs">15/09/2026 · résolu</p>
              </li>
              <li className="rounded-lg border border-border bg-surface/60 p-2.5">
                <p className="font-medium text-foreground">Procédure de télétravail</p>
                <p className="text-xs">02/09/2026 · résolu</p>
              </li>
              <li className="rounded-lg border border-border bg-surface/60 p-2.5">
                <p className="font-medium text-foreground">Inscription formation SST</p>
                <p className="text-xs">28/08/2026 · transmis au service RH</p>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{libelle}</span>
      <span className="text-right font-medium">{valeur}</span>
    </li>
  );
}
