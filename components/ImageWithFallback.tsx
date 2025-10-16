import React, { useState, useEffect, forwardRef } from "react";
// FIX: Removed redundant side-effect import for 'types.ts'.

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** A default image URL to display if the primary `src` fails to load. */
  fallbackSrc?: string;
};

/**
 * An enhanced `<img>` component that uses native browser lazy-loading.
 * It displays a fallback image if the primary `src` fails and features a smooth fade-in effect.
 *
 * @param {string | null | undefined} src - The primary image source URL.
 * @param {string} alt - The alternative text for the image.
 * @param {string} [fallbackSrc] - The URL for the fallback image.
 * @param {string} [className] - Additional CSS classes.
 */
const ImageWithFallback = forwardRef<HTMLImageElement, Props>(
  ({ src, alt, fallbackSrc = "https://m.media-amazon.com/images/I/71YqDc-POJL.jpg", className, ...rest }, ref) => {
    const [hasError, setHasError] = useState(!src);
    const [isLoaded, setIsLoaded] = useState(false);

    // Reset component state if the image source changes
    useEffect(() => {
      setHasError(!src);
      setIsLoaded(false);
    }, [src]);

    const currentSrc = hasError ? fallbackSrc : src;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      // If the primary src fails, set error to true to try the fallback
      if (!hasError) {
        setHasError(true);
      }
      // Mark as loaded even on error to hide the placeholder
      setIsLoaded(true);
    };

    return (
      // This container provides the placeholder background color.
      <div className="relative w-full h-full bg-border-color/20 overflow-hidden">
        <img
          ref={ref}
          src={currentSrc}
          alt={alt || ""}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy" // Use native browser lazy-loading
          className={`relative w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className || ""}`}
          {...rest}
        />
      </div>
    );
  }
);

ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;