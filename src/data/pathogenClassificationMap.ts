/**
 * Pathogen Classification Map for Northwestern 8-Segment Model
 * Maps existing 29 pathogens to Northwestern categories
 *
 * Northwestern Categories:
 * 1. MRSA (Methicillin-resistant Staphylococcus aureus)
 * 2. VRE_faecium (Vancomycin-resistant Enterococcus faecium)
 * 3. anaerobes (Bacteroides, C. difficile, mixed anaerobes)
 * 4. atypicals (Legionella, Mycoplasma, Chlamydophila)
 * 5. pseudomonas (Pseudomonas aeruginosa)
 * 6. gramNegative (Gram-negative organisms)
 * 7. MSSA (Methicillin-sensitive Staphylococcus aureus)
 * 8. enterococcus_faecalis (Enterococcus faecalis)
 */

export type NorthwesternCategory =
  | 'MRSA'
  | 'VRE_faecium'
  | 'anaerobes'
  | 'atypicals'
  | 'pseudomonas'
  | 'gramNegative'
  | 'MSSA'
  | 'enterococcus_faecalis'
  | 'gramPositive'
  | 'viral';

export interface PathogenClassification {
  pathogenName: string;
  northwesternCategories: NorthwesternCategory[];
  primaryCategory: NorthwesternCategory;
  notes: string;
}

export interface NorthwesternCategoryDefinition {
  fullName: string;
  description: string;
  keyFeatures: string[];
  clinicalSignificance: string;
}

export type PathogenToNorthwesternMapType = Record<number, PathogenClassification>;
export type NorthwesternCategoryDefinitionsType = Record<NorthwesternCategory, NorthwesternCategoryDefinition>;

export interface PathogenInCategory {
  pathogenId: number;
  pathogenName: string;
  isPrimary: boolean;
  notes: string;
}

export interface ResistanceProfile {
  methicillinResistant?: boolean;
  MRSA?: boolean;
  vancomycinResistant?: boolean;
  VRE?: boolean;
}

export interface CategoryStats {
  totalPathogens: number;
  primaryPathogens: number;
  secondaryPathogens: number;
}

export type CategoryStatsMap = Record<NorthwesternCategory, CategoryStats>;

