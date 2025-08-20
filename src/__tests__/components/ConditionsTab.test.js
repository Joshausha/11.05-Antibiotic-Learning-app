/**
 * ConditionsTab Component Tests
 * @description Comprehensive test suite for ConditionsTab component
 * @created 2025-07-28 08:45:22
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ConditionsTab from '../../components/ConditionsTab';
import { 
  renderWithContext, 
  setupTestEnvironment,
  testAccessibility,
  mockMedicalConditions
} from '../utils/testUtils';

// Extended mock medical conditions for comprehensive testing
const extendedMockConditions = [
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    category: 'Respiratory',
    description: 'Infection of the lungs causing inflammation of air sacs',
    commonPathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae', 'Mycoplasma pneumoniae'],
    antibiotics: ['Amoxicillin', 'Azithromycin', 'Levofloxacin']
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection',
    category: 'Genitourinary',
    description: 'Infection affecting any part of the urinary system',
    commonPathogens: ['Escherichia coli', 'Klebsiella pneumoniae', 'Enterococcus faecalis'],
    antibiotics: ['Nitrofurantoin', 'Trimethoprim-sulfamethoxazole', 'Ciprofloxacin']
  },
  {
    id: 'cellulitis',
    name: 'Cellulitis',
    category: 'Skin and Soft Tissue',
    description: 'Bacterial infection of the deep layers of skin',
    commonPathogens: ['Staphylococcus aureus', 'Streptococcus pyogenes'],
    antibiotics: ['Clindamycin', 'Cephalexin', 'Doxycycline']
  },
  {
    id: 'meningitis',
    name: 'Bacterial Meningitis',
    category: 'Central Nervous System',
    description: 'Serious infection of the membranes surrounding the brain and spinal cord',
    commonPathogens: ['Streptococcus pneumoniae', 'Neisseria meningitidis', 'Haemophilus influenzae'],
    antibiotics: ['Ceftriaxone', 'Vancomycin', 'Ampicillin']
  },
  {
    id: 'sepsis',
    name: 'Sepsis',
    category: 'Systemic',
    description: 'Life-threatening response to infection',
    commonPathogens: ['Staphylococcus aureus', 'Escherichia coli', 'Streptococcus pneumoniae'],
    antibiotics: ['Piperacillin-tazobactam', 'Vancomycin', 'Meropenem']
  }
];

describe('ConditionsTab Component', () => {
  let mockSetSelectedCondition;
  let mockSetSearchTerm;
  let testEnv;

  beforeEach(() => {
    testEnv = setupTestEnvironment();
    mockSetSelectedCondition = jest.fn();
    mockSetSearchTerm = jest.fn();
  });

  afterEach(() => {
    testEnv.cleanup();
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders search bar and conditions grid', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // Search bar
      expect(screen.getByPlaceholderText('Search conditions, pathogens, or treatments...')).toBeInTheDocument();
      expect(screen.getByLabelText('Search medical conditions')).toBeInTheDocument();

      // Conditions should be displayed
      expect(screen.getByText('Pneumonia')).toBeInTheDocument();
      expect(screen.getByText('Urinary Tract Infection')).toBeInTheDocument();
      expect(screen.getByText('Cellulitis')).toBeInTheDocument();
    });

    it('displays condition cards with correct information', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // Check pneumonia card
      expect(screen.getByText('Pneumonia')).toBeInTheDocument();
      expect(screen.getByText('Respiratory')).toBeInTheDocument();
      expect(screen.getByText(/Streptococcus pneumoniae, Haemophilus influenzae, Mycoplasma pneumoniae/)).toBeInTheDocument();

      // Check UTI card
      expect(screen.getByText('Urinary Tract Infection')).toBeInTheDocument();
      expect(screen.getByText('Genitourinary')).toBeInTheDocument();
      expect(screen.getByText(/Escherichia coli, Klebsiella pneumoniae, Enterococcus faecalis/)).toBeInTheDocument();
    });

    it('shows category badges with correct styling', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const respiratoryBadge = screen.getByText('Respiratory');
      expect(respiratoryBadge).toHaveClass('bg-blue-100', 'text-blue-700', 'rounded-full');

      const genitourinaryBadge = screen.getByText('Genitourinary');
      expect(genitourinaryBadge).toHaveClass('bg-blue-100', 'text-blue-700', 'rounded-full');
    });
  });

  describe('Search Functionality', () => {
    it('updates search term when typing in search bar', async () => {
      const user = userEvent.setup();
      
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      
      await user.type(searchInput, 'pneumonia');

      expect(mockSetSearchTerm).toHaveBeenCalledTimes(9); // Once for each character
      expect(mockSetSearchTerm).toHaveBeenLastCalledWith('pneumonia');
    });

    it('displays current search term in input', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm="pneumonia"
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      expect(searchInput).toHaveValue('pneumonia');
    });

    it('shows filtered results when search term is applied', () => {
      const filteredConditions = extendedMockConditions.filter(condition => 
        condition.name.toLowerCase().includes('pneumonia')
      );

      renderWithContext(
        <ConditionsTab
          filteredConditions={filteredConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm="pneumonia"
          setSearchTerm={mockSetSearchTerm}
        />
      );

      expect(screen.getByText('Pneumonia')).toBeInTheDocument();
      expect(screen.queryByText('Urinary Tract Infection')).not.toBeInTheDocument();
      expect(screen.queryByText('Cellulitis')).not.toBeInTheDocument();
    });

    it('clears search results appropriately', async () => {
      const user = userEvent.setup();
      
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm="test"
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      
      await user.clear(searchInput);

      expect(mockSetSearchTerm).toHaveBeenCalledWith('');
    });
  });

  describe('Condition Selection', () => {
    it('calls setSelectedCondition when condition card is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const pneumoniaCard = screen.getByText('Pneumonia').closest('div[role="button"]');
      await user.click(pneumoniaCard);

      expect(mockSetSelectedCondition).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pneumonia',
          name: 'Pneumonia',
          category: 'Respiratory'
        })
      );
    });

    it('supports keyboard navigation and selection', async () => {
      const user = userEvent.setup();
      
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const pneumoniaCard = screen.getByText('Pneumonia').closest('div[role="button"]');
      
      // Focus the card
      pneumoniaCard.focus();
      expect(pneumoniaCard).toHaveFocus();

      // Press Enter to select
      await user.keyboard('{Enter}');

      expect(mockSetSelectedCondition).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pneumonia',
          name: 'Pneumonia'
        })
      );
    });

    it('supports space key for selection', async () => {
      const user = userEvent.setup();
      
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const pneumoniaCard = screen.getByText('Pneumonia').closest('div[role="button"]');
      
      pneumoniaCard.focus();
      await user.keyboard(' ');

      expect(mockSetSelectedCondition).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pneumonia',
          name: 'Pneumonia'
        })
      );
    });

    it('provides appropriate ARIA labels for condition cards', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const pneumoniaCard = screen.getByLabelText('View details for Pneumonia');
      expect(pneumoniaCard).toBeInTheDocument();
      expect(pneumoniaCard).toHaveAttribute('role', 'button');
      expect(pneumoniaCard).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Loading State', () => {
    it('shows loading skeleton when isLoading is true', () => {
      // Simulate loading state by not providing filteredConditions initially
      renderWithContext(
        <ConditionsTab
          filteredConditions={null}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // Should show search bar but with skeleton cards
      expect(screen.getByPlaceholderText('Search conditions, pathogens, or treatments...')).toBeInTheDocument();
      
      // Check for skeleton loading cards
      const skeletonCards = screen.getAllByTestId('condition-card-skeleton');
      expect(skeletonCards).toHaveLength(6);
    });

    it('transitions from loading to content when data is provided', async () => {
      const { rerender } = renderWithContext(
        <ConditionsTab
          filteredConditions={null}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // Initially shows loading
      expect(screen.getAllByTestId('condition-card-skeleton')).toHaveLength(6);

      // Rerender with data
      rerender(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      await waitFor(() => {
        expect(screen.queryByTestId('condition-card-skeleton')).not.toBeInTheDocument();
        expect(screen.getByText('Pneumonia')).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('shows no results message when filteredConditions is empty', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={[]}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm="nonexistent"
          setSearchTerm={mockSetSearchTerm}
        />
      );

      expect(screen.getByText('No conditions found matching your search.')).toBeInTheDocument();
      expect(screen.getByText('Try searching for a different term or browse all conditions.')).toBeInTheDocument();
    });

    it('shows appropriate search icon in empty state', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={[]}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm="nonexistent"
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // The Search icon should be present in the empty state
      const searchIcons = document.querySelectorAll('svg');
      expect(searchIcons.length).toBeGreaterThan(0);
    });

    it('handles null filteredConditions gracefully', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={null}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // Should show loading state rather than crash
      expect(screen.getByPlaceholderText('Search conditions, pathogens, or treatments...')).toBeInTheDocument();
    });
  });

  describe('Pathogen Display', () => {
    it('truncates long pathogen lists with ellipsis', () => {
      const conditionWithManyPathogens = {
        id: 'complex-infection',
        name: 'Complex Infection',
        category: 'Multi-system',
        description: 'Complex multi-pathogen infection',
        commonPathogens: [
          'Pathogen 1', 'Pathogen 2', 'Pathogen 3', 
          'Pathogen 4', 'Pathogen 5', 'Pathogen 6'
        ],
        antibiotics: ['Antibiotic A']
      };

      renderWithContext(
        <ConditionsTab
          filteredConditions={[conditionWithManyPathogens]}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // Should show first 3 pathogens plus ellipsis
      expect(screen.getByText(/Pathogen 1, Pathogen 2, Pathogen 3\.\.\./)).toBeInTheDocument();
      expect(screen.queryByText('Pathogen 4')).not.toBeInTheDocument();
    });

    it('handles conditions with empty pathogen arrays', () => {
      const conditionWithoutPathogens = {
        id: 'no-pathogens',
        name: 'Unknown Condition',
        category: 'Unspecified',
        description: 'Condition with no specified pathogens',
        commonPathogens: [],
        antibiotics: ['Generic Antibiotic']
      };

      renderWithContext(
        <ConditionsTab
          filteredConditions={[conditionWithoutPathogens]}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      expect(screen.getByText('Unknown Condition')).toBeInTheDocument();
      // Should handle empty pathogens gracefully without crashing
    });

    it('handles conditions with undefined commonPathogens', () => {
      const conditionWithUndefinedPathogens = {
        id: 'undefined-pathogens',
        name: 'Undefined Condition',
        category: 'Unspecified',
        description: 'Condition with undefined pathogens',
        antibiotics: ['Generic Antibiotic']
        // commonPathogens is undefined
      };

      renderWithContext(
        <ConditionsTab
          filteredConditions={[conditionWithUndefinedPathogens]}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      expect(screen.getByText('Undefined Condition')).toBeInTheDocument();
      // Should handle undefined pathogens gracefully
    });
  });

  describe('Visual States and Interactions', () => {
    it('applies hover effects to condition cards', async () => {
      const user = userEvent.setup();
      
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const pneumoniaCard = screen.getByText('Pneumonia').closest('div[role="button"]');
      
      expect(pneumoniaCard).toHaveClass('hover:shadow-md', 'hover:-translate-y-1', 'transition-all');
    });

    it('maintains card structure and styling', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const pneumoniaCard = screen.getByText('Pneumonia').closest('div[role="button"]');
      
      expect(pneumoniaCard).toHaveClass(
        'bg-white', 
        'rounded-xl', 
        'p-6', 
        'shadow-sm', 
        'border', 
        'cursor-pointer'
      );
    });

    it('shows grid layout responsively', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const grid = screen.getByText('Pneumonia').closest('div').parentElement;
      expect(grid).toHaveClass('grid', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    });
  });

  describe('Error Handling', () => {
    it('handles error state gracefully', () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // This would be triggered by an error in the parent component
      // For now, we'll just test that the component doesn't crash with malformed data
      const malformedConditions = [
        {
          // Missing required fields
          name: 'Incomplete Condition'
        }
      ];

      renderWithContext(
        <ConditionsTab
          filteredConditions={malformedConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      expect(screen.getByText('Incomplete Condition')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('provides proper semantic structure', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // Search input should have proper labeling
      const searchInput = screen.getByLabelText('Search medical conditions');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveAttribute('placeholder', 'Search conditions, pathogens, or treatments...');

      // Condition cards should be keyboard accessible
      const conditionCards = screen.getAllByRole('button');
      conditionCards.forEach(card => {
        expect(card).toHaveAttribute('tabIndex', '0');
      });
    });

    it('supports screen readers with appropriate labels', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      // Each condition should have descriptive aria-label
      extendedMockConditions.forEach(condition => {
        expect(screen.getByLabelText(`View details for ${condition.name}`)).toBeInTheDocument();
      });
    });

    it('maintains focus order for keyboard navigation', () => {
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const searchInput = screen.getByLabelText('Search medical conditions');
      const conditionCards = screen.getAllByRole('button');

      // Search input should be first in tab order
      expect(searchInput).toHaveAttribute('tabIndex');
      
      // Condition cards should be tabbable
      conditionCards.forEach(card => {
        expect(card).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Performance', () => {
    it('handles large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `condition-${i}`,
        name: `Condition ${i}`,
        category: `Category ${i % 5}`,
        description: `Description for condition ${i}`,
        commonPathogens: [`Pathogen ${i}A`, `Pathogen ${i}B`],
        antibiotics: [`Antibiotic ${i}`]
      }));

      const { container } = renderWithContext(
        <ConditionsTab
          filteredConditions={largeDataset}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      expect(container).toBeInTheDocument();
      
      // Should render all conditions
      expect(screen.getByText('Condition 0')).toBeInTheDocument();
      expect(screen.getByText('Condition 99')).toBeInTheDocument();
    });

    it('handles rapid search input changes', async () => {
      const user = userEvent.setup();
      
      renderWithContext(
        <ConditionsTab
          filteredConditions={extendedMockConditions}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      
      // Rapidly type and clear
      await user.type(searchInput, 'pneumonia');
      await user.clear(searchInput);
      await user.type(searchInput, 'uti');

      // Should handle all changes without errors
      expect(mockSetSearchTerm).toHaveBeenCalled();
    });
  });
});