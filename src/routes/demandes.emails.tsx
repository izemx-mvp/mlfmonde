import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Mail, MailCheck, Sparkles, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/data/mock";
import type { EmailEntrant } from "@/data/types";
import { toast } from "sonner";

export const Route = createFileRoute("/demandes/emails")({
  head: () => ({
    meta: [
      { title: "AI Email Management — LFILM Smart School" },
      { name: "description", content: "Boîte email intelligente du LFILM : classification automatique, détection d'urgence, orientation par service et réponses suggérées." },
      { property: "og:title", content: "AI Email Management — LFILM" },
      { property: "og:description", content: "Traitement automatisé des emails entrants du lycée." },
    ],
  }),
  component: PageEmails,
});

function PageEmails() {
  const { emails, majEmail, ajouterNotification } = useAppStore();
  const [detail, setDetail] = useState<EmailEntrant | null>(null);
  const [reponse, setReponse] = useState("");
  const [genere, setGenere] = useState(false);
  const [fStatut, setFStatut] = useState("Tous");
  const [fCategorie, setFCategorie] = useState("Toutes");

  const courant = detail ? (emails.find((e) => e.id === detail.id) ?? detail) : null;
  const categories = Array.from(new Set(emails.map((e) => e.categorieIA))).sort();

  const filtres = emails.filter(
    (e) => (fStatut === "Tous" || e.statut === fStatut) && (fCategorie === "Toutes" || e.categorieIA === fCategorie),
  );

  const nonTraites = emails.filter((e) => e.statut === "Non traité").length;
  const urgents = emails.filter((e) => e.priorite === "Urgente" || e.priorite === "Haute").length;
  const traites = emails.filter((e) => e.statut === "Traité").length;

  const colonnes: Column<EmailEntrant>[] = [
    {
      key: "expediteur",
      header: "Expéditeur",
      sortValue: (e) => e.expediteur,
      render: (e) => (
        <div>
          <p className="font-medium">{e.expediteur}</p>
          <p className="text-xs text-muted-foreground">{e.emailExpediteur}</p>
        </div>
      ),
    },
    { key: "objet", header: "Objet", sortValue: (e) => e.objet, render: (e) => <span className="block max-w-[280px] truncate">{e.objet}</span> },
    { key: "date", header: "Date", sortValue: (e) => e.date, render: (e) => formatDate(e.date) },
    { key: "categorieIA", header: "Catégorie IA", sortValue: (e) => e.categorieIA, render: (e) => <StatusBadge value={e.categorieIA} ton="info" /> },
    { key: "priorite", header: "Priorité", sortValue: (e) => e.priorite, render: (e) => <StatusBadge value={e.priorite} /> },
    { key: "service", header: "Service", sortValue: (e) => e.service, render: (e) => e.service },
    { key: "statut", header: "Statut", sortValue: (e) => e.statut, render: (e) => <StatusBadge value={e.statut} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (e) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setDetail(e);
            setReponse("");
            setGenere(false);
          }}
        >
          <Eye className="size-4" />
          Ouvrir
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Demandes & Réclamations"
        titre="AI Email Management"
        description="Chaque email reçu sur les adresses institutionnelles est lu par l'IA : extraction du sujet, classification, détection d'urgence, orientation vers le service et proposition de réponse."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Emails reçus" valeur={emails.length} icone={Mail} couleur="petrol" detail="7 derniers jours" />
        <KPICard label="Non traités" valeur={nonTraites} icone={Mail} couleur="orange" positif={false} evolution={6} />
        <KPICard label="Urgents détectés" valeur={urgents} icone={Zap} couleur="brick" positif={false} evolution={3} />
        <KPICard label="Traités automatiquement" valeur={traites} icone={MailCheck} couleur="leaf" evolution={18} />
      </section>

      <section className="rounded-xl border border-sky/40 bg-sky/8 p-4">
        <p className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-navy">
          <Sparkles className="size-4 text-petrol" /> Automatisation en cours
        </p>
        <ul className="grid gap-1.5 text-sm text-muted-foreground md:grid-cols-3">
          <li>• 32 emails classés automatiquement par catégorie et service.</li>
          <li>• 9 demandes de congé détectées et rapprochées du dossier collaborateur.</li>
          <li>• 4 emails urgents escaladés au service concerné en moins de 5 minutes.</li>
        </ul>
      </section>

      <DataTable
        data={filtres}
        columns={colonnes}
        rowKey={(e) => e.id}
        onRowClick={(e) => {
          setDetail(e);
          setReponse("");
          setGenere(false);
        }}
        placeholderRecherche="Expéditeur, objet, service…"
        recherche={(e, t) => `${e.expediteur} ${e.emailExpediteur} ${e.objet} ${e.service} ${e.categorieIA}`.toLowerCase().includes(t)}
        filtres={
          <>
            <Select value={fStatut} onValueChange={setFStatut}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                {["Non traité", "En cours", "Traité"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={fCategorie} onValueChange={setFCategorie}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Toutes">Toutes catégories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </>
        }
      />

      <Dialog open={!!courant} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {courant && (
            <>
              <DialogHeader>
                <DialogTitle>{courant.objet}</DialogTitle>
                <DialogDescription>
                  {courant.expediteur} &lt;{courant.emailExpediteur}&gt; · {formatDate(courant.date)}
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-lg border border-border bg-surface/60 p-3 text-sm leading-relaxed whitespace-pre-line">
                {courant.corps}
              </div>

              <div className="rounded-lg border border-sky/40 bg-sky/8 p-3">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-navy">
                  <Sparkles className="size-4 text-petrol" /> Analyse IA
                </p>
                <div className="grid gap-2 sm:grid-cols-4">
                  <Bloc libelle="Catégorie" valeur={courant.categorieIA} />
                  <Bloc libelle="Priorité" valeur={courant.priorite} />
                  <Bloc libelle="Service" valeur={courant.service} />
                  <Bloc libelle="Action" valeur={courant.actionIA} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setReponse(courant.reponseSuggeree);
                      setGenere(true);
                      toast.success("Réponse générée par l'IA", { description: "Relisez puis envoyez." });
                    }}
                  >
                    <Sparkles className="size-4" />
                    Générer une réponse IA
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      ajouterNotification({
                        titre: "Tâche créée depuis un email",
                        description: `${courant.actionIA} — ${courant.expediteur}.`,
                        date: "2026-09-17",
                        lien: "/demandes",
                        ton: "info",
                      });
                      toast.success("Tâche créée", { description: courant.actionIA });
                    }}
                  >
                    Créer une tâche
                  </Button>
                </div>
                <Textarea
                  value={reponse}
                  onChange={(e) => setReponse(e.target.value)}
                  placeholder="Rédigez une réponse ou générez-la avec l'IA…"
                  className="min-h-32"
                />
                {genere && (
                  <p className="text-xs text-leaf">Réponse proposée par l'IA à partir des modèles de courrier du lycée.</p>
                )}
              </div>

              <DialogFooter className="flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    majEmail(courant.id, { statut: "En cours" });
                    toast.success("Email marqué en cours de traitement");
                  }}
                >
                  Marquer en cours
                </Button>
                <Button
                  onClick={() => {
                    if (!reponse.trim()) {
                      toast.error("Réponse vide", { description: "Générez ou rédigez une réponse avant l'envoi." });
                      return;
                    }
                    majEmail(courant.id, { statut: "Traité" });
                    toast.success("Réponse envoyée", { description: `Email adressé à ${courant.expediteur}.` });
                    setDetail(null);
                  }}
                >
                  Envoyer la réponse
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Bloc({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/70 p-2.5">
      <p className="text-[11px] text-muted-foreground uppercase">{libelle}</p>
      <p className="text-sm font-medium">{valeur}</p>
    </div>
  );
}
