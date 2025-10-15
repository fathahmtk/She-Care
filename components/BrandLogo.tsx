import React from 'react';
import '../types';

const BrandLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 160 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="shecarehub logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(var(--color-accent))" />
          <stop offset="100%" stopColor="rgb(var(--color-accent-hover))" />
        </linearGradient>
      </defs>
      
      {/* Icon */}
      <g transform="translate(0, 4)">
        <path
          d="M20,2 C28.84,2 35,8.16 35,17 C35,25.84 28.84,32 20,32 C11.16,32 5,25.84 5,17 C5,8.16 11.16,2 20,2 Z"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
        />
        <path
          d="M20,9 C24.42,9 28,12.58 28,17 C28,21.42 24.42,25 20,25"
          fill="none"
          stroke="url(#logoGradient)"
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
        className="fill-text-primary"
      >
        shecare<tspan fontWeight="300">hub</tspan>
      </text>
    </svg>
  );
};

export default BrandLogo;
