import React from 'react';

const EmptyProductsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" {...props}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.69,57,4.35,51.87a4,4,0,0,1-2.22-5.1L12.05,24.2a4,4,0,0,1,5.1-2.22L24,24.87" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M59.65,44.87,55,28.05a4,4,0,0,0-5.1-2.22L32.21,32.64" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m44.34,17.4-26-9.8a4,4,0,0,0-4.5,1.2l-6.2,8.2" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21.21,55.5,48,46.17l10-20.4" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M.66,25.87,17,20.4l28,9.8" />
  </svg>
);

export default EmptyProductsIcon;
