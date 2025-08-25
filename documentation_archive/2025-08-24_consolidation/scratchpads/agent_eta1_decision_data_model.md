# Agent Eta-1 Scratchpad - Clinical Decision Data Model
**Start Time**: Monday 9:00 AM  
**End Time**: Monday 12:00 PM  
**Dependencies**: None (can start immediately)  
**Track**: Medical Data Integration  
**Agent Series**: Clinical Decision Visualization Specialists

## 🎯 Objective
Design and implement the clinical decision tree data structures that will power interactive antibiotic selection pathways, ensuring medical accuracy and alignment with AAP/IDSA guidelines.

## 📋 Deliverables Checklist
- [ ] **Schema Creation**: Create `src/data/decisionTreeSchemas.js` with complete data structures
- [ ] **Node Type Definitions**: Define decision, action, and outcome node schemas
- [ ] **Condition-Specific Trees**: Implement tree structures for 5 priority conditions
- [ ] **Age-Based Branching**: Create pediatric age group decision logic
- [ ] **Allergy Pathways**: Define alternative pathways for common allergies
- [ ] **Severity Classifications**: Implement mild/moderate/severe branching
- [ ] **Evidence Levels**: Add AAP/IDSA evidence grading to recommendations
- [ ] **Validation Functions**: Create medical accuracy validation utilities

## 🔧 Technical Implementation

### Core Schema Structure
```javascript
// Base decision tree node schema
const DecisionTreeNode = {
  id: String,                    // Unique identifier
  type: 'decision' | 'action' | 'outcome',
  title: String,                 // Display title
  description: String,           // Detailed description
  medicalContext: {
    condition: String,           // Primary condition
    ageGroup: String,           // Pediatric age classification
    severity: String,           // Mild/moderate/severe
    evidenceLevel: String       // A-1, A-2, B-1, etc.
  },
  children: Array,              // Child nodes
  metadata: Object              // Additional clinical data
};
```

### Decision Node Implementation
```javascript
// Clinical decision points (e.g., "Patient has drug allergies?")
const DecisionNodeSchema = {
  ...DecisionTreeNode,
  type: 'decision',
  question: String,             // Clinical question
  options: [{
    label: String,              // Option text (e.g., "Yes - PCN allergy")
    value: String,              // Option value
    nextNodeId: String,         // Next node in pathway
    clinicalNotes: String       // Additional clinical guidance
  }],
  clinicalGuidance: String      // Reasoning for this decision point
};
```

### Action Node Implementation
```javascript
// Clinical actions (e.g., "Obtain cultures", "Check renal function")
const ActionNodeSchema = {
  ...DecisionTreeNode,
  type: 'action',
  action: String,               // Action to take
  rationale: String,           // Why this action is needed
  timeframe: String,           // When to perform action
  criticalNotes: String,       // Safety considerations
  nextActions: Array           // Subsequent actions
};
```

### Outcome Node Implementation
```javascript
// Treatment outcomes (e.g., specific antibiotic recommendations)
const OutcomeNodeSchema = {
  ...DecisionTreeNode,
  type: 'outcome',
  treatment: {
    antibiotic: String,         // Specific antibiotic
    dose: String,              // Dosing information
    duration: String,          // Treatment duration
    route: String,             // Administration route
    monitoring: Array          // Required monitoring
  },
  alternatives: Array,         // Alternative treatments
  followUp: Object,           // Follow-up requirements
  redFlags: Array             // Warning signs
};
```

## 🏥 Medical Content Implementation

### Priority Condition Trees
```javascript
// Pneumonia Decision Tree
const pneumoniaTree = {
  id: 'pneumonia-root',
  type: 'decision',
  title: 'Community-Acquired Pneumonia',
  question: 'Patient age group?',
  medicalContext: {
    condition: 'pneumonia',
    guideline: 'AAP-2011-Pneumonia',
    evidenceLevel: 'A-1'
  },
  options: [
    {
      label: '< 3 months',
      value: 'infant',
      nextNodeId: 'pneumonia-infant-severity'
    },
    {
      label: '3 months - 5 years',
      value: 'preschool',
      nextNodeId: 'pneumonia-preschool-severity'
    },
    {
      label: '> 5 years',
      value: 'school-age',
      nextNodeId: 'pneumonia-school-severity'
    }
  ]
};
```

### Age-Based Classifications
```javascript
const pediatricAgeGroups = {
  neonate: { min: 0, max: 28, unit: 'days' },
  infant: { min: 1, max: 12, unit: 'months' },
  toddler: { min: 1, max: 3, unit: 'years' },
  preschool: { min: 3, max: 5, unit: 'years' },
  schoolAge: { min: 5, max: 12, unit: 'years' },
  adolescent: { min: 12, max: 18, unit: 'years' }
};
```

### Allergy Pathway Definitions
```javascript
const allergyPathways = {
  penicillin: {
    severity: 'severe',
    alternatives: ['cephalexin', 'azithromycin', 'clindamycin'],
    contraindications: ['amoxicillin', 'ampicillin'],
    crossReactions: ['cephalosporins-caution']
  },
  sulfa: {
    severity: 'moderate',
    alternatives: ['azithromycin', 'cephalexin'],
    contraindications: ['trimethoprim-sulfamethoxazole']
  }
  // Additional allergy pathways...
};
```

## 📊 Integration with Existing Data

