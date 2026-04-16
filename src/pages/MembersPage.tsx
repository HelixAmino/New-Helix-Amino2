import { useState, useEffect } from 'react';
import { Lock, ShieldCheck, FlaskConical, Layers, FileText, LogIn, Dna, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { MEMBERS_GROUPS } from '../data/membersProducts';
import { AuthModal } from '../components/AuthModal';
import { ProductGroup } from '../types';

export function MembersPage() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive, nosnippet';
    meta.setAttribute('data-members-noindex', '1');
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <MembersGate onSignIn={() => setAuthOpen(true)} />
        {authOpen && <AuthModal initialTab="login" onClose={() => setAuthOpen(false)} />}
      </>
    );
  }

  return <MembersCatalog />;
}

function MembersGate({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
              <Lock className="w-9 h-9 text-orange-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#050d14] border border-orange-700/60 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            </div>
          </div>

          <h1 className="text-white font-black text-3xl sm:text-4xl mb-4 tracking-tight flex items-center gap-2.5">
            Members Only
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
            This portion of the catalog includes many of the most popular metabolic compounds exclusively available to members. Sign in or create a membership account to access the full catalog.
          </p>

          <div className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl bg-[#07111d] border border-orange-900/30">
            <div className="flex -space-x-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400/60 to-orange-700/60 border border-[#07111d]" />
              ))}
            </div>
            <span className="text-gray-400 text-xs font-medium">Trusted by <span className="text-orange-300 font-semibold">1,200+</span> research labs.</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onSignIn}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-[0_0_24px_rgba(249,115,22,0.3)]"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              Sign In to Access
            </button>
            <button
              onClick={onSignIn}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-transparent border border-orange-700/50 hover:border-orange-500 text-orange-300 hover:text-white font-semibold text-sm rounded-xl transition-all duration-200"
            >
              Create Account
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-5 text-gray-600 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-gray-600" />
            <span>For research professionals only.</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/5 bg-[#030a10]/60 backdrop-blur-sm px-6 py-3">
        <p className="text-center text-gray-600 text-[10px] leading-relaxed max-w-2xl mx-auto">
          All compounds are for research use only. Not for human consumption or clinical use. Intended for laboratory and in vitro research purposes only.
        </p>
      </div>
    </div>
  );
}

function MembersCatalog() {
  const { navigate } = useNavigation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-700/40">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-400 text-[11px] font-bold uppercase tracking-widest">Members Access</span>
              </div>
            </div>
            <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight mb-2">
              GLP-1 &amp; Metabolic
            </h1>
            <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
              Exclusive catalog of advanced GLP-1 receptor agonists and next-generation metabolic peptides.
              All compounds ≥99% purity, third-party verified.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 px-4 py-3 bg-[#07111d] border border-orange-900/30 rounded-xl">
            <Dna className="w-5 h-5 text-orange-400 shrink-0" />
            <div>
              <p className="text-white text-xs font-bold">{MEMBERS_GROUPS.length} Compounds</p>
              <p className="text-gray-500 text-[10px]">In-vitro research only</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-orange-900/20 flex flex-wrap gap-x-6 gap-y-2">
          {[
            { label: '≥99% Purity', icon: <FlaskConical className="w-3.5 h-3.5" /> },
            { label: 'Third-Party Tested', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { label: 'Lyophilized Powder', icon: <Dna className="w-3.5 h-3.5" /> },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-gray-500 text-xs">
              <span className="text-orange-400/70">{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MEMBERS_GROUPS.map((group) => (
          <MembersProductCard
            key={group.groupId}
            group={group}
            onSelect={() => navigate('product', group.variants[0].id)}
          />
        ))}
      </div>

    </div>
  );
}

function MembersProductCard({ group, onSelect }: { group: ProductGroup; onSelect: () => void }) {
  const isMulti = group.variants.length > 1;
  const lowestPrice = Math.min(...group.variants.map((v) => v.price));
  const coaUrl = group.variants.find((v) => v.coaUrl)?.coaUrl;

  return (
    <div
      className="group bg-[#07111d] border border-orange-900/20 rounded-2xl overflow-hidden hover:border-orange-700/40 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(249,115,22,0.07)] flex flex-col cursor-pointer"
      onClick={onSelect}
    >
      <div className="relative h-[420px] overflow-hidden bg-white">
        <img
          src={group.image}
          alt={group.baseName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111d]/60 via-transparent to-transparent" />

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#050d14]/80 border border-orange-900/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
          <FlaskConical className="w-3 h-3 text-orange-400" />
          <span className="text-orange-300 text-[10px] font-bold">≥99%</span>
        </div>

        {isMulti && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#050d14]/80 border border-orange-800/50 rounded-full px-2.5 py-1 backdrop-blur-sm">
            <Layers className="w-3 h-3 text-orange-400" />
            <span className="text-orange-300 text-[10px] font-bold">{group.variants.length} sizes</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#050d14]/80 border border-orange-800/40 rounded-full px-2.5 py-1 backdrop-blur-sm">
          <ShieldCheck className="w-3 h-3 text-orange-400" />
          <span className="text-orange-300 text-[10px] font-bold">Members Only</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="self-start text-[10px] font-bold border rounded-full px-2 py-0.5 mb-2.5 text-orange-400 bg-orange-950/40 border-orange-800/40">
          Metabolic &amp; GLP-1 Related
        </span>

        <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-orange-300 transition-colors duration-200">
          {group.baseName}
        </h3>

        {isMulti ? (
          <div className="flex flex-wrap gap-1 mb-3">
            {group.variants.map((v) => (
              <span key={v.id} className="text-[10px] font-mono font-semibold bg-orange-950/30 border border-orange-800/30 text-orange-400 rounded px-1.5 py-0.5">
                {v.quantityLabel}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs mb-3">{group.variants[0].quantityLabel}</p>
        )}

        {(group.cas || group.molecularWeight) && (
          <div className="mb-3 rounded-lg border border-orange-900/30 bg-[#041019] px-3 py-2 flex gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-widest text-orange-500/70 font-bold">CAS</span>
              <span className="font-mono text-[11px] font-semibold leading-tight text-orange-300">
                {group.cas ?? '—'}
              </span>
            </div>
            <div className="w-px bg-orange-900/30 self-stretch" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-widest text-orange-500/70 font-bold">Mol. Weight</span>
              <span className="font-mono text-[11px] font-semibold leading-tight text-orange-300">
                {group.molecularWeight ?? '—'}
              </span>
            </div>
          </div>
        )}

        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{group.description}</p>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            {isMulti && <span className="text-gray-500 text-xs mr-0.5">from </span>}
            <span className="text-white font-black text-lg">${lowestPrice}</span>
            <span className="text-gray-600 text-xs ml-1">/ vial</span>
          </div>
          <div className="flex gap-1.5">
            {coaUrl ? (
              <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(coaUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-2.5 py-2 bg-orange-600/15 border border-orange-700/40 text-orange-400 rounded-xl hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 active:scale-90 text-[11px] font-semibold whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                View COA
              </a>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-800/30 border border-gray-700/20 text-gray-600 rounded-xl cursor-not-allowed text-[11px] font-semibold whitespace-nowrap">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                COA Soon
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              className="px-3 py-2 border border-orange-800/50 text-orange-400 text-xs font-semibold rounded-xl hover:border-orange-500 hover:text-white transition-all duration-200"
            >
              {isMulti ? 'Select Size' : 'Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

