const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;
  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/** In-memory only — never persisted, so a page refresh re-derives it via /auth/refresh. */
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        setAccessToken(data.accessToken);
        return data.accessToken as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Send as multipart/form-data instead of JSON. */
  formData?: FormData;
  auth?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
};

async function doFetch(path: string, options: RequestOptions, token: string | null) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort());
  }

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  try {
    // Always send credentials: the refresh-token cookie matters for /auth/login,
    // /auth/refresh and /auth/logout regardless of whether a bearer token is also
    // being attached — `auth: false` only means "don't attach/retry with one".
    return await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body,
      credentials: "include",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Typed fetch wrapper for the TechClues API. Throws ApiError on any non-2xx response
 * (including network/timeout errors, surfaced as statusCode 0). Retries once on 401
 * via /auth/refresh when `auth` is not explicitly disabled.
 */
export async function apiFetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const useAuth = options.auth !== false;
  let res: Response;
  try {
    res = await doFetch(path, options, useAuth ? accessToken : null);
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new ApiError(0, "Request timed out — please check your connection and try again.");
    }
    throw new ApiError(0, "Could not reach the server — please try again.");
  }

  if (res.status === 401 && useAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      try {
        res = await doFetch(path, options, newToken);
      } catch {
        throw new ApiError(0, "Could not reach the server — please try again.");
      }
    }
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const err = (payload as { error?: { message?: string; details?: unknown } } | null)?.error;
    throw new ApiError(res.status, err?.message ?? res.statusText ?? "Something went wrong", err?.details);
  }

  return payload as T;
}

export const api = {
  get: <T = unknown>(path: string, options?: Omit<RequestOptions, "method">) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  patch: <T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  put: <T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  delete: <T = unknown>(path: string, options?: Omit<RequestOptions, "method">) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
