# Phase 4: Quiz System Core - Context

**Gathered:** 2026-01-07
**Status:** Ready for planning

<vision>
## How This Should Work

Multiple choice quiz experience modeled after board prep software like UWorld and Board Vitals. A question stem appears with 4-5 answer options. You select your answer, submit, and immediately see whether you're right or wrong — but the key moment is the **explanation** that follows.

The explanation is where learning actually happens. This isn't just a testing tool, it's a teaching tool. Every question is an opportunity to reinforce the "why" behind antibiotic selection, pathogen coverage, and mechanism of action.

The experience should feel familiar to anyone who's done medical board prep — clean interface, focused on one question at a time, no distractions from the learning moment.

</vision>

<essential>
## What Must Be Nailed

- **Explanations are the heart** — If the teaching content after each question is weak, the whole thing fails. The explanation is where real learning happens.
- **Board prep UX pattern** — Question stem, multiple choice options, submit button, reveal explanation. Proven format that medical learners know and trust.

</essential>

<boundaries>
## What's Out of Scope

- **Spaced repetition scheduling** — No SM-2/ts-fsrs algorithm in this phase. That's Phase 5.
- **Connection to visual modes** — Quiz lives standalone for now. No linking questions to the network visualization or comparison views. That's Phase 6.
- **Progress persistence** — No saving state between sessions. In-memory only during a quiz session. Persistence comes later.
- **Analytics/reporting** — Simple correct/incorrect tracking during session, but no dashboards or performance analytics yet.

</boundaries>

<specifics>
## Specific Ideas

- UWorld/Board Vitals visual style — familiar to medical learners
- One question at a time, centered, minimal chrome
- Clear visual feedback on answer selection (highlight chosen option)
- Explanation reveals after submit, not before
- "Next Question" button appears after reviewing explanation
- Session concept: go through N questions in a sitting, see summary at end

</specifics>

<notes>
## Additional Context

Josh is a PGY-3 pediatric resident actively using board prep software (AAP Pedialink, MedStudy, Board Vitals). He knows this format intimately from both sides — as a learner and as someone thinking about medical education.

The existing quiz questions in `EnhancedAntibioticData.ts` have explanations built in via the unified quiz structure from Phase 1. This phase is about surfacing that content through a proper quiz interface.

Focus is on getting the core mechanics right before layering on spaced repetition intelligence (Phase 5) or connecting to the visual exploration modes (Phase 6).

</notes>

---

*Phase: 04-quiz-system-core*
*Context gathered: 2026-01-07*
