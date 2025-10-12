// FIX: Updated JSX type definitions and component props to use camelCase for web component attributes,
// which is the standard convention for React. The types from 'react' (like React.DetailedHTMLProps) 
// must be in scope for the JSX namespace augmentation to work correctly.
// FIX: The namespace import `import * as React from 'react'` can prevent JSX namespace augmentation from working correctly. Changed to a default import to ensure TypeScript picks up the custom element definition.
import React from 'react';
import ImageWithFallback from './ImageWithFallback';

// FIX: Add global JSX type definition for the 'model-viewer' custom element to resolve JSX type errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          cameraControls?: boolean;
          autoRotate?: boolean;
          shadowIntensity?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

interface ProductGalleryProps {
  images: string[];
  alt: string;
  modelUrl?: string;
}

const Icon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <line x1="3.27" y1="6.96" x2="12" y2="12.01"></line>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
    <line x1="20.73" y1="6.96" x2="12" y2="12.01"></line>
  </svg>
);

const IconImage: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);


const ProductGallery: React.FC<ProductGalleryProps> = ({ images, alt, modelUrl }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [is3DView, setIs3DView] = React.useState(false);

  if (!images || images.length === 0) {
    return (
        <div className="w-full aspect-square bg-border-color/20 flex items-center justify-center text-text-secondary rounded-lg">
            No Image Available
        </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    if(is3DView) setIs3DView(false);
  };
  
  const toggleViewMode = () => {
    if (modelUrl) {
      setIs3DView(prev => !prev);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main View Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border-color">
        {is3DView && modelUrl ? (
          // FIX: Use camelCase for web component props (e.g., cameraControls, shadowIntensity) to align with React conventions and fix JSX syntax errors.
           <model-viewer
              src={modelUrl}
              alt={`3D model of ${alt}`}
              cameraControls
              autoRotate
              shadowIntensity="1"
              style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF' }}
            />
        ) : (
          <ImageWithFallback
            key={images[activeIndex]}
            src={images[activeIndex]}
            alt={`${alt} - view ${activeIndex + 1}`}
            className="w-full h-full object-cover animate-fade-in"
          />
        )}
        
        {/* 3D Toggle Button */}
        {modelUrl && (
            <button
              onClick={toggleViewMode}
              className="absolute top-3 right-3 z-10 p-2 bg-surface/80 backdrop-blur-sm rounded-full text-text-primary hover:text-accent transition-colors duration-300"
              aria-label={is3DView ? "Switch to image gallery" : "Switch to 3D view"}
              aria-pressed={is3DView}
            >
              {is3DView ? <IconImage className="w-6 h-6" /> : <Icon3D className="w-6 h-6" />}
            </button>
        )}
      </div>

      {/* Thumbnails - Hidden in 3D view for an immersive experience */}
      {!is3DView && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square w-full rounded-md overflow-hidden border-2 transition-colors ${
                activeIndex === index ? 'border-accent' : 'border-transparent hover:border-accent/50'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <ImageWithFallback
                src={image}
                alt={`Thumbnail for ${alt} ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;