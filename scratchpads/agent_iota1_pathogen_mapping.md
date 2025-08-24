# Agent Iota-1 Scratchpad - Pathogen-Antibiotic Mapping Integration
**Start Time**: Monday 1:00 PM  
**End Time**: Monday 5:00 PM  
**Dependencies**: Eta-1 data model (can use draft structures)  
**Track**: Medical Data Integration  
**Agent Series**: Clinical Decision Visualization Specialists

## 🎯 Objective
Connect decision trees to the existing comprehensive pathogen/antibiotic databases (29 pathogens, 30 antibiotics), creating intelligent mapping systems that power clinical decision pathways with evidence-based treatment recommendations.

## 📋 Deliverables Checklist
- [ ] **Data Mapper Creation**: Create `src/utils/decisionTreeDataMapper.js` with intelligent mapping functions
- [ ] **Pathogen Integration**: Map 29 pathogens to specific decision tree pathways
- [ ] **Antibiotic Connection**: Connect 30 antibiotics to treatment outcome nodes
- [ ] **Dosing Calculations**: Implement pediatric dosing calculation utilities
- [ ] **Contraindication Checks**: Add safety validation for drug allergies and interactions
- [ ] **Spectrum Mapping**: Create antibiotic spectrum to pathogen effectiveness mappings
- [ ] **Clinical Guidelines**: Integrate AAP/IDSA recommendations with pathogen data
- [ ] **Performance Optimization**: Cache frequently accessed mappings for clinical speed

## 🔧 Technical Implementation

### Core Data Mapper Structure
```javascript
// Main mapping utilities connecting decision trees to existing data
import { simplePathogens } from '../data/SimplePathogenData';
import { simpleAntibiotics } from '../data/SimpleAntibioticData';
import { medicalConditions } from '../data/medicalConditions';
import { pathogenAntibioticMap } from '../data/pathogenAntibioticMap';

class DecisionTreeDataMapper {
  constructor() {
    this.pathogenCache = new Map();
    this.antibioticCache = new Map();
    this.dosingCache = new Map();
  }

  // Map condition to relevant pathogens
  getPathogensForCondition(conditionName) {
    // Return pathogens commonly associated with condition
  }

  // Get antibiotic recommendations for pathogen
  getAntibioticsForPathogen(pathogenName, patientFactors) {
    // Return ranked antibiotic recommendations
  }

  // Calculate pediatric dosing
  calculateDosing(antibiotic, weight, age, indication) {
    // Return appropriate pediatric dosing
  }

  // Check for contraindications
  validateTreatment(antibiotic, allergies, comorbidities) {
    // Return safety validation results
  }
}
```

### Condition-Pathogen Mapping System
```javascript
// Link medical conditions to their common pathogens
const conditionPathogenMap = {
  'community-acquired-pneumonia': {
    pathogens: [
      {
        name: 'Streptococcus pneumoniae',
        prevalence: 'high',
        ageGroups: ['all'],
        severity: ['mild', 'moderate', 'severe'],
        notes: 'Most common bacterial cause in all age groups'
      },
      {
        name: 'Haemophilus influenzae',
        prevalence: 'moderate',
        ageGroups: ['infant', 'preschool'],
        severity: ['moderate', 'severe'],
        notes: 'More common in younger children'
      },
      {
        name: 'Mycoplasma pneumoniae',
        prevalence: 'moderate',
        ageGroups: ['school-age', 'adolescent'],
        severity: ['mild', 'moderate'],
        notes: 'Atypical pneumonia, walking pneumonia'
      },
      {
        name: 'Respiratory Syncytial Virus',
        prevalence: 'high',
        ageGroups: ['neonate', 'infant'],
        severity: ['mild', 'severe'],
        notes: 'Most common viral cause in infants'
      }
    ],
    firstLineAntibiotics: ['amoxicillin', 'amoxicillin-clavulanate'],
    secondLineAntibiotics: ['azithromycin', 'cefdinir', 'levofloxacin'],
    guidelines: {
      source: 'AAP-2011-Pneumonia',
      recommendations: {
        'first-line': 'Amoxicillin for typical pneumonia',
        'atypical': 'Azithromycin for atypical pneumonia',
        'hospitalization': 'Consider for severe disease'
      }
    }
  },
  
  'acute-otitis-media': {
    pathogens: [
      {
        name: 'Streptococcus pneumoniae',
        prevalence: 'high',
        ageGroups: ['all'],
        resistance: 'increasing'
      },
      {
        name: 'Haemophilus influenzae',
        prevalence: 'moderate',
        ageGroups: ['infant', 'preschool'],
        betaLactamaseProduction: 'common'
      },
      {
        name: 'Moraxella catarrhalis',
        prevalence: 'moderate',
        betaLactamaseProduction: 'universal'
      }
    ],
    firstLineAntibiotics: ['amoxicillin', 'amoxicillin-clavulanate'],
    guidelines: {
      source: 'AAP-2013-AOM',
      watchfulWaiting: {
        criteria: ['age > 6 months', 'unilateral', 'mild symptoms'],
        duration: '48-72 hours'
      }
    }
  }
  // Additional condition mappings...
};
```

