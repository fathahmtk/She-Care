import React, { useState } from 'react';
import type { Product } from '../types';
import StarIcon from './icons/StarIcon';
import ProductGallery from './ProductGallery';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const SocialIconFacebook = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
  
const SocialIconInstagram = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.171 0-3.535.012-4.774.069-2.694.123-3.999 1.428-4.122 4.122-.057 1.239-.069 1.603-.069 4.774s.012 3.535.069 4.774c.123 2.694 1.428 3.999 4.122 4.122 1.239.057 1.603.069 4.774.069s3.535-.012 4.774-.069c2.694-.123 3.999-1.428 4.122-4.122.057-1.239.069-1.603.069-4.774s-.012-3.535-.069-4.774c-.123-2.694-1.428-3.999-4.122-4.122C15.535 3.616 15.171 3.604 12 3.604zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.441a2.309 2.309 0 110 4.618 2.309 2.309 0 010-4.618zM16.949 6.27a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" />
    </svg>
);
  
const SocialIconTwitter = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.333.57-.523 1.234-.523 1.947 0 1.615.823 3.043 2.072 3.878a4.65 4.65 0 01-2.11-.583v.06a4.66 4.66 0 003.733 4.568 4.69 4.69 0 01-2.104.08 4.661 4.661 0 004.35 3.234 9.348 9.348 0 01-5.786 1.995c-.376 0-.747-.022-1.112-.065a13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602a9.454 9.454 0 002.323-2.41z" />
    </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (isAdded) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  
  const handleShare = (platform: 'facebook' | 'twitter') => {
    const url = encodeURIComponent(`https://shecarehub.com/product/${product.id}`);
    const text = encodeURIComponent(`Check out this amazing product: ${product.name}!`);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
      
      {/* Left Column: Image Gallery */}
      <div className="relative">
        <ProductGallery images={product.imageUrls} alt={product.name} modelUrl={product.modelUrl} />
        {product.tag && (
            <span className="pointer-events-none absolute top-4 left-4 md:left-28 z-10 bg-accent text-white text-xs px-3 py-1 rounded-full font-body tracking-wider">
              {product.tag}
            </span>
        )}
      </div>

      {/* Right Column: Content Section */}
      <div className="text-left flex flex-col h-full">
        <h3 className="text-3xl lg:text-4xl font-heading text-text-primary mb-3">{product.name}</h3>
        
        {product.rating && (
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < product.rating!} />
            ))}
          </div>
        )}

        <p className="text-base text-text-secondary mb-6 font-body leading-relaxed">{product.description}</p>
        
        {/* Product Details Section */}
        {(product.materials || product.dimensions || product.careInstructions) && (
            <div className="my-6 space-y-4 text-sm font-body">
                {product.materials && (
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary">Materials</h4>
                            <p className="text-text-secondary">{product.materials}</p>
                        </div>
                    </div>
                )}
                {product.dimensions && (
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary">Dimensions</h4>
                            <p className="text-text-secondary">{product.dimensions}</p>
                        </div>
                    </div>
                )}
                {product.careInstructions && (
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary">Care Instructions</h4>
                            <p className="text-text-secondary">{product.careInstructions}</p>
                        </div>
                    </div>
                )}
            </div>
        )}
        
        {/* Price and Action Area */}
        <div className="mt-auto pt-6 border-t border-border-color">
          <div className="flex justify-between items-center mb-5">
              <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold font-heading text-accent">
                    ₹{product.price}
                  </span>
                  <span className="line-through text-text-secondary text-lg">
                    ₹{product.mrp}
                  </span>
              </div>
            <span className="bg-accent/20 text-accent text-sm font-bold px-4 py-2 rounded-full">
              {product.discount} OFF
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full text-surface py-4 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed flex-grow ${
                isAdded 
                    ? 'bg-emerald-500' 
                    : 'bg-accent hover:bg-accent-hover'
                }`}
            >
                {isAdded ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <div className="flex items-center gap-2">
                <button onClick={() => handleShare('facebook')} aria-label="Share on Facebook" className="text-text-secondary hover:text-accent transition-all duration-300 p-2 rounded-full hover:bg-accent/10 transform hover:scale-110">
                    <SocialIconFacebook className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare('twitter')} aria-label="Share on Twitter" className="text-text-secondary hover:text-accent transition-all duration-300 p-2 rounded-full hover:bg-accent/10 transform hover:scale-110">
                    <SocialIconTwitter className="w-5 h-5" />
                </button>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Share on Instagram" className="text-text-secondary hover:text-accent transition-all duration-300 p-2 rounded-full hover:bg-accent/10 transform hover:scale-110">
                    <SocialIconInstagram className="w-5 h-5" />
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;