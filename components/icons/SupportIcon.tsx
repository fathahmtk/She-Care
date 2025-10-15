import React from 'react';
// FIX: Import 'types.ts' to make the global JSX namespace augmentations available to this component.
import '../../types';

const SupportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375c6.627 0 12-1.625 12-4.125S18.627 10.125 12 10.125s-12 1.625-12 4.125 5.373 4.125 12 4.125z" opacity="0.4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c6.627 0 12-1.625 12-4.125S18.627 6 12 6s-12 1.625-12 4.125" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4.875" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375v-4.125" />
  </svg>
);

export default SupportIcon;