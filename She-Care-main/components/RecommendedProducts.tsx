import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import { useProducts } from '../contexts/ProductContext';
import type { Product } from '../types';
import StarRating from './StarRating';

interface RecommendedProductsProps {
  currentProduct: Product;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ currentProduct }) => {
  const { products } = useProducts();

  // Enhanced recommendation logic:
  // 1. Prioritize products from the same brand.
  // 2. Fill remaining spots with products from the same category.
  const sameBrand = products.filter(
    p => p.brand === currentProduct.brand && p.id !== currentProduct.id
  );

  const sameCategory = products.filter(
    p => p.category === currentProduct.category && p.id !== currentProduct.id && p.brand !== currentProduct.brand
  );

  // Combine lists, ensuring no duplicates and prioritizing brand matches.
  const recommended = [...sameBrand, ...sameCategory].slice(0, 4);

  if (recommended.length === 0) {
    return null; // Don't render the section if there are no recommendations
  }

  return (
    <div className="mt-24 bg-surface/50 rounded-2xl p-8 lg:p-12">
      <h3 className="text-3xl md:text-4xl font-heading text-text-primary mb-12 text-center">
        You Might Also Like
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommended.map(product => (
          <div key={product.id} className="bg-surface rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
            <a href={`#/product/${product.id}`} className="block">
              <div className="relative overflow-hidden">
                <img 
                    src={product.imageUrls[0]} 
                    alt={product.name} 
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {product.tag && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-xs px-2 py-1 rounded-full font-body">
                        {product.tag}
                    </span>
                )}
              </div>
            </a>
            <div className="p-4 flex flex-col flex-grow">
              <a href={`#/product/${product.id}`} className="font-semibold text-text-primary hover:text-accent transition-colors mb-2 flex-grow">
                {product.name}
              </a>
              <div className="flex items-center gap-2 my-2">
                 <StarRating rating={product.rating} size="sm" />
                 <span className="text-xs text-text-secondary">({product.reviewCount})</span>
              </div>
              <div className="flex justify-between items-center mt-auto pt-2">
                <p className="font-semibold text-accent text-lg">₹{product.price}</p>
                <a href={`#/product/${product.id}`} className="text-sm text-accent font-semibold hover:underline">
                    View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;