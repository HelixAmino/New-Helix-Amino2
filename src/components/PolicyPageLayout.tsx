import { ArrowLeft, TriangleAlert as AlertTriangle } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { ReactNode } from 'react';

interface PolicyPageLayoutProps {
  badge: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}

export function PolicyPageLayout({ badge, title, subtitle, icon, children }: PolicyPageLayoutProps) {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-[#050d14]">
      {/* Top disclaimer banner */}
      <div className="bg-red-950/30 border-b border-red-900/40 px-4 py-3">
        <p className="text-center text-red-300/80 text-xs leading-relaxed max-w-4xl mx-auto">
          <strong className="text-red-400">DISCLAIMER:</strong> All products are strictly for research and laboratory use only. These products have not been evaluated by the FDA. By purchasing, you confirm you are a qualified researcher.
        </p>
      </div>

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
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 text-xs font-medium transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to Catalog
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-cyan-950/50 border border-cyan-800/40 rounded-full px-4 py-1.5 text-cyan-300 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
              {icon}
              <span>{badge}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed max-w-xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}

        {/* Bottom disclaimer */}
        <div className="mt-12 bg-red-950/20 border border-red-900/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300/70 text-xs leading-relaxed">
              <strong className="text-red-400">DISCLAIMER:</strong> All products are strictly for research and laboratory use only. Not intended for human consumption, medical use, or veterinary use. None of these products have been evaluated by the FDA. By purchasing, you confirm you are a qualified researcher and products will be used solely for scientific research purposes.
            </p>
          </div>
        </div>

        {/* Back to catalog */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