### Antibiotic Spectrum Integration
```javascript
// Enhanced antibiotic data with spectrum mapping
const antibioticSpectrumMap = {
  'amoxicillin': {
    spectrum: {
      gramPositive: ['Streptococcus pneumoniae', 'Streptococcus pyogenes'],
      gramNegative: ['Haemophilus influenzae-sensitive'],
      anaerobes: ['limited'],
      atypical: ['none']
    },
    effectiveness: {
      'Streptococcus pneumoniae': {
        susceptibility: '85%',
        resistance: 'increasing',
        notes: 'High-dose amoxicillin for resistant strains'
      },
      'Haemophilus influenzae': {
        susceptibility: '70%',
        resistance: 'beta-lactamase production',
        alternative: 'amoxicillin-clavulanate'
      }
    },
    clinicalUse: {
      firstLine: ['pneumonia', 'otitis-media', 'strep-pharyngitis'],
      contraindications: ['penicillin-allergy'],
      monitoring: ['none-required']
    }
  },
  
  'azithromycin': {
    spectrum: {
      gramPositive: ['Streptococcus pneumoniae', 'Streptococcus pyogenes'],
      gramNegative: ['Haemophilus influenzae'],
      atypical: ['Mycoplasma pneumoniae', 'Chlamydophila pneumoniae'],
      anaerobes: ['limited']
    },
    effectiveness: {
      'Mycoplasma pneumoniae': {
        susceptibility: '95%',
        notes: 'Drug of choice for atypical pneumonia'
      },
      'Streptococcus pneumoniae': {
        susceptibility: '75%',
        resistance: 'increasing macrolide resistance'
      }
    },
    clinicalUse: {
      firstLine: ['atypical-pneumonia', 'penicillin-allergic'],
      duration: '5 days',
      advantages: ['once-daily', 'short-course']
    }
  }
  // Additional antibiotic mappings...
};
```

