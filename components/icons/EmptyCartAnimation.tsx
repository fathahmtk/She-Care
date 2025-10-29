import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.

const EmptyCartAnimation: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .floating-bag {
          animation: float 4s ease-in-out infinite;
        }
        .question-mark {
          animation: fadeInOut 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}
    </style>
    <g className="floating-bag">
      {/* Shopping Bag */}
      <path d="M16 20L18.33 46.67C18.46 48.5 20.01 50 21.86 50H42.14C43.99 50 45.54 48.5 45.67 46.67L48 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 28V20C24 15.58 27.58 12 32 12C36.42 12 40 15.58 40 20V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    {/* Question Mark */}
    <g className="question-mark">
      <path d="M48 14C48 11.79 49.79 10 52 10C54.21 10 56 11.79 56 14C56 15.5 55 16.58 54 17C53 17.42 52 18.5 52 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="52" cy="24" r="1.5" fill="currentColor"/>
    </g>
  </svg>
);

export default EmptyCartAnimation;