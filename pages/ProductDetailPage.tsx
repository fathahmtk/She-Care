


import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import ProductGallery from '../components/ProductGallery';
import AnimatedSection from '../components/AnimatedSection';
import CheckIcon from '../components/icons/CheckIcon';
import CartIcon from '../components/icons/CartIcon';
import HeartIcon from '../components/icons/HeartIcon';
import CameraIcon from '../components/icons/CameraIcon';
import LiveTryOn from '../components/LiveTryOn';
import StarRating from '../components/StarRating';
import { useRatings } from '../contexts/RatingContext';
import RatingSection from '../components/RatingSection';
import RecommendedProducts from '../components/RecommendedProducts';


interface ProductDetailPageProps {
  productId: number;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { getProductById } = useProducts();
  const product = getProductById(productId);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const { getProductRatingSummary } = useRatings();

  // Calculate combined rating for display
  const userSubmittedRatings = getProductRatingSummary(productId);
  const totalReviews = (product?.reviewCount || 0) + userSubmittedRatings.count;
  const totalRatingPoints = ((product?.rating || 0) * (product?.reviewCount || 0)) + (userSubmittedRatings.average * userSubmittedRatings.count);
  const averageRating = totalReviews > 0 ? totalRatingPoints / totalReviews : 0;


  if (!product) {
    return (
      <div className="container mx-auto text-center py-48 px-6">
        <h1 className="text-4xl font-heading text-accent">Product Not Found</h1>
        <p className="text-lg text-text-secondary mt-4">We couldn't find the product you were looking for.</p>
        <a href="#/" className="mt-8 inline-block bg-accent text-background-start font-body font-semibold py-3 px-10 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out">
          Back to Products
        </a>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = () => {
      if (isWishlisted) {
          removeFromWishlist(product.id);
      } else {
          addToWishlist(product);
      }
  };
  
  const handleAddToCart = () => {
    if (isAdded) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
        setIsAdded(false);
    }, 2500);
  };
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  }

  return (
    <>
    <AnimatedSection>
        <div className="container mx-auto px-6 py-16">
            <div className="mb-8">
                <a href="/#products" className="text-accent hover:underline font-semibold">&larr; Back to Products</a>
            </div>
            <div className="bg-surface rounded-2xl shadow-xl p-6 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <ProductGallery images={product.imageUrls} alt={product.name} modelUrl={product.modelUrl} />
                    
                    <div className="text-left flex flex-col h-full">
                        <h1 className="text-4xl lg:text-5xl font-heading text-text-primary mb-3">{product.name}</h1>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <StarRating rating={averageRating} />
                          <a href="#ratings-section" className="text-text-secondary text-sm hover:underline">({totalReviews} customer ratings)</a>
                        </div>

                        <p className="text-lg text-text-secondary mb-6 font-body leading-relaxed">{product.description}</p>
                        
                         <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-5xl font-semibold font-heading text-accent">
                            ₹{product.price}
                            </span>
                            <span className="line-through text-text-secondary text-2xl">
                            ₹{product.mrp}
                            </span>
                             <span className="bg-accent/20 text-accent text-md font-bold px-4 py-2 rounded-full">
                                {product.discount} OFF
                            </span>
                        </div>
                        
                        {/* Live Try-On Button */}
                        {product.shades && product.shades.length > 0 && (
                            <div className="mb-8">
                                <button
                                    onClick={() => setIsTryOnOpen(true)}
                                    className="w-full flex items-center justify-center gap-3 bg-surface border-2 border-accent text-accent py-4 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-sm hover:shadow-lg hover:bg-accent/10 transform hover:scale-105"
                                >
                                    <CameraIcon className="w-6 h-6" />
                                    <span>Live Try-On</span>
                                </button>
                            </div>
                        )}
                        
                        {/* Add to Cart Section */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center border border-border-color rounded-md">
                                <button onClick={() => handleQuantityChange(-1)} className="px-4 py-3 text-lg font-bold hover:bg-accent/10 transition-colors rounded-l-md">-</button>
                                <input type="text" readOnly value={quantity} className="w-16 text-center font-semibold text-lg bg-transparent border-x border-border-color py-3 focus:outline-none" />
                                <button onClick={() => handleQuantityChange(1)} className="px-4 py-3 text-lg font-bold hover:bg-accent/10 transition-colors rounded-r-md">+</button>
                            </div>
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
                                        <span>Added to Cart!</span>
                                    </>
                                ) : (
                                    <>
                                        <CartIcon className="h-6 w-6 mr-2" />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={handleToggleWishlist}
                                className="p-4 border border-border-color rounded-lg text-accent hover:bg-accent/10 transition-colors duration-300"
                                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <HeartIcon className="h-6 w-6" filled={isWishlisted} />
                            </button>
                        </div>
                        
                        {/* Product Details Section */}
                        {(product.color || product.materials || product.dimensions || product.careInstructions) && (
                            <div className="border-t border-border-color pt-8 mt-8">
                                <h3 className="text-xl font-heading text-text-primary mb-4">Specifications</h3>
                                <dl className="space-y-3 text-sm font-body">
                                    {product.color && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="font-semibold text-text-primary">Color</dt>
                                            <dd className="text-text-secondary text-right">{product.color}</dd>
                                        </div>
                                    )}
                                    {product.materials && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="font-semibold text-text-primary">Materials</dt>
                                            <dd className="text-text-secondary text-right">{product.materials}</dd>
                                        </div>
                                    )}
                                    {product.dimensions && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="font-semibold text-text-primary">Dimensions</dt>
                                            <dd className="text-text-secondary text-right">{product.dimensions}</dd>
                                        </div>
                                    )}
                                    {product.careInstructions && (
                                        <div className="flex justify-between gap-4">
                                            <dt className="font-semibold text-text-primary">Care</dt>
                                            <dd className="text-text-secondary text-right">{product.careInstructions}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Recommendations Section */}
                <RecommendedProducts currentProduct={product} />

                 {/* New Rating Section */}
                <div id="ratings-section">
                  <RatingSection productId={product.id} />
                </div>
            </div>
        </div>
    </AnimatedSection>
    {isTryOnOpen && product.shades && (
        <LiveTryOn shades={product.shades} onClose={() => setIsTryOnOpen(false)} />
    )}
    </>
  );
};

export default ProductDetailPage;