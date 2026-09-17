export const IDENTIFIANTS_LFILM = {
  email: "mlfmonde@izemxlab.com",
  password: "mlfmonde2026@",
} as const;

const CLE_SESSION = "lfilm-smart-school-session";

export type SessionLFILM = {
  connecte: boolean;
  email: string | null;
};

function sessionNavigateurDisponible() {
  return typeof window !== "undefined";
}

export function verifierSessionLFILM(): SessionLFILM {
  if (!sessionNavigateurDisponible()) {
    return { connecte: false, email: null };
  }

  try {
    const brut = sessionStorage.getItem(CLE_SESSION);
    if (!brut) {
      return { connecte: false, email: null };
    }

    const lu = JSON.parse(brut) as { connecte?: unknown; email?: unknown };
    return {
      connecte: lu.connecte === true,
      email: typeof lu.email === "string" ? lu.email : null,
    };
  } catch {
    return { connecte: false, email: null };
  }
}

export function connecterLFILM(data: { email: string; password: string }) {
  const email = data.email.trim().toLowerCase();
  const attendu = IDENTIFIANTS_LFILM.email.toLowerCase();
  if (email !== attendu || data.password !== IDENTIFIANTS_LFILM.password) {
    return { ok: false as const };
  }

  sessionStorage.setItem(
    CLE_SESSION,
    JSON.stringify({ connecte: true, email: IDENTIFIANTS_LFILM.email }),
  );
  return { ok: true as const };
}

export function deconnecterLFILM() {
  if (!sessionNavigateurDisponible()) {
    return { ok: true as const };
  }

  sessionStorage.removeItem(CLE_SESSION);
  return { ok: true as const };
}
