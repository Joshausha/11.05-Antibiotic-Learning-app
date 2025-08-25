# Agent Theta-1 Scratchpad - Tree Node Components
**Start Time**: Monday 9:00 AM  
**End Time**: Monday 12:00 PM  
**Dependencies**: None (can start immediately)  
**Track**: Core Infrastructure  
**Agent Series**: Clinical Decision Visualization Specialists

## 🎯 Objective
Build reusable, interactive tree node components (DecisionNode, ActionNode, OutcomeNode) with medical-grade styling, accessibility compliance, and Northwestern animations integration.

## 📋 Deliverables Checklist
- [ ] **DecisionNode Component**: Interactive decision point with clinical question display
- [ ] **ActionNode Component**: Clinical action recommendations with rationale
- [ ] **OutcomeNode Component**: Treatment outcome with antibiotic details
- [ ] **Tailwind Styling**: Medical-professional visual design
- [ ] **Hover States**: Smooth Northwestern animation transitions
- [ ] **Click Handlers**: Event delegation for tree navigation
- [ ] **Accessibility**: WCAG 2.1 compliance with ARIA labels
- [ ] **Responsive Design**: Mobile-optimized for clinical devices
- [ ] **Performance**: React.memo optimization for large trees

## 🔧 Technical Implementation

### DecisionNode Component
```javascript
import React, { memo, useState } from 'react';
import { ChevronRight, HelpCircle } from 'lucide-react';

const DecisionNode = memo(({ 
  node, 
  onOptionSelect, 
  isActive = false,
  animationDelay = 0 
}) => {
  const [hoveredOption, setHoveredOption] = useState(null);
  
  return (
    <div 
      className={`
        decision-node bg-blue-50 border-2 border-blue-300 rounded-lg p-4
        transition-all duration-300 hover:shadow-lg
        ${isActive ? 'ring-2 ring-blue-500 bg-blue-100' : ''}
      `}
      role="button"
      aria-label={`Clinical decision: ${node.question}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Decision question header */}
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="text-blue-600 w-5 h-5" />
        <h3 className="text-lg font-semibold text-blue-900">
          {node.question}
        </h3>
      </div>
      
      {/* Clinical context */}
      {node.clinicalGuidance && (
        <p className="text-sm text-gray-600 mb-4 italic">
          {node.clinicalGuidance}
        </p>
      )}
      
      {/* Decision options */}
      <div className="space-y-2">
        {node.options.map((option, index) => (
          <button
            key={option.value}
            className={`
              w-full p-3 text-left rounded border transition-all duration-200
              hover:bg-blue-100 hover:border-blue-400
              ${hoveredOption === index ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'}
            `}
            onClick={() => onOptionSelect(option)}
            onMouseEnter={() => setHoveredOption(index)}
            onMouseLeave={() => setHoveredOption(null)}
            aria-label={`Option: ${option.label}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            {option.clinicalNotes && (
              <p className="text-xs text-gray-500 mt-1">
                {option.clinicalNotes}
              </p>
            )}
          </button>
        ))}
      </div>
      
      {/* Evidence level indicator */}
      {node.medicalContext?.evidenceLevel && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
            Evidence: {node.medicalContext.evidenceLevel}
          </span>
        </div>
      )}
    </div>
  );
});

DecisionNode.displayName = 'DecisionNode';
export default DecisionNode;
```

### ActionNode Component
```javascript
import React, { memo } from 'react';
import { Activity, Clock, AlertTriangle } from 'lucide-react';

const ActionNode = memo(({ 
  node, 
  onActionComplete, 
  isActive = false,
  animationDelay = 0 
}) => {
  return (
    <div 
      className={`
        action-node bg-amber-50 border-2 border-amber-300 rounded-lg p-4
        transition-all duration-300 hover:shadow-lg
        ${isActive ? 'ring-2 ring-amber-500 bg-amber-100' : ''}
      `}
      role="button"
      aria-label={`Clinical action: ${node.action}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Action header */}
      <div className="flex items-center gap-2 mb-3">
        <Activity className="text-amber-600 w-5 h-5" />
        <h3 className="text-lg font-semibold text-amber-900">
          {node.action}
        </h3>
      </div>
      
      {/* Rationale */}
      <p className="text-gray-700 mb-3">
        {node.rationale}
      </p>
      
      {/* Timeframe */}
      {node.timeframe && (
        <div className="flex items-center gap-2 mb-3">
          <Clock className="text-gray-500 w-4 h-4" />
          <span className="text-sm text-gray-600">
            Timeframe: {node.timeframe}
          </span>
        </div>
      )}
      
      {/* Critical notes */}
      {node.criticalNotes && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-red-500 w-4 h-4 mt-0.5" />
            <p className="text-sm text-red-700">
              <strong>Important:</strong> {node.criticalNotes}
            </p>
          </div>
        </div>
      )}
      
      {/* Action button */}
      <button
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded transition-colors duration-200"
        onClick={() => onActionComplete(node)}
        aria-label={`Complete action: ${node.action}`}
      >
        Continue
      </button>
    </div>
  );
});

