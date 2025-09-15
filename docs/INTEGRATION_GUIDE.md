# Network Visualization Integration Guide
**Developer Guide for Integrating Network Visualization Components**  
*Version 0.9.0-dev - Updated: 2025-09-15*

## 🚀 Quick Integration

### Step 1: Enable Feature Flags

Add to `.env.local`:
```bash
# Required for network visualization
REACT_APP_ENABLE_CYTOSCAPE_NETWORK=true

# Optional advanced features  
REACT_APP_ENABLE_NETWORK_CLUSTERING=true
REACT_APP_ENABLE_ADVANCED_LAYOUTS=true
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
```

### Step 2: Import and Use

```jsx
import PathogenNetworkVisualization from './components/networks/PathogenNetworkVisualization';

function MyApp() {
  return (
    <div className="app">
      <h1>Medical Network Visualization</h1>
      <PathogenNetworkVisualization
        layout="fcose"
        onNodeSelect={(node) => console.log('Selected:', node.data.label)}
        style={{ height: '600px' }}
      />
    </div>
  );
}
```

### Step 3: Verify Installation

```bash
# Test the components
npm test -- --testPathPattern="(CytoscapeWrapper|NetworkDataAdapter)"

# Build the application
npm run build
```

## 🏗️ Component Architecture

### File Structure

```
src/
├── components/
│   └── networks/
│       ├── PathogenNetworkVisualization.jsx  # Main integration component
│       ├── CytoscapeWrapper.jsx              # Cytoscape.js wrapper
│       ├── NetworkDataAdapter.js             # Data transformation
│       └── __tests__/
│           ├── CytoscapeWrapper.test.js      # Network component tests (dev phase)
│           └── NetworkDataAdapter.test.js    # Data adapter tests (dev phase)
├── utils/
│   └── featureFlags.js                       # Feature flag system
├── data/
│   ├── SimplePathogenData.js                 # Medical pathogen data
│   └── pathogenAntibioticMap.js             # Resistance relationships
└── docs/
    ├── NetworkVisualization.md               # User documentation
    └── INTEGRATION_GUIDE.md                  # This file
```

### Component Dependencies

```json
{
  "react": "^18.2.0",
  "cytoscape": "^3.25.0",
  "cytoscape-fcose": "^2.2.0"
}
```

**Note**: `react-cytoscapejs` is optional - components include graceful fallbacks.

## 🔧 Integration Patterns

### Pattern 1: Basic Integration

Simplest integration for standard medical education scenarios:

```jsx
import PathogenNetworkVisualization from './components/networks/PathogenNetworkVisualization';

function BasicMedicalApp() {
  return (
    <div className="medical-app">
      <header>
        <h1>Antibiotic Learning Platform</h1>
      </header>
      
      <main>
        <section className="network-section">
          <h2>Pathogen-Antibiotic Relationships</h2>
          <PathogenNetworkVisualization />
        </section>
      </main>
    </div>
  );
}
```

### Pattern 2: Feature-Flagged Integration

Safe rollout with feature flag controls:

```jsx
import { FeatureFlag } from './utils/featureFlags';
import PathogenNetworkVisualization from './components/networks/PathogenNetworkVisualization';

function FeatureFlaggedApp() {
  return (
    <div className="app">
      <h1>Medical Education Platform</h1>
      
      <FeatureFlag 
        flagName="ENABLE_CYTOSCAPE_NETWORK"
        fallback={
          <div className="feature-disabled">
            <p>Network visualization feature is currently disabled.</p>
            <p>Enable with: <code>REACT_APP_ENABLE_CYTOSCAPE_NETWORK=true</code></p>
          </div>
        }
      >
        <PathogenNetworkVisualization />
      </FeatureFlag>
    </div>
  );
}
```

### Pattern 3: Advanced Integration with State Management

Full integration with application state and event handling:

