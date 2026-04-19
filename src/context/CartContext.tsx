import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { CartItem, Product } from '../types';
import { getDiscountedPrice } from '../data/products';
import * as cocart from '../services/cocart';
import { getCheckoutUrl } from '../services/cocart';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  totalItems: number;
  grandTotal: number;
  syncing: boolean;
  checkoutLoading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function wooId(product: Product): string {
  return String(product.wooId ?? product.id);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
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
        /* silent: offline or unauthenticated */
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
      .catch(() => {
        /* ignore - local state keeps cart usable */
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
    try {
      await cocart.clearCart().catch(() => undefined);
      itemKeyMap.current.clear();
      for (const item of items) {
        const id = wooId(item.product);
        const res = await cocart.addItem(id, item.quantity);
        const match = res.items?.find((it) => String(it.id) === id);
        if (match) itemKeyMap.current.set(id, match.item_key);
      }
    } catch (e) {
      throw e instanceof Error ? e : new Error('Failed to sync cart');
    }
  };

  const checkout = async () => {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    try {
      await syncAllToCocart();
      window.location.href = getCheckoutUrl();
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
        syncing,
        checkoutLoading,
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
