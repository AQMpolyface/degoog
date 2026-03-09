import { describe, test, expect, beforeAll } from "bun:test";

let swRouter: {
  request: (req: Request | string) => Response | Promise<Response>;
};

beforeAll(async () => {
  const mod = await import("../../src/server/routes/sw");
  swRouter = mod.default;
});

describe("routes/sw", () => {
  test("GET /sw.js returns 200 and JavaScript", async () => {
    const res = await swRouter.request("http://localhost/sw.js");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("javascript");
    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });
});
