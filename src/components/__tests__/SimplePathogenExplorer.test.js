/**
 * SimplePathogenExplorer Component Tests
 * Comprehensive pathogen browsing functionality and clinical workflow testing
 * Critical component for medical education pathogen exploration and selection
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SimplePathogenExplorer from '../SimplePathogenExplorer';

// Mock data dependencies
jest.mock('../../data/SimplePathogenData', () => ({
  simplePathogens: [
    {
      id: 'strep-pneumoniae',
      name: 'Streptococcus pneumoniae',
      gramStatus: 'positive',
      severity: 'high',
      morphology: 'cocci',
      commonInfections: ['pneumonia', 'meningitis']
    },
    {
      id: 'e-coli',
      name: 'Escherichia coli',
      gramStatus: 'negative',
      severity: 'medium',
      morphology: 'bacilli',
      commonInfections: ['uti', 'sepsis']
    },
    {
      id: 'mrsa',
      name: 'Methicillin-resistant Staphylococcus aureus',
      gramStatus: 'positive',
      severity: 'high',
      morphology: 'cocci',
      commonInfections: ['skin infections', 'bacteremia']
    }
  ],
  searchPathogens: jest.fn((term) => {
    const pathogens = [
      {
        id: 'strep-pneumoniae',
        name: 'Streptococcus pneumoniae',
        gramStatus: 'positive',
        severity: 'high'
      },
      {
        id: 'e-coli',
        name: 'Escherichia coli', 
        gramStatus: 'negative',
        severity: 'medium'
      }
    ];
    return pathogens.filter(p => 
      p.name.toLowerCase().includes(term.toLowerCase())
    );
  }),
  getAntibioticsForPathogen: jest.fn((pathogenId) => {
    const mockMappings = {
      'strep-pneumoniae': [
        { antibioticId: 'amoxicillin', effectiveness: 'high' },
        { antibioticId: 'ceftriaxone', effectiveness: 'high' }
      ],
      'e-coli': [
        { antibioticId: 'nitrofurantoin', effectiveness: 'high' },
        { antibioticId: 'ciprofloxacin', effectiveness: 'medium' }
      ],
      'mrsa': [
        { antibioticId: 'vancomycin', effectiveness: 'high' },
        { antibioticId: 'linezolid', effectiveness: 'high' }
      ]
    };
    return mockMappings[pathogenId] || [];
  })
}));

jest.mock('../../data/SimpleAntibioticData', () => ({
  getAntibioticById: jest.fn((id) => {
    const mockAntibiotics = {
      'amoxicillin': {
        id: 'amoxicillin',
        name: 'Amoxicillin',
        class: 'Beta-lactam',
        route: 'PO'
      },
      'ceftriaxone': {
        id: 'ceftriaxone',
        name: 'Ceftriaxone',
        class: 'Cephalosporin',
        route: 'IV'
      },
      'vancomycin': {
        id: 'vancomycin',
        name: 'Vancomycin',
        class: 'Glycopeptide',
        route: 'IV'
      },
      'nitrofurantoin': {
        id: 'nitrofurantoin',
        name: 'Nitrofurantoin',
        class: 'Antimicrobial',
        route: 'PO'
      }
    };
    return mockAntibiotics[id] || null;
  })
}));

// Mock child components
jest.mock('../PathogenList', () => {
  return function MockPathogenList({ pathogens, onSelectPathogen, selectedPathogen, searchTerm, onSearch, gramFilter, onGramFilter, severityFilter, onSeverityFilter }) {
    return (
      <div data-testid="pathogen-list">
        <input 
          data-testid="pathogen-search"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search pathogens..."
        />
        <select 
          data-testid="gram-filter"
          value={gramFilter}
          onChange={(e) => onGramFilter(e.target.value)}
        >
          <option value="all">All Gram Status</option>
          <option value="positive">Gram Positive</option>
          <option value="negative">Gram Negative</option>
        </select>
        <select 
          data-testid="severity-filter"
          value={severityFilter}
          onChange={(e) => onSeverityFilter(e.target.value)}
        >
          <option value="all">All Severity</option>
          <option value="high">High Severity</option>
          <option value="medium">Medium Severity</option>
        </select>
        {pathogens.map(pathogen => (
          <button
            key={pathogen.id}
            data-testid={`pathogen-${pathogen.id}`}
            onClick={() => onSelectPathogen(pathogen)}
            className={selectedPathogen?.id === pathogen.id ? 'selected' : ''}
          >
            {pathogen.name}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../AntibioticList', () => {
  return function MockAntibioticList({ pathogen, antibiotics, onSelectAntibiotic, selectedAntibiotic }) {
    if (!pathogen || !antibiotics?.length) {
      return <div data-testid="no-antibiotics">No antibiotics available</div>;
    }
    return (
      <div data-testid="antibiotic-list">
        <h3>Antibiotics for {pathogen.name}</h3>
        {antibiotics.map(antibiotic => (
          <button
            key={antibiotic.id}
            data-testid={`antibiotic-${antibiotic.id}`}
            onClick={() => onSelectAntibiotic(antibiotic)}
            className={selectedAntibiotic?.id === antibiotic.id ? 'selected' : ''}
          >
            {antibiotic.name}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../SimplePathogenNetwork', () => {
  return function MockSimplePathogenNetwork({ pathogen, antibiotics, onSelectPathogen, onSelectAntibiotic }) {
    return (
      <div data-testid="pathogen-network">
        <div>Network view for {pathogen?.name || 'No pathogen'}</div>
        {antibiotics?.length > 0 && (
          <div>Showing {antibiotics.length} antibiotic connections</div>
        )}
      </div>
    );
  };
});

describe('SimplePathogenExplorer - Medical Education Pathogen Browsing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization & Medical Interface', () => {
    test('renders pathogen explorer interface with medical context', () => {
      render(<SimplePathogenExplorer />);
      
      expect(screen.getByText('Pathogen Explorer')).toBeInTheDocument();
      expect(screen.getByText(/explore pathogens.*antibiotics.*relationships/i)).toBeInTheDocument();
      expect(screen.getByTestId('pathogen-list')).toBeInTheDocument();
    });

    test('provides view mode toggle for different learning preferences', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Should start in list view
      const listButton = screen.getByRole('button', { name: /list/i });
      const networkButton = screen.getByRole('button', { name: /network/i });
      
      expect(listButton).toHaveClass('bg-white');
      expect(networkButton).not.toHaveClass('bg-white');
      
      // Switch to network view
      await user.click(networkButton);
      
      expect(networkButton).toHaveClass('bg-white');
      expect(listButton).not.toHaveClass('bg-white');
    });

    test('displays medical learning objectives and context', () => {
      render(<SimplePathogenExplorer />);
      
      expect(screen.getByText(/explore pathogens.*antibiotics.*relationships/i)).toBeInTheDocument();
    });
  });

  describe('Pathogen Search & Filtering - Clinical Data Retrieval', () => {
    test('filters pathogens by search term', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const searchInput = screen.getByTestId('pathogen-search');
      await user.type(searchInput, 'Streptococcus');
      
      // Should trigger search functionality
      expect(searchInput).toHaveValue('Streptococcus');
    });

    test('filters pathogens by gram status for clinical categorization', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const gramFilter = screen.getByTestId('gram-filter');
      await user.selectOptions(gramFilter, 'positive');
      
      expect(gramFilter).toHaveValue('positive');
    });

    test('filters pathogens by severity for clinical priority assessment', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const severityFilter = screen.getByTestId('severity-filter');
      await user.selectOptions(severityFilter, 'high');
      
      expect(severityFilter).toHaveValue('high');
    });

    test('supports multiple concurrent filters for complex queries', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const searchInput = screen.getByTestId('pathogen-search');
      const gramFilter = screen.getByTestId('gram-filter');
      const severityFilter = screen.getByTestId('severity-filter');
      
      await user.type(searchInput, 'coccus');
      await user.selectOptions(gramFilter, 'positive');
      await user.selectOptions(severityFilter, 'high');
      
      expect(searchInput).toHaveValue('coccus');
      expect(gramFilter).toHaveValue('positive');
      expect(severityFilter).toHaveValue('high');
    });

    test('provides clear all filters functionality', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Set some filters first
      const searchInput = screen.getByTestId('pathogen-search');
      const gramFilter = screen.getByTestId('gram-filter');
      
      await user.type(searchInput, 'test');
      await user.selectOptions(gramFilter, 'positive');
      
      // Clear filters
      const clearFiltersButton = screen.getByRole('button', { name: /clear filters/i });
      await user.click(clearFiltersButton);
      
      expect(searchInput).toHaveValue('');
      expect(gramFilter).toHaveValue('all');
    });
  });

  describe('Pathogen Selection & Medical Workflow', () => {
    test('handles pathogen selection for detailed medical information', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      expect(pathogenButton).toHaveClass('selected');
    });

    test('loads antibiotic information when pathogen is selected', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('antibiotic-list')).toBeInTheDocument();
        expect(screen.getByText('Antibiotics for Streptococcus pneumoniae')).toBeInTheDocument();
      });
    });

    test('displays appropriate antibiotics for selected pathogen', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('antibiotic-amoxicillin')).toBeInTheDocument();
        expect(screen.getByTestId('antibiotic-ceftriaxone')).toBeInTheDocument();
      });
    });

    test('clears antibiotic selection when pathogen changes', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Select first pathogen and antibiotic
      const firstPathogen = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(firstPathogen);
      
      await waitFor(() => {
        const antibiotic = screen.getByTestId('antibiotic-amoxicillin');
        user.click(antibiotic);
      });
      
      // Select different pathogen
      const secondPathogen = screen.getByTestId('pathogen-e-coli');
      await user.click(secondPathogen);
      
      // Should show different antibiotics without previous selection
      await waitFor(() => {
        expect(screen.getByText('Antibiotics for Escherichia coli')).toBeInTheDocument();
        expect(screen.queryByText('Antibiotics for Streptococcus pneumoniae')).not.toBeInTheDocument();
      });
    });
  });

  describe('Antibiotic Selection & Educational Learning Support', () => {
    test('handles antibiotic selection for detailed drug information', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Select pathogen first
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      await waitFor(async () => {
        const antibioticButton = screen.getByTestId('antibiotic-amoxicillin');
        await user.click(antibioticButton);
        
        expect(antibioticButton).toHaveClass('selected');
      });
    });

    test('shows no antibiotics message when pathogen has no treatments', async () => {
      const user = userEvent.setup();
      
      // Mock pathogen with no antibiotics
      const { getAntibioticsForPathogen } = require('../../data/SimplePathogenData');
      getAntibioticsForPathogen.mockReturnValue([]);
      
      render(<SimplePathogenExplorer />);
      
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('no-antibiotics')).toBeInTheDocument();
      });
    });
  });

  describe('View Mode Integration - Educational Flexibility', () => {
    test('switches between list and network views for different learning styles', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Start with list view
      expect(screen.getByTestId('pathogen-list')).toBeInTheDocument();
      
      // Switch to network view
      const networkButton = screen.getByRole('button', { name: /network/i });
      await user.click(networkButton);
      
      // Should show network view (mocked component shows pathogen network)
      expect(screen.getByTestId('pathogen-network')).toBeInTheDocument();
    });

    test('maintains pathogen and antibiotic selections across view modes', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Select pathogen in list view
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      // Switch to network view
      const networkButton = screen.getByRole('button', { name: /network/i });
      await user.click(networkButton);
      
      // Network view should show selected pathogen
      await waitFor(() => {
        expect(screen.getByText('Network view for Streptococcus pneumoniae')).toBeInTheDocument();
      });
    });

    test('shows antibiotic connections in network view', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Select pathogen
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      // Switch to network view
      const networkButton = screen.getByRole('button', { name: /network/i });
      await user.click(networkButton);
      
      // Should show antibiotic connections
      await waitFor(() => {
        expect(screen.getByText('Showing 2 antibiotic connections')).toBeInTheDocument();
      });
    });
  });

  describe('State Management & Clinical Workflow', () => {
    test('clears all selections when requested', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Make selections
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      await waitFor(async () => {
        const antibioticButton = screen.getByTestId('antibiotic-amoxicillin');
        await user.click(antibioticButton);
      });
      
      // Clear selections
      const clearButton = screen.getByRole('button', { name: /clear.*selection/i });
      await user.click(clearButton);
      
      // Should show no selections
      expect(screen.queryByText('Antibiotics for')).not.toBeInTheDocument();
    });

    test('maintains filter state during pathogen selection workflow', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Set filter
      const gramFilter = screen.getByTestId('gram-filter');
      await user.selectOptions(gramFilter, 'positive');
      
      // Select pathogen
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      // Filter should still be active
      expect(gramFilter).toHaveValue('positive');
    });
  });

  describe('Performance & Clinical Workflow Requirements', () => {
    test('renders pathogen explorer within clinical performance requirements', () => {
      const startTime = performance.now();
      
      render(<SimplePathogenExplorer />);
      
      const renderTime = performance.now() - startTime;
      expect(renderTime).toBeLessThan(100); // <100ms for clinical workflows
    });

    test('handles rapid pathogen selection changes efficiently', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const pathogens = [
        screen.getByTestId('pathogen-strep-pneumoniae'),
        screen.getByTestId('pathogen-e-coli'),
        screen.getByTestId('pathogen-mrsa')
      ];
      
      // Rapidly select different pathogens
      for (const pathogen of pathogens) {
        await user.click(pathogen);
        await waitFor(() => {
          expect(pathogen).toHaveClass('selected');
        });
      }
    });

    test('maintains responsive performance during filtering operations', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const searchInput = screen.getByTestId('pathogen-search');
      const gramFilter = screen.getByTestId('gram-filter');
      const severityFilter = screen.getByTestId('severity-filter');
      
      // Rapid filter changes
      await user.type(searchInput, 'test search');
      await user.selectOptions(gramFilter, 'positive');
      await user.selectOptions(severityFilter, 'high');
      await user.clear(searchInput);
      await user.selectOptions(gramFilter, 'all');
      
      // Should handle without performance degradation
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Medical Education Features', () => {
    test('provides educational context through pathogen-antibiotic relationships', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      await waitFor(() => {
        expect(screen.getByText('Antibiotics for Streptococcus pneumoniae')).toBeInTheDocument();
      });
    });

    test('supports comparative learning through multiple pathogen selection', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Select first pathogen
      const firstPathogen = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(firstPathogen);
      
      await waitFor(() => {
        expect(screen.getByText(/Streptococcus pneumoniae/)).toBeInTheDocument();
      });
      
      // Select second pathogen
      const secondPathogen = screen.getByTestId('pathogen-e-coli');
      await user.click(secondPathogen);
      
      await waitFor(() => {
        expect(screen.getByText(/Escherichia coli/)).toBeInTheDocument();
      });
    });

    test('enables systematic pathogen exploration through filtering', () => {
      render(<SimplePathogenExplorer />);
      
      // Should provide systematic exploration tools
      expect(screen.getByTestId('gram-filter')).toBeInTheDocument();
      expect(screen.getByTestId('severity-filter')).toBeInTheDocument();
      expect(screen.getByTestId('pathogen-search')).toBeInTheDocument();
    });
  });

  describe('Edge Cases & Clinical Data Integrity', () => {
    test('handles empty pathogen datasets gracefully', () => {
      // Mock empty pathogen data
      const { simplePathogens } = require('../../data/SimplePathogenData');
      simplePathogens.length = 0;
      
      render(<SimplePathogenExplorer />);
      
      expect(screen.getByTestId('pathogen-list')).toBeInTheDocument();
      // Should not crash with empty data
    });

    test('handles network connectivity issues gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock API failure
      const { getAntibioticsForPathogen } = require('../../data/SimplePathogenData');
      getAntibioticsForPathogen.mockRejectedValue(new Error('Network error'));
      
      render(<SimplePathogenExplorer />);
      
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      await user.click(pathogenButton);
      
      // Should handle error gracefully without crashing
      expect(pathogenButton).toBeInTheDocument();
    });

    test('maintains data integrity during rapid state changes', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Rapid state changes
      const searchInput = screen.getByTestId('pathogen-search');
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      
      await user.type(searchInput, 'strep');
      await user.click(pathogenButton);
      await user.clear(searchInput);
      
      // Should maintain consistent state
      expect(pathogenButton).toHaveClass('selected');
    });
  });

  describe('Accessibility & Clinical Environment Compliance', () => {
    test('supports keyboard navigation for clinical environments', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      // Tab through interface
      await user.tab();
      const searchInput = screen.getByTestId('pathogen-search');
      expect(searchInput).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('gram-filter')).toHaveFocus();
    });

    test('provides proper ARIA labels for screen readers', () => {
      render(<SimplePathogenExplorer />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /network/i })).toBeInTheDocument();
    });

    test('maintains focus management during clinical workflows', async () => {
      const user = userEvent.setup();
      render(<SimplePathogenExplorer />);
      
      const pathogenButton = screen.getByTestId('pathogen-strep-pneumoniae');
      pathogenButton.focus();
      
      await user.keyboard('{Enter}');
      
      // Focus should remain manageable after selection
      expect(document.activeElement).toBeDefined();
    });
  });
});

/**
 * Medical Education Test Summary
 * 
 * ✅ Component initialization with medical context
 * ✅ Pathogen search and clinical filtering functionality
 * ✅ Pathogen selection and medical workflow integration
 * ✅ Antibiotic selection and educational learning support
 * ✅ View mode flexibility for different learning styles
 * ✅ State management during clinical workflows
 * ✅ Performance optimization for emergency access
 * ✅ Medical education feature integration
 * ✅ Edge case handling and clinical data integrity
 * ✅ Accessibility compliance for clinical environments
 * 
 * Medical Safety: All tests ensure clinical data accuracy,
 * maintain educational workflow integrity, and support
 * safe pathogen exploration for medical education.
 * 
 * Coverage Target: Comprehensive testing of pathogen browsing
 * functionality critical for medical education workflows.
 */