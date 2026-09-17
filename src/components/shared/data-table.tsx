import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  recherche?: (row: T, terme: string) => boolean;
  placeholderRecherche?: string;
  filtres?: ReactNode;
  actionsGlobales?: ReactNode;
  parPage?: number;
  onRowClick?: (row: T) => void;
  emptyTitre?: string | undefined;
  emptyDescription?: string | undefined;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  recherche,
  placeholderRecherche = "Rechercher…",
  filtres,
  actionsGlobales,
  parPage = 10,
  onRowClick,
  emptyTitre,
  emptyDescription,
}: DataTableProps<T>) {
  const [terme, setTerme] = useState("");
  const [page, setPage] = useState(1);
  const [tri, setTri] = useState<{ key: string; sens: "asc" | "desc" } | null>(null);

  const filtrees = useMemo(() => {
    let out = data;
    if (terme.trim() && recherche) {
      const t = terme.trim().toLowerCase();
      out = out.filter((row) => recherche(row, t));
    }
    if (tri) {
      const col = columns.find((c) => c.key === tri.key);
      if (col?.sortValue) {
        out = [...out].sort((a, b) => {
          const va = col.sortValue!(a);
          const vb = col.sortValue!(b);
          const r = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "fr");
          return tri.sens === "asc" ? r : -r;
        });
      }
    }
    return out;
  }, [data, terme, recherche, tri, columns]);

  const totalPages = Math.max(1, Math.ceil(filtrees.length / parPage));
  const pageCourante = Math.min(page, totalPages);
  const visibles = filtrees.slice((pageCourante - 1) * parPage, pageCourante * parPage);

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      {(recherche || filtres || actionsGlobales) && (
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {recherche && (
              <div className="relative w-full min-w-56 sm:w-72">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={terme}
                  onChange={(e) => {
                    setTerme(e.target.value);
                    setPage(1);
                  }}
                  placeholder={placeholderRecherche}
                  className="pl-9"
                  aria-label="Rechercher"
                />
              </div>
            )}
            {filtres}
          </div>
          {actionsGlobales && <div className="flex flex-wrap items-center gap-2">{actionsGlobales}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                    col.headerClassName,
                  )}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() =>
                        setTri((prev) =>
                          prev?.key === col.key
                            ? { key: col.key, sens: prev.sens === "asc" ? "desc" : "asc" }
                            : { key: col.key, sens: "asc" },
                        )
                      }
                      className="inline-flex items-center gap-1 transition-colors hover:text-petrol"
                    >
                      {col.header}
                      <ArrowUpDown className={cn("size-3", tri?.key === col.key && "text-petrol")} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-border/70 last:border-0 transition-colors hover:bg-surface",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 align-middle text-foreground", col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {visibles.length === 0 && <EmptyState titre={emptyTitre} description={emptyDescription} />}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm sm:flex-row">
        <p className="text-muted-foreground">
          {filtrees.length} résultat{filtrees.length > 1 ? "s" : ""} — page {pageCourante} / {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageCourante === 1}
          >
            <ChevronLeft className="size-4" />
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageCourante === totalPages}
          >
            Suivant
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
