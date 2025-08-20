/**
 * Test Utilities
 * @description Comprehensive testing utilities for the Antibiotic Learning App
 * @created 2025-07-28 06:49:33
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider } from '../../contexts/AppContext';

/**
 * Mock Data for Testing
 */
export const mockMedicalConditions = [
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    category: 'Respiratory',
    description: 'Infection of the lungs',
    commonPathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae'],
    antibiotics: ['Amoxicillin', 'Azithromycin']
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection',
    category: 'Genitourinary',
    description: 'Infection of the urinary system',
    commonPathogens: ['E. coli', 'Klebsiella'],
    antibiotics: ['Nitrofurantoin', 'Trimethoprim-sulfamethoxazole']
  }
];

export const mockPathogenData = {
  pathogens: [
    {
      id: 'strep-pneumoniae',
      name: 'Streptococcus pneumoniae',
      gramStatus: 'Positive',
      category: 'Respiratory',
      conditions: ['pneumonia', 'meningitis']
    },
    {
      id: 'e-coli',
      name: 'Escherichia coli',
      gramStatus: 'Negative',
      category: 'Enteric',
      conditions: ['uti', 'gastroenteritis']
    }
  ],
  selectedPathogen: null,
  isLoading: false
};

export const mockAntibioticData = {
  antibiotics: [
    {
      id: 'amoxicillin',
      name: 'Amoxicillin',
      class: 'Beta-lactam',
      spectrum: 'Narrow',
      pathogens: ['strep-pneumoniae']
    },
    {
      id: 'ciprofloxacin',
      name: 'Ciprofloxacin',
      class: 'Fluoroquinolone',
      spectrum: 'Broad',
      pathogens: ['e-coli']
    }
  ],
  selectedAntibiotic: null,
  isLoading: false
};

export const mockQuizProgress = {
  stats: {
    totalQuizzes: 5,
    averageScore: 75,
    lastQuizScore: 80,
    correctAnswers: 12,
    totalQuestions: 16
  },
  recentQuizzes: [
    {
      id: 'quiz-1',
      score: 80,
      date: '2025-07-28',
      questionsAnswered: 10,
      correctAnswers: 8
    }
  ],
  clearHistory: jest.fn(),
  submitQuiz: jest.fn()
};

export const mockBookmarks = {
  bookmarkedConditions: ['pneumonia'],
  isBookmarked: jest.fn((id) => id === 'pneumonia'),
  toggleBookmark: jest.fn()
};

export const mockSearchData = {
  searchTerm: '',
  setSearchTerm: jest.fn(),
  filteredItems: mockMedicalConditions
};

/**
 * Mock Hook Implementations
 */
export const mockHooks = {
  useResponsive: jest.fn(() => false),
  useQuizProgress: jest.fn(() => mockQuizProgress),
  useBookmarks: jest.fn(() => mockBookmarks),
  usePathogenData: jest.fn(() => mockPathogenData),
  useAntibioticData: jest.fn(() => mockAntibioticData),
  useSearch: jest.fn(() => mockSearchData),
  useErrorHandler: jest.fn(() => ({
    withErrorHandling: (fn, fallback) => {
      try {
        return fn();
      } catch {
        return fallback;
      }
    },
    fallbacks: {
      quizProgress: { stats: {}, recentQuizzes: [] },
      bookmarks: { bookmarkedConditions: [] },
      pathogenData: { pathogens: [] },
      antibioticData: { antibiotics: [] },
      searchData: () => ({ searchTerm: '', filteredItems: [] })
    }
  }))
};

/**
 * Enhanced Custom Render with Context Provider
 */
