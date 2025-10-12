import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TESTIMONIALS } from '../constants';
import StarIcon from './icons/StarIcon';

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
  }, []);

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Autoplay effect
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(timer);
  }, [nextTestimonial]);

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
          {/* Slider Viewport using scroll */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          >
            {TESTIMONIALS.map((testimonial) => (
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

          {/* Navigation Arrows */}
          <button 
            onClick={prevTestimonial} 
            className="absolute top-1/2 left-0 md:-left-12 transform -translate-y-1/2 p-2 rounded-full bg-surface shadow-md hover:bg-accent hover:text-background-start transition-colors text-text-primary z-10"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={nextTestimonial} 
            className="absolute top-1/2 right-0 md:-right-12 transform -translate-y-1/2 p-2 rounded-full bg-surface shadow-md hover:bg-accent hover:text-background-start transition-colors text-text-primary z-10"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center items-center mt-8 space-x-2">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-accent' : 'bg-border-color hover:bg-accent/50'}`}
              aria-label={`Go to testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;