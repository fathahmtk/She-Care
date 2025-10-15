import React, { useState, useEffect, useCallback, useRef } from 'react';
// FIX: Import 'Testimonial' type and 'types.ts' for global JSX namespace augmentation.
import type { Testimonial } from '../types';
import '../types';
import * as api from '../utils/api';
import StarIcon from './icons/StarIcon';

const TestimonialCarousel: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

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
    if (loading) return;
    const timer = setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(timer);
  }, [nextTestimonial, loading]);

  // Smooth scroll effect
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const scrollLeft = currentIndex * slider.offsetWidth;
      slider.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  return (
    <section id="testimonials" className="py-24 bg-surface/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-accent mb-12">What Our Clients Say</h2>
        
        <div className="relative max-w-3xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-72 md:h-60 px-4 md:px-10 animate-pulse">
                <div className="h-5 bg-border-color/20 rounded w-full max-w-md mb-4"></div>
                <div className="h-5 bg-border-color/20 rounded w-full max-w-sm mb-6"></div>
                <div className="h-4 bg-border-color/20 rounded w-1/4"></div>
            </div>
          ) : (
            <>
              <div ref={sliderRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 snap-center">
                    <div className="flex flex-col items-center justify-center h-72 md:h-60 px-4 md:px-10">
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

              <button onClick={prevTestimonial} className="absolute top-1/2 left-0 md:-left-12 transform -translate-y-1/2 p-2 rounded-full bg-surface shadow-md hover:bg-accent hover:text-background-start transition-all duration-300 text-text-primary z-10 hover:scale-110" aria-label="Previous testimonial">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextTestimonial} className="absolute top-1/2 right-0 md:-right-12 transform -translate-y-1/2 p-2 rounded-full bg-surface shadow-md hover:bg-accent hover:text-background-start transition-all duration-300 text-text-primary z-10 hover:scale-110" aria-label="Next testimonial">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>

        {!loading && (
            <div className="flex justify-center items-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
                <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-accent scale-110' : 'bg-border-color hover:bg-accent/50 transform hover:scale-125'}`} aria-label={`Go to testimonial ${index + 1}`}></button>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialCarousel;