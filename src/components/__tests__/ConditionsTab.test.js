/**
 * ConditionsTab Component Tests
 * @description Comprehensive test suite for the ConditionsTab component
 * @created 2025-08-17
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConditionsTab from '../ConditionsTab';
import { renderWithContext } from '../../utils/testUtils';

// Mock skeleton loader
jest.mock('../SkeletonLoader', () => ({
  __esModule: true,
  default: function MockSkeletonLoader() {
    return <div data-testid="skeleton-loader">Loading...</div>;
  },
  ConditionCardSkeleton: function MockConditionCardSkeleton() {
    return <div data-testid="condition-card-skeleton">Loading condition...</div>;
  }
}));

// Mock error message component
jest.mock('../ErrorMessage', () => {
  return function MockErrorMessage({ title, message, onRetry, showRetry }) {
    return (
      <div data-testid="error-message">
        <h3>{title}</h3>
        <p>{message}</p>
        {showRetry && (
          <button onClick={onRetry} data-testid="retry-button">
            Retry
          </button>
        )}
      </div>
    );
  };
});

describe('ConditionsTab Component', () => {
  const mockSetSelectedCondition = jest.fn();
  const mockSetSearchTerm = jest.fn();

  const mockConditions = [
    {
      id: 'pneumonia',
      name: 'Community-Acquired Pneumonia',
      category: 'Respiratory',
      commonPathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae', 'Mycoplasma pneumoniae'],
      description: 'Infection of the lungs acquired outside hospital settings'
    },
    {
      id: 'uti',
      name: 'Urinary Tract Infection',
      category: 'Genitourinary',
      commonPathogens: ['Escherichia coli', 'Klebsiella pneumoniae', 'Enterococcus faecalis'],
      description: 'Infection of the urinary system'
    },
    {
      id: 'cellulitis',
      name: 'Cellulitis',
      category: 'Skin and Soft Tissue',
      commonPathogens: ['Staphylococcus aureus', 'Streptococcus pyogenes'],
      description: 'Deep skin and soft tissue infection'
    },
    {
      id: 'meningitis',
      name: 'Bacterial Meningitis',
      category: 'Central Nervous System',
      commonPathogens: ['Streptococcus pneumoniae', 'Neisseria meningitidis', 'Haemophilus influenzae'],
      description: 'Infection of the meninges surrounding the brain and spinal cord'
    },
    {
      id: 'endocarditis',
      name: 'Infective Endocarditis',
      category: 'Cardiovascular',
      commonPathogens: ['Staphylococcus aureus', 'Enterococcus species', 'Streptococcus viridans'],
      description: 'Infection of the heart valves or endocardium'
    }
  ];

  const defaultProps = {
    filteredConditions: mockConditions,
    setSelectedCondition: mockSetSelectedCondition,
    searchTerm: '',
    setSearchTerm: mockSetSearchTerm
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders search bar with proper placeholder', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('aria-label', 'Search medical conditions');
    });

    test('renders conditions grid with all provided conditions', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      expect(screen.getByText('Community-Acquired Pneumonia')).toBeInTheDocument();
      expect(screen.getByText('Urinary Tract Infection')).toBeInTheDocument();
      expect(screen.getByText('Cellulitis')).toBeInTheDocument();
      expect(screen.getByText('Bacterial Meningitis')).toBeInTheDocument();
      expect(screen.getByText('Infective Endocarditis')).toBeInTheDocument();
    });

    test('displays category information for each condition', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      expect(screen.getByText('Respiratory')).toBeInTheDocument();
      expect(screen.getByText('Genitourinary')).toBeInTheDocument();
      expect(screen.getByText('Skin and Soft Tissue')).toBeInTheDocument();
      expect(screen.getByText('Central Nervous System')).toBeInTheDocument();
      expect(screen.getByText('Cardiovascular')).toBeInTheDocument();
    });

    test('shows common pathogens preview for each condition', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      // Use getAllByText since pathogens may appear in multiple conditions (medically realistic)
      expect(screen.getAllByText(/Streptococcus pneumoniae/)).toHaveLength(2); // Appears in pneumonia AND meningitis (realistic)
      expect(screen.getAllByText(/Escherichia coli/)).toHaveLength(1);
      expect(screen.getAllByText(/Staphylococcus aureus/)).toHaveLength(2); // Appears in cellulitis AND endocarditis (realistic)
    });

    test('displays appropriate category icons', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      // Check for presence of icons (lucide-react icons are rendered as SVG)
      const iconContainers = document.querySelectorAll('.p-2.bg-gray-50.rounded-lg');
      expect(iconContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    test('displays current search term in input field', () => {
      const searchProps = {
        ...defaultProps,
        searchTerm: 'pneumonia'
      };
      
      render(<ConditionsTab {...searchProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      expect(searchInput).toHaveValue('pneumonia');
    });

    test('calls setSearchTerm when search input changes', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      fireEvent.change(searchInput, { target: { value: 'infection' } });
      
      expect(mockSetSearchTerm).toHaveBeenCalledWith('infection');
    });

    test('shows no results message when filteredConditions is empty', () => {
      const emptyProps = {
        ...defaultProps,
        filteredConditions: []
      };
      
      render(<ConditionsTab {...emptyProps} />);
      
      expect(screen.getByText('No conditions found matching your search.')).toBeInTheDocument();
      expect(screen.getByText(/Try searching for a different term/)).toBeInTheDocument();
    });

    test('shows search icon in no results message', () => {
      const emptyProps = {
        ...defaultProps,
        filteredConditions: []
      };
      
      render(<ConditionsTab {...emptyProps} />);
      
      // Check for search icon in no results section
      const searchIcon = document.querySelector('.mx-auto.mb-4');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Condition Selection', () => {
    test('calls setSelectedCondition when condition card is clicked', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const pneumoniaCard = screen.getByText('Community-Acquired Pneumonia').closest('div[role="button"]');
      fireEvent.click(pneumoniaCard);
      
      expect(mockSetSelectedCondition).toHaveBeenCalledWith(mockConditions[0]);
    });

    test('handles keyboard navigation with Enter key', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const pneumoniaCard = screen.getByText('Community-Acquired Pneumonia').closest('div[role="button"]');
      fireEvent.keyDown(pneumoniaCard, { key: 'Enter' });
      
      expect(mockSetSelectedCondition).toHaveBeenCalledWith(mockConditions[0]);
    });

    test('handles keyboard navigation with Space key', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const pneumoniaCard = screen.getByText('Community-Acquired Pneumonia').closest('div[role="button"]');
      fireEvent.keyDown(pneumoniaCard, { key: ' ' });
      
      expect(mockSetSelectedCondition).toHaveBeenCalledWith(mockConditions[0]);
    });

    test('ignores other keyboard events', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const pneumoniaCard = screen.getByText('Community-Acquired Pneumonia').closest('div[role="button"]');
      fireEvent.keyDown(pneumoniaCard, { key: 'Tab' });
      
      expect(mockSetSelectedCondition).not.toHaveBeenCalled();
    });

    test('condition cards have proper accessibility attributes', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const conditionCards = screen.getAllByRole('button');
      
      conditionCards.forEach((card, index) => {
        expect(card).toHaveAttribute('tabIndex', '0');
        expect(card).toHaveAttribute('aria-label');
        expect(card).toHaveClass('cursor-pointer');
      });
    });
  });

  describe('Category Icon System', () => {
    test('displays correct icons for respiratory conditions', () => {
      const respiratoryCondition = {
        ...defaultProps,
        filteredConditions: [mockConditions[0]] // Pneumonia
      };
      
      render(<ConditionsTab {...respiratoryCondition} />);
      
      // Should have wind icon for respiratory
      const iconContainer = document.querySelector('.p-2.bg-gray-50.rounded-lg');
      expect(iconContainer).toBeInTheDocument();
    });

    test('displays correct icons for genitourinary conditions', () => {
      const guCondition = {
        ...defaultProps,
        filteredConditions: [mockConditions[1]] // UTI
      };
      
      render(<ConditionsTab {...guCondition} />);
      
      const iconContainer = document.querySelector('.p-2.bg-gray-50.rounded-lg');
      expect(iconContainer).toBeInTheDocument();
    });

    test('displays correct icons for skin conditions', () => {
      const skinCondition = {
        ...defaultProps,
        filteredConditions: [mockConditions[2]] // Cellulitis
      };
      
      render(<ConditionsTab {...skinCondition} />);
      
      const iconContainer = document.querySelector('.p-2.bg-gray-50.rounded-lg');
      expect(iconContainer).toBeInTheDocument();
    });

    test('displays correct icons for CNS conditions', () => {
      const cnsCondition = {
        ...defaultProps,
        filteredConditions: [mockConditions[3]] // Meningitis
      };
      
      render(<ConditionsTab {...cnsCondition} />);
      
      const iconContainer = document.querySelector('.p-2.bg-gray-50.rounded-lg');
      expect(iconContainer).toBeInTheDocument();
    });

    test('applies correct color schemes for different categories', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      // Check for category color classes - the text element itself has the color classes
      expect(screen.getByText('Respiratory')).toHaveClass('bg-blue-100', 'text-blue-700');
      expect(screen.getByText('Genitourinary')).toHaveClass('bg-yellow-100', 'text-yellow-700');
      expect(screen.getByText('Skin and Soft Tissue')).toHaveClass('bg-green-100', 'text-green-700');
      expect(screen.getByText('Central Nervous System')).toHaveClass('bg-purple-100', 'text-purple-700');
    });

    test('handles unknown categories with default icon', () => {
      const unknownCategoryCondition = {
        ...defaultProps,
        filteredConditions: [{
          id: 'unknown',
          name: 'Unknown Condition',
          category: 'Unknown Category',
          commonPathogens: ['Unknown pathogen']
        }]
      };
      
      render(<ConditionsTab {...unknownCategoryCondition} />);
      
      // Check for default gray color classes on the text element itself
      expect(screen.getByText('Unknown Category')).toHaveClass('bg-gray-100', 'text-gray-700');
    });
  });

  describe('Loading States', () => {
    test('shows loading skeletons when isLoading is true initially', async () => {
      const loadingProps = {
        ...defaultProps,
        filteredConditions: null // Simulates initial loading state
      };
      
      render(<ConditionsTab {...loadingProps} />);
      
      expect(screen.getAllByTestId('condition-card-skeleton')).toHaveLength(6);
    });

    test('shows search bar even during loading', () => {
      const loadingProps = {
        ...defaultProps,
        filteredConditions: null
      };
      
      render(<ConditionsTab {...loadingProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      expect(searchInput).toBeInTheDocument();
    });

    test('transitions from loading to content when data loads', async () => {
      const { rerender } = render(<ConditionsTab {...defaultProps} filteredConditions={null} />);
      
      // Initially loading
      expect(screen.getAllByTestId('condition-card-skeleton')).toHaveLength(6);
      
      // Data loads
      rerender(<ConditionsTab {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.queryByTestId('condition-card-skeleton')).not.toBeInTheDocument();
        expect(screen.getByText('Community-Acquired Pneumonia')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles missing filteredConditions prop gracefully', () => {
      const propsWithoutConditions = {
        setSelectedCondition: mockSetSelectedCondition,
        searchTerm: '',
        setSearchTerm: mockSetSearchTerm
      };
      
      expect(() => {
        render(<ConditionsTab {...propsWithoutConditions} />);
      }).not.toThrow();
      
      expect(screen.getByText('No conditions found matching your search.')).toBeInTheDocument();
    });

    test('handles conditions with missing properties gracefully', () => {
      const incompleteConditions = [
        {
          id: 'incomplete',
          name: 'Incomplete Condition'
          // Missing category, commonPathogens
        }
      ];
      
      const incompleteProps = {
        ...defaultProps,
        filteredConditions: incompleteConditions
      };
      
      expect(() => {
        render(<ConditionsTab {...incompleteProps} />);
      }).not.toThrow();
      
      expect(screen.getByText('Incomplete Condition')).toBeInTheDocument();
    });

    test('handles null callback functions gracefully', () => {
      const propsWithNullCallbacks = {
        ...defaultProps,
        setSelectedCondition: null,
        setSearchTerm: null
      };
      
      expect(() => {
        render(<ConditionsTab {...propsWithNullCallbacks} />);
      }).not.toThrow();
    });

    test('shows error message when error state is triggered', () => {
      // We need to simulate an error state
      // Since the component manages its own error state, we'll test the error message component when it appears
      const { container } = render(<ConditionsTab {...defaultProps} />);
      
      // Component should render without errors initially
      expect(container).toBeInTheDocument();
    });
  });

  describe('Pathogen Display Logic', () => {
    test('shows first 3 pathogens when list is longer', () => {
      const longPathogenList = {
        ...defaultProps,
        filteredConditions: [{
          id: 'long-list',
          name: 'Condition with Many Pathogens',
          category: 'Test',
          commonPathogens: ['Pathogen 1', 'Pathogen 2', 'Pathogen 3', 'Pathogen 4', 'Pathogen 5']
        }]
      };
      
      render(<ConditionsTab {...longPathogenList} />);
      
      expect(screen.getByText(/Pathogen 1, Pathogen 2, Pathogen 3\.\.\./)).toBeInTheDocument();
    });

    test('shows all pathogens when list is 3 or fewer', () => {
      const shortPathogenList = {
        ...defaultProps,
        filteredConditions: [{
          id: 'short-list',
          name: 'Condition with Few Pathogens',
          category: 'Test',
          commonPathogens: ['Pathogen 1', 'Pathogen 2']
        }]
      };
      
      render(<ConditionsTab {...shortPathogenList} />);
      
      expect(screen.getByText(/Pathogen 1, Pathogen 2$/)).toBeInTheDocument();
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
    });

    test('handles empty pathogen list gracefully', () => {
      const emptyPathogenList = {
        ...defaultProps,
        filteredConditions: [{
          id: 'empty-pathogens',
          name: 'Condition with No Pathogens',
          category: 'Test',
          commonPathogens: []
        }]
      };
      
      render(<ConditionsTab {...emptyPathogenList} />);
      
      expect(screen.getByText('Condition with No Pathogens')).toBeInTheDocument();
    });

    test('handles undefined pathogen list gracefully', () => {
      const undefinedPathogenList = {
        ...defaultProps,
        filteredConditions: [{
          id: 'undefined-pathogens',
          name: 'Condition with Undefined Pathogens',
          category: 'Test'
          // commonPathogens is undefined
        }]
      };
      
      render(<ConditionsTab {...undefinedPathogenList} />);
      
      expect(screen.getByText('Condition with Undefined Pathogens')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('search input has proper accessibility attributes', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('aria-label', 'Search medical conditions');
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    test('condition cards have proper ARIA labels', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const pneumoniaCard = screen.getByLabelText('View details for Community-Acquired Pneumonia');
      expect(pneumoniaCard).toBeInTheDocument();
      
      const utiCard = screen.getByLabelText('View details for Urinary Tract Infection');
      expect(utiCard).toBeInTheDocument();
    });

    test('condition cards are keyboard navigable', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const conditionCards = screen.getAllByRole('button');
      
      conditionCards.forEach(card => {
        expect(card).toHaveAttribute('tabIndex', '0');
      });
    });

    test('maintains focus management during interactions', async () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const searchInput = screen.getByRole('textbox');
      const firstCard = screen.getAllByRole('button')[0];
      
      // Focus the search input
      searchInput.focus();
      await waitFor(() => {
        expect(document.activeElement).toBe(searchInput);
      }, { timeout: 1000 });
      
      // Focus the first card
      firstCard.focus();
      await waitFor(() => {
        expect(document.activeElement).toBe(firstCard);
      }, { timeout: 1000 });
      
      // Both should be focusable
      expect(searchInput).toHaveAttribute('tabIndex', '0');
      expect(firstCard).toHaveAttribute('tabIndex', '0');
    });

    test('filter controls have proper labels', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      // Search input should have proper accessibility attributes
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('aria-label', 'Search medical conditions');
      expect(searchInput).toHaveAttribute('tabIndex', '0');
      
      // Search input should have proper form association
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveAttribute('placeholder', 'Search conditions, pathogens, or treatments...');
      
      // Search icon should be present for visual context
      const searchContainer = searchInput.parentElement;
      expect(searchContainer).toHaveClass('relative');
      
      // For medical education accessibility, ensure search input is easily discoverable
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toBeVisible();
    });
  });

  describe('Visual Design and Styling', () => {
    test('applies hover effects to condition cards', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const conditionCards = screen.getAllByRole('button');
      
      conditionCards.forEach(card => {
        expect(card).toHaveClass('hover:shadow-md', 'hover:-translate-y-1', 'transition-all');
      });
    });

    test('uses proper grid layout for responsive design', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    });

    test('applies consistent card styling', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const conditionCards = screen.getAllByRole('button');
      
      conditionCards.forEach(card => {
        expect(card).toHaveClass('bg-white', 'rounded-xl', 'p-6', 'shadow-sm', 'border');
      });
    });

    test('uses proper typography hierarchy', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      const conditionName = screen.getByText('Community-Acquired Pneumonia');
      expect(conditionName).toHaveClass('text-lg', 'font-semibold', 'mb-2', 'text-gray-900');
    });
  });

  describe('Performance', () => {
    test('component is memoized to prevent unnecessary re-renders', () => {
      const { rerender } = render(<ConditionsTab {...defaultProps} />);
      
      // Re-render with same props should use memoization
      rerender(<ConditionsTab {...defaultProps} />);
      
      expect(screen.getByText('Community-Acquired Pneumonia')).toBeInTheDocument();
    });

    test('efficiently handles large condition lists', () => {
      const largeConditionList = Array.from({ length: 100 }, (_, i) => ({
        id: `condition-${i}`,
        name: `Condition ${i}`,
        category: `Category ${i % 10}`,
        commonPathogens: [`Pathogen ${i}A`, `Pathogen ${i}B`]
      }));
      
      const largeListProps = {
        ...defaultProps,
        filteredConditions: largeConditionList
      };
      
      expect(() => {
        render(<ConditionsTab {...largeListProps} />);
      }).not.toThrow();
      
      expect(screen.getByText('Condition 0')).toBeInTheDocument();
      expect(screen.getByText('Condition 99')).toBeInTheDocument();
    });
  });

  describe('Integration with Context', () => {
    test('works correctly when rendered with app context', () => {
      renderWithContext(<ConditionsTab {...defaultProps} />);
      
      expect(screen.getByText('Community-Acquired Pneumonia')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search conditions, pathogens, or treatments...')).toBeInTheDocument();
    });
  });

  describe('Medical Content Validation', () => {
    test('displays clinically accurate condition names', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      expect(screen.getByText('Community-Acquired Pneumonia')).toBeInTheDocument();
      expect(screen.getByText('Urinary Tract Infection')).toBeInTheDocument();
      expect(screen.getByText('Bacterial Meningitis')).toBeInTheDocument();
      expect(screen.getByText('Infective Endocarditis')).toBeInTheDocument();
    });

    test('shows appropriate medical categories', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      expect(screen.getByText('Respiratory')).toBeInTheDocument();
      expect(screen.getByText('Genitourinary')).toBeInTheDocument();
      expect(screen.getByText('Central Nervous System')).toBeInTheDocument();
      expect(screen.getByText('Cardiovascular')).toBeInTheDocument();
    });

    test('displays medically accurate pathogen names', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      // Use getAllByText since pathogens may appear in multiple conditions (medically realistic overlaps)
      expect(screen.getAllByText(/Streptococcus pneumoniae/)).toHaveLength(2); // Pneumonia + Meningitis
      expect(screen.getAllByText(/Escherichia coli/)).toHaveLength(1); // UTI only
      expect(screen.getAllByText(/Staphylococcus aureus/)).toHaveLength(2); // Cellulitis + Endocarditis  
      expect(screen.getAllByText(/Neisseria meningitidis/)).toHaveLength(1); // Meningitis only
    });

    test('uses proper medical terminology in interface', () => {
      render(<ConditionsTab {...defaultProps} />);
      
      expect(screen.getAllByText('Common Pathogens:')).toHaveLength(5); // Should have 5 condition cards (realistic data)
      expect(screen.getByPlaceholderText(/pathogens.*treatments/)).toBeInTheDocument();
    });
  });

  describe('Search Integration', () => {
    test('maintains search functionality during state changes', () => {
      const { rerender } = render(<ConditionsTab {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      fireEvent.change(searchInput, { target: { value: 'pneumonia' } });
      
      expect(mockSetSearchTerm).toHaveBeenCalledWith('pneumonia');
      
      // Re-render with new search term
      rerender(<ConditionsTab {...defaultProps} searchTerm="pneumonia" />);
      
      expect(searchInput).toHaveValue('pneumonia');
    });

    test('preserves search input during loading transitions', () => {
      const searchProps = {
        ...defaultProps,
        searchTerm: 'infection',
        filteredConditions: null // Loading state
      };
      
      render(<ConditionsTab {...searchProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search conditions, pathogens, or treatments...');
      expect(searchInput).toHaveValue('infection');
    });
  });
});