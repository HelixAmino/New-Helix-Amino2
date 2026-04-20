import { apiFetch } from '../lib/api';
import { OrderLineItem } from '../types';

export interface WooOrderResponse {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
}

export interface CreateWooOrderInput {
  items: OrderLineItem[];
  paymentMethod?: 'venmo' | 'zelle';
  customerNote?: string;
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

  const billing = {
    first_name: 'Customer',
    last_name: 'Guest',
    email: 'mailto:customer@helixamino.com',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US',
    phone: '',
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
    line_items,
    customer_note: input.customerNote ?? '',
  };

  return apiFetch<WooOrderResponse>('/wc/v3/orders', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}
