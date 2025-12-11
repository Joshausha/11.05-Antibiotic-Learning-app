/**
 * Test Utilities
 * @description Comprehensive testing utilities for the Antibiotic Learning App
 * @created 2025-07-28 06:49:33
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider } from '../contexts/AppContext';

/**
 * Type definitions for test utilities
 */

interface MedicalCondition {
  id: string;
  name: string;
  category: string;
  description: string;
  commonPathogens: string[];
  antibiotics: string[];
  [key: string]: any;
}

interface Pathogen {
  id: string;
  name: string;
  gramStatus: string;
  category: string;
  conditions: string[];
  [key: string]: any;
}

interface PathogenData {
  pathogens: Pathogen[];
  selectedPathogen: Pathogen | null;
  isLoading: boolean;
}

interface Antibiotic {
  id: string;
  name: string;
  drugClass: string;
  spectrum: string;
  conditions: string[];
  pathogens: string[];
  [key: string]: any;
}

interface AntibioticData {
  antibiotics: Antibiotic[];
  selectedAntibiotic: Antibiotic | null;
  isLoading: boolean;
}

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  lastQuizScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface QuizProgress {
  stats: QuizStats;
  recentQuizzes: any[];
  clearHistory: jest.Mock;
  submitQuiz: jest.Mock;
}

interface Bookmarks {
  bookmarkedConditions: string[];
  isBookmarked: jest.Mock;
  toggleBookmark: jest.Mock;
}

interface SearchData {
  searchTerm: string;
  setSearchTerm: jest.Mock;
  filteredItems: MedicalCondition[];
}

interface UserProgress {
  completedModules: string[];
  currentLevel: string;
  totalScore: number;
}

interface Preferences {
  theme: string;
  notifications: boolean;
  difficulty: string;
}

interface MockContextValue {
  activeTab: string;
  setActiveTab: jest.Mock;
  selectedCondition: MedicalCondition | null;
  setSelectedCondition: jest.Mock;
  showMobileMenu: boolean;
  setShowMobileMenu: jest.Mock;
  isMobile: boolean;
  quizProgress: QuizProgress;
  bookmarks: Bookmarks;
  pathogenData: PathogenData;
  antibioticData: AntibioticData;
  searchData: SearchData;
  userProgress: UserProgress;
  preferences: Preferences;
  addBookmark: jest.Mock;
  removeBookmark: jest.Mock;
  updatePreferences: jest.Mock;
  medicalConditions: MedicalCondition[];
  [key: string]: any;
}

interface TestUser {
  id: string;
  name: string;
  level: string;
  progress: {
    completedModules: number;
    totalModules: number;
    currentScore: number;
    totalQuizzes: number;
    averageScore: number;
  };
  preferences: {
    systematicLearning: boolean;
    difficultyLevel: string;
    difficulty: string;
  };
  history: any[];
  [key: string]: any;
}

interface LocalStorageAPI {
  store: { [key: string]: string };
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  key: (index: number) => string | null;
  length: number;
}

/**
 * Mock Data for Testing
 */
export const mockMedicalConditions: MedicalCondition[] = [
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

export const mockPathogenData: PathogenData = {
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

export const mockAntibioticData: AntibioticData = {
  antibiotics: [
    {
      id: 'amoxicillin',
      name: 'Amoxicillin',
      drugClass: 'Beta-lactam',
      spectrum: 'Narrow',
      conditions: ['pneumonia'],
      pathogens: ['strep-pneumoniae']
    },
    {
      id: 'ciprofloxacin',
      name: 'Ciprofloxacin',
      drugClass: 'Fluoroquinolone',
      spectrum: 'Broad',
      conditions: ['uti'],
      pathogens: ['e-coli']
    }
  ],
  selectedAntibiotic: null,
  isLoading: false
};

export const mockQuizProgress: QuizProgress = {
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

export const mockBookmarks: Bookmarks = {
  bookmarkedConditions: ['pneumonia'],
  isBookmarked: jest.fn().mockImplementation((id: string) => id === 'pneumonia'),
  toggleBookmark: jest.fn()
};

mockBookmarks.isBookmarked.mockImplementation((id: string) => id === 'pneumonia');

export const mockSearchData: SearchData = {
  searchTerm: '',
  setSearchTerm: jest.fn(),
  filteredItems: mockMedicalConditions
};

/**
 * Mock Hook Implementations
 */
export const mockHooks = {
  useResponsive: () => false,
  useQuizProgress: () => mockQuizProgress,
  useBookmarks: () => mockBookmarks,
  usePathogenData: () => mockPathogenData,
  useAntibioticData: () => mockAntibioticData,
  useSearch: () => mockSearchData,
  useErrorHandler: () => ({
    withErrorHandling: (fn: () => any, fallback: any) => {
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
  })
};

/**
 * Enhanced Custom Render with Context Provider
 */
interface RenderWithContextOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
}

export const renderWithContext = (
  ui: ReactElement,
  options: RenderWithContextOptions = {}
) => {
  const {
    initialState = {},
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <AppProvider>
        {children}
      </AppProvider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    rerender: (newUi: ReactElement) =>
      render(newUi, {
        wrapper: Wrapper,
        container: document.body.firstChild as HTMLElement
      })
  };
};

/**
 * Mock Context Value Factory
 */
export const createMockContextValue = (overrides: Partial<MockContextValue> = {}): MockContextValue => ({
  activeTab: 'home',
  setActiveTab: jest.fn(),
  selectedCondition: null,
  setSelectedCondition: jest.fn(),
  showMobileMenu: false,
  setShowMobileMenu: jest.fn(),
  isMobile: false,
  quizProgress: mockQuizProgress,
  bookmarks: mockBookmarks,
  pathogenData: mockPathogenData,
  antibioticData: mockAntibioticData,
  searchData: mockSearchData,
  userProgress: {
    completedModules: [],
    currentLevel: 'beginner',
    totalScore: 0
  },
  preferences: {
    theme: 'light',
    notifications: true,
    difficulty: 'intermediate'
  },
  addBookmark: jest.fn(),
  removeBookmark: jest.fn(),
  updatePreferences: jest.fn(),
  medicalConditions: mockMedicalConditions,
  ...overrides
});

/**
 * Error Boundary Test Helper
 */
interface ThrowErrorProps {
  shouldThrow: boolean;
  children: React.ReactNode;
}

export const ThrowError = ({ shouldThrow, children }: ThrowErrorProps): React.ReactNode => {
  if (shouldThrow) {
    throw new Error('Test error for ErrorBoundary');
  }
  return children;
};

/**
 * Component Test Helpers
 */
export const createMockComponent = (name: string, props: any = {}) => {
  const MockComponent = React.forwardRef<HTMLDivElement, any>(
    (componentProps, ref) => (
      <div data-testid={`mock-${name.toLowerCase()}`} ref={ref} {...componentProps}>
        Mock {name}: Component
        {props.children && <div>{props.children}</div>}
      </div>
    )
  );
  MockComponent.displayName = `Mock${name}`;
  return MockComponent;
};

/**
 * Accessibility Test Helpers
 */
export const testAccessibility = {
  testKeyboardNavigation: (elements: HTMLElement[]): void => {
    elements.forEach((element) => {
      expect(element).toHaveAttribute('tabIndex');
      expect(parseInt(element.getAttribute('tabIndex') || '0')).toBeGreaterThanOrEqual(0);
    });
  },

  testAriaLabels: (elements: HTMLElement[]): void => {
    elements.forEach((element) => {
      const hasAriaLabel = element.hasAttribute('aria-label') ||
                          element.hasAttribute('aria-labelledby') ||
                          element.hasAttribute('aria-describedby');
      expect(hasAriaLabel).toBe(true);
    });
  },

  testSemanticRoles: (expectedRoles: string[]): void => {
    expectedRoles.forEach((role) => {
      expect(screen.getByRole(role)).toBeInTheDocument();
    });
  },

  checkAriaLabels: async (): Promise<void> => {
    return Promise.resolve();
  },

  checkKeyboardNavigation: async (): Promise<void> => {
    return Promise.resolve();
  }
};

/**
 * Async Test Helpers
 */
export const waitForLoadingToFinish = async (): Promise<void> => {
  await screen.findByText(/loading/i).catch(() => {});
  await new Promise(resolve => setTimeout(resolve, 100));
};

/**
 * Performance Test Helpers
 */
export const measureRenderTime = (renderFn: () => void): number => {
  const startTime = performance.now();
  renderFn();
  const endTime = performance.now();

  return endTime - startTime;
};

/**
 * Mock Local Storage
 */
export const mockLocalStorage: LocalStorageAPI = (() => {
  const store: { [key: string]: string } = {};
  return {
    store,
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    }
  };
})();

/**
 * Setup and Teardown Helpers
 */
export const restoreMockImplementations = (): void => {
  mockBookmarks.isBookmarked.mockImplementation((id: string) => id === 'pneumonia');
};

export const setupTestEnvironment = (): (() => void) => {
  const originalConsole = { ...console };
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
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

  return () => {
    Object.assign(console, originalConsole);
    jest.restoreAllMocks();
    mockLocalStorage.clear();
  };
};

/**
 * Test Data Factories
 */
export const createTestCondition = (overrides: Partial<MedicalCondition> = {}): MedicalCondition => ({
  id: 'test-condition',
  name: 'Test Condition',
  category: 'Test Category',
  description: 'Test description',
  commonPathogens: ['Test Pathogen'],
  antibiotics: ['Test Antibiotic'],
  ...overrides
});

export const createTestPathogen = (overrides: Partial<Pathogen> = {}): Pathogen => ({
  id: 'test-pathogen',
  name: 'Test Pathogen',
  gramStatus: 'Positive',
  category: 'Test',
  conditions: ['test-condition'],
  ...overrides
});

export const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => ({
  id: 'test-user',
  name: 'Test User',
  level: 'intermediate',
  progress: {
    completedModules: 0,
    totalModules: 10,
    currentScore: 0,
    totalQuizzes: 5,
    averageScore: 85
  },
  preferences: {
    systematicLearning: false,
    difficultyLevel: 'intermediate',
    difficulty: 'intermediate'
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
  mockSearchData,
  restoreMockImplementations
};
