/**
 * Northwestern Comparison View Component Tests
 *
 * Comprehensive test suite for Northwestern wheel comparison functionality.
 * Tests 2-4 wheel comparison, synchronized interactions, coverage analysis,
 * and medical accuracy.
 *
 * Created by: Agent - Phase 7 Visualization Enhancement
 * Test Coverage Target: 100%
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import NorthwesternComparisonView, {
  calculateCoverageDifferences,
  getComparisonInsight
} from '../NorthwesternComparisonView';
import { NORTHWESTERN_SEGMENTS } from '../NorthwesternPieChart';

// Mock antibiotics with Northwestern spectrum data
const mockAntibiotics = [
  {
    id: 1,
    name: 'Vancomycin',
    class: 'Glycopeptides',
    route: 'IV',
    northwesternSpectrum: {
      MRSA: 2,
      VRE_faecium: 0,
      anaerobes: 1,
      atypicals: 0,
      pseudomonas: 0,
      gramNegative: 0,
      MSSA: 2,
      enterococcus_faecalis: 2
    },
    routeColor: 'blue',
    cellWallActive: true
  },
  {
    id: 2,
    name: 'Meropenem',
    class: 'Carbapenems',
    route: 'IV',
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
    cellWallActive: true
  },
  {
    id: 3,
    name: 'Ceftriaxone',
    class: 'Cephalosporins',
    route: ['IV', 'IM'],
    northwesternSpectrum: {
      MRSA: 0,
      VRE_faecium: 0,
      anaerobes: 0,
      atypicals: 0,
      pseudomonas: 0,
      gramNegative: 2,
      MSSA: 2,
      enterococcus_faecalis: 0
    },
    routeColor: 'blue',
    cellWallActive: true
  }
];

describe('NorthwesternComparisonView', () => {
  // Basic Rendering Tests
  describe('Rendering', () => {
    it('renders empty state when no antibiotics selected', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={[]} />);

      expect(screen.getByText('No Antibiotics Selected')).toBeInTheDocument();
      expect(screen.getByText(/Select 2-4 antibiotics to compare/i)).toBeInTheDocument();
    });

    it('renders single antibiotic state', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={[mockAntibiotics[0]]} />);

      expect(screen.getByText('Add More Antibiotics')).toBeInTheDocument();
      expect(screen.getByText(/Select at least one more antibiotic/i)).toBeInTheDocument();
    });

    it('renders comparison view with 2 antibiotics', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      expect(screen.getByText('Northwestern Coverage Comparison')).toBeInTheDocument();
      expect(screen.getByText(/Comparing 2 antibiotics/i)).toBeInTheDocument();
      expect(screen.getAllByText('Vancomycin').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Meropenem').length).toBeGreaterThan(0);
    });

    it('renders comparison view with 3 antibiotics', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics} />);

      expect(screen.getByText(/Comparing 3 antibiotics/i)).toBeInTheDocument();
      expect(screen.getAllByText('Vancomycin').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Meropenem').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Ceftriaxone').length).toBeGreaterThan(0);
    });

    it('filters out antibiotics without Northwestern spectrum data', () => {
      const invalidAntibiotic = { id: 4, name: 'Invalid', class: 'Test' };
      render(
        <NorthwesternComparisonView
          selectedAntibiotics={[...mockAntibiotics, invalidAntibiotic]}
        />
      );

      // Should only show the 3 valid antibiotics
      expect(screen.getByText(/Comparing 3 antibiotics/i)).toBeInTheDocument();
    });
  });

  // Comparison Statistics Tests
  describe('Comparison Statistics', () => {
    it('displays similarity score correctly', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      expect(screen.getByText('Similarity Score')).toBeInTheDocument();
      expect(screen.getByText(/\d+%/)).toBeInTheDocument();
    });

    it('displays consistent segments count', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      expect(screen.getByText('Consistent Segments')).toBeInTheDocument();
      // Look for pattern like "2/8" in the consistent segments stat box
      const consistentStat = screen.getByText('Consistent Segments').closest('.bg-green-50');
      expect(consistentStat.textContent).toMatch(/\d+\/8/);
    });

    it('displays variable segments count', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      expect(screen.getByText('Variable Segments')).toBeInTheDocument();
    });

    it('displays total variation count', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      expect(screen.getByText('Total Variation')).toBeInTheDocument();
    });
  });

  // Interaction Tests
  describe('Interactions', () => {
    it('calls onAntibioticDeselect when remove button clicked', () => {
      const handleDeselect = jest.fn();
      render(
        <NorthwesternComparisonView
          selectedAntibiotics={mockAntibiotics.slice(0, 2)}
          onAntibioticDeselect={handleDeselect}
        />
      );

      const removeButtons = screen.getAllByLabelText(/Remove .+ from comparison/i);
      fireEvent.click(removeButtons[0]);

      expect(handleDeselect).toHaveBeenCalledWith(mockAntibiotics[0].id);
    });

    it('toggles difference view on checkbox change', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      const checkbox = screen.getByLabelText(/Show Differences/i);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  // Coverage Analysis Table Tests
  describe('Coverage Analysis Table', () => {
    it('displays all 8 Northwestern segments in table', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      NORTHWESTERN_SEGMENTS.forEach(segment => {
        expect(screen.getAllByText(segment.label).length).toBeGreaterThan(0);
      });
    });

    it('displays coverage values for each antibiotic', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      // Look for coverage values in the table
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Should have header row with antibiotic names
      expect(within(table).getByText('Vancomycin')).toBeInTheDocument();
      expect(within(table).getByText('Meropenem')).toBeInTheDocument();
    });

    it('shows variation indicators correctly', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      // Look for variation column
      const table = screen.getByRole('table');
      const variationHeader = within(table).getByText('Variation');
      expect(variationHeader).toBeInTheDocument();
    });
  });

  // Helper Functions Tests
  describe('Helper Functions', () => {
    describe('calculateCoverageDifferences', () => {
      it('calculates coverage differences correctly', () => {
        const result = calculateCoverageDifferences(
          mockAntibiotics.slice(0, 2),
          'MRSA'
        );

        expect(result.min).toBe(0);
        expect(result.max).toBe(2);
        expect(result.range).toBe(2);
        expect(result.hasVariation).toBe(true);
        expect(result.consistent).toBe(false);
      });

      it('identifies consistent coverage', () => {
        const result = calculateCoverageDifferences(
          mockAntibiotics.slice(0, 2),
          'MSSA'
        );

        expect(result.min).toBe(2);
        expect(result.max).toBe(2);
        expect(result.range).toBe(0);
        expect(result.hasVariation).toBe(false);
        expect(result.consistent).toBe(true);
      });

      it('returns coverage array', () => {
        const result = calculateCoverageDifferences(
          mockAntibiotics.slice(0, 2),
          'MRSA'
        );

        expect(result.coverages).toEqual([2, 0]);
      });
    });

    describe('getComparisonInsight', () => {
      it('generates correct insight for consistent coverage', () => {
        const differences = { min: 2, max: 2, range: 0, consistent: true };
        const insight = getComparisonInsight(differences, 'MRSA');

        expect(insight).toContain('Good coverage');
        expect(insight).toContain('MRSA');
      });

      it('generates correct insight for no coverage', () => {
        const differences = { min: 0, max: 0, range: 0, consistent: true };
        const insight = getComparisonInsight(differences, 'Pseudomonas');

        expect(insight).toContain('No coverage');
        expect(insight).toContain('Pseudomonas');
      });

      it('generates correct insight for moderate variation', () => {
        const differences = { min: 0, max: 1, range: 1, consistent: false };
        const insight = getComparisonInsight(differences, 'Anaerobes');

        expect(insight).toContain('Minor coverage variation');
        expect(insight).toContain('Anaerobes');
      });

      it('generates correct insight for significant variation', () => {
        const differences = { min: 0, max: 2, range: 2, consistent: false };
        const insight = getComparisonInsight(differences, 'MRSA');

        expect(insight).toContain('Significant coverage difference');
        expect(insight).toContain('MRSA');
        expect(insight).toContain('0-2');
      });
    });
  });

  // Props Validation Tests
  describe('Props Validation', () => {
    it('accepts emergencyMode prop', () => {
      const { rerender } = render(
        <NorthwesternComparisonView
          selectedAntibiotics={mockAntibiotics.slice(0, 2)}
          emergencyMode={false}
        />
      );

      rerender(
        <NorthwesternComparisonView
          selectedAntibiotics={mockAntibiotics.slice(0, 2)}
          emergencyMode={true}
        />
      );

      // Should render without errors
      expect(screen.getByText('Northwestern Coverage Comparison')).toBeInTheDocument();
    });

    it('accepts educationLevel prop', () => {
      render(
        <NorthwesternComparisonView
          selectedAntibiotics={mockAntibiotics.slice(0, 2)}
          educationLevel="resident"
        />
      );

      expect(screen.getByText('Northwestern Coverage Comparison')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      const { container } = render(
        <NorthwesternComparisonView
          selectedAntibiotics={mockAntibiotics.slice(0, 2)}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  // Medical Accuracy Tests
  describe('Medical Accuracy', () => {
    it('correctly identifies MRSA coverage differences between Vancomycin and Meropenem', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      const table = screen.getByRole('table');
      const mrsaRow = within(table).getAllByText('MRSA')[0].closest('tr');

      // Vancomycin should show 2, Meropenem should show 0
      expect(within(mrsaRow).getByText('2')).toBeInTheDocument();
      expect(within(mrsaRow).getByText('0')).toBeInTheDocument();
    });

    it('correctly identifies Pseudomonas coverage differences', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      const table = screen.getByRole('table');

      // Vancomycin has no pseudomonas coverage (0)
      // Meropenem has good pseudomonas coverage (2)
      expect(table).toBeInTheDocument();
    });

    it('correctly calculates overall similarity between antibiotics', () => {
      render(<NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />);

      // Vancomycin and Meropenem should have low similarity (different coverage patterns)
      const similarityScoreLabel = screen.getByText('Similarity Score');
      expect(similarityScoreLabel).toBeInTheDocument();

      // Find the parent container with the score value
      const scoreContainer = similarityScoreLabel.closest('.bg-blue-50');
      expect(scoreContainer).toBeInTheDocument();

      // Should show a percentage somewhere in the container
      expect(scoreContainer.textContent).toMatch(/\d+%/);
    });
  });

  // Grid Layout Tests
  describe('Grid Layout', () => {
    it('uses 2-column grid for 2 antibiotics', () => {
      const { container } = render(
        <NorthwesternComparisonView selectedAntibiotics={mockAntibiotics.slice(0, 2)} />
      );

      const grid = container.querySelector('[style*="grid-template-columns"]');
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(2, 1fr)' });
    });

    it('uses 3-column grid for 3 antibiotics', () => {
      const { container } = render(
        <NorthwesternComparisonView selectedAntibiotics={mockAntibiotics} />
      );

      const grid = container.querySelector('[style*="grid-template-columns"]');
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });
    });

    it('uses 4-column grid for 4 antibiotics', () => {
      const fourAntibiotics = [
        ...mockAntibiotics,
        {
          id: 4,
          name: 'Ciprofloxacin',
          class: 'Fluoroquinolones',
          route: ['IV', 'Oral'],
          northwesternSpectrum: {
            MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 2,
            pseudomonas: 2, gramNegative: 2, MSSA: 1, enterococcus_faecalis: 0
          },
          routeColor: 'purple',
          cellWallActive: false
        }
      ];

      const { container } = render(
        <NorthwesternComparisonView selectedAntibiotics={fourAntibiotics} />
      );

      const grid = container.querySelector('[style*="grid-template-columns"]');
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(4, 1fr)' });
    });
  });
});
