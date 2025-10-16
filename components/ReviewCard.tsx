import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import { Review } from '../types';
import StarIcon from './icons/StarIcon';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-surface border border-border-color rounded-lg p-6 flex flex-col h-full text-left">
      <div className="flex items-center mb-3">
        <h3 className="text-lg font-bold text-text-primary flex-grow">{review.author}</h3>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < review.rating} />
          ))}
        </div>
      </div>
      <p className="text-sm font-semibold text-accent mb-4 tracking-wide">{review.productName}</p>
      <p className="text-text-secondary text-sm font-body leading-relaxed">
        "{review.comment}"
      </p>
    </div>
  );
};

export default ReviewCard;