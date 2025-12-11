/**
 * Advanced Data Parser
 * Extracts and normalizes pathogen and antibiotic information from medical conditions data
 * Handles complex text patterns and creates standardized lists for multi-dimensional exploration
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Gram stain classification
 */
type GramStatus = 'positive' | 'negative' | 'atypical' | 'acid-fast' | 'unknown';

/**
 * Pathogen type classification
 */
type PathogenType = 'bacteria' | 'virus' | 'fungus' | 'mycobacteria' | 'atypical bacteria';

/**
 * Spectrum category for visualization
 */
type SpectrumCategory = 'typical' | 'atypical' | 'mixed';

/**
 * Pathogen category for spectrum scoring
 */
type PathogenCategory = 'positive' | 'negative' | 'atypical' | 'anaerobes';

/**
 * Parsed pathogen information
 */
interface ParsedPathogen {
  originalText: string;
  name: string;
  shortName: string;
  details: string;
  gramStatus: GramStatus;
  type: PathogenType;
  pathogenType: PathogenType;
  spectrumCategory: SpectrumCategory;
  isValid: boolean;
}

/**
 * Parsed antibiotic information
 */
interface ParsedAntibiotic {
  originalText: string;
  name: string;
  class: string;
  isValid: boolean;
}

/**
 * Antibiotic spectrum scoring (0-10 scale)
 */
interface SpectrumScores {
  gramPositive: number;
  gramNegative: number;
  atypical: number;
  anaerobes: number;
  [key: string]: number;
}

/**
 * Antibiotic coverage information
 */
interface Coverage {
  typical?: string[];
  limited?: string[];
  resistant?: string[];
  atypical?: string[];
  [key: string]: string[] | undefined;
}

/**
 * Visual properties for antibiotic representation
 */
interface VisualProperties {
  color: string;
  position: {
    angle: number;
    radius: number;
  };
}

/**
 * Complete antibiotic spectrum data
 */
interface AntibioticSpectrum {
  class: string;
  subclass: string;
  spectrum: SpectrumScores;
  coverage: Coverage;
  mechanismOfAction: string;
  resistance: string[];
  visualProperties: VisualProperties;
}

/**
 * Drug class mapping for colors
 */
interface DrugClassColors {
  [drugClass: string]: string;
}

/**
 * Neo4j node type definition
 */
interface NodeTypeDefinition {
  properties: string[];
  indexes: string[];
}

/**
 * Neo4j relationship type definition
 */
interface RelationshipTypeDefinition {
  properties: string[];
}

/**
 * Neo4j schema structure
 */
interface Neo4jSchema {
  nodeTypes: {
    PATHOGEN: NodeTypeDefinition;
    ANTIBIOTIC: NodeTypeDefinition;
    CONDITION: NodeTypeDefinition;
    DRUG_CLASS: NodeTypeDefinition;
  };
  relationshipTypes: {
    TREATS: RelationshipTypeDefinition;
    CAUSES: RelationshipTypeDefinition;
    BELONGS_TO: RelationshipTypeDefinition;
    SYNERGISTIC_WITH: RelationshipTypeDefinition;
    RESISTANT_TO: RelationshipTypeDefinition;
    ALTERNATIVE_TO: RelationshipTypeDefinition;
  };
}

/**
 * Antibiotic with usage context
 */
interface AntibioticData extends ParsedAntibiotic {
  conditions: Set<string>;
  therapyContexts: Set<string>;
  count: number;
}

/**
 * Pathogen with usage context
 */
interface PathogenData extends ParsedPathogen {
  conditions: Set<string>;
  count: number;
}

/**
 * Relationship between entities
 */
interface Relationship {
  type: 'PATHOGEN_CAUSES' | 'ANTIBIOTIC_TREATS';
  from: string;
  to: string;
  properties: {
    frequency?: string;
    context?: string;
  };
}

/**
 * Processed conditions data result
 */
interface ProcessedConditionsResult {
  pathogens: Array<Omit<PathogenData, 'conditions'> & { conditions: string[] }>;
  antibiotics: Array<Omit<AntibioticData, 'conditions' | 'therapyContexts'> & {
    conditions: string[];
    therapyContexts: string[];
  }>;
  totalPathogens: number;
  totalAntibiotics: number;
  conditions: unknown[];
  relationships: Relationship[];
}

/**
 * Medical condition structure
 */
interface MedicalCondition {
  id: string | number;
  name: string;
  commonPathogens?: string[];
  empiricTherapy?: {
    [key: string]: string;
  } | string;
  [key: string]: unknown;
}

/**
 * Visualization documentation entry
 */
interface VisualizationDoc {
  [key: string]: string;
}

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

/**
 * Extract and normalize pathogen names from commonPathogens arrays
 */
