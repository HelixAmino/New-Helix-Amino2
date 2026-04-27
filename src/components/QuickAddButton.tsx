import { useState } from 'react';
import { Plus, Check, Loader as Loader2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  label?: string;
  className?: string;
}

export function QuickAddButton({ product, label = 'Quick Add', className = '' }: Props) {
  const { addItem } = useCart();
  const [state, setState] = useState<'idle' | 'loading' | 'added'>('idle');

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (state !== 'idle') return;
    setState('loading');
    try {
      await addItem(product, 1);
      setState('added');
      setTimeout(() => setState('idle'), 1400);
    } catch {
      setState('idle');
    }
  }

  const isAdded = state === 'added';
  const isLoading = state === 'loading';

  return (
    <button
      onClick={handleClick}
      aria-label={`${label} ${product.name}`}
      className={`absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 pl-2.5 pr-3 py-2 rounded-full text-xs font-bold tracking-wide shadow-[0_8px_24px_rgba(0,212,255,0.35)] backdrop-blur-md border transition-all duration-300 active:scale-90 ${
        isAdded
          ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_8px_24px_rgba(16,185,129,0.45)]'
          : 'bg-cyan-500/90 border-cyan-300/50 text-white hover:bg-cyan-400 hover:shadow-[0_10px_30px_rgba(0,212,255,0.55)]'
      } ${className}`}
    >
      <span className="relative flex items-center justify-center w-4 h-4">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
        ) : isAdded ? (
          <Check className="w-4 h-4" strokeWidth={3} />
        ) : (
          <Plus className="w-4 h-4" strokeWidth={3} />
        )}
      </span>
      <span>{isAdded ? 'Added' : label}</span>
    </button>
  );
}
