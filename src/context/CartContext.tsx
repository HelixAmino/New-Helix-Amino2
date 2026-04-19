import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { CartItem, Order, OrderLineItem, Product } from '../types';
import { getDiscountedPrice, PRODUCTS } from '../data/products';
import { createOrder } from '../services/orderService';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'helix_cart_v1';

interface StoredCartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<Order>;
  totalItems: number;
  grandTotal: number;
  syncing: boolean;
  checkoutLoading: boolean;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCartItem[];
    const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
    return parsed
      .map((s) => {
        const product = byId.get(s.productId);
        if (!product) return null;
        return { product, quantity: Math.max(1, Math.min(50, s.quantity)) };
      })
      .filter((x): x is CartItem => x !== null);
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    const stored: StoredCartItem[] = items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* ignore */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage());
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

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
      return [...prev, { product, quantity: Math.min(50, quantity) }];
    });
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
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
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
      const lineItems = buildLineItems();
      const subtotal = +lineItems.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
      const total = subtotal;

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user ?? null;

      const order = await createOrder({
        items: lineItems,
        subtotal,
        total,
        userId: user?.id ?? null,
        customerName:
          (user?.user_metadata?.full_name as string | undefined) ?? '',
        customerEmail: user?.email ?? '',
      });

      setActiveOrder(order);
      return order;
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const grandTotal = items.reduce((sum, i) => {
    const discounted = getDiscountedPrice(i.product.price, i.quantity);
    return sum + discounted * i.quantity;
  }, 0);

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
        grandTotal,
        syncing: false,
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
