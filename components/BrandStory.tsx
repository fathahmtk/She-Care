import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import BrandLogo from './BrandLogo';


const BrandStory: React.FC = () => {
  return (
    <section id="our-story" className="py-24 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
           <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group order-last md:order-first">
                <img 
                    src="https://images.pexels.com/photos/15822340/pexels-photo-15822340/free-photo-of-a-woman-in-a-traditional-indian-sari.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="A woman wearing a beautiful traditional Kerala saree" 
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                    <BrandLogo variant="solid" className="h-12 w-auto mb-4" style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' }} />
                    <p className="font-body text-lg drop-shadow-md">The Essence of Southern Elegance.</p>
                </div>
            </div>

          {/* Text Content Column */}
          <div className="text-left">
            <p className="text-sm font-semibold tracking-widest text-text-secondary uppercase mb-2">Our Vision</p>
            <h2 className="text-4xl md:text-5xl font-heading text-accent mb-6">Celebrating Heritage</h2>
            <p className="text-text-secondary font-body leading-relaxed mb-4">
              SheCareHub was born from a deep love for Kerala's rich textile heritage and a vision to share its timeless beauty with the world. We believe that true style is a blend of tradition and modernity, a narrative woven into every thread and design.
            </p>
            <p className="text-text-secondary font-body leading-relaxed mb-6">
              Our mission is to curate a collection that honors artisanal craftsmanship while embracing contemporary aesthetics. From the classic elegance of a Kasavu saree to the modern chic of a linen kurti, each piece is handpicked to empower you, celebrate your roots, and tell a story of Southern grace.
            </p>
            <a
              href="#products"
              className="inline-block bg-transparent text-accent font-body font-semibold py-3 px-8 border-2 border-accent hover:bg-accent hover:text-surface transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Explore Our Heritage
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;