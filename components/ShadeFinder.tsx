import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import UploadIcon from './icons/UploadIcon';

// Self-contained constants and types to minimize file changes
const FOUNDATION_SHADES = [
  { name: "Porcelain", hex: "#F8E9E2" },
  { name: "Ivory", hex: "#F9EAE0" },
  { name: "Light Beige", hex: "#F3D9C9" },
  { name: "Warm Beige", hex: "#EBC2AC" },
  { name: "Natural Tan", hex: "#D4A88F" },
  { name: "Golden Tan", hex: "#C69777" },
  { name: "Bronze", hex: "#A57358" },
  { name: "Rich Mahogany", hex: "#885741" },
  { name: "Deep Espresso", hex: "#623D2B" },
];

interface ShadeFinderResult {
  shadeName: string;
  description: string;
}

const shadeFinderSchema = {
  type: Type.OBJECT,
  properties: {
    shadeName: { type: Type.STRING, description: "The name of the single closest matching foundation shade from the provided list." },
    description: { type: Type.STRING, description: "A detailed, personalized explanation for the recommendation, considering skin depth and undertones." },
  },
  required: ["shadeName", "description"],
};

// Helper function to convert a file to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = (reader.result as string).split(',')[1];
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Failed to convert file to base64."));
      }
    };
    reader.onerror = error => reject(error);
  });
};

const ShadeFinder: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<ShadeFinderResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleImageSelect = useCallback((file: File) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    
    if (file) {
      // Reset errors and results from previous attempts
      setError(null);
      setResult(null);
      
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file (JPEG, PNG, etc.).");
        setImageFile(null);
        setImagePreview(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Image is too large. Please select a file smaller than 5MB.");
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      
      // On success, set the new file and preview
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);
  
  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(isOver);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFindShade = async () => {
    if (!imageFile) {
      setError("Please upload a photo first.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      // FIX: Removed `as string` type assertion to strictly follow API key handling guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const imagePart = {
        inlineData: { mimeType: imageFile.type, data: base64Image },
      };

      const shadeList = FOUNDATION_SHADES.map(s => s.name).join(', ');
      const textPart = {
        text: `As a virtual beauty consultant, analyze the skin tone in this photo. From this list of available shades - [${shadeList}] - identify the single best match. Provide a detailed, personalized explanation for your recommendation, considering factors like skin depth and undertones (e.g., warm, cool, neutral).`,
      };
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: 'application/json',
          responseSchema: shadeFinderSchema,
        },
      });
      
      const resultData = JSON.parse(response.text) as ShadeFinderResult;
      
      // Validate that the returned shade exists in our list
      if (FOUNDATION_SHADES.some(shade => shade.name === resultData.shadeName)) {
        setResult(resultData);
      } else {
        // Fallback if the model hallucinates a shade name
        setError("We couldn't determine a precise match. Please try a different photo with clearer lighting.");
      }

    } catch (err) {
      console.error("Error finding shade:", err);
      setError("The AI analysis failed. This could be due to a poor quality image (e.g., bad lighting, blur) or a temporary network issue. Please try again with a different photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedShade = result ? FOUNDATION_SHADES.find(s => s.name === result.shadeName) : null;

  return (
    <section id="shade-finder" className="py-24 bg-surface/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">AI Foundation Shade Finder</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Upload a clear, well-lit photo of your face to find your perfect match in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-4xl mx-auto">
          {/* Left Column: Image Upload & Preview */}
          <div className="w-full aspect-square">
            {!imagePreview ? (
              <label
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragOver ? 'border-accent bg-accent/10' : 'border-border-color bg-surface/80 hover:bg-surface hover:border-accent'}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <UploadIcon className="w-10 h-10 mb-4 text-text-secondary" />
                  <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold text-accent">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-text-secondary">PNG, JPG, or WEBP (MAX. 5MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleImageSelect(e.target.files[0])} />
              </label>
            ) : (
              <div className="relative w-full h-full group">
                <img src={imagePreview} alt="User upload preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <button onClick={handleReset} className="bg-surface text-text-primary font-body font-semibold py-2 px-5 rounded-md transform hover:scale-105 transition-transform">
                    Change Photo
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column: Controls & Result */}
          <div className="text-center md:text-left h-full flex flex-col justify-center">
             <div className="min-h-[200px] flex flex-col items-center justify-center">
                {isLoading ? (
                  <div className="flex flex-col items-center" role="status" aria-live="polite">
                    <svg className="animate-spin h-10 w-10 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-text-secondary">Finding your perfect shade...</p>
                  </div>
                ) : error ? (
                   <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-start text-left gap-3 w-full" role="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                          <p className="font-semibold">Analysis Failed</p>
                          <p className="text-sm">{error}</p>
                      </div>
                   </div>
                ) : result && recommendedShade ? (
                  <div className="text-center w-full animate-fade-in">
                    <p className="text-text-secondary mb-2">Your perfect match is:</p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                       <div className="w-16 h-16 rounded-full border-2 border-surface shadow-md" style={{ backgroundColor: recommendedShade.hex }}></div>
                       <h3 className="text-4xl font-heading text-text-primary">{result.shadeName}</h3>
                    </div>
                    <p className="text-text-secondary italic">"{result.description}"</p>
                  </div>
                ) : (
                  <p className="text-text-secondary">Upload a photo to get started.</p>
                )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleFindShade}
                disabled={!imageFile || isLoading}
                className="w-full md:w-auto bg-accent text-surface py-4 px-12 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100 disabled:shadow-md"
              >
                Find My Shade
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ShadeFinder;
