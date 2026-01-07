# Medical Data Audit & Inventory
**Comprehensive Analysis of Antibiotic Learning App Data Landscape**

*Created: 2026-01-07*
*Purpose: Establish single source of truth for Phase 1 data consolidation*

---

## Executive Summary

**Total Files Analyzed**: 18 data files + 10 test files
**Total Lines of Code**: ~3,269 lines in major files alone
**Total Data Size**: ~364KB across all data files
**Critical Finding**: Multiple overlapping data sources for antibiotics (3), pathogens (2), and quiz questions (3) with inconsistent type definitions and Northwestern coverage model integration at varying levels

**Immediate Action Required**: Phase 1-02 must establish single source of truth for each data category to prevent continued divergence.

---

## File Inventory by Category

### Category 1: Core Antibiotic Data (3 files, HIGH duplication risk)

#### `EnhancedAntibioticData.ts` (12KB, 379 lines)
- **Purpose**: Primary antibiotic database with Northwestern 8-segment coverage model
- **Data Structure**: Array of EnhancedAntibiotic objects
- **Entry Count**: ~15+ antibiotics
- **Key Features**:
  - Northwestern spectrum mapping (MRSA, VRE_faecium, anaerobes, atypicals, pseudomonas, gramNegative, MSSA, enterococcus_faecalis)
  - Coverage scale: 0=no coverage, 1=poor/moderate, 2=good
  - Imports and extends SimpleAntibioticData
  - Uses createNorthwesternAntibioticData from NorthwesternAntibioticSchema
- **Dependencies**: Imported by components (2 imports), uses SimpleAntibioticData
- **Last Modified**: Dec 10, 2025 07:00
- **Medical Accuracy**: Validated (Northwestern model from current literature)
- **Migration Status**: Agent 1.2 completed Northwestern integration

#### `SimpleAntibioticData.ts` (18KB, 562 lines)
- **Purpose**: Sophomore-level antibiotic data structure (original/legacy)
- **Data Structure**: Array of SimpleAntibiotic objects
- **Entry Count**: 15 common antibiotics
- **Key Features**:
  - Basic antibiotic properties: id, name, category, class, description, mechanism, spectrum, route, commonUses, resistance, sideEffects
  - Simpler interface without Northwestern coverage
  - Original data source before Northwestern integration
- **Dependencies**: Imported by EnhancedAntibioticData (base data), components (1 import)
- **Last Modified**: Dec 9, 2025 21:42
- **Medical Accuracy**: Validated (basic antibiotic information)
- **Status**: Legacy/base data, extended by Enhanced version

#### `NorthwesternAntibioticSchema.ts` (17KB, 528 lines)
- **Purpose**: Northwestern 8-segment schema with coverage mappings
- **Data Structure**: Map of antibiotic IDs to Northwestern spectrum objects
- **Entry Count**: 50+ antibiotics with Northwestern coverage
- **Key Features**:
  - Comprehensive Northwestern spectrum map for each antibiotic
  - Coverage scale: 0=no coverage (white), 1=poor/ok (light), 2=good (dark)
  - Medical accuracy verified against current literature
  - Function: createNorthwesternAntibioticData() for data transformation
- **Dependencies**: Imported by EnhancedAntibioticData
- **Last Modified**: Dec 9, 2025 20:57
- **Medical Accuracy**: Validated (verified against current literature)
- **Status**: Active Northwestern model implementation

### Category 2: Core Pathogen Data (2 files, MEDIUM duplication risk)

#### `SimplePathogenData.ts` (13KB, 402 lines)
- **Purpose**: Sophomore-level pathogen data structure
- **Data Structure**: Array of SimplePathogen objects
- **Entry Count**: 10 common pathogens
- **Key Features**:
  - Basic pathogen properties: id, name, commonName, gramStain, shape, morphology, description, commonSites, resistance, severity
  - Helper functions: searchPathogens(), getPathogensByGramStatus(), getPathogensBySeverity()
- **Dependencies**: Most imported data file (5 imports across components)
- **Last Modified**: Dec 9, 2025 21:47
- **Medical Accuracy**: Validated (basic pathogen information)
- **Status**: Primary pathogen data source

