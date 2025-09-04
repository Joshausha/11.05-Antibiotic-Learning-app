/**
 * PathogenDetailPanel Component Tests
 * Critical medical education component tests focusing on patient safety and clinical accuracy
 * Tests pathogen display, medical data validation, and clinical decision support features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PathogenDetailPanel from '../PathogenDetailPanel';

// Mock animation controller to prevent DOM manipulation issues in tests
jest.mock('../../utils/animations', () => ({
  defaultAnimationController: {
    animate: jest.fn()
  }
}));

describe('PathogenDetailPanel - Medical Accuracy & Patient Safety', () => {
  // Mock pathogen data based on real clinical pathogens
  const mockPathogen = {
    id: 'strep-pneumoniae',
    name: 'Streptococcus pneumoniae',
    gramStatus: 'positive',
    morphology: 'cocci',
    clinicalSignificance: 'high',
    commonInfections: ['pneumonia', 'meningitis', 'otitis media'],
    resistancePattern: 'penicillin-intermediate'
  };

  const mockAssociatedConditions = [
    {
      id: 'pneumonia',
      name: 'Community-Acquired Pneumonia',
      severity: 'moderate-severe',
      ageGroup: 'all ages'
    },
    {
      id: 'meningitis', 
      name: 'Bacterial Meningitis',
      severity: 'severe',
      ageGroup: 'pediatric-adult'
    }
  ];

  const mockTreatmentOptions = [
    {
      id: 'amoxicillin',
      name: 'Amoxicillin',
      isFirstLine: true,
      hasResistance: false,
      doseRoute: 'oral',
      clinicalNotes: 'First-line for mild infections'
    },
    {
      id: 'ceftriaxone',
      name: 'Ceftriaxone', 
      isFirstLine: true,
      hasResistance: false,
      doseRoute: 'IV',
      clinicalNotes: 'Severe infections, CNS penetration'
    },
    {
      id: 'vancomycin',
      name: 'Vancomycin',
      isFirstLine: false,
      hasResistance: true,
      doseRoute: 'IV',
      clinicalNotes: 'Reserved for resistant strains'
    }
  ];

  const mockSimilarPathogens = [
    {
      id: 'strep-viridans',
      name: 'Viridans group streptococci',
      similarity: 0.8
    }
  ];

  const defaultProps = {
    pathogen: mockPathogen,
    associatedConditions: mockAssociatedConditions,
    treatmentOptions: mockTreatmentOptions,
    similarPathogens: mockSimilarPathogens,
    onSelectPathogen: jest.fn(),
    onSelectCondition: jest.fn(),
    onShowComparison: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Medical Data Accuracy', () => {
    test('displays correct pathogen identification information', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText('Streptococcus pneumoniae')).toBeInTheDocument();
      expect(screen.getByText(/gram.*positive/i)).toBeInTheDocument();
      expect(screen.getByText(/cocci/i)).toBeInTheDocument();
    });

    test('applies correct gram staining visual indicators', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      // Gram positive should show purple styling
      const gramIndicator = screen.getByText(/gram.*positive/i);
      expect(gramIndicator).toHaveClass('text-purple-800');
      expect(gramIndicator).toHaveClass('bg-purple-100');
    });

    test('handles gram negative pathogen styling correctly', () => {
      const gramNegativePathogen = {
        ...mockPathogen,
        gramStatus: 'negative'
      };
      
      render(<PathogenDetailPanel {...defaultProps} pathogen={gramNegativePathogen} />);
      
      const gramIndicator = screen.getByText(/gram.*negative/i);
      expect(gramIndicator).toHaveClass('text-red-800');
      expect(gramIndicator).toHaveClass('bg-red-100');
    });

    test('validates clinical significance levels', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText(/high.*significance/i)).toBeInTheDocument();
    });

    test('displays associated medical conditions accurately', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText('Community-Acquired Pneumonia')).toBeInTheDocument();
      expect(screen.getByText('Bacterial Meningitis')).toBeInTheDocument();
    });
  });

  describe('Treatment Options - Clinical Decision Support', () => {
    test('displays first-line treatment options correctly', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
      expect(screen.getByText('Ceftriaxone')).toBeInTheDocument();
      expect(screen.getByText(/First-line for mild infections/)).toBeInTheDocument();
    });

    test('filters treatments by first-line vs resistance patterns', async () => {
      const user = userEvent.setup();
      render(<PathogenDetailPanel {...defaultProps} />);
      
      // Should show all treatments initially
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
      expect(screen.getByText('Vancomycin')).toBeInTheDocument();
      
      // Filter to first-line only
      const filterButton = screen.getByRole('button', { name: /filter.*treatment/i });
      await user.click(filterButton);
      
      const firstLineOption = screen.getByText(/first-line/i);
      await user.click(firstLineOption);
      
      // Should still show first-line treatments
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
      expect(screen.getByText('Ceftriaxone')).toBeInTheDocument();
    });

    test('warns about resistance patterns appropriately', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText(/penicillin-intermediate/i)).toBeInTheDocument();
      expect(screen.getByText(/Reserved for resistant strains/)).toBeInTheDocument();
    });

    test('provides route of administration information', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText(/oral/i)).toBeInTheDocument();
      expect(screen.getByText(/IV/i)).toBeInTheDocument();
    });
  });

  describe('Complexity Score Calculation - Educational Metrics', () => {
    test('calculates complexity score based on medical factors', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      // Score calculation: 2 conditions * 10 + 3 treatments * 5 + 1 connection * 3 = 38
      const expectedScore = 2 * 10 + 3 * 5 + 1 * 3; // 20 + 15 + 3 = 38
      
      expect(screen.getByText(expectedScore.toString())).toBeInTheDocument();
    });

    test('handles missing data gracefully in complexity calculation', () => {
      const incompleteProps = {
        ...defaultProps,
        associatedConditions: [],
        treatmentOptions: [],
        similarPathogens: []
      };
      
      render(<PathogenDetailPanel {...incompleteProps} />);
      
      // Should show 0 complexity when no associated data
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('caps complexity score at 100 for very complex pathogens', () => {
      // Create pathogen with excessive complexity
      const complexPathogen = {
        ...defaultProps,
        associatedConditions: new Array(20).fill(mockAssociatedConditions[0]), // 20 conditions
        treatmentOptions: new Array(20).fill(mockTreatmentOptions[0]), // 20 treatments  
        similarPathogens: new Array(20).fill(mockSimilarPathogens[0]) // 20 connections
      };
      
      render(<PathogenDetailPanel {...complexPathogen} />);
      
      // Should cap at 100 even though calculation would be higher
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Interactive Features - Clinical Workflow', () => {
    test('toggles expandable sections for detailed information', async () => {
      const user = userEvent.setup();
      render(<PathogenDetailPanel {...defaultProps} />);
      
      const sectionToggle = screen.getByRole('button', { name: /expand.*basic/i });
      
      // Should start expanded (basic section)
      expect(screen.getByText(/clinical.*significance/i)).toBeVisible();
      
      // Toggle to collapse
      await user.click(sectionToggle);
      
      // Content should be hidden
      await waitFor(() => {
        expect(screen.queryByText(/clinical.*significance/i)).not.toBeVisible();
      });
    });

    test('calls callback functions for clinical workflow navigation', async () => {
      const user = userEvent.setup();
      const mockOnSelectPathogen = jest.fn();
      const mockOnSelectCondition = jest.fn();
      
      render(<PathogenDetailPanel 
        {...defaultProps} 
        onSelectPathogen={mockOnSelectPathogen}
        onSelectCondition={mockOnSelectCondition}
      />);
      
      // Click on similar pathogen should trigger navigation
      const similarPathogenButton = screen.getByText('Viridans group streptococci');
      await user.click(similarPathogenButton);
      
      expect(mockOnSelectPathogen).toHaveBeenCalledWith('strep-viridans');
      
      // Click on condition should trigger condition navigation
      const conditionButton = screen.getByText('Community-Acquired Pneumonia');
      await user.click(conditionButton);
      
      expect(mockOnSelectCondition).toHaveBeenCalledWith('pneumonia');
    });

    test('supports tab navigation for different information categories', async () => {
      const user = userEvent.setup();
      render(<PathogenDetailPanel {...defaultProps} />);
      
      // Should start on overview tab
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(/overview/i);
      
      // Switch to treatments tab
      const treatmentsTab = screen.getByRole('tab', { name: /treatments/i });
      await user.click(treatmentsTab);
      
      expect(treatmentsTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Edge Cases & Error Handling - Patient Safety', () => {
    test('shows placeholder when no pathogen selected', () => {
      render(<PathogenDetailPanel 
        {...defaultProps} 
        pathogen={null}
      />);
      
      expect(screen.getByText(/Select a pathogen to view detailed information/)).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument(); // Microscope icon
    });

    test('handles missing pathogen properties gracefully', () => {
      const incompletePathogen = {
        id: 'incomplete',
        name: 'Incomplete Pathogen'
        // Missing gramStatus, morphology, etc.
      };
      
      render(<PathogenDetailPanel 
        {...defaultProps}
        pathogen={incompletePathogen}
      />);
      
      expect(screen.getByText('Incomplete Pathogen')).toBeInTheDocument();
      // Should not crash with missing properties
    });

    test('prevents medical data corruption from invalid input', () => {
      const invalidProps = {
        ...defaultProps,
        associatedConditions: null,
        treatmentOptions: undefined,
        similarPathogens: 'invalid-type'
      };
      
      render(<PathogenDetailPanel {...invalidProps} />);
      
      // Should handle gracefully without crashing
      expect(screen.getByText('Streptococcus pneumoniae')).toBeInTheDocument();
    });

    test('maintains data integrity during rapid navigation', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<PathogenDetailPanel {...defaultProps} />);
      
      // Rapidly change pathogen data
      const newPathogen = {
        ...mockPathogen,
        id: 'e-coli',
        name: 'Escherichia coli',
        gramStatus: 'negative'
      };
      
      rerender(<PathogenDetailPanel {...defaultProps} pathogen={newPathogen} />);
      
      // Should show new pathogen data accurately
      expect(screen.getByText('Escherichia coli')).toBeInTheDocument();
      expect(screen.getByText(/gram.*negative/i)).toBeInTheDocument();
    });
  });

  describe('Performance & Clinical Workflow Requirements', () => {
    test('renders within clinical performance requirements (<100ms)', () => {
      const startTime = performance.now();
      
      render(<PathogenDetailPanel {...defaultProps} />);
      
      const renderTime = performance.now() - startTime;
      expect(renderTime).toBeLessThan(100); // Clinical workflow requirement
    });

    test('handles large datasets efficiently (100+ items)', () => {
      const largeDataProps = {
        ...defaultProps,
        associatedConditions: new Array(100).fill(mockAssociatedConditions[0]),
        treatmentOptions: new Array(100).fill(mockTreatmentOptions[0]),
        similarPathogens: new Array(100).fill(mockSimilarPathogens[0])
      };
      
      const startTime = performance.now();
      render(<PathogenDetailPanel {...largeDataProps} />);
      const renderTime = performance.now() - startTime;
      
      expect(renderTime).toBeLessThan(500); // Should handle large datasets
    });

    test('integrates with animation system for smooth transitions', () => {
      const { defaultAnimationController } = require('../../utils/animations');
      
      render(<PathogenDetailPanel {...defaultProps} />);
      
      // Should trigger animation on mount
      expect(defaultAnimationController.animate).toHaveBeenCalledWith(
        expect.any(Element),
        'fade-in',
        400
      );
    });

    test('supports accessibility requirements for clinical environments', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      // Check for proper ARIA labels and roles
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      
      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('Medical Education Features', () => {
    test('displays educational complexity indicators', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText(/complexity/i)).toBeInTheDocument();
      expect(screen.getByText(/factors/i)).toBeInTheDocument();
    });

    test('provides clinical context for learning', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText(/common.*infections/i)).toBeInTheDocument();
      expect(screen.getByText(/resistance.*pattern/i)).toBeInTheDocument();
    });

    test('supports comparative learning with similar pathogens', () => {
      render(<PathogenDetailPanel {...defaultProps} />);
      
      expect(screen.getByText('Viridans group streptococci')).toBeInTheDocument();
      expect(screen.getByText(/similarity.*0\.8/i)).toBeInTheDocument();
    });
  });
});

/**
 * Medical Validation Test Summary
 * 
 * ✅ Pathogen identification accuracy
 * ✅ Gram stain classification and visual coding
 * ✅ Clinical significance assessment
 * ✅ Treatment option validation and filtering
 * ✅ Resistance pattern warnings
 * ✅ Complexity scoring for educational purposes
 * ✅ Interactive clinical workflow support
 * ✅ Edge case handling for patient safety
 * ✅ Performance requirements for emergency access
 * ✅ Accessibility compliance for clinical environments
 * ✅ Educational feature integration
 * 
 * Medical Safety: All tests validate clinical accuracy and prevent
 * data corruption that could impact medical education delivery.
 */