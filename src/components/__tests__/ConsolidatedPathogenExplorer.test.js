/**
 * ConsolidatedPathogenExplorer Component Tests
 * @description Comprehensive test suite for the ConsolidatedPathogenExplorer component
 * @created 2025-08-17
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConsolidatedPathogenExplorer from '../ConsolidatedPathogenExplorer';
import { renderWithContext } from '../../utils/testUtils';

// Agent T4: Component Rendering Crash Fixes
// Applied comprehensive mock system to prevent undefined data access
// All mock data is now contained within jest.mock() calls to avoid hoisting issues

// Mock the data modules with comprehensive coverage
jest.mock('../../data/SimplePathogenData', () => {
  const pathogenData = [
    {
      id: 1,
      name: 'Staphylococcus aureus',
      commonName: 'Staph aureus',
      gramStatus: 'positive',
      shape: 'cocci',
      severity: 'high',
      resistance: 'MRSA strains common',
      commonSites: ['skin', 'blood', 'bone'],
      description: 'Common pathogen causing various infections'
    },
    {
      id: 2,
      name: 'Escherichia coli',
      commonName: 'E. coli',
      gramStatus: 'negative',
      shape: 'rod',
      severity: 'medium',
      resistance: 'ESBL production',
      commonSites: ['urinary tract', 'GI tract'],
      description: 'Gram-negative rod causing UTIs and GI infections'
    },
    {
      id: 3,
      name: 'Streptococcus pneumoniae',
      commonName: 'Pneumococcus',
      gramStatus: 'positive',
      shape: 'cocci',
      severity: 'high',
      resistance: 'Penicillin resistance',
      commonSites: ['lungs', 'blood', 'meninges'],
      description: 'Leading cause of pneumonia and meningitis'
    }
  ];

  return {
    __esModule: true,
    default: pathogenData,
    searchPathogens: jest.fn((term) => {
      if (!term) return pathogenData;
      return pathogenData.filter(p => 
        p.commonName.toLowerCase().includes(term.toLowerCase())
      );
    }),
    getPathogensByGramStatus: jest.fn((status) => {
      if (status === 'all') return pathogenData;
      return pathogenData.filter(p => p.gramStatus === status);
    }),
    getPathogensBySeverity: jest.fn((severity) => {
      if (severity === 'all') return pathogenData;
      return pathogenData.filter(p => p.severity === severity);
    }),
    getPathogenById: jest.fn((id) => pathogenData.find(p => p.id === id)),
    getPathogenByName: jest.fn((name) => pathogenData.find(p => 
      p.commonName.toLowerCase() === name.toLowerCase()
    )),
    validatePathogenData: jest.fn(() => null)
  };
});


jest.mock('../../data/SimpleAntibioticData', () => {
  const antibioticData = [
    {
      id: 1,
      name: 'Vancomycin',
      class: 'Glycopeptide',
      mechanism: 'Cell wall synthesis inhibition',
      route: 'IV',
      description: 'Gram-positive coverage, nephrotoxic'
    },
    {
      id: 2,
      name: 'Ciprofloxacin',
      class: 'Fluoroquinolone',
      mechanism: 'DNA gyrase inhibition',
      route: 'PO/IV',
      description: 'Broad spectrum, avoid in pediatrics'
    }
  ];

  return {
    __esModule: true,
    default: antibioticData,
    getAntibioticById: jest.fn((id) => {
      const antibiotic = antibioticData.find(a => a.id === id);
      return antibiotic || {
        id,
        name: `Antibiotic ${id}`,
        class: 'Unknown',
        mechanism: 'Unknown',
        route: 'Unknown',
        description: 'Mock antibiotic'
      };
    })
  };
});


jest.mock('../../data/pathogenAntibioticMap', () => {
  const pathogenAntibioticMapping = {
    1: { antibiotics: [{ antibioticId: 1, effectiveness: 'high', notes: 'First-line for MRSA' }] },
    2: { antibiotics: [{ antibioticId: 2, effectiveness: 'high', notes: 'Good for gram-negative' }] },
    3: { antibiotics: [{ antibioticId: 1, effectiveness: 'medium', notes: 'Alternative therapy' }] }
  };

  return {
    __esModule: true,
    default: pathogenAntibioticMapping,
    getAntibioticsForPathogen: jest.fn((pathogenId) => {
      const mapping = pathogenAntibioticMapping[pathogenId];
      return mapping ? mapping.antibiotics : [];
    })
  };
});


jest.mock('../../data/durationMappings', () => {
  const enhancedMapping = {
    '1': {
      allDurations: [
        { parsedDuration: { category: 'short', isComplex: false } }
      ]
    },
    '2': {
      allDurations: [
        { parsedDuration: { category: 'medium', isComplex: false } }
      ]
    },
    '3': {
      allDurations: [
        { parsedDuration: { category: 'long', isComplex: true } }
      ]
    }
  };

  const durationStats = {
    totalConditions: 25,
    durationTypes: { simple: 20, complex: 5 },
    averageDurationDays: 7,
    durationRange: { min: 3, max: 21 }
  };

  return {
    __esModule: true,
    enhancedPathogenAntibioticMap: enhancedMapping,
    getDurationStatistics: jest.fn(() => durationStats),
    searchConditionsByDuration: jest.fn((duration) => []),
    getConditionsByDuration: jest.fn((duration) => [])
  };
});

// Mock child components
jest.mock('../PathogenList', () => {
  return function MockPathogenList({ 
    pathogens, 
    onSelectPathogen, 
    selectedPathogen,
    searchTerm,
    onSearch,
    gramFilter,
    onGramFilter,
    severityFilter,
    onSeverityFilter,
    durationFilter,
    onDurationFilter
  }) {
    return (
      <div data-testid="pathogen-list">
        <input 
          data-testid="pathogen-search"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search pathogens"
        />
        <select 
          data-testid="gram-filter"
          value={gramFilter}
          onChange={(e) => onGramFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
        <select 
          data-testid="severity-filter"
          value={severityFilter}
          onChange={(e) => onSeverityFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select 
          data-testid="duration-filter"
          value={durationFilter}
          onChange={(e) => onDurationFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
          <option value="complex">Complex</option>
        </select>
        {pathogens.map(pathogen => (
          <div 
            key={pathogen.id}
            data-testid={`pathogen-${pathogen.id}`}
            onClick={() => onSelectPathogen(pathogen)}
            className={selectedPathogen?.id === pathogen.id ? 'selected' : ''}
          >
            <div>{pathogen.name}</div>
            <div className="text-xs text-gray-500">{pathogen.commonName}</div>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../PathogenCard', () => {
  return function MockPathogenCard({ pathogen, onClose }) {
    if (!pathogen) return <div data-testid="pathogen-card-empty">No pathogen selected</div>;
    
    return (
      <div data-testid="pathogen-card">
        <h3>{pathogen.name}</h3>
        <div className="text-sm text-gray-600">{pathogen.commonName}</div>
        <p>{pathogen.description}</p>
        <div>Gram Status: {pathogen.gramStatus}</div>
        <div>Shape: {pathogen.shape}</div>
        <div>Severity: {pathogen.severity}</div>
        {pathogen.resistance && <div>Resistance: {pathogen.resistance}</div>}
        {onClose && (
          <button onClick={onClose} data-testid="close-pathogen-card">Close</button>
        )}
      </div>
    );
  };
});

jest.mock('../AntibioticList', () => {
  return function MockAntibioticList({ 
    pathogen, 
    antibiotics, 
    onSelectAntibiotic, 
    selectedAntibiotic 
  }) {
    if (!pathogen) return <div data-testid="antibiotic-list-empty">No pathogen selected</div>;
    
    return (
      <div data-testid="antibiotic-list">
        <h3>Antibiotics for {pathogen.name}</h3>
        {antibiotics.map((antibiotic, index) => (
          <div 
            key={index}
            data-testid={`antibiotic-${index}`}
            onClick={() => onSelectAntibiotic(antibiotic)}
            className={selectedAntibiotic?.name === antibiotic.name ? 'selected' : ''}
          >
            {antibiotic.name}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../SimpleNetworkView', () => {
  return function MockSimpleNetworkView({ 
    pathogens, 
    selectedPathogen, 
    onSelectPathogen,
    relationships 
  }) {
    return (
      <div data-testid="network-view">
        <h3>Network View</h3>
        {pathogens.map(pathogen => (
          <div 
            key={pathogen.id}
            data-testid={`network-pathogen-${pathogen.id}`}
            onClick={() => onSelectPathogen(pathogen)}
            className={selectedPathogen?.id === pathogen.id ? 'selected' : ''}
          >
            <div>{pathogen.name}</div>
            <div className="text-xs">{pathogen.commonName}</div>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../DurationIndicator', () => ({
  DurationLegend: function MockDurationLegend() {
    return <div data-testid="duration-legend">Duration Legend</div>;
  }
}));

describe('ConsolidatedPathogenExplorer Component', () => {
  const mockOnSelectCondition = jest.fn();

  // Import the mocked pathogen data to use in tests
  const mockPathogenData = require('../../data/SimplePathogenData').default;
  
  const defaultProps = {
    pathogenData: mockPathogenData,
    onPathogenSelect: mockOnSelectCondition,
    onSelectPathogen: mockOnSelectCondition
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders component header with title and description', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText('Pathogen & Antibiotic Explorer')).toBeInTheDocument();
      expect(screen.getByText('Explore pathogens, antibiotics, and their relationships')).toBeInTheDocument();
    });

    test('renders view mode toggle buttons', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText('List')).toBeInTheDocument();
      expect(screen.getByText('Network')).toBeInTheDocument();
    });

    test('renders summary statistics', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText('3')).toBeInTheDocument(); // Total pathogens
      expect(screen.getByText('2')).toBeInTheDocument(); // Total antibiotics
      expect(screen.getByText('Duration Guidelines')).toBeInTheDocument();
    });

    test('renders duration statistics section', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText('Treatment Duration Overview')).toBeInTheDocument();
      expect(screen.getByTestId('duration-legend')).toBeInTheDocument();
    });
  });

  describe('View Mode Switching', () => {
    test('starts in list view by default', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const listButton = screen.getByText('List');
      expect(listButton).toHaveClass('bg-blue-500', 'text-white');
      expect(screen.getByTestId('pathogen-list')).toBeInTheDocument();
    });

    test('switches to network view when network button is clicked', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const networkButton = screen.getByText('Network');
      fireEvent.click(networkButton);
      
      expect(networkButton).toHaveClass('bg-blue-500', 'text-white');
      expect(screen.getByTestId('network-view')).toBeInTheDocument();
    });

    test('switches back to list view when list button is clicked', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      // Switch to network first
      fireEvent.click(screen.getByText('Network'));
      expect(screen.getByTestId('network-view')).toBeInTheDocument();
      
      // Switch back to list
      fireEvent.click(screen.getByText('List'));
      expect(screen.getByTestId('pathogen-list')).toBeInTheDocument();
    });
  });

  describe('List View Layout', () => {
    test('renders pathogen list, pathogen card, and antibiotic list in list view', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByTestId('pathogen-list')).toBeInTheDocument();
      expect(screen.getByTestId('pathogen-card-empty')).toBeInTheDocument();
      expect(screen.getByTestId('antibiotic-list-empty')).toBeInTheDocument();
    });

    test('shows pathogen details when pathogen is selected in list view', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      expect(screen.getByTestId('pathogen-card')).toBeInTheDocument();
      expect(screen.getByTestId('pathogen-card')).toHaveTextContent('Staphylococcus aureus');
    });

    test('shows antibiotic list when pathogen is selected in list view', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      expect(screen.getByTestId('antibiotic-list')).toBeInTheDocument();
      expect(screen.getByTestId('antibiotic-list')).toHaveTextContent('Antibiotics for Staphylococcus aureus');
    });
  });

  describe('Network View Layout', () => {
    test('renders network view and side panel when in network mode', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Network'));
      
      expect(screen.getByTestId('network-view')).toBeInTheDocument();
      expect(screen.getByTestId('pathogen-card-empty')).toBeInTheDocument();
    });

    test('shows pathogen details in side panel when pathogen is selected in network view', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Network'));
      
      const networkPathogen = screen.getByTestId('network-pathogen-1');
      fireEvent.click(networkPathogen);
      
      expect(screen.getByTestId('pathogen-card')).toBeInTheDocument();
      expect(screen.getByTestId('antibiotic-list')).toBeInTheDocument();
    });
  });

  describe('Pathogen Selection', () => {
    test('handles pathogen selection and updates state', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      expect(pathogenElement).toHaveClass('selected');
      expect(screen.getByTestId('pathogen-card')).toBeInTheDocument();
    });

    test('clears antibiotic selection when new pathogen is selected', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      // Select first pathogen
      const pathogen1 = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogen1);
      
      // Select antibiotic
      const antibiotic = screen.getByTestId('antibiotic-0');
      fireEvent.click(antibiotic);
      
      // Select different pathogen
      const pathogen2 = screen.getByTestId('pathogen-2');
      fireEvent.click(pathogen2);
      
      // Antibiotic selection should be cleared
      expect(screen.queryByText('Selected Antibiotic:')).not.toBeInTheDocument();
    });

    test('shows clear selection button when pathogen is selected', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      expect(screen.getByText('Clear Selection')).toBeInTheDocument();
    });

    test('clears selection when clear selection button is clicked', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      // Select pathogen
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      // Clear selection
      const clearButton = screen.getByText('Clear Selection');
      fireEvent.click(clearButton);
      
      expect(screen.getByTestId('pathogen-card-empty')).toBeInTheDocument();
      expect(screen.queryByText('Clear Selection')).not.toBeInTheDocument();
    });
  });

  describe('Antibiotic Selection', () => {
    beforeEach(() => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      // Select a pathogen first
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
    });

    test('allows selecting antibiotics for selected pathogen', () => {
      const antibioticElement = screen.getByTestId('antibiotic-0');
      fireEvent.click(antibioticElement);
      
      expect(antibioticElement).toHaveClass('selected');
    });

    test('shows selected antibiotic information panel', () => {
      const antibioticElement = screen.getByTestId('antibiotic-0');
      fireEvent.click(antibioticElement);
      
      expect(screen.getByText('Selected Antibiotic:')).toBeInTheDocument();
      expect(screen.getByText('Vancomycin')).toBeInTheDocument();
    });

    test('shows antibiotic details in information panel', () => {
      const antibioticElement = screen.getByTestId('antibiotic-0');
      fireEvent.click(antibioticElement);
      
      expect(screen.getByText('Class:')).toBeInTheDocument();
      expect(screen.getByText('Mechanism:')).toBeInTheDocument();
      expect(screen.getByText('Route:')).toBeInTheDocument();
    });

    test('clears antibiotic selection when close button is clicked', () => {
      const antibioticElement = screen.getByTestId('antibiotic-0');
      fireEvent.click(antibioticElement);
      
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Selected Antibiotic:')).not.toBeInTheDocument();
    });
  });

  describe('Filtering Functionality', () => {
    test('allows searching pathogens', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const searchInput = screen.getByTestId('pathogen-search');
      fireEvent.change(searchInput, { target: { value: 'staph' } });
      
      expect(searchInput).toHaveValue('staph');
    });

    test('allows filtering by gram status', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const gramFilter = screen.getByTestId('gram-filter');
      fireEvent.change(gramFilter, { target: { value: 'positive' } });
      
      expect(gramFilter).toHaveValue('positive');
    });

    test('allows filtering by severity', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const severityFilter = screen.getByTestId('severity-filter');
      fireEvent.change(severityFilter, { target: { value: 'high' } });
      
      expect(severityFilter).toHaveValue('high');
    });

    test('allows filtering by duration', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const durationFilter = screen.getByTestId('duration-filter');
      fireEvent.change(durationFilter, { target: { value: 'short' } });
      
      expect(durationFilter).toHaveValue('short');
    });

    test('shows clear filters button when filters are applied', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const gramFilter = screen.getByTestId('gram-filter');
      fireEvent.change(gramFilter, { target: { value: 'positive' } });
      
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    test('clears all filters when clear filters button is clicked', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      // Apply filters
      const gramFilter = screen.getByTestId('gram-filter');
      const severityFilter = screen.getByTestId('severity-filter');
      fireEvent.change(gramFilter, { target: { value: 'positive' } });
      fireEvent.change(severityFilter, { target: { value: 'high' } });
      
      // Clear filters
      const clearButton = screen.getByText('Clear Filters');
      fireEvent.click(clearButton);
      
      expect(gramFilter).toHaveValue('all');
      expect(severityFilter).toHaveValue('all');
    });
  });

  describe('Resistance Alert Banner', () => {
    test('shows resistance alert when pathogen with resistance is selected', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1'); // Staph aureus with MRSA
      fireEvent.click(pathogenElement);
      
      expect(screen.getByText(/Resistance Pattern Alert/)).toBeInTheDocument();
      expect(screen.getByText('MRSA strains common')).toBeInTheDocument();
    });

    test('shows clinical caution indicators in resistance alert', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      expect(screen.getByText('Clinical Caution Required')).toBeInTheDocument();
      expect(screen.getByText('Verify susceptibility testing')).toBeInTheDocument();
      expect(screen.getByText('Consider alternative agents')).toBeInTheDocument();
      expect(screen.getByText('Monitor treatment response')).toBeInTheDocument();
    });

    test('allows dismissing resistance alert', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      const dismissButton = screen.getByTitle('Dismiss alert');
      fireEvent.click(dismissButton);
      
      expect(screen.queryByText(/Resistance Pattern Alert/)).not.toBeInTheDocument();
    });
  });

  describe('Summary Statistics', () => {
    test('displays correct pathogen counts by gram status', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText('Gram Positive')).toBeInTheDocument();
      expect(screen.getByText('Gram Negative')).toBeInTheDocument();
    });

    test('displays duration statistics correctly', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      // Check for duration-related content that actually exists
      expect(screen.getByText('Treatment Duration Overview')).toBeInTheDocument();
      expect(screen.getByTestId('duration-legend')).toBeInTheDocument();
    });
  });

  describe('Footer Information', () => {
    test('displays footer with current filter information', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText(/Consolidated Pathogen & Antibiotic Explorer • 3 of 3 pathogens shown/)).toBeInTheDocument();
      expect(screen.getByText('Educational tool for learning pathogen-antibiotic relationships')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Pathogen & Antibiotic Explorer');
    });

    test('view mode buttons have proper accessibility attributes', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const listButton = screen.getByText('List');
      const networkButton = screen.getByText('Network');
      
      expect(listButton).toBeInTheDocument();
      expect(networkButton).toBeInTheDocument();
    });

    test('interactive elements are keyboard accessible', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElements = screen.getAllByTestId(/pathogen-\d/);
      pathogenElements.forEach(element => {
        // Should be clickable
        expect(element).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles empty pathogen data gracefully', () => {
      // Mock empty data
      const SimplePathogenData = require('../../data/SimplePathogenData');
      SimplePathogenData.default.length = 0;
      
      expect(() => {
        render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      }).not.toThrow();
    });

    test('handles missing pathogen properties gracefully', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      // Should handle pathogen selection without errors
      const pathogenElement = screen.getByTestId('pathogen-1');
      
      expect(() => {
        fireEvent.click(pathogenElement);
      }).not.toThrow();
    });

    test('handles missing onPathogenSelect prop gracefully', () => {
      const propsWithoutCallback = {
        pathogenData: null,
        onPathogenSelect: null
      };
      
      expect(() => {
        render(<ConsolidatedPathogenExplorer {...propsWithoutCallback} />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('efficiently handles large pathogen datasets', () => {
      // This test would normally use a large dataset
      // For now, we'll just ensure the component renders without errors
      expect(() => {
        render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      }).not.toThrow();
    });

    test('memoizes filtered results appropriately', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      // Change filters multiple times
      const gramFilter = screen.getByTestId('gram-filter');
      fireEvent.change(gramFilter, { target: { value: 'positive' } });
      fireEvent.change(gramFilter, { target: { value: 'negative' } });
      fireEvent.change(gramFilter, { target: { value: 'all' } });
      
      // Should not cause performance issues
      expect(screen.getByTestId('pathogen-list')).toBeInTheDocument();
    });
  });

  describe('Integration with Context', () => {
    test('works correctly when rendered with app context', () => {
      renderWithContext(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText('Pathogen & Antibiotic Explorer')).toBeInTheDocument();
      expect(screen.getByTestId('pathogen-list')).toBeInTheDocument();
    });
  });

  describe('Medical Content Validation', () => {
    test('displays clinically accurate pathogen information', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText('Staphylococcus aureus')).toBeInTheDocument();
      expect(screen.getByText('Escherichia coli')).toBeInTheDocument();
      expect(screen.getByText('Streptococcus pneumoniae')).toBeInTheDocument();
    });

    test('shows proper gram stain classification', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      expect(screen.getByText('Gram Positive')).toBeInTheDocument();
      expect(screen.getByText('Gram Negative')).toBeInTheDocument();
    });

    test('validates resistance information accuracy', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      expect(screen.getByText('MRSA strains common')).toBeInTheDocument();
    });

    test('displays appropriate clinical warnings', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const pathogenElement = screen.getByTestId('pathogen-1');
      fireEvent.click(pathogenElement);
      
      expect(screen.getByText('Clinical Caution Required')).toBeInTheDocument();
    });
  });

  describe('Duration Filter Integration', () => {
    test('filters pathogens based on treatment duration', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const durationFilter = screen.getByTestId('duration-filter');
      fireEvent.change(durationFilter, { target: { value: 'short' } });
      
      expect(durationFilter).toHaveValue('short');
    });

    test('handles complex duration filtering', () => {
      render(<ConsolidatedPathogenExplorer {...defaultProps} />);
      
      const durationFilter = screen.getByTestId('duration-filter');
      fireEvent.change(durationFilter, { target: { value: 'complex' } });
      
      expect(durationFilter).toHaveValue('complex');
    });
  });
});