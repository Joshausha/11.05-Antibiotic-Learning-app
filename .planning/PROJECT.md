# Antibiotic Learning App

## What This Is

A personal learning tool for antibiotic and bacteria education that helps Josh (PGY-3 pediatric resident) master gram staining, antibiotic classes, formulations, and coverage patterns through interactive exploration, comparison, and spaced repetition testing.

## Core Value

Accurate medical data with flexible, experimental interaction modes that transform antibiotic coverage knowledge into durable clinical recall.

## Requirements

### Validated

- ✓ Antibiotic and pathogen data structure — existing
- ✓ Gram positive/negative classification system — existing
- ✓ Antibiotic class and formulation taxonomy — existing
- ✓ React/TypeScript/D3 technical foundation — existing

### Active

- [ ] Visual network/graph exploration showing antibiotic-bacteria relationships
- [ ] Side-by-side comparison interface for antibiotics and bacteria properties
- [ ] Quiz/flashcard system with spaced repetition for retention
- [ ] Multiple interaction modes that reinforce learning in different ways

### Out of Scope

- **Patient care integration** — No clinical decision support, EMR integration, or real patient data. This is a learning tool, not a clinical tool.
- **Multi-user/social features** — Solo learning experience. No collaboration, progress sharing, or comparing with other learners.
- **Production deployment** — Personal learning sandbox for experimentation. Not a published or production application.

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

**Existing Codebase:**
- 50+ React components (many experimental)
- Medical data files (pathogens, antibiotics, quiz questions)
- Northwestern visualization system (current main approach)
- Custom hooks and utilities
- Jest + React Testing Library setup
- TypeScript with intentionally relaxed strictness for learning

## Constraints

**None** — Full flexibility to experiment with approaches, technologies, and interaction patterns. This is a learning project optimizing for Josh's education, not production requirements.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Multiple learning modalities (visual, comparison, quiz) | These modes reinforce each other — visual exploration aids pattern recognition, comparison deepens understanding, testing drives retention | — Pending |
| Medical accuracy, exploration, retention equally important | All three must work together — inaccurate data undermines trust, poor exploration blocks discovery, weak retention defeats learning purpose | — Pending |
| Existing data structure is foundation | Antibiotic/bacteria content is validated and solid — implementation focus on interaction experimentation | — Pending |
| Learning sandbox philosophy | Project optimizes for Josh's technical learning (React, TypeScript, D3) alongside medical learning — messiness and experimentation expected | — Pending |

---
*Last updated: 2026-01-06 after initialization*
