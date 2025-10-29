import React, { useState } from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.

const Cta: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    // A simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsSubmitted(false);

    if (!email) {
      setError('Email address is required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate network delay & save to localStorage
    setTimeout(() => {
      try {
        const subscribersKey = 'shecarehub-newsletter-subscribers';
        const existingSubscribersRaw = localStorage.getItem(subscribersKey);
        let subscribers: string[] = existingSubscribersRaw ? JSON.parse(existingSubscribersRaw) : [];

        if (subscribers.includes(email)) {
          setError('This email is already subscribed.');
          setIsLoading(false);
          return;
        }

        subscribers.push(email);
        localStorage.setItem(subscribersKey, JSON.stringify(subscribers));
        
        setIsLoading(false);
        setIsSubmitted(true);
        console.log('Successfully subscribed and stored:', email);
        setEmail('');

        // Hide success message after a few seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 4000);
      } catch (err) {
        console.error('Failed to save email to localStorage', err);
        setError('Could not process your subscription. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">Join Our Style Community</h2>
        <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for exclusive offers, new collection alerts, and styling tips inspired by the elegance of Kerala.
        </p>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto" noValidate>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow w-full">
              <input 
                type="email" 
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(''); // Clear error when user starts typing
                }}
                placeholder="Enter your email" 
                className={`w-full px-4 py-3 bg-surface border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-border-color focus:border-accent focus:ring-accent'}`}
                required
                aria-invalid={!!error}
                aria-describedby="email-error"
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="bg-accent text-background-start font-body font-semibold py-3 px-8 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>SUBSCRIBING...</span>
                </div>
              ) : (
                'SUBSCRIBE'
              )}
            </button>
          </div>
          {error && !isLoading && (
            <div className="flex items-center text-red-500 text-sm mt-2 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p id="email-error">{error}</p>
            </div>
          )}
          {isSubmitted && <p className="text-emerald-600 text-sm mt-2 text-left">Thank you for subscribing!</p>}
        </form>
      </div>
    </section>
  );
};

export default Cta;