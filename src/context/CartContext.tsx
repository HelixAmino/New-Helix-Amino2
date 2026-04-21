import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { CartItem, Order, OrderLineItem, Product } from '../types';
import { getDiscountedPrice } from '../data/products';
import * as cocart from '../services/cocart';
import { getCartKey } from '../lib/api';
import { createOrder } from '../services/orderService';
import { createWooOrder } from '../services/wooOrders';
import { supabase } from '../lib/supabase';

export const SHIPPING_FLAT = 5;

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<Order>;
  totalItems: number;
  itemsSubtotal: number;
  shipping: number;
  grandTotal: number;
  syncing: boolean;
  checkoutLoading: boolean;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function wooId(product: Product): string {
  return String(product.wooId ?? product.id);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const itemKeyMap = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setSyncing(true);
        const remote = await cocart.getCart();
        if (cancelled) return;
        for (const it of remote.items ?? []) {
          itemKeyMap.current.set(String(it.id), it.item_key);
        }
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = (product: Product, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(50, i.quantity + quantity) }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });

    void cocart
      .addItem(wooId(product), quantity)
      .then((res) => {
        const match = res.items?.find(
          (it) => String(it.id) === wooId(product)
        );
        if (match) itemKeyMap.current.set(wooId(product), match.item_key);
      })
      .catch(() => {});
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    const clamped = Math.min(50, quantity);
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: clamped } : i
      )
    );

    const item = items.find((i) => i.product.id === productId);
    if (!item) return;
    const id = wooId(item.product);
    const key = itemKeyMap.current.get(id);
    if (key) {
      void cocart.updateItem(key, clamped).catch(() => {});
    } else {
      void cocart
        .addItem(id, clamped)
        .then((res) => {
          const match = res.items?.find((it) => String(it.id) === id);
          if (match) itemKeyMap.current.set(id, match.item_key);
        })
        .catch(() => {});
    }
  };

  const removeItem = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (!item) return;
    const id = wooId(item.product);
    const key = itemKeyMap.current.get(id);
    if (key) {
      void cocart.removeItem(key).catch(() => {});
      itemKeyMap.current.delete(id);
    }
  };

  const clearCart = () => {
    setItems([]);
    itemKeyMap.current.clear();
    void cocart.clearCart().catch(() => {});
  };

  const syncAllToCocart = async () => {
    await cocart.clearCart().catch(() => undefined);
    itemKeyMap.current.clear();
    for (const item of items) {
      const id = wooId(item.product);
      const res = await cocart.addItem(id, item.quantity);
      const match = res.items?.find((it) => String(it.id) === id);
      if (match) itemKeyMap.current.set(id, match.item_key);
    }
  };

  const buildLineItems = (): OrderLineItem[] =>
    items.map((item) => {
      const unit = +getDiscountedPrice(item.product.price, item.quantity).toFixed(2);
      return {
        productId: item.product.id,
        wooId: item.product.wooId,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: unit,
        lineTotal: +(unit * item.quantity).toFixed(2),
      };
    });

  const checkout = async (): Promise<Order> => {
    if (items.length === 0) throw new Error('Your cart is empty');
    setCheckoutLoading(true);
    try {
      await syncAllToCocart();
      const lineItems = buildLineItems();
      const subtotal = +lineItems.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
      const total = +(subtotal + SHIPPING_FLAT).toFixed(2);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user ?? null;

      let wooOrderNumber: string | null = null;
      try {
        const woo = await createWooOrder({ items: lineItems });
        wooOrderNumber = woo?.number ? String(woo.number) : String(woo.id);
      } catch (err) {
        console.warn('[checkout] WooCommerce order creation failed', err);
      }

      const order = await createOrder({
        items: lineItems,
        subtotal,
        total,
        cartKey: getCartKey() ?? '',
        userId: user?.id ?? null,
        customerName:
          (user?.user_metadata?.full_name as string | undefined) ?? '',
        customerEmail: user?.email ?? '',
      });

      const merged: Order = wooOrderNumber
        ? { ...order, order_number: wooOrderNumber }
        : order;

      setActiveOrder(merged);
      return merged;
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const itemsSubtotal = items.reduce((sum, i) => {
    const discounted = getDiscountedPrice(i.product.price, i.quantity);
    return sum + discounted * i.quantity;
  }, 0);

  const shipping = items.length > 0 ? SHIPPING_FLAT : 0;
  const grandTotal = itemsSubtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
        totalItems,
        itemsSubtotal,
        shipping,
        grandTotal,
        syncing,
        checkoutLoading,
        activeOrder,
        setActiveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
