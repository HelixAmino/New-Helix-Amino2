import { ShieldCheck, CircleCheck as CheckCircle, Mail } from 'lucide-react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';
import { useNavigation } from '../context/NavigationContext';

const SECTIONS: { title: string; body: string }[] = [
  {
    title: '1. Research Use Only (RUO) Statement',
    body: 'All products sold by Helix Amino are strictly for laboratory research use only. They are not for human consumption, therapeutic, diagnostic, or any other use. By purchasing from Helix Amino, you confirm that you are a qualified researcher or laboratory and will use these compounds exclusively for in-vitro research purposes in compliance with all applicable laws.',
  },
  {
    title: '2. Age Restriction',
    body: 'You must be 21 years of age or older to purchase from this website. We use age verification on every visit.',
  },
  {
    title: '3. Product Disclaimer',
    body: 'Helix Amino does not provide medical advice, treatment recommendations, or claims of efficacy. All information on this site is for educational and research purposes only. Customers are solely responsible for compliance with local, state, and federal regulations regarding research chemicals.',
  },
  {
    title: '4. Shipping Policy',
    body: 'We ship discreetly within the United States only. Orders typically ship within 1–2 business days. Free shipping is available on orders over $200. We do not ship internationally. All packages are sent in plain packaging with no product names listed on the exterior.',
  },
  {
    title: '5. Return & Refund Policy',
    body: 'Due to the nature of research compounds, opened or used products cannot be returned or refunded. Unopened products may be eligible for return within 14 days if defective or damaged during shipping. All sales of opened vials are final for safety and regulatory compliance.',
  },
  {
    title: '7. Quality & Testing',
    body: 'Every batch is third-party tested for purity (≥99%) with Certificates of Analysis (COA) available on each product page. We maintain strict quality control standards for all research compounds.',
  },
];

export function CompliancePage() {
  const { navigate } = useNavigation();

  return (
    <PolicyPageLayout
      badge="Compliance"
      title="Compliance & Research Use Only Policy"
      subtitle="Last Updated: May 2026"
      icon={<ShieldCheck className="w-3.5 h-3.5" />}
    >
      <div className="space-y-4 mb-10">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold text-sm mb-1.5">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.body}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Section 6: Terms of Service Summary with inline links */}
        <div className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold text-sm mb-1.5">6. Terms of Service Summary</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-2">
                <button
                  onClick={() => navigate('terms')}
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                >
                  Full Terms of Service
                </button>
                <span className="mx-2 text-gray-600">|</span>
                <button
                  onClick={() => navigate('privacy')}
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                >
                  Full Privacy Policy
                </button>
                <span className="mx-2 text-gray-600">|</span>
                <button
                  onClick={() => navigate('shipping')}
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                >
                  Full Shipping Policy
                </button>
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                By using this website or making a purchase, you agree to these terms and confirm you are purchasing solely for legitimate scientific research.
              </p>
            </div>
          </div>
        </div>

        {/* Section 8: Contact */}
        <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold text-sm mb-1.5">8. Contact for Compliance Questions</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                If you are a regulator, reviewer, or have compliance-related questions, please contact us at:{' '}
                <a
                  href="mailto:compliance@helixamino.com"
                  className="text-cyan-300 font-semibold hover:text-cyan-200 underline underline-offset-2"
                >
                  compliance@helixamino.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 italic text-xs leading-relaxed">
        Helix Amino is committed to full regulatory compliance and supports legitimate scientific research.
      </p>
    </PolicyPageLayout>
  );
}
