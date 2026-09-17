import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlarmClock,
  Award,
  BriefcaseBusiness,
  CalendarClock,
  FileWarning,
  GraduationCap,
  LogOut,
  Stethoscope,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { formatDate, nomComplet } from "@/data/mock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/rh/command-center")({
  head: () => ({
    meta: [
      { title: "AI HR Command Center — LFILM Smart School" },
      { name: "description", content: "Supervision RH temps réel du LFILM : effectifs, absences, alertes et actions prioritaires." },
      { property: "og:title", content: "AI HR Command Center — LFILM" },
      { property: "og:description", content: "Supervision RH centralisée et alertes intelligentes." },
    ],
  }),
  component: CommandCenter,
});

const FILTRES = ["Aujourd'hui", "Cette semaine", "Ce mois", "Urgent", "En retard"] as const;

interface ActionPrioritaire {
  id: string;
  niveau: "Urgent" | "À traiter" | "Rappel";
  texte: string;
  lien: string;
  periodes: string[];
}

function CommandCenter() {
  const [filtre, setFiltre] = useState<(typeof FILTRES)[number]>("Cette semaine");
  const { collaborateurs, absences, evenements, demandes } = useAppStore();

  const nouveaux = collaborateurs.filter((c) => c.dateArrivee >= "2026-06-01").length;
  const departs = 5;
  const absencesEnCours = absences.filter(
    (a) => a.dateDebut <= "2026-09-17" && a.dateFin >= "2026-09-17" && a.statut !== "Refusé",
  ).length;
  const congesAttente = absences.filter((a) => a.statut === "En attente").length;
  const evenementsPlanifies = evenements.filter((e) => e.statut === "Planifié").length;
  const documentsExpirants = evenements.filter((e) => e.type === "Renouvellement de document").length;
  const formations = evenements.filter((e) => e.type === "Formation").length;
  const entretiensRH = evenements.filter((e) => e.type === "Entretien annuel").length;
  const alertes = evenements.filter((e) => e.statut === "En retard").length + demandes.filter((d) => d.priorite === "Urgente").length;

  const actions: ActionPrioritaire[] = [
    {
      id: "u1",
      niveau: "Urgent",
      texte: "3 contrats arrivent à échéance dans moins de 15 jours (Enseignement Secondaire, Restauration).",
      lien: "/rh/evenements",
      periodes: ["Aujourd'hui", "Cette semaine", "Ce mois", "Urgent"],
    },
    {
      id: "u2",
      niveau: "Urgent",
      texte: "2 réclamations parents dépassent le délai de réponse de 72 heures.",
      lien: "/demandes/reclamations",
      periodes: ["Aujourd'hui", "Cette semaine", "Urgent", "En retard"],
    },
    {
      id: "t1",
      niveau: "À traiter",
      texte: `${congesAttente} demandes de congés sont en attente de validation.`,
      lien: "/rh/absences",
      periodes: ["Aujourd'hui", "Cette semaine", "Ce mois"],
    },
    {
      id: "t2",
      niveau: "À traiter",
      texte: "6 candidatures au stade « Screening IA » attendent une décision de préqualification.",
      lien: "/recrutement/screening",
      periodes: ["Cette semaine", "Ce mois"],
    },
    {
      id: "r1",
      niveau: "Rappel",
      texte: "8 visites médicales doivent être planifiées avant la fin du trimestre.",
      lien: "/rh/evenements",
      periodes: ["Ce mois"],
    },
    {
      id: "r2",
      niveau: "Rappel",
      texte: "4 entretiens annuels d'évaluation n'ont pas été réalisés dans les délais.",
      lien: "/rh/evenements",
      periodes: ["Ce mois", "En retard"],
    },
  ];

  const actionsFiltrees = actions.filter((a) => a.periodes.includes(filtre));

  const alertesEvenements = [...evenements]
    .filter((e) => e.statut === "En retard" || e.statut === "À planifier")
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Supervision RH"
        titre="AI HR Command Center"
        description="Centre de supervision des ressources humaines du lycée : l'IA consolide en continu les effectifs, les absences, les échéances et les alertes de conformité."
        actions={
          <Button
            onClick={() =>
              toast.success("Analyse IA relancée", {
                description: "349 dossiers analysés · 11 alertes détectées · 3 recommandations générées.",
              })
            }
          >
            Relancer l'analyse IA
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KPICard label="Effectif total" valeur={collaborateurs.length} icone={Users} couleur="petrol" lien="/rh/collaborateurs" detail="tous sites confondus" />
        <KPICard label="Nouveaux collaborateurs" valeur={nouveaux} evolution={18} icone={UserPlus} couleur="leaf" lien="/onboarding" detail="depuis juin 2026" />
        <KPICard label="Départs" valeur={departs} evolution={6} positif={false} icone={UserMinus} couleur="brick" detail="trimestre en cours" />
        <KPICard label="Absences" valeur={absencesEnCours} icone={CalendarClock} couleur="orange" lien="/rh/absences" detail="en cours aujourd'hui" />
        <KPICard label="Congés en attente" valeur={congesAttente} icone={LogOut} couleur="gold" lien="/rh/absences" detail="à valider" />
        <KPICard label="Événements planifiés" valeur={evenementsPlanifies} icone={BriefcaseBusiness} couleur="sky" lien="/rh/evenements" />
        <KPICard label="Documents expirants" valeur={documentsExpirants} icone={FileWarning} couleur="brick" lien="/rh/evenements" detail="titres & contrats" />
        <KPICard label="Formations" valeur={formations} icone={GraduationCap} couleur="navy" lien="/rh/evenements" />
        <KPICard label="Entretiens annuels" valeur={entretiensRH} icone={Award} couleur="petrol" lien="/rh/evenements" />
        <KPICard label="Alertes actives" valeur={alertes} evolution={9} positif={false} icone={AlarmClock} couleur="brick" detail="conformité & SLA" />
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-navy">Actions prioritaires</h2>
          <div className="flex flex-wrap gap-1.5">
            {FILTRES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFiltre(f)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filtre === f
                    ? "border-petrol bg-petrol text-petrol-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-petrol/40 hover:text-petrol",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {actionsFiltrees.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-surface/50 p-6 text-center text-sm text-muted-foreground">
            Aucune action prioritaire pour le filtre « {filtre} ». Excellente nouvelle.
          </p>
        ) : (
          <div className="space-y-3">
            {(["Urgent", "À traiter", "Rappel"] as const).map((niveau) => {
              const items = actionsFiltrees.filter((a) => a.niveau === niveau);
              if (items.length === 0) return null;
              return (
                <div key={niveau}>
                  <p
                    className={cn(
                      "mb-2 text-xs font-bold tracking-wider uppercase",
                      niveau === "Urgent" ? "text-brick" : niveau === "À traiter" ? "text-orange" : "text-petrol",
                    )}
                  >
                    {niveau}
                  </p>
                  <ul className="space-y-2">
                    {items.map((a) => (
                      <li
                        key={a.id}
                        className={cn(
                          "flex flex-wrap items-center justify-between gap-3 rounded-lg border-l-4 bg-surface/60 p-3",
                          niveau === "Urgent" ? "border-l-brick" : niveau === "À traiter" ? "border-l-orange" : "border-l-sky",
                        )}
                      >
                        <p className="min-w-0 flex-1 text-sm text-foreground">{a.texte}</p>
                        <Button asChild size="sm" variant="outline">
                          <Link to={a.lien}>Traiter</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center gap-2">
          <Stethoscope className="size-4 text-petrol" />
          <h2 className="font-display text-base font-semibold text-navy">Alertes de conformité détectées par l'IA</h2>
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {alertesEvenements.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/60 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{e.intitule}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {nomComplet(e.collaborateurId)} · échéance {formatDate(e.date)}
                </p>
              </div>
              <StatusBadge value={e.statut} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
