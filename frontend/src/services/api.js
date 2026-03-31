const envApiUrl = String(import.meta.env.VITE_API_URL || "").trim();
const hasPlaceholder = /tu-dominio\.com/i.test(envApiUrl);
const rawApiUrl = envApiUrl && !hasPlaceholder ? envApiUrl : "/api";

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

export function apiUrl(path = "") {
  const normalizedPath = String(path || "").replace(/^\/+/, "");
  return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL;
}