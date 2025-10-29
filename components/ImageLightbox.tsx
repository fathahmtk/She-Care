import React, { useState, useEffect, useCallback } from 'react';
import ImageWithFallback from './ImageWithFallback';
import CloseIcon from './icons/CloseIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  alt: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, initialIndex, onClose, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prevImage = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, prevImage, nextImage]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        {/* Screen-reader title */}
        <h2 id="lightbox-title" className="sr-only">Image Lightbox</h2>
        
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-90 z-20" aria-label="Close lightbox">
          <CloseIcon className="w-8 h-8"/>
        </button>

        {/* Image */}
        <div className="relative max-w-4xl w-full max-h-[90vh]">
          <ImageWithFallback
            key={images[currentIndex]}
            src={images[currentIndex]}
            alt={`${alt} - full screen view ${currentIndex + 1}`}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Prev/Next Controls */}
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 p-3 rounded-full transition-all duration-300 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Previous image">
              <ArrowLeftIcon className="w-6 h-6"/>
            </button>
            <button onClick={nextImage} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 p-3 rounded-full transition-all duration-300 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Next image">
              <ArrowRightIcon className="w-6 h-6"/>
            </button>
          </>
        )}
        
        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;