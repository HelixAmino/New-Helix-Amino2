import logoImg from '../assets/transparentlogo.png';
import { Mail, MapPin } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { Page } from '../types';

const RESEARCH_LINKS: { label: string; page: Page | null; href?: string }[] = [
  { label: 'COA Library', page: 'coa-library' },
  { label: 'Lab Certifications', page: 'lab-certifications' },
  { label: 'Purity Testing', page: 'purity-testing' },
  { label: 'Research Library', page: 'research-library' },
  { label: 'Compound Guide', page: 'compound-guide' },
  { label: 'HPLC Reports', page: 'hplc-reports' },
];

const COMPANY_LINKS: { label: string; page: Page | null }[] = [
  { label: 'About Us', page: 'about' },
  { label: 'Our Lab', page: 'our-lab' },
  { label: 'Shipping Policy', page: 'shipping' },
  { label: 'Returns', page: 'returns' },
  { label: 'Privacy Policy', page: 'privacy' },
  { label: 'Terms of Service', page: 'terms' },
];

const PRODUCT_CATEGORIES = [
  { label: 'Recovery & Healing', cat: 'Recovery & Healing' },
  { label: 'GH & Growth Axis', cat: 'GH & Growth Axis' },
  { label: 'Metabolic & GLP-1', cat: 'Metabolic & GLP-1 Related' },
  { label: 'Nootropics & Cognition', cat: 'Nootropics and Cognition' },
  { label: 'Longevity & Mitochondrial', cat: 'Longevity and Mitochondrial' },
  { label: 'Blends & Specialty', cat: 'Blends & Specialty' },
];

export function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-[#040b11] border-t border-cyan-900/20 pt-16 pb-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt="Helix Amino Logo" className="h-8 w-auto" />
              <div>
                <div className="text-white font-bold text-base tracking-wider">HELIX AMINO</div>
                <div className="text-cyan-400 text-[9px] tracking-[0.2em] uppercase">Research Peptides Only</div>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-5">
              Premium research peptides for serious scientific research. All compounds are for in-vitro laboratory use only. Not for human consumption.
            </p>
            <div className="flex flex-col gap-2.5">
              <a href="mailto:info@helixamino.com" className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 text-xs transition-colors duration-200">
                <Mail className="w-3.5 h-3.5" />
                info@helixamino.com
              </a>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                USA Domestic Fulfillment
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-5">Products</h4>
            <ul className="space-y-3">
              {PRODUCT_CATEGORIES.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigate('home', undefined, item.cat)}
                    className="text-gray-500 hover:text-cyan-300 text-xs transition-colors duration-200 text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-5">Research</h4>
            <ul className="space-y-3">
              {RESEARCH_LINKS.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-cyan-300 text-xs transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ) : item.page ? (
                    <button
                      onClick={() => navigate(item.page!)}
                      className="text-gray-500 hover:text-cyan-300 text-xs transition-colors duration-200 text-left"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-5">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  {item.page ? (
                    <button
                      onClick={() => navigate(item.page!)}
                      className="text-gray-500 hover:text-cyan-300 text-xs transition-colors duration-200 text-left"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs cursor-default">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-cyan-900/20 pt-8">
          <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4 mb-6">
            <p className="text-red-300/70 text-xs leading-relaxed text-center">
              <strong className="text-red-400">DISCLAIMER:</strong> All products are strictly for research and laboratory use only. Not intended for human consumption, medical use, or veterinary use. None of these products have been evaluated by the FDA. By purchasing, you confirm you are a qualified researcher and products will be used solely for scientific research purposes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-600 text-xs">
            <span>© 2024 Helix Amino – Research Peptides Only. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('privacy')} className="hover:text-gray-400 transition-colors">Privacy</button>
              <button onClick={() => navigate('terms')} className="hover:text-gray-400 transition-colors">Terms</button>
              <button onClick={() => navigate('about')} className="hover:text-gray-400 transition-colors">About</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
