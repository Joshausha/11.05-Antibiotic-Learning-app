/**
 * useNorthwesternErrorRecovery Hook Tests
 * Tests for the error recovery system hook
 * @created 2025-01-08
 */

import { renderHook, act } from '@testing-library/react';
import useNorthwesternErrorRecovery from '../useNorthwesternErrorRecovery';

// Mock window.caches API
const mockCacheMatch = jest.fn();
const mockCacheOpen = jest.fn(() => Promise.resolve({
  match: mockCacheMatch,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockCacheMatch.mockResolvedValue(null);

  // Mock caches API
  Object.defineProperty(window, 'caches', {
    value: {
      open: mockCacheOpen,
    },
    writable: true,
    configurable: true,
  });

  // Mock console methods
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useNorthwesternErrorRecovery', () => {
  describe('Initial State', () => {
    test('initializes with empty component errors', () => {
      const { result } = renderHook(() => useNorthwesternErrorRecovery());

      expect(result.current.componentErrors.size).toBe(0);
      expect(result.current.errorCount).toBe(0);
    });

    test('initializes with errorRecoveryActive as false', () => {
      const { result } = renderHook(() => useNorthwesternErrorRecovery());

      expect(result.current.errorRecoveryActive).toBe(false);
    });

    test('initializes with offlineMode as false', () => {
      const { result } = renderHook(() => useNorthwesternErrorRecovery());

      expect(result.current.offlineMode).toBe(false);
    });

    test('initializes with empty loadedComponents', () => {
      const { result } = renderHook(() => useNorthwesternErrorRecovery());

      expect(result.current.loadedComponents.size).toBe(0);
    });
  });

  describe('Configuration Options', () => {
    test('accepts enabled option', () => {
      const { result } = renderHook(() =>
        useNorthwesternErrorRecovery({ enabled: false })
      );

      expect(result.current).toBeDefined();
    });

    test('accepts integrationStartTime option', () => {
      const { result } = renderHook(() =>
        useNorthwesternErrorRecovery({ integrationStartTime: Date.now() - 5000 })
      );

      expect(result.current).toBeDefined();
    });

    test('accepts performanceMonitor ref', () => {
      const mockPerformanceMonitor = {
        current: {
          recordClinicalMetric: jest.fn(),
        },
      };

      const { result } = renderHook(() =>
        useNorthwesternErrorRecovery({ performanceMonitor: mockPerformanceMonitor })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('setOfflineMode', () => {
    test('can set offline mode directly', () => {
      const { result } = renderHook(() => useNorthwesternErrorRecovery());

      expect(result.current.offlineMode).toBe(false);

      act(() => {
        result.current.setOfflineMode(true);
      });

      expect(result.current.offlineMode).toBe(true);

      act(() => {
        result.current.setOfflineMode(false);
      });

      expect(result.current.offlineMode).toBe(false);
    });
  });

  describe('setLoadedComponents', () => {
    test('can update loaded components set', () => {
      const { result } = renderHook(() => useNorthwesternErrorRecovery());

      const newComponents = new Set(['Component1', 'Component2', 'Component3']);

      act(() => {
        result.current.setLoadedComponents(newComponents);
      });

      expect(result.current.loadedComponents.size).toBe(3);
      expect(result.current.loadedComponents.has('Component1')).toBe(true);
      expect(result.current.loadedComponents.has('Component2')).toBe(true);
    });
  });

  describe('handleComponentError', () => {
    test('calls onErrorRecovery callback when provided', () => {
      const mockOnErrorRecovery = jest.fn();

      const { result } = renderHook(() =>
        useNorthwesternErrorRecovery({
          enabled: false,
          onErrorRecovery: mockOnErrorRecovery
        })
      );

      act(() => {
        result.current.handleComponentError('TestComponent', new Error('Test error'));
      });

      expect(mockOnErrorRecovery).toHaveBeenCalled();
      expect(mockOnErrorRecovery).toHaveBeenCalledWith(
        expect.objectContaining({
          component: 'TestComponent',
          error: 'Test error',
        }),
        expect.any(Object)
      );
    });

    test('calls announceToScreenReader for render errors with basic-list-view fallback', () => {
      const mockAnnounce = jest.fn();

      const { result } = renderHook(() =>
        useNorthwesternErrorRecovery({
          enabled: false,
          announceToScreenReader: mockAnnounce
        })
      );

      act(() => {
        result.current.handleComponentError(
          'TestComponent',
          new Error('render error')
        );
      });

      expect(mockAnnounce).toHaveBeenCalledWith(
        'System error detected. Switching to simplified interface for continued clinical access.',
        'assertive'
      );
    });

    test('calls performanceMonitor when provided', () => {
      const mockRecordMetric = jest.fn();
      const mockPerformanceMonitor = {
        current: {
          recordClinicalMetric: mockRecordMetric,
        },
      };

      const { result } = renderHook(() =>
        useNorthwesternErrorRecovery({
          enabled: false,
          performanceMonitor: mockPerformanceMonitor
        })
      );

      act(() => {
        result.current.handleComponentError(
          'TestComponent',
          new Error('memory exhaustion error')
        );
      });

      expect(mockRecordMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component-error',
          component: 'TestComponent',
        })
      );
    });
  });

  describe('clearErrors', () => {
    test('clears component errors', () => {
      const mockOnErrorRecovery = jest.fn();

      const { result } = renderHook(() =>
        useNorthwesternErrorRecovery({
          enabled: false,
          onErrorRecovery: mockOnErrorRecovery
        })
      );

      // Trigger an error first
      act(() => {
        result.current.handleComponentError('Component1', new Error('Error 1'));
      });

      // Now clear
      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.componentErrors.size).toBe(0);
      expect(result.current.errorCount).toBe(0);
    });
  });

  describe('Error Recovery (enabled)', () => {
    test('triggers recovery when enabled', () => {
      const mockOnErrorRecovery = jest.fn();

      const { result } = renderHook(() =>
        useNorthwesternErrorRecovery({
          enabled: true,
          onErrorRecovery: mockOnErrorRecovery
        })
      );

      act(() => {
        result.current.handleComponentError('Component1', new Error('Test error'));
      });

      // Recovery should be triggered
      expect(mockOnErrorRecovery).toHaveBeenCalled();
    });
  });

  describe('Hook Return Values', () => {
    test('returns expected functions and state', () => {
      const { result } = renderHook(() => useNorthwesternErrorRecovery());

      // Check all expected return values
      expect(result.current.componentErrors).toBeInstanceOf(Map);
      expect(typeof result.current.errorRecoveryActive).toBe('boolean');
      expect(typeof result.current.offlineMode).toBe('boolean');
      expect(result.current.loadedComponents).toBeInstanceOf(Set);
      expect(typeof result.current.handleComponentError).toBe('function');
      expect(typeof result.current.clearErrors).toBe('function');
      expect(typeof result.current.setOfflineMode).toBe('function');
      expect(typeof result.current.setLoadedComponents).toBe('function');
      expect(typeof result.current.errorCount).toBe('number');
    });
  });
});
