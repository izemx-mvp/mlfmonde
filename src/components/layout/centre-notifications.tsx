import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const TONS = {
  info: "bg-sky",
  alerte: "bg-orange",
  succes: "bg-leaf",
} as const;

export function CentreNotifications() {
  const { notifications, marquerNotificationLue, toutMarquerLu } = useAppStore();
  const navigate = useNavigate();
  const nonLues = notifications.filter((n) => !n.lue).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-5 text-petrol" />
          {nonLues > 0 && (
            <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-brick text-[10px] font-bold text-brick-foreground">
              {nonLues}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="font-display text-sm font-semibold text-navy">Notifications</p>
            <p className="text-xs text-muted-foreground">{nonLues} non lue{nonLues > 1 ? "s" : ""}</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={toutMarquerLu}>
            <CheckCheck className="size-3.5" />
            Tout marquer lu
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                marquerNotificationLue(n.id);
                navigate({ to: n.lien });
              }}
              className={cn(
                "flex w-full gap-3 border-b border-border/70 px-4 py-3 text-left transition-colors last:border-0 hover:bg-surface",
                !n.lue && "bg-sky/5",
              )}
            >
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", TONS[n.ton])} />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{n.titre}</span>
                <span className="block text-xs text-muted-foreground">{n.description}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">{n.date}</span>
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