#### `PathogenRelationshipData.ts` (59KB, 1,090 lines)
- **Purpose**: Pathogen similarity/relationship network data for graph visualizations
- **Data Structure**: Network nodes and edges for Cytoscape/D3 visualizations
- **Entry Count**: Large dataset with relationship mappings
- **Key Features**:
  - Exports: nodes, edges, getPathogenRelationships()
  - Designed for network visualization components
  - Contains pathogen similarity scores and relationships
- **Dependencies**: Imported by visualization components (2 imports)
- **Last Modified**: Dec 9, 2025 19:50
- **Medical Accuracy**: Needs validation (similarity scores require medical review)
- **Status**: Specialized visualization data

### Category 3: Quiz & Testing Content (3 files, HIGH duplication risk)

#### `quizQuestions.ts` (46KB, 1,057 lines)
- **Purpose**: Northwestern-enhanced quiz questions (RBO-derived + Northwestern)
- **Data Structure**: Array of QuizQuestion objects
- **Entry Count**: 91 questions (79 original + 12 Northwestern)
- **Key Features**:
  - Imports northwesternQuizQuestions and combines with RBO data
  - Properties: question, options, correct, explanation, category, conditionId
  - Generated from RBO_JSON data
  - Enhanced by Agent 2.5
- **Dependencies**: Imported by quiz components
- **Last Modified**: Dec 9, 2025 20:39
- **Medical Accuracy**: Validated (Agent 2.5 enhancement)
- **Status**: Primary quiz data source (combined dataset)

#### `quizQuestionsWithDifficulty.ts` (49KB, 1,122 lines)
- **Purpose**: Validated quiz questions with difficulty ratings
- **Data Structure**: Array of QuizQuestion objects with difficulty field
- **Entry Count**: 79 questions
- **Key Features**:
  - All questions from quizQuestions.ts PLUS difficulty field (beginner/intermediate/advanced)
  - Validated automatically by data_validator.py
  - Validation timestamp: 2025-07-16T22:52:12
  - Standardized terminology and missing fields added
- **Dependencies**: Unknown (may not be actively used)
- **Last Modified**: Dec 9, 2025 20:50
- **Medical Accuracy**: Validated (automatic validation + standardization)
- **Status**: Parallel version with difficulty ratings

#### `northwesternQuizQuestions.ts` (11KB, 341 lines)
- **Purpose**: Visual learning quiz questions for Northwestern 8-segment methodology
- **Data Structure**: Array of NorthwesternQuizQuestion objects
- **Entry Count**: 12 Northwestern-specific questions
- **Key Features**:
  - Extended interface: northwesternFocus, targetSegment, visualComponent properties
  - targetSegment type: MRSA | VRE_faecium | anaerobes | atypicals | pseudomonas | gramNegative | MSSA | enterococcus_faecalis | multiple | visual
  - Created by Agent 2.5
- **Dependencies**: Imported by quizQuestions.ts
- **Last Modified**: Dec 10, 2025 12:36
- **Medical Accuracy**: Validated (Northwestern methodology)
- **Status**: Component of combined quiz dataset

### Category 4: Relationship Mappings (4 files)

#### `pathogenAntibioticMap.ts` (22KB, 683 lines)
- **Purpose**: Maps which antibiotics work against which pathogens
- **Data Structure**: Record<number, PathogenEntry> - pathogen ID to antibiotic relationships
- **Entry Count**: 10 pathogens with antibiotic effectiveness data
- **Key Features**:
  - Effectiveness levels: "high" | "medium" | "low" | "resistant"
  - Includes clinical notes for each pathogen-antibiotic pair
  - Helper function: getAntibioticsForPathogen()
- **Dependencies**: Imported by components (2 imports), used by durationMappings
- **Last Modified**: Dec 9, 2025 21:08
- **Medical Accuracy**: Needs validation (effectiveness ratings require review)
- **Status**: Core mapping data

#### `durationMappings.ts` (15KB, 466 lines)
- **Purpose**: Bridge between pathogen/antibiotic data and RBO duration data
- **Data Structure**: Enhanced pathogen map with duration context
- **Key Features**:
  - Imports: simplePathogens, simpleAntibiotics, rboConditionsMap, pathogenAntibioticMap
  - Functions: getPathogenDurationInfo(), getAntibioticDurationInfo(), getDurationStatistics()
  - Maps clinical conditions to treatment durations with pathogen-antibiotic context
