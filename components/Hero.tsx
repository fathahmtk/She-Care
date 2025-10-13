import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-text-primary bg-cover bg-center" style={{ backgroundImage: "url('https://m.media-amazon.com/images/I/71YqDc-POJL.jpg')" }}>
      <div className="absolute inset-0 bg-background-start opacity-40"></div>
      <div className="relative z-10 px-6 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 tracking-wider leading-tight">
          shecarehub
        </h1>
        <p className="text-lg md:text-xl font-body font-light mb-8 max-w-2xl mx-auto">
          Experience instant menstrual pain relief with our smart thermal belt — designed for modern women.
        </p>
        <a 
          href="#products" 
          className="inline-block bg-accent text-background-start font-body font-semibold py-3 px-10 border-2 border-accent hover:bg-accent-hover transition-all duration-300 ease-in-out transform hover:scale-105 tracking-widest"
        >
          Shop Now – ₹699
        </a>
      </div>
    </section>
  );
};

export default Hero;