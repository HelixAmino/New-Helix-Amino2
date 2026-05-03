import { ChartBar as BarChart3, Download, FlaskConical, CircleCheck as CheckCircle, FileText } from 'lucide-react';
import { useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { useNavigation } from '../context/NavigationContext';

interface ReportEntry {
  name: string;
  quantityLabel: string;
  purity: string;
  coaUrl: string;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Recovery & Healing': 'text-emerald-400',
  'GH & Growth Axis': 'text-sky-400',
  'Longevity & Mitochondrial': 'text-cyan-400',
  'Metabolic & Appetite Research': 'text-amber-400',
  'Nootropics & Specialty': 'text-blue-400',
  'Blends & Other': 'text-teal-400',
  'Accessories': 'text-orange-400',
};

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Sample Preparation',
    desc: 'Each batch is dissolved in an appropriate mobile phase solvent and filtered to 0.22 µm prior to injection.',
  },
  {
    step: '02',
    title: 'Chromatographic Separation',
    desc: 'The sample runs through a C18 reverse-phase column. UV detection at 214 nm measures amide bond absorbance across the peptide backbone.',
  },
  {
    step: '03',
    title: 'Peak Integration',
    desc: 'Chromatogram software integrates all peaks. Purity is reported as the target peak area divided by total peak area × 100.',
  },
  {
    step: '04',
    title: 'MS Confirmation',
    desc: 'LC-MS confirms molecular identity by matching the observed [M+H]⁺ or multiply charged ions against the theoretical mass.',
  },
  {
    step: '05',
    title: 'COA Issuance',
    desc: 'The independent laboratory generates and signs the Certificate of Analysis, which is added to the COA Library.',
  },
];

export function HplcReportsPage() {
  const { navigate } = useNavigation();
  const reports: ReportEntry[] = useMemo(() => {
    return PRODUCTS
      .filter((p) => !!p.coaUrl)
      .map((p) => ({
        name: p.name,
        quantityLabel: p.quantityLabel,
        purity: p.purity,
        coaUrl: p.coaUrl!,
        category: p.category,
      }));
  }, []);

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
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytical Data</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            HPLC{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Reports
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Every Certificate of Analysis for every batch we've released — publicly available and directly linked from the independent laboratory.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 bg-[#07111d] border border-cyan-900/30 rounded-xl px-4 py-2.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold text-sm">{reports.length}</span>
              <span className="text-gray-400 text-xs">COAs Available</span>
            </div>
            <div className="flex items-center gap-2 bg-[#07111d] border border-cyan-900/30 rounded-xl px-4 py-2.5">
              <FlaskConical className="w-4 h-4 text-teal-400" />
              <span className="text-white font-bold text-sm">≥99%</span>
              <span className="text-gray-400 text-xs">HPLC Purity Standard</span>
            </div>
            <button
              onClick={() => navigate('coa-library')}
              className="flex items-center gap-2 bg-cyan-600/10 border border-cyan-700/40 hover:bg-cyan-600/20 rounded-xl px-4 py-2.5 text-cyan-400 text-xs font-semibold transition-colors duration-200"
            >
              <FileText className="w-3.5 h-3.5" />
              COA Library
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* How HPLC Works */}
        <h2 className="text-white font-bold text-xl mb-6">How HPLC Analysis Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-14">
          {HOW_IT_WORKS.map((h) => (
            <div key={h.step} className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-4">
              <div className="text-cyan-500 font-bold text-xs mb-2">{h.step}</div>
              <h4 className="text-white font-semibold text-xs mb-1.5">{h.title}</h4>
              <p className="text-gray-500 text-[11px] leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* COA Table */}
        <h2 className="text-white font-bold text-xl mb-6">Available COA Reports</h2>
        <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyan-900/30">
                  <th className="text-left text-gray-500 text-[11px] uppercase tracking-widest font-semibold px-5 py-3.5">Product</th>
                  <th className="text-left text-gray-500 text-[11px] uppercase tracking-widest font-semibold px-4 py-3.5 hidden sm:table-cell">Category</th>
                  <th className="text-left text-gray-500 text-[11px] uppercase tracking-widest font-semibold px-4 py-3.5">Purity</th>
                  <th className="text-right text-gray-500 text-[11px] uppercase tracking-widest font-semibold px-5 py-3.5">COA</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => {
                  const colorClass = CATEGORY_COLORS[r.category] || 'text-gray-400';
                  return (
                    <tr
                      key={i}
                      className="border-b border-cyan-900/10 hover:bg-cyan-950/10 transition-colors duration-150"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                          <span className="text-white text-xs font-medium">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs ${colorClass}`}>{r.category}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-cyan-400 text-xs font-semibold">{r.purity.split(' ')[0]}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <a
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(r.coaUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/10 border border-cyan-700/40 hover:bg-cyan-600/20 rounded-lg text-cyan-400 text-xs font-medium transition-all duration-150"
                        >
                          <Download className="w-3 h-3" />
                          <span className="hidden sm:inline">View COA</span>
                          <span className="sm:hidden">COA</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4">
          <p className="text-red-300/70 text-xs leading-relaxed text-center">
            <strong className="text-red-400">RESEARCH USE ONLY:</strong> All HPLC reports and COAs pertain to research-grade compounds for in-vitro laboratory use only. Not for human consumption. Purity figures are as measured by independent third-party laboratories.
          </p>
        </div>
      </div>
    </div>
  );
}
