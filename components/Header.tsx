import React, { useState, useEffect } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import Logo from './Logo';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWishlist } from '../contexts/WishlistContext';
import type { Product } from '../types';
import CartIcon from './icons/CartIcon';
import SearchIcon from './icons/SearchIcon';
import UserIcon from './icons/UserIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import MobileMenu from './MobileMenu';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import HeartIcon from './icons/HeartIcon';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = products.filter(
        product =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery)
      );
      setSearchResults(filtered);
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
                        <ul className="max-h-80 overflow-y-auto no-scrollbar">
                            {searchResults.map(product => (
                                <li key={product.id}>
                                    <a href={`#/product/${product.id}`} className="flex items-center p-3 hover:bg-accent/10 transition-colors duration-200">
                                        <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-4 flex-shrink-0" />
                                        <div className="flex-grow overflow-hidden">
                                            <p className="font-semibold text-text-primary text-sm truncate">{product.name}</p>
                                            <p className="text-accent font-semibold text-sm">₹{product.price}</p>
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
        
        <div className="flex items-center gap-1 sm:gap-2">
           {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>

          {/* Auth Section */}
           <div className="relative">
              {isAuthenticated && user ? (
                 <div className="flex items-center gap-4">
                    <a href="#/profile" className="hidden md:block text-sm text-text-secondary hover:text-accent transition-colors">Welcome, {user.name.split(' ')[0]}!</a>
                    <button onClick={logout} className="hidden md:block text-sm font-semibold text-text-primary hover:text-accent transition-colors duration-300">
                        Logout
                    </button>
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="md:hidden text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10" aria-label="Open profile menu" aria-expanded={isProfileMenuOpen}>
                      <UserIcon className="h-6 w-6"/>
                    </button>
                 </div>
              ) : (
                <>
                  <button onClick={onLoginClick} className="hidden md:block bg-accent text-surface font-body font-semibold py-2 px-5 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out text-sm rounded-md transform hover:scale-105">
                      Login
                  </button>
                  <button onClick={onLoginClick} className="md:hidden text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10" aria-label="Open login modal">
                      <UserIcon className="h-6 w-6"/>
                  </button>
                </>
              )}
               {isAuthenticated && isProfileMenuOpen && (
                 <div className="md:hidden absolute top-full right-0 mt-4 animate-fade-in z-50 bg-surface p-4 rounded-lg shadow-2xl border border-border-color w-48">
                    <div className="pb-2 mb-2 border-b border-border-color">
                      <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                    </div>
                    <a href="#/profile" onClick={() => setIsProfileMenuOpen(false)} className="block w-full text-left text-sm text-text-primary hover:text-accent transition-colors py-1">
                        My Profile
                    </a>
                    <button onClick={() => { logout(); setIsProfileMenuOpen(false); }} className="w-full text-left text-sm text-text-primary hover:text-accent transition-colors py-1">
                      Logout
                    </button>
                 </div>
               )}
          </div>

          {/* Wishlist Icon */}
          <a
            href="#/wishlist"
            className="relative text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10"
            aria-label={`Open wishlist with ${wishlistCount} items`}
          >
            <HeartIcon className="h-6 w-6"/>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-accent text-white dark:text-gray-900 text-xs rounded-full">
                {wishlistCount}
              </span>
            )}
          </a>

          {/* Cart Icon */}
          <a
            href="#/cart"
            className="relative text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110 p-2 rounded-full hover:bg-accent/10"
            aria-label={`Open cart with ${totalQuantity} items`}
          >
            <CartIcon className="h-6 w-6"/>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-accent text-white dark:text-gray-900 text-xs rounded-full">
                {totalQuantity}
              </span>
            )}
          </a>
        
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
    <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Header;