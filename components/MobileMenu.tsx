import React, { useEffect } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWishlist } from '../contexts/WishlistContext';
import SearchIcon from './icons/SearchIcon';
import CloseIcon from './icons/CloseIcon';
import HeartIcon from './icons/HeartIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import UserIcon from './icons/UserIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onLoginClick }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleLinkClick = (hash: string) => {
    window.location.hash = hash;
    onClose();
  };
  
  const handleLoginClick = () => {
    onClose();
    onLoginClick();
  };

  const handleLogoutClick = () => {
    logout();
    onClose();
  };
  
  const navLinks = [
    { name: 'Product', href: '/#products' },
    { name: 'Our Story', href: '/#our-story' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Subscribe', href: '/#contact' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background-start shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                 <h2 id="mobile-menu-title" className="sr-only">Main Menu</h2>
                 <button onClick={onClose} className="absolute top-4 right-4 p-2 text-text-secondary hover:text-accent transition-colors">
                    <span className="sr-only">Close menu</span>
                    <CloseIcon className="w-6 h-6" />
                 </button>
            </div>
          
            <div className="flex-grow overflow-y-auto no-scrollbar pt-12">
                {/* User Profile / Login Section */}
                <div className="mb-8 p-4 bg-surface/50 rounded-lg">
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-accent"/>
                            </div>
                            <div>
                                <p className="font-semibold text-text-primary">{user.name}</p>
                                <a href="#/profile" onClick={() => handleLinkClick('#/profile')} className="text-sm text-accent hover:underline">View Profile</a>
                            </div>
                        </div>
                    ) : (
                        <button onClick={handleLoginClick} className="w-full bg-accent text-surface font-semibold py-3 px-5 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out rounded-md flex justify-between items-center">
                            <span>Login / Sign Up</span>
                            <ArrowRightIcon className="w-5 h-5"/>
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface/50 border border-border-color rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 text-base font-body text-text-primary placeholder:text-text-secondary"
                        aria-label="Search for products"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-text-secondary" />
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-2 border-t border-b border-border-color py-4">
                    {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                        className="p-3 text-xl font-heading text-text-primary transition-colors duration-300 ease-out hover:text-accent hover:bg-accent/10 rounded-md"
                    >
                        {link.name}
                    </a>
                    ))}
                     <a href="#/wishlist" onClick={() => handleLinkClick('#/wishlist')} className="flex justify-between items-center p-3 text-xl font-heading text-text-primary transition-colors duration-300 ease-out hover:text-accent hover:bg-accent/10 rounded-md" aria-label={`View wishlist, ${wishlistCount} items`}>
                        <span className="flex items-center gap-4">
                            <HeartIcon className="w-6 h-6"/>
                            <span>Wishlist</span>
                        </span>
                        {wishlistCount > 0 && <span className="flex items-center justify-center h-7 w-7 bg-accent text-white text-sm rounded-full" aria-hidden="true">{wishlistCount}</span>}
                    </a>
                </nav>

                {isAuthenticated && (
                    <div className="mt-6">
                        <button onClick={handleLogoutClick} className="w-full text-left p-3 text-lg text-text-secondary hover:text-accent hover:bg-accent/10 rounded-md transition-colors">
                            Logout
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mt-auto pt-6 flex justify-between items-center border-t border-border-color">
                <span className="text-text-secondary text-sm">Switch Theme</span>
                <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-full bg-surface/50 text-text-primary hover:text-accent hover:bg-accent/10 transition-colors"
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    aria-pressed={theme === 'dark'}
                >
                    {theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}
                </button>
            </div>

        </div>
      </div>
    </>
  );
};

export default MobileMenu;