- **Dependencies**: Imported by components (1 import)
- **Last Modified**: Dec 10, 2025 21:48
- **Medical Accuracy**: Needs validation (duration mappings require clinical review)
- **Status**: Active integration layer

#### `PathogenConditionMapping.ts` (3.4KB, 107 lines)
- **Purpose**: Maps pathogens to clinical conditions
- **Data Structure**: Mapping structure (details need inspection)
- **Entry Count**: Unknown
- **Dependencies**: Unknown
- **Last Modified**: Dec 10, 2025 12:46
- **Medical Accuracy**: Needs validation
- **Status**: Active mapping data

#### `pathogenClassificationMap.ts` (16KB, 493 lines)
- **Purpose**: Classifies pathogens into Northwestern categories
- **Data Structure**: Classification mapping system
- **Key Features**:
  - Functions: getNorthwesternClassification(), getContextualNorthwesternCategory()
  - Used by backward compatibility layer
- **Dependencies**: Imported by backwardCompatibility
- **Last Modified**: Dec 9, 2025 21:35
- **Medical Accuracy**: Validated (Northwestern classification)
- **Status**: Active Northwestern integration

### Category 5: Clinical Data (2 files)

#### `medicalConditions.ts` (22KB, 683 lines)
- **Purpose**: Clinical conditions database
- **Data Structure**: Array of medical condition objects
- **Entry Count**: 20 clinical conditions
- **Key Features**:
  - Clinical condition definitions with treatment guidelines
  - Categories: Genitourinary, Bloodstream, CNS, Respiratory, etc.
- **Dependencies**: Unknown
- **Last Modified**: Dec 9, 2025 20:26
- **Medical Accuracy**: Needs validation (clinical guidelines require review for currency)
- **Status**: Active clinical data

#### `ClinicalGuidelineData.ts` (7.3KB, 228 lines)
- **Purpose**: Treatment guidelines for clinical conditions
- **Data Structure**: Clinical guideline objects
- **Entry Count**: Unknown
- **Dependencies**: Unknown
- **Last Modified**: Dec 10, 2025 07:09
- **Medical Accuracy**: Needs validation (guidelines must be current)
- **Status**: Active clinical reference

### Category 6: Utility & Conversion Data (4 files)

#### `backwardCompatibility.ts` (15KB, 466 lines)
- **Purpose**: Ensures old components work with Northwestern enhancements
- **Data Structure**: Compatibility layer with type definitions
- **Key Features**:
  - Imports: coverageConversionAlgorithm, pathogenClassificationMap
  - Provides seamless integration between old and new data formats
- **Dependencies**: Unknown
- **Last Modified**: Dec 10, 2025 12:21
- **Medical Accuracy**: N/A (technical compatibility layer)
- **Status**: Active integration support

#### `coverageConversionAlgorithm.ts` (13KB, 404 lines)
- **Purpose**: Converts between original and Northwestern coverage scales
- **Data Structure**: Conversion functions
- **Key Features**:
  - Functions: convertToOriginalScale(), convertToNorthwesternScale()
  - Algorithm for bidirectional conversion
- **Dependencies**: Imported by backwardCompatibility
- **Last Modified**: Dec 10, 2025 12:20
- **Medical Accuracy**: N/A (technical conversion)
- **Status**: Active conversion utility

#### `RBOMappingSystem.ts` (10KB, 311 lines)
- **Purpose**: RBO (Red Book Online) condition mapping system
- **Data Structure**: Map of RBO conditions
- **Key Features**:
  - Export: rboConditionsMap
  - Integration with AAP Red Book Online data
- **Dependencies**: Imported by durationMappings (1 import)
- **Last Modified**: Dec 10, 2025 06:57
- **Medical Accuracy**: Validated (AAP Red Book data)
- **Status**: Active RBO integration

