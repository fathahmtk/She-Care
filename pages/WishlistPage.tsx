import React from 'react';
// FIX: Import 'types.ts' to make the global JSX namespace augmentations available to this component.
import '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import CloseIcon from '../components/icons/CloseIcon';
import HeartIcon from '../components/icons/HeartIcon';

const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <AnimatedSection>
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-heading text-accent mb-8 text-center">Your Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-lg shadow-md flex flex-col items-center justify-center">
            <HeartIcon className="w-24 h-24 text-border-color" />
            <p className="text-xl font-semibold text-text-primary mt-6">Your wishlist is empty</p>
            <p className="text-text-secondary mt-2 mb-8">Save your favorite items here to shop them later.</p>
            <a href="#" className="bg-accent text-background-start font-body font-semibold py-3 px-8 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out transform hover:scale-105">
              Discover Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map(item => (
              <div key={item.id} className="bg-surface rounded-lg shadow-md overflow-hidden flex flex-col group">
                <div className="relative">
                  <a href={`#/product/${item.id}`}>
                    <img src={item.imageUrls[0]} alt={item.name} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"/>
                  </a>
                  <button onClick={() => removeFromWishlist(item.id)} className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm p-2 rounded-full text-text-secondary hover:text-red-500 transition-colors" aria-label="Remove from wishlist">
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <a href={`#/product/${item.id}`} className="font-semibold text-text-primary hover:text-accent transition-colors mb-2 flex-grow">{item.name}</a>
                  <div className="flex justify-between items-center mt-auto pt-2">
                    <p className="font-semibold text-accent text-lg">₹{item.price}</p>
                    <button onClick={() => handleMoveToCart(item)} className="text-sm bg-accent/20 text-accent font-semibold px-4 py-2 rounded-md hover:bg-accent hover:text-surface transition-colors">
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default WishlistPage;