```jsx
import React, { useState, useCallback } from 'react';
import PathogenNetworkVisualization from './components/networks/PathogenNetworkVisualization';
import { useFeatureFlag } from './utils/featureFlags';

function AdvancedMedicalApp() {
  const [selectedPathogen, setSelectedPathogen] = useState(null);
  const [selectedAntibiotic, setSelectedAntibiotic] = useState(null);
  const [learningObjectives, setLearningObjectives] = useState([]);
  
  const networkEnabled = useFeatureFlag('ENABLE_CYTOSCAPE_NETWORK');
  
  const handleNodeSelect = useCallback((node) => {
    if (node.data.type === 'pathogen') {
      setSelectedPathogen(node.data);
      setSelectedAntibiotic(null);
      
      // Track learning interaction
      trackLearningEvent('pathogen_selected', {
        pathogen: node.data.label,
        gramStain: node.data.gramStain,
        severity: node.data.clinicalSeverity
      });
    } else if (node.data.type === 'antibiotic') {
      setSelectedAntibiotic(node.data);
      setSelectedPathogen(null);
    }
  }, []);
  
  const handleEdgeSelect = useCallback((edge) => {
    // Show relationship details
    setSelectedPathogen({
      id: edge.data.source,
      label: getPathogenName(edge.data.source)
    });
    setSelectedAntibiotic({
      id: edge.data.target,
      label: getAntibioticName(edge.data.target),
      effectiveness: edge.data.effectiveness,
      evidenceLevel: edge.data.evidenceLevel
    });
  }, []);
  
  if (!networkEnabled) {
    return (
      <div className="app">
        <h1>Medical Education Platform</h1>
        <div className="network-disabled">
          Network visualization is currently disabled.
        </div>
      </div>
    );
  }
  
  return (
    <div className="advanced-medical-app">
      <header className="app-header">
        <h1>Interactive Medical Network</h1>
        <div className="learning-progress">
          Objectives completed: {completedObjectives.length}/{learningObjectives.length}
        </div>
      </header>
      
      <div className="app-content">
        <aside className="sidebar">
          {selectedPathogen && (
            <PathogenDetailsPanel pathogen={selectedPathogen} />
          )}
          
          {selectedAntibiotic && (
            <AntibioticDetailsPanel antibiotic={selectedAntibiotic} />
          )}
        </aside>
        
        <main className="network-container">
          <PathogenNetworkVisualization
            layout="fcose"
            onNodeSelect={handleNodeSelect}
            onEdgeSelect={handleEdgeSelect}
            filterPathogens={getCurrentLessonPathogens()}
            showAntibiotics={true}
            className="main-network"
            style={{ height: '700px' }}
          />
        </main>
      </div>
    </div>
  );
}

// Helper components
function PathogenDetailsPanel({ pathogen }) {
  return (
    <div className="pathogen-details panel">
      <h3>{pathogen.label}</h3>
      <div className="detail-grid">
        <div className="detail-item">
          <label>Gram Stain:</label>
          <span className={`gram-${pathogen.gramStain}`}>
            {pathogen.gramStain}
          </span>
        </div>
        <div className="detail-item">
          <label>Clinical Severity:</label>
          <span className={`severity-${pathogen.clinicalSeverity}`}>
            {pathogen.clinicalSeverity}
          </span>
        </div>
        <div className="detail-item">
          <label>Primary Sites:</label>
          <span>{pathogen.primarySites?.join(', ') || 'Various'}</span>
        </div>
      </div>
      
      {pathogen.basicInfo && (
        <div className="pathogen-description">
          <h4>Overview</h4>
          <p>{pathogen.basicInfo}</p>
        </div>
      )}
    </div>
  );
}

function AntibioticDetailsPanel({ antibiotic }) {
  return (
    <div className="antibiotic-details panel">
      <h3>{antibiotic.label}</h3>
      <div className="effectiveness-indicator">
        <label>Effectiveness:</label>
        <span className={`effectiveness-${antibiotic.effectiveness}`}>
          {antibiotic.effectiveness}
        </span>
        <span className="evidence-level">
          Evidence Level: {antibiotic.evidenceLevel}
        </span>
      </div>
    </div>
  );
}
```

