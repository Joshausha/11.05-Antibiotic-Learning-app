/**
 * ClinicalInputPanel.js
 * 
 * Clinical data input interface for evidence-based antibiotic decision support.
 * Optimized for rapid clinical data entry with pediatric-specific validation.
 * 
 * Features:
 * - Rapid clinical data entry (<15 second target)
 * - Pediatric-specific input validation and calculations  
 * - Real-time allergy cross-reactivity alerts
 * - Severity assessment with visual indicators
 * - Touch-friendly mobile interface for clinical environments
 * - WCAG 2.1 accessibility compliance
 * - Emergency mode with streamlined workflow
 * - Intelligent form progression and validation
 * 
 * Medical Accuracy: Input validation based on clinical guidelines
 * Educational Level: Medical students, residents, practicing clinicians
 * 
 * @author Claude Code Assistant
 * @version 1.0.0
 * @medical-disclaimer Educational purposes only - not for clinical practice
 */

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AlertTriangle, User, Heart, Clock, Shield, Info } from 'lucide-react';

/**
 * Clinical input validation constants
 */
const CLINICAL_CONSTANTS = {
  AGE_RANGES: {
    NEONATE: { min: 0, max: 0.08 },      // 0-1 month
    INFANT: { min: 0.08, max: 2 },       // 1-24 months  
    CHILD: { min: 2, max: 12 },          // 2-12 years
    ADOLESCENT: { min: 12, max: 18 }     // 12-18 years
  },
  
  WEIGHT_RANGES: {
    NEONATE: { min: 2, max: 5 },         // kg
    INFANT: { min: 3, max: 15 },         // kg
    CHILD: { min: 10, max: 50 },         // kg
    ADOLESCENT: { min: 30, max: 80 }     // kg
  },
  
  COMMON_ALLERGIES: [
    'penicillin', 'amoxicillin', 'cephalexin', 'sulfa', 'erythromycin',
    'clindamycin', 'vancomycin', 'gentamicin', 'ciprofloxacin'
  ],
  
  SEVERITY_LEVELS: [
    { value: 'mild', label: 'Mild', color: '#10b981' },
    { value: 'moderate', label: 'Moderate', color: '#f59e0b' },
    { value: 'severe', label: 'Severe', color: '#dc2626' },
    { value: 'critical', label: 'Critical', color: '#7c2d12' }
  ],
  
  COMMON_COMORBIDITIES: [
    'asthma', 'diabetes', 'immunocompromised', 'renal_disease', 
    'liver_disease', 'heart_disease', 'seizure_disorder', 'prematurity'
  ],
  
  RECENT_ANTIBIOTICS: [
    'amoxicillin', 'azithromycin', 'cephalexin', 'amoxicillin-clavulanate',
    'trimethoprim-sulfamethoxazole', 'doxycycline', 'clindamycin'
  ]
};

/**
 * Clinical input panel component for rapid data collection
 */
