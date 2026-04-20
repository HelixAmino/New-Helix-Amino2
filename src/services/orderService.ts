import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';
import { Order, OrderLineItem } from '../types';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

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
  console.log('[orderService] sendOrderBackupEmail start', {
    order_number: order.order_number,
    items: order.items?.length,
  });

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error('EmailJS is not configured (missing VITE_EMAILJS_* env vars)');
  }

  const currency = order.currency ?? 'USD';
  const itemsText = order.items
    .map((i) => {
      const sku = i.wooId != null ? String(i.wooId) : i.productId;
      return `- ${i.name} | SKU ${sku} | qty ${i.quantity} | ${currency} ${i.lineTotal.toFixed(2)}`;
    })
    .join('\n');

  const templateParams = {
    to_email: 'orderbackups@helixamino.com',
    order_id: order.id,
    order_number: order.order_number,
    payment_method: order.payment_method ?? 'unpaid',
    customer_name: order.customer_name ?? '',
    customer_email: order.customer_email ?? '',
    notes: order.notes ?? '',
    currency,
    total: order.total.toFixed(2),
    subtotal: (order.subtotal ?? order.total).toFixed(2),
    items_count: order.items.reduce((s, i) => s + i.quantity, 0),
    items_text: itemsText,
    submitted_at: new Date().toISOString(),
  };

  console.log('[orderService] EmailJS send', { templateParams });

  const res = await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    { publicKey: EMAILJS_PUBLIC_KEY }
  );

  console.log('[orderService] EmailJS response', res.status, res.text);

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`EmailJS failed: ${res.status} ${res.text}`);
  }
}
