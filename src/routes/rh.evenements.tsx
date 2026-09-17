import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CalendarPlus, Check, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarPersonne } from "@/components/shared/avatar-personne";
import { FiltreSelect, TOUS } from "@/components/shared/filtre-select";
import { CalendrierMois } from "@/components/shared/calendrier-mois";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import { formatDate, getCollaborateur, nomComplet } from "@/data/mock";
import type { EvenementRH } from "@/data/types";
import { toast } from "sonner";

export const Route = createFileRoute("/rh/evenements")({
  head: () => ({
    meta: [
      { title: "Événements RH & suivi médical — LFILM Smart School" },
      { name: "description", content: "Visites médicales, formations, entretiens annuels et échéances de contrats des collaborateurs du LFILM." },
      { property: "og:title", content: "Événements RH — LFILM Smart School" },
      { property: "og:description", content: "Suivi des échéances RH et médicales du lycée Louis-Massignon." },
    ],
  }),
  component: PageEvenements,
});

const TYPES = [
  "Visite médicale",
  "Formation",
  "Entretien annuel",
  "Renouvellement de document",
  "Échéance de contrat",
  "Certification",
  "Évaluation",
];
const STATUTS = ["Planifié", "En cours", "Terminé", "À planifier", "En retard"];

function PageEvenements() {
  const { evenements, majEvenement, supprimerEvenement, ajouterEvenement, collaborateurs } = useAppStore();
  const [type, setType] = useState(TOUS);
  const [statut, setStatut] = useState(TOUS);
  const [creation, setCreation] = useState(false);

  const donnees = evenements.filter((e) => (type === TOUS || e.type === type) && (statut === TOUS || e.statut === statut));

  const alertes = evenements
    .filter((e) => e.date >= "2026-09-17" && e.date <= "2026-10-17" && e.statut !== "Terminé")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const colonnes: Column<EvenementRH>[] = [
    { key: "intitule", header: "Événement", sortValue: (e) => e.intitule, render: (e) => <span className="font-medium">{e.intitule}</span> },
    {
      key: "collaborateur",
      header: "Collaborateur",
      sortValue: (e) => nomComplet(e.collaborateurId),
      render: (e) => <AvatarPersonne nom={nomComplet(e.collaborateurId)} sousTitre={getCollaborateur(e.collaborateurId)?.service} taille="sm" />,
    },
    { key: "type", header: "Type", sortValue: (e) => e.type, render: (e) => e.type },
    { key: "date", header: "Date", sortValue: (e) => e.date, render: (e) => formatDate(e.date) },
    { key: "responsable", header: "Responsable", sortValue: (e) => e.responsable, render: (e) => <span className="text-muted-foreground">{e.responsable}</span> },
    { key: "statut", header: "Statut", sortValue: (e) => e.statut, render: (e) => <StatusBadge value={e.statut} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (e) => (
        <div className="flex justify-end gap-1">
          {e.statut !== "Terminé" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                majEvenement(e.id, { statut: "Terminé" });
                toast.success("Événement clôturé", { description: `${e.intitule} — ${nomComplet(e.collaborateurId)}.` });
              }}
            >
              <Check className="size-4" />
              Clôturer
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            aria-label="Supprimer"
            onClick={() => {
              supprimerEvenement(e.id);
              toast.success("Événement supprimé");
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Suivi RH"
        titre="HR Event & Medical Follow-up"
        description="Visites médicales, formations, entretiens annuels, certifications et échéances documentaires — avec alertes anticipées générées par l'IA."
        actions={
          <Button onClick={() => setCreation(true)}>
            <CalendarPlus className="size-4" />
            Planifier un événement
          </Button>
        }
      />

      <section className="grid gap-3 md:grid-cols-2">
        {alertes.map((e) => {
          const jours = Math.round((new Date(e.date).getTime() - new Date("2026-09-17").getTime()) / 86400000);
          return (
            <div key={e.id} className="flex items-start gap-3 rounded-xl border border-orange/45 bg-orange/10 p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-orange" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {e.type} dans {jours} jour{jours > 1 ? "s" : ""} — {nomComplet(e.collaborateurId)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {e.intitule} · prévu le {formatDate(e.date)} · responsable {e.responsable}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <Tabs defaultValue="liste">
        <TabsList>
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
        </TabsList>
        <TabsContent value="liste" className="mt-4">
          <DataTable
            data={donnees}
            columns={colonnes}
            rowKey={(e) => e.id}
            placeholderRecherche="Événement, collaborateur, responsable…"
            recherche={(e, t) => `${e.intitule} ${e.type} ${nomComplet(e.collaborateurId)} ${e.responsable}`.toLowerCase().includes(t)}
            filtres={
              <>
                <FiltreSelect valeur={type} onChange={setType} options={TYPES} libelle="Type" largeur="w-60" />
                <FiltreSelect valeur={statut} onChange={setStatut} options={STATUTS} libelle="Statut" largeur="w-44" />
              </>
            }
          />
        </TabsContent>
        <TabsContent value="calendrier" className="mt-4">
          <CalendrierMois
            evenements={evenements.map((e) => ({
              id: e.id,
              date: e.date,
              libelle: `${e.type} — ${nomComplet(e.collaborateurId)}`,
              ton: (e.type === "Visite médicale" ? "brick" : e.type === "Formation" ? "leaf" : "petrol") as "brick" | "leaf" | "petrol",
            }))}
            onSelectionner={(ev) => toast.info("Événement", { description: ev.libelle })}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={creation} onOpenChange={setCreation}>
        <DialogContent className="sm:max-w-xl">
          <FormulaireEvenement
            collaborateurs={collaborateurs.slice(0, 60).map((c) => ({ id: c.id, nom: `${c.prenom} ${c.nom}` }))}
            onClose={() => setCreation(false)}
            onCreer={(e) => {
              ajouterEvenement(e);
              toast.success("Événement planifié", { description: `${e.intitule} — ${formatDate(e.date)}.` });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormulaireEvenement({
  collaborateurs,
  onClose,
  onCreer,
}: {
  collaborateurs: { id: string; nom: string }[];
  onClose: () => void;
  onCreer: (e: Omit<EvenementRH, "id">) => void;
}) {
  const [intitule, setIntitule] = useState("");
  const [collaborateurId, setCollaborateurId] = useState("");
  const [type, setType] = useState(TYPES[0]!);
  const [date, setDate] = useState("2026-10-01");
  const [responsable, setResponsable] = useState("Nadia Berrada");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  return (
    <>
      <DialogHeader>
        <DialogTitle>Planifier un événement RH</DialogTitle>
        <DialogDescription>L'événement sera ajouté au calendrier et suivi par les alertes automatiques.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Intitulé *</Label>
          <Input value={intitule} onChange={(e) => setIntitule(e.target.value)} placeholder="Visite médicale annuelle" />
          {erreurs.intitule && <p className="text-xs text-brick">{erreurs.intitule}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Collaborateur *</Label>
          <Select value={collaborateurId} onValueChange={setCollaborateurId}>
            <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>
              {collaborateurs.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {erreurs.collaborateurId && <p className="text-xs text-brick">{erreurs.collaborateurId}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Type *</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Date *</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Responsable</Label>
          <Input value={responsable} onChange={(e) => setResponsable(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button
          onClick={() => {
            const err: Record<string, string> = {};
            if (!intitule.trim()) err.intitule = "L'intitulé est obligatoire.";
            if (!collaborateurId) err.collaborateurId = "Sélectionnez un collaborateur.";
            setErreurs(err);
            if (Object.keys(err).length > 0) {
              toast.error("Formulaire incomplet", { description: "Merci de corriger les champs signalés." });
              return;
            }
            onCreer({ intitule, collaborateurId, type: type as EvenementRH["type"], date, responsable, statut: "Planifié" });
            onClose();
          }}
        >
          Planifier
        </Button>
      </DialogFooter>
    </>
  );
}
