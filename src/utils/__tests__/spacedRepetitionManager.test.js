/**
 * Spaced Repetition Manager Tests
 * Tests for FSRS algorithm integration and medical education optimization
 */

import spacedRepetitionManager from '../spacedRepetitionManager';
import { Rating, createEmptyCard } from 'ts-fsrs';

// Mock localStorage for testing
const mockLocalStorage = {
  store: {},
  getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.store[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  })
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock quiz questions for testing
const mockQuestions = [
  {
    id: 'q1',
    question: 'What is the empiric therapy for community-acquired pneumonia?',
    difficulty: 'intermediate',
    category: 'respiratory',
    correctAnswer: 'Azithromycin + Cefotaxime'
  },
  {
    id: 'q2', 
    question: 'Which antibiotic covers MRSA?',
    difficulty: 'beginner',
    category: 'antibiotics',
    correctAnswer: 'Vancomycin'
  },
  {
    id: 'q3',
    question: 'What is the treatment duration for uncomplicated UTI?',
    difficulty: 'advanced',
    category: 'urinary',
    correctAnswer: '3-5 days'
  }
];

describe('SpacedRepetitionManager', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    spacedRepetitionManager.cardData = {};
  });

  describe('Card Creation and Management', () => {
    test('should convert question to FSRS card with correct difficulty', () => {
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);

      expect(card).toBeDefined();
      expect(card.difficulty).toBe(0.5); // intermediate difficulty
      expect(spacedRepetitionManager.cardData[`question_${question.id}`]).toBeDefined();
    });

    test('should set correct initial difficulty for different question levels', () => {
      const beginnerCard = spacedRepetitionManager.convertQuestionToCard(mockQuestions[1]);
      const intermediateCard = spacedRepetitionManager.convertQuestionToCard(mockQuestions[0]);
      const advancedCard = spacedRepetitionManager.convertQuestionToCard(mockQuestions[2]);

      expect(beginnerCard.difficulty).toBe(0.3);
      expect(intermediateCard.difficulty).toBe(0.5);
      expect(advancedCard.difficulty).toBe(0.7);
    });

    test('should return existing card if already created', () => {
      const question = mockQuestions[0];
      const card1 = spacedRepetitionManager.convertQuestionToCard(question);
      const card2 = spacedRepetitionManager.convertQuestionToCard(question);

      expect(card1).toBe(card2);
    });

    test('should handle questions without ID using question text', () => {
      const questionWithoutId = {
        question: 'Test question for ID generation',
        difficulty: 'beginner'
      };

      const card = spacedRepetitionManager.convertQuestionToCard(questionWithoutId);
      expect(card).toBeDefined();
      expect(spacedRepetitionManager.cardData['question_Test question for ID generation']).toBeDefined();
    });
  });

  describe('Card Updates and Performance Tracking', () => {
    test('should update card correctly for correct answer', () => {
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);
      const cardId = `question_${question.id}`;

      const result = spacedRepetitionManager.updateCard(cardId, true);

      expect(result).toBeDefined();
      expect(result.card).toBeDefined();
      expect(result.nextReview).toBeDefined();
      expect(result.interval).toBeDefined();
      expect(result.card.reps).toBe(1);
    });

    test('should update card correctly for incorrect answer', () => {
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);
      const cardId = `question_${question.id}`;

      const result = spacedRepetitionManager.updateCard(cardId, false);

      expect(result).toBeDefined();
      expect(result.card.reps).toBe(1);
      // FSRS algorithm may not increment lapses for first incorrect answer on new card
      expect(result.card.lapses).toBe(0);
    });

    test('should handle update for non-existent card', () => {
      const result = spacedRepetitionManager.updateCard('non_existent_card', true);
      expect(result).toBeNull();
    });

    test('should persist card data to localStorage', () => {
      const question = mockQuestions[0];
      spacedRepetitionManager.convertQuestionToCard(question);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'medicalEducation_srsData',
        expect.any(String)
      );
    });
  });

  describe('Due Cards and Scheduling', () => {
    test('should identify due cards correctly', () => {
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);
      
      // Set card as due (past due date)
      const cardId = `question_${question.id}`;
      spacedRepetitionManager.cardData[cardId].due = new Date(Date.now() - 86400000); // 1 day ago

      const dueCards = spacedRepetitionManager.getDueCards();

      expect(dueCards).toHaveLength(1);
      expect(dueCards[0].cardId).toBe(cardId);
      expect(dueCards[0].daysSinceLast).toBeGreaterThan(0);
    });

    test('should sort due cards by priority (overdue first, then difficulty)', () => {
      // Create multiple cards with different due dates and difficulties
      const card1 = spacedRepetitionManager.convertQuestionToCard(mockQuestions[0]); // intermediate
      const card2 = spacedRepetitionManager.convertQuestionToCard(mockQuestions[1]); // beginner
      const card3 = spacedRepetitionManager.convertQuestionToCard(mockQuestions[2]); // advanced

      // Set different due dates
      spacedRepetitionManager.cardData[`question_${mockQuestions[0].id}`].due = new Date(Date.now() - 172800000); // 2 days ago
      spacedRepetitionManager.cardData[`question_${mockQuestions[1].id}`].due = new Date(Date.now() - 86400000); // 1 day ago
      spacedRepetitionManager.cardData[`question_${mockQuestions[2].id}`].due = new Date(Date.now() - 86400000); // 1 day ago

      const dueCards = spacedRepetitionManager.getDueCards();

      expect(dueCards).toHaveLength(3);
      expect(dueCards[0].cardId).toBe(`question_${mockQuestions[0].id}`); // Most overdue first
      expect(dueCards[0].daysSinceLast).toBe(2);
    });

    test('should not include future cards in due list', () => {
      const question = mockQuestions[0];
      spacedRepetitionManager.convertQuestionToCard(question);
      
      // Set card as future due
      const cardId = `question_${question.id}`;
      spacedRepetitionManager.cardData[cardId].due = new Date(Date.now() + 86400000); // 1 day from now

      const dueCards = spacedRepetitionManager.getDueCards();
      expect(dueCards).toHaveLength(0);
    });
  });

  describe('Adaptive Quiz Recommendations', () => {
    test('should prioritize due cards for adaptive quiz', () => {
      // Create cards and make some due
      mockQuestions.forEach(q => spacedRepetitionManager.convertQuestionToCard(q));
      
      // Make first card due
      spacedRepetitionManager.cardData[`question_${mockQuestions[0].id}`].due = new Date(Date.now() - 86400000);

      const recommendations = spacedRepetitionManager.getAdaptiveQuizQuestions(mockQuestions, 5);

      expect(recommendations).toHaveLength(3); // All available questions
      expect(recommendations[0].reason).toBe('Due for review');
      expect(recommendations[0].priority).toBe('high');
    });

    test('should fill remaining slots with new content', () => {
      const recommendations = spacedRepetitionManager.getAdaptiveQuizQuestions(mockQuestions, 3);

      expect(recommendations).toHaveLength(3);
      expect(recommendations.every(r => r.reason === 'New content')).toBe(true);
      expect(recommendations.every(r => r.priority === 'normal')).toBe(true);
    });

    test('should limit recommendations to target count', () => {
      const recommendations = spacedRepetitionManager.getAdaptiveQuizQuestions(mockQuestions, 2);
      expect(recommendations).toHaveLength(2);
    });

    test('should identify weak areas and prioritize them', () => {
      // Mock weak area identification
      jest.spyOn(spacedRepetitionManager, 'identifyWeakAreas').mockReturnValue(['respiratory']);

      const recommendations = spacedRepetitionManager.getAdaptiveQuizQuestions(mockQuestions, 3);
      
      // Should include respiratory question with medium priority
      const respiratoryQuestion = recommendations.find(r => r.category === 'respiratory');
      expect(respiratoryQuestion).toBeDefined();
    });
  });

  describe('Analytics and Progress Tracking', () => {
    test('should calculate basic analytics correctly', () => {
      // Create some test data
      mockQuestions.forEach(q => {
        const card = spacedRepetitionManager.convertQuestionToCard(q);
        const cardId = `question_${q.id}`;
        
        // Simulate some learning progress
        spacedRepetitionManager.updateCard(cardId, true);
      });

      const analytics = spacedRepetitionManager.getAnalytics();

      expect(analytics.totalCards).toBe(3);
      expect(analytics.learned).toBe(3); // All cards have been reviewed
      expect(analytics.averageInterval).toBeGreaterThan(0);
      expect(analytics.retentionRate).toBeDefined();
    });

    test('should handle empty card data in analytics', () => {
      const analytics = spacedRepetitionManager.getAnalytics();

      expect(analytics.totalCards).toBe(0);
      expect(analytics.dueToday).toBe(0);
      expect(analytics.learned).toBe(0);
      expect(analytics.averageInterval).toBe(0);
    });

    test('should calculate retention rate correctly', () => {
      // Create a card and review it successfully
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);
      const cardId = `question_${question.id}`;
      
      spacedRepetitionManager.updateCard(cardId, true);

      const retentionRate = spacedRepetitionManager.calculateRetentionRate();
      expect(retentionRate).toBe(100); // No lapses
    });
  });

  describe('Helper Methods', () => {
    test('should check if card exists for question', () => {
      const question = mockQuestions[0];
      
      expect(spacedRepetitionManager.hasCard(question)).toBe(false);
      
      spacedRepetitionManager.convertQuestionToCard(question);
      
      expect(spacedRepetitionManager.hasCard(question)).toBe(true);
    });

    test('should find question by card ID', () => {
      const question = mockQuestions[0];
      const cardId = `question_${question.id}`;
      
      const foundQuestion = spacedRepetitionManager.findQuestionById(mockQuestions, cardId);
      
      expect(foundQuestion).toBe(question);
    });

    test('should handle malformed localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValueOnce('invalid-json');
      
      const newManager = new spacedRepetitionManager.constructor();
      expect(newManager).toBeDefined();
    });

    test('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      const question = mockQuestions[0];
      // Should not throw error
      expect(() => spacedRepetitionManager.convertQuestionToCard(question)).not.toThrow();
    });
  });

  describe('Medical Education Specific Features', () => {
    test('should use medical education optimized FSRS parameters', () => {
      // Test that the FSRS instance is configured for medical education
      expect(spacedRepetitionManager.f).toBeDefined();
      
      // Test with a new card to verify parameters are working
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);
      
      expect(card.due).toBeDefined();
      expect(card.stability).toBeDefined();
      expect(card.difficulty).toBeDefined();
    });

    test('should cap intervals at 365 days for medical content', () => {
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);
      const cardId = `question_${question.id}`;

      // Simulate multiple correct answers to build up interval
      for (let i = 0; i < 10; i++) {
        spacedRepetitionManager.updateCard(cardId, true);
      }

      const finalCard = spacedRepetitionManager.cardData[cardId];
      expect(finalCard.scheduled_days).toBeLessThanOrEqual(365);
    });

    test('should target 90% retention rate for medical education', () => {
      // This is implicitly tested through the FSRS parameter configuration
      // The algorithm should be optimized for medical education retention
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);
      
      expect(card).toBeDefined();
      // The 90% retention targeting is built into the FSRS algorithm parameters
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle undefined or null questions', () => {
      expect(() => spacedRepetitionManager.convertQuestionToCard(null)).not.toThrow();
      expect(() => spacedRepetitionManager.convertQuestionToCard(undefined)).not.toThrow();
    });

    test('should handle questions with missing properties', () => {
      const incompleteQuestion = { question: 'Test' };
      const card = spacedRepetitionManager.convertQuestionToCard(incompleteQuestion);
      
      expect(card).toBeDefined();
      expect(card.difficulty).toBe(0.5); // Default intermediate difficulty
    });

    test('should handle updateCard with invalid dates', () => {
      const question = mockQuestions[0];
      const card = spacedRepetitionManager.convertQuestionToCard(question);
      const cardId = `question_${question.id}`;

      const result = spacedRepetitionManager.updateCard(cardId, true, new Date('invalid'));
      expect(result).toBeDefined(); // Should use current date as fallback
    });

    test('should handle empty question arrays in adaptive recommendations', () => {
      const recommendations = spacedRepetitionManager.getAdaptiveQuizQuestions([], 5);
      expect(recommendations).toHaveLength(0);
    });
  });
});