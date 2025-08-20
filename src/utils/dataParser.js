/**
 * Advanced Data Parser
 * Extracts and normalizes pathogen and antibiotic information from medical conditions data
 * Handles complex text patterns and creates standardized lists for multi-dimensional exploration
 */

/**
 * Extract and normalize pathogen names from commonPathogens arrays
 * @param {string} pathogenText - Raw pathogen text from data
 * @returns {Object} - Normalized pathogen info with metadata
 */
export const parsePathogen = (pathogenText) => {
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
  let gramStatus = 'unknown';
  let pathogenType = 'bacteria';
  let spectrumCategory = 'typical'; // New: typical, atypical, mixed
  
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
  
  // Enhanced atypical organism patterns
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
    gramStatus = 'atypical'; // Special category for atypical organisms
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
    gramStatus = 'acid-fast'; // Special classification for mycobacteria
  } else if (atypicalPatterns.some(pattern => pattern.test(mainName))) {
    pathogenType = 'atypical bacteria';
  }
  
  // Standardize common abbreviations
  const abbreviationMap = {
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
    spectrumCategory: spectrumCategory, // New field for visualization grouping
    isValid: true
  };
};;

/**
 * Extract antibiotic names from therapy strings
 * @param {string} therapyText - Raw therapy text from empiricTherapy
 * @returns {Array} - Array of antibiotic objects with metadata
 */