#### `PathogenRelationshipJustifications.ts` (27KB, 840 lines)
- **Purpose**: Medical justifications for pathogen relationship scores
- **Data Structure**: Justification text for relationship data
- **Entry Count**: Large documentation dataset
- **Dependencies**: Unknown
- **Last Modified**: Dec 9, 2025 21:26
- **Medical Accuracy**: Needs validation (medical justifications require review)
- **Status**: Documentation/reference

---

## Duplication Analysis

### Critical Duplication #1: Antibiotic Data Sources (HIGH SEVERITY)

**Issue**: Three different antibiotic data sources with overlapping content but different structures:

1. **SimpleAntibioticData.ts** (18KB, 15 antibiotics)
   - Original simple structure
   - No Northwestern coverage
   - Used as base data by EnhancedAntibioticData

2. **EnhancedAntibioticData.ts** (12KB, 15+ antibiotics)
   - Imports SimpleAntibioticData as foundation
   - Adds Northwestern spectrum properties
   - Current primary source for components

3. **NorthwesternAntibioticSchema.ts** (17KB, 50+ antibiotics)
   - Most comprehensive Northwestern coverage mappings
   - Used by EnhancedAntibioticData for coverage data
   - Map structure (ID → coverage) vs array structure

**Specific Examples**:
- Penicillin data exists in all three files with different levels of detail
- SimpleAntibioticData line 21-34: Basic penicillin entry
- NorthwesternAntibioticSchema line 23-26: Penicillin Northwestern coverage
- EnhancedAntibioticData: Combines both sources

**Risk**: Changes to antibiotic data must be made in multiple places, increasing chance of inconsistency.

**Impact**: Medium - Current architecture intentionally layers data, but creates maintenance burden.

### Critical Duplication #2: Quiz Question Files (HIGH SEVERITY)

**Issue**: Three quiz question files with overlapping questions but different properties:

1. **quizQuestions.ts** (46KB, 91 questions)
   - Combines original RBO questions + Northwestern questions
   - Imports northwesternQuizQuestions
   - Primary quiz source

2. **quizQuestionsWithDifficulty.ts** (49KB, 79 questions)
   - Same questions as quizQuestions.ts base set
   - PLUS difficulty field (beginner/intermediate/advanced)
   - May not be actively used

3. **northwesternQuizQuestions.ts** (11KB, 12 questions)
   - Northwestern-specific questions with extended properties
   - Imported by quizQuestions.ts
   - Subset of combined dataset

**Specific Examples**:
- UTI pyelonephritis question appears in both quizQuestions.ts (line 21-32) and quizQuestionsWithDifficulty.ts (line 14-27)
- quizQuestions.ts version: "E coli" (abbreviated)
- quizQuestionsWithDifficulty.ts version: "Escherichia coli" (full name) + difficulty: "beginner"
- Different terminology standardization between versions

**Risk**: Quiz updates may miss one file, creating inconsistent question sets.

**Impact**: High - Active duplication with terminology inconsistencies.

### Moderate Duplication #3: Pathogen Relationship Data (MEDIUM SEVERITY)

**Issue**: Pathogen relationship data appears in multiple contexts:

1. **PathogenRelationshipData.ts** (59KB) - Network graph data
2. **pathogenAntibioticMap.ts** (22KB) - Effectiveness relationships
3. **durationMappings.ts** (15KB) - Duration-enhanced relationships

**Risk**: Relationship updates must be synchronized across files.

**Impact**: Medium - Different purposes but overlapping data.

---

## Inconsistency Analysis

### Inconsistency #1: Type Definitions Across Files (HIGH SEVERITY)

**Issue**: Same medical concepts defined with different TypeScript interfaces in different files.

**Examples**:

1. **Antibiotic Types**:
   - SimpleAntibiotic interface (SimpleAntibioticData.ts line 7-19): 11 fields
   - EnhancedAntibiotic interface (EnhancedAntibioticData.ts line 44+): Extended with Northwestern properties
   - Different type definitions in backwardCompatibility.ts for compatibility layer

2. **Quiz Question Types**:
   - QuizQuestion in quizQuestions.ts: Basic properties
   - QuizQuestion with difficulty in quizQuestionsWithDifficulty.ts: Extended with difficulty field
   - NorthwesternQuizQuestion in northwesternQuizQuestions.ts: Extended with northwesternFocus, targetSegment, visualComponent

