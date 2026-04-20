import { supabase } from '../lib/supabase';
import { Order, OrderLineItem } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

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

  const { data, error } = await supabase.rpc('create_order', {
    p_order_number: order_number,
    p_user_id: input.userId,
    p_cart_key: input.cartKey,
    p_items: input.items,
    p_subtotal: input.subtotal,
    p_total: input.total,
    p_customer_name: input.customerName ?? '',
    p_customer_email: input.customerEmail ?? '',
  });

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

export async function sendOrderBackupEmail(order: Order): Promise<void> {
  const payload = {
    order_number: order.order_number,
    subtotal: order.subtotal,
    total: order.total,
    currency: order.currency,
    payment_method: order.payment_method,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    notes: order.notes,
    cart_key: order.cart_key,
    submitted_at: new Date().toISOString(),
    items: order.items.map((i) => ({
      productId: i.productId,
      wooId: i.wooId,
      sku: i.wooId != null ? String(i.wooId) : i.productId,
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal,
    })),
  };

  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/notify-order-backup`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Backup email failed: ${res.status} ${detail}`);
  }
}
