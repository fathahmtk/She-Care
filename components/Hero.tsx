import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-text-primary bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/7262911/pexels-photo-7262911.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')" }}>
      <div className="absolute inset-0 bg-background-start opacity-40"></div>
      <div className="relative z-10 px-6 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 tracking-wider leading-tight">
          SHE CARE
        </h1>
        <p className="text-lg md:text-xl font-body font-light mb-8 max-w-2xl mx-auto">
          Experience instant menstrual pain relief with our smart thermal belt — designed for modern women.
        </p>
        <a 
          href="#products" 
          className="inline-block bg-accent text-background-start font-body font-semibold py-3 px-10 border-2 border-accent hover:bg-transparent hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-105 tracking-widest"
        >
          Shop Now – ₹699
        </a>
      </div>
    </section>
  );
};

export default Hero;