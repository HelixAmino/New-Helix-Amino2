import { useState } from 'react';
import { ShieldAlert, Circle as XCircle } from 'lucide-react';
import { DnaHelixLogoSmall } from './DnaHelixSvg';
import { IS_BOT } from '../lib/botDetection';

interface Props {
  onVerified: () => void;
}

export function AgeGateModal({ onVerified }: Props) {
  if (IS_BOT) return null;

  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const y = parseInt(year, 10);

    if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) {
      setError('Please enter a valid date of birth.');
      return;
    }

    const dob = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 21) {
      setDenied(true);
    } else {
      onVerified();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#07111d] border border-cyan-900/40 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header bar */}
        <div className="bg-red-700 px-6 py-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-white shrink-0" />
          <span className="text-white text-xs font-semibold tracking-wide uppercase">
            Age Verification Required
          </span>
        </div>

        <div className="p-8">
          {denied ? (
            <div className="text-center py-6">
              <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">Access Denied</h2>
              <p className="text-red-400 font-semibold mb-3">You must be 21 or older to access this site.</p>
              <p className="text-gray-500 text-sm">
                This website contains products intended for qualified researchers only.
                Access is restricted to individuals aged 21 and above.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <DnaHelixLogoSmall size={32} />
                <div>
                  <div className="text-white font-bold tracking-widest text-sm">HELIX AMINO</div>
                  <div className="text-cyan-400 text-[10px] tracking-widest uppercase">Research Peptides</div>
                </div>
              </div>

              <h2 className="text-xl font-black text-white mb-2">Verify Your Age</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                You must be 21 years or older to access this site. Please enter your date of birth to continue.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">
                    Date of Birth (MM / DD / YYYY)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="MM"
                      value={month}
                      onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
                      className="w-16 bg-[#050d14] border border-cyan-900/40 text-white rounded-xl px-3 py-3 text-center text-sm font-bold focus:outline-none focus:border-cyan-500 placeholder-gray-600"
                    />
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="DD"
                      value={day}
                      onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
                      className="w-16 bg-[#050d14] border border-cyan-900/40 text-white rounded-xl px-3 py-3 text-center text-sm font-bold focus:outline-none focus:border-cyan-500 placeholder-gray-600"
                    />
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="YYYY"
                      value={year}
                      onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-[#050d14] border border-cyan-900/40 text-white rounded-xl px-3 py-3 text-center text-sm font-bold focus:outline-none focus:border-cyan-500 placeholder-gray-600"
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-95 mb-4"
                >
                  Verify Age
                </button>

                <p className="text-gray-600 text-xs text-center leading-relaxed">
                  By continuing, you confirm you are 21+ and agree that all products are for laboratory research use only.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
