import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { CartItem, Order, OrderLineItem, Product } from '../types';
import { PRODUCTS, getDiscountedPrice } from '../data/products';
import { MEMBERS_PRODUCTS } from '../data/membersProducts';
import * as cocart from '../services/cocart';
import { getCartKey } from '../lib/api';
import { createOrder } from '../services/orderService';
import { createWooOrder } from '../services/wooOrders';
import { loadProductMap, getSkuForWooId, getWooIdForSku } from '../services/productMap';
import { supabase } from '../lib/supabase';

export const SHIPPING_FLAT = 5;

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
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

const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...MEMBERS_PRODUCTS];

function findProductByWooId(wooId: number): Product | undefined {
  const direct = ALL_PRODUCTS.find((p) => p.wooId === wooId);
  if (direct) return direct;
  const sku = getSkuForWooId(wooId);
  if (!sku) return undefined;
  return ALL_PRODUCTS.find((p) => p.id === sku);
}

function resolveWooId(product: Product): number | undefined {
  if (product.wooId) return product.wooId;
  return getWooIdForSku(product.id);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const itemKeyMap = useRef<Map<string, string>>(new Map());

  const applyCart = useCallback((res: cocart.CoCartResponse) => {
    itemKeyMap.current.clear();
    const next: CartItem[] = [];
    for (const it of res.items ?? []) {
      const product = findProductByWooId(Number(it.id));
      if (!product) continue;
      itemKeyMap.current.set(product.id, it.item_key);
      next.push({ product, quantity: it.quantity.value });
    }
    setItems(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setSyncing(true);
        await loadProductMap();
        const remote = await cocart.getCart();
        if (cancelled) return;
        applyCart(remote);
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyCart]);

  const addItem = useCallback(
    async (product: Product, quantity: number) => {
      await loadProductMap();
      const wooId = resolveWooId(product);
      if (!wooId) throw new Error(`No WooCommerce id for product ${product.id}`);
      setSyncing(true);
      try {
        const res = await cocart.addItem(wooId, quantity);
        applyCart(res);
      } finally {
        setSyncing(false);
      }
    },
    [applyCart],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) {
        await removeItemInternal(productId);
        return;
      }
      const clamped = Math.min(50, quantity);
      const key = itemKeyMap.current.get(productId);
      setSyncing(true);
      try {
        if (key) {
          const res = await cocart.updateItem(key, clamped);
          applyCart(res);
        } else {
          const product = ALL_PRODUCTS.find((p) => p.id === productId);
          if (!product) return;
          const wooId = resolveWooId(product);
          if (!wooId) return;
          const res = await cocart.addItem(wooId, clamped);
          applyCart(res);
        }
      } finally {
        setSyncing(false);
      }
    },
    [applyCart],
  );

  const removeItemInternal = useCallback(
    async (productId: string) => {
      const key = itemKeyMap.current.get(productId);
      if (!key) {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
        return;
      }
      setSyncing(true);
      try {
        const res = await cocart.removeItem(key);
        applyCart(res);
      } finally {
        setSyncing(false);
      }
    },
    [applyCart],
  );

  const removeItem = removeItemInternal;

  const clearCart = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await cocart.clearCart();
      applyCart(res);
    } finally {
      setSyncing(false);
    }
  }, [applyCart]);

  const buildLineItems = (): OrderLineItem[] =>
    items.map((item) => {
      const unit = +getDiscountedPrice(item.product.price, item.quantity).toFixed(2);
      return {
        productId: item.product.id,
        wooId: resolveWooId(item.product),
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
