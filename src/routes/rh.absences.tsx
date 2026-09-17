import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageCircle, Plus, Sparkles, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarPersonne } from "@/components/shared/avatar-personne";
import { FiltreSelect, TOUS } from "@/components/shared/filtre-select";
import { CalendrierMois } from "@/components/shared/calendrier-mois";
import { KPICard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import { formatDate, getCollaborateur, nomComplet } from "@/data/mock";
import type { Absence } from "@/data/types";
import { CalendarClock, CalendarCheck, Clock, Hourglass } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/rh/absences")({
  head: () => ({
    meta: [
      { title: "Absences & Congés — LFILM Smart School" },
      { name: "description", content: "Gestion intelligente des absences et congés du LFILM : validation, calendrier et détection automatique par IA." },
      { property: "og:title", content: "Absences & Congés — LFILM Smart School" },
      { property: "og:description", content: "Validation des congés et détection automatique des demandes email et WhatsApp." },
    ],
  }),
  component: PageAbsences,
});

const TYPES = ["Congé annuel", "Maladie", "Absence exceptionnelle", "Télétravail", "Autorisation d'absence"];
const SOURCES = ["Portail RH", "Email", "WhatsApp", "Saisie manuelle"];
const STATUTS = ["En attente", "Approuvé", "Refusé", "En cours"];

