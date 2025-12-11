/**
 * Duration Helper Functions
 * Utilities for parsing and displaying treatment duration information
 * Integrates with RBO clinical guidelines data
 * Created: 2025-08-03
 */

import { Clock, Timer, AlarmClock, Calendar, LucideIcon } from 'lucide-react';
import { rboConditionsMap } from '../data/RBOMappingSystem';

/**
 * Type definitions for duration helpers
 */

interface ParsedDuration {
  type: 'unknown' | 'age-based' | 'conditional' | 'days' | 'weeks' | 'text';
  display: string;
  minDays: number | null;
  maxDays: number | null;
  category: 'unknown' | 'short' | 'medium' | 'long' | 'extended' | 'complex';
  isComplex: boolean;
  ageGroups?: AgeGroup[];
  condition?: string;
}

interface AgeGroup {
  ageRange: string;
  duration: string;
  days: number | null;
}

interface ColorScheme {
  text: string;
  bg: string;
  border: string;
  icon: string;
}

interface DurationContext {
  conditionId: string;
  conditionName: string;
  category: string;
  severity: string;
  duration: string;
  parsedDuration: ParsedDuration;
}

interface DurationStatistics {
  total: number;
  categories: {
    short: number;
    medium: number;
    long: number;
    extended: number;
    complex: number;
    unknown: number;
  };
  averageDays: number | null;
  range: {
    min: number | null;
    max: number | null;
  };
}

interface RBOCondition {
  id: string;
  name: string;
  category: string;
  severity: string;
  duration: string;
  mappedPathogens: string[];
}

/**
 * Parse duration string from RBO data into structured format
 * Handles various duration formats from clinical guidelines
 * @param duration - Duration string from RBO data
 * @returns Parsed duration information
 */
export const parseDurationString = (duration: string | null | undefined): ParsedDuration => {
  if (!duration || typeof duration !== 'string') {
    return {
      type: 'unknown',
      display: 'Duration not specified',
      minDays: null,
      maxDays: null,
      category: 'unknown',
      isComplex: false
    };
  }

  const durationLower = duration.toLowerCase().trim();

  // Handle complex age-based durations
  if (durationLower.includes(':') || durationLower.includes('y:')) {
    return {
      type: 'age-based',
      display: duration,
      minDays: null,
      maxDays: null,
      category: 'complex',
      isComplex: true,
      ageGroups: parseAgeGroups(duration)
    };
  }

  // Handle conditional durations
  if (durationLower.includes('from') || durationLower.includes('after')) {
    const extractedDays = extractDaysFromString(duration);
    return {
      type: 'conditional',
      display: duration,
      minDays: extractedDays,
      maxDays: null,
      category: determineCategory(extractedDays),
      isComplex: true,
      condition: extractCondition(duration)
    };
  }

  // Handle simple day ranges (e.g., "5-7 days")
  const dayMatch = durationLower.match(/(\d+)[-–]?(\d+)?\s*days?/);
  if (dayMatch) {
    const minDays = parseInt(dayMatch[1], 10);
    const maxDays = dayMatch[2] ? parseInt(dayMatch[2], 10) : minDays;

    return {
      type: 'days',
      display: formatDayRange(minDays, maxDays),
      minDays,
      maxDays,
      category: determineCategory(maxDays),
      isComplex: false
    };
  }

  // Handle week ranges (e.g., "3-4 weeks")
  const weekMatch = durationLower.match(/(\d+)[-–]?(\d+)?\s*weeks?/);
  if (weekMatch) {
    const minWeeks = parseInt(weekMatch[1], 10);
    const maxWeeks = weekMatch[2] ? parseInt(weekMatch[2], 10) : minWeeks;
    const minDays = minWeeks * 7;
    const maxDays = maxWeeks * 7;

    return {
      type: 'weeks',
      display: formatWeekRange(minWeeks, maxWeeks),
      minDays,
      maxDays,
      category: determineCategory(maxDays),
      isComplex: false
    };
  }

  // Handle single numbers with units
  const singleDayMatch = durationLower.match(/(\d+)\s*days?/);
  if (singleDayMatch) {
    const days = parseInt(singleDayMatch[1], 10);
    return {
      type: 'days',
      display: `${days} day${days !== 1 ? 's' : ''}`,
      minDays: days,
      maxDays: days,
      category: determineCategory(days),
      isComplex: false
    };
  }

  const singleWeekMatch = durationLower.match(/(\d+)\s*weeks?/);
  if (singleWeekMatch) {
    const weeks = parseInt(singleWeekMatch[1], 10);
    const days = weeks * 7;
    return {
      type: 'weeks',
      display: `${weeks} week${weeks !== 1 ? 's' : ''}`,
      minDays: days,
      maxDays: days,
      category: determineCategory(days),
      isComplex: false
    };
  }

  // Fallback for unrecognized formats
  return {
    type: 'text',
    display: duration,
    minDays: null,
    maxDays: null,
    category: 'unknown',
    isComplex: true
  };
};

