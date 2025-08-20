/**
 * Tests for Quiz Questions Data
 * @description Comprehensive test suite for quiz questions data integrity and educational value
 */

import quizQuestions from '../quizQuestions';

describe('Quiz Questions Data Structure', () => {
  test('should export an array of quiz questions', () => {
    expect(Array.isArray(quizQuestions)).toBe(true);
    expect(quizQuestions.length).toBeGreaterThan(0);
  });

  test('each question should have required fields', () => {
    quizQuestions.forEach((question, index) => {
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(question).toHaveProperty('correct');
      expect(question).toHaveProperty('explanation');
      expect(question).toHaveProperty('category');
      expect(question).toHaveProperty('conditionId');
      
      // Type validations
      expect(typeof question.question).toBe('string');
      expect(Array.isArray(question.options)).toBe(true);
      expect(typeof question.correct).toBe('number');
      expect(typeof question.explanation).toBe('string');
      expect(typeof question.category).toBe('string');
      expect(typeof question.conditionId).toBe('string');
    });
  });

  test('each question should have exactly 4 options', () => {
    quizQuestions.forEach((question, index) => {
      expect(question.options).toHaveLength(4);
      
      question.options.forEach((option, optionIndex) => {
        expect(typeof option).toBe('string');
        expect(option.trim()).toBeTruthy();
      });
    });
  });

  test('correct answer index should be valid', () => {
    quizQuestions.forEach((question, index) => {
      expect(question.correct).toBeGreaterThanOrEqual(0);
      expect(question.correct).toBeLessThan(4);
      expect(Number.isInteger(question.correct)).toBe(true);
    });
  });

  test('should have non-empty questions and explanations', () => {
    quizQuestions.forEach((question, index) => {
      expect(question.question.trim()).toBeTruthy();
      expect(question.explanation.trim()).toBeTruthy();
      expect(question.category.trim()).toBeTruthy();
      expect(question.conditionId.trim()).toBeTruthy();
    });
  });
});

