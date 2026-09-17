import { useState, type FormEvent } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { connecterLFILM, verifierSessionLFILM } from "@/lib/auth.functions";
import logoLfilm from "@/assets/lfilm-logo.png.asset.json";

export const Route = createFileRoute("/connexion")({
  beforeLoad: async () => {
    const session = await verifierSessionLFILM();
    if (session.connecte) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Connexion — LFILM Smart School" },
      { name: "description", content: "Accès sécurisé à la plateforme LFILM Smart School." },
      { property: "og:title", content: "Connexion — LFILM Smart School" },
      { property: "og:description", content: "Écran de connexion sécurisé de la plateforme LFILM Smart School." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PageConnexion,
});

function PageConnexion() {
  const router = useRouter();
  const connecter = useServerFn(connecterLFILM);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function authentifier() {
    if (chargement) return;

    setErreur("");
    setChargement(true);

    try {
      const resultat = await connecter({ data: { email, password } });
      if (!resultat.ok) {
        setErreur("Email ou mot de passe incorrect.");
        return;
      }
      await router.navigate({ to: "/" });
    } catch {
      setErreur("Connexion indisponible pour le moment.");
    } finally {
      setChargement(false);
    }
  }

  function soumettre(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void authentifier();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <section className="flex w-full max-w-md flex-col items-center">
          <div className="mb-8 flex w-full justify-center">
            <div className="max-w-full rounded-lg border border-border bg-background p-3 shadow-[var(--shadow-card)]">
              <img
                src={logoLfilm.url}
                alt="Lycée Français International Louis-Massignon"
                className="h-16 w-auto max-w-[220px] object-contain"
              />
            </div>
          </div>
        <div className="w-full">
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-raised)] sm:p-8">
            <div className="mb-6">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-petrol text-petrol-foreground">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-navy">Connexion sécurisée</h2>
              <p className="mt-2 text-sm text-muted-foreground">Identifiez-vous pour accéder à la plateforme.</p>
            </div>

            <form className="space-y-4" onSubmit={soumettre}>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase">Mot de passe</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {erreur && (
                <p className="flex items-center gap-2 rounded-md border border-brick/35 bg-brick/10 px-3 py-2 text-sm text-brick">
                  <AlertCircle className="size-4 shrink-0" />
                  {erreur}
                </p>
              )}

              <Button type="button" className="w-full" disabled={chargement} onClick={() => void authentifier()}>
                {chargement ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
