import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { useAppStore } from "@/store/app-store";
import { nomComplet } from "@/data/mock";

interface Resultat {
  categorie: string;
  libelle: string;
  detail: string;
  lien: string;
}

export function RechercheGlobale() {
  const [terme, setTerme] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const navigate = useNavigate();
  const store = useAppStore();

  const resultats = useMemo<Resultat[]>(() => {
    const t = terme.trim().toLowerCase();
    if (t.length < 2) return [];
    const out: Resultat[] = [];

    store.collaborateurs
      .filter((c) => `${c.prenom} ${c.nom} ${c.matricule} ${c.service} ${c.fonction}`.toLowerCase().includes(t))
      .slice(0, 4)
      .forEach((c) =>
        out.push({
          categorie: "Collaborateurs",
          libelle: `${c.prenom} ${c.nom}`,
          detail: `${c.fonction} · ${c.service}`,
          lien: `/rh/collaborateurs/${c.id}`,
        }),
      );

    store.candidats
      .filter((c) => `${c.prenom} ${c.nom} ${c.poste}`.toLowerCase().includes(t))
      .slice(0, 3)
      .forEach((c) =>
        out.push({ categorie: "Candidatures", libelle: `${c.prenom} ${c.nom}`, detail: c.poste, lien: "/recrutement/candidatures" }),
      );

    store.demandes
      .filter((d) => `${d.id} ${d.sujet} ${d.demandeur} ${d.categorie}`.toLowerCase().includes(t))
      .slice(0, 3)
      .forEach((d) =>
        out.push({
          categorie: d.reclamation ? "Réclamations" : "Demandes",
          libelle: d.sujet,
          detail: `${d.id} · ${d.demandeur}`,
          lien: d.reclamation ? "/demandes/reclamations" : "/demandes",
        }),
      );

    store.documents
      .filter((d) => `${d.nom} ${d.type}`.toLowerCase().includes(t))
      .slice(0, 3)
      .forEach((d) => out.push({ categorie: "Documents", libelle: d.nom, detail: d.type, lien: "/documents" }));

    store.emails
      .filter((e) => `${e.objet} ${e.expediteur} ${e.categorieIA}`.toLowerCase().includes(t))
      .slice(0, 3)
      .forEach((e) => out.push({ categorie: "Emails", libelle: e.objet, detail: e.expediteur, lien: "/demandes/emails" }));

    store.evenements
      .filter((e) => `${e.intitule} ${e.type} ${nomComplet(e.collaborateurId)}`.toLowerCase().includes(t))
      .slice(0, 3)
      .forEach((e) =>
        out.push({ categorie: "Événements RH", libelle: e.intitule, detail: nomComplet(e.collaborateurId), lien: "/rh/evenements" }),
      );

    return out;
  }, [terme, store]);

  const groupes = resultats.reduce<Record<string, Resultat[]>>((acc, r) => {
    (acc[r.categorie] ??= []).push(r);
    return acc;
  }, {});

  return (
    <Popover open={ouvert && terme.trim().length >= 2} onOpenChange={setOuvert}>
      <PopoverAnchor asChild>
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={terme}
            onChange={(e) => {
              setTerme(e.target.value);
              setOuvert(true);
            }}
            onFocus={() => setOuvert(true)}
            placeholder="Rechercher un collaborateur, une demande, un document…"
            className="bg-surface pl-9"
            aria-label="Recherche globale"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent align="start" className="w-[min(32rem,90vw)] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="max-h-96 overflow-y-auto p-2">
          {resultats.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Aucun résultat pour « {terme} ».</p>
          ) : (
            Object.entries(groupes).map(([categorie, items]) => (
              <div key={categorie} className="mb-2 last:mb-0">
                <p className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{categorie}</p>
                {items.map((r, i) => (
                  <button
                    key={`${r.lien}-${i}`}
                    type="button"
                    onClick={() => {
                      setOuvert(false);
                      setTerme("");
                      navigate({ to: r.lien });
                    }}
                    className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left transition-colors hover:bg-surface"
                  >
                    <span className="text-sm font-medium text-foreground">{r.libelle}</span>
                    <span className="text-xs text-muted-foreground">{r.detail}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
