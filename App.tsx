

import React, { useState, useEffect } from 'react';
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
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminPage from './pages/admin/AdminPage';
import AddPoliciesPage from './pages/AddPoliciesPage';
import UserProfilePage from './pages/UserProfilePage';
import Chatbot from './components/Chatbot';

const NotFound: React.FC = () => (
    <div className="container mx-auto text-center py-48 px-6">
        <h1 className="text-6xl font-heading text-accent">404</h1>
        <p className="text-xl text-text-secondary mt-4">Page Not Found</p>
        <a href="#/" className="mt-8 inline-block bg-accent text-surface font-body font-semibold py-3 px-10 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out">
            Go to Homepage
        </a>
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
      case '#/add-policies':
        return <AddPoliciesPage />;
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
  const isPolicyRoute = route.startsWith('#/add-policies');

  return (
    <>
      {isAdminRoute || isPolicyRoute ? (
         <main className="bg-background-start">{renderContent()}</main>
      ) : (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background-start to-background-end text-text-primary font-body">
          <Header onLoginClick={() => setIsAuthModalOpen(true)} />
          <main className="flex-grow pt-24">
            {renderContent()}
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
      <AuthProvider>
        <ProductProvider>
          <RatingProvider>
            <CartProvider>
              <WishlistProvider>
                <SearchProvider>
                  <AppContent />
                </SearchProvider>
              </WishlistProvider>
            </CartProvider>
          </RatingProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;