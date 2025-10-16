import React, { useState, useEffect, useMemo } from 'react';
import '../types';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useRatings } from '../contexts/RatingContext';
import ProductGallery from './ProductGallery';
import StarRating from './StarRating';
import CloseIcon from './icons/CloseIcon';
import CartIcon from './icons/CartIcon';
import CheckIcon from './icons/CheckIcon';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [cartAnnouncement, setCartAnnouncement] = useState('');
  const { addToCart } = useCart();
  const { getProductRatingSummary } = useRatings();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  const { averageRating, totalReviews } = useMemo(() => {
    const userSubmittedRatings = getProductRatingSummary(product.id);
    const totalStaticReviews = product.reviewCount || 0;
    const totalReviewsCount = totalStaticReviews + userSubmittedRatings.count;
    const totalRatingPoints = (product.rating * totalStaticReviews) + (userSubmittedRatings.average * userSubmittedRatings.count);
    const finalAverageRating = totalReviewsCount > 0 ? totalRatingPoints / totalReviewsCount : 0;
    return { averageRating: finalAverageRating, totalReviews: totalReviewsCount };
  }, [product, getProductRatingSummary]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (isAdded) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setCartAnnouncement(`${product.name} (quantity: ${quantity}) has been added to your cart.`);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
    setTimeout(() => {
        setCartAnnouncement('');
    }, 5000);
  };
  
  const handleViewDetailsClick = () => {
    onClose();
    // Allow time for the modal to close before hash changes
    setTimeout(() => {
      window.location.hash = `#/product/${product.id}`;
    }, 100);
  };


  return (
    <div
      className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative border border-border-color"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text-secondary hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-90 z-10"
          aria-label="Close quick view"
        >
          <CloseIcon />
        </button>

        <div className="sr-only" role="status" aria-live="polite">{cartAnnouncement}</div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto no-scrollbar">
          <ProductGallery images={product.imageUrls} alt={product.name} modelUrl={product.modelUrl} videoUrl={product.videoUrl} />
          
          <div className="text-left flex flex-col">
            <h2 id="quick-view-title" className="text-3xl lg:text-4xl font-heading text-text-primary mb-2 leading-tight">{product.name}</h2>
            
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={averageRating} />
              <span className="text-text-secondary text-sm">({totalReviews} reviews)</span>
            </div>
            
            <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-semibold font-heading text-accent">₹{product.price}</span>
                <span className="line-through text-text-secondary text-xl">₹{product.mrp}</span>
                <span className="bg-accent/20 text-accent text-sm font-bold px-3 py-1 rounded-md">{product.discount} OFF</span>
            </div>

            <p className="text-base text-text-secondary mb-6 font-body leading-relaxed max-h-28 overflow-y-auto no-scrollbar">
                {product.description}
            </p>

            <div className="mt-auto pt-6 border-t border-border-color space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border-color rounded-md">
                  <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-md font-bold hover:bg-accent/10 transition-colors rounded-l-md" aria-label="Decrease quantity">-</button>
                  <input type="text" readOnly value={quantity} className="w-12 text-center font-semibold text-md bg-transparent border-x border-border-color py-2 focus:outline-none" aria-label="Current quantity" />
                  <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-md font-bold hover:bg-accent/10 transition-colors rounded-r-md" aria-label="Increase quantity">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`w-full text-surface py-3 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed flex-grow flex items-center justify-center ${
                  isAdded ? 'bg-emerald-500' : 'bg-accent hover:bg-accent-hover'
                  }`}
                >
                  {isAdded ? <><CheckIcon className="h-6 w-6 mr-2"/>Added!</> : <><CartIcon className="h-6 w-6 mr-2"/>Add to Cart</>}
                </button>
              </div>
              <button onClick={handleViewDetailsClick} className="text-center w-full text-accent font-semibold hover:underline mt-4 text-sm">
                View Full Details &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;