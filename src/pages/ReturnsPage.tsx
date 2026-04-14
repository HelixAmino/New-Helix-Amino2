import { RotateCcw, CircleCheck as CheckCircle, Circle as XCircle, Mail, TriangleAlert as AlertTriangle } from 'lucide-react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';

const ELIGIBLE = [
  'Product was received damaged in transit',
  'Incorrect item was shipped compared to what was ordered',
  'Manufacturer-verified defect confirmed upon review',
];

const NOT_ELIGIBLE = [
  'Change of mind or accidental purchase',
  'Products that have been opened, used, or stored improperly',
  'Claims submitted more than 48 hours after delivery',
  'International orders (all international sales are final)',
  'Products purchased during clearance or promotional sales',
];

const STEPS = [
  { step: '01', title: 'Contact Within 48 Hours', desc: 'Email info@helixamino.com within 48 hours of receiving your order. Include your order number and a clear description of the issue.' },
  { step: '02', title: 'Submit Photo Evidence', desc: 'Provide clear photographs of the damaged, defective, or incorrect item along with the original packaging.' },
  { step: '03', title: 'Review & Verification', desc: 'Our team will review your claim within 1–2 business days and confirm whether the issue qualifies under our returns policy.' },
  { step: '04', title: 'Resolution', desc: 'Approved claims will be resolved by either a full replacement shipment at no cost or a refund limited to the defective product only.' },
];

export function ReturnsPage() {
  return (
    <PolicyPageLayout
      badge="Returns"
      title="Returns Policy"
      subtitle="Due to the nature of research compounds, all sales are final except in cases of verified manufacturer defect."
      icon={<RotateCcw className="w-3.5 h-3.5" />}
    >
      {/* Overview */}
      <div className="bg-[#07111d] border border-cyan-900/30 rounded-2xl p-7 mb-10">
        <p className="text-gray-300 text-sm leading-relaxed">
          Due to the nature of research chemicals, we do not accept returns or offer refunds except in the rare case of a <strong className="text-white">verified manufacturer defect</strong>. If you receive a damaged or incorrect product, contact us within 48 hours with photos and order details. We will replace the item at no cost or issue a refund for the defective product only. All sales are final otherwise.
        </p>
        <div className="mt-4 pt-4 border-t border-cyan-900/20">
          <p className="text-gray-500 text-xs leading-relaxed">
            This policy protects the integrity of our research materials and complies with strict laboratory standards. Opened or used vials cannot be restocked, retested, or resold under any circumstances.
          </p>
        </div>
      </div>

      {/* Eligible vs not eligible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-5">
          <h3 className="text-emerald-400 font-semibold text-sm mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Eligible for Return
          </h3>
          <ul className="space-y-3">
            {ELIGIBLE.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-300 text-xs leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-5">
          <h3 className="text-red-400 font-semibold text-sm mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Not Eligible for Return
          </h3>
          <ul className="space-y-3">
            {NOT_ELIGIBLE.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-xs leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Claim process */}
      <h2 className="text-white font-bold text-lg mb-5">How to Submit a Claim</h2>
      <div className="space-y-3 mb-10">
        {STEPS.map((s) => (
          <div key={s.step} className="flex items-start gap-4 bg-[#07111d] border border-cyan-900/20 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-900/40 flex items-center justify-center shrink-0 text-cyan-500 font-bold text-xs">
              {s.step}
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">{s.title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
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
          <p className="text-white font-semibold text-sm mb-0.5">Questions about a return?</p>
          <a href="mailto:info@helixamino.com" className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors">
            info@helixamino.com
          </a>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-5 bg-amber-950/20 border border-amber-900/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-300/70 text-xs leading-relaxed">
            <strong className="text-amber-400">Important:</strong> Claims submitted after 48 hours of confirmed delivery will not be accepted. We strongly recommend inspecting your order immediately upon receipt.
          </p>
        </div>
      </div>
    </PolicyPageLayout>
  );
}