/**
 * Parse age-based duration groups
 * @param duration - Duration string with age groups
 * @returns Array of age group objects
 */
const parseAgeGroups = (duration: string): AgeGroup[] => {
  const groups: AgeGroup[] = [];
  const parts = duration.split(',');

  parts.forEach(part => {
    const trimmed = part.trim();
    if (trimmed.includes(':')) {
      const [ageRange, durationPart] = trimmed.split(':').map(s => s.trim());
      const days = extractDaysFromString(durationPart);
      groups.push({
        ageRange,
        duration: durationPart,
        days
      });
    }
  });

  return groups;
};

/**
 * Extract condition information from duration string
 * @param duration - Duration string
 * @returns Condition description
 */
const extractCondition = (duration: string): string => {
  if (duration.includes('from')) {
    return duration.split('from')[1].trim();
  }
  if (duration.includes('after')) {
    return duration.split('after')[1].trim();
  }
  return '';
};

/**
 * Extract number of days from duration string
 * For ranges, returns the minimum (start) value for conservative medical estimates
 * @param duration - Duration string
 * @returns Number of days or null if not found
 */
const extractDaysFromString = (duration: string): number | null => {
  // Handle day ranges first (e.g., "10-14 days") - return minimum for conservative estimate
  const dayRangeMatch = duration.match(/(\d+)[-–](\d+)\s*days?/);
  if (dayRangeMatch) return parseInt(dayRangeMatch[1], 10); // Return minimum

  // Handle single day values
  const dayMatch = duration.match(/(\d+)\s*days?/);
  if (dayMatch) return parseInt(dayMatch[1], 10);

  // Handle week ranges (e.g., "2-3 weeks") - return minimum for conservative estimate
  const weekRangeMatch = duration.match(/(\d+)[-–](\d+)\s*weeks?/);
  if (weekRangeMatch) return parseInt(weekRangeMatch[1], 10) * 7; // Return minimum

  // Handle single week values
  const weekMatch = duration.match(/(\d+)\s*weeks?/);
  if (weekMatch) return parseInt(weekMatch[1], 10) * 7;

  return null;
};

/**
 * Determine duration category based on number of days
 * Aligned with antimicrobial stewardship best practices
 * @param days - Number of days
 * @returns Category: short, medium, long, or extended
 */
const determineCategory = (days: number | null): 'unknown' | 'short' | 'medium' | 'long' | 'extended' => {
  if (!days || days === null) return 'unknown';

  if (days <= 14) return 'short';     // ≤2 weeks - most uncomplicated infections
  if (days <= 21) return 'medium';    // 15-21 days - some complex infections
  if (days <= 42) return 'long';      // 22-42 days - serious infections
  return 'extended';                  // >42 days - chronic/complex cases
};

/**
 * Format day range for display
 * @param minDays - Minimum days
 * @param maxDays - Maximum days
 * @returns Formatted display string
 */
const formatDayRange = (minDays: number, maxDays: number): string => {
  if (minDays === maxDays) {
    return `${minDays} day${minDays !== 1 ? 's' : ''}`;
  }
  return `${minDays}-${maxDays} days`;
};

/**
 * Format week range for display
 * @param minWeeks - Minimum weeks
 * @param maxWeeks - Maximum weeks
 * @returns Formatted display string
 */
const formatWeekRange = (minWeeks: number, maxWeeks: number): string => {
  if (minWeeks === maxWeeks) {
    return `${minWeeks} week${minWeeks !== 1 ? 's' : ''}`;
  }
  return `${minWeeks}-${maxWeeks} weeks`;
};

