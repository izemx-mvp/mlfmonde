import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, CheckCircle2, Plus, Save, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type AgentIA = {
  id: string;
  nom: string;
  mission: string;
  service: string;
  statut: "Actif" | "Inactif";
  temperature: string;
  ton: string;
};

const AGENTS_INITIAUX: AgentIA[] = [
  {
    id: "agent-rh",
    nom: "AI HR Copilot",
    mission: "Analyse les alertes RH, les absences, les documents expirants et les actions prioritaires.",
    service: "Ressources humaines",
    statut: "Actif",
    temperature: "Équilibré",
    ton: "Institutionnel",
  },
  {
    id: "agent-service-ecole",
    nom: "AI School Service Agent",
    mission: "Classe les demandes familles, propose une réponse et oriente vers le bon service.",
    service: "Vie scolaire",
    statut: "Actif",
    temperature: "Précis",
    ton: "Bienveillant",
  },
  {
    id: "agent-recrutement",
    nom: "AI Recruitment Manager",
    mission: "Évalue les candidatures, résume les profils et prépare les recommandations d’entretien.",
    service: "Recrutement",
    statut: "Actif",
    temperature: "Analytique",
    ton: "Professionnel",
  },
];

export const Route = createFileRoute("/configuration-ia/agents")({
  head: () => ({
    meta: [
      { title: "Agents IA — LFILM Smart School" },
      { name: "description", content: "Gestion et configuration des agents IA de la plateforme LFILM Smart School." },
      { property: "og:title", content: "Agents IA — LFILM Smart School" },
      { property: "og:description", content: "Configurer les agents intelligents dédiés aux services RH, recrutement et vie scolaire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PageAgentsIA,
});

function PageAgentsIA() {
  const [agents, setAgents] = useState(AGENTS_INITIAUX);
  const [agentActif, setAgentActif] = useState<AgentIA | null>(AGENTS_INITIAUX[0] ?? null);
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const actifs = useMemo(() => agents.filter((agent) => agent.statut === "Actif").length, [agents]);

  function basculerAgent(id: string, actif: boolean) {
    setAgents((liste) => liste.map((agent) => (agent.id === id ? { ...agent, statut: actif ? "Actif" : "Inactif" } : agent)));
    toast.success(actif ? "Agent activé" : "Agent désactivé");
  }

  function ajouterAgent() {
    const nouveau: AgentIA = {
      id: `agent-${Date.now()}`,
      nom: "Nouvel agent IA",
      mission: "Définir le périmètre, les consignes et les sources utilisées par cet agent.",
      service: "Administration",
      statut: "Inactif",
      temperature: "Équilibré",
      ton: "Institutionnel",
    };
    setAgents((liste) => [...liste, nouveau]);
    setAgentActif(nouveau);
    setAjoutOuvert(false);
    toast.success("Agent ajouté", { description: "Vous pouvez maintenant le configurer." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Configuration IA"
        titre="Agents IA"
        description="Gestion des agents intelligents utilisés par les modules RH, recrutement, documents et service école."
        actions={
          <Button onClick={() => setAjoutOuvert(true)}>
            <Plus className="size-4" />
            Ajouter un agent
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Indicateur libelle="Agents configurés" valeur={String(agents.length)} />
        <Indicateur libelle="Agents actifs" valeur={String(actifs)} />
        <Indicateur libelle="Services couverts" valeur={String(new Set(agents.map((agent) => agent.service)).size)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="mb-3 font-display text-base font-semibold text-navy">Catalogue des agents</h2>
          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => setAgentActif(agent)}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-lg border border-border bg-surface/50 p-3 text-left transition-colors hover:border-petrol/40"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">{agent.nom}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{agent.service}</span>
                </span>
                <StatusBadge value={agent.statut} />
              </button>
            ))}
          </div>
        </div>

        {agentActif && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Configuration</p>
                <h2 className="mt-1 truncate font-display text-xl font-bold text-navy">{agentActif.nom}</h2>
              </div>
              <Bot className="size-6 shrink-0 text-petrol" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Champ libelle="Nom de l’agent">
                <Input value={agentActif.nom} onChange={(event) => setAgentActif({ ...agentActif, nom: event.target.value })} />
              </Champ>
              <Champ libelle="Service responsable">
                <Input value={agentActif.service} onChange={(event) => setAgentActif({ ...agentActif, service: event.target.value })} />
              </Champ>
              <Champ libelle="Ton de réponse">
                <Select value={agentActif.ton} onValueChange={(ton) => setAgentActif({ ...agentActif, ton })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[
                      "Institutionnel",
                      "Bienveillant",
                      "Professionnel",
                      "Conciliant",
                    ].map((ton) => <SelectItem key={ton} value={ton}>{ton}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Champ>
              <Champ libelle="Style d’analyse">
                <Select value={agentActif.temperature} onValueChange={(temperature) => setAgentActif({ ...agentActif, temperature })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Précis", "Équilibré", "Analytique", "Créatif encadré"].map((mode) => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Champ>
              <div className="sm:col-span-2">
                <Champ libelle="Mission et consignes">
                  <Textarea value={agentActif.mission} onChange={(event) => setAgentActif({ ...agentActif, mission: event.target.value })} className="min-h-28" />
                </Champ>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Switch checked={agentActif.statut === "Actif"} onCheckedChange={(checked) => setAgentActif({ ...agentActif, statut: checked ? "Actif" : "Inactif" })} />
                Agent actif
              </label>
              <Button
                onClick={() => {
                  setAgents((liste) => liste.map((agent) => (agent.id === agentActif.id ? agentActif : agent)));
                  toast.success("Configuration enregistrée", { description: agentActif.nom });
                }}
              >
                <Save className="size-4" />
                Enregistrer
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <Settings2 className="size-4 text-petrol" />
          Activation rapide
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-lg border border-border bg-surface/60 p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{agent.nom}</p>
                <Switch checked={agent.statut === "Actif"} onCheckedChange={(checked) => basculerAgent(agent.id, checked)} />
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{agent.mission}</p>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={ajoutOuvert} onOpenChange={setAjoutOuvert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un agent IA</DialogTitle>
            <DialogDescription>Un nouvel agent sera créé avec une configuration initiale modifiable.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAjoutOuvert(false)}>Annuler</Button>
            <Button onClick={ajouterAgent}>
              <CheckCircle2 className="size-4" />
              Créer l’agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Indicateur({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold text-muted-foreground uppercase">{libelle}</p>
      <p className="mt-2 font-display text-3xl font-bold text-navy">{valeur}</p>
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
