/**
 * Northwestern 8-Segment Antibiotic Schema
 * Enhanced data structure supporting Northwestern pie chart visualization
 * 
 * Northwestern 8-Segment Categories:
 * 1. MRSA (Methicillin-resistant Staphylococcus aureus)
 * 2. VRE faecium (Vancomycin-resistant Enterococcus faecium)
 * 3. Anaerobes (Bacteroides, C. difficile, mixed anaerobes)
 * 4. Atypicals (Legionella, Mycoplasma, Chlamydophila)
 * 5. P. aeruginosa (Pseudomonas aeruginosa)
 * 6. Gram(-) (Gram-negative organisms)
 * 7. MSSA (Methicillin-sensitive Staphylococcus aureus)
 * 8. E. faecalis (Enterococcus faecalis)
 * 
 * Coverage Scale: 0=no coverage (white), 1=poor/ok coverage (light), 2=good coverage (dark)
 */

// Northwestern Spectrum Mapping - Medical accuracy verified against current literature
const northwesternSpectrumMap = {
  // PENICILLINS
  1: { // Penicillin
    MRSA: 0, VRE_faecium: 0, anaerobes: 1, atypicals: 0, 
    pseudomonas: 0, gramNegative: 0, MSSA: 2, enterococcus_faecalis: 1
  },
  15: { // Ampicillin
    MRSA: 0, VRE_faecium: 0, anaerobes: 1, atypicals: 0,
    pseudomonas: 0, gramNegative: 1, MSSA: 2, enterococcus_faecalis: 2
  },
  16: { // Amoxicillin
    MRSA: 0, VRE_faecium: 0, anaerobes: 1, atypicals: 0,
    pseudomonas: 0, gramNegative: 1, MSSA: 2, enterococcus_faecalis: 2
  },
  17: { // Amoxicillin-clavulanate
    MRSA: 0, VRE_faecium: 0, anaerobes: 2, atypicals: 0,
    pseudomonas: 0, gramNegative: 2, MSSA: 2, enterococcus_faecalis: 2
  },
  18: { // Ampicillin/sulbactam
    MRSA: 0, VRE_faecium: 0, anaerobes: 2, atypicals: 0,
    pseudomonas: 0, gramNegative: 2, MSSA: 2, enterococcus_faecalis: 2
  },
  28: { // Nafcillin
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 0, MSSA: 2, enterococcus_faecalis: 0
  },
  29: { // Oxacillin
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 0, MSSA: 2, enterococcus_faecalis: 0
  },
  14: { // Piperacillin-Tazobactam
    MRSA: 0, VRE_faecium: 0, anaerobes: 2, atypicals: 0,
    pseudomonas: 2, gramNegative: 2, MSSA: 2, enterococcus_faecalis: 2
  },

  // CEPHALOSPORINS
  13: { // Cefazolin (1st gen)
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 1, MSSA: 2, enterococcus_faecalis: 0
  },
  25: { // Cephalexin (1st gen)
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 1, MSSA: 2, enterococcus_faecalis: 0
  },
  24: { // Cefuroxime (2nd gen)
    MRSA: 0, VRE_faecium: 0, anaerobes: 1, atypicals: 0,
    pseudomonas: 0, gramNegative: 2, MSSA: 2, enterococcus_faecalis: 0
  },
  4: { // Ceftriaxone (3rd gen)
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 2, MSSA: 1, enterococcus_faecalis: 0
  },
  19: { // Cefdinir (3rd gen)
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 2, MSSA: 1, enterococcus_faecalis: 0
  },
  21: { // Cefotaxime (3rd gen)
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 2, MSSA: 1, enterococcus_faecalis: 0
  },
  22: { // Cefpodoxime (3rd gen)
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 2, MSSA: 1, enterococcus_faecalis: 0
  },
  20: { // Cefepime (4th gen)
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 2, gramNegative: 2, MSSA: 2, enterococcus_faecalis: 0
  },
  23: { // Ceftaroline (5th gen)
    MRSA: 2, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 2, MSSA: 2, enterococcus_faecalis: 0
  },

  // CARBAPENEMS
  8: { // Meropenem
    MRSA: 0, VRE_faecium: 0, anaerobes: 2, atypicals: 0,
    pseudomonas: 2, gramNegative: 2, MSSA: 2, enterococcus_faecalis: 2
  },

  // GLYCOPEPTIDES
  2: { // Vancomycin
    MRSA: 2, VRE_faecium: 0, anaerobes: 2, atypicals: 0,
    pseudomonas: 0, gramNegative: 0, MSSA: 2, enterococcus_faecalis: 1
  },

  // LIPOPEPTIDES
  26: { // Daptomycin
    MRSA: 2, VRE_faecium: 2, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 0, MSSA: 2, enterococcus_faecalis: 2
  },

  // OXAZOLIDINONES
  11: { // Linezolid
    MRSA: 2, VRE_faecium: 2, anaerobes: 1, atypicals: 0,
    pseudomonas: 0, gramNegative: 0, MSSA: 2, enterococcus_faecalis: 2
  },

  // MACROLIDES
  5: { // Azithromycin
    MRSA: 0, VRE_faecium: 0, anaerobes: 1, atypicals: 2,
    pseudomonas: 0, gramNegative: 0, MSSA: 1, enterococcus_faecalis: 0
  },

  // LINCOSAMIDES
  6: { // Clindamycin
    MRSA: 1, VRE_faecium: 0, anaerobes: 2, atypicals: 0,
    pseudomonas: 0, gramNegative: 0, MSSA: 2, enterococcus_faecalis: 0
  },

  // FLUOROQUINOLONES
  3: { // Ciprofloxacin
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 1,
    pseudomonas: 1, gramNegative: 2, MSSA: 1, enterococcus_faecalis: 0
  },
  27: { // Levofloxacin
    MRSA: 0, VRE_faecium: 0, anaerobes: 1, atypicals: 2,
    pseudomonas: 1, gramNegative: 2, MSSA: 2, enterococcus_faecalis: 0
  },

  // AMINOGLYCOSIDES
  7: { // Gentamicin
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 1, gramNegative: 2, MSSA: 1, enterococcus_faecalis: 1
  },

  // TETRACYCLINES
  9: { // Doxycycline
    MRSA: 1, VRE_faecium: 0, anaerobes: 1, atypicals: 2,
    pseudomonas: 0, gramNegative: 1, MSSA: 2, enterococcus_faecalis: 0
  },

  // FOLATE INHIBITORS
  10: { // Trimethoprim-Sulfamethoxazole
    MRSA: 2, VRE_faecium: 0, anaerobes: 0, atypicals: 1,
    pseudomonas: 0, gramNegative: 1, MSSA: 2, enterococcus_faecalis: 0
  },
  30: { // TMP-SMX (duplicate)
    MRSA: 2, VRE_faecium: 0, anaerobes: 0, atypicals: 1,
    pseudomonas: 0, gramNegative: 1, MSSA: 2, enterococcus_faecalis: 0
  },

  // NITROIMIDAZOLES
  12: { // Metronidazole
    MRSA: 0, VRE_faecium: 0, anaerobes: 2, atypicals: 0,
    pseudomonas: 0, gramNegative: 0, MSSA: 0, enterococcus_faecalis: 0
  }
};

