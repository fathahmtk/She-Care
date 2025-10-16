import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';

const SocialIconTwitter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.333.57-.523 1.234-.523 1.947 0 1.615.823 3.043 2.072 3.878a4.65 4.65 0 01-2.11-.583v.06a4.66 4.66 0 003.733 4.568 4.69 4.69 0 01-2.104.08 4.661 4.661 0 004.35 3.234 9.348 9.348 0 01-5.786 1.995c-.376 0-.747-.022-1.112-.065a13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602a9.454 9.454 0 002.323-2.41z" />
  </svg>
);

export default SocialIconTwitter;