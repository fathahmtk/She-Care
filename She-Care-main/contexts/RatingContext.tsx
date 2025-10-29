


import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { UserRating } from '../types';
import * as api from '../utils/api';

interface RatingContextType {
  ratings: UserRating[];
  loading: boolean;
  addRating: (productId: number, rating: number) => Promise<void>;
  getRatingsForProduct: (productId: number) => UserRating[];
  getProductRatingSummary: (productId: number) => { average: number; count: number };
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const RatingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getRatings();
      setRatings(data);
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const addRating = async (productId: number, rating: number) => {
    const newRating: UserRating = { productId, rating };
    await api.addRating(newRating);
    await fetchRatings();
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
    <RatingContext.Provider value={{ ratings, loading, addRating, getRatingsForProduct, getProductRatingSummary }}>
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