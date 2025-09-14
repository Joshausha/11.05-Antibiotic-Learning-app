---
type: audit-checklist
title: AUDIT_PREVENTION_CHECKLIST.md - Clinical Assumption Prevention Checklist
status: active-checklist
created: 2025-09-13
modified: 2025-09-13
tags: [audit-prevention, checklist, educational-context, assumption-prevention]
category: Projects
purpose: prevent-clinical-assumptions-during-development
structure: para-methodology
priority: development-tool
---

# AUDIT_PREVENTION_CHECKLIST.md - Clinical Assumption Prevention Checklist
**Practical Checklist for Maintaining Educational Context Throughout Development**
*Last Updated: 2025-09-13*

> **🎯 CHECKLIST PURPOSE**: Prevent clinical assumptions during all phases of development by providing specific, actionable checkpoints for educational context validation.

---

## 🚀 **Quick Start Checklist (30 seconds)**

### **Before Starting ANY Medical Development:**
- [ ] **Read EDUCATIONAL_PURPOSE.md** - Understand the educational-only context
- [ ] **Review Target Users** - Medical students & trainees (NOT practicing clinicians)
- [ ] **Confirm Application Purpose** - Learning platform (NOT clinical decision support)
- [ ] **Check Language Mode** - Educational terminology (NOT clinical language)

### **Essential Question:**
> **"Am I building this to help students learn, or to help doctors treat patients?"**
>
> **Correct Answer**: "Help students learn" ✅
> **Wrong Answer**: "Help doctors treat patients" ❌

---

## 📋 **Phase 1: Pre-Development Planning Checklist**

### **🎯 Requirement Analysis:**
- [ ] **Educational Context Verification**
  - [ ] Feature supports student learning objectives
  - [ ] Target audience is medical students/residents/trainees
  - [ ] No clinical decision support requirements identified
  - [ ] No patient care workflow requirements identified

- [ ] **Language Audit in Requirements**
  - [ ] No "clinical decision support" language in requirements
  - [ ] No "patient care" terminology in specifications
  - [ ] No "treatment recommendation" requirements
  - [ ] All medical content marked as "educational purposes only"

- [ ] **User Story Validation**
  - [ ] User stories focus on "As a medical student..." (not "As a physician...")
  - [ ] Acceptance criteria emphasize learning outcomes
  - [ ] Success metrics focus on educational effectiveness
  - [ ] No clinical outcome measurements required

### **🏗️ Architecture Planning:**
- [ ] **Component Naming Strategy**
  - [ ] Component names use educational terminology
  - [ ] No "Clinical" prefixes in component names
  - [ ] No "Patient" or "Treatment" component names
  - [ ] Educational context clear in component architecture

- [ ] **Data Flow Analysis**
  - [ ] Data flows support educational scenarios (not clinical workflows)
  - [ ] No patient data handling requirements
  - [ ] Educational data privacy considerations only
  - [ ] Learning analytics focus (not clinical analytics)

---

## 💻 **Phase 2: Development Implementation Checklist**

### **🔧 Function Implementation:**
- [ ] **Function Naming Audit**
  - [ ] Function names use educational terminology
  - [ ] No `clinical*` function names
  - [ ] No `patient*` function names
  - [ ] No `treatment*` function names
  - [ ] Use `educational*`, `learning*`, `student*` prefixes

- [ ] **Function Documentation**
  - [ ] **REQUIRED**: "FOR EDUCATIONAL PURPOSES ONLY" disclaimer in JSDoc
  - [ ] **REQUIRED**: Learning objective specified in documentation
  - [ ] **REQUIRED**: Target audience specified (students/residents)
  - [ ] **REQUIRED**: Educational context explanation
  - [ ] No clinical guidance language in comments

- [ ] **Parameter and Variable Naming**
  - [ ] Use `educationalData` (not `clinicalData`)
  - [ ] Use `studentLevel` (not `clinicalContext`)
  - [ ] Use `learningObjectives` (not `treatmentGoals`)
  - [ ] Use `educationalResults` (not `clinicalOutcomes`)

### **🧪 Error Handling:**
- [ ] **Educational Error Messages**
  - [ ] Error messages maintain educational context
  - [ ] No clinical guidance in error responses
  - [ ] Suggest educational alternatives in error cases
  - [ ] Use `logEducationalError()` (not `logClinicalError()`)

### **📊 Return Values:**
- [ ] **Educational Result Structure**
  - [ ] Return values focus on learning outcomes
  - [ ] Include `educationalMetadata` with disclaimers
  - [ ] Provide `studyRecommendations` (not `treatmentRecommendations`)
  - [ ] Include `learningPoints` for student understanding

