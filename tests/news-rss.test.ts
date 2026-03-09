import { describe, test, expect } from "bun:test";
import { DEFAULT_NEWS_FEED_URLS } from "../src/server/news-rss";

describe("news-rss", () => {
  test("DEFAULT_NEWS_FEED_URLS is non-empty array of URLs", () => {
    expect(Array.isArray(DEFAULT_NEWS_FEED_URLS)).toBe(true);
    expect(DEFAULT_NEWS_FEED_URLS.length).toBeGreaterThan(0);
    for (const url of DEFAULT_NEWS_FEED_URLS) {
      expect(url).toMatch(/^https?:\/\//);
      expect(() => new URL(url)).not.toThrow();
    }
  });
});
