import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Settings } from '../types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => Promise<void>;
  isInitialized: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'shecarehub-site-settings';

const defaultSettings: Settings = {
    logoUrl: '',
    heroImageUrl: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    heroAiPrompt: "A close-up of a happy, modern Indian woman with a radiant smile, showcasing healthy skin. The background is soft and minimalist, with natural light. The mood is joyful, confident, and serene. High-resolution beauty photography.",
    heroTagline: 'shecarehub.com',
    heroSubtitle: 'Discover premium wellness and beauty products designed for the modern woman.'
};

const getInitialSettings = (): Settings => {
    try {
        const item = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (item) {
            // Merge stored settings with defaults to ensure all keys are present
            return { ...defaultSettings, ...JSON.parse(item) };
        }
        return defaultSettings;
    } catch (error) {
        console.error("Could not parse settings from localStorage", error);
        return defaultSettings;
    }
};


export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        setSettings(getInitialSettings());
        setIsInitialized(true);
    }, []);

    const updateSettings = async (newSettings: Settings) => {
        try {
            window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error("Could not save settings to localStorage", error);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isInitialized }}>
        {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};