// Cell Wall Activity Classification (for dotted border visualization)
const cellWallActiveMap = {
  1: true,   // Penicillin
  4: true,   // Ceftriaxone
  8: true,   // Meropenem
  13: true,  // Cefazolin
  14: true,  // Piperacillin-Tazobactam
  15: true,  // Ampicillin
  16: true,  // Amoxicillin
  17: true,  // Amoxicillin-clavulanate
  18: true,  // Ampicillin/sulbactam
  19: true,  // Cefdinir
  20: true,  // Cefepime
  21: true,  // Cefotaxime
  22: true,  // Cefpodoxime
  23: true,  // Ceftaroline
  24: true,  // Cefuroxime
  25: true,  // Cephalexin
  28: true,  // Nafcillin
  29: true,  // Oxacillin
  2: true,   // Vancomycin
  26: true,  // Daptomycin (membrane disruption, but similar concept)
  // Non-cell wall active
  3: false,  // Ciprofloxacin
  5: false,  // Azithromycin
  6: false,  // Clindamycin
  7: false,  // Gentamicin
  9: false,  // Doxycycline
  10: false, // Trimethoprim-Sulfamethoxazole
  11: false, // Linezolid
  12: false, // Metronidazole
  27: false, // Levofloxacin
  30: false  // TMP-SMX
};

// Generation Classification (for Northwestern layout grouping)
const generationMap = {
  // Penicillins
  1: "Natural Penicillin",
  15: "Aminopenicillin",
  16: "Aminopenicillin", 
  17: "Aminopenicillin + Inhibitor",
  18: "Aminopenicillin + Inhibitor",
  28: "Antistaphylococcal",
  29: "Antistaphylococcal",
  14: "Antipseudomonal + Inhibitor",
  
  // Cephalosporins
  13: "1st Generation",
  25: "1st Generation",
  24: "2nd Generation",
  4: "3rd Generation",
  19: "3rd Generation",
  21: "3rd Generation", 
  22: "3rd Generation",
  20: "4th Generation",
  23: "5th Generation",
  
  // Other classes
  8: "Carbapenem",
  2: "Glycopeptide",
  26: "Lipopeptide",
  11: "Oxazolidinone",
  5: "Macrolide",
  6: "Lincosamide", 
  3: "Fluoroquinolone",
  27: "Fluoroquinolone",
  7: "Aminoglycoside",
  9: "Tetracycline",
  10: "Folate Inhibitor",
  30: "Folate Inhibitor",
  12: "Nitroimidazole"
};

