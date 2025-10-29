import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.

const PrintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 18.25m10.56-4.421l.5 4.421m-11.06-4.421a32.323 32.323 0 0111.06 0M4.5 21V10.5a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25V21M4.5 10.5h15M9 10.5V6a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 6v4.5" />
  </svg>
);

export default PrintIcon;
