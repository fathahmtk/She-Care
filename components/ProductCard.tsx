import React, { useState } from 'react';
import type { Product } from '../types';
import StarIcon from './icons/StarIcon';
import ProductGallery from './ProductGallery';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

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
          <button 
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full text-surface py-4 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed ${
              isAdded 
                ? 'bg-emerald-500' 
                : 'bg-accent hover:bg-accent-hover'
            }`}
          >
            {isAdded ? 'Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;