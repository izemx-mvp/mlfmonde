import { cn } from "@/lib/utils";

const TONS: Record<string, string> = {
  neutre: "bg-secondary text-secondary-foreground border-border",
  succes: "bg-leaf/15 text-leaf-foreground border-leaf/40",
  attente: "bg-gold/20 text-gold-foreground border-gold/50",
  info: "bg-sky/20 text-sky-foreground border-sky/45",
  alerte: "bg-orange/18 text-orange-foreground border-orange/45",
  danger: "bg-brick/12 text-brick border-brick/35",
  fort: "bg-navy text-navy-foreground border-navy",
};

const MAP: Record<string, keyof typeof TONS> = {
  // statuts
  Approuvé: "succes",
  Validé: "succes",
  Résolu: "succes",
  Terminé: "succes",
  Signé: "succes",
  Actif: "succes",
  Sélectionné: "succes",
  "En attente": "attente",
  "À planifier": "attente",
  Brouillon: "attente",
  "Non traité": "attente",
  Nouveau: "info",
  Planifié: "info",
  "En cours": "info",
  Généré: "info",
  "En congé": "info",
  Traité: "succes",
  Refusé: "danger",
  "En retard": "danger",
  Urgente: "danger",
  Haute: "alerte",
  Normale: "info",
  Basse: "neutre",
  Fermé: "neutre",
  Inactif: "neutre",
  // canaux
  WhatsApp: "succes",
  Email: "info",
  "Site web": "info",
  "Réseaux sociaux": "alerte",
  Accueil: "neutre",
  "Portail RH": "info",
  "Saisie manuelle": "neutre",
};

export function StatusBadge({
  value,
  ton,
  className,
}: {
  value: string;
  ton?: keyof typeof TONS;
  className?: string;
}) {
  const key = ton ?? MAP[value] ?? "neutre";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONS[key],
        className,
      )}
    >
      {value}
    </span>
  );
}
