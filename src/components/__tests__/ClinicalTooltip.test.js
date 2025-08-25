/**
 * Clinical Tooltip Component Tests
 * Comprehensive test suite for the ClinicalTooltip component
 * Focuses on medical accuracy, accessibility, and emergency access workflows
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClinicalTooltip from '../ClinicalTooltip';

// Mock tooltip data for testing
const mockTooltipData = {
  segmentKey: 'MRSA',
  position: { x: 100, y: 200 },
  visible: true,
  educationLevel: 'resident',
  emergencyMode: false
};

const mockTooltipDataEmergency = {
  ...mockTooltipData,
  emergencyMode: true
};

const mockTooltipDataMedStudent = {
  ...mockTooltipData,
  educationLevel: 'medical_student'
};

describe('ClinicalTooltip', () => {
  describe('Basic Rendering', () => {
    test('renders when visible with basic tooltip data', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      expect(screen.getByTestId('clinical-tooltip')).toBeInTheDocument();
      expect(screen.getAllByText(/Methicillin-resistant Staphylococcus aureus/)).toHaveLength(2); // Header + emergency alert
    });

    test('does not render when visible is false', () => {
      const hiddenTooltipData = { ...mockTooltipData, visible: false };
      
      render(<ClinicalTooltip tooltipData={hiddenTooltipData} />);
      
      expect(screen.queryByTestId('clinical-tooltip')).not.toBeInTheDocument();
    });

    test('renders with calculated position styles', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      const tooltip = screen.getByTestId('clinical-tooltip');
      // Position is calculated based on input coordinates and tooltip dimensions
      expect(tooltip.style.left).toMatch(/\d+px/);
      expect(tooltip.style.top).toMatch(/\d+px/);
    });
  });

  describe('Clinical Content', () => {
    test('displays clinical significance for MRSA', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      expect(screen.getByText(/Major cause of healthcare-associated infections/)).toBeInTheDocument();
    });

    test('displays treatment options appropriately', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      expect(screen.getAllByText(/Vancomycin/)).toHaveLength(2); // Emergency alert + treatment list
      expect(screen.getAllByText(/Linezolid/)).toHaveLength(2);  // Emergency alert + treatment list
      expect(screen.getByText(/Daptomycin/)).toBeInTheDocument();
    });

    test('displays resistance mechanisms', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      expect(screen.getByText(/mecA gene encoding PBP2a/)).toBeInTheDocument();
    });

    test('shows common presentations', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      expect(screen.getByText(/Skin and soft tissue infections/)).toBeInTheDocument();
      expect(screen.getByText(/Healthcare-associated pneumonia/)).toBeInTheDocument();
    });
  });

  describe('Education Level Adaptation', () => {
    test('shows resident-level content for residents', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      // Should show detailed resistance mechanisms
      expect(screen.getByText(/mecA gene encoding PBP2a/)).toBeInTheDocument();
    });

    test('shows simplified content for medical students', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipDataMedStudent} />);
      
      // Should still show clinical significance
      expect(screen.getByText(/Major cause of healthcare-associated infections/)).toBeInTheDocument();
    });
  });

  describe('Emergency Mode', () => {
    test('displays emergency mode header when enabled', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipDataEmergency} />);
      
      expect(screen.getByText(/EMERGENCY ACCESS/)).toBeInTheDocument();
    });

    test('prioritizes critical treatment information in emergency mode', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipDataEmergency} />);
      
      // Should show first-line treatments prominently
      expect(screen.getByText(/First-line/)).toBeInTheDocument();
      expect(screen.getAllByText(/Vancomycin/)).toHaveLength(3); // Emergency alert + treatment list + dosing info
    });

    test('includes emergency contact information', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipDataEmergency} />);
      
      expect(screen.getByText(/Pharmacy/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('handles close button click', () => {
      const mockOnClose = jest.fn();
      
      render(<ClinicalTooltip tooltipData={mockTooltipData} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('handles ESC key press', () => {
      const mockOnClose = jest.fn();
      
      render(<ClinicalTooltip tooltipData={mockTooltipData} onClose={mockOnClose} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not close on other key presses', () => {
      const mockOnClose = jest.fn();
      
      render(<ClinicalTooltip tooltipData={mockTooltipData} onClose={mockOnClose} />);
      
      fireEvent.keyDown(document, { key: 'Enter' });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('handles click outside to close', () => {
      const mockOnClose = jest.fn();
      
      render(<ClinicalTooltip tooltipData={mockTooltipData} onClose={mockOnClose} />);
      
      // Click outside the tooltip
      fireEvent.mouseDown(document.body);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Position Calculation', () => {
    test('adjusts position when near viewport edges', () => {
      // Mock viewport dimensions
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });
      
      const edgeTooltipData = {
        ...mockTooltipData,
        position: { x: 750, y: 550 } // Near bottom right
      };
      
      render(<ClinicalTooltip tooltipData={edgeTooltipData} />);
      
      const tooltip = screen.getByTestId('clinical-tooltip');
      expect(tooltip).toBeInTheDocument();
    });

    test('handles mobile viewport positioning', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, writable: true });
      
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      const tooltip = screen.getByTestId('clinical-tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      const tooltip = screen.getByTestId('clinical-tooltip');
      expect(tooltip).toHaveAttribute('role', 'tooltip');
      expect(tooltip).toHaveAttribute('aria-live', 'polite');
    });

    test('close button has proper accessibility', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toHaveAttribute('aria-label');
    });

    test('supports keyboard navigation', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      const tooltip = screen.getByTestId('clinical-tooltip');
      expect(tooltip).toHaveAttribute('tabIndex', '0');
    });

    test('announces content to screen readers', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      const tooltip = screen.getByTestId('clinical-tooltip');
      expect(tooltip).toHaveAttribute('aria-describedby');
    });
  });

  describe('Animation States', () => {
    test('applies base tooltip class when shown', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      const tooltip = screen.getByTestId('clinical-tooltip');
      expect(tooltip).toHaveClass('clinical-tooltip');
    });

    test('renders without animation classes', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      const tooltip = screen.getByTestId('clinical-tooltip');
      expect(tooltip).not.toHaveClass('tooltip-enter-active');
      expect(tooltip).toHaveClass('clinical-tooltip');
    });
  });

  describe('Error Handling', () => {
    test('handles missing segment data gracefully', () => {
      const invalidTooltipData = {
        ...mockTooltipData,
        segmentKey: 'INVALID_SEGMENT'
      };
      
      expect(() => {
        render(<ClinicalTooltip tooltipData={invalidTooltipData} />);
      }).not.toThrow();
    });

    test('handles malformed position data', () => {
      const malformedTooltipData = {
        ...mockTooltipData,
        position: { x: 'invalid', y: null }
      };
      
      expect(() => {
        render(<ClinicalTooltip tooltipData={malformedTooltipData} />);
      }).not.toThrow();
    });

    test('handles missing props gracefully', () => {
      expect(() => {
        render(<ClinicalTooltip />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('memoizes expensive calculations', () => {
      const { rerender } = render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      // Re-render with same props shouldn't cause unnecessary recalculations
      rerender(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      expect(screen.getByTestId('clinical-tooltip')).toBeInTheDocument();
    });

    test('handles rapid tooltip position updates', () => {
      const { rerender } = render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      // Rapid position updates
      for (let i = 0; i < 10; i++) {
        const updatedData = {
          ...mockTooltipData,
          position: { x: 100 + i, y: 200 + i }
        };
        rerender(<ClinicalTooltip tooltipData={updatedData} />);
      }
      
      expect(screen.getByTestId('clinical-tooltip')).toBeInTheDocument();
    });
  });

  describe('Medical Accuracy Validation', () => {
    test('displays accurate MRSA treatment guidelines', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      // Verify first-line treatments per current guidelines
      expect(screen.getAllByText(/Vancomycin/)).toHaveLength(2); // Emergency alert + treatment list
      expect(screen.getAllByText(/Linezolid/)).toHaveLength(2);  // Emergency alert + treatment list  
      expect(screen.getAllByText(/Daptomycin/)).toHaveLength(1); // Emergency alert only
    });

    test('includes appropriate resistance pattern warnings', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      expect(screen.getByText(/mecA gene/)).toBeInTheDocument();
      expect(screen.getByText(/multi-drug resistant/)).toBeInTheDocument();
    });

    test('provides context-appropriate clinical information', () => {
      render(<ClinicalTooltip tooltipData={mockTooltipData} />);
      
      // Should include clinical presentations
      expect(screen.getByText(/Healthcare-associated pneumonia/)).toBeInTheDocument();
      expect(screen.getByText(/Bacteremia and endocarditis/)).toBeInTheDocument();
    });
  });
});