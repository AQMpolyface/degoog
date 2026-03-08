import { describe, test, expect } from "bun:test";
import {
  DB_NAME,
  DB_VERSION,
  STORE_NAME,
  SETTINGS_KEY,
  THEME_KEY,
  PER_PAGE,
  MAX_PAGE,
} from "../../src/public/js/constants.js";
import { state } from "../../src/public/js/state.js";
import * as timeFilter from "../../src/public/js/timeFilter.js";

describe("public/constants", () => {
  test("DB_NAME is string", () => {
    expect(DB_NAME).toBe("degoog");
  });

  test("DB_VERSION is number", () => {
    expect(typeof DB_VERSION).toBe("number");
  });

  test("STORE_NAME and SETTINGS_KEY are strings", () => {
    expect(typeof STORE_NAME).toBe("string");
    expect(typeof SETTINGS_KEY).toBe("string");
  });

  test("PER_PAGE and MAX_PAGE are numbers", () => {
    expect(PER_PAGE).toBe(10);
    expect(MAX_PAGE).toBe(10);
  });
});

describe("public/state", () => {
  test("state has expected keys", () => {
    expect(state).toHaveProperty("currentQuery");
    expect(state).toHaveProperty("currentType", "all");
    expect(state).toHaveProperty("currentPage", 1);
    expect(state).toHaveProperty("currentTimeFilter", "any");
  });
});

describe("public/timeFilter", () => {
  test("initTimeFilter is function", () => {
    expect(typeof timeFilter.initTimeFilter).toBe("function");
  });
});
