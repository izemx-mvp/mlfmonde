import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Database, FileUp, Link2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type SourceIA = {
  id: string;
  nom: string;
  type: "Document" | "Lien" | "Procédure" | "Note interne";
  service: string;
  statut: "Actif" | "À vérifier" | "Inactif";
  maj: string;
};

const SOURCES_INITIALES: SourceIA[] = [
  { id: "src-1", nom: "Règlement intérieur du personnel", type: "Document", service: "RH", statut: "Actif", maj: "17/09/2026" },
  { id: "src-2", nom: "Procédure absences et congés", type: "Procédure", service: "RH", statut: "Actif", maj: "12/09/2026" },
  { id: "src-3", nom: "Admissions et inscriptions familles", type: "Document", service: "Admissions", statut: "À vérifier", maj: "02/09/2026" },
  { id: "src-4", nom: "FAQ transport et cantine", type: "Lien", service: "Vie scolaire", statut: "Actif", maj: "29/08/2026" },
];

export const Route = createFileRoute("/configuration-ia/base-connaissances")({
  head: () => ({
    meta: [
      { title: "Base de connaissances IA — LFILM Smart School" },
      { name: "description", content: "Gestion des documents et sources d’apprentissage des agents IA LFILM." },
      { property: "og:title", content: "Base de connaissances IA — LFILM" },
      { property: "og:description", content: "Organiser les sources documentaires utilisées par les agents intelligents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PageBaseConnaissances,
});

function PageBaseConnaissances() {
  const [sources, setSources] = useState(SOURCES_INITIALES);
  const [nom, setNom] = useState("");
  const [type, setType] = useState<SourceIA["type"]>("Document");
  const [service, setService] = useState("RH");

  function ajouterSource() {
    if (!nom.trim()) {
      toast.error("Nom requis", { description: "Renseignez le nom de la source." });
      return;
    }
    setSources((liste) => [
      { id: `src-${Date.now()}`, nom: nom.trim(), type, service, statut: "À vérifier", maj: "17/09/2026" },
      ...liste,
    ]);
    setNom("");
    toast.success("Source ajoutée", { description: "Elle est prête pour vérification." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Configuration IA"
        titre="Base de connaissances"
        description="Centralisation des documents, procédures et sources qui alimentent les réponses des agents IA."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Indicateur libelle="Sources indexées" valeur={String(sources.length)} />
        <Indicateur libelle="Sources actives" valeur={String(sources.filter((source) => source.statut === "Actif").length)} />
        <Indicateur libelle="À vérifier" valeur={String(sources.filter((source) => source.statut === "À vérifier").length)} />
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <FileUp className="size-4 text-petrol" />
          Ajouter une source
        </h2>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto] lg:items-end">
          <Champ libelle="Nom ou référence">
            <Input value={nom} onChange={(event) => setNom(event.target.value)} placeholder="Ex. Guide accueil enseignants" />
          </Champ>
          <Champ libelle="Type">
            <Select value={type} onValueChange={(valeur) => setType(valeur as SourceIA["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Document", "Lien", "Procédure", "Note interne"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </Champ>
          <Champ libelle="Service">
            <Select value={service} onValueChange={setService}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["RH", "Admissions", "Vie scolaire", "Finance", "Direction"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </Champ>
          <Button onClick={ajouterSource}>
            <Plus className="size-4" />
            Ajouter
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <Database className="size-4 text-petrol" />
          Sources disponibles
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[minmax(180px,1fr)_120px_140px_120px_120px] bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
            <span>Source</span><span>Type</span><span>Service</span><span>Statut</span><span>Actions</span>
          </div>
          {sources.map((source) => (
            <div key={source.id} className="grid grid-cols-[minmax(180px,1fr)_120px_140px_120px_120px] items-center border-t border-border px-3 py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{source.nom}</p>
                <p className="text-xs text-muted-foreground">Mise à jour : {source.maj}</p>
              </div>
              <span>{source.type}</span>
              <span>{source.service}</span>
              <StatusBadge value={source.statut} />
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Réindexer" onClick={() => toast.success("Source réindexée", { description: source.nom })}>
                  <RefreshCw className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Supprimer" onClick={() => setSources((liste) => liste.filter((item) => item.id !== source.id))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <Link2 className="size-4 text-petrol" />
          Couverture IA
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["RH", "Admissions", "Vie scolaire", "Finance"].map((domaine) => (
            <div key={domaine} className="rounded-lg border border-border bg-surface/60 p-3">
              <p className="text-sm font-medium">{domaine}</p>
              <p className="mt-1 text-xs text-muted-foreground">{sources.filter((source) => source.service === domaine).length} source(s) associée(s)</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Indicateur({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold text-muted-foreground uppercase">{libelle}</p>
      <p className="mt-2 font-display text-3xl font-bold text-navy">{valeur}</p>
    </div>
  );
}

function Champ({ libelle, children }: { libelle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase">{libelle}</Label>
      {children}
    </div>
  );
}