// Map pathogen IDs to Northwestern categories
const pathogenToNorthwesternMap: PathogenToNorthwesternMapType = {
  // Staphylococcus aureus (context-dependent: MSSA vs MRSA)
  1: {
    pathogenName: "Staphylococcus aureus",
    northwesternCategories: ["MSSA", "MRSA"], // Both depending on resistance
    primaryCategory: "MSSA", // Default to MSSA unless specified
    notes: "Classification depends on methicillin resistance pattern"
  },

  // Escherichia coli
  2: {
    pathogenName: "Escherichia coli",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Classic gram-negative enteric pathogen"
  },

  // Streptococcus pneumoniae
  3: {
    pathogenName: "Streptococcus pneumoniae",
    northwesternCategories: ["gramPositive"], // Not in Northwestern 8, but gram-positive
    primaryCategory: "gramPositive",
    notes: "Gram-positive but not in Northwestern 8-segment model"
  },

  // Pseudomonas aeruginosa
  4: {
    pathogenName: "Pseudomonas aeruginosa",
    northwesternCategories: ["pseudomonas"],
    primaryCategory: "pseudomonas",
    notes: "Dedicated Northwestern category due to unique resistance patterns"
  },

  // Streptococcus pyogenes
  5: {
    pathogenName: "Streptococcus pyogenes",
    northwesternCategories: ["gramPositive"],
    primaryCategory: "gramPositive",
    notes: "Group A Strep - gram-positive but not in Northwestern 8"
  },

  // Klebsiella pneumoniae
  6: {
    pathogenName: "Klebsiella pneumoniae",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Important gram-negative pathogen with ESBL/CRE potential"
  },

  // Enterococcus faecalis
  7: {
    pathogenName: "Enterococcus faecalis",
    northwesternCategories: ["enterococcus_faecalis"],
    primaryCategory: "enterococcus_faecalis",
    notes: "Dedicated Northwestern category - typically vancomycin-sensitive"
  },

  // Haemophilus influenzae
  8: {
    pathogenName: "Haemophilus influenzae",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Fastidious gram-negative pathogen"
  },

  // Acinetobacter baumannii
  9: {
    pathogenName: "Acinetobacter baumannii",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Multi-drug resistant gram-negative pathogen"
  },

  // Clostridium difficile
  10: {
    pathogenName: "Clostridium difficile",
    northwesternCategories: ["anaerobes"],
    primaryCategory: "anaerobes",
    notes: "Spore-forming anaerobic pathogen"
  },

  // Enterococcus faecium
  11: {
    pathogenName: "Enterococcus faecium",
    northwesternCategories: ["VRE_faecium"],
    primaryCategory: "VRE_faecium",
    notes: "Dedicated Northwestern category - high VRE potential"
  },

  // Neisseria meningitidis
  12: {
    pathogenName: "Neisseria meningitidis",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Gram-negative diplococci"
  },

  // Moraxella catarrhalis
  13: {
    pathogenName: "Moraxella catarrhalis",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Gram-negative respiratory pathogen"
  },

  // Mycoplasma pneumoniae
  14: {
    pathogenName: "Mycoplasma pneumoniae",
    northwesternCategories: ["atypicals"],
    primaryCategory: "atypicals",
    notes: "Classic atypical pneumonia pathogen"
  },

  // Streptococcus anginosus
  15: {
    pathogenName: "Streptococcus anginosus",
    northwesternCategories: ["gramPositive"],
    primaryCategory: "gramPositive",
    notes: "Anginosus group streptococcus - gram-positive"
  },

  // Kingella kingae
  16: {
    pathogenName: "Kingella kingae",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Fastidious gram-negative pathogen"
  },

  // Staphylococcus saprophyticus
  17: {
    pathogenName: "Staphylococcus saprophyticus",
    northwesternCategories: ["gramPositive"],
    primaryCategory: "gramPositive",
    notes: "Coagulase-negative staphylococcus - typically methicillin-sensitive"
  },

  // Coagulase-negative Staphylococcus
  18: {
    pathogenName: "Coagulase-negative Staphylococcus",
    northwesternCategories: ["gramPositive", "MRSA"], // Can be methicillin-resistant
    primaryCategory: "gramPositive",
    notes: "Can have methicillin resistance but not classified as MRSA"
  },

  // Bartonella species
  19: {
    pathogenName: "Bartonella species",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Fastidious gram-negative pathogen"
  },

  // Fusobacterium species
  20: {
    pathogenName: "Fusobacterium species",
    northwesternCategories: ["anaerobes"],
    primaryCategory: "anaerobes",
    notes: "Anaerobic gram-negative pathogen"
  },

  // Group B Streptococcus
  21: {
    pathogenName: "Group B Streptococcus",
    northwesternCategories: ["gramPositive"],
    primaryCategory: "gramPositive",
    notes: "Streptococcus agalactiae - gram-positive"
  },

  // Enterobacter species
  22: {
    pathogenName: "Enterobacter species",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Gram-negative with intrinsic AmpC resistance"
  },

  // Citrobacter species
  23: {
    pathogenName: "Citrobacter species",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Gram-negative enterobacteriaceae"
  },

  // Proteus species
  24: {
    pathogenName: "Proteus species",
    northwesternCategories: ["gramNegative"],
    primaryCategory: "gramNegative",
    notes: "Gram-negative with urease production"
  },

  // Microaerophilic streptococci
  25: {
    pathogenName: "Microaerophilic streptococci",
    northwesternCategories: ["gramPositive"],
    primaryCategory: "gramPositive",
    notes: "Oral flora streptococci - gram-positive"
  },

  // Nontuberculous mycobacteria
  26: {
    pathogenName: "Nontuberculous mycobacteria",
    northwesternCategories: ["atypicals"], // Special case - requires special therapy
    primaryCategory: "atypicals",
    notes: "Acid-fast bacilli requiring specialized antimycobacterial therapy"
  },

  // Anaerobes (mixed)
  27: {
    pathogenName: "Anaerobes",
    northwesternCategories: ["anaerobes"],
    primaryCategory: "anaerobes",
    notes: "Mixed anaerobic flora including Bacteroides"
  },

  // Herpes Simplex Virus
  28: {
    pathogenName: "Herpes Simplex Virus",
    northwesternCategories: ["viral"], // Not in Northwestern 8
    primaryCategory: "viral",
    notes: "Viral pathogen - not covered by Northwestern antibiotic model"
  },

  // Respiratory viruses
  29: {
    pathogenName: "Respiratory viruses",
    northwesternCategories: ["viral"], // Not in Northwestern 8
    primaryCategory: "viral",
    notes: "Viral pathogens - not covered by Northwestern antibiotic model"
  }
};

