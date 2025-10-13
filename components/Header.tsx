import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { useCart } from '../contexts/CartContext';
import CartDisplay from './CartDisplay';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';

const CartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background-start/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        
        <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center space-x-8">
              <a href="#products" className="relative text-text-primary font-body tracking-wider group transition-colors duration-300 hover:text-accent pb-1">
                Product
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
              </a>
              <a href="#testimonials" className="relative text-text-primary font-body tracking-wider group transition-colors duration-300 hover:text-accent pb-1">
                Testimonials
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
              </a>
              <a href="#contact" className="relative text-text-primary font-body tracking-wider group transition-colors duration-300 hover:text-accent pb-1">
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
                className="bg-surface/50 border border-border-color rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 w-48 lg:w-64 text-sm font-body"
                aria-label="Search for products"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-text-secondary" />
              </div>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Auth Section */}
           <div className="relative">
              {isAuthenticated && user ? (
                 <div className="flex items-center gap-4">
                    <span className="hidden md:block text-sm text-text-secondary">Welcome, {user.name.split(' ')[0]}!</span>
                    <button onClick={logout} className="hidden md:block text-sm font-semibold text-text-primary hover:text-accent transition-colors duration-300">
                        Logout
                    </button>
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="md:hidden text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110" aria-label="Open profile menu" aria-expanded={isProfileMenuOpen}>
                      <UserIcon />
                    </button>
                 </div>
              ) : (
                <>
                  <button onClick={onLoginClick} className="hidden md:block bg-accent text-background-start font-body font-semibold py-2 px-5 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out text-sm rounded-md transform hover:scale-105">
                      Login
                  </button>
                  <button onClick={onLoginClick} className="md:hidden text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110" aria-label="Open login modal">
                      <UserIcon />
                  </button>
                </>
              )}
               {isAuthenticated && isProfileMenuOpen && (
                 <div className="md:hidden absolute top-full right-0 mt-4 animate-fade-in z-50 bg-surface p-4 rounded-lg shadow-2xl border border-border-color w-48">
                    <div className="pb-2 mb-2 border-b border-border-color">
                      <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                    </div>
                    <button onClick={() => { logout(); setIsProfileMenuOpen(false); }} className="w-full text-left text-sm text-text-primary hover:text-accent transition-colors">
                      Logout
                    </button>
                 </div>
               )}
          </div>

          {/* Cart Icon and Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110"
              aria-label={`Open cart with ${cartItems.length} items`}
              aria-expanded={isCartOpen}
            >
              <CartIcon />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-accent text-white text-xs rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            {isCartOpen && (
              <div className="absolute top-full right-0 mt-4 animate-fade-in z-50">
                <CartDisplay />
              </div>
            )}
          </div>
        
          <button className="md:hidden text-text-primary hover:text-accent transition-all duration-300 transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;