function PageAbsences() {
  const { absences, majAbsence, ajouterAbsence, collaborateurs, ajouterNotification } = useAppStore();
  const [type, setType] = useState(TOUS);
  const [source, setSource] = useState(TOUS);
  const [statut, setStatut] = useState(TOUS);
  const [detail, setDetail] = useState<Absence | null>(null);
  const [creation, setCreation] = useState(false);

  const donnees = absences.filter(
    (a) => (type === TOUS || a.type === type) && (source === TOUS || a.source === source) && (statut === TOUS || a.statut === statut),
  );

  const decider = (a: Absence, decision: "Approuvé" | "Refusé") => {
    majAbsence(a.id, { statut: decision });
    toast[decision === "Approuvé" ? "success" : "error"](
      decision === "Approuvé" ? "Demande approuvée" : "Demande refusée",
      { description: `${a.type} de ${nomComplet(a.collaborateurId)} — ${formatDate(a.dateDebut)} au ${formatDate(a.dateFin)}.` },
    );
    ajouterNotification({
      titre: `Demande ${decision.toLowerCase()}e`,
      description: `${nomComplet(a.collaborateurId)} — ${a.type}`,
      date: "À l'instant",
      lien: "/rh/absences",
      ton: decision === "Approuvé" ? "succes" : "alerte",
    });
  };

  const colonnes: Column<Absence>[] = [
    {
      key: "collaborateur",
      header: "Collaborateur",
      sortValue: (a) => nomComplet(a.collaborateurId),
      render: (a) => <AvatarPersonne nom={nomComplet(a.collaborateurId)} sousTitre={getCollaborateur(a.collaborateurId)?.fonction} />,
    },
    { key: "service", header: "Service", sortValue: (a) => getCollaborateur(a.collaborateurId)?.service ?? "", render: (a) => <span className="text-muted-foreground">{getCollaborateur(a.collaborateurId)?.service}</span> },
    { key: "type", header: "Type", sortValue: (a) => a.type, render: (a) => a.type },
    { key: "debut", header: "Début", sortValue: (a) => a.dateDebut, render: (a) => formatDate(a.dateDebut) },
    { key: "fin", header: "Fin", sortValue: (a) => a.dateFin, render: (a) => formatDate(a.dateFin) },
    { key: "duree", header: "Durée", sortValue: (a) => a.duree, render: (a) => `${a.duree} j` },
    { key: "source", header: "Source", sortValue: (a) => a.source, render: (a) => <StatusBadge value={a.source} /> },
    { key: "statut", header: "Statut", sortValue: (a) => a.statut, render: (a) => <StatusBadge value={a.statut} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (a) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          {a.statut === "En attente" && (
            <>
              <Button size="icon" variant="outline" className="text-leaf" aria-label="Approuver" onClick={() => decider(a, "Approuvé")}>
                <Check className="size-4" />
              </Button>
              <Button size="icon" variant="outline" className="text-brick" aria-label="Refuser" onClick={() => decider(a, "Refusé")}>
                <X className="size-4" />
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" onClick={() => setDetail(a)}>
            Détail
          </Button>
        </div>
      ),
    },
  ];

  const evenementsCalendrier = absences.map((a) => ({
    id: a.id,
    date: a.dateDebut,
    libelle: `${nomComplet(a.collaborateurId)} — ${a.type}`,
    ton: (a.type === "Maladie" ? "brick" : a.type === "Télétravail" ? "sky" : "petrol") as "brick" | "sky" | "petrol",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Ressources humaines"
        titre="Smart Absence & Leave Management"
        description="Toutes les absences et demandes de congés, quel que soit le canal d'origine : portail RH, email, WhatsApp ou saisie manuelle."
        actions={
          <Button onClick={() => setCreation(true)}>
            <Plus className="size-4" />
            Nouvelle demande
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Demandes en attente" valeur={absences.filter((a) => a.statut === "En attente").length} icone={Hourglass} couleur="gold" />
        <KPICard label="Absences en cours" valeur={absences.filter((a) => a.statut === "En cours").length} icone={Clock} couleur="orange" />
        <KPICard label="Approuvées ce mois" valeur={absences.filter((a) => a.statut === "Approuvé").length} icone={CalendarCheck} couleur="leaf" />
        <KPICard label="Détectées par l'IA" valeur={absences.filter((a) => a.source === "Email" || a.source === "WhatsApp").length} icone={CalendarClock} couleur="sky" detail="email & WhatsApp" />
      </section>

      <section className="rounded-xl border border-sky/40 bg-sky/8 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="size-4 text-petrol" />
          <h2 className="font-display text-base font-semibold text-navy">Automatisation IA</h2>
        </div>
        <ul className="grid gap-2 md:grid-cols-3">
          <li className="rounded-lg border border-border bg-card p-3 text-sm">
            Une demande reçue par <strong>email</strong> a été automatiquement détectée et créée (congé annuel du 28/09 au 02/10, confiance 96 %).
          </li>
          <li className="rounded-lg border border-border bg-card p-3 text-sm">
            Une demande <strong>WhatsApp</strong> a été interprétée et ajoutée aux demandes en attente (absence exceptionnelle, 1 jour).
          </li>
          <li className="rounded-lg border border-border bg-card p-3 text-sm">
            Une <strong>relance automatique</strong> est recommandée pour 3 demandes non traitées depuis plus de 48 heures.
          </li>
        </ul>
        <Button
          size="sm"
          className="mt-3"
          onClick={() =>
            toast.success("Relances envoyées", { description: "3 responsables de service ont reçu un rappel de validation." })
          }
        >
          Envoyer les relances automatiques
        </Button>
      </section>

      <Tabs defaultValue="liste">
        <TabsList>
          <TabsTrigger value="liste">Liste des demandes</TabsTrigger>
          <TabsTrigger value="calendrier">Vue calendrier</TabsTrigger>
        </TabsList>
        <TabsContent value="liste" className="mt-4">
          <DataTable
            data={donnees}
            columns={colonnes}
            rowKey={(a) => a.id}
            parPage={10}
            placeholderRecherche="Collaborateur, type, motif…"
            recherche={(a, t) => `${nomComplet(a.collaborateurId)} ${a.type} ${a.motif} ${a.source}`.toLowerCase().includes(t)}
            filtres={
              <>
                <FiltreSelect valeur={type} onChange={setType} options={TYPES} libelle="Type" largeur="w-52" />
                <FiltreSelect valeur={source} onChange={setSource} options={SOURCES} libelle="Source" largeur="w-44" />
                <FiltreSelect valeur={statut} onChange={setStatut} options={STATUTS} libelle="Statut" largeur="w-40" />
              </>
            }
          />
        </TabsContent>
        <TabsContent value="calendrier" className="mt-4">
          <CalendrierMois
            evenements={evenementsCalendrier}
            onSelectionner={(e) => setDetail(absences.find((a) => a.id === e.id) ?? null)}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détail de la demande</DialogTitle>
            <DialogDescription>{detail && `${detail.type} — ${nomComplet(detail.collaborateurId)}`}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <Ligne libelle="Période" valeur={`${formatDate(detail.dateDebut)} → ${formatDate(detail.dateFin)} (${detail.duree} j)`} />
              <Ligne libelle="Service" valeur={getCollaborateur(detail.collaborateurId)?.service ?? "—"} />
              <Ligne libelle="Motif" valeur={detail.motif} />
              <Ligne libelle="Source" valeur={detail.source} />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Statut</span>
                <StatusBadge value={detail.statut} />
              </div>
              {detail.detectionIA && (
                <p className="flex gap-2 rounded-lg border border-sky/45 bg-sky/10 p-3 text-sm">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-petrol" />
                  {detail.detectionIA}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetail(null)}>
              Fermer
            </Button>
            {detail?.statut === "En attente" && (
              <>
                <Button
                  variant="outline"
                  className="text-brick"
                  onClick={() => {
                    decider(detail, "Refusé");
                    setDetail(null);
                  }}
                >
                  Refuser
                </Button>
                <Button
                  onClick={() => {
                    decider(detail, "Approuvé");
                    setDetail(null);
                  }}
                >
                  Approuver
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DialogueCreation
        ouvert={creation}
        onClose={() => setCreation(false)}
        onCreer={(a) => {
          ajouterAbsence(a);
          toast.success("Demande créée", { description: "Elle apparaît désormais dans la liste avec le statut « En attente »." });
        }}
        collaborateurs={collaborateurs.slice(0, 60).map((c) => ({ id: c.id, nom: `${c.prenom} ${c.nom}` }))}
      />
    </div>
  );
}

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{libelle}</span>
      <span className="text-right font-medium">{valeur}</span>
    </div>
  );
}

function DialogueCreation({
  ouvert,
  onClose,
  onCreer,
  collaborateurs,
}: {
  ouvert: boolean;
  onClose: () => void;
  onCreer: (a: Omit<Absence, "id">) => void;
  collaborateurs: { id: string; nom: string }[];
}) {
  const [collaborateurId, setCollaborateurId] = useState("");
  const [type, setType] = useState("Congé annuel");
  const [debut, setDebut] = useState("2026-09-21");
  const [fin, setFin] = useState("2026-09-25");
  const [motif, setMotif] = useState("");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  const soumettre = () => {
    const e: Record<string, string> = {};
    if (!collaborateurId) e["collaborateurId"] = "Sélectionnez un collaborateur.";
    if (!debut) e["debut"] = "Date de début obligatoire.";
    if (!fin || fin < debut) e["fin"] = "La date de fin doit suivre la date de début.";
    if (!motif.trim()) e["motif"] = "Le motif est obligatoire.";
    setErreurs(e);
    if (Object.keys(e).length > 0) {
      toast.error("Formulaire incomplet", { description: "Merci de corriger les champs signalés." });
      return;
    }
    const duree = Math.max(1, Math.round((new Date(fin).getTime() - new Date(debut).getTime()) / 86400000));
    onCreer({
      collaborateurId,
      type: type as Absence["type"],
      dateDebut: debut,
      dateFin: fin,
      duree,
      source: "Saisie manuelle",
      statut: "En attente",
      motif,
    });
    setMotif("");
    setCollaborateurId("");
    onClose();
  };

  return (
    <Dialog open={ouvert} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Créer une demande d'absence</DialogTitle>
          <DialogDescription>La demande sera enregistrée avec le statut « En attente » de validation.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Collaborateur *</Label>
            <Select value={collaborateurId} onValueChange={setCollaborateurId}>
              <SelectTrigger><SelectValue placeholder="Choisir un collaborateur" /></SelectTrigger>
              <SelectContent>
                {collaborateurs.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {erreurs["collaborateurId"] && <p className="text-xs text-brick">{erreurs["collaborateurId"]}</p>}
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
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Date de début *</Label>
            <Input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} />
            {erreurs["debut"] && <p className="text-xs text-brick">{erreurs["debut"]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Date de fin *</Label>
            <Input type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
            {erreurs["fin"] && <p className="text-xs text-brick">{erreurs["fin"]}</p>}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Motif *</Label>
            <Textarea value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Précisez le motif de la demande" />
            {erreurs["motif"] && <p className="text-xs text-brick">{erreurs["motif"]}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={soumettre}>Créer la demande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
