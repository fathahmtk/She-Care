import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';

const EmptyCustomersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" {...props}>
    <path fill="currentColor" opacity="0.4" d="M21,23a8,8,0,1,0-8-8,8,8,0,0,0,8,8Z" />
    <path fill="currentColor" opacity="0.4" d="M32.42,39.27A12,12,0,0,0,21,31.5a12,12,0,0,0-11.42,7.77,15,15,0,0,0,22.84,0Z" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M41,18a8,8,0,1,0-8-8,8,8,0,0,0,8,8Z" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M52.42,34.27A12,12,0,0,0,41,26.5a12,12,0,0,0-11.42,7.77,15,15,0,0,0,22.84,0Z" />
    <path fill="currentColor" d="M47.5,50.5a13,13,0,1,0,13,13A13,13,0,0,0,47.5,50.5Zm0,24a11,11,0,1,1,11-11A11,11,0,0,1,47.5,74.5Z" />
    <g>
      <path fill="currentColor" d="M49.21,57.17a1,1,0,0,0-1.42,0l-3.29,3.29-1.29-1.29a1,1,0,0,0-1.42,1.42l2,2a1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,0-1.42Z" />
    </g>
  </svg>
);

export default EmptyCustomersIcon;
