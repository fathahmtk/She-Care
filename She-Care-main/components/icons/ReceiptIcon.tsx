import React from 'react';
// FIX: Import 'types.ts' to make the global JSX namespace augmentations available to this component.
import '../../types';

const ReceiptIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M24 10h16a2 2 0 012 2v42a2 2 0 01-2 2H24a2 2 0 01-2-2V12a2 2 0 012-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.4"
    />
    <path
      d="M48 10H16a2 2 0 00-2 2v42a2 2 0 002 2h32a2 2 0 002-2V12a2 2 0 00-2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 22h20M22 32h20M22 42h10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ReceiptIcon;