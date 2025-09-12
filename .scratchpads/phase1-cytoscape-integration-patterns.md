# Phase 1 Cytoscape.js Integration Patterns
**Created**: 2025-09-12 13:18:00  
**Purpose**: Technical implementation guide for visual highlighting functions  
**Verification Reference**: Architecture compliance validation for agent deliverables

---

## 🎨 Visual Highlighting System Architecture

### **CSS Class Hierarchy**
Based on architecture-analyst findings for medical education optimization:

```css
/* Medical Education Network Highlighting Classes */
.cy-container {
  font-family: 'Inter', -apple-system, sans-serif;
  background: #f8fafc; /* Medical application background */
}

/* Primary Selection States */
.selected {
  border-width: 4px !important;
  border-color: #3b82f6 !important; /* Medical blue */
  z-index: 10 !important;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.4) !important;
}

.hovered {
  opacity: 1 !important;
  border-width: 2px !important;
  border-color: #60a5fa !important; /* Lighter medical blue */
  transform: scale(1.05) !important;
  transition: all 0.2s ease !important;
}

/* Medical Coverage Relationship States */
.covered-by-highlighted {
  background-color: #dcfce7 !important; /* Medical green - susceptible */
  border-color: #16a34a !important;
  opacity: 1 !important;
  z-index: 5 !important;
}

.covers-highlighted {
  background-color: #fef3c7 !important; /* Medical amber - intermediate */
  border-color: #d97706 !important;
  opacity: 1 !important;
  z-index: 5 !important;
}

.connected-highlighted {
  opacity: 1 !important;
  border-width: 2px !important;
  border-color: #6b7280 !important; /* Medical gray */
}

/* Visual Emphasis States */
.faded {
  opacity: 0.2 !important;
  z-index: 1 !important;
  filter: grayscale(0.3) !important;
}

.emphasized {
  opacity: 1 !important;
  z-index: 8 !important;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5) !important;
}

/* Medical-Specific Highlighting */
.resistant-highlighted {
  background-color: #fee2e2 !important; /* Medical red - resistant */
  border-color: #dc2626 !important;
  border-width: 3px !important;
}

.sensitive-highlighted {
  background-color: #dcfce7 !important; /* Medical green - sensitive */
  border-color: #16a34a !important;
  border-width: 3px !important;
}

.broad-spectrum-highlighted {
  background-color: #f3e8ff !important; /* Medical purple - broad */
  border-color: #7c3aed !important;
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.3) !important;
}

.narrow-spectrum-highlighted {
  background-color: #fef3c7 !important; /* Medical amber - narrow */
  border-color: #d97706 !important;
}

/* Edge Relationship Highlighting */
edge.coverage-relationship {
  line-color: #16a34a !important; /* Medical green */
  target-arrow-color: #16a34a !important;
  width: 3px !important;
  opacity: 0.8 !important;
  z-index: 3 !important;
}

edge.resistance-relationship {
  line-color: #dc2626 !important; /* Medical red */
  target-arrow-color: #dc2626 !important;
  width: 2px !important;
  line-style: dashed !important;
  opacity: 0.7 !important;
}

edge.intermediate-relationship {
  line-color: #d97706 !important; /* Medical amber */
  target-arrow-color: #d97706 !important;
  width: 2px !important;
  line-style: dotted !important;
  opacity: 0.6 !important;
}
```

---

## 🔧 Performance-Optimized Event Handling

### **Cytoscape.js Event Management Pattern**
Based on medical education workflow requirements:

