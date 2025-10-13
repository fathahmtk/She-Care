import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView);
  const { login } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setView(initialView);
  }, [initialView]);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'Jane Doe'); // Mock login
    onClose();
    resetForm();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, name); // Mock register and login
    onClose();
    resetForm();
  };

  const resetForm = () => {
      setName('');
      setEmail('');
      setPassword('');
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-surface rounded-lg shadow-2xl p-8 w-full max-w-md relative border border-border-color"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-text-secondary hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-90"
          aria-label="Close authentication modal"
        >
          <CloseIcon />
        </button>

        <div className="flex border-b border-border-color mb-6">
          <button 
            onClick={() => setView('login')}
            className={`flex-1 py-3 font-body font-semibold tracking-wider transition-colors duration-300 ${view === 'login' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => setView('register')}
            className={`flex-1 py-3 font-body font-semibold tracking-wider transition-colors duration-300 ${view === 'register' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'}`}
          >
            SIGN UP
          </button>
        </div>

        {view === 'login' ? (
          <div>
            <h2 id="auth-modal-title" className="text-3xl font-heading text-text-primary mb-6 text-center">Welcome Back</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                <input id="login-email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className="w-full px-4 py-3 bg-surface border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                <input id="login-password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className="w-full px-4 py-3 bg-surface border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
              </div>
              <button type="submit" className="w-full bg-accent text-surface py-3 rounded-md transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-accent-hover">
                Login
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2 id="auth-modal-title" className="text-3xl font-heading text-text-primary mb-6 text-center">Create Account</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                <input id="register-name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required className="w-full px-4 py-3 bg-surface border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
              </div>
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                <input id="register-email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className="w-full px-4 py-3 bg-surface border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                <input id="register-password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required className="w-full px-4 py-3 bg-surface border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
              </div>
              <button type="submit" className="w-full bg-accent text-surface py-3 rounded-md transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-accent-hover">
                Create Account
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;