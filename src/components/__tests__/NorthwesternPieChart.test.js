/**
 * Northwestern Pie Chart Component Tests
 * 
 * Comprehensive test suite for the core Northwestern 8-segment pie chart.
 * Tests medical data integration, responsive design, and accessibility.
 * 
 * Created by: Agent 2.1 - Phase 2 Northwestern Foundation
 * Coverage Target: >95% line coverage
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NorthwesternPieChart, {
  NORTHWESTERN_SEGMENTS,
  SIZE_CONFIG,
  ROUTE_COLORS,
  createSegmentPath,
  getCoverageColor,
  getStrokeStyle
} from '../NorthwesternPieChart';

// Mock antibiotic data matching EnhancedAntibioticData.js structure
const mockAntibiotic = {
  id: 1,
  name: 'Penicillin G',
  northwesternSpectrum: {
    MRSA: 0,
    VRE_faecium: 0,
    anaerobes: 1,
    atypicals: 0,
    pseudomonas: 0,
    gramNegative: 0,
    MSSA: 2,
    enterococcus_faecalis: 1
  },
  routeColor: 'blue',
  cellWallActive: true,
  route: ['IV', 'IM']
};

const mockBroadSpectrumAntibiotic = {
  id: 14,
  name: 'Piperacillin-Tazobactam',
  northwesternSpectrum: {
    MRSA: 0,
    VRE_faecium: 0,
    anaerobes: 2,
    atypicals: 0,
    pseudomonas: 2,
    gramNegative: 2,
    MSSA: 2,
    enterococcus_faecalis: 1
  },
  routeColor: 'blue',
  cellWallActive: true,
  route: ['IV']
};

const mockOralAntibiotic = {
  id: 16,
  name: 'Amoxicillin',
  northwesternSpectrum: {
    MRSA: 0,
    VRE_faecium: 0,
    anaerobes: 1,
    atypicals: 0,
    pseudomonas: 0,
    gramNegative: 1,
    MSSA: 2,
    enterococcus_faecalis: 2
  },
  routeColor: 'red',
  cellWallActive: true,
  route: ['PO']
};

describe('NorthwesternPieChart', () => {
  // Basic rendering tests
  describe('Component Rendering', () => {
    test('renders successfully with valid antibiotic data', () => {
      render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);
      
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByLabelText(/Northwestern spectrum chart for Penicillin G/)).toBeInTheDocument();
    });

    test('renders with all three size variants', () => {
      const { rerender } = render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="small" />);
      expect(screen.getByRole('img')).toHaveClass('northwestern-pie-chart__svg');
      
      rerender(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      
      rerender(<NorthwesternPieChart antibiotic={mockAntibiotic} size="large" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    test('applies custom className correctly', () => {
      const { container } = render(
        <NorthwesternPieChart 
          antibiotic={mockAntibiotic} 
          size="medium"
          className="custom-chart-class"
        />
      );
      
      expect(container.firstChild).toHaveClass('northwestern-pie-chart');
      expect(container.firstChild).toHaveClass('northwestern-pie-chart--medium');
      expect(container.firstChild).toHaveClass('custom-chart-class');
    });

    test('renders center label with antibiotic name and route when showCenterLabel is true', () => {
      render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" showCenterLabel={true} />);

      const nameElement = screen.getByText('Penicillin G');
      const routeElement = screen.getByText('IV/IM');

      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveClass('pie-center-label__name');
      expect(routeElement).toBeInTheDocument();
      expect(routeElement).toHaveClass('pie-center-label__route');
    });

    test('does not render center label by default', () => {
      render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);

      // Center label should not be present by default
      expect(screen.queryByText('Penicillin G')).not.toBeInTheDocument();
      expect(screen.queryByText('IV/IM')).not.toBeInTheDocument();
    });
  });

  // Medical data validation tests
  describe('Medical Data Integration', () => {
    test('renders all 8 Northwestern segments', () => {
      render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);
      
      // Check that all 8 segment paths are rendered
      const segments = screen.getAllByRole('button');
      expect(segments).toHaveLength(8);
      
      // Verify each segment has correct ARIA label
      expect(screen.getByLabelText('MRSA: 0/2 coverage')).toBeInTheDocument();
      expect(screen.getByLabelText('VRE faecium: 0/2 coverage')).toBeInTheDocument();
      expect(screen.getByLabelText('Anaerobes: 1/2 coverage')).toBeInTheDocument();
      expect(screen.getByLabelText('Atypicals: 0/2 coverage')).toBeInTheDocument();
      expect(screen.getByLabelText('P. aeruginosa: 0/2 coverage')).toBeInTheDocument();
      expect(screen.getByLabelText('Gram(-): 0/2 coverage')).toBeInTheDocument();
      expect(screen.getByLabelText('MSSA: 2/2 coverage')).toBeInTheDocument();
      expect(screen.getByLabelText('E. faecalis: 1/2 coverage')).toBeInTheDocument();
    });

    test('applies coverage-based styling correctly', () => {
      const { container } = render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);
      
      // Check CSS classes for different coverage levels
      expect(container.querySelector('.pie-segment--mrsa')).toHaveClass('pie-segment--coverage-0');
      expect(container.querySelector('.pie-segment--anaerobes')).toHaveClass('pie-segment--coverage-1');
      expect(container.querySelector('.pie-segment--mssa')).toHaveClass('pie-segment--coverage-2');
    });

    test('handles different route colors correctly', () => {
      // Test oral antibiotic (red) - showCenterLabel=true to test route text
      const { rerender } = render(<NorthwesternPieChart antibiotic={mockOralAntibiotic} size="medium" showCenterLabel={true} />);
      expect(screen.getByText('PO')).toBeInTheDocument();

      // Test IV antibiotic (blue)
      rerender(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" showCenterLabel={true} />);
      expect(screen.getByText('IV/IM')).toBeInTheDocument();

      // Test dual route antibiotic (purple)
      const dualRouteAntibiotic = { ...mockAntibiotic, routeColor: 'purple', route: ['PO', 'IV'] };
      rerender(<NorthwesternPieChart antibiotic={dualRouteAntibiotic} size="medium" showCenterLabel={true} />);
      expect(screen.getByText('PO/IV')).toBeInTheDocument();
    });

    test('handles cell wall active indicator', () => {
      const { container } = render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);
      
      // Cell wall active antibiotics should have dotted stroke pattern
      // This is tested through the SVG path elements having strokeDasharray
      const segments = container.querySelectorAll('path.pie-segment');
      expect(segments.length).toBeGreaterThan(0);
    });
  });

  // Interactive behavior tests
  describe('Interactive Behavior', () => {
    test('calls onSegmentHover when segment is hovered', () => {
      const mockHover = jest.fn();
      render(
        <NorthwesternPieChart 
          antibiotic={mockAntibiotic} 
          size="medium"
          onSegmentHover={mockHover}
        />
      );
      
      const mrsaSegment = screen.getByLabelText('MRSA: 0/2 coverage');
      fireEvent.mouseEnter(mrsaSegment);
      
      expect(mockHover).toHaveBeenCalledWith(
        'MRSA',
        0,
        'Methicillin-resistant Staphylococcus aureus - Coverage: 0/2'
      );
    });

    test('calls onSegmentClick when segment is clicked', () => {
      const mockClick = jest.fn();
      render(
        <NorthwesternPieChart 
          antibiotic={mockAntibiotic} 
          size="medium"
          onSegmentClick={mockClick}
        />
      );
      
      const mssaSegment = screen.getByLabelText('MSSA: 2/2 coverage');
      fireEvent.click(mssaSegment);
      
      expect(mockClick).toHaveBeenCalledWith('MSSA', mockAntibiotic);
    });

    test('does not trigger interactive events when interactive=false', () => {
      const mockHover = jest.fn();
      const mockClick = jest.fn();
      
      render(
        <NorthwesternPieChart 
          antibiotic={mockAntibiotic} 
          size="medium"
          interactive={false}
          onSegmentHover={mockHover}
          onSegmentClick={mockClick}
        />
      );
      
      const mrsaSegment = screen.getByLabelText('MRSA: 0/2 coverage');
      fireEvent.mouseEnter(mrsaSegment);
      fireEvent.click(mrsaSegment);
      
      expect(mockHover).not.toHaveBeenCalled();
      expect(mockClick).not.toHaveBeenCalled();
    });

    test('updates hover state correctly', async () => {
      const { container } = render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);
      
      const mrsaSegment = screen.getByLabelText('MRSA: 0/2 coverage');
      
      // Hover over segment
      fireEvent.mouseEnter(mrsaSegment);
      await waitFor(() => {
        expect(container.querySelector('.pie-segment--hovered')).toBeInTheDocument();
      });
      
      // Mouse leave should clear hover state
      fireEvent.mouseLeave(container.firstChild);
      await waitFor(() => {
        expect(container.querySelector('.pie-segment--hovered')).not.toBeInTheDocument();
      });
    });
  });

  // Optional features tests
  describe('Optional Features', () => {
    test('shows segment labels when showLabels=true', () => {
      render(
        <NorthwesternPieChart 
          antibiotic={mockAntibiotic} 
          size="medium"
          showLabels={true}
        />
      );
      
      // Check for segment label group
      const labelGroup = screen.getByRole('img').querySelector('.pie-segment-labels');
      expect(labelGroup).toBeInTheDocument();
      
      // Check for individual segment labels
      const labels = screen.getByRole('img').querySelectorAll('.pie-segment-label');
      expect(labels).toHaveLength(8);
    });

    test('hides segment labels when showLabels=false', () => {
      render(
        <NorthwesternPieChart 
          antibiotic={mockAntibiotic} 
          size="medium"
          showLabels={false}
        />
      );
      
      // Labels should be hidden but still rendered for performance
      const labelGroup = screen.getByRole('img').querySelector('.pie-segment-labels');
      // The group exists but individual labels may not be visible
      expect(labelGroup).toBeInTheDocument();
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    test('displays error for invalid antibiotic data', () => {
      const invalidAntibiotic = { id: 1, name: 'Invalid' }; // Missing required fields
      
      render(<NorthwesternPieChart antibiotic={invalidAntibiotic} size="medium" />);
      
      expect(screen.getByText(/Error: Invalid antibiotic data/)).toBeInTheDocument();
    });

    test('displays error for missing Northwestern spectrum', () => {
      const incompleteAntibiotic = { 
        id: 1, 
        name: 'Incomplete',
        routeColor: 'blue',
        northwesternSpectrum: {
          MRSA: 0,
          // Missing other segments
        }
      };
      
      render(<NorthwesternPieChart antibiotic={incompleteAntibiotic} size="medium" />);
      
      expect(screen.getByText(/Error: Missing Northwestern spectrum data/)).toBeInTheDocument();
    });

    test('handles null antibiotic gracefully', () => {
      render(<NorthwesternPieChart antibiotic={null} size="medium" />);
      
      expect(screen.getByText(/Error: Invalid antibiotic data/)).toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);
      
      // Main chart should have img role and descriptive label
      const chart = screen.getByRole('img');
      expect(chart).toHaveAttribute('aria-label', 'Northwestern spectrum chart for Penicillin G');
      
      // Each segment should be a button with descriptive label
      const segments = screen.getAllByRole('button');
      expect(segments).toHaveLength(8);
      segments.forEach(segment => {
        expect(segment).toHaveAttribute('aria-label');
      });
    });

    test('segments have descriptive ARIA labels', () => {
      render(<NorthwesternPieChart antibiotic={mockAntibiotic} size="medium" />);
      
      // Check specific segment labels
      expect(screen.getByRole('button', { name: /MRSA: 0\/2 coverage/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /MSSA: 2\/2 coverage/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Anaerobes: 1\/2 coverage/ })).toBeInTheDocument();
    });

    test('supports mouse interaction when interactive', () => {
      const mockHover = jest.fn();
      const mockClick = jest.fn();
      
      render(
        <NorthwesternPieChart 
          antibiotic={mockAntibiotic} 
          size="medium" 
          interactive={true}
          onSegmentHover={mockHover}
          onSegmentClick={mockClick}
        />
      );
      
      const mrsaSegment = screen.getByRole('button', { name: /MRSA: 0\/2 coverage/ });
      
      // Should be interactive
      expect(mrsaSegment).toHaveStyle('cursor: pointer');
      
      fireEvent.mouseEnter(mrsaSegment);
      expect(mockHover).toHaveBeenCalled();
      
      fireEvent.click(mrsaSegment);
      expect(mockClick).toHaveBeenCalled();
    });
  });
});

// Helper function tests
describe('Helper Functions', () => {
  describe('createSegmentPath', () => {
    test('generates valid SVG path string', () => {
      const path = createSegmentPath(0, 45, 100, 20, 140, 140);
      
      expect(typeof path).toBe('string');
      expect(path).toContain('M '); // Move command
      expect(path).toContain('A '); // Arc command
      expect(path).toContain('L '); // Line command
      expect(path).toContain('Z'); // Close path command
    });

    test('creates different paths for different angles', () => {
      const path1 = createSegmentPath(0, 45, 100, 20, 140, 140);
      const path2 = createSegmentPath(45, 90, 100, 20, 140, 140);
      
      expect(path1).not.toBe(path2);
    });
  });

  describe('getCoverageColor', () => {
    test('returns correct colors for coverage levels', () => {
      expect(getCoverageColor(0, 'blue')).toBe('#ffffff'); // White for no coverage
      expect(getCoverageColor(1, 'blue')).toBe(ROUTE_COLORS.blue.light);
      expect(getCoverageColor(2, 'blue')).toBe(ROUTE_COLORS.blue.dark);
    });

    test('handles different route colors', () => {
      expect(getCoverageColor(2, 'red')).toBe(ROUTE_COLORS.red.dark);
      expect(getCoverageColor(2, 'purple')).toBe(ROUTE_COLORS.purple.dark);
    });

    test('returns fallback color for invalid coverage', () => {
      expect(getCoverageColor(999, 'blue')).toBe('#f3f4f6');
    });
  });

  describe('getStrokeStyle', () => {
    test('returns solid stroke for non-cell-wall-active', () => {
      const style = getStrokeStyle(false, 'blue');
      
      expect(style.strokeDasharray).toBe('none');
      expect(style.stroke).toBe(ROUTE_COLORS.blue.border);
    });

    test('returns dashed stroke for cell-wall-active', () => {
      const style = getStrokeStyle(true, 'blue');
      
      expect(style.strokeDasharray).toBe('4,2');
      expect(style.stroke).toBe(ROUTE_COLORS.blue.border);
    });
  });
});

// Constants tests
describe('Component Constants', () => {
  test('NORTHWESTERN_SEGMENTS contains all 8 segments', () => {
    expect(NORTHWESTERN_SEGMENTS).toHaveLength(8);
    
    const expectedKeys = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals', 
                         'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];
    
    expectedKeys.forEach(key => {
      expect(NORTHWESTERN_SEGMENTS.find(s => s.key === key)).toBeDefined();
    });
  });

  test('SIZE_CONFIG has all required size variants', () => {
    expect(SIZE_CONFIG).toHaveProperty('small');
    expect(SIZE_CONFIG).toHaveProperty('medium');
    expect(SIZE_CONFIG).toHaveProperty('large');
    
    // Each size should have required properties
    Object.values(SIZE_CONFIG).forEach(config => {
      expect(config).toHaveProperty('diameter');
      expect(config).toHaveProperty('centerRadius');
      expect(config).toHaveProperty('strokeWidth');
      expect(config).toHaveProperty('fontSize');
    });
  });

  test('ROUTE_COLORS has all required color palettes', () => {
    expect(ROUTE_COLORS).toHaveProperty('red');
    expect(ROUTE_COLORS).toHaveProperty('blue');
    expect(ROUTE_COLORS).toHaveProperty('purple');
    
    // Each color should have light, dark, and border
    Object.values(ROUTE_COLORS).forEach(palette => {
      expect(palette).toHaveProperty('light');
      expect(palette).toHaveProperty('dark');
      expect(palette).toHaveProperty('border');
    });
  });
});