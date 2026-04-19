export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) ?? 'https://backend.helixamino.com/wp-json';

export const WOO_SITE_URL =
  (import.meta.env.VITE_WOO_SITE_URL as string) ?? 'https://backend.helixamino.com';

const JWT_STORAGE_KEY = 'helix_jwt_token';
const JWT_USER_STORAGE_KEY = 'helix_jwt_user';
const CART_KEY_STORAGE_KEY = 'helix_cocart_key';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(JWT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem(JWT_STORAGE_KEY, token);
    else localStorage.removeItem(JWT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getStoredUser<T = unknown>(): T | null {
  try {
    const raw = localStorage.getItem(JWT_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: unknown | null) {
  try {
    if (user) localStorage.setItem(JWT_USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(JWT_USER_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getCartKey(): string | null {
  try {
    return localStorage.getItem(CART_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setCartKey(key: string | null) {
  try {
    if (key) localStorage.setItem(CART_KEY_STORAGE_KEY, key);
    else localStorage.removeItem(CART_KEY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
  cartKey?: boolean;
  query?: Record<string, string | number | undefined>;
  captureCartKey?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth, cartKey, query, captureCartKey, headers, ...init } = options;

  const url = new URL(
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  );

  if (cartKey) {
    const key = getCartKey();
    if (key) url.searchParams.set('cart_key', key);
  }

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), { ...init, headers: finalHeaders });

  if (captureCartKey) {
    const key = res.headers.get('CoCart-API-Cart-Key') || res.headers.get('cocart-api-cart-key');
    if (key) setCartKey(key);
  }

  if (!res.ok) {
    let message = `API request failed: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
      else if (data?.data?.message) message = data.data.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