3. **Pathogen Types**:
   - SimplePathogen interface (SimplePathogenData.ts line 7-18): 10 fields
   - Different pathogen representations in PathogenRelationshipData.ts for network visualization

**Severity**: HIGH - Type inconsistency prevents true single source of truth

**Root Cause**: Evolution through multiple agents and features without consolidation

**Line References**:
- SimpleAntibioticData.ts line 7: `export interface SimpleAntibiotic`
- EnhancedAntibioticData.ts line 44: `interface EnhancedAntibiotic`
- quizQuestions.ts line 18: Uses QuizQuestion from types/medical.types.ts
- northwesternQuizQuestions.ts line 37: `interface NorthwesternQuizQuestion`

### Inconsistency #2: Northwestern Coverage Model Integration (MEDIUM SEVERITY)

**Issue**: Northwestern 8-segment model integrated at varying levels across files.

**Files with Full Integration**:
- EnhancedAntibioticData.ts (complete)
- NorthwesternAntibioticSchema.ts (complete)
- northwesternQuizQuestions.ts (complete)

**Files with Partial/No Integration**:
- SimpleAntibioticData.ts (legacy, no Northwestern)
- pathogenAntibioticMap.ts (uses old effectiveness scale)
- PathogenRelationshipData.ts (no Northwestern classification)

**Coverage Scale Inconsistency**:
- Northwestern model: 0 | 1 | 2 (no/poor/good coverage)
- Old pathogenAntibioticMap: "high" | "medium" | "low" | "resistant" (string-based)
- Conversion algorithm exists (coverageConversionAlgorithm.ts) but not universally applied

**Severity**: MEDIUM - Conversion layer mitigates, but creates complexity

### Inconsistency #3: ID Mismatches Between Files (MEDIUM SEVERITY)

**Issue**: Antibiotic and pathogen IDs may not align perfectly across all files.

**Concerns**:
- SimpleAntibioticData.ts: 15 antibiotics (IDs 1-15)
- NorthwesternAntibioticSchema.ts: 50+ antibiotics referenced (IDs beyond 15)
- Missing ID documentation in some files

**Potential Impact**: Mapping functions may fail for antibiotics with IDs > 15 if using SimpleAntibioticData

**Requires Investigation**: Full ID audit needed in Phase 1-02

### Inconsistency #4: Missing Data in Some Files (LOW SEVERITY)

**Issue**: Not all antibiotics/pathogens have complete data in all files.

**Examples**:
- Some antibiotics in NorthwesternAntibioticSchema may not exist in SimpleAntibioticData
- Not all pathogens in SimplePathogenData appear in pathogenAntibioticMap
- Quiz questions reference conditions that may not exist in medicalConditions.ts

**Severity**: LOW - Expected for evolving dataset, but needs documentation

---

## Medical Accuracy Concerns

### Concern #1: Coverage Ratings Conflicts (MEDIUM SEVERITY)

**Issue**: Different coverage ratings for same antibiotic-pathogen pairs between files.

**Investigation Needed**:
- Compare pathogenAntibioticMap.ts effectiveness ratings vs NorthwesternAntibioticSchema.ts coverage scores
- Verify conversion algorithm accuracy
- Example: Penicillin for S. aureus - pathogenAntibioticMap says "resistant", Northwestern model says MSSA=2, MRSA=0

**Recommendation**: Medical review of all coverage/effectiveness ratings in Phase 1-03

### Concern #2: Clinical Guidelines Currency (HIGH SEVERITY)

**Issue**: ClinicalGuidelineData.ts and medicalConditions.ts may contain outdated treatment guidelines.

**Evidence**:
- Last modified Dec 9-10, 2025
- No version tracking or guideline update dates
- Pediatric guidelines change frequently (AAP Red Book annual updates)

**Recommendation**:
- Add guideline version/date fields
- Medical review against current AAP Red Book and CDC guidelines
- Implement update tracking system

### Concern #3: Pathogen Classifications Differ (LOW SEVERITY)

**Issue**: Pathogen classification varies between SimplePathogenData and Northwestern classification system.

**Examples**:
- SimplePathogenData uses gramStain: "positive"/"negative"
- Northwestern system uses 8 specific categories
- pathogenClassificationMap.ts bridges the gap, but adds complexity

