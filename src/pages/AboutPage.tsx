import { FlaskConical, Award, Shield, Zap, Users } from 'lucide-react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';

const VALUES = [
  {
    icon: Award,
    title: 'Uncompromising Purity',
    desc: 'Every compound meets a minimum ≥99% HPLC purity threshold before it reaches any researcher. No exceptions.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/30 border-cyan-900/40',
  },
  {
    icon: Shield,
    title: 'Third-Party Verified',
    desc: 'Independent laboratories with no commercial ties to Helix Amino issue every Certificate of Analysis.',
    color: 'text-teal-400',
    bg: 'bg-teal-950/30 border-teal-900/40',
  },
  {
    icon: FlaskConical,
    title: 'USA Manufactured',
    desc: 'All compounds are synthesized, tested, and shipped domestically. No international sourcing or rebranding.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30 border-emerald-900/40',
  },
  {
    icon: Zap,
    title: 'Fast Fulfillment',
    desc: 'Orders ship within 48 hours via fully tracked domestic shipping in plain, discreet packaging.',
    color: 'text-amber-400',
    bg: 'bg-amber-950/30 border-amber-900/40',
  },
  {
    icon: Users,
    title: 'Built by Researchers',
    desc: 'Founded by scientists with direct experience in peptide research. We understand what the laboratory demands.',
    color: 'text-sky-400',
    bg: 'bg-sky-950/30 border-sky-900/40',
  },
];

export function AboutPage() {
  return (
    <PolicyPageLayout
      badge="Our Story"
      title="About Helix Amino"
      subtitle="Founded by researchers, for researchers."
      icon={<FlaskConical className="w-3.5 h-3.5" />}
    >
      {/* Mission statement */}
      <div className="bg-[#07111d] border border-cyan-900/30 rounded-2xl p-8 mb-10">
        <p className="text-gray-300 text-base leading-relaxed">
          Helix Amino was founded by researchers for researchers. We specialize in providing <span className="text-cyan-400 font-semibold">≥99% purity</span> research peptides, blends, and compounds manufactured in the USA and shipped domestically. Every batch undergoes third-party testing with COAs available upon request.
        </p>
        <div className="mt-6 pt-6 border-t border-cyan-900/20">
          <p className="text-gray-400 text-sm leading-relaxed">
            Our mission is to advance scientific discovery by delivering consistent, high-quality research materials with uncompromising standards of purity, transparency, and speed. All products are strictly for in-vitro laboratory research use only and are not for human consumption.
          </p>
        </div>
      </div>

      {/* Core values */}
      <h2 className="text-white font-bold text-lg mb-5">Our Core Values</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {VALUES.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.title} className={`border ${v.bg} rounded-2xl p-5`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${v.color}`} />
                </div>
                <h3 className={`font-semibold text-sm ${v.color}`}>{v.title}</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{v.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { val: '≥99%', label: 'Minimum Purity' },
          { val: '100%', label: 'Third-Party Tested' },
          { val: 'USA', label: 'Manufactured & Shipped' },
          { val: '48hr', label: 'Order Fulfillment' },
        ].map((s) => (
          <div key={s.label} className="bg-[#07111d] border border-cyan-900/30 rounded-xl p-4 text-center">
            <div className="text-cyan-400 font-bold text-xl mb-1">{s.val}</div>
            <div className="text-gray-500 text-[11px] leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
    </PolicyPageLayout>
  );
}
