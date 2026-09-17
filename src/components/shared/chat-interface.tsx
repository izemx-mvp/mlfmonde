import { useEffect, useRef, useState, type ReactNode } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface MessageChat {
  id: string;
  auteur: "utilisateur" | "ia";
  texte: string;
  heure: string;
}

export function ChatInterface({
  messages,
  onEnvoyer,
  enChargement,
  suggestions = [],
  entete,
  hauteur = "h-[520px]",
}: {
  messages: MessageChat[];
  onEnvoyer: (texte: string) => void;
  enChargement?: boolean;
  suggestions?: string[];
  entete?: ReactNode;
  hauteur?: string;
}) {
  const [valeur, setValeur] = useState("");
  const zoneRef = useRef<HTMLDivElement>(null);
  const champRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    zoneRef.current?.scrollTo({ top: zoneRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, enChargement]);

  useEffect(() => {
    champRef.current?.focus();
  }, []);

  const envoyer = (texte: string) => {
    const t = texte.trim();
    if (!t || enChargement) return;
    onEnvoyer(t);
    setValeur("");
    champRef.current?.focus();
  };

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]", hauteur)}>
      {entete && <div className="border-b border-border px-4 py-3">{entete}</div>}

      <div ref={zoneRef} className="flex-1 space-y-4 overflow-y-auto bg-surface/40 p-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.auteur === "utilisateur" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[78%]", m.auteur === "utilisateur" ? "text-right" : "text-left")}>
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                  m.auteur === "utilisateur"
                    ? "rounded-br-sm bg-petrol text-petrol-foreground"
                    : "rounded-bl-sm border border-border bg-card text-foreground",
                )}
              >
                {m.texte}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{m.heure}</p>
            </div>
          </div>
        ))}
        {enChargement && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="size-1.5 animate-bounce rounded-full bg-sky [animation-delay:0ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-sky [animation-delay:150ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-sky [animation-delay:300ms]" />
                L'assistant rédige une réponse…
              </span>
            </div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border bg-card px-4 py-3">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => envoyer(s)}
              className="rounded-full border border-sky/50 bg-sky/10 px-3 py-1 text-xs font-medium text-petrol transition-colors hover:bg-sky/20"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          envoyer(valeur);
        }}
        className="flex items-end gap-2 border-t border-border bg-card p-3"
      >
        <Textarea
          ref={champRef}
          value={valeur}
          onChange={(e) => setValeur(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              envoyer(valeur);
            }
          }}
          rows={1}
          placeholder="Écrivez votre message…"
          className="max-h-32 min-h-11 resize-none"
          aria-label="Message"
        />
        <Button type="submit" size="icon" disabled={!valeur.trim() || enChargement} aria-label="Envoyer">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
