/**
 * Spaced Repetition Manager
 * Integration wrapper for ts-fsrs library with existing quiz system
 *
 * Uses FSRS (Free Spaced Repetition Scheduler) algorithm which is superior to SM-2
 * and proven effective with millions of Anki users
 */

import { fsrs, generatorParameters, Rating, Card, createEmptyCard } from 'ts-fsrs';

/**
 * Type definitions for spaced repetition manager
 */

interface Question {
  id: string | number;
  question?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  [key: string]: any;
}

interface CardData {
  [key: string]: Card;
}

interface DueCard {
  cardId: string;
  card: Card;
  daysSinceLast: number;
}

interface RecommendedQuestion extends Question {
  reason: string;
  priority: 'high' | 'medium' | 'normal';
  cardId?: string;
}

interface UpdateCardResult {
  card: Card;
  nextReview: Date;
  interval: number;
}

interface Analytics {
  totalCards: number;
  dueToday: number;
  learned: number;
  mature: number;
  averageInterval: number;
  retentionRate: number;
  streakCount: number;
  weeklyProgress: any[];
}

interface CategoryPerformance {
  [key: string]: {
    total: number;
    lapses: number;
  };
}

class SpacedRepetitionManager {
  private f: ReturnType<typeof fsrs>;
  private storageKey: string;
  private cardData: CardData;

  constructor() {
    // Initialize FSRS with default parameters optimized for medical education
    this.f = fsrs(generatorParameters({
      enable_fuzz: true,
      enable_short_term: true,
      maximum_interval: 365,
      request_retention: 0.9
    }));

    this.storageKey = 'medicalEducation_srsData';
    this.cardData = this.loadCardData();
  }

  /**
   * Convert existing quiz question to FSRS card format
   */
  convertQuestionToCard(question: Question | null | undefined): Card | null {
    if (!question) {
      console.warn('Cannot convert null or undefined question to card');
      return null;
    }

    const cardId = `question_${question.id || (question.question?.substring(0, 50) || '')}`;

    if (this.cardData[cardId]) {
      return this.cardData[cardId];
    }

    let initialDifficulty = 0.5;
    if (question.difficulty === 'beginner') initialDifficulty = 0.3;
    else if (question.difficulty === 'intermediate') initialDifficulty = 0.5;
    else if (question.difficulty === 'advanced') initialDifficulty = 0.7;

    const newCard = createEmptyCard(new Date(), (c: Card) => ({
      ...c,
      difficulty: initialDifficulty
    }));

    this.cardData[cardId] = newCard;
    this.saveCardData();
    return newCard;
  }

  /**
   * Update card based on quiz performance
   */
  updateCard(cardId: string, isCorrect: boolean, reviewDate: Date = new Date()): UpdateCardResult | null {
    const card = this.cardData[cardId];
    if (!card) {
      console.warn(`Card ${cardId} not found`);
      return null;
    }

    const rating = isCorrect ? Rating.Good : Rating.Again;
    const scheduling = this.f.repeat(card, reviewDate);
    const updatedCard = scheduling[rating].card;

    this.cardData[cardId] = updatedCard;
    this.saveCardData();

    return {
      card: updatedCard,
      nextReview: updatedCard.due,
      interval: updatedCard.scheduled_days
    };
  }

  /**
   * Get questions due for review
   */
  getDueCards(): DueCard[] {
    const now = new Date();
    const dueCards: DueCard[] = [];

    for (const [cardId, card] of Object.entries(this.cardData)) {
      if (card.due <= now) {
        dueCards.push({
          cardId,
          card,
          daysSinceLast: Math.floor((now.getTime() - card.due.getTime()) / (1000 * 60 * 60 * 24))
        });
      }
    }

    return dueCards.sort((a, b) => {
      if (a.daysSinceLast !== b.daysSinceLast) {
        return b.daysSinceLast - a.daysSinceLast;
      }
      return b.card.difficulty - a.card.difficulty;
    });
  }

  /**
   * Get adaptive quiz recommendations
   */
  getAdaptiveQuizQuestions(allQuestions: Question[] | null | undefined, targetCount: number = 10): RecommendedQuestion[] {
    if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
      console.warn('getAdaptiveQuizQuestions: No valid questions provided');
      return [];
    }

    const dueCards = this.getDueCards();
    const recommendations: RecommendedQuestion[] = [];

    // First priority: due reviews
    const dueQuestions = dueCards.slice(0, Math.min(Math.floor(targetCount * 0.7), dueCards.length));
    const validDueQuestions = dueQuestions
      .map(dc => {
        const foundQuestion = this.findQuestionById(allQuestions, dc.cardId);
        if (foundQuestion) {
          return {
            ...foundQuestion,
            reason: 'Due for review',
            priority: 'high' as const,
            cardId: dc.cardId
          };
        }
        return null;
      })
      .filter((q): q is RecommendedQuestion => q !== null);

