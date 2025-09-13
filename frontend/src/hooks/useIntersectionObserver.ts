import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
  delay?: number;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | undefined;
}

/**
 * Custom hook for Intersection Observer API
 * Provides lazy loading and visibility detection
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    delay = 0
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>();
  const ref = useRef<Element>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [intersectionEntry] = entries;
      
      if (delay > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setEntry(intersectionEntry);
          setIsIntersecting(intersectionEntry.isIntersecting);
          
          // Freeze observer if element becomes visible and freezeOnceVisible is true
          if (intersectionEntry.isIntersecting && freezeOnceVisible && observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
        }, delay);
      } else {
        setEntry(intersectionEntry);
        setIsIntersecting(intersectionEntry.isIntersecting);
        
        // Freeze observer if element becomes visible and freezeOnceVisible is true
        if (intersectionEntry.isIntersecting && freezeOnceVisible && observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      }
    },
    [delay, freezeOnceVisible]
  );

  useEffect(() => {
    const element = ref.current;
    
    if (!element) return;

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      root,
      rootMargin
    });

    // Start observing
    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [threshold, root, rootMargin, handleIntersection]);

  return { ref, isIntersecting, entry };
}

/**
 * Hook for lazy loading images with Intersection Observer
 */
export function useLazyImage(src: string, placeholder?: string) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isIntersecting && src && imageSrc !== src) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setHasError(false);
      };
      
      img.onerror = () => {
        setHasError(true);
        setIsLoaded(false);
      };
      
      img.src = src;
    }
  }, [isIntersecting, src, imageSrc]);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    hasError,
    isVisible: isIntersecting
  };
}

/**
 * Hook for lazy loading components with Intersection Observer
 */
export function useLazyComponent<T = any>(
  loadComponent: () => Promise<T>,
  options: UseIntersectionObserverOptions = {}
) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
    ...options
  });

  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isIntersecting && !Component && !isLoading) {
      setIsLoading(true);
      setHasError(false);

      loadComponent()
        .then((loadedComponent) => {
          setComponent(loadedComponent);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load component:', error);
          setHasError(true);
          setIsLoading(false);
        });
    }
  }, [isIntersecting, Component, isLoading, loadComponent]);

  return {
    ref,
    Component,
    isLoading,
    hasError,
    isVisible: isIntersecting
  };
}

/**
 * Hook for infinite scrolling with Intersection Observer
 */
export function useInfiniteScroll(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    ...options
  });

  useEffect(() => {
    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting, callback]);

  return { ref, isIntersecting };
}

/**
 * Hook for sticky elements with Intersection Observer
 */
export function useStickyElement(
  options: UseIntersectionObserverOptions = {}
) {
  const { ref, isIntersecting, entry } = useIntersectionObserver({
    threshold: [0, 1],
    ...options
  });

  const [isSticky, setIsSticky] = useState(false);
  const [stickyOffset, setStickyOffset] = useState(0);

  useEffect(() => {
    if (entry) {
      const { boundingClientRect, rootBounds } = entry;
      
      if (rootBounds && boundingClientRect.top <= rootBounds.top) {
        setIsSticky(true);
        setStickyOffset(rootBounds.top - boundingClientRect.top);
      } else {
        setIsSticky(false);
        setStickyOffset(0);
      }
    }
  }, [entry]);

  return {
    ref,
    isSticky,
    stickyOffset,
    isIntersecting
  };
}

/**
 * Hook for fade-in animations with Intersection Observer
 */
export function useFadeIn(
  delay: number = 0,
  duration: number = 600
) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isIntersecting && !shouldAnimate) {
      if (delay > 0) {
        setTimeout(() => setShouldAnimate(true), delay);
      } else {
        setShouldAnimate(true);
      }
    }
  }, [isIntersecting, shouldAnimate, delay]);

  const style = {
    opacity: shouldAnimate ? 1 : 0,
    transform: shouldAnimate ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
  };

  return {
    ref,
    style,
    isVisible: isIntersecting,
    shouldAnimate
  };
}
