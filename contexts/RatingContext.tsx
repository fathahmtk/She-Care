
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { UserRating } from '../types';

interface RatingContextType {
  ratings: UserRating[];
  addRating: (productId: number, rating: number) => void;
  getRatingsForProduct: (productId: number) => UserRating[];
  getProductRatingSummary: (productId: number) => { average: number; count: number };
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const getInitialRatings = (): UserRating[] => {
    try {
        const item = window.localStorage.getItem('shecarehub-ratings');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Could not parse ratings from localStorage", error);
        return [];
    }
};

export const RatingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ratings, setRatings] = useState<UserRating[]>(getInitialRatings);

  useEffect(() => {
    try {
        window.localStorage.setItem('shecarehub-ratings', JSON.stringify(ratings));
    } catch (error) {
        console.error("Could not save ratings to localStorage", error);
    }
  }, [ratings]);

  const addRating = (productId: number, rating: number) => {
    const newRating: UserRating = { productId, rating };
    // A real app would also associate this with a userId
    setRatings(prevRatings => [...prevRatings, newRating]);
  };

  const getRatingsForProduct = (productId: number) => {
    return ratings.filter(r => r.productId === productId);
  };
  
  const getProductRatingSummary = (productId: number) => {
    const productRatings = getRatingsForProduct(productId);
    const count = productRatings.length;
    if (count === 0) {
        return { average: 0, count: 0 };
    }
    const total = productRatings.reduce((sum, r) => sum + r.rating, 0);
    const average = total / count;
    return { average, count };
  };

  return (
    <RatingContext.Provider value={{ ratings, addRating, getRatingsForProduct, getProductRatingSummary }}>
      {children}
    </RatingContext.Provider>
  );
};

export const useRatings = (): RatingContextType => {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error('useRatings must be used within a RatingProvider');
  }
  return context;
};