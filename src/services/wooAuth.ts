import { apiFetch, setAuthToken, setStoredUser, getAuthToken, getStoredUser } from '../lib/api';

export interface WooUser {
  id: number;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  nicename?: string;
}

interface JwtTokenResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  user_id?: number;
  data?: {
    id?: number;
  };
}

interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
}

function toWooUser(res: JwtTokenResponse, fallback?: Partial<WooUser>): WooUser {
  return {
    id: res.user_id ?? res.data?.id ?? fallback?.id ?? 0,
    email: res.user_email ?? fallback?.email ?? '',
    displayName: res.user_display_name ?? fallback?.displayName ?? '',
    nicename: res.user_nicename,
  };
}

export async function loginWithPassword(username: string, password: string): Promise<WooUser> {
  const res = await apiFetch<JwtTokenResponse>('/jwt-auth/v1/token', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setAuthToken(res.token);
  const user = toWooUser(res);
  setStoredUser(user);
  return user;
}

export async function validateToken(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  try {
    await apiFetch('/jwt-auth/v1/token/validate', {
      method: 'POST',
      auth: true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string
): Promise<WooUser> {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  const lastName = rest.join(' ');

  const res = await apiFetch<RegisterResponse>('/wp/v2/users/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      username: email,
      first_name: firstName || '',
      last_name: lastName || '',
      name: fullName,
    }),
  }).catch(async () => {
    return apiFetch<RegisterResponse>('/wc/v3/customers', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        username: email,
        first_name: firstName || '',
        last_name: lastName || '',
      }),
    });
  });

  const user = await loginWithPassword(email, password).catch(() => ({
    id: res.id,
    email: res.email,
    displayName: res.name,
    firstName: res.first_name,
    lastName: res.last_name,
  }));

  return user;
}

export function logout() {
  setAuthToken(null);
  setStoredUser(null);
}

export function getCurrentUser(): WooUser | null {
  return getStoredUser<WooUser>();
}
