import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, FileText, Sparkles, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/store/app-store";
import { formatDate, formatDateLongue, nomComplet } from "@/data/mock";
import type { DocumentRH } from "@/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "AI HR Document Generator — LFILM Smart School" },
      { name: "description", content: "Génération automatisée des documents RH du LFILM : contrats, attestations, convocations et courriers administratifs." },
      { property: "og:title", content: "AI HR Document Generator — LFILM" },
      { property: "og:description", content: "Génération et suivi des documents RH du lycée Louis-Massignon." },
    ],
  }),
  component: PageDocuments,
});

const TYPES: DocumentRH["type"][] = [
  "Contrat",
  "Attestation de travail",
  "Attestation de salaire",
  "Convocation",
  "Courrier RH",
  "Certificat",
  "Lettre administrative",
];

const ETAPES = ["Document", "Collaborateur", "Informations", "Génération"];

function PageDocuments() {
  const { documents, collaborateurs, ajouterDocument, supprimerDocument } = useAppStore();
  const [etape, setEtape] = useState(0);
  const [type, setType] = useState<DocumentRH["type"]>("Attestation de travail");
  const [collaborateurId, setCollaborateurId] = useState("");
  const [complement, setComplement] = useState("");
  const [genere, setGenere] = useState(false);
  const [apercu, setApercu] = useState(false);

  const collaborateur = collaborateurs.find((c) => c.id === collaborateurId);

  const corpsDocument = collaborateur
    ? `LYCÉE FRANÇAIS INTERNATIONAL LOUIS-MASSIGNON
Bouskoura – Ville Verte, Maroc · Réseau mlfmonde / OSUI

${type.toUpperCase()}

Je soussignée, Nadia Berrada, Responsable des Ressources Humaines du Lycée Français International Louis-Massignon, certifie que :

Madame / Monsieur ${collaborateur.prenom} ${collaborateur.nom}, matricule ${collaborateur.matricule},
né(e) le ${formatDate(collaborateur.dateNaissance)}, demeurant à ${collaborateur.adresse},

est employé(e) au sein de notre établissement depuis le ${formatDateLongue(collaborateur.dateArrivee)},
en qualité de ${collaborateur.fonction}, au sein du service ${collaborateur.service},
dans le cadre d'un contrat de type ${collaborateur.contrat}.

${complement || "La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit."}

Fait à Bouskoura, le ${formatDateLongue("2026-09-17")}

La Responsable des Ressources Humaines
Nadia Berrada`
    : "";

  const colonnes: Column<DocumentRH>[] = [
    { key: "nom", header: "Document", sortValue: (d) => d.nom, render: (d) => <span className="font-medium">{d.nom}</span> },
    { key: "type", header: "Type", sortValue: (d) => d.type, render: (d) => d.type },
    { key: "collaborateur", header: "Collaborateur", sortValue: (d) => nomComplet(d.collaborateurId), render: (d) => nomComplet(d.collaborateurId) },
    { key: "date", header: "Date", sortValue: (d) => d.date, render: (d) => formatDate(d.date) },
    { key: "echeance", header: "Échéance", sortValue: (d) => d.echeance ?? "", render: (d) => (d.echeance ? formatDate(d.echeance) : "—") },
    { key: "statut", header: "Statut", sortValue: (d) => d.statut, render: (d) => <StatusBadge value={d.statut} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (d) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => toast.success("Téléchargement simulé", { description: d.nom })}>
            <Download className="size-4" />
            Télécharger
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Supprimer"
            onClick={() => {
              supprimerDocument(d.id);
              toast.success("Document supprimé");
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
        badge="Documents RH"
        titre="AI HR Document Generator"
        description="Génération assistée des documents administratifs du lycée. Les informations du collaborateur sont préremplies automatiquement depuis son dossier RH."
      />

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <ol className="mb-6 flex flex-wrap gap-2">
          {ETAPES.map((e, i) => (
            <li
              key={e}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                i === etape
                  ? "border-petrol bg-petrol text-petrol-foreground"
                  : i < etape
                    ? "border-leaf/50 bg-leaf/12 text-leaf"
                    : "border-border bg-surface text-muted-foreground",
              )}
            >
              <span className="grid size-4 place-items-center rounded-full bg-background/25 text-[10px]">{i + 1}</span>
              {e}
            </li>
          ))}
        </ol>

        {etape === 0 && (
          <div>
            <p className="mb-3 text-sm text-muted-foreground">Sélectionnez le type de document à produire.</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors",
                    type === t ? "border-petrol bg-sky/12 text-petrol" : "border-border bg-surface/50 hover:border-petrol/40",
                  )}
                >
                  <FileText className="size-4 shrink-0" />
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {etape === 1 && (
          <div className="max-w-md space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Collaborateur concerné *</Label>
            <Select value={collaborateurId} onValueChange={setCollaborateurId}>
              <SelectTrigger><SelectValue placeholder="Rechercher un collaborateur" /></SelectTrigger>
              <SelectContent>
                {collaborateurs.slice(0, 80).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.prenom} {c.nom} — {c.matricule}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {etape === 2 && (
          <div className="space-y-4">
            {collaborateur ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <Info libelle="Nom complet" valeur={`${collaborateur.prenom} ${collaborateur.nom}`} />
                <Info libelle="Matricule" valeur={collaborateur.matricule} />
                <Info libelle="Fonction" valeur={collaborateur.fonction} />
                <Info libelle="Service" valeur={collaborateur.service} />
                <Info libelle="Contrat" valeur={collaborateur.contrat} />
                <Info libelle="Date d'arrivée" valeur={formatDate(collaborateur.dateArrivee)} />
              </div>
            ) : (
              <p className="text-sm text-brick">Revenez à l'étape précédente pour sélectionner un collaborateur.</p>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Mention complémentaire (facultatif)</Label>
              <Textarea
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Ex. : Cette attestation est délivrée en vue d'une demande de crédit bancaire."
              />
            </div>
          </div>
        )}

        {etape === 3 && (
          <div className="space-y-3">
            {genere ? (
              <div className="rounded-lg border border-leaf/45 bg-leaf/10 p-4 text-sm">
                <p className="flex items-center gap-2 font-medium text-leaf">
                  <Check className="size-4" /> Document généré avec succès
                </p>
                <p className="mt-1 text-muted-foreground">
                  {type} — {collaborateur ? `${collaborateur.prenom} ${collaborateur.nom}` : ""}. Vous pouvez le prévisualiser puis le télécharger.
                </p>
              </div>
            ) : (
              <p className="rounded-lg border border-sky/45 bg-sky/10 p-4 text-sm">
                <Sparkles className="mr-2 inline size-4 text-petrol" />
                Tout est prêt : l'IA va assembler le document à partir du modèle institutionnel du lycée et des données du dossier RH.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  if (!collaborateur) {
                    toast.error("Collaborateur manquant", { description: "Sélectionnez un collaborateur à l'étape 2." });
                    return;
                  }
                  setGenere(true);
                  ajouterDocument({
                    nom: `${type} – ${collaborateur.prenom} ${collaborateur.nom}`,
                    type,
                    collaborateurId: collaborateur.id,
                    date: "2026-09-17",
                    statut: "Généré",
                  });
                  toast.success("Document généré", { description: `${type} ajouté aux documents récents.` });
                }}
              >
                <Sparkles className="size-4" />
                Générer le document
              </Button>
              <Button variant="outline" disabled={!genere} onClick={() => setApercu(true)}>
                Prévisualiser
              </Button>
              <Button
                variant="outline"
                disabled={!genere}
                onClick={() => toast.success("Téléchargement simulé", { description: "Le PDF serait téléchargé dans la version finale." })}
              >
                <Download className="size-4" />
                Télécharger
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between border-t border-border pt-4">
          <Button variant="outline" disabled={etape === 0} onClick={() => setEtape((e) => e - 1)}>
            Précédent
          </Button>
          <Button
            disabled={etape === 3}
            onClick={() => {
              if (etape === 1 && !collaborateurId) {
                toast.error("Sélection requise", { description: "Choisissez un collaborateur pour continuer." });
                return;
              }
              setEtape((e) => e + 1);
            }}
          >
            Étape suivante
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy">Documents récents</h2>
        <DataTable
          data={documents}
          columns={colonnes}
          rowKey={(d) => d.id}
          placeholderRecherche="Document, type, collaborateur…"
          recherche={(d, t) => `${d.nom} ${d.type} ${nomComplet(d.collaborateurId)}`.toLowerCase().includes(t)}
        />
      </section>

      <Dialog open={apercu} onOpenChange={setApercu}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prévisualisation du document</DialogTitle>
            <DialogDescription>Aperçu simulé du document généré au format institutionnel du lycée.</DialogDescription>
          </DialogHeader>
          <div className="h-1 lfilm-stripe" />
          <pre className="rounded-lg border border-border bg-surface/60 p-5 font-sans text-xs leading-relaxed whitespace-pre-wrap">
            {corpsDocument}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApercu(false)}>Fermer</Button>
            <Button onClick={() => toast.success("Téléchargement simulé", { description: `${type} enregistré.` })}>
              <Download className="size-4" />
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/60 p-2.5">
      <p className="text-[11px] text-muted-foreground uppercase">{libelle}</p>
      <p className="text-sm font-medium">{valeur}</p>
    </div>
  );
}
