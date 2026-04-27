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
import { fetchStoreShipping, selectStoreShipping, StoreRate } from '../services/storeApi';
import { getCartKey } from '../lib/api';
import { createOrder } from '../services/orderService';
import { createWooOrder } from '../services/wooOrders';
import { loadProductMap, getSkuForWooId, getWooIdForSku } from '../services/productMap';
import { supabase } from '../lib/supabase';

export interface AppliedCoupon {
  code: string;
  label?: string;
  discount: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

const EMPTY_CUSTOMER: CustomerInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'US',
};

const CUSTOMER_STORAGE_KEY = 'helix:customer';

function loadCustomerInfo(): CustomerInfo {
  if (typeof window === 'undefined') return EMPTY_CUSTOMER;
  try {
    const raw = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!raw) return EMPTY_CUSTOMER;
    const parsed = JSON.parse(raw) as Partial<CustomerInfo>;
    return { ...EMPTY_CUSTOMER, ...parsed };
  } catch {
    return EMPTY_CUSTOMER;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
  checkout: () => Promise<Order>;
  totalItems: number;
  itemsSubtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  grandTotal: number;
  hasCalculatedShipping: boolean;
  needsShipping: boolean;
  coupons: AppliedCoupon[];
  shippingRates: ShippingRate[];
  selectShipping: (rateKey: string) => Promise<void>;
  computeShipping: (address?: { country?: string; state?: string; postcode?: string; city?: string }) => Promise<void>;
  customer: CustomerInfo;
  setCustomer: (info: CustomerInfo) => void;
  syncing: boolean;
  couponError: string | null;
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

function num(v: unknown): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v !== 'string' || v.length === 0) return 0;
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return 0;
  return /[.,]/.test(v) ? n : n / 100;
}

export interface ShippingRate {
  key: string;
  label: string;
  cost: number;
  chosen: boolean;
}

interface ServerTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  hasCalculatedShipping: boolean;
  needsShipping: boolean;
  coupons: AppliedCoupon[];
  shippingRates: ShippingRate[];
}

const EMPTY_TOTALS: ServerTotals = {
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 0,
  hasCalculatedShipping: false,
  needsShipping: false,
  coupons: [],
  shippingRates: [],
};

function readShippingRates(res: cocart.CoCartResponse): ShippingRate[] {
  const packages = res.shipping?.packages;
  if (!packages) return [];
  const pkgList = Array.isArray(packages) ? packages : Object.values(packages);
  const out: ShippingRate[] = [];
  const seen = new Set<string>();
  for (const pkg of pkgList) {
    const rates = pkg.rates;
    if (!rates) continue;
    const rateEntries = Array.isArray(rates)
      ? rates.map((r) => [r.key ?? r.method_id, r] as const)
      : Object.entries(rates);
    for (const [k, r] of rateEntries) {
      const key = String(k);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        key,
        label: r.label ?? key,
        cost: num(r.cost),
        chosen: Boolean(r.chosen_method) || pkg.chosen_method === key,
      });
    }
  }
  return out;
}

