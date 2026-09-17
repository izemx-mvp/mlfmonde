import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TOUS = "__tous__";

export function FiltreSelect({
  valeur,
  onChange,
  options,
  libelle,
  largeur = "w-44",
}: {
  valeur: string;
  onChange: (v: string) => void;
  options: readonly string[];
  libelle: string;
  largeur?: string;
}) {
  return (
    <Select value={valeur} onValueChange={onChange}>
      <SelectTrigger className={largeur} aria-label={libelle}>
        <SelectValue placeholder={libelle} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TOUS}>{libelle} : tous</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