export const parsePathogen = (pathogenText: string | null | undefined): ParsedPathogen | null => {
  if (!pathogenText || typeof pathogenText !== 'string') {
    return null;
  }

  // Clean up the text
  let cleanText = pathogenText.trim();

  // Remove citation markers and references
  cleanText = cleanText.replace(/\[cite.*?\]/g, '');
  cleanText = cleanText.replace(/\(cite.*?\)/g, '');

  // Skip entries that are clearly not pathogens (references, notes, etc.)
  const nonPathogenPatterns = [
    /^RCTs for/i,
    /^Observational studies/i,
    /et al/i,
    /^Studies/i,
    /^Research/i
  ];

  if (nonPathogenPatterns.some(pattern => pattern.test(cleanText))) {
    return null;
  }

  // Extract the main pathogen name
  let mainName = cleanText;
  let details = '';
  let gramStatus: GramStatus = 'unknown';
  let pathogenType: PathogenType = 'bacteria';
  let spectrumCategory: SpectrumCategory = 'typical';

  // Handle parenthetical information
  const parenthesesMatch = cleanText.match(/^([^(]+)\s*\(([^)]+)\)/);
  if (parenthesesMatch) {
    mainName = parenthesesMatch[1].trim();
    details = parenthesesMatch[2].trim();
  }

  // Determine gram status based on pathogen name
  const gramPositivePatterns = [
    /staphylococcus/i,
    /streptococcus/i,
    /enterococcus/i,
    /clostridium/i,
    /corynebacterium/i,
    /bacillus/i,
    /listeria/i
  ];

  const gramNegativePatterns = [
    /escherichia/i,
    /klebsiella/i,
    /pseudomonas/i,
    /enterobacter/i,
    /proteus/i,
    /citrobacter/i,
    /haemophilus/i,
    /moraxella/i,
    /neisseria/i,
    /enterobacterales/i,
    /salmonella/i,
    /shigella/i,
    /acinetobacter/i,
    /stenotrophomonas/i
  ];

  const atypicalPatterns = [
    /mycoplasma/i,
    /chlamydia/i,
    /legionella/i,
    /rickettsia/i,
    /coxiella/i,
    /ehrlichia/i,
    /anaplasma/i,
    /bartonella/i,
    /francisella/i,
    /brucella/i
  ];

  // Determine spectrum category and gram status
  if (atypicalPatterns.some(pattern => pattern.test(mainName))) {
    spectrumCategory = 'atypical';
    gramStatus = 'atypical';
  } else if (gramPositivePatterns.some(pattern => pattern.test(mainName))) {
    gramStatus = 'positive';
    spectrumCategory = 'typical';
  } else if (gramNegativePatterns.some(pattern => pattern.test(mainName))) {
    gramStatus = 'negative';
    spectrumCategory = 'typical';
  }

  // Determine pathogen type with enhanced categories
  if (/virus/i.test(cleanText) || /viral/i.test(cleanText) || /HSV/i.test(cleanText)) {
    pathogenType = 'virus';
    spectrumCategory = 'atypical';
  } else if (/fungal/i.test(cleanText) || /candida/i.test(cleanText) || /aspergillus/i.test(cleanText)) {
    pathogenType = 'fungus';
    spectrumCategory = 'atypical';
  } else if (/mycobacteri/i.test(cleanText)) {
    pathogenType = 'mycobacteria';
    spectrumCategory = 'atypical';
    gramStatus = 'acid-fast';
  } else if (atypicalPatterns.some(pattern => pattern.test(mainName))) {
    pathogenType = 'atypical bacteria';
  }

  // Standardize common abbreviations
  const abbreviationMap: { [key: string]: string } = {
    'S aureus': 'Staphylococcus aureus',
    'S pyogenes': 'Streptococcus pyogenes',
    'S pneumoniae': 'Streptococcus pneumoniae',
    'E coli': 'Escherichia coli',
    'E faecalis': 'Enterococcus faecalis',
    'E faecium': 'Enterococcus faecium',
    'H influenzae': 'Haemophilus influenzae',
    'P aeruginosa': 'Pseudomonas aeruginosa',
    'K kingae': 'Kingella kingae',
    'K pneumoniae': 'Klebsiella pneumoniae',
    'M catarrhalis': 'Moraxella catarrhalis',
    'N meningitidis': 'Neisseria meningitidis',
    'M pneumoniae': 'Mycoplasma pneumoniae',
    'C pneumoniae': 'Chlamydia pneumoniae',
    'L pneumophila': 'Legionella pneumophila',
    'GBS': 'Group B Streptococcus',
    'HSV': 'Herpes Simplex Virus'
  };

  const standardizedName = abbreviationMap[mainName] || mainName;

  return {
    originalText: pathogenText,
    name: standardizedName,
    shortName: mainName,
    details: details,
    gramStatus: gramStatus,
    type: pathogenType,
    pathogenType: pathogenType,
    spectrumCategory: spectrumCategory,
    isValid: true
  };
};

/**
 * Extract antibiotic names from therapy strings
 */
export const parseAntibiotics = (therapyText: string | null | undefined): ParsedAntibiotic[] => {
  if (!therapyText || typeof therapyText !== 'string') {
    return [];
  }

  let cleanText = therapyText.trim();

  // Remove non-drug instructions and context
  const instructionPatterns = [
    /Consider surgical drainage[^.]*\./i,
    /Drainage[^.]*\./i,
    /Choice depends on[^.]*\./i,
    /These are empiric[^.]*\./i,
    /if.*available\)/i,
    /some experts[^)]*\)/i
  ];

  instructionPatterns.forEach(pattern => {
    cleanText = cleanText.replace(pattern, '');
  });

  // Handle empty or non-specific guidance
  if (
    !cleanText.trim() ||
    /choice depends/i.test(cleanText) ||
    /guided by culture/i.test(cleanText)
  ) {
    return [];
  }

  const antibiotics: ParsedAntibiotic[] = [];

  // Split on combinations and alternatives
  const segments = cleanText.split(/\s+(?:PLUS|plus|\+|OR|or)\s+/i);

  segments.forEach(segment => {
    const antibiotic = parseAntibiotic(segment.trim());
    if (antibiotic) {
      antibiotics.push(antibiotic);
    }
  });

  return antibiotics;
};

/**
 * Parse individual antibiotic from text segment
 */