/**
 * Get appropriate icon component for duration
 * @param parsedDuration - Parsed duration object
 * @returns Lucide icon component
 */
export const getDurationIcon = (parsedDuration: ParsedDuration | null | undefined): typeof Clock => {
  if (!parsedDuration || parsedDuration.category === 'unknown') {
    return Clock;
  }

  if (parsedDuration.isComplex) {
    return Calendar;
  }

  switch (parsedDuration.category) {
    case 'short':
      return Clock;
    case 'medium':
      return Timer;
    case 'long':
    case 'extended':
      return AlarmClock;
    default:
      return Clock;
  }
};

/**
 * Get color scheme for duration indicator
 * @param parsedDuration - Parsed duration object
 * @returns Color scheme object
 */
export const getDurationColor = (parsedDuration: ParsedDuration | null | undefined): ColorScheme => {
  if (!parsedDuration || parsedDuration.category === 'unknown') {
    return {
      text: 'text-gray-600',
      bg: 'bg-gray-100',
      border: 'border-gray-200',
      icon: 'text-gray-600'
    };
  }

  if (parsedDuration.isComplex) {
    return {
      text: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-200',
      icon: 'text-blue-600'
    };
  }

  switch (parsedDuration.category) {
    case 'short':
      return {
        text: 'text-green-600',
        bg: 'bg-green-100',
        border: 'border-green-200',
        icon: 'text-green-600'
      };
    case 'medium':
      return {
        text: 'text-yellow-600',
        bg: 'bg-yellow-100',
        border: 'border-yellow-200',
        icon: 'text-yellow-600'
      };
    case 'long':
      return {
        text: 'text-orange-600',
        bg: 'bg-orange-100',
        border: 'border-orange-200',
        icon: 'text-orange-600'
      };
    case 'extended':
      return {
        text: 'text-red-600',
        bg: 'bg-red-100',
        border: 'border-red-200',
        icon: 'text-red-600'
      };
    default:
      return {
        text: 'text-gray-600',
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        icon: 'text-gray-600'
      };
  }
};

/**
 * Map pathogen name to RBO conditions
 * @param pathogenName - Name of pathogen
 * @returns Array of matching RBO conditions
 */
export const mapPathogenToConditions = (pathogenName: string | null | undefined): RBOCondition[] => {
  if (!pathogenName) return [];

  const pathogenLower = pathogenName.toLowerCase();

  // Handle common medical abbreviations
  const expandedPathogens = expandPathogenAbbreviations(pathogenLower);

  return (rboConditionsMap as RBOCondition[]).filter(condition =>
    condition.mappedPathogens.some(mappedPathogen => {
      const mappedLower = mappedPathogen.toLowerCase();

      // Check exact match, partial match, or abbreviation match
      return expandedPathogens.some(expanded =>
        mappedLower.includes(expanded) ||
        expanded.includes(mappedLower) ||
        matchesAbbreviation(expanded, mappedLower)
      );
    })
  );
};

/**
 * Expand common pathogen abbreviations to full names
 * @param pathogen - Pathogen name (lowercase)
 * @returns Array of possible expanded names
 */
const expandPathogenAbbreviations = (pathogen: string): string[] => {
  const abbreviationMap: { [key: string]: string[] } = {
    'e. coli': ['escherichia coli', 'e. coli'],
    's. aureus': ['staphylococcus aureus', 's. aureus'],
    's. pneumoniae': ['streptococcus pneumoniae', 's. pneumoniae'],
    'k. pneumoniae': ['klebsiella pneumoniae', 'k. pneumoniae'],
    'p. aeruginosa': ['pseudomonas aeruginosa', 'p. aeruginosa'],
    'h. influenzae': ['haemophilus influenzae', 'h. influenzae'],
    'mrsa': ['methicillin-resistant staphylococcus aureus', 'staphylococcus aureus'],
    'mssa': ['methicillin-sensitive staphylococcus aureus', 'staphylococcus aureus']
  };

  return abbreviationMap[pathogen] || [pathogen];
};

/**
 * Check if an abbreviated name matches a full pathogen name
 * @param abbreviated - Abbreviated name
 * @param fullName - Full pathogen name
 * @returns True if they match
 */
