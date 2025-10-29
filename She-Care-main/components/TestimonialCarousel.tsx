import React, { useState, useEffect, useCallback } from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import { Testimonial } from '../types';
import * as api from '../utils/api';
import StarIcon from './icons/StarIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

const TestimonialCarousel: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const data = await api.getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      setAnnouncement(`Showing testimonial ${currentIndex + 1} of ${testimonials.length} from ${testimonials[currentIndex].author}`);
    }
  }, [currentIndex, testimonials]);

  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Autoplay effect
  useEffect(() => {
    if (loading || testimonials.length <= 1) return;
    const timer = setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(timer);
  }, [nextTestimonial, loading, testimonials.length]);

  return (
    <section id="testimonials" className="py-24 bg-surface/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-accent mb-12">What Our Clients Say</h2>
        
        <div className="relative max-w-3xl mx-auto" role="region" aria-roledescription="carousel" aria-label="Customer testimonials">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-72 md:h-60 px-4 md:px-10 animate-pulse">
                <div className="h-5 bg-border-color/20 rounded w-full max-w-md mb-4"></div>
                <div className="h-5 bg-border-color/20 rounded w-full max-w-sm mb-6"></div>
                <div className="h-4 bg-border-color/20 rounded w-1/4"></div>
            </div>
          ) : (
            <>
              <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
              <div className="relative h-72 md:h-60 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${testimonials.length}`}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentIndex ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95 pointer-events-none'}`}
                    aria-hidden={index !== currentIndex}
                  >
                    <div className="flex flex-col items-center justify-center h-full px-4 md:px-10">
                      <p className="text-lg md:text-xl italic text-text-primary mb-6">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < testimonial.rating} />
                        ))}
                      </div>
                      <h4 className="text-md font-semibold text-accent tracking-wider">
                        {testimonial.author}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {testimonials.length > 1 && (
                  <>
                    <button 
                        onClick={prevTestimonial} 
                        className="absolute top-1/2 left-0 md:-left-10 transform -translate-y-1/2 w-14 h-14 rounded-full bg-surface border-2 border-border-color shadow-xl text-text-primary transition-all duration-300 ease-in-out hover:bg-accent hover:text-surface hover:border-accent hover:scale-110 z-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface/50 focus:ring-accent"
                        aria-label="Previous testimonial"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextTestimonial} 
                        className="absolute top-1/2 right-0 md:-right-10 transform -translate-y-1/2 w-14 h-14 rounded-full bg-surface border-2 border-border-color shadow-xl text-text-primary transition-all duration-300 ease-in-out hover:bg-accent hover:text-surface hover:border-accent hover:scale-110 z-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface/50 focus:ring-accent"
                        aria-label="Next testimonial"
                    >
                        <ArrowRightIcon className="w-6 h-6" />
                    </button>
                  </>
              )}
            </>
          )}
        </div>

        {!loading && testimonials.length > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
                <button 
                    key={index} 
                    onClick={() => setCurrentIndex(index)} 
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-accent scale-110' : 'bg-border-color hover:bg-accent/50 transform hover:scale-125'}`} 
                    aria-label={`Go to testimonial ${index + 1}`}
                ></button>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialCarousel;