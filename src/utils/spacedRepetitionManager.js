/**
 * Spaced Repetition Manager
 * Integration wrapper for ts-fsrs library with existing quiz system
 * 
 * Uses FSRS (Free Spaced Repetition Scheduler) algorithm which is superior to SM-2
 * and proven effective with millions of Anki users
 */

import { fsrs, generatorParameters, Rating, Card, createEmptyCard } from 'ts-fsrs';

class SpacedRepetitionManager {
  constructor() {
    // Initialize FSRS with default parameters optimized for medical education
    this.f = fsrs(generatorParameters({ 
      enable_fuzz: true,  // Add slight randomization to review intervals
      enable_short_term: true,  // Optimize for initial learning
      maximum_interval: 365,  // Cap at 1 year for medical content
      request_retention: 0.9  // Target 90% retention rate
    }));
    
    // Storage key for user's spaced repetition data
    this.storageKey = 'medicalEducation_srsData';
    
    // Load existing card data from localStorage
    this.cardData = this.loadCardData();
  }

  /**
   * Convert existing quiz question to FSRS card format
   * @param {Object} question - Quiz question object
   * @returns {Object} FSRS card object
   */
  convertQuestionToCard(question) {
    const cardId = `question_${question.id || question.question?.substring(0, 50)}`;
    
    // Check if card already exists
    if (this.cardData[cardId]) {
      return this.cardData[cardId];
    }

    // Create new card with difficulty based on question difficulty
    let initialDifficulty = 0.5; // Default
    if (question.difficulty === 'beginner') initialDifficulty = 0.3;
    else if (question.difficulty === 'intermediate') initialDifficulty = 0.5;
    else if (question.difficulty === 'advanced') initialDifficulty = 0.7;

    const newCard = createEmptyCard(new Date(), (c) => ({
      ...c,
      difficulty: initialDifficulty
    }));

    this.cardData[cardId] = newCard;
    this.saveCardData();
    return newCard;
  }

