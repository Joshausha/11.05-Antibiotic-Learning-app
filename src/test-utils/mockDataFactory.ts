/**
 * Centralized Mock Data Factory
 *
 * Provides standardized mock data for all test files to ensure consistency
 * and prevent data structure mismatches across the test suite.
 *
 * Created: 2025-10-01
 * Phase: 4A - Mock Data Standardization
 * Purpose: Single source of truth for test mock data
 */

/**
 * Creates a standardized mock pathogen object
 * Ensures all required fields are present with proper types
 */
export const createMockPathogen = (overrides = {}) => ({
  id: 1,
  name: 'Staphylococcus aureus',
  commonName: 'Staph aureus',
  gramStain: 'positive',  // Standardized field name (not gramStatus)
  shape: 'bacilli',       // Standardized to match validation (not 'rod')
  morphology: 'cocci',    // Added morphology field
  severity: 'high',
  resistance: 'MRSA strains common',
  commonSites: ['skin', 'blood', 'bone'],
  description: 'Common pathogen causing various infections',
  clinicalSignificance: 'High pathogenicity with potential for serious infections',
  commonInfections: ['skin infections', 'bacteremia', 'osteomyelitis'],
  resistancePattern: 'methicillin-resistant',
  ...overrides
});

/**
 * Creates a standardized mock antibiotic object
 * Includes all required fields with proper validation-compliant values
 */
export const createMockAntibiotic = (overrides = {}) => ({
  id: 1,
  name: 'Vancomycin',
  class: 'Glycopeptides',  // Pluralized to match validation
  mechanism: 'Cell wall synthesis inhibition via peptidoglycan binding',  // >10 chars
  spectrum: 'Narrow; gram-positive coverage including MRSA',  // Required field
  route: 'IV',
  description: 'Glycopeptide antibiotic for serious gram-positive infections',
  sideEffects: 'Nephrotoxicity and ototoxicity possible with prolonged use',  // >10 chars
  category: 'Glycopeptide',
  ...overrides
});

/**
 * Creates a standardized mock medical condition object
 * Ensures at least one association (pathogens, symptoms, or antibiotics)
 */
export const createMockCondition = (overrides = {}) => ({
  id: 'pneumonia',
  name: 'Community-Acquired Pneumonia',
  severity: 'moderate-severe',
  ageGroup: 'all ages',
  description: 'Bacterial infection of the lung parenchyma',
  pathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae'],  // Required association
  symptoms: ['cough', 'fever', 'dyspnea'],
  antibiotics: ['amoxicillin', 'azithromycin'],
  ...overrides
});

/**
 * Creates a standardized mock treatment option
 * For use in pathogen detail and treatment recommendation tests
 */
export const createMockTreatment = (overrides = {}) => ({
  id: 'amoxicillin',
  name: 'Amoxicillin',
  isFirstLine: true,
  hasResistance: false,
  doseRoute: 'oral',
  clinicalNotes: 'First-line therapy for mild community-acquired infections',
  effectiveness: 'high',
  ...overrides
});

/**
 * Creates a standardized quiz question object
 * Ensures correct answer is >3 characters and meets educational standards
 */
export const createMockQuizQuestion = (overrides = {}) => ({
  id: 'q1',
  question: 'Which antibiotic class inhibits bacterial cell wall synthesis?',
  options: [
    'Beta-lactams',    // >3 chars
    'Macrolides',      // >3 chars
    'Fluoroquinolones', // >3 chars
    'Aminoglycosides'  // >3 chars
  ],
  correct: 0,
  explanation: 'Beta-lactam antibiotics like penicillins and cephalosporins inhibit peptidoglycan synthesis',
  difficulty: 'medium',
  topic: 'antibiotic mechanisms',
  ...overrides
});

/**
 * Creates array of mock pathogens for list/explorer components
 */
export const createMockPathogenList = () => [
  createMockPathogen({
    id: 1,
    name: 'Staphylococcus aureus',
    commonName: 'Staph aureus',
    gramStain: 'positive',
    shape: 'bacilli',
    morphology: 'cocci',
    severity: 'high'
  }),
  createMockPathogen({
    id: 2,
    name: 'Escherichia coli',
    commonName: 'E. coli',
    gramStain: 'negative',
    shape: 'bacilli',
    morphology: 'rod',
    severity: 'medium'
  }),
  createMockPathogen({
    id: 3,
    name: 'Streptococcus pneumoniae',
    commonName: 'Pneumococcus',
    gramStain: 'positive',
    shape: 'bacilli',
    morphology: 'cocci',
    severity: 'high'
  }),
  createMockPathogen({
    id: 4,
    name: 'Mycoplasma pneumoniae',
    commonName: 'Mycoplasma',
    gramStain: 'atypical',  // Added atypical gram stain
    shape: 'bacilli',
    morphology: 'variable',
    severity: 'low'
  })
];

