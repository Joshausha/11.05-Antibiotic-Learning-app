---
allowed-tools: Bash(grep:*), Read, Grep
argument-hint: [plan-description-or-file-path]
description: Verify educational alignment and detect clinical drift
model: claude-3-5-sonnet-20241022
---

# Educational Alignment Verification

You are analyzing: $ARGUMENTS

**CRITICAL VERIFICATION TASKS:**

## 1. Educational Purpose Compliance Check

First, read the educational purpose document to understand alignment criteria:

@EDUCATIONAL_PURPOSE.md

**Verification Questions:**
- Does this align with medical student/resident learning objectives?
- Is this for concept understanding, not patient care decisions?
- Does this support the defined educational objectives?
- Are target users students/trainees, not practicing clinicians?

## 2. Clinical Language Detection Scan

Perform systematic language scanning for clinical drift indicators:

```bash
# Critical clinical language patterns to detect
!grep -r "clinical decision support" . --exclude-dir=node_modules --exclude-dir=.git || echo "✅ No clinical decision support language found"
!grep -r "patient care" . --exclude-dir=node_modules --exclude-dir=.git || echo "✅ No patient care language found"
!grep -r "treatment recommendation" . --exclude-dir=node_modules --exclude-dir=.git || echo "✅ No treatment recommendation language found"
!grep -r "point-of-care" . --exclude-dir=node_modules --exclude-dir=.git || echo "✅ No point-of-care language found"
!grep -r "clinical workflow" . --exclude-dir=node_modules --exclude-dir=.git || echo "✅ No clinical workflow language found"
!grep -r "medical safety validation" . --exclude-dir=node_modules --exclude-dir=.git || echo "✅ No medical safety validation language found"
```

## 3. Educational vs Clinical Classification

**✅ EDUCATIONAL ALIGNED PATTERNS:**
- Learning assessment, knowledge evaluation, study support
- Educational analysis, concept exploration, pattern recognition
- Student progress tracking, learning objective measurement
- Interactive learning, visual education, knowledge assessment
- Study aids, board preparation, concept review

**❌ CLINICAL MISALIGNED PATTERNS:**
- Clinical decision support, patient care guidance, treatment recommendations
- Point-of-care tools, clinical workflow optimization, medical safety systems
- Real patient data handling, clinical outcome tracking
- Emergency access for patient care, bedside clinical tools

## 4. Component and Code Analysis

Analyze any code components mentioned in the plan:

```bash
# Check for clinical components that should be educational
!find . -name "*.js" -path "*/src/*" -exec basename {} \; | grep -i clinical || echo "✅ No clinical-named components found"
!find . -name "*.js" -path "*/src/*" -exec basename {} \; | grep -i patient || echo "✅ No patient-named components found"
!find . -name "*.js" -path "*/src/*" -exec basename {} \; | grep -i treatment || echo "✅ No treatment-named components found"
```

## 5. Test File Educational Alignment

Check that test files validate educational objectives, not clinical functions:

```bash
# Scan test files for clinical language
!find . -name "*.test.js" -exec grep -l "clinical decision" {} \; || echo "✅ No clinical decision testing found"
!find . -name "*.test.js" -exec grep -l "patient care" {} \; || echo "✅ No patient care testing found"
!find . -name "*.test.js" -exec grep -l "treatment" {} \; | head -5 || echo "✅ Limited treatment-related testing found"
```

## VERIFICATION ASSESSMENT

Based on the analysis above, provide:

### **ALIGNMENT STATUS:**
- **PASS/FAIL** with confidence score (0-100%)
- **RISK LEVEL:** Low/Medium/High/Critical

### **SPECIFIC CONCERNS IDENTIFIED:**
- List any clinical language detected with file locations
- Identify components that suggest clinical rather than educational purpose
- Note any user interface elements that imply patient care functionality

### **EDUCATIONAL FOCUS VERIFICATION:**
- Confirm this supports medical students learning concepts
- Verify this is for educational exploration, not clinical practice
- Validate alignment with defined educational objectives

### **REMEDIATION REQUIREMENTS:**
If FAIL status, provide specific changes needed:
- File renames required (Clinical* → Educational*)
- Language replacements needed
- Component functionality changes required
- Interface modifications for educational context
- Test suite updates for educational validation

### **IMPLEMENTATION VERIFICATION:**
For completion claims, verify evidence matches scope:
- Check actual files modified vs. claimed modifications
- Validate line counts and changes are accurate
- Ensure comprehensive coverage if "systematic" is claimed

**Remember:** Educational platforms teach concepts to students. Clinical platforms guide patient care decisions. This distinction is critical for user safety, legal compliance, and mission integrity.