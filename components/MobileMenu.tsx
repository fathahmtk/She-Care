import React, { useEffect } from 'react';
// FIX: Add a side-effect import for the global types file.
// This ensures that the JSX namespace augmentations are loaded and applied
// before any JSX is rendered within this component tree.
import '../types';
import { useSearch } from '../contexts/SearchContext';
import SearchIcon from './icons/SearchIcon';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { searchQuery, setSearchQuery } = useSearch();

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
  
  const navLinks = [
    { name: 'Product', href: '/#products' },
    { name: 'Our Story', href: '/#our-story' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Subscribe', href: '/#contact' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background-start shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="p-6 pt-24 flex flex-col h-full">
          <h2 id="mobile-menu-title" className="sr-only">Main Menu</h2>

          {/* Search Bar */}
          <div 
            className={`relative mb-8 transition-all duration-300 ease-out transform ${
              isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
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
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`p-2 text-2xl font-heading text-text-primary transition-all duration-300 ease-out hover:text-accent transform ${
                  isOpen
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: `${150 + index * 75}ms` }}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;