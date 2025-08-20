/**
 * Tests for QuizAnalyticsDashboard Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizAnalyticsDashboard from '../QuizAnalyticsDashboard';

// Mock quiz progress data
const mockQuizProgress = {
  quizHistory: [
    {
      quizId: 'test-1',
      totalQuestions: 5,
      correctAnswers: 4,
      scorePercentage: 80,
      completedAt: '2023-01-01T10:00:00Z',
      duration: '2m 30s',
      answers: [
        { questionText: 'What is pneumonia?', isCorrect: true },
        { questionText: 'What is sepsis?', isCorrect: true },
        { questionText: 'What is meningitis?', isCorrect: false },
        { questionText: 'What is UTI?', isCorrect: true },
        { questionText: 'What is cellulitis?', isCorrect: true }
      ]
    },
    {
      quizId: 'test-2',
      totalQuestions: 5,
      correctAnswers: 5,
      scorePercentage: 100,
      completedAt: '2023-01-02T10:00:00Z',
      duration: '1m 45s',
      answers: [
        { questionText: 'What is pneumonia?', isCorrect: true },
        { questionText: 'What is sepsis?', isCorrect: true },
        { questionText: 'What is meningitis?', isCorrect: true },
        { questionText: 'What is UTI?', isCorrect: true },
        { questionText: 'What is cellulitis?', isCorrect: true }
      ]
    }
  ],
  stats: {
    totalQuizzes: 2,
    averageScore: 90,
    bestScore: 100,
    improvementTrend: 'improving',
    streakCount: 2
  }
};

// Mock quiz questions data
const mockQuizQuestions = [
  {
    question: 'What is pneumonia?',
    category: 'Respiratory',
    difficulty: 'beginner'
  },
  {
    question: 'What is sepsis?',
    category: 'Bloodstream',
    difficulty: 'intermediate'
  },
  {
    question: 'What is meningitis?',
    category: 'Central Nervous System',
    difficulty: 'advanced'
  },
  {
    question: 'What is UTI?',
    category: 'Genitourinary',
    difficulty: 'beginner'
  },
  {
    question: 'What is cellulitis?',
    category: 'Skin and Soft Tissue',
    difficulty: 'intermediate'
  }
];

describe('QuizAnalyticsDashboard Component', () => {
  test('renders dashboard title', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    expect(screen.getByText(/Learning Analytics Dashboard/i)).toBeInTheDocument();
  });

  test('displays key metrics', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    // Check for key metrics
    expect(screen.getByText('Total Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
    expect(screen.getByText('Best Score')).toBeInTheDocument();
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    
    // Check for actual values
    expect(screen.getAllByText('2')[0]).toBeInTheDocument(); // Total quizzes
    expect(screen.getByText('90%')).toBeInTheDocument(); // Average score
    expect(screen.getAllByText('100%')[0]).toBeInTheDocument(); // Best score
  });

  test('displays performance trends section', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    expect(screen.getByText('Performance Trends')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  test('displays knowledge areas section', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    expect(screen.getByText('Knowledge Areas')).toBeInTheDocument();
    expect(screen.getByText('Top Strengths')).toBeInTheDocument();
    expect(screen.getByText('Areas for Improvement')).toBeInTheDocument();
  });

  test('displays recent activity section', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('4/5 correct')).toBeInTheDocument();
    expect(screen.getByText('5/5 correct')).toBeInTheDocument();
  });

  test('displays learning recommendations', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    expect(screen.getByText('Personalized Learning Recommendations')).toBeInTheDocument();
  });

  test('time range filter works correctly', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    const timeRangeSelect = screen.getByDisplayValue('All Time');
    expect(timeRangeSelect).toBeInTheDocument();
    
    // Change to This Week
    fireEvent.change(timeRangeSelect, { target: { value: 'week' } });
    expect(timeRangeSelect.value).toBe('week');
  });

  test('chart navigation works correctly', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    // Find chart buttons
    const difficultyButton = screen.getByText('Difficulty');
    const categoryButton = screen.getByText('Category');
    
    // Click on difficulty chart
    fireEvent.click(difficultyButton);
    
    // Click on category chart
    fireEvent.click(categoryButton);
    
    // No errors should occur
  });

  test('handles empty quiz data gracefully', () => {
    const emptyQuizProgress = {
      quizHistory: [],
      stats: {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        improvementTrend: 'insufficient_data',
        streakCount: 0
      }
    };

    render(
      <QuizAnalyticsDashboard 
        quizProgress={emptyQuizProgress}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    // Should still render the dashboard
    expect(screen.getByText(/Learning Analytics Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText('Total Quizzes')).toBeInTheDocument();
    
    // Should show 0 values
    expect(screen.getAllByText('0')[0]).toBeInTheDocument(); // Total quizzes
    expect(screen.getAllByText('0%')[0]).toBeInTheDocument(); // Average score
  });

  test('handles undefined quiz progress gracefully', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={undefined}
        quizQuestions={mockQuizQuestions}
      />
    );
    
    // Should still render the dashboard
    expect(screen.getByText(/Learning Analytics Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText('Total Quizzes')).toBeInTheDocument();
  });

  test('renders without crashing when quiz questions is empty', () => {
    render(
      <QuizAnalyticsDashboard 
        quizProgress={mockQuizProgress}
        quizQuestions={[]}
      />
    );
    
    // Should still render the dashboard
    expect(screen.getByText(/Learning Analytics Dashboard/i)).toBeInTheDocument();
  });
});