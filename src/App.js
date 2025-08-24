import React from 'react';

// Import Error Boundary and Context
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider, useAppContext } from './contexts/AppContext';

// Import our core components
import Header from './components/Header';
import HomeTab from './components/HomeTab';
import ConditionsTab from './components/ConditionsTab';
import QuizTab from './components/QuizTab';
import ConditionDetailModal from './components/ConditionDetailModal';
// import LoadingSpinner from './components/LoadingSpinner';

// Import hooks for analytics data
import useQuizProgress from './hooks/useQuizProgress';
import spacedRepetitionManager from './utils/spacedRepetitionManager';

// Import quiz questions data
import quizQuestions from './data/quizQuestions';

// Direct imports to fix chunk loading issues
import ConsolidatedPathogenExplorer from './components/ConsolidatedPathogenExplorer';
import AntibioticExplorer from './components/AntibioticExplorer';
import LearningAnalyticsDashboard from './components/analytics/LearningAnalyticsDashboard';
import VisualizationsTab from './components/VisualizationsTab';

/**
 * AppContent Component
 * Contains the main application logic and uses context for state management
 */
const AppContent = () => {
  // Get all state and data from context
  const {
    activeTab = 'learn',
    setActiveTab,
    selectedCondition,
    setSelectedCondition,
    showMobileMenu,
    setShowMobileMenu,
    isMobile,
    // quizProgress,
    // bookmarks,
    pathogenData,
    antibioticData,
    searchData,
    medicalConditions
  } = useAppContext();

  // Get quiz progress data for analytics
  const { quizHistory } = useQuizProgress();
  
  // Get spaced repetition data for analytics
  const spacedRepetitionData = {
    analytics: spacedRepetitionManager.getAnalytics(),
    weakAreas: spacedRepetitionManager.identifyWeakAreas(),
    cardData: spacedRepetitionManager.cardData
  };

  // const { filteredItems: filteredConditions } = searchData;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Skip navigation link for accessibility */}
        <a 
          href="#main-content" 
          className="skip-link"
          onFocus={(e) => e.target.style.position = 'static'}
          onBlur={(e) => e.target.style.position = 'absolute'}
        >
          Skip to main content
        </a>
        
        {/* Use our Header component */}
        <ErrorBoundary>
          <Header 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobile={isMobile}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
        </ErrorBoundary>

        {/* Main Content */}
        <main id="main-content" className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Render appropriate tab component based on activeTab */}
          {activeTab === 'learn' && (
            <ErrorBoundary>
              <HomeTab setActiveTab={setActiveTab} />
            </ErrorBoundary>
          )}

          {activeTab === 'quiz' && (
            <ErrorBoundary>
              <QuizTab 
                quizQuestions={quizQuestions}
                setActiveTab={setActiveTab}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'analytics' && (
            <ErrorBoundary>
              <LearningAnalyticsDashboard 
                quizHistory={quizHistory || []}
                spacedRepetitionData={spacedRepetitionData}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'reference' && (
            <div className="space-y-6">
              {/* Medical Conditions Reference */}
              <ErrorBoundary>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical Conditions Reference</h2>
                  <ConditionsTab 
                    filteredConditions={searchData.filteredItems}
                    setSelectedCondition={setSelectedCondition}
                    searchTerm={searchData.searchTerm}
                    setSearchTerm={searchData.setSearchTerm}
                  />
                </div>
              </ErrorBoundary>
              
              {/* Consolidated Pathogen & Antibiotic Explorer */}
              <ErrorBoundary>
                <ConsolidatedPathogenExplorer 
                  pathogenData={pathogenData}
                  onSelectCondition={setSelectedCondition}
                />
              </ErrorBoundary>
            </div>
          )}

          {activeTab === 'pathogen-explorer' && (
            <ErrorBoundary>
              <ConsolidatedPathogenExplorer 
                pathogenData={pathogenData}
                onSelectCondition={setSelectedCondition}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'antibiotic-explorer' && (
            <ErrorBoundary>
              <AntibioticExplorer 
                antibioticData={antibioticData}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'visualizations' && (
            <ErrorBoundary>
              <VisualizationsTab 
                pathogenData={pathogenData}
                antibioticData={antibioticData}
                medicalConditions={medicalConditions}
                onSelectCondition={setSelectedCondition}
                onSelectPathogen={(pathogen) => {
                  // Handle pathogen selection if needed
                  console.log('Selected pathogen:', pathogen);
                }}
              />
            </ErrorBoundary>
          )}

          {/* Condition Detail Modal */}
          {selectedCondition && (
            <ErrorBoundary>
              <ConditionDetailModal
                condition={selectedCondition}
                conditions={medicalConditions}
                onClose={() => setSelectedCondition(null)}
              />
            </ErrorBoundary>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

/**
 * Main App Component
 * Wraps the application with the context provider
 */
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;