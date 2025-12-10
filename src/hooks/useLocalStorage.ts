/**
 * useLocalStorage Hook
 * Custom hook to persist state in localStorage with automatic JSON serialization
 */

import { useState, useEffect } from 'react';

/**
 * Type definitions for localStorage utilities
 */

interface StorageUtilities {
  clearValue: () => void;
  hasValue: () => boolean;
}

type SetValueFunction<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Custom hook for localStorage persistence with JSON serialization
 * @param key - The localStorage key
 * @param initialValue - The initial value if nothing is stored
 * @returns Tuple containing [storedValue, setValue, utilities]
 */
const useLocalStorage = <T>(key: string, initialValue: T): [T, SetValueFunction<T>, StorageUtilities] => {
  // Validate key parameter
  let validKey = key;
  if (typeof key !== 'string' || !key) {
    console.error('useLocalStorage: key must be a non-empty string');
    validKey = 'fallback-key';
  }

  // State to store our value - Initialize with a proper function
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        return initialValue;
      }
      // Get from local storage by key
      const item = window.localStorage.getItem(validKey);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${validKey}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue: SetValueFunction<T> = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Check if value is actually changing to avoid unnecessary operations
      if (JSON.stringify(valueToStore) === JSON.stringify(storedValue)) {
        return;
      }

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (window.localStorage) {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(validKey);
        } else {
          window.localStorage.setItem(validKey, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${validKey}":`, error);
    }
  };

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === validKey && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${validKey}":`, error);
        }
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [validKey]);

  // Clear function
  const clearValue = (): void => {
    setValue(undefined as any);
  };

  // Check if value exists
  const hasValue = (): boolean => {
    try {
      return window.localStorage.getItem(validKey) !== null;
    } catch {
      return false;
    }
  };

  return [storedValue, setValue, { clearValue, hasValue }];
};

export default useLocalStorage;
