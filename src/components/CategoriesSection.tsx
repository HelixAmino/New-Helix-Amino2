import { Dna, Brain, Heart, Zap, Shield, Microscope } from 'lucide-react';

const categories = [
  { name: 'Growth Peptides', count: 24, icon: Zap, color: 'from-cyan-500/20 to-cyan-800/10 border-cyan-700/30 hover:border-cyan-500/60', iconColor: 'text-cyan-400' },
  { name: 'Cognitive Research', count: 18, icon: Brain, color: 'from-teal-500/20 to-teal-800/10 border-teal-700/30 hover:border-teal-500/60', iconColor: 'text-teal-400' },
  { name: 'Healing Compounds', count: 31, icon: Heart, color: 'from-sky-500/20 to-sky-800/10 border-sky-700/30 hover:border-sky-500/60', iconColor: 'text-sky-400' },
  { name: 'Longevity & Anti-aging', count: 15, icon: Dna, color: 'from-cyan-600/20 to-cyan-900/10 border-cyan-700/30 hover:border-cyan-500/60', iconColor: 'text-cyan-300' },
  { name: 'Immune Research', count: 22, icon: Shield, color: 'from-teal-600/20 to-teal-900/10 border-teal-700/30 hover:border-teal-500/60', iconColor: 'text-teal-300' },
  { name: 'Research Chemicals', count: 47, icon: Microscope, color: 'from-sky-600/20 to-sky-900/10 border-sky-700/30 hover:border-sky-500/60', iconColor: 'text-sky-300' },
];

export function CategoriesSection() {
  return (
    <section className="bg-[#050d14] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Categories
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Explore by Research Area
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ name, count, icon: Icon, color, iconColor }) => (
            <button
              key={name}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b ${color} border transition-all duration-300 hover:scale-105 active:scale-95 group`}
            >
              <div className={`p-3 rounded-xl bg-[#050d14]/60 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="text-center">
                <div className="text-white text-xs font-bold leading-tight">{name}</div>
                <div className="text-gray-500 text-xs mt-1">{count} items</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
