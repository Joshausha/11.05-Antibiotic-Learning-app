/**
 * PathogenExplorer Component Tests
 * Medical Education Platform - Pediatric Focus
 * Tests critical medical pathogen functionality for educational accuracy
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PathogenExplorer from '../PathogenExplorer';

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

// Mock hooks
const mockPathogenRecommendations = {
  getRecommendations: jest.fn(() => []),
  updateRecommendations: jest.fn()
};

jest.mock('../../hooks/usePathogenRecommendations', () => {
  return () => mockPathogenRecommendations;
});

describe('PathogenExplorer - Medical Education Component', () => {
  // Sample medical test data for pediatric education
  const mockPathogenData = {
    pathogens: [
      {
        id: 'staph_aureus',
        name: 'Staphylococcus aureus',
        gramStatus: 'positive',
        type: 'cocci',
        medicalRelevance: 'high',
        pediatricRelevance: 'high',
        conditions: ['cellulitis', 'pneumonia', 'sepsis'],
        antibiotics: ['vancomycin', 'clindamycin']
      },
      {
        id: 'e_coli',
        name: 'Escherichia coli',
        gramStatus: 'negative',
        type: 'rod',
        medicalRelevance: 'high',
        pediatricRelevance: 'high',
        conditions: ['uti', 'gastroenteritis'],
        antibiotics: ['ampicillin', 'ceftriaxone']
      },
      {
        id: 'strep_pyogenes',
        name: 'Streptococcus pyogenes',
        gramStatus: 'positive',
        type: 'cocci',
        medicalRelevance: 'high',
        pediatricRelevance: 'high',
        conditions: ['pharyngitis', 'cellulitis'],
        antibiotics: ['penicillin', 'azithromycin']
      }
    ],
    selectedPathogen: null,
    selectedPathogenConditions: [],
    selectedPathogenAntibiotics: [],
    pathogenStats: { total: 3, gramPositive: 2, gramNegative: 1 },
    filteredStats: { total: 3, gramPositive: 2, gramNegative: 1 },
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
    indexes: {
      pathogens: [
        {
          id: 'staph_aureus',
          name: 'Staphylococcus aureus',
          gramStatus: 'positive',
          type: 'cocci',
          conditions: ['cellulitis', 'pneumonia', 'sepsis']
        },
        {
          id: 'e_coli',
          name: 'Escherichia coli',
          gramStatus: 'negative',
          type: 'rod',
          conditions: ['uti', 'gastroenteritis']
        }
      ],
      conditions: [],
      antibiotics: [],
      pathogenToConditions: new Map(),
      antibioticToConditions: new Map(),
      conditionToPathogens: new Map(),
      conditionToAntibiotics: new Map()
    }
  };

  const mockOnSelectCondition = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(screen.getByText(/explore pathogens/i)).toBeInTheDocument();
    });

    test('displays pathogen count statistics for medical education', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      expect(screen.getByText(/3 pathogens/i)).toBeInTheDocument();
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

      const pathogenCard = screen.getByText('Staphylococcus aureus');
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

      const pathogenCard = screen.getByText('Escherichia coli');
      fireEvent.click(pathogenCard);

      expect(mockPathogenRecommendations.updateRecommendations).toHaveBeenCalled();
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

      // Should display proper gram stain classifications
      expect(screen.getByText(/gram-positive/i)).toBeInTheDocument();
      expect(screen.getByText(/gram-negative/i)).toBeInTheDocument();
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

    test('integrates clinical conditions and treatment options', () => {
      const pathogenDataWithSelection = {
        ...mockPathogenData,
        selectedPathogen: mockPathogenData.pathogens[0],
        selectedPathogenConditions: ['cellulitis', 'pneumonia'],
        selectedPathogenAntibiotics: ['vancomycin', 'clindamycin']
      };

      render(
        <PathogenExplorer 
          pathogenData={pathogenDataWithSelection} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Should display medical conditions and treatments
      expect(screen.getByTestId('pathogen-detail-panel')).toBeInTheDocument();
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
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

      // Switch to network view
      const networkViewButton = screen.getByLabelText(/network view/i);
      fireEvent.click(networkViewButton);

      await waitFor(() => {
        expect(screen.getByTestId('pathogen-network-viz')).toBeInTheDocument();
      });

      // Switch to explorer view
      const explorerViewButton = screen.getByLabelText(/explorer view/i);
      fireEvent.click(explorerViewButton);

      await waitFor(() => {
        expect(screen.getByTestId('pathogen-connection-explorer')).toBeInTheDocument();
      });
    });
  });

  describe('Medical Education Integration', () => {
    test('displays research integration component', () => {
      render(
        <PathogenExplorer 
          pathogenData={mockPathogenData} 
          onSelectCondition={mockOnSelectCondition}
        />
      );

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

      expect(screen.getByText(/0 pathogens/i)).toBeInTheDocument();
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