---
type: documentation-standards
title: Documentation Standards - Antibiotic Learning App
created: 2025-08-26
modified: 2025-08-26
tags: [documentation, standards, testing-metrics, consistency]
category: System Documentation
purpose: documentation-quality-standards
structure: para-methodology
version: 1.0.0
---

# Documentation Standards - Antibiotic Learning App
**Quality Standards for Professional Medical Education Documentation**  
*Created: 2025-08-26*

## 🎯 Purpose

This document establishes standards to prevent documentation quality issues and maintain professional consistency across all project documentation. Created following comprehensive documentation audit and systematic fixes.

---

## 📊 Test Metrics Reporting Standards

### **Critical Requirement: Always Distinguish Between Metrics**

**Test Suite Pass Rate**: File-level test results (e.g., how many test files pass)
**Individual Test Pass Rate**: Individual test case results (e.g., how many individual assertions pass)

### **Standard Reporting Format - UPDATED AFTER REALITY AUDIT**
```markdown
🚨 CURRENT REALITY: Build fails, multiple test failures requiring systematic debugging

✅ CORRECT HONEST REPORTING: "Build Status: FAILS (syntax error), Test Status: Multiple failures requiring debugging"
✅ VERIFIED DATA: "30 antibiotics, ~29 pathogens, 7/7 functional tabs, excellent medical content"

❌ INCORRECT: Any specific test pass rates without verification
❌ INCORRECT: "Production ready" claims when build fails
```

### **Approved Current Status Reporting**
- "Build Status: FAILS - InteractiveCoverageWheel.js:22:13 syntax error"
- "Test Status: Multiple failures requiring systematic debugging"  
- "Educational Content: Excellent - 30 verified antibiotics, clinically accurate"

### **Metadata Standards - Updated**
```yaml
build_status: fails-syntax-error
test_status: multiple-failures-require-debugging
educational_content: excellent-verified-medical-data
```

---

## 📅 Date and Timestamp Standards

### **Date Format Requirements**
- **Standard**: YYYY-MM-DD format (e.g., 2025-08-26)
- **Frontmatter**: Use YYYY-MM-DD for created/modified fields
- **Content**: Use readable format "August 26, 2025" in content sections

### **Update Requirements**
- **ALL dates must be updated** when making changes to a document
- **Historical dates** in change logs should be preserved
- **Current status sections** must reflect current date

### **Example Standard Updates**
```markdown
---
created: 2025-08-24
modified: 2025-08-26  # ← Always update when changing file
---

*Last Updated: 2025-08-26*  # ← Update in content sections
```

---

## 🗂️ Navigation Standards

### **Table of Contents Requirements**
Documents **>200 lines** must include a table of contents:

```markdown
## 📋 Table of Contents
- [Section Name](#-section-name)
- [Another Section](#-another-section)
```

### **Anchor Link Format**
Use emoji-aware anchor format:
- `#-section-name` for "🎯 Section Name"
- `#section-name` for regular headers

### **Navigation Maintenance**
- Keep TOC updated when adding/removing sections
- Test anchor links after major restructuring
- Ensure consistent emoji usage in headers

---

## 📝 Content Consistency Standards

### **Metric Consistency Across Documents**
- All test metrics must be consistent across PROJECT_STATUS.md, README.md, and CLAUDE.md
- When updating one document, verify others don't need updates
- Use standardized language for achievement descriptions

### **Medical Education Context**
- Maintain clinical accuracy in all technical descriptions
- Preserve medical education value in all changes
- Include appropriate disclaimers for clinical usage

### **Version Control Integration**
- Include version numbers in technical documentation
- Use semantic versioning for major architectural changes
- Maintain change logs with specific improvement details

---

## 🔧 Quality Assurance Checklist

### **Before Publishing Any Documentation Update**

**Metrics Verification:**
- [ ] All test percentages clearly labeled (suite vs individual)
- [ ] No ambiguous "test success rate" references
- [ ] Metrics consistent across all documents

**Date Verification:**
- [ ] All frontmatter dates updated
- [ ] Content timestamps current
- [ ] Historical dates preserved in change logs

**Navigation Verification:**
- [ ] TOC present in documents >200 lines  
- [ ] All anchor links functional
- [ ] Section headers use consistent emoji patterns

**Content Verification:**
- [ ] No conflicting information across documents
- [ ] Medical education context maintained
- [ ] Professional language and formatting

### **Post-Update Verification Commands**
```bash
# Find any remaining ambiguous metrics
grep -r "test.*success.*rate\|pass.*rate" *.md

# Check for outdated dates
grep -r "August 25\|2025-08-25" *.md

# Verify metric consistency
grep -r "96\.9%\|97\.7%" *.md
```

---

## 📚 Document Hierarchy

### **Primary Documents** (Always Current)
1. **PROJECT_STATUS.md** - Single source of truth
2. **README.md** - Application overview  
3. **CLAUDE.md** - Development patterns

### **Technical Documentation** (Keep Updated)
- `docs/system/` - Architecture and patterns
- `docs/medical/` - Clinical accuracy standards
- `docs/development/` - Build and deployment guides

### **Archive Policy**
- Move superseded planning documents to `documentation_archive/YYYY-MM-DD_description/`
- Preserve historical context without cluttering active workspace
- Update references when archiving documents

---

## 🎯 Success Criteria

**Documentation meets standards when:**
- Zero ambiguous test metric references
- All dates current and consistent
- Navigation aids functional in long documents  
- Content consistent across all primary documents
- Medical education value preserved
- Professional presentation maintained

---

**Established**: 2025-08-26 following systematic documentation audit  
**Authority**: Based on professional medical education platform requirements  
**Maintenance**: Review and update when adding new documentation types