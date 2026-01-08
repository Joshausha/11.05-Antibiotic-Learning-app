# Antibiotic Learning App

## What This Is

A personal learning tool for antibiotic and bacteria education that helps Josh (PGY-3 pediatric resident) master gram staining, antibiotic classes, formulations, and coverage patterns through interactive exploration, comparison, and spaced repetition testing.

## Core Value

Accurate medical data with flexible, experimental interaction modes that transform antibiotic coverage knowledge into durable clinical recall.

## Current State (v1.0 MVP — Shipped 2026-01-08)

**What shipped:**
- D3 force-directed network visualization with gram stain color coding
- 3-mode comparison system (pair, reference, grid) with similarity scoring
- Board-prep style quiz with UWorld/Board Vitals teaching pattern
- Multi-modal learning flow with context preservation across modes
- Learning analytics dashboard with weak spots identification
- 80%+ test coverage with medical data accuracy validation

**Tech stack:** React 18, TypeScript, D3.js, Jest, Tailwind CSS
**Codebase:** ~102,530 LOC across 157 files

## Requirements

### Validated

- ✓ Antibiotic and pathogen data structure — v1.0
- ✓ Gram positive/negative classification system — v1.0
- ✓ Antibiotic class and formulation taxonomy — v1.0
- ✓ React/TypeScript/D3 technical foundation — v1.0
- ✓ Visual network/graph exploration showing antibiotic-bacteria relationships — v1.0
- ✓ Side-by-side comparison interface for antibiotics and bacteria properties — v1.0
- ✓ Quiz/flashcard system with teaching-focused explanations — v1.0
- ✓ Multiple interaction modes that reinforce learning in different ways — v1.0
- ✓ Learning analytics with weak spots identification — v1.0

### Active

(None currently — milestone complete, awaiting next direction)

### Out of Scope

- **Patient care integration** — No clinical decision support, EMR integration, or real patient data. This is a learning tool, not a clinical tool.
- **Multi-user/social features** — Solo learning experience. No collaboration, progress sharing, or comparing with other learners.
- **Production deployment** — Personal learning sandbox for experimentation. Not a published or production application.
- **Spaced repetition integration** — Pivoted to enhanced network interactivity in v1.0; may revisit in future milestone.

## Context

**Medical Education Context:**
- Josh is PGY-3 pediatric resident preparing for board exams
- Struggles with antibiotic coverage patterns versus actual bacteria
- Needs effective study tool that works alongside AAP Pedialink, MedStudy, Board Vitals
- Success measured by: regular use, better board exam performance, faster clinical recall

**Technical Context:**
- Project is a "coding learning sandbox" — Josh learning React, TypeScript, D3.js, testing
- Multiple visualization approaches explored (D3 force graphs, Cytoscape networks, Northwestern pie charts)
- Medical content is solid foundation — focus is on finding best interaction patterns
- Experimentation encouraged — broken features and incomplete explorations are expected

## Constraints

**None** — Full flexibility to experiment with approaches, technologies, and interaction patterns. This is a learning project optimizing for Josh's education, not production requirements.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| D3 v7 force simulation over custom physics | D3's force simulation handles collision, gravity, convergence better | ✓ Good |
| Gram stain color encoding (blue/red/gray) | Medical education convention, clear visual categorization | ✓ Good |
| Reference mode as PRIMARY comparison mode | Best for learning: compare unfamiliar against known antibiotics | ✓ Good |
| UWorld/Board Vitals quiz pattern | Familiar to medical learners, teaching-focused explanations | ✓ Good |
| Accept 5 remaining TypeScript errors | Learning project, 99.2% fixed, diminishing returns | ✓ Good |
| Pivot Phase 5 from spaced repetition to network interactivity | Visual exploration more valuable for this learning project | ✓ Good |

---
*Last updated: 2026-01-08 after v1.0 milestone*
