/**
 * useSearch Hook
 * Custom hook to handle search functionality with filtering logic
 */

import { useState, useMemo } from 'react';

/**
 * Type definitions for search functionality
 */

interface SearchStats {
  totalItems: number;
  filteredItems: number;
  isFiltered: boolean;
  searchTerm: string;
}

interface UseSearchReturn<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: T[];
  clearSearch: () => void;
  searchStats: SearchStats;
}

/**
 * Helper function to get nested field values (e.g., 'category.name')
 */
const getNestedFieldValue = (obj: Record<string, any>, fieldPath: string): any => {
  return fieldPath.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};

/**
 * Custom hook for search functionality with filtering logic
 * @param items - The array of items to search through
 * @param searchFields - The fields to search within each item
 * @returns Search state and utilities
 */
const useSearch = <T extends Record<string, any>>(
  items: T[] = [],
  searchFields: string[] = []
): UseSearchReturn<T> => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Memoized filtered results to optimize performance
  const filteredItems = useMemo<T[]>(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      return searchFields.some(field => {
        const fieldValue = getNestedFieldValue(item, field);

        if (Array.isArray(fieldValue)) {
          // Handle array fields (like commonPathogens)
          return fieldValue.some(arrayItem =>
            String(arrayItem).toLowerCase().includes(lowercaseSearchTerm)
          );
        }

        // Handle string fields
        return String(fieldValue).toLowerCase().includes(lowercaseSearchTerm);
      });
    });
  }, [items, searchTerm, searchFields]);

  // Clear search function
  const clearSearch = (): void => {
    setSearchTerm('');
  };

  // Search statistics
  const searchStats: SearchStats = {
    totalItems: items.length,
    filteredItems: filteredItems.length,
    isFiltered: searchTerm.trim().length > 0,
    searchTerm: searchTerm.trim()
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    clearSearch,
    searchStats
  };
};

export default useSearch;
