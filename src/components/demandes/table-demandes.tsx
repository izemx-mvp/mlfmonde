import { useState } from "react";
import { Eye, Sparkles, UserPlus } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/data/mock";
import type { Demande } from "@/data/types";
import { toast } from "sonner";

const STATUTS: Demande["statut"][] = ["Nouveau", "En cours", "En attente", "Résolu", "Fermé"];
const RESPONSABLES = [
  "Nadia Berrada",
  "Karim El Fassi",
  "Sofia Bennani",
  "Youssef Amrani",
  "Leila Chraibi",
  "Mehdi Tazi",
];

export function TableDemandes({
  demandes,
  categories,
  titreVide,
}: {
  demandes: Demande[];
  categories: string[];
  titreVide?: string;
}) {
  const { majDemande, ajouterNoteDemande, ajouterNotification } = useAppStore();
  const [detail, setDetail] = useState<Demande | null>(null);
  const [assignation, setAssignation] = useState<Demande | null>(null);
  const [responsable, setResponsable] = useState(RESPONSABLES[0]!);
  const [note, setNote] = useState("");
  const [fStatut, setFStatut] = useState("Tous");
  const [fCategorie, setFCategorie] = useState("Toutes");
  const [fPriorite, setFPriorite] = useState("Toutes");

  const courante = detail ? (demandes.find((d) => d.id === detail.id) ?? detail) : null;

  const filtrees = demandes.filter(
    (d) =>
      (fStatut === "Tous" || d.statut === fStatut) &&
      (fCategorie === "Toutes" || d.categorie === fCategorie) &&
      (fPriorite === "Toutes" || d.priorite === fPriorite),
  );

  const colonnes: Column<Demande>[] = [
    { key: "id", header: "ID", sortValue: (d) => d.id, render: (d) => <span className="font-mono text-xs">{d.id}</span> },
    { key: "demandeur", header: "Demandeur", sortValue: (d) => d.demandeur, render: (d) => <span className="font-medium">{d.demandeur}</span> },
    { key: "sujet", header: "Sujet", sortValue: (d) => d.sujet, render: (d) => <span className="block max-w-[260px] truncate">{d.sujet}</span> },
    { key: "categorie", header: "Catégorie", sortValue: (d) => d.categorie, render: (d) => <StatusBadge value={d.categorie} ton="info" /> },
    { key: "canal", header: "Canal", sortValue: (d) => d.canal, render: (d) => d.canal },
    { key: "priorite", header: "Priorité", sortValue: (d) => d.priorite, render: (d) => <StatusBadge value={d.priorite} /> },
    { key: "responsable", header: "Responsable", sortValue: (d) => d.responsable, render: (d) => d.responsable },
    { key: "date", header: "Date", sortValue: (d) => d.date, render: (d) => formatDate(d.date) },
    { key: "statut", header: "Statut", sortValue: (d) => d.statut, render: (d) => <StatusBadge value={d.statut} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (d) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => setDetail(d)}>
            <Eye className="size-4" />
            Voir
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setAssignation(d);
              setResponsable(d.responsable);
            }}
          >
            <UserPlus className="size-4" />
            Assigner
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={filtrees}
        columns={colonnes}
        rowKey={(d) => d.id}
        onRowClick={(d) => setDetail(d)}
        placeholderRecherche="ID, demandeur, sujet, service…"
        emptyTitre={titreVide}
        recherche={(d, t) => `${d.id} ${d.demandeur} ${d.sujet} ${d.service} ${d.categorie}`.toLowerCase().includes(t)}
        filtres={
          <>
            <Select value={fStatut} onValueChange={setFStatut}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                {STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={fCategorie} onValueChange={setFCategorie}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Toutes">Toutes catégories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={fPriorite} onValueChange={setFPriorite}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Toutes">Toutes priorités</SelectItem>
                {["Urgente", "Haute", "Normale", "Basse"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </>
        }
      />

      <Dialog open={!!courante} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {courante && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {courante.id} — {courante.sujet}
                </DialogTitle>
                <DialogDescription>
                  {courante.demandeur} · reçu via {courante.canal} le {formatDate(courante.date)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 sm:grid-cols-4">
                <Bloc libelle="Catégorie" valeur={courante.categorie} />
                <Bloc libelle="Service" valeur={courante.service} />
                <Bloc libelle="Priorité" valeur={courante.priorite} />
                <Bloc libelle="Responsable" valeur={courante.responsable} />
              </div>

              <div className="rounded-lg border border-border bg-surface/60 p-3 text-sm leading-relaxed">
                {courante.message}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <section>
                  <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Historique</h3>
                  <ul className="space-y-2">
                    {courante.historique.map((h, i) => (
                      <li key={i} className="rounded-lg border border-border bg-surface/50 p-2.5 text-sm">
                        <p className="font-medium">{h.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(h.date)} · {h.auteur}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Notes internes</h3>
                  <ul className="space-y-2">
                    {courante.notes.length === 0 && (
                      <li className="rounded-lg border border-dashed border-border p-2.5 text-sm text-muted-foreground">
                        Aucune note interne pour le moment.
                      </li>
                    )}
                    {courante.notes.map((n, i) => (
                      <li key={i} className="rounded-lg border border-border bg-surface/50 p-2.5 text-sm">
                        <p>{n.texte}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {n.auteur} · {formatDate(n.date)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Ajouter une note</Label>
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note interne visible par l'équipe…" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (!note.trim()) {
                          toast.error("Note vide", { description: "Saisissez un texte avant d'enregistrer." });
                          return;
                        }
                        ajouterNoteDemande(courante.id, note.trim(), "Nadia Berrada");
                        setNote("");
                        toast.success("Note ajoutée");
                      }}
                    >
                      Enregistrer la note
                    </Button>
                  </div>
                </section>
              </div>

              <div className="rounded-lg border border-sky/40 bg-sky/8 p-3 text-sm">
                <p className="mb-1 flex items-center gap-2 font-semibold text-navy">
                  <Sparkles className="size-4 text-petrol" /> Recommandation IA
                </p>
                <p className="text-muted-foreground">
                  Demande classée automatiquement en « {courante.categorie} » et orientée vers {courante.service}.
                  {courante.priorite === "Urgente" || courante.priorite === "Haute"
                    ? " Traitement recommandé sous 24 heures."
                    : " Délai de traitement recommandé : 72 heures."}
                </p>
              </div>

              <DialogFooter className="flex-wrap gap-2">
                <Select
                  value={courante.statut}
                  onValueChange={(v) => {
                    majDemande(courante.id, { statut: v as Demande["statut"] });
                    toast.success("Statut mis à jour", { description: `${courante.id} → ${v}` });
                  }}
                >
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    ajouterNotification({
                      titre: "Relance envoyée",
                      description: `Relance sur la demande ${courante.id} (${courante.demandeur}).`,
                      date: "2026-09-17",
                      lien: "/demandes",
                      ton: "info",
                    });
                    toast.success("Notification envoyée au responsable");
                  }}
                >
                  Notifier le responsable
                </Button>
                <Button
                  onClick={() => {
                    majDemande(courante.id, { statut: "Résolu" });
                    toast.success("Demande résolue", { description: `${courante.id} clôturée.` });
                    setDetail(null);
                  }}
                >
                  Marquer résolu
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!assignation} onOpenChange={(o) => !o && setAssignation(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assigner la demande</DialogTitle>
            <DialogDescription>{assignation?.sujet}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Responsable *</Label>
            <Select value={responsable} onValueChange={setResponsable}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {RESPONSABLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignation(null)}>Annuler</Button>
            <Button
              onClick={() => {
                if (assignation) {
                  majDemande(assignation.id, { responsable, statut: "En cours" });
                  toast.success("Demande assignée", { description: `${assignation.id} confiée à ${responsable}.` });
                }
                setAssignation(null);
              }}
            >
              Confirmer l'assignation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Bloc({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/60 p-2.5">
      <p className="text-[11px] text-muted-foreground uppercase">{libelle}</p>
      <p className="text-sm font-medium">{valeur}</p>
    </div>
  );
}
