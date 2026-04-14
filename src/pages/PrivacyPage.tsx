import { Lock, Shield, Eye, Trash2, Mail } from 'lucide-react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';

const PRINCIPLES = [
  {
    icon: Lock,
    title: 'Minimal Data Collection',
    desc: 'We collect only the minimum information necessary to process your order: name, shipping address, email, and payment details. Nothing more.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/30 border-cyan-900/40',
  },
  {
    icon: Shield,
    title: 'Never Sold or Shared',
    desc: 'We never sell, rent, or share your personal data with any third parties for marketing or any other purpose.',
    color: 'text-teal-400',
    bg: 'bg-teal-950/30 border-teal-900/40',
  },
  {
    icon: Eye,
    title: 'No External Analytics',
    desc: 'We do not use tracking cookies or analytics tools that share data externally. Your browsing activity stays private.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30 border-emerald-900/40',
  },
  {
    icon: Trash2,
    title: 'Right to Deletion',
    desc: 'You may request deletion of your data at any time by contacting us directly. We will process your request promptly.',
    color: 'text-rose-400',
    bg: 'bg-rose-950/30 border-rose-900/40',
  },
];

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: 'When you place an order, we collect your name, shipping address, email address, and payment details. Payment information is processed through encrypted payment processors and is never stored on our servers in raw form.',
  },
  {
    title: 'How We Use Your Information',
    body: 'Your information is used solely to process and fulfill your order, communicate shipping and tracking updates, and provide customer support if needed. We do not use your data for any marketing, profiling, or third-party purposes.',
  },
  {
    title: 'Data Storage & Security',
    body: 'Your information is stored securely on our servers using industry-standard encryption (TLS/SSL). Access is restricted exclusively to authorized Helix Amino staff on a need-to-know basis.',
  },
  {
    title: 'Cookies & Tracking',
    body: 'We do not use tracking cookies, third-party analytics platforms, or any tools that transmit your data to external parties. Any session cookies used are strictly functional and are never used to identify or track you across other websites.',
  },
  {
    title: 'Third-Party Disclosure',
    body: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website and fulfilling orders, provided those parties agree to keep your information confidential.',
  },
  {
    title: 'Your Rights',
    body: 'You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us at info@helixamino.com. We will respond to all data requests within 30 days.',
  },
  {
    title: 'Legal Compliance',
    body: 'We comply with all applicable privacy laws. We may disclose your information when required by law, court order, or governmental authority, or when necessary to protect the rights and safety of Helix Amino or others.',
  },
  {
    title: 'Policy Updates',
    body: 'We reserve the right to update this privacy policy at any time. Changes will be posted on this page with an updated effective date. Continued use of our site after any changes constitutes acceptance of the revised policy.',
  },
];

export function PrivacyPage() {
  return (
    <PolicyPageLayout
      badge="Legal"
      title="Privacy Policy"
      subtitle="Your privacy is our top priority. We collect only what is necessary and share nothing."
      icon={<Lock className="w-3.5 h-3.5" />}
    >
      {/* Core principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {PRINCIPLES.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className={`border ${p.bg} rounded-2xl p-5`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${p.color}`} />
                </div>
                <h3 className={`font-semibold text-sm ${p.color}`}>{p.title}</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Detailed sections */}
      <div className="space-y-4 mb-10">
        {SECTIONS.map((s, i) => (
          <div key={s.title} className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-cyan-600 font-bold text-xs w-6 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1.5">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="bg-[#07111d] border border-cyan-900/30 rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-950/50 border border-cyan-900/40 flex items-center justify-center shrink-0">
          <Mail className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm mb-0.5">Privacy inquiries or data deletion requests</p>
          <a href="mailto:info@helixamino.com" className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors">
            info@helixamino.com
          </a>
        </div>
      </div>
    </PolicyPageLayout>
  );
}
