import React, { useState } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import StarIcon from './icons/StarIcon';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg';
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 'md',
  onRatingChange,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  const handleClick = (rate: number) => {
    if (onRatingChange) {
      onRatingChange(rate);
    }
  };
  
  const handleMouseEnter = (rate: number) => {
      if (onRatingChange) {
          setHoverRating(rate);
      }
  }
  
  const handleMouseLeave = () => {
      if (onRatingChange) {
          setHoverRating(0);
      }
  }

  const ratingToDisplay = hoverRating || rating;

  return (
    <div className={`flex items-center ${onRatingChange ? 'cursor-pointer' : ''} ${className}`} onMouseLeave={handleMouseLeave}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <div
            key={starValue}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            role={onRatingChange ? "button" : "img"}
            aria-label={onRatingChange ? `Rate ${starValue} stars` : `${rating} stars`}
          >
            <StarIcon
              filled={starValue <= ratingToDisplay}
              className={`${sizeClasses[size]} ${onRatingChange ? 'transition-transform duration-200 hover:scale-125' : ''}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
