import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import { SERVICES, FONCTIONS } from "@/data/mock";
import type { Collaborateur } from "@/data/types";
import { toast } from "sonner";

const VIDE = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  service: SERVICES[0] as string,
  fonction: "",
  contrat: "CDI",
  dateArrivee: "2026-09-01",
  statut: "Actif",
  responsable: "Nadia Berrada",
};

export function FormulaireCollaborateur({
  ouvert,
  collaborateur,
  onClose,
}: {
  ouvert: boolean;
  collaborateur?: Collaborateur | undefined;
  onClose: () => void;
}) {
  const { ajouterCollaborateur, majCollaborateur, ajouterNotification } = useAppStore();
  const [valeurs, setValeurs] = useState({ ...VIDE });
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (ouvert) {
      setErreurs({});
      setValeurs(
        collaborateur
          ? {
              prenom: collaborateur.prenom,
              nom: collaborateur.nom,
              email: collaborateur.email,
              telephone: collaborateur.telephone,
              service: collaborateur.service,
              fonction: collaborateur.fonction,
              contrat: collaborateur.contrat,
              dateArrivee: collaborateur.dateArrivee,
              statut: collaborateur.statut,
              responsable: collaborateur.responsable,
            }
          : { ...VIDE },
      );
    }
  }, [ouvert, collaborateur]);

  const set = (k: string, v: string) => setValeurs((p) => ({ ...p, [k]: v }));

  const valider = () => {
    const e: Record<string, string> = {};
    if (!valeurs.prenom.trim())  = "Le prénom est obligatoire.";
    if (!valeurs.nom.trim())  = "Le nom est obligatoire.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeurs.email))  = "Adresse email invalide.";
    if (!valeurs.fonction.trim())  = "La fonction est obligatoire.";
    if (!valeurs.dateArrivee)  = "La date d'arrivée est obligatoire.";
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const soumettre = () => {
    if (!valider()) {
      toast.error("Formulaire incomplet", { description: "Merci de corriger les champs signalés." });
      return;
    }
    if (collaborateur) {
      majCollaborateur(collaborateur.id, valeurs as Partial<Collaborateur>);
      toast.success("Collaborateur mis à jour", { description: `${valeurs.prenom} ${valeurs.nom} — modifications enregistrées.` });
    } else {
      ajouterCollaborateur({
        ...(valeurs as unknown as Omit<Collaborateur, "id" | "matricule">),
        dateNaissance: "1990-01-01",
        site: "Bouskoura – Ville Verte",
        soldeConges: 22,
        adresse: "Bouskoura, Ville Verte",
      });
      ajouterNotification({
        titre: "Nouveau collaborateur créé",
        description: `${valeurs.prenom} ${valeurs.nom} — ${valeurs.fonction}. Parcours d'onboarding à lancer.`,
        date: "À l'instant",
        lien: "/onboarding",
        ton: "succes",
      });
      toast.success("Collaborateur ajouté", { description: "Le dossier a été créé et l'onboarding peut être lancé." });
    }
    onClose();
  };

  const fonctions = FONCTIONS[valeurs.service] ?? [];

  return (
    <Dialog open={ouvert} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{collaborateur ? "Modifier le collaborateur" : "Ajouter un collaborateur"}</DialogTitle>
          <DialogDescription>
            Les champs marqués d'un astérisque sont obligatoires. Les données restent locales à cette démonstration.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <Champ label="Prénom *" erreur={erreurs["prenom"]}>
            <Input value={valeurs.prenom} onChange={(e) => set("prenom", e.target.value)} placeholder="Salma" />
          </Champ>
          <Champ label="Nom *" erreur={erreurs["nom"]}>
            <Input value={valeurs.nom} onChange={(e) => set("nom", e.target.value)} placeholder="Bennani" />
          </Champ>
          <Champ label="Email professionnel *" erreur={erreurs["email"]}>
            <Input value={valeurs.email} onChange={(e) => set("email", e.target.value)} placeholder="s.bennani@lfilm.org" />
          </Champ>
          <Champ label="Téléphone">
            <Input value={valeurs.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="+212 6 12 34 56 78" />
          </Champ>
          <Champ label="Service *">
            <Select value={valeurs.service} onValueChange={(v) => { set("service", v); set("fonction", ""); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Champ>
          <Champ label="Fonction *" erreur={erreurs["fonction"]}>
            <Select value={valeurs.fonction} onValueChange={(v) => set("fonction", v)}>
              <SelectTrigger><SelectValue placeholder="Choisir une fonction" /></SelectTrigger>
              <SelectContent>
                {fonctions.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Champ>
          <Champ label="Type de contrat *">
            <Select value={valeurs.contrat} onValueChange={(v) => set("contrat", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["CDI", "CDD", "Détachement", "Vacataire", "Stage"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Champ>
          <Champ label="Date d'arrivée *" erreur={erreurs["dateArrivee"]}>
            <Input type="date" value={valeurs.dateArrivee} onChange={(e) => set("dateArrivee", e.target.value)} />
          </Champ>
          <Champ label="Statut">
            <Select value={valeurs.statut} onValueChange={(v) => set("statut", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Actif", "En congé", "Inactif"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Champ>
          <Champ label="Responsable hiérarchique">
            <Input value={valeurs.responsable} onChange={(e) => set("responsable", e.target.value)} />
          </Champ>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={soumettre}>{collaborateur ? "Enregistrer les modifications" : "Créer le collaborateur"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Champ({ label, erreur, children }: { label: string; erreur?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase">{label}</Label>
      {children}
      {erreur && <p className="text-xs text-brick">{erreur}</p>}
    </div>
  );
}
