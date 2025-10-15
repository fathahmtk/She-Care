import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../types';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import Cta from '../components/Cta';
import AnimatedSection from '../components/AnimatedSection';
import TestimonialCarousel from '../components/TestimonialCarousel';
import ShadeFinder from '../components/ShadeFinder';
import BrandStory from '../components/BrandStory';
import WhyChooseUs from '../components/WhyChooseUs';
import VirtualMirror from '../components/VirtualMirror';
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
        <VirtualMirror />
      </AnimatedSection>
      <AnimatedSection>
        <BlogSection />
      </AnimatedSection>
      <AnimatedSection>
        <ShadeFinder />
      </AnimatedSection>
      <AnimatedSection>
        <Cta />
      </AnimatedSection>
    </>
  );
};

export default HomePage;