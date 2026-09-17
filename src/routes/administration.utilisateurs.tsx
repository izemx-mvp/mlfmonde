import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, ShieldCheck, UserCog, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/administration/utilisateurs")({
  head: () => ({
    meta: [
      { title: "Utilisateurs & rôles — LFILM Smart School" },
      { name: "description", content: "Gestion des comptes et des rôles de la plateforme LFILM Smart School : administrateurs, RH, recrutement, services et accès." },
      { property: "og:title", content: "Utilisateurs — LFILM Smart School" },
      { property: "og:description", content: "Comptes, rôles et habilitations de la plateforme du lycée." },
    ],
  }),
  component: PageUtilisateurs,
});

interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: string;
  service: string;
  derniereConnexion: string;
  statut: "Actif" | "Inactif";
}

const ROLES = ["Administrateur", "Responsable RH", "Gestionnaire RH", "Recruteur", "Chef de service", "Lecture seule"];

const INITIAUX: Utilisateur[] = [
  { id: "U-01", nom: "Nadia Berrada", email: "n.berrada@lfilm.org", role: "Responsable RH", service: "Ressources Humaines", derniereConnexion: "2026-09-17", statut: "Actif" },
  { id: "U-02", nom: "Karim El Fassi", email: "k.elfassi@lfilm.org", role: "Administrateur", service: "Direction", derniereConnexion: "2026-09-17", statut: "Actif" },
  { id: "U-03", nom: "Sofia Bennani", email: "s.bennani@lfilm.org", role: "Gestionnaire RH", service: "Ressources Humaines", derniereConnexion: "2026-09-16", statut: "Actif" },
  { id: "U-04", nom: "Youssef Amrani", email: "y.amrani@lfilm.org", role: "Recruteur", service: "Ressources Humaines", derniereConnexion: "2026-09-15", statut: "Actif" },
  { id: "U-05", nom: "Leila Chraibi", email: "l.chraibi@lfilm.org", role: "Chef de service", service: "Vie Scolaire", derniereConnexion: "2026-09-14", statut: "Actif" },
  { id: "U-06", nom: "Mehdi Tazi", email: "m.tazi@lfilm.org", role: "Chef de service", service: "Administration & Finances", derniereConnexion: "2026-09-12", statut: "Actif" },
  { id: "U-07", nom: "Hanane Ouazzani", email: "h.ouazzani@lfilm.org", role: "Lecture seule", service: "Admissions & Communication", derniereConnexion: "2026-09-08", statut: "Inactif" },
  { id: "U-08", nom: "Rachid Belkadi", email: "r.belkadi@lfilm.org", role: "Chef de service", service: "Services Techniques", derniereConnexion: "2026-09-11", statut: "Actif" },
];

function PageUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(INITIAUX);
  const [formulaire, setFormulaire] = useState<Utilisateur | null>(null);
  const [suppression, setSuppression] = useState<Utilisateur | null>(null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [fRole, setFRole] = useState("Tous");

  const liste = utilisateurs.filter((u) => fRole === "Tous" || u.role === fRole);

  const ouvrirCreation = () =>
    setFormulaire({
      id: `U-${String(utilisateurs.length + 1).padStart(2, "0")}`,
      nom: "",
      email: "",
      role: "Gestionnaire RH",
      service: "Ressources Humaines",
      derniereConnexion: "2026-09-17",
      statut: "Actif",
    });

  const enregistrer = () => {
    if (!formulaire) return;
    const e: Record<string, string> = {};
    if (!formulaire.nom.trim()) e.nom = "Le nom est obligatoire.";
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(formulaire.email)) e.email = "Adresse email invalide.";
    if (!formulaire.service.trim()) e.service = "Le service est obligatoire.";
    setErreurs(e);
    if (Object.keys(e).length > 0) return;

    setUtilisateurs((prev) =>
      prev.some((u) => u.id === formulaire.id)
        ? prev.map((u) => (u.id === formulaire.id ? formulaire : u))
        : [formulaire, ...prev],
    );
    toast.success("Compte enregistré", { description: `${formulaire.nom} — ${formulaire.role}.` });
    setFormulaire(null);
    setErreurs({});
  };

  const colonnes: Column<Utilisateur>[] = [
    { key: "nom", header: "Utilisateur", sortValue: (u) => u.nom, render: (u) => (
      <div>
        <p className="font-medium">{u.nom}</p>
        <p className="text-xs text-muted-foreground">{u.email}</p>
      </div>
    ) },
    { key: "role", header: "Rôle", sortValue: (u) => u.role, render: (u) => <StatusBadge value={u.role} ton="info" /> },
    { key: "service", header: "Service", sortValue: (u) => u.service, render: (u) => u.service },
    { key: "derniereConnexion", header: "Dernière connexion", sortValue: (u) => u.derniereConnexion, render: (u) => formatDate(u.derniereConnexion) },
    { key: "statut", header: "Statut", sortValue: (u) => u.statut, render: (u) => <StatusBadge value={u.statut} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => setFormulaire(u)}>
            <UserCog className="size-4" />
            Modifier
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast.success("Réinitialisation envoyée", { description: `Un lien a été envoyé à ${u.email}.` })}
          >
            <KeyRound className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSuppression(u)}>
            Désactiver
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Administration"
        titre="Utilisateurs & habilitations"
        description="Gestion des comptes de la plateforme et des niveaux d'accès par service. Chaque rôle détermine les modules visibles et les actions autorisées."
        actions={
          <Button onClick={ouvrirCreation}>
            <UserPlus className="size-4" />
            Ajouter un utilisateur
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Comptes actifs" valeur={utilisateurs.filter((u) => u.statut === "Actif").length} icone={Users} couleur="petrol" />
        <KPICard label="Administrateurs" valeur={utilisateurs.filter((u) => u.role === "Administrateur").length} icone={ShieldCheck} couleur="navy" />
        <KPICard label="Rôles configurés" valeur={ROLES.length} icone={UserCog} couleur="sky" />
        <KPICard label="Comptes inactifs" valeur={utilisateurs.filter((u) => u.statut === "Inactif").length} icone={Users} couleur="orange" positif={false} />
      </section>

      <DataTable
        data={liste}
        columns={colonnes}
        rowKey={(u) => u.id}
        placeholderRecherche="Nom, email, service…"
        recherche={(u, t) => `${u.nom} ${u.email} ${u.service} ${u.role}`.toLowerCase().includes(t)}
        filtres={
          <Select value={fRole} onValueChange={setFRole}>
            <SelectTrigger className="w-[190px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les rôles</SelectItem>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      <Dialog open={!!formulaire} onOpenChange={(o) => !o && setFormulaire(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{utilisateurs.some((u) => u.id === formulaire?.id) ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
            <DialogDescription>Les champs marqués d'un astérisque sont obligatoires.</DialogDescription>
          </DialogHeader>
          {formulaire && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Champ libelle="Nom complet *" erreur={erreurs.nom}>
                <Input value={formulaire.nom} onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })} />
              </Champ>
              <Champ libelle="Email professionnel *" erreur={erreurs.email}>
                <Input value={formulaire.email} onChange={(e) => setFormulaire({ ...formulaire, email: e.target.value })} placeholder="prenom.nom@lfilm.org" />
              </Champ>
              <Champ libelle="Rôle *">
                <Select value={formulaire.role} onValueChange={(v) => setFormulaire({ ...formulaire, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Champ>
              <Champ libelle="Service *" erreur={erreurs.service}>
                <Input value={formulaire.service} onChange={(e) => setFormulaire({ ...formulaire, service: e.target.value })} />
              </Champ>
              <Champ libelle="Statut">
                <Select value={formulaire.statut} onValueChange={(v) => setFormulaire({ ...formulaire, statut: v as Utilisateur["statut"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </Champ>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormulaire(null)}>Annuler</Button>
            <Button onClick={enregistrer}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!suppression} onOpenChange={(o) => !o && setSuppression(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Désactiver ce compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              {suppression?.nom} n'aura plus accès à la plateforme. Cette action est réversible depuis la fiche utilisateur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (suppression) {
                  setUtilisateurs((prev) => prev.map((u) => (u.id === suppression.id ? { ...u, statut: "Inactif" } : u)));
                  toast.success("Compte désactivé", { description: suppression.nom });
                }
                setSuppression(null);
              }}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Champ({ libelle, erreur, children }: { libelle: string; erreur?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase">{libelle}</Label>
      {children}
      {erreur && <p className="text-xs text-brick">{erreur}</p>}
    </div>
  );
}