// Northwestern category definitions and expected pathogens
const northwesternCategoryDefinitions: NorthwesternCategoryDefinitionsType = {
  MRSA: {
    fullName: "Methicillin-resistant Staphylococcus aureus",
    description: "Staphylococcus aureus strains resistant to methicillin/oxacillin",
    keyFeatures: ["mecA gene", "PBP2a production", "Multi-drug resistance"],
    clinicalSignificance: "Major healthcare-associated pathogen requiring vancomycin or alternative agents"
  },

  VRE_faecium: {
    fullName: "Vancomycin-resistant Enterococcus faecium",
    description: "E. faecium strains with vancomycin resistance",
    keyFeatures: ["vanA or vanB genes", "High-level ampicillin resistance", "Healthcare-associated"],
    clinicalSignificance: "Challenging to treat, often requires linezolid or daptomycin"
  },

  anaerobes: {
    fullName: "Anaerobic bacteria",
    description: "Obligate anaerobic bacteria including Bacteroides, Clostridium, mixed flora",
    keyFeatures: ["Oxygen-sensitive", "Normal flora components", "Polymicrobial infections"],
    clinicalSignificance: "Common in abdominal, pelvic, and dental infections"
  },

  atypicals: {
    fullName: "Atypical pathogens",
    description: "Legionella, Mycoplasma, Chlamydophila, and other atypical pneumonia agents",
    keyFeatures: ["Intracellular pathogens", "Require special culture media", "Atypical pneumonia"],
    clinicalSignificance: "Require macrolides, fluoroquinolones, or tetracyclines"
  },

  pseudomonas: {
    fullName: "Pseudomonas aeruginosa",
    description: "Non-fermentative gram-negative rod with intrinsic antibiotic resistance",
    keyFeatures: ["Non-fermentative", "Biofilm formation", "Multiple resistance mechanisms"],
    clinicalSignificance: "Requires anti-pseudomonal agents (carbapenems, cefepime, piperacillin-tazobactam)"
  },

  gramNegative: {
    fullName: "Gram-negative bacteria",
    description: "Broad category of gram-negative bacteria excluding Pseudomonas",
    keyFeatures: ["Outer membrane", "Endotoxin (LPS)", "Beta-lactamase potential"],
    clinicalSignificance: "Includes Enterobacteriaceae and other gram-negative pathogens"
  },

  MSSA: {
    fullName: "Methicillin-sensitive Staphylococcus aureus",
    description: "Staphylococcus aureus strains sensitive to methicillin/oxacillin",
    keyFeatures: ["No mecA gene", "Beta-lactam sensitive", "Community or healthcare-associated"],
    clinicalSignificance: "Treatable with anti-staphylococcal penicillins or cephalosporins"
  },

  enterococcus_faecalis: {
    fullName: "Enterococcus faecalis",
    description: "Typically vancomycin-sensitive enterococcal species",
    keyFeatures: ["Intrinsic ampicillin susceptibility", "Lower VRE potential", "Bile tolerant"],
    clinicalSignificance: "Usually treatable with ampicillin or vancomycin"
  },

  gramPositive: {
    fullName: "Gram-positive bacteria",
    description: "Gram-positive bacteria not specifically categorized in Northwestern 8",
    keyFeatures: ["Thick peptidoglycan", "No outer membrane"],
    clinicalSignificance: "Variable coverage by standard beta-lactams"
  },

  viral: {
    fullName: "Viral pathogens",
    description: "Viral organisms not covered by antibiotic therapy",
    keyFeatures: ["No cell wall", "Requires antiviral therapy"],
    clinicalSignificance: "Not covered by Northwestern antibiotic model"
  }
};

/**
 * Get Northwestern classification for a pathogen
 */
export const getNorthwesternClassification = (pathogenId: number): PathogenClassification | null => {
  return pathogenToNorthwesternMap[pathogenId] || null;
};

/**
 * Get all pathogens in a specific Northwestern category
 */
