import { api, setAccessToken } from "./client";
import { disconnectRealtime } from "@/lib/pusher/client";

/** In-memory only, same lifetime as the access token — re-derived via /auth/me after a refresh. */
let adminEmail: string | null = null;
export const getAdminEmail = () => adminEmail;

export async function login(email: string, password: string) {
  const res = await api.post<{ accessToken: string; email: string }>("/api/auth/login", { email, password }, { auth: false });
  setAccessToken(res.accessToken);
  adminEmail = res.email;
  return res;
}

// The API's serverless function allows up to 45s to finish (cold starts can take a while to
// connect to Mongo). apiFetch's default 10s client timeout would abort the request well before
// that — and an aborted /auth/logout never gets to apply the server's cookie-clearing response,
// so the refresh cookie survives and the login page's own session check silently signs back in.
// Use a timeout longer than the function's own budget so the client always gets a real answer.
const SLOW_BACKEND_TIMEOUT_MS = 50_000;

export async function logout() {
  try {
    await api.post("/api/auth/logout", undefined, { auth: false, timeoutMs: SLOW_BACKEND_TIMEOUT_MS });
  } finally {
    setAccessToken(null);
    adminEmail = null;
    disconnectRealtime();
  }
}

/** Tries to restore a session from the httpOnly refresh cookie — call once on admin mount. */
export async function restoreSession(): Promise<boolean> {
  try {
    const res = await api.post<{ accessToken: string }>("/api/auth/refresh", undefined, { auth: false, timeoutMs: SLOW_BACKEND_TIMEOUT_MS });
    setAccessToken(res.accessToken);
    const me = await api.get<{ email: string }>("/api/auth/me", { timeoutMs: SLOW_BACKEND_TIMEOUT_MS });
    adminEmail = me.email;
    return true;
  } catch {
    return false;
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await api.post<{ accessToken: string }>("/api/auth/change-password", { currentPassword, newPassword });
  setAccessToken(res.accessToken);
  return res;
}
