import { Hono } from "hono";
import { getSettings } from "../plugin-settings";
import { getMiddleware } from "../middleware/registry";

const router = new Hono();

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const validTokens = new Map<string, number>();
const MIDDLEWARE_SETTINGS_ID = "middleware";
const SETTINGS_GATE_KEY = "settingsGate";

function getPasswords(): string[] {
  const raw = process.env.DEGOOG_SETTINGS_PASSWORDS ?? "";
  return raw.split(",").map((p) => p.trim()).filter(Boolean);
}

function isPasswordRequired(): boolean {
  return getPasswords().length > 0;
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function pruneExpired(): void {
  const now = Date.now();
  for (const [token, expiresAt] of validTokens) {
    if (now > expiresAt) validTokens.delete(token);
  }
}

export async function validateSettingsToken(token: string | undefined): Promise<boolean> {
  const required = await isAuthRequired();
  if (!required) return true;
  if (!token) return false;
  const expiresAt = validTokens.get(token);
  if (!expiresAt || Date.now() > expiresAt) {
    if (expiresAt) validTokens.delete(token);
    return false;
  }
  return true;
}

async function getSelectedMiddlewareForSettingsGate(): Promise<ReturnType<typeof getMiddleware>> {
  const settings = await getSettings(MIDDLEWARE_SETTINGS_ID);
  const value = settings[SETTINGS_GATE_KEY]?.trim();
  if (!value?.startsWith("plugin:")) return null;
  const id = value.slice(7);
  return getMiddleware(id);
}

async function isAuthRequired(): Promise<boolean> {
  if (isPasswordRequired()) return true;
  const settings = await getSettings(MIDDLEWARE_SETTINGS_ID);
  const gate = settings[SETTINGS_GATE_KEY]?.trim();
  return !!gate;
}

router.get("/api/settings/auth", async (c) => {
  const m = await getSelectedMiddlewareForSettingsGate();
  if (!m) {
    if (!isPasswordRequired()) return c.json({ required: false, valid: true });
    const token = c.req.header("x-settings-token") ?? c.req.query("token");
    if (await validateSettingsToken(token)) return c.json({ required: true, valid: true });
    return c.json({ required: true, valid: false });
  }
  const token = c.req.header("x-settings-token") ?? c.req.query("token");
  if (await validateSettingsToken(token)) return c.json({ required: true, valid: true });
  const result = await m.handle(c.req.raw, { route: "settings-auth" });
  if (result instanceof Response) return result;
  if (result === null) {
    if (!isPasswordRequired()) return c.json({ required: false, valid: true });
    return c.json({ required: true, valid: false });
  }
  return c.json({ required: true, valid: false });
});

router.get("/api/settings/auth/callback", async (c) => {
  const m = await getSelectedMiddlewareForSettingsGate();
  if (!m) return c.redirect("/settings");
  const result = await m.handle(c.req.raw, { route: "settings-auth-callback" });
  if (result !== null && !(result instanceof Response) && "redirect" in result) {
    pruneExpired();
    const sessionToken = generateToken();
    validTokens.set(sessionToken, Date.now() + TOKEN_TTL_MS);
    const sep = result.redirect.includes("?") ? "&" : "?";
    return c.redirect(`${result.redirect}${sep}token=${sessionToken}`);
  }
  if (result instanceof Response) return result;
  return c.redirect("/settings");
});

router.post("/api/settings/auth", async (c) => {
  const m = await getSelectedMiddlewareForSettingsGate();
  if (m) {
    const result = await m.handle(c.req.raw, { route: "settings-auth-post" });
    if (result instanceof Response) return result;
    return c.json({ ok: false, error: "Use the login flow" }, 400);
  }
  if (!isPasswordRequired()) return c.json({ ok: true, token: null });
  const body = await c.req.json<{ password?: string }>();
  const passwords = getPasswords();
  if (!body.password || !passwords.includes(body.password)) {
    return c.json({ ok: false }, 401);
  }
  pruneExpired();
  const token = generateToken();
  validTokens.set(token, Date.now() + TOKEN_TTL_MS);
  return c.json({ ok: true, token });
});

export default router;
