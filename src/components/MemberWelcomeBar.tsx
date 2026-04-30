import { ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

export function MemberWelcomeBar() {
  const { user } = useAuth();
  const { navigate, page } = useNavigation();

  if (!user || page === 'members') return null;

  return (
    <button
      onClick={() => navigate('members')}
      className="group w-full bg-gradient-to-r from-orange-950/90 via-amber-950/70 to-orange-950/90 border-b border-orange-700/50 hover:from-orange-900 hover:via-amber-900/80 hover:to-orange-900 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.35)]">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-300" />
          </div>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] font-black text-orange-400">
            Member Access
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-100 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate">Members-Only Catalog Unlocked</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-white bg-orange-600/40 group-hover:bg-orange-500/60 border border-orange-500/60 rounded-full px-3 py-1 shrink-0 transition-colors">
          <span className="hidden sm:inline">View Products</span>
          <span className="sm:hidden">View</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </button>
  );
}