export const getPathogensInNorthwesternCategory = (category: NorthwesternCategory): PathogenInCategory[] => {
  const results: PathogenInCategory[] = [];

  Object.entries(pathogenToNorthwesternMap).forEach(([pathogenId, data]) => {
    if (data.northwesternCategories.includes(category)) {
      results.push({
        pathogenId: parseInt(pathogenId),
        pathogenName: data.pathogenName,
        isPrimary: data.primaryCategory === category,
        notes: data.notes
      });
    }
  });

  return results;
};

/**
 * Get Northwestern category definition
 */
export const getNorthwesternCategoryDefinition = (category: NorthwesternCategory): NorthwesternCategoryDefinition | null => {
  return northwesternCategoryDefinitions[category] || null;
};

/**
 * Check if pathogen belongs to Northwestern category
 */
export const isPathogenInNorthwesternCategory = (pathogenId: number, category: NorthwesternCategory): boolean => {
  const classification = getNorthwesternClassification(pathogenId);
  return classification?.northwesternCategories.includes(category) || false;
};

/**
 * Get Northwestern coverage statistics by pathogen distribution
 */
export const getNorthwesternPathogenStats = (): CategoryStatsMap => {
  const stats: Partial<CategoryStatsMap> = {};
  const categories: NorthwesternCategory[] = [
    'MRSA',
    'VRE_faecium',
    'anaerobes',
    'atypicals',
    'pseudomonas',
    'gramNegative',
    'MSSA',
    'enterococcus_faecalis'
  ];

  categories.forEach(category => {
    stats[category] = {
      totalPathogens: 0,
      primaryPathogens: 0,
      secondaryPathogens: 0
    };
  });

  Object.values(pathogenToNorthwesternMap).forEach(data => {
    data.northwesternCategories.forEach(category => {
      if (stats[category]) {
        stats[category]!.totalPathogens++;
        if (data.primaryCategory === category) {
          stats[category]!.primaryPathogens++;
        } else {
          stats[category]!.secondaryPathogens++;
        }
      }
    });
  });

  return stats as CategoryStatsMap;
};

/**
 * Convert pathogen to resistance context for Northwestern classification
 * Handles special cases like MSSA vs MRSA
 */
export const getContextualNorthwesternCategory = (
  pathogenId: number,
  resistanceProfile: ResistanceProfile = {}
): NorthwesternCategory | null => {
  const classification = getNorthwesternClassification(pathogenId);
  if (!classification) return null;

  // Special handling for Staphylococcus aureus
  if (pathogenId === 1) { // S. aureus
    if (resistanceProfile.methicillinResistant || resistanceProfile.MRSA) {
      return "MRSA";
    } else {
      return "MSSA";
    }
  }

  // Special handling for Enterococcus faecium
  if (pathogenId === 11) { // E. faecium
    if (resistanceProfile.vancomycinResistant || resistanceProfile.VRE) {
      return "VRE_faecium";
    } else {
      return "VRE_faecium"; // E. faecium has high VRE potential regardless
    }
  }

  return classification.primaryCategory;
};

/**
 * Validate pathogen classification data
 */
export const validatePathogenClassification = (): string[] | null => {
  const errors: string[] = [];

  // Check all pathogens have classifications
  Object.entries(pathogenToNorthwesternMap).forEach(([pathogenId, data]) => {
    if (!data.pathogenName) {
      errors.push(`Pathogen ${pathogenId} missing name`);
    }

    if (!data.northwesternCategories || data.northwesternCategories.length === 0) {
      errors.push(`Pathogen ${pathogenId} missing Northwestern categories`);
    }

    if (!data.primaryCategory) {
      errors.push(`Pathogen ${pathogenId} missing primary category`);
    }

    if (data.primaryCategory && !data.northwesternCategories.includes(data.primaryCategory)) {
      errors.push(`Pathogen ${pathogenId} primary category not in categories list`);
    }
  });

  // Check Northwestern categories are valid
  const validCategories = Object.keys(northwesternCategoryDefinitions);
  Object.values(pathogenToNorthwesternMap).forEach(data => {
    data.northwesternCategories.forEach(category => {
      if (!validCategories.includes(category) &&
          !['gramPositive', 'viral'].includes(category)) {
        errors.push(`Invalid Northwestern category: ${category}`);
      }
    });
  });

  return errors.length === 0 ? null : errors;
};

// Export mapping objects and types
export {
  pathogenToNorthwesternMap,
  northwesternCategoryDefinitions
};

export default pathogenToNorthwesternMap;
