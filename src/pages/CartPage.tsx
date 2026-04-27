import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, Tag, Loader as Loader2, RefreshCw, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { getDiscountedPrice, getDiscountLabel } from '../data/products';

export function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    itemsSubtotal,
    shipping,
    tax,
    discount,
    grandTotal,
    hasCalculatedShipping,
    needsShipping,
    coupons,
    shippingRates,
    selectShipping,
    applyCoupon,
    removeCoupon,
    refreshCart,
    couponError,
    syncing,
    totalItems,
    checkout,
    checkoutLoading,
  } = useCart();
  const { navigate } = useNavigation();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

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
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-200 font-semibold">
                  {hasCalculatedShipping && shipping > 0
                    ? `$${shipping.toFixed(2)}`
                    : hasCalculatedShipping && shipping === 0
                      ? 'Free'
                      : needsShipping
                        ? 'Select method'
                        : '—'}
                </span>
              </div>
              {shippingRates.length > 0 && (
                <div className="rounded-xl border border-cyan-900/30 bg-[#050d14]/60 p-2 mt-1 space-y-1">
                  {shippingRates.map((rate) => (
                    <label
                      key={rate.key}
                      className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                        rate.chosen ? 'bg-cyan-950/50 border border-cyan-700/50' : 'border border-transparent hover:bg-cyan-950/20'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <input
                          type="radio"
                          name="shipping-method"
                          checked={rate.chosen}
                          onChange={() => selectShipping(rate.key)}
                          disabled={syncing}
                          className="accent-cyan-500"
                        />
                        <span className="text-gray-200 text-xs font-semibold truncate">{rate.label}</span>
                      </span>
                      <span className="text-cyan-300 text-xs font-bold shrink-0">
                        {rate.cost > 0 ? `$${rate.cost.toFixed(2)}` : 'Free'}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-200 font-semibold">${tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-cyan-900/20">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-white font-black text-2xl">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {checkoutError && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
                {checkoutError}
              </p>
            )}
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-95 mb-3 flex items-center justify-center gap-2"
            >
              {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {checkoutLoading ? 'Preparing checkout…' : 'Proceed to Checkout'}
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
