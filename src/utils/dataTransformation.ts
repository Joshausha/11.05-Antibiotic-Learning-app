/**
 * Data Transformation Utilities
 * Utilities to convert RBO_JSON data structure to application-compatible format
 */

/**
 * Type definitions for data transformation
 */

interface TherapyObject {
  [key: string]: string;
}

interface NotesTransform {
  keyPoints: string[];
  clinicalPearls: string[];
}

interface OriginalData {
  antibioticDuration?: string[];
  keyResources?: any;
}

interface TransformedCondition {
  id: string;
  category: string;
  name: string;
  description: string;
  commonPathogens: string[];
  empiricTherapy: TherapyObject;
  duration: string;
  keyPoints: string[];
  clinicalPearls: string[];
  transformed: boolean;
  _originalData: OriginalData;
}

interface DatasetStats {
  totalConditions: number;
  categories: string[];
  categoryCount: Record<string, number>;
  validConditions: number;
}

interface RboCondition {
  id: string;
  category: string;
  name: string;
  description?: string;
  commonPathogens?: string[];
  empiricAntibioticTherapy?: Array<{ condition: string; therapy: string }>;
  antibioticDuration?: string[];
  notes?: string[];
  keyResources?: any;
  [key: string]: any;
}

/**
 * Transform empiric antibiotic therapy array to simplified object format
 * @param empiricAntibioticTherapy - Array of therapy objects from RBO_JSON
 * @returns - Simplified therapy object for application use
 */
export const transformEmpiricTherapy = (empiricAntibioticTherapy: any[]): TherapyObject => {
  if (!Array.isArray(empiricAntibioticTherapy)) {
    return {};
  }

  const therapyObject: TherapyObject = {};

  empiricAntibioticTherapy.forEach(item => {
    const condition = item.condition || 'Standard Treatment';
    therapyObject[condition] = item.therapy;
  });

  return therapyObject;
};

/**
 * Transform antibiotic duration array to single duration string
 * @param antibioticDuration - Array of duration options from RBO_JSON
 * @returns - Primary duration recommendation
 */
export const transformDuration = (antibioticDuration: string[]): string => {
  if (!Array.isArray(antibioticDuration) || antibioticDuration.length === 0) {
    return 'Duration varies based on clinical response';
  }

  // Return the first duration as primary, combine others as notes
  return antibioticDuration[0];
};

/**
 * Transform notes array into keyPoints and clinicalPearls
 * @param notes - Notes array from RBO_JSON
 * @returns - Object with keyPoints and clinicalPearls arrays
 */
export const transformNotes = (notes: string[]): NotesTransform => {
  if (!Array.isArray(notes)) {
    return { keyPoints: [], clinicalPearls: [] };
  }

  const keyPoints: string[] = [];
  const clinicalPearls: string[] = [];

  notes.forEach(note => {
    // Clean up note text (remove citation markers)
    const cleanNote = note.replace(/\[cite.*?\]/g, '').trim();

    if (cleanNote.length === 0) return;

    // Categorize notes - clinical pearls tend to be more specific/practical
    if (cleanNote.includes('Consider') ||
      cleanNote.includes('may') ||
      cleanNote.includes('can be') ||
      cleanNote.includes('recommended') ||
      cleanNote.includes('studies')) {
      clinicalPearls.push(cleanNote);
    } else {
      keyPoints.push(cleanNote);
    }
  });

  // If no clear categorization, put first half in keyPoints, rest in pearls
  if (keyPoints.length === 0 && clinicalPearls.length === 0 && notes.length > 0) {
    const midpoint = Math.ceil(notes.length / 2);
    notes.slice(0, midpoint).forEach(note => {
      const cleanNote = note.replace(/\[cite.*?\]/g, '').trim();
      if (cleanNote) keyPoints.push(cleanNote);
    });
    notes.slice(midpoint).forEach(note => {
      const cleanNote = note.replace(/\[cite.*?\]/g, '').trim();
      if (cleanNote) clinicalPearls.push(cleanNote);
    });
  }

  return { keyPoints, clinicalPearls };
};

