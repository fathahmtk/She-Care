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
