import React, { useState, useEffect } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import { GoogleGenAI } from "@google/genai";

const FALLBACK_IMAGE_URL = "https://m.media-amazon.com/images/I/71yD2O6p7JL.jpg";

const Hero: React.FC = () => {
  const [imageUrl, setImageUrl] = useState(FALLBACK_IMAGE_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateHeroImage = async () => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "A minimalist flat lay of premium women's wellness and skincare products on a soft, textured background. Include items like a sleek menstrual pain relief belt, elegant serum bottles, and natural elements like rose petals. The color palette should be soft pinks, creams, and gold accents, evoking a sense of luxury and calm.";
        
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
          },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
          const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
          const generatedUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
          setImageUrl(generatedUrl);
        } else {
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
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 tracking-wider leading-tight text-surface drop-shadow-lg">
          shecarehub
        </h1>
        <p className="text-lg md:text-xl font-body font-light mb-8 max-w-2xl mx-auto text-surface/90 drop-shadow-md">
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