### Pediatric Dosing Calculator
```javascript
// Comprehensive pediatric dosing calculations
class PediatricDosingCalculator {
  constructor() {
    this.dosingDatabase = {
      'amoxicillin': {
        indications: {
          'pneumonia': {
            dose: '90 mg/kg/day',
            frequency: 'twice daily',
            maxDose: '4000 mg/day',
            duration: '10 days'
          },
          'otitis-media': {
            dose: '80-90 mg/kg/day',
            frequency: 'twice daily',
            maxDose: '3000 mg/day',
            duration: '10 days'
          },
          'strep-pharyngitis': {
            dose: '50 mg/kg/day',
            frequency: 'twice daily',
            maxDose: '2000 mg/day',
            duration: '10 days'
          }
        },
        formulations: [
          { type: 'suspension', concentrations: ['200mg/5ml', '400mg/5ml'] },
          { type: 'tablet', strengths: ['500mg', '875mg'] },
          { type: 'capsule', strengths: ['250mg', '500mg'] }
        ],
        renalAdjustment: {
          creatinine: {
            '30-50': 'reduce dose by 25%',
            '<30': 'reduce dose by 50%'
          }
        }
      },
      
      'azithromycin': {
        indications: {
          'atypical-pneumonia': {
            dose: '10 mg/kg day 1, then 5 mg/kg days 2-5',
            frequency: 'once daily',
            maxDose: '500 mg day 1, 250 mg days 2-5',
            duration: '5 days'
          },
          'strep-pharyngitis': {
            dose: '12 mg/kg/day',
            frequency: 'once daily',
            maxDose: '500 mg/day',
            duration: '5 days'
          }
        },
        formulations: [
          { type: 'suspension', concentrations: ['200mg/5ml'] },
          { type: 'tablet', strengths: ['250mg', '500mg'] }
        ]
      }
      // Additional medication dosing...
    };
  }

  calculateDose(medication, indication, weight, age) {
    const medData = this.dosingDatabase[medication];
    if (!medData || !medData.indications[indication]) {
      throw new Error(`Dosing data not found for ${medication} in ${indication}`);
    }

    const dosing = medData.indications[indication];
    
    // Parse dose string (e.g., "90 mg/kg/day")
    const doseMatch = dosing.dose.match(/(\d+(?:-\d+)?)\s*mg\/kg/);
    if (!doseMatch) {
      throw new Error(`Invalid dose format: ${dosing.dose}`);
    }

    const dosePerKg = this.parseDoseRange(doseMatch[1]);
    const totalDailyDose = Math.min(dosePerKg * weight, this.parseMaxDose(dosing.maxDose));
    
    return {
      totalDailyDose: Math.round(totalDailyDose),
      frequency: dosing.frequency,
      duration: dosing.duration,
      dosePerAdmin: this.calculateDosePerAdmin(totalDailyDose, dosing.frequency),
      formulations: medData.formulations,
      clinicalNotes: this.generateDosingNotes(medication, indication, weight, age)
    };
  }

  parseDoseRange(doseString) {
    if (doseString.includes('-')) {
      const [min, max] = doseString.split('-').map(Number);
      return max; // Use higher dose for serious infections
    }
    return Number(doseString);
  }

  parseMaxDose(maxDoseString) {
    const match = maxDoseString.match(/(\d+)/);
    return match ? Number(match[1]) : Infinity;
  }

  calculateDosePerAdmin(totalDose, frequency) {
    const frequencyMap = {
      'once daily': 1,
      'twice daily': 2,
      'three times daily': 3,
      'four times daily': 4
    };
    
    const timesPerDay = frequencyMap[frequency] || 1;
    return Math.round(totalDose / timesPerDay);
  }

  generateDosingNotes(medication, indication, weight, age) {
    const notes = [];
    
    // Weight-based considerations
    if (weight < 10) {
      notes.push('Consider liquid formulation for young children');
    }
    
    // Age-based considerations
    if (age < 0.5) { // 6 months
      notes.push('Verify safety in infants under 6 months');
    }
    
    // Medication-specific notes
    if (medication === 'amoxicillin' && indication === 'pneumonia') {
      notes.push('High-dose amoxicillin for pneumococcal resistance');
    }
    
    if (medication === 'azithromycin') {
      notes.push('Take with or without food; cardiac monitoring if prolonged QT');
    }
    
    return notes;
  }
}
```

