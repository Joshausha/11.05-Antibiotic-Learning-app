---
type: developer-template
title: FUNCTION_DOCUMENTATION_TEMPLATE.md - Educational Function Documentation Standards
status: active-template
created: 2025-09-13
modified: 2025-09-13
tags: [documentation-template, educational-context, function-documentation, medical-education]
category: Projects
purpose: standardize-educational-function-documentation
structure: para-methodology
priority: development-reference
---

# FUNCTION_DOCUMENTATION_TEMPLATE.md - Educational Function Documentation Standards
**Standardized Templates for Medical Education Function Documentation**
*Last Updated: 2025-09-13*

> **🎓 TEMPLATE PURPOSE**: Ensure all medical functions maintain proper educational context and include appropriate disclaimers for student learning.

---

## 📝 **Standard Educational Function Template**

### **Template for Medical Education Functions:**

```javascript
/**
 * [Function Name] - FOR EDUCATIONAL PURPOSES ONLY
 *
 * EDUCATIONAL CONTEXT:
 * This function is designed exclusively for medical education and student learning.
 * It is NOT intended for clinical practice, patient care decisions, or real-world
 * treatment guidance. All outputs are for educational demonstration purposes only.
 *
 * LEARNING OBJECTIVE:
 * Students will be able to [specific learning goal, e.g., "understand antibiotic
 * spectrum coverage patterns" or "identify pathogen-antibiotic relationships"]
 *
 * EDUCATIONAL DISCLAIMER:
 * - For educational purposes only - consult clinical guidelines for patient care
 * - Always verify current local resistance patterns and guidelines in clinical practice
 * - Educational assumptions may not reflect real-world clinical complexity
 *
 * @param {Object} educationalData - Student learning data for educational analysis
 * @param {Array} educationalData.pathogens - Pathogen data for learning purposes
 * @param {Array} educationalData.antibiotics - Antibiotic data for educational analysis
 * @param {string} [educationalLevel="beginner"] - Student learning level (beginner/intermediate/advanced)
 * @returns {Object} Educational analysis results for student learning
 * @returns {Array} returns.learningPoints - Key educational concepts for student understanding
 * @returns {Object} returns.educationalSummary - Summary for learning assessment
 * @returns {Array} returns.studyRecommendations - Educational recommendations for further learning
 *
 * @example
 * // Educational example for student learning
 * const studentLearningData = {
 *   pathogens: [{ name: "Streptococcus pneumoniae", gramStain: "positive" }],
 *   antibiotics: [{ name: "Penicillin", spectrum: "gram-positive" }]
 * };
 *
 * const educationalAnalysis = analyzePathogenAntibioticRelationships(
 *   studentLearningData,
 *   "intermediate"
 * );
 *
 * console.log(educationalAnalysis.learningPoints);
 * // Output: Educational concepts for student learning
 *
 * @version 1.0.0
 * @since 2025-09-13
 * @author Medical Education Development Team
 */
function analyzePathogenAntibioticRelationships(educationalData, educationalLevel = "beginner") {
  // Validate educational data for student learning
  if (!educationalData || !educationalData.pathogens || !educationalData.antibiotics) {
    logEducationalError("Invalid educational data for student learning analysis");
    return generateDefaultEducationalResponse();
  }

  try {
    // Educational analysis logic for student learning
    const learningAnalysis = performEducationalAnalysis(educationalData, educationalLevel);

    // Generate educational recommendations for student study
    const studyRecommendations = generateEducationalRecommendations(
      learningAnalysis,
      educationalLevel
    );

    // Log educational interaction for learning progress tracking
    logEducationalInteraction("pathogen-antibiotic-analysis", {
      studentLevel: educationalLevel,
      pathogenCount: educationalData.pathogens.length,
      antibioticCount: educationalData.antibiotics.length,
      learningObjectivesMet: learningAnalysis.objectivesMet
    });

    return {
      learningPoints: learningAnalysis.keyLearningPoints,
      educationalSummary: learningAnalysis.studentSummary,
      studyRecommendations: studyRecommendations,
      educationalMetadata: {
        purpose: "medical-education-only",
        targetAudience: "medical-students-residents",
        disclaimers: ["educational-purposes-only", "not-clinical-guidance"]
      }
    };

  } catch (error) {
    logEducationalError("Educational analysis error", {
      error: error.message,
      context: "student-learning-analysis"
    });

    return generateEducationalErrorResponse({
      message: "Educational analysis temporarily unavailable for student learning",
      studyAlternatives: ["Review basic antibiotic classifications", "Study pathogen characteristics"]
    });
  }
}
```

---

## 🎯 **Specific Template Types**

### **1. Educational Analysis Functions:**

