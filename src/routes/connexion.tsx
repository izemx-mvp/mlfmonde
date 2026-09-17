import { useEffect, useState, type FormEvent } from "react";
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
  const [email, setEmail] = useState("mlfmonde@izemxlab.com");
  const [password, setPassword] = useState("mlfmonde2026@");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [pret, setPret] = useState(false);

  useEffect(() => setPret(true), []);

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 lfilm-stripe" />
      <div className="pointer-events-none absolute inset-x-0 top-1.5 h-40 bg-gradient-to-b from-background to-transparent" />

      <section className="relative w-full max-w-[460px]">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-raised)]">
          <div className="h-1 lfilm-stripe" />
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-full max-w-[240px] items-center justify-center rounded-lg border border-border bg-background px-5 py-3 shadow-[var(--shadow-card)]">
                  <img src={logoLfilm.url} alt="Lycée Français International Louis-Massignon" className="block h-full w-full object-contain" />
                </div>
              </div>
              <div className="mx-auto mb-4 grid size-10 place-items-center rounded-lg bg-petrol text-petrol-foreground shadow-[var(--shadow-card)]">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">Connexion sécurisée</h1>
              <p className="mt-2 text-sm text-muted-foreground">Accédez à votre espace institutionnel LFILM.</p>
            </div>

            <form className="space-y-5" onSubmit={soumettre}>
              <div className="space-y-2">
                <Label htmlFor="email" className="px-0.5 text-xs font-semibold uppercase text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 bg-surface pl-10 transition-colors focus:bg-background" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="px-0.5 text-xs font-semibold uppercase text-foreground">Mot de passe</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 bg-surface pl-10 transition-colors focus:bg-background" required />
                </div>
              </div>

              {erreur && (
                <p className="flex items-center gap-2 rounded-md border border-brick/35 bg-brick/10 px-3 py-2.5 text-sm text-brick" role="alert">
                  <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                  {erreur}
                </p>
              )}

              <Button type="submit" size="lg" className="h-12 w-full shadow-[var(--shadow-card)]" disabled={!pret || chargement}>
                {!pret || chargement ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-8 border-t border-border pt-5 text-center">
              <p className="text-xs text-muted-foreground">Accès réservé aux équipes autorisées du LFILM</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">© 2026 LFILM · Plateforme sécurisée</p>
      </section>
    </main>
  );
}