/**
 * Creates array of mock antibiotics for list components
 */
export const createMockAntibioticList = () => [
  createMockAntibiotic({
    id: 1,
    name: 'Vancomycin',
    class: 'Glycopeptides',
    mechanism: 'Cell wall synthesis inhibition via peptidoglycan binding',
    spectrum: 'Narrow; gram-positive coverage including MRSA'
  }),
  createMockAntibiotic({
    id: 2,
    name: 'Ciprofloxacin',
    class: 'Fluoroquinolones',
    mechanism: 'DNA gyrase and topoisomerase IV inhibition',
    spectrum: 'Broad; excellent gram-negative and atypical coverage'
  }),
  createMockAntibiotic({
    id: 3,
    name: 'Amoxicillin',
    class: 'Penicillins',
    mechanism: 'Beta-lactam inhibition of peptidoglycan synthesis',
    spectrum: 'Narrow to moderate; gram-positive and some gram-negative'
  })
];

/**
 * Mock pathogen-antibiotic mapping
 */
export const createMockPathogenAntibioticMap = () => ({
  1: {
    antibiotics: [
      { antibioticId: 1, effectiveness: 'high', notes: 'First-line for MRSA infections' }
    ]
  },
  2: {
    antibiotics: [
      { antibioticId: 2, effectiveness: 'high', notes: 'Excellent gram-negative coverage' }
    ]
  },
  3: {
    antibiotics: [
      { antibioticId: 3, effectiveness: 'medium', notes: 'Alternative for non-resistant strains' }
    ]
  }
});

/**
 * Mock helper functions for SimplePathogenData
 */
export const mockPathogenHelpers = {
  searchPathogens: jest.fn((term: any, pathogens: any) => {
    if (!term) return pathogens;
    return pathogens.filter((p: any) =>
      p.commonName.toLowerCase().includes(term.toLowerCase()) ||
      p.name.toLowerCase().includes(term.toLowerCase())
    );
  }),
  getPathogensByGramStatus: jest.fn((status: any, pathogens: any) => {
    if (status === 'all') return pathogens;
    return pathogens.filter((p: any) => p.gramStain === status);
  }),
  getPathogensBySeverity: jest.fn((severity: any, pathogens: any) => {
    if (severity === 'all') return pathogens;
    return pathogens.filter((p: any) => p.severity === severity);
  }),
  getPathogenById: jest.fn((id: any, pathogens: any) =>
    pathogens.find((p: any) => p.id === id)
  ),
  getPathogenByName: jest.fn((name: any, pathogens: any) =>
    pathogens.find((p: any) =>
      p.commonName.toLowerCase() === name.toLowerCase() ||
      p.name.toLowerCase() === name.toLowerCase()
    )
  ),
  validatePathogenData: jest.fn(() => null)
};

/**
 * Mock helper functions for SimpleAntibioticData
 */
export const mockAntibioticHelpers = {
  getAntibioticById: jest.fn((id: any, antibiotics: any) => {
    const antibiotic = antibiotics.find((a: any) => a.id === id);
    return antibiotic || createMockAntibiotic({ id, name: `Antibiotic ${id}` });
  }),
  validateAntibioticData: jest.fn(() => null),
  getAllDrugClasses: jest.fn((antibiotics: any) =>
    [...new Set(antibiotics.map((a: any) => a.class))]
  )
};

/**
 * Default prop sets for common components
 */
export const mockComponentProps = {
  pathogenDetailPanel: () => ({
    pathogen: createMockPathogen(),
    associatedConditions: [createMockCondition()],
    treatmentOptions: [createMockTreatment()],
    similarPathogens: [
      createMockPathogen({
        id: 2,
        name: 'Viridans group streptococci',
        similarity: 0.8
      })
    ],
    onSelectPathogen: jest.fn(),
    onSelectCondition: jest.fn(),
    onShowComparison: jest.fn()
  }),

  consolidatedPathogenExplorer: () => ({
    pathogens: createMockPathogenList(),
    onSelectPathogen: jest.fn(),
    setGramFilter: jest.fn(),
    setSeverityFilter: jest.fn(),
    gramFilter: 'all',
    severityFilter: 'all'
  }),

  pathogenList: () => ({
    pathogens: createMockPathogenList(),
    onSelect: jest.fn(),
    selectedId: null
  }),

  antibioticList: () => ({
    antibiotics: createMockAntibioticList(),
    onSelect: jest.fn(),
    selectedId: null
  })
};

export default {
  createMockPathogen,
  createMockAntibiotic,
  createMockCondition,
  createMockTreatment,
  createMockQuizQuestion,
  createMockPathogenList,
  createMockAntibioticList,
  createMockPathogenAntibioticMap,
  mockPathogenHelpers,
  mockAntibioticHelpers,
  mockComponentProps
};