```javascript
/**
 * [Function Name] - Educational Analysis for Student Learning
 *
 * EDUCATIONAL CONTEXT: Analyzes [medical concept] for student understanding
 * LEARNING OBJECTIVE: Students will understand [specific learning goal]
 * TARGET AUDIENCE: Medical students, residents, nursing students
 *
 * @param {Object} studentData - Educational data for learning analysis
 * @returns {Object} Educational analysis for student comprehension
 */
function educationalAnalysisFunction(studentData) {
  // Educational analysis implementation
}
```

### **2. Learning Assessment Functions:**

```javascript
/**
 * [Function Name] - Learning Assessment for Educational Progress
 *
 * EDUCATIONAL CONTEXT: Assesses student understanding of [medical concept]
 * LEARNING OBJECTIVE: Evaluate student mastery of [specific learning goal]
 * ASSESSMENT TYPE: Formative assessment for learning progress
 *
 * @param {Object} learningData - Student learning progress data
 * @returns {Object} Educational assessment results for learning evaluation
 */
function learningAssessmentFunction(learningData) {
  // Learning assessment implementation
}
```

### **3. Educational Validation Functions:**

```javascript
/**
 * [Function Name] - Educational Content Validation for Student Learning
 *
 * EDUCATIONAL CONTEXT: Validates educational content accuracy for student learning
 * LEARNING OBJECTIVE: Ensure educational content supports learning objectives
 * VALIDATION TYPE: Educational accuracy validation (not clinical validation)
 *
 * @param {Object} educationalContent - Content for educational validation
 * @returns {Object} Educational validation results for learning content
 */
function educationalValidationFunction(educationalContent) {
  // Educational validation implementation
}
```

### **4. Study Recommendation Functions:**

```javascript
/**
 * [Function Name] - Study Recommendations for Educational Enhancement
 *
 * EDUCATIONAL CONTEXT: Generates study recommendations for [learning area]
 * LEARNING OBJECTIVE: Guide student learning toward mastery of [concept]
 * RECOMMENDATION TYPE: Educational study guidance (not clinical recommendations)
 *
 * @param {Object} learningProfile - Student learning profile and progress
 * @returns {Object} Educational study recommendations for continued learning
 */
function studyRecommendationFunction(learningProfile) {
  // Study recommendation implementation
}
```

---

## 🚫 **Anti-Patterns to AVOID**

### **❌ INCORRECT Clinical Documentation:**

```javascript
/**
 * Clinical Decision Support Function - WRONG ❌
 *
 * Provides treatment recommendations for patient care - WRONG ❌
 * Used for clinical decision making in patient treatment - WRONG ❌
 *
 * @param {Object} patientData - Patient clinical data - WRONG ❌
 * @returns {Object} Treatment recommendations for patient - WRONG ❌
 */
function clinicalDecisionFunction(patientData) {  // ❌ WRONG NAME
  // Clinical implementation - WRONG CONTEXT ❌
}
```

### **❌ INCORRECT Language Patterns:**
- "Clinical decision support" ❌
- "Patient treatment recommendations" ❌
- "Medical safety validation" ❌
- "Emergency clinical access" ❌
- "Point-of-care guidance" ❌

---

## 📚 **Required Documentation Elements**

### **✅ MANDATORY Components for All Medical Functions:**

1. **Educational Disclaimer**: Clear statement of educational purpose only
2. **Learning Objective**: Specific learning goal for students
3. **Target Audience**: Medical students, residents, nursing students, etc.
4. **Educational Context**: How this supports student learning
5. **Non-Clinical Warning**: Not for patient care or clinical decisions

### **✅ OPTIONAL but Recommended Components:**

1. **Study Prerequisites**: What students should know before using this function
2. **Related Learning Topics**: Connected educational concepts
3. **Assessment Integration**: How this connects to learning evaluation
4. **Educational Examples**: Sample usage for learning scenarios

---

## 🔧 **Implementation Guidelines**

### **Function Naming Standards:**

#### **✅ CORRECT Educational Function Names:**
- `analyzeEducational[Concept]()`
- `validateEducational[Content]()`
- `generateLearning[Recommendations]()`
- `assessStudent[Understanding]()`
- `trackLearning[Progress]()`

#### **❌ INCORRECT Clinical Function Names:**
- `analyzeClinical[Decision]()` ❌
- `validateMedical[Safety]()` ❌
- `generateTreatment[Plan]()` ❌
- `assessPatient[Risk]()` ❌
- `trackClinical[Outcomes]()` ❌

### **Parameter Naming Standards:**

#### **✅ CORRECT Educational Parameters:**
- `educationalData` (not `clinicalData`)
- `studentLevel` (not `clinicalContext`)
- `learningObjectives` (not `treatmentGoals`)
- `educationalContent` (not `clinicalProtocols`)

### **Return Value Standards:**

