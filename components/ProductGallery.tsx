import React, { useState } from 'react';
import ImageWithFallback from './ImageWithFallback';
import Icon3D from './icons/Icon3D';
import IconImage from './icons/IconImage';

interface ProductGalleryProps {
  images: string[];
  alt: string;
  modelUrl?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, alt, modelUrl }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [is3DView, setIs3DView] = useState(false);

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
      <div className="aspect-square w-full relative">
        {is3DView && modelUrl ? (
          <div className="w-full h-full overflow-hidden rounded-lg border border-border-color">
             {/* FIX: Replaced kebab-case attributes with camelCase props to align with React's JSX syntax and TypeScript type definitions for custom elements. */}
             <model-viewer
                src={modelUrl}
                alt={`3D model of ${alt}`}
                cameraControls
                autoRotate
                shadowIntensity="1"
                style={{ width: '100%', height: '100%', backgroundColor: 'rgb(var(--color-surface))' }}
              >
                <div slot="poster" className="relative w-full h-full flex items-center justify-center">
                    <ImageWithFallback src={images[0]} alt={`Poster for ${alt} 3D model`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-sm">
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-surface animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E0D8CC"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>
                            <span className="sr-only">Loading 3D model...</span>
                        </div>
                    </div>
                </div>
              </model-viewer>
            </div>
        ) : (
          <div className="w-full h-full overflow-hidden rounded-lg border border-border-color group">
            <ImageWithFallback
              key={images[activeIndex]}
              src={images[activeIndex]}
              alt={`${alt} - view ${activeIndex + 1}`}
              className="w-full h-full object-cover animate-fade-in transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
        )}
        
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

      {!is3DView && images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square w-full rounded-md overflow-hidden border-2 transition-all duration-300 ${
                activeIndex === index
                  ? 'border-accent ring-2 ring-accent/50 ring-offset-2 ring-offset-surface'
                  : 'border-transparent hover:border-accent/50 opacity-70 hover:opacity-100'
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