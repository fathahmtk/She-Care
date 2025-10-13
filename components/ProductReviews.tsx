import React from 'react';
import { REVIEWS } from '../constants';
import ReviewCard from './ReviewCard';

const ProductReviews: React.FC = () => {
  return (
    <section id="reviews" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">From Our Community</h2>
        <p className="text-text-secondary mb-12 max-w-3xl mx-auto">
          Real stories from real customers. See how shecarehub is making a difference.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;