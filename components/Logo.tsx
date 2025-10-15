import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import BrandLogo from './BrandLogo';

const Logo: React.FC = () => {
  return (
    <a href="#/" aria-label="SheCareHub.com Home" className="inline-block transition-transform duration-300 ease-in-out transform hover:scale-105">
      <BrandLogo className="h-10 w-auto" />
    </a>
  );
};

export default Logo;
