import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Circle, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { formatDate, getCollaborateur, nomComplet } from "@/data/mock";
import { GraduationCap, UserCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "AI Onboarding Manager — LFILM Smart School" },
      { name: "description", content: "Suivi de l'intégration des nouveaux collaborateurs du LFILM : checklist, progression et tâches en retard." },
      { property: "og:title", content: "AI Onboarding Manager — LFILM" },
      { property: "og:description", content: "Parcours d'intégration des nouveaux collaborateurs du lycée." },
    ],
  }),
  component: PageOnboarding,
});

function PageOnboarding() {
  const { onboardings, majTacheOnboarding } = useAppStore();

  const moyenne = Math.round(onboardings.reduce((s, o) => s + o.progression, 0) / (onboardings.length || 1));
  const enRetard = onboardings.flatMap((o) => o.taches.filter((t) => t.statut === "En retard"));
  const termines = onboardings.filter((o) => o.progression === 100).length;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Intégration"
        titre="AI Onboarding Manager"
        description="Suivi du parcours d'intégration des nouveaux collaborateurs : documents, accès, matériel, formation et rendez-vous RH."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Intégrations en cours" valeur={onboardings.length} icone={Users} couleur="petrol" />
        <KPICard label="Progression moyenne" valeur={`${moyenne} %`} icone={GraduationCap} couleur="sky" evolution={7} />
        <KPICard label="Parcours terminés" valeur={termines} icone={UserCheck} couleur="leaf" />
        <KPICard label="Tâches en retard" valeur={enRetard.length} icone={AlertTriangle} couleur="brick" positif={false} evolution={4} />
      </section>

      {enRetard.length > 0 && (
        <section className="rounded-xl border border-brick/35 bg-brick/8 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brick">
            <AlertTriangle className="size-4" />
            {enRetard.length} tâches d'intégration sont en retard
          </p>
          <ul className="grid gap-1.5 text-sm text-muted-foreground md:grid-cols-2">
            {enRetard.slice(0, 6).map((t) => (
              <li key={t.id}>
                • {t.libelle} — échéance dépassée le {formatDate(t.echeance)} ({t.responsable})
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {onboardings.map((o) => {
          const col = getCollaborateur(o.collaborateurId);
          return (
            <article key={o.id} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-semibold text-navy">{nomComplet(o.collaborateurId)}</h2>
                  <p className="text-xs text-muted-foreground">
                    {o.poste} · {col?.service} · arrivée le {formatDate(o.dateArrivee)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-petrol">{o.progression} %</p>
                  <p className="text-[11px] text-muted-foreground">complété</p>
                </div>
              </header>

              <Progress value={o.progression} className="mt-3 h-2" />

              <ul className="mt-4 space-y-1.5">
                {o.taches.map((t) => (
                  <li
                    key={t.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border p-2.5 text-sm",
                      t.statut === "En retard" ? "border-brick/35 bg-brick/6" : "border-border bg-surface/50",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {t.statut === "Terminé" ? (
                        <CheckCircle2 className="size-4 shrink-0 text-leaf" />
                      ) : t.statut === "En cours" ? (
                        <Clock className="size-4 shrink-0 text-orange" />
                      ) : (
                        <Circle className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{t.libelle}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          échéance {formatDate(t.echeance)} · {t.responsable}
                        </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <StatusBadge value={t.statut} />
                      {t.statut !== "Terminé" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            majTacheOnboarding(o.id, t.id, "Terminé");
                            toast.success("Tâche validée", { description: `${t.libelle} — ${nomComplet(o.collaborateurId)}.` });
                          }}
                        >
                          Valider
                        </Button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
