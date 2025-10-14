import React from 'react';

const Logo: React.FC = () => {
  return (
    <a href="#/" aria-label="SheCareHub.com Home" className="inline-block transition-transform duration-300 ease-in-out transform hover:scale-105">
      <img
        src="/logo.png"
        alt="SheCareHub.com - Premium Women's Wellness & Beauty"
        className="h-10 w-auto dark:brightness-0 dark:invert"
      />
    </a>
  );
};

export default Logo;