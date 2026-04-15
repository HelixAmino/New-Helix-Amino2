import { useState } from 'react';
import { ShoppingCart, Plus, Minus, CircleCheck as CheckCircle, FlaskConical, Package, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const LAB_SUPPLIES: Product[] = [
  {
    id: 'lab-mixing-vials-10ml',
    name: 'Sterile Mixing Vials 10mL (5-pack)',
    price: 14.99,
    category: 'Accessories',
    quantityLabel: '5 vials',
    description: 'Type I borosilicate glass vials with rubber stopper and aluminum crimp cap. Autoclave-ready and compatible with all common solvents.',
    form: 'Glass Vial',
    purity: 'Sterile / Depyrogenated',
    storage: 'Store sealed, room temperature',
    image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-alcohol-swabs-200pk',
    name: 'Alcohol Prep Pads 70% IPA (200-pack)',
    price: 7.49,
    category: 'Accessories',
    quantityLabel: '200 pads',
    description: 'Individually wrapped 70% isopropyl alcohol pads for sterile surface preparation. Lint-free and fast-drying.',
    form: 'Saturated Pad',
    purity: '70% IPA',
    storage: 'Room temperature, sealed',
    image: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-peptide-calculator',
    name: 'Digital Micro Scale 0.001g',
    price: 34.99,
    category: 'Accessories',
    quantityLabel: '1 unit',
    description: 'High-precision milligram scale with 0.001g readability and 30g capacity. Includes calibration weights, tare function, and windshield cover.',
    form: 'Digital Scale',
    purity: 'N/A',
    storage: 'Keep dry, away from vibration',
    image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-nitrile-gloves-m',
    name: 'Nitrile Exam Gloves Medium (100-pack)',
    price: 11.99,
    category: 'Accessories',
    quantityLabel: '100 gloves',
    description: 'Powder-free, latex-free nitrile exam gloves with textured fingertips. Provides reliable chemical resistance for laboratory handling.',
    form: 'Disposable Glove',
    purity: 'AQL 1.5',
    storage: 'Store in original box, cool dry place',
    image: 'https://images.pexels.com/photos/3786152/pexels-photo-3786152.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-transfer-pipettes-3ml',
    name: 'Disposable Transfer Pipettes 3mL (50-pack)',
    price: 8.99,
    category: 'Accessories',
    quantityLabel: '50 pipettes',
    description: 'Graduated polyethylene transfer pipettes with 3mL bulb capacity. Flexible, drip-free, and ideal for accurate liquid transfer in research labs.',
    form: 'Plastic Pipette',
    purity: 'Sterile',
    storage: 'Room temperature',
    image: 'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-storage-box-cryo',
    name: 'Cryogenic Storage Box 81-Position',
    price: 22.99,
    category: 'Accessories',
    quantityLabel: '1 box',
    description: 'Polypropylene 81-position freezer box for 1.5–2mL vials. Numbered grid, snap-close lid, and -80°C compatibility for long-term sample storage.',
    form: 'Storage Box',
    purity: 'N/A',
    storage: 'Reusable, rated to -80°C',
    image: 'https://images.pexels.com/photos/3912516/pexels-photo-3912516.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-single-channel-pipette',
    name: 'Single-Channel Pipette 0.5–10µL',
    price: 89.00,
    category: 'Accessories',
    quantityLabel: '1 pipette',
    description: 'Precision adjustable pipette with 0.5–10µL volume range. Ergonomic grip with smooth volume adjustment wheel for accurate, fatigue-free liquid handling.',
    form: 'Adjustable Pipette',
    purity: 'N/A',
    storage: 'Store upright, autoclavable tip cone',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-sterile-pipette-tips-200ul',
    name: 'Sterile Pipette Tips 200µL (1000-pack)',
    price: 24.00,
    category: 'Accessories',
    quantityLabel: '1000 tips',
    description: 'Universal 200µL sterile pipette tips compatible with most major pipette brands. DNase/RNase free with low-retention surface for maximum sample recovery.',
    form: 'Pipette Tips',
    purity: 'DNase/RNase Free',
    storage: 'Room temperature, sealed box',
    image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-glassware-set',
    name: 'Borosilicate Glassware Set',
    price: 65.00,
    category: 'Accessories',
    quantityLabel: '1 set',
    description: 'Complete laboratory glassware set including beakers, Erlenmeyer flasks, and graduated cylinders. Borosilicate 3.3 glass with excellent thermal and chemical resistance.',
    form: 'Glassware',
    purity: 'Borosilicate 3.3',
    storage: 'Clean and dry before storage',
    image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-sterile-petri-dishes-20pk',
    name: 'Sterile Petri Dishes 90mm (20-pack)',
    price: 18.00,
    category: 'Accessories',
    quantityLabel: '20 dishes',
    description: 'Pack of 20 sterile 90mm polystyrene petri dishes with tight-fitting lids. Gamma-irradiated for cell culture and microbiological research applications.',
    form: 'Polystyrene Dish',
    purity: 'Sterile / Gamma-irradiated',
    storage: 'Store sealed, room temperature',
    image: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-microscope-slides-coverslips',
    name: 'Microscope Slides & Coverslips Set',
    price: 12.00,
    category: 'Accessories',
    quantityLabel: '50 slides + 100 coverslips',
    description: '50 pre-cleaned glass microscope slides paired with 100 high-clarity coverslips. Polished edges and consistent thickness for sharp, distortion-free imaging.',
    form: 'Glass Slides',
    purity: 'Pre-cleaned / Lint-free',
    storage: 'Store in original slide box',
    image: 'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-conical-centrifuge-tubes-50pk',
    name: 'Conical Centrifuge Tubes 15mL & 50mL (50-pack)',
    price: 22.00,
    category: 'Accessories',
    quantityLabel: '50 tubes (assorted)',
    description: 'Sterile conical centrifuge tubes in both 15mL and 50mL sizes. Leak-resistant screw caps, graduated markings, and RNase/DNase-free polypropylene.',
    form: 'Centrifuge Tubes',
    purity: 'Sterile / DNase/RNase Free',
    storage: 'Room temperature, sealed',
    image: 'https://images.pexels.com/photos/3912516/pexels-photo-3912516.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-microcentrifuge-tubes-500pk',
    name: 'Microcentrifuge Tubes 1.5mL (500-pack)',
    price: 35.00,
    category: 'Accessories',
    quantityLabel: '500 tubes',
    description: 'Snap-cap 1.5mL microcentrifuge tubes in assorted colors for easy sample identification. Autoclavable, with tight snap-lock closure and graduated volume markings.',
    form: 'Microcentrifuge Tubes',
    purity: 'Sterile / Autoclavable',
    storage: 'Room temperature',
    image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lab-filter-paper-buchner-funnel',
    name: 'Qualitative Filter Paper & Buchner Funnel',
    price: 29.00,
    category: 'Accessories',
    quantityLabel: '100 sheets + 1 funnel',
    description: '100 sheets of medium-porosity qualitative filter paper paired with a borosilicate glass Buchner funnel. Ideal for gravity and vacuum filtration in research workflows.',
    form: 'Filter Paper / Glass Funnel',
    purity: 'Medium Porosity',
    storage: 'Store paper dry, sealed packaging',
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="group relative bg-[#07111d] border border-cyan-900/30 rounded-2xl overflow-hidden hover:border-teal-700/50 hover:scale-[1.01] transition-all duration-300 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#040b11]">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-950/40 to-teal-950/20">
            <FlaskConical className="w-16 h-16 text-cyan-800/50" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111d]/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-teal-500/20 border border-teal-500/40 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-teal-300 text-[10px] font-semibold tracking-wide">In Stock</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-sm leading-snug mb-1.5 group-hover:text-teal-200 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1">
          {product.description}
        </p>
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">{product.quantityLabel}</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-[10px] text-gray-600 font-medium">{product.purity}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-teal-300 font-black text-xl tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-2 bg-[#040b11] border border-cyan-900/40 rounded-xl px-2 py-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-cyan-950/60"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-white text-sm font-bold w-5 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(50, q + 1))}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-cyan-950/60"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            added
              ? 'bg-teal-600/30 border border-teal-500/50 text-teal-300'
              : 'bg-teal-600 hover:bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_28px_rgba(20,184,166,0.35)]'
          }`}
        >
          {added ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function LabSuppliesPage() {
  return (
    <div className="min-h-screen bg-[#050d14]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-cyan-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/30 via-transparent to-cyan-950/20" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(20,184,166,1) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Home</span>
            <span className="text-gray-700">/</span>
            <span className="text-cyan-400">Lab Supplies</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-full px-3.5 py-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-teal-300 text-xs font-semibold tracking-wide uppercase">Lab Equipment</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Lab Supplies
          </h1>
          <p className="text-gray-400 text-base max-w-xl leading-relaxed">
            Professional-grade consumables, tools, and accessories for peptide reconstitution, storage, and laboratory research workflows.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Package className="w-4 h-4 text-teal-500/70" />
              <span>Research-grade quality</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Truck className="w-4 h-4 text-teal-500/70" />
              <span>Ships with peptide orders</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <CheckCircle className="w-4 h-4 text-teal-500/70" />
              <span>Sterile &amp; individually packaged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white font-bold text-lg tracking-wide">
            All Lab Supplies
            <span className="ml-2 text-gray-600 font-normal text-sm">({LAB_SUPPLIES.length} items)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAB_SUPPLIES.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Research-use disclaimer */}
        <div className="mt-12 bg-teal-950/20 border border-teal-900/30 rounded-2xl p-5">
          <p className="text-teal-300/60 text-xs leading-relaxed text-center">
            <strong className="text-teal-400/80">RESEARCH USE ONLY:</strong> All lab supplies are sold solely for use in laboratory and research settings. Items are not intended for personal medical use. By purchasing, you confirm products will be used in a qualified research context.
          </p>
        </div>
      </div>
    </div>
  );
}
