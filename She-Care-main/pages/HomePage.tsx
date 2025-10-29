import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import Cta from '../components/Cta';
import AnimatedSection from '../components/AnimatedSection';
import TestimonialCarousel from '../components/TestimonialCarousel';
import BrandStory from '../components/BrandStory';
import WhyChooseUs from '../components/WhyChooseUs';
import FaqSection from '../components/FaqSection';
import BlogSection from '../components/BlogSection';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <AnimatedSection>
        <ProductShowcase />
      </AnimatedSection>
      <AnimatedSection>
        <TestimonialCarousel />
      </AnimatedSection>
      <AnimatedSection>
        <BrandStory />
      </AnimatedSection>
      <AnimatedSection>
        <WhyChooseUs />
      </AnimatedSection>
      <AnimatedSection>
        <FaqSection />
      </AnimatedSection>
      <AnimatedSection>
        <BlogSection />
      </AnimatedSection>
      <AnimatedSection>
        <Cta />
      </AnimatedSection>
    </>
  );
};

export default HomePage;