const ClinicalInputPanel = ({
  initialData = {},
  onInputChange = () => {},
  onInputComplete = () => {},
  emergencyMode = false,
  condition = 'community-acquired-pneumonia',
  className = '',
  autoFocus = true,
  showValidationErrors = true
}) => {
  // Input state management
  const [inputs, setInputs] = useState({
    age: initialData.age || '',
    weight: initialData.weight || '',
    allergies: initialData.allergies || [],
    severity: initialData.severity || '',
    comorbidities: initialData.comorbidities || [],
    recentAntibiotics: initialData.recentAntibiotics || [],
    localResistance: initialData.localResistance || '',
    additionalNotes: initialData.additionalNotes || '',
    ...initialData
  });
  
  // UI state
  const [validationErrors, setValidationErrors] = useState({});
  const [activeSection, setActiveSection] = useState('demographics');
  const [crossReactivityWarnings, setCrossReactivityWarnings] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  
  // Refs for focus management and performance
  const firstInputRef = useRef(null);
  const formRef = useRef(null);

  /**
   * Validate age input with pediatric considerations
   */
  const validateAge = useCallback((age) => {
    const ageNum = parseFloat(age);
    
    if (!age || isNaN(ageNum)) {
      return 'Age is required for proper antibiotic selection';
    }
    
    if (ageNum < 0 || ageNum > 25) {
      return 'Please enter a valid age (0-25 years)';
    }
    
    if (ageNum < 0.08) {
      return 'Neonatal patients require specialized dosing protocols';
    }
    
    return null;
  }, []);

  /**
   * Validate weight input based on age group
   */
  const validateWeight = useCallback((weight, age) => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    
    if (ageNum < 12 && (!weight || isNaN(weightNum))) {
      return 'Weight is required for pediatric dosing (patients under 12)';
    }
    
    if (weight && !isNaN(weightNum)) {
      if (weightNum < 1 || weightNum > 150) {
        return 'Please enter a valid weight (1-150 kg)';
      }
      
      // Age-based weight validation
      const ageGroup = getAgeGroup(ageNum);
      const expectedRange = CLINICAL_CONSTANTS.WEIGHT_RANGES[ageGroup];
      
      if (expectedRange && (weightNum < expectedRange.min || weightNum > expectedRange.max)) {
        return `Weight seems unusual for age group (expected: ${expectedRange.min}-${expectedRange.max} kg)`;
      }
    }
    
    return null;
  }, []);

  /**
   * Get age group classification for clinical calculations
   */
  const getAgeGroup = useCallback((age) => {
    const ageNum = parseFloat(age);
    
    if (ageNum <= CLINICAL_CONSTANTS.AGE_RANGES.NEONATE.max) return 'NEONATE';
    if (ageNum <= CLINICAL_CONSTANTS.AGE_RANGES.INFANT.max) return 'INFANT';
    if (ageNum <= CLINICAL_CONSTANTS.AGE_RANGES.CHILD.max) return 'CHILD';
    if (ageNum <= CLINICAL_CONSTANTS.AGE_RANGES.ADOLESCENT.max) return 'ADOLESCENT';
    return 'ADULT';
  }, []);

  /**
   * Check for antibiotic cross-reactivity based on allergies
   */
  const checkCrossReactivity = useCallback((allergies) => {
    const warnings = [];
    
    if (allergies.includes('penicillin')) {
      warnings.push({
        type: 'cross-reactivity',
        severity: 'moderate',
        message: 'Penicillin allergy: 5-10% cross-reactivity risk with cephalosporins',
        affectedDrugs: ['amoxicillin', 'ampicillin', 'cephalexin', 'ceftriaxone'],
        recommendation: 'Consider alternative classes or careful cephalosporin use with monitoring'
      });
    }
    
    if (allergies.includes('sulfa')) {
      warnings.push({
        type: 'contraindication',
        severity: 'high',
        message: 'Sulfa allergy: Avoid trimethoprim-sulfamethoxazole',
        affectedDrugs: ['trimethoprim-sulfamethoxazole'],
        recommendation: 'Use alternative antimicrobial agents'
      });
    }
    
    if (allergies.includes('erythromycin') && allergies.includes('clindamycin')) {
      warnings.push({
        type: 'cross-reactivity',
        severity: 'moderate', 
        message: 'Macrolide and clindamycin allergies limit oral options',
        affectedDrugs: ['azithromycin', 'clarithromycin', 'clindamycin'],
        recommendation: 'Consider non-macrolide alternatives'
      });
    }
    
    return warnings;
  }, []);

  /**
   * Validate all inputs and return validation errors
   */
  const validateInputs = useCallback(() => {
    const errors = {};
    
    // Age validation
    const ageError = validateAge(inputs.age);
    if (ageError) errors.age = ageError;
    
    // Weight validation  
    const weightError = validateWeight(inputs.weight, inputs.age);
    if (weightError) errors.weight = weightError;
    
    // Severity validation
    if (!inputs.severity) {
      errors.severity = 'Clinical severity assessment is required';
    }
    
    // Allergy validation
    if (inputs.allergies.length > 0) {
      const crossReactivityWarnings = checkCrossReactivity(inputs.allergies);
      setCrossReactivityWarnings(crossReactivityWarnings);
    } else {
      setCrossReactivityWarnings([]);
    }
    
    return errors;
  }, [inputs, validateAge, validateWeight, checkCrossReactivity]);

  /**
   * Handle input changes with real-time validation
   */
  const handleInputChange = useCallback((field, value) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
    
    // Clear specific field error when user starts correcting
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
    
    // Notify parent component
    onInputChange(field, value, newInputs);
    
    // Real-time validation for critical fields
    if (field === 'age' || field === 'weight') {
      setTimeout(() => {
        const errors = validateInputs();
        setValidationErrors(errors);
      }, 500); // Debounce validation
    }
  }, [inputs, validationErrors, onInputChange, validateInputs]);

  /**
   * Handle multi-select fields (allergies, comorbidities, etc.)
   */
  const handleMultiSelectChange = useCallback((field, item, checked) => {
    const currentArray = inputs[field] || [];
    const newArray = checked 
      ? [...currentArray, item]
      : currentArray.filter(x => x !== item);
    
    handleInputChange(field, newArray);
  }, [inputs, handleInputChange]);

  /**
   * Check if form is complete and valid
   */
  const checkFormCompletion = useCallback(() => {
    const errors = validateInputs();
    const hasErrors = Object.keys(errors).length > 0;
    const hasRequiredFields = inputs.age && inputs.severity;
    
    const complete = hasRequiredFields && !hasErrors;
    setIsComplete(complete);
    
    if (complete) {
      const completionTime = Date.now() - startTime;
      onInputComplete(inputs, { completionTime, crossReactivityWarnings });
    }
    
    return complete;
  }, [inputs, validateInputs, startTime, crossReactivityWarnings, onInputComplete]);

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [autoFocus]);

  // Check form completion on input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkFormCompletion();
    }, 300); // Debounce completion check
    
    return () => clearTimeout(timeoutId);
  }, [inputs, checkFormCompletion]);

  /**
   * Keyboard shortcuts for emergency mode
   */
  useEffect(() => {
    if (!emergencyMode) return;
    
    const handleKeyDown = (event) => {
      // Quick severity selection (1-4 keys)
      if (event.key >= '1' && event.key <= '4') {
        const severityIndex = parseInt(event.key) - 1;
        const severity = CLINICAL_CONSTANTS.SEVERITY_LEVELS[severityIndex];
        if (severity) {
          handleInputChange('severity', severity.value);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [emergencyMode, handleInputChange]);

  /**
   * Age group display for clinical context
   */
  const ageGroupDisplay = useMemo(() => {
    if (!inputs.age) return null;
    const group = getAgeGroup(inputs.age);
    return group.toLowerCase();
  }, [inputs.age, getAgeGroup]);

  return (
    <div 
      ref={formRef}
      className={`clinical-input-panel ${className} ${emergencyMode ? 'emergency-mode' : ''}`}
      role="form"
      aria-label="Clinical Information Input"
    >
      {/* Header with condition and completion status */}
      <div className="input-panel-header">
        <div className="condition-display">
          <h3>{condition.replace(/-/g, ' ').toUpperCase()}</h3>
          {ageGroupDisplay && (
            <span className="age-group-badge">
              {ageGroupDisplay}
            </span>
          )}
        </div>
        
        <div className="completion-indicator">
          {isComplete ? (
            <div className="completion-success">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Complete</span>
            </div>
          ) : (
            <div className="completion-progress">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span>In Progress</span>
            </div>
          )}
        </div>
      </div>

      {/* Cross-reactivity warnings */}
      {crossReactivityWarnings.length > 0 && (
        <div className="cross-reactivity-warnings">
          {crossReactivityWarnings.map((warning, index) => (
            <div 
              key={index} 
              className={`warning-alert ${warning.severity}`}
              role="alert"
            >
              <AlertTriangle className="w-4 h-4" />
              <div className="warning-content">
                <p className="warning-message">{warning.message}</p>
                <p className="warning-recommendation">{warning.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Demographics Section */}
      <div className="input-section demographics">
        <h4 className="section-title">
          <User className="w-4 h-4" />
          Patient Demographics
        </h4>
        
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="age" className="input-label">
              Age (years) *
            </label>
            <input
              ref={firstInputRef}
              id="age"
              type="number"
              step="0.1"
              min="0"
              max="25"
              value={inputs.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className={`clinical-input ${validationErrors.age ? 'error' : ''}`}
              placeholder="e.g., 5.5"
              aria-describedby="age-help age-error"
            />
            <div id="age-help" className="input-help">
              Enter age in years (decimals OK for infants)
            </div>
            {validationErrors.age && (
              <div id="age-error" className="input-error" role="alert">
                {validationErrors.age}
              </div>
            )}
          </div>
          
          <div className="input-group">
            <label htmlFor="weight" className="input-label">
              Weight (kg) {parseFloat(inputs.age) < 12 ? '*' : ''}
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              min="1"
              max="150"
              value={inputs.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className={`clinical-input ${validationErrors.weight ? 'error' : ''}`}
              placeholder="kg"
              aria-describedby="weight-help weight-error"
            />
            <div id="weight-help" className="input-help">
              Required for pediatric patients (&lt;12 years)
            </div>
            {validationErrors.weight && (
              <div id="weight-error" className="input-error" role="alert">
                {validationErrors.weight}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clinical Assessment Section */}
      <div className="input-section clinical-assessment">
        <h4 className="section-title">
          <Heart className="w-4 h-4" />
          Clinical Assessment
        </h4>
        
        <div className="severity-selection">
          <label className="input-label">Severity Assessment *</label>
          <div className="severity-options" role="radiogroup" aria-label="Severity assessment">
            {CLINICAL_CONSTANTS.SEVERITY_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleInputChange('severity', level.value)}
                className={`severity-option ${inputs.severity === level.value ? 'selected' : ''}`}
                style={{ '--severity-color': level.color }}
                role="radio"
                aria-checked={inputs.severity === level.value}
                aria-describedby={`severity-${level.value}-desc`}
              >
                <div className="severity-indicator"></div>
                <span className="severity-label">{level.label}</span>
                {emergencyMode && (
                  <span className="severity-shortcut">
                    ({CLINICAL_CONSTANTS.SEVERITY_LEVELS.indexOf(level) + 1})
                  </span>
                )}
              </button>
            ))}
          </div>
          {validationErrors.severity && (
            <div className="input-error" role="alert">
              {validationErrors.severity}
            </div>
          )}
        </div>
      </div>

      {/* Allergies Section */}
      <div className="input-section allergies">
        <h4 className="section-title">
          <AlertTriangle className="w-4 h-4" />
          Drug Allergies
        </h4>
        
        <div className="checkbox-grid">
          {CLINICAL_CONSTANTS.COMMON_ALLERGIES.map((allergy) => (
            <label key={allergy} className="checkbox-item">
              <input
                type="checkbox"
                checked={inputs.allergies.includes(allergy)}
                onChange={(e) => handleMultiSelectChange('allergies', allergy, e.target.checked)}
                className="clinical-checkbox"
              />
              <span className="checkbox-label">{allergy}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Comorbidities Section */}
      <div className="input-section comorbidities">
        <h4 className="section-title">
          <Info className="w-4 h-4" />
          Relevant Comorbidities
        </h4>
        
        <div className="checkbox-grid">
          {CLINICAL_CONSTANTS.COMMON_COMORBIDITIES.map((condition) => (
            <label key={condition} className="checkbox-item">
              <input
                type="checkbox"
                checked={inputs.comorbidities.includes(condition)}
                onChange={(e) => handleMultiSelectChange('comorbidities', condition, e.target.checked)}
                className="clinical-checkbox"
              />
              <span className="checkbox-label">
                {condition.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Recent Antibiotic History */}
      <div className="input-section recent-antibiotics">
        <h4 className="section-title">
          Recent Antibiotic Use (Past 30 Days)
        </h4>
        
        <div className="checkbox-grid">
          {CLINICAL_CONSTANTS.RECENT_ANTIBIOTICS.map((antibiotic) => (
            <label key={antibiotic} className="checkbox-item">
              <input
                type="checkbox"
                checked={inputs.recentAntibiotics.includes(antibiotic)}
                onChange={(e) => handleMultiSelectChange('recentAntibiotics', antibiotic, e.target.checked)}
                className="clinical-checkbox"
              />
              <span className="checkbox-label">{antibiotic}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="input-section additional-notes">
        <label htmlFor="additional-notes" className="input-label">
          Additional Clinical Notes
        </label>
        <textarea
          id="additional-notes"
          value={inputs.additionalNotes}
          onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
          className="clinical-textarea"
          placeholder="Any additional relevant clinical information..."
          rows="3"
          aria-describedby="notes-help"
        />
        <div id="notes-help" className="input-help">
          Include any relevant clinical context not covered above
        </div>
      </div>

      {/* Emergency mode instructions */}
      {emergencyMode && (
        <div className="emergency-instructions">
          <p>
            <strong>Emergency Mode:</strong> Use number keys 1-4 to quickly select severity.
            Focus on required fields (age, weight for pediatrics, severity).
          </p>
        </div>
      )}
    </div>
  );
};

export default ClinicalInputPanel;