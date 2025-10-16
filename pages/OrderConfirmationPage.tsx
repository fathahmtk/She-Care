import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import AnimatedSection from '../components/AnimatedSection';

const OrderConfirmationPage: React.FC = () => {
  return (
    <AnimatedSection>
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto bg-surface p-10 rounded-lg shadow-xl">
          <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center bg-emerald-100 rounded-full">
            <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-heading text-accent mb-4">Thank You!</h1>
          <p className="text-xl text-text-primary mb-2">Your order has been placed successfully.</p>
          <p className="text-text-secondary mb-8">
            A confirmation email has been sent to your address. (This is a simulation).
          </p>
          <a
            href="#"
            className="inline-block bg-accent text-background-start font-body font-semibold py-3 px-10 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default OrderConfirmationPage;