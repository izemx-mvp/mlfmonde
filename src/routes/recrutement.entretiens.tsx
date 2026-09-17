import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, Mail, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarPersonne } from "@/components/shared/avatar-personne";
import { CalendrierMois } from "@/components/shared/calendrier-mois";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/data/mock";
import type { Entretien } from "@/data/types";
import { toast } from "sonner";

export const Route = createFileRoute("/recrutement/entretiens")({
  head: () => ({
    meta: [
      { title: "Entretiens & rendez-vous — LFILM Smart School" },
      { name: "description", content: "Planification des entretiens de recrutement du LFILM : créneaux proposés, invitations et suivi des rendez-vous." },
      { property: "og:title", content: "Entretiens — LFILM Smart School" },
      { property: "og:description", content: "Assistant de planification des entretiens de recrutement." },
    ],
  }),
  component: PageEntretiens,
});

const CRENEAUX = ["Lundi 21/09 — 09:00", "Lundi 21/09 — 14:00", "Mardi 22/09 — 10:30", "Mercredi 23/09 — 15:00", "Jeudi 24/09 — 11:00"];

function PageEntretiens() {
  const { entretiens, candidats, majEntretien, supprimerEntretien, ajouterEntretien } = useAppStore();
  const [edition, setEdition] = useState<Entretien | null>(null);
  const [creneaux, setCreneaux] = useState<Entretien | null>(null);
  const [creation, setCreation] = useState(false);

  const nomCandidat = (id: string) => {
    const c = candidats.find((x) => x.id === id);
    return c ? `${c.prenom} ${c.nom}` : "Candidat";
  };

  const colonnes: Column<Entretien>[] = [
    {
      key: "candidat",
      header: "Candidat",
      sortValue: (e) => nomCandidat(e.candidatId),
      render: (e) => <AvatarPersonne nom={nomCandidat(e.candidatId)} sousTitre={e.mode} />,
    },
    { key: "poste", header: "Poste", sortValue: (e) => e.poste, render: (e) => e.poste },
    { key: "recruteur", header: "Recruteur", sortValue: (e) => e.recruteur, render: (e) => <span className="text-muted-foreground">{e.recruteur}</span> },
    { key: "date", header: "Date", sortValue: (e) => e.date, render: (e) => formatDate(e.date) },
    { key: "heure", header: "Heure", sortValue: (e) => e.heure, render: (e) => e.heure },
    { key: "statut", header: "Statut", sortValue: (e) => e.statut, render: (e) => <StatusBadge value={e.statut} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (e) => (
        <div className="flex flex-wrap justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => setCreneaux(e)}>
            Créneaux
          </Button>
          <Button size="icon" variant="ghost" aria-label="Modifier" onClick={() => setEdition(e)}>
            <Pencil className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Envoyer l'invitation"
            onClick={() => toast.success("Invitation envoyée", { description: `${nomCandidat(e.candidatId)} — ${formatDate(e.date)} à ${e.heure}.` })}
          >
            <Mail className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Annuler l'entretien"
            onClick={() => {
              supprimerEntretien(e.id);
              toast.success("Entretien annulé", { description: `${nomCandidat(e.candidatId)} a été notifié.` });
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
        badge="Recrutement"
        titre="Interview & Meeting Assistant"
        description="Organisation des entretiens de recrutement : proposition de créneaux, planification, invitations et suivi des rendez-vous."
        actions={
          <Button onClick={() => setCreation(true)}>
            <CalendarPlus className="size-4" />
            Planifier un entretien
          </Button>
        }
      />

      <Tabs defaultValue="liste">
        <TabsList>
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
        </TabsList>
        <TabsContent value="liste" className="mt-4">
          <DataTable
            data={entretiens}
            columns={colonnes}
            rowKey={(e) => e.id}
            placeholderRecherche="Candidat, poste, recruteur…"
            recherche={(e, t) => `${nomCandidat(e.candidatId)} ${e.poste} ${e.recruteur}`.toLowerCase().includes(t)}
          />
        </TabsContent>
        <TabsContent value="calendrier" className="mt-4">
          <CalendrierMois
            evenements={entretiens.map((e) => ({
              id: e.id,
              date: e.date,
              libelle: `${e.heure} — ${nomCandidat(e.candidatId)}`,
              ton: "orange" as const,
            }))}
            onSelectionner={(ev) => toast.info("Entretien", { description: ev.libelle })}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!creneaux} onOpenChange={(o) => !o && setCreneaux(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Proposer des créneaux</DialogTitle>
            <DialogDescription>
              L'assistant propose les créneaux disponibles du recruteur {creneaux?.recruteur}.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2">
            {CRENEAUX.map((c) => (
              <li key={c} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/60 p-3 text-sm">
                {c}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success("Créneau proposé", { description: `${c} envoyé à ${creneaux ? nomCandidat(creneaux.candidatId) : ""}.` });
                    setCreneaux(null);
                  }}
                >
                  Proposer
                </Button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <Dialog open={!!edition} onOpenChange={(o) => !o && setEdition(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'entretien</DialogTitle>
            <DialogDescription>{edition && nomCandidat(edition.candidatId)}</DialogDescription>
          </DialogHeader>
          {edition && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Date</Label>
                <Input type="date" value={edition.date} onChange={(e) => setEdition({ ...edition, date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Heure</Label>
                <Input type="time" value={edition.heure} onChange={(e) => setEdition({ ...edition, heure: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Mode</Label>
                <Select value={edition.mode} onValueChange={(v) => setEdition({ ...edition, mode: v as Entretien["mode"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Présentiel", "Visioconférence", "Téléphone"].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdition(null)}>Annuler</Button>
            <Button
              onClick={() => {
                if (edition) {
                  majEntretien(edition.id, edition);
                  toast.success("Entretien modifié", { description: `${formatDate(edition.date)} à ${edition.heure}.` });
                }
                setEdition(null);
              }}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={creation} onOpenChange={setCreation}>
        <DialogContent className="sm:max-w-lg">
          <NouvelEntretien
            candidats={candidats.map((c) => ({ id: c.id, nom: `${c.prenom} ${c.nom}`, poste: c.poste }))}
            onClose={() => setCreation(false)}
            onCreer={(e) => {
              ajouterEntretien(e);
              toast.success("Entretien planifié", { description: `${formatDate(e.date)} à ${e.heure}.` });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NouvelEntretien({
  candidats,
  onClose,
  onCreer,
}: {
  candidats: { id: string; nom: string; poste: string }[];
  onClose: () => void;
  onCreer: (e: Omit<Entretien, "id">) => void;
}) {
  const [candidatId, setCandidatId] = useState("");
  const [date, setDate] = useState("2026-09-24");
  const [heure, setHeure] = useState("10:00");
  const [recruteur, setRecruteur] = useState("Nadia Berrada");
  const [mode, setMode] = useState<Entretien["mode"]>("Présentiel");
  const [erreur, setErreur] = useState("");

  return (
    <>
      <DialogHeader>
        <DialogTitle>Planifier un entretien</DialogTitle>
        <DialogDescription>Le candidat recevra une invitation automatique avec le lien ou le lieu du rendez-vous.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Candidat *</Label>
          <Select value={candidatId} onValueChange={setCandidatId}>
            <SelectTrigger><SelectValue placeholder="Choisir un candidat" /></SelectTrigger>
            <SelectContent>
              {candidats.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {erreur && <p className="text-xs text-brick">{erreur}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Date *</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Heure *</Label>
          <Input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Recruteur</Label>
          <Input value={recruteur} onChange={(e) => setRecruteur(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Mode</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as Entretien["mode"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Présentiel", "Visioconférence", "Téléphone"].map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button
          onClick={() => {
            if (!candidatId) {
              setErreur("Sélectionnez un candidat.");
              toast.error("Formulaire incomplet", { description: "Le candidat est obligatoire." });
              return;
            }
            const poste = candidats.find((c) => c.id === candidatId)?.poste ?? "";
            onCreer({ candidatId, poste, recruteur, date, heure, mode, statut: "Planifié" });
            onClose();
          }}
        >
          Planifier
        </Button>
      </DialogFooter>
    </>
  );
}
