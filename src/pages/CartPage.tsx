import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, Tag, Loader as Loader2, RefreshCw, X, MapPin, Truck } from 'lucide-react';
import { useCart, CustomerInfo } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { getDiscountedPrice, getDiscountLabel } from '../data/products';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

export function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    itemsSubtotal,
    tax,
    discount,
    coupons,
    applyCoupon,
    removeCoupon,
    refreshCart,
    couponError,
    syncing,
    totalItems,
    checkout,
    checkoutLoading,
    customer,
    setCustomer,
    computeShipping,
    selectShipping,
    shipping,
    shippingRates,
    hasCalculatedShipping,
  } = useCart();
  const { navigate } = useNavigation();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const addressComplete =
    !!customer.firstName.trim() &&
    !!customer.lastName.trim() &&
    !!customer.email.trim() &&
    !!customer.address1.trim() &&
    !!customer.city.trim() &&
    !!customer.state.trim() &&
    !!customer.postcode.trim() &&
    !!customer.country.trim();

  const shippingReady = hasCalculatedShipping && shippingRates.length > 0;
  const chosenRate = shippingRates.find((r) => r.chosen);

  function updateCustomerField<K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) {
    setCustomer({ ...customer, [key]: value });
  }

  async function handleCalculateShipping() {
    if (!addressComplete || calculatingShipping) return;
    setShippingError(null);
    setCalculatingShipping(true);
    try {
      await computeShipping({
        country: customer.country,
        state: customer.state,
        postcode: customer.postcode,
        city: customer.city,
      });
    } catch (e) {
      setShippingError(e instanceof Error ? e.message : 'Could not calculate shipping. Try again.');
    } finally {
      setCalculatingShipping(false);
    }
  }

  async function handleSelectRate(key: string) {
    try {
      await selectShipping(key);
    } catch (e) {
      setShippingError(e instanceof Error ? e.message : 'Could not switch shipping method.');
    }
  }

  useEffect(() => {
    if (!addressComplete || calculatingShipping || hasCalculatedShipping) return;
    handleCalculateShipping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleApplyCoupon() {
    if (!couponInput.trim() || applyingCoupon) return;
    setApplyingCoupon(true);
    try {
      await applyCoupon(couponInput);
      setCouponInput('');
    } finally {
      setApplyingCoupon(false);
    }
  }

  async function handleCheckout() {
    setCheckoutError(null);
    try {
      await checkout();
      navigate('checkout');
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : 'Unable to start checkout. Please try again.');
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-700 mx-auto mb-5" />
        <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add research compounds to get started.</p>
        <button
          onClick={() => navigate('home')}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-xl text-sm hover:from-cyan-500 hover:to-teal-500 transition-all duration-200 active:scale-95"
        >
          Browse Compounds
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
      {/* Back */}
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 text-sm mb-8 transition-colors duration-200 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Continue Shopping
      </button>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-black text-white">
          Shopping Cart
          <span className="text-gray-500 font-normal text-base ml-2">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
        </h1>
        <button
          onClick={() => refreshCart()}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing…' : 'Sync cart'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 pb-2 border-b border-cyan-900/20">
            <span className="text-gray-600 text-xs font-semibold uppercase tracking-widest">Product</span>
            <span className="text-gray-600 text-xs font-semibold uppercase tracking-widest text-center w-28">Quantity</span>
            <span className="text-gray-600 text-xs font-semibold uppercase tracking-widest text-right w-20">Price</span>
            <span className="text-gray-600 text-xs font-semibold uppercase tracking-widest text-right w-8"></span>
          </div>

          {items.map((item) => {
            const discounted = getDiscountedPrice(item.product.price, item.quantity);
            const subtotal = +(discounted * item.quantity).toFixed(2);
            const discountLabel = getDiscountLabel(item.quantity);

            return (
              <div
                key={item.product.id}
                className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-4 transition-all duration-200 hover:border-cyan-900/40"
              >
                <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-start sm:items-center">
                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate('product', item.product.id)}
                      className="text-white font-bold text-sm hover:text-cyan-300 transition-colors text-left leading-tight block"
                    >
                      {item.product.name}
                    </button>
                    <p className="text-gray-500 text-xs mt-0.5">{item.product.quantityLabel}</p>
                    {discountLabel && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 rounded-full px-2 py-0.5">
                        <Tag className="w-2.5 h-2.5" />
                        {discountLabel}
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center bg-[#050d14] border border-cyan-900/30 rounded-xl overflow-hidden w-28">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-950/40 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 text-center text-white font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= 50}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-950/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right w-20">
                    <div className="text-white font-black text-sm">${subtotal}</div>
                    <div className="text-gray-600 text-xs">${discounted} ea.</div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-950/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-5 sm:p-6 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h2 className="text-white font-bold text-base">Shipping Address</h2>
            </div>
            <p className="text-gray-500 text-xs mb-5">
              Enter your name and shipping address. Shipping is calculated against carrier zones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="First name" required>
                <input type="text" autoComplete="given-name" value={customer.firstName}
                  onChange={(e) => updateCustomerField('firstName', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Last name" required>
                <input type="text" autoComplete="family-name" value={customer.lastName}
                  onChange={(e) => updateCustomerField('lastName', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Email" required>
                <input type="email" autoComplete="email" value={customer.email}
                  onChange={(e) => updateCustomerField('email', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Phone (optional)">
                <input type="tel" autoComplete="tel" value={customer.phone}
                  onChange={(e) => updateCustomerField('phone', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Address" required className="sm:col-span-2">
                <input type="text" autoComplete="address-line1" value={customer.address1}
                  onChange={(e) => updateCustomerField('address1', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Apt / Suite (optional)" className="sm:col-span-2">
                <input type="text" autoComplete="address-line2" value={customer.address2}
                  onChange={(e) => updateCustomerField('address2', e.target.value)} className={inputClass} />
              </Field>
              <Field label="City" required>
                <input type="text" autoComplete="address-level2" value={customer.city}
                  onChange={(e) => updateCustomerField('city', e.target.value)} className={inputClass} />
              </Field>
              <Field label="State" required>
                <select autoComplete="address-level1" value={customer.state}
                  onChange={(e) => updateCustomerField('state', e.target.value)} className={inputClass}>
                  <option value="" className="bg-[#050d14]">Select state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s} className="bg-[#050d14]">{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="ZIP / Postcode" required>
                <input type="text" autoComplete="postal-code" value={customer.postcode}
                  onChange={(e) => updateCustomerField('postcode', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Country" required>
                <select autoComplete="country" value={customer.country}
                  onChange={(e) => updateCustomerField('country', e.target.value)} className={inputClass}>
                  <option value="US" className="bg-[#050d14]">United States</option>
                </select>
              </Field>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button type="button" onClick={handleCalculateShipping}
                disabled={!addressComplete || calculatingShipping}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-900/40 border border-cyan-700/50 hover:bg-cyan-800/50 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-100 text-xs font-bold rounded-lg transition-colors">
                {calculatingShipping && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {shippingReady ? 'Recalculate shipping' : 'Calculate shipping'}
              </button>
              {shippingReady && (
                <span className="text-[11px] text-gray-500">
                  {chosenRate?.label}: <span className="text-cyan-300 font-semibold">{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
                </span>
              )}
            </div>

            {shippingError && (
              <p className="text-red-400 text-[11px] mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {shippingError}
              </p>
            )}

            {shippingReady && shippingRates.length > 0 && (
              <div className="mt-5 border-t border-cyan-900/20 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                  <Truck className="w-3 h-3" /> Shipping Method
                </p>
                <div className="space-y-2">
                  {shippingRates.map((rate) => (
                    <label
                      key={rate.key}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                        rate.chosen
                          ? 'border-cyan-600/60 bg-cyan-950/30'
                          : 'border-cyan-900/30 hover:border-cyan-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="radio"
                          name="shippingRate"
                          checked={rate.chosen}
                          onChange={() => handleSelectRate(rate.key)}
                          className="accent-cyan-500"
                        />
                        <span className="text-xs text-gray-200 font-medium truncate">{rate.label}</span>
                      </div>
                      <span className="text-xs font-bold text-white shrink-0">
                        {rate.cost > 0 ? `$${rate.cost.toFixed(2)}` : 'Free'}
                      </span>
                    </label>
                  ))}
                </div>
                {shippingRates.length === 1 && (
                  <p className="text-[10px] text-gray-600 mt-2 leading-snug">
                    Only one rate is configured for this destination in WooCommerce. Add more rates in Woo &rarr; Shipping Zones if needed.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-6 sticky top-24">
            <h3 className="text-white font-bold text-base mb-5">Order Summary</h3>

            {/* Discount tiers reminder */}
            <div className="bg-cyan-950/20 border border-cyan-900/25 rounded-xl p-3 mb-5">
              <p className="text-cyan-400 text-xs font-bold mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Bulk Savings Applied Per Item
              </p>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between"><span>5–9 qty</span><span className="text-cyan-400 font-semibold">5% off</span></div>
                <div className="flex justify-between"><span>10+ qty</span><span className="text-cyan-400 font-semibold">10% off</span></div>
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2.5 mb-4">
              {items.map((item) => {
                const discounted = getDiscountedPrice(item.product.price, item.quantity);
                const subtotal = +(discounted * item.quantity).toFixed(2);
                return (
                  <div key={item.product.id} className="flex justify-between text-xs">
                    <span className="text-gray-500 flex-1 pr-2 truncate">{item.product.name} ×{item.quantity}</span>
                    <span className="text-gray-300 font-semibold shrink-0">${subtotal}</span>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <div className="border-t border-cyan-900/20 pt-4 mb-4">
              <label className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2 block">
                Discount Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  placeholder="Enter code"
                  className="flex-1 bg-[#050d14] border border-cyan-900/30 rounded-lg px-3 py-2 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-cyan-700 transition-colors uppercase tracking-wider"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponInput.trim()}
                  className="px-3.5 py-2 bg-cyan-900/40 border border-cyan-800/50 hover:bg-cyan-800/40 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-200 text-xs font-bold rounded-lg transition-colors"
                >
                  {applyingCoupon ? '…' : 'Apply'}
                </button>
              </div>
              {couponError && (
                <p className="text-red-400 text-[11px] mt-1.5">{couponError}</p>
              )}
              {coupons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {coupons.map((c) => (
                    <span
                      key={c.code}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-200 bg-cyan-950/50 border border-cyan-800/50 rounded-full pl-2.5 pr-1 py-0.5"
                    >
                      <Tag className="w-3 h-3" />
                      {c.code.toUpperCase()}
                      <button
                        onClick={() => removeCoupon(c.code)}
                        className="ml-0.5 w-4 h-4 rounded-full hover:bg-red-500/20 hover:text-red-300 flex items-center justify-center transition-colors"
                        aria-label={`Remove coupon ${c.code}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-cyan-900/20 pt-4 mb-5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-200 font-semibold">${itemsSubtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-cyan-300 font-semibold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{chosenRate?.label ?? 'Shipping'}</span>
                <span className="text-gray-200 font-semibold">
                  {shippingReady
                    ? shipping > 0
                      ? `$${shipping.toFixed(2)}`
                      : 'Free'
                    : calculatingShipping
                      ? 'Calculating…'
                      : addressComplete
                        ? 'Tap calculate'
                        : 'Enter address'}
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-200 font-semibold">${tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-cyan-900/20">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-white font-black text-2xl">
                  ${Math.max(0, itemsSubtotal + tax - discount + (shippingReady ? shipping : 0)).toFixed(2)}
                </span>
              </div>
            </div>

            {checkoutError && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
                {checkoutError}
              </p>
            )}
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || !addressComplete || !shippingReady}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-95 mb-3 flex items-center justify-center gap-2"
            >
              {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {checkoutLoading
                ? 'Preparing checkout…'
                : !addressComplete
                  ? 'Enter shipping address'
                  : !shippingReady
                    ? 'Calculate shipping to continue'
                    : 'Proceed to Checkout'}
            </button>
            <button
              onClick={() => navigate('home')}
              className="w-full py-3 border border-cyan-900/30 text-gray-400 hover:text-white hover:border-cyan-700/60 font-semibold rounded-xl text-sm transition-all duration-200"
            >
              Continue Shopping
            </button>

            {/* Compliance note */}
            <p className="text-gray-700 text-[10px] mt-4 leading-relaxed text-center">
              All products for laboratory research use only. Not for human consumption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full bg-[#050d14] border border-cyan-900/30 focus:border-cyan-600/60 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors';

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
        {label}
        {required && <span className="text-cyan-400 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
