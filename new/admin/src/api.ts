import type { Content } from "./types";

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (options.method && options.method !== "GET") {
    const csrf = getCsrfToken();
    if (csrf) headers.set("x-csrf-token", csrf);
  }

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Ошибка запроса ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function login(password: string) {
  return apiFetch<{ ok: boolean }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
}

export async function logout() {
  return apiFetch<{ ok: boolean }>("/api/auth/logout", {
    method: "POST"
  });
}

export async function checkAuth() {
  return apiFetch<{ authenticated: boolean }>("/api/auth/me");
}

export async function fetchContent(): Promise<Content> {
  return apiFetch<Content>("/api/content");
}

export async function saveContent(content: Content) {
  return apiFetch<{ ok: boolean }>("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content)
  });
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<{ url: string }>("/api/upload", {
    method: "POST",
    body: formData
  });
}
