/**
 * DecisionTreeDataStructure.js
 * 
 * Clinical decision tree schemas for evidence-based antibiotic selection
 * in pediatric and adolescent patients. Based on current AAP and IDSA guidelines.
 * 
 * Features:
 * - Pediatric-focused clinical pathways
 * - Evidence-based branching logic
 * - Age-appropriate antibiotic selection
 * - Safety checks and contraindications
 * - Integration with medical grouping logic
 * 
 * Medical Guidelines: AAP 2023, IDSA 2019-2023, Pediatric Infectious Diseases Society
 * Target Users: Medical students, pediatric residents, general practitioners
 * 
 * @author Claude Code Assistant  
 * @version 1.0.0
 * @medical-disclaimer Educational purposes only - verify against current guidelines
 */

import { NODE_TYPES } from './NodeTypes';

/**
 * Clinical severity classifications for pediatric infections
 */
export const SEVERITY_LEVELS = {
  MILD: {
    id: 'mild',
    label: 'Mild',
    criteria: ['Minimal systemic symptoms', 'Normal activity level', 'Good oral intake'],
    temperature: '<38.5°C',
    indicators: ['ambulatory', 'playful', 'eating_normally']
  },
  MODERATE: {
    id: 'moderate', 
    label: 'Moderate',
    criteria: ['Some systemic symptoms', 'Decreased activity', 'Reduced oral intake'],
    temperature: '38.5-39.5°C',
    indicators: ['mild_dehydration', 'irritable', 'decreased_appetite']
  },
  SEVERE: {
    id: 'severe',
    label: 'Severe', 
    criteria: ['Significant systemic toxicity', 'Minimal activity', 'Poor oral intake'],
    temperature: '>39.5°C',
    indicators: ['dehydrated', 'lethargic', 'respiratory_distress', 'hemodynamic_compromise']
  }
};

/**
 * Pediatric age groups with clinical considerations
 */
export const AGE_GROUPS = {
  NEONATE: { min: 0, max: 0.08, label: 'Neonate (0-28 days)', specialConsiderations: ['Group B Strep', 'E. coli', 'Listeria'] },
  INFANT: { min: 0.08, max: 2, label: 'Infant (1-24 months)', specialConsiderations: ['H. influenzae', 'S. pneumoniae', 'viral_common'] },
  TODDLER: { min: 2, max: 5, label: 'Toddler (2-5 years)', specialConsiderations: ['viral_predominant', 'daycare_exposure'] },
  SCHOOL_AGE: { min: 5, max: 12, label: 'School Age (5-12 years)', specialConsiderations: ['atypical_pathogens'] },
  ADOLESCENT: { min: 12, max: 18, label: 'Adolescent (12-18 years)', specialConsiderations: ['adult_pathogens', 'mycoplasma'] }
};

/**
 * Community-Acquired Pneumonia (CAP) Decision Tree
 * Based on AAP 2023 guidelines and IDSA recommendations
 */
