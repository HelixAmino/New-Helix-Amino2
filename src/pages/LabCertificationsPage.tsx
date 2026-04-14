import { Award, CircleCheck as CheckCircle, Shield, FlaskConical, ExternalLink, FileCheck, Microscope, Star } from 'lucide-react';

const CERTIFICATIONS = [
  {
    title: 'ISO/IEC 17025 Compliant Testing',
    issuer: 'Accredited Third-Party Laboratory',
    description: 'All peptide compounds are tested at ISO/IEC 17025 compliant facilities ensuring the highest standards of analytical measurement accuracy.',
    icon: Award,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/30 border-cyan-900/40',
  },
  {
    title: 'HPLC Purity Analysis',
    issuer: 'High-Performance Liquid Chromatography',
    description: 'Each batch undergoes rigorous HPLC analysis to verify compound identity and purity, with results documented in Certificates of Analysis.',
    icon: FlaskConical,
    color: 'text-teal-400',
    bg: 'bg-teal-950/30 border-teal-900/40',
  },
  {
    title: 'Mass Spectrometry Verification',
    issuer: 'LC-MS/MS Confirmation',
    description: 'Liquid chromatography–mass spectrometry confirms molecular weight and structural integrity of all research compounds.',
    icon: Microscope,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30 border-emerald-900/40',
  },
  {
    title: 'Third-Party COA Program',
    issuer: 'Independent Laboratory Network',
    description: 'Certificates of Analysis are issued by independent laboratories with no commercial relationship to Helix Amino, ensuring unbiased results.',
    icon: FileCheck,
    color: 'text-sky-400',
    bg: 'bg-sky-950/30 border-sky-900/40',
  },
  {
    title: 'Sterility & Endotoxin Testing',
    issuer: 'Microbiological Safety Panel',
    description: 'Injectable-grade peptide preparations are screened for microbial contamination and endotoxin levels prior to release.',
    icon: Shield,
    color: 'text-amber-400',
    bg: 'bg-amber-950/30 border-amber-900/40',
  },
  {
    title: 'Batch Traceability System',
    issuer: 'Lot Number Documentation',
    description: 'Every product ships with a lot number traceable to its full synthesis and testing record, enabling complete quality chain visibility.',
    icon: CheckCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-950/30 border-rose-900/40',
  },
];

const STANDARDS = [
  { label: 'Minimum Purity Threshold', value: '≥98%' },
  { label: 'HPLC Peak Purity', value: '≥99%' },
  { label: 'Testing Frequency', value: 'Every Batch' },
  { label: 'COA Availability', value: 'Public' },
  { label: 'Endotoxin Limit', value: '<1 EU/mg' },
  { label: 'Water Content (Karl Fischer)', value: '<8%' },
];

export function LabCertificationsPage() {
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
              <Award className="w-3.5 h-3.5" />
              <span>Quality Assurance</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Lab{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Certifications
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Every compound we offer is verified through multi-stage independent laboratory testing. Our certification program ensures researchers receive only the highest-purity materials.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Quality Standards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
          {STANDARDS.map((s) => (
            <div key={s.label} className="bg-[#07111d] border border-cyan-900/30 rounded-xl p-4 text-center">
              <div className="text-cyan-400 font-bold text-lg mb-1">{s.value}</div>
              <div className="text-gray-500 text-[11px] leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Certification Cards */}
        <h2 className="text-white font-bold text-xl mb-6">Our Testing Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {CERTIFICATIONS.map((cert) => {
            const Icon = cert.icon;
            return (
              <div key={cert.title} className={`border rounded-2xl p-6 ${cert.bg} transition-all duration-200 hover:scale-[1.01]`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-black/20`}>
                  <Icon className={`w-5 h-5 ${cert.color}`} />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{cert.title}</h3>
                <p className={`text-[11px] font-medium mb-3 ${cert.color}`}>{cert.issuer}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{cert.description}</p>
              </div>
            );
          })}
        </div>

        {/* COA CTA */}
        <div className="bg-gradient-to-br from-cyan-950/40 to-teal-950/20 border border-cyan-800/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-700/40 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base mb-1">View Full COA Database</h3>
              <p className="text-gray-400 text-sm">Every batch Certificate of Analysis is publicly available for download.</p>
            </div>
          </div>
          <a
            href="https://github.com/HelixAmino/Amino-COA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-colors duration-200 whitespace-nowrap shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            COA Repository
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-red-950/20 border border-red-900/30 rounded-xl p-4">
          <p className="text-red-300/70 text-xs leading-relaxed text-center">
            <strong className="text-red-400">RESEARCH USE ONLY:</strong> All products and certifications are for in-vitro laboratory research only. Not for human consumption, medical use, or veterinary use. None of these products have been evaluated by the FDA.
          </p>
        </div>
      </div>
    </div>
  );
}
