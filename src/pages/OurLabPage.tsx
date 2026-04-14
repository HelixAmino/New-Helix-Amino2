import { Microscope, FlaskConical, Shield, Thermometer, Zap, Award, ExternalLink, CircleCheck as CheckCircle } from 'lucide-react';

const CAPABILITIES = [
  {
    icon: FlaskConical,
    title: 'Solid-Phase Peptide Synthesis',
    desc: 'Fmoc-SPPS on automated synthesizers using highly activated amino acid derivatives. Stepwise chain assembly with iterative coupling and deprotection cycles.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/30 border-cyan-900/40',
  },
  {
    icon: Zap,
    title: 'HPLC Purification',
    desc: 'Preparative reverse-phase HPLC with C18 columns isolates target peptides from truncation sequences, deletion variants, and synthesis byproducts.',
    color: 'text-teal-400',
    bg: 'bg-teal-950/30 border-teal-900/40',
  },
  {
    icon: Thermometer,
    title: 'Lyophilization (Freeze-Drying)',
    desc: 'Pharmaceutical-grade lyophilizers remove solvent under vacuum at low temperature to produce shelf-stable, hygroscopic peptide powders.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30 border-emerald-900/40',
  },
  {
    icon: Microscope,
    title: 'Analytical HPLC & MS',
    desc: 'In-house analytical HPLC provides rapid purity screening. LC-MS confirms molecular identity before submission to third-party labs for final COA.',
    color: 'text-sky-400',
    bg: 'bg-sky-950/30 border-sky-900/40',
  },
  {
    icon: Shield,
    title: 'Cleanroom Filling',
    desc: 'Aseptic vial filling is performed in ISO Class 5 biosafety cabinets. All surfaces are decontaminated between batch runs.',
    color: 'text-amber-400',
    bg: 'bg-amber-950/30 border-amber-900/40',
  },
  {
    icon: Award,
    title: 'Quality Documentation',
    desc: 'Full batch records, raw material traceability, deviation reports, and stability tracking are maintained in compliance with GMP-aligned documentation practices.',
    color: 'text-rose-400',
    bg: 'bg-rose-950/30 border-rose-900/40',
  },
];

const EQUIPMENT = [
  { name: 'Automated Peptide Synthesizer', spec: 'Multi-channel Fmoc-SPPS platform' },
  { name: 'Preparative HPLC System', spec: 'C18 reverse-phase, 30mm ID column' },
  { name: 'Analytical HPLC', spec: 'UV detector, 214/254 nm dual wavelength' },
  { name: 'LC-MS System', spec: 'ESI-TOF mass spectrometry, <5 ppm accuracy' },
  { name: 'Lyophilizer', spec: '–80°C shelf temperature, <100 mTorr vacuum' },
  { name: 'Biosafety Cabinet', spec: 'ISO Class 5, laminar flow, Class II Type A2' },
  { name: 'Karl Fischer Titrator', spec: 'Coulometric moisture analysis' },
  { name: 'Analytical Balance', spec: '0.01 mg readability' },
];

const PROCESS_STEPS = [
  {
    phase: 'Phase 1',
    title: 'Resin Loading',
    desc: 'Wang or Rink amide resin is loaded with the C-terminal amino acid. Loading efficiency is confirmed gravimetrically before synthesis begins.',
  },
  {
    phase: 'Phase 2',
    title: 'Chain Assembly',
    desc: 'Automated Fmoc deprotection and amino acid coupling cycles build the sequence from C-terminus to N-terminus. Capping steps minimize deletion sequences.',
  },
  {
    phase: 'Phase 3',
    title: 'Cleavage & Deprotection',
    desc: 'The resin-bound peptide is cleaved using TFA-based cocktails that simultaneously remove side-chain protecting groups.',
  },
  {
    phase: 'Phase 4',
    title: 'Precipitation & Crude Isolation',
    desc: 'Cold diethyl ether precipitation isolates crude peptide. The precipitate is filtered, washed, and dissolved for purification.',
  },
  {
    phase: 'Phase 5',
    title: 'Preparative HPLC Purification',
    desc: 'Gradient elution on a C18 column separates the target compound from impurities. Fractions are collected and analyzed by analytical HPLC.',
  },
  {
    phase: 'Phase 6',
    title: 'Lyophilization & Filling',
    desc: 'Pooled pure fractions are lyophilized to dry powder and aseptically filled into sterile glass vials in our ISO-controlled filling area.',
  },
];

export function OurLabPage() {
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
              <Microscope className="w-3.5 h-3.5" />
              <span>Facility Overview</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Our{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Lab
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Helix Amino operates a dedicated peptide synthesis and quality control facility with fully documented processes from raw resin to finished vial.
          </p>

          {/* Key stats */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { val: 'USA', label: 'Domestic Fulfillment' },
              { val: 'ISO 5', label: 'Filling Environment' },
              { val: 'GMP-aligned', label: 'Documentation' },
              { val: '3rd Party', label: 'Testing' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 bg-[#07111d] border border-cyan-900/30 rounded-xl px-4 py-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white font-bold text-sm">{s.val}</span>
                <span className="text-gray-400 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Core capabilities */}
        <h2 className="text-white font-bold text-xl mb-6">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div key={cap.title} className={`border ${cap.bg} rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-200`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-black/20">
                  <Icon className={`w-5 h-5 ${cap.color}`} />
                </div>
                <h3 className={`font-bold text-sm mb-2 ${cap.color}`}>{cap.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Synthesis process */}
        <h2 className="text-white font-bold text-xl mb-6">Synthesis Process</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {PROCESS_STEPS.map((s) => (
            <div key={s.phase} className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-5">
              <span className="text-cyan-500 font-bold text-[11px] uppercase tracking-wider block mb-1.5">{s.phase}</span>
              <h4 className="text-white font-semibold text-sm mb-2">{s.title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Equipment list */}
        <h2 className="text-white font-bold text-xl mb-6">Key Equipment</h2>
        <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl overflow-hidden mb-14">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-900/30">
                <th className="text-left text-gray-500 text-[11px] uppercase tracking-widest font-semibold px-5 py-3.5">Equipment</th>
                <th className="text-left text-gray-500 text-[11px] uppercase tracking-widest font-semibold px-5 py-3.5">Specification</th>
              </tr>
            </thead>
            <tbody>
              {EQUIPMENT.map((eq, i) => (
                <tr key={i} className="border-b border-cyan-900/10 hover:bg-cyan-950/10 transition-colors duration-150">
                  <td className="px-5 py-3.5">
                    <span className="text-white text-xs font-medium">{eq.name}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-gray-400 text-xs">{eq.spec}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COA CTA */}
        <div className="bg-gradient-to-br from-cyan-950/40 to-teal-950/20 border border-cyan-800/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-white font-bold text-base mb-1">See the Results For Yourself</h3>
            <p className="text-gray-400 text-sm">Every batch COA is publicly available and independently verified.</p>
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
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4">
          <p className="text-red-300/70 text-xs leading-relaxed text-center">
            <strong className="text-red-400">RESEARCH USE ONLY:</strong> All products manufactured in this facility are strictly for in-vitro laboratory research only. Not for human consumption, medical use, or veterinary use. Facility operates under US law for research chemical manufacturing.
          </p>
        </div>
      </div>
    </div>
  );
}