export const COMMUNITY_ACQUIRED_PNEUMONIA_TREE = {
  id: 'community-acquired-pneumonia',
  name: 'Community-Acquired Pneumonia',
  description: 'Evidence-based antibiotic selection for pediatric CAP',
  ageRange: { min: 0.08, max: 18 },
  guidelines: {
    primary: 'AAP Clinical Practice Guideline 2023',
    secondary: 'IDSA/PIDS Community-Acquired Pneumonia 2019',
    lastUpdated: '2023-10-01'
  },
  
  nodes: {
    root: {
      id: 'root',
      type: NODE_TYPES.ROOT,
      title: 'Pediatric Community-Acquired Pneumonia',
      description: 'Clinical decision support for antibiotic selection in pediatric CAP',
      next: 'age_assessment'
    },
    
    age_assessment: {
      id: 'age_assessment',
      type: NODE_TYPES.DECISION,
      title: 'Age Group Assessment',
      question: 'What is the patient\'s age?',
      medicalContext: 'Age determines likely pathogens and appropriate antibiotics',
      branches: [
        {
          condition: { field: 'age', operator: '<', value: 0.08 },
          label: 'Neonate (0-28 days)',
          next: 'neonatal_warning',
          rationale: 'Neonates require hospitalization and IV antibiotics'
        },
        {
          condition: { field: 'age', operator: '>=', value: 0.08, operator2: '<', value2: 2 },
          label: 'Infant (1-24 months)', 
          next: 'infant_severity_assessment',
          rationale: 'Infants have higher risk of bacterial pneumonia'
        },
        {
          condition: { field: 'age', operator: '>=', value: 2, operator2: '<', value2: 5 },
          label: 'Toddler (2-5 years)',
          next: 'toddler_severity_assessment',
          rationale: 'Viral pneumonia more common, but bacterial still possible'
        },
        {
          condition: { field: 'age', operator: '>=', value: 5 },
          label: 'School age/Adolescent (≥5 years)',
          next: 'older_child_assessment',
          rationale: 'Atypical pathogens (Mycoplasma) become more common'
        }
      ]
    },
    
    neonatal_warning: {
      id: 'neonatal_warning',
      type: NODE_TYPES.WARNING,
      title: 'Neonatal Pneumonia - Immediate Hospitalization Required',
      message: 'Neonates with suspected pneumonia require immediate hospitalization and IV antibiotics',
      severity: 'critical',
      recommendations: [
        'Immediate pediatric consultation',
        'Blood culture, CBC with differential',
        'Chest X-ray',
        'Consider lumbar puncture',
        'Start empiric IV antibiotics: Ampicillin + Gentamicin or Cefotaxime'
      ],
      guidelines: 'AAP Neonatal Guidelines 2023',
      next: 'exit'
    },
    
    infant_severity_assessment: {
      id: 'infant_severity_assessment',
      type: NODE_TYPES.DECISION,
      title: 'Infant Severity Assessment (1-24 months)',
      question: 'What is the severity of illness?',
      medicalContext: 'Infants with CAP often require hospitalization',
      clinicalPearl: 'Well-appearing infants >90 days may be considered for outpatient management',
      branches: [
        {
          condition: { field: 'severity', value: 'mild' },
          label: 'Mild - Well appearing, good oral intake',
          next: 'infant_outpatient_consideration',
          rationale: 'Selected well-appearing infants may be managed as outpatients'
        },
        {
          condition: { field: 'severity', value: 'moderate' },
          label: 'Moderate - Some toxicity, decreased intake',
          next: 'infant_hospitalization_recommended',
          rationale: 'Hospitalization generally recommended for moderate illness'
        },
        {
          condition: { field: 'severity', value: 'severe' },
          label: 'Severe - Significant toxicity, poor intake',
          next: 'infant_hospitalization_required',
          rationale: 'Immediate hospitalization and IV antibiotics required'
        }
      ]
    },
    
    infant_outpatient_consideration: {
      id: 'infant_outpatient_consideration',
      type: NODE_TYPES.DECISION,
      title: 'Outpatient Management Consideration',
      question: 'Does the infant meet criteria for outpatient management?',
      criteria: [
        'Age >90 days',
        'Well-appearing',
        'Reliable caregivers',
        'Good follow-up available',
        'No underlying conditions'
      ],
      branches: [
        {
          condition: { field: 'outpatient_suitable', value: true },
          label: 'Yes - Suitable for outpatient management',
          next: 'infant_oral_antibiotics',
          rationale: 'Oral antibiotics appropriate for selected well infants'
        },
        {
          condition: { field: 'outpatient_suitable', value: false },
          label: 'No - Hospitalization recommended',
          next: 'infant_hospitalization_recommended',
          rationale: 'Hospitalization safer for infants not meeting outpatient criteria'
        }
      ]
    },
    
    infant_oral_antibiotics: {
      id: 'infant_oral_antibiotics',
      type: NODE_TYPES.OUTCOME,
      title: 'Infant Outpatient Antibiotic Therapy',
      recommendations: {
        firstLine: {
          drug: 'amoxicillin',
          dose: '80-90 mg/kg/day divided BID-TID',
          duration: '7-10 days',
          rationale: 'Excellent S. pneumoniae coverage, well-tolerated'
        },
        alternatives: [
          {
            drug: 'amoxicillin-clavulanate',
            dose: '80-90 mg/kg/day (amoxicillin component) BID',
            indication: 'If beta-lactamase producing organisms suspected',
            rationale: 'Broader spectrum including H. influenzae'
          },
          {
            drug: 'cefdinir',
            dose: '14 mg/kg/day divided BID',
            indication: 'Penicillin allergy (non-severe)',
            rationale: 'Cephalosporin alternative with good pneumococcal coverage'
          }
        ]
      },
      followUp: {
        timing: '24-48 hours',
        criteria: 'Clinical improvement expected within 48-72 hours',
        redFlags: ['Worsening fever', 'Increased respiratory distress', 'Poor feeding']
      },
      evidenceLevel: 'A'
    },

    toddler_severity_assessment: {
      id: 'toddler_severity_assessment', 
      type: NODE_TYPES.DECISION,
      title: 'Toddler Severity Assessment (2-5 years)',
      question: 'What is the clinical severity?',
      medicalContext: 'Most pneumonia in toddlers is viral, but bacterial pneumonia still occurs',
      branches: [
        {
          condition: { field: 'severity', value: 'mild' },
          label: 'Mild - Minimal symptoms, active',
          next: 'toddler_viral_vs_bacterial',
          rationale: 'Consider viral vs bacterial etiology'
        },
        {
          condition: { field: 'severity', value: 'moderate' },
          label: 'Moderate - Some systemic symptoms',
          next: 'toddler_antibiotic_decision',
          rationale: 'Antibiotics often warranted for moderate illness'
        },
        {
          condition: { field: 'severity', value: 'severe' },
          label: 'Severe - Significant toxicity',
          next: 'toddler_hospitalization',
          rationale: 'Hospitalization and IV antibiotics indicated'
        }
      ]
    },

    toddler_viral_vs_bacterial: {
      id: 'toddler_viral_vs_bacterial',
      type: NODE_TYPES.DECISION,
      title: 'Viral vs Bacterial Assessment',
      question: 'What clinical features suggest bacterial pneumonia?',
      clinicalPearl: 'Bacterial pneumonia suggested by: high fever, focal signs, elevated WBC',
      features: {
        bacterial: ['Fever >39°C', 'Focal chest findings', 'Elevated WBC', 'Consolidation on CXR'],
        viral: ['Gradual onset', 'Diffuse findings', 'Normal/low WBC', 'Interstitial pattern on CXR']
      },
      branches: [
        {
          condition: { field: 'bacterial_likely', value: true },
          label: 'Bacterial pneumonia likely',
          next: 'toddler_antibiotic_decision',
          rationale: 'Antibiotic therapy indicated for suspected bacterial pneumonia'
        },
        {
          condition: { field: 'bacterial_likely', value: false },
          label: 'Viral pneumonia likely',
          next: 'toddler_supportive_care',
          rationale: 'Supportive care appropriate for viral pneumonia'
        }
      ]
    },

    toddler_supportive_care: {
      id: 'toddler_supportive_care',
      type: NODE_TYPES.OUTCOME,
      title: 'Supportive Care for Viral Pneumonia',
      recommendations: {
        primary: 'Supportive care - no antibiotics indicated',
        measures: [
          'Fever management (acetaminophen/ibuprofen)',
          'Adequate hydration',
          'Rest and monitoring',
          'Humidified air'
        ]
      },
      followUp: {
        timing: '24-48 hours',
        criteria: 'Clinical improvement expected within 3-5 days',
        antibioticConsideration: 'Consider antibiotics if: fever >5 days, clinical deterioration, secondary bacterial infection suspected'
      },
      evidenceLevel: 'A'
    },

    toddler_antibiotic_decision: {
      id: 'toddler_antibiotic_decision',
      type: NODE_TYPES.OUTCOME,
      title: 'Toddler Antibiotic Therapy',
      recommendations: {
        firstLine: {
          drug: 'amoxicillin',
          dose: '80-90 mg/kg/day divided BID-TID',
          maxDose: '2000 mg/day',
          duration: '7-10 days',
          rationale: 'First-line for pneumococcal pneumonia'
        },
        alternatives: [
          {
            drug: 'azithromycin', 
            dose: '10 mg/kg day 1, then 5 mg/kg days 2-5',
            indication: 'Atypical pathogens suspected or amoxicillin failure',
            rationale: 'Covers atypical pathogens (Mycoplasma, Chlamydia)'
          },
          {
            drug: 'cefdinir',
            dose: '14 mg/kg/day divided BID',
            indication: 'Penicillin allergy',
            rationale: 'Cephalosporin alternative'
          }
        ]
      },
      followUp: {
        timing: '48-72 hours', 
        criteria: 'Clinical improvement expected within 48-72 hours'
      },
      evidenceLevel: 'A'
    },

    older_child_assessment: {
      id: 'older_child_assessment',
      type: NODE_TYPES.DECISION,
      title: 'School Age/Adolescent Assessment (≥5 years)',
      question: 'What clinical pattern is present?',
      medicalContext: 'Atypical pathogens (Mycoplasma) become more common with age',
      branches: [
        {
          condition: { field: 'presentation', value: 'typical' },
          label: 'Typical bacterial presentation',
          next: 'older_child_typical_therapy',
          rationale: 'High fever, focal signs suggest S. pneumoniae'
        },
        {
          condition: { field: 'presentation', value: 'atypical' },
          label: 'Atypical presentation',
          next: 'older_child_atypical_therapy', 
          rationale: 'Gradual onset, dry cough suggests Mycoplasma'
        },
        {
          condition: { field: 'severity', value: 'severe' },
          label: 'Severe illness',
          next: 'older_child_hospitalization',
          rationale: 'Severe illness requires hospitalization'
        }
      ]
    },

    older_child_typical_therapy: {
      id: 'older_child_typical_therapy',
      type: NODE_TYPES.OUTCOME,
      title: 'Typical Bacterial Pneumonia Therapy',
      recommendations: {
        firstLine: {
          drug: 'amoxicillin',
          dose: '80-90 mg/kg/day divided BID-TID (max 2g/day)',
          duration: '7-10 days',
          rationale: 'Excellent pneumococcal coverage'
        },
        alternatives: [
          {
            drug: 'azithromycin',
            dose: '10 mg/kg day 1, then 5 mg/kg days 2-5',
            indication: 'Mixed typical/atypical suspected',
            rationale: 'Covers both typical and atypical pathogens'
          }
        ]
      },
      evidenceLevel: 'A'
    },

    older_child_atypical_therapy: {
      id: 'older_child_atypical_therapy', 
      type: NODE_TYPES.OUTCOME,
      title: 'Atypical Pneumonia Therapy',
      recommendations: {
        firstLine: {
          drug: 'azithromycin',
          dose: '10 mg/kg day 1 (max 500mg), then 5 mg/kg days 2-5 (max 250mg)',
          duration: '5 days',
          rationale: 'Excellent Mycoplasma and Chlamydia coverage'
        },
        alternatives: [
          {
            drug: 'doxycycline',
            dose: '2-4 mg/kg/day divided BID (max 200mg/day)',
            indication: 'Age ≥8 years, severe atypical infection',
            rationale: 'Alternative for atypical pathogens in older children',
            ageRestriction: '≥8 years due to teeth staining risk'
          }
        ]
      },
      evidenceLevel: 'A'
    }
  }
};

