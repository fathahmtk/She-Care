import React, { useState } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';
import { GoogleGenAI, Modality } from "@google/genai";
import { useSettings } from '../../contexts/SettingsContext';
import UploadIcon from '../icons/UploadIcon';
import CloseIcon from '../icons/CloseIcon';
import SparklesIcon from '../icons/SparklesIcon';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
};

const AdminSettings: React.FC = () => {
    const { settings, updateSettings, isInitialized } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    React.useEffect(() => {
        if(isInitialized){
            setLocalSettings(settings);
        }
    }, [isInitialized, settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({...prev, [name]: value}));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'heroImageUrl') => {
        if (e.target.files && e.target.files[0]) {
            try {
                const base64 = await fileToBase64(e.target.files[0]);
                setLocalSettings(prev => ({...prev, [field]: base64}));
            } catch (error) {
                console.error(`Error converting ${field} to Base64`, error);
                alert("There was an error processing the image. Please try again.");
            }
        }
    };
    
    const handleGenerateHeroImage = async () => {
        if (!localSettings.heroAiPrompt) {
            alert("Please enter a prompt to generate an image.");
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: localSettings.heroAiPrompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            let imageFound = false;
            if (response.candidates && response.candidates.length > 0) {
                 for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const generatedUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        setLocalSettings(prev => ({...prev, heroImageUrl: generatedUrl }));
                        imageFound = true;
                        break;
                    }
                }
            }
            if (!imageFound) alert("AI could not generate an image from this prompt. Please try a different one.");

        } catch (error) {
            console.error("AI image generation failed:", error);
            alert("Failed to generate image. Please check the console for errors.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await updateSettings(localSettings);
        setIsSaving(false);
        alert("Settings saved successfully!");
    };
    
    const inputStyles = "w-full mt-1 p-2 bg-surface border border-border-color rounded-md text-text-primary focus:ring-2 focus:ring-accent focus:border-accent";
    const labelStyles = "text-sm font-medium text-text-secondary";

    if (!isInitialized) return <div>Loading settings...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Site Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
                <div className="bg-surface p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Branding</h2>
                    <div>
                        <label className={labelStyles}>Logo</label>
                        <div className="mt-2 flex items-center gap-6">
                            <div className="w-24 h-24 bg-border-color/20 rounded-md flex items-center justify-center">
                                {localSettings.logoUrl ? <img src={localSettings.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" /> : <span className="text-xs text-text-secondary">Preview</span>}
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} className="text-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Homepage Hero Section</h2>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="heroTagline" className={labelStyles}>Tagline</label>
                            <input type="text" id="heroTagline" name="heroTagline" value={localSettings.heroTagline} onChange={handleChange} className={inputStyles} placeholder="e.g., Your Beauty, Our Passion"/>
                        </div>
                        <div>
                            <label htmlFor="heroSubtitle" className={labelStyles}>Subtitle</label>
                            <textarea id="heroSubtitle" name="heroSubtitle" value={localSettings.heroSubtitle} onChange={handleChange} className={inputStyles} rows={3}></textarea>
                        </div>
                        <div>
                            <label className={labelStyles}>Hero Image</label>
                            <div className="mt-2 flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-48 h-48 bg-border-color/20 rounded-md flex items-center justify-center flex-shrink-0">
                                    {localSettings.heroImageUrl ? <img src={localSettings.heroImageUrl} alt="Hero preview" className="max-w-full max-h-full object-cover rounded-md" /> : <span className="text-xs text-text-secondary">Preview</span>}
                                </div>
                                <div className="w-full space-y-4">
                                    <div>
                                        <p className="text-sm text-text-secondary mb-1">Option 1: Upload an image</p>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'heroImageUrl')} className="text-sm w-full" />
                                    </div>
                                    <div className="relative flex items-center">
                                        <hr className="w-full border-t border-border-color" />
                                        <span className="absolute left-1/2 -translate-x-1/2 bg-surface px-2 text-xs text-text-secondary">OR</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary mb-1">Option 2: Generate with AI</p>
                                        <div className="flex gap-2">
                                            <input type="text" name="heroAiPrompt" value={localSettings.heroAiPrompt} onChange={handleChange} className={inputStyles} placeholder="e.g., A model using a skincare product"/>
                                            <button type="button" onClick={handleGenerateHeroImage} disabled={isGenerating} className="px-4 py-2 bg-accent text-surface rounded-md hover:bg-accent-hover disabled:opacity-70 disabled:cursor-wait h-fit mt-1 flex items-center gap-2">
                                                <SparklesIcon className="w-4 h-4" />
                                                {isGenerating ? 'Generating...' : 'Generate'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-action-blue text-white rounded-lg hover:bg-action-blue-hover font-semibold disabled:opacity-70 disabled:cursor-wait">
                         {isSaving ? 'Saving...' : 'Save All Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;