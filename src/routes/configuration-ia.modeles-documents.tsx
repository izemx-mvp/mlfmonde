import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, FileCog, Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type ModeleDocument = {
  id: string;
  nom: string;
  type: string;
  statut: "Actif" | "Brouillon" | "À vérifier";
  variables: string[];
  contenu: string;
};

const MODELES_INITIAUX: ModeleDocument[] = [
  {
    id: "modele-1",
    nom: "Attestation de travail standard",
    type: "Attestation de travail",
    statut: "Actif",
    variables: ["nom", "matricule", "fonction", "dateArrivee"],
    contenu: "Certifie que {{nom}} exerce la fonction de {{fonction}} au sein du LFILM depuis le {{dateArrivee}}.",
  },
  {
    id: "modele-2",
    nom: "Convocation entretien annuel",
    type: "Convocation",
    statut: "Actif",
    variables: ["nom", "dateEntretien", "responsable"],
    contenu: "{{nom}} est convié(e) à un entretien annuel avec {{responsable}} le {{dateEntretien}}.",
  },
  {
    id: "modele-3",
    nom: "Courrier renouvellement document",
    type: "Courrier RH",
    statut: "À vérifier",
    variables: ["nom", "document", "echeance"],
    contenu: "Merci de transmettre le document {{document}} avant le {{echeance}} afin de maintenir le dossier à jour.",
  },
];

export const Route = createFileRoute("/configuration-ia/modeles-documents")({
  head: () => ({
    meta: [
      { title: "Modèles de documents IA — LFILM Smart School" },
      { name: "description", content: "Gestion des modèles de documents utilisés par l’IA pour générer les documents RH LFILM." },
      { property: "og:title", content: "Modèles de documents IA — LFILM" },
      { property: "og:description", content: "Créer, éditer et valider les templates documentaires de la plateforme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PageModelesDocuments,
});

function PageModelesDocuments() {
  const [modeles, setModeles] = useState(MODELES_INITIAUX);
  const [selectionId, setSelectionId] = useState(MODELES_INITIAUX[0]?.id ?? "");
  const modele = useMemo(() => modeles.find((item) => item.id === selectionId), [modeles, selectionId]);

  function majModele(champs: Partial<ModeleDocument>) {
    if (!modele) return;
    const prochain = { ...modele, ...champs };
    setModeles((liste) => liste.map((item) => (item.id === modele.id ? prochain : item)));
  }

  function ajouterModele() {
    const nouveau: ModeleDocument = {
      id: `modele-${Date.now()}`,
      nom: "Nouveau modèle",
      type: "Lettre administrative",
      statut: "Brouillon",
      variables: ["nom", "date"],
      contenu: "Saisir ici le texte du modèle avec les variables {{nom}} et {{date}}.",
    };
    setModeles((liste) => [nouveau, ...liste]);
    setSelectionId(nouveau.id);
    toast.success("Modèle ajouté");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Configuration IA"
        titre="Modèles de documents"
        description="Gestion des templates institutionnels sur lesquels l’IA se base pour générer les documents RH."
        actions={
          <Button onClick={ajouterModele}>
            <Plus className="size-4" />
            Nouveau modèle
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
        <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="mb-3 font-display text-base font-semibold text-navy">Bibliothèque</h2>
          <div className="space-y-2">
            {modeles.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectionId(item.id)}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-lg border border-border bg-surface/50 p-3 text-left transition-colors hover:border-petrol/40"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">{item.nom}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{item.type}</span>
                </span>
                <StatusBadge value={item.statut} />
              </button>
            ))}
          </div>
        </div>

        {modele && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Édition du modèle</p>
                <h2 className="mt-1 truncate font-display text-xl font-bold text-navy">{modele.nom}</h2>
              </div>
              <FileCog className="size-6 shrink-0 text-petrol" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Champ libelle="Nom du modèle">
                <Input value={modele.nom} onChange={(event) => majModele({ nom: event.target.value })} />
              </Champ>
              <Champ libelle="Type de document">
                <Select value={modele.type} onValueChange={(type) => majModele({ type })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Contrat", "Attestation de travail", "Convocation", "Courrier RH", "Lettre administrative"].map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Champ>
              <Champ libelle="Statut">
                <Select value={modele.statut} onValueChange={(statut) => majModele({ statut: statut as ModeleDocument["statut"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Actif", "Brouillon", "À vérifier"].map((statut) => <SelectItem key={statut} value={statut}>{statut}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Champ>
              <Champ libelle="Variables utilisées">
                <Input value={modele.variables.join(", ")} onChange={(event) => majModele({ variables: event.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} />
              </Champ>
              <div className="sm:col-span-2">
                <Champ libelle="Contenu du modèle">
                  <Textarea value={modele.contenu} onChange={(event) => majModele({ contenu: event.target.value })} className="min-h-40 font-mono text-sm" />
                </Champ>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => toast.success("Aperçu généré", { description: modele.nom })}>
                <Copy className="size-4" />
                Tester avec un exemple
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setModeles((liste) => liste.filter((item) => item.id !== modele.id))}>
                  <Trash2 className="size-4" />
                  Supprimer
                </Button>
                <Button onClick={() => toast.success("Modèle enregistré", { description: modele.nom })}>
                  <Save className="size-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Champ({ libelle, children }: { libelle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase">{libelle}</Label>
      {children}
    </div>
  );
}