/**
 * Urinary Tract Infection (UTI) Decision Tree
 * Based on AAP UTI guidelines 2016 (updated practices)
 */
export const URINARY_TRACT_INFECTION_TREE = {
  id: 'urinary-tract-infection',
  name: 'Urinary Tract Infection',
  description: 'Evidence-based management of pediatric UTI',
  ageRange: { min: 0.08, max: 18 },
  guidelines: {
    primary: 'AAP UTI Clinical Practice Guideline 2016',
    secondary: 'IDSA Uncomplicated UTI Guidelines 2019',
    lastUpdated: '2023-08-01'
  },

  nodes: {
    root: {
      id: 'root',
      type: NODE_TYPES.ROOT,
      title: 'Pediatric Urinary Tract Infection',
      description: 'Clinical decision support for UTI management',
      next: 'age_gender_assessment'
    },

    age_gender_assessment: {
      id: 'age_gender_assessment',
      type: NODE_TYPES.DECISION,
      title: 'Age and Gender Assessment',
      question: 'What is the patient\'s age and gender?',
      medicalContext: 'UTI risk and management varies by age and gender',
      branches: [
        {
          condition: { field: 'age', operator: '<', value: 0.08 },
          label: 'Neonate (0-28 days)',
          next: 'neonatal_uti_management',
          rationale: 'Neonatal UTI requires immediate hospitalization'
        },
        {
          condition: { 
            and: [
              { field: 'age', operator: '>=', value: 0.08, operator2: '<=', value2: 2 },
              { field: 'gender', value: 'female' }
            ]
          },
          label: 'Female infant/toddler (1mo-2yr)',
          next: 'young_female_uti',
          rationale: 'Higher risk of ascending infection and renal scarring'
        },
        {
          condition: {
            and: [
              { field: 'age', operator: '>=', value: 0.08, operator2: '<=', value2: 2 },
              { field: 'gender', value: 'male' }
            ]
          },
          label: 'Male infant/toddler (1mo-2yr)',
          next: 'young_male_uti',
          rationale: 'Consider structural abnormalities, especially if recurrent'
        },
        {
          condition: { field: 'age', operator: '>', value: 2 },
          label: 'Child ≥2 years',
          next: 'older_child_uti_assessment',
          rationale: 'Most UTIs are uncomplicated cystitis'
        }
      ]
    },

    young_female_uti: {
      id: 'young_female_uti',
      type: NODE_TYPES.OUTCOME,
      title: 'Young Female UTI Management',
      recommendations: {
        firstLine: {
          drug: 'trimethoprim-sulfamethoxazole',
          dose: '8-12 mg/kg/day TMP component divided BID',
          duration: '7-10 days',
          rationale: 'Excellent urinary concentration, first-line per AAP'
        },
        alternatives: [
          {
            drug: 'nitrofurantoin',
            dose: '5-7 mg/kg/day divided QID',
            indication: 'TMP-SMX allergy or resistance',
            rationale: 'Concentrated in urine, minimal resistance'
          },
          {
            drug: 'cephalexin',
            dose: '50-100 mg/kg/day divided QID',
            indication: 'Sulfa allergy',
            rationale: 'Good urinary concentration'
          }
        ]
      },
      followUp: {
        imaging: 'Consider VCUG if: recurrent UTI, abnormal renal US, complex UTI',
        timing: '48-72 hours for clinical improvement'
      },
      evidenceLevel: 'A'
    }
  }
};

