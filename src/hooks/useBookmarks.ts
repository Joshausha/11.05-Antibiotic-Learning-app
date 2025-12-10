/**
 * useBookmarks Hook
 * Custom hook to manage bookmarked medical conditions with localStorage persistence
 */

import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Type definitions for bookmarks functionality
 */

interface BookmarkedCondition {
  name: string;
  category?: string;
  bookmarkedAt: string;
  bookmarkId: string;
  [key: string]: any;
}

interface BookmarkStats {
  totalBookmarks: number;
  categories: (string | undefined)[];
  recentBookmarks: BookmarkedCondition[];
  oldestBookmark: BookmarkedCondition | null;
}

interface ImportOptions {
  merge?: boolean;
}

interface ImportResult {
  success: boolean;
  imported?: number;
  error?: string;
  message: string;
}

interface UseBookmarksReturn {
  // State
  bookmarkedConditions: BookmarkedCondition[];
  bookmarkStats: BookmarkStats;

  // Actions
  addBookmark: (condition: Record<string, any>) => void;
  removeBookmark: (conditionName: string) => void;
  toggleBookmark: (condition: Record<string, any>) => boolean | undefined;
  isBookmarked: (conditionName: string) => boolean;
  clearAllBookmarks: () => void;
  clearBookmarks: () => void;
  getBookmarksByCategory: (category: string) => BookmarkedCondition[];

  // Import/Export
  exportBookmarks: () => string;
  importBookmarks: (jsonData: string, options?: ImportOptions) => ImportResult;
}

/**
 * Custom hook for managing bookmarked medical conditions
 * @returns Bookmark state and methods
 */
const useBookmarks = (): UseBookmarksReturn => {
  const [bookmarkedConditions, setBookmarkedConditions] = useLocalStorage<BookmarkedCondition[]>('bookmarkedConditions', []);

  // Add a condition to bookmarks
  const addBookmark = useCallback((condition: Record<string, any>): void => {
    setBookmarkedConditions(prev => {
      // Check if already bookmarked using current state
      const isAlreadyBookmarked = prev.some(item => item.name === condition.name);
      if (isAlreadyBookmarked) {
        return prev;
      }

      // Add bookmark with timestamp
      const bookmarkData: BookmarkedCondition = {
        ...condition,
        bookmarkedAt: new Date().toISOString(),
        bookmarkId: `${condition.name}_${Date.now()}`
      };

      return [...prev, bookmarkData];
    });
  }, [setBookmarkedConditions]);

  // Remove a condition from bookmarks
  const removeBookmark = useCallback((conditionName: string): void => {
    setBookmarkedConditions(prev =>
      prev.filter(item => item.name !== conditionName)
    );
  }, [setBookmarkedConditions]);

  // Toggle bookmark status
  const toggleBookmark = useCallback((condition: Record<string, any>): boolean | undefined => {
    let newStatus: boolean | undefined;
    setBookmarkedConditions(prev => {
      const isBookmarked = prev.some(item => item.name === condition.name);
      newStatus = !isBookmarked;

      if (isBookmarked) {
        // Remove bookmark
        return prev.filter(item => item.name !== condition.name);
      } else {
        // Add bookmark - check if already exists to prevent duplicates
        const alreadyExists = prev.some(item => item.name === condition.name);
        if (alreadyExists) {
          return prev;
        }

        const bookmarkData: BookmarkedCondition = {
          ...condition,
          bookmarkedAt: new Date().toISOString(),
          bookmarkId: `${condition.name}_${Date.now()}`
        };

        return [...prev, bookmarkData];
      }
    });

    return newStatus; // Return new bookmark status
  }, [setBookmarkedConditions]);

  // Check if a condition is bookmarked
  const isBookmarked = useCallback((conditionName: string): boolean => {
    if (!conditionName) return false;
    return bookmarkedConditions.some(item => item.name === conditionName);
  }, [bookmarkedConditions]);

  // Clear all bookmarks
  const clearAllBookmarks = useCallback((): void => {
    setBookmarkedConditions([]);
  }, [setBookmarkedConditions]);

  // Get bookmarks by category
  const getBookmarksByCategory = useCallback((category: string): BookmarkedCondition[] => {
    if (!category) return [];
    return bookmarkedConditions.filter(item =>
      item.category && item.category.toLowerCase() === category.toLowerCase()
    );
  }, [bookmarkedConditions]);

  // Get bookmark statistics
  const bookmarkStats: BookmarkStats = {
    totalBookmarks: bookmarkedConditions.length,
    categories: [...new Set(bookmarkedConditions
      .map(item => item.category)
      .filter(category => category !== undefined && category !== null)
    )],
    recentBookmarks: bookmarkedConditions
      .sort((a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime())
      .slice(0, 5),
    oldestBookmark: bookmarkedConditions.length > 0
      ? bookmarkedConditions.reduce((oldest, current) =>
          new Date(current.bookmarkedAt).getTime() < new Date(oldest.bookmarkedAt).getTime() ? current : oldest
        )
      : null
  };

  // Export bookmarks as JSON
  const exportBookmarks = useCallback((): string => {
    const exportData = {
      bookmarks: bookmarkedConditions,
      exportDate: new Date().toISOString(),
      totalCount: bookmarkedConditions.length
    };

    return JSON.stringify(exportData, null, 2);
  }, [bookmarkedConditions]);

  // Import bookmarks from JSON
  const importBookmarks = useCallback((jsonData: string, options: ImportOptions = { merge: true }): ImportResult => {
    try {
      const importedData = JSON.parse(jsonData) as { bookmarks?: BookmarkedCondition[] };

      if (!importedData.bookmarks || !Array.isArray(importedData.bookmarks)) {
        throw new Error('Invalid bookmark data format');
      }

      if (options.merge) {
        // Merge with existing bookmarks, avoiding duplicates
        setBookmarkedConditions(prev => {
          const existing = new Set(prev.map(item => item.name));
          const newBookmarks = importedData.bookmarks!.filter(item => !existing.has(item.name));
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: errorMessage,
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
    clearBookmarks: clearAllBookmarks, // Alias for test compatibility
    getBookmarksByCategory,

    // Import/Export
    exportBookmarks,
    importBookmarks
  };
};

export default useBookmarks;
