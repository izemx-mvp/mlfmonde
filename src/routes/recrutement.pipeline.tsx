import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/data/mock";
import type { Candidat } from "@/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/recrutement/pipeline")({
  head: () => ({
    meta: [
      { title: "AI Recruitment Manager — LFILM Smart School" },
      { name: "description", content: "Pipeline de recrutement du LFILM : de la candidature au parcours d'intégration, avec scoring IA." },
      { property: "og:title", content: "AI Recruitment Manager — LFILM" },
      { property: "og:description", content: "Pipeline Kanban du recrutement assisté par IA." },
    ],
  }),
  component: PagePipeline,
});

const ETAPES: Candidat["etape"][] = [
  "Nouveau",
  "Préqualification",
  "Screening IA",
  "Entretien",
  "Entretien final",
  "Sélectionné",
  "Onboarding",
];

const COULEURS: Record<string, string> = {
  Nouveau: "border-t-sky",
  Préqualification: "border-t-petrol",
  "Screening IA": "border-t-gold",
  Entretien: "border-t-orange",
  "Entretien final": "border-t-brick",
  Sélectionné: "border-t-leaf",
  Onboarding: "border-t-navy",
};

function PagePipeline() {
  const { candidats, majCandidat } = useAppStore();

  const deplacer = (c: Candidat, sens: -1 | 1) => {
    const index = ETAPES.indexOf(c.etape);
    const cible = ETAPES[index + sens];
    if (!cible) return;
    majCandidat(c.id, { etape: cible });
    toast.success("Candidat déplacé", { description: `${c.prenom} ${c.nom} → étape « ${cible} ».` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Recrutement"
        titre="AI Recruitment Manager"
        description="Pipeline complet des candidatures du lycée. L'IA calcule un score de correspondance et propose la prochaine action à chaque étape."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Scores recalculés", { description: `${candidats.length} candidatures réévaluées par le moteur de matching.` })
            }
          >
            <Sparkles className="size-4" />
            Recalculer les scores IA
          </Button>
        }
      />

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {ETAPES.map((etape) => {
            const items = candidats.filter((c) => c.etape === etape);
            return (
              <section key={etape} className={cn("w-72 shrink-0 rounded-xl border border-t-4 border-border bg-card p-3", COULEURS[etape])}>
                <header className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-sm font-semibold text-navy">{etape}</h2>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-muted-foreground">{items.length}</span>
                </header>
                <div className="space-y-2">
                  {items.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Aucun candidat à cette étape.
                    </p>
                  )}
                  {items.map((c) => (
                    <article key={c.id} className="rounded-lg border border-border bg-surface/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {c.prenom} {c.nom}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{c.poste}</p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                            c.scoreIA >= 85 ? "bg-leaf/20 text-leaf" : c.scoreIA >= 70 ? "bg-gold/25 text-gold-foreground" : "bg-brick/12 text-brick",
                          )}
                        >
                          {c.scoreIA}%
                        </span>
                      </div>
                      <dl className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                        <div className="flex justify-between gap-2">
                          <dt>Candidature</dt>
                          <dd>{formatDate(c.dateCandidature)}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt>Expérience</dt>
                          <dd>{c.experience} ans</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt>Responsable</dt>
                          <dd className="truncate">{c.responsable}</dd>
                        </div>
                      </dl>
                      <p className="mt-2 rounded-md bg-sky/12 px-2 py-1 text-[11px] text-petrol">▸ {c.prochaineAction}</p>
                      <div className="mt-2 flex gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-7"
                          aria-label="Étape précédente"
                          disabled={ETAPES.indexOf(c.etape) === 0}
                          onClick={() => deplacer(c, -1)}
                        >
                          <ChevronLeft className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-7"
                          aria-label="Étape suivante"
                          disabled={ETAPES.indexOf(c.etape) === ETAPES.length - 1}
                          onClick={() => deplacer(c, 1)}
                        >
                          <ChevronRight className="size-3.5" />
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
