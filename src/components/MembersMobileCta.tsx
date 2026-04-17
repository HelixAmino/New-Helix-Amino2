import { useState } from 'react';
import { ShieldCheck, Lock, ChevronRight, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { AuthModal } from './AuthModal';

export function MembersMobileCta() {
  const { user, loading } = useAuth();
  const { navigate } = useNavigation();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('signup');

  if (loading || user) return null;

  return (
    <>
      <div className="md:hidden mb-6">
        <div className="relative overflow-hidden rounded-2xl border border-orange-700/40 bg-gradient-to-br from-[#1a0b05] via-[#120904] to-[#07111d] shadow-[0_8px_32px_rgba(249,115,22,0.15)]">
          <div className="absolute -top-12 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-8 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-950/60 border border-orange-700/50">
                <Lock className="w-3 h-3 text-orange-400" />
                <span className="text-orange-300 text-[10px] font-black uppercase tracking-widest">
                  Members Only
                </span>
              </div>
              <div className="flex items-center gap-1 text-orange-400/80 text-[10px] font-semibold">
                <Sparkles className="w-3 h-3" />
                Exclusive
              </div>
            </div>

            <h3 className="text-white font-black text-lg leading-tight mb-1.5">
              Unlock the GLP-1 &amp; Metabolic Catalog
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Access Retatrutide, Semaglutide, Tirzepatide, Cagrilintide and more.
              Exclusively available to verified research members.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setAuthTab('signup'); setAuthOpen(true); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-[0_0_24px_rgba(249,115,22,0.35)] active:scale-[0.98]"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                Create Free Membership
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthTab('login'); setAuthOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-transparent border border-orange-800/50 hover:border-orange-500 text-orange-300 hover:text-white font-semibold text-xs rounded-xl transition-all duration-200"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  Sign In
                </button>
                <button
                  onClick={() => navigate('members')}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 bg-transparent border border-orange-900/40 hover:border-orange-700/60 text-gray-400 hover:text-orange-300 font-semibold text-xs rounded-xl transition-all duration-200"
                >
                  Preview Catalog
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-orange-900/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-orange-500/70 shrink-0" />
              <p className="text-gray-600 text-[10px]">
                Trusted by <span className="text-orange-400/80 font-semibold">1,200+</span> research labs.
                For in-vitro research only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {authOpen && (
        <AuthModal initialTab={authTab} onClose={() => setAuthOpen(false)} />
      )}
    </>
  );
}
