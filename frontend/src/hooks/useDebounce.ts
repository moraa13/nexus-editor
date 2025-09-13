import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Debounce hook for delaying execution of functions
 * Useful for search inputs, API calls, and expensive operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounced callback hook
 * Returns a debounced version of the provided function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Update timeout when deps change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay, ...deps]
  );

  return debouncedCallback;
}

/**
 * Hook for debounced search with loading state
 */
export function useDebouncedSearch(
  initialValue: string = '',
  delay: number = 300
) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, delay);

  useEffect(() => {
    if (searchValue !== debouncedSearchValue) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchValue, debouncedSearchValue]);

  const clearSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  return {
    searchValue,
    setSearchValue,
    debouncedSearchValue,
    isSearching,
    clearSearch
  };
}

/**
 * Hook for debounced API calls
 */
export function useDebouncedAPI<T>(
  apiCall: (params: any) => Promise<T>,
  delay: number = 500,
  initialParams?: any
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState(initialParams);

  const debouncedParams = useDebounce(params, delay);

  useEffect(() => {
    if (debouncedParams !== undefined) {
      setLoading(true);
      setError(null);

      apiCall(debouncedParams)
        .then((result) => {
          setData(result);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [debouncedParams, apiCall]);

  const refetch = useCallback((newParams?: any) => {
    setParams(newParams || debouncedParams);
  }, [debouncedParams]);

  return {
    data,
    loading,
    error,
    params,
    setParams,
    refetch
  };
}

/**
 * Hook for debounced form validation
 */
export function useDebouncedValidation(
  validationFn: (value: any) => string | null,
  delay: number = 300
) {
  const [value, setValue] = useState<any>('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    if (debouncedValue !== undefined) {
      setIsValidating(true);
      
      // Use setTimeout to allow UI to update
      setTimeout(() => {
        const validationError = validationFn(debouncedValue);
        setError(validationError);
        setIsValidating(false);
      }, 0);
    }
  }, [debouncedValue, validationFn]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    value,
    setValue,
    error,
    isValidating,
    clearError,
    isValid: !error && !isValidating
  };
}

/**
 * Hook for debounced scroll events
 */
export function useDebouncedScroll(
  callback: (scrollY: number, scrollX: number) => void,
  delay: number = 100
) {
  const debouncedCallback = useDebouncedCallback(callback, delay);

  useEffect(() => {
    const handleScroll = () => {
      debouncedCallback(window.scrollY, window.scrollX);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [debouncedCallback]);
}

/**
 * Hook for debounced resize events
 */
export function useDebouncedResize(
  callback: (width: number, height: number) => void,
  delay: number = 250
) {
  const debouncedCallback = useDebouncedCallback(callback, delay);

  useEffect(() => {
    const handleResize = () => {
      debouncedCallback(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [debouncedCallback]);
}

/**
 * Hook for debounced mouse events (for drag operations)
 */
export function useDebouncedMouse(
  callback: (x: number, y: number, event: MouseEvent) => void,
  delay: number = 16 // ~60fps
) {
  const debouncedCallback = useDebouncedCallback(callback, delay);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      debouncedCallback(event.clientX, event.clientY, event);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [debouncedCallback]);
}

/**
 * Hook for debounced input with immediate feedback
 */
export function useDebouncedInput(
  initialValue: string = '',
  delay: number = 300
) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [displayValue, setDisplayValue] = useState(initialValue);
  const debouncedValue = useDebounce(inputValue, delay);

  useEffect(() => {
    setDisplayValue(debouncedValue);
  }, [debouncedValue]);

  const handleChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleBlur = useCallback(() => {
    // Immediately update display value on blur
    setDisplayValue(inputValue);
  }, [inputValue]);

  return {
    inputValue,
    displayValue,
    debouncedValue,
    handleChange,
    handleBlur,
    isDebouncing: inputValue !== displayValue
  };
}

/**
 * Hook for debounced async operations with cancellation
 */
export function useDebouncedAsync<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  delay: number = 500
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  const execute = useDebouncedCallback(
    async (...args: any[]) => {
      // Cancel previous operation
      if (cancelRef.current) {
        cancelRef.current();
      }

      setLoading(true);
      setError(null);

      let cancelled = false;
      cancelRef.current = () => {
        cancelled = true;
      };

      try {
        const result = await asyncFn(...args);
        
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          setLoading(false);
        }
      }
    },
    delay
  );

  const cancel = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    data,
    loading,
    error,
    execute,
    cancel
  };
}
