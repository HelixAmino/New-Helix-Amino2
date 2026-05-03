import { Truck, Package, Clock, Shield, CircleCheck as CheckCircle } from 'lucide-react';
import { PolicyPageLayout } from '../components/PolicyPageLayout';

const HIGHLIGHTS = [
  { icon: Clock, label: 'Ships Within', value: '48 Hours', color: 'text-cyan-400', bg: 'bg-cyan-950/30 border-cyan-900/40' },
  { icon: Truck, label: 'Delivery Time', value: '2–4 Business Days', color: 'text-teal-400', bg: 'bg-teal-950/30 border-teal-900/40' },
  { icon: Package, label: 'Packaging', value: 'Plain & Discreet', color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-900/40' },
  { icon: Shield, label: 'Free Shipping', value: 'Orders Over $150', color: 'text-amber-400', bg: 'bg-amber-950/30 border-amber-900/40' },
];

const POLICIES = [
  {
    title: 'Processing & Dispatch',
    body: 'We ship all orders within 48 hours of purchase via discreet USA domestic shipping. Orders placed on weekends or holidays will be processed the next business day. You will receive a tracking number via email once your order has been dispatched.',
  },
  {
    title: 'Delivery Timeframe',
    body: 'Most orders arrive in 2–4 business days after dispatch. Exact delivery times depend on your location and carrier conditions. Expedited options may be available at checkout for time-sensitive orders.',
  },
  {
    title: 'Packaging & Discretion',
    body: 'All packages are plain and unmarked with no external branding, product names, or descriptions. Packaging is designed to protect the integrity of your research materials and maintain complete discretion.',
  },
  {
    title: 'Tracking',
    body: 'Every shipment is fully tracked from dispatch to delivery. Tracking information will be emailed to you automatically. If you do not receive tracking details within 48 hours of ordering, please contact us.',
  },
  {
    title: 'Free Shipping Threshold',
    body: 'Shipping is free on all domestic orders over $150. Orders below this threshold are subject to a standard shipping fee calculated at checkout.',
  },
  {
    title: 'Domestic Only',
    body: 'We ship to addresses within the United States only. We do not fulfill international orders.',
  },
  {
    title: 'Carrier Delays',
    body: 'We are not responsible for delays caused by carriers. All shipments are final once they leave our facility.',
  },
];

export function ShippingPage() {
  return (
    <PolicyPageLayout
      badge="Shipping"
      title="Shipping Policy"
      subtitle="Fast, discreet domestic fulfillment on every order."
      icon={<Truck className="w-3.5 h-3.5" />}
    >
      {/* Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {HIGHLIGHTS.map((h) => {
          const Icon = h.icon;
          return (
            <div key={h.label} className={`border ${h.bg} rounded-xl p-4 text-center`}>
              <Icon className={`w-5 h-5 ${h.color} mx-auto mb-2`} />
              <div className={`font-bold text-sm ${h.color} mb-0.5`}>{h.value}</div>
              <div className="text-gray-500 text-[11px]">{h.label}</div>
            </div>
          );
        })}
      </div>

      {/* Policy sections */}
      <div className="space-y-4 mb-10">
        {POLICIES.map((p) => (
          <div key={p.title} className="bg-[#07111d] border border-cyan-900/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold text-sm mb-1.5">{p.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{p.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </PolicyPageLayout>
  );
}
