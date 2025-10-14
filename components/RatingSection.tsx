

import React, { useState } from 'react';
import { useRatings } from '../contexts/RatingContext';
import { useProducts } from '../contexts/ProductContext';
import StarRating from './StarRating';

interface RatingSectionProps {
  productId: number;
}

const RatingSection: React.FC<RatingSectionProps> = ({ productId }) => {
  const { getProductById } = useProducts();
  const { addRating, getRatingsForProduct } = useRatings();
  const [userRating, setUserRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const product = getProductById(productId);
  const allRatings = getRatingsForProduct(productId);
  const totalStaticReviews = product?.reviewCount || 0;
  const totalRatings = totalStaticReviews + allRatings.length;
  
  const staticRatingTotal = (product?.rating || 0) * totalStaticReviews;
  const userRatingTotal = allRatings.reduce((sum, r) => sum + r.rating, 0);

  const averageRating = totalRatings > 0 ? (staticRatingTotal + userRatingTotal) / totalRatings : 0;
  
  // Create a distribution for display
  const ratingDistribution = [0, 0, 0, 0, 0];
  // Seed with static data for a more realistic look
  if (product) {
      ratingDistribution[4] = Math.round(product.reviewCount * 0.7); // 5 stars
      ratingDistribution[3] = Math.round(product.reviewCount * 0.2); // 4 stars
      ratingDistribution[2] = Math.round(product.reviewCount * 0.05); // 3 stars
      ratingDistribution[1] = Math.round(product.reviewCount * 0.03); // 2 stars
      ratingDistribution[0] = Math.round(product.reviewCount * 0.02); // 1 star
  }
  allRatings.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
        ratingDistribution[r.rating - 1]++;
    }
  });


  const handleSubmitRating = () => {
    if (userRating > 0) {
      addRating(productId, userRating);
      setIsSubmitted(true);
      // Reset form after a few seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setUserRating(0);
      }, 3000);
    }
  };
  
  return (
    <div className="border-t border-border-color pt-8 mt-12">
        <h3 className="text-2xl font-heading text-text-primary mb-6">Customer Ratings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Side: Summary */}
            <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold font-heading text-accent">{averageRating.toFixed(1)}</span>
                    <div>
                        <StarRating rating={averageRating} />
                        <p className="text-text-secondary text-sm">Based on {totalRatings} ratings</p>
                    </div>
                </div>
                {/* Distribution Bars */}
                <div className="w-full max-w-sm mt-4 space-y-1">
                    {ratingDistribution.slice().reverse().map((count, index) => {
                        const starLevel = 5 - index;
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return (
                            <div key={starLevel} className="flex items-center gap-2 text-sm">
                                <span className="text-text-secondary w-16">{starLevel} star{starLevel > 1 ? 's' : ''}</span>
                                <div className="w-full bg-border-color/50 rounded-full h-2.5">
                                    <div className="bg-accent h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-text-secondary w-8 text-right">{Math.round(percentage)}%</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* Right Side: Submission */}
            <div className="bg-surface/50 p-6 rounded-lg border border-border-color">
                {isSubmitted ? (
                    <div className="text-center py-8">
                        <p className="font-semibold text-accent text-lg">Thank you for your rating!</p>
                        <p className="text-text-secondary text-sm mt-1">Your feedback helps us improve.</p>
                    </div>
                ) : (
                    <>
                        <h4 className="font-semibold text-text-primary text-lg mb-2">Share your thoughts</h4>
                        <p className="text-text-secondary text-sm mb-4">Rate this product to help other customers.</p>
                        <div className="flex justify-center md:justify-start mb-4">
                           <StarRating rating={userRating} onRatingChange={setUserRating} size="lg"/>
                        </div>
                        <button 
                            onClick={handleSubmitRating}
                            disabled={userRating === 0}
                            className="w-full bg-accent text-surface py-3 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-md shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Submit Rating
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
  )
}

export default RatingSection;