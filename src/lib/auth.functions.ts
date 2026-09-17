import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

type SessionLFILM = {
  connecte?: boolean;
  email?: string;
};

function configurationSession() {
  const secret = process.env["LFILM_SESSION_SECRET"];
  if (!secret) {
    throw new Error("LFILM_SESSION_SECRET n'est pas configuré");
  }

  return {
    password: secret,
    name: "lfilm-smart-school-session",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function comparerDeFaconSure(saisie: string, attendu: string) {
  const a = createHash("sha256").update(saisie, "utf8").digest();
  const b = createHash("sha256").update(attendu, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const verifierSessionLFILM = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<SessionLFILM>(configurationSession());
  return {
    connecte: session.data.connecte === true,
    email: session.data.email ?? null,
  };
});

export const connecterLFILM = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        password: z.string().min(1).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const emailAttendu = process.env["LFILM_LOGIN_EMAIL"];
    const motDePasseAttendu = process.env["LFILM_LOGIN_PASSWORD"];

    if (!emailAttendu || !motDePasseAttendu) {
      throw new Error("Les identifiants LFILM ne sont pas configurés");
    }

    const emailValide = comparerDeFaconSure(data.email.toLowerCase(), emailAttendu.toLowerCase());
    const motDePasseValide = comparerDeFaconSure(data.password, motDePasseAttendu);

    if (!emailValide || !motDePasseValide) {
      return { ok: false as const };
    }

    const session = await useSession<SessionLFILM>(configurationSession());
    await session.update({ connecte: true, email: emailAttendu });

    return { ok: true as const };
  });

export const deconnecterLFILM = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<SessionLFILM>(configurationSession());
  await session.clear();
  return { ok: true as const };
});
