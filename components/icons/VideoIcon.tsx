import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.

const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export default VideoIcon;