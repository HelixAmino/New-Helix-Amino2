import { ShieldCheck, ChevronRight, Star } from 'lucide-react';

const products = [
  {
    name: 'BPC-157',
    fullName: 'Body Protection Compound-157',
    purity: '99.4%',
    price: '$64.99',
    size: '5mg',
    badge: 'Best Seller',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 312,
  },
  {
    name: 'TB-500',
    fullName: 'Thymosin Beta-4 Fragment',
    purity: '99.1%',
    price: '$74.99',
    size: '5mg',
    badge: 'Top Rated',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    image: 'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 208,
  },
  {
    name: 'Ipamorelin',
    fullName: 'Growth Hormone Releasing Peptide',
    purity: '99.6%',
    price: '$54.99',
    size: '5mg',
    badge: 'New Stock',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    image: 'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 156,
  },
  {
    name: 'CJC-1295',
    fullName: 'Growth Hormone Releasing Hormone',
    purity: '99.2%',
    price: '$79.99',
    size: '5mg',
    badge: null,
    badgeColor: '',
    image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 184,
  },
  {
    name: 'Selank',
    fullName: 'Anxiolytic Research Peptide',
    purity: '99.3%',
    price: '$59.99',
    size: '5mg',
    badge: null,
    badgeColor: '',
    image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 97,
  },
  {
    name: 'Epithalon',
    fullName: 'Telomere Research Tetrapeptide',
    purity: '99.5%',
    price: '$69.99',
    size: '10mg',
    badge: 'Premium',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    image: 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 143,
  },
];

export function ProductsSection() {
  return (
    <section className="bg-[#050d14] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Featured Compounds
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Research Grade Peptides
            </h2>
            <p className="text-gray-400 mt-2 text-sm max-w-md">
              Every compound independently verified. COA available before purchase.
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-cyan-400 text-sm font-semibold hover:text-white transition-colors duration-200 group">
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.name}
              className="group relative bg-[#07111d] border border-cyan-900/25 rounded-2xl overflow-hidden hover:border-cyan-700/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.08)] cursor-pointer"
            >
              {/* Product image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111d] via-[#07111d]/40 to-transparent" />

                {/* Badge */}
                {product.badge && (
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold border ${product.badgeColor} backdrop-blur-sm`}>
                    {product.badge}
                  </div>
                )}

                {/* Purity indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#050d14]/80 border border-cyan-900/40 rounded-full px-2.5 py-1 backdrop-blur-sm">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span className="text-cyan-300 text-xs font-bold">{product.purity}</span>
                </div>
              </div>

              {/* Product info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-white font-black text-lg tracking-wide">{product.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{product.fullName}</p>
                  </div>
                  <span className="text-cyan-300 text-xs font-medium bg-cyan-950/40 border border-cyan-900/30 rounded-lg px-2 py-1 shrink-0 ml-2">
                    {product.size}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-3 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-amber-400 text-xs font-bold">{product.rating}</span>
                  <span className="text-gray-600 text-xs">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-black text-xl">{product.price}</span>
                    <span className="text-gray-500 text-xs ml-1">/ vial</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_16px_rgba(0,212,255,0.3)] active:scale-95">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden mt-8 text-center">
          <button className="flex items-center gap-2 text-cyan-400 text-sm font-semibold hover:text-white transition-colors duration-200 mx-auto">
            View All Compounds
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
