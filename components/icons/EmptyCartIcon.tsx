import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';

// FIX: This file was empty. An empty .tsx file without imports/exports is not
// treated as a module by TypeScript, which can lead to global scope pollution
// and issues with JSX type resolution. Added a placeholder component to make it a module.
const EmptyCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M16 20L18.33 46.67C18.46 48.5 20.01 50 21.86 50H42.14C43.99 50 45.54 48.5 45.67 46.67L48 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 28V20C24 15.58 27.58 12 32 12C36.42 12 40 15.58 40 20V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default EmptyCartIcon;
