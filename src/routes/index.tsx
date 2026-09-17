import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  FileWarning,
  Inbox,
  MessageSquareWarning,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KPICard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { ChartCard } from "@/components/shared/chart-card";
import { AIInsightCard, type AIInsight } from "@/components/shared/ai-insight-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAppStore } from "@/store/app-store";
import {
  absenteismeParMois,
  effectifsParMois,
  effectifsParService,
  formatDate,
  nomComplet,
  repartitionAbsences,
  turnoverParTrimestre,
} from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — LFILM Smart School" },
      {
        name: "description",
        content:
          "Vision globale de l'activité RH du Lycée Louis-Massignon : effectifs, absences, recrutements, demandes et recommandations IA.",
      },
      { property: "og:title", content: "Tableau de bord — LFILM Smart School" },
      { property: "og:description", content: "Pilotage RH et services intelligents du LFILM Bouskoura." },
    ],
  }),
  component: Dashboard,
});

const COULEURS_PIE = ["var(--petrol)", "var(--sky)", "var(--orange)", "var(--leaf)", "var(--brick)"];

function Dashboard() {
  const { collaborateurs, absences, evenements, candidats, demandes, documents } = useAppStore();

  const absencesEnCours = absences.filter((a) => a.statut === "En cours").length;
  const congesAttente = absences.filter((a) => a.statut === "En attente" && a.type === "Congé annuel").length;
  const evenementsAVenir = evenements.filter((e) => e.date >= "2026-09-17" && e.statut !== "Terminé").length;
  const documentsEcheance = documents.filter((d) => d.echeance && d.echeance <= "2026-10-17").length;
  const recrutementsEnCours = candidats.filter((c) => !["Sélectionné", "Onboarding"].includes(c.etape)).length;
  const nouvellesCandidatures = candidats.filter((c) => c.etape === "Nouveau").length;
  const demandesATraiter = demandes.filter((d) => ["Nouveau", "En cours", "En attente"].includes(d.statut)).length;
  const reclamationsOuvertes = demandes.filter((d) => d.reclamation && !["Résolu", "Fermé"].includes(d.statut)).length;

  const insights: AIInsight[] = [
    {
      id: "i1",
      texte:
        "Le taux d'absentéisme du personnel administratif a augmenté de 1,6 point ce mois-ci (5,6 % contre 4,0 % en avril). Trois services sont concernés.",
      ton: "alerte",
      lien: "/rh/insights",
      libelleAction: "Analyser l'absentéisme",
    },
    {
      id: "i2",
      texte: `${documentsEcheance} documents collaborateurs arrivent à échéance dans les 30 prochains jours (titres de séjour, contrats, certifications).`,
      ton: "urgent",
      lien: "/rh/evenements",
      libelleAction: "Voir les échéances",
    },
    {
      id: "i3",
      texte: `${congesAttente} demandes de congés attendent une validation, dont 2 déposées il y a plus de 48 heures via WhatsApp.`,
      ton: "info",
      lien: "/rh/absences",
      libelleAction: "Traiter les demandes",
    },
    {
      id: "i4",
      texte: "7 dossiers collaborateurs présentent des informations manquantes (RIB, pièce d'identité ou personne à contacter).",
      ton: "alerte",
      lien: "/rh/collaborateurs",
      libelleAction: "Compléter les dossiers",
    },
  ];

  const actionsPrioritaires = [
    { id: "a1", libelle: "3 contrats à renouveler", detail: "Échéance sous 15 jours — Enseignement Secondaire", statut: "Urgente", lien: "/rh/evenements" },
    { id: "a2", libelle: `${congesAttente} demandes de congés à valider`, detail: "En attente depuis plus de 48 h", statut: "Haute", lien: "/rh/absences" },
    { id: "a3", libelle: "8 visites médicales à planifier", detail: "Médecine du travail — trimestre en cours", statut: "Normale", lien: "/rh/evenements" },
    { id: "a4", libelle: `${reclamationsOuvertes} réclamations urgentes`, detail: "Transport scolaire et facturation", statut: "Urgente", lien: "/demandes/reclamations" },
    { id: "a5", libelle: `${nouvellesCandidatures} candidatures à analyser`, detail: "Screening IA disponible", statut: "Normale", lien: "/recrutement/screening" },
  ];

  const prochainsEvenements = [...evenements]
    .filter((e) => e.date >= "2026-09-17")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Vue d'ensemble"
        titre="Tableau de bord LFILM Smart School"
        description="Pilotage centralisé des ressources humaines, des demandes et des services du Lycée Français International Louis-Massignon — Bouskoura Ville Verte."
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Rapport exporté", { description: "Synthèse RH de septembre 2026 générée (PDF simulé)." })}>
              Exporter la synthèse
            </Button>
            <Button asChild>
              <Link to="/rh/command-center">Ouvrir le Command Center</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <KPICard label="Collaborateurs" valeur={collaborateurs.length} evolution={1.2} icone={Users} couleur="petrol" lien="/rh/collaborateurs" detail="effectif total" />
        <KPICard label="Absences en cours" valeur={absencesEnCours} evolution={8.4} positif={false} icone={CalendarClock} couleur="orange" lien="/rh/absences" />
        <KPICard label="Congés en attente" valeur={congesAttente} evolution={3.1} positif={false} icone={ClipboardList} couleur="gold" lien="/rh/absences" />
        <KPICard label="Événements RH à venir" valeur={evenementsAVenir} evolution={5.0} icone={CalendarDays} couleur="sky" lien="/rh/evenements" />
        <KPICard label="Documents à échéance" valeur={documentsEcheance} evolution={12.5} positif={false} icone={FileWarning} couleur="brick" lien="/documents" detail="sous 30 jours" />
        <KPICard label="Recrutements en cours" valeur={recrutementsEnCours} evolution={9.0} icone={UserPlus} couleur="leaf" lien="/recrutement/pipeline" />
        <KPICard label="Nouvelles candidatures" valeur={nouvellesCandidatures} evolution={22.0} icone={ClipboardList} couleur="navy" lien="/recrutement/candidatures" />
        <KPICard label="Demandes à traiter" valeur={demandesATraiter} evolution={4.2} positif={false} icone={Inbox} couleur="petrol" lien="/demandes" />
        <KPICard label="Réclamations ouvertes" valeur={reclamationsOuvertes} evolution={2.0} positif={false} icone={MessageSquareWarning} couleur="brick" lien="/demandes/reclamations" />
      </section>

      <section className="rounded-xl border border-sky/40 bg-gradient-to-br from-sky/10 to-background p-5">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-navy">🤖 AI Insights</h2>
          <span className="rounded-full bg-petrol px-2 py-0.5 text-[11px] font-semibold text-petrol-foreground">Analyse du 17/09/2026</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {insights.map((i) => (
            <AIInsightCard key={i.id} insight={i} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartCard titre="Évolution des effectifs" description="12 derniers mois — arrivées et départs inclus" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={effectifsParMois}>
              <defs>
                <linearGradient id="grad-effectif" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--petrol)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--petrol)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis domain={[325, 355]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Area type="monotone" dataKey="effectif" name="Effectif" stroke="var(--petrol)" strokeWidth={2.5} fill="url(#grad-effectif)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Répartition des absences" description="Par type, année scolaire en cours">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={repartitionAbsences} dataKey="valeur" nameKey="type" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {repartitionAbsences.map((_, i) => (
                  <Cell key={i} fill={COULEURS_PIE[i % COULEURS_PIE.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Taux d'absentéisme" description="Comparatif enseignants / personnel administratif (%)" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={absenteismeParMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="enseignants" name="Enseignants" stroke="var(--petrol)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="administratif" name="Administratif" stroke="var(--brick)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Turnover" description="Entrées / sorties par trimestre">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={turnoverParTrimestre}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="periode" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="entrees" name="Entrées" fill="var(--leaf)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sorties" name="Sorties" fill="var(--orange)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Collaborateurs par service" description="Répartition de l'effectif (349 personnes)" className="xl:col-span-3">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={effectifsParService} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis type="category" dataKey="service" width={180} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Bar dataKey="effectif" name="Effectif" fill="var(--sky)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="size-4 text-orange" />
            <h2 className="font-display text-base font-semibold text-navy">Actions prioritaires</h2>
          </div>
          <ul className="space-y-2.5">
            {actionsPrioritaires.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/60 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{a.libelle}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge value={a.statut} />
                  <Button asChild size="sm" variant="outline">
                    <Link to={a.lien}>Traiter</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="size-4 text-petrol" />
            <h2 className="font-display text-base font-semibold text-navy">Prochains événements RH</h2>
          </div>
          <ul className="space-y-2.5">
            {prochainsEvenements.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/60 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{e.intitule}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {nomComplet(e.collaborateurId)} · {formatDate(e.date)}
                  </p>
                </div>
                <StatusBadge value={e.statut} />
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-3 w-full text-petrol">
            <Link to="/rh/evenements">Voir tous les événements</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
