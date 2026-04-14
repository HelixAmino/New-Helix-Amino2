import { FlaskConical } from 'lucide-react';

const METHODS = [
  {
    name: 'HPLC (RP-HPLC)',
    full: 'Reversed-Phase High-Performance Liquid Chromatography',
    description: 'The gold standard for peptide purity analysis. UV detection at 214 nm quantifies amide bond absorbance, providing a precise purity percentage for each compound.',
    threshold: '≥99%',
    color: 'text-cyan-400',
    border: 'border-cyan-900/40',
    bg: 'bg-cyan-950/20',
  },
  {
    name: 'LC-MS / MS-MS',
    full: 'Liquid Chromatography–Mass Spectrometry',
    description: 'Confirms molecular identity by matching measured mass-to-charge ratios against theoretical molecular weights. Detects truncated sequences and impurities at sub-ppm levels.',
    threshold: 'Identity Confirmed',
    color: 'text-teal-400',
    border: 'border-teal-900/40',
    bg: 'bg-teal-950/20',
  },
  {
    name: 'Karl Fischer Titration',
    full: 'Water Content Analysis',
    description: 'Measures residual water content in lyophilized peptide powder. Excess moisture reduces stability and effective peptide concentration.',
    threshold: '<8%',
    color: 'text-emerald-400',
    border: 'border-emerald-900/40',
    bg: 'bg-emerald-950/20',
  },
  {
    name: 'LAL Endotoxin Assay',
    full: 'Limulus Amebocyte Lysate Test',
    description: 'Quantifies bacterial endotoxin contamination using horseshoe crab lysate. Critical for injectable-grade research applications.',
    threshold: '<1 EU/mg',
    color: 'text-amber-400',
    border: 'border-amber-900/40',
    bg: 'bg-amber-950/20',
  },
  {
    name: 'Amino Acid Analysis',
    full: 'AAA Composition Verification',
    description: 'Hydrolysis of the peptide followed by chromatographic quantification of individual amino acids confirms correct sequence composition.',
    threshold: '±5% per residue',
    color: 'text-sky-400',
    border: 'border-sky-900/40',
    bg: 'bg-sky-950/20',
  },
  {
    name: 'Sterility Testing',
    full: 'USP <71> Microbial Limits',
    description: 'Screens for aerobic bacteria, yeast, and mold contamination across multiple growth media per USP sterility protocol.',
    threshold: 'No Growth',
    color: 'text-rose-400',
    border: 'border-rose-900/40',
    bg: 'bg-rose-950/20',
  },
];

const PIPELINE = [
  { step: '01', title: 'Synthesis & Lyophilization', desc: 'Solid-phase peptide synthesis followed by freeze-drying to stable powder form.' },
  { step: '02', title: 'In-House QC Screening', desc: 'Internal HPLC and visual inspection before sending to third-party labs.' },
  { step: '03', title: 'Third-Party HPLC & MS', desc: 'Independent lab performs HPLC purity and LC-MS identity confirmation.' },
  { step: '04', title: 'COA Issuance', desc: 'Certificate of Analysis generated and added to the COA Library.' },
  { step: '05', title: 'Batch Release', desc: 'Product cleared for sale only after all thresholds pass. Failed batches are destroyed.' },
];

export function PurityTestingPage() {
  return (
    <div className="min-h-screen bg-[#050d14]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-cyan-900/30">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/30 to-transparent pointer-events-none" />
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
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Analytical Chemistry</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Purity{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Testing
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            A rigorous multi-method analytical protocol ensures every compound meets or exceeds research-grade purity standards before reaching your lab.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { val: '≥99%', label: 'HPLC Purity Standard' },
            { val: '6+', label: 'Analytical Methods' },
            { val: '100%', label: 'Batch Tested' },
            { val: 'Public', label: 'COA Access' },
          ].map((s) => (
            <div key={s.label} className="bg-[#07111d] border border-cyan-900/30 rounded-xl p-5 text-center">
              <div className="text-cyan-400 font-bold text-2xl mb-1">{s.val}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Methods */}
        <h2 className="text-white font-bold text-xl mb-6">Testing Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {METHODS.map((m) => (
            <div key={m.name} className={`border ${m.border} ${m.bg} rounded-2xl p-6`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`font-bold text-sm ${m.color}`}>{m.name}</h3>
                  <p className="text-gray-500 text-[11px] mt-0.5">{m.full}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg bg-black/30 border ${m.border} ${m.color} whitespace-nowrap shrink-0 ml-3`}>
                  {m.threshold}
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>

        {/* QC Pipeline */}
        <h2 className="text-white font-bold text-xl mb-6">Quality Control Pipeline</h2>
        <div className="relative mb-14">
          <div className="absolute left-8 top-10 bottom-10 w-px bg-cyan-900/40 hidden sm:block" />
          <div className="space-y-4">
            {PIPELINE.map((p) => (
              <div key={p.step} className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#07111d] border border-cyan-900/40 flex flex-col items-center justify-center shrink-0 relative z-10">
                  <span className="text-cyan-500 font-bold text-xs">{p.step}</span>
                </div>
                <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-4 flex-1 mt-1">
                  <h4 className="text-white font-semibold text-sm mb-1">{p.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4">
          <p className="text-red-300/70 text-xs leading-relaxed text-center">
            <strong className="text-red-400">RESEARCH USE ONLY:</strong> All purity data and testing documentation pertains to research-grade compounds intended for in-vitro laboratory use only. Not for human consumption or clinical application.
          </p>
        </div>
      </div>
    </div>
  );
}
