import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Globe, Mail, MessageCircle, Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/data/mock";
import type { Conversation } from "@/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/demandes/conversations")({
  head: () => ({
    meta: [
      { title: "Conversations multicanales — LFILM Smart School" },
      { name: "description", content: "Messagerie unifiée du LFILM : conversations WhatsApp, site web, email et réseaux sociaux avec suivi et réponses assistées." },
      { property: "og:title", content: "Conversations — LFILM Smart School" },
      { property: "og:description", content: "Messagerie unifiée des échanges du lycée avec les familles." },
    ],
  }),
  component: PageConversations,
});

const ICONES = {
  WhatsApp: MessageCircle,
  "Site web": Globe,
  Email: Mail,
  "Réseaux sociaux": Facebook,
} as const;

function PageConversations() {
  const { conversations, ajouterMessageConversation, majConversation } = useAppStore();
  const [selectionId, setSelectionId] = useState(conversations[0]?.id ?? "");
  const [filtreCanal, setFiltreCanal] = useState("Tous");
  const [texte, setTexte] = useState("");

  const liste = conversations.filter((c) => filtreCanal === "Tous" || c.canal === filtreCanal);
  const courante: Conversation | undefined = conversations.find((c) => c.id === selectionId) ?? liste[0];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Demandes & Réclamations"
        titre="Conversations"
        description="Messagerie unifiée : tous les échanges avec les familles, candidats et collaborateurs, quel que soit le canal d'origine, dans un seul fil de discussion."
        actions={
          <Select value={filtreCanal} onValueChange={setFiltreCanal}>
            <SelectTrigger className="w-[190px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les canaux</SelectItem>
              {["WhatsApp", "Site web", "Email", "Réseaux sociaux"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
          <ul className="space-y-2">
            {liste.length === 0 && (
              <li className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Aucune conversation sur ce canal.
              </li>
            )}
            {liste.map((c) => {
              const Icone = ICONES[c.canal];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectionId(c.id)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      courante?.id === c.id ? "border-petrol bg-sky/10" : "border-border bg-surface/50 hover:border-petrol/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Icone className="size-3.5 text-petrol" />
                        {c.interlocuteur}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{formatDate(c.date)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.dernierMessage}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <StatusBadge value={c.profil} ton="neutre" />
                      <StatusBadge value={c.statut} />
                      <StatusBadge value={c.priorite} />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {courante ? (
          <section className="flex min-h-[600px] flex-col rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
              <div>
                <h2 className="font-display text-base font-semibold text-navy">{courante.interlocuteur}</h2>
                <p className="text-xs text-muted-foreground">
                  {courante.profil} · {courante.canal} · service {courante.service}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={courante.categorie} ton="info" />
                <Select
                  value={courante.statut}
                  onValueChange={(v) => {
                    majConversation(courante.id, { statut: v as Conversation["statut"] });
                    toast.success("Statut mis à jour", { description: `${courante.interlocuteur} → ${v}` });
                  }}
                >
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Nouveau", "En cours", "Résolu"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-surface/40 p-4">
              {courante.messages.map((m, i) => (
                <div key={i} className={cn("flex", m.auteur === "Agent IA" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                      m.auteur === "Agent IA" ? "bg-petrol text-petrol-foreground" : "border border-border bg-card",
                    )}
                  >
                    {m.texte}
                    <p className={cn("mt-1 text-[11px]", m.auteur === "Agent IA" ? "text-petrol-foreground/70" : "text-muted-foreground")}>
                      {m.auteur} · {m.heure}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <footer className="space-y-2 border-t border-border p-4">
              <Textarea
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder={`Répondre à ${courante.interlocuteur} sur ${courante.canal}…`}
                className="min-h-20"
              />
              <div className="flex flex-wrap justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTexte(
                      `Bonjour ${courante.interlocuteur.split(" ")[0]}, merci pour votre message. Votre demande relative à « ${courante.categorie} » a bien été transmise au service ${courante.service}. Vous recevrez une réponse détaillée sous 48 heures ouvrées. Bien cordialement, Lycée Louis-Massignon.`,
                    );
                    toast.success("Réponse suggérée par l'IA");
                  }}
                >
                  <Sparkles className="size-4" />
                  Suggérer une réponse
                </Button>
                <Button
                  onClick={() => {
                    if (!texte.trim()) {
                      toast.error("Message vide", { description: "Saisissez une réponse avant l'envoi." });
                      return;
                    }
                    ajouterMessageConversation(courante.id, texte.trim());
                    setTexte("");
                    toast.success("Message envoyé", { description: `Réponse transmise via ${courante.canal}.` });
                  }}
                >
                  <Send className="size-4" />
                  Envoyer
                </Button>
              </div>
            </footer>
          </section>
        ) : (
          <section className="grid min-h-[400px] place-items-center rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Sélectionnez une conversation pour afficher le fil de discussion.
          </section>
        )}
      </div>
    </div>
  );
}
