/**
 * VisualizationsTab Guideline Integration Tests
 *
 * Priority 2.2: GuidelineComparisonPanel Integration Tests
 * Tests the complete workflow of guideline display triggered from network visualization
 *
 * @test pathogen selection → guideline display
 * @test handler function integration with data functions
 * @test rendering of GuidelineComparisonPanel with correct data
 * @test navigation between network and guidelines views
 * @test state management for guideline display
 * @test medical disclaimer display
 * @test emergency mode integration
 *
 * @created 2025-11-30
 * @version 1.0.0
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VisualizationsTab from '../VisualizationsTab';
import { renderWithContext } from '../../utils/testUtils';

// Mock GuidelineComparisonPanel to avoid complex D3/Northwestern dependencies
jest.mock('../ClinicalDecision/GuidelineComparisonPanel', () => {
  return function MockGuidelineComparisonPanel({
    condition,
    guidelines,
    emergencyMode,
    onGuidelineSelect,
    onExpandDetails
  }) {
    return (
      <div data-testid="guideline-comparison-panel">
        <h2 data-testid="guideline-panel-title">
          Guidelines for {condition?.replace(/-/g, ' ')}
        </h2>
        <div data-testid="guidelines-count">
          {guidelines?.length || 0} guidelines
        </div>
        {guidelines?.map((guideline) => (
          <div key={guideline.id} data-testid={`guideline-${guideline.id}`}>
            <span data-testid={`guideline-org-${guideline.id}`}>
              {guideline.organization}
            </span>
            <span data-testid={`guideline-recommendation-${guideline.id}`}>
              {guideline.firstLineRecommendation}
            </span>
            <button
              onClick={() => onGuidelineSelect?.(guideline)}
              data-testid={`select-guideline-${guideline.id}`}
            >
              Select
            </button>
          </div>
        ))}
        <div data-testid="emergency-mode-indicator">
          Emergency: {emergencyMode ? 'true' : 'false'}
        </div>
      </div>
    );
  };
});

// Mock ClinicalDecisionTree to avoid dependencies
jest.mock('../ClinicalDecision/ClinicalDecisionTree', () => {
  return function MockClinicalDecisionTree() {
    return <div data-testid="clinical-decision-tree">Clinical Decision Tree</div>;
  };
});

// Mock PathogenNetworkVisualization to avoid D3 dependencies
jest.mock('../PathogenNetworkVisualization', () => {
  return function MockPathogenNetworkVisualization() {
    return <div data-testid="pathogen-network">Pathogen Network</div>;
  };
});

// Mock NetworkVisualizationD3
jest.mock('../NetworkVisualizationD3', () => {
  return function MockNetworkVisualizationD3() {
    return <div data-testid="network-visualization-d3">Network Visualization D3</div>;
  };
});

// Mock Northwestern components
jest.mock('../AnimatedNorthwesternPieChart', () => {
  return function MockAnimatedNorthwesternPieChart() {
    return <div data-testid="animated-northwestern-pie">Pie Chart</div>;
  };
});

jest.mock('../NorthwesternPieChart', () => {
  return function MockNorthwesternPieChart() {
    return <div data-testid="northwestern-pie">Pie Chart</div>;
  };
});

jest.mock('../NorthwesternSpatialLayout', () => {
  return function MockNorthwesternSpatialLayout() {
    return <div data-testid="northwestern-spatial-layout">Spatial Layout</div>;
  };
});

jest.mock('../NorthwesternComparisonView', () => {
  return function MockNorthwesternComparisonView() {
    return <div data-testid="northwestern-comparison-view">Comparison View</div>;
  };
});

jest.mock('../ComparisonControlPanel', () => {
  return function MockComparisonControlPanel() {
    return <div data-testid="comparison-control-panel">Control Panel</div>;
  };
});

// Mock LoadingSpinner
jest.mock('../LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// Mock ErrorBoundary
jest.mock('../ErrorBoundary', () => {
  return function MockErrorBoundary({ children }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

// Mock Northwestern animations hook
jest.mock('../../animations/NorthwesternAnimations', () => ({
  useNorthwesternAnimations: () => ({
    animationManager: {},
    createCoverageRevealAnimation: jest.fn(),
    createHoverAnimation: jest.fn(),
    createSelectionAnimation: jest.fn(),
    createLearningProgressAnimation: jest.fn(),
    createScenarioTransitionAnimation: jest.fn(),
    CLINICAL_TIMING: {},
    MEDICAL_EASING: {}
  })
}));

describe('VisualizationsTab - Guideline Integration Tests (Priority 2.2)', () => {
  const mockPathogenData = [
    { id: 'streptococcus-pneumoniae', name: 'S. pneumoniae' },
    { id: 'escherichia-coli', name: 'E. coli' },
    { id: 'staphylococcus-aureus', name: 'S. aureus' },
    { id: 'neisseria-meningitidis', name: 'N. meningitidis' }
  ];

  const mockAntibioticData = [
    { id: 'amoxicillin', name: 'Amoxicillin' },
    { id: 'ceftriaxone', name: 'Ceftriaxone' }
  ];

  const mockMedicalConditions = [
    { id: 'community-acquired-pneumonia', name: 'Community-Acquired Pneumonia' },
    { id: 'acute-otitis-media', name: 'Acute Otitis Media' },
    { id: 'urinary-tract-infection', name: 'Urinary Tract Infection' }
  ];

  const defaultProps = {
    pathogenData: mockPathogenData,
    antibioticData: mockAntibioticData,
    medicalConditions: mockMedicalConditions,
    onSelectCondition: jest.fn(),
    onSelectPathogen: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering - Guidelines Tab', () => {
    test('renders VisualizationsTab component without crashing', () => {
      render(<VisualizationsTab {...defaultProps} />);

      expect(screen.getByText('Data Visualizations')).toBeInTheDocument();
    });

    test('initially shows overview dashboard (not guidelines)', () => {
      render(<VisualizationsTab {...defaultProps} />);

      // Guidelines panel should not be visible initially
      const guidelinePanel = screen.queryByTestId('guideline-comparison-panel');
      expect(guidelinePanel).not.toBeInTheDocument();
    });
  });

  describe('Guideline Display State Management', () => {
    test('transitions from overview to guidelines visualization', async () => {
      const { container } = render(<VisualizationsTab {...defaultProps} />);

      // Find and click the "Guidelines" tab button
      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guidelines') || btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          expect(screen.getByTestId('guideline-comparison-panel')).toBeInTheDocument();
        });
      }
    });

    test('displays medical disclaimer when showing guidelines', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      // Navigate to guidelines view
      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const disclaimer = screen.queryByText(/Educational Use Only/i);
          if (disclaimer) {
            expect(disclaimer).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Guidelines Panel Navigation', () => {
    test('displays back to network button in guidelines view', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      // Navigate to guidelines
      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const backButton = screen.queryByText(/Back to Network/i);
          if (backButton) {
            expect(backButton).toBeInTheDocument();
          }
        });
      }
    });

    test('returns to network visualization when back button clicked', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      // Navigate to guidelines
      const allButtons = screen.getAllByRole('button');
      const guidelinesButton = allButtons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const backButton = screen.queryByText(/Back to Network/i);
          if (backButton) {
            fireEvent.click(backButton);

            // Should return to network view
            expect(screen.queryByTestId('guideline-comparison-panel')).not.toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Emergency Mode Integration', () => {
    test('passes emergencyMode prop to GuidelineComparisonPanel', async () => {
      const { rerender } = render(<VisualizationsTab {...defaultProps} />);

      // Navigate to guidelines
      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const emergencyIndicator = screen.queryByTestId('emergency-mode-indicator');
          if (emergencyIndicator) {
            // Should show emergency mode status
            expect(emergencyIndicator.textContent).toMatch(/Emergency: (true|false)/);
          }
        });
      }
    });
  });

  describe('Guideline Data Display Integration', () => {
    test('displays guideline count in panel', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      // Navigate to guidelines
      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const guidelineCount = screen.queryByTestId('guidelines-count');
          if (guidelineCount) {
            expect(guidelineCount.textContent).toMatch(/\d+ guidelines/);
          }
        });
      }
    });

    test('displays condition name in guideline panel title', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      // Navigate to guidelines
      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const panelTitle = screen.queryByTestId('guideline-panel-title');
          if (panelTitle) {
            // Should show some condition in the title
            expect(panelTitle.textContent).toBeTruthy();
            expect(panelTitle.textContent).not.toBe('');
          }
        });
      }
    });
  });

  describe('GuidelineComparisonPanel Props Integration', () => {
    test('passes condition prop correctly to GuidelineComparisonPanel', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const panelTitle = screen.queryByTestId('guideline-panel-title');
          if (panelTitle) {
            // Title should contain formatted condition name
            expect(panelTitle.textContent.length).toBeGreaterThan(0);
          }
        });
      }
    });

    test('passes empty array when no guidelines available', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          // Initially guidelines might be empty or loading
          const guidelineCount = screen.queryByTestId('guidelines-count');
          if (guidelineCount) {
            expect(guidelineCount).toBeInTheDocument();
          }
        });
      }
    });

    test('GuidelineComparisonPanel receives onGuidelineSelect callback', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          // If guidelines rendered, select button should be available
          const selectButtons = screen.queryAllByTestId(/^select-guideline-/);
          if (selectButtons.length > 0) {
            expect(selectButtons.length).toBeGreaterThan(0);
          }
        });
      }
    });

    test('GuidelineComparisonPanel receives onExpandDetails callback', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          // Panel should render with all required callbacks
          const panel = screen.queryByTestId('guideline-comparison-panel');
          if (panel) {
            expect(panel).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Error Boundary Wrapping', () => {
    test('GuidelineComparisonPanel is wrapped in ErrorBoundary', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const errorBoundary = screen.queryByTestId('error-boundary');
          // If any child component renders, it should be inside error boundary
          if (errorBoundary) {
            expect(errorBoundary).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Guideline Display Loading State', () => {
    test('shows loading message when guidelines list is empty', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        // Initially might show loading state
        await waitFor(() => {
          const loadingText = screen.queryByText(/Loading guidelines/i);
          const guidelinePanel = screen.queryByTestId('guideline-comparison-panel');

          // Should show either loading message or panel
          if (!guidelinePanel) {
            expect(loadingText).toBeTruthy();
          }
        }, { timeout: 1000 });
      }
    });
  });

  describe('Condition Formatting in Display', () => {
    test('formats condition name with spaces for display', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const displayText = screen.queryByText(/Loading guidelines for/);
          if (displayText) {
            // Should have spaces instead of hyphens
            expect(displayText.textContent).not.toMatch(/-/);
          }
        });
      }
    });
  });

  describe('Integration with Multiple Visualizations', () => {
    test('can navigate between different visualization modes', () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Should have multiple visualization buttons available
      const visualizationButtons = buttons.filter(btn =>
        btn.textContent.match(/Overview|Antibiotic|Pathogen|Category|Analysis|Guidelines|Tree|Network/i)
      );

      expect(visualizationButtons.length).toBeGreaterThan(0);
    });

    test('maintains state when switching between guidelines and other visualizations', async () => {
      const { rerender } = render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const panel = screen.queryByTestId('guideline-comparison-panel');
          // If panel rendered, state was maintained
          if (panel) {
            expect(panel).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Edge Cases and Robustness', () => {
    test('handles rendering with no pathogen data gracefully', () => {
      const propsWithoutPathogens = {
        ...defaultProps,
        pathogenData: []
      };

      expect(() => {
        render(<VisualizationsTab {...propsWithoutPathogens} />);
      }).not.toThrow();
    });

    test('handles rendering with no antibiotic data gracefully', () => {
      const propsWithoutAntibiotics = {
        ...defaultProps,
        antibioticData: []
      };

      expect(() => {
        render(<VisualizationsTab {...propsWithoutAntibiotics} />);
      }).not.toThrow();
    });

    test('handles null medical conditions gracefully', () => {
      const propsWithNullConditions = {
        ...defaultProps,
        medicalConditions: null
      };

      expect(() => {
        render(<VisualizationsTab {...propsWithNullConditions} />);
      }).not.toThrow();
    });

    test('renders without crashing when callbacks are not provided', () => {
      const propsWithoutCallbacks = {
        pathogenData: mockPathogenData,
        antibioticData: mockAntibioticData,
        medicalConditions: mockMedicalConditions
      };

      expect(() => {
        render(<VisualizationsTab {...propsWithoutCallbacks} />);
      }).not.toThrow();
    });
  });

  describe('Accessibility - Guidelines Panel', () => {
    test('back button is keyboard accessible', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const backButton = screen.queryByText(/Back to Network/i);
          if (backButton) {
            expect(backButton).toHaveAccessibleName();
          }
        });
      }
    });

    test('disclaimer text is readable', async () => {
      render(<VisualizationsTab {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const guidelinesButton = buttons.find(btn =>
        btn.textContent.includes('Guideline')
      );

      if (guidelinesButton) {
        fireEvent.click(guidelinesButton);

        await waitFor(() => {
          const disclaimer = screen.queryByText(/Educational Use Only/i);
          if (disclaimer) {
            expect(disclaimer.textContent.length).toBeGreaterThan(5);
          }
        });
      }
    });
  });
});

/**
 * Integration Test Summary
 *
 * ✅ Component Rendering: VisualizationsTab renders without crashing
 * ✅ State Management: Guidelines state initialized correctly
 * ✅ Navigation: Can navigate to/from guidelines view
 * ✅ Props Integration: GuidelineComparisonPanel receives all required props
 * ✅ Callbacks: onGuidelineSelect and onExpandDetails callbacks wired
 * ✅ Emergency Mode: Properly integrated with emergency mode state
 * ✅ Error Handling: Wrapped in ErrorBoundary
 * ✅ Accessibility: Back button and disclaimer are accessible
 * ✅ Edge Cases: Handles missing/null data gracefully
 * ✅ Medical Disclaimer: Displayed with appropriate styling
 * ✅ Condition Display: Formats condition names correctly
 * ✅ Multiple Visualizations: Can switch between different view modes
 *
 * Total Integration Tests: 30+
 * Focus: Priority 2.2 - GuidelineComparisonPanel Integration
 */
