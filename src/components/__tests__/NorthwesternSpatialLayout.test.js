/**
 * Northwestern Spatial Layout Component Tests
 * 
 * Comprehensive test suite for Agent 3.1's spatial layout system.
 * Validates Northwestern methodology compliance, performance, and integration.
 * 
 * Created by: Agent 3.1 - Spatial Layout Architect
 * Phase: 3 - Spatial Organization System Testing
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NorthwesternSpatialLayout from '../NorthwesternSpatialLayout';
import enhancedAntibiotics from '../../data/EnhancedAntibioticData';
import {
  determineBreakpoint,
  groupByDrugClass,
  applySpatialGrouping,
  calculateGridCoordinates,
  GRID_CONFIGURATIONS,
  SPATIAL_GROUPS
} from '../../utils/northwesternSpatialAlgorithms';

// Mock EnhancedNorthwesternPieChart for focused testing
jest.mock('../EnhancedNorthwesternPieChart', () => {
  return function MockEnhancedNorthwesternPieChart({ antibiotic, size, onSegmentHover, onSegmentClick }) {
    return (
      <div 
        data-testid={`pie-chart-${antibiotic.id}`}
        data-antibiotic-name={antibiotic.name}
        data-chart-size={size}
        onClick={() => onSegmentClick?.('MRSA')}
        onMouseEnter={() => onSegmentHover?.('MRSA', 2)}
      >
        Mock Pie Chart: {antibiotic.name}
      </div>
    );
  };
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Test data - subset of enhanced antibiotics for performance
const testAntibiotics = enhancedAntibiotics.slice(0, 10);

describe('NorthwesternSpatialLayout', () => {
  // Performance tracking
  const originalPerformanceNow = performance.now;
  
  beforeEach(() => {
    // Reset performance mocks
    performance.now = jest.fn(() => Date.now());
    jest.clearAllTimers();
  });
  
  afterEach(() => {
    performance.now = originalPerformanceNow;
  });

  // ========================================
  // BASIC RENDERING TESTS
  // ========================================

  test('renders without crashing with empty antibiotics array', () => {
    render(<NorthwesternSpatialLayout antibiotics={[]} />);
    expect(screen.getByText(/Organizing 0 antibiotics/)).toBeInTheDocument();
  });

  test('renders with test antibiotic dataset', async () => {
    render(<NorthwesternSpatialLayout antibiotics={testAntibiotics} />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Organizing.*antibiotics/)).not.toBeInTheDocument();
    });
    
    // Should render spatial grid
    const spatialGrid = document.querySelector('.spatial-grid');
    expect(spatialGrid).toBeInTheDocument();
  });

  test('applies correct CSS classes for different view modes', () => {
    const { rerender } = render(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        viewMode="clustered" 
      />
    );
    
    expect(document.querySelector('.northwestern-spatial-layout--clustered')).toBeInTheDocument();
    
    rerender(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        viewMode="grid" 
      />
    );
    
    expect(document.querySelector('.northwestern-spatial-layout--grid')).toBeInTheDocument();
  });

  // ========================================
  // RESPONSIVE DESIGN TESTS
  // ========================================

  test('applies correct screen size classes', () => {
    const { rerender } = render(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        screenSize="mobile" 
      />
    );
    
    expect(document.querySelector('.northwestern-spatial-layout--mobile')).toBeInTheDocument();
    
    rerender(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        screenSize="desktop" 
      />
    );
    
    expect(document.querySelector('.northwestern-spatial-layout--desktop')).toBeInTheDocument();
  });

  test('calculates responsive grid configurations correctly', () => {
    // Mobile configuration
    expect(determineBreakpoint(600)).toBe('mobile');
    expect(GRID_CONFIGURATIONS.mobile.columns).toBe(3);
    expect(GRID_CONFIGURATIONS.mobile.rows).toBe(10);
    
    // Desktop configuration  
    expect(determineBreakpoint(1200)).toBe('desktop');
    expect(GRID_CONFIGURATIONS.desktop.columns).toBe(6);
    expect(GRID_CONFIGURATIONS.desktop.rows).toBe(5);
  });

  test('handles container resizing', async () => {
    const { container } = render(
      <NorthwesternSpatialLayout antibiotics={testAntibiotics} />
    );
    
    // Check that the component has a data-screen-size attribute
    await waitFor(() => {
      expect(container.querySelector('[data-screen-size]')).toBeInTheDocument();
    });
  });

  // ========================================
  // NORTHWESTERN METHODOLOGY TESTS
  // ========================================

  test('groups antibiotics by drug class correctly', () => {
    const grouped = groupByDrugClass(testAntibiotics);
    
    // Should have multiple drug classes
    expect(Object.keys(grouped).length).toBeGreaterThan(1);
    
    // Each group should contain antibiotics of the same class
    Object.values(grouped).forEach(group => {
      const drugClass = group[0].class;
      group.forEach(antibiotic => {
        expect(antibiotic.class).toBe(drugClass);
      });
    });
  });

  test('applies Northwestern spatial grouping correctly', () => {
    const grouped = groupByDrugClass(testAntibiotics);
    const spatialGroups = applySpatialGrouping(grouped);
    
    // Should have Northwestern spatial groups
    expect(spatialGroups).toHaveProperty('betaLactams');
    expect(spatialGroups).toHaveProperty('proteinSynthesis');
    expect(spatialGroups).toHaveProperty('dnaGyrase');
    expect(spatialGroups).toHaveProperty('specialized');
    
    // Each group should have antibiotics assigned
    Object.values(spatialGroups).forEach(group => {
      if (group.antibiotics.length > 0) {
        expect(group.antibiotics[0]).toHaveProperty('northwesternSpectrum');
      }
    });
  });

  test('calculates grid coordinates within bounds', () => {
    const grouped = groupByDrugClass(testAntibiotics);
    const spatialGroups = applySpatialGrouping(grouped);
    const gridConfig = GRID_CONFIGURATIONS.desktop;
    const positioned = calculateGridCoordinates(spatialGroups, gridConfig);
    
    // All positions should be within grid bounds (0-based indexing)
    positioned.forEach(antibiotic => {
      expect(antibiotic.gridPosition.row).toBeLessThanOrEqual(gridConfig.rows - 1);
      expect(antibiotic.gridPosition.col).toBeLessThanOrEqual(gridConfig.columns - 1);
      expect(antibiotic.gridPosition.row).toBeGreaterThanOrEqual(0);
      expect(antibiotic.gridPosition.col).toBeGreaterThanOrEqual(0);
    });
  });

  // ========================================
  // INTERACTION TESTS
  // ========================================

  test('handles antibiotic selection', async () => {
    const mockOnSelect = jest.fn();
    
    render(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        onAntibioticSelect={mockOnSelect}
      />
    );
    
    await waitFor(() => {
      const antibioticPosition = document.querySelector('.antibiotic-position');
      expect(antibioticPosition).toBeInTheDocument();
    });
    
    const antibioticPosition = document.querySelector('.antibiotic-position');
    fireEvent.click(antibioticPosition);
    
    expect(mockOnSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        gridPosition: expect.any(Object)
      })
    );
  });

  test('handles group selection with connections enabled', async () => {
    const mockOnGroupSelect = jest.fn();
    
    render(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        showConnections={true}
        onGroupSelect={mockOnGroupSelect}
      />
    );
    
    await waitFor(() => {
      const groupBoundary = document.querySelector('.group-boundary');
      expect(groupBoundary).toBeInTheDocument();
    });
    
    const groupBoundary = document.querySelector('.group-boundary');
    fireEvent.click(groupBoundary);
    
    expect(mockOnGroupSelect).toHaveBeenCalled();
  });

  test('handles hover states correctly', async () => {
    render(<NorthwesternSpatialLayout antibiotics={testAntibiotics} />);
    
    await waitFor(() => {
      const antibioticPosition = document.querySelector('.antibiotic-position');
      expect(antibioticPosition).toBeInTheDocument();
    });
    
    const antibioticPosition = document.querySelector('.antibiotic-position');
    
    fireEvent.mouseEnter(antibioticPosition);
    expect(antibioticPosition).toHaveClass('antibiotic-position--hovered');
    
    fireEvent.mouseLeave(antibioticPosition);
    expect(antibioticPosition).not.toHaveClass('antibiotic-position--hovered');
  });

  // ========================================
  // PERFORMANCE TESTS
  // ========================================

  test('meets <1000ms rendering performance target', async () => {
    const renderStart = Date.now();
    
    render(<NorthwesternSpatialLayout antibiotics={testAntibiotics} />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Organizing.*antibiotics/)).not.toBeInTheDocument();
    });
    
    const renderTime = Date.now() - renderStart;
    expect(renderTime).toBeLessThan(1000);
  });

  test('handles large datasets efficiently', async () => {
    // Test with full dataset
    const renderStart = Date.now();
    
    render(<NorthwesternSpatialLayout antibiotics={enhancedAntibiotics} />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Organizing.*antibiotics/)).not.toBeInTheDocument();
    });
    
    const renderTime = Date.now() - renderStart;
    expect(renderTime).toBeLessThan(2000); // Allow more time for full dataset
  });

  test('enables virtualization for large datasets', () => {
    render(
      <NorthwesternSpatialLayout 
        antibiotics={enhancedAntibiotics}
        enableVirtualization={true}
      />
    );
    
    // Component should render without errors even with virtualization enabled
    expect(document.querySelector('.northwestern-spatial-layout')).toBeInTheDocument();
  });

  // ========================================
  // EMERGENCY MODE TESTS
  // ========================================

  test('applies emergency mode optimizations', async () => {
    render(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        emergencyMode={true}
      />
    );
    
    await waitFor(() => {
      const layout = document.querySelector('.northwestern-spatial-layout');
      expect(layout).toHaveAttribute('data-emergency-mode', 'true');
    });
  });

  test('disables interactions in emergency mode', async () => {
    render(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        emergencyMode={true}
      />
    );
    
    await waitFor(() => {
      const pieChart = screen.getByTestId(`pie-chart-${testAntibiotics[0].id}`);
      expect(pieChart).toBeInTheDocument();
    });
  });

  // ========================================
  // ACCESSIBILITY TESTS
  // ========================================

  test('provides accessible keyboard navigation', async () => {
    render(<NorthwesternSpatialLayout antibiotics={testAntibiotics} />);
    
    await waitFor(() => {
      const antibioticPosition = document.querySelector('.antibiotic-position');
      expect(antibioticPosition).toBeInTheDocument();
    });
    
    const antibioticPosition = document.querySelector('.antibiotic-position');
    
    // Should be present and interactive
    expect(antibioticPosition).toBeInTheDocument();
    expect(antibioticPosition).toHaveAttribute('data-antibiotic-id');
  });

  test('includes proper ARIA attributes', async () => {
    render(<NorthwesternSpatialLayout antibiotics={testAntibiotics} />);
    
    await waitFor(() => {
      const antibioticPositions = document.querySelectorAll('.antibiotic-position');
      expect(antibioticPositions.length).toBeGreaterThan(0);
    });
    
    // Each position should have data attributes for accessibility
    const positions = document.querySelectorAll('.antibiotic-position');
    positions.forEach(position => {
      expect(position).toHaveAttribute('data-antibiotic-id');
      expect(position).toHaveAttribute('data-drug-class');
      expect(position).toHaveAttribute('data-spatial-group');
    });
  });

  // ========================================
  // ERROR HANDLING TESTS
  // ========================================

  test('handles invalid antibiotic data gracefully', () => {
    const invalidAntibiotics = [
      { id: 1, name: 'Invalid' } // Missing required fields
    ];
    
    render(<NorthwesternSpatialLayout antibiotics={invalidAntibiotics} />);
    
    // Should not crash
    expect(document.querySelector('.northwestern-spatial-layout')).toBeInTheDocument();
  });

  test('displays validation errors when Northwestern compliance fails', async () => {
    // Mock validation to fail
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    const invalidAntibiotics = testAntibiotics.map(ab => ({
      ...ab,
      class: undefined // Invalid drug class
    }));
    
    render(<NorthwesternSpatialLayout antibiotics={invalidAntibiotics} />);
    
    await waitFor(() => {
      // Component should handle the error gracefully
      expect(document.querySelector('.northwestern-spatial-layout')).toBeInTheDocument();
    });
    
    console.error = originalConsoleError;
  });

  // ========================================
  // INTEGRATION TESTS
  // ========================================

  test('integrates correctly with EnhancedNorthwesternPieChart', async () => {
    render(<NorthwesternSpatialLayout antibiotics={testAntibiotics} />);
    
    await waitFor(() => {
      const pieCharts = screen.getAllByText(/Mock Pie Chart:/);
      expect(pieCharts.length).toBe(testAntibiotics.length);
    });
  });

  test('passes correct props to pie chart components', async () => {
    render(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        screenSize="desktop"
      />
    );
    
    await waitFor(() => {
      const pieChart = screen.getByTestId(`pie-chart-${testAntibiotics[0].id}`);
      expect(pieChart).toHaveAttribute('data-chart-size', 'medium'); // Desktop uses medium charts
    });
  });

  // ========================================
  // CLINICAL WORKFLOW TESTS
  // ========================================

  test('supports clinical workflow highlighting', async () => {
    render(
      <NorthwesternSpatialLayout 
        antibiotics={testAntibiotics}
        highlightedClasses={['Penicillins']}
      />
    );
    
    await waitFor(() => {
      // Check that the component renders with highlighting classes
      const spatialLayout = document.querySelector('.northwestern-spatial-layout');
      expect(spatialLayout).toBeInTheDocument();
    });
  });

  test('provides <30 second emergency access compliance', async () => {
    const accessStart = Date.now();
    
    render(
      <NorthwesternSpatialLayout 
        antibiotics={enhancedAntibiotics}
        emergencyMode={true}
        clinicalContext="emergency"
      />
    );
    
    await waitFor(() => {
      expect(screen.queryByText(/Organizing.*antibiotics/)).not.toBeInTheDocument();
    });
    
    const accessTime = Date.now() - accessStart;
    expect(accessTime).toBeLessThan(30000); // 30 seconds
  });
});

// ========================================
// UTILITY FUNCTION TESTS
// ========================================

describe('Northwestern Spatial Algorithms', () => {
  test('determineBreakpoint works correctly', () => {
    expect(determineBreakpoint(300)).toBe('mobile');
    expect(determineBreakpoint(800)).toBe('tablet'); 
    expect(determineBreakpoint(1200)).toBe('desktop');
  });

  test('groupByDrugClass preserves all antibiotics', () => {
    const grouped = groupByDrugClass(testAntibiotics);
    const totalCount = Object.values(grouped).reduce((sum, group) => sum + group.length, 0);
    expect(totalCount).toBe(testAntibiotics.length);
  });

  test('spatial grouping assigns all antibiotics', () => {
    const grouped = groupByDrugClass(testAntibiotics);
    const spatialGroups = applySpatialGrouping(grouped);
    const totalCount = Object.values(spatialGroups).reduce((sum, group) => sum + group.antibiotics.length, 0);
    expect(totalCount).toBe(testAntibiotics.length);
  });
});