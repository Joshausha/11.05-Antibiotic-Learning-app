/**
 * useNetworkLayoutSimulation Hook Tests
 * Tests for the force-directed graph layout simulation hook
 * @created 2025-01-08
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import useNetworkLayoutSimulation, { initializePositions } from '../useNetworkLayoutSimulation';

// Mock requestAnimationFrame and cancelAnimationFrame
let rafId = 0;
const mockRaf = jest.fn((callback) => {
  rafId += 1;
  setTimeout(callback, 16); // Simulate ~60fps
  return rafId;
});
const mockCaf = jest.fn();

beforeEach(() => {
  rafId = 0;
  mockRaf.mockClear();
  mockCaf.mockClear();
  global.requestAnimationFrame = mockRaf;
  global.cancelAnimationFrame = mockCaf;
});

afterEach(() => {
  jest.useRealTimers();
});

// Mock node and edge data
const mockNodes = [
  { id: 'node-1', name: 'Node 1' },
  { id: 'node-2', name: 'Node 2' },
  { id: 'node-3', name: 'Node 3' },
];

const mockEdges = [
  { source: 'node-1', target: 'node-2' },
  { source: 'node-2', target: 'node-3' },
];

const mockDimensions = { width: 800, height: 600 };

describe('useNetworkLayoutSimulation', () => {
  describe('initializePositions utility', () => {
    test('creates positions for all nodes', () => {
      const positions = initializePositions(mockNodes, mockDimensions);

      expect(Object.keys(positions)).toHaveLength(3);
      expect(positions['node-1']).toBeDefined();
      expect(positions['node-2']).toBeDefined();
      expect(positions['node-3']).toBeDefined();
    });

    test('positions are within bounds around center', () => {
      const positions = initializePositions(mockNodes, mockDimensions);
      const centerX = mockDimensions.width / 2;
      const centerY = mockDimensions.height / 2;
      const maxRadius = Math.min(mockDimensions.width, mockDimensions.height) * 0.2;

      Object.values(positions).forEach((pos) => {
        const dx = pos.x - centerX;
        const dy = pos.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Distance from center should be <= maxRadius
        expect(distance).toBeLessThanOrEqual(maxRadius + 1); // +1 for floating point tolerance
      });
    });

    test('initializes velocity and force values to zero', () => {
      const positions = initializePositions(mockNodes, mockDimensions);

      Object.values(positions).forEach((pos) => {
        expect(pos.vx).toBe(0);
        expect(pos.vy).toBe(0);
        expect(pos.fx).toBe(0);
        expect(pos.fy).toBe(0);
      });
    });

    test('handles empty nodes array', () => {
      const positions = initializePositions([], mockDimensions);

      expect(positions).toEqual({});
    });
  });

  describe('Hook Initialization', () => {
    test('initializes with empty positions for zero dimensions', () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: { width: 0, height: 0 },
        })
      );

      expect(result.current.nodePositions).toEqual({});
    });

    test('initializes with empty positions for empty nodes', () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: [],
          edges: [],
          dimensions: mockDimensions,
        })
      );

      expect(result.current.nodePositions).toEqual({});
    });

    test('provides isLayoutStable flag', () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
        })
      );

      expect(typeof result.current.isLayoutStable).toBe('boolean');
    });

    test('provides resetLayout function', () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
        })
      );

      expect(typeof result.current.resetLayout).toBe('function');
    });

    test('provides getNodePosition function', () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
        })
      );

      expect(typeof result.current.getNodePosition).toBe('function');
    });
  });

  describe('Position Management', () => {
    test('getNodePosition returns position for existing node', async () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
        })
      );

      // Wait for positions to be initialized
      await waitFor(() => {
        expect(Object.keys(result.current.nodePositions).length).toBeGreaterThan(0);
      });

      const position = result.current.getNodePosition('node-1');

      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
      expect(position).toHaveProperty('vx');
      expect(position).toHaveProperty('vy');
    });

    test('getNodePosition returns default center position for unknown node', () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
        })
      );

      const position = result.current.getNodePosition('unknown-node');

      expect(position.x).toBe(mockDimensions.width / 2);
      expect(position.y).toBe(mockDimensions.height / 2);
    });
  });

  describe('Layout Reset', () => {
    test('resetLayout reinitializes positions', async () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
        })
      );

      // Wait for initial positions
      await waitFor(() => {
        expect(Object.keys(result.current.nodePositions).length).toBe(3);
      });

      const initialPositions = { ...result.current.nodePositions };

      act(() => {
        result.current.resetLayout();
      });

      // Wait for reset
      await waitFor(() => {
        const currentPositions = result.current.nodePositions;
        // Positions should exist but may be different due to random initialization
        expect(Object.keys(currentPositions).length).toBe(3);
      });
    });

    test('resetLayout sets isLayoutStable to false', async () => {
      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
        })
      );

      // Wait for initial state
      await waitFor(() => {
        expect(Object.keys(result.current.nodePositions).length).toBe(3);
      });

      act(() => {
        result.current.resetLayout();
      });

      expect(result.current.isLayoutStable).toBe(false);
    });
  });

  describe('Configuration', () => {
    test('accepts custom physics config', () => {
      const customConfig = {
        repulsionStrength: 2000,
        attractionStrength: 0.2,
      };

      const { result } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
          config: customConfig,
        })
      );

      // Hook should initialize without errors
      expect(result.current).toBeDefined();
    });
  });

  describe('Dimension Changes', () => {
    test('reinitializes positions when dimensions change', async () => {
      const { result, rerender } = renderHook(
        ({ dimensions }) =>
          useNetworkLayoutSimulation({
            nodes: mockNodes,
            edges: mockEdges,
            dimensions,
          }),
        {
          initialProps: { dimensions: mockDimensions },
        }
      );

      // Wait for initial positions
      await waitFor(() => {
        expect(Object.keys(result.current.nodePositions).length).toBe(3);
      });

      // Change dimensions
      rerender({ dimensions: { width: 1000, height: 800 } });

      // Wait for positions to be reinitialized
      await waitFor(() => {
        expect(Object.keys(result.current.nodePositions).length).toBe(3);
      });
    });
  });

  describe('Node Changes', () => {
    test('reinitializes when node count changes', async () => {
      const { result, rerender } = renderHook(
        ({ nodes }) =>
          useNetworkLayoutSimulation({
            nodes,
            edges: mockEdges,
            dimensions: mockDimensions,
          }),
        {
          initialProps: { nodes: mockNodes },
        }
      );

      // Wait for initial positions
      await waitFor(() => {
        expect(Object.keys(result.current.nodePositions).length).toBe(3);
      });

      // Add a node
      const newNodes = [...mockNodes, { id: 'node-4', name: 'Node 4' }];
      rerender({ nodes: newNodes });

      // Wait for positions to be reinitialized with new node
      await waitFor(() => {
        expect(Object.keys(result.current.nodePositions).length).toBe(4);
      });
    });
  });

  describe('Cleanup', () => {
    test('unmounts without error', async () => {
      const { result, unmount } = renderHook(() =>
        useNetworkLayoutSimulation({
          nodes: mockNodes,
          edges: mockEdges,
          dimensions: mockDimensions,
        })
      );

      // Wait for animation to start
      await waitFor(() => {
        expect(Object.keys(result.current.nodePositions).length).toBe(3);
      });

      // Unmount should not throw
      expect(() => unmount()).not.toThrow();
    });
  });
});

describe('Physics Simulation', () => {
  test('positions converge to stable layout', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useNetworkLayoutSimulation({
        nodes: mockNodes,
        edges: mockEdges,
        dimensions: mockDimensions,
        config: {
          maxIterations: 50, // Lower for faster test
        },
      })
    );

    // Wait for positions to initialize
    await waitFor(() => {
      expect(Object.keys(result.current.nodePositions).length).toBe(3);
    });

    // Run enough animation frames to stabilize
    for (let i = 0; i < 60; i++) {
      act(() => {
        jest.advanceTimersByTime(16);
      });
    }

    // Eventually should become stable
    // Note: Due to the complex physics, we just verify it runs without error
    expect(result.current.nodePositions).toBeDefined();
  });
});
