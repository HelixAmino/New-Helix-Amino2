import { useState } from 'react';
import { X, Eye, EyeOff, LogIn, UserPlus, Mail, CircleCheck as CheckCircle, Loader as Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  initialTab?: 'login' | 'signup';
  onClose: () => void;
}

export function AuthModal({ initialTab = 'login', onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [researchChecked, setResearchChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', password: '' });

  function switchTab(t: 'login' | 'signup') {
    setTab(t);
    setError(null);
    setSignupSuccess(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(loginForm.email, loginForm.password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!researchChecked) return;
    setError(null);
    setLoading(true);
    const { error: err } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setSignupSuccess(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#07111d] border border-cyan-900/40 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="bg-[#0a1825] border-b border-cyan-900/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-600/30 flex items-center justify-center">
              {tab === 'login' ? (
                <LogIn className="w-4 h-4 text-teal-400" />
              ) : (
                <UserPlus className="w-4 h-4 text-teal-400" />
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Member Access</h2>
              <p className="text-gray-500 text-xs">Vetted researcher portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-cyan-900/30">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
              tab === 'login'
                ? 'text-teal-400 border-b-2 border-teal-500 bg-teal-500/5'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
              tab === 'signup'
                ? 'text-teal-400 border-b-2 border-teal-500 bg-teal-500/5'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-[#050d14] border border-cyan-900/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-600 placeholder-gray-600 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#050d14] border border-cyan-900/30 text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-teal-600 placeholder-gray-600 transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Log In'}
              </button>
            </form>
          ) : signupSuccess ? (
            <div className="py-6 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-teal-500/15 border border-teal-600/30 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1">Check your inbox</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We sent a confirmation link to{' '}
                  <span className="text-teal-400 font-medium">{signupForm.email}</span>.
                  Click the link to verify your email and activate your account.
                </p>
              </div>
              <button
                onClick={() => switchTab('login')}
                className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Back to Log In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  className="w-full bg-[#050d14] border border-cyan-900/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-600 placeholder-gray-600 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-[#050d14] border border-cyan-900/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-600 placeholder-gray-600 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#050d14] border border-cyan-900/30 text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-teal-600 placeholder-gray-600 transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group mt-1">
                <div
                  onClick={() => setResearchChecked(!researchChecked)}
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    researchChecked
                      ? 'bg-teal-500 border-teal-500'
                      : 'border-teal-700/60 group-hover:border-teal-500'
                  }`}
                >
                  {researchChecked && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-400 text-xs leading-relaxed">
                  I affirm that I will only use these products for{' '}
                  <strong className="text-gray-200">in vitro research purposes only</strong> and understand that misuse is strictly prohibited.
                </span>
              </label>

              {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!researchChecked || loading}
                className={`w-full py-3.5 font-bold rounded-xl text-sm tracking-wide transition-all duration-200 mt-1 flex items-center justify-center gap-2 ${
                  researchChecked && !loading
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] active:scale-[0.98] cursor-pointer'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-cyan-900/20 text-center">
            <p className="text-gray-600 text-xs flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              or email{' '}
              <a
                href="mailto:info@helixamino.com"
                className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
              >
                info@helixamino.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
