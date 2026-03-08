import { Hono } from "hono";
import { getSearchBarActions } from "../search-bar/registry";

const router = new Hono();

router.get("/api/search-bar/actions", async (c) => {
  const actions = await getSearchBarActions();
  return c.json({ actions });
});

export default router;