function readServerTotals(res: cocart.CoCartResponse): ServerTotals {
  const t = res.totals ?? ({} as cocart.CoCartResponse['totals']);
  const coupons: AppliedCoupon[] = (res.coupons ?? []).map((c) => ({
    code: c.coupon,
    label: c.label,
    discount: num(c.saving ?? c.discount_amount),
  }));
  return {
    subtotal: num(t.subtotal),
    shipping: num(t.shipping_total) + num(t.shipping_tax),
    tax: num(t.tax_total),
    discount: num(t.discount_total),
    total: num(t.total),
    hasCalculatedShipping: Boolean(res.shipping?.has_calculated_shipping),
    needsShipping: Boolean(res.needs_shipping),
    coupons,
    shippingRates: readShippingRates(res),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [serverTotals, setServerTotals] = useState<ServerTotals>(EMPTY_TOTALS);
  const [syncing, setSyncing] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [customer, setCustomerState] = useState<CustomerInfo>(() => loadCustomerInfo());
  const itemKeyMap = useRef<Map<string, string>>(new Map());

  const setCustomer = useCallback((info: CustomerInfo) => {
    setCustomerState(info);
    try {
      window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(info));
    } catch {
      /* ignore */
    }
  }, []);

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
    setServerTotals(readServerTotals(res));
  }, []);

  const applyWithShippingRecalc = useCallback(
    async (res: cocart.CoCartResponse) => {
      applyCart(res);
    },
    [applyCart],
  );

  const refreshCart = useCallback(async () => {
    setSyncing(true);
    try {
      const remote = await cocart.getCart();
      applyCart(remote);
    } finally {
      setSyncing(false);
    }
  }, [applyCart]);

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
        await applyWithShippingRecalc(res);
      } finally {
        setSyncing(false);
      }
    },
    [applyWithShippingRecalc],
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
        await applyWithShippingRecalc(res);
      } finally {
        setSyncing(false);
      }
    },
    [applyWithShippingRecalc],
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
          await applyWithShippingRecalc(res);
        } else {
          const product = ALL_PRODUCTS.find((p) => p.id === productId);
          if (!product) return;
          const wooId = resolveWooId(product);
          if (!wooId) return;
          const res = await cocart.addItem(wooId, clamped);
          await applyWithShippingRecalc(res);
        }
      } finally {
        setSyncing(false);
      }
    },
    [applyWithShippingRecalc, removeItemInternal],
  );

  const removeItem = removeItemInternal;

  const applyStoreRates = useCallback((rates: StoreRate[], needsShipping: boolean) => {
    const mapped = rates.map((r) => ({
      key: r.key,
      label: r.label,
      cost: r.cost,
      chosen: r.selected,
    }));
    setServerTotals((prev) => {
      const chosen = mapped.find((r) => r.chosen);
      const shippingTotal = chosen ? chosen.cost : 0;
      return {
        ...prev,
        shipping: shippingTotal,
        hasCalculatedShipping: mapped.length > 0,
        needsShipping,
        shippingRates: mapped,
      };
    });
  }, []);

  const computeShipping = useCallback(
    async (address?: { country?: string; state?: string; postcode?: string; city?: string }) => {
      const wooItems = items
        .map((it) => ({ wooId: resolveWooId(it.product) ?? 0, quantity: it.quantity }))
        .filter((i) => i.wooId > 0);
      if (wooItems.length === 0) return;
      setSyncing(true);
      try {
        const result = await fetchStoreShipping(wooItems, {
          country: address?.country ?? 'US',
          state: address?.state ?? '',
          postcode: address?.postcode ?? '',
          city: address?.city ?? '',
        });
        applyStoreRates(result.rates, result.needsShipping);
      } finally {
        setSyncing(false);
      }
    },
    [items, applyStoreRates],
  );

  const selectShipping = useCallback(
    async (rateKey: string) => {
      setSyncing(true);
      try {
        const result = await selectStoreShipping(rateKey);
        applyStoreRates(result.rates, result.needsShipping);
      } finally {
        setSyncing(false);
      }
    },
    [applyStoreRates],
  );

  const clearCart = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await cocart.clearCart();
      await applyWithShippingRecalc(res);
    } finally {
      setSyncing(false);
    }
  }, [applyWithShippingRecalc]);

  const applyCouponCode = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) return;
      setSyncing(true);
      setCouponError(null);
      try {
        const res = await cocart.applyCoupon(trimmed);
        await applyWithShippingRecalc(res);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Coupon could not be applied.';
        setCouponError(msg);
      } finally {
        setSyncing(false);
      }
    },
    [applyWithShippingRecalc],
  );

  const removeCouponCode = useCallback(
    async (code: string) => {
      setSyncing(true);
      try {
        const res = await cocart.removeCoupon(code);
        await applyWithShippingRecalc(res);
      } finally {
        setSyncing(false);
      }
    },
    [applyWithShippingRecalc],
  );

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

  const localSubtotal = items.reduce((sum, i) => {
    const discounted = getDiscountedPrice(i.product.price, i.quantity);
    return sum + discounted * i.quantity;
  }, 0);

  const itemsSubtotal = serverTotals.subtotal > 0 ? serverTotals.subtotal : localSubtotal;
  const shipping = serverTotals.shipping;
  const tax = serverTotals.tax;
  const discount = serverTotals.discount;
  const grandTotal =
    serverTotals.total > 0
      ? serverTotals.total
      : Math.max(0, itemsSubtotal + shipping + tax - discount);

  const checkout = async (): Promise<Order> => {
    if (items.length === 0) throw new Error('Your cart is empty');
    if (!customer.firstName || !customer.lastName || !customer.address1 || !customer.city || !customer.state || !customer.postcode || !customer.country) {
      throw new Error('Please complete your shipping address before checking out.');
    }
    if (!customer.email) {
      throw new Error('Please enter an email address so we can send your order confirmation.');
    }
    setCheckoutLoading(true);
    try {
      const lineItems = buildLineItems();
      const subtotalAmt = +lineItems.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
      const total = +grandTotal.toFixed(2);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user ?? null;
      const chosenRate = serverTotals.shippingRates.find((r) => r.chosen);

      let wooOrderNumber: string | null = null;
      try {
        const woo = await createWooOrder({
          items: lineItems,
          billing: {
            first_name: customer.firstName,
            last_name: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            address_1: customer.address1,
            address_2: customer.address2,
            city: customer.city,
            state: customer.state,
            postcode: customer.postcode,
            country: customer.country,
          },
          shipping: {
            first_name: customer.firstName,
            last_name: customer.lastName,
            address_1: customer.address1,
            address_2: customer.address2,
            city: customer.city,
            state: customer.state,
            postcode: customer.postcode,
            country: customer.country,
          },
          shippingTotal: serverTotals.shipping,
          shippingMethodId: chosenRate?.key.split(':')[0],
          shippingMethodTitle: chosenRate?.label,
        });
        wooOrderNumber = woo?.number ? String(woo.number) : String(woo.id);
      } catch (err) {
        console.warn('[checkout] WooCommerce order creation failed', err);
      }

      const fullName = `${customer.firstName} ${customer.lastName}`.trim();
      const order = await createOrder({
        items: lineItems,
        subtotal: subtotalAmt,
        total,
        cartKey: getCartKey() ?? '',
        userId: user?.id ?? null,
        customerName: fullName || (user?.user_metadata?.full_name as string | undefined) || '',
        customerEmail: customer.email || user?.email || '',
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

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        applyCoupon: applyCouponCode,
        removeCoupon: removeCouponCode,
        checkout,
        totalItems,
        itemsSubtotal,
        shipping,
        tax,
        discount,
        grandTotal,
        hasCalculatedShipping: serverTotals.hasCalculatedShipping,
        needsShipping: serverTotals.needsShipping,
        coupons: serverTotals.coupons,
        shippingRates: serverTotals.shippingRates,
        selectShipping,
        computeShipping,
        customer,
        setCustomer,
        syncing,
        couponError,
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
