import { apiFetch } from '../lib/api';
import { OrderLineItem } from '../types';

export interface WooOrderResponse {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
}

export interface WooAddress {
  first_name: string;
  last_name: string;
  email?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
}

export interface CreateWooOrderInput {
  items: OrderLineItem[];
  paymentMethod?: 'venmo' | 'zelle';
  customerNote?: string;
  billing?: WooAddress;
  shipping?: Omit<WooAddress, 'email' | 'phone'>;
  shippingTotal?: number;
  shippingMethodId?: string;
  shippingMethodTitle?: string;
}

/**
 * Creates an order in WooCommerce via the REST API.
 *
 * The WooCommerce REST API rejects order creation with an
 * "Invalid parameter(s): billing" error when the `billing` object is
 * omitted or invalid, so we always send a minimal, schema-valid billing
 * block. All fields are strings — WooCommerce validates the shape, not
 * just the email.
 */
export async function createWooOrder(
  input: CreateWooOrderInput
): Promise<WooOrderResponse> {
  const line_items = input.items
    .filter((i) => typeof i.wooId === 'number' && Number.isFinite(i.wooId))
    .map((i) => ({
      product_id: i.wooId as number,
      quantity: i.quantity,
    }));

  const billing = input.billing ?? {
    first_name: 'Customer',
    last_name: 'Guest',
    email: 'customer@helixamino.com',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US',
    phone: '',
  };

  const shipping = input.shipping ?? {
    first_name: billing.first_name,
    last_name: billing.last_name,
    address_1: billing.address_1,
    address_2: billing.address_2 ?? '',
    city: billing.city,
    state: billing.state,
    postcode: billing.postcode,
    country: billing.country,
  };

  const payload: Record<string, unknown> = {
    status: 'pending',
    set_paid: false,
    payment_method: input.paymentMethod ?? 'venmo_zelle',
    payment_method_title:
      input.paymentMethod === 'zelle'
        ? 'Zelle (off-platform)'
        : input.paymentMethod === 'venmo'
        ? 'Venmo (off-platform)'
        : 'Venmo / Zelle (off-platform)',
    billing,
    shipping,
    line_items,
    customer_note: input.customerNote ?? '',
  };

  if (typeof input.shippingTotal === 'number' && input.shippingMethodId) {
    payload.shipping_lines = [
      {
        method_id: input.shippingMethodId,
        method_title: input.shippingMethodTitle ?? 'Shipping',
        total: input.shippingTotal.toFixed(2),
      },
    ];
  }

  return apiFetch<WooOrderResponse>('/wc/v3/orders', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}
