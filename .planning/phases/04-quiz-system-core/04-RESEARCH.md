# Phase 4: Quiz System Core - Research

**Researched:** 2026-01-07
**Domain:** React quiz components (commodity domain)
**Confidence:** HIGH

<research_summary>
## Summary

Phase 4 is a **commodity domain** — standard React component patterns for quiz/testing UI. The codebase already has substantial quiz infrastructure that was built experimentally. This phase is about **refining and formalizing** the existing work, not building from scratch.

**Key finding:** Extensive quiz infrastructure already exists:
- `QuizTab.tsx` (730+ lines) — full quiz flow with difficulty filtering, spaced repetition
- `QuizQuestion` interface — complete with explanations, difficulty, tags, medical accuracy
- 91 quiz questions — with categories, explanations, correct answers
- Spaced repetition via `spacedRepetitionManager.ts` — ts-fsrs integration

**Primary recommendation:** Refactor and simplify the existing QuizTab component to match the UWorld/Board Vitals UX pattern from CONTEXT.md. Focus on explanation presentation (the "teaching moment") rather than building new infrastructure.

</research_summary>

<existing_infrastructure>
## Existing Infrastructure (CRITICAL)

### Already Built Components

| Component | Location | Status | Notes |
|-----------|----------|--------|-------|
| QuizTab | `src/components/QuizTab.tsx` | 730 lines | Full quiz flow, needs cleanup |
| NorthwesternQuizComponent | `src/components/NorthwesternQuizComponent.tsx` | Working | Visual quiz variant |
| SkeletonLoader | `src/components/SkeletonLoader.tsx` | Working | Quiz loading state |
| ErrorMessage | `src/components/ErrorMessage.tsx` | Working | Quiz error handling |
| QuizProgress | `src/components/ProgressIndicator.tsx` | Working | Progress bar |

### Already Built Types

| Type | Location | Notes |
|------|----------|-------|
| QuizQuestion | `src/types/medical.types.ts` | Complete interface with explanation, difficulty, tags |
| QuizAnswer | `src/types/medical.types.ts` | Answer tracking |
| QuizSession | `src/types/medical.types.ts` | Session state |
| UserProgress | `src/types/medical.types.ts` | Spaced repetition progress |
| DifficultyLevel | `src/types/medical.types.ts` | beginner/intermediate/advanced |

### Already Built Data

| Data | Location | Count | Notes |
|------|----------|-------|-------|
| Quiz questions | `src/data/quizQuestions.ts` | 91 | From RBO_JSON with explanations |
| Northwestern questions | `src/data/northwesternQuizQuestions.ts` | 12 | Visual pie chart questions |
| Questions with difficulty | `src/data/quizQuestionsWithDifficulty.ts` | ? | Extended difficulty data |

### Already Built Utilities

| Utility | Location | Notes |
|---------|----------|-------|
| spacedRepetitionManager | `src/utils/spacedRepetitionManager.ts` | ts-fsrs integration |
| useQuizProgress | `src/hooks/useQuizProgress.ts` | Progress tracking hook |

</existing_infrastructure>

<standard_stack>
## Standard Stack

### Already In Use (don't change)
| Library | Version | Purpose |
|---------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Lucide React | latest | Icons |
| ts-fsrs | latest | Spaced repetition (Phase 5 scope) |

### No Additional Libraries Needed
The existing stack covers all quiz requirements. Don't add:
- New animation libraries (existing transitions sufficient)
- State management libraries (local state + existing hooks sufficient)
- Form libraries (quiz is simple option selection)

</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Current Pattern (QuizTab.tsx)
The existing component handles too much:
- Start screen
- Difficulty selection
- Quiz questions
- Results screen
- Spaced repetition integration
- Northwestern variant

**Result:** 730-line component that's hard to maintain.

### Recommended Pattern (Refactor)

```typescript
// Split into focused components:
src/components/quiz/
├── QuizStartScreen.tsx     // Difficulty selection, start button
├── QuizQuestion.tsx        // Single question display (CORE)
├── QuizExplanation.tsx     // Explanation reveal (TEACHING MOMENT)
├── QuizResults.tsx         // End-of-session summary
├── QuizSession.tsx         // Orchestrates the flow
└── index.ts                // Barrel export
```

### Key Pattern: Board Prep UX Flow

```
[Start] → [Question] → [Select Answer] → [Submit] → [Show Explanation] → [Next] → ... → [Results]
                                              ↑
                                    THE TEACHING MOMENT
                                    (per CONTEXT.md: "essential")
```

### Anti-Patterns to Avoid
- **Don't rebuild from scratch** — existing code works, needs cleanup not replacement
- **Don't remove spaced repetition hooks** — even if out of scope, preserve for Phase 5
- **Don't add complex state management** — local state + props sufficient for quiz flow

</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Already Have | Notes |
|---------|-------------|--------------|-------|
| Quiz data structure | Custom question format | QuizQuestion interface | Phase 1 established this |
| Progress tracking | Custom state | useQuizProgress hook | Already built |
| Spaced repetition | Custom algorithm | spacedRepetitionManager | Already using ts-fsrs |
| Loading states | Custom spinner | SkeletonLoader | Already built |
| Error handling | Custom error UI | ErrorMessage | Already built |

**Key insight:** This phase is about UX refinement, not infrastructure. The infrastructure already exists.

</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Over-Engineering the Refactor
**What goes wrong:** Spending time on elaborate component architecture when the goal is UX improvement
**Why it happens:** Developer instinct to "do it right" when existing code looks messy
**How to avoid:** Focus on the vision from CONTEXT.md — UWorld/Board Vitals feel, explanation quality
**Warning signs:** Discussing Redux, complex state machines, over-abstraction

### Pitfall 2: Breaking Existing Functionality
**What goes wrong:** Refactor breaks working quiz flow
**Why it happens:** Not understanding all the edge cases the 730-line component handles
**How to avoid:** Keep existing QuizTab working, build new components alongside, swap when ready
**Warning signs:** Tests failing, features disappearing

### Pitfall 3: Ignoring the Explanation UX
**What goes wrong:** Focus on question display, neglect the teaching moment
**Why it happens:** Questions feel like "the quiz," but per CONTEXT.md, explanations are the heart
**How to avoid:** Design explanation component first — this is the essential piece
**Warning signs:** Explanation is just text dump, no visual hierarchy, no "aha" moment

### Pitfall 4: Scope Creep into Phase 5/6
**What goes wrong:** Start building spaced repetition UI, visual mode connections
**Why it happens:** Code is already there, tempting to enhance
**How to avoid:** CONTEXT.md boundaries are clear — persistence, SR scheduling, visual links are OUT
**Warning signs:** Touching spacedRepetitionManager behavior, adding localStorage, linking to network view

</common_pitfalls>

<code_examples>
## Code Examples

### Existing Question Interface (from medical.types.ts)
```typescript
export interface QuizQuestion {
  id: string | number;
  question: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  correctAnswer: string | string[];
  options?: string[];
  explanation: string;  // ← THE TEACHING MOMENT
  tags: string[];
  relatedAntibiotics?: string[];
  relatedPathogens?: string[];
  medicalAccuracyVerified: boolean;
  lastUpdated: string;
}
```

### Existing Quiz Answer Handling (from QuizTab.tsx)
```typescript
const handleQuizAnswer = (answerIndex: number): void => {
  const currentQuestion = currentQuestions[currentQuizQuestion];

  // Store selected answer
  const newAnswers = { ...selectedAnswers };
  newAnswers[currentQuizQuestion] = answerIndex;
  setSelectedAnswers(newAnswers);

  // Check correctness
  const isCorrect = answerIndex === currentQuestion.correct;
  if (isCorrect) {
    setQuizScore(quizScore + 1);
  }

  // Auto-advance after delay (shows explanation first)
  setTimeout(() => {
    if (currentQuizQuestion < currentQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      setShowQuizResult(true);
    }
  }, 1500);  // ← This delay shows explanation
};
```

### Board Prep Style Explanation (recommended pattern)
```typescript
// QuizExplanation.tsx - THE TEACHING MOMENT
interface QuizExplanationProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
  selectedAnswer: string;
  onNext: () => void;
}

const QuizExplanation: React.FC<QuizExplanationProps> = ({
  isCorrect,
  explanation,
  correctAnswer,
  selectedAnswer,
  onNext
}) => (
  <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-amber-50'}`}>
    {/* Immediate feedback */}
    <div className="flex items-center gap-3 mb-4">
      {isCorrect ? (
        <CheckCircle className="text-green-600" size={28} />
      ) : (
        <XCircle className="text-red-600" size={28} />
      )}
      <span className="font-semibold text-lg">
        {isCorrect ? 'Correct!' : `Incorrect — The answer is ${correctAnswer}`}
      </span>
    </div>

    {/* THE TEACHING MOMENT - explanation with visual hierarchy */}
    <div className="prose prose-sm max-w-none mb-6">
      <h4 className="text-blue-800 font-medium">Explanation</h4>
      <p className="text-gray-700 leading-relaxed">{explanation}</p>
    </div>

    {/* User controls when to proceed */}
    <button
      onClick={onNext}
      className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium"
    >
      Next Question →
    </button>
  </div>
);
```

</code_examples>

<open_questions>
## Open Questions

### 1. Preserve or Replace QuizTab?
**What we know:** QuizTab works but is bloated (730 lines)
**What's unclear:** Should we refactor in-place or build new components and swap?
**Recommendation:** Build new components alongside, verify they work, then swap. Safer than destructive refactor.

### 2. Question Count per Session
**What we know:** Current code uses 10 questions when spaced repetition is on
**What's unclear:** Is 10 the right number for board prep feel?
**Recommendation:** Keep 10 as default, add configuration later if needed. Not essential for Phase 4.

### 3. Mobile Responsiveness
**What we know:** Current QuizTab has some responsive classes
**What's unclear:** Is mobile optimization essential or nice-to-have?
**Recommendation:** Per CONTEXT.md, no mobile optimization mentioned — defer unless it blocks core UX.

</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `src/components/QuizTab.tsx` — Existing implementation (read directly)
- `src/types/medical.types.ts` — Type definitions (read directly)
- `src/data/quizQuestions.ts` — Quiz content (read directly)
- `.planning/phases/04-quiz-system-core/04-CONTEXT.md` — User vision

### Secondary (N/A)
No external research needed — this is commodity React component development using existing codebase patterns.

</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: React functional components, TypeScript
- Ecosystem: Existing codebase patterns (no new libraries)
- Patterns: Board prep UX, component decomposition
- Pitfalls: Over-engineering, breaking existing code, ignoring explanations

**Confidence breakdown:**
- Existing infrastructure: HIGH — read directly from codebase
- Recommended patterns: HIGH — standard React patterns
- Pitfalls: HIGH — common refactoring mistakes
- Code examples: HIGH — from existing codebase + standard patterns

**Research date:** 2026-01-07
**Valid until:** 2026-02-07 (30 days — React patterns stable)

</metadata>

---

*Phase: 04-quiz-system-core*
*Research completed: 2026-01-07*
*Ready for planning: yes*
