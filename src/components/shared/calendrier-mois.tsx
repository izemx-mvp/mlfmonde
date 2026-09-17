import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EvenementCalendrier {
  id: string;
  date: string; // ISO yyyy-mm-dd
  libelle: string;
  ton?: "petrol" | "brick" | "orange" | "leaf" | "sky";
}

const TONS: Record<string, string> = {
  petrol: "bg-petrol/12 text-petrol",
  brick: "bg-brick/12 text-brick",
  orange: "bg-orange/18 text-orange",
  leaf: "bg-leaf/18 text-leaf",
  sky: "bg-sky/25 text-petrol",
};

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function CalendrierMois({
  evenements,
  moisInitial = new Date("2026-09-17"),
  onSelectionner,
}: {
  evenements: EvenementCalendrier[];
  moisInitial?: Date;
  onSelectionner?: (ev: EvenementCalendrier) => void;
}) {
  const [curseur, setCurseur] = useState(new Date(moisInitial.getFullYear(), moisInitial.getMonth(), 1));

  const annee = curseur.getFullYear();
  const mois = curseur.getMonth();
  const premier = new Date(annee, mois, 1);
  const decalage = (premier.getDay() + 6) % 7;
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const cases: (number | null)[] = [
    ...Array.from({ length: decalage }, () => null),
    ...Array.from({ length: nbJours }, (_, i) => i + 1),
  ];

  const clefJour = (j: number) => `${annee}-${String(mois + 1).padStart(2, "0")}-${String(j).padStart(2, "0")}`;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-navy capitalize">
          {curseur.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => setCurseur(new Date(annee, mois - 1, 1))} aria-label="Mois précédent">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurseur(new Date(annee, mois + 1, 1))} aria-label="Mois suivant">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
        {JOURS.map((j) => (
          <div key={j} className="py-1">
            {j}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cases.map((jour, i) => {
          if (jour === null) return <div key={`vide-${i}`} className="min-h-24 rounded-md bg-surface/40" />;
          const clef = clefJour(jour);
          const evts = evenements.filter((e) => e.date.slice(0, 10) === clef);
          const aujourdhui = clef === "2026-09-17";
          return (
            <div
              key={clef}
              className={cn(
                "min-h-24 rounded-md border border-border/60 p-1.5 text-left",
                aujourdhui ? "border-petrol bg-sky/10" : "bg-background",
              )}
            >
              <span className={cn("text-xs font-semibold", aujourdhui ? "text-petrol" : "text-muted-foreground")}>{jour}</span>
              <div className="mt-1 space-y-1">
                {evts.slice(0, 3).map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => onSelectionner?.(e)}
                    className={cn(
                      "block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium",
                      TONS[e.ton ?? "petrol"],
                    )}
                    title={e.libelle}
                  >
                    {e.libelle}
                  </button>
                ))}
                {evts.length > 3 && <p className="px-1 text-[10px] text-muted-foreground">+{evts.length - 3} autres</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