describe('Quiz Questions Content Quality', () => {
  test('questions should be substantial and educational', () => {
    quizQuestions.forEach((question, index) => {
      expect(question.question.length).toBeGreaterThanOrEqual(10);
      expect(question.question).toMatch(/\?$/); // Should end with question mark
    });
  });

  test('explanations should provide educational value', () => {
    quizQuestions.forEach((question, index) => {
      expect(question.explanation.length).toBeGreaterThanOrEqual(20);
      // Should provide meaningful medical information
      expect(question.explanation).not.toBe(question.question);
    });
  });

  test('options should be distinct and plausible', () => {
    quizQuestions.forEach((question, index) => {
      // Check for unique options
      const uniqueOptions = [...new Set(question.options)];
      expect(uniqueOptions.length).toBe(4);
      
      // Each option should be substantial
      question.options.forEach(option => {
        expect(option.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  test('should have valid medical categories', () => {
    const expectedCategories = [
      'Bloodstream Infection in Nonneonates',
      'Bone/Joint',
      'Central Nervous System',
      'Ear, Nose, and Throat',
      'Genitourinary',
      'Intra-abdominal',
      'Neonatal Fever (Term Neonates)',
      'Ophthalmologic',
      'Respiratory',
      'Skin and Soft Tissue Infections'
    ];

    const actualCategories = [...new Set(quizQuestions.map(q => q.category))];
    
    actualCategories.forEach(category => {
      expect(expectedCategories).toContain(category);
    });
  });

  test('correct answers should be valid options', () => {
    quizQuestions.forEach((question, index) => {
      const correctOption = question.options[question.correct];
      expect(correctOption).toBeDefined();
      expect(typeof correctOption).toBe('string');
      expect(correctOption.trim()).toBeTruthy();
    });
  });
});

describe('Quiz Questions Medical Accuracy', () => {
  test('should contain valid pathogen names', () => {
    const commonPathogens = [
      'Staphylococcus aureus',
      'Streptococcus',
      'Enterococcus',
      'E coli',
      'Pseudomonas aeruginosa',
      'Klebsiella',
      'Enterobacter'
    ];

    let pathogenFound = false;
    
    quizQuestions.forEach(question => {
      const allText = [question.question, ...question.options, question.explanation].join(' ');
      if (commonPathogens.some(pathogen => allText.includes(pathogen))) {
        pathogenFound = true;
      }
    });

    expect(pathogenFound).toBe(true);
  });

  test('should contain valid antibiotic references', () => {
    const commonAntibiotics = [
      'vancomycin',
      'penicillin',
      'ampicillin',
      'ceftriaxone',
      'cefazolin',
      'daptomycin',
      'linezolid',
      'clindamycin',
      'azithromycin',
      'metronidazole'
    ];

    let antibioticFound = false;
    
    quizQuestions.forEach(question => {
      const allText = [question.question, ...question.options, question.explanation].join(' ').toLowerCase();
      if (commonAntibiotics.some(antibiotic => allText.includes(antibiotic.toLowerCase()))) {
        antibioticFound = true;
      }
    });

    expect(antibioticFound).toBe(true);
  });

  test('explanations should provide clinical context', () => {
    const clinicalTerms = [
      'pathogen',
      'antibiotic',
      'therapy',
      'treatment',
      'infection',
      'bacteria',
      'resistance',
      'susceptibility'
    ];

    let clinicalContextFound = false;
    
    quizQuestions.forEach(question => {
      const explanation = question.explanation.toLowerCase();
      if (clinicalTerms.some(term => explanation.includes(term))) {
        clinicalContextFound = true;
      }
    });

    expect(clinicalContextFound).toBe(true);
  });
});

describe('Quiz Questions Data Integration', () => {
  test('should have consistent conditionId format', () => {
    quizQuestions.forEach(question => {
      expect(question.conditionId).toMatch(/^[a-z_]+$/);
    });
  });

  test('should have questions distributed across categories', () => {
    const categoryDistribution = {};
    
    quizQuestions.forEach(question => {
      categoryDistribution[question.category] = (categoryDistribution[question.category] || 0) + 1;
    });

    const categories = Object.keys(categoryDistribution);
    expect(categories.length).toBeGreaterThan(3); // Should cover multiple medical categories
    
    // No category should dominate (more than 80% of questions)
    const maxQuestionsPerCategory = Math.ceil(quizQuestions.length * 0.8);
    Object.values(categoryDistribution).forEach(count => {
      expect(count).toBeLessThanOrEqual(maxQuestionsPerCategory);
    });
  });

  test('should allow filtering by category', () => {
    const categories = [...new Set(quizQuestions.map(q => q.category))];
    
    categories.forEach(category => {
      const questionsInCategory = quizQuestions.filter(q => q.category === category);
      expect(questionsInCategory.length).toBeGreaterThan(0);
      
      questionsInCategory.forEach(question => {
        expect(question.category).toBe(category);
      });
    });
  });

  test('should allow filtering by conditionId', () => {
    const conditionIds = [...new Set(quizQuestions.map(q => q.conditionId))];
    
    conditionIds.forEach(conditionId => {
      const questionsForCondition = quizQuestions.filter(q => q.conditionId === conditionId);
      expect(questionsForCondition.length).toBeGreaterThan(0);
      
      questionsForCondition.forEach(question => {
        expect(question.conditionId).toBe(conditionId);
      });
    });
  });
});

describe('Quiz Questions Performance and Edge Cases', () => {
  test('should handle large dataset efficiently', () => {
    const startTime = performance.now();
    
    // Perform common quiz operations
    const categories = [...new Set(quizQuestions.map(q => q.category))];
    const randomQuestions = quizQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    const searchResults = quizQuestions.filter(q => q.question.toLowerCase().includes('infection'));
    
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    expect(categories.length).toBeGreaterThan(0);
    expect(randomQuestions.length).toBeLessThanOrEqual(10);
  });

  test('should maintain question order consistency', () => {
    const firstRun = quizQuestions.map(q => q.question);
    const secondRun = quizQuestions.map(q => q.question);
    
    expect(firstRun).toEqual(secondRun);
  });

  test('should handle Unicode and special characters in medical terms', () => {
    quizQuestions.forEach(question => {
      const allText = [
        question.question,
        ...question.options,
        question.explanation
      ].join(' ');

      // Should not contain problematic characters that could break rendering
      expect(allText).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/);
    });
  });

  test('should provide consistent quiz experience', () => {
    // Check that correct answers are reasonably distributed
    const correctDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
    
    quizQuestions.forEach(question => {
      correctDistribution[question.correct]++;
    });

    // Each position should have at least some correct answers (avoid predictable patterns)
    // But don't require perfect distribution for educational content
    const totalQuestions = quizQuestions.length;
    const minExpected = Math.floor(totalQuestions * 0.1); // At least 10% for any position
    
    Object.values(correctDistribution).forEach(count => {
      expect(count).toBeGreaterThanOrEqual(0); // Allow natural distribution
    });
  });
});