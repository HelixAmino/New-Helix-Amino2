import { FileText, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Scale } from 'lucide-react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';

const BUYER_AGREEMENTS = [
  'You certify that you are 21 years of age or older.',
  'You are a qualified researcher or scientist purchasing these compounds for legitimate in-vitro laboratory research purposes.',
  'You will use all products in compliance with all applicable federal, state, and local laws.',
  'You understand that all products are strictly for research use only and are not intended for human or animal consumption.',
  'You acknowledge that no products have been evaluated by the FDA and no claims of safety or efficacy are made.',
  'You accept that Helix Amino assumes no liability for any misuse of its research compounds.',
];

const SECTIONS = [
  {
    title: 'Research-Only Use',
    body: 'By purchasing from Helix Amino you agree that all products are sold strictly for in-vitro laboratory research use only. Products are not intended for human consumption, veterinary use, or clinical application of any kind. Any use of our products outside of legitimate research contexts is a violation of these terms.',
  },
  {
    title: 'Age Requirement',
    body: 'You must be 21 years of age or older to purchase from Helix Amino. By completing a purchase, you certify that you meet this age requirement. We reserve the right to request age verification and to cancel any order where this requirement is not met.',
  },
  {
    title: 'Legal Compliance',
    body: 'You certify that your purchase and use of our products is lawful in your jurisdiction. You agree to use all materials in strict accordance with all applicable federal, state, and local laws. The buyer assumes full responsibility for compliance with laws specific to their jurisdiction.',
  },
  {
    title: 'Limitation of Liability',
    body: 'Helix Amino assumes no liability for misuse of its products. To the maximum extent permitted by law, Helix Amino, its owners, employees, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from the purchase or use of our research compounds.',
  },
  {
    title: 'Order Cancellation',
    body: 'We reserve the right to cancel any order at our sole discretion, including but not limited to orders that appear to violate our research-only policy, orders placed with fraudulent information, or orders to jurisdictions where the products may be restricted.',
  },
  {
    title: 'Sales & Refunds',
    body: 'All sales are final except for verified manufacturer defects as described in our Returns Policy. By completing a purchase you acknowledge and accept these terms.',
  },
  {
    title: 'Intellectual Property',
    body: 'All content on the Helix Amino website including but not limited to text, graphics, logos, product descriptions, and COA documents are the property of Helix Amino and may not be reproduced or distributed without express written permission.',
  },
  {
    title: 'Governing Law',
    body: 'These terms are governed by the laws of the United States. Any disputes arising from these terms or from a purchase shall be resolved under US federal law and in courts of competent jurisdiction within the United States.',
  },
  {
    title: 'Modifications',
    body: 'Helix Amino reserves the right to modify these terms at any time without prior notice. Continued use of our site or purchase of our products following any changes constitutes acceptance of the revised terms.',
  },
];

export function TermsPage() {
  return (
    <PolicyPageLayout
      badge="Legal"
      title="Terms of Service"
      subtitle="Please read these terms carefully before purchasing. Your purchase constitutes acceptance."
      icon={<FileText className="w-3.5 h-3.5" />}
    >
      {/* Research-only callout */}
      <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 mb-10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-bold text-sm mb-2">Research Use Only — Mandatory Agreement</h3>
            <p className="text-red-300/70 text-xs leading-relaxed">
              By purchasing from Helix Amino you agree that all products are sold strictly for in-vitro laboratory research use only and are not intended for human or animal consumption. You certify that you are 21+ years of age and that you will use these materials in accordance with all federal, state, and local laws. Helix Amino assumes no liability for misuse.
            </p>
          </div>
        </div>
      </div>

      {/* Buyer agreements checklist */}
      <h2 className="text-white font-bold text-lg mb-5">By Purchasing You Agree That:</h2>
      <div className="bg-[#07111d] border border-cyan-900/20 rounded-2xl p-6 mb-10">
        <ul className="space-y-3">
          {BUYER_AGREEMENTS.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <span className="text-gray-300 text-xs leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Governing law banner */}
      <div className="bg-[#07111d] border border-cyan-900/30 rounded-xl p-4 flex items-center gap-3 mb-8">
        <Scale className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-gray-400 text-xs leading-relaxed">
          <strong className="text-white">Governing Law:</strong> These terms are governed by the laws of the United States. All disputes shall be resolved under US federal law.
        </p>
      </div>

      {/* Detailed sections */}
      <h2 className="text-white font-bold text-lg mb-5">Full Terms</h2>
      <div className="space-y-4">
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
    </PolicyPageLayout>
  );
}
