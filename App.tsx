import React, { useState, useEffect, Suspense, lazy } from 'react';
// FIX: The global types, including JSX augmentations, are loaded here once for the entire application.
import './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import { CartProvider } from './contexts/CartContext';
import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { RatingProvider } from './contexts/RatingContext';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';
import { OrderProvider } from './contexts/OrderContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));

const NotFound: React.FC = () => (
    <div className="container mx-auto text-center py-48 px-6">
        <h1 className="text-6xl font-heading text-accent">404</h1>
        <p className="text-xl text-text-secondary mt-4">Page Not Found</p>
        <a href="#/" className="mt-8 inline-block bg-accent text-surface font-body font-semibold py-3 px-10 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out">
            Go to Homepage
        </a>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
      <div role="status" className="flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-accent"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <h1 className="text-2xl font-heading text-text-secondary mt-4">Loading...</h1>
      </div>
    </div>
  );

const AppContent: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [route, setRoute] = useState(window.location.hash);
  const { theme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      if (!window.location.hash.startsWith('#/admin')) {
         window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderContent = () => {
    const path = route.split('?')[0];
    
    if (path.startsWith('#/admin')) {
      return <AdminPage />;
    }

    if (path.startsWith('#/product/')) {
      const id = parseInt(path.replace('#/product/', ''), 10);
      return <ProductDetailPage productId={id} />;
    }
    
    switch (path) {
      case '#/cart':
        return <CartPage />;
      case '#/wishlist':
        return <WishlistPage />;
      case '#/checkout':
        return <CheckoutPage />;
      case '#/confirmation':
        return <OrderConfirmationPage />;
      case '#/profile':
        return <UserProfilePage onLoginClick={() => setIsAuthModalOpen(true)} />;
      case '':
      case '#/':
      case '#products':
      case '#our-story':
      case '#testimonials':
      case '#contact':
        return <HomePage />;
      default:
        return <NotFound />;
    }
  };
  
  const isAdminRoute = route.startsWith('#/admin');

  return (
    <>
      {isAdminRoute ? (
         <main className="bg-background-start">
            <Suspense fallback={<LoadingSpinner />}>
                {renderContent()}
            </Suspense>
         </main>
      ) : (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background-start to-background-end text-text-primary font-body">
          <Header onLoginClick={() => setIsAuthModalOpen(true)} />
          <main className="flex-grow pt-24">
            <Suspense fallback={<LoadingSpinner />}>
              {renderContent()}
            </Suspense>
          </main>
          <Footer />
          <ScrollToTopButton />
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          <Chatbot />
        </div>
      )}
    </>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <ProductProvider>
            <RatingProvider>
              <OrderProvider>
                <CartProvider>
                  <WishlistProvider>
                    <SearchProvider>
                      <AppContent />
                    </SearchProvider>
                  </WishlistProvider>
                </CartProvider>
              </OrderProvider>
            </RatingProvider>
          </ProductProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;