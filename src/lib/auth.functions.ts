const CLE_SESSION = "lfilm-smart-school-session";

const EMAIL_ATTENDU = "mlfmonde@izemxlab.com";
const MOT_DE_PASSE_ATTENDU = "mlfmonde2026@";

type SessionLFILM = {
  connecte: boolean;
  email: string | null;
};

function lireSession(): SessionLFILM {
  if (typeof window === "undefined") {
    return { connecte: false, email: null };
  }

  try {
    const brut = window.localStorage.getItem(CLE_SESSION);
    if (!brut) return { connecte: false, email: null };
    const data = JSON.parse(brut) as Partial<SessionLFILM>;
    return {
      connecte: data.connecte === true,
      email: typeof data.email === "string" ? data.email : null,
    };
  } catch {
    return { connecte: false, email: null };
  }
}

function ecrireSession(session: SessionLFILM) {
  window.localStorage.setItem(CLE_SESSION, JSON.stringify(session));
}

export async function verifierSessionLFILM() {
  return lireSession();
}

export async function connecterLFILM(input: {
  data: { email: string; password: string };
}) {
  const email = input.data.email.trim().toLowerCase();
  const password = input.data.password;

  if (email !== EMAIL_ATTENDU.toLowerCase() || password !== MOT_DE_PASSE_ATTENDU) {
    return { ok: false as const };
  }

  ecrireSession({ connecte: true, email: EMAIL_ATTENDU });
  return { ok: true as const };
}

export async function deconnecterLFILM() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CLE_SESSION);
  }
  return { ok: true as const };
}
