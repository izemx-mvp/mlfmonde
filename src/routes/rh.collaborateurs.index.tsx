import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarPersonne } from "@/components/shared/avatar-personne";
import { FiltreSelect, TOUS } from "@/components/shared/filtre-select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useAppStore } from "@/store/app-store";
import { SERVICES, formatDate } from "@/data/mock";
import type { Collaborateur } from "@/data/types";
import { FormulaireCollaborateur } from "@/components/rh/formulaire-collaborateur";
import { toast } from "sonner";

export const Route = createFileRoute("/rh/collaborateurs/")({
  head: () => ({
    meta: [
      { title: "Collaborateurs — LFILM Smart School" },
      { name: "description", content: "Gestion des 349 collaborateurs du Lycée Louis-Massignon : dossiers, contrats, services et statuts." },
      { property: "og:title", content: "Collaborateurs — LFILM Smart School" },
      { property: "og:description", content: "Annuaire et dossiers RH des collaborateurs du LFILM." },
    ],
  }),
  component: PageCollaborateurs,
});

const CONTRATS = ["CDI", "CDD", "Détachement", "Vacataire", "Stage"];
const STATUTS = ["Actif", "En congé", "Inactif"];

function PageCollaborateurs() {
  const navigate = useNavigate();
  const { collaborateurs, supprimerCollaborateur } = useAppStore();
  const [service, setService] = useState(TOUS);
  const [contrat, setContrat] = useState(TOUS);
  const [statut, setStatut] = useState(TOUS);
  const [formulaire, setFormulaire] = useState<{ ouvert: boolean; collaborateur?: Collaborateur }>({ ouvert: false });
  const [aSupprimer, setASupprimer] = useState<Collaborateur | null>(null);

  const donnees = collaborateurs.filter(
    (c) =>
      (service === TOUS || c.service === service) &&
      (contrat === TOUS || c.contrat === contrat) &&
      (statut === TOUS || c.statut === statut),
  );

  const colonnes: Column<Collaborateur>[] = [
    {
      key: "nom",
      header: "Collaborateur",
      sortValue: (c) => `${c.nom} ${c.prenom}`,
      render: (c) => <AvatarPersonne nom={`${c.prenom} ${c.nom}`} sousTitre={c.email} />,
    },
    { key: "matricule", header: "Matricule", sortValue: (c) => c.matricule, render: (c) => <span className="font-mono text-xs">{c.matricule}</span> },
    { key: "service", header: "Service", sortValue: (c) => c.service, render: (c) => c.service },
    { key: "fonction", header: "Fonction", sortValue: (c) => c.fonction, render: (c) => <span className="text-muted-foreground">{c.fonction}</span> },
    { key: "contrat", header: "Contrat", sortValue: (c) => c.contrat, render: (c) => <StatusBadge value={c.contrat} ton={c.contrat === "CDI" ? "info" : "neutre"} /> },
    { key: "arrivee", header: "Arrivée", sortValue: (c) => c.dateArrivee, render: (c) => formatDate(c.dateArrivee) },
    { key: "statut", header: "Statut", sortValue: (c) => c.statut, render: (c) => <StatusBadge value={c.statut} /> },
    { key: "responsable", header: "Responsable", sortValue: (c) => c.responsable, render: (c) => <span className="text-muted-foreground">{c.responsable}</span> },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (c) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions pour ${c.prenom} ${c.nom}`}>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => navigate({ to: "/rh/collaborateurs/$id", params: { id: c.id } })}>
                <Eye className="size-4" />
                Consulter la fiche
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFormulaire({ ouvert: true, collaborateur: c })}>
                <Pencil className="size-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => setASupprimer(c)}>
                <Trash2 className="size-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Ressources humaines"
        titre="Collaborateurs"
        description={`${collaborateurs.length} collaborateurs répartis sur 12 services, de la petite section à la terminale.`}
        actions={
          <Button onClick={() => setFormulaire({ ouvert: true })}>
            <Plus className="size-4" />
            Ajouter un collaborateur
          </Button>
        }
      />

      <DataTable
        data={donnees}
        columns={colonnes}
        rowKey={(c) => c.id}
        parPage={12}
        onRowClick={(c) => navigate({ to: "/rh/collaborateurs/$id", params: { id: c.id } })}
        placeholderRecherche="Nom, matricule, fonction, service…"
        recherche={(c, t) => `${c.prenom} ${c.nom} ${c.matricule} ${c.service} ${c.fonction} ${c.email}`.toLowerCase().includes(t)}
        filtres={
          <>
            <FiltreSelect valeur={service} onChange={setService} options={SERVICES} libelle="Service" largeur="w-56" />
            <FiltreSelect valeur={contrat} onChange={setContrat} options={CONTRATS} libelle="Contrat" largeur="w-40" />
            <FiltreSelect valeur={statut} onChange={setStatut} options={STATUTS} libelle="Statut" largeur="w-40" />
          </>
        }
      />

      <FormulaireCollaborateur
        ouvert={formulaire.ouvert}
        collaborateur={formulaire.collaborateur}
        onClose={() => setFormulaire({ ouvert: false })}
      />

      <AlertDialog open={!!aSupprimer} onOpenChange={(o) => !o && setASupprimer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce collaborateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le dossier de {aSupprimer?.prenom} {aSupprimer?.nom} sera retiré de la liste. Cette action est irréversible dans la démonstration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (aSupprimer) {
                  supprimerCollaborateur(aSupprimer.id);
                  toast.success("Collaborateur supprimé", { description: `${aSupprimer.prenom} ${aSupprimer.nom} a été retiré de l'effectif.` });
                }
                setASupprimer(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
