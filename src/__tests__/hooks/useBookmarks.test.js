/**
 * useBookmarks Hook Tests
 * @description Comprehensive test suite for useBookmarks hook
 * @created 2025-07-28 09:15:44
 */

import { renderHook, act } from '@testing-library/react';
import useBookmarks from '../../hooks/useBookmarks';
import { setupTestEnvironment, createTestCondition, mockLocalStorage } from '../utils/testUtils';
import useLocalStorage from '../../hooks/useLocalStorage';

import React from 'react';

// Mock useLocalStorage to behave like a real React hook
jest.mock('../../hooks/useLocalStorage', () => {
  return jest.fn(() => {
    const [state, setState] = require('react').useState([]);
    return [
      state,
      setState
    ];
  });
});

describe('useBookmarks Hook', () => {
  let testEnv;
  
  const mockCondition1 = createTestCondition({
    id: 'pneumonia',
    name: 'Pneumonia',
    category: 'Respiratory',
    description: 'Lung infection',
    commonPathogens: ['Streptococcus pneumoniae'],
    antibiotics: ['Amoxicillin']
  });

  const mockCondition2 = createTestCondition({
    id: 'uti',
    name: 'Urinary Tract Infection',
    category: 'Genitourinary',
    description: 'Urinary system infection',
    commonPathogens: ['E. coli'],
    antibiotics: ['Nitrofurantoin']
  });

  const mockCondition3 = createTestCondition({
    id: 'cellulitis',
    name: 'Cellulitis',
    category: 'Skin and Soft Tissue',
    description: 'Skin infection',
    commonPathogens: ['Staphylococcus aureus'],
    antibiotics: ['Clindamycin']
  });

  beforeEach(() => {
    testEnv = setupTestEnvironment();
    // Clear localStorage manually since clearAll doesn't exist
    if (typeof Storage !== 'undefined') {
      localStorage.clear();
    }
    jest.clearAllMocks();
  });

  afterEach(() => {
    testEnv.cleanup();
  });

  describe('Initial State', () => {
    it('initializes with empty bookmarks', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarkedConditions).toEqual([]);
      expect(result.current.bookmarkStats.totalBookmarks).toBe(0);
      expect(result.current.bookmarkStats.categories).toEqual([]);
      expect(result.current.bookmarkStats.recentBookmarks).toEqual([]);
    });

    it('provides all necessary methods', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(typeof result.current.addBookmark).toBe('function');
      expect(typeof result.current.removeBookmark).toBe('function');
      expect(typeof result.current.toggleBookmark).toBe('function');
      expect(typeof result.current.isBookmarked).toBe('function');
      expect(typeof result.current.clearAllBookmarks).toBe('function');
      expect(typeof result.current.getBookmarksByCategory).toBe('function');
      expect(typeof result.current.exportBookmarks).toBe('function');
      expect(typeof result.current.importBookmarks).toBe('function');
    });

    it('loads existing bookmarks from localStorage', () => {
      const existingBookmarks = [
        { ...mockCondition1, bookmarkedAt: '2025-01-01T10:00:00.000Z', bookmarkId: 'bookmark-1' }
      ];
      
      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify(existingBookmarks));
      
      const { result } = renderHook(() => useBookmarks());
      
      expect(result.current.bookmarkedConditions).toHaveLength(1);
      expect(result.current.bookmarkedConditions[0].name).toBe('Pneumonia');
    });
  });

  describe('Adding Bookmarks', () => {
    it('adds a new bookmark successfully', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(mockCondition1);
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);
      expect(result.current.bookmarkedConditions[0]).toEqual(
        expect.objectContaining({
          id: 'pneumonia',
          name: 'Pneumonia',
          category: 'Respiratory',
          bookmarkedAt: expect.any(String),
          bookmarkId: expect.stringContaining('Pneumonia_')
        })
      );
    });

    it('generates unique bookmark IDs', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(mockCondition1);
        result.current.addBookmark(mockCondition2);
      });

      const bookmarkIds = result.current.bookmarkedConditions.map(b => b.bookmarkId);
      expect(bookmarkIds[0]).not.toBe(bookmarkIds[1]);
      expect(bookmarkIds[0]).toContain('Pneumonia_');
      expect(bookmarkIds[1]).toContain('Urinary Tract Infection_');
    });

    it('includes timestamp when adding bookmark', () => {
      const { result } = renderHook(() => useBookmarks());

      const beforeTime = new Date();
      
      act(() => {
        result.current.addBookmark(mockCondition1);
      });

      const afterTime = new Date();
      const bookmark = result.current.bookmarkedConditions[0];
      
      // Compare as Date objects, not strings
      const bookmarkedDate = new Date(bookmark.bookmarkedAt);
      expect(bookmarkedDate).toBeGreaterThanOrEqual(beforeTime);
      expect(bookmarkedDate).toBeLessThanOrEqual(afterTime);
    });

    it('prevents duplicate bookmarks', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(mockCondition1);
        result.current.addBookmark(mockCondition1); // Try to add same condition
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);
    });

    it('preserves all condition properties when bookmarking', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(mockCondition1);
      });

      const bookmark = result.current.bookmarkedConditions[0];
      expect(bookmark.id).toBe(mockCondition1.id);
      expect(bookmark.name).toBe(mockCondition1.name);
      expect(bookmark.category).toBe(mockCondition1.category);
      expect(bookmark.description).toBe(mockCondition1.description);
      expect(bookmark.commonPathogens).toEqual(mockCondition1.commonPathogens);
      expect(bookmark.antibiotics).toEqual(mockCondition1.antibiotics);
    });
  });

  describe('Removing Bookmarks', () => {
    beforeEach(() => {
      // Pre-populate bookmarks for removal tests
      const existingBookmarks = [
        { ...mockCondition1, bookmarkedAt: '2025-01-01T10:00:00.000Z', bookmarkId: 'bookmark-1' },
        { ...mockCondition2, bookmarkedAt: '2025-01-01T11:00:00.000Z', bookmarkId: 'bookmark-2' }
      ];
      
      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify(existingBookmarks));
    });

    it('removes bookmark by condition name', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarkedConditions).toHaveLength(2);

      act(() => {
        result.current.removeBookmark('Pneumonia');
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);
      expect(result.current.bookmarkedConditions[0].name).toBe('Urinary Tract Infection');
    });

    it('handles removal of non-existent bookmark gracefully', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.removeBookmark('Non-existent Condition');
      });

      expect(result.current.bookmarkedConditions).toHaveLength(2); // No change
    });

    it('removes correct bookmark when multiple conditions exist', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.removeBookmark('Urinary Tract Infection');
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);
      expect(result.current.bookmarkedConditions[0].name).toBe('Pneumonia');
    });
  });

  describe('Toggling Bookmarks', () => {
    it('adds bookmark when condition is not bookmarked', () => {
      const { result } = renderHook(() => useBookmarks());

      let returnValue;
      act(() => {
        returnValue = result.current.toggleBookmark(mockCondition1);
      });

      expect(returnValue).toBe(true); // Now bookmarked
      expect(result.current.bookmarkedConditions).toHaveLength(1);
      expect(result.current.bookmarkedConditions[0].name).toBe('Pneumonia');
    });

    it('removes bookmark when condition is already bookmarked', () => {
      const { result } = renderHook(() => useBookmarks());

      // First add the bookmark
      act(() => {
        result.current.addBookmark(mockCondition1);
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);

      // Then toggle it (should remove)
      let returnValue;
      act(() => {
        returnValue = result.current.toggleBookmark(mockCondition1);
      });

      expect(returnValue).toBe(false); // No longer bookmarked
      expect(result.current.bookmarkedConditions).toHaveLength(0);
    });

    it('returns correct bookmark status after toggle', () => {
      const { result } = renderHook(() => useBookmarks());

      // Toggle on
      let status1;
      act(() => {
        status1 = result.current.toggleBookmark(mockCondition1);
      });
      expect(status1).toBe(true);

      // Toggle off
      let status2;
      act(() => {
        status2 = result.current.toggleBookmark(mockCondition1);
      });
      expect(status2).toBe(false);
    });
  });

  describe('Bookmark Status Check', () => {
    beforeEach(() => {
      const existingBookmarks = [
        { ...mockCondition1, bookmarkedAt: '2025-01-01T10:00:00.000Z', bookmarkId: 'bookmark-1' }
      ];
      
      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify(existingBookmarks));
    });

    it('returns true for bookmarked conditions', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.isBookmarked('Pneumonia')).toBe(true);
    });

    it('returns false for non-bookmarked conditions', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.isBookmarked('Urinary Tract Infection')).toBe(false);
    });

    it('is case sensitive', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.isBookmarked('pneumonia')).toBe(false);
      expect(result.current.isBookmarked('Pneumonia')).toBe(true);
    });

    it('handles empty condition name', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.isBookmarked('')).toBe(false);
      expect(result.current.isBookmarked(null)).toBe(false);
      expect(result.current.isBookmarked(undefined)).toBe(false);
    });
  });

  describe('Clear All Bookmarks', () => {
    beforeEach(() => {
      const existingBookmarks = [
        { ...mockCondition1, bookmarkedAt: '2025-01-01T10:00:00.000Z', bookmarkId: 'bookmark-1' },
        { ...mockCondition2, bookmarkedAt: '2025-01-01T11:00:00.000Z', bookmarkId: 'bookmark-2' },
        { ...mockCondition3, bookmarkedAt: '2025-01-01T12:00:00.000Z', bookmarkId: 'bookmark-3' }
      ];
      
      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify(existingBookmarks));
    });

    it('removes all bookmarks', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarkedConditions).toHaveLength(3);

      act(() => {
        result.current.clearAllBookmarks();
      });

      expect(result.current.bookmarkedConditions).toHaveLength(0);
      expect(result.current.bookmarkStats.totalBookmarks).toBe(0);
    });

    it('updates statistics after clearing', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.clearAllBookmarks();
      });

      expect(result.current.bookmarkStats.totalBookmarks).toBe(0);
      expect(result.current.bookmarkStats.categories).toHaveLength(0);
      expect(result.current.bookmarkStats.recentBookmarks).toHaveLength(0);
    });
  });

  describe('Get Bookmarks by Category', () => {
    beforeEach(() => {
      const existingBookmarks = [
        { ...mockCondition1, bookmarkedAt: '2025-01-01T10:00:00.000Z', bookmarkId: 'bookmark-1' }, // Respiratory
        { ...mockCondition2, bookmarkedAt: '2025-01-01T11:00:00.000Z', bookmarkId: 'bookmark-2' }, // Genitourinary
        { ...mockCondition3, bookmarkedAt: '2025-01-01T12:00:00.000Z', bookmarkId: 'bookmark-3' }  // Skin and Soft Tissue
      ];
      
      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify(existingBookmarks));
    });

    it('returns bookmarks for specific category', () => {
      const { result } = renderHook(() => useBookmarks());

      const respiratoryBookmarks = result.current.getBookmarksByCategory('Respiratory');
      expect(respiratoryBookmarks).toHaveLength(1);
      expect(respiratoryBookmarks[0].name).toBe('Pneumonia');
    });

    it('returns empty array for category with no bookmarks', () => {
      const { result } = renderHook(() => useBookmarks());

      const centralNervousBookmarks = result.current.getBookmarksByCategory('Central Nervous System');
      expect(centralNervousBookmarks).toHaveLength(0);
    });

    it('is case insensitive for category matching', () => {
      const { result } = renderHook(() => useBookmarks());

      const lowerCaseResult = result.current.getBookmarksByCategory('respiratory');
      const upperCaseResult = result.current.getBookmarksByCategory('RESPIRATORY');
      const mixedCaseResult = result.current.getBookmarksByCategory('Respiratory');

      expect(lowerCaseResult).toHaveLength(1);
      expect(upperCaseResult).toHaveLength(1);
      expect(mixedCaseResult).toHaveLength(1);
    });

    it('handles empty category string', () => {
      const { result } = renderHook(() => useBookmarks());

      const emptyResult = result.current.getBookmarksByCategory('');
      expect(emptyResult).toHaveLength(0);
    });
  });

  describe('Bookmark Statistics', () => {
    beforeEach(() => {
      const existingBookmarks = [
        { ...mockCondition1, bookmarkedAt: '2025-01-01T10:00:00.000Z', bookmarkId: 'bookmark-1' },
        { ...mockCondition2, bookmarkedAt: '2025-01-01T11:00:00.000Z', bookmarkId: 'bookmark-2' },
        { ...mockCondition3, bookmarkedAt: '2025-01-01T12:00:00.000Z', bookmarkId: 'bookmark-3' }
      ];
      
      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify(existingBookmarks));
    });

    it('calculates total bookmarks correctly', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarkStats.totalBookmarks).toBe(3);
    });

    it('identifies unique categories', () => {
      const { result } = renderHook(() => useBookmarks());

      const categories = result.current.bookmarkStats.categories;
      expect(categories).toHaveLength(3);
      expect(categories).toContain('Respiratory');
      expect(categories).toContain('Genitourinary');
      expect(categories).toContain('Skin and Soft Tissue');
    });

    it('lists recent bookmarks in reverse chronological order', () => {
      const { result } = renderHook(() => useBookmarks());

      const recentBookmarks = result.current.bookmarkStats.recentBookmarks;
      expect(recentBookmarks).toHaveLength(3);
      expect(recentBookmarks[0].name).toBe('Cellulitis'); // Most recent
      expect(recentBookmarks[1].name).toBe('Urinary Tract Infection');
      expect(recentBookmarks[2].name).toBe('Pneumonia'); // Oldest
    });

    it('limits recent bookmarks to 5', () => {
      // Add more bookmarks
      const manyBookmarks = Array.from({ length: 10 }, (_, i) => ({
        ...createTestCondition({ name: `Condition ${i}`, category: 'Test' }),
        bookmarkedAt: `2025-01-01T${String(i + 10).padStart(2, '0')}:00:00.000Z`,
        bookmarkId: `bookmark-${i}`
      }));

      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify(manyBookmarks));
      
      const { result } = renderHook(() => useBookmarks());
      
      expect(result.current.bookmarkStats.recentBookmarks).toHaveLength(5);
    });

    it('identifies oldest bookmark correctly', () => {
      const { result } = renderHook(() => useBookmarks());

      const oldestBookmark = result.current.bookmarkStats.oldestBookmark;
      expect(oldestBookmark.name).toBe('Pneumonia');
      expect(oldestBookmark.bookmarkedAt).toBe('2025-01-01T10:00:00.000Z');
    });

    it('handles empty bookmarks for oldest bookmark', () => {
      useLocalStorage.clearAll();
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarkStats.oldestBookmark).toBeNull();
    });
  });

  describe('Export Bookmarks', () => {
    beforeEach(() => {
      const existingBookmarks = [
        { ...mockCondition1, bookmarkedAt: '2025-01-01T10:00:00.000Z', bookmarkId: 'bookmark-1' },
        { ...mockCondition2, bookmarkedAt: '2025-01-01T11:00:00.000Z', bookmarkId: 'bookmark-2' }
      ];
      
      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify(existingBookmarks));
    });

    it('exports bookmarks as valid JSON', () => {
      const { result } = renderHook(() => useBookmarks());

      const exportedData = result.current.exportBookmarks();
      expect(() => JSON.parse(exportedData)).not.toThrow();
    });

    it('includes all required export fields', () => {
      const { result } = renderHook(() => useBookmarks());

      const exportedData = JSON.parse(result.current.exportBookmarks());
      
      expect(exportedData).toHaveProperty('bookmarks');
      expect(exportedData).toHaveProperty('exportDate');
      expect(exportedData).toHaveProperty('totalCount');
      
      expect(Array.isArray(exportedData.bookmarks)).toBe(true);
      expect(exportedData.totalCount).toBe(2);
      expect(exportedData.exportDate).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('exports all bookmark data correctly', () => {
      const { result } = renderHook(() => useBookmarks());

      const exportedData = JSON.parse(result.current.exportBookmarks());
      
      expect(exportedData.bookmarks).toHaveLength(2);
      expect(exportedData.bookmarks[0].name).toBe('Pneumonia');
      expect(exportedData.bookmarks[1].name).toBe('Urinary Tract Infection');
    });

    it('handles empty bookmarks export', () => {
      useLocalStorage.clearAll();
      const { result } = renderHook(() => useBookmarks());

      const exportedData = JSON.parse(result.current.exportBookmarks());
      
      expect(exportedData.bookmarks).toHaveLength(0);
      expect(exportedData.totalCount).toBe(0);
    });
  });

  describe('Import Bookmarks', () => {
    const validImportData = {
      bookmarks: [
        { ...mockCondition1, bookmarkedAt: '2025-01-01T10:00:00.000Z', bookmarkId: 'import-1' },
        { ...mockCondition2, bookmarkedAt: '2025-01-01T11:00:00.000Z', bookmarkId: 'import-2' }
      ],
      exportDate: '2025-01-01T12:00:00.000Z',
      totalCount: 2
    };

    it('imports bookmarks successfully with merge option', () => {
      const { result } = renderHook(() => useBookmarks());

      // Add existing bookmark
      act(() => {
        result.current.addBookmark(mockCondition3);
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);

      // Import additional bookmarks
      let importResult;
      act(() => {
        importResult = result.current.importBookmarks(JSON.stringify(validImportData), { merge: true });
      });

      expect(importResult.success).toBe(true);
      expect(importResult.imported).toBe(2);
      expect(result.current.bookmarkedConditions).toHaveLength(3); // 1 existing + 2 imported
    });

    it('replaces bookmarks when merge is false', () => {
      const { result } = renderHook(() => useBookmarks());

      // Add existing bookmark
      act(() => {
        result.current.addBookmark(mockCondition3);
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);

      // Import bookmarks without merging
      let importResult;
      act(() => {
        importResult = result.current.importBookmarks(JSON.stringify(validImportData), { merge: false });
      });

      expect(importResult.success).toBe(true);
      expect(result.current.bookmarkedConditions).toHaveLength(2); // Only imported bookmarks
      expect(result.current.bookmarkedConditions.find(b => b.name === 'Cellulitis')).toBeUndefined();
    });

    it('prevents duplicate imports when merging', () => {
      const { result } = renderHook(() => useBookmarks());

      // Add existing bookmark that matches import data
      act(() => {
        result.current.addBookmark(mockCondition1);
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);

      // Import data containing the same bookmark
      let importResult;
      act(() => {
        importResult = result.current.importBookmarks(JSON.stringify(validImportData), { merge: true });
      });

      expect(importResult.success).toBe(true);
      expect(result.current.bookmarkedConditions).toHaveLength(2); // 1 duplicate filtered out
    });

    it('handles invalid JSON gracefully', () => {
      const { result } = renderHook(() => useBookmarks());

      let importResult;
      act(() => {
        importResult = result.current.importBookmarks('invalid-json');
      });

      expect(importResult.success).toBe(false);
      expect(importResult.error).toContain('Unexpected token');
      expect(importResult.message).toBe('Failed to import bookmarks');
    });

    it('handles invalid data format', () => {
      const { result } = renderHook(() => useBookmarks());

      const invalidData = {
        wrongField: 'wrong value'
      };

      let importResult;
      act(() => {
        importResult = result.current.importBookmarks(JSON.stringify(invalidData));
      });

      expect(importResult.success).toBe(false);
      expect(importResult.error).toBe('Invalid bookmark data format');
    });

    it('handles malformed bookmarks array', () => {
      const { result } = renderHook(() => useBookmarks());

      const malformedData = {
        bookmarks: 'not-an-array'
      };

      let importResult;
      act(() => {
        importResult = result.current.importBookmarks(JSON.stringify(malformedData));
      });

      expect(importResult.success).toBe(false);
      expect(importResult.error).toBe('Invalid bookmark data format');
    });

    it('uses merge option as default', () => {
      const { result } = renderHook(() => useBookmarks());

      // Add existing bookmark
      act(() => {
        result.current.addBookmark(mockCondition3);
      });

      // Import without specifying options (should default to merge: true)
      act(() => {
        result.current.importBookmarks(JSON.stringify(validImportData));
      });

      expect(result.current.bookmarkedConditions).toHaveLength(3); // Merged result
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles corrupted localStorage data', () => {
      mockLocalStorage.setItem('bookmarkedConditions', 'invalid-json');

      // Should not throw, should initialize with empty array
      const { result } = renderHook(() => useBookmarks());
      expect(result.current.bookmarkedConditions).toEqual([]);
    });

    it('handles bookmarks with missing properties', () => {
      const incompleteBookmark = {
        name: 'Incomplete Condition'
        // Missing other required properties
      };

      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(incompleteBookmark);
      });

      expect(result.current.bookmarkedConditions).toHaveLength(1);
      expect(result.current.bookmarkedConditions[0].name).toBe('Incomplete Condition');
    });

    it('maintains data integrity across re-renders', () => {
      const { result, rerender } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(mockCondition1);
      });

      const bookmarksBeforeRerender = result.current.bookmarkedConditions;
      
      rerender();

      expect(result.current.bookmarkedConditions).toEqual(bookmarksBeforeRerender);
    });

    it('handles rapid bookmark operations', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        // Rapid add/remove operations
        result.current.addBookmark(mockCondition1);
        result.current.addBookmark(mockCondition2);
        result.current.removeBookmark('Pneumonia');
        result.current.addBookmark(mockCondition3);
        result.current.toggleBookmark(mockCondition2);
      });

      // Should end up with only Cellulitis bookmarked
      expect(result.current.bookmarkedConditions).toHaveLength(1);
      expect(result.current.bookmarkedConditions[0].name).toBe('Cellulitis');
    });

    it('handles category filtering with undefined categories', () => {
      const bookmarkWithoutCategory = {
        ...mockCondition1,
        category: undefined,
        bookmarkedAt: '2025-01-01T10:00:00.000Z',
        bookmarkId: 'bookmark-1'
      };

      mockLocalStorage.setItem('bookmarkedConditions', JSON.stringify([bookmarkWithoutCategory]));
      const { result } = renderHook(() => useBookmarks());

      const undefinedCategoryBookmarks = result.current.getBookmarksByCategory('undefined');
      expect(undefinedCategoryBookmarks).toHaveLength(0);
    });
  });
});