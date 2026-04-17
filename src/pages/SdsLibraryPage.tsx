import { useState, useMemo } from 'react';
import { ShieldAlert, Search, FileX, ChevronDown, X } from 'lucide-react';
import { getProductGroups, CATEGORIES } from '../data/products';
import { ProductGroup } from '../types';

const ALL_CATEGORIES = 'All Categories';

function SdsRow({ group, onView }: { group: ProductGroup; onView: (url: string, name: string) => void }) {
  const sdsUrl = group.sdsUrl ?? group.variants.find((v) => v.sdsUrl)?.sdsUrl;
  const hasMultiVariants = group.variants.length > 1;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5 border-b border-cyan-900/10 last:border-0 hover:bg-cyan-950/10 transition-colors duration-150 group">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-2 h-2 rounded-full shrink-0 ${sdsUrl ? 'bg-amber-400' : 'bg-gray-700'}`} />
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold leading-tight truncate">{group.baseName}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-500 text-xs">{group.category}</span>
            {hasMultiVariants && (
              <span className="text-[10px] text-cyan-500/70 font-mono">
                {group.variants.length} sizes
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="shrink-0">
        {sdsUrl ? (
          <button
            onClick={() => onView(sdsUrl, group.baseName)}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-600/15 border border-amber-700/40 text-amber-400 rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 active:scale-95 text-xs font-bold whitespace-nowrap"
            aria-label={`View Safety Data Sheet for ${group.baseName}`}
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>View SDS</span>
          </button>
        ) : (
          <span className="flex items-center gap-2 px-3.5 py-2 bg-gray-800/30 border border-gray-700/20 text-gray-600 rounded-xl text-xs font-bold whitespace-nowrap cursor-not-allowed">
            <FileX className="w-3.5 h-3.5 shrink-0" />
            <span>SDS Pending</span>
          </span>
        )}
      </div>
    </div>
  );
}

function toInlinePdfUrl(url: string): string {
  const match = url.match(/^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/);
  if (match) {
    const [, owner, repo, branch, path] = match;
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
  }
  return url;
}

function SdsViewer({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const inlineUrl = toInlinePdfUrl(url);
  const viewerSrc = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(inlineUrl)}`;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6" onClick={onClose}>
      <div className="bg-[#07111d] border border-amber-900/30 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-amber-900/20 bg-amber-950/20">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-white text-sm font-bold truncate">{name} — Safety Data Sheet</span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-lg bg-amber-600/15 border border-amber-700/40 text-amber-400 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close SDS viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <iframe
          src={viewerSrc}
          title={`${name} SDS`}
          className="flex-1 w-full bg-white"
        />
      </div>
    </div>
  );
}

export function SdsLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);
  const [viewer, setViewer] = useState<{ url: string; name: string } | null>(null);

  const allGroups = getProductGroups();

  const categoryOptions = [ALL_CATEGORIES, ...CATEGORIES.filter((c) => c !== 'All')];

  const filtered = useMemo(() => {
    return allGroups.filter((g) => {
      const matchesSearch =
        search.trim() === '' ||
        g.baseName.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat =
        selectedCategory === ALL_CATEGORIES || g.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [allGroups, search, selectedCategory]);

  const withSds = filtered.filter((g) => g.sdsUrl ?? g.variants.find((v) => v.sdsUrl));
  const withoutSds = filtered.filter((g) => !(g.sdsUrl ?? g.variants.find((v) => v.sdsUrl)));

  const totalWithSds = allGroups.filter((g) => g.sdsUrl ?? g.variants.find((v) => v.sdsUrl)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-800/40 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">SDS Library</h1>
            <p className="text-amber-400/70 text-xs font-bold tracking-widest uppercase">Safety Data Sheets</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-5">
          OSHA / GHS-compliant 16-section Safety Data Sheets for all Helix Amino research compounds. All PDFs open in a new tab. Contact us if you need a specific SDS not yet listed.
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 bg-[#07111d] border border-cyan-900/20 rounded-xl px-4 py-2.5">
            <span className="text-cyan-400 font-black text-lg">{allGroups.length}</span>
            <span className="text-gray-500 text-xs">Total Products</span>
          </div>
          <div className="flex items-center gap-2 bg-[#07111d] border border-amber-900/30 rounded-xl px-4 py-2.5">
            <span className="text-amber-400 font-black text-lg">{totalWithSds}</span>
            <span className="text-gray-500 text-xs">SDS Available</span>
          </div>
          <div className="flex items-center gap-2 bg-[#07111d] border border-gray-800/40 rounded-xl px-4 py-2.5">
            <span className="text-gray-500 font-black text-lg">{allGroups.length - totalWithSds}</span>
            <span className="text-gray-500 text-xs">SDS Pending</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search compounds..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#07111d] border border-cyan-900/30 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-600/60 transition-colors duration-200"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowCategoryDrop((v) => !v)}
              className="flex items-center gap-2 bg-[#07111d] border border-cyan-900/30 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:border-cyan-700/50 transition-colors duration-200 whitespace-nowrap min-w-[180px] justify-between"
            >
              <span className="truncate">{selectedCategory}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${showCategoryDrop ? 'rotate-180' : ''}`} />
            </button>
            {showCategoryDrop && (
              <div className="absolute right-0 top-full mt-1.5 w-full min-w-[220px] bg-[#07111d] border border-cyan-900/30 rounded-xl overflow-hidden z-20 shadow-2xl">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setShowCategoryDrop(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors duration-150 ${
                      selectedCategory === cat
                        ? 'text-cyan-300 bg-cyan-950/40 font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-cyan-950/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FileX className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No compounds match your search.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {withSds.length > 0 && (
            <div className="bg-[#07111d] border border-amber-900/20 rounded-2xl overflow-hidden">
              <div className="bg-amber-950/20 border-b border-amber-900/20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">SDS Available</span>
                </div>
                <span className="text-amber-500/70 text-xs font-mono">{withSds.length} documents</span>
              </div>
              {withSds.map((g) => (
                <SdsRow key={g.groupId} group={g} onView={(url, name) => setViewer({ url, name })} />
              ))}
            </div>
          )}

          {withoutSds.length > 0 && (
            <div className="bg-[#07111d] border border-gray-800/30 rounded-2xl overflow-hidden">
              <div className="bg-gray-900/30 border-b border-gray-800/20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileX className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-500 text-xs font-bold tracking-widest uppercase">SDS Pending</span>
                </div>
                <span className="text-gray-600 text-xs font-mono">{withoutSds.length} compounds</span>
              </div>
              {withoutSds.map((g) => (
                <SdsRow key={g.groupId} group={g} onView={(url, name) => setViewer({ url, name })} />
              ))}
            </div>
          )}
        </div>
      )}

      {viewer && <SdsViewer url={viewer.url} name={viewer.name} onClose={() => setViewer(null)} />}

      {/* OSHA note */}
      <div className="mt-10 bg-[#07111d] border border-cyan-900/20 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          About Our Safety Data Sheets
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed">
          All Safety Data Sheets (SDS) comply with OSHA Hazard Communication Standard (29 CFR 1910.1200) and the Globally Harmonized System (GHS) of Classification and Labelling of Chemicals. Each document contains all 16 required sections. SDS documents are for laboratory safety reference only. These compounds are strictly for in-vitro research use and are not for human consumption.
        </p>
      </div>
    </div>
  );
}
