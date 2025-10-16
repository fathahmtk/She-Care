import React, { useState, useEffect, useRef } from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import { useAuth } from '../contexts/AuthContext';
import CloseIcon from './icons/CloseIcon';
import EmailIcon from './icons/EmailIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import InfoIcon from './icons/InfoIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'enter-email' | 'enter-otp';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('enter-email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [mockOtp, setMockOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (step === 'enter-otp') {
      otpInputsRef.current[0]?.focus();
    }
  }, [step]);
  
  if (!isOpen) return null;

  const resetState = () => {
    setStep('enter-email');
    setEmail('');
    setOtp(new Array(6).fill(''));
    setMockOtp('');
    setIsLoading(false);
    setError('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      const generatedOtp = '123456'; // For simulation purposes
      setMockOtp(generatedOtp);
      setIsLoading(false);
      setStep('enter-otp');
    }, 1000);
  };
  
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate OTP verification
    setTimeout(() => {
      if (enteredOtp === mockOtp) {
        // In a real app, you might get user details from the API
        login(email, 'Valued Customer');
        handleClose();
      } else {
        setError('The code you entered is incorrect. Please try again.');
        setIsLoading(false);
        setOtp(new Array(6).fill(''));
        otpInputsRef.current[0]?.focus();
      }
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-surface rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-border-color overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-text-secondary hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-90"
          aria-label="Close authentication modal"
        >
          <CloseIcon />
        </button>

        <div className={`transition-all duration-300 ease-in-out ${step === 'enter-otp' ? '-translate-x-full opacity-0 absolute' : 'translate-x-0 opacity-100'}`}>
          <h2 className="text-3xl font-heading text-text-primary mb-2 text-center">Login or Sign Up</h2>
          <p className="text-text-secondary mb-8 text-center text-sm">Enter your email to receive a secure code.</p>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="login-email" className="sr-only">Email Address</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EmailIcon className="h-5 w-5 text-text-secondary" />
              </div>
              <input 
                id="login-email" 
                name="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                autoComplete="email" 
                required 
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-surface border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all" 
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-accent text-surface py-3 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${step === 'enter-email' ? 'translate-x-full opacity-0 absolute' : 'translate-x-0 opacity-100'}`}>
            <button onClick={() => setStep('enter-email')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent mb-4">
                <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            <h2 className="text-3xl font-heading text-text-primary mb-2 text-center">Verify Code</h2>
            <p className="text-text-secondary mb-6 text-center text-sm">Enter the code sent to <br/><span className="font-semibold text-text-primary">{email}</span></p>
            
            <div className="bg-accent/10 text-accent border border-accent/20 rounded-lg p-3 flex items-start gap-3 text-sm mb-6">
              <InfoIcon className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                  <span className="font-semibold">For this simulation, your code is:</span>
                  <p className="font-mono text-lg tracking-widest">{mockOtp}</p>
              </div>
            </div>

            <form onSubmit={handleOtpSubmit}>
                <div className="flex justify-center gap-2 mb-4">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      ref={el => { otpInputsRef.current[index] = el }}
                      type="text"
                      maxLength={1}
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      className="w-12 h-14 text-center text-2xl font-semibold bg-surface border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                <button type="submit" disabled={isLoading} className="mt-6 w-full bg-accent text-surface py-3 rounded-lg transition-all duration-300 font-body font-semibold tracking-wider text-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </button>
            </form>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;