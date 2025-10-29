import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';

const EmptyOrdersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" {...props}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M35.79,53.25,23.45,58.7a4,4,0,0,1-5.1-2.22L12,46" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.1,38.82,5.35,34.25a4,4,0,0,1-2.22-5.1L8.58,12.29a4,4,0,0,1,5.1-2.22L27.42,15.52" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M54.45,34.1,49.88,17.29a4,4,0,0,0-5.1-2.22L31,21" />
    <path fill="currentColor" d="M48.5,41.5a13,13,0,1,0,13,13A13,13,0,0,0,48.5,41.5Zm0,24a11,11,0,1,1,11-11A11,11,0,0,1,48.5,65.5Z" />
    <rect fill="currentColor" x="47.5" y="47.5" width="2" height="10" rx="1" />
    <rect fill="currentColor" x="43.5" y="51.5" width="10" height="2" rx="1" />
  </svg>
);

export default EmptyOrdersIcon;