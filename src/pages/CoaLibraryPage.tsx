import { FileText, ArrowLeft, TriangleAlert as AlertTriangle, ExternalLink, FileCheck2, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { PRODUCTS } from '../data/products';

const EXCLUDED_CATEGORIES = ['Accessories'];
const EXCLUDED_KEYWORDS = [
  'reconstitution water',
  'bacteriostatic water',
  'sterile water',
  'bac water',
];

function isExcluded(product: { category: string; name: string }): boolean {
  if (EXCLUDED_CATEGORIES.includes(product.category)) return true;
  const nameLower = product.name.toLowerCase();
  return EXCLUDED_KEYWORDS.some((kw) => nameLower.includes(kw));
}

const RESEARCH_PRODUCTS = PRODUCTS.filter((p) => !isExcluded(p));

const CATEGORY_ORDER = [
  'Recovery & Healing',
  'GH & Growth Axis',
  'Metabolic & GLP-1 Related',
  'Nootropics and Cognition',
  'Longevity and Mitochondrial',
  'Hormones & Reproductive',
  'Blends & Specialty',
  'Misc / Rare',
];

function groupByCategory(products: typeof RESEARCH_PRODUCTS) {
  const map = new Map<string, typeof RESEARCH_PRODUCTS>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }
  for (const p of products) {
    const arr = map.get(p.category) ?? [];
    arr.push(p);
    map.set(p.category, arr);
  }
  return map;
}

export function CoaLibraryPage() {
  const { navigate } = useNavigation();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? RESEARCH_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  const grouped = groupByCategory(RESEARCH_PRODUCTS);

  return (
    <div className="min-h-screen bg-[#050d14]">
      {/* Top disclaimer banner */}
      <div className="bg-red-950/30 border-b border-red-900/40 px-4 py-3">
        <p className="text-center text-red-300/80 text-xs leading-relaxed max-w-4xl mx-auto">
          <strong className="text-red-400">DISCLAIMER:</strong> All products are strictly for research and laboratory use only. These products have not been evaluated by the FDA. By purchasing, you confirm you are a qualified researcher.
        </p>
      </div>

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
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 text-xs font-medium transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to Catalog
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-cyan-950/50 border border-cyan-800/40 rounded-full px-4 py-1.5 text-cyan-300 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Certificates of Analysis</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3 leading-tight">
            COA Library
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
            Third-party Certificates of Analysis for every research compound. COA PDFs will be added and linked as they become available.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Expansion notice */}
        <div className="bg-cyan-950/20 border border-cyan-900/30 rounded-xl p-4 flex items-start gap-3 mb-8">
          <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-cyan-300/70 text-xs leading-relaxed">
            <strong className="text-cyan-300">Full COA library is being expanded.</strong> New files will be uploaded and linked regularly. Products marked "COA Pending" will be updated as third-party reports are received.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search compounds..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#07111d] border border-cyan-900/30 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-600/50 transition-colors duration-200"
          />
        </div>

        {/* Search results */}
        {filtered ? (
          <div>
            <p className="text-gray-500 text-xs mb-4">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>
            <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl overflow-hidden">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-gray-500 text-sm">No compounds found.</div>
              ) : (
                <CoaTable products={filtered} />
              )}
            </div>
          </div>
        ) : (
          /* Grouped by category */
          <div className="space-y-8">
            {CATEGORY_ORDER.map((cat) => {
              const products = grouped.get(cat) ?? [];
              if (products.length === 0) return null;
              return (
                <section key={cat}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-white font-bold text-sm tracking-widest uppercase">{cat}</h2>
                    <div className="flex-1 h-px bg-cyan-900/20" />
                    <span className="text-gray-600 text-xs">{products.length} compound{products.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl overflow-hidden">
                    <CoaTable products={products} />
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Bottom disclaimer */}
        <div className="mt-12 bg-red-950/20 border border-red-900/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300/70 text-xs leading-relaxed">
              <strong className="text-red-400">DISCLAIMER:</strong> All products are strictly for research and laboratory use only. Not intended for human consumption, medical use, or veterinary use. None of these products have been evaluated by the FDA. By purchasing, you confirm you are a qualified researcher and products will be used solely for scientific research purposes.
            </p>
          </div>
        </div>

        {/* Back to catalog */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </button>
        </div>
      </div>
    </div>
  );
}

interface CoaTableProps {
  products: typeof RESEARCH_PRODUCTS;
}

function CoaTable({ products }: CoaTableProps) {
  return (
    <div className="divide-y divide-cyan-900/10">
      {products.map((product, i) => {
        const hasCoa = !!product.coaUrl;
        return (
          <div
            key={product.id}
            className={`flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-150 ${
              i % 2 === 0 ? '' : 'bg-cyan-950/10'
            } hover:bg-cyan-950/20`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  hasCoa ? 'bg-emerald-400' : 'bg-gray-700'
                }`}
              />
              <span className="text-gray-200 text-xs sm:text-sm leading-tight truncate">
                {product.name}
              </span>
            </div>

            <div className="shrink-0">
              {hasCoa ? (
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(product.coaUrl!)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700/30 hover:bg-cyan-600/40 border border-cyan-700/40 hover:border-cyan-500/60 text-cyan-300 hover:text-cyan-200 text-xs font-semibold rounded-lg transition-all duration-150"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View COA</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/60 border border-gray-800/60 text-gray-600 text-xs font-medium rounded-lg cursor-default">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">COA Pending</span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
