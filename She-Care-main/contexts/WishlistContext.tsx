import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Product } from '../types';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getInitialWishlist = (): Product[] => {
    try {
        const item = window.localStorage.getItem('shecarehub-wishlist');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Could not parse wishlist from localStorage", error);
        return [];
    }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(getInitialWishlist);

  useEffect(() => {
    try {
        window.localStorage.setItem('shecarehub-wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
        console.error("Could not save wishlist to localStorage", error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      if (!prevItems.some(item => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };
  
  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};