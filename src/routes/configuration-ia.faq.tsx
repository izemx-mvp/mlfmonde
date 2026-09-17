import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CircleHelp, Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type FaqIA = {
  id: string;
  question: string;
  reponse: string;
  categorie: "RH" | "Admissions" | "Vie scolaire" | "Finance" | "Documents";
  actif: boolean;
};

const FAQ_INITIALES: FaqIA[] = [
  { id: "faq-1", question: "Comment demander une attestation de travail ?", reponse: "La demande est déposée via le portail RH, puis traitée par le service RH sous 48 heures.", categorie: "RH", actif: true },
  { id: "faq-2", question: "Quels documents sont requis pour une inscription ?", reponse: "Le dossier comprend les pièces d’identité, justificatifs scolaires, fiche sanitaire et documents financiers selon le niveau.", categorie: "Admissions", actif: true },
  { id: "faq-3", question: "Comment signaler une absence élève ?", reponse: "Le responsable légal peut prévenir la vie scolaire par email, téléphone ou formulaire en ligne.", categorie: "Vie scolaire", actif: true },
];

export const Route = createFileRoute("/configuration-ia/faq")({
  head: () => ({
    meta: [
      { title: "FAQ IA — LFILM Smart School" },
      { name: "description", content: "Gestion des questions fréquentes utilisées par les agents IA LFILM." },
      { property: "og:title", content: "FAQ IA — LFILM Smart School" },
      { property: "og:description", content: "Administrer les questions/réponses fréquentes des assistants intelligents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PageFAQ,
});

function PageFAQ() {
  const [items, setItems] = useState(FAQ_INITIALES);
  const [categorie, setCategorie] = useState<FaqIA["categorie"] | "Toutes">("Toutes");
  const [question, setQuestion] = useState("");
  const [reponse, setReponse] = useState("");
  const [nouvelleCategorie, setNouvelleCategorie] = useState<FaqIA["categorie"]>("RH");

  const filtres = useMemo(() => categorie === "Toutes" ? items : items.filter((item) => item.categorie === categorie), [categorie, items]);

  function ajouter() {
    if (!question.trim() || !reponse.trim()) {
      toast.error("Question et réponse requises");
      return;
    }
    setItems((liste) => [{ id: `faq-${Date.now()}`, question: question.trim(), reponse: reponse.trim(), categorie: nouvelleCategorie, actif: true }, ...liste]);
    setQuestion("");
    setReponse("");
    toast.success("FAQ ajoutée");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Configuration IA"
        titre="FAQ"
        description="Gestion des questions/réponses fréquentes proposées aux agents IA pour accélérer les réponses aux familles et collaborateurs."
      />

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-navy">
          <Plus className="size-4 text-petrol" />
          Nouvelle question fréquente
        </h2>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <Champ libelle="Question">
            <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ex. Comment obtenir une copie de document ?" />
          </Champ>
          <Champ libelle="Catégorie">
            <Select value={nouvelleCategorie} onValueChange={(valeur) => setNouvelleCategorie(valeur as FaqIA["categorie"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["RH", "Admissions", "Vie scolaire", "Finance", "Documents"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </Champ>
          <div className="lg:col-span-2">
            <Champ libelle="Réponse validée">
              <Textarea value={reponse} onChange={(event) => setReponse(event.target.value)} className="min-h-24" />
            </Champ>
          </div>
        </div>
        <Button className="mt-4" onClick={ajouter}>
          <Save className="size-4" />
          Enregistrer la FAQ
        </Button>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_220px] items-center gap-4">
          <h2 className="flex min-w-0 items-center gap-2 font-display text-base font-semibold text-navy">
            <CircleHelp className="size-4 shrink-0 text-petrol" />
            <span className="truncate">Questions publiées</span>
          </h2>
          <Select value={categorie} onValueChange={(valeur) => setCategorie(valeur as FaqIA["categorie"] | "Toutes")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[
                "Toutes",
                "RH",
                "Admissions",
                "Vie scolaire",
                "Finance",
                "Documents",
              ].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          {filtres.map((item) => (
            <article key={item.id} className="rounded-lg border border-border bg-surface/60 p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.question}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.reponse}</p>
                  <p className="mt-2 text-xs font-semibold text-petrol">{item.categorie}</p>
                </div>
                <Button size="icon" variant="ghost" aria-label="Supprimer" onClick={() => setItems((liste) => liste.filter((ligne) => ligne.id !== item.id))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
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
