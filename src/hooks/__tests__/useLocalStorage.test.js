/**
 * Tests for useLocalStorage hook
 * @description Comprehensive test suite for the localStorage persistence hook
 */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useLocalStorage from '../useLocalStorage';

// Mock localStorage
const mockStore = {};

const localStorageMock = {
  getItem: jest.fn().mockImplementation((key) => {
    return mockStore[key] !== undefined ? mockStore[key] : null;
  }),
  setItem: jest.fn().mockImplementation((key, value) => {
    mockStore[key] = value;
  }),
  removeItem: jest.fn().mockImplementation((key) => {
    delete mockStore[key];
  }),
  clear: jest.fn().mockImplementation(() => {
    Object.keys(mockStore).forEach(key => {
      delete mockStore[key];
    });
  }),
  get length() {
    return Object.keys(mockStore).length;
  },
  key: jest.fn().mockImplementation((index) => Object.keys(mockStore)[index] || null)
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    // Reset the store by clearing all keys
    Object.keys(mockStore).forEach(key => {
      delete mockStore[key];
    });
    // Reset call history but preserve the implementation
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    
    // Restore implementations since mockClear() clears them
    localStorageMock.getItem.mockImplementation((key) => {
      return mockStore[key] !== undefined ? mockStore[key] : null;
    });
    localStorageMock.setItem.mockImplementation((key, value) => {
      mockStore[key] = value;
    });
    localStorageMock.removeItem.mockImplementation((key) => {
      delete mockStore[key];
    });
    localStorageMock.clear.mockImplementation(() => {
      Object.keys(mockStore).forEach(key => {
        delete mockStore[key];
      });
    });
  });

  test('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('initial-value');
  });

  test('returns stored value from localStorage', () => {
    // Pre-populate localStorage using the mock setItem method to ensure proper setup
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  test('stores value in localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  test('handles complex objects', () => {
    const complexObject = { name: 'test', items: [1, 2, 3], nested: { value: true } };
    
    const { result } = renderHook(() => useLocalStorage('test-object', null));
    
    act(() => {
      result.current[1](complexObject);
    });
    
    expect(result.current[0]).toEqual(complexObject);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-object', JSON.stringify(complexObject));
  });

  test('handles functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-counter', 0));
    
    act(() => {
      result.current[1](prev => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
    
    act(() => {
      result.current[1](prev => prev * 2);
    });
    
    expect(result.current[0]).toBe(2);
  });

  test('removes item from localStorage when value is undefined', () => {
    localStorageMock.setItem('test-key', JSON.stringify('some-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1](undefined);
    });
    
    expect(result.current[0]).toBeUndefined();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  test('handles JSON parse errors gracefully', () => {
    // Set up console spy BEFORE setting invalid JSON
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Make getItem return invalid JSON
    localStorageMock.getItem.mockReturnValueOnce('invalid-json{');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback-value'));
    
    // Should fallback to initial value when JSON parsing fails
    expect(result.current[0]).toBe('fallback-value');
    // Console warning should have been called
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error reading localStorage key'),
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  test('handles localStorage write errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    // Should still update state even if localStorage fails
    expect(result.current[0]).toBe('new-value');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('clearValue function removes the value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('some-value');
    });
    
    expect(result.current[0]).toBe('some-value');
    
    act(() => {
      result.current[2].clearValue();
    });
    
    expect(result.current[0]).toBeUndefined();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  test('hasValue function checks for existence', () => {
    // Use a unique key and ensure it doesn't exist
    const uniqueKey = 'unique-hasValue-test-key';
    // Make sure this key doesn't exist in the store
    delete mockStore[uniqueKey];
    
    const { result } = renderHook(() => useLocalStorage(uniqueKey, 'initial'));
    
    // Initially no value stored in localStorage
    expect(result.current[2].hasValue()).toBe(false);
    
    act(() => {
      result.current[1]('some-value');
    });
    
    expect(result.current[2].hasValue()).toBe(true);
  });

  test('sets up storage event listener', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });

  test('works with different data types', () => {
    // String
    const { result: stringResult } = renderHook(() => useLocalStorage('string-key', 'test'));
    expect(stringResult.current[0]).toBe('test');
    
    // Number
    const { result: numberResult } = renderHook(() => useLocalStorage('number-key', 42));
    expect(numberResult.current[0]).toBe(42);
    
    // Boolean
    const { result: boolResult } = renderHook(() => useLocalStorage('bool-key', true));
    expect(boolResult.current[0]).toBe(true);
    
    // Array
    const { result: arrayResult } = renderHook(() => useLocalStorage('array-key', [1, 2, 3]));
    expect(arrayResult.current[0]).toEqual([1, 2, 3]);
    
    // Object
    const { result: objectResult } = renderHook(() => useLocalStorage('object-key', { test: 'value' }));
    expect(objectResult.current[0]).toEqual({ test: 'value' });
  });

  // Enhanced Phase 2 testing for edge cases and performance
  
  test('handles extremely large data structures', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      data: `item-${i}`.repeat(10),
      nested: { value: i * 2 }
    }));
    
    const { result } = renderHook(() => useLocalStorage('large-data', []));
    
    act(() => {
      result.current[1](largeArray);
    });
    
    expect(result.current[0]).toEqual(largeArray);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('large-data', JSON.stringify(largeArray));
  });

  test('handles circular reference objects gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const circularObj = { name: 'test' };
    circularObj.self = circularObj; // Create circular reference
    
    const { result } = renderHook(() => useLocalStorage('circular-test', null));
    
    act(() => {
      result.current[1](circularObj);
    });
    
    // Should handle the error gracefully and maintain current state
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('synchronizes between multiple hook instances with same key', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('shared-key', 'initial'));
    const { result: result2 } = renderHook(() => useLocalStorage('shared-key', 'initial'));
    
    expect(result1.current[0]).toBe('initial');
    expect(result2.current[0]).toBe('initial');
    
    act(() => {
      result1.current[1]('updated-value');
    });
    
    // Manually trigger storage event to simulate cross-hook synchronization
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'shared-key',
        newValue: JSON.stringify('updated-value'),
        oldValue: JSON.stringify('initial')
      });
      window.dispatchEvent(storageEvent);
    });
    
    // Both hooks should have the updated value
    expect(result1.current[0]).toBe('updated-value');
    expect(result2.current[0]).toBe('updated-value');
  });

  test('handles storage events from other tabs/windows', () => {
    const { result } = renderHook(() => useLocalStorage('cross-tab-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    
    // Simulate storage event from another tab
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'cross-tab-key',
        newValue: JSON.stringify('external-update'),
        oldValue: JSON.stringify('initial')
      });
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toBe('external-update');
  });

  test('ignores storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('my-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    
    // Simulate storage event for different key
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'other-key',
        newValue: JSON.stringify('other-value'),
        oldValue: null
      });
      window.dispatchEvent(storageEvent);
    });
    
    // Value should remain unchanged
    expect(result.current[0]).toBe('initial');
  });

  test('handles null values correctly', () => {
    const { result } = renderHook(() => useLocalStorage('null-test', 'default'));
    
    act(() => {
      result.current[1](null);
    });
    
    expect(result.current[0]).toBe(null);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('null-test', JSON.stringify(null));
  });

  test('performance: rapid successive updates', () => {
    const { result } = renderHook(() => useLocalStorage('performance-test', 0));
    
    // Perform individual rapid updates
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current[1](prev => prev + 1);
      });
    }
    
    // Should handle rapid updates correctly
    expect(result.current[0]).toBe(10);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(10);
  });

  test('handles localStorage being disabled/unavailable', () => {
    const originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage');
    
    // Mock localStorage as unavailable
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      writable: true
    });
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { result } = renderHook(() => useLocalStorage('unavailable-test', 'fallback'));
    
    // Should still work with in-memory state
    expect(result.current[0]).toBe('fallback');
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    
    // Restore localStorage
    if (originalLocalStorage) {
      Object.defineProperty(window, 'localStorage', originalLocalStorage);
    }
    
    consoleSpy.mockRestore();
  });

  test('validates key parameter', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Test with invalid key types
    renderHook(() => useLocalStorage(null, 'test'));
    renderHook(() => useLocalStorage(undefined, 'test'));
    renderHook(() => useLocalStorage(123, 'test'));
    
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('handles setValue with same value (no unnecessary storage writes)', () => {
    const { result } = renderHook(() => useLocalStorage('optimization-test', 'initial'));
    
    localStorageMock.setItem.mockClear();
    
    act(() => {
      result.current[1]('initial'); // Same value
    });
    
    // Should not call setItem if value hasn't changed
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});