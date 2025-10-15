import React from 'react';
// FIX: Import 'types.ts' to make global JSX namespace augmentations available.
import '../types';
import BrandLogo from './BrandLogo';


const BrandStory: React.FC = () => {
  return (
    <section id="our-story" className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Brand Identity Board Column */}
           <div className="w-full aspect-square bg-gradient-to-br from-[#F5EDE6] to-[#f8f2ed] rounded-lg shadow-xl p-8 flex flex-col justify-center items-center text-center transition-all duration-500">
              <div className="animate-fade-in w-full">
                <BrandLogo className="h-16 md:h-20 w-auto mx-auto mb-6" />
                <p className="text-md mt-4" style={{ color: '#B76E79' }}>Luxury wellness for every woman — made in India.</p>
                <div className="w-20 h-px bg-accent/30 my-6 mx-auto"></div>
                <p className="text-3xl font-heading" style={{ color: '#B76E79' }}>Comfort meets confidence</p>
                <p className="text-xs text-text-secondary mt-6">Designed for Indian women. Experience premium self-care.</p>
              </div>
          </div>

          {/* Text Content Column */}
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-heading text-accent mb-6">The Heart of SheCareHub</h2>
            <p className="text-text-secondary font-body leading-relaxed mb-4">
              SheCareHub was born from a simple yet profound realization: modern wellness often overlooks the deep, nuanced needs of women. Our journey began not in a boardroom, but from personal stories and shared experiences of searching for solutions that were not only effective but also gentle, safe, and nurturing. We saw a need for a brand that listened before it created.
            </p>
            <p className="text-text-secondary font-body leading-relaxed mb-6">
              Our mission is to craft premium, thoughtfully designed wellness products that empower you to reconnect with your body. We are committed to using high-quality, ethically sourced materials and transparent practices. From soothing menstrual pain to revitalizing your skin, each product is a testament to our dedication to your well-being, transforming daily routines into cherished rituals of self-care.
            </p>
            <a
              href="#products"
              className="inline-block bg-transparent text-accent font-body font-semibold py-3 px-8 border-2 border-accent hover:bg-accent hover:text-surface transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Explore Our Collection
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;