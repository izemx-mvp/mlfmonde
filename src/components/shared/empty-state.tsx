import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  titre = "Aucun résultat",
  description = "Aucun élément ne correspond à vos critères de recherche ou de filtre.",
  action,
}: {
  titre?: string | undefined;
  description?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <SearchX className="size-6" />
      </span>
      <div>
        <p className="font-display text-base font-semibold text-navy">{titre}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
