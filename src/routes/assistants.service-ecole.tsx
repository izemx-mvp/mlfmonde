import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Globe, Mail, MessageCircle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ChatInterface, type MessageChat } from "@/components/shared/chat-interface";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/data/mock";
import type { Conversation } from "@/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/assistants/service-ecole")({
  head: () => ({
    meta: [
      { title: "AI School Service Agent — LFILM Smart School" },
      { name: "description", content: "Agent intelligent multicanal du LFILM : WhatsApp, site web, email et réseaux sociaux pour parents, candidats et collaborateurs." },
      { property: "og:title", content: "AI School Service Agent — LFILM" },
      { property: "og:description", content: "Traitement automatique des demandes des parents et visiteurs du lycée." },
    ],
  }),
  component: PageAgentEcole,
});

const CATEGORIES = [
  "Admission",
  "Inscription",
  "RH",
  "Finance",
  "Vie scolaire",
  "Transport",
  "Cantine",
  "Documents",
  "Réclamation",
  "Information générale",
];

const ICONES_CANAL = {
  WhatsApp: MessageCircle,
  "Site web": Globe,
  Email: Mail,
  "Réseaux sociaux": Facebook,
} as const;

const REPONSES_AGENT: { motsCles: string[]; categorie: string; service: string; priorite: string; reponse: string }[] = [
  {
    motsCles: ["inscri", "admission", "document", "dossier"],
    categorie: "Admission",
    service: "Admissions & Communication",
    priorite: "Normale",
    reponse:
      "Pour inscrire votre enfant au Lycée Louis-Massignon, les pièces suivantes sont nécessaires : acte de naissance, certificat de scolarité de l'année en cours, bulletins des deux derniers trimestres, copies des CIN des parents, 2 photos d'identité et le carnet de vaccination.\n\nLe dossier se dépose en ligne jusqu'au 15 février. Je transmets votre demande au service Admissions, qui vous recontactera sous 48 heures.",
  },
  {
    motsCles: ["bus", "transport", "ramassage"],
    categorie: "Transport",
    service: "Transport Scolaire",
    priorite: "Haute",
    reponse:
      "Votre signalement concernant le transport scolaire est enregistré en priorité haute et transmis au responsable transport. Une réclamation a été créée et vous recevrez un retour sous 24 heures. Les horaires actualisés des lignes sont également disponibles dans l'espace famille.",
  },
  {
    motsCles: ["cantine", "repas", "allergie", "menu"],
    categorie: "Cantine",
    service: "Restauration",
    priorite: "Haute",
    reponse:
      "Votre demande relative à la restauration scolaire est transmise au chef de cuisine et à l'infirmerie. Pour toute allergie alimentaire, un Projet d'Accueil Individualisé (PAI) doit être établi avec le médecin scolaire : je vous envoie le formulaire par email.",
  },
  {
    motsCles: ["facture", "paiement", "frais", "scolarité"],
    categorie: "Finance",
    service: "Administration & Finances",
    priorite: "Normale",
    reponse:
      "Votre question de facturation est transmise au service Administration & Finances. Les factures trimestrielles sont disponibles dans l'espace famille, rubrique « Facturation ». En cas d'erreur de prélèvement, la régularisation intervient sous 5 jours ouvrés.",
  },
  {
    motsCles: ["emploi", "poste", "candidature", "recrut"],
    categorie: "RH",
    service: "Ressources Humaines",
    priorite: "Normale",
    reponse:
      "Les offres d'emploi du lycée sont publiées sur le site institutionnel et sur le réseau mlfmonde. Votre candidature sera automatiquement analysée par notre outil de préqualification, puis transmise au service Recrutement, qui revient vers vous sous 10 jours.",
  },
  {
    motsCles: ["portes ouvertes", "visite", "rendez-vous", "horaires"],
    categorie: "Information générale",
    service: "Admissions & Communication",
    priorite: "Basse",
    reponse:
      "Le campus de Bouskoura – Ville Verte accueille les familles du lundi au vendredi de 8h à 16h30. La prochaine journée portes ouvertes se tiendra le samedi 14 novembre de 9h à 13h. Souhaitez-vous que je vous inscrive à la liste de rappel ?",
  },
];

