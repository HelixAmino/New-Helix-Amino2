import { createContext, useContext, useState, ReactNode } from 'react';
import { Page } from '../types';

interface NavigationContextValue {
  page: Page;
  currentProductId: string | null;
  pendingCategory: string | null;
  clearPendingCategory: () => void;
  navigate: (page: Page, productId?: string, category?: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('home');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  const navigate = (newPage: Page, productId?: string, category?: string) => {
    setPage(newPage);
    setCurrentProductId(productId ?? null);
    if (category !== undefined) setPendingCategory(category);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const clearPendingCategory = () => setPendingCategory(null);

  return (
    <NavigationContext.Provider value={{ page, currentProductId, pendingCategory, clearPendingCategory, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used inside NavigationProvider');
  return ctx;
}