ActionNode.displayName = 'ActionNode';
export default ActionNode;
```

### OutcomeNode Component
```javascript
import React, { memo, useState } from 'react';
import { CheckCircle, Pill, Clock, AlertCircle, Info } from 'lucide-react';

const OutcomeNode = memo(({ 
  node, 
  onOutcomeSelect, 
  isActive = false,
  animationDelay = 0 
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  return (
    <div 
      className={`
        outcome-node bg-green-50 border-2 border-green-300 rounded-lg p-4
        transition-all duration-300 hover:shadow-lg
        ${isActive ? 'ring-2 ring-green-500 bg-green-100' : ''}
      `}
      role="region"
      aria-label={`Treatment outcome: ${node.treatment?.antibiotic}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Outcome header */}
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="text-green-600 w-5 h-5" />
        <h3 className="text-lg font-semibold text-green-900">
          Recommended Treatment
        </h3>
      </div>
      
      {/* Primary treatment recommendation */}
      <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Pill className="text-green-600 w-5 h-5 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">
              {node.treatment.antibiotic}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Dosing:</span>
                <p className="text-gray-600">{node.treatment.dose}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-600">{node.treatment.duration}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Route:</span>
                <p className="text-gray-600">{node.treatment.route}</p>
              </div>
              
              {node.treatment.monitoring?.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Monitoring:</span>
                  <ul className="text-gray-600 list-disc list-inside">
                    {node.treatment.monitoring.map((item, index) => (
                      <li key={index} className="text-xs">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Red flags warning */}
      {node.redFlags?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-red-500 w-4 h-4 mt-0.5" />
            <div>
              <h5 className="font-medium text-red-800 mb-1">Warning Signs</h5>
              <ul className="text-sm text-red-700 list-disc list-inside">
                {node.redFlags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Alternatives toggle */}
      {node.alternatives?.length > 0 && (
        <div className="mb-4">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => setShowAlternatives(!showAlternatives)}
            aria-expanded={showAlternatives}
          >
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">
              Alternative Treatments ({node.alternatives.length})
            </span>
          </button>
          
          {showAlternatives && (
            <div className="mt-2 space-y-2">
              {node.alternatives.map((alt, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h6 className="font-medium text-blue-900">{alt.antibiotic}</h6>
                  <p className="text-sm text-blue-700">{alt.indication}</p>
                  <p className="text-xs text-blue-600">{alt.dosing}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200"
          onClick={() => onOutcomeSelect(node)}
        >
          Accept Treatment
        </button>
        
        {node.alternatives?.length > 0 && (
          <button
            className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors duration-200"
            onClick={() => setShowAlternatives(true)}
          >
            Alternatives
          </button>
        )}
      </div>
      
      {/* Follow-up information */}
      {node.followUp && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-gray-500 w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Follow-up</span>
          </div>
          <p className="text-sm text-gray-600">{node.followUp.instructions}</p>
          {node.followUp.timeframe && (
            <p className="text-xs text-gray-500 mt-1">
              Timeframe: {node.followUp.timeframe}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

OutcomeNode.displayName = 'OutcomeNode';
export default OutcomeNode;
```

## 🎨 Styling System

### Color-Coded Node Types
```css
/* Decision nodes - Blue theme for questions */
.decision-node {
  --primary: #3B82F6;
  --bg: #EFF6FF;
  --border: #93C5FD;
}

/* Action nodes - Amber theme for clinical actions */
.action-node {
  --primary: #F59E0B;
  --bg: #FFFBEB;
  --border: #FCD34D;
}

/* Outcome nodes - Green theme for treatments */
.outcome-node {
  --primary: #10B981;
  --bg: #ECFDF5;
  --border: #86EFAC;
}
```

### Northwestern Animation Integration
```javascript
// Northwestern-style transitions
const nodeAnimations = {
  entry: 'animate-fadeInUp',
  hover: 'transition-all duration-300 hover:scale-105',
  selection: 'animate-pulse duration-500',
  exit: 'animate-fadeOutDown'
};
```

## 📱 Responsive Design

### Mobile Clinical Optimization
```javascript
// Responsive breakpoints for clinical devices
const responsiveClasses = {
  base: 'w-full max-w-md mx-auto',      // Mobile phones
  sm: 'sm:max-w-lg',                    // Small tablets
  md: 'md:max-w-2xl',                   // Tablets
  lg: 'lg:max-w-4xl'                    // Desktop clinical workstations
};
```

### Touch Target Sizing
- **Minimum**: 44px touch targets for clinical accuracy
- **Optimal**: 48px for fat finger tolerance
- **Spacing**: 8px minimum between interactive elements

## ♿ Accessibility Implementation

### WCAG 2.1 Compliance
```javascript
// Accessibility attributes
const accessibilityProps = {
  role: 'button',
  'aria-label': 'Descriptive action text',
  'aria-expanded': showDetails,
  'aria-describedby': 'clinical-context-id',
  tabIndex: 0,
  onKeyDown: handleKeyboardNav
};
```

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy (h3, h4, h5)
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Focus Management**: Logical tab order through decision tree
- **Live Regions**: Announce dynamic content changes

## 🧪 Testing Strategy

### Component Testing
```javascript
describe('Tree Node Components', () => {
  describe('DecisionNode', () => {
    test('renders clinical question correctly', () => {});
    test('displays all decision options', () => {});
    test('handles option selection', () => {});
    test('shows evidence level indicator', () => {});
  });
  
  describe('ActionNode', () => {
    test('displays clinical action with rationale', () => {});
    test('shows critical notes prominently', () => {});
    test('handles action completion', () => {});
  });
  
  describe('OutcomeNode', () => {
    test('displays treatment recommendation', () => {});
    test('shows dosing and duration correctly', () => {});
    test('toggles alternative treatments', () => {});
    test('displays red flag warnings', () => {});
  });
});
```

### Accessibility Testing
```javascript
describe('Node Accessibility', () => {
  test('all nodes have proper ARIA labels', () => {});
  test('keyboard navigation works correctly', () => {});
  test('screen reader announces content changes', () => {});
  test('focus management maintains logical order', () => {});
});
```

## 📋 Implementation Timeline

### 9:00 AM - 9:45 AM: DecisionNode
- [ ] Create DecisionNode component structure
- [ ] Implement clinical question display
- [ ] Add option selection handling
- [ ] Style with medical theme

### 9:45 AM - 10:30 AM: ActionNode
- [ ] Create ActionNode component
- [ ] Add clinical action display
- [ ] Implement critical notes system
- [ ] Add timeframe indicators

### 10:30 AM - 11:15 AM: OutcomeNode
- [ ] Create OutcomeNode component
- [ ] Implement treatment display
- [ ] Add alternatives toggle
- [ ] Include warning systems

### 11:15 AM - 12:00 PM: Integration & Testing
- [ ] Add accessibility features
- [ ] Implement responsive design
- [ ] Write component tests
- [ ] Document component APIs

## 🔗 Integration Points

### With Zeta-1 (Core Visualization)
- **Event Handlers**: Provide onClick, onHover, onKeyDown handlers
- **Animation Hooks**: Ready for Northwestern animation integration
- **State Management**: Compatible with tree state management

### With Eta-1 (Data Model)
- **Node Schema**: Designed to consume Eta-1 data structures
- **Medical Context**: Displays evidence levels and clinical guidance
- **Validation**: Works with medical validation functions

## 📈 Success Criteria

### By Monday 12:00 PM
- [ ] **Three Components**: DecisionNode, ActionNode, OutcomeNode fully functional
- [ ] **Styling Complete**: Medical-professional visual design implemented
- [ ] **Interactions**: Click, hover, keyboard navigation working
- [ ] **Accessibility**: WCAG 2.1 compliance achieved
- [ ] **Responsive**: Mobile-optimized for clinical devices
- [ ] **Performance**: React.memo optimization implemented
- [ ] **Tests**: Component tests passing
- [ ] **Documentation**: Component APIs documented

### Quality Gates
- **Visual Design**: Professional medical interface standards
- **Performance**: <50ms render time per node
- **Accessibility**: 100% keyboard navigable
- **Medical Safety**: No hardcoded clinical recommendations

---

**Agent**: Theta-1 (Tree Node Components)  
**Status**: Ready for immediate execution  
**Focus**: Medical-grade UI components with clinical workflow optimization  
**Performance Target**: <50ms render time with Northwestern animations