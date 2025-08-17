import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook that debounces a value by delaying updates until the specified delay has passed
 * without the value changing
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
 * Hook that debounces a callback function
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  ) as T;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook that provides both debounced value and immediate value,
 * useful for controlled inputs that need immediate feedback but debounced API calls
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number,
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return [value, debouncedValue, setValue];
}

/**
 * Hook for debounced search functionality
 */
interface UseDebounceSearchOptions {
  minLength?: number;
  onSearch?: (query: string) => void;
  onClear?: () => void;
}

export function useDebounceSearch(
  delay: number = 300,
  options: UseDebounceSearchOptions = {},
) {
  const { minLength = 1, onSearch, onClear } = options;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, delay);
  const [isSearching, setIsSearching] = useState(false);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= minLength) {
      setIsSearching(true);
      onSearch?.(debouncedQuery);
    } else if (debouncedQuery.length === 0) {
      onClear?.();
    }
    setIsSearching(false);
  }, [debouncedQuery, minLength, onSearch, onClear]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setIsSearching(false);
    onClear?.();
  }, [onClear]);

  return {
    query,
    setQuery,
    debouncedQuery,
    isSearching,
    clearSearch,
    hasQuery: query.length > 0,
    hasValidQuery: debouncedQuery.length >= minLength,
  };
}

/**
 * Hook that debounces an async function
 */
export function useDebounceAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  delay: number,
): [T, boolean, Error | null] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const asyncFnRef = useRef(asyncFn);

  // Update function ref when it changes
  useEffect(() => {
    asyncFnRef.current = asyncFn;
  }, [asyncFn]);

  const debouncedAsyncFn = useCallback(
    async (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setError(null);

      return new Promise<ReturnType<T>>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            setLoading(true);
            const result = await asyncFnRef.current(...args);
            resolve(result);
          } catch (err) {
            const error =
              err instanceof Error ? err : new Error("Async operation failed");
            setError(error);
            reject(error);
          } finally {
            setLoading(false);
          }
        }, delay);
      });
    },
    [delay],
  ) as T;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedAsyncFn, loading, error];
}

export default useDebounce;
