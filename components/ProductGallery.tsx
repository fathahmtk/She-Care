import React, { useState } from 'react';
// FIX: Add a side-effect import to ensure JSX namespace is correctly augmented for 'model-viewer'.
import '../types';
import ImageWithFallback from './ImageWithFallback';
import Icon3D from './icons/Icon3D';
import VideoIcon from './icons/VideoIcon';
import ImageLightbox from './ImageLightbox';

interface ProductGalleryProps {
  images: string[];
  alt: string;
  modelUrl?: string;
  videoUrl?: string;
  children?: React.ReactNode;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, alt, modelUrl, videoUrl, children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState<'image' | '3d' | 'video'>('image');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
        <div className="w-full aspect-square bg-border-color/20 flex items-center justify-center text-text-secondary rounded-lg">
            No Image Available
        </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    setView('image');
    setActiveIndex(index);
  };
  
  const hasMultipleViews = images.length > 1 || modelUrl || videoUrl;

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main View Area */}
        <div className="aspect-square w-full relative">
          {view === 'image' && (
               <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full h-full overflow-hidden rounded-lg border border-border-color group cursor-zoom-in"
                  aria-label="Open image in full-screen view"
               >
                  <ImageWithFallback
                      key={images[activeIndex]}
                      src={images[activeIndex]}
                      alt={`${alt} - view ${activeIndex + 1}`}
                      className="w-full h-full object-cover animate-fade-in transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
               </button>
          )}
          {view === '3d' && modelUrl && (
              <div className="w-full h-full overflow-hidden rounded-lg border border-border-color">
                  <model-viewer
                      src={modelUrl}
                      alt={`3D model of ${alt}`}
                      cameraControls
                      autoRotate
                      shadowIntensity={1}
                      style={{ width: '100%', height: '100%', backgroundColor: 'rgb(var(--color-surface))' }}
                  >
                      <div slot="poster" className="relative w-full h-full flex items-center justify-center">
                          <ImageWithFallback src={images[0]} alt={`Poster for ${alt} 3D model`} className="w-full h-full object-cover" />
                      </div>
                  </model-viewer>
              </div>
          )}
          {view === 'video' && videoUrl && (
              <div className="w-full h-full overflow-hidden rounded-lg border border-border-color bg-black flex items-center justify-center">
                  <iframe
                      src={videoUrl}
                      title={`Video of ${alt}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                  ></iframe>
              </div>
          )}
          {view === 'image' && children}
        </div>

        {hasMultipleViews && (
          <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                  <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`aspect-square w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                      view === 'image' && activeIndex === index
                      ? 'border-accent ring-2 ring-accent/50 ring-offset-2 ring-offset-surface'
                      : 'border-transparent hover:border-accent/50 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={view === 'image' && activeIndex === index}
                  >
                  <ImageWithFallback
                      src={image}
                      alt={`Thumbnail for ${alt} ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                  />
                  </button>
              ))}
              {modelUrl && (
                  <button
                      onClick={() => setView('3d')}
                      className={`aspect-square w-16 h-16 rounded-md flex items-center justify-center bg-surface/50 border-2 transition-all duration-300 ${
                          view === '3d'
                          ? 'border-accent ring-2 ring-accent/50 ring-offset-2 ring-offset-surface text-accent'
                          : 'border-border-color hover:border-accent/50 text-text-secondary hover:text-accent'
                      }`}
                      aria-label="Switch to 3D view"
                      aria-pressed={view === '3d'}
                  >
                      <Icon3D className="w-8 h-8"/>
                  </button>
              )}
              {videoUrl && (
                  <button
                      onClick={() => setView('video')}
                      className={`aspect-square w-16 h-16 rounded-md flex items-center justify-center bg-surface/50 border-2 transition-all duration-300 ${
                          view === 'video'
                          ? 'border-accent ring-2 ring-accent/50 ring-offset-2 ring-offset-surface text-accent'
                          : 'border-border-color hover:border-accent/50 text-text-secondary hover:text-accent'
                      }`}
                      aria-label="Watch product video"
                      aria-pressed={view === 'video'}
                  >
                      <VideoIcon className="w-8 h-8"/>
                  </button>
              )}
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <ImageLightbox 
          images={images} 
          initialIndex={activeIndex} 
          onClose={() => setIsLightboxOpen(false)}
          alt={alt}
        />
      )}
    </>
  );
};

export default ProductGallery;