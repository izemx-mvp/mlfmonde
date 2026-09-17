import { createFileRoute } from "@tanstack/react-router";
import { AlertOctagon, CheckCircle2, Clock, MessageSquareWarning } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { ChartCard } from "@/components/shared/chart-card";
import { TableDemandes } from "@/components/demandes/table-demandes";
import { useAppStore } from "@/store/app-store";
import { reclamationsParCategorie } from "@/data/mock";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/demandes/reclamations")({
  head: () => ({
    meta: [
      { title: "Réclamations — LFILM Smart School" },
      { name: "description", content: "Suivi des réclamations des familles et collaborateurs du LFILM : priorisation, assignation et résolution." },
      { property: "og:title", content: "Réclamations — LFILM Smart School" },
      { property: "og:description", content: "Traitement prioritaire des réclamations adressées au lycée." },
    ],
  }),
  component: PageReclamations,
});

const CATEGORIES = ["Réclamation", "Transport", "Cantine", "Vie scolaire", "Finance", "RH", "Documents"];

function PageReclamations() {
  const { demandes } = useAppStore();
  const reclamations = demandes.filter((d) => d.reclamation);
  const ouvertes = reclamations.filter((d) => d.statut !== "Résolu" && d.statut !== "Fermé").length;
  const urgentes = reclamations.filter((d) => d.priorite === "Urgente" || d.priorite === "Haute").length;
  const resolues = reclamations.filter((d) => d.statut === "Résolu" || d.statut === "Fermé").length;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Demandes & Réclamations"
        titre="Réclamations"
        description="Les réclamations sont détectées automatiquement par l'IA à partir du ton et du contenu des messages reçus, puis priorisées et orientées vers le service compétent."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Réclamations totales" valeur={reclamations.length} icone={MessageSquareWarning} couleur="brick" />
        <KPICard label="Réclamations ouvertes" valeur={ouvertes} icone={Clock} couleur="orange" positif={false} evolution={5} />
        <KPICard label="Prioritaires" valeur={urgentes} icone={AlertOctagon} couleur="gold" positif={false} evolution={2} />
        <KPICard label="Résolues" valeur={resolues} icone={CheckCircle2} couleur="leaf" evolution={15} />
      </section>

      <ChartCard titre="Réclamations par catégorie" description="Répartition des réclamations reçues depuis la rentrée">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={reclamationsParCategorie}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="categorie" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)" }} />
            <Bar dataKey="total" fill="var(--color-brick)" radius={[6, 6, 0, 0]} name="Réclamations" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <TableDemandes
        demandes={reclamations}
        categories={CATEGORIES}
        titreVide="Aucune réclamation ne correspond à ces critères"
      />
    </div>
  );
}
