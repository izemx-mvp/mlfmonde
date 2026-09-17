import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KPICardProps {
  label: string;
  valeur: string | number;
  evolution?: number;
  positif?: boolean;
  icone: LucideIcon;
  couleur?: "petrol" | "brick" | "orange" | "gold" | "leaf" | "sky" | "navy";
  lien?: string;
  detail?: string;
}

const COULEURS: Record<string, string> = {
  petrol: "bg-petrol/12 text-petrol",
  brick: "bg-brick/12 text-brick",
  orange: "bg-orange/18 text-orange",
  gold: "bg-gold/25 text-gold-foreground",
  leaf: "bg-leaf/18 text-leaf",
  sky: "bg-sky/22 text-petrol",
  navy: "bg-navy/12 text-navy",
};

export function KPICard({
  label,
  valeur,
  evolution,
  positif = true,
  icone: Icone,
  couleur = "petrol",
  lien,
  detail,
}: KPICardProps) {
  const contenu = (
    <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)]">
      <span className={cn("absolute inset-x-0 top-0 h-1", `bg-${couleur}`)} aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy">{valeur}</p>
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", COULEURS[couleur])}>
          <Icone className="size-5" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {evolution !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              positif ? "bg-leaf/15 text-leaf" : "bg-brick/12 text-brick",
            )}
          >
            {positif ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(evolution)}%
          </span>
        )}
        <span className="truncate text-muted-foreground">{detail ?? "vs mois précédent"}</span>
      </div>
    </div>
  );

  if (lien) {
    return (
      <Link to={lien} className="block h-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        {contenu}
      </Link>
    );
  }
  return contenu;
}
