import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';

const BrandStory: React.FC = () => {
  return (
    <section id="our-story" className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="w-full h-full">
            <img
              src="https://images.pexels.com/photos/7262911/pexels-photo-7262911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Brand inspiration showing natural ingredients and a serene aesthetic"
              loading="lazy"
              className="w-full h-full object-cover rounded-lg shadow-xl"
              style={{ maxHeight: '500px' }} // Constrain image height
            />
          </div>

          {/* Text Content Column */}
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-heading text-accent mb-6">The Heart of shecarehub</h2>
            <p className="text-text-secondary font-body leading-relaxed mb-4">
              shecarehub was born from a simple yet profound realization: modern wellness often overlooks the deep, nuanced needs of women. Our journey began not in a boardroom, but from personal stories and shared experiences of searching for solutions that were not only effective but also gentle, safe, and nurturing. We saw a need for a brand that listened before it created.
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
