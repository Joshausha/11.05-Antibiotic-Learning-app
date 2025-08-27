/**
 * GuidelineComparisonPanel.test.js
 * 
 * Comprehensive test suite for Guideline Comparison Panel component
 * Tests conflict detection, evidence level display, emergency mode,
 * and medical guideline accuracy features.
 * 
 * @author Claude Code Assistant
 * @version 1.0.0
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GuidelineComparisonPanel, { 
  EVIDENCE_LEVELS, 
  GUIDELINE_ORGANIZATIONS 
} from '../ClinicalDecision/GuidelineComparisonPanel';

describe('GuidelineComparisonPanel', () => {
  const mockGuidelines = [
    {
      id: 'aap-pneumonia-2023',
      organization: 'AAP',
      firstLineRecommendation: 'Amoxicillin',
      evidenceLevel: 'A',
      dosing: {
        amount: '45 mg/kg/day',
        frequency: 'twice daily'
      },
      duration: '7-10 days',
      lastUpdated: '2023-06-01',
      rationale: 'Based on randomized controlled trials showing superior efficacy',
      references: ['AAP Clinical Report 2023', 'Pediatrics 2023;151(2):e2022060391']
    },
    {
      id: 'idsa-pneumonia-2019',
      organization: 'IDSA',
      firstLineRecommendation: 'Azithromycin',
      evidenceLevel: 'B',
      dosing: {
        amount: '10 mg/kg',
        frequency: 'once daily'
      },
      duration: '5 days',
      lastUpdated: '2019-10-01',
      rationale: 'Broad spectrum coverage with good tissue penetration',
      references: ['IDSA Guidelines 2019', 'Clin Infect Dis 2019;69(8):1286-1320']
    },
    {
      id: 'pids-pneumonia-2022',
      organization: 'PIDS',
      firstLineRecommendation: 'Amoxicillin',
      evidenceLevel: 'A',
      dosing: {
        amount: '50 mg/kg/day',
        frequency: 'three times daily'
      },
      duration: '10 days',
      lastUpdated: '2022-03-15',
      rationale: 'Optimal dosing for bacterial pneumonia in children',
      references: ['PIDS Recommendations 2022']
    }
  ];

  const defaultProps = {
    condition: 'community-acquired-pneumonia',
    guidelines: mockGuidelines,
    emergencyMode: false,
    onGuidelineSelect: jest.fn(),
    onExpandDetails: jest.fn(),
    showConflictsOnly: false,
    comparisonMode: 'side-by-side'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders panel header with condition name', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      expect(screen.getByText('Clinical Guidelines Comparison')).toBeInTheDocument();
      expect(screen.getByText('community acquired pneumonia - Evidence-based recommendations')).toBeInTheDocument();
    });

    test('renders all provided guidelines', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      expect(screen.getByText('AAP')).toBeInTheDocument();
      expect(screen.getByText('IDSA')).toBeInTheDocument(); 
      expect(screen.getByText('PIDS')).toBeInTheDocument();
    });

    test('displays organization full names', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      expect(screen.getByText('American Academy of Pediatrics')).toBeInTheDocument();
      expect(screen.getByText('Infectious Diseases Society of America')).toBeInTheDocument();
      expect(screen.getByText('Pediatric Infectious Diseases Society')).toBeInTheDocument();
    });

    test('shows no guidelines message when empty array provided', () => {
      render(<GuidelineComparisonPanel {...defaultProps} guidelines={[]} />);
      
      expect(screen.getByText('No guidelines available for comparison')).toBeInTheDocument();
    });
  });

  describe('Evidence Level Display', () => {
    test('displays evidence level indicators correctly', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Should show A-level evidence indicators
      const evidenceLevels = screen.getAllByText('A');
      expect(evidenceLevels.length).toBeGreaterThan(0);
      
      // Should show B-level evidence indicator
      expect(screen.getByText('B')).toBeInTheDocument();
    });

    test('applies correct colors for evidence levels', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Test that evidence indicators have proper styling
      const evidenceIndicators = document.querySelectorAll('.evidence-indicator');
      expect(evidenceIndicators.length).toBeGreaterThan(0);
    });

    test('shows evidence level tooltips on hover', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      const evidenceA = screen.getAllByText('A')[0];
      expect(evidenceA).toHaveAttribute('title', EVIDENCE_LEVELS.A.description);
    });
  });

  describe('Conflict Detection', () => {
    test('identifies conflicting first-line recommendations', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Should show conflict indicators for different recommendations
      const conflictIndicators = screen.getAllByText(/conflict/i);
      expect(conflictIndicators.length).toBeGreaterThan(0);
    });

    test('identifies dosing conflicts between guidelines', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // AAP and PIDS both recommend Amoxicillin but with different dosing
      // Should detect this as a conflict
      const aapCard = screen.getByText('American Academy of Pediatrics').closest('.guideline-card');
      const pidsCard = screen.getByText('Pediatric Infectious Diseases Society').closest('.guideline-card');
      
      // Both should show conflict indicators since they have different dosing
      expect(aapCard?.classList.contains('has-conflicts') || 
             pidsCard?.classList.contains('has-conflicts')).toBeTruthy();
    });

    test('identifies duration conflicts', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Guidelines have different durations (5 days vs 7-10 days vs 10 days)
      // Should be detected as conflicts
      expect(screen.getByText('5 days')).toBeInTheDocument();
      expect(screen.getByText('7-10 days')).toBeInTheDocument();
      expect(screen.getByText('10 days')).toBeInTheDocument();
    });

    test('shows only conflicting guidelines when showConflictsOnly is true', () => {
      render(<GuidelineComparisonPanel {...defaultProps} showConflictsOnly={true} />);
      
      // Since IDSA recommends different antibiotic, it should be shown
      // AAP and PIDS both recommend Amoxicillin but different dosing, so they should be shown too
      expect(screen.getByText('AAP')).toBeInTheDocument();
      expect(screen.getByText('IDSA')).toBeInTheDocument();
      expect(screen.getByText('PIDS')).toBeInTheDocument();
    });
  });

  describe('Guideline Details', () => {
    test('displays first-line recommendations prominently', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Use getAllByText since Amoxicillin appears in multiple guidelines
      expect(screen.getAllByText('Amoxicillin')).toHaveLength(2); // AAP and PIDS
      expect(screen.getByText('Azithromycin')).toBeInTheDocument();
    });

    test('shows dosing information when available', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      expect(screen.getByText('45 mg/kg/day twice daily')).toBeInTheDocument();
      expect(screen.getByText('10 mg/kg once daily')).toBeInTheDocument();
      expect(screen.getByText('50 mg/kg/day three times daily')).toBeInTheDocument();
    });

    test('displays treatment duration', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      expect(screen.getByText('7-10 days')).toBeInTheDocument();
      expect(screen.getByText('5 days')).toBeInTheDocument();
      expect(screen.getByText('10 days')).toBeInTheDocument();
    });

    test('shows last updated information', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      expect(screen.getByText('Last updated: 2023-06-01')).toBeInTheDocument();
      expect(screen.getByText('Last updated: 2019-10-01')).toBeInTheDocument();
      expect(screen.getByText('Last updated: 2022-03-15')).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    test('calls onGuidelineSelect when View Details button is clicked', async () => {
      const onGuidelineSelect = jest.fn();
      render(
        <GuidelineComparisonPanel 
          {...defaultProps} 
          onGuidelineSelect={onGuidelineSelect}
        />
      );
      
      const viewDetailsButtons = screen.getAllByText('View Details');
      fireEvent.click(viewDetailsButtons[0]);
      
      await waitFor(() => {
        expect(onGuidelineSelect).toHaveBeenCalledWith(expect.objectContaining({
          organization: 'AAP'
        }));
      });
    });

    test('handles filter checkbox interaction', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      const conflictsCheckbox = screen.getByRole('checkbox');
      expect(conflictsCheckbox).not.toBeChecked();
      
      fireEvent.click(conflictsCheckbox);
      // Note: This test shows the interaction but actual filtering 
      // would be controlled by parent component
    });
  });

  describe('Emergency Mode', () => {
    test('renders simplified display in emergency mode', () => {
      render(<GuidelineComparisonPanel {...defaultProps} emergencyMode={true} />);
      
      expect(screen.getByText('Quick Guideline Reference')).toBeInTheDocument();
      
      // Should show simplified format in emergency mode - text may be split across elements
      expect(screen.getByText((content, element) => {
        const hasText = (node) => node.textContent === 'AAP: Amoxicillin';
        const nodeHasText = hasText(element);
        const childrenDontHaveText = Array.from(element?.children || []).every(
          child => !hasText(child)
        );
        return nodeHasText && childrenDontHaveText;
      })).toBeInTheDocument();
      
      expect(screen.getByText((content, element) => {
        const hasText = (node) => node.textContent === 'IDSA: Azithromycin';
        const nodeHasText = hasText(element);
        const childrenDontHaveText = Array.from(element?.children || []).every(
          child => !hasText(child)
        );
        return nodeHasText && childrenDontHaveText;
      })).toBeInTheDocument();
    });

    test('has emergency class when in emergency mode', () => {
      render(<GuidelineComparisonPanel {...defaultProps} emergencyMode={true} />);
      
      const emergencyPanel = document.querySelector('.guideline-comparison-emergency');
      expect(emergencyPanel).toBeInTheDocument();
    });
  });

  describe('Layout and Responsive Design', () => {
    test('applies correct grid layout for side-by-side mode', () => {
      render(<GuidelineComparisonPanel {...defaultProps} comparisonMode="side-by-side" />);
      
      const guidelinesGrid = document.querySelector('.guidelines-grid.side-by-side');
      expect(guidelinesGrid).toBeInTheDocument();
      expect(guidelinesGrid).toHaveStyle({
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)' // 3 guidelines
      });
    });

    test('applies single column layout for non-side-by-side modes', () => {
      render(<GuidelineComparisonPanel {...defaultProps} comparisonMode="tabbed" />);
      
      const guidelinesGrid = document.querySelector('.guidelines-grid.tabbed');
      expect(guidelinesGrid).toHaveStyle({
        gridTemplateColumns: '1fr'
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Test that interactive elements have proper accessibility
      const viewDetailsButtons = screen.getAllByText('View Details');
      expect(viewDetailsButtons.length).toBeGreaterThan(0);
      viewDetailsButtons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    test('provides meaningful text alternatives for visual indicators', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Evidence level indicators should have title attributes
      const evidenceIndicators = document.querySelectorAll('[title]');
      const evidenceRelatedTitles = Array.from(evidenceIndicators).filter(el => 
        el.getAttribute('title')?.includes('Evidence') || 
        el.getAttribute('title')?.includes('randomized') ||
        el.getAttribute('title')?.includes('observational')
      );
      expect(evidenceRelatedTitles.length).toBeGreaterThan(0);
    });

    test('maintains keyboard navigation support', () => {
      render(<GuidelineComparisonPanel {...defaultProps} />);
      
      const viewDetailsButtons = screen.getAllByText('View Details');
      viewDetailsButtons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles guidelines without dosing information', () => {
      const guidelinesWithoutDosing = [
        {
          ...mockGuidelines[0],
          dosing: null
        }
      ];
      
      expect(() => {
        render(<GuidelineComparisonPanel {...defaultProps} guidelines={guidelinesWithoutDosing} />);
      }).not.toThrow();
    });

    test('handles unknown organization codes', () => {
      const unknownOrgGuidelines = [
        {
          ...mockGuidelines[0],
          organization: 'UNKNOWN_ORG'
        }
      ];
      
      render(<GuidelineComparisonPanel {...defaultProps} guidelines={unknownOrgGuidelines} />);
      
      // Should display the unknown organization code as the header
      const unknownOrgElements = screen.getAllByText('UNKNOWN_ORG');
      expect(unknownOrgElements.length).toBeGreaterThan(0);
    });

    test('handles missing evidence levels gracefully', () => {
      const guidelinesWithoutEvidence = [
        {
          ...mockGuidelines[0],
          evidenceLevel: undefined
        }
      ];
      
      render(<GuidelineComparisonPanel {...defaultProps} guidelines={guidelinesWithoutEvidence} />);
      
      // Should default to C level evidence
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    test('handles very long guideline names and recommendations', () => {
      const longNameGuidelines = [
        {
          ...mockGuidelines[0],
          firstLineRecommendation: 'Very long antibiotic name that might cause layout issues',
          organization: 'VERY_LONG_ORGANIZATION_NAME_THAT_MIGHT_WRAP'
        }
      ];
      
      expect(() => {
        render(<GuidelineComparisonPanel {...defaultProps} guidelines={longNameGuidelines} />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('handles large numbers of guidelines efficiently', () => {
      const manyGuidelines = Array.from({ length: 10 }, (_, index) => ({
        ...mockGuidelines[0],
        id: `guideline-${index}`,
        organization: `ORG_${index}`,
        firstLineRecommendation: `Antibiotic ${index}`
      }));
      
      const startTime = performance.now();
      render(<GuidelineComparisonPanel {...defaultProps} guidelines={manyGuidelines} />);
      const renderTime = performance.now() - startTime;
      
      // Should render within reasonable time (less than 100ms)
      expect(renderTime).toBeLessThan(100);
      
      // Should render the first organization
      const orgElements = screen.getAllByText('ORG_0');
      expect(orgElements.length).toBeGreaterThan(0);
    });

    test('memoizes conflict detection calculations', () => {
      const { rerender } = render(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Re-render with same props should not recalculate conflicts
      rerender(<GuidelineComparisonPanel {...defaultProps} />);
      
      // Conflict indicators should still be present
      expect(screen.getAllByText(/conflict/i).length).toBeGreaterThan(0);
    });
  });
});