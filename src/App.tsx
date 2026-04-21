import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AuthProvider } from './context/AuthContext';
import { IS_BOT } from './lib/botDetection';
import { RedBanner } from './components/RedBanner';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { Footer } from './components/Footer';
import { ChatBubble } from './components/ChatBubble';
import { BottomBar } from './components/BottomBar';
import { FloatingCartButton } from './components/FloatingCartButton';
import { PageSeo } from './components/PageSeo';
import { AgeGateModal } from './components/AgeGateModal';
import { AgreementModal } from './components/AgreementModal';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogArticlePage } from './pages/BlogArticlePage';
import { AdminChatPage } from './pages/AdminChatPage';
import { LabCertificationsPage } from './pages/LabCertificationsPage';
import { PurityTestingPage } from './pages/PurityTestingPage';
import { ResearchLibraryPage } from './pages/ResearchLibraryPage';
import { CompoundGuidePage } from './pages/CompoundGuidePage';
import { HplcReportsPage } from './pages/HplcReportsPage';
import { AboutPage } from './pages/AboutPage';
import { ShippingPage } from './pages/ShippingPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CoaLibraryPage } from './pages/CoaLibraryPage';
import { MembersPage } from './pages/MembersPage';
import { LabSuppliesPage } from './pages/LabSuppliesPage';
import { SdsLibraryPage } from './pages/SdsLibraryPage';

const STORAGE_KEY_AGE = 'helix_age_verified';
const STORAGE_KEY_TERMS = 'helix_terms_agreed';

function AppContent() {
  const { page } = useNavigation();

  const [ageVerified, setAgeVerified] = useState(() => {
    return IS_BOT || localStorage.getItem(STORAGE_KEY_AGE) === '1';
  });
  const [termsAgreed, setTermsAgreed] = useState(() => {
    return IS_BOT || localStorage.getItem(STORAGE_KEY_TERMS) === '1';
  });

  const handleAgeVerified = () => {
    setAgeVerified(true);
    localStorage.setItem(STORAGE_KEY_AGE, '1');
  };

  const handleTermsAgreed = () => {
    setTermsAgreed(true);
    localStorage.setItem(STORAGE_KEY_TERMS, '1');
  };

  const showAgeGate = !ageVerified;
  const showAgreement = ageVerified && !termsAgreed;

  return (
    <div className="min-h-screen bg-[#050d14] text-white">
      <PageSeo />
      {/* Compliance modals — block the site until verified */}
      {showAgeGate && <AgeGateModal onVerified={handleAgeVerified} />}
      {showAgreement && <AgreementModal onAgreed={handleTermsAgreed} />}

      <RedBanner />
      <Header />

      <main>
        {page === 'home' && (
          <>
            <HeroSection />
            <TrustBadges />
            <HomePage />
          </>
        )}
        {page === 'product' && <ProductDetailPage />}
        {page === 'cart' && <CartPage />}
        {page === 'checkout' && <CheckoutPage />}
        {page === 'blog' && <BlogPage />}
        {page === 'blog-article' && <BlogArticlePage />}
        {page === 'lab-certifications' && <LabCertificationsPage />}
        {page === 'purity-testing' && <PurityTestingPage />}
        {page === 'research-library' && <ResearchLibraryPage />}
        {page === 'compound-guide' && <CompoundGuidePage />}
        {page === 'hplc-reports' && <HplcReportsPage />}
        {page === 'about' && <AboutPage />}
        {page === 'shipping' && <ShippingPage />}
        {page === 'returns' && <ReturnsPage />}
        {page === 'privacy' && <PrivacyPage />}
        {page === 'terms' && <TermsPage />}
        {page === 'coa-library' && <CoaLibraryPage />}
        {page === 'members' && <MembersPage />}
        {page === 'lab-supplies' && <LabSuppliesPage />}
        {page === 'sds-library' && <SdsLibraryPage />}
      </main>

      <Footer />
      <ChatBubble />
      <FloatingCartButton />
      <BottomBar />

      {page === 'admin-chat' && <AdminChatPage />}
    </div>
  );
}

function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}

export default App;