```javascript
// Medical education optimized event handling
const setupMedicalNetworkEvents = (cy) => {
  // Batch operations for performance during medical education
  const medicalEventHandler = {
    
    // Hover events for quick medical reference
    onHover: (evt) => {
      const node = evt.target;
      const nodeType = node.data('type');
      
      // Medical-specific hover behavior
      if (nodeType === 'antibiotic') {
        showQuickAntibioticInfo(node);
        highlightCoveragePreview(cy, node);
      } else if (nodeType === 'pathogen') {
        showQuickPathogenInfo(node);
        highlightSusceptibilityPreview(cy, node);
      }
    },
    
    // Click events for detailed medical analysis  
    onClick: (evt) => {
      const node = evt.target;
      
      // Clear previous analysis
      clearAllHighlights(cy);
      
      // Medical analysis based on node type
      if (node.data('type') === 'antibiotic') {
        performAntibioticCoverageAnalysis(cy, node);
      } else if (node.data('type') === 'pathogen') {
        performPathogenSusceptibilityAnalysis(cy, node);
      }
    },
    
    // Background click for medical workflow reset
    onBackgroundClick: (evt) => {
      if (evt.target === cy) {
        // Medical education workflow reset
        clearAllHighlights(cy);
        hideMedicalPanels();
        resetEducationMode();
      }
    }
  };
  
  return medicalEventHandler;
};
```

---

## ⚡ Function Implementation Specifications

### **1. clearAllHighlights(cy) - Critical Dependency**

**Medical Education Purpose**: Reset visual state for new learning interactions

```javascript
/**
 * Clears all visual highlighting for medical education workflow
 * @param {Object} cy - Cytoscape instance
 * @returns {void}
 * @medical_safety Critical for preventing visual confusion in medical learning
 */
const clearAllHighlights = (cy) => {
  if (!cy || !cy.elements) {
    console.warn('clearAllHighlights: Invalid Cytoscape instance');
    return;
  }
  
  // Performance-optimized batch operation for medical networks
  cy.batch(() => {
    // Remove all medical highlighting classes
    const MEDICAL_HIGHLIGHT_CLASSES = [
      'selected', 'hovered', 'covered-by-highlighted', 'covers-highlighted',
      'connected-highlighted', 'faded', 'emphasized', 'resistant-highlighted',
      'sensitive-highlighted', 'broad-spectrum-highlighted', 'narrow-spectrum-highlighted'
    ];
    
    // Clear node highlighting
    cy.nodes().removeClass(MEDICAL_HIGHLIGHT_CLASSES.join(' '));
    
    // Clear edge highlighting  
    cy.edges().removeClass('coverage-relationship resistance-relationship intermediate-relationship');
    
    // Reset all custom medical styles
    cy.elements().removeStyle();
    
    // Ensure medical education visibility
    cy.elements().style({
      'opacity': 1,
      'z-index': 'auto'
    });
    
    // Clear medical panels and tooltips
    hideMedicalTooltips();
  });
  
  // Medical workflow logging for educational tracking
  logMedicalInteraction('highlight_cleared', {
    timestamp: Date.now(),
    elements_cleared: cy.elements().length
  });
};
```

### **2. highlightAntibioticCoverage(cy, node, pathogens) - Visual Learning Core**

**Medical Education Purpose**: Visual highlighting of antibiotic spectrum for clinical learning

