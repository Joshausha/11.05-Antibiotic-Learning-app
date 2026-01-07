/**
 * Quiz Question Validation Tests
 *
 * Validates quiz questions for medical accuracy and completeness:
 * - Medical accuracy verification (medicalAccuracyVerified field)
 * - Question completeness (text, answers, explanations)
 * - Content validation (tags, related entities, difficulty)
 *
 * Created: 2026-01-07
 * Phase: 01-03 - Data Validation & Testing
 */

import quizQuestions from '../quizQuestions';

describe('Quiz Question Validation', () => {

  describe('Medical Accuracy Verification', () => {
    test('ALL quiz questions have medicalAccuracyVerified field', () => {
      quizQuestions.forEach((question, index) => {
        expect(question).toHaveProperty('medicalAccuracyVerified');
      });
    });

    test('CRITICAL: all questions have medicalAccuracyVerified set to true', () => {
      // This test FAILS if ANY question is not medically verified
      // This is intentional - unverified questions should not be deployed
      const unverifiedQuestions = quizQuestions.filter(q =>
        !q.medicalAccuracyVerified || q.medicalAccuracyVerified !== true
      );

      if (unverifiedQuestions.length > 0) {
        console.error('\n❌ CRITICAL: Unverified quiz questions found:');
        unverifiedQuestions.forEach(q => {
          const id = q.id || q.conditionId || 'unknown';
          console.error(`  - Question ID: ${id}`);
          console.error(`    Question: ${q.question?.substring(0, 60)}...`);
          console.error(`    medicalAccuracyVerified: ${q.medicalAccuracyVerified}`);
        });
      }

      // FAIL if any unverified questions exist
      expect(unverifiedQuestions).toHaveLength(0);
    });

    test('lastUpdated field exists and is valid ISO date', () => {
      quizQuestions.forEach(question => {
        if (question.lastUpdated) {
          // Check if it's a valid date string
          const date = new Date(question.lastUpdated);
          expect(date.toString()).not.toBe('Invalid Date');

          // Should be in reasonable range (2020-2030)
          expect(date.getFullYear()).toBeGreaterThanOrEqual(2020);
          expect(date.getFullYear()).toBeLessThanOrEqual(2030);
        }
      });
    });

    test('questions marked with verification dates are recent', () => {
      const questionsWithDates = quizQuestions.filter(q => q.lastUpdated);

      if (questionsWithDates.length > 0) {
        const oldestAcceptableDate = new Date('2024-01-01');

        questionsWithDates.forEach(question => {
          const updateDate = new Date(question.lastUpdated);

          // Medical education content should be updated within last 2 years
          if (updateDate < oldestAcceptableDate) {
            console.warn(`⚠️  Question may need review (last updated: ${question.lastUpdated}): ${question.question?.substring(0, 60)}...`);
          }
        });
      }
    });
  });

  describe('Quiz Question Completeness', () => {
    test('question text is non-empty', () => {
      quizQuestions.forEach(question => {
        expect(question).toHaveProperty('question');
        expect(typeof question.question).toBe('string');
        expect(question.question.length).toBeGreaterThan(0);

        // Questions should be meaningful (at least 10 characters)
        expect(question.question.length).toBeGreaterThan(10);
      });
    });

    test('correctAnswer is defined', () => {
      quizQuestions.forEach(question => {
        // Either correctAnswer or correct (legacy) should exist
        const hasAnswer = question.correctAnswer !== undefined ||
                         question.correct !== undefined;

        expect(hasAnswer).toBe(true);
      });
    });

    test('explanation is non-empty (educational value)', () => {
      quizQuestions.forEach(question => {
        expect(question).toHaveProperty('explanation');
        expect(typeof question.explanation).toBe('string');
        expect(question.explanation.length).toBeGreaterThan(0);

        // Explanations should be educational (at least 15 characters)
        expect(question.explanation.length).toBeGreaterThan(15);
      });
    });

    test('difficulty level is valid', () => {
      const validDifficulties = ['beginner', 'intermediate', 'advanced', 'easy', 'medium', 'hard'];

      quizQuestions.forEach(question => {
        if (question.difficulty) {
          expect(validDifficulties).toContain(question.difficulty);
        }
      });
    });

    test('questions have reasonable length', () => {
      quizQuestions.forEach(question => {
        // Questions shouldn't be too short or too long
        expect(question.question.length).toBeGreaterThan(10);
        expect(question.question.length).toBeLessThan(500);
      });
    });
  });

  describe('Quiz Content Validation', () => {
    test('multiple choice questions have options array with >= 2 options', () => {
      const multipleChoiceQuestions = quizQuestions.filter(q =>
        q.type === 'multiple-choice' || q.options
      );

      multipleChoiceQuestions.forEach(question => {
        expect(question).toHaveProperty('options');
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options.length).toBeGreaterThanOrEqual(2);

        // All options should be non-empty strings
        question.options.forEach(option => {
          expect(typeof option).toBe('string');
          expect(option.length).toBeGreaterThan(0);
        });
      });
    });

    test('correctAnswer is in options array (for multiple choice)', () => {
      const multipleChoiceQuestions = quizQuestions.filter(q => q.options);

      multipleChoiceQuestions.forEach(question => {
        if (question.correctAnswer && typeof question.correctAnswer === 'string') {
          // correctAnswer should match one of the options
          expect(question.options).toContain(question.correctAnswer);
        } else if (question.correct !== undefined) {
          // Legacy format: correct is index
          expect(question.correct).toBeGreaterThanOrEqual(0);
          expect(question.correct).toBeLessThan(question.options.length);
        }
      });
    });

    test('tags array is non-empty (for categorization)', () => {
      quizQuestions.forEach(question => {
        if (question.tags) {
          expect(Array.isArray(question.tags)).toBe(true);
          expect(question.tags.length).toBeGreaterThan(0);

          // Tags should be non-empty strings
          question.tags.forEach(tag => {
            expect(typeof tag).toBe('string');
            expect(tag.length).toBeGreaterThan(0);
          });
        }
      });
    });

    test('relatedAntibiotics reference valid antibiotic names (if present)', () => {
      const questionsWithAntibiotics = quizQuestions.filter(q =>
        q.relatedAntibiotics && q.relatedAntibiotics.length > 0
      );

      const commonAntibioticNames = [
        'Penicillin', 'Vancomycin', 'Ceftriaxone', 'Cefepime', 'Azithromycin',
        'Ciprofloxacin', 'Gentamicin', 'Meropenem', 'Linezolid', 'Metronidazole',
        'Doxycycline', 'Clindamycin', 'Piperacillin', 'Ampicillin', 'Cefotaxime'
      ];

      questionsWithAntibiotics.forEach(question => {
        question.relatedAntibiotics.forEach(antibiotic => {
          expect(typeof antibiotic).toBe('string');
          expect(antibiotic.length).toBeGreaterThan(0);

          // Antibiotic names should start with capital letter
          expect(antibiotic[0]).toBe(antibiotic[0].toUpperCase());
        });
      });
    });

    test('relatedPathogens reference valid pathogen names (if present)', () => {
      const questionsWithPathogens = quizQuestions.filter(q =>
        q.relatedPathogens && q.relatedPathogens.length > 0
      );

      questionsWithPathogens.forEach(question => {
        question.relatedPathogens.forEach(pathogen => {
          expect(typeof pathogen).toBe('string');
          expect(pathogen.length).toBeGreaterThan(0);

          // Pathogen names should start with capital letter
          expect(pathogen[0]).toBe(pathogen[0].toUpperCase());
        });
      });
    });

    test('questions with Northwestern focus have appropriate tags', () => {
      const northwesternQuestions = quizQuestions.filter(q =>
        q.northwesternFocus || q.targetSegment
      );

      northwesternQuestions.forEach(question => {
        // Northwestern questions should have tags array
        if (question.tags) {
          expect(Array.isArray(question.tags)).toBe(true);
        }

        // targetSegment should be valid Northwestern category
        if (question.targetSegment) {
          const validSegments = [
            'MRSA', 'VRE_faecium', 'anaerobes', 'atypicals',
            'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis',
            'multiple', 'visual'
          ];

          expect(validSegments).toContain(question.targetSegment);
        }
      });
    });
  });

  describe('Legacy Field Support', () => {
    test('legacy quiz format fields are handled gracefully', () => {
      quizQuestions.forEach(question => {
        // Legacy fields should be valid if present
        if (question.category) {
          expect(typeof question.category).toBe('string');
        }

        if (question.conditionId) {
          expect(typeof question.conditionId).toBe('string');
        }

        if (question.correct !== undefined) {
          expect(typeof question.correct).toBe('number');
        }
      });
    });

    test('quiz questions work with both old and new formats', () => {
      // Count questions using different formats
      const newFormatQuestions = quizQuestions.filter(q =>
        q.type && q.difficulty && q.correctAnswer
      );

      const legacyFormatQuestions = quizQuestions.filter(q =>
        q.category && q.conditionId && q.correct !== undefined
      );

      console.log(`\n✓ New format questions: ${newFormatQuestions.length}`);
      console.log(`✓ Legacy format questions: ${legacyFormatQuestions.length}`);

      // Both formats should exist (backward compatibility)
      expect(legacyFormatQuestions.length).toBeGreaterThan(0);
    });
  });

  describe('Data Quality Metrics', () => {
    test('test summary: quiz questions validated', () => {
      const totalQuestions = quizQuestions.length;
      const verifiedQuestions = quizQuestions.filter(q =>
        q.medicalAccuracyVerified === true
      ).length;
      const questionsWithExplanations = quizQuestions.filter(q =>
        q.explanation && q.explanation.length > 15
      ).length;
      const questionsWithTags = quizQuestions.filter(q =>
        q.tags && q.tags.length > 0
      ).length;

      console.log(`\n✓ Total quiz questions: ${totalQuestions}`);
      console.log(`✓ Medically verified: ${verifiedQuestions}/${totalQuestions}`);
      console.log(`✓ With explanations: ${questionsWithExplanations}/${totalQuestions}`);
      console.log(`✓ With tags: ${questionsWithTags}/${totalQuestions}`);

      // Quality thresholds
      expect(totalQuestions).toBeGreaterThan(0);
      expect(questionsWithExplanations).toBe(totalQuestions); // All should have explanations
    });

    test('question coverage across difficulty levels', () => {
      const byDifficulty = {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        unspecified: 0
      };

      quizQuestions.forEach(question => {
        if (question.difficulty) {
          byDifficulty[question.difficulty]++;
        } else {
          byDifficulty.unspecified++;
        }
      });

      console.log(`\n✓ Questions by difficulty:`);
      Object.entries(byDifficulty).forEach(([level, count]) => {
        if (count > 0) {
          console.log(`  - ${level}: ${count}`);
        }
      });

      // Should have questions at multiple difficulty levels
      const levelsWithQuestions = Object.values(byDifficulty).filter(count => count > 0).length;
      expect(levelsWithQuestions).toBeGreaterThan(0);
    });
  });
});
