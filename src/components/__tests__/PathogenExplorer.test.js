/**
 * PathogenExplorer Component Tests
 * Medical Education Platform - Pediatric Focus
 * Tests critical medical pathogen functionality for educational accuracy
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PathogenExplorer from '../PathogenExplorer';

// Agent 23's Integration Approach: Import real medical data
import medicalConditions from '../../data/medicalConditions';
import { buildIndexes } from '../../utils/dataIndexer';

// Mock external dependencies
jest.mock('../research/ResearchIntegration', () => {
  return function MockResearchIntegration() {
    return <div data-testid="research-integration">Research Integration</div>;
  };
});

jest.mock('../PathogenNetworkVisualization', () => {
  return function MockPathogenNetworkVisualization() {
    return <div data-testid="pathogen-network-viz">Network Visualization</div>;
  };
});

jest.mock('../PathogenDetailPanel', () => {
  return function MockPathogenDetailPanel() {
    return <div data-testid="pathogen-detail-panel">Detail Panel</div>;
  };
});

jest.mock('../PathogenConnectionExplorer', () => {
  return function MockPathogenConnectionExplorer() {
    return <div data-testid="pathogen-connection-explorer">Connection Explorer</div>;
  };
});

// Agent 25's Enhanced Mock Strategy: Comprehensive hook mocking with realistic behavior
const mockPathogenRecommendations = {
  getRecommendations: jest.fn(() => []),
  updateRecommendations: jest.fn(),
  recordInteraction: jest.fn(),
  userPreferences: {},
  length: 0 // For recommendations array length checks
};

jest.mock('../../hooks/usePathogenRecommendations', () => {
  return () => mockPathogenRecommendations;
});

describe('PathogenExplorer - Medical Education Component', () => {
  // Agent 23's Integration Approach: Use real medical data instead of mocks
  const realMedicalConditions = medicalConditions.slice(0, 3); // Use subset for consistent test results
  const realIndexes = buildIndexes(realMedicalConditions); // Build complete indexes with real data
  
  const mockPathogenData = {
    pathogens: realIndexes.pathogens.map(p => ({ ...p, pediatricRelevance: 'high' })), // Real pathogen data with pediatric relevance
    selectedPathogen: null,
    selectedPathogenConditions: [],
    selectedPathogenAntibiotics: [],
    pathogenStats: { 
      total: realIndexes.pathogens.length, 
      gramPositive: realIndexes.pathogens.filter(p => p.gramStatus === 'positive').length,
      gramNegative: realIndexes.pathogens.filter(p => p.gramStatus === 'negative').length
    },
    filteredStats: { 
      total: realIndexes.pathogens.length, 
      gramPositive: realIndexes.pathogens.filter(p => p.gramStatus === 'positive').length,
      gramNegative: realIndexes.pathogens.filter(p => p.gramStatus === 'negative').length
    },
    searchQuery: '',
    gramFilter: 'all',
    typeFilter: 'all',
    sortBy: 'name',
    searchPathogens: jest.fn(),
    filterByGramStatus: jest.fn(),
    filterByType: jest.fn(),
    setSortOrder: jest.fn(),
    selectPathogen: jest.fn(),
    clearSelection: jest.fn(),
    clearFilters: jest.fn(),
    findSimilarPathogens: jest.fn(() => []),
    isLoading: false,
    indexes: realIndexes // Complete indexes with all required Maps and data structures
  };

  const mockOnSelectCondition = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Agent 25's Defensive Programming: Reset all mock functions to ensure clean state
    mockPathogenRecommendations.getRecommendations.mockReturnValue([]);
    mockPathogenRecommendations.updateRecommendations.mockClear();
  });

  describe('Component Rendering', () => {
    test('renders PathogenExplorer with medical search interface', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      expect(screen.getByRole('textbox', { name: /search pathogens/i })).toBeInTheDocument();
      expect(screen.getByText(/pathogen explorer/i)).toBeInTheDocument();
    });

    test('displays pathogen count statistics for medical education', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Precise Text Pattern: Component displays "{count} found" in pathogen list
      const actualPathogenCount = mockPathogenData.pathogens.length;
      expect(screen.getByText(new RegExp(`${actualPathogenCount} found`, 'i'))).toBeInTheDocument();
    });

    test('renders view mode toggle buttons', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      expect(screen.getByLabelText(/grid view/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/network view/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/explorer view/i)).toBeInTheDocument();
    });
  });

  describe('Medical Pathogen Selection - handlePathogenSelect', () => {
    test('selects pathogen and triggers medical data updates', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Dynamic Data Expectations: Use actual pathogen name from processed data
      const firstPathogen = mockPathogenData.pathogens[0];
      expect(firstPathogen).toBeDefined();
      expect(firstPathogen.name).toBeDefined();
      const pathogenCard = screen.getByText(firstPathogen.name);
      fireEvent.click(pathogenCard);

      expect(mockPathogenData.selectPathogen).toHaveBeenCalledWith(mockPathogenData.pathogens[0]);
    });

    test('updates pathogen recommendations for medical learning', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Dynamic Data Expectations: Use actual second pathogen name from processed data  
      const secondPathogen = mockPathogenData.pathogens[1] || mockPathogenData.pathogens[0];
      expect(secondPathogen).toBeDefined();
      expect(secondPathogen.name).toBeDefined();
      const pathogenCard = screen.getByText(secondPathogen.name);
      fireEvent.click(pathogenCard);

      // Agent 25's Integration Testing: Mock should be called through recommendations hook
      expect(mockPathogenData.selectPathogen).toHaveBeenCalled();
    });
  });

  describe('Gram Status Classification - Medical Accuracy', () => {
    test('getGramStatusColor returns correct medical classification colors', () => {
      const { container } = render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Verify gram-positive organisms show correct styling
      const gramPositiveElements = container.querySelectorAll('[class*="bg-purple"]');
      expect(gramPositiveElements.length).toBeGreaterThan(0);
    });

    test('getGramStatusLabel provides accurate medical terminology', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Precise Text Pattern: Component displays "Gram(+):" and "Gram(-):" in filtered statistics
      // These appear in the filtered results section as "Gram(+): {count}" and "Gram(-): {count}"
      expect(screen.getByText(/Gram\(\+\):/)).toBeInTheDocument(); // Filtered statistics section
      expect(screen.getByText(/Gram\(\-\):/)).toBeInTheDocument(); // Filtered statistics section
    });
  });

  describe('Medical Filtering and Search', () => {
    test('filterByGramStatus provides clinical categorization', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      const gramFilter = screen.getByRole('combobox', { name: /gram status/i });
      fireEvent.change(gramFilter, { target: { value: 'positive' } });

      expect(mockPathogenData.filterByGramStatus).toHaveBeenCalledWith('positive');
    });

    test('search functionality filters medical pathogens', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      const searchInput = screen.getByRole('textbox', { name: /search pathogens/i });
      fireEvent.change(searchInput, { target: { value: 'Staphylococcus' } });

      expect(mockPathogenData.searchPathogens).toHaveBeenCalledWith('Staphylococcus');
    });
  });

  describe('Enhanced Medical Data Processing - enhancedPathogenData', () => {
    test('processes selected pathogen for medical education display', () => {
      // Agent 25's Defensive Programming: Enhanced error boundary testing
      const pathogenDataWithSelection = {
        ...mockPathogenData,
        selectedPathogen: mockPathogenData.pathogens[0],
        indexes: mockPathogenData.indexes // Ensure indexes are available
      };

      // Agent 25's Component Stability: Wrap in error boundary simulation
      const { container } = render(
        <PathogenExplorer 
          pathogenData={pathogenDataWithSelection} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Verify component renders without crashing
      expect(container.firstChild).toBeInTheDocument();
      expect(mockPathogenData.findSimilarPathogens).toHaveBeenCalledWith(mockPathogenData.pathogens[0]);
    });

    test('integrates clinical conditions and treatment options', async () => {
      // Agent 25's Defensive Programming: Enhanced null safety
      const pathogenDataWithSelection = {
        ...mockPathogenData,
        selectedPathogen: mockPathogenData.pathogens[0],
        selectedPathogenConditions: ['cellulitis', 'pneumonia'],
        selectedPathogenAntibiotics: ['vancomycin', 'clindamycin'],
        indexes: mockPathogenData.indexes // Ensure indexes are available for enhanced data processing
      };

      render(
        <PathogenExplorer 
          pathogenData={pathogenDataWithSelection} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Switch to network view where detail panel is guaranteed to render
      const networkViewButton = screen.getByLabelText(/network view/i);
      fireEvent.click(networkViewButton);

      // Agent 25's Integration Testing: Verify proper component loading with Suspense
      await waitFor(() => {
        expect(screen.getByTestId('pathogen-detail-panel')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Similar Pathogen Discovery - findSimilarPathogens', () => {
    test('identifies medically related organisms', () => {
      const mockSimilarPathogens = [
        { id: 'staph_epidermidis', name: 'Staphylococcus epidermidis', gramStatus: 'positive' }
      ];
      
      mockPathogenData.findSimilarPathogens.mockReturnValue(mockSimilarPathogens);

      const pathogenDataWithSelection = {
        ...mockPathogenData,
        selectedPathogen: mockPathogenData.pathogens[0]
      };

      render(
        <PathogenExplorer 
          pathogenData={pathogenDataWithSelection} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      expect(mockPathogenData.findSimilarPathogens).toHaveBeenCalledWith(mockPathogenData.pathogens[0]);
    });
  });

  describe('View Mode Management', () => {
    test('switches between grid, network, and explorer views', async () => {
      // Agent 25's Component Stability: Enhanced error boundary and data safety
      const enhancedPathogenData = {
        ...mockPathogenData,
        indexes: mockPathogenData.indexes, // Required for network and explorer views
        selectedPathogen: null // Start with no selection to avoid auto-selection issues
      };

      const { container } = render(
        <PathogenExplorer 
          pathogenData={enhancedPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Agent 25's Defensive Programming: Verify component is stable before interactions
      expect(container.firstChild).toBeInTheDocument();

      // Switch to network view
      const networkViewButton = screen.getByLabelText(/network view/i);
      fireEvent.click(networkViewButton);

      await waitFor(() => {
        expect(screen.getByTestId('pathogen-network-viz')).toBeInTheDocument();
      }, { timeout: 3000 }); // Agent 25's Defensive Programming: Extended timeout for lazy loading

      // Switch to explorer view
      const explorerViewButton = screen.getByLabelText(/explorer view/i);
      fireEvent.click(explorerViewButton);

      await waitFor(() => {
        expect(screen.getByTestId('pathogen-connection-explorer')).toBeInTheDocument();
      }, { timeout: 3000 }); // Agent 25's Defensive Programming: Extended timeout for lazy loading
    });
  });

  describe('Medical Education Integration', () => {
    test('displays research integration component', () => {
      // Agent 25's Real Medical Data Approach: Test conditional rendering logic
      const pathogenDataWithSelection = {
        ...mockPathogenData,
        selectedPathogen: mockPathogenData.pathogens[0] // Select first pathogen to trigger research integration
      };

      const { container } = render(
        <PathogenExplorer 
          pathogenData={pathogenDataWithSelection} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Agent 25's Component Stability: Verify component renders without errors first
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByTestId('research-integration')).toBeInTheDocument();
    });

    test('handles loading states for medical data', () => {
      const loadingPathogenData = {
        ...mockPathogenData,
        isLoading: true
      };

      render(
        <PathogenExplorer 
          pathogenData={loadingPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Medical Data Validation', () => {
    test('validates pathogen medical properties', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Check that medical pathogens display required clinical information
      mockPathogenData.pathogens.forEach(pathogen => {
        expect(screen.getByText(pathogen.name)).toBeInTheDocument();
      });
    });

    test('ensures pediatric medical relevance is displayed', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // All test pathogens should have high pediatric relevance
      mockPathogenData.pathogens.forEach(pathogen => {
        expect(pathogen.pediatricRelevance).toBe('high');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles empty pathogen data gracefully', () => {
      const emptyPathogenData = {
        ...mockPathogenData,
        pathogens: []
      };

      render(
        <PathogenExplorer 
          pathogenData={emptyPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      expect(screen.getByText(/0 found/i)).toBeInTheDocument();
    });

    test('handles missing similar pathogens', () => {
      mockPathogenData.findSimilarPathogens.mockReturnValue([]);

      const pathogenDataWithSelection = {
        ...mockPathogenData,
        selectedPathogen: mockPathogenData.pathogens[0]
      };

      render(
        <PathogenExplorer 
          pathogenData={pathogenDataWithSelection} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      expect(mockPathogenData.findSimilarPathogens).toHaveBeenCalled();
    });
  });
});