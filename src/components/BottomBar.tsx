import { FlaskConical, ChevronRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export function BottomBar() {
  const { navigate, page } = useNavigation();

  if (page === 'cart') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#060e17]/95 backdrop-blur-md border-t border-cyan-900/30 px-4 py-3 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>60+ compounds in stock · Ships within 48 hours</span>
        </div>

        <button
          onClick={() => navigate('home')}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 py-3 px-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold rounded-xl text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] active:scale-95"
        >
          <FlaskConical className="w-4 h-4" />
          Browse All Research Compounds
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
