import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Cta from './components/Cta';
import Footer from './components/Footer';
import AnimatedSection from './components/AnimatedSection';
import ScrollToTopButton from './components/ScrollToTopButton';
import TestimonialCarousel from './components/TestimonialCarousel';
import RecipeGenerator from './components/RecipeGenerator';
import { CartProvider } from './contexts/CartContext';

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="bg-gradient-to-br from-background-start to-background-end text-text-primary font-body">
        <Header />
        <main>
          <Hero />
          <AnimatedSection>
            <ProductShowcase />
          </AnimatedSection>
          <AnimatedSection>
            <TestimonialCarousel />
          </AnimatedSection>
          <AnimatedSection>
            <RecipeGenerator />
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
    </CartProvider>
  );
};

export default App;