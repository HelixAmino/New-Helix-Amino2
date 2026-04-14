import { Search, ShoppingCart, Menu, X, FlaskConical, LogIn, ChevronDown, LogOut, User, MessageSquare, Microscope } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import logoImg from '../assets/transparentlogo.png';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { CATEGORIES } from '../data/products';
import { AuthModal } from './AuthModal';
import { Page } from '../types';

const RESEARCH_NAV: { label: string; page: Page }[] = [
  { label: 'Lab Certifications', page: 'lab-certifications' },
  { label: 'Purity Testing', page: 'purity-testing' },
  { label: 'Research Library', page: 'research-library' },
  { label: 'Compound Guide', page: 'compound-guide' },
  { label: 'HPLC Reports', page: 'hplc-reports' },

];

const NAV_CATEGORIES = CATEGORIES.filter((c) => c !== 'All');

export function Header() {
  const { totalItems } = useCart();
  const { navigate, page } = useNavigation();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const [userDropOpen, setUserDropOpen] = useState(false);
  const userDropRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const [researchDropOpen, setResearchDropOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const catDropRef = useRef<HTMLDivElement>(null);
  const researchDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCatDropOpen(false);
    setResearchDropOpen(false);
  }, [page]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (catDropRef.current && !catDropRef.current.contains(e.target as Node)) {
        setCatDropOpen(false);
      }
      if (researchDropRef.current && !researchDropRef.current.contains(e.target as Node)) {
        setResearchDropOpen(false);
      }
      if (userDropRef.current && !userDropRef.current.contains(e.target as Node)) {
        setUserDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function handleCategoryNav(cat: string) {
    navigate('home', undefined, cat);
    setMenuOpen(false);
    setSearchOpen(false);
    setCatDropOpen(false);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate('home');
    window.dispatchEvent(new CustomEvent('helix:search', { detail: { query: q } }));
    setSearchOpen(false);
    setSearchQuery('');
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cyan-900/30 bg-[#050d14]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => handleCategoryNav('All')}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-md group-hover:bg-cyan-500/20 transition-all duration-300" />
              <img src={logoImg} alt="Helix Amino Logo" className="h-9 w-auto relative" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-base tracking-wider">HELIX AMINO</span>
              <span className="text-cyan-400 text-[10px] tracking-[0.2em] uppercase font-medium hidden sm:block">Research Peptides</span>
            </div>
          </button>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <button
              onClick={() => handleCategoryNav('All')}
              className="text-gray-400 hover:text-cyan-400 text-xs font-medium tracking-wide transition-colors duration-200 px-2.5 py-2 rounded-lg hover:bg-cyan-950/40 whitespace-nowrap"
            >
              All Products
            </button>

            {/* Categories dropdown */}
            <div ref={catDropRef} className="relative">
              <button
                onClick={() => setCatDropOpen((v) => !v)}
                className={`flex items-center gap-1 text-xs font-medium tracking-wide transition-colors duration-200 px-2.5 py-2 rounded-lg hover:bg-cyan-950/40 whitespace-nowrap ${catDropOpen ? 'text-cyan-400 bg-cyan-950/40' : 'text-gray-400 hover:text-cyan-400'}`}
              >
                Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catDropOpen ? 'rotate-180' : ''}`} />
              </button>
              {catDropOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-[#060e17] border border-cyan-900/40 rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                  {NAV_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryNav(cat)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-cyan-950/50 transition-colors duration-150"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/70 shrink-0" />
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('blog')}
              className={`text-xs font-medium tracking-wide transition-colors duration-200 px-2.5 py-2 rounded-lg hover:bg-cyan-950/40 whitespace-nowrap ${page === 'blog' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}`}
            >
              Blog
            </button>

            {/* Research dropdown */}
            <div ref={researchDropRef} className="relative">
              <button
                onClick={() => setResearchDropOpen((v) => !v)}
                className={`flex items-center gap-1 text-xs font-medium tracking-wide transition-colors duration-200 px-2.5 py-2 rounded-lg hover:bg-cyan-950/40 whitespace-nowrap ${researchDropOpen ? 'text-cyan-400 bg-cyan-950/40' : 'text-gray-400 hover:text-cyan-400'}`}
              >
                Research
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${researchDropOpen ? 'rotate-180' : ''}`} />
              </button>
              {researchDropOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-[#060e17] border border-cyan-900/40 rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                  {RESEARCH_NAV.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => navigate(item.page)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-cyan-950/50 transition-colors duration-150"
                    >
                      <Microscope className="w-3.5 h-3.5 text-cyan-500/70 shrink-0" />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 shrink-0">
            {user ? (
              <div ref={userDropRef} className="relative hidden md:block">
                <button
                  onClick={() => setUserDropOpen((v) => !v)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-cyan-950/50 border border-cyan-900/40 hover:border-cyan-700/60 transition-all duration-200"
                  aria-label="Account"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-600/20 border border-teal-600/40 flex items-center justify-center text-teal-400 font-bold text-xs uppercase">
                    {(user.user_metadata?.full_name as string)?.[0] ?? (user.email?.[0] ?? <User className="w-3.5 h-3.5" />)}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${userDropOpen ? 'rotate-180' : ''}`} />
                </button>
                {userDropOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-52 bg-[#060e17] border border-cyan-900/40 rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <div className="px-4 py-3 border-b border-cyan-900/30">
                      <p className="text-white text-xs font-semibold truncate">{(user.user_metadata?.full_name as string) || 'Researcher'}</p>
                      <p className="text-gray-500 text-[11px] truncate mt-0.5">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => { navigate('admin-chat'); setUserDropOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-cyan-950/40 transition-colors duration-150"
                      >
                        <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                        Live Chat Admin
                      </button>
                    )}
                    <button
                      onClick={() => { signOut(); setUserDropOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-red-950/40 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4 text-red-400 shrink-0" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => { setAuthTab('login'); setAuthOpen(true); }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-cyan-400 border border-cyan-700/50 rounded-lg hover:bg-cyan-950/50 hover:border-cyan-500 transition-all duration-200"
                aria-label="Sign In"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs font-semibold">Sign In</span>
                  <span className="text-[10px] font-normal text-cyan-600">Full Catalog</span>
                </div>
              </button>
            )}
            {!user ? (
              <button
                onClick={() => { setAuthTab('login'); setAuthOpen(true); }}
                className="flex md:hidden items-center gap-1.5 px-2.5 py-1.5 text-cyan-400 border border-cyan-700/50 rounded-lg hover:bg-cyan-950/50 hover:border-cyan-500 transition-all duration-200"
                aria-label="Sign In"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex md:hidden items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-cyan-950/50 border border-cyan-900/40 hover:border-cyan-700/60 transition-all duration-200"
                aria-label="Account"
              >
                <div className="w-7 h-7 rounded-full bg-teal-600/20 border border-teal-600/40 flex items-center justify-center text-teal-400 font-bold text-xs uppercase">
                  {(user.user_metadata?.full_name as string)?.[0] ?? (user.email?.[0] ?? 'U')}
                </div>
              </button>
            )}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 rounded-lg hover:bg-cyan-950/40"
              aria-label="Search"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('cart')}
              className="relative p-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 rounded-lg hover:bg-cyan-950/40"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-cyan-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 rounded-lg hover:bg-cyan-950/40 md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Inline search bar */}
        {searchOpen && (
          <div className="border-t border-cyan-900/30 bg-[#050d14] px-4 sm:px-6 lg:px-8 py-3 animate-in slide-in-from-top-2 fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search compounds..."
                className="w-full bg-[#07111d] border border-cyan-900/30 text-white rounded-xl pl-11 pr-24 py-3 text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-[64px] left-0 right-0 z-[39] bg-[#060e17] border-b border-cyan-900/30 shadow-[0_8px_40px_rgba(0,0,0,0.7)] animate-in slide-in-from-top-2 fade-in duration-150 md:hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold mb-3 px-2">Browse Categories</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pb-2">
              <button
                onClick={() => handleCategoryNav('All')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-cyan-950/50 transition-all duration-150 text-sm font-medium text-left"
              >
                <FlaskConical className="w-4 h-4 text-cyan-500 shrink-0" />
                All Compounds
              </button>
              {NAV_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryNav(cat)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-cyan-950/50 transition-all duration-150 text-sm font-medium text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/70 shrink-0 mt-0.5" />
                  {cat}
                </button>
              ))}
              <button
                onClick={() => { navigate('blog'); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-cyan-950/50 transition-all duration-150 text-sm font-medium text-left"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/70 shrink-0 mt-0.5" />
                Blog
              </button>
            </div>
            <div className="border-t border-cyan-900/30 pt-3 mt-1 pb-1">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold mb-2 px-2">Research</p>
              <div className="grid grid-cols-2 gap-1 mb-2">
                {RESEARCH_NAV.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => { navigate(item.page); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-cyan-950/50 transition-all duration-150 text-xs font-medium text-left"
                  >
                    <Microscope className="w-3.5 h-3.5 text-cyan-500/70 shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-cyan-900/30 pt-3 mt-1 pb-1">
              {user ? (
                <>
                  <div className="px-4 py-2 mb-1">
                    <p className="text-white text-xs font-semibold truncate">{(user.user_metadata?.full_name as string) || 'Researcher'}</p>
                    <p className="text-gray-500 text-[11px] truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => { navigate('admin-chat'); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cyan-400 hover:text-white hover:bg-cyan-950/50 transition-all duration-150 text-sm font-semibold text-left"
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      Live Chat Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-950/40 transition-all duration-150 text-sm font-semibold text-left"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setAuthTab('login'); setAuthOpen(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cyan-400 hover:text-white hover:bg-cyan-950/50 transition-all duration-150 text-sm font-semibold text-left"
                >
                  <LogIn className="w-4 h-4 shrink-0" />
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {authOpen && (
        <AuthModal initialTab={authTab} onClose={() => setAuthOpen(false)} />
      )}
    </>
  );
}
