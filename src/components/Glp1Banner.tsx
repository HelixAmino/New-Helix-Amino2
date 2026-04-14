import { useState } from 'react';
import { ShieldAlert, LogIn, UserPlus, Mail } from 'lucide-react';
import { AuthModal } from './AuthModal';

export function Glp1Banner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'signup'>('login');

  function openLogin() {
    setModalTab('login');
    setModalOpen(true);
  }

  function openSignup() {
    setModalTab('signup');
    setModalOpen(true);
  }

  return (
    <>
      <div className="mb-8 rounded-2xl overflow-hidden border border-red-900/50 shadow-[0_0_60px_rgba(239,68,68,0.08)]">
        <div className="bg-gradient-to-b from-[#0d0606] to-[#100a0a] border-b border-red-900/40 px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-500 mb-1">
              Restricted Catalog
            </p>
            <h2 className="text-white font-extrabold text-xl sm:text-2xl leading-tight tracking-tight">
              Due to widespread misuse of research compounds, we are no longer able to display our full product catalog publicly.
            </h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              To view our complete catalog, you must be a{' '}
              <span className="text-teal-400 font-semibold">vetted member</span> of our site.
            </p>
          </div>
        </div>

        <div className="bg-[#08100f] px-6 py-6 sm:px-10 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <button
              onClick={openLogin}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_24px_rgba(20,184,166,0.35)] active:scale-[0.97]"
            >
              <LogIn className="w-4 h-4" />
              Log In
            </button>
            <button
              onClick={openSignup}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-transparent border-2 border-teal-600 text-teal-400 hover:bg-teal-600/10 hover:text-teal-300 font-bold rounded-xl text-sm tracking-wide transition-all duration-200 active:scale-[0.97]"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>
          <p className="text-gray-600 text-xs flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gray-600" />
            or email{' '}
            <a
              href="mailto:info@helixamino.com"
              className="text-teal-500 hover:text-teal-300 transition-colors font-medium"
            >
              info@helixamino.com
            </a>
          </p>
        </div>
      </div>

      {modalOpen && (
        <AuthModal initialTab={modalTab} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