### Contraindication Validation System
```javascript
// Safety validation for treatment recommendations
class ContraindicationValidator {
  constructor() {
    this.allergyDatabase = {
      'penicillin': {
        severity: 'severe',
        crossReactions: ['amoxicillin', 'ampicillin', 'penicillin-v'],
        cautiousUse: ['cephalexin', 'cefdinir'], // 10% cross-reactivity
        alternatives: ['azithromycin', 'clindamycin', 'levofloxacin']
      },
      
      'sulfa': {
        severity: 'moderate',
        crossReactions: ['trimethoprim-sulfamethoxazole'],
        alternatives: ['azithromycin', 'cephalexin', 'clindamycin']
      },
      
      'macrolides': {
        severity: 'moderate',
        crossReactions: ['azithromycin', 'clarithromycin', 'erythromycin'],
        alternatives: ['amoxicillin', 'cephalexin', 'clindamycin']
      }
    };

    this.drugInteractions = {
      'azithromycin': {
        warnings: [
          {
            drug: 'warfarin',
            severity: 'major',
            mechanism: 'CYP inhibition',
            management: 'Monitor INR closely'
          },
          {
            drug: 'qtc-prolonging-drugs',
            severity: 'major',
            mechanism: 'QTc prolongation',
            management: 'Avoid or monitor ECG'
          }
        ]
      }
    };
  }

  validateTreatment(antibiotic, patientFactors) {
    const validationResult = {
      safe: true,
      warnings: [],
      alternatives: [],
      contraindications: []
    };

    // Check allergies
    if (patientFactors.allergies) {
      const allergyCheck = this.checkAllergies(antibiotic, patientFactors.allergies);
      if (allergyCheck.contraindicated) {
        validationResult.safe = false;
        validationResult.contraindications.push(allergyCheck.reason);
        validationResult.alternatives = allergyCheck.alternatives;
      } else if (allergyCheck.cautious) {
        validationResult.warnings.push(allergyCheck.warning);
      }
    }

    // Check drug interactions
    if (patientFactors.currentMedications) {
      const interactionCheck = this.checkInteractions(antibiotic, patientFactors.currentMedications);
      if (interactionCheck.major.length > 0) {
        validationResult.warnings.push(...interactionCheck.major);
      }
    }

    // Check age-specific considerations
    const ageCheck = this.checkAgeRestrictions(antibiotic, patientFactors.age);
    if (ageCheck.restricted) {
      validationResult.safe = false;
      validationResult.contraindications.push(ageCheck.reason);
    }

    return validationResult;
  }

  checkAllergies(antibiotic, allergies) {
    for (const allergy of allergies) {
      const allergyData = this.allergyDatabase[allergy.toLowerCase()];
      if (allergyData) {
        if (allergyData.crossReactions.includes(antibiotic)) {
          return {
            contraindicated: true,
            reason: `Cross-reactivity with ${allergy} allergy`,
            alternatives: allergyData.alternatives
          };
        }
        
        if (allergyData.cautiousUse?.includes(antibiotic)) {
          return {
            cautious: true,
            warning: `Use caution - potential cross-reactivity with ${allergy}`
          };
        }
      }
    }
    
    return { contraindicated: false };
  }

  checkInteractions(antibiotic, medications) {
    const interactions = { major: [], moderate: [], minor: [] };
    const drugData = this.drugInteractions[antibiotic];
    
    if (drugData) {
      for (const warning of drugData.warnings) {
        if (medications.some(med => med.includes(warning.drug))) {
          interactions[warning.severity].push({
            description: `${antibiotic} + ${warning.drug}: ${warning.mechanism}`,
            management: warning.management
          });
        }
      }
    }
    
    return interactions;
  }

  checkAgeRestrictions(antibiotic, ageInYears) {
    const restrictions = {
      'levofloxacin': {
        minimumAge: 18,
        reason: 'Risk of tendon rupture in pediatric patients'
      },
      'doxycycline': {
        minimumAge: 8,
        reason: 'Dental staining and enamel dysplasia'
      }
    };

    const restriction = restrictions[antibiotic];
    if (restriction && ageInYears < restriction.minimumAge) {
      return {
        restricted: true,
        reason: restriction.reason
      };
    }

    return { restricted: false };
  }
}
```

## 📊 Integration with Existing Data

### Pathogen Database Enhancement
```javascript
// Enhance existing pathogen data with decision tree context
const enhancedPathogenData = simplePathogens.map(pathogen => ({
  ...pathogen,
  decisionTreeContext: {
    commonConditions: this.getConditionsForPathogen(pathogen.name),
    agePrevalence: this.getAgePrevalence(pathogen.name),
    seasonality: this.getSeasonality(pathogen.name),
    resistancePatterns: this.getResistancePatterns(pathogen.name)
  }
}));
```

### Performance Caching System
```javascript
// Cache frequently accessed mappings for clinical speed
class MappingCache {
  constructor() {
    this.cache = new Map();
    this.hitCount = new Map();
    this.maxSize = 1000; // Limit cache size
  }

  get(key) {
    if (this.cache.has(key)) {
      this.hitCount.set(key, (this.hitCount.get(key) || 0) + 1);
      return this.cache.get(key);
    }
    return null;
  }

  set(key, value) {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const leastUsed = this.findLeastUsedKey();
      this.cache.delete(leastUsed);
      this.hitCount.delete(leastUsed);
    }
    
    this.cache.set(key, value);
    this.hitCount.set(key, 0);
  }

  findLeastUsedKey() {
    let minHits = Infinity;
    let leastUsedKey = null;
    
    for (const [key, hits] of this.hitCount) {
      if (hits < minHits) {
        minHits = hits;
        leastUsedKey = key;
      }
    }
    
    return leastUsedKey;
  }
}
```

## 🧪 Testing Strategy

