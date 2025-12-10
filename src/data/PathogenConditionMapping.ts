/**
 * PathogenConditionMapping.ts
 * Maps each pathogen to relevant clinical conditions and presentations
 */

/**
 * Type definitions for pathogen condition mapping
 */

interface PathogenMapping {
  name: string;
  gramStain: string;
  conditions: string[];
  commonPresentation: string;
  boardRelevance: string;
}

interface PathogenSummary {
  id: string;
  name: string;
  gramStain: string;
}

interface PathogenConditionMapType {
  [key: string]: PathogenMapping;
}

export const pathogenConditionMapping: PathogenConditionMapType = {
  'streptococcus-pneumoniae': {
    name: 'Streptococcus pneumoniae',
    gramStain: 'Gram-positive diplococci',
    conditions: [
      'community-acquired-pneumonia',
      'acute-otitis-media',
      'bacterial-meningitis'
    ],
    commonPresentation: 'Respiratory and invasive infections',
    boardRelevance: 'High - Most common invasive bacterial pathogen'
  },

  'escherichia-coli': {
    name: 'Escherichia coli (E. coli)',
    gramStain: 'Gram-negative rod',
    conditions: [
      'urinary-tract-infection',
      'sepsis'
    ],
    commonPresentation: 'Most common cause of pediatric UTI',
    boardRelevance: 'High - Most common UTI pathogen'
  },

  'staphylococcus-aureus': {
    name: 'Staphylococcus aureus',
    gramStain: 'Gram-positive cocci in clusters',
    conditions: [
      'skin-soft-tissue-infection',
      'pneumonia'
    ],
    commonPresentation: 'Increasingly MRSA; community-acquired MRSA common',
    boardRelevance: 'High - MRSA prevalence critical for stewardship'
  },

  'neisseria-meningitidis': {
    name: 'Neisseria meningitidis',
    gramStain: 'Gram-negative diplococci',
    conditions: [
      'bacterial-meningitis',
      'sepsis'
    ],
    commonPresentation: 'Rapid progression; petechial rash',
    boardRelevance: 'Critical - Rapidly fatal if not recognized'
  }
};

/**
 * Get condition mapping for a specific pathogen
 * @param pathogenId - The pathogen identifier
 * @returns Pathogen mapping object or null
 */
export const getConditionsForPathogen = (pathogenId: string): PathogenMapping | null => {
  return pathogenConditionMapping[pathogenId] || null;
};

/**
 * Get condition keys for a specific pathogen
 * @param pathogenId - The pathogen identifier
 * @returns Array of condition strings
 */
export const getConditionKeys = (pathogenId: string): string[] => {
  const mapping = getConditionsForPathogen(pathogenId);
  return mapping ? mapping.conditions : [];
};

/**
 * Get all pathogens associated with a condition
 * @param condition - The clinical condition
 * @returns Array of pathogen summaries
 */
export const getPathogensForCondition = (condition: string): PathogenSummary[] => {
  const pathogens: PathogenSummary[] = [];
  Object.entries(pathogenConditionMapping).forEach(([pathogenId, mapping]) => {
    if (mapping.conditions.includes(condition)) {
      pathogens.push({
        id: pathogenId,
        name: mapping.name,
        gramStain: mapping.gramStain
      });
    }
  });
  return pathogens;
};

/**
 * Get detailed information for a pathogen
 * @param pathogenId - The pathogen identifier
 * @returns Complete pathogen mapping or null
 */
export const getPathogenDetails = (pathogenId: string): PathogenMapping | null => {
  return pathogenConditionMapping[pathogenId] || null;
};

export default {
  pathogenConditionMapping,
  getConditionsForPathogen,
  getConditionKeys,
  getPathogensForCondition,
  getPathogenDetails
};
