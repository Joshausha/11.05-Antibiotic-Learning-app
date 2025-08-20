/**
 * useBookmarks Hook
 * Custom hook to manage bookmarked medical conditions with localStorage persistence
 * 
 * @returns {Object} - Bookmark state and methods
 */

import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const useBookmarks = () => {
  const [bookmarkedConditions, setBookmarkedConditions] = useLocalStorage('bookmarkedConditions', []);

  // Add a condition to bookmarks
  const addBookmark = useCallback((condition) => {
    setBookmarkedConditions(prev => {
      // Check if already bookmarked
      const isAlreadyBookmarked = prev.some(item => item.name === condition.name);
      if (isAlreadyBookmarked) {
        return prev;
      }
      
      // Add bookmark with timestamp
      const bookmarkData = {
        ...condition,
        bookmarkedAt: new Date().toISOString(),
        bookmarkId: `${condition.name}_${Date.now()}`
      };
      
      return [...prev, bookmarkData];
    });
  }, [setBookmarkedConditions]);

  // Remove a condition from bookmarks
  const removeBookmark = useCallback((conditionName) => {
    setBookmarkedConditions(prev => 
      prev.filter(item => item.name !== conditionName)
    );
  }, [setBookmarkedConditions]);

  // Toggle bookmark status
  const toggleBookmark = useCallback((condition) => {
    const isBookmarked = bookmarkedConditions.some(item => item.name === condition.name);
    
    if (isBookmarked) {
      removeBookmark(condition.name);
    } else {
      addBookmark(condition);
    }
    
    return !isBookmarked; // Return new bookmark status
  }, [bookmarkedConditions, addBookmark, removeBookmark]);

  // Check if a condition is bookmarked
  const isBookmarked = useCallback((conditionName) => {
    return bookmarkedConditions.some(item => item.name === conditionName);
  }, [bookmarkedConditions]);

  // Clear all bookmarks
  const clearAllBookmarks = useCallback(() => {
    setBookmarkedConditions([]);
  }, [setBookmarkedConditions]);

  // Get bookmarks by category
  const getBookmarksByCategory = useCallback((category) => {
    return bookmarkedConditions.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }, [bookmarkedConditions]);

  // Get bookmark statistics
  const bookmarkStats = {
    totalBookmarks: bookmarkedConditions.length,
    categories: [...new Set(bookmarkedConditions.map(item => item.category))],
    recentBookmarks: bookmarkedConditions
      .sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt))
      .slice(0, 5),
    oldestBookmark: bookmarkedConditions.length > 0 
      ? bookmarkedConditions.reduce((oldest, current) => 
          new Date(current.bookmarkedAt) < new Date(oldest.bookmarkedAt) ? current : oldest
        )
      : null
  };

  // Export bookmarks as JSON
  const exportBookmarks = useCallback(() => {
    const exportData = {
      bookmarks: bookmarkedConditions,
      exportDate: new Date().toISOString(),
      totalCount: bookmarkedConditions.length
    };
    
    return JSON.stringify(exportData, null, 2);
  }, [bookmarkedConditions]);

  // Import bookmarks from JSON
  const importBookmarks = useCallback((jsonData, options = { merge: true }) => {
    try {
      const importedData = JSON.parse(jsonData);
      
      if (!importedData.bookmarks || !Array.isArray(importedData.bookmarks)) {
        throw new Error('Invalid bookmark data format');
      }
      
      if (options.merge) {
        // Merge with existing bookmarks, avoiding duplicates
        setBookmarkedConditions(prev => {
          const existing = new Set(prev.map(item => item.name));
          const newBookmarks = importedData.bookmarks.filter(item => !existing.has(item.name));
          return [...prev, ...newBookmarks];
        });
      } else {
        // Replace all bookmarks
        setBookmarkedConditions(importedData.bookmarks);
      }
      
      return {
        success: true,
        imported: importedData.bookmarks.length,
        message: `Successfully imported ${importedData.bookmarks.length} bookmarks`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to import bookmarks'
      };
    }
  }, [setBookmarkedConditions]);

  return {
    // State
    bookmarkedConditions,
    bookmarkStats,
    
    // Actions
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    getBookmarksByCategory,
    
    // Import/Export
    exportBookmarks,
    importBookmarks
  };
};

export default useBookmarks;