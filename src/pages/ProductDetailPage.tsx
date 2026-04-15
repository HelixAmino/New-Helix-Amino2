import { useState, useEffect } from 'react';
import { ChevronLeft, ShieldCheck, FileText, FileDown, Minus, Plus, ShoppingCart, TriangleAlert as AlertTriangle, Package, Thermometer, CircleCheck as CheckCircle } from 'lucide-react';
import { PRODUCTS, getDiscountedPrice, getDiscountLabel, getGroupByProductId, getProductGroups } from '../data/products';
import { MEMBERS_PRODUCTS, MEMBERS_GROUPS } from '../data/membersProducts';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

export function ProductDetailPage() {
  const { currentProductId, navigate } = useNavigation();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const allProducts = [...PRODUCTS, ...MEMBERS_PRODUCTS];
  const group = currentProductId
    ? (getGroupByProductId(currentProductId) ?? MEMBERS_GROUPS.find((g) => g.variants.some((v) => v.id === currentProductId)))
    : undefined;
  const initialVariant = allProducts.find((p) => p.id === currentProductId) ?? group?.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<Product | undefined>(initialVariant);

  useEffect(() => {
    const v = allProducts.find((p) => p.id === currentProductId) ?? group?.variants[0];
    setSelectedVariant(v);
    setQuantity(1);
  }, [currentProductId]);

  if (!group || !selectedVariant) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Product not found.</p>
        <button onClick={() => navigate('home')} className="mt-4 text-cyan-400 hover:text-white transition-colors">
          Back to shop
        </button>
      </div>
    );
  }

  const isMultiVariant = group.variants.length > 1;
  const product = selectedVariant;
  const discountedPrice = getDiscountedPrice(product.price, quantity);
  const subtotal = +(discountedPrice * quantity).toFixed(2);
  const discountLabel = getDiscountLabel(quantity);

  const handleQty = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(50, q + delta)));
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const allGroups = [...getProductGroups(), ...MEMBERS_GROUPS];
  const related = allGroups
    .filter((g) => g.category === group.category && g.groupId !== group.groupId)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 text-sm mb-8 transition-colors duration-200 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        Back to Shop
      </button>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        {/* Left: product image */}
        <div className="relative bg-[#07111d] border border-cyan-900/20 rounded-2xl min-h-[340px] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0 transition-all duration-300"
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 bg-[#050d14]/80 border border-cyan-900/40 rounded-full px-3 py-1 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 text-xs font-bold">≥99% Purity</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#050d14]/80 border border-cyan-900/40 rounded-full px-3 py-1 backdrop-blur-sm">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-teal-300 text-xs font-bold">COA Available</span>
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div>
          <span className="inline-block text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3">
            {group.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
            {group.baseName}
          </h1>

          {/* Scientific identity block */}
          {(group.cas || group.molecularWeight || group.blendComponents) && (
            <div className="mb-5 rounded-xl border border-teal-800/50 bg-[#041019] overflow-hidden">
              <div className="bg-teal-950/40 border-b border-teal-800/30 px-4 py-2">
                <p className="text-[10px] uppercase tracking-widest text-teal-400/80 font-bold">Chemical Identity</p>
              </div>
              {group.blendComponents && group.blendComponents.length > 0 ? (
                <div className="px-4 py-3 flex flex-col gap-2">
                  {group.blendComponents.map((c) => (
                    <div key={c.name} className="grid grid-cols-3 gap-2 items-start">
                      <span className="text-teal-300 font-mono font-bold text-xs">{c.name}</span>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-teal-600 font-bold mb-0.5">CAS</p>
                        <p className="font-mono text-xs text-teal-200">{c.cas}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-teal-600 font-bold mb-0.5">Mol. Weight</p>
                        <p className="font-mono text-xs text-teal-200">{c.mw}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 flex gap-8">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-teal-600 font-bold mb-1">CAS Number</p>
                    <p className={`font-mono text-sm font-semibold ${group.cas?.startsWith('N/A') ? 'text-gray-600' : 'text-teal-300'}`}>
                      {group.cas ?? '—'}
                    </p>
                  </div>
                  <div className="w-px bg-teal-900/40 self-stretch" />
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-teal-600 font-bold mb-1">Molecular Weight</p>
                    <p className={`font-mono text-sm font-semibold ${group.molecularWeight?.startsWith('N/A') ? 'text-gray-600' : 'text-teal-300'}`}>
                      {group.molecularWeight ?? '—'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vial size selector */}
          {isMultiVariant && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Select Vial Size</p>
                <div className="flex-1 h-px bg-cyan-900/20" />
              </div>
              <div className="flex flex-wrap gap-2">
                {group.variants.map((v) => {
                  const isSelected = v.id === selectedVariant.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVariant(v); setQuantity(1); setAdded(false); }}
                      className={`relative flex flex-col items-center px-4 py-3 rounded-xl border text-sm font-bold transition-all duration-200 min-w-[80px] ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_16px_rgba(0,212,255,0.2)]'
                          : 'bg-[#07111d] border-cyan-900/30 text-gray-400 hover:border-cyan-700/60 hover:text-gray-200'
                      }`}
                    >
                      <span className="font-black text-base leading-tight">{v.quantityLabel}</span>
                      <span className={`text-xs mt-0.5 font-semibold ${isSelected ? 'text-cyan-300' : 'text-gray-600'}`}>
                        ${v.price}
                      </span>
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!isMultiVariant && (
            <p className="text-gray-500 text-sm mb-6">{product.quantityLabel} per vial</p>
          )}

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Package, label: 'Form', value: product.form },
              { icon: ShieldCheck, label: 'Purity', value: product.purity },
              { icon: Thermometer, label: 'Storage', value: product.storage },
              { icon: FileDown, label: 'COA', value: 'Batch-specific download' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-cyan-500" />
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">{label}</span>
                </div>
                <span className="text-gray-300 text-xs">{value}</span>
              </div>
            ))}
          </div>

          {/* Bulk discount table */}
          <div className="bg-[#07111d] border border-cyan-900/20 rounded-xl overflow-hidden mb-6">
            <div className="bg-cyan-950/30 px-4 py-2.5 border-b border-cyan-900/20">
              <p className="text-cyan-300 text-xs font-bold tracking-widest uppercase">Bulk Discount Pricing</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyan-900/15">
                  <th className="text-left px-4 py-2.5 text-gray-500 text-xs font-semibold">Quantity</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 text-xs font-semibold">Price / Vial</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 text-xs font-semibold">Savings</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: '1 – 4', factor: 1, discount: null },
                  { range: '5 – 9', factor: 0.95, discount: '5% OFF' },
                  { range: '10+', factor: 0.9, discount: '10% OFF' },
                ].map(({ range, factor, discount }) => {
                  const price = +(product.price * factor).toFixed(2);
                  const isActive =
                    (range === '1 – 4' && quantity < 5) ||
                    (range === '5 – 9' && quantity >= 5 && quantity < 10) ||
                    (range === '10+' && quantity >= 10);
                  return (
                    <tr
                      key={range}
                      className={`border-b border-cyan-900/10 last:border-0 transition-colors ${isActive ? 'bg-cyan-950/25' : ''}`}
                    >
                      <td className="px-4 py-2.5 text-gray-300 text-xs font-medium">{range}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-bold ${isActive ? 'text-cyan-300' : 'text-gray-400'}`}>
                          ${price}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {discount ? (
                          <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-gray-800 text-gray-500'
                          }`}>
                            {discount}
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-4xl font-black text-white">${discountedPrice}</span>
            {discountLabel && (
              <span className="text-sm font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 rounded-full px-2.5 py-0.5">
                {discountLabel}
              </span>
            )}
            <span className="text-gray-500 text-sm">per vial</span>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center bg-[#07111d] border border-cyan-900/30 rounded-xl overflow-hidden">
              <button
                onClick={() => handleQty(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-950/40 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-white font-bold text-sm">{quantity}</span>
              <button
                onClick={() => handleQty(1)}
                disabled={quantity >= 50}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-950/40 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Subtotal: <span className="text-white font-bold">${subtotal}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-bold rounded-xl text-sm tracking-wide transition-all duration-200 active:scale-95 ${
                added
                  ? 'bg-teal-600 text-white'
                  : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white hover:shadow-[0_0_24px_rgba(0,212,255,0.3)]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>

          {/* COA View */}
          {product.coaUrl ? (
            <a
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(product.coaUrl!)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 mb-5 bg-teal-950/50 border border-teal-700/50 text-teal-300 font-semibold rounded-xl text-sm hover:bg-teal-900/60 hover:border-teal-500 hover:text-white transition-all duration-200 active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              View Certificate of Analysis
            </a>
          ) : (
            <div className="w-full flex items-center justify-center gap-2.5 py-3.5 mb-5 bg-gray-900/40 border border-gray-700/20 text-gray-600 font-semibold rounded-xl text-sm cursor-not-allowed">
              <FileText className="w-4 h-4" />
              Certificate of Analysis — Coming Soon
            </div>
          )}
        </div>
      </div>

      {/* Research description */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-[#07111d] border border-cyan-900/20 rounded-2xl p-6">
          <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Research Profile
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>
          <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3 flex gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300/80 text-xs leading-relaxed">
              <strong>Note:</strong> Not for human consumption, diagnostic, or therapeutic use. For in-vitro laboratory research only. All purchases are subject to our research use agreement.
            </p>
          </div>
        </div>

        <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-6">
          <h3 className="text-white font-bold text-sm mb-4">Product Specifications</h3>
          <dl className="space-y-3">
            {[
              ['Form', product.form],
              ['Purity', product.purity],
              ['Quantity', product.quantityLabel],
              ['Storage', product.storage],
              ['COA', 'Batch-specific download'],
            ].map(([label, val]) => (
              <div key={label}>
                <dt className="text-gray-600 text-xs uppercase tracking-widest font-semibold mb-0.5">{label}</dt>
                <dd className="text-gray-300 text-xs">{val}</dd>
              </div>
            ))}
            {!group.blendComponents && group.cas && (
              <div>
                <dt className="text-teal-700 text-xs uppercase tracking-widest font-semibold mb-0.5">CAS Number</dt>
                <dd className={`font-mono text-xs ${group.cas.startsWith('N/A') ? 'text-gray-600' : 'text-teal-300'}`}>{group.cas}</dd>
              </div>
            )}
            {!group.blendComponents && group.molecularWeight && (
              <div>
                <dt className="text-teal-700 text-xs uppercase tracking-widest font-semibold mb-0.5">Molecular Weight</dt>
                <dd className={`font-mono text-xs ${group.molecularWeight.startsWith('N/A') ? 'text-gray-600' : 'text-teal-300'}`}>{group.molecularWeight}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-base mb-5">More in {group.category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((g) => (
              <button
                key={g.groupId}
                onClick={() => navigate('product', g.variants[0].id)}
                className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-4 text-left hover:border-cyan-700/40 transition-all duration-200 group"
              >
                <p className="text-white text-sm font-bold group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1">
                  {g.baseName}
                </p>
                <p className="text-cyan-400 font-black text-base">
                  {g.variants.length > 1 ? `from $${Math.min(...g.variants.map((v) => v.price))}` : `$${g.variants[0].price}`}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
