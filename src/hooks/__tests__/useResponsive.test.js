/**
 * Tests for useResponsive hook
 * @description Comprehensive test suite for the responsive design hook
 */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useResponsive from '../useResponsive';

// Mock window.innerWidth and resize events
const mockWindowWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('useResponsive Hook', () => {
  const originalInnerWidth = window.innerWidth;
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  beforeEach(() => {
    // Reset window properties
    mockWindowWidth(1024); // Default to desktop width
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  test('returns true when screen is mobile size', () => {
    mockWindowWidth(500); // Mobile width
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current).toBe(true);
  });

  test('returns false when screen is desktop size', () => {
    mockWindowWidth(1024); // Desktop width
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current).toBe(false);
  });

  test('updates when window resizes', () => {
    let resizeHandler;
    const mockAddEventListener = jest.fn((event, handler) => {
      if (event === 'resize') {
        resizeHandler = handler;
      }
    });
    window.addEventListener = mockAddEventListener;

    mockWindowWidth(1024); // Start with desktop
    
    const { result } = renderHook(() => useResponsive());
    
    // Initially desktop
    expect(result.current).toBe(false);
    
    // Simulate window resize to mobile
    act(() => {
      mockWindowWidth(500);
      if (resizeHandler) {
        resizeHandler();
      }
    });
    
    expect(result.current).toBe(true);
  });

  test('adds resize event listener on mount', () => {
    const mockAddEventListener = jest.fn();
    window.addEventListener = mockAddEventListener;
    
    renderHook(() => useResponsive());
    
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('removes resize event listener on unmount', () => {
    const mockRemoveEventListener = jest.fn();
    window.removeEventListener = mockRemoveEventListener;
    
    const { unmount } = renderHook(() => useResponsive());
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('handles multiple re-renders correctly', () => {
    mockWindowWidth(1024);
    
    const { result, rerender } = renderHook(() => useResponsive());
    
    expect(result.current).toBe(false);
    
    // Re-render multiple times
    rerender();
    rerender();
    rerender();
    
    expect(result.current).toBe(false);
  });

  test('correctly identifies breakpoint at 768px', () => {
    // Test exactly at breakpoint
    mockWindowWidth(768);
    const { result: resultAt768 } = renderHook(() => useResponsive());
    expect(resultAt768.current).toBe(false); // 768 is not less than 768
    
    // Test just below breakpoint
    mockWindowWidth(767);
    const { result: resultBelow768 } = renderHook(() => useResponsive());
    expect(resultBelow768.current).toBe(true); // 767 is less than 768
    
    // Test just above breakpoint
    mockWindowWidth(769);
    const { result: resultAbove768 } = renderHook(() => useResponsive());
    expect(resultAbove768.current).toBe(false); // 769 is not less than 768
  });

  test('works with very small mobile screens', () => {
    mockWindowWidth(320); // Small mobile
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current).toBe(true);
  });

  test('works with very large desktop screens', () => {
    mockWindowWidth(2560); // Large desktop
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current).toBe(false);
  });
});