**Recommendation**: Establish canonical pathogen taxonomy in Phase 1-02

### Concern #4: Relationship Justifications Unvalidated (MEDIUM SEVERITY)

**Issue**: PathogenRelationshipJustifications.ts (27KB) contains medical justifications but no validation stamps.

**Concerns**:
- Large text dataset without medical review indicators
- No citations or evidence-based references
- Last modified Dec 9, 2025

**Recommendation**: Medical expert review of all justifications in Phase 1-03

---

## Consolidation Recommendations

### Priority 1: Critical Consolidations (Must Complete in Phase 1-02)

#### Recommendation 1.1: Establish Single Antibiotic Data Source

**Decision Required**: Choose primary antibiotic data architecture

**Option A: EnhancedAntibioticData as Single Source**
- Approach: Make EnhancedAntibioticData.ts the canonical source
- Keep NorthwesternAntibioticSchema.ts as coverage mapping data (complement, not duplicate)
- Deprecate direct use of SimpleAntibioticData.ts (becomes private/internal to Enhanced)
- Files Affected: EnhancedAntibioticData.ts, SimpleAntibioticData.ts, NorthwesternAntibioticSchema.ts, components importing antibiotic data
- Risk: Medium (requires component updates)
- Complexity: 3/5
- Benefits: Clear single source, maintains layered architecture

**Option B: Merge All into New Unified Structure**
- Approach: Create new antibioticDatabase.ts with all data inline
- Delete SimpleAntibioticData, EnhancedAntibioticData, NorthwesternAntibioticSchema
- Single massive file with complete antibiotic data
- Files Affected: All 3 antibiotic files + all importers
- Risk: High (major breaking change)
- Complexity: 5/5
- Benefits: True single source, eliminates duplication
- Drawbacks: Loses layered learning approach, harder to maintain

**Recommendation**: Option A - Designate EnhancedAntibioticData as canonical, keep Schema as mapping layer

#### Recommendation 1.2: Unify Quiz Question Files

**Decision Required**: Merge or designate primary quiz source

**Approach**: Merge all quiz questions into single source with extended interface
- Combine quizQuestions.ts + quizQuestionsWithDifficulty.ts + northwesternQuizQuestions.ts
- Use extended interface with optional fields: difficulty?, northwesternFocus?, targetSegment?, visualComponent?
- Create single `unifiedQuizQuestions.ts` file
- Deprecate individual files
- Files Affected: quizQuestions.ts, quizQuestionsWithDifficulty.ts, northwesternQuizQuestions.ts, quiz components
- Risk: Medium (requires quiz component updates)
- Complexity: 4/5
- Benefits: Single source of truth, all questions have all metadata available
- Implementation: Phase 1-02 creates new file, Phase 1-03 updates components, Phase 1-04 removes old files

#### Recommendation 1.3: Standardize Type Definitions

**Approach**: Create canonical medical.types.ts with all type definitions
- Move all medical type definitions to `src/types/medical.types.ts`
- Remove duplicate type definitions from individual data files
- Export all types from single location
- Files Affected: All data files with type definitions, medical.types.ts
- Risk: Low (TypeScript will catch import errors)
- Complexity: 2/5
- Benefits: Single source of truth for types, easier TypeScript maintenance
- Implementation: Phase 1-02 creates consolidated types, Phase 1-03 updates all imports

### Priority 2: Structure Improvements (Complete in Phase 1-03)

#### Recommendation 2.1: Consolidate Mapping Files

**Approach**: Create unified relationship mapping system
- Merge pathogenAntibioticMap.ts + durationMappings.ts + PathogenConditionMapping.ts
- Create `medicalRelationships.ts` with all pathogen-antibiotic-condition-duration mappings
- Maintain single effectiveness/coverage conversion point
- Files Affected: pathogenAntibioticMap.ts, durationMappings.ts, PathogenConditionMapping.ts
- Risk: Medium
- Complexity: 4/5
- Benefits: Unified relationship data, easier to maintain consistency

#### Recommendation 2.2: Complete Northwestern Integration

