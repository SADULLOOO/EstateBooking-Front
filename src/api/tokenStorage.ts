import type { AuthTokens } from "@/types/user";

const ACCESS_KEY = "housingbook_access_token";
const REFRESH_KEY = "housingbook_refresh_token";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (tokens: AuthTokens) => {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
  },
  setAccess: (access: string) => {
    localStorage.setItem(ACCESS_KEY, access);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
