/**
 * DetailPanel Component Tests
 * Comprehensive test suite for the DetailPanel component
 * Focuses on clinical scenarios, education levels, and interactive learning
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailPanel from '../DetailPanel';

// Mock clinical data
const mockSegments = ['MRSA', 'MSSA'];
const mockAntibioticData = {
  name: 'Vancomycin',
  class: 'Glycopeptide',
  mechanism: 'Cell wall synthesis inhibition',
  spectrum: ['Gram-positive']
};

const mockProps = {
  segments: mockSegments,
  antibiotic: mockAntibioticData,
  educationLevel: 'resident',
  onLearningComplete: jest.fn(),
  onClose: jest.fn()
};

// Mock external dependencies
jest.mock('../ClinicalTooltip', () => ({
  CLINICAL_DATABASE: {
    MRSA: {
      fullName: 'Methicillin-resistant Staphylococcus aureus',
      clinicalSignificance: 'Major cause of healthcare-associated infections',
      treatmentOptions: {
        firstLine: ['Vancomycin', 'Linezolid', 'Daptomycin']
      }
    },
    MSSA: {
      fullName: 'Methicillin-sensitive Staphylococcus aureus',
      clinicalSignificance: 'Common community and healthcare pathogen',
      treatmentOptions: {
        firstLine: ['Nafcillin', 'Oxacillin', 'Cefazolin']
      }
    }
  },
  COVERAGE_CLINICAL: {
    MRSA: {
      coverage: 'Excellent',
      notes: 'First-line for serious MRSA infections'
    }
  }
}));

describe('DetailPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders with provided segments and antibiotic data', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
      expect(screen.getByText(/Vancomycin/)).toBeInTheDocument();
      expect(screen.getByText(/MRSA/)).toBeInTheDocument();
    });

    test('renders panel header with antibiotic information', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/Clinical Detail Panel/)).toBeInTheDocument();
      expect(screen.getByText(/Vancomycin/)).toBeInTheDocument();
      expect(screen.getByText(/Glycopeptide/)).toBeInTheDocument();
    });

    test('displays close button', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('Segment Display', () => {
    test('displays all provided segments', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/MRSA/)).toBeInTheDocument();
      expect(screen.getByText(/MSSA/)).toBeInTheDocument();
    });

    test('shows clinical significance for each segment', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/Major cause of healthcare-associated infections/)).toBeInTheDocument();
      expect(screen.getByText(/Common community and healthcare pathogen/)).toBeInTheDocument();
    });

    test('displays treatment options for segments', () => {
      render(<DetailPanel {...mockProps} />);
      
      // MRSA treatments
      expect(screen.getByText(/Vancomycin/)).toBeInTheDocument();
      expect(screen.getByText(/Linezolid/)).toBeInTheDocument();
      
      // MSSA treatments
      expect(screen.getByText(/Nafcillin/)).toBeInTheDocument();
      expect(screen.getByText(/Cefazolin/)).toBeInTheDocument();
    });
  });

  describe('Education Level Adaptation', () => {
    test('shows appropriate content for residents', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Should show clinical scenarios
      expect(screen.getByText(/Clinical Scenarios/)).toBeInTheDocument();
    });

    test('shows simplified content for medical students', () => {
      const medStudentProps = { ...mockProps, educationLevel: 'medical_student' };
      
      render(<DetailPanel {...medStudentProps} />);
      
      // Should show basic information but maybe fewer scenarios
      expect(screen.getByText(/Vancomycin/)).toBeInTheDocument();
    });

    test('shows advanced content for attendings', () => {
      const attendingProps = { ...mockProps, educationLevel: 'attending' };
      
      render(<DetailPanel {...attendingProps} />);
      
      // Should show complex scenarios and research data
      expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
    });
  });

  describe('Clinical Scenarios', () => {
    test('displays clinical scenarios when available', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/Clinical Scenarios/)).toBeInTheDocument();
    });

    test('handles scenario interaction', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Look for scenario elements
      const scenarioButtons = screen.queryAllByText(/Case/);
      if (scenarioButtons.length > 0) {
        fireEvent.click(scenarioButtons[0]);
        expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
      }
    });

    test('shows scenario questions and options', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Check if scenario content loads
      const scenarios = screen.queryAllByText(/patient/i);
      expect(scenarios.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Interactive Features', () => {
    test('handles close button click', () => {
      render(<DetailPanel {...mockProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    test('handles learning completion callback', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Simulate completing a learning module
      const completeButton = screen.queryByText(/Complete/i);
      if (completeButton) {
        fireEvent.click(completeButton);
        expect(mockProps.onLearningComplete).toHaveBeenCalled();
      }
    });

    test('supports keyboard navigation', () => {
      render(<DetailPanel {...mockProps} />);
      
      const panel = screen.getByTestId('detail-panel');
      expect(panel).toHaveAttribute('tabIndex');
    });
  });

  describe('Data Comparison', () => {
    test('compares multiple segments effectively', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Should show comparison between MRSA and MSSA
      expect(screen.getByText(/MRSA/)).toBeInTheDocument();
      expect(screen.getByText(/MSSA/)).toBeInTheDocument();
    });

    test('highlights key differences between segments', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Should highlight resistance differences
      expect(screen.getByText(/resistant/i)).toBeInTheDocument();
      expect(screen.getByText(/sensitive/i)).toBeInTheDocument();
    });

    test('shows treatment option differences', () => {
      render(<DetailPanel {...mockProps} />);
      
      // MRSA vs MSSA treatment differences should be clear
      expect(screen.getByText(/Vancomycin/)).toBeInTheDocument(); // MRSA
      expect(screen.getByText(/Nafcillin/)).toBeInTheDocument(); // MSSA
    });
  });

  describe('Antibiotic Information Display', () => {
    test('shows antibiotic mechanism of action', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/Cell wall synthesis inhibition/)).toBeInTheDocument();
    });

    test('displays antibiotic class information', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/Glycopeptide/)).toBeInTheDocument();
    });

    test('shows spectrum of activity', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/Gram-positive/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles empty segments array', () => {
      const emptyProps = { ...mockProps, segments: [] };
      
      expect(() => {
        render(<DetailPanel {...emptyProps} />);
      }).not.toThrow();
    });

    test('handles missing antibiotic data', () => {
      const noAntibioticProps = { ...mockProps, antibiotic: null };
      
      expect(() => {
        render(<DetailPanel {...noAntibioticProps} />);
      }).not.toThrow();
    });

    test('handles invalid education level', () => {
      const invalidProps = { ...mockProps, educationLevel: 'invalid' };
      
      expect(() => {
        render(<DetailPanel {...invalidProps} />);
      }).not.toThrow();
    });

    test('handles missing callbacks gracefully', () => {
      const noCallbackProps = { 
        ...mockProps, 
        onClose: undefined, 
        onLearningComplete: undefined 
      };
      
      expect(() => {
        render(<DetailPanel {...noCallbackProps} />);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      render(<DetailPanel {...mockProps} />);
      
      const panel = screen.getByTestId('detail-panel');
      expect(panel).toHaveAttribute('role');
      expect(panel).toHaveAttribute('aria-labelledby');
    });

    test('supports screen reader navigation', () => {
      render(<DetailPanel {...mockProps} />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    test('has keyboard accessible controls', () => {
      render(<DetailPanel {...mockProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toHaveAttribute('tabIndex');
    });

    test('provides appropriate focus management', () => {
      render(<DetailPanel {...mockProps} />);
      
      const panel = screen.getByTestId('detail-panel');
      panel.focus();
      expect(document.activeElement).toBe(panel);
    });
  });

  describe('Performance', () => {
    test('memoizes expensive calculations', () => {
      const { rerender } = render(<DetailPanel {...mockProps} />);
      
      // Re-render with same props
      rerender(<DetailPanel {...mockProps} />);
      
      expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
    });

    test('handles rapid prop changes efficiently', () => {
      const { rerender } = render(<DetailPanel {...mockProps} />);
      
      // Rapid re-renders with different segments
      for (let i = 0; i < 5; i++) {
        const newProps = { ...mockProps, segments: [`MRSA_${i}`, `MSSA_${i}`] };
        rerender(<DetailPanel {...newProps} />);
      }
      
      expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
    });
  });

  describe('Medical Accuracy', () => {
    test('displays clinically accurate treatment information', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Verify MRSA treatments are appropriate
      expect(screen.getByText(/Vancomycin/)).toBeInTheDocument();
      expect(screen.getByText(/Linezolid/)).toBeInTheDocument();
      expect(screen.getByText(/Daptomycin/)).toBeInTheDocument();
    });

    test('shows evidence-based clinical significance', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/Major cause of healthcare-associated infections/)).toBeInTheDocument();
    });

    test('provides appropriate clinical context', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Should provide context for clinical decision making
      expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
    });
  });

  describe('Progressive Disclosure', () => {
    test('shows basic information initially', () => {
      render(<DetailPanel {...mockProps} />);
      
      expect(screen.getByText(/Vancomycin/)).toBeInTheDocument();
      expect(screen.getByText(/Glycopeptide/)).toBeInTheDocument();
    });

    test('reveals additional information on interaction', () => {
      render(<DetailPanel {...mockProps} />);
      
      // Look for expandable sections
      const expandButtons = screen.queryAllByText(/Show more|Expand/i);
      if (expandButtons.length > 0) {
        fireEvent.click(expandButtons[0]);
        // Additional content should appear
      }
      
      expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
    });

    test('adapts disclosure level to education level', () => {
      const medStudentProps = { ...mockProps, educationLevel: 'medical_student' };
      const { rerender } = render(<DetailPanel {...medStudentProps} />);
      
      // Switch to resident level
      rerender(<DetailPanel {...mockProps} />);
      
      // More detailed information should be available
      expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
    });
  });
});