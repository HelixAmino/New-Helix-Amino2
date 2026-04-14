import { useState } from 'react';
import { SquareCheck as CheckSquare, FileText, TriangleAlert as AlertTriangle } from 'lucide-react';

interface Props {
  onAgreed: () => void;
}

export function AgreementModal({ onAgreed }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-[#07111d] border border-cyan-900/40 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a1825] border-b border-cyan-900/30 px-6 py-5 flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <h2 className="text-white font-bold text-base">Research Use Agreement</h2>
            <p className="text-gray-500 text-xs">Please read and accept before entering</p>
          </div>
        </div>

        <div className="p-6">
          {/* Warning box */}
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4 mb-5 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold text-sm mb-1">
                RESEARCH USE ONLY
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Not for human consumption. For in-vitro laboratory research purposes only.
              </p>
            </div>
          </div>

          {/* Terms scroll box */}
          <div className="bg-[#050d14] border border-cyan-900/25 rounded-xl p-4 mb-5 h-44 overflow-y-auto text-gray-400 text-xs leading-relaxed space-y-3">
            <p>
              All products sold by Helix Amino are intended solely for <strong className="text-gray-300">in-vitro laboratory and scientific research</strong> by qualified researchers and professionals.
            </p>
            <p>
              These products are <strong className="text-gray-300">NOT for human consumption</strong>, are not intended for use in any medical diagnosis, treatment, cure, mitigation, or prevention of any disease or condition in humans or animals.
            </p>
            <p>
              None of the products offered by Helix Amino have been evaluated, approved, or cleared by the U.S. Food and Drug Administration (FDA) or any other regulatory authority for clinical or therapeutic use.
            </p>
            <p>
              By purchasing from this website, you confirm that you are a <strong className="text-gray-300">qualified researcher or laboratory professional</strong>, that all purchased products will be used exclusively for scientific research under controlled laboratory conditions, and that you assume full responsibility for compliance with all applicable laws and regulations.
            </p>
            <p>
              Helix Amino assumes no liability for improper use of any research compound. All sales are final and non-refundable on opened vials. Products are for research purposes only.
            </p>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-6 group">
            <div
              onClick={() => setChecked(!checked)}
              className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                checked
                  ? 'bg-cyan-500 border-cyan-500'
                  : 'border-cyan-700/60 group-hover:border-cyan-500'
              }`}
            >
              {checked && <CheckSquare className="w-3.5 h-3.5 text-white fill-white" strokeWidth={0} />}
            </div>
            <span className="text-gray-300 text-sm leading-relaxed">
              I confirm that all products are for <strong>laboratory and scientific research use only</strong>. Not for human consumption, diagnosis, or treatment. Not FDA-approved. Buyer assumes all responsibility.
            </span>
          </label>

          <button
            onClick={onAgreed}
            disabled={!checked}
            className={`w-full py-3.5 font-bold rounded-xl text-sm tracking-wide transition-all duration-200 ${
              checked
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-95 cursor-pointer'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            I Agree — Enter Site
          </button>
        </div>
      </div>
    </div>
  );
}
