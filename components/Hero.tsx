import React from 'react';
import BrandLogo from './BrandLogo';
import { useSettings } from '../contexts/SettingsContext';

const FALLBACK_IMAGE_URL = "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const Hero: React.FC = () => {
  const { settings } = useSettings();

  const imageUrl = settings.heroImageUrl || FALLBACK_IMAGE_URL;
  const tagline = settings.heroTagline || "shecarehub.com";
  const subtitle = settings.heroSubtitle || "Experience instant menstrual pain relief with our smart thermal belt — designed for modern women.";

  return (
    <section 
      className="relative h-screen flex items-center justify-center text-center text-text-primary bg-cover bg-center transition-all duration-1000" 
      style={{ backgroundImage: `url('${imageUrl}')` }}
    >
      <div className="absolute inset-0 bg-background-start/40 dark:bg-black/60"></div>
      
      <div className="relative z-10 px-6 flex flex-col items-center">
        {tagline === "shecarehub.com" ? (
             <h1 className="mb-4" aria-label="shecarehub.com">
                <BrandLogo variant="solid" className="h-16 md:h-20 lg:h-24 w-auto text-white" style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))' }} />
             </h1>
        ) : (
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4" style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))' }}>
                {tagline}
            </h1>
        )}
       
        <p className="text-lg md:text-xl font-body font-light mb-8 max-w-2xl mx-auto text-white/90 drop-shadow-md">
          {subtitle}
        </p>
        <a 
          href="/#products" 
          className="group inline-flex items-center justify-center bg-accent text-surface font-body font-semibold py-3 px-10 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out transform hover:scale-105 tracking-widest"
        >
          <span>Shop Now – ₹699</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;