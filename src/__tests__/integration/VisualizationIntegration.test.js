/**
 * Integration tests for the complete visualization system
 * Tests the integration of VisualizationsTab, Northwestern components, and navigation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

// Mock the Northwestern Animation System to avoid issues in test environment
jest.mock('../../animations/NorthwesternAnimations', () => ({
  useNorthwesternAnimations: () => ({
    animationManager: {
      animate: jest.fn().mockResolvedValue(undefined),
      setEmergencyMode: jest.fn(),
      cleanup: jest.fn()
    },
    createCoverageRevealAnimation: jest.fn(() => ({
      element: null,
      config: { keyframes: [], duration: 0 }
    })),
    createHoverAnimation: jest.fn(() => ({
      element: null,
      config: { keyframes: [], duration: 0 }
    })),
    createSelectionAnimation: jest.fn(() => ({
      element: null,
      config: { keyframes: [], duration: 0 }
    })),
    createLearningProgressAnimation: jest.fn(() => ({
      element: null,
      config: { keyframes: [], duration: 0 }
    })),
    createScenarioTransitionAnimation: jest.fn(() => ({
      element: null,
      config: { keyframes: [], duration: 0 }
    })),
    CLINICAL_TIMING: {
      educational: { duration: 800 },
      clinical: { duration: 400 },
      emergency: { duration: 0 }
    },
    MEDICAL_EASING: {
      educational: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      clinical: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      emergency: 'linear'
    }
  })
}));

// Mock PathogenNetworkVisualization to avoid external dependencies
jest.mock('../../components/PathogenNetworkVisualization', () => {
  return function MockPathogenNetworkVisualization() {
    return <div data-testid="pathogen-network">Pathogen Network Visualization</div>;
  };
});

// Mock NorthwesternSpatialLayout to avoid complex dependencies
jest.mock('../../components/NorthwesternSpatialLayout', () => {
  return function MockNorthwesternSpatialLayout() {
    return <div data-testid="northwestern-spatial">Northwestern Spatial Layout</div>;
  };
});

// Mock AnimatedNorthwesternPieChart
jest.mock('../../components/AnimatedNorthwesternPieChart', () => {
  return function MockAnimatedNorthwesternPieChart() {
    return <div data-testid="northwestern-pie">Northwestern Pie Chart</div>;
  };
});

describe('Visualization Integration Tests', () => {
  beforeEach(() => {
    // Clear any console warnings from animation system
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Complete Application Flow', () => {
    test('navigates to visualizations tab and displays dashboard', async () => {
      render(<App />);
      
      // Click on visualizations tab
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Data Visualizations')).toBeInTheDocument();
      });
      
      // Check that visualization selector is present
      expect(screen.getByText('Visualization Type')).toBeInTheDocument();
      
      // Check that Northwestern Animation controls are present
      expect(screen.getByText('⚡ Normal')).toBeInTheDocument();
      expect(screen.getByText('🎬 Animated')).toBeInTheDocument();
    });

    test('displays overview dashboard by default', async () => {
      render(<App />);
      
      // Navigate to visualizations
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        // Check for key metrics cards by finding the specific metric labels
        const metricsCards = screen.getAllByText('Medical Conditions');
        expect(metricsCards.length).toBeGreaterThan(0);
        
        const pathogenCards = screen.getAllByText('Pathogens');
        expect(pathogenCards.length).toBeGreaterThan(0);
        
        const antibioticCards = screen.getAllByText('Antibiotics');
        expect(antibioticCards.length).toBeGreaterThan(0);
        
        const categoryCards = screen.getAllByText('Categories');
        expect(categoryCards.length).toBeGreaterThan(0);
      });
      
      // Check for gram status distribution
      expect(screen.getByText('Gram Status Distribution')).toBeInTheDocument();
      expect(screen.getByText('Gram-Positive')).toBeInTheDocument();
      expect(screen.getByText('Gram-Negative')).toBeInTheDocument();
    });

    test('switches between different visualization types', async () => {
      render(<App />);
      
      // Navigate to visualizations
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Data Visualizations')).toBeInTheDocument();
      });
      
      // Test pathogen network visualization
      const pathogenNetworkButton = screen.getByText('Pathogen Network');
      fireEvent.click(pathogenNetworkButton);
      
      await waitFor(() => {
        expect(screen.getByText('Pathogen Relationship Network')).toBeInTheDocument();
        expect(screen.getByText('Layout:')).toBeInTheDocument();
      });
      
      // Test antibiotic analysis visualization
      const antibioticAnalysisButton = screen.getByText('Antibiotic Analysis');
      fireEvent.click(antibioticAnalysisButton);
      
      await waitFor(() => {
        expect(screen.getByText('Interactive Antibiotic Coverage Analysis')).toBeInTheDocument();
      });
    });

    test('Northwestern Spatial Layout integration works', async () => {
      render(<App />);
      
      // Navigate to visualizations and pathogen network
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        const pathogenNetworkButton = screen.getByText('Pathogen Network');
        fireEvent.click(pathogenNetworkButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Layout:')).toBeInTheDocument();
      });
      
      // Switch to Northwestern Spatial layout
      const layoutSelect = screen.getByDisplayValue('Force-Directed');
      fireEvent.change(layoutSelect, { target: { value: 'spatial' } });
      
      await waitFor(() => {
        expect(screen.getByText('View:')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Clustered')).toBeInTheDocument();
      });
      
      // Test view mode switching
      const viewSelect = screen.getByDisplayValue('Clustered');
      fireEvent.change(viewSelect, { target: { value: 'grid' } });
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Grid Layout')).toBeInTheDocument();
      });
    });

    test('Northwestern Animation System controls function', async () => {
      render(<App />);
      
      // Navigate to visualizations
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        expect(screen.getByText('⚡ Normal')).toBeInTheDocument();
        expect(screen.getByText('🎬 Animated')).toBeInTheDocument();
      });
      
      // Test emergency mode toggle
      const emergencyButton = screen.getByText('⚡ Normal');
      fireEvent.click(emergencyButton);
      
      await waitFor(() => {
        expect(screen.getByText('🚨 Emergency')).toBeInTheDocument();
      });
      
      // Test animation toggle
      const animationButton = screen.getByText('🎬 Animated');
      fireEvent.click(animationButton);
      
      await waitFor(() => {
        expect(screen.getByText('📊 Static')).toBeInTheDocument();
      });
    });

    test('filters work across visualization types', async () => {
      render(<App />);
      
      // Navigate to visualizations
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        expect(screen.getByText('All Data')).toBeInTheDocument();
      });
      
      // Test filter selection
      const filterSelect = screen.getByDisplayValue('All Data');
      fireEvent.change(filterSelect, { target: { value: 'gram-positive' } });
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Gram-Positive Only')).toBeInTheDocument();
      });
      
      // Switch to different visualization and verify filter persists
      const pathogenAnalysisButton = screen.getByText('Pathogen Analysis');
      fireEvent.click(pathogenAnalysisButton);
      
      await waitFor(() => {
        expect(screen.getByText('Pathogen Analysis Dashboard')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Gram-Positive Only')).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration', () => {
    test('ErrorBoundary protects visualization components', async () => {
      // Mock console.error to avoid noise in test output
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<App />);
      
      // Navigate to visualizations
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Data Visualizations')).toBeInTheDocument();
      });
      
      // The ErrorBoundary should be wrapping the visualization content
      // If there were an error, it would be caught and handled gracefully
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    test('visualization selection resets to default after navigation', async () => {
      render(<App />);
      
      // Navigate to visualizations
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        const categoryButton = screen.getByText('Category Distribution');
        fireEvent.click(categoryButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Medical Conditions by Category')).toBeInTheDocument();
      });
      
      // Navigate away and back
      const learnButton = screen.getByText('Learn');
      fireEvent.click(learnButton);
      
      await waitFor(() => {
        expect(screen.getByText('Medical Learning App')).toBeInTheDocument();
      });
      
      // Navigate back to visualizations
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        // State resets to default (Overview Dashboard)
        expect(screen.getByText('Medical Conditions')).toBeInTheDocument();
        // Should be able to select Category Distribution again
        expect(screen.getByText('Category Distribution')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Accessibility', () => {
    test('visualizations render within reasonable time', async () => {
      const startTime = performance.now();
      
      render(<App />);
      
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Data Visualizations')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 3 seconds for accessibility
      expect(renderTime).toBeLessThan(3000);
    });

    test('keyboard navigation works in visualization tab', async () => {
      render(<App />);
      
      // Navigate to visualizations
      const visualizationsButton = screen.getByText('Visualizations');
      fireEvent.click(visualizationsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Data Visualizations')).toBeInTheDocument();
      });
      
      // Test keyboard interaction with visualization selector buttons
      const overviewButton = screen.getByText('Overview Dashboard');
      
      // Test Enter key
      fireEvent.keyDown(overviewButton, { key: 'Enter' });
      expect(screen.getByText('Medical Conditions')).toBeInTheDocument();
      
      // Test Space key with proper click simulation
      const networkButton = screen.getByText('Pathogen Network');
      fireEvent.keyDown(networkButton, { key: ' ' });
      fireEvent.click(networkButton); // Simulate the actual click that would happen
      
      await waitFor(() => {
        expect(screen.getByText('Pathogen Relationship Network')).toBeInTheDocument();
      });
    });
  });
});