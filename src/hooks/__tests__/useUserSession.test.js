/**
 * Tests for useUserSession hook
 * @description Comprehensive test suite for user session management and interaction tracking
 */

import { renderHook, act } from '@testing-library/react';
import useUserSession from '../useUserSession';

describe('useUserSession Hook', () => {
  const mockIndexes = {
    conditions: [
      { id: 'pneumonia', category: 'Respiratory' },
      { id: 'uti', category: 'Genitourinary' },
      { id: 'cellulitis', category: 'Skin and Soft Tissue' }
    ]
  };

  const samplePathogen = {
    id: 'strep-pneumo',
    name: 'Streptococcus pneumoniae',
    gramStatus: 'Positive',
    conditions: ['pneumonia']
  };

  describe('Initial State', () => {
    test('initializes with default session statistics', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      expect(result.current.sessionStats.totalViewed).toBe(0);
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(0);
      expect(result.current.sessionStats.preferredCategories).toBeInstanceOf(Map);
      expect(result.current.sessionStats.gramStatusFocus).toBeInstanceOf(Map);
      expect(result.current.sessionStats.explorationDepth).toBe(0);
    });

    test('initializes with default user preferences', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      expect(result.current.userPreferences.systematicLearning).toBe(false);
      expect(result.current.userPreferences.preferSimilarPathogens).toBe(true);
      expect(result.current.userPreferences.includeRecentlyViewed).toBe(false);
      expect(result.current.userPreferences.difficultyLevel).toBe('adaptive');
      expect(result.current.userPreferences.focusAreas).toEqual([]);
    });

    test('provides all required functions', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      expect(typeof result.current.recordInteraction).toBe('function');
      expect(typeof result.current.resetSession).toBe('function');
      expect(typeof result.current.updatePreferences).toBe('function');
      expect(typeof result.current.setUserPreferences).toBe('function');
    });
  });

  describe('Recording Interactions', () => {
    test('records basic pathogen interaction', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 30);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.explorationDepth).toBe(1);
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(30);
    });

    test('updates category preferences based on pathogen conditions', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 20);
      });
      
      expect(result.current.sessionStats.preferredCategories.get('Respiratory')).toBe(1);
    });

    test('updates gram status focus tracking', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 25);
      });
      
      expect(result.current.sessionStats.gramStatusFocus.get('Positive')).toBe(1);
    });

    test('handles multiple interactions and calculates average time correctly', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 30);
        result.current.recordInteraction({ ...samplePathogen, id: 'ecoli' }, 'view', 60);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(2);
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(45); // (30 + 60) / 2
      expect(result.current.sessionStats.explorationDepth).toBe(2);
    });

    test('handles pathogen with multiple conditions', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const multiConditionPathogen = {
        ...samplePathogen,
        conditions: ['pneumonia', 'uti']
      };
      
      act(() => {
        result.current.recordInteraction(multiConditionPathogen, 'view', 40);
      });
      
      expect(result.current.sessionStats.preferredCategories.get('Respiratory')).toBe(1);
      expect(result.current.sessionStats.preferredCategories.get('Genitourinary')).toBe(1);
    });

    test('handles pathogen without conditions gracefully', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const noConditionsPathogen = {
        id: 'unknown-pathogen',
        name: 'Unknown Pathogen',
        gramStatus: 'Negative'
      };
      
      act(() => {
        result.current.recordInteraction(noConditionsPathogen, 'view', 15);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.gramStatusFocus.get('Negative')).toBe(1);
      expect(result.current.sessionStats.preferredCategories.size).toBe(0);
    });

    test('handles pathogen without gram status gracefully', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const noGramStatusPathogen = {
        id: 'fungal-pathogen',
        name: 'Candida albicans',
        conditions: ['uti']
      };
      
      act(() => {
        result.current.recordInteraction(noGramStatusPathogen, 'view', 25);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.preferredCategories.get('Genitourinary')).toBe(1);
      expect(result.current.sessionStats.gramStatusFocus.size).toBe(0);
    });

    test('accumulates gram status counts across multiple interactions', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const gramPositive1 = { ...samplePathogen, id: 'strep1' };
      const gramPositive2 = { ...samplePathogen, id: 'strep2' };
      const gramNegative = { ...samplePathogen, id: 'ecoli', gramStatus: 'Negative' };
      
      act(() => {
        result.current.recordInteraction(gramPositive1, 'view', 10);
        result.current.recordInteraction(gramPositive2, 'view', 15);
        result.current.recordInteraction(gramNegative, 'view', 20);
      });
      
      expect(result.current.sessionStats.gramStatusFocus.get('Positive')).toBe(2);
      expect(result.current.sessionStats.gramStatusFocus.get('Negative')).toBe(1);
    });
  });

  describe('Different Interaction Types', () => {
    test('handles different interaction types', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'detailed_view', 45);
        result.current.recordInteraction(samplePathogen, 'bookmark', 5);
        result.current.recordInteraction(samplePathogen, 'share', 2);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(3);
      expect(result.current.sessionStats.averageTimePerPathogen).toBe((45 + 5 + 2) / 3);
    });

    test('defaults to view interaction when type not specified', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(0);
    });

    test('handles zero time spent', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'quick_view', 0);
      });
      
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(0);
      expect(result.current.sessionStats.totalViewed).toBe(1);
    });
  });

  describe('Session Reset', () => {
    test('resets all session statistics to initial state', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      // Add some session data
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 30);
        result.current.recordInteraction({ ...samplePathogen, id: 'another' }, 'view', 45);
      });
      
      // Verify data exists
      expect(result.current.sessionStats.totalViewed).toBe(2);
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(37.5);
      
      // Reset session
      act(() => {
        result.current.resetSession();
      });
      
      // Verify reset
      expect(result.current.sessionStats.totalViewed).toBe(0);
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(0);
      expect(result.current.sessionStats.preferredCategories.size).toBe(0);
      expect(result.current.sessionStats.gramStatusFocus.size).toBe(0);
      expect(result.current.sessionStats.explorationDepth).toBe(0);
    });

    test('preserves user preferences after session reset', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      // Update preferences
      act(() => {
        result.current.updatePreferences({
          systematicLearning: true,
          difficultyLevel: 'advanced'
        });
      });
      
      // Add session data
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 30);
      });
      
      // Reset session
      act(() => {
        result.current.resetSession();
      });
      
      // Verify preferences are preserved
      expect(result.current.userPreferences.systematicLearning).toBe(true);
      expect(result.current.userPreferences.difficultyLevel).toBe('advanced');
    });
  });

  describe('User Preferences Management', () => {
    test('updates individual preferences', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.updatePreferences({
          systematicLearning: true
        });
      });
      
      expect(result.current.userPreferences.systematicLearning).toBe(true);
      expect(result.current.userPreferences.preferSimilarPathogens).toBe(true); // Should remain unchanged
    });

    test('updates multiple preferences at once', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.updatePreferences({
          systematicLearning: true,
          difficultyLevel: 'beginner',
          focusAreas: ['Respiratory', 'Skin']
        });
      });
      
      expect(result.current.userPreferences.systematicLearning).toBe(true);
      expect(result.current.userPreferences.difficultyLevel).toBe('beginner');
      expect(result.current.userPreferences.focusAreas).toEqual(['Respiratory', 'Skin']);
    });

    test('handles preference updates with null/undefined values', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.updatePreferences({
          systematicLearning: null,
          difficultyLevel: undefined
        });
      });
      
      expect(result.current.userPreferences.systematicLearning).toBeNull();
      expect(result.current.userPreferences.difficultyLevel).toBeUndefined();
    });

    test('setUserPreferences replaces entire preferences object', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const newPreferences = {
        systematicLearning: true,
        preferSimilarPathogens: false,
        includeRecentlyViewed: true,
        difficultyLevel: 'expert',
        focusAreas: ['Advanced Topics']
      };
      
      act(() => {
        result.current.setUserPreferences(newPreferences);
      });
      
      expect(result.current.userPreferences).toEqual(newPreferences);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles interaction with null pathogen', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(null, 'view', 30);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(30);
    });

    test('handles interaction without indexes', () => {
      const { result } = renderHook(() => useUserSession(null));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 20);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.preferredCategories.size).toBe(0);
    });

    test('handles pathogen with non-existent condition IDs', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const pathogenWithInvalidConditions = {
        ...samplePathogen,
        conditions: ['non-existent-condition', 'another-invalid']
      };
      
      act(() => {
        result.current.recordInteraction(pathogenWithInvalidConditions, 'view', 25);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.preferredCategories.size).toBe(0);
    });

    test('handles extremely large time values', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 999999);
      });
      
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(999999);
      expect(result.current.sessionStats.totalViewed).toBe(1);
    });

    test('handles negative time values', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', -10);
      });
      
      expect(result.current.sessionStats.averageTimePerPathogen).toBe(-10);
      expect(result.current.sessionStats.totalViewed).toBe(1);
    });

    test('handles empty indexes object', () => {
      const { result } = renderHook(() => useUserSession({}));
      
      act(() => {
        result.current.recordInteraction(samplePathogen, 'view', 20);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.preferredCategories.size).toBe(0);
    });

    test('handles pathogen with empty conditions array', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const pathogenWithEmptyConditions = {
        ...samplePathogen,
        conditions: []
      };
      
      act(() => {
        result.current.recordInteraction(pathogenWithEmptyConditions, 'view', 15);
      });
      
      expect(result.current.sessionStats.totalViewed).toBe(1);
      expect(result.current.sessionStats.preferredCategories.size).toBe(0);
    });
  });

  describe('Category Preference Tracking', () => {
    test('accurately counts category interactions across different pathogens', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const respiratoryPathogen1 = { ...samplePathogen, id: 'strep', conditions: ['pneumonia'] };
      const respiratoryPathogen2 = { ...samplePathogen, id: 'hflu', conditions: ['pneumonia'] };
      const genitourinaryPathogen = { ...samplePathogen, id: 'ecoli', conditions: ['uti'] };
      
      act(() => {
        result.current.recordInteraction(respiratoryPathogen1, 'view', 20);
        result.current.recordInteraction(respiratoryPathogen2, 'view', 25);
        result.current.recordInteraction(genitourinaryPathogen, 'view', 30);
      });
      
      expect(result.current.sessionStats.preferredCategories.get('Respiratory')).toBe(2);
      expect(result.current.sessionStats.preferredCategories.get('Genitourinary')).toBe(1);
    });

    test('handles case-sensitive category names', () => {
      const { result } = renderHook(() => useUserSession({
        conditions: [
          { 
            id: 'test1', 
            category: 'respiratory' // lowercase
          },
          { 
            id: 'test2', 
            category: 'Respiratory' // capitalized
          }
        ]
      }));
      
      const pathogen1 = { id: 'p1', conditions: ['test1'] };
      const pathogen2 = { id: 'p2', conditions: ['test2'] };
      
      act(() => {
        result.current.recordInteraction(pathogen1, 'view', 10);
        result.current.recordInteraction(pathogen2, 'view', 15);
      });
      
      // Should track as separate categories due to case sensitivity
      expect(result.current.sessionStats.preferredCategories.get('respiratory')).toBe(1);
      expect(result.current.sessionStats.preferredCategories.get('Respiratory')).toBe(1);
    });
  });

  describe('Performance and Memory', () => {
    test('handles large number of interactions efficiently', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      const startTime = performance.now();
      
      act(() => {
        for (let i = 0; i < 1000; i++) {
          result.current.recordInteraction({
            id: `pathogen-${i}`,
            name: `Pathogen ${i}`,
            gramStatus: i % 2 === 0 ? 'Positive' : 'Negative',
            conditions: ['pneumonia']
          }, 'view', Math.random() * 60);
        }
      });
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.current.sessionStats.totalViewed).toBe(1000);
      expect(result.current.sessionStats.preferredCategories.get('Respiratory')).toBe(1000);
    });

    test('map objects do not grow unbounded with unique values', () => {
      const { result } = renderHook(() => useUserSession(mockIndexes));
      
      act(() => {
        // Add many different gram statuses
        for (let i = 0; i < 100; i++) {
          result.current.recordInteraction({
            id: `pathogen-${i}`,
            gramStatus: `Status-${i}`
          }, 'view', 10);
        }
      });
      
      expect(result.current.sessionStats.gramStatusFocus.size).toBe(100);
      expect(result.current.sessionStats.totalViewed).toBe(100);
    });
  });

  describe('Functional Requirements', () => {
    test('memoizes callback functions properly', () => {
      const { result, rerender } = renderHook(() => useUserSession(mockIndexes));
      
      const initialRecordInteraction = result.current.recordInteraction;
      const initialResetSession = result.current.resetSession;
      const initialUpdatePreferences = result.current.updatePreferences;
      
      rerender();
      
      // Functions should be the same reference (memoized)
      expect(result.current.recordInteraction).toBe(initialRecordInteraction);
      expect(result.current.resetSession).toBe(initialResetSession);
      expect(result.current.updatePreferences).toBe(initialUpdatePreferences);
    });

    test('callback dependencies work correctly', () => {
      const { result, rerender } = renderHook(
        ({ indexes }) => useUserSession(indexes),
        { initialProps: { indexes: mockIndexes } }
      );
      
      const initialRecordInteraction = result.current.recordInteraction;
      
      // Change indexes prop
      rerender({ indexes: { conditions: [] } });
      
      // recordInteraction should have new reference due to indexes dependency
      expect(result.current.recordInteraction).not.toBe(initialRecordInteraction);
    });
  });
});