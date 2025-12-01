/**
 * PathogenConditionMapping.js
 * Maps each pathogen to relevant clinical conditions and presentations
 */

export const pathogenConditionMapping = {
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

export const getConditionsForPathogen = (pathogenId) => {
  return pathogenConditionMapping[pathogenId] || null;
};

export const getConditionKeys = (pathogenId) => {
  const mapping = getConditionsForPathogen(pathogenId);
  return mapping ? mapping.conditions : [];
};

export const getPathogensForCondition = (condition) => {
  const pathogens = [];
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

export const getPathogenDetails = (pathogenId) => {
  return pathogenConditionMapping[pathogenId] || null;
};

export default {
  pathogenConditionMapping,
  getConditionsForPathogen,
  getConditionKeys,
  getPathogensForCondition,
  getPathogenDetails
};
