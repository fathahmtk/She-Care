import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';

// This icon component has been removed as it is no longer used in the application.
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} />
);

export default SparklesIcon;