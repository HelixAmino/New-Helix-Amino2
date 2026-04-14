import { Microscope, Award, ChartBar as BarChart3, Beaker } from 'lucide-react';

const stats = [
  { value: '≥99%', label: 'Average Purity', icon: Beaker },
  { value: '500+', label: 'Compounds Available', icon: Microscope },
  { value: '100%', label: 'Third-Party Tested', icon: Award },
  { value: '48hr', label: 'Average Fulfillment', icon: BarChart3 },
];

export function LabSection() {
  return (
    <section className="relative bg-[#060e17] py-20 px-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Our Standards
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-6 leading-tight">
              Rigorous Testing.{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                Verifiable Results.
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
              Every batch produced at Helix Amino undergoes comprehensive third-party testing before it leaves our facility. We partner with independent ISO-accredited labs to verify purity, identity, and potency.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm sm:text-base">
              Our Certificate of Analysis (COA) program ensures full transparency — download the COA for any product directly from our website before placing your order.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-teal-600/20 border border-cyan-700/40 text-cyan-300 font-semibold rounded-xl text-sm hover:border-cyan-500 hover:text-white transition-all duration-300">
                View Lab Certifications
              </button>
              <button className="px-6 py-3 text-gray-400 font-semibold text-sm hover:text-cyan-300 transition-colors duration-200">
                Download Sample COA →
              </button>
            </div>
          </div>

          {/* Right stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="relative bg-[#07111d] border border-cyan-900/25 rounded-2xl p-6 overflow-hidden group hover:border-cyan-700/40 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/3 rounded-bl-full" />
                <Icon className="w-6 h-6 text-cyan-500/60 mb-3" />
                <div className="text-3xl font-black text-white mb-1 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  {value}
                </div>
                <div className="text-gray-500 text-xs leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