    recommendations.push(...validDueQuestions);

    // Second priority: new content in weak areas
    const remainingSlots = targetCount - recommendations.length;
    if (remainingSlots > 0) {
      const weakAreas = this.identifyWeakAreas();
      const newQuestions = allQuestions
        .filter(q => q && !this.hasCard(q))
        .filter(q => weakAreas.includes(q.category || ''))
        .slice(0, remainingSlots);

      recommendations.push(...newQuestions.map(q => ({
        ...q,
        reason: 'New content in weak area',
        priority: 'medium' as const
      })));
    }

    // Fill remaining slots with new content
    const finalSlots = targetCount - recommendations.length;
    if (finalSlots > 0) {
      const newQuestions = allQuestions
        .filter(q => q && !this.hasCard(q))
        .filter(q => !recommendations.find(r => r.id === q.id))
        .slice(0, finalSlots);

      recommendations.push(...newQuestions.map(q => ({
        ...q,
        reason: 'New content',
        priority: 'normal' as const
      })));
    }

    const validRecommendations = recommendations.filter(r => r && r.question);
    console.log(`SpacedRepetition: Returning ${validRecommendations.length} valid recommendations`);
    return validRecommendations;
  }

  /**
   * Get learning analytics
   */
  getAnalytics(): Analytics {
    const cards = Object.values(this.cardData);
    const now = new Date();

    const reviewedCards = cards.filter(c => c.reps > 0);
    const averageInterval = reviewedCards.length > 0 ?
      reviewedCards.reduce((sum, c) => sum + (c.scheduled_days || 1), 0) / reviewedCards.length : 0;

    const analytics: Analytics = {
      totalCards: cards.length,
      dueToday: cards.filter(c => c.due <= now).length,
      learned: cards.filter(c => c.reps > 0).length,
      mature: cards.filter(c => c.stability > 21).length,
      averageInterval: averageInterval,
      retentionRate: this.calculateRetentionRate(),
      streakCount: this.calculateStreakCount(),
      weeklyProgress: this.getWeeklyProgress()
    };

    return analytics;
  }

  /**
   * Identify weak subject areas based on performance
   */
  identifyWeakAreas(): string[] {
    const categoryPerformance: CategoryPerformance = {};

    for (const card of Object.values(this.cardData)) {
      const category = this.getCategoryFromCardId(card);
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { total: 0, lapses: 0 };
      }
      categoryPerformance[category].total++;
      categoryPerformance[category].lapses += card.lapses;
    }

    return Object.entries(categoryPerformance)
      .filter(([, data]) => data.total > 2)
      .filter(([, data]) => data.lapses / data.total > 0.3)
      .map(([category]) => category);
  }

  /**
   * Get card data (read-only access for analytics)
   */
  getCardData(): CardData {
    return this.cardData;
  }

  /**
   * Load card data from localStorage
   */
  private loadCardData(): CardData {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Error loading spaced repetition data:', error);
      return {};
    }
  }

  /**
   * Save card data to localStorage
   */
  private saveCardData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cardData));
    } catch (error) {
      console.warn('Error saving spaced repetition data:', error);
    }
  }

  /**
   * Check if question already has a card
   */
  private hasCard(question: Question | null | undefined): boolean {
    if (!question) {
      return false;
    }

    const cardId = `question_${question.id || (question.question?.substring(0, 50) || '')}`;
    return !!this.cardData[cardId];
  }

  /**
   * Find question by card ID
   */
  private findQuestionById(questions: Question[], cardId: string): Question | null {
    if (!Array.isArray(questions) || !cardId) {
      return null;
    }

    const questionKey = cardId.replace('question_', '');
    return questions.find(q =>
      q && (q.id === questionKey || q.question?.substring(0, 50) === questionKey)
    ) || null;
  }

  /**
   * Get category from card (placeholder)
   */
  private getCategoryFromCardId(card: Card): string {
    return 'General';
  }

  /**
   * Calculate retention rate
   */
  private calculateRetentionRate(): number {
    const reviewedCards = Object.values(this.cardData).filter(c => c.reps > 0);
    if (reviewedCards.length === 0) return 100;

    const successfulReviews = reviewedCards.filter(c => c.lapses === 0);
    return Math.round((successfulReviews.length / reviewedCards.length) * 100);
  }

  /**
   * Calculate streak count (placeholder)
   */
  private calculateStreakCount(): number {
    return 0;
  }

  /**
   * Get weekly progress (placeholder)
   */
  private getWeeklyProgress(): any[] {
    return [];
  }
}

// Export singleton instance
export default new SpacedRepetitionManager();
