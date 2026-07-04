import { API_BASE_URL } from "@/config/env";

/** DRF serializes ImageField/FileField as absolute URLs when a request
 * context is available, so most media paths already include the host.
 * Only prefix with API_BASE_URL for the (fallback) relative-path case. */
export function resolveMediaUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}
