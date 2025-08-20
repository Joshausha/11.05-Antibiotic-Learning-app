/**
 * Tests for useErrorHandler hook
 * @description Test suite for the centralized error handling hook
 */

import { renderHook } from '@testing-library/react';
import useErrorHandler from '../useErrorHandler';

describe('useErrorHandler Hook', () => {
  let hook;

  beforeEach(() => {
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useErrorHandler());
    hook = result.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('safeExecute', () => {
    test('executes function successfully and returns result', () => {
      const testFunction = () => 'success';
      const fallback = 'failure';
      
      const result = hook.safeExecute(testFunction, fallback, 'test');
      
      expect(result).toBe('success');
    });

    test('returns fallback value when function throws error', () => {
      const testFunction = () => {
        throw new Error('Test error');
      };
      const fallback = 'fallback value';
      
      const result = hook.safeExecute(testFunction, fallback, 'test');
      
      expect(result).toBe('fallback value');
      expect(console.error).toHaveBeenCalledWith('❌ test hook failed:', expect.any(Error));
    });

    test('handles functions that return undefined', () => {
      const testFunction = () => undefined;
      const fallback = 'fallback';
      
      const result = hook.safeExecute(testFunction, fallback, 'test');
      
      expect(result).toBeUndefined();
    });

    test('handles functions that return falsy values', () => {
      const testFunction = () => 0;
      const fallback = 'fallback';
      
      const result = hook.safeExecute(testFunction, fallback, 'test');
      
      expect(result).toBe(0);
    });
  });

  describe('withErrorHandling', () => {
    test('wraps hook execution with error handling', () => {
      const mockHook = () => ({ data: 'test' });
      const fallback = { data: 'fallback' };
      
      const result = hook.withErrorHandling(mockHook, fallback, 'testHook');
      
      expect(result).toEqual({ data: 'test' });
    });

    test('returns fallback when hook throws error', () => {
      const mockHook = () => {
        throw new Error('Hook error');
      };
      const fallback = { data: 'fallback' };
      
      const result = hook.withErrorHandling(mockHook, fallback, 'testHook');
      
      expect(result).toEqual({ data: 'fallback' });
      expect(console.error).toHaveBeenCalledWith('❌ testHook hook failed:', expect.any(Error));
    });
  });

  describe('fallbacks', () => {
    test('provides quizProgress fallback with correct structure', () => {
      const fallback = hook.fallbacks.quizProgress;
      
      expect(fallback).toHaveProperty('stats');
      expect(fallback.stats).toHaveProperty('totalQuizzes', 0);
      expect(fallback.stats).toHaveProperty('averageScore', 0);
      expect(fallback).toHaveProperty('recentQuizzes', []);
      expect(typeof fallback.clearHistory).toBe('function');
      expect(typeof fallback.submitQuiz).toBe('function');
    });

    test('provides bookmarks fallback with correct structure', () => {
      const fallback = hook.fallbacks.bookmarks;
      
      expect(fallback).toHaveProperty('bookmarkedConditions', []);
      expect(typeof fallback.isBookmarked).toBe('function');
      expect(typeof fallback.toggleBookmark).toBe('function');
      
      // Test that fallback functions don't throw
      expect(() => fallback.isBookmarked('test')).not.toThrow();
      expect(() => fallback.toggleBookmark({})).not.toThrow();
      expect(fallback.isBookmarked('test')).toBe(false);
    });

    test('provides pathogenData fallback with correct structure', () => {
      const fallback = hook.fallbacks.pathogenData;
      
      expect(fallback).toHaveProperty('pathogens', []);
      expect(fallback).toHaveProperty('selectedPathogen', null);
      expect(fallback).toHaveProperty('isLoading', false);
      expect(typeof fallback.searchPathogens).toBe('function');
      expect(typeof fallback.selectPathogen).toBe('function');
    });

    test('provides searchData fallback function that returns correct structure', () => {
      const items = [{ id: 1, name: 'test' }];
      const fallback = hook.fallbacks.searchData(items);
      
      expect(fallback).toHaveProperty('searchTerm', '');
      expect(fallback).toHaveProperty('filteredItems', items);
      expect(typeof fallback.setSearchTerm).toBe('function');
      
      // Test that fallback function doesn't throw
      expect(() => fallback.setSearchTerm('test')).not.toThrow();
    });
  });

  describe('error context handling', () => {
    test('includes context information in error logs', () => {
      const failingFunction = () => {
        throw new Error('Specific error');
      };
      
      hook.safeExecute(failingFunction, 'fallback', 'specificContext');
      
      expect(console.error).toHaveBeenCalledWith(
        '❌ specificContext hook failed:',
        expect.objectContaining({ message: 'Specific error' })
      );
    });

    test('handles missing context gracefully', () => {
      const failingFunction = () => {
        throw new Error('No context error');
      };
      
      hook.safeExecute(failingFunction, 'fallback');
      
      expect(console.error).toHaveBeenCalledWith(
        '❌ unknown hook failed:',
        expect.any(Error)
      );
    });
  });
});