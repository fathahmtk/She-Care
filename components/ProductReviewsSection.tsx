import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';
import type { Review } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useRatings } from '../contexts/RatingContext';
import { useProducts } from '../contexts/ProductContext';
import StarRating from './StarRating';
import UserCircleIcon from './icons/UserCircleIcon';
import CheckBadgeIcon from './icons/CheckBadgeIcon';

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
      setFetchError(null);
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
      await addRating(productId, newRating);
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
  if (product) {
      // Approximate static reviews for visual effect, as we don't have the individual ratings
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
    <div className="border-t border-border-color pt-12 mt-12">
        <h3 className="text-3xl font-heading text-text-primary mb-8 text-center md:text-left">Customer Ratings & Reviews</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 sticky top-28">
                <div className="bg-surface p-6 rounded-lg border border-border-color">
                    <h4 className="font-semibold text-text-primary text-lg mb-4 text-center">Overall Rating</h4>
                    <div className="flex flex-col items-center">
                        <span className="text-6xl font-bold font-heading text-accent">{averageRating.toFixed(1)}</span>
                        <StarRating rating={averageRating} size="lg" />
                        <p className="text-text-secondary text-sm mt-2">Based on {totalRatings} ratings</p>
                    </div>
                    <div className="w-full max-w-sm mx-auto mt-6 space-y-1.5">
                        {ratingDistribution.slice().reverse().map((count, index) => {
                            const starLevel = 5 - index;
                            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                            return (
                                <div key={starLevel} className="flex items-center gap-3 text-sm">
                                    <span className="text-text-secondary w-12 text-right">{starLevel} star</span>
                                    <div className="w-full bg-border-color/30 rounded-full h-2"><div className="bg-accent h-2 rounded-full" style={{ width: `${percentage}%` }}></div></div>
                                    <span className="text-text-secondary w-8 text-left font-semibold">{Math.round(percentage)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-lg border border-border-color">
                    {submitSuccess ? (
                        <div className="text-center py-8 flex flex-col items-center justify-center h-full min-h-[300px] animate-fade-in">
                            <p className="font-semibold text-accent text-lg">Thank you for your review!</p>
                            <p className="text-text-secondary text-sm mt-1">Your feedback helps other customers.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <h4 className="font-semibold text-text-primary text-lg mb-4">Write a Review</h4>
                            <div className="space-y-4">
                                <div className="flex justify-center md:justify-start"><StarRating rating={newRating} onRatingChange={setNewRating} size="lg" /></div>
                                <div><input id="reviewAuthor" type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} disabled={isAuthenticated} placeholder="Your Name" required className="w-full px-4 py-2 bg-background-start border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-border-color/20 disabled:cursor-not-allowed"/></div>
                                <div><textarea id="reviewComment" rows={4} value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your experience..." required className="w-full px-4 py-2 bg-background-start border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent"></textarea></div>
                                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                                {isAuthenticated ? (
                                    <button type="submit" disabled={isSubmitting} className="w-full bg-accent text-surface py-3 rounded-lg transition-all duration-300 font-body font-semibold text-md shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Review'}</button>
                                ) : (
                                    <p className="text-sm text-center text-text-secondary p-4 bg-border-color/20 rounded-md">Please log in to submit a review.</p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {reviewsLoading ? <p className="text-text-secondary text-center py-10">Loading reviews...</p>
                : reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="bg-surface border border-border-color p-6 rounded-xl shadow-sm transition-shadow hover:shadow-md animate-fade-in">
                        <div className="flex items-start gap-4">
                            <div className="bg-accent/10 text-accent rounded-full p-2 flex-shrink-0">
                                <UserCircleIcon className="w-6 h-6"/>
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div>
                                        <h5 className="font-semibold text-text-primary">{review.author}</h5>
                                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                                            <CheckBadgeIcon className="w-4 h-4" />
                                            <span>Verified Purchase</span>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} className="mt-2 sm:mt-0" />
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed mt-3 border-t border-border-color pt-3">
                                    {review.comment}
                                </p>
                                 <p className="text-xs text-text-secondary/80 mt-3 text-right">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                ))
                : <div className="text-center py-16 bg-surface border border-border-color rounded-lg"><p className="text-text-secondary">Be the first to review this product!</p></div>}
                {fetchError && <p className="text-red-500 text-sm text-center">{fetchError}</p>}
            </div>
        </div>
    </div>
  );
};

export default ProductReviewsSection;
