import React from 'react';

const ShippingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path d="M3.4,13.82l-1.3-2.6A3,3,0,0,1,4.89,7.5H9.2a3,3,0,0,1,2.79,1.8l1.3,2.6a1,1,0,0,0,.9.55H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <rect width="10" height="7" x="12.65" y="11.27" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" rx="1"/>
    <circle cx="7.7" cy="18.27" r="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17.7" cy="18.27" r="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ShippingIcon;