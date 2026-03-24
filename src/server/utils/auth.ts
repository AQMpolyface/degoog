import type { Context } from "hono";
import { isPublicInstance } from "./public-instance";

export function isGlobalAuthRequired(): boolean {
  if (isPublicInstance()) return false;
  const v = process.env.DEGOOG_GLOBAL_AUTH ?? "";
  const t = v.trim().toLowerCase();
  return t === "true" || t === "1";
}

export function getGlobalGatePasswords(): string[] {
  const raw = process.env.DEGOOG_PASSWORDS ?? "";
  return raw.split(",").map((p) => p.trim()).filter(Boolean);
}

export function isGlobalPasswordRequired(): boolean {
  return getGlobalGatePasswords().length > 0;
}

export async function shouldServeGlobalGate(c: Context): Promise<boolean> {
  if (!isGlobalAuthRequired()) return false;
  if (!isGlobalPasswordRequired()) return false;
  const { getSettingsTokenFromRequest, validateSettingsToken } = await import(
    "../routes/settings-auth"
  );
  const token = getSettingsTokenFromRequest(c);
  return !(await validateSettingsToken(token));
}

export function isGlobalGateExemptPath(path: string): boolean {
  const exemptPaths = [
    "/api/settings/auth",
    "/api/settings/auth/callback",
    "/public/",
    "/api/rate-limit/test",
    "/api/engines",
    "/favicon",
    "/manifest.json",
  ];

  for (const exempt of exemptPaths) {
    if (path === exempt || path.startsWith(exempt)) {
      return true;
    }
  }

  return false;
}
