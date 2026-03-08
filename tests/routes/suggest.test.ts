import { describe, test, expect, beforeAll } from "bun:test";

let suggestRouter: { request: (req: Request | string) => Response | Promise<Response> };

beforeAll(async () => {
  const mod = await import("../../src/routes/suggest");
  suggestRouter = mod.default;
});

describe("routes/suggest", () => {
  test("GET /api/suggest returns 200 and array", async () => {
    const res = await suggestRouter.request("http://localhost/api/suggest?q=test");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /api/suggest/opensearch returns 200 and [query, suggestions]", async () => {
    const res = await suggestRouter.request(
      "http://localhost/api/suggest/opensearch?q=foo",
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/x-suggestions");
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    expect(body[0]).toBe("foo");
  });
});
