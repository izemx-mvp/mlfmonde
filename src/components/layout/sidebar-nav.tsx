import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GROUPES_NAV, LIEN_DASHBOARD } from "./navigation";
import { LogoLfilm } from "./logo-lfilm";

export function SidebarNav({
  reduite,
  onToggle,
  onNaviguer,
}: {
  reduite: boolean;
  onToggle: () => void;
  onNaviguer?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ouverts, setOuverts] = useState<string[]>(GROUPES_NAV.map((g) => g.titre));

  const basculer = (titre: string) =>
    setOuverts((prev) => (prev.includes(titre) ? prev.filter((t) => t !== titre) : [...prev, titre]));

  const lienActif = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        reduite ? "w-[72px]" : "w-72",
      )}
    >
      <div className="h-1 shrink-0 lfilm-stripe" />
      <div className="flex items-center justify-between gap-2 px-3 py-4">
        <Link to="/" onClick={onNaviguer} className="min-w-0">
          <LogoLfilm compact={reduite} />
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="hidden shrink-0 rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:block"
          aria-label={reduite ? "Agrandir le menu" : "Réduire le menu"}
        >
          {reduite ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        <Link
          to={LIEN_DASHBOARD.href}
          onClick={onNaviguer}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            lienActif("/")
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
          title={LIEN_DASHBOARD.libelle}
        >
          <LIEN_DASHBOARD.icone className="size-4 shrink-0" />
          {!reduite && LIEN_DASHBOARD.libelle}
        </Link>

        {GROUPES_NAV.map((groupe) => {
          const ouvert = ouverts.includes(groupe.titre);
          return (
            <div key={groupe.titre} className="pt-2">
              {reduite ? (
                <div className="my-2 h-px bg-sidebar-border" />
              ) : (
                <button
                  type="button"
                  onClick={() => basculer(groupe.titre)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[11px] font-semibold tracking-wider text-sidebar-foreground/60 uppercase transition-colors hover:text-sidebar-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <groupe.icone className="size-3.5" />
                    {groupe.titre}
                  </span>
                  <ChevronDown className={cn("size-3.5 transition-transform", !ouvert && "-rotate-90")} />
                </button>
              )}
              {(ouvert || reduite) && (
                <div className="mt-1 space-y-0.5">
                  {groupe.liens.map((lien) => (
                    <Link
                      key={lien.href}
                      to={lien.href}
                      onClick={onNaviguer}
                      title={lien.libelle}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        lienActif(lien.href)
                          ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <lien.icone className="size-4 shrink-0" />
                      {!reduite && <span className="truncate">{lien.libelle}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!reduite && (
        <div className="m-3 rounded-lg border border-sidebar-border bg-sidebar-accent/60 p-3">
          <p className="text-xs font-semibold text-sidebar-accent-foreground">Réseau mlfmonde / OSUI</p>
          <p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/70">
            349 collaborateurs · De la petite section à la terminale
          </p>
        </div>
      )}
    </aside>
  );
}
