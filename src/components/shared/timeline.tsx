import { formatDate } from "@/data/mock";

export function Timeline({
  items,
}: {
  items: { date: string; titre: string; description?: string }[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun historique disponible.</p>;
  }
  return (
    <ol className="relative space-y-5 border-l border-border pl-5">
      {items.map((item, i) => (
        <li key={`${item.titre}-${i}`} className="relative">
          <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full bg-sky ring-4 ring-card" />
          <p className="text-xs font-medium text-muted-foreground">
            {item.date.includes("-") ? formatDate(item.date) : item.date}
          </p>
          <p className="text-sm font-medium text-foreground">{item.titre}</p>
          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}
