import React, { useState, useEffect } from 'react';
// FIX: Remove redundant side-effect import; named type imports are sufficient.
import { GoogleGenAI, Type } from "@google/genai";
import type { WhyChooseUsItem } from '../types';
import QualityIcon from './icons/QualityIcon';
import WellnessIcon from './icons/WellnessIcon';
import ShippingIcon from './icons/ShippingIcon';
import SupportIcon from './icons/SupportIcon';

const featurePillars = [
  {
    icon: <QualityIcon className="w-10 h-10 text-accent" />,
    title: "Premium Quality",
  },
  {
    icon: <WellnessIcon className="w-10 h-10 text-accent" />,
    title: "Holistic Wellness",
  },
  {
    icon: <ShippingIcon className="w-10 h-10 text-accent" />,
    title: "Free & Fast Shipping",
  },
  {
    icon: <SupportIcon className="w-10 h-10 text-accent" />,
    title: "Dedicated Support",
  }
];

const descriptionsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING, description: "A concise, elegant, and persuasive description (around 20-25 words) for the feature." },
        },
        required: ["title", "description"],
    },
};

const WHY_CHOOSE_US_CACHE_KEY = 'shecarehub-why-choose-us-features';
const FALLBACK_FEATURES: WhyChooseUsItem[] = [
    { icon: <QualityIcon className="w-10 h-10 text-accent" />, title: "Premium Quality", description: "We use only the finest, ethically-sourced materials to create products that are safe, durable, and luxurious." },
    { icon: <WellnessIcon className="w-10 h-10 text-accent" />, title: "Holistic Wellness", description: "Our products are thoughtfully designed to address the unique wellness needs of modern women, nurturing both body and mind." },
    { icon: <ShippingIcon className="w-10 h-10 text-accent" />, title: "Free & Fast Shipping", description: "Enjoy complimentary shipping on all orders, delivered swiftly to your doorstep across India." },
    { icon: <SupportIcon className="w-10 h-10 text-accent" />, title: "Dedicated Support", description: "Our dedicated care team is here to assist you with any questions, ensuring a seamless and supportive experience." },
];

const WhyChooseUs: React.FC = () => {
  const [features, setFeatures] = useState<WhyChooseUsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateDescriptions = async () => {
      const cachedData = localStorage.getItem(WHY_CHOOSE_US_CACHE_KEY);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData) && parsedData.length === featurePillars.length) {
            const featuresWithIcons = parsedData.map((item: { title: string; description: string }) => {
              const pillar = featurePillars.find(p => p.title === item.title);
              return { ...item, icon: pillar ? pillar.icon : <QualityIcon className="w-10 h-10 text-accent" /> };
            });
            setFeatures(featuresWithIcons);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Could not parse cached data.", e);
          localStorage.removeItem(WHY_CHOOSE_US_CACHE_KEY);
        }
      }

      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const pillarTitles = featurePillars.map(p => `"${p.title}"`).join(', ');
        const prompt = `You are a branding expert for SheCareHub.com, a luxury women's wellness brand in India. For each of the following brand pillars, write a compelling, short description. The tone should be elegant, trustworthy, and aspirational. The pillars are: ${pillarTitles}. Return the result as a JSON array where each object has a "title" and "description" key, in the same order as the input titles.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json', responseSchema: descriptionsSchema },
        });
        
        const results = JSON.parse(response.text) as { title: string; description: string }[];
        
        localStorage.setItem(WHY_CHOOSE_US_CACHE_KEY, JSON.stringify(results));

        const generatedFeatures = featurePillars.map(pillar => {
            const foundResult = results.find(r => r.title === pillar.title);
            return {
                ...pillar,
                description: foundResult ? foundResult.description : "A commitment to excellence.",
            };
        });
        setFeatures(generatedFeatures);

      } catch (error) {
        console.error("Failed to generate descriptions, using fallback:", error);
        setFeatures(FALLBACK_FEATURES);
      } finally {
        setIsLoading(false);
      }
    };

    generateDescriptions();
  }, []);

  return (
    <section id="why-choose-us" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">Why SheCareHub?</h2>
        <p className="text-text-secondary mb-16 max-w-3xl mx-auto">
          We are dedicated to elevating your self-care journey with products that are as effective as they are beautiful.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(isLoading ? Array(4).fill({}) : features).map((feature, index) => (
            <div key={index} className="bg-surface/50 p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 flex flex-col items-center h-full">
              {isLoading ? (
                <div className="w-full h-48 bg-border-color/20 rounded-lg animate-pulse"></div>
              ) : (
                <>
                  <div className="mb-6 inline-block p-4 bg-accent/10 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-heading text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-text-secondary font-body text-sm leading-relaxed flex-grow">{feature.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;