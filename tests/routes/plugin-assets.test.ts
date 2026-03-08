import { describe, test, expect, beforeAll } from "bun:test";

let pluginAssetsRouter: { request: (req: Request | string) => Response | Promise<Response> };

beforeAll(async () => {
  const mod = await import("../../src/routes/plugin-assets");
  pluginAssetsRouter = mod.default;
});

describe("routes/plugin-assets", () => {
  test("GET /plugins/folder/.. returns 404", async () => {
    const res = await pluginAssetsRouter.request(
      "http://localhost/plugins/somefolder/../script.js",
    );
    expect(res.status).toBe(404);
  });

  test("GET /plugins/nonexistent/file.js returns 404", async () => {
    const res = await pluginAssetsRouter.request(
      "http://localhost/plugins/nonexistent/file.js",
    );
    expect(res.status).toBe(404);
  });
});
