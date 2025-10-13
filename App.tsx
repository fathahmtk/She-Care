import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Cta from './components/Cta';
import Footer from './components/Footer';
import AnimatedSection from './components/AnimatedSection';
import ScrollToTopButton from './components/ScrollToTopButton';
import TestimonialCarousel from './components/TestimonialCarousel';
import ShadeFinder from './components/ShadeFinder';
import { CartProvider } from './contexts/CartContext';
import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';

const AppContent: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-br from-background-start to-background-end text-text-primary font-body">
        <Header onLoginClick={() => setIsAuthModalOpen(true)} />
        <main>
          <Hero />
          <AnimatedSection>
            <ProductShowcase />
          </AnimatedSection>
          <AnimatedSection>
            <TestimonialCarousel />
          </AnimatedSection>
          <AnimatedSection>
            <ShadeFinder />
          </AnimatedSection>
          <AnimatedSection>
            <Cta />
          </AnimatedSection>
        </main>
        <AnimatedSection>
          <Footer />
        </AnimatedSection>
        <ScrollToTopButton />
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
};


export default App;