---

## 🧪 **Phase 3: Testing Implementation Checklist**

### **📝 Test Naming:**
- [ ] **Educational Test Context**
  - [ ] Test descriptions use educational language
  - [ ] Test suite names focus on learning scenarios
  - [ ] No clinical decision testing scenarios
  - [ ] Mock data represents educational examples (not patient cases)

### **🎯 Test Scenarios:**
- [ ] **Learning-Focused Test Cases**
  - [ ] Test educational accuracy (not clinical safety)
  - [ ] Validate learning objective achievement
  - [ ] Test student interaction scenarios
  - [ ] Verify educational disclaimer presence

### **📊 Test Data:**
- [ ] **Educational Test Data**
  - [ ] Use educational example data (not patient data)
  - [ ] Mock student learning scenarios
  - [ ] Include educational edge cases
  - [ ] No clinical workflow test data

---

## 🔍 **Phase 4: Code Review Checklist**

### **👤 Individual Developer Review:**
- [ ] **Self-Audit Questions**
  - [ ] "Does this help students learn or help doctors treat patients?"
  - [ ] "Am I using educational terminology throughout?"
  - [ ] "Would a medical student understand this is for education only?"
  - [ ] "Could anyone interpret this as medical advice?"
  - [ ] "Are all medical functions properly disclaimed as educational?"

### **👥 Peer Review Requirements:**
- [ ] **Educational Context Verification**
  - [ ] Reviewer confirms educational purpose maintained
  - [ ] All medical functions include educational disclaimers
  - [ ] No clinical decision support language identified
  - [ ] Educational user experience maintained

- [ ] **Language Audit**
  - [ ] No clinical terminology in new code
  - [ ] Educational language used consistently
  - [ ] Comments and documentation maintain educational context
  - [ ] Function names follow educational naming conventions

---

## 🚨 **Critical Red Flags Checklist**

### **⛔ IMMEDIATE STOP Indicators:**
If ANY of these are found, STOP development immediately:

- [ ] **Language Red Flags**
  - [ ] ❌ "Clinical decision support" anywhere in code/docs
  - [ ] ❌ "Patient care" terminology in functionality
  - [ ] ❌ "Treatment recommendations" in outputs
  - [ ] ❌ "Medical safety validation" in implementations
  - [ ] ❌ "Emergency access" for clinical use

- [ ] **Functionality Red Flags**
  - [ ] ❌ Functions that generate actual treatment plans
  - [ ] ❌ Patient data handling implementations
  - [ ] ❌ Clinical workflow optimization features
  - [ ] ❌ Real-time clinical database connections
  - [ ] ❌ Point-of-care interface elements

- [ ] **User Experience Red Flags**
  - [ ] ❌ Interface language suggesting clinical use
  - [ ] ❌ Workflows optimized for patient care
  - [ ] ❌ Clinical decision trees for actual patient decisions
  - [ ] ❌ Real patient case study integrations

### **🔧 Emergency Response Protocol:**
If red flags are found:
1. **STOP** current development immediately
2. **DOCUMENT** scope of clinical assumptions
3. **CREATE** systematic correction plan
4. **IMPLEMENT** educational language corrections
5. **VALIDATE** all clinical assumptions removed
6. **UPDATE** prevention measures

---

## ✅ **Phase 5: Pre-Deployment Checklist**

### **📚 Documentation Final Review:**
- [ ] **Educational Context Validation**
  - [ ] All documentation emphasizes educational purpose
  - [ ] EDUCATIONAL_PURPOSE.md prominently linked
  - [ ] No clinical guidance in any documentation
  - [ ] Educational disclaimers visible and clear

### **🎯 Feature Validation:**
- [ ] **Educational User Experience**
  - [ ] All features support learning objectives
  - [ ] Interface language appropriate for students
  - [ ] Help text focuses on educational guidance
  - [ ] No clinical decision support workflows

### **🔍 Final Language Audit:**
- [ ] **Comprehensive Language Check**
  - [ ] Search codebase for "clinical decision" (should return 0 results)
  - [ ] Search codebase for "patient care" (should return 0 results)
  - [ ] Search codebase for "treatment recommendation" (should return 0 results)
  - [ ] Verify educational disclaimers present in all medical functions

---

## 🔄 **Continuous Monitoring Checklist**

### **📅 Weekly Development Review:**
- [ ] **Language Drift Check**
  - [ ] Scan recent commits for clinical language
  - [ ] Review new function names for educational compliance
  - [ ] Audit new documentation for educational context
  - [ ] Validate new features maintain educational purpose

