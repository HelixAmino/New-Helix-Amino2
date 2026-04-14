import { FlaskConical, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import logoImg from '../assets/transparentlogo.png';
import { useNavigation } from '../context/NavigationContext';

const heroBg = new URL('../assets/IMG_2377.PNG', import.meta.url).href;

export function HeroSection() {
  const { navigate } = useNavigation();

  return (
    <section className="relative py-16 sm:py-20 flex flex-col items-center overflow-hidden bg-[#050d14]">
      {/* Background laboratory photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            `url(${heroBg})`,
        }}
      />
      {/* Dark overlay to maintain readability */}
      <div className="absolute inset-0 bg-[#050d14]/80" />
      {/* Cyan tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-transparent to-[#050d14]/90" />
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        {/* Research badge */}
        <div className="mb-7 flex items-center gap-2 bg-cyan-950/50 border border-cyan-800/40 rounded-full px-4 py-1.5 text-cyan-300 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Premium Research Compounds</span>
        </div>

        {/* Logo */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute w-56 h-56 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
          <div className="absolute w-40 h-40 rounded-full bg-teal-400/15 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          <img
            src={logoImg}
            alt="Helix Amino"
            className="relative z-10 w-48 h-auto drop-shadow-[0_0_24px_rgba(0,212,255,0.5)]"
          />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-3 leading-[1.05]">
          Helix Amino{' '}
          <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            – Research Peptides
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-base sm:text-lg mb-8 font-light">
          Third-party tested{' '}
          <span className="text-cyan-300 font-semibold">•</span>{' '}
          <span className="text-cyan-300 font-semibold">≥99% purity</span>{' '}
          <span className="text-cyan-300 font-semibold">•</span>{' '}
          COA available
        </p>

        {/* Trust pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: ShieldCheck, text: '≥99% Purity Guaranteed' },
            { icon: FileText, text: 'COA on Every Batch' },
            { icon: FlaskConical, text: 'Third-Party Lab Tested' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 bg-[#07111d] border border-cyan-900/30 rounded-full px-3 py-1.5 text-gray-300 text-xs"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              {text}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('home')}
          className="group flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl text-sm tracking-widest uppercase hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Browse All Compounds
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </section>
  );
}
