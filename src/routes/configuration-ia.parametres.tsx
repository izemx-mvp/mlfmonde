import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save, SlidersHorizontal, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/configuration-ia/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres IA — LFILM Smart School" },
      { name: "description", content: "Configurations globales du module IA de LFILM Smart School." },
      { property: "og:title", content: "Paramètres IA — LFILM Smart School" },
      { property: "og:description", content: "Définir les règles globales de classification, génération et supervision IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PageParametresIA,
});

function PageParametresIA() {
  const [parametres, setParametres] = useState({
    classificationAuto: true,
    validationHumaine: true,
    escaladeUrgente: true,
    journalisation: true,
    mode: "Supervisé",
    delaiReponse: "2",
    seuilConfiance: "80",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Configuration IA"
        titre="Paramètres"
        description="Configurations globales appliquées aux agents IA, aux réponses générées et à la supervision humaine."
        actions={
          <Button onClick={() => toast.success("Paramètres IA enregistrés", { description: "La configuration globale a été mise à jour." })}>
            <Save className="size-4" />
            Enregistrer
          </Button>
        }
      />

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <SlidersHorizontal className="size-4 text-petrol" />
          Règles globales
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Champ libelle="Mode de fonctionnement">
            <Select value={parametres.mode} onValueChange={(mode) => setParametres((etat) => ({ ...etat, mode }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Supervisé", "Semi-automatique", "Automatique contrôlé"].map((mode) => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
              </SelectContent>
            </Select>
          </Champ>
          <Champ libelle="Délai de réponse cible">
            <Select value={parametres.delaiReponse} onValueChange={(delaiReponse) => setParametres((etat) => ({ ...etat, delaiReponse }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1", "2", "4", "8", "24"].map((heure) => <SelectItem key={heure} value={heure}>{heure} heure(s)</SelectItem>)}
              </SelectContent>
            </Select>
          </Champ>
          <Champ libelle="Seuil de confiance minimum">
            <Input value={parametres.seuilConfiance} onChange={(event) => setParametres((etat) => ({ ...etat, seuilConfiance: event.target.value }))} />
          </Champ>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <Sparkles className="size-4 text-petrol" />
          Automatisations IA
        </h2>
        <ul className="space-y-1">
          {(
            [
              ["classificationAuto", "Classification automatique", "Catégorie, priorité et service responsable proposés automatiquement."],
              ["validationHumaine", "Validation humaine obligatoire", "Toute réponse générée reste contrôlée avant envoi."],
              ["escaladeUrgente", "Escalade des urgences", "Les cas sensibles sont remontés automatiquement à la direction."],
              ["journalisation", "Journal des décisions IA", "Chaque suggestion conserve une trace consultable."],
            ] as const
          ).map(([cle, titre, detail]) => (
            <li key={cle} className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-0">
              <div>
                <p className="text-sm font-medium">{titre}</p>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </div>
              <Switch checked={parametres[cle]} onCheckedChange={(valeur) => setParametres((etat) => ({ ...etat, [cle]: valeur }))} />
            </li>
          ))}
        </ul>
      </section>
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
