import React from 'react';

const Logo: React.FC = () => {
  return (
    <a href="#" aria-label="shecare.co Home">
      <svg
        viewBox="0 0 150 40"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent h-10 w-auto" // Control size here for flexibility
      >
        <g transform="translate(0 -2)">
          {/* Shield */}
          <path
            d="M24 4C14.059 4 6 12.059 6 22C6 30.28 11.5 37.121 19.5 39.385C22.125 40.233 26.875 40.233 29.5 39.385C37.5 37.121 43 30.28 43 22C43 12.059 34.941 4 25 4Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          {/* Woman's profile */}
          <path
            d="M18.5 29C17.5 27 17 24.5 18 22.5C19 20.5 21.5 19.5 23.5 20.5C24.5 21 25 22.5 24.5 24C24 26 22 28.5 18.5 29Z"
            fill="currentColor"
          />
          {/* Leaves */}
          <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M25 20C27 16 31 14 34 16" />
            <path d="M26 24C29 20 34 19 37 22" />
            <path d="M25 16C28 12 33 11 36 14" />
          </g>
        </g>
        <text
          x="52"
          y="26"
          fontFamily="Cormorant Garamond, serif"
          fontSize="18"
          fontWeight="600"
          fill="currentColor"
          letterSpacing="0.05em"
        >
          shecare.co
        </text>
      </svg>
    </a>
  );
};

export default Logo;