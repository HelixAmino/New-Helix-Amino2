import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';

export function FloatingCartButton() {
  const { totalItems, grandTotal } = useCart();
  const { navigate, page } = useNavigation();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (totalItems === 0) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 450);
    return () => clearTimeout(t);
  }, [totalItems]);

  if (totalItems === 0) return null;
  if (page === 'cart' || page === 'checkout') return null;

  return (
    <button
      onClick={() => navigate('cart')}
      aria-label={`View cart, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
      className="fixed left-3 sm:left-5 bottom-20 sm:bottom-24 z-50 group flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold shadow-[0_10px_30px_rgba(0,212,255,0.35)] hover:shadow-[0_14px_40px_rgba(0,212,255,0.55)] hover:from-cyan-400 hover:to-teal-400 transition-all duration-300 active:scale-95"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <span className="relative flex items-center justify-center">
        <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
        <span
          className={`absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full bg-white text-cyan-700 text-[11px] font-bold flex items-center justify-center shadow-sm ring-2 ring-cyan-500 transition-transform duration-300 ${pulse ? 'scale-125' : 'scale-100'}`}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-[0.14em] text-white/80">Cart</span>
        <span className="text-sm font-bold">${grandTotal.toFixed(2)}</span>
      </span>
    </button>
  );
}
