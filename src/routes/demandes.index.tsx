import { createFileRoute } from "@tanstack/react-router";
import { AlertOctagon, Inbox, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { TableDemandes } from "@/components/demandes/table-demandes";
import { useAppStore } from "@/store/app-store";

const CATEGORIES = [
  "Admission",
  "Inscription",
  "RH",
  "Finance",
  "Vie scolaire",
  "Transport",
  "Cantine",
  "Documents",
  "Réclamation",
  "Information générale",
];

export const Route = createFileRoute("/demandes/")({
  head: () => ({
    meta: [
      { title: "Toutes les demandes — LFILM Smart School" },
      { name: "description", content: "Centralisation des demandes du LFILM reçues par email, WhatsApp, site web et accueil, avec classification IA et suivi de traitement." },
      { property: "og:title", content: "Demandes — LFILM Smart School" },
      { property: "og:description", content: "Suivi centralisé des demandes multicanales du lycée." },
    ],
  }),
  component: PageDemandes,
});

function PageDemandes() {
  const { demandes } = useAppStore();
  const nouvelles = demandes.filter((d) => d.statut === "Nouveau").length;
  const enCours = demandes.filter((d) => d.statut === "En cours" || d.statut === "En attente").length;
  const resolues = demandes.filter((d) => d.statut === "Résolu" || d.statut === "Fermé").length;
  const urgentes = demandes.filter((d) => d.priorite === "Urgente").length;

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Demandes & Réclamations"
        titre="Toutes les demandes"
        description="Toutes les sollicitations reçues par le lycée, quel que soit le canal, sont regroupées ici : catégorisation IA, priorisation, assignation et suivi jusqu'à la résolution."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Demandes reçues" valeur={demandes.length} icone={Inbox} couleur="petrol" />
        <KPICard label="Nouvelles à traiter" valeur={nouvelles} icone={Clock} couleur="orange" evolution={9} positif={false} />
        <KPICard label="En cours de traitement" valeur={enCours} icone={Clock} couleur="sky" />
        <KPICard label="Demandes urgentes" valeur={urgentes} icone={AlertOctagon} couleur="brick" positif={false} evolution={3} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <KPICard label="Demandes résolues" valeur={resolues} icone={CheckCircle2} couleur="leaf" evolution={12} detail="Sur l'année scolaire en cours" />
        <KPICard
          label="Délai moyen de traitement"
          valeur="1,8 j"
          icone={Clock}
          couleur="navy"
          evolution={22}
          detail="Réduit grâce à la classification automatique"
        />
      </section>

      <TableDemandes demandes={demandes} categories={CATEGORIES} />
    </div>
  );
}
