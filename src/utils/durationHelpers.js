/**
 * Duration Helper Functions
 * Utilities for parsing and displaying treatment duration information
 * Integrates with RBO clinical guidelines data
 * Created: 2025-08-03
 */

import { Clock, Timer, AlarmClock, Calendar } from 'lucide-react';
import { rboConditionsMap } from '../data/RBOMappingSystem.js';

/**
 * Parse duration string from RBO data into structured format
 * Handles various duration formats from clinical guidelines
 * @param {string} duration - Duration string from RBO data
 * @returns {Object} Parsed duration information
 */
export const parseDurationString = (duration) => {
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
    return {
      type: 'conditional',
      display: duration,
      minDays: extractDaysFromString(duration),
      maxDays: null,
      category: determineCategory(extractDaysFromString(duration)),
      isComplex: true,
      condition: extractCondition(duration)
    };
  }

  // Handle simple day ranges (e.g., "5-7 days")
  const dayMatch = durationLower.match(/(\d+)[-–]?(\d+)?\s*days?/);
  if (dayMatch) {
    const minDays = parseInt(dayMatch[1]);
    const maxDays = dayMatch[2] ? parseInt(dayMatch[2]) : minDays;
    
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
    const minWeeks = parseInt(weekMatch[1]);
    const maxWeeks = weekMatch[2] ? parseInt(weekMatch[2]) : minWeeks;
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
    const days = parseInt(singleDayMatch[1]);
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
    const weeks = parseInt(singleWeekMatch[1]);
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
 * @param {string} duration - Duration string with age groups
 * @returns {Array} Array of age group objects
 */
const parseAgeGroups = (duration) => {
  const groups = [];
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
 * @param {string} duration - Duration string
 * @returns {string} Condition description
 */
const extractCondition = (duration) => {
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
 * @param {string} duration - Duration string
 * @returns {number|null} Number of days or null if not found
 */
const extractDaysFromString = (duration) => {
  // Handle day ranges first (e.g., "10-14 days") - return minimum for conservative estimate
  const dayRangeMatch = duration.match(/(\d+)[-–](\d+)\s*days?/);
  if (dayRangeMatch) return parseInt(dayRangeMatch[1]); // Return minimum
  
  // Handle single day values
  const dayMatch = duration.match(/(\d+)\s*days?/);
  if (dayMatch) return parseInt(dayMatch[1]);
  
  // Handle week ranges (e.g., "2-3 weeks") - return minimum for conservative estimate
  const weekRangeMatch = duration.match(/(\d+)[-–](\d+)\s*weeks?/);
  if (weekRangeMatch) return parseInt(weekRangeMatch[1]) * 7; // Return minimum
  
  // Handle single week values
  const weekMatch = duration.match(/(\d+)\s*weeks?/);
  if (weekMatch) return parseInt(weekMatch[1]) * 7;
  
  return null;
};

/**
 * Determine duration category based on number of days
 * Aligned with antimicrobial stewardship best practices
 * @param {number} days - Number of days
 * @returns {string} Category: short, medium, long, or extended
 */
const determineCategory = (days) => {
  if (!days || days === null) return 'unknown';
  
  if (days <= 14) return 'short';     // ≤2 weeks - most uncomplicated infections
  if (days <= 21) return 'medium';    // 15-21 days - some complex infections
  if (days <= 42) return 'long';      // 22-42 days - serious infections
  return 'extended';                  // >42 days - chronic/complex cases
};

/**
 * Format day range for display
 * @param {number} minDays - Minimum days
 * @param {number} maxDays - Maximum days
 * @returns {string} Formatted display string
 */
const formatDayRange = (minDays, maxDays) => {
  if (minDays === maxDays) {
    return `${minDays} day${minDays !== 1 ? 's' : ''}`;
  }
  return `${minDays}-${maxDays} days`;
};

/**
 * Format week range for display
 * @param {number} minWeeks - Minimum weeks
 * @param {number} maxWeeks - Maximum weeks
 * @returns {string} Formatted display string
 */
const formatWeekRange = (minWeeks, maxWeeks) => {
  if (minWeeks === maxWeeks) {
    return `${minWeeks} week${minWeeks !== 1 ? 's' : ''}`;
  }
  return `${minWeeks}-${maxWeeks} weeks`;
};

/**
 * Get appropriate icon component for duration
 * @param {Object} parsedDuration - Parsed duration object
 * @returns {Object} Lucide icon component
 */
export const getDurationIcon = (parsedDuration) => {
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
 * @param {Object} parsedDuration - Parsed duration object
 * @returns {Object} Color scheme object
 */
export const getDurationColor = (parsedDuration) => {
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
 * @param {string} pathogenName - Name of pathogen
 * @returns {Array} Array of matching RBO conditions
 */
export const mapPathogenToConditions = (pathogenName) => {
  if (!pathogenName) return [];

  const pathogenLower = pathogenName.toLowerCase();
  
  // Handle common medical abbreviations
  const expandedPathogens = expandPathogenAbbreviations(pathogenLower);
  
  return rboConditionsMap.filter(condition => 
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
 * @param {string} pathogen - Pathogen name (lowercase)
 * @returns {Array} Array of possible expanded names
 */
const expandPathogenAbbreviations = (pathogen) => {
  const abbreviationMap = {
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
 * @param {string} abbreviated - Abbreviated name
 * @param {string} fullName - Full pathogen name
 * @returns {boolean} True if they match
 */
const matchesAbbreviation = (abbreviated, fullName) => {
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
 * @param {string} conditionId - RBO condition ID
 * @returns {string|null} Duration string or null if not found
 */
export const getConditionDuration = (conditionId) => {
  const condition = rboConditionsMap.find(c => c.id === conditionId);
  return condition ? condition.duration : null;
};

/**
 * Get all durations for a pathogen across different conditions
 * @param {string} pathogenName - Name of pathogen
 * @returns {Array} Array of duration objects with condition context
 */
export const getPathogenDurations = (pathogenName) => {
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
 * @param {Object} parsedDuration - Parsed duration object
 * @param {string} context - Display context ('compact', 'full', 'tooltip')
 * @returns {string} Formatted duration string
 */
export const formatDurationDisplay = (parsedDuration, context = 'compact') => {
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
      const categoryDesc = {
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
 * @param {Array} conditions - Array of condition objects
 * @returns {Object} Duration statistics
 */
export const getDurationStats = (conditions) => {
  const stats = {
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

  const daysList = [];

  conditions.forEach(condition => {
    const parsed = parseDurationString(condition.duration);
    
    // Prioritize explicit category over isComplex flag
    if (parsed.category === 'unknown') {
      stats.categories.unknown++;
    } else if (parsed.category === 'complex' || parsed.isComplex) {
      stats.categories.complex++;
    } else {
      stats.categories[parsed.category]++;
      
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