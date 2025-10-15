import React from 'react';
// FIX: Import 'types.ts' to make the global JSX namespace augmentations available to this component.
import '../../types';

const QuestionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75m-4.242 0A2.25 2.25 0 0112 18.75m0 0A2.25 2.25 0 0112 21m0-2.25H12M12 12V9.75m0 0A2.25 2.25 0 0012 3m0 0A2.25 2.25 0 0012 5.25" />
    <path d="M12 18.75a.75.75 0 110 1.5.75.75 0 010-1.5z" fill="currentColor" />
  </svg>
);

export default QuestionIcon;