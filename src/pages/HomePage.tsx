import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES, getProductGroups } from '../data/products';
import { CategoryTabs } from '../components/CategoryTabs';
import { GroupedProductCard } from '../components/GroupedProductCard';
import { Glp1Banner } from '../components/Glp1Banner';
import { MembersMobileCta } from '../components/MembersMobileCta';
import { useNavigation } from '../context/NavigationContext';

const GLP1_CATEGORY = 'Metabolic & GLP-1 Related';

export function HomePage() {
  const { pendingCategory, clearPendingCategory } = useNavigation();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const bannerRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingCategory !== null) {
      setActiveCategory(pendingCategory);
      setSearchQuery('');
      clearPendingCategory();
    }
  }, [pendingCategory, clearPendingCategory]);

  useEffect(() => {
    if (activeCategory === GLP1_CATEGORY) {
      setTimeout(() => {
        bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else if (activeCategory !== 'All') {
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [activeCategory]);

  useEffect(() => {
    function handleSearch(e: Event) {
      const query = (e as CustomEvent<{ query: string }>).detail.query;
      setSearchQuery(query);
      setActiveCategory('All');
    }
    window.addEventListener('helix:search', handleSearch);
    return () => window.removeEventListener('helix:search', handleSearch);
  }, []);

  const allGroups = useMemo(() => getProductGroups(), []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allGroups.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = allGroups.filter((g) => g.category === cat).length;
      }
    });
    return counts;
  }, [allGroups]);

  const filtered = useMemo(() => {
    let list = allGroups;
    if (activeCategory !== 'All') {
      list = list.filter((g) => g.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (g) =>
          g.baseName.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.variants.some((v) => v.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allGroups, activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <MembersMobileCta />

      {/* Search bar */}
      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search compounds..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#07111d] border border-cyan-900/30 text-white rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600 transition-colors duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="mb-8">
        <CategoryTabs
          active={activeCategory}
          onChange={(cat) => { setActiveCategory(cat); setSearchQuery(''); }}
          counts={categoryCounts}
        />
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">
          {activeCategory === 'All' ? 'All Compounds' : activeCategory}
          <span className="text-gray-500 font-normal text-sm ml-2">({filtered.length})</span>
        </h2>
        {searchQuery && (
          <p className="text-gray-500 text-sm">
            Results for "<span className="text-cyan-400">{searchQuery}</span>"
          </p>
        )}
      </div>

      {/* GLP-1 restricted access banner */}
      {activeCategory === GLP1_CATEGORY && (
        <div ref={bannerRef}>
          <Glp1Banner />
        </div>
      )}

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((group) => (
            <GroupedProductCard key={group.groupId} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-10 h-10 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No compounds found matching your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-3 text-cyan-400 text-sm hover:text-white transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