export const renderWithContext = (ui, options = {}) => {
  const {
    initialState = {},
    ...renderOptions
  } = options;

  // Create wrapper with AppProvider
  const Wrapper = ({ children }) => {
    return (
      <AppProvider>
        {children}
      </AppProvider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    // Return additional utilities
    rerender: (newUi) => render(newUi, { wrapper: Wrapper, container: document.body.firstChild })
  };
};

/**
 * Mock Context Value Factory
 */
export const createMockContextValue = (overrides = {}) => ({
  // Core state
  activeTab: 'home',
  setActiveTab: jest.fn(),
  selectedCondition: null,
  setSelectedCondition: jest.fn(),
  showMobileMenu: false,
  setShowMobileMenu: jest.fn(),
  
  // Device state
  isMobile: false,
  
  // Data and functionality
  quizProgress: mockQuizProgress,
  bookmarks: mockBookmarks,
  pathogenData: mockPathogenData,
  antibioticData: mockAntibioticData,
  searchData: mockSearchData,
  
  // Static data
  medicalConditions: mockMedicalConditions,
  
  // Apply overrides
  ...overrides
});

/**
 * Error Boundary Test Helper
 */
export const ThrowError = ({ shouldThrow, children }) => {
  if (shouldThrow) {
    throw new Error('Test error for ErrorBoundary');
  }
  return children;
};

/**
 * Component Test Helpers
 */
export const createMockComponent = (name, props = {}) => {
  const MockComponent = React.forwardRef((componentProps, ref) => (
    <div data-testid={`mock-${name.toLowerCase()}`} ref={ref} {...componentProps}>
      {name} Mock Component
      {props.children && <div>{props.children}</div>}
    </div>
  ));
  MockComponent.displayName = `Mock${name}`;
  return MockComponent;
};

/**
 * Accessibility Test Helpers
 */
export const testAccessibility = {
  // Test keyboard navigation
  testKeyboardNavigation: (elements) => {
    elements.forEach((element) => {
      expect(element).toHaveAttribute('tabIndex');
      expect(parseInt(element.getAttribute('tabIndex'))).toBeGreaterThanOrEqual(0);
    });
  },
  
  // Test ARIA labels
  testAriaLabels: (elements) => {
    elements.forEach((element) => {
      const hasAriaLabel = element.hasAttribute('aria-label') || 
                          element.hasAttribute('aria-labelledby') ||
                          element.hasAttribute('aria-describedby');
      expect(hasAriaLabel).toBe(true);
    });
  },
  
  // Test semantic roles
  testSemanticRoles: (expectedRoles) => {
    expectedRoles.forEach((role) => {
      expect(screen.getByRole(role)).toBeInTheDocument();
    });
  }
};

/**
 * Async Test Helpers
 */
export const waitForLoadingToFinish = async () => {
  // Wait for any loading spinners to disappear
  await screen.findByText(/loading/i).catch(() => {});
  await new Promise(resolve => setTimeout(resolve, 100));
};

/**
 * Performance Test Helpers
 */
export const measureRenderTime = (renderFn) => {
  const startTime = performance.now();
  const result = renderFn();
  const endTime = performance.now();
  
  return {
    ...result,
    renderTime: endTime - startTime
  };
};

/**
 * Mock Local Storage
 */
export const mockLocalStorage = {
  store: {},
  getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: jest.fn((key) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  })
};

/**
 * Setup and Teardown Helpers
 */
export const setupTestEnvironment = () => {
  // Mock console methods to reduce noise
  const originalConsole = { ...console };
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
  
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
  
  // Mock matchMedia for responsive hooks
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  
  return {
    cleanup: () => {
      Object.assign(console, originalConsole);
      jest.restoreAllMocks();
      mockLocalStorage.clear();
    }
  };
};

/**
 * Test Data Factories
 */
export const createTestCondition = (overrides = {}) => ({
  id: 'test-condition',
  name: 'Test Condition',
  category: 'Test Category',
  description: 'Test description',
  commonPathogens: ['Test Pathogen'],
  antibiotics: ['Test Antibiotic'],
  ...overrides
});

export const createTestPathogen = (overrides = {}) => ({
  id: 'test-pathogen',
  name: 'Test Pathogen',
  gramStatus: 'Positive',
  category: 'Test',
  conditions: ['test-condition'],
  ...overrides
});

export const createTestUser = (overrides = {}) => ({
  id: 'test-user',
  preferences: {
    systematicLearning: false,
    difficultyLevel: 'intermediate'
  },
  history: [],
  ...overrides
});

export default {
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
  createTestUser,
  mockHooks,
  mockMedicalConditions,
  mockPathogenData,
  mockAntibioticData,
  mockQuizProgress,
  mockBookmarks,
  mockSearchData
};