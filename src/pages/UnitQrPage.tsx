import { useState } from 'react';
import { TriangleAlert as AlertTriangle, FileText, ShieldCheck, Mail, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { AuthModal } from '../components/AuthModal';
import logoImg from '../assets/transparentlogo.png';

export function UnitQrPage() {
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();
  const [authOpen, setAuthOpen] = useState<null | 'login' | 'signup'>(null);

  return (
    <div className="min-h-screen bg-[#050d14] text-white flex flex-col">
      <div className="flex items-center justify-center px-4 py-6 border-b border-cyan-900/30">
        <img src={logoImg} alt="Helix Amino" className="w-12 h-12 object-contain" />
      </div>

      <main className="flex-1 px-4 py-8 sm:py-12 max-w-3xl mx-auto w-full">
        <div className="rounded-2xl border-2 border-red-500/60 bg-red-950/30 p-5 sm:p-6 mb-8 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-7 h-7 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-300 text-xs font-bold uppercase tracking-widest mb-1">Mandatory Notice</div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                For In Vitro Research Use Only
              </h1>
            </div>
          </div>
          <p className="text-red-100/90 text-sm sm:text-base leading-relaxed">
            All products supplied by Helix Amino are intended strictly for <strong>in vitro laboratory research</strong>.
            They are <strong>NOT</strong> for human or veterinary use, therapeutic use, diagnostic use, or food use. Products
            are not intended to diagnose, treat, cure, or prevent any disease. By accessing this material you affirm that
            you are a qualified researcher and will handle these compounds in a certified research setting in accordance
            with all applicable laws and regulations.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-900/40 bg-[#07111d] p-5 sm:p-6 mb-8">
          <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Supplier of Record</div>
          <div className="text-white font-semibold text-lg leading-snug">FAP Wellness LLC</div>
          <div className="text-gray-300 text-sm">DBA Helix Amino &middot; Helix Research</div>
          <div className="text-gray-400 text-sm mt-3 leading-relaxed">
            3099 Albany Post Road, Suite 301G<br />
            Buchanan, NY 10511
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-900/40 bg-[#07111d] p-5 sm:p-6 mb-8">
          <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Account Access</div>
          <h2 className="text-white font-bold text-lg mb-2">View the full research catalog</h2>
          <p className="text-gray-400 text-sm mb-4">
            Sign in or create a verified researcher account to view full product details, pricing, and documentation.
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('home')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                View Full Catalog
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cyan-800/40 text-gray-300 hover:bg-cyan-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setAuthOpen('login')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <LogIn className="w-4 h-4" /> Log In
              </button>
              <button
                onClick={() => setAuthOpen('signup')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cyan-700/60 text-cyan-200 hover:bg-cyan-900/30 transition-colors font-semibold"
              >
                <UserPlus className="w-4 h-4" /> Create Account
              </button>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('coa-library')}
            className="group rounded-2xl border border-cyan-900/40 bg-[#07111d] p-5 text-left hover:border-cyan-600/50 hover:bg-[#0a1724] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-900/30 flex items-center justify-center mb-3 group-hover:bg-cyan-800/40 transition-colors">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-white font-bold mb-1">COA Library</div>
            <div className="text-gray-400 text-sm">Certificates of Analysis for every lot.</div>
          </button>

          <button
            onClick={() => navigate('sds-library')}
            className="group rounded-2xl border border-cyan-900/40 bg-[#07111d] p-5 text-left hover:border-cyan-600/50 hover:bg-[#0a1724] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-900/30 flex items-center justify-center mb-3 group-hover:bg-cyan-800/40 transition-colors">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-white font-bold mb-1">SDS Library</div>
            <div className="text-gray-400 text-sm">Safety Data Sheets for handling and storage.</div>
          </button>
        </div>

        <div className="rounded-2xl border border-cyan-900/40 bg-[#07111d] p-5 sm:p-6">
          <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Need Help?</div>
          <p className="text-gray-400 text-sm mb-4">
            Use live chat for immediate assistance, or send us an email.
          </p>
          <a
            href="mailto:info@helixamino.com?subject=Unit%20QR%20Inquiry"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Mail className="w-4 h-4" /> Contact Us
          </a>
        </div>
      </main>

      <footer className="px-4 py-6 text-center text-xs text-gray-600 border-t border-cyan-900/30">
        FAP Wellness LLC &middot; For research use only &middot; Not for human consumption
      </footer>

      {authOpen && <AuthModal initialTab={authOpen} onClose={() => setAuthOpen(null)} />}
    </div>
  );
}
