import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductGallery from './ProductGallery';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import SocialIconFacebook from './icons/SocialIconFacebook';
import SocialIconInstagram from './icons/SocialIconInstagram';
import SocialIconTwitter from './icons/SocialIconTwitter';
import CartIcon from './icons/CartIcon';
import CheckIcon from './icons/CheckIcon';
import HeartIcon from './icons/HeartIcon';
import StarRating from './StarRating';
import { useRatings } from '../contexts/RatingContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const { getProductRatingSummary } = useRatings();

  const isWishlisted = isInWishlist(product.id);
  
  // Combine initial data with user-submitted data for a live feel, memoized for performance.
  const userSubmittedRatings = getProductRatingSummary(product.id);

  const { averageRating, totalReviews } = useMemo(() => {
    const totalStaticReviews = product.reviewCount;
    const totalUserReviews = userSubmittedRatings.count;
    
    const totalReviewsCount = totalStaticReviews + totalUserReviews;
    const totalRatingPoints = (product.rating * totalStaticReviews) + (userSubmittedRatings.average * totalUserReviews);
    const finalAverageRating = totalReviewsCount > 0 ? totalRatingPoints / totalReviewsCount : 0;
    
    return { averageRating: finalAverageRating, totalReviews: totalReviewsCount };
  }, [product.rating, product.reviewCount, userSubmittedRatings.average, userSubmittedRatings.count]);


  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    if (isAdded) return;
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  
  const handleShare = (platform: 'facebook' | 'twitter') => {
    const url = encodeURIComponent(window.location.origin + `/#/product/${product.id}`);
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
    <div className="bg-surface rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="relative group">
          <ProductGallery images={product.imageUrls} alt={product.name} modelUrl={product.modelUrl} />
          {product.tag && (
              <span className="pointer-events-none absolute top-4 left-4 md:left-28 z-10 bg-accent text-white text-xs px-3 py-1 rounded-full font-body tracking-wider">
                {product.tag}
              </span>
          )}
          <button 
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 z-10 p-2 bg-surface/80 backdrop-blur-sm rounded-full text-accent transition-all duration-300 transform hover:scale-110"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
              <HeartIcon className="w-6 h-6" filled={isWishlisted} />
          </button>

          {/* --- START: Refined Hover Effect Overlay --- */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-black/0 md:group-hover:bg-black/60 rounded-lg transition-all duration-500 ease-out flex flex-col items-center justify-end pb-4 md:justify-center md:pb-0 p-4">
            <a 
                href={`#/product/${product.id}`} 
                className="bg-surface text-text-primary font-body font-semibold py-3 px-8 mb-4 rounded-md transition-all duration-500 ease-out transform opacity-100 translate-y-0 md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:scale-105 md:delay-100"
            >
                View Details
            </a>
            <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-auto text-surface py-3 px-8 rounded-md transition-all duration-500 ease-out font-body font-semibold tracking-wider shadow-md transform disabled:cursor-not-allowed flex items-center justify-center opacity-100 translate-y-0 md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:scale-105 md:delay-200 ${
                isAdded 
                    ? 'bg-emerald-500' 
                    : 'bg-accent hover:bg-accent-hover'
                }`}
            >
                {isAdded ? (
                    <>
                        <CheckIcon className="h-5 w-5 mr-2" />
                        <span>Added!</span>
                    </>
                ) : (
                    <>
                        <CartIcon className="h-5 w-5 mr-2" />
                        <span>Add to Cart</span>
                    </>
                )}
            </button>
          </div>
          {/* --- END: Refined Hover Effect Overlay --- */}

        </div>

        {/* Right Column: Content Section */}
        <div className="text-left flex flex-col h-full">
            <a href={`#/product/${product.id}`} className="hover:text-accent transition-colors duration-300">
                <h3 className="text-3xl lg:text-4xl font-heading text-text-primary mb-3">{product.name}</h3>
            </a>
          
           <div className="flex items-center gap-2 mb-4">
            <StarRating rating={averageRating} />
            <span className="text-text-secondary text-sm">({totalReviews} reviews)</span>
          </div>

          <p className="text-base text-text-secondary mb-6 font-body leading-relaxed">{product.description}</p>
          
          <div className="mb-6">
            <a href={`#/product/${product.id}`} className="text-accent font-semibold hover:underline">View Full Details &rarr;</a>
          </div>
          
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
                  className={`w-full text-surface py-4 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed flex-grow flex items-center justify-center ${
                  isAdded 
                      ? 'bg-emerald-500' 
                      : 'bg-accent hover:bg-accent-hover'
                  }`}
              >
                {isAdded ? (
                    <>
                        <CheckIcon className="h-6 w-6 mr-2" />
                        <span>Added!</span>
                    </>
                ) : (
                    <>
                        <CartIcon className="h-6 w-6 mr-2" />
                        <span>Add to Cart</span>
                    </>
                )}
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
    </div>
  );
};

export default ProductCard;