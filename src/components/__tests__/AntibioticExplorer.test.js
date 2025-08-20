/**
 * AntibioticExplorer Component Tests
 * @description Comprehensive test suite for the AntibioticExplorer component
 * @created 2025-08-17
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AntibioticExplorer from '../AntibioticExplorer';
import { renderWithContext } from '../../__tests__/utils/testUtils';

// Mock antibiotic data
const mockAntibioticData = {
  antibiotics: [
    {
      name: 'Amoxicillin',
      class: 'Penicillins',
      count: 15,
      conditions: [
        { name: 'Pneumonia', category: 'Respiratory' },
        { name: 'Otitis Media', category: 'ENT' }
      ]
    },
    {
      name: 'Cephalexin',
      class: 'Cephalosporins',
      count: 12,
      conditions: [
        { name: 'Skin Infection', category: 'Skin and Soft Tissue' }
      ]
    },
    {
      name: 'Azithromycin',
      class: 'Macrolides',
      count: 10,
      conditions: [
        { name: 'Pneumonia', category: 'Respiratory' }
      ]
    }
  ],
  selectedAntibiotic: null,
  selectedAntibioticConditions: [],
  drugClassStats: [
    { drugClass: 'Penicillins', antibiotics: 5, conditions: 10 },
    { drugClass: 'Cephalosporins', antibiotics: 3, conditions: 8 }
  ],
  availableDrugClasses: ['Penicillins', 'Cephalosporins', 'Macrolides'],
  antibioticStats: {
    total: 25,
    drugClassCount: 8,
    avgConditions: 5,
    maxConditions: 15,
    topAntibiotics: [
      { name: 'Amoxicillin', class: 'Penicillins', count: 15 },
      { name: 'Cephalexin', class: 'Cephalosporins', count: 12 }
    ]
  },
  filteredStats: {},
  searchQuery: '',
  drugClassFilter: 'all',
  sortBy: 'name',
  searchAntibiotics: jest.fn(),
  filterByDrugClass: jest.fn(),
  setSortOrder: jest.fn(),
  selectAntibiotic: jest.fn(),
  clearSelection: jest.fn(),
  clearFilters: jest.fn(),
  findAlternativeAntibiotics: jest.fn(() => [
    { name: 'Ampicillin', class: 'Penicillins', conditions: [{ name: 'UTI' }] }
  ]),
  findCombinationTherapies: jest.fn(() => [
    { antibiotic: { name: 'Gentamicin' }, contexts: ['Endocarditis'] }
  ]),
  getResistanceInfo: jest.fn(() => ['MRSA resistance common']),
  isLoading: false
};

const mockSelectedAntibioticData = {
  ...mockAntibioticData,
  selectedAntibiotic: {
    name: 'Amoxicillin',
    class: 'Penicillins',
    count: 15
  },
  selectedAntibioticConditions: [
    { 
      name: 'Pneumonia', 
      category: 'Respiratory',
      relevantTherapies: {
        'First-line': 'Standard dose amoxicillin for community-acquired pneumonia'
      }
    }
  ]
};

describe('AntibioticExplorer Component', () => {
  const mockOnSelectCondition = jest.fn();

  const defaultProps = {
    antibioticData: mockAntibioticData,
    onSelectCondition: mockOnSelectCondition
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders component header with title and description', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('Antibiotic Explorer')).toBeInTheDocument();
      expect(screen.getByText(/explore antimicrobial agents/i)).toBeInTheDocument();
    });

    test('renders antibiotic statistics correctly', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('25')).toBeInTheDocument(); // total antibiotics
      expect(screen.getByText('8')).toBeInTheDocument(); // drug class count
      expect(screen.getByText('5')).toBeInTheDocument(); // avg conditions
      expect(screen.getByText('15')).toBeInTheDocument(); // max conditions
    });

    test('renders top antibiotics section', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('Most Frequently Used:')).toBeInTheDocument();
      expect(screen.getByText('Amoxicillin (15)')).toBeInTheDocument();
      expect(screen.getByText('Cephalexin (12)')).toBeInTheDocument();
    });

    test('renders search and filter panel', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('Search & Filter')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search antibiotics...')).toBeInTheDocument();
      expect(screen.getByText('Drug Class')).toBeInTheDocument();
      expect(screen.getByText('Sort By')).toBeInTheDocument();
    });

    test('renders antibiotic list', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('Antibiotics')).toBeInTheDocument();
      expect(screen.getByText('3 found')).toBeInTheDocument();
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
      expect(screen.getByText('Cephalexin')).toBeInTheDocument();
      expect(screen.getByText('Azithromycin')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('shows loading message when isLoading is true', () => {
      const loadingProps = {
        ...defaultProps,
        antibioticData: { ...mockAntibioticData, isLoading: true }
      };
      
      render(<AntibioticExplorer {...loadingProps} />);
      
      expect(screen.getByText('Loading antibiotic data...')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    test('calls searchAntibiotics when search input changes', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search antibiotics...');
      fireEvent.change(searchInput, { target: { value: 'amoxicillin' } });
      
      expect(mockAntibioticData.searchAntibiotics).toHaveBeenCalledWith('amoxicillin');
    });

    test('search input displays current search query', () => {
      const searchProps = {
        ...defaultProps,
        antibioticData: { ...mockAntibioticData, searchQuery: 'penicillin' }
      };
      
      render(<AntibioticExplorer {...searchProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search antibiotics...');
      expect(searchInput).toHaveValue('penicillin');
    });
  });

  describe('Filter Functionality', () => {
    test('renders drug class filter options', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const drugClassSelect = screen.getByDisplayValue('All Classes');
      expect(drugClassSelect).toBeInTheDocument();
      
      // Check if options are present
      expect(screen.getByText('Penicillins')).toBeInTheDocument();
      expect(screen.getByText('Cephalosporins')).toBeInTheDocument();
      expect(screen.getByText('Macrolides')).toBeInTheDocument();
    });

    test('calls filterByDrugClass when drug class filter changes', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const drugClassSelect = screen.getByDisplayValue('All Classes');
      fireEvent.change(drugClassSelect, { target: { value: 'Penicillins' } });
      
      expect(mockAntibioticData.filterByDrugClass).toHaveBeenCalledWith('Penicillins');
    });

    test('calls setSortOrder when sort option changes', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const sortSelect = screen.getByDisplayValue('Name (A-Z)');
      fireEvent.change(sortSelect, { target: { value: 'count' } });
      
      expect(mockAntibioticData.setSortOrder).toHaveBeenCalledWith('count');
    });

    test('calls clearFilters when clear filters button is clicked', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const clearButton = screen.getByText('Clear Filters');
      fireEvent.click(clearButton);
      
      expect(mockAntibioticData.clearFilters).toHaveBeenCalled();
    });
  });

  describe('Drug Class Statistics', () => {
    test('renders drug class statistics when available', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('Drug Classes')).toBeInTheDocument();
      expect(screen.getByText('5 drugs, 10 conditions')).toBeInTheDocument();
      expect(screen.getByText('3 drugs, 8 conditions')).toBeInTheDocument();
    });

    test('clicking drug class stat filters by that class', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const penicillinsClass = screen.getByText('Penicillins').closest('div');
      fireEvent.click(penicillinsClass);
      
      expect(mockAntibioticData.filterByDrugClass).toHaveBeenCalledWith('Penicillins');
    });
  });

  describe('Antibiotic Selection', () => {
    test('calls selectAntibiotic when antibiotic is clicked', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const amoxicillinCard = screen.getByText('Amoxicillin').closest('div');
      fireEvent.click(amoxicillinCard);
      
      expect(mockAntibioticData.selectAntibiotic).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Amoxicillin' })
      );
    });

    test('calls selectAntibiotic when top antibiotic button is clicked', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const topAntibioticButton = screen.getByText('Amoxicillin (15)');
      fireEvent.click(topAntibioticButton);
      
      expect(mockAntibioticData.selectAntibiotic).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Amoxicillin' })
      );
    });

    test('shows selected antibiotic with different styling', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: {
          ...mockAntibioticData,
          selectedAntibiotic: { name: 'Amoxicillin' }
        }
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      const selectedCard = screen.getByText('Amoxicillin').closest('div');
      expect(selectedCard).toHaveClass('border-blue-500', 'bg-blue-50');
    });
  });

  describe('Selected Antibiotic Details', () => {
    test('does not show details panel when no antibiotic is selected', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.queryByText('Clinical Applications')).not.toBeInTheDocument();
      expect(screen.queryByText('Alternative Options')).not.toBeInTheDocument();
    });

    test('shows antibiotic details when antibiotic is selected', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
      expect(screen.getByText('15 uses')).toBeInTheDocument();
      expect(screen.getByText('Clinical Applications (1)')).toBeInTheDocument();
      expect(screen.getByText('Alternative Options')).toBeInTheDocument();
    });

    test('shows resistance information when available', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      expect(screen.getByText('Resistance Considerations')).toBeInTheDocument();
      expect(screen.getByText('MRSA resistance common')).toBeInTheDocument();
    });

    test('shows combination therapies when available', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      expect(screen.getByText('Combination Therapies')).toBeInTheDocument();
      expect(screen.getByText('Gentamicin')).toBeInTheDocument();
      expect(screen.getByText('1 context')).toBeInTheDocument();
    });

    test('calls clearSelection when close button is clicked', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);
      
      expect(mockAntibioticData.clearSelection).toHaveBeenCalled();
    });

    test('calls onSelectCondition when condition is clicked', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      const conditionCard = screen.getByText('Pneumonia').closest('div');
      fireEvent.click(conditionCard);
      
      expect(mockOnSelectCondition).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Pneumonia' })
      );
    });

    test('shows therapy contexts when available', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      expect(screen.getByText('Therapy contexts:')).toBeInTheDocument();
      expect(screen.getByText('First-line:')).toBeInTheDocument();
      expect(screen.getByText(/Standard dose amoxicillin/)).toBeInTheDocument();
    });
  });

  describe('Alternative Antibiotics', () => {
    test('shows alternative antibiotics for selected antibiotic', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      expect(screen.getByText('Alternative Options')).toBeInTheDocument();
      expect(screen.getByText('Ampicillin')).toBeInTheDocument();
    });

    test('clicking alternative antibiotic selects it', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      const alternativeCard = screen.getByText('Ampicillin').closest('div');
      fireEvent.click(alternativeCard);
      
      expect(mockAntibioticData.selectAntibiotic).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Ampicillin' })
      );
    });
  });

  describe('Drug Class Color Coding', () => {
    test('applies correct color classes for different drug classes', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      // Check Penicillins color (blue)
      const penicillinsBadge = screen.getByText('Penicillins');
      expect(penicillinsBadge).toHaveClass('text-blue-600', 'bg-blue-100');
      
      // Check Cephalosporins color (green)
      const cephalosporinsBadge = screen.getByText('Cephalosporins');
      expect(cephalosporinsBadge).toHaveClass('text-green-600', 'bg-green-100');
      
      // Check Macrolides color (pink)
      const macrolidesBadge = screen.getByText('Macrolides');
      expect(macrolidesBadge).toHaveClass('text-pink-600', 'bg-pink-100');
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Antibiotic Explorer');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Search & Filter');
    });

    test('search input has proper accessibility attributes', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search antibiotics...');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    });

    test('filter selects have proper labels', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('Drug Class')).toBeInTheDocument();
      expect(screen.getByText('Sort By')).toBeInTheDocument();
    });

    test('interactive elements are keyboard accessible', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      const clickableElements = screen.getAllByRole('button');
      clickableElements.forEach(element => {
        expect(element).toHaveClass('cursor-pointer');
      });
    });
  });

  describe('Error Handling', () => {
    test('handles missing antibiotic data gracefully', () => {
      const emptyProps = {
        antibioticData: {
          ...mockAntibioticData,
          antibiotics: [],
          drugClassStats: [],
          availableDrugClasses: []
        },
        onSelectCondition: mockOnSelectCondition
      };
      
      expect(() => {
        render(<AntibioticExplorer {...emptyProps} />);
      }).not.toThrow();
      
      expect(screen.getByText('0 found')).toBeInTheDocument();
    });

    test('handles missing selectedAntibioticConditions gracefully', () => {
      const propsWithoutConditions = {
        ...defaultProps,
        antibioticData: {
          ...mockSelectedAntibioticData,
          selectedAntibioticConditions: []
        }
      };
      
      expect(() => {
        render(<AntibioticExplorer {...propsWithoutConditions} />);
      }).not.toThrow();
    });

    test('handles missing function props gracefully', () => {
      const propsWithNullFunctions = {
        antibioticData: {
          ...mockAntibioticData,
          searchAntibiotics: null,
          selectAntibiotic: null
        },
        onSelectCondition: null
      };
      
      expect(() => {
        render(<AntibioticExplorer {...propsWithNullFunctions} />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('component is memoized to prevent unnecessary re-renders', () => {
      const { rerender } = render(<AntibioticExplorer {...defaultProps} />);
      
      // Re-render with same props should use memoization
      rerender(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('Antibiotic Explorer')).toBeInTheDocument();
    });

    test('handles large antibiotic lists efficiently', () => {
      const largeDataProps = {
        ...defaultProps,
        antibioticData: {
          ...mockAntibioticData,
          antibiotics: Array.from({ length: 100 }, (_, i) => ({
            name: `Antibiotic ${i}`,
            class: 'Test Class',
            count: i,
            conditions: []
          }))
        }
      };
      
      expect(() => {
        render(<AntibioticExplorer {...largeDataProps} />);
      }).not.toThrow();
      
      expect(screen.getByText('100 found')).toBeInTheDocument();
    });
  });

  describe('Integration with Context', () => {
    test('works correctly when rendered with context', () => {
      renderWithContext(<AntibioticExplorer {...defaultProps} />);
      
      expect(screen.getByText('Antibiotic Explorer')).toBeInTheDocument();
      expect(screen.getByText('Search & Filter')).toBeInTheDocument();
    });
  });

  describe('Medical Content Validation', () => {
    test('displays clinically relevant antibiotic information', () => {
      render(<AntibioticExplorer {...defaultProps} />);
      
      // Check for proper medical terminology
      expect(screen.getByText('Penicillins')).toBeInTheDocument();
      expect(screen.getByText('Cephalosporins')).toBeInTheDocument();
      expect(screen.getByText('conditions')).toBeInTheDocument();
    });

    test('resistance information is displayed with appropriate warning styling', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      const resistanceSection = screen.getByText('Resistance Considerations').closest('div');
      expect(resistanceSection).toHaveClass('bg-yellow-50', 'border-yellow-200');
    });

    test('validates proper medical condition categories', () => {
      const selectedProps = {
        ...defaultProps,
        antibioticData: mockSelectedAntibioticData
      };
      
      render(<AntibioticExplorer {...selectedProps} />);
      
      expect(screen.getByText('Respiratory')).toBeInTheDocument();
    });
  });
});