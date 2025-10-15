import React, { useState, useEffect } from 'react';
// FIX: Import 'types.ts' to make global JSX namespace augmentations available.
import '../types';
// FIX: Switched to generateContent with gemini-2.5-flash-image to address quota issues.
import { GoogleGenAI, Modality } from "@google/genai";

const FALLBACK_IMAGE_URL = "https://images.pexels.com/photos/7262911/pexels-photo-7262911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const BrandStory: React.FC = () => {
  const [imageUrl, setImageUrl] = useState(FALLBACK_IMAGE_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateBrandImage = async () => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `A premium 3D logo for “shecarehub.com” in a rose gold metallic style on a soft beige background. The logo includes an elegant abstract feminine silhouette combined with a leaf element, representing wellness and empowerment. Include the brand name “shecarehub.com” in lowercase with modern serif typography. Add tagline text: “Luxury wellness for every woman — made in India” and “Comfort meets confidence” in matching rose gold tones. Incorporate subtext: “Designed for Indian women. Experience premium self-care at shecarehub.com.” The layout is elegant, minimalist, and balanced, suitable for luxury women’s wellness branding. The color palette is rose gold (#B76E79), nude beige (#F5EDE6), ivory white (#FFFDF9), and warm metallic shadows. Includes clean spacing, soft shadows, and refined alignment like a professional brand identity board.`;

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
            console.warn("AI brand image generation returned no images, using fallback.");
        }
      } catch (error) {
        console.error("Failed to generate brand image with AI, using fallback:", error);
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
          {/* Image Column */}
           <div className="w-full aspect-square relative">
            {isLoading && (
                <div className="absolute inset-0 bg-border-color/20 rounded-lg animate-pulse"></div>
            )}
            <img
              src={imageUrl}
              alt="Brand inspiration showing natural ingredients and a serene aesthetic"
              className={`w-full h-full object-cover rounded-lg shadow-xl transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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