const parseAntibiotic = (text: string): ParsedAntibiotic | null => {
  if (!text || text.length < 2) return null;

  // Remove parenthetical information
  let cleanName = text.replace(/\([^)]*\)/g, '').trim();

  // Remove dosing information and routes
  cleanName = cleanName.replace(/\d+\s*(mg|g|units|mcg).*$/i, '');
  cleanName = cleanName.replace(/\b(IV|PO|IM|oral|intravenous|intramuscular)\b/gi, '');

  // Skip if it's not actually a drug name
  const nonDrugPatterns = [
    /^if\b/i,
    /^for\b/i,
    /^consider\b/i,
    /^add\b/i,
    /days?$/i,
    /weeks?$/i,
    /\d+\s*days?/i,
    /allergyb?:?/i,
    /standard/i,
    /treatment/i
  ];

  if (nonDrugPatterns.some(pattern => pattern.test(cleanName))) {
    return null;
  }

  // Standardize drug names
  const drugMap: { [key: string]: string } = {
    'Ampicillin-sulbactam': 'Ampicillin/sulbactam',
    'Ampicillin- sulbactam': 'Ampicillin/sulbactam',
    'Amoxicillin-clavulanate': 'Amoxicillin/clavulanate',
    'Amoxicillin- clavulanate': 'Amoxicillin/clavulanate',
    'Piperacillin-tazobactam': 'Piperacillin/tazobactam',
    'Piperacillin- tazobactam': 'Piperacillin/tazobactam',
    'TMP-SMX': 'Trimethoprim/sulfamethoxazole',
    'TMP/SMX': 'Trimethoprim/sulfamethoxazole'
  };

  const standardizedName = drugMap[cleanName] || cleanName;

  // Determine drug class
  const drugClass = getDrugClass(standardizedName);

  return {
    originalText: text,
    name: standardizedName,
    class: drugClass,
    isValid: true
  };
};

/**
 * Determine drug class based on antibiotic name
 */
const getDrugClass = (drugName: string): string => {
  const drugClasses: { [key: string]: string[] } = {
    Penicillins: [
      'Penicillin',
      'Ampicillin',
      'Amoxicillin',
      'Oxacillin',
      'Nafcillin',
      'Ampicillin/sulbactam',
      'Amoxicillin/clavulanate',
      'Piperacillin/tazobactam'
    ],
    Cephalosporins: [
      'Cefazolin',
      'Cephalexin',
      'Ceftriaxone',
      'Cefotaxime',
      'Ceftazidime',
      'Cefepime',
      'Cefdinir',
      'Cefpodoxime',
      'Cefuroxime',
      'Ceftaroline'
    ],
    Glycopeptides: ['Vancomycin'],
    Lincosamides: ['Clindamycin'],
    Oxazolidinones: ['Linezolid'],
    Lipopeptides: ['Daptomycin'],
    Macrolides: ['Azithromycin', 'Erythromycin'],
    Aminoglycosides: ['Gentamicin', 'Amikacin', 'Tobramycin'],
    Fluoroquinolones: ['Ciprofloxacin', 'Levofloxacin'],
    Tetracyclines: ['Doxycycline'],
    'Folate Antagonists': ['Trimethoprim/sulfamethoxazole'],
    Nitroimidazoles: ['Metronidazole'],
    Nitrofurans: ['Nitrofurantoin'],
    Antivirals: ['Acyclovir']
  };

  for (const [className, drugs] of Object.entries(drugClasses)) {
    if (drugs.some(drug => drugName.includes(drug) || drug.includes(drugName))) {
      return className;
    }
  }

  return 'Other';
};

// ============================================================================
// ANTIBIOTIC SPECTRUM DATA
// ============================================================================

/**
 * Enhanced antibiotic spectrum database with coverage scoring and visualization data
 */
