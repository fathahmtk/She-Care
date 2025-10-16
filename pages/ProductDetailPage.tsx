import React, { useState, useMemo } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
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
import ProductReviewsSection from '../components/ProductReviewsSection';
import RecommendedProducts from '../components/RecommendedProducts';
import AccordionItem from '../components/AccordionItem';
import SocialIconFacebook from '../components/icons/SocialIconFacebook';
import SocialIconInstagram from '../components/icons/SocialIconInstagram';
import SocialIconTwitter from '../components/icons/SocialIconTwitter';


interface ProductDetailPageProps {
  productId: number;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { getProductById, loading } = useProducts();
  const product = getProductById(productId);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const { getProductRatingSummary } = useRatings();

  const { averageRating, totalReviews } = useMemo(() => {
    if (!product) return { averageRating: 0, totalReviews: 0 };
    const userSubmittedRatings = getProductRatingSummary(productId);
    const totalStaticReviews = product.reviewCount || 0;
    const totalReviewsCount = totalStaticReviews + userSubmittedRatings.count;
    const totalRatingPoints = (product.rating * totalStaticReviews) + (userSubmittedRatings.average * userSubmittedRatings.count);
    const finalAverageRating = totalReviewsCount > 0 ? totalRatingPoints / totalReviewsCount : 0;
    return { averageRating: finalAverageRating, totalReviews: totalReviewsCount };
  }, [product, productId, getProductRatingSummary]);

  if (loading) {
     return (
        <div className="container mx-auto text-center py-48 px-6">
            <div role="status" className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h1 className="text-2xl font-heading text-text-secondary mt-4">Loading Product...</h1>
            </div>
        </div>
     );
  }

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
  
  const handleShare = (platform: 'facebook' | 'twitter') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this amazing product from SheCareHub: ${product.name}!`);
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

  const productSpecifications = [
    { title: 'Color', value: product.color },
    { title: 'Materials', value: product.materials },
    { title: 'Dimensions', value: product.dimensions },
    { title: 'Care', value: product.careInstructions },
  ].filter(spec => spec.value);

  return (
    <>
    <div className="container mx-auto px-6 py-12">
        <AnimatedSection>
            {/* Breadcrumbs */}
            <nav className="text-sm font-body text-text-secondary mb-8" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex">
                    <li className="flex items-center">
                        <a href="#/" className="hover:text-accent transition-colors">Home</a>
                        <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
                    </li>
                    <li className="flex items-center">
                        <a href="/#products" className="hover:text-accent transition-colors">{product.category}</a>
                        <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
                    </li>
                    <li>
                        <span className="text-text-primary">{product.name}</span>
                    </li>
                </ol>
            </nav>

            <div className="bg-surface rounded-2xl shadow-xl p-6 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    <ProductGallery images={product.imageUrls} alt={product.name} modelUrl={product.modelUrl} videoUrl={product.videoUrl} />
                    
                    <div className="text-left flex flex-col h-full">
                        <span className="text-sm font-semibold tracking-widest text-text-secondary uppercase mb-2">{product.brand}</span>
                        <h1 className="text-4xl lg:text-5xl font-heading text-text-primary mb-3 leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-2 mb-6">
                          <StarRating rating={averageRating} />
                          <a href="#reviews-section" className="text-text-secondary text-sm hover:underline">({totalReviews} customer ratings)</a>
                        </div>
                        
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-5xl font-semibold font-heading text-accent">
                                ₹{product.price}
                            </span>
                            <span className="line-through text-text-secondary text-2xl">
                                ₹{product.mrp}
                            </span>
                            <span className="bg-accent/20 text-accent text-sm font-bold px-3 py-1 rounded-md">
                                {product.discount} OFF
                            </span>
                        </div>
                        <p className="text-base text-text-secondary mb-6 font-body leading-relaxed">{product.description}</p>
                        
                        {product.shades && product.shades.length > 0 && (
                            <div className="mb-6">
                                <p className="font-semibold text-text-primary mb-2">Available Shades:</p>
                                <div className="flex flex-wrap gap-3">
                                    {product.shades.map(shade => (
                                        <div key={shade.name} className="flex items-center gap-2" title={shade.name}>
                                            <div className="w-6 h-6 rounded-full border border-border-color" style={{ backgroundColor: shade.hex }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-auto pt-6 border-t border-border-color space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-border-color rounded-md">
                                    <button onClick={() => handleQuantityChange(-1)} className="px-4 py-3 text-lg font-bold hover:bg-accent/10 transition-colors rounded-l-md">-</button>
                                    <input type="text" readOnly value={quantity} className="w-14 text-center font-semibold text-lg bg-transparent border-x border-border-color py-3 focus:outline-none" />
                                    <button onClick={() => handleQuantityChange(1)} className="px-4 py-3 text-lg font-bold hover:bg-accent/10 transition-colors rounded-r-md">+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdded}
                                    className={`w-full text-surface py-4 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed flex-grow flex items-center justify-center ${
                                    isAdded ? 'bg-emerald-500' : 'bg-accent hover:bg-accent-hover'
                                    }`}
                                >
                                    {isAdded ? <><CheckIcon className="h-6 w-6 mr-2"/>Added!</> : <><CartIcon className="h-6 w-6 mr-2"/>Add to Cart</>}
                                </button>
                                <button
                                    onClick={handleToggleWishlist}
                                    className="p-4 border border-border-color rounded-lg text-accent transition-colors duration-300 hover:bg-accent/10"
                                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <HeartIcon className="w-6 h-6" filled={isWishlisted} />
                                </button>
                            </div>
                            
                            {product.shades && product.shades.length > 0 && (
                                <button
                                    onClick={() => setIsTryOnOpen(true)}
                                    className="w-full border-2 border-accent text-accent py-3 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-sm hover:shadow-md hover:bg-accent/10 transform hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <CameraIcon className="w-6 h-6"/>
                                    Live Try-On
                                </button>
                            )}
                            <div className="flex items-center gap-4 pt-4 border-t border-border-color">
                                <span className="text-sm font-semibold text-text-secondary">Share:</span>
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

            {/* Product Details Accordion */}
            <div className="mt-12 max-w-4xl mx-auto">
                <AccordionItem title="Product Specifications">
                    <ul className="space-y-2 text-text-secondary">
                        {productSpecifications.map(spec => (
                            <li key={spec.title} className="flex justify-between">
                                <span className="font-semibold">{spec.title}:</span>
                                <span>{spec.value}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionItem>
                <AccordionItem title="Shipping & Returns">
                    <p className="text-text-secondary">
                        We offer free standard shipping across India on all orders. Typically, orders are delivered within 3-5 business days. We also have a 7-day return policy for unused and unopened products. For more details, please visit our policy page.
                    </p>
                </AccordionItem>
            </div>
            
            <div id="reviews-section" className="mt-12">
              <ProductReviewsSection productId={productId} />
            </div>

            <RecommendedProducts currentProduct={product} />

        </AnimatedSection>
    </div>
    {isTryOnOpen && product.shades && (
        <LiveTryOn shades={product.shades} onClose={() => setIsTryOnOpen(false)} />
    )}
    </>
  );
};

export default ProductDetailPage;