### **📅 Monthly Comprehensive Audit:**
- [ ] **System-Wide Educational Validation**
  - [ ] Full codebase search for clinical assumptions
  - [ ] Review all medical function documentation
  - [ ] Validate educational user experience consistency
  - [ ] Update prevention measures based on findings

---

## 🎯 **Quick Reference Cards**

### **🔍 30-Second Language Check:**
```bash
# Search for clinical assumptions (should return 0 results)
grep -r "clinical decision" src/
grep -r "patient care" src/
grep -r "treatment recommendation" src/
grep -r "medical safety validation" src/
```

### **✅ 30-Second Educational Validation:**
```bash
# Search for educational disclaimers (should return results)
grep -r "FOR EDUCATIONAL PURPOSES ONLY" src/
grep -r "medical education" src/
grep -r "student learning" src/
```

### **🎓 Essential Questions (2 minutes):**
1. **Purpose**: "Does this help students learn medical concepts?"
2. **Users**: "Is this designed for medical students and trainees?"
3. **Language**: "Am I using educational terminology throughout?"
4. **Context**: "Would anyone think this provides clinical guidance?"
5. **Safety**: "Are all medical functions properly disclaimed?"

---

## 📊 **Checklist Compliance Tracking**

### **Individual Developer Tracking:**
- [ ] **Pre-Development Planning**: ✅ Completed / ❌ Needs Work
- [ ] **Development Implementation**: ✅ Completed / ❌ Needs Work
- [ ] **Testing Implementation**: ✅ Completed / ❌ Needs Work
- [ ] **Code Review**: ✅ Completed / ❌ Needs Work
- [ ] **Pre-Deployment**: ✅ Completed / ❌ Needs Work

### **Team Tracking:**
- **Current Sprint Educational Compliance**: ___%
- **Clinical Assumptions Found**: ___
- **Educational Corrections Made**: ___
- **Compliance Trend**: ⬆️ Improving / ➡️ Stable / ⬇️ Declining

---

## 🛠️ **Tools and Automation**

### **IDE Integration:**
```json
// VS Code settings.json - Educational language enforcement
{
  "workbench.colorCustomizations": {
    "editorError.foreground": "#ff0000"
  },
  "editor.rulers": [80, 120],
  "search.defaultViewMode": "tree"
}
```

### **Git Hooks for Educational Validation:**
```bash
#!/bin/bash
# pre-commit hook for educational context validation
if grep -r "clinical decision" src/; then
  echo "❌ Clinical decision language found - commit blocked"
  exit 1
fi

if ! grep -r "FOR EDUCATIONAL PURPOSES ONLY" src/; then
  echo "⚠️ Warning: No educational disclaimers found"
fi
```

### **Automated Compliance Checking:**
```javascript
// package.json script for educational validation
{
  "scripts": {
    "audit:educational": "node scripts/educational-audit.js",
    "test:educational": "jest educational.test.js",
    "lint:educational": "eslint --config .eslintrc.educational.js src/"
  }
}
```

---

## 📈 **Success Metrics**

### **Educational Compliance KPIs:**
- **Clinical Assumption Rate**: 0 instances per sprint (target)
- **Educational Disclaimer Coverage**: 100% of medical functions
- **Language Compliance**: 100% educational terminology usage
- **Code Review Pass Rate**: 100% educational context validation

### **Quality Indicators:**
- ✅ **Excellent**: 0 clinical assumptions, 100% educational compliance
- ⚠️ **Good**: 1-2 minor clinical language instances, >95% compliance
- ❌ **Needs Improvement**: >3 clinical assumptions, <95% compliance

---

## 🔧 **Troubleshooting Common Issues**

### **"I Found Clinical Language in Legacy Code":**
1. **Document scope** of clinical assumptions
2. **Create correction plan** using TIER 1/2/3 approach
3. **Implement systematic fixes** with educational language
4. **Validate corrections** using this checklist
5. **Update prevention measures** to avoid recurrence

### **"I'm Unsure if My Function is Educational or Clinical":**
**Ask yourself**:
- Does this help students learn concepts? ✅ Educational
- Does this make decisions for patient care? ❌ Clinical
- When in doubt, choose educational context and add disclaimers

### **"The Medical Content Seems Too Sophisticated for Education":**
**Remember**: Medical education can include sophisticated content for advanced learners (residents, medical students in clinical years) while still maintaining educational purpose and disclaimers.

---

**Last Updated**: 2025-09-13
**Next Review**: 2025-12-13 (Quarterly checklist review)

---

*This checklist serves as a practical tool for maintaining educational context throughout all development phases. Use it consistently to prevent clinical assumptions and maintain the educational purpose of the medical learning platform.*