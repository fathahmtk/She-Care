import React from 'react';
// FIX: Add a side-effect import for 'types.ts' to ensure global JSX augmentations are available.
import '../types';

// FIX: This file contained an incorrect component definition ('Logo'). It has been replaced with the correct 'BrandLogo' SVG component.
// This component now correctly accepts 'className', 'variant', and 'style' props,
// resolving TypeScript errors in all files where it is used.
const BrandLogo: React.FC<{ className?: string; variant?: 'gradient' | 'solid', style?: React.CSSProperties }> = ({ className, variant = 'gradient', style }) => {
  const isGradient = variant === 'gradient';
  const fillClass = isGradient ? 'fill-[url(#logoGradient)]' : 'fill-current';
  const strokeClass = isGradient ? 'stroke-[url(#logoGradient)]' : 'stroke-current';

  return (
    <svg
      viewBox="0 0 320 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="shecarehub.com logo"
      style={style}
    >
      {isGradient && (
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(var(--color-accent))" />
            <stop offset="100%" stopColor="rgb(var(--color-accent-hover))" />
          </linearGradient>
        </defs>
      )}
      
      {/* Icon */}
      <g transform="translate(0, 4)">
        <path
          d="M20,2 C28.84,2 35,8.16 35,17 C35,25.84 28.84,32 20,32 C11.16,32 5,25.84 5,17 C5,8.16 11.16,2 20,2 Z"
          fill="none"
          className={strokeClass}
          strokeWidth="2.5"
        />
        {/* Abstract silhouette and leaf paths */}
        <path
          d="M15,25 C18,22 18,18 15,15 C15,15 16,12 14,9"
          fill="none"
          className={strokeClass}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M21,9 C25,14 22,17 25,25"
          fill="none"
          className={strokeClass}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      
      {/* Text */}
      <text
        x="45"
        y="28"
        fontFamily="Poppins, sans-serif"
        fontSize="24"
        fontWeight="400"
        className={fillClass}
      >
        shecare<tspan fontWeight="300">hub.com</tspan>
      </text>
    </svg>
  );
};

export default BrandLogo;
