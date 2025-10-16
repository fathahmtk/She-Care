import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import BrandLogo from './BrandLogo';
import { useSettings } from '../contexts/SettingsContext';

const Logo: React.FC = () => {
  const { settings } = useSettings();
  
  return (
    <a href="#/" aria-label="SheCareHub.com Home" className="inline-block transition-transform duration-300 ease-in-out transform hover:scale-105">
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt="shecarehub.com logo" className="h-10 w-auto object-contain" />
      ) : (
        <BrandLogo className="h-10 w-auto" />
      )}
    </a>
  );
};

export default Logo;