import React, { useState, useEffect, forwardRef } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** A default image URL to display if the primary `src` fails to load. */
  fallbackSrc?: string;
};

/**
 * An enhanced `<img>` component that displays a fallback image if the primary `src` fails to load.
 * It also features a progressive, blur-up loading effect for a better user experience.
 *
 * @param {string} src - The primary image source URL.
 * @param {string} alt - The alternative text for the image, crucial for accessibility.
 * @param {string} [fallbackSrc="..."] - The URL for the fallback image.
 * @param {string} [className] - Additional CSS classes to apply to the image.
 */
const ImageWithFallback = forwardRef<HTMLImageElement, Props>(
  ({ src, alt, fallbackSrc = "https://m.media-amazon.com/images/I/71YqDc-POJL.jpg", className, ...rest }, ref) => {
    // State to track if the primary image has failed to load.
    // Initialize to true if the src is initially falsy.
    const [hasError, setHasError] = useState(!src);
    // State to manage the loading visualization (e.g., blur effect).
    const [isLoading, setIsLoading] = useState(true);

    // Effect to reset the error and loading state whenever the `src` prop changes.
    useEffect(() => {
      setIsLoading(true);
      setHasError(!src); // If the new src is falsy, set error state immediately.
    }, [src]);
    
    // Determine the source to use: fallback if there's an error or no src, otherwise use the primary src.
    const currentSrc = hasError ? fallbackSrc : (src as string);

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      // This will only be triggered for non-falsy `src` values that fail to load.
      setIsLoading(false);
      setHasError(true);
    };

    return (
      // Container to manage the aspect ratio and hold both the placeholder and the main image.
      <div className="relative w-full h-full bg-border-color/20 overflow-hidden">
        {/* Blurred Placeholder: A low-res, blurred version of the image shown during loading. */}
        <img
          src={currentSrc}
          alt="" // Decorative, so alt text is empty.
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 transition-opacity duration-300 ease-in-out ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
          // We don't need load/error handlers here as they are on the main image.
        />
        {/* Main Image: The high-resolution image. */}
        <img
          ref={ref}
          src={currentSrc}
          alt={alt || ""}
          onLoad={handleLoad}
          onError={handleError}
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