const matchesAbbreviation = (abbreviated: string, fullName: string): boolean => {
  // Handle genus-species abbreviations (e.g., "e. coli" matches "escherichia coli")
  const abbrevParts = abbreviated.split(' ');
  const fullParts = fullName.split(' ');

  if (abbrevParts.length === 2 && fullParts.length >= 2) {
    const [abbrevGenus, abbrevSpecies] = abbrevParts;
    const [fullGenus, fullSpecies] = fullParts;

    // Check if abbreviated genus matches first letter + period, and species matches
    if (abbrevGenus.length === 2 && abbrevGenus.endsWith('.')) {
      const abbrevLetter = abbrevGenus.charAt(0);
      return fullGenus.startsWith(abbrevLetter) && abbrevSpecies === fullSpecies;
    }
  }

  return false;
};

/**
 * Get duration for a specific condition ID
 * @param conditionId - RBO condition ID
 * @returns Duration string or null if not found
 */
export const getConditionDuration = (conditionId: string | null | undefined): string | null => {
  const condition = (rboConditionsMap as RBOCondition[]).find(c => c.id === conditionId);
  return condition ? condition.duration : null;
};

/**
 * Get all durations for a pathogen across different conditions
 * @param pathogenName - Name of pathogen
 * @returns Array of duration objects with condition context
 */
export const getPathogenDurations = (pathogenName: string | null | undefined): DurationContext[] => {
  const conditions = mapPathogenToConditions(pathogenName);

  return conditions.map(condition => ({
    conditionId: condition.id,
    conditionName: condition.name,
    category: condition.category,
    severity: condition.severity,
    duration: condition.duration,
    parsedDuration: parseDurationString(condition.duration)
  }));
};

/**
 * Format duration for user display with appropriate context
 * @param parsedDuration - Parsed duration object
 * @param context - Display context ('compact', 'full', 'tooltip')
 * @returns Formatted duration string
 */
export const formatDurationDisplay = (parsedDuration: ParsedDuration | null | undefined, context: 'compact' | 'full' | 'tooltip' = 'compact'): string => {
  if (!parsedDuration) return 'Duration not specified';

  switch (context) {
    case 'compact':
      return parsedDuration.display;

    case 'full':
      if (parsedDuration.isComplex) {
        return parsedDuration.display;
      }
      return `Treatment duration: ${parsedDuration.display}`;

    case 'tooltip':
      if (parsedDuration.isComplex) {
        return `Complex duration: ${parsedDuration.display}`;
      }
      const categoryDesc: { [key: string]: string } = {
        'short': 'Short-term treatment',
        'medium': 'Standard treatment',
        'long': 'Extended treatment',
        'extended': 'Long-term treatment'
      };
      return `${categoryDesc[parsedDuration.category] || 'Treatment'}: ${parsedDuration.display}`;

    default:
      return parsedDuration.display;
  }
};

/**
 * Get duration statistics for a set of conditions
 * @param conditions - Array of condition objects
 * @returns Duration statistics
 */
export const getDurationStats = (conditions: Array<{ duration?: string }>): DurationStatistics => {
  const stats: DurationStatistics = {
    total: conditions.length,
    categories: {
      short: 0,
      medium: 0,
      long: 0,
      extended: 0,
      complex: 0,
      unknown: 0
    },
    averageDays: null,
    range: { min: null, max: null }
  };

  const daysList: number[] = [];

  conditions.forEach(condition => {
    const parsed = parseDurationString(condition.duration);

    // Prioritize explicit category over isComplex flag
    if (parsed.category === 'unknown') {
      stats.categories.unknown++;
    } else if (parsed.category === 'complex' || parsed.isComplex) {
      stats.categories.complex++;
    } else {
      stats.categories[parsed.category as 'short' | 'medium' | 'long' | 'extended']++;

      if (parsed.maxDays) {
        daysList.push(parsed.maxDays);
      }
    }
  });

  if (daysList.length > 0) {
    stats.averageDays = Math.round(daysList.reduce((a, b) => a + b, 0) / daysList.length);
    stats.range.min = Math.min(...daysList);
    stats.range.max = Math.max(...daysList);
  }

  return stats;
};

export default {
  parseDurationString,
  getDurationIcon,
  getDurationColor,
  mapPathogenToConditions,
  getConditionDuration,
  getPathogenDurations,
  formatDurationDisplay,
  getDurationStats
};