**Approach**: Migrate all remaining files to Northwestern model
- Update pathogenAntibioticMap.ts to use Northwestern coverage scale
- Add Northwestern classification to PathogenRelationshipData.ts
- Update all effectiveness scales to 0|1|2 format
- Remove old string-based effectiveness where possible
- Files Affected: pathogenAntibioticMap.ts, PathogenRelationshipData.ts, related components
- Risk: Medium
- Complexity: 3/5
- Benefits: Consistent coverage model throughout application

#### Recommendation 2.3: Backward Compatibility Strategy

**Approach**: Decide on backward compatibility layer retention
- Option A: Keep backwardCompatibility.ts as permanent compatibility layer
- Option B: Remove backwardCompatibility.ts after full migration to Northwestern
- Decision Point: Do we need to support old component code indefinitely?
- Files Affected: backwardCompatibility.ts, coverageConversionAlgorithm.ts
- Risk: Low (affects architecture, not data accuracy)
- Complexity: 2/5

### Priority 3: Medical Validation (Complete in Phase 1-04)

#### Recommendation 3.1: Medical Accuracy Review Required

**Files Requiring Expert Medical Review**:
1. **ClinicalGuidelineData.ts** (CRITICAL)
   - Verify against current AAP Red Book (2025-2026 edition)
   - Update to CDC guidelines current as of Jan 2026
   - Add guideline version metadata
   - Severity: CRITICAL

2. **pathogenAntibioticMap.ts** (HIGH)
   - Verify effectiveness ratings against current resistance patterns
   - Compare to Northwestern coverage model for consistency
   - Cross-reference with AAP Red Book recommendations
   - Severity: HIGH

3. **durationMappings.ts** (HIGH)
   - Verify treatment durations against current guidelines
   - Check for pediatric-specific duration recommendations
   - Update based on latest RBO data
   - Severity: HIGH

4. **PathogenRelationshipJustifications.ts** (MEDIUM)
   - Add citations for all medical claims
   - Verify against current literature
   - Add evidence levels
   - Severity: MEDIUM

5. **medicalConditions.ts** (MEDIUM)
   - Verify condition definitions current
   - Check diagnostic criteria accuracy
   - Update clinical descriptions
   - Severity: MEDIUM

**Process**:
- Create medical_validation_checklist.md
- Schedule expert review sessions
- Document all changes with citations
- Add validation stamps and dates

#### Recommendation 3.2: Implement Coverage Rating Verification

**Approach**: Systematic verification of all antibiotic coverage ratings
- Cross-reference NorthwesternAntibioticSchema vs pathogenAntibioticMap
- Resolve conflicts with medical literature review
- Document decision rationale for each rating
- Create coverage_verification_report.md
- Files Affected: NorthwesternAntibioticSchema.ts, pathogenAntibioticMap.ts
- Risk: Low (verification only, no code changes yet)
- Complexity: 4/5 (time-intensive medical review)

#### Recommendation 3.3: Add Update Tracking Metadata

**Approach**: Add metadata to all medical data files
- Add version numbers to all data files
- Add lastMedicalReview date fields
- Add guideline source citations
- Create data_version_tracking.md
- Files Affected: All medical data files
- Risk: Low
- Complexity: 2/5
- Benefits: Track data currency, know when medical review needed

---

## Data Flow Analysis

### Primary Data Flow Patterns

1. **Antibiotic Display Flow**:
   ```
   NorthwesternAntibioticSchema.ts (coverage data)
           ↓
   SimpleAntibioticData.ts (base data)
           ↓
   EnhancedAntibioticData.ts (combined)
           ↓
   Components (NorthwesternPieChart, etc.)
   ```

2. **Quiz Question Flow**:
   ```
   northwesternQuizQuestions.ts (Northwestern subset)
           ↓
   quizQuestions.ts (combined dataset)
           ↓
   Quiz Components

   [Parallel: quizQuestionsWithDifficulty.ts - may be unused]
   ```

3. **Pathogen-Antibiotic Relationship Flow**:
   ```
   SimplePathogenData.ts (pathogen info)
           ↓
   pathogenAntibioticMap.ts (effectiveness)
           ↓
   durationMappings.ts (+ duration context)
           ↓
   Components
   ```

