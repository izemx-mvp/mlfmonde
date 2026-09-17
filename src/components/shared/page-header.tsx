import type { ReactNode } from "react";

export function PageHeader({
  titre,
  description,
  badge,
  actions,
}: {
  titre: string;
  description?: string;
  badge?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {badge && (
          <span className="mb-2 inline-flex items-center rounded-full bg-sky/20 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-petrol uppercase">
            {badge}
          </span>
        )}
        <h1 className="font-display text-2xl font-bold text-navy lg:text-3xl">{titre}</h1>
        {description && <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
