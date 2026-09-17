import { cn } from "@/lib/utils";

export function LogoLfilm({ compact = false, sombre = true }: { compact?: boolean; sombre?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 shrink-0 grid-cols-3 gap-[2px] rounded-md bg-background/10 p-[3px]">
        <span className="rounded-[2px] bg-navy" />
        <span className="rounded-[2px] bg-brick" />
        <span className="rounded-[2px] bg-orange" />
        <span className="rounded-[2px] bg-gold" />
        <span className="rounded-[2px] bg-leaf" />
        <span className="rounded-[2px] bg-sky" />
        <span className="rounded-[2px] bg-petrol" />
        <span className="rounded-[2px] bg-gold" />
        <span className="rounded-[2px] bg-brick" />
      </div>
      {!compact && (
        <div className="min-w-0 leading-tight">
          <p className={cn("font-display text-sm font-bold tracking-tight", sombre ? "text-sidebar-accent-foreground" : "text-navy")}>
            LFILM Smart School
          </p>
          <p className={cn("truncate text-[11px]", sombre ? "text-sidebar-foreground/70" : "text-muted-foreground")}>
            Louis-Massignon · Bouskoura
          </p>
        </div>
      )}
    </div>
  );
}
