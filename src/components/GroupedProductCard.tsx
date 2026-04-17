import { FlaskConical, Layers, FileText, ShieldAlert } from 'lucide-react';
import { ProductGroup } from '../types';
import { useNavigation } from '../context/NavigationContext';

interface Props {
  group: ProductGroup;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Recovery & Healing': 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
  'GH & Growth Axis': 'text-sky-400 bg-sky-950/40 border-sky-800/40',
  'Metabolic & GLP-1 Related': 'text-orange-400 bg-orange-950/40 border-orange-800/40',
  'Nootropics and Cognition': 'text-violet-400 bg-violet-950/40 border-violet-800/40',
  'Longevity and Mitochondrial': 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
  'Hormones & Reproductive': 'text-pink-400 bg-pink-950/40 border-pink-800/40',
  'Blends & Specialty': 'text-amber-400 bg-amber-950/40 border-amber-800/40',
  'Misc / Rare': 'text-teal-400 bg-teal-950/40 border-teal-800/40',
  'Accessories': 'text-gray-400 bg-gray-900/40 border-gray-800/40',
};

export function GroupedProductCard({ group }: Props) {
  const { navigate } = useNavigation();
  const categoryColor = CATEGORY_COLORS[group.category] ?? 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
  const isMulti = group.variants.length > 1;
  const lowestPrice = Math.min(...group.variants.map((v) => v.price));
  const isNA = (val?: string) => !val || val.startsWith('N/A');
  const coaUrl = group.variants.find((v) => v.coaUrl)?.coaUrl;
  const sdsUrl = group.sdsUrl ?? group.variants.find((v) => v.sdsUrl)?.sdsUrl;

  const handleClick = () => navigate('product', group.variants[0].id);

  return (
    <div
      className="group bg-[#07111d] border border-cyan-900/20 rounded-2xl overflow-hidden hover:border-cyan-700/40 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,212,255,0.07)] flex flex-col cursor-pointer"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-[480px] overflow-hidden bg-[#07111d]">
        <img
          src={group.image}
          alt={group.baseName}
          className="w-full h-full object-contain scale-[2.5] group-hover:scale-[2.7] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111d]/60 via-transparent to-transparent" />

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#050d14]/80 border border-cyan-900/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
          <FlaskConical className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-300 text-[10px] font-bold">≥99%</span>
        </div>

        {isMulti && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#050d14]/80 border border-teal-700/50 rounded-full px-2.5 py-1 backdrop-blur-sm">
            <Layers className="w-3 h-3 text-teal-400" />
            <span className="text-teal-300 text-[10px] font-bold">{group.variants.length} sizes</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className={`self-start text-[10px] font-bold border rounded-full px-2 py-0.5 mb-2.5 ${categoryColor}`}>
          {group.category}
        </span>

        <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-200">
          {group.baseName}
        </h3>

        {isMulti ? (
          <div className="flex flex-wrap gap-1 mb-3">
            {group.variants.map((v) => (
              <span key={v.id} className="text-[10px] font-mono font-semibold bg-cyan-950/30 border border-cyan-800/30 text-cyan-400 rounded px-1.5 py-0.5">
                {v.quantityLabel}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs mb-3">{group.variants[0].quantityLabel}</p>
        )}

        {/* CAS / MW */}
        {group.blendComponents && group.blendComponents.length > 0 ? (
          <div className="mb-3 rounded-lg border border-teal-800/50 bg-[#041019] p-2.5">
            <p className="text-[9px] uppercase tracking-widest text-teal-500/70 font-bold mb-1.5">Blend Components</p>
            <div className="flex flex-col gap-1">
              {group.blendComponents.map((c) => (
                <div key={c.name} className="flex items-start gap-2">
                  <span className="shrink-0 text-teal-400 font-mono font-bold text-[10px] min-w-[60px]">{c.name}</span>
                  <span className="text-gray-500 font-mono text-[10px] leading-tight">
                    CAS {c.cas} · {c.mw}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (group.cas || group.molecularWeight) ? (
          <div className="mb-3 rounded-lg border border-teal-800/50 bg-[#041019] px-3 py-2 flex gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-widest text-teal-500/70 font-bold">CAS</span>
              <span className={`font-mono text-[11px] font-semibold leading-tight ${isNA(group.cas) ? 'text-gray-600' : 'text-teal-300'}`}>
                {group.cas ?? '—'}
              </span>
            </div>
            <div className="w-px bg-teal-900/40 self-stretch" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-widest text-teal-500/70 font-bold">Mol. Weight</span>
              <span className={`font-mono text-[11px] font-semibold leading-tight ${isNA(group.molecularWeight) ? 'text-gray-600' : 'text-teal-300'}`}>
                {group.molecularWeight ?? '—'}
              </span>
            </div>
          </div>
        ) : null}

        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{group.description}</p>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            {isMulti && <span className="text-gray-500 text-xs mr-0.5">from </span>}
            <span className="text-white font-black text-lg">${lowestPrice}</span>
            <span className="text-gray-600 text-xs ml-1">/ vial</span>
          </div>
          <div className="flex gap-1.5">
            {coaUrl ? (
              <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(coaUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-2.5 py-2 bg-teal-600/15 border border-teal-700/40 text-teal-400 rounded-xl hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-200 active:scale-90 text-[11px] font-semibold whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                View COA
              </a>
            ) : (
              <span
                className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-800/30 border border-gray-700/20 text-gray-600 rounded-xl cursor-not-allowed text-[11px] font-semibold whitespace-nowrap"
                title="COA pending"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                COA Soon
              </span>
            )}
            {sdsUrl ? (
              <a
                href={sdsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-amber-600/15 border border-amber-700/40 text-amber-400 rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 active:scale-90"
                title="View Safety Data Sheet (SDS)"
                aria-label={`View Safety Data Sheet for ${group.baseName}`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span
                className="p-2 bg-gray-800/30 border border-gray-700/20 text-gray-700 rounded-xl cursor-not-allowed"
                title="SDS pending"
                aria-label="Safety Data Sheet pending"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); navigate('product', group.variants[0].id); }}
              className="px-3 py-2 border border-cyan-800/50 text-cyan-400 text-xs font-semibold rounded-xl hover:border-cyan-500 hover:text-white transition-all duration-200"
            >
              {isMulti ? 'Select Size' : 'Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
