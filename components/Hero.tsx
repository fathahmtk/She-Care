import React, { useState, useEffect } from 'react';
// FIX: Import 'types.ts' to make global JSX namespace augmentations available.
import '../types';
// FIX: Switched to generateContent with gemini-2.5-flash-image to address quota issues.
import { GoogleGenAI, Modality } from "@google/genai";
import BrandLogo from './BrandLogo';

const FALLBACK_IMAGE_URL = "https://m.media-amazon.com/images/I/71yD2O6p7JL.jpg";

const Hero: React.FC = () => {
  const [imageUrl, setImageUrl] = useState(FALLBACK_IMAGE_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateHeroImage = async () => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "A minimalist flat lay of premium women's wellness and skincare products on a soft, textured background. Include items like a sleek menstrual pain relief belt, elegant serum bottles, and natural elements like rose petals. The color palette should be soft pinks, creams, and gold accents, evoking a sense of luxury and calm. 16:9 aspect ratio.";
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            responseModalities: [Modality.IMAGE],
          },
        });

        let imageFound = false;
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                const generatedUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                setImageUrl(generatedUrl);
                imageFound = true;
                break;
              }
            }
        }
        
        if (!imageFound) {
            console.warn("AI image generation returned no images, using fallback.");
        }
      } catch (error) {
        console.error("Failed to generate hero image with AI, using fallback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateHeroImage();
  }, []);

  return (
    <section 
      className="relative h-screen flex items-center justify-center text-center text-text-primary bg-cover bg-center transition-all duration-1000" 
      style={{ backgroundImage: `url('${imageUrl}')` }}
    >
      <div className="absolute inset-0 bg-background-start/40 dark:bg-black/60"></div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 animate-pulse duration-1000"></div>
      )}

      <div className="relative z-10 px-6 flex flex-col items-center">
        <h1 className="mb-4" aria-label="shecarehub.com">
          <BrandLogo variant="solid" className="h-16 md:h-20 lg:h-24 w-auto text-white" style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))' }} />
        </h1>
        <p className="text-lg md:text-xl font-body font-light mb-8 max-w-2xl mx-auto text-white/90 drop-shadow-md">
          Experience instant menstrual pain relief with our smart thermal belt — designed for modern women.
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
