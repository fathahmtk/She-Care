import React, { useState, useEffect } from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import { Product } from '../types';
import Logo from './Logo';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWishlist } from '../contexts/WishlistContext';
import CartIcon from './icons/CartIcon';
import SearchIcon from './icons/SearchIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import MobileMenu from './MobileMenu';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import HeartIcon from './icons/HeartIcon';

interface HeaderProps {
  onLoginClick: () => void;
}

const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query.trim()) {
        return <>{text}</>;
    }
    const safeQuery = escapeRegExp(query.trim());
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.filter(part => part).map((part, i) =>
                regex.test(part) ? (
                    <span key={i} className="font-semibold bg-accent/20 rounded-sm">{part}</span>
                ) : (
                    part
                )
            )}
        </>
    );
};

const getDescriptionSnippet = (description: string, query: string): string => {
    if (!query.trim()) {
        return description.length > 80 ? description.substring(0, 80) + '...' : description;
    }

    const lowerCaseDesc = description.toLowerCase();
    const lowerCaseQuery = query.toLowerCase().trim();
    const index = lowerCaseDesc.indexOf(lowerCaseQuery);
    const maxLength = 80;

    if (index === -1) {
        return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
    }

    const start = Math.max(0, index - Math.floor((maxLength - lowerCaseQuery.length) / 2));
    const end = Math.min(description.length, start + maxLength);
    
    let snippet = description.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < description.length) snippet = snippet + '...';
    
    return snippet;
};


const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { searchQuery, setSearchQuery } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();
  const { products } = useProducts();
  const { theme, toggleTheme } = useTheme();
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
        const lowerCaseQuery = searchQuery.toLowerCase().trim();

        const scoredProducts = products.map(product => {
            let score = 0;
            const lowerCaseName = product.name.toLowerCase();
            const lowerCaseDesc = product.description.toLowerCase();

            // Higher score for matches in name
            if (lowerCaseName.includes(lowerCaseQuery)) {
                score += 30;
                if (lowerCaseName.startsWith(lowerCaseQuery)) {
                    score += 20; // Bonus for starting with query
                }
            }
            
            // Lower score for matches in description
            if (lowerCaseDesc.includes(lowerCaseQuery)) {
                score += 10;
            }

            // Simple fuzzy match for name (sequential characters for typos)
            let patternIndex = 0;
            for (let i = 0; i < lowerCaseName.length && patternIndex < lowerCaseQuery.length; i++) {
                if (lowerCaseName[i] === lowerCaseQuery[patternIndex]) {
                    patternIndex++;
                }
            }
            score += patternIndex;

            return { product, score };
        })
        .filter(({ score }) => score > 5) // Use a threshold to avoid weak matches
        .sort((a, b) => b.score - a.score);
        
        setSearchResults(scoredProducts.map(p => p.product));
        setIsSearchDropdownVisible(true);

    } else {
        setSearchResults([]);
        setIsSearchDropdownVisible(false);
    }
  }, [searchQuery, products]);

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setIsSearchDropdownVisible(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding the dropdown to allow click events on its items
    setTimeout(() => {
      setIsSearchDropdownVisible(false);
    }, 200);
  };
  
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background-start/80 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        
        <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center space-x-8">
              <a href="/#products" className="relative text-text-primary font-body tracking-wider group transition-colors duration-300 hover:text-accent pb-1">
                Product
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
              </a>
              <a href="/#our-story" className="relative text-text-primary font-body tracking-wider group transition-colors duration-300 hover:text-accent pb-1">
                Our Story
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
              </a>
              <a href="/#testimonials" className="relative text-text-primary font-body tracking-wider group transition-colors duration-300 hover:text-accent pb-1">
                Testimonials
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
              </a>
              <a href="/#contact" className="relative text-text-primary font-body tracking-wider group transition-colors duration-300 hover:text-accent pb-1">
                Subscribe
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
              </a>
            </nav>
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="bg-surface/50 border border-border-color rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 w-48 lg:w-64 text-sm font-body text-text-primary placeholder:text-text-secondary"
                aria-label="Search for products"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-text-secondary" />
              </div>

              {isSearchDropdownVisible && (
                <div className="absolute top-full mt-2 w-full lg:w-96 bg-surface rounded-lg shadow-2xl border border-border-color z-50 overflow-hidden animate-fade-in">
                    {searchResults.length > 0 ? (
                        <ul role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto no-scrollbar">
                            {searchResults.map(product => (
                                <li key={product.id} role="presentation">
                                    <a href={`#/product/${product.id}`} role="option" className="flex items-center p-3 hover:bg-accent/10 transition-colors duration-200">
                                        <img src={product.imageUrls[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
                                        <div className="flex-grow overflow-hidden">
                                            <p className="font-semibold text-text-primary text-sm truncate">
                                                <Highlight text={product.name} query={searchQuery} />
                                            </p>
                                             <p className="text-text-secondary text-xs truncate mt-1">
                                                <Highlight text={getDescriptionSnippet(product.description, searchQuery)} query={searchQuery} />
                                            </p>
                                            <p className="text-accent font-semibold text-sm mt-1">₹{product.price}</p>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-text-secondary text-sm text-center">No products found.</p>
                    )}
                </div>
              )}
            </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
           {/* Theme Toggle - Desktop Only */}
          <button
            onClick={toggleTheme}
            className="hidden md:block text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>

          {/* Auth Section - Desktop Only */}
           <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && user ? (
                 <>
                    <a href="#/profile" className="text-sm text-text-secondary hover:text-accent transition-colors" aria-label={`View profile for ${user.name}`}>Welcome, {user.name.split(' ')[0]}!</a>
                    <button onClick={logout} className="text-sm font-semibold text-text-primary hover:text-accent transition-colors duration-300">
                        Logout
                    </button>
                 </>
              ) : (
                  <button onClick={onLoginClick} className="bg-accent text-surface font-body font-semibold py-2 px-5 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out text-sm rounded-md transform hover:scale-105">
                      Login
                  </button>
              )}
          </div>

          {/* Wishlist Icon - Desktop Only */}
          <a
            href="#/wishlist"
            className="relative hidden md:block text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10"
            aria-label={`Open wishlist with ${wishlistCount} items`}
          >
            <HeartIcon className="h-6 w-6"/>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-accent text-white dark:text-gray-900 text-xs rounded-full" aria-hidden="true">
                {wishlistCount}
              </span>
            )}
          </a>

          {/* Cart Icon - Always Visible */}
          <a
            href="#/cart"
            className="relative text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10"
            aria-label={`Open cart with ${totalQuantity} items`}
          >
            <CartIcon className="h-6 w-6"/>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-accent text-white dark:text-gray-900 text-xs rounded-full" aria-hidden="true">
                {totalQuantity}
              </span>
            )}
          </a>
        
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
    <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        onLoginClick={onLoginClick}
    />
    </>
  );
};

export default Header;