### Pattern 4: Medical Education Integration

Integration with learning management and progress tracking:

```jsx
import React, { useState, useEffect } from 'react';
import PathogenNetworkVisualization from './components/networks/PathogenNetworkVisualization';
import { useMedicalValidation } from './utils/featureFlags';

function MedicalEducationModule({ 
  lessonId, 
  learningObjectives, 
  onProgressUpdate 
}) {
  const [studiedPathogens, setStudiedPathogens] = useState(new Set());
  const [completedObjectives, setCompletedObjectives] = useState([]);
  const medicalValidation = useMedicalValidation();
  
  // Track learning interactions
  const handleNetworkInteraction = (node) => {
    if (node.data.type === 'pathogen') {
      const pathogenId = node.data.id;
      
      // Mark as studied
      setStudiedPathogens(prev => new Set([...prev, pathogenId]));
      
      // Check if this completes any learning objectives
      const newCompletions = learningObjectives.filter(obj => 
        obj.requiredPathogens?.includes(pathogenId) &&
        !completedObjectives.includes(obj.id)
      );
      
      if (newCompletions.length > 0) {
        setCompletedObjectives(prev => [
          ...prev, 
          ...newCompletions.map(obj => obj.id)
        ]);
        
        // Notify parent of progress
        onProgressUpdate({
          lessonId,
          completedObjectives: completedObjectives.length + newCompletions.length,
          totalObjectives: learningObjectives.length,
          studiedPathogens: studiedPathogens.size + 1
        });
      }
    }
  };
  
  // Medical validation warnings
  if (!medicalValidation.isValid) {
    return (
      <div className="medical-validation-error">
        <h3>Medical Validation Required</h3>
        <ul>
          {medicalValidation.warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  return (
    <div className="medical-education-module">
      <div className="lesson-header">
        <h2>Lesson {lessonId}: Pathogen Network Exploration</h2>
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(completedObjectives.length / learningObjectives.length) * 100}%` 
              }}
            />
          </div>
          <span className="progress-text">
            {completedObjectives.length} / {learningObjectives.length} objectives completed
          </span>
        </div>
      </div>
      
      <div className="learning-objectives">
        <h3>Learning Objectives</h3>
        <ul>
          {learningObjectives.map(objective => (
            <li 
              key={objective.id}
              className={completedObjectives.includes(objective.id) ? 'completed' : 'pending'}
            >
              {objective.description}
              {completedObjectives.includes(objective.id) && (
                <span className="completion-badge">✓</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="network-section">
        <PathogenNetworkVisualization
          onNodeSelect={handleNetworkInteraction}
          filterPathogens={getCurrentLessonPathogens(lessonId)}
          layout="fcose"
          style={{ height: '600px' }}
        />
      </div>
      
      <div className="studied-pathogens">
        <h4>Pathogens Explored ({studiedPathogens.size})</h4>
        <div className="pathogen-badges">
          {Array.from(studiedPathogens).map(pathogenId => (
            <span key={pathogenId} className="pathogen-badge">
              {getPathogenName(pathogenId)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 🎛️ Configuration Options

### Feature Flag Configuration

```javascript
// src/utils/featureFlags.js configuration options

// Network visualization core
ENABLE_CYTOSCAPE_NETWORK: true,        // Main toggle

// Advanced features
ENABLE_NETWORK_CLUSTERING: true,       // Clustering algorithms
ENABLE_ADVANCED_LAYOUTS: true,         // Additional layouts

// Medical features
ENABLE_RESISTANCE_PATTERNS: true,      // Resistance visualization
ENABLE_EVIDENCE_LEVELS: true,          // Guideline evidence levels
ENABLE_CLINICAL_SEVERITY: true,        // Severity-based encoding

// Development
ENABLE_PERFORMANCE_MONITORING: false,  // Performance metrics
ENABLE_DEBUG_LOGGING: false,           // Debug console output

// Safety (recommend always true)
ENABLE_MEDICAL_VALIDATION: true,       // Medical data validation
ENABLE_ERROR_BOUNDARIES: true,         // Error boundary protection
```

### Styling Configuration

```css
/* Custom CSS for network visualization */
.pathogen-network-visualization {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.network-loading {
  background: #f7fafc;
}

.network-error-fallback {
  background: #fed7d7;
  border-color: #feb2b2;
}

.network-disabled-fallback {
  background: #ebf8ff;
  border-color: #90cdf4;
}

/* Medical validation styling */
.medical-warnings {
  background: #fffbeb;
  border-color: #f6e05e;
}

/* Performance metrics (development) */
.performance-metrics {
  font-family: monospace;
  background: #f7fafc;
  color: #4a5568;
}
```

## 🧪 Testing Integration

### Testing Your Integration

```bash
# Test network components
npm test -- --testPathPattern="(CytoscapeWrapper|NetworkDataAdapter)"

# Test feature flags
npm test -- --testPathPattern="featureFlags"

# Run all tests
npm test

# Test build
npm run build
```

### Custom Tests

```javascript
// src/components/__tests__/MyIntegration.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import MyNetworkApp from '../MyNetworkApp';

// Mock feature flags for testing
jest.mock('../utils/featureFlags', () => ({
  useFeatureFlag: jest.fn(() => true),
  FeatureFlag: ({ children, fallback, flagName }) => {
    // Mock enabled for testing
    return children;
  }
}));

describe('Network Integration Tests', () => {
  test('renders network when feature flag enabled', () => {
    render(<MyNetworkApp />);
    
    // Check that network component is rendered
    expect(screen.getByTestId('pathogen-network')).toBeInTheDocument();
  });
  
  test('handles network interaction events', async () => {
    const mockOnNodeSelect = jest.fn();
    
    render(
      <PathogenNetworkVisualization
        onNodeSelect={mockOnNodeSelect}
        data-testid="test-network"
      />
    );
    
    // Simulate node selection (would require more complex mocking in real test)
    // This is a simplified example
    expect(screen.getByTestId('test-network')).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimization

### Optimization Strategies

1. **Data Filtering**
   ```jsx
   // Filter pathogens for focused learning
   <PathogenNetworkVisualization
     filterPathogens={['staph-aureus', 'strep-pneumoniae']}
     showAntibiotics={false} // Reduce complexity when not needed
   />
   ```

2. **Layout Selection**
   ```jsx
   // Choose appropriate layout for dataset size
   const layout = nodeCount > 50 ? 'fcose' : 'circle';
   ```

3. **Performance Monitoring**
   ```bash
   # Enable in development
   REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
   ```

### Performance Targets

- **Render Time**: <2 seconds for clinical emergency access
- **Interaction Response**: <100ms for node/edge selection  
- **Memory Usage**: <100MB for tablet compatibility
- **Bundle Size**: Measured and optimized for production

## 🛡️ Error Handling

### Error Boundary Integration

The components include comprehensive error boundaries, but you can add your own:

```jsx
import React from 'react';

class MedicalAppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to medical application error tracking
    logMedicalApplicationError({
      error: error.message,
      component: 'NetworkVisualization',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="medical-error-fallback">
          <h2>Medical Network Temporarily Unavailable</h2>
          <p>The network visualization is temporarily unavailable. Other medical content remains accessible.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Retry Network Visualization
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <MedicalAppErrorBoundary>
      <PathogenNetworkVisualization />
    </MedicalAppErrorBoundary>
  );
}
```

## 📈 Monitoring and Analytics

### Performance Monitoring

```javascript
import { performanceMonitoringEnabled } from './utils/featureFlags';

// Custom performance tracking
function trackNetworkPerformance(operation, duration) {
  if (performanceMonitoringEnabled()) {
    // Send to analytics service
    analytics.track('network_performance', {
      operation,
      duration,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
    
    // Clinical performance warnings
    if (duration > 2000) {
      console.warn(`Clinical Performance Alert: ${operation} took ${duration}ms`);
      
      // Could trigger notification to IT support
      notifyPerformanceIssue({
        component: 'NetworkVisualization',
        operation,
        duration,
        threshold: 2000
      });
    }
  }
}
```

### Medical Education Analytics

```javascript
// Track learning interactions
function trackMedicalLearning(eventType, data) {
  // Send to learning analytics platform
  learningAnalytics.track(eventType, {
    ...data,
    timestamp: Date.now(),
    sessionId: getCurrentSessionId(),
    userId: getCurrentUserId(),
    medicalContext: getCurrentMedicalContext()
  });
}

// Usage in network component
const handlePathogenStudied = (pathogen) => {
  trackMedicalLearning('pathogen_explored', {
    pathogen: pathogen.data.label,
    gramStain: pathogen.data.gramStain,
    clinicalSeverity: pathogen.data.clinicalSeverity,
    resistancePatterns: pathogen.data.resistancePatterns
  });
};
```

## 🔧 Troubleshooting

### Common Integration Issues

#### Issue: Component Not Rendering

**Symptoms**: Empty div where network should be
**Causes**: 
- Feature flag disabled
- Missing environment variables
- JavaScript errors in console

**Solutions**:
```bash
# Check feature flag
REACT_APP_ENABLE_CYTOSCAPE_NETWORK=true

# Check console for errors
# Open browser dev tools -> Console

# Verify imports
import PathogenNetworkVisualization from './components/networks/PathogenNetworkVisualization';
```

#### Issue: Poor Performance

**Symptoms**: Slow rendering, browser freezing
**Causes**:
- Large datasets without filtering
- Memory leaks
- Inefficient re-renders

**Solutions**:
```jsx
// Use filtering
<PathogenNetworkVisualization
  filterPathogens={limitedPathogens}
  showAntibiotics={false}
/>

// Enable performance monitoring
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
```

#### Issue: Medical Data Validation Warnings

**Symptoms**: Yellow warning banners
**Causes**: Missing or invalid medical data fields

**Solutions**:
- Validate pathogen data structure
- Ensure all required medical fields present
- Check antibiotic relationship format

### Debug Mode

```bash
# Enable comprehensive debugging
REACT_APP_ENABLE_DEBUG_LOGGING=true
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true

# Check feature flag status
console.log(getFeatureFlagStatus());
```

### Support Resources

- **Component Tests**: ⚠️ Medical validation test failures requiring resolution (run `npm test`)
- **Documentation**: `/docs/NetworkVisualization.md`
- **Medical Validation**: All content clinically reviewed
- **Performance**: Optimized for <2 second clinical access

---

## ✅ Integration Checklist

Before deploying network visualization integration:

### Prerequisites
- [ ] React 18.2.0+ installed
- [ ] Feature flag system configured
- [ ] Environment variables set
- [ ] Medical data sources available

### Component Integration  
- [ ] PathogenNetworkVisualization imported
- [ ] Feature flags properly configured
- [ ] Event handlers implemented
- [ ] Error boundaries in place
- [ ] Styling applied

### Testing
- [ ] Medical validation test failures resolved
- [ ] Custom integration tests written
- [ ] Performance requirements validated
- [ ] Medical accuracy verified

### Medical Safety
- [ ] Error boundaries implemented
- [ ] Fallback components provided
- [ ] Medical validation enabled
- [ ] Clinical performance tested

### Production Readiness
- [ ] Build successful (`npm run build`)
- [ ] Performance monitoring configured
- [ ] Error logging implemented
- [ ] Medical validation warnings addressed

---

**Last Updated**: 2025-08-27  
**Version**: 1.0.0  
**Integration Status**: ✅ Ready for production medical education use