export const parseAntibiotics = (therapyText) => {
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
  if (!cleanText.trim() || 
      /choice depends/i.test(cleanText) || 
      /guided by culture/i.test(cleanText)) {
    return [];
  }
  
  const antibiotics = [];
  
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
 * @param {string} text - Text segment containing antibiotic name
 * @returns {Object|null} - Antibiotic object or null if invalid
 */
const parseAntibiotic = (text) => {
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
  const drugMap = {
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
 * @param {string} drugName - Standardized drug name
 * @returns {string} - Drug class
 */
const getDrugClass = (drugName) => {
  const drugClasses = {
    'Penicillins': [
      'Penicillin', 'Ampicillin', 'Amoxicillin', 'Oxacillin', 'Nafcillin',
      'Ampicillin/sulbactam', 'Amoxicillin/clavulanate', 'Piperacillin/tazobactam'
    ],
    'Cephalosporins': [
      'Cefazolin', 'Cephalexin', 'Ceftriaxone', 'Cefotaxime', 'Ceftazidime', 
      'Cefepime', 'Cefdinir', 'Cefpodoxime', 'Cefuroxime', 'Ceftaroline'
    ],
    'Glycopeptides': ['Vancomycin'],
    'Lincosamides': ['Clindamycin'],
    'Oxazolidinones': ['Linezolid'],
    'Lipopeptides': ['Daptomycin'],
    'Macrolides': ['Azithromycin', 'Erythromycin'],
    'Aminoglycosides': ['Gentamicin', 'Amikacin', 'Tobramycin'],
    'Fluoroquinolones': ['Ciprofloxacin', 'Levofloxacin'],
    'Tetracyclines': ['Doxycycline'],
    'Folate Antagonists': ['Trimethoprim/sulfamethoxazole'],
    'Nitroimidazoles': ['Metronidazole'],
    'Nitrofurans': ['Nitrofurantoin'],
    'Antivirals': ['Acyclovir']
  };
  
  for (const [className, drugs] of Object.entries(drugClasses)) {
    if (drugs.some(drug => drugName.includes(drug) || drug.includes(drugName))) {
      return className;
    }
  }
  
  return 'Other';
};

// Enhanced antibiotic spectrum database with coverage scoring and visualization data
export const antibioticSpectrumData = {
  // Penicillins
  'Penicillin': {
    class: 'Penicillins',
    subclass: 'Natural Penicillins',
    spectrum: {
      gramPositive: 9, // Score 0-10
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
  
  'Ampicillin': {
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

  'Amoxicillin': {
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

  // Cephalosporins
  'Cefazolin': {
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

  'Ceftriaxone': {
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

  'Cefepime': {
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

  // Glycopeptides
  'Vancomycin': {
    class: 'Glycopeptides',
    subclass: 'Glycopeptides',
    spectrum: {
      gramPositive: 10,
      gramNegative: 0,
      atypical: 0,
      anaerobes: 8
    },
    coverage: {
      typical: ['MRSA', 'MSSA', 'Enterococcus faecalis', 'CoNS', 'C. difficile (oral)'],
      limited: ['Streptococcus species'],
      resistant: ['Gram-negatives', 'VRE', 'Some atypicals']
    },
    mechanismOfAction: 'Cell wall synthesis inhibition (different target than beta-lactams)',
    resistance: ['van gene cluster', 'Thick cell wall (hetero-resistance)'],
    visualProperties: {
      color: '#7c3aed',
      position: { angle: 150, radius: 0.9 }
    }
  },

  // Lincosamides
  'Clindamycin': {
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

  // Macrolides
  'Azithromycin': {
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
      atypical: ['Mycoplasma pneumoniae', 'Chlamydia species', 'Legionella pneumophila'],
      resistant: ['MRSA', 'Most Enterobacterales', 'Pseudomonas']
    },
    mechanismOfAction: 'Protein synthesis inhibition (50S ribosomal subunit)',
    resistance: ['erm genes', 'efflux pumps'],
    visualProperties: {
      color: '#f59e0b',
      position: { angle: 210, radius: 0.8 }
    }
  },

  // Fluoroquinolones
  'Ciprofloxacin': {
    class: 'Fluoroquinolones',
    subclass: 'Fluoroquinolones',
    spectrum: {
      gramPositive: 5,
      gramNegative: 9,
      atypical: 7,
      anaerobes: 2
    },
    coverage: {
      typical: ['Pseudomonas aeruginosa', 'Most Enterobacterales', 'Some Streptococcus species'],
      atypical: ['Some Mycoplasma', 'Some Chlamydia'],
      resistant: ['MRSA', 'Streptococcus pneumoniae', 'Anaerobes']
    },
    mechanismOfAction: 'DNA synthesis inhibition (DNA gyrase, topoisomerase IV)',
    resistance: ['gyr/par mutations', 'efflux pumps', 'qnr genes'],
    visualProperties: {
      color: '#8b5cf6',
      position: { angle: 240, radius: 0.9 }
    }
  },

  'Levofloxacin': {
    class: 'Fluoroquinolones',
    subclass: 'Respiratory Fluoroquinolones',
    spectrum: {
      gramPositive: 7,
      gramNegative: 8,
      atypical: 8,
      anaerobes: 3
    },
    coverage: {
      typical: ['Streptococcus pneumoniae', 'Most Enterobacterales', 'Some Pseudomonas'],
      atypical: ['Mycoplasma pneumoniae', 'Chlamydia species', 'Legionella pneumophila'],
      resistant: ['MRSA (variable)', 'Anaerobes']
    },
    mechanismOfAction: 'DNA synthesis inhibition (DNA gyrase, topoisomerase IV)',
    resistance: ['gyr/par mutations', 'efflux pumps'],
    visualProperties: {
      color: '#7c3aed',
      position: { angle: 255, radius: 0.9 }
    }
  },

  // Aminoglycosides
  'Gentamicin': {
    class: 'Aminoglycosides',
    subclass: 'Aminoglycosides',
    spectrum: {
      gramPositive: 6,
      gramNegative: 8,
      atypical: 0,
      anaerobes: 0
    },
    coverage: {
      typical: ['Most Enterobacterales', 'Pseudomonas aeruginosa', 'Staphylococcus species (synergy)'],
      limited: ['Enterococcus (synergy only)'],
      resistant: ['Streptococcus', 'Anaerobes', 'Atypicals']
    },
    mechanismOfAction: 'Protein synthesis inhibition (30S ribosomal subunit)',
    resistance: ['Aminoglycoside-modifying enzymes', '16S rRNA methylases'],
    visualProperties: {
      color: '#ef4444',
      position: { angle: 270, radius: 0.7 }
    }
  },

  // Oxazolidinones
  'Linezolid': {
    class: 'Oxazolidinones',
    subclass: 'Oxazolidinones',
    spectrum: {
      gramPositive: 10,
      gramNegative: 0,
      atypical: 2,
      anaerobes: 7
    },
    coverage: {
      typical: ['MRSA', 'VRE', 'All Streptococcus species', 'CoNS'],
      limited: ['Some anaerobes'],
      resistant: ['Gram-negatives', 'Most atypicals']
    },
    mechanismOfAction: 'Protein synthesis inhibition (50S ribosomal subunit, unique binding site)',
    resistance: ['cfr gene', '23S rRNA mutations'],
    visualProperties: {
      color: '#be185d',
      position: { angle: 300, radius: 0.8 }
    }
  },

  // Lipopeptides
  'Daptomycin': {
    class: 'Lipopeptides',
    subclass: 'Lipopeptides',
    spectrum: {
      gramPositive: 10,
      gramNegative: 0,
      atypical: 0,
      anaerobes: 8
    },
    coverage: {
      typical: ['MRSA', 'VRE', 'All Staphylococcus species', 'Most Streptococcus species'],
      limited: ['Enterococcus species'],
      resistant: ['Gram-negatives', 'Atypicals', 'Pneumonia (inactivated by surfactant)']
    },
    mechanismOfAction: 'Cell membrane depolarization',
    resistance: ['Cell membrane changes', 'mprF mutations'],
    visualProperties: {
      color: '#991b1b',
      position: { angle: 330, radius: 0.8 }
    }
  }
};

// Spectrum scoring utilities
export const calculateSpectrumScore = (antibiotic, pathogenCategory) => {
  const data = antibioticSpectrumData[antibiotic];
  if (!data) return 0;
  
  switch (pathogenCategory) {
    case 'positive': return data.spectrum.gramPositive;
    case 'negative': return data.spectrum.gramNegative;
    case 'atypical': return data.spectrum.atypical;
    case 'anaerobes': return data.spectrum.anaerobes;
    default: return 0;
  }
};

export const getAntibioticsBySpectrum = (pathogenCategory, minScore = 5) => {
  return Object.entries(antibioticSpectrumData)
    .filter(([name, data]) => calculateSpectrumScore(name, pathogenCategory) >= minScore)
    .map(([name, data]) => ({
      name,
      score: calculateSpectrumScore(name, pathogenCategory),
      class: data.class,
      ...data
    }))
    .sort((a, b) => b.score - a.score);
};

export const getSpectrumOverlap = (antibiotic1, antibiotic2) => {
  const data1 = antibioticSpectrumData[antibiotic1];
  const data2 = antibioticSpectrumData[antibiotic2];
  
  if (!data1 || !data2) return 0;
  
  const categories = ['gramPositive', 'gramNegative', 'atypical', 'anaerobes'];
  let totalOverlap = 0;
  
  categories.forEach(category => {
    const min = Math.min(data1.spectrum[category], data2.spectrum[category]);
    const max = Math.max(data1.spectrum[category], data2.spectrum[category]);
    totalOverlap += max > 0 ? min / max : 0;
  });
  
  return totalOverlap / categories.length;
};

// Drug class color mapping for visualizations
export const drugClassColors = {
  'Penicillins': '#3b82f6',
  'Cephalosporins': '#10b981',
  'Glycopeptides': '#7c3aed',
  'Lincosamides': '#dc2626',
  'Macrolides': '#f59e0b',
  'Fluoroquinolones': '#8b5cf6',
  'Aminoglycosides': '#ef4444',
  'Oxazolidinones': '#be185d',
  'Lipopeptides': '#991b1b',
  'Tetracyclines': '#059669',
  'Folate Antagonists': '#0d9488',
  'Nitroimidazoles': '#7c2d12',
  'Nitrofurans': '#a21caf',
  'Antivirals': '#1e40af'
};
// Neo4j Graph Database Schema and Data Transformation Utilities

// Neo4j Schema Design
export const neo4jSchema = {
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
      indexes: ['name', 'category']
    },
    DRUG_CLASS: {
      properties: ['id', 'name', 'mechanism', 'spectrumType'],
      indexes: ['name']
    }
  },
  
  relationshipTypes: {
    TREATS: {
      from: 'ANTIBIOTIC',
      to: 'PATHOGEN',
      properties: ['effectiveness', 'resistance_risk', 'clinical_evidence']
    },
    CAUSES: {
      from: 'PATHOGEN',
      to: 'CONDITION',
      properties: ['frequency', 'severity', 'typical_presentation']
    },
    BELONGS_TO: {
      from: 'ANTIBIOTIC',
      to: 'DRUG_CLASS',
      properties: []
    },
    SYNERGISTIC_WITH: {
      from: 'ANTIBIOTIC',
      to: 'ANTIBIOTIC',
      properties: ['synergy_score', 'mechanism']
    },
    RESISTANT_TO: {
      from: 'PATHOGEN',
      to: 'ANTIBIOTIC',
      properties: ['resistance_mechanism', 'prevalence']
    },
    ALTERNATIVE_TO: {
      from: 'ANTIBIOTIC',
      to: 'ANTIBIOTIC',
      properties: ['similarity_score', 'clinical_context']
    }
  }
};

// Transform medical conditions data to Neo4j format
export const transformToNeo4jFormat = (medicalConditions) => {
  const nodes = [];
  const relationships = [];
  
  // Track unique entities
  const pathogenSet = new Set();
  const antibioticSet = new Set();
  const conditionSet = new Set();
  const drugClassSet = new Set();
  
  medicalConditions.forEach(condition => {
    // Create condition node
    const conditionNode = {
      type: 'CONDITION',
      id: condition.id,
      properties: {
        name: condition.name,
        category: condition.category,
        description: condition.description,
        severity: condition.severity || 'unknown'
      }
    };
    
    if (!conditionSet.has(condition.id)) {
      nodes.push(conditionNode);
      conditionSet.add(condition.id);
    }
    
    // Process pathogens
    if (condition.commonPathogens) {
      condition.commonPathogens.forEach(pathogenText => {
        const pathogen = parsePathogen(pathogenText);
        if (pathogen && pathogen.isValid) {
          const pathogenId = pathogen.name.toLowerCase().replace(/\s+/g, '_');
          
          // Create pathogen node
          if (!pathogenSet.has(pathogenId)) {
            const pathogenNode = {
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
            from: { type: 'PATHOGEN', id: pathogenId },
            to: { type: 'CONDITION', id: condition.id },
            properties: {
              frequency: 'common', // Would be derived from clinical data
              severity: condition.severity || 'moderate'
            }
          });
        }
      });
    }
    
    // Process empiric therapy antibiotics
    if (condition.empiricTherapy) {
      Object.entries(condition.empiricTherapy).forEach(([context, therapy]) => {
        const antibiotics = parseAntibiotics(therapy);
        antibiotics.forEach(antibiotic => {
          if (antibiotic && antibiotic.isValid) {
            const antibioticId = antibiotic.name.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_');
            
            // Create antibiotic node
            if (!antibioticSet.has(antibioticId)) {
              const antibioticNode = {
                type: 'ANTIBIOTIC',
                id: antibioticId,
                properties: {
                  name: antibiotic.name,
                  class: antibiotic.class,
                  mechanismOfAction: antibioticSpectrumData[antibiotic.name]?.mechanismOfAction || 'unknown'
                }
              };
              nodes.push(antibioticNode);
              antibioticSet.add(antibioticId);
              
              // Create drug class node and relationship
              const drugClassId = antibiotic.class.toLowerCase().replace(/\s+/g, '_');
              if (!drugClassSet.has(drugClassId)) {
                const drugClassNode = {
                  type: 'DRUG_CLASS',
                  id: drugClassId,
                  properties: {
                    name: antibiotic.class,
                    mechanism: antibioticSpectrumData[antibiotic.name]?.mechanismOfAction || 'unknown'
                  }
                };
                nodes.push(drugClassNode);
                drugClassSet.add(drugClassId);
              }
              
              // Create BELONGS_TO relationship
              relationships.push({
                type: 'BELONGS_TO',
                from: { type: 'ANTIBIOTIC', id: antibioticId },
                to: { type: 'DRUG_CLASS', id: drugClassId },
                properties: {}
              });
            }
            
            // Create treatment relationships with pathogens
            if (condition.commonPathogens) {
              condition.commonPathogens.forEach(pathogenText => {
                const pathogen = parsePathogen(pathogenText);
                if (pathogen && pathogen.isValid) {
                  const pathogenId = pathogen.name.toLowerCase().replace(/\s+/g, '_');
                  const effectiveness = calculateTreatmentEffectiveness(antibiotic, pathogen);
                  
                  relationships.push({
                    type: 'TREATS',
                    from: { type: 'ANTIBIOTIC', id: antibioticId },
                    to: { type: 'PATHOGEN', id: pathogenId },
                    properties: {
                      effectiveness: effectiveness,
                      clinical_evidence: context,
                      resistance_risk: calculateResistanceRisk(antibiotic, pathogen)
                    }
                  });
                }
              });
            }
          }
        });
      });
    }
  });
  
  // Add synergy relationships
  const synergies = identifyAntibioticSynergies(Array.from(antibioticSet));
  relationships.push(...synergies);
  
  return { nodes, relationships };
};

// Calculate treatment effectiveness based on spectrum data
const calculateTreatmentEffectiveness = (antibiotic, pathogen) => {
  const spectrumData = antibioticSpectrumData[antibiotic.name];
  if (!spectrumData) return 5; // Default moderate effectiveness
  
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

// Calculate resistance risk
const calculateResistanceRisk = (antibiotic, pathogen) => {
  const spectrumData = antibioticSpectrumData[antibiotic.name];
  if (!spectrumData || !spectrumData.resistance) return 'moderate';
  
  // Risk factors based on resistance mechanisms
  const riskFactors = spectrumData.resistance.length;
  if (riskFactors <= 1) return 'low';
  if (riskFactors <= 3) return 'moderate';
  return 'high';
};

// Identify potential antibiotic synergies
const identifyAntibioticSynergies = (antibioticIds) => {
  const synergies = [];
  const knownSynergies = [
    { 
      pair: ['ampicillin', 'gentamicin'], 
      mechanism: 'cell_wall_aminoglycoside_synergy',
      score: 8
    },
    {
      pair: ['vancomycin', 'gentamicin'],
      mechanism: 'cell_wall_aminoglycoside_synergy',
      score: 7
    },
    {
      pair: ['piperacillin_tazobactam', 'vancomycin'],
      mechanism: 'broad_spectrum_combination',
      score: 6
    }
  ];
  
  knownSynergies.forEach(synergy => {
    const [drug1, drug2] = synergy.pair;
    if (antibioticIds.includes(drug1) && antibioticIds.includes(drug2)) {
      synergies.push({
        type: 'SYNERGISTIC_WITH',
        from: { type: 'ANTIBIOTIC', id: drug1 },
        to: { type: 'ANTIBIOTIC', id: drug2 },
        properties: {
          synergy_score: synergy.score,
          mechanism: synergy.mechanism
        }
      });
    }
  });
  
  return synergies;
};

// Generate Cypher queries for Neo4j
export const generateCypherQueries = (neo4jData) => {
  const { nodes, relationships } = neo4jData;
  
  const queries = [];
  
  // Node creation queries
  const nodeQueries = nodes.reduce((acc, node) => {
    const nodeType = node.type;
    if (!acc[nodeType]) acc[nodeType] = [];
    acc[nodeType].push(node);
    return acc;
  }, {});
  
  Object.entries(nodeQueries).forEach(([type, nodeList]) => {
    const batchSize = 100;
    for (let i = 0; i < nodeList.length; i += batchSize) {
      const batch = nodeList.slice(i, i + batchSize);
      const query = `
        UNWIND $nodes AS node
        CREATE (n:${type})
        SET n = node.properties
        SET n.id = node.id
      `;
      queries.push({
        query,
        parameters: { nodes: batch }
      });
    }
  });
  
  // Relationship creation queries
  const relQueries = relationships.reduce((acc, rel) => {
    const relType = rel.type;
    if (!acc[relType]) acc[relType] = [];
    acc[relType].push(rel);
    return acc;
  }, {});
  
  Object.entries(relQueries).forEach(([type, relList]) => {
    const batchSize = 100;
    for (let i = 0; i < relList.length; i += batchSize) {
      const batch = relList.slice(i, i + batchSize);
      const query = `
        UNWIND $relationships AS rel
        MATCH (from:${batch[0].from.type} {id: rel.from.id})
        MATCH (to:${batch[0].to.type} {id: rel.to.id})
        CREATE (from)-[r:${type}]->(to)
        SET r = rel.properties
      `;
      queries.push({
        query,
        parameters: { relationships: batch }
      });
    }
  });
  
  return queries;
};

// Advanced graph analysis queries
export const advancedGraphQueries = {
  // Find shortest antibiotic path between two pathogens
  findTreatmentPath: (pathogen1, pathogen2) => `
    MATCH path = shortestPath(
      (p1:PATHOGEN {name: $pathogen1})-[:TREATS*..4]-(p2:PATHOGEN {name: $pathogen2})
    )
    RETURN path, length(path) as pathLength
  `,
  
  // Identify super-bugs (highly connected resistant pathogens)
  findSuperbugs: () => `
    MATCH (p:PATHOGEN)-[r:RESISTANT_TO]->(a:ANTIBIOTIC)
    WITH p, count(r) as resistanceCount
    WHERE resistanceCount > 3
    RETURN p.name, resistanceCount
    ORDER BY resistanceCount DESC
    LIMIT 10
  `,
  
  // Find antibiotic alternatives based on spectrum similarity
  findAlternatives: (antibiotic) => `
    MATCH (target:ANTIBIOTIC {name: $antibiotic})-[:TREATS]->(p:PATHOGEN)
    MATCH (alt:ANTIBIOTIC)-[:TREATS]->(p)
    WHERE alt <> target
    WITH alt, count(p) as sharedPathogens
    MATCH (alt)-[:TREATS]->(allP:PATHOGEN)
    WITH alt, sharedPathogens, count(allP) as totalPathogens
    RETURN alt.name, sharedPathogens, totalPathogens, 
           toFloat(sharedPathogens)/totalPathogens as similarity
    ORDER BY similarity DESC
    LIMIT 5
  `,
  
  // Community detection for drug classes
  findDrugCommunities: () => `
    CALL gds.louvain.stream('antibioticGraph')
    YIELD nodeId, communityId
    MATCH (a:ANTIBIOTIC)-[:BELONGS_TO]->(dc:DRUG_CLASS)
    WHERE id(a) = nodeId
    RETURN dc.name, communityId, collect(a.name) as antibiotics
  `
};

// Export utility for generating complete Neo4j dataset
export const generateNeo4jDataset = (medicalConditions) => {
  const neo4jData = transformToNeo4jFormat(medicalConditions);
  const cypherQueries = generateCypherQueries(neo4jData);
  
  return {
    schema: neo4jSchema,
    data: neo4jData,
    queries: cypherQueries,
    advancedQueries: advancedGraphQueries,
    statistics: {
      nodeCount: neo4jData.nodes.length,
      relationshipCount: neo4jData.relationships.length,
      nodeTypes: Object.keys(neo4jSchema.nodeTypes),
      relationshipTypes: Object.keys(neo4jSchema.relationshipTypes)
    }
  };
};
/**
 * ANTIBIOTIC LEARNING APP - ADVANCED VISUALIZATION DOCUMENTATION
 * ==============================================================
 * 
 * This module provides comprehensive data visualization capabilities for pediatric
 * antibiotic learning, including Venn diagrams, rotating wheels, radar charts,
 * and Neo4j graph database integration.
 * 
 * @version 2.0.0
 * @author Claude AI Assistant
 * @date 2024
 */

// =============================================================================
// PATHOGEN CLASSIFICATION SYSTEM
// =============================================================================

/**
 * Enhanced pathogen classification supporting typical and atypical organisms
 * 
 * Categories:
 * - Gram Positive: Traditional gram-positive bacteria (Staphylococcus, Streptococcus, etc.)
 * - Gram Negative: Traditional gram-negative bacteria (E. coli, Pseudomonas, etc.)
 * - Atypical: Mycoplasma, Chlamydia, Legionella, and other special organisms
 * - Acid-fast: Mycobacteria (special classification)
 * 
 * Usage:
 * const pathogen = parsePathogen("Mycoplasma pneumoniae");
 * // Returns: { gramStatus: 'atypical', spectrumCategory: 'atypical', ... }
 */

// =============================================================================
// ANTIBIOTIC SPECTRUM DATABASE
// =============================================================================

/**
 * Comprehensive antibiotic spectrum database with 10-point scoring system
 * 
 * Scoring System (0-10):
 * - 0-2: Poor coverage
 * - 3-4: Limited coverage  
 * - 5-6: Moderate coverage
 * - 7-8: Good coverage
 * - 9-10: Excellent coverage
 * 
 * Spectrum Categories:
 * - gramPositive: Coverage against gram-positive bacteria
 * - gramNegative: Coverage against gram-negative bacteria
 * - atypical: Coverage against atypical organisms
 * - anaerobes: Coverage against anaerobic bacteria
 * 
 * Example:
 * const vancomycin = antibioticSpectrumData['Vancomycin'];
 * // Returns: { spectrum: { gramPositive: 10, gramNegative: 0, ... }, ... }
 */

// =============================================================================
// VISUALIZATION COMPONENTS
// =============================================================================

/**
 * 1. ANTIBIOTIC SPECTRUM VENN DIAGRAM
 * ===================================
 * 
 * Interactive 3-circle Venn diagram showing antibiotic coverage across
 * Gram-positive, Gram-negative, and Atypical pathogen categories.
 * 
 * Features:
 * - Clickable regions show antibiotics with specific coverage patterns
 * - Hover tooltips display antibiotic counts and examples
 * - Animated pulse effects for region selection
 * - Real-time coverage analysis
 * 
 * Props:
 * - selectedAntibiotics: Array of antibiotic names to highlight
 * - onAntibioticSelect: Callback for antibiotic selection
 * - onSpectrumAnalysis: Callback for region analysis
 * 
 * Usage:
 * <AntibioticSpectrumVennDiagram 
 *   selectedAntibiotics={['Vancomycin', 'Ciprofloxacin']}
 *   onSpectrumAnalysis={(data) => console.log(data)}
 * />
 */

/**
 * 2. NORTHWESTERN-STYLE ROTATING WHEEL
 * ====================================
 * 
 * Rotating antibiotic selection wheel inspired by Northwestern University's
 * antibiotic decision support tools.
 * 
 * Structure:
 * - Center: Medical condition selector
 * - Inner ring: Pathogen categories
 * - Outer ring: Drug classes (rotating)
 * - Antibiotic nodes: Individual antibiotics within classes
 * 
 * Features:
 * - Manual and automatic rotation
 * - Connection lines showing effectiveness
 * - Drug class filtering and selection
 * - Variable rotation speed control
 * 
 * Props:
 * - selectedCondition: Medical condition object
 * - onAntibioticSelect: Callback for antibiotic selection
 * - onDrugClassSelect: Callback for drug class selection
 * 
 * Usage:
 * <AntibioticRotatingWheel 
 *   selectedCondition={pneumoniaCondition}
 *   onAntibioticSelect={(ab) => console.log(ab)}
 * />
 */

/**
 * 3. ANTIBIOTIC SPECTRUM RADAR CHART
 * ==================================
 * 
 * Multi-dimensional radar chart for antibiotic spectrum analysis and comparison.
 * 
 * Metrics:
 * - Gram Positive Coverage (0-10)
 * - Gram Negative Coverage (0-10)
 * - Atypical Coverage (0-10)
 * - Anaerobe Coverage (0-10)
 * - Resistance Profile (calculated)
 * - Safety Profile (calculated)
 * 
 * Features:
 * - Multiple antibiotic overlay
 * - Comparative analysis panel
 * - Interactive metric selection
 * - Hover tooltips with detailed scores
 * - Statistical comparison (min/max/avg)
 * 
 * Props:
 * - selectedAntibiotics: Array of antibiotics to compare
 * - comparisonMode: Enable comparative analysis
 * - onMetricSelect: Callback for metric analysis
 * 
 * Usage:
 * <AntibioticSpectrumRadarChart 
 *   selectedAntibiotics={['Vancomycin', 'Linezolid', 'Daptomycin']}
 *   comparisonMode={true}
 * />
 */

// =============================================================================
// NEO4J GRAPH DATABASE INTEGRATION
// =============================================================================

/**
 * Graph database schema for advanced antibiotic relationship analysis
 * 
 * Node Types:
 * - PATHOGEN: Bacterial, viral, fungal pathogens
 * - ANTIBIOTIC: Individual antimicrobial agents
 * - CONDITION: Medical conditions/infections
 * - DRUG_CLASS: Antibiotic classifications
 * 
 * Relationship Types:
 * - TREATS: Antibiotic effectiveness against pathogens
 * - CAUSES: Pathogen association with conditions
 * - BELONGS_TO: Antibiotic classification
 * - SYNERGISTIC_WITH: Drug combination synergies
 * - RESISTANT_TO: Resistance patterns
 * - ALTERNATIVE_TO: Alternative therapy options
 * 
 * Advanced Queries:
 * - Treatment path analysis
 * - Superbug identification
 * - Alternative drug discovery
 * - Community detection
 * 
 * Usage:
 * const dataset = generateNeo4jDataset(medicalConditions);
 * // Returns complete Neo4j-ready dataset with nodes, relationships, and queries
 */

// =============================================================================
// DATA TRANSFORMATION UTILITIES
// =============================================================================

/**
 * Spectrum Scoring Functions:
 * 
 * calculateSpectrumScore(antibiotic, pathogenCategory)
 * - Returns 0-10 score for specific pathogen category
 * 
 * getAntibioticsBySpectrum(pathogenCategory, minScore)
 * - Returns ranked list of antibiotics for category
 * 
 * getSpectrumOverlap(antibiotic1, antibiotic2)
 * - Returns 0-1 similarity score between antibiotics
 * 
 * Example:
 * const score = calculateSpectrumScore('Vancomycin', 'positive'); // Returns 10
 * const alternatives = getAntibioticsBySpectrum('atypical', 7);    // High-scoring atypical coverage
 * const overlap = getSpectrumOverlap('Penicillin', 'Ampicillin'); // Similarity score
 */

// =============================================================================
// INTEGRATION GUIDE
// =============================================================================

/**
 * Adding New Visualizations to Main App:
 * 
 * 1. Import components:
 *    import { AntibioticSpectrumVennDiagram, AntibioticRotatingWheel, 
 *             AntibioticSpectrumRadarChart } from './components/PathogenNetworkVisualization';
 * 
 * 2. Add to component state:
 *    const [selectedVisualization, setSelectedVisualization] = useState('venn');
 *    const [selectedAntibiotics, setSelectedAntibiotics] = useState([]);
 * 
 * 3. Render conditionally:
 *    {selectedVisualization === 'venn' && 
 *      <AntibioticSpectrumVennDiagram 
 *        selectedAntibiotics={selectedAntibiotics}
 *        onSpectrumAnalysis={handleSpectrumAnalysis}
 *      />
 *    }
 * 
 * 4. Add visualization selector:
 *    <select onChange={(e) => setSelectedVisualization(e.target.value)}>
 *      <option value="venn">Venn Diagram</option>
 *      <option value="wheel">Rotating Wheel</option>
 *      <option value="radar">Radar Chart</option>
 *    </select>
 */

// =============================================================================
// PERFORMANCE OPTIMIZATION
// =============================================================================

/**
 * Optimization Strategies:
 * 
 * 1. Data Memoization:
 *    - Use React.useMemo() for expensive calculations
 *    - Cache spectrum scores and pathogen classifications
 * 
 * 2. Virtual Rendering:
 *    - Implement viewport culling for large datasets
 *    - Use requestAnimationFrame for smooth animations
 * 
 * 3. Progressive Loading:
 *    - Load visualizations on demand
 *    - Implement lazy loading for Neo4j connections
 * 
 * 4. Memory Management:
 *    - Clean up SVG animations and event listeners
 *    - Use WeakMap for temporary data storage
 */

// =============================================================================
// ACCESSIBILITY FEATURES
// =============================================================================

/**
 * Accessibility Enhancements:
 * 
 * 1. Keyboard Navigation:
 *    - Tab through interactive elements
 *    - Arrow keys for rotation and selection
 *    - Enter/Space for activation
 * 
 * 2. Screen Reader Support:
 *    - ARIA labels for all interactive elements
 *    - Live regions for dynamic updates
 *    - Semantic SVG structure
 * 
 * 3. Visual Accessibility:
 *    - High contrast color schemes
 *    - Pattern fills for color-blind users
 *    - Scalable text and UI elements
 * 
 * 4. Cognitive Accessibility:
 *    - Clear navigation flow
 *    - Consistent interaction patterns
 *    - Help tooltips and guidance
 */

// =============================================================================
// CLINICAL INTEGRATION
// =============================================================================

/**
 * Medical Decision Support Features:
 * 
 * 1. Evidence-Based Scoring:
 *    - Clinical trial effectiveness data
 *    - Resistance surveillance integration
 *    - Local antibiogram support
 * 
 * 2. Clinical Context:
 *    - Patient-specific factors (age, allergies, renal function)
 *    - Severity-based recommendations
 *    - Drug interaction checking
 * 
 * 3. Educational Features:
 *    - Mechanism of action explanations
 *    - Resistance pattern tutorials
 *    - Case-based learning scenarios
 * 
 * 4. Quality Metrics:
 *    - Antibiotic stewardship tracking
 *    - Learning progress analytics
 *    - Clinical outcome correlation
 */

export const VISUALIZATION_DOCUMENTATION = {
  version: '2.0.0',
  components: ['VennDiagram', 'RotatingWheel', 'RadarChart', 'Neo4jIntegration'],
  features: ['PathogenClassification', 'SpectrumAnalysis', 'GraphDatabase', 'ClinicalDecisionSupport'],
  lastUpdated: new Date().toISOString(),
  apiReference: 'See individual component documentation above'
};

/**
 * Process all conditions and extract normalized pathogen and antibiotic data
 * @param {Array} conditions - Array of medical condition objects
 * @returns {Object} - Processed data with pathogens and antibiotics
 */
export const processConditionsData = (conditions) => {
  const pathogens = new Map();
  const antibiotics = new Map();
  const conditionMap = new Map();
  
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
          
          const pathogenData = pathogens.get(pathogen.name);
          pathogenData.conditions.add(condition.id);
          pathogenData.count++;
        }
      });
    }
    
    // Process antibiotics from empiric therapy
    if (condition.empiricTherapy && typeof condition.empiricTherapy === 'object') {
      Object.values(condition.empiricTherapy).forEach(therapyText => {
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
            
            const antibioticData = antibiotics.get(antibiotic.name);
            antibioticData.conditions.add(condition.id);
            antibioticData.therapyContexts.add(`${condition.name}: ${therapyText}`);
            antibioticData.count++;
          }
        });
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
    conditions: Array.from(conditionMap.values())
  };
};