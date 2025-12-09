import React, { lazy, Suspense } from 'react';

// Import Error Boundary and Context
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider, useAppContext } from './contexts/AppContext';

// Import our core components (always loaded)
import Header from './components/Header';
import HomeTab from './components/HomeTab';
import ConditionsTab from './components/ConditionsTab';
import ConditionDetailModal from './components/ConditionDetailModal';
import SkeletonLoader from './components/SkeletonLoader';

// Import hooks for analytics data
import useQuizProgress from './hooks/useQuizProgress';
import spacedRepetitionManager from './utils/spacedRepetitionManager';

// Import quiz questions data
import quizQuestions from './data/quizQuestions';

// Lazy-loaded components for code splitting (loaded on-demand)
const QuizTab = lazy(() => import('./components/QuizTab'));
const ConsolidatedPathogenExplorer = lazy(() => import('./components/ConsolidatedPathogenExplorer'));
const AntibioticExplorer = lazy(() => import('./components/AntibioticExplorer'));
const LearningAnalyticsDashboard = lazy(() => import('./components/analytics/LearningAnalyticsDashboard'));
const VisualizationsTab = lazy(() => import('./components/VisualizationsTab'));

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
              <Suspense fallback={<SkeletonLoader type="quiz" />}>
                <QuizTab
                  quizQuestions={quizQuestions}
                  setActiveTab={setActiveTab}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {activeTab === 'analytics' && (
            <ErrorBoundary>
              <Suspense fallback={<SkeletonLoader type="content" lines={5} />}>
                <LearningAnalyticsDashboard
                  quizHistory={quizHistory || []}
                  spacedRepetitionData={spacedRepetitionData}
                />
              </Suspense>
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
                <Suspense fallback={<SkeletonLoader type="list" />}>
                  <ConsolidatedPathogenExplorer
                    pathogenData={pathogenData}
                    onSelectCondition={setSelectedCondition}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}

          {activeTab === 'pathogen-explorer' && (
            <ErrorBoundary>
              <Suspense fallback={<SkeletonLoader type="list" />}>
                <ConsolidatedPathogenExplorer
                  pathogenData={pathogenData}
                  onSelectCondition={setSelectedCondition}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {activeTab === 'antibiotic-explorer' && (
            <ErrorBoundary>
              <Suspense fallback={<SkeletonLoader type="list" />}>
                <AntibioticExplorer
                  antibioticData={antibioticData}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {activeTab === 'visualizations' && (
            <ErrorBoundary>
              <Suspense fallback={<SkeletonLoader type="content" lines={8} />}>
                <VisualizationsTab
                  pathogenData={pathogenData}
                  antibioticData={antibioticData}
                  medicalConditions={medicalConditions}
                  onSelectCondition={setSelectedCondition}
                  onSelectPathogen={(pathogen) => {
                    // Handle pathogen selection if needed
                  }}
                />
              </Suspense>
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