import React, { useState, useEffect, forwardRef } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

const ImageWithFallback = forwardRef<HTMLImageElement, Props>(
  ({ src, alt, fallbackSrc = "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", className, ...rest }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      // Reset loading state when src changes
      setIsLoading(true);
      setHasError(false);
    }, [src]);
    
    const currentSrc = hasError ? fallbackSrc : (src as string);

    return (
      <div className="relative w-full h-full bg-border-color/20 overflow-hidden">
        {/* Blurred Placeholder */}
        <img
          src={currentSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 transition-opacity duration-300 ease-in-out ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Main Image */}
        <img
          ref={ref}
          src={currentSrc}
          alt={alt || ""}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`relative w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${className || ""}`}
          {...rest}
        />
      </div>
    );
  }
);
ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;