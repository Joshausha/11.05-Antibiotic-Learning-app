/**
 * Pathogen-Antibiotic Relationship Map
 * Sophomore-level mapping of which antibiotics work against which pathogens
 * Effectiveness levels: "high", "medium", "low", "resistant"
 */

export interface PathogenAntibioticRelationship {
  antibioticId: number;
  name: string;
  effectiveness: 'high' | 'medium' | 'low' | 'resistant';
  notes: string;
}

export interface PathogenEntry {
  pathogenName: string;
  antibiotics: PathogenAntibioticRelationship[];
}

export type PathogenAntibioticMapType = Record<number, PathogenEntry>;

const pathogenAntibioticMap: PathogenAntibioticMapType = {
  // Staphylococcus aureus (MSSA/MRSA)
  1: {
    pathogenName: "Staphylococcus aureus",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Most strains produce beta-lactamase" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "Gold standard for MRSA" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "medium", notes: "Good for skin/soft tissue" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "high", notes: "MRSA active" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "medium", notes: "Good oral option for MRSA" },
      { antibioticId: 13, name: "Cefazolin", effectiveness: "high", notes: "MSSA only" }
    ]
  },

  // Escherichia coli
  2: {
    pathogenName: "Escherichia coli",
    antibiotics: [
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "high", notes: "Excellent for UTI" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Good empiric choice" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", notes: "For ESBL strains" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "medium", notes: "Oral option for UTI" },
      { antibioticId: 7, name: "Gentamicin", effectiveness: "high", notes: "Synergy with beta-lactams" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "low", notes: "High resistance rates" }
    ]
  },

  // Streptococcus pneumoniae
  3: {
    pathogenName: "Streptococcus pneumoniae",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "medium", notes: "Resistance increasing" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "First-line for meningitis" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "For penicillin-resistant strains" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "medium", notes: "Atypical coverage" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "high", notes: "Alternative for resistant strains" }
    ]
  },

  // Pseudomonas aeruginosa
  4: {
    pathogenName: "Pseudomonas aeruginosa",
    antibiotics: [
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", notes: "Resistance developing" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", notes: "Carbapenem choice" },
      { antibioticId: 14, name: "Piperacillin-Tazobactam", effectiveness: "high", notes: "Good anti-pseudomonal activity" },
      { antibioticId: 7, name: "Gentamicin", effectiveness: "medium", notes: "Synergy with beta-lactams" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Intrinsic resistance" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "resistant", notes: "Gram-negative" }
    ]
  },

  // Streptococcus pyogenes (Group A Strep)
  5: {
    pathogenName: "Streptococcus pyogenes",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", notes: "Still sensitive" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "high", notes: "Toxin suppression" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "medium", notes: "Some resistance" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Good alternative" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "high", notes: "Equivalent to penicillin" }
    ]
  },

  // Klebsiella pneumoniae
  6: {
    pathogenName: "Klebsiella pneumoniae",
    antibiotics: [
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "medium", notes: "ESBL strains resistant" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", notes: "For ESBL strains" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", notes: "Variable resistance" },
      { antibioticId: 7, name: "Gentamicin", effectiveness: "medium", notes: "Combination therapy" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Intrinsic resistance" }
    ]
  },

  // Enterococcus faecalis
  7: {
    pathogenName: "Enterococcus faecalis",
    antibiotics: [
      { antibioticId: 15, name: "Ampicillin", effectiveness: "high", notes: "Drug of choice" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "medium", notes: "VRE strains resistant" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "high", notes: "VRE active" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "low", notes: "Intrinsic resistance" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "resistant", notes: "Intrinsic resistance" }
    ]
  },

  // Haemophilus influenzae
  8: {
    pathogenName: "Haemophilus influenzae",
    antibiotics: [
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Excellent choice" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "high", notes: "Good oral option" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "low", notes: "Beta-lactamase resistance" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "medium", notes: "Alternative option" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "medium", notes: "Oral alternative" }
    ]
  },

  // Acinetobacter baumannii
  9: {
    pathogenName: "Acinetobacter baumannii",
    antibiotics: [
      { antibioticId: 8, name: "Meropenem", effectiveness: "medium", notes: "MDR strains resistant" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "low", notes: "High resistance rates" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "medium", notes: "Some activity" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "medium", notes: "Some retained activity" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Intrinsic resistance" }
    ]
  },

  // Clostridium difficile
  10: {
    pathogenName: "Clostridium difficile",
    antibiotics: [
      { antibioticId: 12, name: "Metronidazole", effectiveness: "medium", notes: "Mild-moderate disease" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "Severe disease" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Intrinsic resistance" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "resistant", notes: "Actually causes C. diff" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "resistant", notes: "Risk factor for C. diff" }
    ]
  },

  // Enterococcus faecium (VRE)
  11: {
    pathogenName: "Enterococcus faecium",
    antibiotics: [
      { antibioticId: 2, name: "Vancomycin", effectiveness: "resistant", notes: "VRE by definition" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "high", notes: "Drug of choice for VRE" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "resistant", notes: "Intrinsic resistance" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "resistant", notes: "Intrinsic resistance" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Intrinsic resistance" }
    ]
  },

  // Neisseria meningitidis (Meningococcus)
  12: {
    pathogenName: "Neisseria meningitidis",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", notes: "First-line for meningitis" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Alternative if resistant" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "Resistant strains cover" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "medium", notes: "Respiratory isolates" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", notes: "Prophylaxis option" }
    ]
  },

  // Moraxella catarrhalis
  13: {
    pathogenName: "Moraxella catarrhalis",
    antibiotics: [
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Excellent choice" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "high", notes: "Good oral option" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "high", notes: "Older children" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "low", notes: "Beta-lactamase resistance" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "low", notes: "Beta-lactamase producing" }
    ]
  },

  // Mycoplasma pneumoniae
  14: {
    pathogenName: "Mycoplasma pneumoniae",
    antibiotics: [
      { antibioticId: 5, name: "Azithromycin", effectiveness: "high", notes: "First-line atypical coverage" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "high", notes: "Older children" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", notes: "Alternative option" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "low", notes: "Atypicals resistant" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "No cell wall" }
    ]
  },

  // Streptococcus anginosus
  15: {
    pathogenName: "Streptococcus anginosus",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", notes: "Drug of choice" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Good alternative" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "high", notes: "Lung abscess coverage" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "For allergic patients" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "high", notes: "Equivalent to penicillin" }
    ]
  },

  // Kingella kingae
  16: {
    pathogenName: "Kingella kingae",
    antibiotics: [
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "First-line for bone/joint" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", notes: "Alternative for serious infections" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "high", notes: "Susceptible strains" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", notes: "Susceptible strains" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "medium", notes: "For resistant strains" }
    ]
  },

  // Staphylococcus saprophyticus
  17: {
    pathogenName: "Staphylococcus saprophyticus",
    antibiotics: [
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "high", notes: "UTI treatment" },
      { antibioticId: 10, name: "Trimethoprim-Sulfamethoxazole", effectiveness: "high", notes: "Standard UTI therapy" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "high", notes: "Alternative option" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "medium", notes: "May work depending on strain" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "low", notes: "Poor oral bioavailability for UTI" }
    ]
  },

  // Coagulase-negative Staphylococcus (CoNS)
  18: {
    pathogenName: "Coagulase-negative Staphylococcus",
    antibiotics: [
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "Often methicillin-resistant" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "high", notes: "Device infections" },
      { antibioticId: 13, name: "Cefazolin", effectiveness: "medium", notes: "Depends on susceptibility" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "medium", notes: "Some susceptibility" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Usually methicillin-resistant" }
    ]
  },

  // Bartonella species
  19: {
    pathogenName: "Bartonella species",
    antibiotics: [
      { antibioticId: 5, name: "Azithromycin", effectiveness: "high", notes: "First-line for cat-scratch disease" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "high", notes: "Good option for older children" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", notes: "Alternative option" },
      { antibioticId: 15, name: "Ampicillin", effectiveness: "low", notes: "Limited effectiveness" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "low", notes: "Limited effectiveness" }
    ]
  },

  // Fusobacterium species (Anaerobic)
  20: {
    pathogenName: "Fusobacterium species",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", notes: "First-line for anaerobes" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Good beta-lactam alternative" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "high", notes: "Lung abscess coverage" },
      { antibioticId: 12, name: "Metronidazole", effectiveness: "high", notes: "Good anaerobic coverage" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "Serious infections" }
    ]
  },

  // Group B Streptococcus (GBS)
  21: {
    pathogenName: "Group B Streptococcus",
    antibiotics: [
      { antibioticId: 15, name: "Ampicillin", effectiveness: "high", notes: "First-line for neonatal sepsis" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", notes: "Alternative to ampicillin" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "PCN-allergic patients" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Good alternative" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "medium", notes: "Some use for RTx" }
    ]
  },

  // Enterobacter species
  22: {
    pathogenName: "Enterobacter species",
    antibiotics: [
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", notes: "Best choice for serious infections" },
      { antibioticId: 14, name: "Piperacillin-Tazobactam", effectiveness: "high", notes: "Good activity" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "low", notes: "Induce AmpC resistance" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", notes: "Some activity" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Intrinsic resistance" }
    ]
  },

  // Citrobacter species
  23: {
    pathogenName: "Citrobacter species",
    antibiotics: [
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", notes: "Best option for serious infections" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "low", notes: "Risk of resistance" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "medium", notes: "Some activity" },
      { antibioticId: 7, name: "Gentamicin", effectiveness: "medium", notes: "Combination therapy" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Intrinsic resistance" }
    ]
  },

  // Proteus species
  24: {
    pathogenName: "Proteus species",
    antibiotics: [
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "First-line UTI treatment" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "high", notes: "Good UTI option" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", notes: "Serious infections" },
      { antibioticId: 7, name: "Gentamicin", effectiveness: "medium", notes: "Synergy with beta-lactams" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Intrinsic resistance" }
    ]
  },

  // Microaerophilic streptococci
  25: {
    pathogenName: "Microaerophilic streptococci",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", notes: "First-line for oral flora" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "high", notes: "Good alternative" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "high", notes: "For allergic patients" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "high", notes: "Head and neck infections" },
      { antibioticId: 5, name: "Azithromycin", effectiveness: "medium", notes: "Some resistance" }
    ]
  },

  // Nontuberculous mycobacteria (NTM)
  26: {
    pathogenName: "Nontuberculous mycobacteria",
    antibiotics: [
      { antibioticId: 5, name: "Azithromycin", effectiveness: "high", notes: "Backbone of therapy" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "medium", notes: "Alternative option" },
      { antibioticId: 11, name: "Linezolid", effectiveness: "medium", notes: "Difficult cases" },
      { antibioticId: 3, name: "Ciprofloxacin", effectiveness: "low", notes: "Limited activity" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "low", notes: "Poor intracellular penetration" }
    ]
  },

  // Anaerobes (mixed flora)
  27: {
    pathogenName: "Anaerobes",
    antibiotics: [
      { antibioticId: 1, name: "Penicillin", effectiveness: "high", notes: "First-line for anaerobes" },
      { antibioticId: 12, name: "Metronidazole", effectiveness: "high", notes: "Excellent anaerobic coverage" },
      { antibioticId: 6, name: "Clindamycin", effectiveness: "high", notes: "Good lung abscess coverage" },
      { antibioticId: 8, name: "Meropenem", effectiveness: "high", notes: "Serious polymicrobial infections" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "medium", notes: "Some anaerobic activity" }
    ]
  },

  // Herpes Simplex Virus (HSV)
  28: {
    pathogenName: "Herpes Simplex Virus",
    antibiotics: [
      { antibioticId: 11, name: "Linezolid", effectiveness: "medium", notes: "Off-label use explored" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "low", notes: "No antiviral activity" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "low", notes: "No specific antiviral activity" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Virus, not bacteria" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "resistant", notes: "Virus, not bacteria" }
    ]
  },

  // Respiratory viruses (Influenza, RSV, etc.)
  29: {
    pathogenName: "Respiratory viruses",
    antibiotics: [
      { antibioticId: 5, name: "Azithromycin", effectiveness: "low", notes: "May reduce duration slightly" },
      { antibioticId: 9, name: "Doxycycline", effectiveness: "low", notes: "No direct antiviral activity" },
      { antibioticId: 1, name: "Penicillin", effectiveness: "resistant", notes: "Viral infection" },
      { antibioticId: 2, name: "Vancomycin", effectiveness: "resistant", notes: "Viral infection" },
      { antibioticId: 4, name: "Ceftriaxone", effectiveness: "resistant", notes: "Viral infection" }
    ]
  }
};

// Helper functions for sophomore developers
export const getAntibioticsForPathogen = (pathogenId: number): PathogenAntibioticRelationship[] => {
  return pathogenAntibioticMap[pathogenId]?.antibiotics || [];
};

export const getEffectivenessForPair = (pathogenId: number, antibioticId: number): string | null => {
  const pathogen = pathogenAntibioticMap[pathogenId];
  if (!pathogen) return null;

  const antibiotic = pathogen.antibiotics.find(ab => ab.antibioticId === antibioticId);
  return antibiotic?.effectiveness || null;
};

export const getHighEffectivenessAntibiotics = (pathogenId: number): PathogenAntibioticRelationship[] => {
  const antibiotics = getAntibioticsForPathogen(pathogenId);
  return antibiotics.filter(ab => ab.effectiveness === "high");
};

export const getResistantAntibiotics = (pathogenId: number): PathogenAntibioticRelationship[] => {
  const antibiotics = getAntibioticsForPathogen(pathogenId);
  return antibiotics.filter(ab => ab.effectiveness === "resistant");
};

interface PathogenForAntibioticResult {
  pathogenId: number;
  pathogenName: string;
  effectiveness: string;
  notes: string;
}

export const getPathogensForAntibiotic = (antibioticId: number): PathogenForAntibioticResult[] => {
  const results: PathogenForAntibioticResult[] = [];

  Object.keys(pathogenAntibioticMap).forEach(pathogenId => {
    const pathogen = pathogenAntibioticMap[parseInt(pathogenId)];
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

interface EffectivenessStats {
  high: number;
  medium: number;
  low: number;
  resistant: number;
}

export const getEffectivenessStats = (): EffectivenessStats => {
  const stats: EffectivenessStats = {
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
export const validateRelationshipData = (): string[] | null => {
  const errors: string[] = [];

  Object.keys(pathogenAntibioticMap).forEach(pathogenId => {
    const pathogen = pathogenAntibioticMap[parseInt(pathogenId)];

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
