import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Save, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/administration/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres de la plateforme — LFILM Smart School" },
      { name: "description", content: "Configuration de la plateforme LFILM Smart School : établissement, canaux, automatisations IA et règles de notification." },
      { property: "og:title", content: "Paramètres — LFILM Smart School" },
      { property: "og:description", content: "Configuration de l'établissement et des automatisations intelligentes." },
    ],
  }),
  component: PageParametres,
});

function PageParametres() {
  const [etablissement, setEtablissement] = useState({
    nom: "Lycée Français International Louis-Massignon",
    adresse: "Bouskoura – Ville Verte, Casablanca, Maroc",
    email: "contact@lfilm.org",
    telephone: "+212 5 22 00 00 00",
    reseau: "mlfmonde / OSUI",
  });
  const [automatisations, setAutomatisations] = useState({
    classificationEmails: true,
    detectionWhatsApp: true,
    relancesAutomatiques: true,
    generationReponses: true,
    alertesEcheances: true,
    resumeHebdomadaire: false,
  });
  const [delaiRelance, setDelaiRelance] = useState("48");
  const [seuilUrgence, setSeuilUrgence] = useState("Haute");

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Administration"
        titre="Paramètres"
        description="Configuration de l'établissement, des canaux de réception et des règles d'automatisation appliquées par l'intelligence artificielle."
        actions={
          <Button onClick={() => toast.success("Paramètres enregistrés", { description: "La configuration a été mise à jour." })}>
            <Save className="size-4" />
            Enregistrer
          </Button>
        }
      />

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <Building2 className="size-4 text-petrol" /> Établissement
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Champ libelle="Nom de l'établissement">
            <Input value={etablissement.nom} onChange={(e) => setEtablissement({ ...etablissement, nom: e.target.value })} />
          </Champ>
          <Champ libelle="Réseau">
            <Input value={etablissement.reseau} onChange={(e) => setEtablissement({ ...etablissement, reseau: e.target.value })} />
          </Champ>
          <Champ libelle="Adresse">
            <Input value={etablissement.adresse} onChange={(e) => setEtablissement({ ...etablissement, adresse: e.target.value })} />
          </Champ>
          <Champ libelle="Email de contact">
            <Input value={etablissement.email} onChange={(e) => setEtablissement({ ...etablissement, email: e.target.value })} />
          </Champ>
          <Champ libelle="Téléphone">
            <Input value={etablissement.telephone} onChange={(e) => setEtablissement({ ...etablissement, telephone: e.target.value })} />
          </Champ>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-1 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <Sparkles className="size-4 text-petrol" /> Automatisations intelligentes
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Activez ou désactivez les traitements automatiques appliqués aux demandes entrantes.
        </p>
        <ul className="space-y-1">
          {(
            [
              ["classificationEmails", "Classification automatique des emails", "Catégorie, service et priorité détectés à la réception."],
              ["detectionWhatsApp", "Détection des demandes WhatsApp", "Les messages des collaborateurs et familles créent une demande."],
              ["relancesAutomatiques", "Relances automatiques", "Rappel au responsable lorsqu'une demande stagne."],
              ["generationReponses", "Génération de réponses suggérées", "Proposition de réponse rédigée pour chaque demande."],
              ["alertesEcheances", "Alertes d'échéances RH", "Contrats, visites médicales et documents arrivant à terme."],
              ["resumeHebdomadaire", "Résumé hebdomadaire par email", "Synthèse des indicateurs RH envoyée chaque lundi."],
            ] as const
          ).map(([cle, titre, detail]) => (
            <li key={cle} className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-0">
              <div>
                <p className="text-sm font-medium">{titre}</p>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </div>
              <Switch
                checked={automatisations[cle]}
                onCheckedChange={(v) => {
                  setAutomatisations((p) => ({ ...p, [cle]: v }));
                  toast.success(v ? "Automatisation activée" : "Automatisation désactivée", { description: titre });
                }}
              />
            </li>
          ))}
        </ul>

        <Separator className="my-4" />

        <div className="grid gap-3 sm:grid-cols-2">
          <Champ libelle="Délai avant relance automatique (heures)">
            <Select value={delaiRelance} onValueChange={setDelaiRelance}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["24", "48", "72", "96"].map((d) => <SelectItem key={d} value={d}>{d} heures</SelectItem>)}
              </SelectContent>
            </Select>
          </Champ>
          <Champ libelle="Seuil d'escalade d'une demande">
            <Select value={seuilUrgence} onValueChange={setSeuilUrgence}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Normale", "Haute", "Urgente"].map((s) => <SelectItem key={s} value={s}>Priorité {s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Champ>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 font-display text-base font-semibold text-navy">Canaux connectés</h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Email institutionnel", "contact@lfilm.org", true],
            ["WhatsApp Business", "+212 5 22 00 00 00", true],
            ["Formulaire site web", "lfilm.org/contact", true],
            ["Réseaux sociaux", "Facebook & Instagram", false],
          ].map(([nom, detail, actif]) => (
            <li key={nom as string} className="rounded-lg border border-border bg-surface/60 p-3">
              <p className="text-sm font-medium">{nom}</p>
              <p className="text-xs text-muted-foreground">{detail}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() =>
                  toast.success(actif ? "Canal testé avec succès" : "Connexion simulée", {
                    description: `${nom} — ${detail}`,
                  })
                }
              >
                {actif ? "Tester la connexion" : "Connecter"}
              </Button>
            </li>
          ))}
        </ul>
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
