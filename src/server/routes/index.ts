import { Hono } from "hono";

import commands from "./commands";
import extensions from "./extensions";
import pages from "./pages";
import pluginAssets from "./plugin-assets";
import pluginRoutes from "./plugin-routes";
import proxy from "./proxy";
import rateLimit from "./rate-limit";
import search from "./search";
import searchBar from "./search-bar";
import searchStream from "./search-stream";
import settings from "./settings";
import settingsAuth from "./settings-auth";
import slots from "./slots";
import store from "./store";
import suggest from "./suggest";
import sw from "./sw";
import themes from "./themes";

const globalRouter = new Hono();

globalRouter.route("/", commands);
globalRouter.route("/", extensions);
globalRouter.route("/", pages);
globalRouter.route("/", pluginAssets);
globalRouter.route("/", pluginRoutes);
globalRouter.route("/", proxy);
globalRouter.route("/", rateLimit);
globalRouter.route("/", search);
globalRouter.route("/", searchBar);
globalRouter.route("/", searchStream);
globalRouter.route("/", settings);
globalRouter.route("/", settingsAuth);
globalRouter.route("/", slots);
globalRouter.route("/", store);
globalRouter.route("/", suggest);
globalRouter.route("/", sw);
globalRouter.route("/", themes);

export default globalRouter;
