/**
 * useSearch Hook
 * Custom hook to handle search functionality with filtering logic
 * 
 * @param {Array} items - The array of items to search through
 * @param {Array} searchFields - The fields to search within each item
 * @returns {Object} - { searchTerm, setSearchTerm, filteredItems }
 */

import { useState, useMemo } from 'react';

// Helper function to get nested field values (e.g., 'category.name')
const getNestedFieldValue = (obj, fieldPath) => {
  return fieldPath.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};

const useSearch = (items = [], searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtered results to optimize performance
  const filteredItems = useMemo(() => {
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
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Search statistics
  const searchStats = {
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