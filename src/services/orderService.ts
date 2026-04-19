import { supabase } from '../lib/supabase';
import { Order, OrderLineItem } from '../types';

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `HA-${stamp}${rand}`;
}

export interface CreateOrderInput {
  items: OrderLineItem[];
  subtotal: number;
  total: number;
  cartKey: string;
  userId: string | null;
  customerName?: string;
  customerEmail?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const order_number = generateOrderNumber();

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number,
      user_id: input.userId,
      cart_key: input.cartKey,
      items: input.items,
      subtotal: input.subtotal,
      total: input.total,
      currency: 'USD',
      payment_method: 'unpaid',
      payment_status: 'pending',
      customer_name: input.customerName ?? '',
      customer_email: input.customerEmail ?? '',
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to create order');
  return data as Order;
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
