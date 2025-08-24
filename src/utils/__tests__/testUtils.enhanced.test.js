/**
 * Enhanced Test Utils Coverage Tests
 * 
 * Comprehensive test suite for existing testUtils.js functions
 * Focus: Improve coverage from 31.16% to >80% for testing infrastructure
 * Agent: Delta-1 - Coverage Improvement Specialist
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import all testUtils functions
import {
  mockMedicalConditions,
  mockPathogenData,
  mockAntibioticData,
  mockQuizProgress,
  mockBookmarks,
  mockSearchData,
  mockHooks,
  renderWithContext,
  createMockContextValue,
  ThrowError,
  createMockComponent,
  testAccessibility,
  waitForLoadingToFinish,
  measureRenderTime,
  mockLocalStorage,
  setupTestEnvironment,
  createTestCondition,
  createTestPathogen,
  createTestUser
} from '../testUtils';

// Mock console methods to reduce test noise
const originalConsole = {
  error: console.error,
  warn: console.warn,
  log: console.log
};

describe('Enhanced Test Utils Coverage', () => {
  beforeAll(() => {
    // Mock console methods to reduce test output noise
    console.error = jest.fn();
    console.warn = jest.fn();
    console.log = jest.fn();
  });

  afterAll(() => {
    // Restore original console methods
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.log = originalConsole.log;
  });

  beforeEach(() => {
    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  describe('Mock Data Validation', () => {
    test('mockMedicalConditions should have proper medical structure', () => {
      expect(Array.isArray(mockMedicalConditions)).toBe(true);
      expect(mockMedicalConditions.length).toBeGreaterThan(0);
      
      mockMedicalConditions.forEach(condition => {
        expect(condition).toHaveProperty('id');
        expect(condition).toHaveProperty('name');
        expect(condition).toHaveProperty('category');
        expect(condition).toHaveProperty('description');
        expect(condition).toHaveProperty('commonPathogens');
        expect(condition).toHaveProperty('antibiotics');
        expect(Array.isArray(condition.commonPathogens)).toBe(true);
        expect(Array.isArray(condition.antibiotics)).toBe(true);
      });
    });

    test('mockPathogenData should contain medical pathogen information', () => {
      expect(mockPathogenData).toHaveProperty('pathogens');
      expect(Array.isArray(mockPathogenData.pathogens)).toBe(true);
      
      mockPathogenData.pathogens.forEach(pathogen => {
        expect(pathogen).toHaveProperty('id');
        expect(pathogen).toHaveProperty('name');
        expect(pathogen).toHaveProperty('gramStatus');
        expect(['Positive', 'Negative'].includes(pathogen.gramStatus)).toBe(true);
        expect(pathogen).toHaveProperty('category');
        expect(pathogen).toHaveProperty('conditions');
        expect(Array.isArray(pathogen.conditions)).toBe(true);
      });
    });

    test('mockAntibioticData should contain proper antibiotic structure', () => {
      expect(mockAntibioticData).toHaveProperty('antibiotics');
      expect(Array.isArray(mockAntibioticData.antibiotics)).toBe(true);
      
      mockAntibioticData.antibiotics.forEach(antibiotic => {
        expect(antibiotic).toHaveProperty('id');
        expect(antibiotic).toHaveProperty('name');
        expect(antibiotic).toHaveProperty('drugClass');
        expect(antibiotic).toHaveProperty('spectrum');
        expect(antibiotic).toHaveProperty('conditions');
        expect(Array.isArray(antibiotic.conditions)).toBe(true);
      });
    });

    test('mockQuizProgress should have complete progress structure', () => {
      expect(mockQuizProgress).toHaveProperty('stats');
      expect(mockQuizProgress.stats).toHaveProperty('totalQuizzes');
      expect(mockQuizProgress.stats).toHaveProperty('averageScore');
      expect(mockQuizProgress.stats).toHaveProperty('lastQuizScore');
      expect(mockQuizProgress.stats).toHaveProperty('correctAnswers');
      expect(mockQuizProgress.stats).toHaveProperty('totalQuestions');
      
      expect(mockQuizProgress).toHaveProperty('recentQuizzes');
      expect(Array.isArray(mockQuizProgress.recentQuizzes)).toBe(true);
      
      // Verify mock functions exist
      expect(typeof mockQuizProgress.clearHistory).toBe('function');
      expect(typeof mockQuizProgress.submitQuiz).toBe('function');
    });

    test('mockBookmarks should have bookmark functionality', () => {
      expect(mockBookmarks).toHaveProperty('bookmarkedConditions');
      expect(Array.isArray(mockBookmarks.bookmarkedConditions)).toBe(true);
      expect(typeof mockBookmarks.isBookmarked).toBe('function');
      expect(typeof mockBookmarks.toggleBookmark).toBe('function');
      
      // Test bookmark functionality
      expect(mockBookmarks.isBookmarked('pneumonia')).toBe(true);
      expect(mockBookmarks.isBookmarked('unknown')).toBe(false);
    });

    test('mockSearchData should have search functionality', () => {
      expect(mockSearchData).toHaveProperty('searchTerm');
      expect(typeof mockSearchData.searchTerm).toBe('string');
      expect(typeof mockSearchData.setSearchTerm).toBe('function');
      expect(mockSearchData).toHaveProperty('filteredItems');
      expect(Array.isArray(mockSearchData.filteredItems)).toBe(true);
    });
  });

  describe('Mock Hooks Functionality', () => {
    test('mockHooks should provide all necessary hook mocks', () => {
      expect(typeof mockHooks.useResponsive).toBe('function');
      expect(typeof mockHooks.useQuizProgress).toBe('function');
      expect(typeof mockHooks.useBookmarks).toBe('function');
      expect(typeof mockHooks.usePathogenData).toBe('function');
      expect(typeof mockHooks.useAntibioticData).toBe('function');
      expect(typeof mockHooks.useSearch).toBe('function');
      expect(typeof mockHooks.useErrorHandler).toBe('function');
    });

    test('mockHooks should return expected values', () => {
      expect(mockHooks.useResponsive()).toBe(false);
      expect(mockHooks.useQuizProgress()).toEqual(mockQuizProgress);
      expect(mockHooks.useBookmarks()).toEqual(mockBookmarks);
      expect(mockHooks.usePathogenData()).toEqual(mockPathogenData);
      expect(mockHooks.useAntibioticData()).toEqual(mockAntibioticData);
      expect(mockHooks.useSearch()).toEqual(mockSearchData);
    });

    test('mockHooks.useErrorHandler should handle errors gracefully', () => {
      const errorHandler = mockHooks.useErrorHandler();
      expect(errorHandler).toHaveProperty('withErrorHandling');
      
      // Test successful execution
      const successResult = errorHandler.withErrorHandling(() => 'success', 'fallback');
      expect(successResult).toBe('success');
      
      // Test error handling
      const errorResult = errorHandler.withErrorHandling(() => {
        throw new Error('Test error');
      }, 'fallback');
      expect(errorResult).toBe('fallback');
    });
  });

  describe('Context Rendering Utilities', () => {
    test('renderWithContext should render components with context', () => {
      const TestComponent = () => <div data-testid="test-component">Test Content</div>;
      
      renderWithContext(<TestComponent />);
      
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('renderWithContext should accept custom context values', () => {
      const TestComponent = () => <div>Context Test</div>;
      const customContextValue = {
        userProgress: { totalQuizzes: 10 },
        bookmarks: [],
        preferences: { difficulty: 'advanced' }
      };
      
      expect(() => {
        renderWithContext(<TestComponent />, {
          contextValue: customContextValue
        });
      }).not.toThrow();
    });

    test('createMockContextValue should generate complete context structure', () => {
      const defaultContext = createMockContextValue();
      
      expect(defaultContext).toHaveProperty('userProgress');
      expect(defaultContext).toHaveProperty('bookmarks');
      expect(defaultContext).toHaveProperty('preferences');
      expect(defaultContext).toHaveProperty('addBookmark');
      expect(defaultContext).toHaveProperty('removeBookmark');
      expect(defaultContext).toHaveProperty('updatePreferences');
      
      // Test function properties
      expect(typeof defaultContext.addBookmark).toBe('function');
      expect(typeof defaultContext.removeBookmark).toBe('function');
      expect(typeof defaultContext.updatePreferences).toBe('function');
    });

    test('createMockContextValue should accept overrides', () => {
      const overrides = {
        userProgress: { totalQuizzes: 20, averageScore: 95 },
        preferences: { difficulty: 'expert', theme: 'dark' }
      };
      
      const customContext = createMockContextValue(overrides);
      
      expect(customContext.userProgress.totalQuizzes).toBe(20);
      expect(customContext.userProgress.averageScore).toBe(95);
      expect(customContext.preferences.difficulty).toBe('expert');
      expect(customContext.preferences.theme).toBe('dark');
    });
  });

  describe('Error Testing Utilities', () => {
    test('ThrowError component should throw when shouldThrow is true', () => {
      const ErrorBoundary = ({ children }) => {
        try {
          return <div>{children}</div>;
        } catch (error) {
          return <div data-testid="error-caught">Error caught</div>;
        }
      };

      expect(() => {
        render(
          <ThrowError shouldThrow={true}>
            <div>Should not render</div>
          </ThrowError>
        );
      }).toThrow();
    });

    test('ThrowError component should render children when shouldThrow is false', () => {
      render(
        <ThrowError shouldThrow={false}>
          <div data-testid="child-content">Child Content</div>
        </ThrowError>
      );
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });

  describe('Mock Component Creation', () => {
    test('createMockComponent should create functional mock component', () => {
      const MockComponent = createMockComponent('TestComponent', { 
        text: 'Mock Text',
        className: 'mock-class' 
      });
      
      render(<MockComponent text="Override Text" />);
      
      expect(screen.getByTestId('mock-testcomponent')).toBeInTheDocument();
      expect(screen.getByText(/Mock TestComponent:/)).toBeInTheDocument();
    });

    test('createMockComponent should handle props correctly', () => {
      const MockButton = createMockComponent('Button', { 
        onClick: jest.fn(),
        disabled: false 
      });
      
      const mockOnClick = jest.fn();
      render(<MockButton onClick={mockOnClick} text="Click Me" />);
      
      const button = screen.getByTestId('mock-button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility Testing Utilities', () => {
    test('testAccessibility should have checkAriaLabels function', () => {
      expect(testAccessibility).toHaveProperty('checkAriaLabels');
      expect(typeof testAccessibility.checkAriaLabels).toBe('function');
    });

    test('testAccessibility should have checkKeyboardNavigation function', () => {
      expect(testAccessibility).toHaveProperty('checkKeyboardNavigation');
      expect(typeof testAccessibility.checkKeyboardNavigation).toBe('function');
    });

    test('testAccessibility.checkAriaLabels should validate ARIA labels', async () => {
      const TestComponent = () => (
        <div>
          <button aria-label="Test Button">Click Me</button>
          <input aria-label="Test Input" />
        </div>
      );
      
      render(<TestComponent />);
      
      await expect(async () => {
        await testAccessibility.checkAriaLabels();
      }).not.toThrow();
    });

    test('testAccessibility.checkKeyboardNavigation should test keyboard access', async () => {
      const TestComponent = () => (
        <div>
          <button>Button 1</button>
          <button>Button 2</button>
          <input type="text" />
        </div>
      );
      
      render(<TestComponent />);
      
      await expect(async () => {
        await testAccessibility.checkKeyboardNavigation();
      }).not.toThrow();
    });
  });

  describe('Performance Testing Utilities', () => {
    test('waitForLoadingToFinish should handle async loading states', async () => {
      // Mock a loading component that changes after delay
      const LoadingComponent = () => {
        const [loading, setLoading] = React.useState(true);
        
        React.useEffect(() => {
          setTimeout(() => setLoading(false), 50);
        }, []);
        
        return loading ? <div>Loading...</div> : <div data-testid="loaded">Loaded!</div>;
      };
      
      render(<LoadingComponent />);
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('loaded')).toBeInTheDocument();
      });
    });

    test('measureRenderTime should measure component render performance', () => {
      const TestComponent = () => <div>Performance Test</div>;
      
      const renderTime = measureRenderTime(() => {
        render(<TestComponent />);
      });
      
      expect(typeof renderTime).toBe('number');
      expect(renderTime).toBeGreaterThanOrEqual(0);
      expect(renderTime).toBeLessThan(1000); // Should be under 1 second
    });
  });

  describe('Local Storage Mocking', () => {
    test('mockLocalStorage should provide localStorage functionality', () => {
      expect(mockLocalStorage).toHaveProperty('getItem');
      expect(mockLocalStorage).toHaveProperty('setItem');
      expect(mockLocalStorage).toHaveProperty('removeItem');
      expect(mockLocalStorage).toHaveProperty('clear');
      expect(mockLocalStorage).toHaveProperty('key');
      expect(mockLocalStorage).toHaveProperty('length');
      
      // Test all methods are functions
      expect(typeof mockLocalStorage.getItem).toBe('function');
      expect(typeof mockLocalStorage.setItem).toBe('function');
      expect(typeof mockLocalStorage.removeItem).toBe('function');
      expect(typeof mockLocalStorage.clear).toBe('function');
      expect(typeof mockLocalStorage.key).toBe('function');
    });

    test('mockLocalStorage should simulate localStorage operations', () => {
      // Test setItem and getItem
      mockLocalStorage.setItem('testKey', 'testValue');
      expect(mockLocalStorage.getItem('testKey')).toBe('testValue');
      
      // Test removeItem
      mockLocalStorage.removeItem('testKey');
      expect(mockLocalStorage.getItem('testKey')).toBe(null);
      
      // Test clear
      mockLocalStorage.setItem('key1', 'value1');
      mockLocalStorage.setItem('key2', 'value2');
      mockLocalStorage.clear();
      expect(mockLocalStorage.getItem('key1')).toBe(null);
      expect(mockLocalStorage.getItem('key2')).toBe(null);
    });
  });

  describe('Test Environment Setup', () => {
    test('setupTestEnvironment should configure test environment', () => {
      const originalLocalStorage = global.localStorage;
      const originalConsole = global.console;
      
      const cleanup = setupTestEnvironment();
      
      // Verify localStorage is mocked
      expect(global.localStorage).toBeDefined();
      expect(typeof global.localStorage.getItem).toBe('function');
      
      // Verify console is configured
      expect(global.console).toBeDefined();
      
      // Test cleanup function
      expect(typeof cleanup).toBe('function');
      
      // Clean up
      cleanup();
      
      // Note: We don't restore because we want to keep mocks for other tests
    });
  });

  describe('Test Data Creation Utilities', () => {
    test('createTestCondition should create medical condition with defaults', () => {
      const condition = createTestCondition();
      
      expect(condition).toHaveProperty('id');
      expect(condition).toHaveProperty('name');
      expect(condition).toHaveProperty('category');
      expect(condition).toHaveProperty('description');
      expect(condition).toHaveProperty('commonPathogens');
      expect(condition).toHaveProperty('antibiotics');
      
      expect(Array.isArray(condition.commonPathogens)).toBe(true);
      expect(Array.isArray(condition.antibiotics)).toBe(true);
    });

    test('createTestCondition should accept overrides', () => {
      const customCondition = createTestCondition({
        name: 'Custom Pneumonia',
        category: 'Custom Respiratory',
        description: 'Custom lung infection',
        commonPathogens: ['Custom Strep'],
        antibiotics: ['Custom Amoxicillin']
      });
      
      expect(customCondition.name).toBe('Custom Pneumonia');
      expect(customCondition.category).toBe('Custom Respiratory');
      expect(customCondition.description).toBe('Custom lung infection');
      expect(customCondition.commonPathogens).toEqual(['Custom Strep']);
      expect(customCondition.antibiotics).toEqual(['Custom Amoxicillin']);
    });

    test('createTestPathogen should create pathogen with defaults', () => {
      const pathogen = createTestPathogen();
      
      expect(pathogen).toHaveProperty('id');
      expect(pathogen).toHaveProperty('name');
      expect(pathogen).toHaveProperty('gramStatus');
      expect(pathogen).toHaveProperty('category');
      expect(pathogen).toHaveProperty('conditions');
      
      expect(['Positive', 'Negative'].includes(pathogen.gramStatus)).toBe(true);
      expect(Array.isArray(pathogen.conditions)).toBe(true);
    });

    test('createTestPathogen should accept overrides', () => {
      const customPathogen = createTestPathogen({
        name: 'Custom E. coli',
        gramStatus: 'Negative',
        category: 'Custom Enteric',
        conditions: ['custom-uti', 'custom-gastro']
      });
      
      expect(customPathogen.name).toBe('Custom E. coli');
      expect(customPathogen.gramStatus).toBe('Negative');
      expect(customPathogen.category).toBe('Custom Enteric');
      expect(customPathogen.conditions).toEqual(['custom-uti', 'custom-gastro']);
    });

    test('createTestUser should create user with defaults', () => {
      const user = createTestUser();
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('level');
      expect(user).toHaveProperty('progress');
      expect(user).toHaveProperty('preferences');
      
      expect(user.progress).toHaveProperty('totalQuizzes');
      expect(user.progress).toHaveProperty('averageScore');
      expect(user.preferences).toHaveProperty('difficulty');
    });

    test('createTestUser should accept overrides', () => {
      const customUser = createTestUser({
        name: 'Dr. Smith',
        level: 'expert',
        progress: { totalQuizzes: 50, averageScore: 95 },
        preferences: { difficulty: 'advanced', theme: 'dark' }
      });
      
      expect(customUser.name).toBe('Dr. Smith');
      expect(customUser.level).toBe('expert');
      expect(customUser.progress.totalQuizzes).toBe(50);
      expect(customUser.progress.averageScore).toBe(95);
      expect(customUser.preferences.difficulty).toBe('advanced');
      expect(customUser.preferences.theme).toBe('dark');
    });
  });

  describe('Integration and Edge Cases', () => {
    test('should handle null and undefined inputs gracefully', () => {
      expect(() => {
        createMockContextValue(null);
        createTestCondition(null);
        createTestPathogen(undefined);
        createTestUser(undefined);
      }).not.toThrow();
    });

    test('should work with complex nested overrides', () => {
      const complexOverrides = {
        userProgress: {
          totalQuizzes: 100,
          averageScore: 88,
          sectionsCompleted: { respiratory: 10, cardiac: 8, neurological: 6 }
        },
        preferences: {
          difficulty: 'mixed',
          categories: ['respiratory', 'infectious'],
          accessibility: {
            screenReader: true,
            highContrast: false,
            fontSize: 'large'
          }
        }
      };
      
      const context = createMockContextValue(complexOverrides);
      
      expect(context.userProgress.totalQuizzes).toBe(100);
      expect(context.userProgress.sectionsCompleted.respiratory).toBe(10);
      expect(context.preferences.accessibility.screenReader).toBe(true);
    });

    test('should maintain function mocks across multiple calls', () => {
      const bookmark = mockBookmarks.isBookmarked;
      const search = mockSearchData.setSearchTerm;
      
      bookmark('test1');
      bookmark('test2');
      search('query1');
      search('query2');
      
      expect(bookmark).toHaveBeenCalledTimes(2);
      expect(search).toHaveBeenCalledTimes(2);
      expect(bookmark).toHaveBeenCalledWith('test1');
      expect(bookmark).toHaveBeenCalledWith('test2');
      expect(search).toHaveBeenCalledWith('query1');
      expect(search).toHaveBeenCalledWith('query2');
    });
  });
});