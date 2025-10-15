import React, { useState, useEffect } from 'react';
// FIX: Import 'types.ts' to make global JSX namespace augmentations available.
import '../types';
// FIX: Switched to generateContent with gemini-2.5-flash-image to address quota issues.
import { GoogleGenAI, Modality } from "@google/genai";

const FALLBACK_LOGO_URL = "https://storage.googleapis.com/aistudio-ux-team-data/Racer/shecarehub-logo-icon.png";

const BrandStory: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState(FALLBACK_LOGO_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateBrandImage = async () => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Generate a single, premium 3D logo ICON for "shecarehub.com", a luxury women's wellness brand. The icon must feature an elegant, abstract feminine silhouette gracefully combined with a leaf element, symbolizing wellness and empowerment. The style should be a polished rose gold metallic (#B76E79) with soft, warm metallic shadows creating a sense of depth. Render this icon on a clean, soft, nude beige background (#F5EDE6). The final image should be minimalist, balanced, and exude luxury with clean spacing and refined alignment, suitable for a professional brand identity. DO NOT include any text.`;

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
                setLogoUrl(generatedUrl);
                imageFound = true;
                break;
              }
            }
        }
        
        if (!imageFound) {
            console.warn("AI brand logo generation returned no images, using fallback.");
        }
      } catch (error) {
        console.error("Failed to generate brand logo with AI, using fallback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateBrandImage();
  }, []);


  return (
    <section id="our-story" className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Brand Identity Board Column */}
           <div className="w-full aspect-square bg-gradient-to-br from-[#F5EDE6] to-[#f8f2ed] rounded-lg shadow-xl p-8 flex flex-col justify-center items-center text-center transition-all duration-500">
            {isLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center animate-pulse">
                    <div className="w-24 h-24 bg-border-color/20 rounded-full mb-6"></div>
                    <div className="h-10 bg-border-color/20 rounded w-3/4 mb-4"></div>
                    <div className="h-5 bg-border-color/20 rounded w-1/2 mb-6"></div>
                    <div className="h-8 bg-border-color/20 rounded w-2/3"></div>
                </div>
            ) : (
              <div className="animate-fade-in">
                <img src={logoUrl} alt="shecarehub logo icon" className="w-28 h-28 mb-4 mx-auto rounded-full" />
                <h3 className="text-4xl font-heading lowercase tracking-wide" style={{ color: '#B76E79' }}>shecarehub.com</h3>
                <p className="text-md mt-4" style={{ color: '#B76E79' }}>Luxury wellness for every woman — made in India.</p>
                <div className="w-20 h-px bg-accent/30 my-6 mx-auto"></div>
                <p className="text-3xl font-heading" style={{ color: '#B76E79' }}>Comfort meets confidence</p>
                <p className="text-xs text-text-secondary mt-6">Designed for Indian women. Experience premium self-care at shecarehub.com.</p>
              </div>
            )}
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