#### **✅ CORRECT Educational Return Values:**
```javascript
return {
  learningPoints: [...],           // Educational concepts
  studyRecommendations: [...],     // Learning suggestions
  educationalSummary: {...},       // Student-focused summary
  assessmentResults: {...},        // Learning evaluation
  educationalMetadata: {           // Educational context
    purpose: "medical-education-only",
    disclaimers: ["educational-purposes-only"]
  }
};
```

---

## ✅ **Quality Assurance Checklist**

### **Before Implementing Any Medical Function:**

#### **Educational Context Verification:**
- [ ] Function name uses educational terminology
- [ ] All parameters focus on learning data (not clinical data)
- [ ] Return values emphasize educational outcomes
- [ ] Documentation includes educational disclaimers
- [ ] Learning objectives clearly specified

#### **Language Audit:**
- [ ] No "clinical decision support" language
- [ ] No "patient care" references
- [ ] No "treatment recommendation" terminology
- [ ] All medical content marked as educational
- [ ] Appropriate student-focused language throughout

#### **Implementation Validation:**
- [ ] Function logic supports learning objectives
- [ ] Error handling maintains educational context
- [ ] Logging uses educational terminology
- [ ] Performance optimization for educational workflows
- [ ] Testing focuses on learning scenarios

---

## 📖 **Usage Examples**

### **Copy-Paste Ready Template:**

```javascript
/**
 * [FUNCTION_NAME] - FOR EDUCATIONAL PURPOSES ONLY
 *
 * EDUCATIONAL CONTEXT: [Description of educational purpose]
 * LEARNING OBJECTIVE: Students will be able to [specific learning goal]
 * TARGET AUDIENCE: [Medical students, residents, etc.]
 *
 * EDUCATIONAL DISCLAIMER:
 * - For educational purposes only - consult clinical guidelines for patient care
 * - Always verify current guidelines in clinical practice
 * - Educational assumptions may not reflect clinical complexity
 *
 * @param {Object} educationalData - [Description of educational data]
 * @returns {Object} Educational results for student learning
 */
function [FUNCTION_NAME](educationalData) {
  // Validate educational data
  if (!educationalData) {
    logEducationalError("Invalid educational data for student learning");
    return generateEducationalErrorResponse();
  }

  try {
    // Educational implementation logic
    const educationalResult = performEducationalAnalysis(educationalData);

    // Log educational interaction for learning progress
    logEducationalInteraction("[function-name]", {
      dataType: typeof educationalData,
      success: true
    });

    return {
      learningPoints: educationalResult.keyLearningPoints,
      educationalSummary: educationalResult.studentSummary,
      educationalMetadata: {
        purpose: "medical-education-only",
        disclaimers: ["educational-purposes-only"]
      }
    };

  } catch (error) {
    logEducationalError("Educational function error", {
      error: error.message,
      context: "student-learning"
    });

    return generateEducationalErrorResponse({
      message: "Educational function temporarily unavailable",
      studyAlternatives: ["Review related concepts", "Try alternative learning approach"]
    });
  }
}
```

---

## 🚀 **Integration with Development Workflow**

### **IDE Templates:**
Create code snippets in your IDE with this template for quick access:

**VS Code Snippet:**
```json
{
  "Educational Function Template": {
    "prefix": "edu-function",
    "body": [
      "/**",
      " * ${1:FunctionName} - FOR EDUCATIONAL PURPOSES ONLY",
      " *",
      " * EDUCATIONAL CONTEXT: ${2:Educational purpose description}",
      " * LEARNING OBJECTIVE: Students will be able to ${3:specific learning goal}",
      " * TARGET AUDIENCE: ${4:Medical students, residents, etc.}",
      " *",
      " * EDUCATIONAL DISCLAIMER:",
      " * - For educational purposes only - consult clinical guidelines for patient care",
      " * - Always verify current guidelines in clinical practice",
      " *",
      " * @param {Object} educationalData - ${5:Description of educational data}",
      " * @returns {Object} Educational results for student learning",
      " */",
      "function ${1:FunctionName}(educationalData) {",
      "  // Educational implementation",
      "  $0",
      "}"
    ],
    "description": "Template for educational medical functions"
  }
}
```

---

## 📝 **Continuous Improvement**

### **Template Updates:**
- **Monthly Review**: Update templates based on development patterns
- **Quarterly Enhancement**: Add new template types as needed
- **Annual Assessment**: Comprehensive template effectiveness evaluation

### **Feedback Integration:**
- Developer feedback on template usability
- Educational effectiveness assessment
- Student learning outcome evaluation

---

**Last Updated**: 2025-09-13
**Next Review**: 2025-12-13 (Quarterly template review)

---

*This template document ensures all medical functions maintain proper educational context and include appropriate disclaimers for student learning. Use these templates for all medical education platform development.*