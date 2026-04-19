import { supabase } from '../lib/supabase';
import { Order, OrderLineItem } from '../types';

export interface CreateOrderInput {
  items: OrderLineItem[];
  subtotal: number;
  total: number;
  userId: string | null;
  customerName?: string;
  customerEmail?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-woo-order`;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      (data && (data.error || data.message)) ||
        `Checkout failed (${res.status})`
    );
  }

  if (!data?.order) {
    throw new Error('Order creation returned no data');
  }

  return data.order as Order;
}

export async function markOrderSubmitted(
  orderId: string,
  paymentMethod: 'venmo' | 'zelle',
  notes: string
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({
      payment_method: paymentMethod,
      payment_status: 'submitted',
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) throw error;
}