4. **Backward Compatibility Flow**:
   ```
   pathogenClassificationMap.ts (Northwestern classification)
           ↓
   coverageConversionAlgorithm.ts (scale conversion)
           ↓
   backwardCompatibility.ts (compatibility layer)
           ↓
   Legacy Components
   ```

### Import Dependency Analysis

**Most Imported Files** (by import count):
1. SimplePathogenData.ts - 5 imports (highest usage)
2. EnhancedAntibioticData.ts - 2 imports
3. pathogenAntibioticMap.ts - 2 imports
4. PathogenRelationshipData.ts - 2 imports
5. SimpleAntibioticData.ts - 1 import (mostly via EnhancedAntibioticData)

**Least Imported/Orphaned Files** (need investigation):
- quizQuestionsWithDifficulty.ts - possibly unused
- PathogenConditionMapping.ts - unclear usage
- PathogenRelationshipJustifications.ts - reference only?

---

## Risk Assessment

### High Risk Items
1. **Quiz Question Duplication** - Active duplication with inconsistent terminology
2. **Clinical Guidelines Currency** - Patient safety risk if outdated
3. **Type Definition Inconsistency** - Prevents true single source of truth

### Medium Risk Items
1. **Antibiotic Data Layering** - Intentional but creates maintenance burden
2. **Coverage Rating Conflicts** - May lead to incorrect clinical recommendations
3. **Northwestern Integration Incomplete** - Mixed coverage models create complexity

### Low Risk Items
1. **Missing Data in Some Files** - Expected for evolving dataset
2. **Backward Compatibility Layer** - Technical debt but functional
3. **Pathogen Classification Differences** - Bridged by existing mapping

---

## Next Steps for Phase 1-02

### Immediate Actions
1. **Type Consolidation** (Priority 1.3)
   - Create canonical medical.types.ts
   - Move all type definitions to single location
   - Update all imports

2. **Antibiotic Data Decision** (Priority 1.1)
   - Designate EnhancedAntibioticData as canonical source
   - Document architecture: Enhanced (public) → Simple (private) → Schema (coverage mapping)
   - Update component imports if needed

3. **Quiz Question Unification** (Priority 1.2)
   - Create unified quiz question interface
   - Merge all quiz files
   - Identify and deprecate unused files

### Deferred to Phase 1-03
1. Mapping file consolidation (Priority 2.1)
2. Complete Northwestern integration (Priority 2.2)
3. Backward compatibility strategy decision (Priority 2.3)

### Deferred to Phase 1-04
1. Medical accuracy review (Priority 3.1)
2. Coverage verification (Priority 3.2)
3. Update tracking implementation (Priority 3.3)

---

## Appendix: File Size Summary

```
Total Data Files: 18 TypeScript files
Total Size: ~364KB

Largest Files:
1. PathogenRelationshipData.ts       - 59KB (1,090 lines)
2. quizQuestionsWithDifficulty.ts    - 49KB (1,122 lines)
3. quizQuestions.ts                  - 46KB (1,057 lines)
4. PathogenRelationshipJustifications.ts - 27KB (840 lines)
5. medicalConditions.ts              - 22KB (683 lines)
6. pathogenAntibioticMap.ts          - 22KB (683 lines)
7. SimpleAntibioticData.ts           - 18KB (562 lines)
8. NorthwesternAntibioticSchema.ts   - 17KB (528 lines)
9. pathogenClassificationMap.ts      - 16KB (493 lines)

Medium Files:
10. backwardCompatibility.ts         - 15KB (466 lines)
11. durationMappings.ts              - 15KB (466 lines)
12. coverageConversionAlgorithm.ts   - 13KB (404 lines)
13. SimplePathogenData.ts            - 13KB (402 lines)
14. EnhancedAntibioticData.ts        - 12KB (379 lines)
15. northwesternQuizQuestions.ts     - 11KB (341 lines)
16. RBOMappingSystem.ts              - 10KB (311 lines)

Smallest Files:
17. ClinicalGuidelineData.ts         - 7.3KB (228 lines)
18. PathogenConditionMapping.ts      - 3.4KB (107 lines)
```

---

**Audit Completed**: 2026-01-07
**Ready for Phase 1-02**: TypeScript Interface Definition & Type Consolidation
