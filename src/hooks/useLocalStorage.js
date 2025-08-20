/**
 * useLocalStorage Hook
 * Custom hook to persist state in localStorage with automatic JSON serialization
 * 
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if nothing is stored
 * @returns {Array} - [storedValue, setValue]
 */

import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Validate key parameter
  if (typeof key !== 'string' || !key) {
    console.error('useLocalStorage: key must be a non-empty string');
    key = 'fallback-key';
  }

  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Check if localStorage is available
      if (!window.localStorage) {
        return initialValue;
      }
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
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
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  // Clear function
  const clearValue = () => {
    setValue(undefined);
  };

  // Check if value exists
  const hasValue = () => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  };

  return [storedValue, setValue, { clearValue, hasValue }];
};

export default useLocalStorage;