### Medical Accuracy Testing
```javascript
describe('Pathogen-Antibiotic Mapping', () => {
  describe('Condition Mapping', () => {
    test('pneumonia returns correct pathogens by age', () => {
      const infantPathogens = mapper.getPathogensForCondition('pneumonia', { age: 0.5 });
      expect(infantPathogens).toContain('Respiratory Syncytial Virus');
      
      const schoolAgePathogens = mapper.getPathogensForCondition('pneumonia', { age: 8 });
      expect(schoolAgePathogens).toContain('Mycoplasma pneumoniae');
    });
  });

  describe('Dosing Calculations', () => {
    test('calculates correct pediatric amoxicillin dose', () => {
      const dosing = calculator.calculateDose('amoxicillin', 'pneumonia', 20, 3);
      expect(dosing.totalDailyDose).toBe(1800); // 90 mg/kg/day * 20 kg
      expect(dosing.dosePerAdmin).toBe(900); // Twice daily
    });

    test('applies maximum dose limits', () => {
      const dosing = calculator.calculateDose('amoxicillin', 'pneumonia', 60, 12);
      expect(dosing.totalDailyDose).toBeLessThanOrEqual(4000); // Max dose
    });
  });

  describe('Safety Validation', () => {
    test('detects penicillin allergy contraindications', () => {
      const result = validator.validateTreatment('amoxicillin', {
        allergies: ['penicillin']
      });
      expect(result.safe).toBe(false);
      expect(result.alternatives).toContain('azithromycin');
    });
  });
});
```

### Performance Testing
```javascript
describe('Mapping Performance', () => {
  test('pathogen lookup completes within 10ms', async () => {
    const startTime = performance.now();
    const result = mapper.getPathogensForCondition('pneumonia');
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(10);
  });

  test('dosing calculation completes within 5ms', async () => {
    const startTime = performance.now();
    const result = calculator.calculateDose('amoxicillin', 'pneumonia', 20, 3);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(5);
  });
});
```

## 📋 Implementation Timeline

### 1:00 PM - 2:00 PM: Core Mapper Setup
- [ ] Create DecisionTreeDataMapper class structure
- [ ] Implement condition-pathogen mapping
- [ ] Set up data imports and basic functions

### 2:00 PM - 3:00 PM: Antibiotic Integration
- [ ] Build antibiotic spectrum mapping
- [ ] Implement effectiveness calculations
- [ ] Connect to existing antibiotic data

### 3:00 PM - 3:30 PM: Break & Progress Review

### 3:30 PM - 4:30 PM: Dosing Calculator
- [ ] Implement PediatricDosingCalculator class
- [ ] Add comprehensive medication dosing database
- [ ] Create dose calculation and validation functions

### 4:30 PM - 5:00 PM: Safety & Testing
- [ ] Implement ContraindicationValidator
- [ ] Add allergy and interaction checking
- [ ] Write comprehensive test suite

## 🔗 Integration Dependencies

### From Eta-1 (Data Model)
- **Tree Structures**: Use decision tree schemas for mapping
- **Medical Context**: Leverage evidence levels and clinical guidance
- **Node Types**: Connect to decision, action, and outcome nodes

### Providing To
- **Kappa-1**: Pathogen and antibiotic data for condition-specific trees
- **All Visualization**: Clinical data integration for decision pathways

## 📈 Success Criteria

### By Monday 5:00 PM
- [ ] **Mapper Complete**: DecisionTreeDataMapper fully functional
- [ ] **29 Pathogens**: All pathogens mapped to relevant conditions
- [ ] **30 Antibiotics**: All antibiotics connected to treatment pathways
- [ ] **Dosing System**: Pediatric dosing calculations operational
- [ ] **Safety Validation**: Contraindication checking implemented
- [ ] **Performance**: <10ms lookup times for clinical efficiency
- [ ] **Tests**: Comprehensive test coverage with medical validation
- [ ] **Integration**: Ready for condition tree builders and visualization

### Quality Gates
- **Medical Accuracy**: 100% evidence-based recommendations
- **Safety First**: No contraindicated treatment suggestions
- **Performance**: Sub-clinical-threshold response times
- **Data Integrity**: All mappings validated and tested

---

**Agent**: Iota-1 (Pathogen-Antibiotic Mapping Integration)  
**Status**: Ready for afternoon execution  
**Critical Success Factor**: Medical safety and evidence-based accuracy  
**Performance Target**: <10ms clinical data lookup with comprehensive validation