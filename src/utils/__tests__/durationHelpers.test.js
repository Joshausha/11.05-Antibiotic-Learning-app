/**
 * Duration Helpers Tests
 * Tests for parsing and displaying medical treatment duration information
 */

import {
  parseDurationString,
  getDurationIcon,
  getDurationColor,
  mapPathogenToConditions,
  getConditionDuration,
  getPathogenDurations,
  formatDurationDisplay,
  getDurationStats
} from '../durationHelpers.js';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Clock: 'Clock',
  Timer: 'Timer',
  AlarmClock: 'AlarmClock',
  Calendar: 'Calendar'
}));

// Mock RBOMappingSystem
jest.mock('../data/RBOMappingSystem.js', () => ({
  rboConditionsMap: [
    {
      id: 'pneumonia_cap',
      name: 'Community-Acquired Pneumonia',
      category: 'Respiratory',
      severity: 'moderate',
      duration: '5-7 days',
      mappedPathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae']
    },
    {
      id: 'uti_complicated',
      name: 'Complicated UTI',
      category: 'Urinary',
      severity: 'high',
      duration: '10-14 days',
      mappedPathogens: ['Escherichia coli', 'Enterococcus faecalis']
    },
    {
      id: 'bacteremia_uncomplicated',
      name: 'Uncomplicated Bacteremia',
      category: 'Bloodstream',
      severity: 'high',
      duration: '14 days from first negative blood culture',
      mappedPathogens: ['Staphylococcus aureus', 'Escherichia coli']
    },
    {
      id: 'endocarditis_native',
      name: 'Native Valve Endocarditis',
      category: 'Cardiovascular',
      severity: 'high',
      duration: '4-6 weeks',
      mappedPathogens: ['Staphylococcus aureus', 'Enterococcus species']
    },
    {
      id: 'meningitis_pediatric',
      name: 'Pediatric Meningitis',
      category: 'CNS',
      severity: 'critical',
      duration: '<2m: 21 days, 2m-12y: 10-14 days, >12y: 7-10 days',
      mappedPathogens: ['Streptococcus pneumoniae', 'Neisseria meningitidis']
    }
  ]
}));