### Pathogen Database Connection
```javascript
// Link to SimplePathogenData.js (29 pathogens)
const pathogenIntegration = {
  connectToPathogens: (conditionName) => {
    // Return relevant pathogens for condition
    // E.g., pneumonia -> S. pneumoniae, H. influenzae, etc.
  },
  getGramStainInfo: (pathogenName) => {
    // Return gram stain and clinical significance
  }
};
```

### Antibiotic Database Connection
```javascript
// Link to SimpleAntibioticData.js (30 antibiotics)
const antibioticIntegration = {
  getDosing: (antibiotic, ageGroup, weight) => {
    // Calculate appropriate dosing
  },
  getContraindications: (antibiotic, allergies) => {
    // Check for contraindications
  },
  getInteractions: (antibiotic, currentMeds) => {
    // Drug interaction checking
  }
};
```

## 📚 Medical Evidence Integration

### AAP/IDSA Guidelines Mapping
```javascript
const guidelineReferences = {
  pneumonia: {
    source: 'AAP-2011-Management-Pneumonia',
    evidenceLevels: {
      'amoxicillin-first-line': 'A-1',
      'azithromycin-atypical': 'B-2',
      'hospitalization-criteria': 'A-2'
    }
  },
  otitisMedia: {
    source: 'AAP-2013-Acute-Otitis-Media',
    evidenceLevels: {
      'observation-option': 'B-1',
      'amoxicillin-first-line': 'A-1'
    }
  }
  // Additional guidelines...
};
```

### Clinical Decision Validation
```javascript
// Validation functions for medical accuracy
const medicalValidation = {
  validateDosing: (antibiotic, dose, weight, age) => {
    // Ensure dosing within safe pediatric ranges
  },
  checkContraindications: (treatment, patientFactors) => {
    // Verify no absolute contraindications
  },
  validateDuration: (condition, antibiotic, duration) => {
    // Confirm appropriate treatment duration
  }
};
```

## 🧪 Testing Strategy

### Medical Accuracy Tests
```javascript
describe('Decision Tree Medical Validation', () => {
  test('pneumonia pathways follow AAP guidelines', () => {});
  test('dosing calculations within pediatric ranges', () => {});
  test('allergy pathways avoid contraindications', () => {});
  test('evidence levels properly assigned', () => {});
});
```

### Data Structure Tests
```javascript
describe('Decision Tree Schema Validation', () => {
  test('all nodes have required fields', () => {});
  test('pathways have valid connections', () => {});
  test('circular references detected', () => {});
  test('orphaned nodes identified', () => {});
});
```

## 📋 Priority Implementation Order

### 9:00 AM - 9:45 AM: Core Schemas
- [ ] Define base node structures
- [ ] Create node type schemas
- [ ] Implement validation functions

### 9:45 AM - 10:45 AM: Pneumonia Tree
- [ ] Build complete pneumonia decision tree
- [ ] Implement age-based branching
- [ ] Add severity classifications

### 10:45 AM - 11:30 AM: Allergy Integration
- [ ] Define allergy pathway structures
- [ ] Implement alternative recommendations
- [ ] Add cross-reaction warnings

### 11:30 AM - 12:00 PM: Validation & Testing
- [ ] Test medical accuracy
- [ ] Validate data structures
- [ ] Document API usage

## 🔗 Integration Dependencies

### Providing To
- **Zeta-1**: Tree data structures for visualization
- **Kappa-1**: Condition-specific tree implementations
- **Iota-1**: Data mapping interfaces

### Medical Expert Review Points
- **Dosing Calculations**: Verify pediatric dosing accuracy
- **Guideline Alignment**: Confirm AAP/IDSA compliance
- **Clinical Logic**: Validate decision pathways

## 📈 Success Criteria

### By Monday 12:00 PM
- [ ] **Schema Complete**: All node types defined and documented
- [ ] **Pneumonia Tree**: Complete decision tree for pneumonia
- [ ] **Age Logic**: Pediatric age group branching operational
- [ ] **Allergy Paths**: Alternative pathways for PCN/sulfa allergies
- [ ] **Validation**: Medical accuracy validation functions
- [ ] **Integration**: Connects to existing pathogen/antibiotic data
- [ ] **Tests**: Schema validation tests passing
- [ ] **Documentation**: API and medical references documented

### Quality Gates
- **Medical Accuracy**: 100% alignment with current guidelines
- **Data Integrity**: All pathways have valid connections
- **Clinical Safety**: No contraindicated recommendations
- **Evidence-Based**: All recommendations have evidence levels

## 📝 Medical References

### Primary Guidelines
- AAP. Clinical Practice Guideline for the Management of Community-Acquired Pneumonia in Infants and Children (2011)
- AAP. Clinical Practice Guideline for Acute Otitis Media (2013)  
- IDSA. Practice Guidelines for Community-Acquired Pneumonia (2019)
- Red Book: Report of the Committee on Infectious Diseases (2021)

### Dosing References
- Harriet Lane Handbook (Pediatric dosing)
- Lexicomp Pediatric & Neonatal Dosage Handbook
- AAP Committee on Drugs recommendations

---

**Agent**: Eta-1 (Clinical Decision Data Model)  
**Status**: Ready for immediate execution  
**Medical Validation**: 100% evidence-based content required  
**Critical Success Factor**: Medical accuracy and guideline compliance