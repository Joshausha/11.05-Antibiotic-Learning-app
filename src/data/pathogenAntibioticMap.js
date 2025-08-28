/**
 * Pathogen-Antibiotic Relationship Map
 * Sophomore-level mapping of which antibiotics work against which pathogens
 * Effectiveness levels: "high", "medium", "low", "resistant"
 * Evidence levels: "A", "B", "C", "D", "EXPERT", "UNKNOWN"
 * 
 * Evidence grades based on AAP, IDSA, and CDC clinical practice guidelines:
 * - A: Strong evidence from well-designed RCTs or multiple observational studies
 * - B: Moderate evidence from limited RCTs or high-quality observational studies
 * - C: Limited evidence from observational studies with limitations or case series
 * - D: Very low quality evidence - expert opinion or case reports only
 * - EXPERT: Expert consensus without systematic evidence review
 * - UNKNOWN: Evidence level not specified or unavailable
 */

const pathogenAntibioticMap = {
  // Staphylococcus aureus (MSSA/MRSA)
  1: {
    pathogenName: "Staphylococcus aureus",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", evidenceLevel: "A", notes: "Most strains produce beta-lactamase" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", evidenceLevel: "A", notes: "Gold standard for MRSA" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "medium", evidenceLevel: "B", notes: "Good for skin/soft tissue" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "high", evidenceLevel: "A", notes: "MRSA active" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "medium", evidenceLevel: "B", notes: "Good oral option for MRSA" },
      { antibioticId: 13, name: "Cefazolin", effectiveness: "high", evidenceLevel: "A", notes: "MSSA only" }
    ]
  },

  // Escherichia coli
  2: {
    pathogenName: "Escherichia coli",
    antibiotics: [
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "high", evidenceLevel: "A", notes: "Excellent for UTI" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", evidenceLevel: "A", notes: "Good empiric choice" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", evidenceLevel: "A", notes: "For ESBL strains" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "medium", evidenceLevel: "A", notes: "Oral option for UTI" },
      { antibioticId: 7, name: "Gentamicin", effectiveness: "high", evidenceLevel: "A", notes: "Synergy with beta-lactams" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "low", evidenceLevel: "A", notes: "High resistance rates" }
    ]
  },

  // Streptococcus pneumoniae
  3: {
    pathogenName: "Streptococcus pneumoniae",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "medium", evidenceLevel: "A", notes: "Resistance increasing" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", evidenceLevel: "A", notes: "First-line for meningitis" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", evidenceLevel: "A", notes: "For penicillin-resistant strains" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "medium", evidenceLevel: "B", notes: "Atypical coverage" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "high", evidenceLevel: "B", notes: "Alternative for resistant strains" }
    ]
  },

  // Pseudomonas aeruginosa
  4: {
    pathogenName: "Pseudomonas aeruginosa",
    antibiotics: [
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", evidenceLevel: "B", notes: "Resistance developing" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", evidenceLevel: "A", notes: "Carbapenem choice" },
      { antibioticId: 14, name: "Piperacillin-Tazobactam", effectiveness: "high", evidenceLevel: "A", notes: "Good anti-pseudomonal activity" },
      { antibioticId: 7, name: "Gentamicin", effectiveness: "medium", evidenceLevel: "B", notes: "Synergy with beta-lactams" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", evidenceLevel: "A", notes: "Intrinsic resistance" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "resistant", evidenceLevel: "A", notes: "Gram-negative" }
    ]
  },

  // Streptococcus pyogenes (Group A Strep)
  5: {
    pathogenName: "Streptococcus pyogenes",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", evidenceLevel: "A", notes: "Still sensitive" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "high", evidenceLevel: "A", notes: "Toxin suppression" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "medium", evidenceLevel: "B", notes: "Some resistance" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", evidenceLevel: "A", notes: "Good alternative" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "high", evidenceLevel: "A", notes: "Equivalent to penicillin" }
    ]
  },

  // Klebsiella pneumoniae
  6: {
    pathogenName: "Klebsiella pneumoniae",
    antibiotics: [
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "medium", evidenceLevel: "A", notes: "ESBL strains resistant" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", evidenceLevel: "A", notes: "For ESBL strains" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", evidenceLevel: "B", notes: "Variable resistance" },
      { antibioticId: 7, name: "Gentamicin", effectiveness: "medium", evidenceLevel: "B", notes: "Combination therapy" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", evidenceLevel: "A", notes: "Intrinsic resistance" }
    ]
  },

  // Enterococcus faecalis
  7: {
    pathogenName: "Enterococcus faecalis",
    antibiotics: [
      { antibioticId: 15, name: "Ampicillin", effectiveness: "high", evidenceLevel: "A", notes: "Drug of choice" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "medium", evidenceLevel: "A", notes: "VRE strains resistant" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "high", evidenceLevel: "A", notes: "VRE active" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "low", evidenceLevel: "A", notes: "Intrinsic resistance" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "resistant", evidenceLevel: "A", notes: "Intrinsic resistance" }
    ]
  },

  // Haemophilus influenzae
  8: {
    pathogenName: "Haemophilus influenzae",
    antibiotics: [
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", evidenceLevel: "A", notes: "Excellent choice" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "high", evidenceLevel: "A", notes: "Good oral option" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "low", evidenceLevel: "A", notes: "Beta-lactamase resistance" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "medium", evidenceLevel: "B", notes: "Alternative option" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "medium", evidenceLevel: "B", notes: "Oral alternative" }
    ]
  },

  // Acinetobacter baumannii
  9: {
    pathogenName: "Acinetobacter baumannii",
    antibiotics: [
      { antibioticId: 8, name: "Meropenem", effectiveness: "medium", evidenceLevel: "B", notes: "MDR strains resistant" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "low", evidenceLevel: "A", notes: "High resistance rates" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "medium", evidenceLevel: "C", notes: "Some activity" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "medium", evidenceLevel: "C", notes: "Some retained activity" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", evidenceLevel: "A", notes: "Intrinsic resistance" }
    ]
  },

  // Clostridium difficile
  10: {
    pathogenName: "Clostridium difficile",
    antibiotics: [
      { antibioticId: 12, name: "Metronidazole", effectiveness: "medium", evidenceLevel: "B", notes: "Mild-moderate disease" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", evidenceLevel: "A", notes: "Severe disease" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", evidenceLevel: "A", notes: "Intrinsic resistance" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "resistant", evidenceLevel: "A", notes: "Actually causes C. diff" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "resistant", evidenceLevel: "A", notes: "Risk factor for C. diff" }
    ]
  }
};

