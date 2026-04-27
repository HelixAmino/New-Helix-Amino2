import { API_BASE_URL } from '../lib/api';

const STORE_BASE = `${API_BASE_URL}/wc/store/v1`;
const TOKEN_STORAGE_KEY = 'helix_store_cart_token';
const NONCE_STORAGE_KEY = 'helix_store_nonce';

interface StoreShippingRate {
  rate_id: string;
  name: string;
  price: string;
  taxes: string;
  selected: boolean;
  method_id: string;
}

interface StoreShippingPackage {
  package_id: number | string;
  name: string;
  destination: Record<string, string>;
  shipping_rates: StoreShippingRate[];
}

interface StoreCart {
  shipping_rates?: StoreShippingPackage[];
  needs_shipping?: boolean;
  totals?: {
    total_shipping?: string;
    currency_minor_unit?: number;
  };
}

export interface StoreRate {
  key: string;
  label: string;
  cost: number;
  selected: boolean;
  methodId: string;
}

function readToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}
function writeToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    else sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
function readNonce(): string | null {
  try {
    return sessionStorage.getItem(NONCE_STORAGE_KEY);
  } catch {
    return null;
  }
}
function writeNonce(nonce: string | null) {
  try {
    if (nonce) sessionStorage.setItem(NONCE_STORAGE_KEY, nonce);
    else sessionStorage.removeItem(NONCE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(extra ?? {}),
  };
  const token = readToken();
  if (token) headers['Cart-Token'] = token;
  const nonce = readNonce();
  if (nonce) headers.Nonce = nonce;
  return headers;
}

async function storeFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${STORE_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: buildHeaders(init.headers as Record<string, string> | undefined),
  });
  const newToken = res.headers.get('Cart-Token');
  if (newToken) writeToken(newToken);
  const newNonce = res.headers.get('Nonce');
  if (newNonce) writeNonce(newNonce);
  return res;
}

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Store API ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

function priceToNumber(value: string | undefined, minorUnit: number = 2): number {
  if (!value) return 0;
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n / Math.pow(10, minorUnit);
}

function flattenRates(cart: StoreCart): StoreRate[] {
  const minorUnit = cart.totals?.currency_minor_unit ?? 2;
  const out: StoreRate[] = [];
  for (const pkg of cart.shipping_rates ?? []) {
    for (const rate of pkg.shipping_rates ?? []) {
      out.push({
        key: rate.rate_id,
        label: rate.name,
        cost: priceToNumber(rate.price, minorUnit),
        selected: rate.selected,
        methodId: rate.method_id,
      });
    }
  }
  return out;
}

export interface StoreShippingResult {
  rates: StoreRate[];
  needsShipping: boolean;
}

interface StoreCartItem {
  wooId: number;
  quantity: number;
}

export async function fetchStoreShipping(
  items: StoreCartItem[],
  address: { country: string; state: string; postcode: string; city: string },
): Promise<StoreShippingResult> {
  // Reset session-scoped cart token so each calculation starts clean.
  writeToken(null);

  // Bootstrap cart-token + nonce.
  await storeFetch('/cart', { method: 'GET' });

  // Fresh contents.
  await storeFetch('/cart/items', { method: 'DELETE' }).catch(() => {
    /* ignore */
  });

  for (const item of items) {
    if (!item.wooId || item.quantity <= 0) continue;
    await storeFetch('/cart/add-item', {
      method: 'POST',
      body: JSON.stringify({ id: item.wooId, quantity: item.quantity }),
    });
  }

  const res = await storeFetch('/cart/update-customer', {
    method: 'POST',
    body: JSON.stringify({
      shipping_address: {
        country: address.country,
        state: address.state,
        postcode: address.postcode,
        city: address.city,
        address_1: '',
        first_name: '',
        last_name: '',
      },
      billing_address: {
        country: address.country,
        state: address.state,
        postcode: address.postcode,
        city: address.city,
        address_1: '',
        first_name: '',
        last_name: '',
        email: '',
      },
    }),
  });
  const cart = await readJson<StoreCart>(res);
  return {
    rates: flattenRates(cart),
    needsShipping: Boolean(cart.needs_shipping),
  };
}

export async function selectStoreShipping(rateId: string): Promise<StoreShippingResult> {
  const [packageId] = rateId.split(':');
  const res = await storeFetch('/cart/select-shipping-rate', {
    method: 'POST',
    body: JSON.stringify({ package_id: Number(packageId) || 0, rate_id: rateId }),
  });
  const cart = await readJson<StoreCart>(res);
  return {
    rates: flattenRates(cart),
    needsShipping: Boolean(cart.needs_shipping),
  };
}
