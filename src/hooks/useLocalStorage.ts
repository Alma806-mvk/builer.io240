import { useState, useEffect, useCallback } from "react";

type SetValue<T> = T | ((val: T) => T);

interface UseLocalStorageOptions {
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
  onError?: (error: Error) => void;
}

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: SetValue<T>) => void;
  remove: () => void;
  loading: boolean;
  error: Error | null;
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions = {},
): UseLocalStorageReturn<T> {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError,
  } = options;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [value, setValue] = useState<T>(defaultValue);

  // Load initial value from localStorage
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setValue(deserialize(item));
      }
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to load from localStorage");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [key, deserialize, onError]);

  // Save to localStorage whenever value changes
  const setStoredValue = useCallback(
    (value: SetValue<T>) => {
      try {
        setError(null);

        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(getValue()) : value;

        setValue(valueToStore);
        localStorage.setItem(key, serialize(valueToStore));
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to save to localStorage");
        setError(error);
        onError?.(error);
      }
    },
    [key, serialize, onError],
  );

  // Get current value (useful for functional updates)
  const getValue = useCallback((): T => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? deserialize(item) : defaultValue;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to get from localStorage");
      setError(error);
      onError?.(error);
      return defaultValue;
    }
  }, [key, defaultValue, deserialize, onError]);

  // Remove from localStorage
  const remove = useCallback(() => {
    try {
      setError(null);
      localStorage.removeItem(key);
      setValue(defaultValue);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to remove from localStorage");
      setError(error);
      onError?.(error);
    }
  }, [key, defaultValue, onError]);

  return {
    value,
    setValue: setStoredValue,
    remove,
    loading,
    error,
  };
}

// Specialized hooks for common data types
export function useLocalStorageString(
  key: string,
  defaultValue: string = "",
  options?: Omit<UseLocalStorageOptions, "serialize" | "deserialize">,
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serialize: (value) => value,
    deserialize: (value) => value,
  });
}

export function useLocalStorageNumber(
  key: string,
  defaultValue: number = 0,
  options?: Omit<UseLocalStorageOptions, "serialize" | "deserialize">,
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serialize: (value) => value.toString(),
    deserialize: (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) throw new Error("Invalid number in localStorage");
      return num;
    },
  });
}

export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean = false,
  options?: Omit<UseLocalStorageOptions, "serialize" | "deserialize">,
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serialize: (value) => value.toString(),
    deserialize: (value) => {
      if (value === "true") return true;
      if (value === "false") return false;
      throw new Error("Invalid boolean in localStorage");
    },
  });
}

export function useLocalStorageArray<T>(
  key: string,
  defaultValue: T[] = [],
  options?: UseLocalStorageOptions,
) {
  return useLocalStorage<T[]>(key, defaultValue, options);
}

export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  defaultValue: T,
  options?: UseLocalStorageOptions,
) {
  return useLocalStorage<T>(key, defaultValue, options);
}

export default useLocalStorage;
