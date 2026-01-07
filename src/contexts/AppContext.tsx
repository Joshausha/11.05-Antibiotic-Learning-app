import React, { createContext, useContext, useState, FC, ReactNode } from 'react';
import { AppContextValue, AppProviderProps, TabType, MedicalCondition, SearchData, PathogenDataType, AntibioticDataType, QuizProgressType, BookmarksType } from '../types/app.types';
import useResponsive from '../hooks/useResponsive';
import useSearch from '../hooks/useSearch';
import useQuizProgress from '../hooks/useQuizProgress';
import useBookmarks from '../hooks/useBookmarks';
import usePathogenData from '../hooks/usePathogenData';
import useAntibioticData from '../hooks/useAntibioticData';
import useErrorHandler from '../hooks/useErrorHandler';
import medicalConditions from '../data/medicalConditions';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * AppContext - Centralized application state management
 * Reduces prop drilling by providing app-wide state through Context API
 */
const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * AppProvider Component
 * Provides application state and data to all child components
 */
export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  // Core app state
  const [activeTab, setActiveTab] = useState<TabType>('hub');
  const [selectedCondition, setSelectedCondition] = useState<MedicalCondition | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  // Initialize error handler - Agent T4: Defensive programming with null safety
  const errorHandler = useErrorHandler() || {};
  const { fallbacks = {} } = errorHandler;

  // Initialize all hooks directly (React hook rules require direct calls)
  const isMobile = useResponsive();
  const quizProgress = useQuizProgress();
  const bookmarks = useBookmarks();
  const pathogenData = usePathogenData(medicalConditions);
  const antibioticData = useAntibioticData(medicalConditions);

  // Search functionality for conditions
  const searchFields = ['name', 'category', 'commonPathogens', 'description'];
  const searchData = useSearch(medicalConditions, searchFields);

  // Context value object
  const contextValue: AppContextValue = {
    // Core state
    activeTab,
    setActiveTab,
    selectedCondition,
    setSelectedCondition,
    showMobileMenu,
    setShowMobileMenu,

    // Device state
    isMobile,

    // Data and functionality
    quizProgress,
    bookmarks,
    pathogenData,
    antibioticData,
    searchData,

    // Static data
    medicalConditions,
  };

  return (
    <ErrorBoundary>
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    </ErrorBoundary>
  );
};

/**
 * useAppContext Hook
 * Custom hook to access the application context
 * Provides easy access to app state and functions
 * Enhanced with Agent T4 defensive programming patterns
 */
export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  // Agent T4: Defensive programming - ensure required properties exist
  const {
    activeTab = 'hub',
    setActiveTab,
    selectedCondition = null,
    setSelectedCondition,
    showMobileMenu = false,
    setShowMobileMenu,
    isMobile = false,
    quizProgress = {},
    bookmarks = {},
    pathogenData = { pathogens: [], infections: [] },
    antibioticData = { antibiotics: [], interactions: [] },
    searchData = { filteredItems: [], searchTerm: '', setSearchTerm: () => {} },
    medicalConditions = []
  } = context;

  return {
    activeTab,
    setActiveTab,
    selectedCondition,
    setSelectedCondition,
    showMobileMenu,
    setShowMobileMenu,
    isMobile,
    quizProgress,
    bookmarks,
    pathogenData,
    antibioticData,
    searchData,
    medicalConditions
  };
};

export default AppContext;