export const antibioticSpectrumData: { [key: string]: AntibioticSpectrum } = {
  Penicillin: {
    class: 'Penicillins',
    subclass: 'Natural Penicillins',
    spectrum: {
      gramPositive: 9,
      gramNegative: 2,
      atypical: 1,
      anaerobes: 7
    },
    coverage: {
      typical: ['Streptococcus pyogenes', 'Streptococcus pneumoniae', 'Enterococcus faecalis'],
      limited: ['Staphylococcus aureus (MSSA only)'],
      resistant: ['MRSA', 'Most gram-negatives', 'Atypicals']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition',
    resistance: ['Beta-lactamase production', 'PBP mutations'],
    visualProperties: {
      color: '#3b82f6',
      position: { angle: 0, radius: 0.8 }
    }
  },
  Ampicillin: {
    class: 'Penicillins',
    subclass: 'Aminopenicillins',
    spectrum: {
      gramPositive: 8,
      gramNegative: 5,
      atypical: 1,
      anaerobes: 6
    },
    coverage: {
      typical: ['Enterococcus species', 'Listeria monocytogenes', 'Some E. coli'],
      limited: ['Streptococcus species', 'Haemophilus influenzae (if sensitive)'],
      resistant: ['MRSA', 'Most Enterobacterales', 'Pseudomonas']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition',
    resistance: ['Beta-lactamase production'],
    visualProperties: {
      color: '#3b82f6',
      position: { angle: 30, radius: 0.8 }
    }
  },
  Amoxicillin: {
    class: 'Penicillins',
    subclass: 'Aminopenicillins',
    spectrum: {
      gramPositive: 8,
      gramNegative: 5,
      atypical: 1,
      anaerobes: 6
    },
    coverage: {
      typical: ['Streptococcus pneumoniae', 'Enterococcus faecalis', 'Some E. coli'],
      limited: ['Haemophilus influenzae', 'Moraxella catarrhalis'],
      resistant: ['MRSA', 'Beta-lactamase producing organisms']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition',
    resistance: ['Beta-lactamase production'],
    visualProperties: {
      color: '#3b82f6',
      position: { angle: 45, radius: 0.8 }
    }
  },
  'Amoxicillin/clavulanate': {
    class: 'Penicillins',
    subclass: 'Beta-lactamase inhibitor combinations',
    spectrum: {
      gramPositive: 8,
      gramNegative: 7,
      atypical: 1,
      anaerobes: 8
    },
    coverage: {
      typical: ['MSSA', 'Streptococcus species', 'H. influenzae', 'M. catarrhalis', 'E. coli'],
      limited: ['Some Klebsiella species', 'Anaerobes'],
      resistant: ['MRSA', 'Pseudomonas', 'ESBL producers']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition + beta-lactamase inhibition',
    resistance: ['ESBL production', 'AmpC beta-lactamases'],
    visualProperties: {
      color: '#1e40af',
      position: { angle: 60, radius: 0.9 }
    }
  },
  'Piperacillin/tazobactam': {
    class: 'Penicillins',
    subclass: 'Antipseudomonal penicillins',
    spectrum: {
      gramPositive: 7,
      gramNegative: 9,
      atypical: 1,
      anaerobes: 9
    },
    coverage: {
      typical: ['Pseudomonas aeruginosa', 'Most Enterobacterales', 'MSSA', 'Streptococcus species'],
      limited: ['Some ESBL producers', 'Anaerobes'],
      resistant: ['MRSA', 'Enterococcus faecium', 'Carbapenem-resistant organisms']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition + beta-lactamase inhibition',
    resistance: ['Carbapenemases', 'AmpC hyperproduction'],
    visualProperties: {
      color: '#1e40af',
      position: { angle: 75, radius: 1.0 }
    }
  },
  Cefazolin: {
    class: 'Cephalosporins',
    subclass: '1st Generation',
    spectrum: {
      gramPositive: 9,
      gramNegative: 4,
      atypical: 0,
      anaerobes: 2
    },
    coverage: {
      typical: ['MSSA', 'Streptococcus species', 'Some E. coli', 'Proteus mirabilis'],
      limited: ['Klebsiella pneumoniae'],
      resistant: ['MRSA', 'Enterococcus', 'Pseudomonas', 'Anaerobes']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition',
    resistance: ['Beta-lactamase production', 'PBP mutations'],
    visualProperties: {
      color: '#10b981',
      position: { angle: 90, radius: 0.8 }
    }
  },
  Ceftriaxone: {
    class: 'Cephalosporins',
    subclass: '3rd Generation',
    spectrum: {
      gramPositive: 7,
      gramNegative: 8,
      atypical: 0,
      anaerobes: 1
    },
    coverage: {
      typical: ['Streptococcus pneumoniae', 'Most Enterobacterales', 'H. influenzae', 'N. meningitidis'],
      limited: ['Some MSSA', 'Moraxella catarrhalis'],
      resistant: ['MRSA', 'Enterococcus', 'Pseudomonas', 'ESBL producers']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition',
    resistance: ['ESBL production', 'AmpC beta-lactamases'],
    visualProperties: {
      color: '#059669',
      position: { angle: 120, radius: 0.9 }
    }
  },
  Cefepime: {
    class: 'Cephalosporins',
    subclass: '4th Generation',
    spectrum: {
      gramPositive: 7,
      gramNegative: 9,
      atypical: 0,
      anaerobes: 1
    },
    coverage: {
      typical: ['Pseudomonas aeruginosa', 'Most Enterobacterales', 'Streptococcus pneumoniae'],
      limited: ['Some ESBL producers', 'MSSA'],
      resistant: ['MRSA', 'Enterococcus', 'Carbapenem-resistant organisms']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition',
    resistance: ['Carbapenemases', 'AmpC hyperproduction'],
    visualProperties: {
      color: '#047857',
      position: { angle: 135, radius: 1.0 }
    }
  },
  Vancomycin: {
    class: 'Glycopeptides',
    subclass: 'Glycopeptides',
    spectrum: {
      gramPositive: 10,
      gramNegative: 0,
      atypical: 0,
      anaerobes: 8
    },
    coverage: {
      typical: [
        'MRSA',
        'MSSA',
        'Enterococcus faecalis',
        'CoNS',
        'C. difficile (oral)'
      ],
      limited: ['Streptococcus species'],
      resistant: ['Gram-negatives', 'VRE', 'Some atypicals']
    },
    mechanismOfAction:
      'Cell wall synthesis inhibition (different target than beta-lactams)',
    resistance: ['van gene cluster', 'Thick cell wall (hetero-resistance)'],
    visualProperties: {
      color: '#7c3aed',
      position: { angle: 150, radius: 0.9 }
    }
  },
  Clindamycin: {
    class: 'Lincosamides',
    subclass: 'Lincosamides',
    spectrum: {
      gramPositive: 8,
      gramNegative: 1,
      atypical: 2,
      anaerobes: 9
    },
    coverage: {
      typical: ['MSSA', 'Streptococcus species', 'Anaerobes (most)'],
      limited: ['Some MRSA (if D-test negative)', 'Some atypicals'],
      resistant: ['Gram-negatives', 'Enterococcus', 'C. difficile']
    },
    mechanismOfAction: 'Protein synthesis inhibition (50S ribosomal subunit)',
    resistance: ['erm genes (inducible)', 'lincosamide resistance'],
    visualProperties: {
      color: '#dc2626',
      position: { angle: 180, radius: 0.8 }
    }
  },
  Azithromycin: {
    class: 'Macrolides',
    subclass: 'Azalides',
    spectrum: {
      gramPositive: 6,
      gramNegative: 3,
      atypical: 9,
      anaerobes: 4
    },
    coverage: {
      typical: ['Streptococcus pyogenes', 'Some Streptococcus pneumoniae', 'H. influenzae'],
      atypical: [
        'Mycoplasma pneumoniae',
        'Chlamydia species',
        'Legionella pneumophila'
      ],
      resistant: ['MRSA', 'Most Enterobacterales', 'Pseudomonas']
    },
    mechanismOfAction: 'Protein synthesis inhibition (50S ribosomal subunit)',
    resistance: ['erm genes', 'efflux pumps'],
    visualProperties: {
      color: '#f59e0b',
      position: { angle: 210, radius: 0.8 }
    }
  },
  Ciprofloxacin: {
    class: 'Fluoroquinolones',
    subclass: 'Fluoroquinolones',
    spectrum: {
      gramPositive: 5,
      gramNegative: 9,
      atypical: 7,
      anaerobes: 2
    },
    coverage: {
      typical: [
        'Pseudomonas aeruginosa',
        'Most Enterobacterales',
        'Some Streptococcus species'
      ],
      atypical: ['Some Mycoplasma', 'Some Chlamydia'],
      resistant: [
        'MRSA',
        'Streptococcus pneumoniae',
        'Anaerobes'
      ]
    },
    mechanismOfAction:
      'DNA synthesis inhibition (DNA gyrase, topoisomerase IV)',
    resistance: ['gyr/par mutations', 'efflux pumps', 'qnr genes'],
    visualProperties: {
      color: '#8b5cf6',
      position: { angle: 240, radius: 0.9 }
    }
  },
  Levofloxacin: {
    class: 'Fluoroquinolones',
    subclass: 'Respiratory Fluoroquinolones',
    spectrum: {
      gramPositive: 7,
      gramNegative: 8,
      atypical: 8,
      anaerobes: 3
    },
    coverage: {
      typical: [
        'Streptococcus pneumoniae',
        'Most Enterobacterales',
        'Some Pseudomonas'
      ],
      atypical: [
        'Mycoplasma pneumoniae',
        'Chlamydia species',
        'Legionella pneumophila'
      ],
      resistant: ['MRSA (variable)', 'Anaerobes']
    },
    mechanismOfAction:
      'DNA synthesis inhibition (DNA gyrase, topoisomerase IV)',
    resistance: ['gyr/par mutations', 'efflux pumps'],
    visualProperties: {
      color: '#7c3aed',
      position: { angle: 255, radius: 0.9 }
    }
  },
  Gentamicin: {
    class: 'Aminoglycosides',
    subclass: 'Aminoglycosides',
    spectrum: {
      gramPositive: 6,
      gramNegative: 9,
      atypical: 0,
      anaerobes: 0
    },
    coverage: {
      typical: [
        'Most Gram-negatives',
        'MSSA',
        'Streptococcus species',
        'Enterococcus (synergistic with beta-lactams)'
      ],
      limited: ['Some atypicals'],
      resistant: ['Anaerobes', 'MRSA']
    },
    mechanismOfAction: 'Protein synthesis inhibition (30S ribosomal subunit)',
    resistance: ['Aminoglycoside-modifying enzymes', 'Ribosomal mutations'],
    visualProperties: {
      color: '#ef4444',
      position: { angle: 270, radius: 0.8 }
    }
  },
  Doxycycline: {
    class: 'Tetracyclines',
    subclass: 'Tetracyclines',
    spectrum: {
      gramPositive: 6,
      gramNegative: 6,
      atypical: 8,
      anaerobes: 4
    },
    coverage: {
      typical: ['MSSA', 'Streptococcus species', 'H. influenzae'],
      atypical: ['Mycoplasma', 'Chlamydia', 'Legionella', 'Rickettsia'],
      resistant: ['Most Enterobacterales', 'Pseudomonas', 'Anaerobes']
    },
    mechanismOfAction: 'Protein synthesis inhibition (30S ribosomal subunit)',
    resistance: ['tet genes', 'ribosomal protection'],
    visualProperties: {
      color: '#059669',
      position: { angle: 300, radius: 0.8 }
    }
  },
  'Trimethoprim/sulfamethoxazole': {
    class: 'Folate Antagonists',
    subclass: 'Folate Antagonists',
    spectrum: {
      gramPositive: 5,
      gramNegative: 7,
      atypical: 2,
      anaerobes: 2
    },
    coverage: {
      typical: [
        'MSSA',
        'Some Gram-negatives',
        'Pneumocystis jirovecii'
      ],
      limited: ['Streptococcus species', 'Some atypicals'],
      resistant: [
        'MRSA',
        'Many Gram-negatives',
        'Anaerobes'
      ]
    },
    mechanismOfAction:
      'Folate metabolism inhibition (DHFR and DHPS)',
    resistance: ['dhfr/dhps mutations'],
    visualProperties: {
      color: '#0d9488',
      position: { angle: 330, radius: 0.8 }
    }
  },
  Linezolid: {
    class: 'Oxazolidinones',
    subclass: 'Oxazolidinones',
    spectrum: {
      gramPositive: 9,
      gramNegative: 0,
      atypical: 0,
      anaerobes: 3
    },
    coverage: {
      typical: [
        'MRSA',
        'VRE',
        'MSSA',
        'Streptococcus species',
        'Some anaerobes'
      ],
      limited: [],
      resistant: ['Gram-negatives except some', 'Pseudomonas']
    },
    mechanismOfAction: 'Protein synthesis inhibition (50S ribosomal subunit)',
    resistance: ['cfr gene', 'Ribosomal mutations'],
    visualProperties: {
      color: '#be185d',
      position: { angle: 20, radius: 1.0 }
    }
  },
  Metronidazole: {
    class: 'Nitroimidazoles',
    subclass: 'Nitroimidazoles',
    spectrum: {
      gramPositive: 0,
      gramNegative: 0,
      atypical: 0,
      anaerobes: 10
    },
    coverage: {
      typical: ['Most anaerobes', 'Protozoans'],
      limited: [],
      resistant: ['Aerobic bacteria', 'Gram-positives']
    },
    mechanismOfAction:
      'DNA damage (anaerobic environment required)',
    resistance: ['Altered redox enzymes'],
    visualProperties: {
      color: '#7c2d12',
      position: { angle: 40, radius: 0.9 }
    }
  }
};

// ============================================================================
// SPECTRUM ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate spectrum score for an antibiotic against a pathogen category
 */
export const calculateSpectrumScore = (
  antibiotic: string,
  pathogenCategory: PathogenCategory
): number => {
  const data = antibioticSpectrumData[antibiotic];
  if (!data) return 0;

  switch (pathogenCategory) {
    case 'positive':
      return data.spectrum.gramPositive;
    case 'negative':
      return data.spectrum.gramNegative;
    case 'atypical':
      return data.spectrum.atypical;
    case 'anaerobes':
      return data.spectrum.anaerobes;
    default:
      return 0;
  }
};

/**
 * Get antibiotics by spectrum category
 */
export const getAntibioticsBySpectrum = (
  pathogenCategory: PathogenCategory,
  minScore: number = 5
): Array<AntibioticSpectrum & { name: string; score: number }> => {
  return Object.entries(antibioticSpectrumData)
    .filter(([name]) => calculateSpectrumScore(name, pathogenCategory) >= minScore)
    .map(([name, data]) => ({
      name,
      score: calculateSpectrumScore(name, pathogenCategory),
      ...data
    }))
    .sort((a, b) => b.score - a.score);
};

/**
 * Calculate spectrum overlap between two antibiotics
 */
export const getSpectrumOverlap = (antibiotic1: string, antibiotic2: string): number => {
  const findAntibioticData = (name: string | null | undefined): AntibioticSpectrum | null => {
    if (!name || typeof name !== 'string') return null;

    if (antibioticSpectrumData[name]) return antibioticSpectrumData[name];

    const capitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if (antibioticSpectrumData[capitalized]) return antibioticSpectrumData[capitalized];

    const lowercase = name.toLowerCase();
    const match = Object.keys(antibioticSpectrumData).find(
      key => key.toLowerCase() === lowercase
    );
    return match ? antibioticSpectrumData[match] : null;
  };

  const data1 = findAntibioticData(antibiotic1);
  const data2 = findAntibioticData(antibiotic2);

  if (!data1 || !data2) return 0;

  const categories: PathogenCategory[] = ['gramPositive', 'gramNegative', 'atypical', 'anaerobes'];
  let totalOverlap = 0;

  categories.forEach(category => {
    const val1 = (data1.spectrum as Record<string, number>)[category];
    const val2 = (data2.spectrum as Record<string, number>)[category];

    if (antibiotic1 === antibiotic2) {
      totalOverlap += 1;
    } else {
      const min = Math.min(val1, val2);
      const max = Math.max(val1, val2);
      totalOverlap += max > 0 ? min / max : 0;
    }
  });

  return totalOverlap / categories.length;
};

// ============================================================================
// VISUALIZATION AND REFERENCE DATA
// ============================================================================

/**
 * Drug class color mapping for visualizations
 */
export const drugClassColors: DrugClassColors = {
  Penicillins: '#3b82f6',
  Cephalosporins: '#10b981',
  Glycopeptides: '#7c3aed',
  Lincosamides: '#dc2626',
  Macrolides: '#f59e0b',
  Fluoroquinolones: '#8b5cf6',
  Aminoglycosides: '#ef4444',
  Oxazolidinones: '#be185d',
  Lipopeptides: '#991b1b',
  Tetracyclines: '#059669',
  'Folate Antagonists': '#0d9488',
  Nitroimidazoles: '#7c2d12',
  Nitrofurans: '#a21caf',
  Antivirals: '#1e40af'
};

/**
 * Neo4j Graph Database Schema
 */
export const neo4jSchema: Neo4jSchema = {
  nodeTypes: {
    PATHOGEN: {
      properties: ['id', 'name', 'gramStatus', 'type', 'spectrumCategory'],
      indexes: ['name', 'gramStatus', 'type']
    },
    ANTIBIOTIC: {
      properties: ['id', 'name', 'class', 'subclass', 'mechanismOfAction'],
      indexes: ['name', 'class']
    },
    CONDITION: {
      properties: ['id', 'name', 'category', 'severity'],
      indexes: ['name']
    },
    DRUG_CLASS: {
      properties: ['id', 'name', 'mechanismOfAction'],
      indexes: ['name']
    }
  },
  relationshipTypes: {
    TREATS: {
      properties: ['efficacy', 'dosing', 'resistance']
    },
    CAUSES: {
      properties: ['frequency', 'severity']
    },
    BELONGS_TO: {
      properties: []
    },
    SYNERGISTIC_WITH: {
      properties: ['synergy_score']
    },
    RESISTANT_TO: {
      properties: ['resistance_level']
    },
    ALTERNATIVE_TO: {
      properties: ['similarity_score']
    }
  }
};

/**
 * Process medical conditions data into structured pathogen/antibiotic lists
 */
export const processConditionsData = (
  conditions: MedicalCondition[]
): ProcessedConditionsResult => {
  if (!conditions || !Array.isArray(conditions)) {
    return {
      pathogens: [],
      antibiotics: [],
      totalPathogens: 0,
      totalAntibiotics: 0,
      conditions: [],
      relationships: []
    };
  }

  const pathogens = new Map<string, PathogenData>();
  const antibiotics = new Map<string, AntibioticData>();
  const conditionMap = new Map<string | number, MedicalCondition>();
  const relationships: Relationship[] = [];

  conditions.forEach(condition => {
    conditionMap.set(condition.id, condition);

    // Process pathogens
    if (condition.commonPathogens && Array.isArray(condition.commonPathogens)) {
      condition.commonPathogens.forEach(pathogenText => {
        const pathogen = parsePathogen(pathogenText);
        if (pathogen && pathogen.isValid) {
          if (!pathogens.has(pathogen.name)) {
            pathogens.set(pathogen.name, {
              ...pathogen,
              conditions: new Set(),
              count: 0
            });
          }

          const pathogenData = pathogens.get(pathogen.name)!;
          pathogenData.conditions.add(String(condition.id));
          pathogenData.count++;

          relationships.push({
            type: 'PATHOGEN_CAUSES',
            from: pathogen.name,
            to: condition.name,
            properties: {
              frequency: 'common'
            }
          });
        }
      });
    }

    // Process antibiotics from empiric therapy
    if (condition.empiricTherapy) {
      const therapyValues =
        typeof condition.empiricTherapy === 'object'
          ? Object.values(condition.empiricTherapy)
          : [condition.empiricTherapy];

      therapyValues.forEach(therapyText => {
        if (typeof therapyText === 'string') {
          const antibioticsList = parseAntibiotics(therapyText);
          antibioticsList.forEach(antibiotic => {
            if (antibiotic && antibiotic.isValid) {
              if (!antibiotics.has(antibiotic.name)) {
                antibiotics.set(antibiotic.name, {
                  ...antibiotic,
                  conditions: new Set(),
                  therapyContexts: new Set(),
                  count: 0
                });
              }

              const antibioticData = antibiotics.get(antibiotic.name)!;
              antibioticData.conditions.add(String(condition.id));
              antibioticData.therapyContexts.add(`${condition.name}: ${therapyText}`);
              antibioticData.count++;

              relationships.push({
                type: 'ANTIBIOTIC_TREATS',
                from: antibiotic.name,
                to: condition.name,
                properties: {
                  context: therapyText
                }
              });
            }
          });
        }
      });
    }
  });

  // Convert Sets to Arrays for serialization
  const pathogenArray = Array.from(pathogens.values()).map(p => ({
    ...p,
    conditions: Array.from(p.conditions),
    therapyContexts: undefined
  }));

  const antibioticArray = Array.from(antibiotics.values()).map(a => ({
    ...a,
    conditions: Array.from(a.conditions),
    therapyContexts: Array.from(a.therapyContexts)
  }));

  return {
    pathogens: pathogenArray,
    antibiotics: antibioticArray,
    totalPathogens: pathogenArray.length,
    totalAntibiotics: antibioticArray.length,
    conditions: Array.from(conditionMap.values()),
    relationships: relationships
  };
};

/**
 * Visualization documentation
 */
export const VISUALIZATION_DOCUMENTATION: VisualizationDoc = {
  overview:
    'Data parser utilities for antibiotic and pathogen relationship analysis'
};

// ============================================================================
// NEO4J FORMAT TRANSFORMATION
// ============================================================================

/**
 * Node for Neo4j database
 */
interface Neo4jNode {
  type: string;
  id: string;
  properties: { [key: string]: unknown };
}

/**
 * Relationship for Neo4j database
 */
interface Neo4jRelationship {
  type: string;
  from: string;
  to: string;
  properties: { [key: string]: unknown };
}

/**
 * Neo4j format result
 */
interface Neo4jFormatResult {
  nodes: Neo4jNode[];
  relationships: Neo4jRelationship[];
}

/**
 * Transform medical conditions to Neo4j format
 */
export const transformToNeo4jFormat = (medicalConditions: MedicalCondition[] | null | undefined): Neo4jFormatResult => {
  if (!medicalConditions || !Array.isArray(medicalConditions)) {
    return { nodes: [], relationships: [] };
  }

  const nodes: Neo4jNode[] = [];
  const relationships: Neo4jRelationship[] = [];

  // Track unique entities
  const pathogenSet = new Set<string>();
  const antibioticSet = new Set<string>();
  const conditionSet = new Set<string | number>();
  const drugClassSet = new Set<string>();

  medicalConditions.forEach(condition => {
    // Create condition node
    const conditionNode: Neo4jNode = {
      type: 'CONDITION',
      id: String(condition.id),
      properties: {
        name: condition.name,
        category: condition.category || 'unknown',
        description: condition.description || '',
        severity: condition.severity || 'unknown'
      }
    };

    if (!conditionSet.has(condition.id)) {
      nodes.push(conditionNode);
      conditionSet.add(condition.id);
    }

    // Process pathogens
    if (condition.commonPathogens && Array.isArray(condition.commonPathogens)) {
      condition.commonPathogens.forEach(pathogenText => {
        const pathogen = parsePathogen(pathogenText);
        if (pathogen && pathogen.isValid) {
          const pathogenId = pathogen.name.toLowerCase().replace(/\s+/g, '_');

          // Create pathogen node
          if (!pathogenSet.has(pathogenId)) {
            const pathogenNode: Neo4jNode = {
              type: 'PATHOGEN',
              id: pathogenId,
              properties: {
                name: pathogen.name,
                gramStatus: pathogen.gramStatus,
                type: pathogen.type,
                spectrumCategory: pathogen.spectrumCategory
              }
            };
            nodes.push(pathogenNode);
            pathogenSet.add(pathogenId);
          }

          // Create CAUSES relationship
          relationships.push({
            type: 'CAUSES',
            from: pathogenId,
            to: String(condition.id),
            properties: {
              frequency: 'common',
              severity: condition.severity || 'moderate'
            }
          });
        }
      });
    }

    // Process empiric therapy antibiotics
    if (condition.empiricTherapy && typeof condition.empiricTherapy === 'object') {
      Object.entries(condition.empiricTherapy).forEach(([context, therapy]) => {
        if (typeof therapy === 'string') {
          const antibiotics = parseAntibiotics(therapy);
          antibiotics.forEach(antibiotic => {
            if (antibiotic && antibiotic.isValid) {
              const antibioticId = antibiotic.name
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/\//g, '_');

              // Create antibiotic node
              if (!antibioticSet.has(antibioticId)) {
                const antibioticNode: Neo4jNode = {
                  type: 'ANTIBIOTIC',
                  id: antibioticId,
                  properties: {
                    name: antibiotic.name,
                    class: antibiotic.class,
                    mechanismOfAction:
                      antibioticSpectrumData[antibiotic.name]?.mechanismOfAction || 'unknown'
                  }
                };
                nodes.push(antibioticNode);
                antibioticSet.add(antibioticId);

                // Create drug class node and relationship
                const drugClassId = antibiotic.class.toLowerCase().replace(/\s+/g, '_');
                if (!drugClassSet.has(drugClassId)) {
                  const drugClassNode: Neo4jNode = {
                    type: 'DRUG_CLASS',
                    id: drugClassId,
                    properties: {
                      name: antibiotic.class,
                      mechanism:
                        antibioticSpectrumData[antibiotic.name]?.mechanismOfAction ||
                        'unknown'
                    }
                  };
                  nodes.push(drugClassNode);
                  drugClassSet.add(drugClassId);
                }

                // Create BELONGS_TO relationship
                relationships.push({
                  type: 'BELONGS_TO',
                  from: antibioticId,
                  to: drugClassId,
                  properties: {}
                });
              }

              // Create treatment relationships with pathogens
              if (
                condition.commonPathogens &&
                Array.isArray(condition.commonPathogens)
              ) {
                condition.commonPathogens.forEach(pathogenText => {
                  const pathogen = parsePathogen(pathogenText);
                  if (pathogen && pathogen.isValid) {
                    const pathogenId = pathogen.name
                      .toLowerCase()
                      .replace(/\s+/g, '_');

                    relationships.push({
                      type: 'TREATS',
                      from: antibioticId,
                      to: pathogenId,
                      properties: {
                        effectiveness: calculateTreatmentEffectiveness(antibiotic, pathogen),
                        clinical_evidence: context,
                        resistance_risk: calculateResistanceRisk(antibiotic, pathogen)
                      }
                    });
                  }
                });
              }
            }
          });
        }
      });
    }
  });

  return { nodes, relationships };
};

/**
 * Calculate treatment effectiveness based on spectrum data
 */
const calculateTreatmentEffectiveness = (
  antibiotic: ParsedAntibiotic,
  pathogen: ParsedPathogen
): number => {
  const spectrumData = antibioticSpectrumData[antibiotic.name];
  if (!spectrumData) return 5;

  switch (pathogen.gramStatus) {
    case 'positive':
      return spectrumData.spectrum.gramPositive;
    case 'negative':
      return spectrumData.spectrum.gramNegative;
    case 'atypical':
      return spectrumData.spectrum.atypical;
    default:
      return 5;
  }
};

/**
 * Calculate resistance risk
 */
const calculateResistanceRisk = (
  antibiotic: ParsedAntibiotic,
  pathogen: ParsedPathogen
): string => {
  const spectrumData = antibioticSpectrumData[antibiotic.name];
  if (!spectrumData || !spectrumData.resistance) return 'moderate';

  const riskFactors = spectrumData.resistance.length;
  if (riskFactors <= 1) return 'low';
  if (riskFactors <= 3) return 'moderate';
  return 'high';
};

/**
 * Generate Cypher queries for Neo4j
 */
export const generateCypherQueries = (neo4jData: Neo4jFormatResult): string[] => {
  const queries: string[] = [];

  // Create nodes
  neo4jData.nodes.forEach(node => {
    const props = Object.entries(node.properties)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ');
    queries.push(
      `CREATE (n:${node.type} {id: "${node.id}", ${props}})`
    );
  });

  // Create relationships
  neo4jData.relationships.forEach(rel => {
    const props = Object.entries(rel.properties)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ');
    queries.push(
      `MATCH (from {id: "${rel.from}"}), (to {id: "${rel.to}"}) CREATE (from)-[:${rel.type} {${props}}]->(to)`
    );
  });

  return queries;
};

/**
 * Advanced graph queries for analysis
 */
export const advancedGraphQueries: { [key: string]: string } = {
  pathogensByDrugClass:
    'MATCH (dc:DRUG_CLASS)<-[:BELONGS_TO]-(a:ANTIBIOTIC)-[:TREATS]->(p:PATHOGEN) RETURN dc.name, collect(DISTINCT p.name) as pathogens',
  antibioticsByPathogen:
    'MATCH (p:PATHOGEN)<-[:TREATS]-(a:ANTIBIOTIC) RETURN p.name, collect(DISTINCT a.name) as antibiotics',
  treatmentAlternatives:
    'MATCH (c:CONDITION)<-[:CAUSES]-(p:PATHOGEN)<-[:TREATS]-(a:ANTIBIOTIC) RETURN c.name, p.name, a.name'
};

/**
 * Generate complete Neo4j dataset
 */
export const generateNeo4jDataset = (medicalConditions: MedicalCondition[]): Neo4jFormatResult => {
  return transformToNeo4jFormat(medicalConditions);
};