  /**
   * Update card based on quiz performance
   * @param {string} cardId - Unique card identifier
   * @param {boolean} isCorrect - Whether user answered correctly
   * @param {Date} reviewDate - Date of review (default: now)
   * @returns {Object} Updated card object
   */
  updateCard(cardId, isCorrect, reviewDate = new Date()) {
    const card = this.cardData[cardId];
    if (!card) {
      console.warn(`Card ${cardId} not found`);
      return null;
    }

    // Determine rating based on performance
    let rating;
    if (isCorrect) {
      rating = Rating.Good; // Standard correct answer
    } else {
      rating = Rating.Again; // Incorrect, needs review sooner
    }

    // Calculate new card state using FSRS
    const scheduling = this.f.repeat(card, reviewDate);
    const updatedCard = scheduling[rating].card;

    // Save updated card
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
   * @returns {Array} Array of card IDs due for review
   */
  getDueCards() {
    const now = new Date();
    const dueCards = [];

    for (const [cardId, card] of Object.entries(this.cardData)) {
      if (card.due <= now) {
        dueCards.push({
          cardId,
          card,
          daysSinceLast: Math.floor((now - card.due) / (1000 * 60 * 60 * 24))
        });
      }
    }

    // Sort by priority: overdue cards first, then by difficulty
    return dueCards.sort((a, b) => {
      if (a.daysSinceLast !== b.daysSinceLast) {
        return b.daysSinceLast - a.daysSinceLast; // Overdue first
      }
      return b.card.difficulty - a.card.difficulty; // Harder cards first
    });
  }

  /**
   * Get adaptive quiz recommendations
   * @param {Array} allQuestions - All available questions
   * @param {number} targetCount - Number of questions needed
   * @returns {Array} Recommended questions for optimal learning
   */
  getAdaptiveQuizQuestions(allQuestions, targetCount = 10) {
    const dueCards = this.getDueCards();
    const recommendations = [];

    // First priority: due reviews (spaced repetition)
    const dueQuestions = dueCards.slice(0, Math.min(targetCount * 0.7, dueCards.length));
    recommendations.push(...dueQuestions.map(dc => ({
      ...this.findQuestionById(allQuestions, dc.cardId),
      reason: 'Due for review',
      priority: 'high',
      cardId: dc.cardId
    })));

    // Second priority: new content in weak areas
    const remainingSlots = targetCount - recommendations.length;
    if (remainingSlots > 0) {
      const weakAreas = this.identifyWeakAreas();
      const newQuestions = allQuestions
        .filter(q => !this.hasCard(q))
        .filter(q => weakAreas.includes(q.category))
        .slice(0, remainingSlots);

      recommendations.push(...newQuestions.map(q => ({
        ...q,
        reason: 'New content in weak area',
        priority: 'medium'
      })));
    }

    // Fill remaining slots with new content
    const finalSlots = targetCount - recommendations.length;
    if (finalSlots > 0) {
      const newQuestions = allQuestions
        .filter(q => !this.hasCard(q))
        .filter(q => !recommendations.find(r => r.id === q.id))
        .slice(0, finalSlots);

      recommendations.push(...newQuestions.map(q => ({
        ...q,
        reason: 'New content',
        priority: 'normal'
      })));
    }

    return recommendations;
  }

  /**
   * Get learning analytics
   * @returns {Object} Analytics data for progress tracking
   */
  getAnalytics() {
    const cards = Object.values(this.cardData);
    const now = new Date();

    const analytics = {
      totalCards: cards.length,
      dueToday: cards.filter(c => c.due <= now).length,
      learned: cards.filter(c => c.reps > 0).length,
      mature: cards.filter(c => c.stability > 21).length, // 3+ weeks stability
      averageInterval: cards.length > 0 ? 
        cards.reduce((sum, c) => sum + c.scheduled_days, 0) / cards.length : 0,
      retentionRate: this.calculateRetentionRate(),
      streakCount: this.calculateStreakCount(),
      weeklyProgress: this.getWeeklyProgress()
    };

    return analytics;
  }

  /**
   * Identify weak subject areas based on performance
   * @returns {Array} Categories that need more practice
   */
  identifyWeakAreas() {
    const categoryPerformance = {};
    
    for (const card of Object.values(this.cardData)) {
      const category = this.getCategoryFromCardId(card.cardId);
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { total: 0, lapses: 0 };
      }
      categoryPerformance[category].total++;
      categoryPerformance[category].lapses += card.lapses;
    }

    // Return categories with high lapse rates
    return Object.entries(categoryPerformance)
      .filter(([, data]) => data.total > 2) // Minimum data requirement
      .filter(([, data]) => data.lapses / data.total > 0.3) // >30% lapse rate
      .map(([category]) => category);
  }

  // Helper methods
  loadCardData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Error loading spaced repetition data:', error);
      return {};
    }
  }

  saveCardData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cardData));
    } catch (error) {
      console.warn('Error saving spaced repetition data:', error);
    }
  }

  hasCard(question) {
    const cardId = `question_${question.id || question.question?.substring(0, 50)}`;
    return !!this.cardData[cardId];
  }

  findQuestionById(questions, cardId) {
    const questionKey = cardId.replace('question_', '');
    return questions.find(q => 
      q.id === questionKey || 
      q.question?.substring(0, 50) === questionKey
    );
  }

  getCategoryFromCardId(cardId) {
    // This would need to be enhanced based on actual question structure
    return 'General'; // Placeholder
  }

  calculateRetentionRate() {
    const reviewedCards = Object.values(this.cardData).filter(c => c.reps > 0);
    if (reviewedCards.length === 0) return 100;
    
    const successfulReviews = reviewedCards.filter(c => c.lapses === 0);
    return Math.round((successfulReviews.length / reviewedCards.length) * 100);
  }

  calculateStreakCount() {
    // Placeholder - would track consecutive days of studying
    return 0;
  }

  getWeeklyProgress() {
    // Placeholder - would track progress over past week
    return [];
  }
}

// Export singleton instance
export default new SpacedRepetitionManager();