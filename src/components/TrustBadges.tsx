import { ShieldCheck, FlaskConical, FileText, Truck } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: '≥99% Purity',
    subtitle: 'Guaranteed on every batch',
    color: 'text-cyan-400',
    border: 'border-cyan-800/40',
    bg: 'bg-cyan-950/20',
    glow: 'hover:shadow-[0_0_20px_rgba(0,212,255,0.12)]',
  },
  {
    icon: FlaskConical,
    title: 'Third-Party Tested',
    subtitle: 'Independent lab verification',
    color: 'text-teal-400',
    border: 'border-teal-800/40',
    bg: 'bg-teal-950/20',
    glow: 'hover:shadow-[0_0_20px_rgba(0,201,160,0.12)]',
  },
  {
    icon: FileText,
    title: 'COA on Every Batch',
    subtitle: 'Full certificate of analysis',
    color: 'text-sky-400',
    border: 'border-sky-800/40',
    bg: 'bg-sky-950/20',
    glow: 'hover:shadow-[0_0_20px_rgba(56,189,248,0.12)]',
  },
  {
    icon: Truck,
    title: 'Fast USA Shipping',
    subtitle: 'Discreet domestic fulfillment',
    color: 'text-cyan-300',
    border: 'border-cyan-800/40',
    bg: 'bg-cyan-950/20',
    glow: 'hover:shadow-[0_0_20px_rgba(0,212,255,0.12)]',
  },
];

export function TrustBadges() {
  return (
    <section className="relative bg-[#060e17] border-y border-cyan-900/20 py-10 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(({ icon: Icon, title, subtitle, color, border, bg, glow }) => (
            <div
              key={title}
              className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-xl border ${border} ${bg} ${glow} transition-all duration-300 group cursor-default`}
            >
              <div className={`shrink-0 p-2.5 rounded-lg ${bg} border ${border} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-center sm:text-left">
                <div className={`font-bold text-sm ${color} tracking-wide`}>{title}</div>
                <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
