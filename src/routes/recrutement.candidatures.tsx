import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarPersonne } from "@/components/shared/avatar-personne";
import { FiltreSelect, TOUS } from "@/components/shared/filtre-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/data/mock";
import type { Candidat } from "@/data/types";
import { toast } from "sonner";

export const Route = createFileRoute("/recrutement/candidatures")({
  head: () => ({
    meta: [
      { title: "Candidatures — LFILM Smart School" },
      { name: "description", content: "Suivi des candidatures reçues par le Lycée Louis-Massignon avec scoring IA et assignation des recruteurs." },
      { property: "og:title", content: "Candidatures — LFILM Smart School" },
      { property: "og:description", content: "Toutes les candidatures du lycée et leur score de correspondance IA." },
    ],
  }),
  component: PageCandidatures,
});

const ETAPES = ["Nouveau", "Préqualification", "Screening IA", "Entretien", "Entretien final", "Sélectionné", "Onboarding"];
const RESPONSABLES = ["Nadia Berrada", "Pierre Moreau", "Karim Lahlou", "Claire Dubois", "Youssef Tazi", "Salma Bennani"];

function PageCandidatures() {
  const { candidats, majCandidat } = useAppStore();
  const [etape, setEtape] = useState(TOUS);
  const [detail, setDetail] = useState<Candidat | null>(null);
  const [assignation, setAssignation] = useState<Candidat | null>(null);
  const [nouveauResponsable, setNouveauResponsable] = useState(RESPONSABLES[0]!);

  const donnees = candidats.filter((c) => etape === TOUS || c.etape === etape);

  const colonnes: Column<Candidat>[] = [
    {
      key: "candidat",
      header: "Candidat",
      sortValue: (c) => `${c.nom} ${c.prenom}`,
      render: (c) => <AvatarPersonne nom={`${c.prenom} ${c.nom}`} sousTitre={c.email} />,
    },
    { key: "poste", header: "Poste", sortValue: (c) => c.poste, render: (c) => c.poste },
    { key: "date", header: "Candidature", sortValue: (c) => c.dateCandidature, render: (c) => formatDate(c.dateCandidature) },
    { key: "experience", header: "Expérience", sortValue: (c) => c.experience, render: (c) => `${c.experience} ans` },
    {
      key: "score",
      header: "Score IA",
      sortValue: (c) => c.scoreIA,
      render: (c) => (
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
            <span
              className={c.scoreIA >= 85 ? "block h-full bg-leaf" : c.scoreIA >= 70 ? "block h-full bg-gold" : "block h-full bg-brick"}
              style={{ width: `${c.scoreIA}%` }}
            />
          </span>
          <span className="text-xs font-semibold">{c.scoreIA}%</span>
        </span>
      ),
    },
    { key: "etape", header: "Statut", sortValue: (c) => c.etape, render: (c) => <StatusBadge value={c.etape} /> },
    { key: "responsable", header: "Responsable", sortValue: (c) => c.responsable, render: (c) => <span className="text-muted-foreground">{c.responsable}</span> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => setDetail(c)}>
            Voir
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAssignation(c);
              setNouveauResponsable(c.responsable);
            }}
          >
            Assigner
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Recrutement"
        titre="Candidatures"
        description="Toutes les candidatures reçues via le site institutionnel, les emails et les réseaux professionnels, consolidées et scorées automatiquement."
        actions={
          <Button asChild variant="outline">
            <Link to="/recrutement/screening">Ouvrir le screening IA</Link>
          </Button>
        }
      />

      <DataTable
        data={donnees}
        columns={colonnes}
        rowKey={(c) => c.id}
        placeholderRecherche="Nom, poste, compétence…"
        recherche={(c, t) => `${c.prenom} ${c.nom} ${c.poste} ${c.competences.join(" ")}`.toLowerCase().includes(t)}
        filtres={<FiltreSelect valeur={etape} onChange={setEtape} options={ETAPES} libelle="Étape" largeur="w-48" />}
      />

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {detail?.prenom} {detail?.nom}
            </DialogTitle>
            <DialogDescription>{detail?.poste}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <Info libelle="Email" valeur={detail.email} />
                <Info libelle="Téléphone" valeur={detail.telephone} />
                <Info libelle="Expérience" valeur={`${detail.experience} ans`} />
                <Info libelle="Candidature" valeur={formatDate(detail.dateCandidature)} />
                <Info libelle="Responsable" valeur={detail.responsable} />
                <Info libelle="Prochaine action" valeur={detail.prochaineAction} />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-muted-foreground uppercase">Compétences</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.competences.map((c) => (
                    <span key={c} className="rounded-full bg-sky/18 px-2.5 py-0.5 text-xs text-petrol">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-sky/45 bg-sky/10 p-3">
                <p className="text-xs font-semibold text-petrol uppercase">Recommandation IA — score {detail.scoreIA} %</p>
                <p className="mt-1">{detail.recommandationIA}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetail(null)}>
              Fermer
            </Button>
            <Button asChild>
              <Link to="/recrutement/screening">Analyser le CV</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assignation} onOpenChange={(o) => !o && setAssignation(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assigner un responsable</DialogTitle>
            <DialogDescription>
              Candidature de {assignation?.prenom} {assignation?.nom}.
            </DialogDescription>
          </DialogHeader>
          <Select value={nouveauResponsable} onValueChange={setNouveauResponsable}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {RESPONSABLES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignation(null)}>Annuler</Button>
            <Button
              onClick={() => {
                if (assignation) {
                  majCandidat(assignation.id, { responsable: nouveauResponsable });
                  toast.success("Candidature assignée", { description: `${assignation.prenom} ${assignation.nom} → ${nouveauResponsable}.` });
                }
                setAssignation(null);
              }}
            >
              Assigner
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
