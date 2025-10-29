import React, { useState, useEffect, useCallback } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import * as api from '../utils/api';
import type { Review } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useRatings } from '../contexts/RatingContext';
import { useProducts } from '../contexts/ProductContext';
import StarRating from './StarRating';

interface ProductReviewsSectionProps {
  productId: number;
}

const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form state
  const { user, isAuthenticated } = useAuth();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Contexts for summary and submission
  const { addRating, getRatingsForProduct } = useRatings();
  const { getProductById } = useProducts();
  const product = getProductById(productId);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const allReviews = await api.getReviews();
      setReviews(allReviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      setFetchError('Failed to load reviews.');
    } finally {
      setReviewsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  
  useEffect(() => {
      if (isAuthenticated && user) {
          setNewAuthor(user.name);
      }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) { setSubmitError('Please select a rating.'); return; }
    if (!newComment.trim()) { setSubmitError('Please write a comment.'); return; }
    if (!newAuthor.trim()) { setSubmitError('Please enter your name.'); return; }

    setSubmitError('');
    setIsSubmitting(true);

    const reviewData: Omit<Review, 'id'> = {
      productId,
      productName: product?.name || 'Unknown Product',
      author: newAuthor,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString(),
    };

    try {
      await api.addReview(reviewData);
      await addRating(productId, newRating); // Also update the summary rating context
      setSubmitSuccess(true);
      setNewRating(0);
      setNewComment('');
      if (!isAuthenticated) setNewAuthor(''); 
      await fetchReviews();
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setSubmitError('There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate summary stats
  const allUserRatings = getRatingsForProduct(productId);
  const totalStaticReviews = product?.reviewCount || 0;
  const totalRatings = totalStaticReviews + allUserRatings.length;
  const staticRatingTotal = (product?.rating || 0) * totalStaticReviews;
  const userRatingTotal = allUserRatings.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRatings > 0 ? (staticRatingTotal + userRatingTotal) / totalRatings : 0;
  
  const ratingDistribution = [0, 0, 0, 0, 0];
  if (product) { // Seed with static data for realism
      ratingDistribution[4] = Math.round(product.reviewCount * 0.7);
      ratingDistribution[3] = Math.round(product.reviewCount * 0.2);
      ratingDistribution[2] = Math.round(product.reviewCount * 0.05);
      ratingDistribution[1] = Math.round(product.reviewCount * 0.03);
      ratingDistribution[0] = Math.round(product.reviewCount * 0.02);
  }
  allUserRatings.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating - 1]++;
  });

  return (
    <div className="border-t border-border-color pt-8 mt-12">
        <h3 className="text-2xl font-heading text-text-primary mb-6">Customer Ratings & Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side: Summary and Form */}
            <div className="space-y-8">
                {/* Summary */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-3">
                        <span className="text-5xl font-bold font-heading text-accent">{averageRating.toFixed(1)}</span>
                        <div>
                            <StarRating rating={averageRating} />
                            <p className="text-text-secondary text-sm">Based on {totalRatings} ratings</p>
                        </div>
                    </div>
                    <div className="w-full max-w-sm mt-4 space-y-1">
                        {ratingDistribution.slice().reverse().map((count, index) => {
                            const starLevel = 5 - index;
                            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                            return (
                                <div key={starLevel} className="flex items-center gap-2 text-sm">
                                    <span className="text-text-secondary w-16">{starLevel} star{starLevel > 1 ? 's' : ''}</span>
                                    <div className="w-full bg-border-color/50 rounded-full h-2.5"><div className="bg-accent h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div></div>
                                    <span className="text-text-secondary w-8 text-right">{Math.round(percentage)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-surface/50 p-6 rounded-lg border border-border-color">
                    {submitSuccess ? (
                        <div className="text-center py-8 flex flex-col items-center justify-center h-full min-h-[300px]">
                            <p className="font-semibold text-accent text-lg">Thank you for your review!</p>
                            <p className="text-text-secondary text-sm mt-1">Your feedback helps other customers.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <h4 className="font-semibold text-text-primary text-lg mb-4">Write a Review</h4>
                            <div className="space-y-4">
                                <div><StarRating rating={newRating} onRatingChange={setNewRating} size="lg" /></div>
                                <div><input id="reviewAuthor" type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} disabled={isAuthenticated} placeholder="Your Name" required className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-border-color/20"/></div>
                                <div><textarea id="reviewComment" rows={4} value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your experience..." required className="w-full px-4 py-2 bg-surface border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent"></textarea></div>
                                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                                <button type="submit" disabled={isSubmitting} className="w-full bg-accent text-surface py-3 rounded-lg transition-all duration-300 font-body font-semibold text-md shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Review'}</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Right Side: Reviews List */}
            <div className="max-h-[600px] overflow-y-auto no-scrollbar pr-2 space-y-6">
                {reviewsLoading ? <p className="text-text-secondary">Loading reviews...</p>
                : reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="border-b border-border-color pb-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-1">
                            <h5 className="font-semibold text-text-primary">{review.author}</h5>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="text-xs text-text-secondary mb-2">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{review.comment}</p>
                    </div>
                ))
                : <div className="text-center py-10"><p className="text-text-secondary">Be the first to review this product!</p></div>}
                {fetchError && <p className="text-red-500 text-sm">{fetchError}</p>}
            </div>
        </div>
    </div>
  );
};

export default ProductReviewsSection;