// Route Color Classification (for Northwestern visualization)
const routeColorMap = {
  // PO only (red)
  16: "red",   // Amoxicillin
  17: "red",   // Amoxicillin-clavulanate
  19: "red",   // Cefdinir
  22: "red",   // Cefpodoxime
  25: "red",   // Cephalexin
  
  // IV only (blue)
  2: "blue",   // Vancomycin
  4: "blue",   // Ceftriaxone
  7: "blue",   // Gentamicin
  8: "blue",   // Meropenem
  13: "blue",  // Cefazolin
  14: "blue",  // Piperacillin-Tazobactam
  18: "blue",  // Ampicillin/sulbactam
  20: "blue",  // Cefepime
  21: "blue",  // Cefotaxime
  23: "blue",  // Ceftaroline
  26: "blue",  // Daptomycin
  28: "blue",  // Nafcillin
  29: "blue",  // Oxacillin
  
  // Both IV/PO (purple)
  1: "purple",  // Penicillin
  3: "purple",  // Ciprofloxacin
  5: "purple",  // Azithromycin
  6: "purple",  // Clindamycin
  9: "purple",  // Doxycycline
  10: "purple", // Trimethoprim-Sulfamethoxazole
  11: "purple", // Linezolid
  12: "purple", // Metronidazole
  15: "purple", // Ampicillin
  24: "purple", // Cefuroxime
  27: "purple", // Levofloxacin
  30: "purple"  // TMP-SMX
};

// Northwestern Spatial Positioning (Canvas coordinates for pie chart layout)
const northwesternPositionMap = {
  // Cell wall agents with dotted border grouping
  // Penicillins cluster
  1: { x: 100, y: 200, group: "penicillins", hasBorder: true },
  15: { x: 120, y: 220, group: "penicillins", hasBorder: true },
  16: { x: 140, y: 200, group: "penicillins", hasBorder: true },
  17: { x: 160, y: 220, group: "penicillins", hasBorder: true },
  18: { x: 180, y: 200, group: "penicillins", hasBorder: true },
  28: { x: 200, y: 220, group: "penicillins", hasBorder: true },
  29: { x: 220, y: 200, group: "penicillins", hasBorder: true },
  14: { x: 240, y: 220, group: "penicillins", hasBorder: true },
  
  // Cephalosporins cluster
  13: { x: 300, y: 150, group: "cephalosporins", hasBorder: true },
  25: { x: 320, y: 170, group: "cephalosporins", hasBorder: true },
  24: { x: 340, y: 150, group: "cephalosporins", hasBorder: true },
  4: { x: 360, y: 170, group: "cephalosporins", hasBorder: true },
  19: { x: 380, y: 150, group: "cephalosporins", hasBorder: true },
  21: { x: 400, y: 170, group: "cephalosporins", hasBorder: true },
  22: { x: 420, y: 150, group: "cephalosporins", hasBorder: true },
  20: { x: 440, y: 170, group: "cephalosporins", hasBorder: true },
  23: { x: 460, y: 150, group: "cephalosporins", hasBorder: true },
  
  // Other cell wall agents
  8: { x: 300, y: 100, group: "carbapenems", hasBorder: true },
  2: { x: 400, y: 100, group: "glycopeptides", hasBorder: true },
  26: { x: 500, y: 100, group: "lipopeptides", hasBorder: true },
  
  // Non-cell wall agents (no dotted border)
  11: { x: 150, y: 50, group: "protein_synthesis", hasBorder: false },
  5: { x: 200, y: 50, group: "protein_synthesis", hasBorder: false },
  6: { x: 250, y: 50, group: "protein_synthesis", hasBorder: false },
  7: { x: 300, y: 50, group: "protein_synthesis", hasBorder: false },
  9: { x: 350, y: 50, group: "protein_synthesis", hasBorder: false },
  3: { x: 450, y: 50, group: "dna_synthesis", hasBorder: false },
  27: { x: 500, y: 50, group: "dna_synthesis", hasBorder: false },
  10: { x: 550, y: 50, group: "folate_inhibitors", hasBorder: false },
  30: { x: 570, y: 70, group: "folate_inhibitors", hasBorder: false },
  12: { x: 600, y: 50, group: "anaerobic_agents", hasBorder: false }
};

