import { useState, useEffect, RefObject } from 'react';

interface ObserverOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  { threshold = 0.1, triggerOnce = true }: ObserverOptions = {}
): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const node = elementRef?.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else {
          if (!triggerOnce) {
            setIntersecting(false);
          }
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, triggerOnce]);

  return isIntersecting;
};