// Helper functions for sophomore developers
export const getAntibioticsForPathogen = (pathogenId) => {
  return pathogenAntibioticMap[pathogenId]?.antibiotics || [];
};

export const getEffectivenessForPair = (pathogenId, antibioticId) => {
  const pathogen = pathogenAntibioticMap[pathogenId];
  if (!pathogen) return null;
  
  const antibiotic = pathogen.antibiotics.find(ab => ab.antibioticId === antibioticId);
  return antibiotic?.effectiveness || null;
};

export const getHighEffectivenessAntibiotics = (pathogenId) => {
  const antibiotics = getAntibioticsForPathogen(pathogenId);
  return antibiotics.filter(ab => ab.effectiveness === "high");
};

export const getResistantAntibiotics = (pathogenId) => {
  const antibiotics = getAntibioticsForPathogen(pathogenId);
  return antibiotics.filter(ab => ab.effectiveness === "resistant");
};

export const getPathogensForAntibiotic = (antibioticId) => {
  const results = [];
  
  Object.keys(pathogenAntibioticMap).forEach(pathogenId => {
    const pathogen = pathogenAntibioticMap[pathogenId];
    const antibiotic = pathogen.antibiotics.find(ab => ab.antibioticId === antibioticId);
    
    if (antibiotic) {
      results.push({
        pathogenId: parseInt(pathogenId),
        pathogenName: pathogen.pathogenName,
        effectiveness: antibiotic.effectiveness,
        notes: antibiotic.notes
      });
    }
  });
  
  return results;
};

export const getEffectivenessStats = () => {
  const stats = {
    high: 0,
    medium: 0,
    low: 0,
    resistant: 0
  };
  
  Object.values(pathogenAntibioticMap).forEach(pathogen => {
    pathogen.antibiotics.forEach(antibiotic => {
      stats[antibiotic.effectiveness]++;
    });
  });
  
  return stats;
};

// Data validation function
export const validateRelationshipData = () => {
  const errors = [];
  
  Object.keys(pathogenAntibioticMap).forEach(pathogenId => {
    const pathogen = pathogenAntibioticMap[pathogenId];
    
    if (!pathogen.pathogenName) {
      errors.push(`Pathogen ${pathogenId} missing name`);
    }
    
    if (!pathogen.antibiotics || pathogen.antibiotics.length === 0) {
      errors.push(`Pathogen ${pathogenId} has no antibiotics`);
    }
    
    pathogen.antibiotics?.forEach((antibiotic, index) => {
      if (!antibiotic.antibioticId) {
        errors.push(`Pathogen ${pathogenId}, antibiotic ${index} missing ID`);
      }
      if (!antibiotic.effectiveness) {
        errors.push(`Pathogen ${pathogenId}, antibiotic ${index} missing effectiveness`);
      }
      if (!["high", "medium", "low", "resistant"].includes(antibiotic.effectiveness)) {
        errors.push(`Pathogen ${pathogenId}, antibiotic ${index} invalid effectiveness`);
      }
    });
  });
  
  return errors.length === 0 ? null : errors;
};

export default pathogenAntibioticMap;