import { apiFetch, setCartKey, WOO_SITE_URL, getCartKey } from '../lib/api';

export interface CoCartItem {
  item_key: string;
  id: number;
  name: string;
  title?: string;
  price: string;
  quantity: { value: number; min_purchase: number; max_purchase: number };
  totals: { subtotal: string; total: string };
  featured_image?: string;
  meta?: Record<string, unknown>;
}

export interface CoCartResponse {
  cart_hash?: string;
  cart_key?: string;
  items: CoCartItem[];
  item_count: number;
  items_weight?: number;
  totals: {
    subtotal: string;
    total: string;
    shipping_total?: string;
    tax_total?: string;
    discount_total?: string;
  };
  needs_payment?: boolean;
  needs_shipping?: boolean;
}

function storeKeyFrom(res: CoCartResponse) {
  if (res?.cart_key) setCartKey(res.cart_key);
}

export async function getCart(): Promise<CoCartResponse> {
  const res = await apiFetch<CoCartResponse>('/cocart/v2/cart', {
    method: 'GET',
    auth: true,
    cartKey: true,
    captureCartKey: true,
  });
  storeKeyFrom(res);
  return res;
}

export async function addItem(
  productId: number | string,
  quantity: number
): Promise<CoCartResponse> {
  const res = await apiFetch<CoCartResponse>('/cocart/v2/cart/add-item', {
    method: 'POST',
    auth: true,
    cartKey: true,
    captureCartKey: true,
    body: JSON.stringify({
      id: String(productId),
      quantity: String(quantity),
      return_cart: true,
    }),
  });
  storeKeyFrom(res);
  return res;
}

export async function updateItem(itemKey: string, quantity: number): Promise<CoCartResponse> {
  const res = await apiFetch<CoCartResponse>(`/cocart/v2/cart/item/${itemKey}`, {
    method: 'POST',
    auth: true,
    cartKey: true,
    captureCartKey: true,
    body: JSON.stringify({ quantity: String(quantity), return_cart: true }),
  });
  storeKeyFrom(res);
  return res;
}

export async function removeItem(itemKey: string): Promise<CoCartResponse> {
  const res = await apiFetch<CoCartResponse>(`/cocart/v2/cart/item/${itemKey}`, {
    method: 'DELETE',
    auth: true,
    cartKey: true,
    captureCartKey: true,
    body: JSON.stringify({ return_cart: true }),
  });
  storeKeyFrom(res);
  return res;
}

export async function clearCart(): Promise<CoCartResponse> {
  const res = await apiFetch<CoCartResponse>('/cocart/v2/cart/clear', {
    method: 'POST',
    auth: true,
    cartKey: true,
    captureCartKey: true,
    body: JSON.stringify({ return_cart: true }),
  });
  storeKeyFrom(res);
  return res;
}

export function getCheckoutUrl(): string {
  const key = getCartKey();
  const base = `${WOO_SITE_URL.replace(/\/$/, '')}/checkout/`;
  return key ? `${base}?cocart-load-cart=${encodeURIComponent(key)}` : base;
}
