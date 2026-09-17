import { cn } from "@/lib/utils";
import logoLfilm from "@/assets/lfilm-logo.png";

export function LogoLfilm({ compact = false, sombre = true }: { compact?: boolean; sombre?: boolean }) {
  return (
    <div className={cn("flex min-w-0 items-center", compact ? "justify-center" : "w-full")}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background",
          compact ? "size-11 p-1.5" : "h-14 w-full max-w-[210px] px-2 py-1.5",
          sombre ? "border-sidebar-border" : "border-border",
        )}
      >
        <img
          src={logoLfilm}
          alt="Lycée Français International Louis-Massignon"
          className="block h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