/**
 * Otitis Media Decision Tree  
 * Based on AAP/AAFP Otitis Media Guidelines 2013
 */
export const OTITIS_MEDIA_TREE = {
  id: 'otitis-media',
  name: 'Acute Otitis Media',
  description: 'Evidence-based management of pediatric AOM',
  ageRange: { min: 0.17, max: 18 },
  guidelines: {
    primary: 'AAP/AAFP Acute Otitis Media Guidelines 2013',
    lastUpdated: '2023-06-01'
  },

  nodes: {
    root: {
      id: 'root', 
      type: NODE_TYPES.ROOT,
      title: 'Acute Otitis Media',
      description: 'Clinical decision support for AOM management',
      next: 'diagnostic_assessment'
    },

    diagnostic_assessment: {
      id: 'diagnostic_assessment',
      type: NODE_TYPES.DECISION,
      title: 'AOM Diagnosis Confirmation',
      question: 'Are diagnostic criteria for AOM met?',
      criteria: [
        'Acute onset of symptoms',
        'Middle ear effusion (bulging TM, limited mobility)',
        'Signs of middle ear inflammation (erythema, otalgia)'
      ],
      branches: [
        {
          condition: { field: 'aom_confirmed', value: true },
          label: 'AOM diagnosis confirmed',
          next: 'age_severity_assessment',
          rationale: 'Proceed with AOM management algorithm'
        },
        {
          condition: { field: 'aom_confirmed', value: false },
          label: 'AOM diagnosis uncertain/OME',
          next: 'observation_only',
          rationale: 'Watchful waiting or treat otitis media with effusion'
        }
      ]
    },

    age_severity_assessment: {
      id: 'age_severity_assessment',
      type: NODE_TYPES.DECISION,
      title: 'Age and Severity Assessment',
      question: 'What is the patient\'s age and symptom severity?',
      medicalContext: 'Young children and severe symptoms favor immediate antibiotic therapy',
      branches: [
        {
          condition: { field: 'age', operator: '<', value: 2 },
          label: 'Age <2 years',
          next: 'infant_aom_treatment',
          rationale: 'Children <2 years should receive antibiotics per AAP guidelines'
        },
        {
          condition: {
            and: [
              { field: 'age', operator: '>=', value: 2 },
              { field: 'severity', value: 'severe' }
            ]
          },
          label: 'Age ≥2 years with severe symptoms',
          next: 'severe_aom_treatment',
          rationale: 'Severe symptoms warrant immediate antibiotic therapy'
        },
        {
          condition: {
            and: [
              { field: 'age', operator: '>=', value: 2 },
              { field: 'severity', value: 'mild' }
            ]
          },
          label: 'Age ≥2 years with mild symptoms',
          next: 'observation_vs_treatment',
          rationale: 'Observation may be appropriate for mild symptoms'
        }
      ]
    },

    infant_aom_treatment: {
      id: 'infant_aom_treatment',
      type: NODE_TYPES.OUTCOME,
      title: 'AOM Treatment for Children <2 Years',
      recommendations: {
        firstLine: {
          drug: 'amoxicillin',
          dose: '80-90 mg/kg/day divided BID-TID',
          duration: '10 days',
          rationale: 'High-dose amoxicillin first-line per AAP guidelines'
        },
        alternatives: [
          {
            drug: 'amoxicillin-clavulanate',
            dose: '90 mg/kg/day (amoxicillin component) divided BID',
            indication: 'Amoxicillin failure, recent antibiotic use, severe illness',
            rationale: 'Covers beta-lactamase producing H. influenzae'
          },
          {
            drug: 'azithromycin',
            dose: '10 mg/kg day 1, then 5 mg/kg days 2-5',
            indication: 'Penicillin allergy',
            rationale: 'Alternative for penicillin-allergic patients'
          }
        ]
      },
      followUp: {
        timing: '48-72 hours if not improving',
        duration: '10 days for children <2 years'
      },
      evidenceLevel: 'A'
    },

    observation_vs_treatment: {
      id: 'observation_vs_treatment',
      type: NODE_TYPES.DECISION,
      title: 'Observation vs Immediate Treatment',
      question: 'Is observation appropriate?',
      criteria: [
        'Reliable caregivers',
        'Easy follow-up access',
        'Mild otalgia',
        'Temperature <39°C'
      ],
      branches: [
        {
          condition: { field: 'observation_appropriate', value: true },
          label: 'Observation appropriate',
          next: 'observation_plan',
          rationale: '48-72 hour observation with rescue antibiotic prescription'
        },
        {
          condition: { field: 'observation_appropriate', value: false },
          label: 'Immediate treatment preferred',
          next: 'mild_aom_treatment',
          rationale: 'Start antibiotics immediately'
        }
      ]
    },

    observation_plan: {
      id: 'observation_plan',
      type: NODE_TYPES.OUTCOME,
      title: 'Watchful Waiting Plan',
      recommendations: {
        primary: '48-72 hour observation period',
        instructions: [
          'Pain management with acetaminophen/ibuprofen',
          'Return if: fever >39°C, worsening pain, no improvement in 48-72h',
          'Provide rescue antibiotic prescription'
        ],
        rescueAntibiotic: {
          drug: 'amoxicillin',
          dose: '80-90 mg/kg/day divided BID-TID',
          duration: '7 days',
          instructions: 'Start if no improvement by 48-72 hours'
        }
      },
      evidenceLevel: 'A'
    }
  }
};

