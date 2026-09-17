import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AIInsight {
  id: string;
  texte: string;
  ton: "info" | "alerte" | "succes" | "urgent";
  lien: string;
  libelleAction: string;
}

const TONS: Record<AIInsight["ton"], string> = {
  info: "border-sky/45 bg-sky/10",
  alerte: "border-orange/45 bg-orange/10",
  succes: "border-leaf/45 bg-leaf/10",
  urgent: "border-brick/40 bg-brick/8",
};

export function AIInsightCard({ insight }: { insight: AIInsight }) {
  return (
    <div className={cn("flex flex-col justify-between gap-3 rounded-xl border p-4", TONS[insight.ton])}>
      <div className="flex gap-3">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-petrol" />
        <p className="text-sm leading-relaxed text-foreground">{insight.texte}</p>
      </div>
      <Button asChild size="sm" variant="ghost" className="w-fit gap-1 text-petrol hover:bg-background/70">
        <Link to={insight.lien}>
          {insight.libelleAction}
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}
