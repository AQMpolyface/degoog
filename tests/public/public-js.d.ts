declare module "../../src/public/js/constants.js" {
  export const DB_NAME: string;
  export const DB_VERSION: number;
  export const STORE_NAME: string;
  export const SETTINGS_KEY: string;
  export const THEME_KEY: string;
  export const PER_PAGE: number;
  export const MAX_PAGE: number;
}

declare module "../../src/public/js/state.js" {
  export const state: {
    currentQuery: string;
    currentType: string;
    currentPage: number;
    lastPage: number;
    currentResults: unknown[];
    currentData: unknown;
    imagePage: number;
    imageLastPage: number;
    videoPage: number;
    videoLastPage: number;
    currentTimeFilter: string;
    mediaLoading: boolean;
    currentBangQuery: string;
  };
}

declare module "../../src/public/js/url.js" {
  export function buildSearchUrl(
    query: string,
    engines: Record<string, boolean>,
    type: string,
    page: number,
  ): string;
  export function proxyImageUrl(url: string): string;
  export function faviconUrl(url: string): string;
}

declare module "../../src/public/js/utils.js" {
  export function cleanUrl(url: string): string;
  export function cleanHostname(url: string): string;
}

declare module "../../src/public/js/timeFilter.js" {
  export function initTimeFilter(): void;
}