/**
 * Master decision tree registry
 * Maps condition IDs to their respective decision trees
 */
export const DECISION_TREE_REGISTRY = {
  'community-acquired-pneumonia': COMMUNITY_ACQUIRED_PNEUMONIA_TREE,
  'urinary-tract-infection': URINARY_TRACT_INFECTION_TREE,
  'otitis-media': OTITIS_MEDIA_TREE
};

/**
 * Get decision tree by condition ID
 * @param {string} conditionId - The condition identifier
 * @returns {Object|null} Decision tree data structure
 */
export const getDecisionTree = (conditionId) => {
  return DECISION_TREE_REGISTRY[conditionId] || null;
};

/**
 * Get all available decision trees
 * @returns {Array} List of available decision trees
 */
export const getAvailableDecisionTrees = () => {
  return Object.keys(DECISION_TREE_REGISTRY).map(id => ({
    id,
    name: DECISION_TREE_REGISTRY[id].name,
    description: DECISION_TREE_REGISTRY[id].description,
    ageRange: DECISION_TREE_REGISTRY[id].ageRange
  }));
};

/**
 * Validate clinical inputs for a specific decision tree
 * @param {Object} inputs - Clinical input data
 * @param {string} conditionId - Decision tree ID
 * @returns {Object} Validation result with errors/warnings
 */
export const validateClinicalInputs = (inputs, conditionId) => {
  const tree = getDecisionTree(conditionId);
  if (!tree) {
    return { isValid: false, errors: ['Invalid condition ID'] };
  }

  const errors = [];
  const warnings = [];

  // Age validation
  if (inputs.age < tree.ageRange.min || inputs.age > tree.ageRange.max) {
    errors.push(`Age ${inputs.age} years is outside the supported range for ${tree.name}`);
  }

  // Required field validation
  if (conditionId === 'urinary-tract-infection' && !inputs.gender) {
    errors.push('Gender is required for UTI management decisions');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export default DECISION_TREE_REGISTRY;