function PageAgentEcole() {
  const { conversations, majConversation } = useAppStore();
  const [selection, setSelection] = useState<Conversation>(conversations[0]!);
  const [messages, setMessages] = useState<MessageChat[]>([
    {
      id: "a0",
      auteur: "ia",
      texte:
        "Bonjour et bienvenue au Lycée Français International Louis-Massignon 👋 Je suis l'agent de service de l'établissement. Je peux répondre aux questions des parents, des candidats et des visiteurs sur les admissions, la vie scolaire, le transport, la restauration ou la facturation.",
      heure: "09:00",
    },
  ]);
  const [analyse, setAnalyse] = useState<{ categorie: string; service: string; priorite: string } | null>(null);
  const [chargement, setChargement] = useState(false);

  const courante = conversations.find((c) => c.id === selection.id) ?? selection;
  const heure = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const envoyer = (texte: string) => {
    setMessages((p) => [...p, { id: `u-${Date.now()}`, auteur: "utilisateur", texte, heure: heure() }]);
    setChargement(true);
    const trouvee = REPONSES_AGENT.find((r) => r.motsCles.some((m) => texte.toLowerCase().includes(m)));
    setTimeout(() => {
      setAnalyse(
        trouvee
          ? { categorie: trouvee.categorie, service: trouvee.service, priorite: trouvee.priorite }
          : { categorie: "Information générale", service: "Accueil", priorite: "Normale" },
      );
      setMessages((p) => [
        ...p,
        {
          id: `i-${Date.now()}`,
          auteur: "ia",
          texte:
            trouvee?.reponse ??
            "Merci pour votre message. Je n'ai pas identifié de catégorie précise : votre demande est transmise à l'accueil du lycée, qui vous répondra sous 24 heures ouvrées. Vous pouvez m'interroger sur les admissions, la vie scolaire, le transport, la cantine, la facturation ou les recrutements.",
          heure: heure(),
        },
      ]);
      setChargement(false);
    }, 850);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Assistants IA"
        titre="AI School Service Agent"
        description="Agent intelligent multicanal destiné aux parents, candidats, collaborateurs et visiteurs. Chaque message est catégorisé, priorisé et orienté vers le bon service."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(["WhatsApp", "Site web", "Email", "Réseaux sociaux"] as const).map((canal) => {
          const Icone = ICONES_CANAL[canal];
          const nb = conversations.filter((c) => c.canal === canal).length;
          return (
            <div key={canal} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <span className="grid size-10 place-items-center rounded-lg bg-sky/20 text-petrol">
                <Icone className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{canal}</p>
                <p className="text-xs text-muted-foreground">{nb} conversation{nb > 1 ? "s" : ""} active{nb > 1 ? "s" : ""}</p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="mb-3 font-display text-sm font-semibold tracking-wide text-navy uppercase">Demandes entrantes</h2>
          <ul className="space-y-2">
            {conversations.map((c) => {
              const Icone = ICONES_CANAL[c.canal];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelection(c)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      courante.id === c.id ? "border-petrol bg-sky/10" : "border-border bg-surface/50 hover:border-petrol/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Icone className="size-3.5 text-petrol" />
                        {c.interlocuteur}
                      </span>
                      <StatusBadge value={c.priorite} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.dernierMessage}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <StatusBadge value={c.categorie} ton="info" />
                      <StatusBadge value={c.statut} />
                      <span className="text-[11px] text-muted-foreground">{formatDate(c.date)}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="space-y-4 xl:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-semibold text-navy">{courante.interlocuteur}</h2>
                <p className="text-xs text-muted-foreground">
                  {courante.profil} · canal {courante.canal} · {formatDate(courante.date)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    majConversation(courante.id, { statut: "Résolu" });
                    toast.success("Conversation résolue", { description: `${courante.interlocuteur} a reçu une réponse.` });
                  }}
                >
                  Marquer résolu
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    toast.success("Demande transférée", { description: `Dossier envoyé au service ${courante.service}.` })
                  }
                >
                  Transférer au service
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <Bloc libelle="Catégorie détectée" valeur={courante.categorie} />
              <Bloc libelle="Service concerné" valeur={courante.service} />
              <Bloc libelle="Priorité" valeur={courante.priorite} />
              <Bloc libelle="Statut" valeur={courante.statut} />
            </div>

            <div className="mt-4 space-y-2">
              {courante.messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg border p-3 text-sm",
                    m.auteur === "Agent IA" ? "border-sky/40 bg-sky/8" : "border-border bg-surface/60",
                  )}
                >
                  <p className="mb-1 text-[11px] font-semibold text-muted-foreground uppercase">
                    {m.auteur} · {m.heure}
                  </p>
                  <p className="leading-relaxed">{m.texte}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ChatInterface
                messages={messages}
                onEnvoyer={envoyer}
                enChargement={chargement}
                hauteur="h-[480px]"
                suggestions={[
                  "Quels documents pour inscrire mon enfant ?",
                  "Le bus de la ligne 4 est en retard",
                  "Comment régler les frais de scolarité ?",
                  "Y a-t-il des portes ouvertes ?",
                ]}
                entete={
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-leaf/20 text-leaf">
                      <MessageCircle className="size-4" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-navy">Simulateur de conversation</p>
                      <p className="text-xs text-muted-foreground">Testez l'agent comme le ferait un parent ou un visiteur</p>
                    </div>
                  </div>
                }
              />
            </div>

            <div className="rounded-xl border border-sky/40 bg-sky/8 p-4 lg:col-span-2">
              <p className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-navy">
                <Sparkles className="size-4 text-petrol" />
                Analyse IA du dernier message
              </p>
              {analyse ? (
                <ul className="space-y-2 text-sm">
                  <Ligne libelle="Catégorie" valeur={analyse.categorie} />
                  <Ligne libelle="Service" valeur={analyse.service} />
                  <Ligne libelle="Priorité" valeur={analyse.priorite} />
                  <Ligne libelle="Action" valeur="Réponse automatique envoyée" />
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Envoyez un message dans le simulateur : l'IA détectera la catégorie, la priorité et le service concerné.
                </p>
              )}
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Catégories reconnues</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <span
                      key={c}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px]",
                        analyse?.categorie === c ? "bg-petrol text-petrol-foreground" : "bg-background text-muted-foreground",
                      )}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Bloc({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/60 p-2.5">
      <p className="text-[11px] text-muted-foreground uppercase">{libelle}</p>
      <p className="text-sm font-medium">{valeur}</p>
    </div>
  );
}

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/50 pb-1.5 last:border-0">
      <span className="text-muted-foreground">{libelle}</span>
      <span className="text-right font-medium">{valeur}</span>
    </li>
  );
}
