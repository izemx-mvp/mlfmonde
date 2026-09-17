import { cn } from "@/lib/utils";

const TEINTES = [
  "bg-petrol/15 text-petrol",
  "bg-brick/12 text-brick",
  "bg-orange/18 text-orange",
  "bg-leaf/18 text-leaf",
  "bg-sky/25 text-petrol",
  "bg-navy/12 text-navy",
];

export function AvatarPersonne({
  nom,
  sousTitre,
  taille = "md",
  className,
}: {
  nom: string;
  sousTitre?: string | undefined;
  taille?: "sm" | "md" | "lg";
  className?: string;
}) {
  const parts = nom.trim().split(" ");
  const init = `${parts[0]?.charAt(0) ?? ""}${parts[1]?.charAt(0) ?? ""}`.toUpperCase();
  const teinte = TEINTES[nom.length % TEINTES.length];
  const dims = taille === "sm" ? "size-7 text-[10px]" : taille === "lg" ? "size-12 text-base" : "size-9 text-xs";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className={cn("grid shrink-0 place-items-center rounded-full font-semibold", dims, teinte)}>{init}</span>
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{nom}</p>
        {sousTitre && <p className="truncate text-xs text-muted-foreground">{sousTitre}</p>}
      </div>
    </div>
  );
}
