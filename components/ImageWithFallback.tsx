import React, { useState, useEffect, forwardRef } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** A default image URL to display if the primary `src` fails to load. */
  fallbackSrc?: string;
};

/**
 * An optimized `<img>` component that uses the `<picture>` element to serve modern image
 * formats like WebP when available, with a fallback to the original format. It also
 * supports native lazy-loading, displays a fallback on error, and prevents layout shift
 * by accepting width/height attributes.
 *
 * @param {string | null | undefined} src - The primary image source URL (e.g., .jpg, .png).
 * @param {string} alt - The alternative text for the image.
 * @param {string} [fallbackSrc] - The URL for the fallback image.
 * @param {string} [className] - Additional CSS classes.
 * @param {number} [width] - The intrinsic width of the image.
 * @param {number} [height] - The intrinsic height of the image.
 */
const ImageWithFallback = forwardRef<HTMLImageElement, Props>(
  ({ src, alt, fallbackSrc = "https://m.media-amazon.com/images/I/71YqDc-POJL.jpg", className, width, height, ...rest }, ref) => {
    const [hasError, setHasError] = useState(!src);
    const [isLoaded, setIsLoaded] = useState(false);

    // Reset component state if the image source changes
    useEffect(() => {
      setHasError(!src);
      setIsLoaded(false);
    }, [src]);

    const currentSrc = hasError ? fallbackSrc : src;

    // Generate a WebP source if the original src is a jpg/png, assuming the backend provides it.
    const webpSrc =
      !hasError && currentSrc && typeof currentSrc === 'string'
        ? currentSrc.replace(/\.(jpe?g|png)$/i, ".webp")
        : null;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      if (!hasError) {
        setHasError(true); // If primary src fails, trigger fallback
      }
      setIsLoaded(true); // Mark as loaded to remove placeholder, even on error
    };

    return (
      // This container provides the placeholder background color while the image loads.
      <div className="relative w-full h-full bg-border-color/20 overflow-hidden">
        <picture>
          {/* The browser will try this WebP source first. If it fails or is unsupported, it will fall back to the <img> src. */}
          {webpSrc && webpSrc !== currentSrc && (
            <source srcSet={webpSrc} type="image/webp" />
          )}

          {/* Fallback image */}
          <img
            ref={ref}
            src={typeof currentSrc === 'string' ? currentSrc : undefined}
            alt={alt || ""}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy" // Use native browser lazy-loading for performance.
            width={width} // Helps prevent Cumulative Layout Shift (CLS).
            height={height} // Helps prevent CLS.
            className={`relative w-full h-full object-cover transition-opacity duration-500 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            } ${className || ""}`}
            {...rest}
          />
        </picture>
      </div>
    );
  }
);

ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;
