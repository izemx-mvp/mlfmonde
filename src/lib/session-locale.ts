export const IDENTIFIANTS_LFILM = {
  email: "mlfmonde@izemxlab.com",
  password: "mlfmonde2026@",
};

const CLE_SESSION = "lfilm-smart-school-session";

export function verifierIdentifiants(email: string, password: string) {
  return email.trim().toLowerCase() === IDENTIFIANTS_LFILM.email && password === IDENTIFIANTS_LFILM.password;
}

export function sessionOuverte() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CLE_SESSION) === "ok";
  } catch {
    return false;
  }
}

export function ouvrirSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLE_SESSION, "ok");
  } catch {
    /* stockage indisponible */
  }
}

export function fermerSessionLocale() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CLE_SESSION);
  } catch {
    /* stockage indisponible */
  }
}
