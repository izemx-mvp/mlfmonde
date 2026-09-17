import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ScanSearch, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/data/mock";
import type { Candidat } from "@/data/types";
import { toast } from "sonner";

export const Route = createFileRoute("/recrutement/screening")({
  head: () => ({
    meta: [
      { title: "AI Candidate Screening — LFILM Smart School" },
      { name: "description", content: "Analyse automatisée des CV candidats du LFILM : score de matching, points forts, points faibles et recommandation." },
      { property: "og:title", content: "AI Candidate Screening — LFILM" },
      { property: "og:description", content: "Analyse IA des CV et scoring de correspondance aux postes du lycée." },
    ],
  }),
  component: PageScreening,
});

function PageScreening() {
  const { candidats, majCandidat } = useAppStore();
  const [analyse, setAnalyse] = useState<Candidat | null>(null);
  const [enCours, setEnCours] = useState(false);

  const lancerAnalyse = (c: Candidat) => {
    setEnCours(true);
    setAnalyse(c);
    setTimeout(() => setEnCours(false), 900);
  };

  const tries = [...candidats].sort((a, b) => b.scoreIA - a.scoreIA).slice(0, 12);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Recrutement"
        titre="AI Candidate Screening"
        description="L'IA compare chaque CV à la fiche de poste du lycée : compétences pédagogiques, expérience du réseau AEFE/MLF, maîtrise linguistique et disponibilité."
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {tries.map((c) => (
          <article key={c.id} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-display text-base font-semibold text-navy">
                  {c.prenom} {c.nom}
                </h2>
                <p className="truncate text-xs text-muted-foreground">{c.poste}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.experience} ans d'expérience · candidature du {formatDate(c.dateCandidature)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-petrol">{c.scoreIA}%</p>
                <p className="text-[11px] text-muted-foreground">correspondance</p>
              </div>
            </div>

            <Progress value={c.scoreIA} className="mt-3 h-2" />

            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.competences.map((k) => (
                <span key={k} className="rounded-full bg-sky/18 px-2 py-0.5 text-[11px] text-petrol">
                  {k}
                </span>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-leaf">
                  <CheckCircle2 className="size-3.5" /> Points forts
                </p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  {c.pointsForts.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-brick">
                  <XCircle className="size-3.5" /> Points de vigilance
                </p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  {c.pointsFaibles.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4 rounded-lg border border-sky/40 bg-sky/10 p-3 text-xs text-foreground">{c.recommandationIA}</p>

            <div className="mt-4 flex items-center justify-between gap-2">
              <StatusBadge value={c.etape} />
              <Button size="sm" onClick={() => lancerAnalyse(c)}>
                <ScanSearch className="size-4" />
                Analyser le CV
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!analyse} onOpenChange={(o) => !o && setAnalyse(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Analyse IA du CV</DialogTitle>
            <DialogDescription>
              {analyse?.prenom} {analyse?.nom} — {analyse?.poste}
            </DialogDescription>
          </DialogHeader>

          {enCours ? (
            <div className="space-y-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">Extraction du CV, comparaison à la fiche de poste et calcul du score…</p>
              <Progress value={66} className="h-2" />
            </div>
          ) : (
            analyse && (
              <div className="space-y-4 text-sm">
                <div className="rounded-xl border border-petrol/30 bg-sky/10 p-4 text-center">
                  <p className="font-display text-4xl font-bold text-petrol">{analyse.scoreIA} %</p>
                  <p className="text-xs text-muted-foreground">de correspondance avec le poste</p>
                </div>

                <Section titre="Critères évalués">
                  <ul className="space-y-2">
                    {[
                      { critere: "Adéquation au poste", note: Math.min(100, analyse.scoreIA + 3) },
                      { critere: "Expérience secteur éducatif", note: Math.max(40, analyse.scoreIA - 8) },
                      { critere: "Compétences techniques & pédagogiques", note: Math.min(100, analyse.scoreIA + 1) },
                      { critere: "Maîtrise linguistique (FR / EN / AR)", note: Math.max(45, analyse.scoreIA - 12) },
                      { critere: "Disponibilité et mobilité", note: Math.max(50, analyse.scoreIA - 5) },
                    ].map((c) => (
                      <li key={c.critere} className="flex items-center gap-3">
                        <span className="w-64 shrink-0 text-xs text-muted-foreground">{c.critere}</span>
                        <Progress value={c.note} className="h-2 flex-1" />
                        <span className="w-10 text-right text-xs font-semibold">{c.note}%</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section titre="Points forts identifiés">
                  <ul className="space-y-1 text-muted-foreground">
                    {analyse.pointsForts.map((p) => (
                      <li key={p}>✓ {p}</li>
                    ))}
                  </ul>
                </Section>

                <Section titre="Points de vigilance">
                  <ul className="space-y-1 text-muted-foreground">
                    {analyse.pointsFaibles.map((p) => (
                      <li key={p}>! {p}</li>
                    ))}
                  </ul>
                </Section>

                <Section titre="Synthèse & recommandation">
                  <p>{analyse.recommandationIA}</p>
                  <p className="mt-2 text-muted-foreground">
                    Prochaine action suggérée : <strong className="text-foreground">{analyse.prochaineAction}</strong>.
                  </p>
                </Section>
              </div>
            )
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalyse(null)}>
              Fermer
            </Button>
            {analyse && !enCours && (
              <Button
                onClick={() => {
                  majCandidat(analyse.id, { etape: "Entretien" });
                  toast.success("Candidat retenu", { description: `${analyse.prenom} ${analyse.nom} passe à l'étape « Entretien ».` });
                  setAnalyse(null);
                }}
              >
                Convoquer en entretien
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface/50 p-4">
      <p className="mb-2 text-xs font-semibold tracking-wide text-navy uppercase">{titre}</p>
      {children}
    </div>
  );
}
