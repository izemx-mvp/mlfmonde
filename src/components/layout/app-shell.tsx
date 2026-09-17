import { useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { ChevronRight, LogOut, Menu, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNav } from "./sidebar-nav";
import { RechercheGlobale } from "./recherche-globale";
import { CentreNotifications } from "./centre-notifications";
import { TOUS_LES_LIENS } from "./navigation";
import { UTILISATEUR_COURANT } from "@/data/mock";
import { deconnecterLFILM } from "@/lib/auth";
import { toast } from "sonner";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [reduite, setReduite] = useState(false);
  const [mobileOuvert, setMobileOuvert] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const lienCourant =
    [...TOUS_LES_LIENS].sort((a, b) => b.href.length - a.href.length).find((l) => pathname.startsWith(l.href) && l.href !== "/") ??
    TOUS_LES_LIENS[0]!;

  async function fermerSession() {
    deconnecterLFILM();
    toast.success("Déconnexion", { description: "Votre session est fermée." });
    await router.navigate({ to: "/connexion", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <SidebarNav reduite={reduite} onToggle={() => setReduite((r) => !r)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
            <Sheet open={mobileOuvert} onOpenChange={setMobileOuvert}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-0 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarNav reduite={false} onToggle={() => {}} onNaviguer={() => setMobileOuvert(false)} />
              </SheetContent>
            </Sheet>

            <nav aria-label="Fil d'Ariane" className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
              <Link to="/" className="transition-colors hover:text-petrol">
                Accueil
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="font-medium text-navy">{pathname === "/" ? "Dashboard" : lienCourant.libelle}</span>
            </nav>

            <div className="ml-auto flex flex-1 items-center justify-end gap-2">
              <div className="hidden flex-1 justify-end md:flex">
                <RechercheGlobale />
              </div>
              <CentreNotifications />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-surface"
                    aria-label="Profil utilisateur"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-petrol text-sm font-semibold text-petrol-foreground">
                      {UTILISATEUR_COURANT.initiales}
                    </span>
                    <span className="hidden text-left leading-tight lg:block">
                      <span className="block text-sm font-medium text-foreground">{UTILISATEUR_COURANT.nom}</span>
                      <span className="block text-xs text-muted-foreground">{UTILISATEUR_COURANT.fonction}</span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{UTILISATEUR_COURANT.nom}</p>
                    <p className="text-xs font-normal text-muted-foreground">{UTILISATEUR_COURANT.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => toast.info("Profil", { description: "Fiche profil disponible dans l'administration." })}>
                    <UserRound className="size-4" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/administration/parametres">
                      <Settings className="size-4" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      void fermerSession();
                    }}
                  >
                    <LogOut className="size-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="px-4 pb-3 md:hidden">
            <RechercheGlobale />
          </div>
          <div className="h-0.5 lfilm-stripe" />
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>

        <footer className="border-t border-border bg-background px-4 py-4 text-xs text-muted-foreground lg:px-8">
          Lycée Français International Louis-Massignon — Bouskoura Ville Verte · Réseau mlfmonde / OSUI · MVP de démonstration
        </footer>
      </div>
    </div>
  );
}