describe('Duration Helpers', () => {
  describe('Duration String Parsing', () => {
    describe('Simple Day Durations', () => {
      test('should parse single day duration', () => {
        const result = parseDurationString('7 days');
        
        expect(result.type).toBe('days');
        expect(result.minDays).toBe(7);
        expect(result.maxDays).toBe(7);
        expect(result.category).toBe('short');
        expect(result.isComplex).toBe(false);
        expect(result.display).toBe('7 days');
      });

      test('should parse day range', () => {
        const result = parseDurationString('5-7 days');
        
        expect(result.type).toBe('days');
        expect(result.minDays).toBe(5);
        expect(result.maxDays).toBe(7);
        expect(result.category).toBe('short');
        expect(result.display).toBe('5-7 days');
      });

      test('should parse single day (singular)', () => {
        const result = parseDurationString('1 day');
        
        expect(result.type).toBe('days');
        expect(result.minDays).toBe(1);
        expect(result.maxDays).toBe(1);
        expect(result.display).toBe('1 day');
      });

      test('should handle day ranges with dash variants', () => {
        const dashResult = parseDurationString('3-5 days');
        const enDashResult = parseDurationString('3–5 days');
        
        expect(dashResult.minDays).toBe(3);
        expect(dashResult.maxDays).toBe(5);
        expect(enDashResult.minDays).toBe(3);
        expect(enDashResult.maxDays).toBe(5);
      });
    });

    describe('Week Durations', () => {
      test('should parse single week duration', () => {
        const result = parseDurationString('2 weeks');
        
        expect(result.type).toBe('weeks');
        expect(result.minDays).toBe(14);
        expect(result.maxDays).toBe(14);
        expect(result.category).toBe('short');
        expect(result.display).toBe('2 weeks');
      });

      test('should parse week range', () => {
        const result = parseDurationString('4-6 weeks');
        
        expect(result.type).toBe('weeks');
        expect(result.minDays).toBe(28);
        expect(result.maxDays).toBe(42);
        expect(result.category).toBe('long');
        expect(result.display).toBe('4-6 weeks');
      });

      test('should parse single week (singular)', () => {
        const result = parseDurationString('1 week');
        
        expect(result.type).toBe('weeks');
        expect(result.minDays).toBe(7);
        expect(result.maxDays).toBe(7);
        expect(result.display).toBe('1 week');
      });
    });

    describe('Conditional Durations', () => {
      test('should parse duration with "from" condition', () => {
        const result = parseDurationString('14 days from first negative blood culture');
        
        expect(result.type).toBe('conditional');
        expect(result.minDays).toBe(14);
        expect(result.category).toBe('short');
        expect(result.isComplex).toBe(true);
        expect(result.condition).toBe('first negative blood culture');
      });

      test('should parse duration with "after" condition', () => {
        const result = parseDurationString('7 days after symptom resolution');
        
        expect(result.type).toBe('conditional');
        expect(result.minDays).toBe(7);
        expect(result.isComplex).toBe(true);
        expect(result.condition).toBe('symptom resolution');
      });
    });

    describe('Age-Based Durations', () => {
      test('should parse complex age-based duration', () => {
        const result = parseDurationString('<2m: 21 days, 2m-12y: 10-14 days, >12y: 7-10 days');
        
        expect(result.type).toBe('age-based');
        expect(result.isComplex).toBe(true);
        expect(result.category).toBe('complex');
        expect(result.ageGroups).toBeDefined();
        expect(result.ageGroups.length).toBe(3);
      });

      test('should parse individual age groups correctly', () => {
        const result = parseDurationString('<2m: 21 days, 2m-12y: 10-14 days');
        
        expect(result.ageGroups[0].ageRange).toBe('<2m');
        expect(result.ageGroups[0].duration).toBe('21 days');
        expect(result.ageGroups[0].days).toBe(21);
        
        expect(result.ageGroups[1].ageRange).toBe('2m-12y');
        expect(result.ageGroups[1].duration).toBe('10-14 days');
        expect(result.ageGroups[1].days).toBe(10);
      });
    });

    describe('Category Classification', () => {
      test('should classify short duration (≤7 days)', () => {
        expect(parseDurationString('3 days').category).toBe('short');
        expect(parseDurationString('7 days').category).toBe('short');
        expect(parseDurationString('1 week').category).toBe('short');
      });

      test('should classify medium duration (8-21 days)', () => {
        expect(parseDurationString('10 days').category).toBe('medium');
        expect(parseDurationString('14 days').category).toBe('medium');
        expect(parseDurationString('21 days').category).toBe('medium');
      });

      test('should classify long duration (22-42 days)', () => {
        expect(parseDurationString('28 days').category).toBe('long');
        expect(parseDurationString('4 weeks').category).toBe('long');
        expect(parseDurationString('42 days').category).toBe('long');
      });

      test('should classify extended duration (>42 days)', () => {
        expect(parseDurationString('60 days').category).toBe('extended');
        expect(parseDurationString('8 weeks').category).toBe('extended');
      });
    });

    describe('Edge Cases and Error Handling', () => {
      test('should handle empty or null duration', () => {
        const nullResult = parseDurationString(null);
        const undefinedResult = parseDurationString(undefined);
        const emptyResult = parseDurationString('');
        
        [nullResult, undefinedResult, emptyResult].forEach(result => {
          expect(result.type).toBe('unknown');
          expect(result.display).toBe('Duration not specified');
          expect(result.category).toBe('unknown');
          expect(result.isComplex).toBe(false);
        });
      });

      test('should handle non-string input', () => {
        const numberResult = parseDurationString(123);
        
        expect(numberResult.type).toBe('unknown');
        expect(numberResult.category).toBe('unknown');
      });

      test('should handle unrecognized duration formats', () => {
        const result = parseDurationString('until clinical improvement');
        
        expect(result.type).toBe('text');
        expect(result.display).toBe('until clinical improvement');
        expect(result.category).toBe('unknown');
        expect(result.isComplex).toBe(true);
      });

      test('should handle malformed numeric patterns', () => {
        const result = parseDurationString('many days');
        
        expect(result.type).toBe('text');
        expect(result.minDays).toBeNull();
        expect(result.maxDays).toBeNull();
      });
    });
  });

  describe('Duration Icons', () => {
    test('should return appropriate icons for different categories', () => {
      expect(getDurationIcon({ category: 'short', isComplex: false })).toBe('Clock');
      expect(getDurationIcon({ category: 'medium', isComplex: false })).toBe('Timer');
      expect(getDurationIcon({ category: 'long', isComplex: false })).toBe('AlarmClock');
      expect(getDurationIcon({ category: 'extended', isComplex: false })).toBe('AlarmClock');
    });

    test('should return Calendar icon for complex durations', () => {
      expect(getDurationIcon({ category: 'short', isComplex: true })).toBe('Calendar');
      expect(getDurationIcon({ category: 'complex', isComplex: true })).toBe('Calendar');
    });

    test('should return Clock icon for unknown durations', () => {
      expect(getDurationIcon({ category: 'unknown', isComplex: false })).toBe('Clock');
      expect(getDurationIcon(null)).toBe('Clock');
      expect(getDurationIcon(undefined)).toBe('Clock');
    });
  });

  describe('Duration Colors', () => {
    test('should return appropriate colors for different categories', () => {
      const shortColor = getDurationColor({ category: 'short', isComplex: false });
      expect(shortColor.text).toBe('text-green-600');
      expect(shortColor.bg).toBe('bg-green-100');
      
      const mediumColor = getDurationColor({ category: 'medium', isComplex: false });
      expect(mediumColor.text).toBe('text-yellow-600');
      
      const longColor = getDurationColor({ category: 'long', isComplex: false });
      expect(longColor.text).toBe('text-orange-600');
      
      const extendedColor = getDurationColor({ category: 'extended', isComplex: false });
      expect(extendedColor.text).toBe('text-red-600');
    });

    test('should return blue colors for complex durations', () => {
      const complexColor = getDurationColor({ category: 'medium', isComplex: true });
      expect(complexColor.text).toBe('text-blue-600');
      expect(complexColor.bg).toBe('bg-blue-100');
    });

    test('should return gray colors for unknown durations', () => {
      const unknownColor = getDurationColor({ category: 'unknown', isComplex: false });
      expect(unknownColor.text).toBe('text-gray-600');
      expect(unknownColor.bg).toBe('bg-gray-100');
    });

    test('should handle null or undefined input', () => {
      const nullColor = getDurationColor(null);
      const undefinedColor = getDurationColor(undefined);
      
      expect(nullColor.text).toBe('text-gray-600');
      expect(undefinedColor.text).toBe('text-gray-600');
    });
  });

  describe('Pathogen to Conditions Mapping', () => {
    test('should map pathogen to conditions correctly', () => {
      const conditions = mapPathogenToConditions('Staphylococcus aureus');
      
      expect(conditions.length).toBeGreaterThan(0);
      expect(conditions.some(c => c.name.includes('Bacteremia'))).toBe(true);
      expect(conditions.some(c => c.name.includes('Endocarditis'))).toBe(true);
    });

    test('should handle partial pathogen name matches', () => {
      const conditions = mapPathogenToConditions('E. coli');
      
      expect(conditions.length).toBeGreaterThan(0);
      expect(conditions.some(c => c.mappedPathogens.some(p => 
        p.toLowerCase().includes('escherichia coli')
      ))).toBe(true);
    });

    test('should return empty array for non-existent pathogen', () => {
      const conditions = mapPathogenToConditions('Non-existent pathogen');
      expect(conditions).toEqual([]);
    });

    test('should handle empty or null pathogen name', () => {
      expect(mapPathogenToConditions('')).toEqual([]);
      expect(mapPathogenToConditions(null)).toEqual([]);
      expect(mapPathogenToConditions(undefined)).toEqual([]);
    });

    test('should be case insensitive', () => {
      const lowerCaseResults = mapPathogenToConditions('staphylococcus aureus');
      const upperCaseResults = mapPathogenToConditions('STAPHYLOCOCCUS AUREUS');
      
      expect(lowerCaseResults.length).toBeGreaterThan(0);
      expect(upperCaseResults.length).toBeGreaterThan(0);
    });
  });

  describe('Condition Duration Retrieval', () => {
    test('should get duration for specific condition ID', () => {
      const duration = getConditionDuration('pneumonia_cap');
      expect(duration).toBe('5-7 days');
    });

    test('should return null for non-existent condition', () => {
      const duration = getConditionDuration('non_existent_condition');
      expect(duration).toBeNull();
    });

    test('should handle null or undefined condition ID', () => {
      expect(getConditionDuration(null)).toBeNull();
      expect(getConditionDuration(undefined)).toBeNull();
    });
  });

  describe('Pathogen Duration Analysis', () => {
    test('should get all durations for a pathogen', () => {
      const durations = getPathogenDurations('Staphylococcus aureus');
      
      expect(durations.length).toBeGreaterThan(0);
      durations.forEach(duration => {
        expect(duration).toHaveProperty('conditionId');
        expect(duration).toHaveProperty('conditionName');
        expect(duration).toHaveProperty('category');
        expect(duration).toHaveProperty('severity');
        expect(duration).toHaveProperty('duration');
        expect(duration).toHaveProperty('parsedDuration');
      });
    });

    test('should parse durations in pathogen analysis', () => {
      const durations = getPathogenDurations('Escherichia coli');
      
      durations.forEach(duration => {
        expect(duration.parsedDuration).toBeDefined();
        expect(duration.parsedDuration).toHaveProperty('type');
        expect(duration.parsedDuration).toHaveProperty('category');
      });
    });

    test('should return empty array for non-existent pathogen', () => {
      const durations = getPathogenDurations('Non-existent pathogen');
      expect(durations).toEqual([]);
    });
  });

  describe('Duration Display Formatting', () => {
    test('should format compact display', () => {
      const parsed = parseDurationString('5-7 days');
      const formatted = formatDurationDisplay(parsed, 'compact');
      
      expect(formatted).toBe('5-7 days');
    });

    test('should format full display', () => {
      const parsed = parseDurationString('10 days');
      const formatted = formatDurationDisplay(parsed, 'full');
      
      expect(formatted).toBe('Treatment duration: 10 days');
    });

    test('should format tooltip display', () => {
      const shortParsed = parseDurationString('5 days');
      const shortTooltip = formatDurationDisplay(shortParsed, 'tooltip');
      
      expect(shortTooltip).toBe('Short-term treatment: 5 days');
      
      const mediumParsed = parseDurationString('14 days');
      const mediumTooltip = formatDurationDisplay(mediumParsed, 'tooltip');
      
      expect(mediumTooltip).toBe('Standard treatment: 14 days');
    });

    test('should handle complex durations in different contexts', () => {
      const complexParsed = parseDurationString('14 days from first negative culture');
      
      const compact = formatDurationDisplay(complexParsed, 'compact');
      const full = formatDurationDisplay(complexParsed, 'full');
      const tooltip = formatDurationDisplay(complexParsed, 'tooltip');
      
      expect(compact).toContain('14 days from first negative culture');
      expect(full).toContain('14 days from first negative culture');
      expect(tooltip).toContain('Complex duration');
    });

    test('should handle null or undefined parsed duration', () => {
      expect(formatDurationDisplay(null)).toBe('Duration not specified');
      expect(formatDurationDisplay(undefined)).toBe('Duration not specified');
    });

    test('should default to compact format', () => {
      const parsed = parseDurationString('7 days');
      const defaultFormat = formatDurationDisplay(parsed);
      const compactFormat = formatDurationDisplay(parsed, 'compact');
      
      expect(defaultFormat).toBe(compactFormat);
    });
  });

  describe('Duration Statistics', () => {
    const mockConditions = [
      { duration: '5 days' },      // short
      { duration: '7 days' },      // short
      { duration: '14 days' },     // medium
      { duration: '21 days' },     // medium
      { duration: '4 weeks' },     // long (28 days)
      { duration: '8 weeks' },     // extended (56 days)
      { duration: '1-3m: 14 days, >3m: 7 days' }, // complex
      { duration: 'until resolution' } // unknown
    ];

    test('should calculate category distribution', () => {
      const stats = getDurationStats(mockConditions);
      
      expect(stats.total).toBe(8);
      expect(stats.categories.short).toBe(2);
      expect(stats.categories.medium).toBe(2);
      expect(stats.categories.long).toBe(1);
      expect(stats.categories.extended).toBe(1);
      expect(stats.categories.complex).toBe(1);
      expect(stats.categories.unknown).toBe(1);
    });

    test('should calculate average days correctly', () => {
      const stats = getDurationStats(mockConditions);
      
      expect(stats.averageDays).toBeDefined();
      expect(stats.averageDays).toBeGreaterThan(0);
      // Should calculate average of: 5, 7, 14, 21, 28, 56 = 21.8, rounded to 22
      expect(stats.averageDays).toBe(22);
    });

    test('should calculate duration range', () => {
      const stats = getDurationStats(mockConditions);
      
      expect(stats.range.min).toBe(5);
      expect(stats.range.max).toBe(56);
    });

    test('should handle empty conditions array', () => {
      const stats = getDurationStats([]);
      
      expect(stats.total).toBe(0);
      expect(stats.averageDays).toBeNull();
      expect(stats.range.min).toBeNull();
      expect(stats.range.max).toBeNull();
    });

    test('should handle conditions without duration', () => {
      const conditionsWithoutDuration = [
        { name: 'Test Condition' },
        { duration: undefined },
        { duration: null }
      ];
      
      const stats = getDurationStats(conditionsWithoutDuration);
      
      expect(stats.total).toBe(3);
      expect(stats.categories.unknown).toBe(3);
    });

    test('should handle all complex/unknown durations', () => {
      const complexConditions = [
        { duration: 'until clinical improvement' },
        { duration: 'age-dependent: varies' },
        { duration: 'see guidelines' }
      ];
      
      const stats = getDurationStats(complexConditions);
      
      expect(stats.averageDays).toBeNull();
      expect(stats.range.min).toBeNull();
      expect(stats.range.max).toBeNull();
    });
  });

  describe('Clinical Accuracy Validation', () => {
    test('should recognize standard antibiotic duration patterns', () => {
      const clinicalDurations = [
        '3 days',        // Short course (UTI)
        '5-7 days',      // Standard course (respiratory)
        '7-10 days',     // Extended course (complicated infections)
        '14 days',       // Standard bacteremia
        '4-6 weeks',     // Endocarditis/osteomyelitis
        '6-8 weeks'      // Chronic osteomyelitis
      ];
      
      clinicalDurations.forEach(duration => {
        const parsed = parseDurationString(duration);
        expect(parsed.type).not.toBe('unknown');
        expect(parsed.category).not.toBe('unknown');
      });
    });

    test('should handle pediatric-specific duration patterns', () => {
      const pediatricDuration = '<1m: 14-21 days, 1-3m: 10-14 days, >3m: 7-10 days';
      const parsed = parseDurationString(pediatricDuration);
      
      expect(parsed.type).toBe('age-based');
      expect(parsed.isComplex).toBe(true);
      expect(parsed.ageGroups.length).toBe(3);
    });

    test('should handle culture-based duration endpoints', () => {
      const cultureDurations = [
        '14 days from first negative blood culture',
        '7 days after source control',
        '48-72 hours after fever resolution'
      ];
      
      cultureDurations.forEach(duration => {
        const parsed = parseDurationString(duration);
        expect(parsed.type).toBe('conditional');
        expect(parsed.isComplex).toBe(true);
      });
    });
  });

  describe('Integration with Medical Education', () => {
    test('should support learning progression from simple to complex', () => {
      const simpleDuration = parseDurationString('7 days');
      const complexDuration = parseDurationString('14 days from first negative culture');
      
      expect(simpleDuration.isComplex).toBe(false);
      expect(complexDuration.isComplex).toBe(true);
      
      // Simple durations should be taught first
      expect(simpleDuration.category).toBe('short');
      expect(complexDuration.category).toBe('short'); // Same underlying duration category
    });

    test('should provide appropriate visual cues for different complexities', () => {
      const simple = parseDurationString('5 days');
      const complex = parseDurationString('<2y: 10 days, >2y: 7 days');
      
      const simpleIcon = getDurationIcon(simple);
      const complexIcon = getDurationIcon(complex);
      
      expect(simpleIcon).toBe('Clock');
      expect(complexIcon).toBe('Calendar');
    });

    test('should support evidence-based duration categories', () => {
      // Based on clinical evidence and guidelines
      expect(parseDurationString('3 days').category).toBe('short');   // UTI uncomplicated
      expect(parseDurationString('7 days').category).toBe('short');   // CAP outpatient
      expect(parseDurationString('14 days').category).toBe('medium'); // Bacteremia uncomplicated
      expect(parseDurationString('6 weeks').category).toBe('extended'); // Endocarditis
    });
  });
});