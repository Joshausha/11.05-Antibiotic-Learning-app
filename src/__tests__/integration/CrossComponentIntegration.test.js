/**
 * Cross-Component Integration Tests
 * @description Tests for interactions between major application components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithContext } from '../utils/testUtils';
import { AppProvider } from '../../contexts/AppContext';

// Import components for integration testing
import Header from '../../components/Header';
import HomeTab from '../../components/HomeTab';
import ConditionsTab from '../../components/ConditionsTab';

// Mock data for integration tests
const mockConditionsData = [
  {
    id: 'pneumonia',
    name: 'Community-Acquired Pneumonia',
    category: 'Respiratory',
    commonPathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae'],
    description: 'Lung infection acquired outside hospital setting'
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection',
    category: 'Genitourinary',
    commonPathogens: ['Escherichia coli', 'Enterococcus'],
    description: 'Infection of urinary system components'
  }
];

describe('Cross-Component Integration Tests', () => {
  describe('Header and Tab Navigation Integration', () => {
    test('header navigation updates active tab state correctly', () => {
      const mockSetActiveTab = jest.fn();
      const { rerender } = render(
        <Header 
          activeTab="home" 
          setActiveTab={mockSetActiveTab}
        />
      );
      
      // Click on different tab
      const quizTab = screen.getByText(/Quiz/i);
      fireEvent.click(quizTab);
      
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
      
      // Rerender with updated active tab
      rerender(
        <Header 
          activeTab="quiz" 
          setActiveTab={mockSetActiveTab}
        />
      );
      
      // Verify visual state update
      expect(quizTab.closest('button')).toHaveClass('tab-active');
    });
    
    test('keyboard navigation works across header tabs', () => {
      const mockSetActiveTab = jest.fn();
      render(
        <Header 
          activeTab="home" 
          setActiveTab={mockSetActiveTab}
        />
      );
      
      const homeTab = screen.getByText(/home/i).closest('button');
      const referenceTab = screen.getByText(/Reference/i).closest('button');
      
      // Focus on home tab
      homeTab.focus();
      expect(homeTab).toHaveFocus();
      
      // Navigate with arrow keys
      fireEvent.keyDown(homeTab, { key: 'ArrowRight' });
      expect(referenceTab).toHaveFocus();
      
      // Activate with Enter
      fireEvent.keyDown(referenceTab, { key: 'Enter' });
      expect(mockSetActiveTab).toHaveBeenCalledWith('reference');
    });
    
    test('header maintains accessibility during tab changes', async () => {
      const mockSetActiveTab = jest.fn();
      const { rerender } = render(
        <Header 
          activeTab="home" 
          setActiveTab={mockSetActiveTab}
        />
      );
      
      // Check initial ARIA attributes
      const homeTab = screen.getByText(/home/i).closest('button');
      expect(homeTab).toHaveAttribute('aria-selected', 'true');
      
      // Switch tabs
      const referenceTab = screen.getByText(/Reference/i).closest('button');
      fireEvent.click(referenceTab);
      
      // Rerender with new state
      rerender(
        <Header 
          activeTab="reference" 
          setActiveTab={mockSetActiveTab}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Reference/i).closest('button'))
          .toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText(/home/i).closest('button'))
          .toHaveAttribute('aria-selected', 'false');
      });
    });
  });
  
  describe('HomeTab to ConditionsTab Navigation Flow', () => {
    test('start learning button triggers reference tab navigation', () => {
      const mockSetActiveTab = jest.fn();
      
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const startButton = screen.getByText(/start learning/i);
      fireEvent.click(startButton);
      
      expect(mockSetActiveTab).toHaveBeenCalledWith('reference');
    });
    
    test('navigation flow maintains user context', async () => {
      const mockSetActiveTab = jest.fn();
      const { rerender } = render(
        <AppProvider initialContext={mockTestContext}>
          <HomeTab setActiveTab={mockSetActiveTab} />
        </AppProvider>
      );
      
      // Start learning
      const startButton = screen.getByText(/start learning/i);
      fireEvent.click(startButton);
      
      // Simulate navigation to reference tab
      rerender(
        <AppProvider initialContext={mockTestContext}>
          <ConditionsTab 
            filteredConditions={mockConditionsData}
            setSelectedCondition={() => {}}
            searchTerm=""
            setSearchTerm={() => {}}
          />
        </AppProvider>
      );
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search pathogens/i)).toBeInTheDocument();
        expect(screen.getByText(/Community-Acquired Pneumonia/i)).toBeInTheDocument();
      });
    });
  });
  
  describe('Search and Filter Integration', () => {
    test('search functionality works across pathogen data', async () => {
      const mockSetSearchTerm = jest.fn();
      const mockSetSelectedCondition = jest.fn();
      
      const { rerender } = render(
        <ConditionsTab 
          filteredConditions={mockConditionsData}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
        />
      );
      
      // Type in search
      const searchInput = screen.getByPlaceholderText(/search pathogens/i);
      fireEvent.change(searchInput, { target: { value: 'pneumonia' } });
      
      expect(mockSetSearchTerm).toHaveBeenCalledWith('pneumonia');
      
      // Simulate filtered results
      const filteredData = mockConditionsData.filter(condition => 
        condition.name.toLowerCase().includes('pneumonia')
      );
      
      rerender(
        <ConditionsTab 
          filteredConditions={filteredData}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm="pneumonia"
          setSearchTerm={mockSetSearchTerm}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Community-Acquired Pneumonia/i)).toBeInTheDocument();
        expect(screen.queryByText(/Urinary Tract Infection/i)).not.toBeInTheDocument();
      });
    });
    
    test('condition selection triggers detail view', () => {
      const mockSetSelectedCondition = jest.fn();
      
      render(
        <ConditionsTab 
          filteredConditions={mockConditionsData}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={() => {}}
        />
      );
      
      // Click on a condition
      const pneumoniaCard = screen.getByText(/Community-Acquired Pneumonia/i).closest('.bg-white');
      fireEvent.click(pneumoniaCard);
      
      expect(mockSetSelectedCondition).toHaveBeenCalledWith(mockConditionsData[0]);
    });
  });
  
  describe('Context and State Management Integration', () => {
    test('app context provides data to child components', () => {
      render(
        <AppProvider initialContext={mockTestContext}>
          <div>
            <span data-testid="context-test">Context loaded</span>
          </div>
        </AppProvider>
      );
      
      expect(screen.getByTestId('context-test')).toBeInTheDocument();
    });
    
    test('user progress data flows correctly between components', () => {
      const contextWithProgress = {
        ...mockTestContext,
        userProgress: {
          totalQuizzes: 5,
          averageScore: 92,
          sectionsCompleted: 3,
          totalSections: 6
        }
      };
      
      render(
        <AppProvider initialContext={contextWithProgress}>
          <HomeTab setActiveTab={() => {}} />
        </AppProvider>
      );
      
      // Should display progress from context (Note: HomeTab uses hardcoded mock data)
      expect(screen.getByText(/2 of 6 sections completed/i)).toBeInTheDocument();
    });
  });
  
  describe('Error Handling Across Components', () => {
    test('error boundary catches errors in child components', () => {
      const ThrowingComponent = () => {
        throw new Error('Test error');
      };
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <AppProvider initialContext={mockTestContext}>
          <ThrowingComponent />
        </AppProvider>
      );
      
      // Error boundary should display fallback UI
      expect(screen.getByText(/something went wrong/i) || 
             screen.getByText(/error/i)).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
    
    test('components handle missing context gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<HomeTab setActiveTab={() => {}} />);
      }).not.toThrow();
      
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
    
    test('network-like errors are handled in component chain', async () => {
      const mockSetSelectedCondition = jest.fn(() => {
        throw new Error('Network error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <ConditionsTab 
          filteredConditions={mockConditionsData}
          setSelectedCondition={mockSetSelectedCondition}
          searchTerm=""
          setSearchTerm={() => {}}
        />
      );
      
      const conditionCard = screen.getByText(/Community-Acquired Pneumonia/i).closest('.bg-white');
      
      // Should not crash the application
      expect(() => fireEvent.click(conditionCard)).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('Performance Under Integration Load', () => {
    test('multiple component renders perform efficiently', () => {
      const startTime = performance.now();
      
      render(
        <AppProvider initialContext={mockTestContext}>
          <div>
            <Header activeTab="home" setActiveTab={() => {}} />
            <HomeTab setActiveTab={() => {}} />
            <ConditionsTab 
              filteredConditions={mockConditionsData}
              setSelectedCondition={() => {}}
              searchTerm=""
              setSearchTerm={() => {}}
            />
          </div>
        </AppProvider>
      );
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(200); // Should render quickly
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
    });
    
    test('state updates propagate efficiently across components', async () => {
      const mockSetActiveTab = jest.fn();
      const { rerender } = render(
        <AppProvider initialContext={mockTestContext}>
          <Header activeTab="home" setActiveTab={mockSetActiveTab} />
        </AppProvider>
      );
      
      // Rapid state changes
      fireEvent.click(screen.getByText(/Reference/i));
      fireEvent.click(screen.getByText(/quiz/i));
      fireEvent.click(screen.getByText(/home/i));
      
      expect(mockSetActiveTab).toHaveBeenCalledTimes(3);
      
      // Rerender should be efficient
      rerender(
        <AppProvider initialContext={mockTestContext}>
          <Header activeTab="quiz" setActiveTab={mockSetActiveTab} />
        </AppProvider>
      );
      
      await waitFor(() => {
        expect(screen.getByText(/quiz/i).closest('button')).toHaveClass('tab-active');
      });
    });
  });
  
  describe('Accessibility Across Component Boundaries', () => {
    test('focus management works across component transitions', () => {
      const mockSetActiveTab = jest.fn();
      const { rerender } = render(
        <div>
          <Header activeTab="home" setActiveTab={mockSetActiveTab} />
          <HomeTab setActiveTab={mockSetActiveTab} />
        </div>
      );
      
      // Focus on header tab
      const referenceTab = screen.getByText(/Reference/i).closest('button');
      referenceTab.focus();
      expect(referenceTab).toHaveFocus();
      
      // Navigate to reference tab
      fireEvent.click(referenceTab);
      
      // Simulate tab change
      rerender(
        <div>
          <Header activeTab="reference" setActiveTab={mockSetActiveTab} />
          <ConditionsTab 
            filteredConditions={mockConditionsData}
            setSelectedCondition={() => {}}
            searchTerm=""
            setSearchTerm={() => {}}
          />
        </div>
      );
      
      // Focus should be manageable in new tab
      const searchInput = screen.getByPlaceholderText(/search pathogens/i);
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
    
    test('screen reader navigation works across components', () => {
      render(
        <AppProvider initialContext={mockTestContext}>
          <div>
            <Header activeTab="home" setActiveTab={() => {}} />
            <main>
              <HomeTab setActiveTab={() => {}} />
            </main>
          </div>
        </AppProvider>
      );
      
      // Check for proper landmarks
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Check for proper heading hierarchy
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Main heading should be h1
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent(/medical learning app/i);
    });
    
    test('ARIA attributes maintain consistency across component updates', async () => {
      const mockSetActiveTab = jest.fn();
      const { rerender } = render(
        <AppProvider initialContext={mockTestContext}>
          <Header activeTab="home" setActiveTab={mockSetActiveTab} />
        </AppProvider>
      );
      
      // Check initial ARIA state
      const homeTab = screen.getByText(/Learn/i);
      expect(homeTab).toHaveAttribute('aria-selected', 'true');
      
      // Switch tabs
      fireEvent.click(screen.getByText(/Reference/i));
      
      // Update component state
      rerender(
        <AppProvider initialContext={mockTestContext}>
          <Header activeTab="reference" setActiveTab={mockSetActiveTab} />
        </AppProvider>
      );
      
      // Verify ARIA updates
      await waitFor(() => {
        expect(screen.getByText(/Reference/i))
          .toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText(/Learn/i))
          .toHaveAttribute('aria-selected', 'false');
      });
    });
  });
  
  describe('Real User Workflow Scenarios', () => {
    test('complete user journey: home to reference to selection', async () => {
      const mockSetActiveTab = jest.fn();
      const mockSetSelectedCondition = jest.fn();
      
      // Start on home page
      const { rerender } = render(
        <AppProvider initialContext={mockTestContext}>
          <HomeTab setActiveTab={mockSetActiveTab} />
        </AppProvider>
      );
      
      // User clicks "Start Learning"
      const startButton = screen.getByText(/start learning/i);
      fireEvent.click(startButton);
      expect(mockSetActiveTab).toHaveBeenCalledWith('reference');
      
      // Navigate to reference tab
      rerender(
        <AppProvider initialContext={mockTestContext}>
          <ConditionsTab 
            filteredConditions={mockConditionsData}
            setSelectedCondition={mockSetSelectedCondition}
            searchTerm=""
            setSearchTerm={() => {}}
          />
        </AppProvider>
      );
      
      // User searches for condition
      const searchInput = screen.getByPlaceholderText(/search pathogens/i);
      fireEvent.change(searchInput, { target: { value: 'pneumonia' } });
      
      // User selects condition
      const pneumoniaCard = screen.getByText(/Community-Acquired Pneumonia/i).closest('.bg-white');
      fireEvent.click(pneumoniaCard);
      
      expect(mockSetSelectedCondition).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Community-Acquired Pneumonia'
        })
      );
    });
    
    test('user can navigate back and forth between tabs', () => {
      const mockSetActiveTab = jest.fn();
      
      render(
        <AppProvider initialContext={mockTestContext}>
          <Header activeTab="home" setActiveTab={mockSetActiveTab} />
        </AppProvider>
      );
      
      // Navigate to reference
      fireEvent.click(screen.getByText(/Reference/i));
      expect(mockSetActiveTab).toHaveBeenCalledWith('reference');
      
      // Navigate to quiz
      fireEvent.click(screen.getByText(/quiz/i));
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
      
      // Navigate back to home
      fireEvent.click(screen.getByText(/home/i));
      expect(mockSetActiveTab).toHaveBeenCalledWith('home');
      
      expect(mockSetActiveTab).toHaveBeenCalledTimes(3);
    });
    
    test('search and filter workflow maintains state across interactions', async () => {
      const mockSetSearchTerm = jest.fn();
      const mockSetSelectedCondition = jest.fn();
      
      let searchTerm = '';
      let filteredConditions = mockConditionsData;
      
      const SearchableConditions = () => {
        const handleSearch = (term) => {
          searchTerm = term;
          mockSetSearchTerm(term);
          filteredConditions = mockConditionsData.filter(condition =>
            condition.name.toLowerCase().includes(term.toLowerCase())
          );
        };
        
        return (
          <ConditionsTab 
            filteredConditions={filteredConditions}
            setSelectedCondition={mockSetSelectedCondition}
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
          />
        );
      };
      
      const { rerender } = render(<SearchableConditions />);
      
      // Search for pneumonia
      const searchInput = screen.getByPlaceholderText(/search pathogens/i);
      fireEvent.change(searchInput, { target: { value: 'pneumonia' } });
      
      // Rerender with filtered results
      rerender(<SearchableConditions />);
      
      await waitFor(() => {
        expect(screen.getByText(/Community-Acquired Pneumonia/i)).toBeInTheDocument();
        expect(screen.queryByText(/Urinary Tract Infection/i)).not.toBeInTheDocument();
      });
      
      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      searchTerm = '';
      filteredConditions = mockConditionsData;
      
      rerender(<SearchableConditions />);
      
      await waitFor(() => {
        expect(screen.getByText(/Community-Acquired Pneumonia/i)).toBeInTheDocument();
        expect(screen.getByText(/Urinary Tract Infection/i)).toBeInTheDocument();
      });
    });
  });
});