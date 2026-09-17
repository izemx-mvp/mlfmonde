import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, CalendarDays, FileText, Mail, MapPin, Phone, Pencil } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Timeline } from "@/components/shared/timeline";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/app-store";
import { formatDate, formatDateLongue } from "@/data/mock";
import { FormulaireCollaborateur } from "@/components/rh/formulaire-collaborateur";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";

export const Route = createFileRoute("/rh/collaborateurs/$id")({
  head: () => ({
    meta: [
      { title: "Fiche collaborateur — LFILM Smart School" },
      { name: "description", content: "Dossier RH complet d'un collaborateur du LFILM : poste, contrat, absences, événements et documents." },
      { property: "og:title", content: "Fiche collaborateur — LFILM Smart School" },
      { property: "og:description", content: "Dossier RH détaillé d'un collaborateur du lycée Louis-Massignon." },
    ],
  }),
  component: FicheCollaborateur,
});

function FicheCollaborateur() {
  const { id } = useParams({ from: "/rh/collaborateurs/$id" });
  const { collaborateurs, absences, evenements, documents } = useAppStore();
  const [edition, setEdition] = useState(false);

  const c = collaborateurs.find((x) => x.id === id);

  if (!c) {
    return (
      <div className="space-y-6">
        <PageHeader titre="Collaborateur introuvable" description="Ce dossier n'existe pas ou a été supprimé." />
        <EmptyState
          titre="Dossier indisponible"
          description="Revenez à la liste des collaborateurs pour sélectionner un autre dossier."
          action={
            <Button asChild>
              <Link to="/rh/collaborateurs">Retour à la liste</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const sesAbsences = absences.filter((a) => a.collaborateurId === c.id);
  const sesEvenements = evenements.filter((e) => e.collaborateurId === c.id);
  const sesDocuments = documents.filter((d) => d.collaborateurId === c.id);
  const anciennete = 2026 - Number(c.dateArrivee.slice(0, 4));

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1 text-petrol">
        <Link to="/rh/collaborateurs">
          <ArrowLeft className="size-4" />
          Tous les collaborateurs
        </Link>
      </Button>

      <PageHeader
        badge={c.matricule}
        titre={`${c.prenom} ${c.nom}`}
        description={`${c.fonction} · ${c.service} · ${c.site}`}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Document demandé", { description: "Attestation de travail mise en file de génération." })}>
              <FileText className="size-4" />
              Générer une attestation
            </Button>
            <Button onClick={() => setEdition(true)}>
              <Pencil className="size-4" />
              Modifier la fiche
            </Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <span className="grid size-20 place-items-center rounded-full bg-petrol/12 font-display text-2xl font-bold text-petrol">
              {c.prenom.charAt(0)}
              {c.nom.charAt(0)}
            </span>
            <p className="mt-3 font-display text-lg font-semibold text-navy">
              {c.prenom} {c.nom}
            </p>
            <p className="text-sm text-muted-foreground">{c.fonction}</p>
            <div className="mt-3">
              <StatusBadge value={c.statut} />
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <Ligne icone={Mail} libelle="Email" valeur={c.email} />
            <Ligne icone={Phone} libelle="Téléphone" valeur={c.telephone} />
            <Ligne icone={MapPin} libelle="Adresse" valeur={c.adresse} />
            <Ligne icone={Briefcase} libelle="Responsable" valeur={c.responsable} />
            <Ligne icone={CalendarDays} libelle="Arrivée" valeur={formatDateLongue(c.dateArrivee)} />
          </dl>
          <div className="mt-5 rounded-lg bg-surface p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Solde de congés</span>
              <span className="font-semibold text-navy">{c.soldeConges} / 26 jours</span>
            </div>
            <Progress value={(c.soldeConges / 26) * 100} className="mt-2 h-2" />
          </div>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="poste">
            <TabsList className="flex-wrap">
              <TabsTrigger value="poste">Poste & contrat</TabsTrigger>
              <TabsTrigger value="absences">Absences ({sesAbsences.length})</TabsTrigger>
              <TabsTrigger value="evenements">Événements RH ({sesEvenements.length})</TabsTrigger>
              <TabsTrigger value="documents">Documents ({sesDocuments.length})</TabsTrigger>
              <TabsTrigger value="historique">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="poste" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Carte titre="Informations personnelles">
                  <Info libelle="Date de naissance" valeur={formatDate(c.dateNaissance)} />
                  <Info libelle="Adresse" valeur={c.adresse} />
                  <Info libelle="Téléphone" valeur={c.telephone} />
                  <Info libelle="Email" valeur={c.email} />
                </Carte>
                <Carte titre="Poste">
                  <Info libelle="Fonction" valeur={c.fonction} />
                  <Info libelle="Service" valeur={c.service} />
                  <Info libelle="Site" valeur={c.site} />
                  <Info libelle="Responsable" valeur={c.responsable} />
                </Carte>
                <Carte titre="Contrat">
                  <Info libelle="Type de contrat" valeur={c.contrat} />
                  <Info libelle="Date d'arrivée" valeur={formatDate(c.dateArrivee)} />
                  <Info libelle="Ancienneté" valeur={`${anciennete} an${anciennete > 1 ? "s" : ""}`} />
                  <Info libelle="Matricule" valeur={c.matricule} />
                </Carte>
                <Carte titre="Congés">
                  <Info libelle="Solde disponible" valeur={`${c.soldeConges} jours`} />
                  <Info libelle="Demandes en attente" valeur={String(sesAbsences.filter((a) => a.statut === "En attente").length)} />
                  <Info libelle="Jours pris cette année" valeur={String(sesAbsences.filter((a) => a.statut === "Approuvé").reduce((s, a) => s + a.duree, 0))} />
                </Carte>
              </div>
            </TabsContent>

            <TabsContent value="absences" className="mt-4">
              <Carte titre="Absences & congés du collaborateur">
                {sesAbsences.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune absence enregistrée sur la période.</p>
                ) : (
                  <ul className="space-y-2">
                    {sesAbsences.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface/60 p-3">
                        <div>
                          <p className="text-sm font-medium">{a.type}</p>
                          <p className="text-xs text-muted-foreground">
                            Du {formatDate(a.dateDebut)} au {formatDate(a.dateFin)} · {a.duree} j · source {a.source}
                          </p>
                        </div>
                        <StatusBadge value={a.statut} />
                      </li>
                    ))}
                  </ul>
                )}
              </Carte>
            </TabsContent>

            <TabsContent value="evenements" className="mt-4">
              <Carte titre="Événements RH & suivi médical">
                {sesEvenements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun événement planifié pour ce collaborateur.</p>
                ) : (
                  <ul className="space-y-2">
                    {sesEvenements.map((e) => (
                      <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface/60 p-3">
                        <div>
                          <p className="text-sm font-medium">{e.intitule}</p>
                          <p className="text-xs text-muted-foreground">
                            {e.type} · {formatDate(e.date)} · {e.responsable}
                          </p>
                        </div>
                        <StatusBadge value={e.statut} />
                      </li>
                    ))}
                  </ul>
                )}
              </Carte>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Carte titre="Documents RH">
                {sesDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun document généré pour ce collaborateur.</p>
                ) : (
                  <ul className="space-y-2">
                    {sesDocuments.map((d) => (
                      <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface/60 p-3">
                        <div>
                          <p className="text-sm font-medium">{d.type}</p>
                          <p className="text-xs text-muted-foreground">
                            Émis le {formatDate(d.date)}
                            {d.echeance ? ` · échéance ${formatDate(d.echeance)}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge value={d.statut} />
                          <Button size="sm" variant="outline" onClick={() => toast.success("Téléchargement simulé", { description: d.nom })}>
                            Télécharger
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Carte>
            </TabsContent>

            <TabsContent value="historique" className="mt-4">
              <Carte titre="Historique du dossier">
                <Timeline
                  items={[
                    { date: c.dateArrivee, titre: "Arrivée au lycée", description: `${c.fonction} — ${c.service}` },
                    { date: "2024-09-02", titre: "Entretien annuel réalisé", description: "Évaluation satisfaisante, objectifs pédagogiques atteints." },
                    { date: "2025-01-15", titre: "Formation suivie", description: "Numérique éducatif — 14 heures." },
                    { date: "2025-11-08", titre: "Visite médicale", description: "Aptitude confirmée par la médecine du travail." },
                    { date: "2026-09-01", titre: "Rentrée scolaire 2026-2027", description: "Affectation reconduite sur le même service." },
                  ]}
                />
              </Carte>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <FormulaireCollaborateur ouvert={edition} collaborateur={c} onClose={() => setEdition(false)} />
    </div>
  );
}

function Carte({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-3 font-display text-sm font-semibold tracking-wide text-navy uppercase">{titre}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Info({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-muted-foreground">{libelle}</span>
      <span className="text-right text-sm font-medium text-foreground">{valeur}</span>
    </div>
  );
}

function Ligne({ icone: Icone, libelle, valeur }: { icone: React.ElementType; libelle: string; valeur: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icone className="mt-0.5 size-4 shrink-0 text-petrol" />
      <div className="min-w-0">
        <dt className="text-[11px] text-muted-foreground uppercase">{libelle}</dt>
        <dd className="truncate text-sm text-foreground">{valeur}</dd>
      </div>
    </div>
  );
}
