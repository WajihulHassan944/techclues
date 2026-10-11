import { api, setAccessToken } from "./client";

export async function login(email: string, password: string) {
  const res = await api.post<{ accessToken: string; email: string }>("/api/auth/login", { email, password }, { auth: false });
  setAccessToken(res.accessToken);
  return res;
}

export async function logout() {
  try {
    await api.post("/api/auth/logout", undefined, { auth: false });
  } finally {
    setAccessToken(null);
  }
}

/** Tries to restore a session from the httpOnly refresh cookie — call once on admin mount. */
export async function restoreSession(): Promise<boolean> {
  try {
    const res = await api.post<{ accessToken: string }>("/api/auth/refresh", undefined, { auth: false });
    setAccessToken(res.accessToken);
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
