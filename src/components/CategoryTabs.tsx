import { CATEGORIES } from '../data/products';

interface Props {
  active: string;
  onChange: (cat: string) => void;
  counts: Record<string, number>;
}

export function CategoryTabs({ active, onChange, counts }: Props) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1 min-w-max px-4 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat;
          const count = cat === 'All' ? counts['All'] : (counts[cat] ?? 0);
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500 text-white shadow-[0_0_14px_rgba(0,212,255,0.35)]'
                  : 'bg-[#07111d] border border-cyan-900/30 text-gray-400 hover:text-white hover:border-cyan-700/60'
              }`}
            >
              {cat}
              <span
                className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-cyan-900/40 text-cyan-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