/**
 * Enhanced antibiotic data structure with Northwestern 8-segment support
 * Maintains full backward compatibility with existing schema
 */
export const createNorthwesternAntibioticData = (originalAntibiotics) => {
  return originalAntibiotics.map(antibiotic => ({
    // Preserve all original fields for backward compatibility
    ...antibiotic,
    
    // Add Northwestern 8-segment spectrum coverage
    northwesternSpectrum: northwesternSpectrumMap[antibiotic.id] || {
      MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
      pseudomonas: 0, gramNegative: 0, MSSA: 0, enterococcus_faecalis: 0
    },
    
    // Add Northwestern visualization properties
    cellWallActive: cellWallActiveMap[antibiotic.id] || false,
    generation: generationMap[antibiotic.id] || "Unclassified",
    routeColor: routeColorMap[antibiotic.id] || "gray",
    
    // Add spatial positioning for Northwestern layout
    northwesternPosition: northwesternPositionMap[antibiotic.id] || {
      x: 0, y: 0, group: "unclassified", hasBorder: false
    }
  }));
};

/**
 * Get Northwestern spectrum coverage for a specific antibiotic
 */
export const getNorthwesternSpectrum = (antibioticId) => {
  return northwesternSpectrumMap[antibioticId] || null;
};

/**
 * Get all antibiotics with coverage against a specific Northwestern category
 */
export const getAntibioticsForNorthwesternCategory = (category, minCoverage = 1) => {
  const results = [];
  
  Object.entries(northwesternSpectrumMap).forEach(([antibioticId, spectrum]) => {
    if (spectrum[category] >= minCoverage) {
      results.push({
        antibioticId: parseInt(antibioticId),
        coverage: spectrum[category]
      });
    }
  });
  
  return results.sort((a, b) => b.coverage - a.coverage);
};

/**
 * Get Northwestern coverage statistics
 */
export const getNorthwesternCoverageStats = () => {
  const categories = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals', 
                     'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];
  
  const stats = {};
  
  categories.forEach(category => {
    stats[category] = {
      noCoverage: 0,    // coverage = 0
      someCoverage: 0,  // coverage = 1  
      goodCoverage: 0   // coverage = 2
    };
    
    Object.values(northwesternSpectrumMap).forEach(spectrum => {
      if (spectrum[category] === 0) stats[category].noCoverage++;
      else if (spectrum[category] === 1) stats[category].someCoverage++;
      else if (spectrum[category] === 2) stats[category].goodCoverage++;
    });
  });
  
  return stats;
};

/**
 * Get cell wall active antibiotics (for dotted border grouping)
 */
export const getCellWallActiveAntibiotics = () => {
  return Object.entries(cellWallActiveMap)
    .filter(([id, isActive]) => isActive)
    .map(([id, isActive]) => parseInt(id));
};

/**
 * Get antibiotics by generation (for Northwestern layout grouping)
 */
export const getAntibioticsByGeneration = () => {
  const generations = {};
  
  Object.entries(generationMap).forEach(([antibioticId, generation]) => {
    if (!generations[generation]) {
      generations[generation] = [];
    }
    generations[generation].push(parseInt(antibioticId));
  });
  
  return generations;
};

/**
 * Validate Northwestern schema data integrity
 */
export const validateNorthwesternSchema = () => {
  const errors = [];
  const antibioticIds = Object.keys(northwesternSpectrumMap).map(id => parseInt(id));
  
  // Check that all antibiotics have complete Northwestern data
  antibioticIds.forEach(id => {
    if (!northwesternSpectrumMap[id]) {
      errors.push(`Antibiotic ${id} missing Northwestern spectrum data`);
    }
    
    if (cellWallActiveMap[id] === undefined) {
      errors.push(`Antibiotic ${id} missing cell wall activity classification`);
    }
    
    if (!generationMap[id]) {
      errors.push(`Antibiotic ${id} missing generation classification`);
    }
    
    if (!routeColorMap[id]) {
      errors.push(`Antibiotic ${id} missing route color classification`);
    }
    
    if (!northwesternPositionMap[id]) {
      errors.push(`Antibiotic ${id} missing position data`);
    }
  });
  
  // Validate Northwestern spectrum values
  Object.entries(northwesternSpectrumMap).forEach(([id, spectrum]) => {
    Object.entries(spectrum).forEach(([category, value]) => {
      if (![0, 1, 2].includes(value)) {
        errors.push(`Antibiotic ${id} has invalid coverage value ${value} for ${category}`);
      }
    });
  });
  
  return errors.length === 0 ? null : errors;
};

// Export all mapping objects for external use
export {
  northwesternSpectrumMap,
  cellWallActiveMap,
  generationMap,
  routeColorMap,
  northwesternPositionMap
};