```javascript
/**
 * Highlights antibiotic coverage relationships for medical education
 * @param {Object} cy - Cytoscape instance
 * @param {Object} antibioticNode - Selected antibiotic node
 * @param {Array} connectedPathogens - Related pathogen nodes
 * @returns {void}
 * @medical_accuracy Validates coverage against clinical data
 */
const highlightAntibioticCoverage = (cy, antibioticNode, connectedPathogens) => {
  if (!cy || !antibioticNode) {
    logMedicalError('highlightAntibioticCoverage: Missing required parameters');
    return;
  }
  
  const antibioticData = antibioticNode.data();
  const antibioticId = antibioticData.id;
  
  // Medical education workflow: batch visual updates
  cy.batch(() => {
    // Clear previous medical highlighting
    clearAllHighlights(cy);
    
    // Highlight selected antibiotic
    antibioticNode.addClass('selected');
    
    // Medical analysis: categorize pathogen coverage
    const coverageAnalysis = {
      susceptible: [],
      intermediate: [], 
      resistant: [],
      uncovered: []
    };
    
    // Analyze coverage for each pathogen (medical accuracy critical)
    connectedPathogens.forEach(pathogenNode => {
      const pathogenData = pathogenNode.data();
      const coverage = analyzeCoverageRelationship(antibioticData, pathogenData);
      
      // Medical education visual feedback
      switch (coverage.susceptibility) {
        case 'SUSCEPTIBLE':
          pathogenNode.addClass('sensitive-highlighted');
          coverageAnalysis.susceptible.push(pathogenNode);
          break;
        case 'INTERMEDIATE':  
          pathogenNode.addClass('covers-highlighted');
          coverageAnalysis.intermediate.push(pathogenNode);
          break;
        case 'RESISTANT':
          pathogenNode.addClass('resistant-highlighted'); 
          coverageAnalysis.resistant.push(pathogenNode);
          break;
        default:
          pathogenNode.addClass('faded');
          coverageAnalysis.uncovered.push(pathogenNode);
      }
    });
    
    // Highlight medical coverage relationships  
    const coverageEdges = antibioticNode.connectedEdges().filter(edge => {
      return coverageAnalysis.susceptible.includes(edge.target()) ||
             coverageAnalysis.intermediate.includes(edge.target());
    });
    coverageEdges.addClass('coverage-relationship');
    
    // Highlight resistance relationships
    const resistanceEdges = antibioticNode.connectedEdges().filter(edge => {
      return coverageAnalysis.resistant.includes(edge.target());  
    });
    resistanceEdges.addClass('resistance-relationship');
    
    // Fade irrelevant medical elements
    const irrelevantElements = cy.elements().difference(
      antibioticNode
        .union(cy.collection(coverageAnalysis.susceptible))
        .union(cy.collection(coverageAnalysis.intermediate))
        .union(cy.collection(coverageAnalysis.resistant))
        .union(coverageEdges)
        .union(resistanceEdges)
    );
    irrelevantElements.addClass('faded');
  });
  
  // Medical education tracking
  logMedicalInteraction('antibiotic_coverage_highlighted', {
    antibiotic: antibioticId,
    coverage_summary: {
      susceptible: coverageAnalysis.susceptible.length,
      intermediate: coverageAnalysis.intermediate.length,
      resistant: coverageAnalysis.resistant.length
    },
    timestamp: Date.now()
  });
  
  // Update medical education panel
  updateCoverageMedicalPanel(antibioticData, coverageAnalysis);
};
```

---

## 🏥 Medical Education Integration Points

### **React Component Integration**
```javascript
// Medical education component lifecycle integration
useEffect(() => {
  if (!cytoscapeRef.current) return;
  
  const cy = cytoscapeRef.current.getCytoscape();
  if (!cy) return;
  
  // Medical education event setup
  setupMedicalEducationEvents(cy);
  setupMedicalKeyboardShortcuts(cy);
  setupMedicalAccessibility(cy);
  
  // Medical workflow cleanup
  return () => {
    clearMedicalEventHandlers(cy);
    hideMedicalPanels();
  };
}, [cytoscapeRef.current, educationMode]);
```

### **Medical State Management Integration**  
```javascript
// Medical education state synchronization
const [medicalAnalysisState, setMedicalAnalysisState] = useState({
  selectedAntibiotic: null,
  highlightedCoverage: new Set(),
  educationMode: 'coverage', // coverage, resistance, spectrum
  clinicalContext: null,
  learnerLevel: 'resident' // student, resident, attending
});
```

---

## 📋 Verification Protocol for Cytoscape Integration

### **Technical Validation Checklist**
- [ ] All CSS classes properly defined and medical-color compliant
- [ ] Event handlers properly bound and cleaned up
- [ ] Performance batching implemented for medical network sizes
- [ ] Error handling for invalid Cytoscape instances
- [ ] Medical education accessibility features implemented

### **Medical Education Validation**
- [ ] Visual highlighting supports clinical learning objectives
- [ ] Color coding follows medical education standards
- [ ] Interactive elements enhance medical comprehension
- [ ] Performance suitable for clinical environment (<1 second response)

### **Integration Testing**
- [ ] Functions integrate properly with existing React component
- [ ] State management maintains medical data consistency
- [ ] Event cleanup prevents medical data contamination
- [ ] Error handling maintains medical application stability

---

**Verification**: All Cytoscape.js implementations must pass the technical and medical validation checklist defined in this document before agent work can be considered complete.