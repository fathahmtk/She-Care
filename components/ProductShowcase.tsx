import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import * as api from '../utils/api';
import ProductCard from './ProductCard';
import ReviewCard from './ReviewCard';
import { useSearch } from '../contexts/SearchContext';
import { useProducts } from '../contexts/ProductContext';
import SearchIcon from './icons/SearchIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';


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
  const { searchQuery, setSearchQuery } = useSearch();
  
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 4;

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
  
  useEffect(() => {
      setCurrentPage(1);
  }, [selectedCategory, selectedTag, searchQuery]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const tags = ['All', ...Array.from(new Set(products.map(p => p.tag)))];

  const filteredProducts = products
    .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
    .filter(product => selectedTag === 'All' || product.tag === selectedTag)
    .filter(product => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
    });
    
  // Pagination Logic
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const productSection = document.getElementById('products');
    if (productSection) {
      // Use a slight delay to allow the DOM to update before scrolling
      setTimeout(() => {
        productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <>
      <section id="products" className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">Our Products</h2>
          
          <div className="w-full overflow-x-auto pb-4 no-scrollbar mb-2">
              <div className="flex justify-start md:justify-center flex-nowrap gap-4">
                  {categories.map(category => (
                    <button key={category} onClick={() => setSelectedCategory(category)} className={`flex-shrink-0 px-6 py-2 font-body font-semibold rounded-full transition-all duration-300 border-2 ${selectedCategory === category ? 'bg-accent text-surface border-accent' : 'bg-transparent text-accent border-accent hover:bg-accent/10 transform hover:-translate-y-px'}`}>
                      {category}
                    </button>
                  ))}
              </div>
          </div>
          
          <div className="w-full overflow-x-auto pb-4 no-scrollbar mb-4">
              <div className="flex justify-start md:justify-center flex-nowrap gap-3">
                  {tags.map(tag => (
                    <button key={tag} onClick={() => setSelectedTag(tag)} className={`flex-shrink-0 px-4 py-1 text-sm font-body font-medium rounded-full transition-all duration-300 border ${selectedTag === tag ? 'bg-accent/20 text-accent border-accent/30' : 'bg-surface text-text-secondary border-border-color hover:border-accent/50 hover:text-accent transform hover:-translate-y-px'}`}>
                      {tag}
                    </button>
                  ))}
              </div>
          </div>

          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <input
                type="search"
                placeholder="Search within our products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border-color rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 text-base font-body text-text-primary placeholder:text-text-secondary"
                aria-label="Search for products"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-text-secondary" />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-20">
            {productsLoading ? (
                <>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                </>
            ) : currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-heading text-text-secondary">No products found</h3>
                    <p className="text-text-secondary mt-2">Try adjusting your search or category filters.</p>
                </div>
            )}
          </div>
          
          {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                  <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 font-body font-semibold rounded-md transition-all duration-300 border-2 bg-transparent text-accent border-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Go to previous page"
                  >
                      <ArrowLeftIcon className="w-4 h-4" />
                      <span>Previous</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-4 py-2 font-body font-semibold rounded-md transition-all duration-300 border-2 ${currentPage === number ? 'bg-accent text-surface border-accent' : 'bg-transparent text-accent border-accent hover:bg-accent/10'}`}
                          aria-label={`Go to page ${number}`}
                          aria-current={currentPage === number ? 'page' : undefined}
                      >
                          {number}
                      </button>
                  ))}
                  <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 font-body font-semibold rounded-md transition-all duration-300 border-2 bg-transparent text-accent border-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Go to next page"
                  >
                       <span>Next</span>
                       <ArrowRightIcon className="w-4 h-4" />
                  </button>
              </div>
          )}
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