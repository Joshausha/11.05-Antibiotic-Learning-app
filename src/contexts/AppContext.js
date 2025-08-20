import React, { createContext, useContext, useState } from 'react';
import useResponsive from '../hooks/useResponsive';
import useSearch from '../hooks/useSearch';
import useQuizProgress from '../hooks/useQuizProgress';
import useBookmarks from '../hooks/useBookmarks';
import usePathogenData from '../hooks/usePathogenData';
import useAntibioticData from '../hooks/useAntibioticData';
import useErrorHandler from '../hooks/useErrorHandler';
import medicalConditions from '../data/medicalConditions';

/**
 * AppContext - Centralized application state management
 * Reduces prop drilling by providing app-wide state through Context API
 */
const AppContext = createContext();

/**
 * AppProvider Component
 * Provides application state and data to all child components
 */
export const AppProvider = ({ children }) => {
  // Core app state
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Initialize error handler
  const { fallbacks } = useErrorHandler();

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
  const contextValue = {
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
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * useAppContext Hook
 * Custom hook to access the application context
 * Provides easy access to app state and functions
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;