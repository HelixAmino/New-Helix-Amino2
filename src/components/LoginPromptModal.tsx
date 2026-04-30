import { useEffect, useState } from 'react';
import { X, Lock, LogIn, UserPlus, ShieldCheck, FlaskConical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

const DISMISS_KEY = 'helix_login_prompt_dismissed';

export function LoginPromptModal() {
  const { user, loading } = useAuth();
  const [visible, setVisible] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup' | null>(null);

  useEffect(() => {
    if (loading) return;
    if (user) {
      setVisible(false);
      return;
    }
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [user, loading]);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  }

  if (authTab) {
    return (
      <AuthModal
        initialTab={authTab}
        onClose={() => {
          setAuthTab(null);
          dismiss();
        }}
      />
    );
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4 animate-[fadeIn_0.25s_ease-out]">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0a1825] to-[#050d14] border border-teal-700/40 rounded-2xl shadow-[0_30px_100px_rgba(20,184,166,0.25)] overflow-hidden animate-[slideUp_0.35s_cubic-bezier(0.22,1,0.36,1)]">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-teal-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

        <div className="relative px-7 pt-9 pb-7 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/40 mb-5 shadow-[0_0_30px_rgba(20,184,166,0.25)]">
            <Lock className="w-7 h-7 text-teal-300" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-bold uppercase tracking-widest mb-4">
            <FlaskConical className="w-3 h-3" />
            Researcher Portal
          </div>

          <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-3">
            Log In to View Full Catalog
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            Our complete compound library, pricing, and member-only products are reserved for verified researchers.
          </p>

          <div className="grid grid-cols-2 gap-3 my-6 text-left">
            <div className="bg-white/[0.02] border border-cyan-900/30 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-white text-xs font-semibold">Verified Access</span>
              </div>
              <p className="text-gray-500 text-[11px] leading-snug">In-vitro research only</p>
            </div>
            <div className="bg-white/[0.02] border border-cyan-900/30 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2 mb-0.5">
                <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-white text-xs font-semibold">Full Catalog</span>
              </div>
              <p className="text-gray-500 text-[11px] leading-snug">Prices & member SKUs</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setAuthTab('login')}
              className="flex-1 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Log In
            </button>
            <button
              onClick={() => setAuthTab('signup')}
              className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-teal-700/40 hover:border-teal-500/60 text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          <button
            onClick={dismiss}
            className="mt-4 text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            Continue browsing as guest
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
