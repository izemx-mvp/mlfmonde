import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ChartCard } from "@/components/shared/chart-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  absenteismeParMois,
  effectifsParMois,
  effectifsParService,
  recrutementsParPoste,
  reclamationsParCategorie,
  repartitionAbsences,
  turnoverParTrimestre,
} from "@/data/mock";

export const Route = createFileRoute("/rh/insights")({
  head: () => ({
    meta: [
      { title: "AI HR Insights — LFILM Smart School" },
      { name: "description", content: "Analyse RH assistée par IA : absentéisme, turnover, effectifs, recrutements et réclamations du LFILM." },
      { property: "og:title", content: "AI HR Insights — LFILM Smart School" },
      { property: "og:description", content: "Tendances RH et réponses IA basées sur les données du lycée." },
    ],
  }),
  component: PageInsights,
});

const COULEURS = ["var(--petrol)", "var(--sky)", "var(--orange)", "var(--leaf)", "var(--brick)", "var(--gold)"];

const REPONSES: { motsCles: string[]; reponse: string }[] = [
  {
    motsCles: ["absentéisme", "absenteisme", "absence"],
    reponse:
      "Le service Administration & Finances présente le taux d'absentéisme le plus élevé du lycée (5,6 % en septembre 2026, contre 3,8 % en moyenne établissement). La hausse est principalement portée par les arrêts maladie de courte durée (1 à 3 jours). Recommandation : planifier un point managérial et anticiper les remplacements sur les fonctions d'accueil.",
  },
  {
    motsCles: ["recrut", "embauche", "candidat"],
    reponse:
      "Depuis janvier 2026, 43 collaborateurs ont été recrutés, dont 27 sur des fonctions d'enseignement. Le délai moyen de recrutement est de 38 jours, en baisse de 6 jours grâce au screening automatisé des CV. 14 postes restent ouverts à ce jour.",
  },
  {
    motsCles: ["turnover", "départ", "depart"],
    reponse:
      "Le turnover annualisé s'établit à 3,1 % au T3 2026, en hausse de 0,5 point sur un an. Les départs concernent majoritairement les contrats de type vacataire dans les services Restauration et Maintenance. Le turnover des enseignants titulaires reste faible (1,2 %).",
  },
  {
    motsCles: ["tendance", "rh", "principales"],
    reponse:
      "Trois tendances se dégagent : 1) une croissance régulière de l'effectif (+13 collaborateurs sur 12 mois, soit 349 aujourd'hui) ; 2) une concentration de l'absentéisme sur le personnel administratif en période de rentrée ; 3) une automatisation croissante des demandes (38 % des demandes de congés proviennent désormais d'un canal email ou WhatsApp traité par l'IA).",
  },
  {
    motsCles: ["congé", "conge"],
    reponse:
      "Sur l'année scolaire en cours, les congés annuels représentent 38 % des absences enregistrées. Le solde moyen restant par collaborateur est de 14 jours. 12 demandes sont actuellement en attente de validation, dont 5 depuis plus de 48 heures.",
  },
  {
    motsCles: ["réclamation", "reclamation"],
    reponse:
      "Les réclamations se concentrent sur le transport scolaire (9 dossiers) et la restauration (7 dossiers). Le délai moyen de résolution est de 2,4 jours, et 82 % des réclamations sont classées automatiquement par l'IA dès leur réception.",
  },
];

const SUGGESTIONS = [
  "Quel service a le plus fort taux d'absentéisme ?",
  "Combien de collaborateurs ont été recrutés cette année ?",
  "Quelles sont les principales tendances RH ?",
  "Quel est le turnover du lycée ?",
];

function PageInsights() {
  const [question, setQuestion] = useState("");
  const [historique, setHistorique] = useState<{ q: string; r: string }[]>([]);
  const [chargement, setChargement] = useState(false);

  const poser = (q: string) => {
    const texte = q.trim();
    if (!texte) return;
    setChargement(true);
    setQuestion("");
    const trouvee = REPONSES.find((r) => r.motsCles.some((m) => texte.toLowerCase().includes(m)));
    setTimeout(() => {
      setHistorique((prev) => [
        {
          q: texte,
          r:
            trouvee?.reponse ??
            "D'après les données consolidées du lycée (349 collaborateurs, 12 services), aucune anomalie majeure n'est détectée sur cet indicateur. Reformulez votre question en ciblant l'absentéisme, le turnover, les recrutements, les congés ou les réclamations pour une analyse détaillée.",
        },
        ...prev,
      ]);
      setChargement(false);
    }, 700);
  };

  const radarServices = effectifsParService.slice(0, 6).map((s) => ({
    service: s.service.split(" ")[0],
    effectif: s.effectif,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Analyse & pilotage"
        titre="AI HR Insights"
        description="Analyse des données RH du lycée assistée par intelligence artificielle : tendances, anomalies et réponses en langage naturel."
      />

      <section className="rounded-xl border border-petrol/30 bg-gradient-to-br from-sky/12 to-background p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="size-4 text-petrol" />
          <h2 className="font-display text-lg font-semibold text-navy">Ask AI</h2>
        </div>
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            poser(question);
          }}
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Posez une question sur les données RH du lycée…"
            className="bg-background"
            aria-label="Question à l'IA"
          />
          <Button type="submit" disabled={!question.trim() || chargement}>
            {chargement ? "Analyse…" : "Interroger l'IA"}
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => poser(s)}
              className="rounded-full border border-sky/50 bg-background px-3 py-1 text-xs font-medium text-petrol transition-colors hover:bg-sky/15"
            >
              {s}
            </button>
          ))}
        </div>

        {chargement && (
          <p className="mt-4 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
            L'IA analyse 349 dossiers collaborateurs et 78 absences…
          </p>
        )}

        <div className="mt-4 space-y-3">
          {historique.map((h, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-semibold text-navy">{h.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{h.r}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard titre="Absentéisme" description="Taux global mensuel (%)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={absenteismeParMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="taux" name="Taux global" stroke="var(--orange)" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Turnover" description="Taux trimestriel et flux de personnel">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={turnoverParTrimestre}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="periode" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="entrees" name="Entrées" fill="var(--leaf)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sorties" name="Sorties" fill="var(--brick)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Effectifs & recrutements" description="Évolution mensuelle">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={effectifsParMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="recrutements" name="Recrutements" fill="var(--petrol)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="departs" name="Départs" fill="var(--gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Congés par type" description="Répartition des absences">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={repartitionAbsences} dataKey="valeur" nameKey="type" outerRadius={95}>
                {repartitionAbsences.map((_, i) => (
                  <Cell key={i} fill={COULEURS[i % COULEURS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Réclamations par catégorie" description="Dossiers ouverts sur le trimestre">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={reclamationsParCategorie} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis type="category" dataKey="categorie" width={100} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Bar dataKey="valeur" name="Réclamations" fill="var(--brick)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Postes ouverts / pourvus" description="Campagne de recrutement en cours">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={recrutementsParPoste}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="poste" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="ouverts" name="Ouverts" fill="var(--sky)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pourvus" name="Pourvus" fill="var(--leaf)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titre="Poids des services" description="Six principaux services par effectif" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarServices}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="service" tick={{ fontSize: 12 }} />
              <Radar dataKey="effectif" name="Effectif" stroke="var(--petrol)" fill="var(--petrol)" fillOpacity={0.35} />
              <RTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
}