/**
 * Clean and format pathogen names for consistency
 * @param commonPathogens - Array of pathogen names from RBO_JSON
 * @returns - Cleaned pathogen names
 */
export const transformPathogens = (commonPathogens: string[]): string[] => {
  if (!Array.isArray(commonPathogens)) {
    return [];
  }

  return commonPathogens.map(pathogen => {
    // Clean up pathogen names (remove citation markers, extra text)
    return pathogen
      .replace(/\[cite.*?\]/g, '')
      .replace(/\(.*?\)/g, match => {
        // Keep useful parenthetical info, remove citations
        if (match.includes('cite')) return '';
        return match;
      })
      .trim();
  }).filter(pathogen => pathogen.length > 0);
};

/**
 * Transform a single RBO_JSON condition to application format
 * @param rboCondition - Single condition object from RBO_JSON
 * @returns - Transformed condition for application use
 */
export const transformCondition = (rboCondition: RboCondition): TransformedCondition | null => {
  // Handle null/undefined condition
  if (!rboCondition) {
    return null;
  }

  const { keyPoints, clinicalPearls } = transformNotes(rboCondition.notes || []);

  return {
    id: rboCondition.id,
    category: rboCondition.category,
    name: rboCondition.name,
    description: rboCondition.description || '',
    commonPathogens: transformPathogens(rboCondition.commonPathogens || []),
    empiricTherapy: transformEmpiricTherapy(rboCondition.empiricAntibioticTherapy || []),
    duration: transformDuration(rboCondition.antibioticDuration || []),
    keyPoints: keyPoints,
    clinicalPearls: clinicalPearls,
    transformed: true,
    // Keep original data for reference if needed
    _originalData: {
      antibioticDuration: rboCondition.antibioticDuration,
      keyResources: rboCondition.keyResources
    }
  };
};

/**
 * Transform entire RBO_JSON dataset to application format
 * @param rboData - Complete RBO_JSON data array
 * @returns - Array of transformed conditions for application use
 */
export const transformRboDataset = (rboData: RboCondition[]): TransformedCondition[] => {
  console.log('transformRboDataset input:', typeof rboData, Array.isArray(rboData), rboData ? rboData.length : 'null');

  if (!Array.isArray(rboData)) {
    console.error('RBO data must be an array');
    return [];
  }

  try {
    const mapped = rboData.map(condition => {
      console.log('Transforming condition:', condition ? condition.id : 'null condition');
      return transformCondition(condition);
    });
    console.log('Mapped result:', mapped.length, 'items');

    const filtered = mapped.filter((condition): condition is TransformedCondition => condition !== null);
    console.log('Filtered result:', filtered.length, 'items');

    return filtered;
  } catch (error) {
    console.error('Error in transformRboDataset:', error);
    return [];
  }
};

/**
 * Validate transformed condition data
 * @param condition - Transformed condition object
 * @returns - Whether condition has required fields
 */
export const validateCondition = (condition: TransformedCondition): boolean => {
  const requiredFields = ['id', 'category', 'name', 'commonPathogens', 'empiricTherapy'];

  return requiredFields.every(field => {
    const hasField = Object.prototype.hasOwnProperty.call(condition, field);
    if (!hasField) {
      console.warn(`Condition ${condition.id || 'unknown'} missing required field: ${field}`);
    }
    return hasField;
  });
};

/**
 * Get statistics about the transformed dataset
 * @param transformedData - Array of transformed conditions
 * @returns - Dataset statistics
 */
export const getDatasetStats = (transformedData: TransformedCondition[]): DatasetStats => {
  const categories = [...new Set(transformedData.map(c => c.category))];
  const categoryCount: Record<string, number> = {};

  categories.forEach(category => {
    categoryCount[category] = transformedData.filter(c => c.category === category).length;
  });

  return {
    totalConditions: transformedData.length,
    categories: categories,
    categoryCount: categoryCount,
    validConditions: transformedData.filter(validateCondition).length
  };
};
