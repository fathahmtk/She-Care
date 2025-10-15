import React, { useState, useEffect } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import type { Review } from '../types';
import * as api from '../utils/api';
import ProductCard from './ProductCard';
import ReviewCard from './ReviewCard';
import { useSearch } from '../contexts/SearchContext';
import { useProducts } from '../contexts/ProductContext';

const ProductCardSkeleton: React.FC = () => (
    <div className="bg-surface rounded-2xl shadow-lg p-6 md:p-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="w-full aspect-square bg-border-color/20 rounded-lg"></div>
            <div>
                <div className="h-8 bg-border-color/20 rounded w-3/4 mb-4"></div>
                <div className="h-5 bg-border-color/20 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-border-color/20 rounded"></div>
                    <div className="h-4 bg-border-color/20 rounded"></div>
                    <div className="h-4 bg-border-color/20 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    </div>
);

const ProductShowcase: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const fetchedReviews = await api.getReviews();
            setReviews(fetchedReviews);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setReviewsLoading(false);
        }
    }
    fetchReviews();
  }, []);

  // Dynamically get unique categories from products and add "All"
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  // Dynamically get unique tags from products and add "All"
  const tags = ['All', ...Array.from(new Set(products.map(p => p.tag)))];

  // Filter products based on the selected category, tag, and search query
  const filteredProducts = products
    .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
    .filter(product => selectedTag === 'All' || product.tag === selectedTag)
    .filter(product => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
    });

  return (
    <>
      <section id="products" className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">Our Products</h2>
          
          <div className="flex justify-center flex-wrap gap-4 mb-6">
            {categories.map(category => (
              <button key={category} onClick={() => setSelectedCategory(category)} className={`px-6 py-2 font-body font-semibold rounded-full transition-all duration-300 border-2 ${selectedCategory === category ? 'bg-accent text-surface border-accent' : 'bg-transparent text-accent border-accent hover:bg-accent/10 transform hover:-translate-y-px'}`}>
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex justify-center flex-wrap gap-3 mb-12">
            {tags.map(tag => (
              <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-4 py-1 text-sm font-body font-medium rounded-full transition-all duration-300 border ${selectedTag === tag ? 'bg-accent/20 text-accent border-accent/30' : 'bg-surface text-text-secondary border-border-color hover:border-accent/50 hover:text-accent transform hover:-translate-y-px'}`}>
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-20">
            {productsLoading ? (
                <>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                </>
            ) : filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-heading text-text-secondary">No products found</h3>
                    <p className="text-text-secondary mt-2">Try adjusting your search or category filters.</p>
                </div>
            )}
          </div>
        </div>
      </section>

      <section id="reviews" className="pb-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">From Our Community</h2>
          <p className="text-text-secondary mb-12 max-w-3xl mx-auto">
            Real stories from real customers. See how shecarehub.com is making a difference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-surface border border-border-color rounded-lg p-6 animate-pulse">
                        <div className="h-5 bg-border-color/20 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-border-color/20 rounded w-1/2 mb-5"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-border-color/20 rounded"></div>
                            <div className="h-3 bg-border-color/20 rounded"></div>
                            <div className="h-3 bg-border-color/20 rounded w-5/6"></div>
                        </div>
                    </div>
                ))
            ) : (
                reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductShowcase;