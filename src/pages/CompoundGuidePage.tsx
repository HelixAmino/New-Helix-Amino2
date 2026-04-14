import { BookMarked, Search, X, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getProductGroups } from '../data/products';
import { useNavigation } from '../context/NavigationContext';

const CATEGORY_COLORS: Record<string, string> = {
  'Recovery & Healing': 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40',
  'GH & Growth Axis': 'text-sky-400 bg-sky-950/40 border-sky-900/40',
  'Metabolic & GLP-1 Related': 'text-amber-400 bg-amber-950/40 border-amber-900/40',
  'Nootropics and Cognition': 'text-violet-400 bg-violet-950/40 border-violet-900/40',
  'Longevity and Mitochondrial': 'text-cyan-400 bg-cyan-950/40 border-cyan-900/40',
  'Hormones & Reproductive': 'text-rose-400 bg-rose-950/40 border-rose-900/40',
  'Blends & Specialty': 'text-teal-400 bg-teal-950/40 border-teal-900/40',
  'Misc / Rare': 'text-gray-400 bg-gray-900/40 border-gray-800/40',
  'Accessories': 'text-orange-400 bg-orange-950/40 border-orange-900/40',
};

export function CompoundGuidePage() {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const allGroups = useMemo(() => getProductGroups(), []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allGroups.map((g) => g.category)));
    return ['All', ...cats];
  }, [allGroups]);

  const filtered = useMemo(() => {
    let list = allGroups;
    if (activeCategory !== 'All') {
      list = list.filter((g) => g.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.baseName.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          (g.cas ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allGroups, activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#050d14]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-cyan-900/30">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-2 bg-cyan-950/50 border border-cyan-800/40 rounded-full px-4 py-1.5 text-cyan-300 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Full Catalog Reference</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Compound{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Guide
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Detailed reference information for every research compound in the Helix Amino catalog, including CAS numbers, molecular weights, and research context.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search compounds, CAS numbers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#07111d] border border-cyan-900/30 text-white rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600 transition-colors duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 shrink-0 ${
                  activeCategory === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-[#07111d] border border-cyan-900/30 text-gray-400 hover:text-white hover:border-cyan-700/40'
                }`}
              >
                {cat === 'All' ? 'All' : cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-xs mb-5">{filtered.length} compound{filtered.length !== 1 ? 's' : ''}</p>

        {/* Compound list */}
        <div className="space-y-3 mb-10">
          {filtered.map((group) => {
            const isOpen = expanded === group.groupId;
            const colorClass = CATEGORY_COLORS[group.category] || 'text-gray-400 bg-gray-900/40 border-gray-800/40';
            const primaryVariant = group.variants[0];

            return (
              <div key={group.groupId} className="bg-[#07111d] border border-cyan-900/20 rounded-xl overflow-hidden hover:border-cyan-900/40 transition-colors duration-200">
                <button
                  onClick={() => setExpanded(isOpen ? null : group.groupId)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <img
                    src={group.image}
                    alt={group.baseName}
                    className="w-10 h-10 rounded-lg object-contain bg-black/30 border border-cyan-900/20 shrink-0 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold text-sm">{group.baseName}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>
                        {group.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 flex-wrap">
                      {group.cas && <span>CAS: {group.cas}</span>}
                      {group.molecularWeight && <span>MW: {group.molecularWeight}</span>}
                      <span>{group.variants.length} variant{group.variants.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-cyan-900/20">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Description</h4>
                        <p className="text-gray-300 text-xs leading-relaxed">{group.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Storage</span>
                          <span className="text-gray-300 text-xs">{primaryVariant.storage}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Form</span>
                          <span className="text-gray-300 text-xs">{primaryVariant.form}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-[10px] uppercase tracking-widest block mb-1">Purity</span>
                          <span className="text-cyan-400 text-xs font-semibold">{primaryVariant.purity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-cyan-900/20">
                      {group.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => navigate('product', v.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/10 border border-cyan-700/40 hover:bg-cyan-600/20 hover:border-cyan-600/60 rounded-lg text-cyan-400 text-xs font-medium transition-all duration-150"
                        >
                          <FlaskConical className="w-3 h-3" />
                          {v.quantityLabel} — ${v.price}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No compounds found.</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
                className="mt-3 text-cyan-400 text-sm hover:text-white transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4">
          <p className="text-red-300/70 text-xs leading-relaxed text-center">
            <strong className="text-red-400">RESEARCH USE ONLY:</strong> All compound information is provided for scientific reference only. Products are for in-vitro laboratory research only. Not for human consumption or clinical use. None of these compounds have been evaluated by the FDA.
          </p>
        </div>
      </div>
    </div>
  );
}
