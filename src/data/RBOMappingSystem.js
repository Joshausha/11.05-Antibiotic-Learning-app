/**
 * RBO Clinical Guidelines Mapping System
 * Maps RBO_JSON clinical conditions to educational application data
 * Updated: 2025-07-17 14:30:00
 */

import simpleAntibiotics from './SimpleAntibioticData.js';
import simplePathogens from './SimplePathogenData.js';

// RBO Clinical Conditions with mapped application data
export const rboConditionsMap = [
  {
    id: "uncomplicated_bloodstream_infection_nonneonates",
    category: "Bloodstream Infection in Nonneonates", 
    name: "Uncomplicated Bloodstream Infection",
    mappedPathogens: [
      "Staphylococcus aureus",
      "Enterococcus faecalis", 
      "Enterococcus faecium",
      "Escherichia coli",
      "Klebsiella pneumoniae",
      "Enterobacter species",
      "Pseudomonas aeruginosa",
      "Coagulase-negative Staphylococcus"
    ],
    mappedAntibiotics: [
      "Cefazolin", "Oxacillin", "Nafcillin", "Vancomycin", 
      "Linezolid", "Daptomycin", "Ceftaroline", "Ampicillin"
    ],
    duration: "14 days from first negative blood culture",
    severity: "high"
  },
  {
    id: "osteomyelitis",
    category: "Bone/Joint",
    name: "Osteomyelitis", 
    mappedPathogens: [
      "Staphylococcus aureus",
      "Streptococcus pyogenes",
      "Kingella kingae"
    ],
    mappedAntibiotics: [
      "Cefazolin", "Oxacillin", "Nafcillin", "Vancomycin", 
      "Clindamycin", "Linezolid", "Daptomycin"
    ],
    duration: "3-4 weeks",
    severity: "high"
  },
  {
    id: "septic_arthritis", 
    category: "Bone/Joint",
    name: "Septic arthritis",
    mappedPathogens: [
      "Staphylococcus aureus",
      "Streptococcus pyogenes", 
      "Kingella kingae"
    ],
    mappedAntibiotics: [
      "Cefazolin", "Oxacillin", "Nafcillin", "Vancomycin",
      "Clindamycin", "Linezolid", "Daptomycin"
    ],
    duration: "2-3 weeks",
    severity: "high"
  },
  {
    id: "meningitis_non_neonates",
    category: "Central Nervous System", 
    name: "Meningitis (non-neonates)",
    mappedPathogens: [
      "Streptococcus pneumoniae",
      "Neisseria meningitidis",
      "Haemophilus influenzae"
    ],
    mappedAntibiotics: [
      "Ceftriaxone", "Vancomycin"
    ],
    duration: "S pneumoniae: 10-14 days, H influenzae: 7-10 days, N meningitidis: 5-7 days",
    severity: "high"
  },
  {
    id: "mastoiditis",
    category: "Ear, Nose, and Throat",
    name: "Mastoiditis",
    mappedPathogens: [
      "Streptococcus pneumoniae",
      "Streptococcus pyogenes", 
      "Staphylococcus aureus",
      "Haemophilus influenzae",
      "Microaerophilic streptococci",
      "Fusobacterium species",
      "Pseudomonas aeruginosa"
    ],
    mappedAntibiotics: [
      "Ampicillin/sulbactam", "Ceftriaxone", "Clindamycin", 
      "Cefepime", "Levofloxacin"
    ],
    duration: "2-4 weeks",
    severity: "medium"
  },
  {
    id: "acute_sinusitis",
    category: "Ear, Nose, and Throat",
    name: "Acute sinusitis", 
    mappedPathogens: [
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Moraxella catarrhalis"
    ],
    mappedAntibiotics: [
      "Amoxicillin", "Amoxicillin-clavulanate", "Clindamycin", "Levofloxacin"
    ],
    duration: "5-7 days",
    severity: "low"
  },
  {
    id: "acute_otitis_media",
    category: "Ear, Nose, and Throat", 
    name: "Acute otitis media",
    mappedPathogens: [
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Moraxella catarrhalis"
    ],
    mappedAntibiotics: [
      "Amoxicillin", "Amoxicillin-clavulanate", "Cefdinir", 
      "Cefpodoxime", "Cefuroxime", "Ceftriaxone"
    ],
    duration: ">6 y: 5 days, 2-5 y: 7 days, <2 y: 10 days",
    severity: "low"
  },
  {
    id: "streptococcal_pharyngitis",
    category: "Ear, Nose, and Throat",
    name: "Streptococcal pharyngitis",
    mappedPathogens: [
      "Streptococcus pyogenes"
    ],
    mappedAntibiotics: [
      "Penicillin", "Amoxicillin", "Cephalexin", "Clindamycin", "Azithromycin"
    ],
    duration: "10 days", 
    severity: "low"
  },
  {
    id: "retropharyngeal_abscess",
    category: "Ear, Nose, and Throat",
    name: "Retropharyngeal abscess",
    mappedPathogens: [
      "Streptococcus pyogenes",
      "Anaerobes",
      "Staphylococcus aureus", 
      "Streptococcus anginosus",
      "Haemophilus influenzae"
    ],
    mappedAntibiotics: [
      "Ampicillin/sulbactam", "Clindamycin", "Vancomycin", "Linezolid"
    ],
    duration: "14 days",
    severity: "high"
  },
  {
    id: "uti_pyelonephritis", 
    category: "Genitourinary",
    name: "UTI - pyelonephritis",
    mappedPathogens: [
      "Escherichia coli",
      "Klebsiella pneumoniae",
      "Proteus species",
      "Enterobacter species", 
      "Citrobacter species",
      "Enterococcus faecalis",
      "Staphylococcus saprophyticus"
    ],
    mappedAntibiotics: [
      "Cephalexin", "TMP-SMX", "Ampicillin", "Gentamicin", 
      "Ceftriaxone", "Ciprofloxacin"
    ],
    duration: "7-10 days (hospitalized), 5-10 days (outpatient)",
    severity: "medium"
  },
  {
    id: "intra_abdominal_infection",
    category: "Intra-abdominal", 
    name: "Intra-abdominal infection",
    mappedPathogens: [
      "Escherichia coli",
      "Anaerobes",
      "Klebsiella pneumoniae"
    ],
    mappedAntibiotics: [
      "Ceftriaxone", "Metronidazole", "Piperacillin-Tazobactam", "Ciprofloxacin"
    ],
    duration: "4-7 days from source control",
    severity: "medium"
  },
  {
    id: "community_acquired_pneumonia",
    category: "Respiratory",
    name: "Community-acquired pneumonia (CAP)",
    mappedPathogens: [
      "Streptococcus pneumoniae",
      "Mycoplasma pneumoniae", 
      "Streptococcus pyogenes",
      "Staphylococcus aureus",
      "Haemophilus influenzae",
      "Moraxella catarrhalis",
      "Respiratory viruses"
    ],
    mappedAntibiotics: [
      "Amoxicillin", "Ampicillin", "Penicillin", "Clindamycin", 
      "Levofloxacin", "Ceftriaxone", "Azithromycin", "Vancomycin", "Linezolid"
    ],
    duration: "5 days for uncomplicated CAP",
    severity: "medium"
  },
  {
    id: "cellulitis_nonpurulent",
    category: "Skin and Soft Tissue Infections",
    name: "Cellulitis (nonpurulent)", 
    mappedPathogens: [
      "Streptococcus pyogenes",
      "Staphylococcus aureus"
    ],
    mappedAntibiotics: [
      "Cefazolin", "Oxacillin", "Nafcillin", "Cephalexin", "Clindamycin", 
      "TMP-SMX", "Doxycycline", "Vancomycin", "Linezolid", "Ceftaroline", "Daptomycin"
    ],
    duration: "5-7 days",
    severity: "medium"
  },
  {
    id: "purulent_cellulitis_abscess",
    category: "Skin and Soft Tissue Infections", 
    name: "Purulent cellulitis/Abscess",
    mappedPathogens: [
      "Staphylococcus aureus"
    ],
    mappedAntibiotics: [
      "Cefazolin", "Cephalexin", "TMP-SMX", "Clindamycin", 
      "Doxycycline", "Vancomycin", "Linezolid", "Ceftaroline", "Daptomycin"
    ],
    duration: "5-7 days",
    severity: "medium"
  },
  {
    id: "lymphadenitis",
    category: "Skin and Soft Tissue Infections",
    name: "Lymphadenitis",
    mappedPathogens: [
      "Streptococcus pyogenes",
      "Staphylococcus aureus",
      "Bartonella species", 
      "Nontuberculous mycobacteria"
    ],
    mappedAntibiotics: [
      "Cefazolin", "Cephalexin", "Clindamycin"
    ],
    duration: "5-7 days",
    severity: "low"
  }
];

// Helper functions for mapping RBO data to application
export const getConditionsByCategory = (category) => {
  return rboConditionsMap.filter(condition => condition.category === category);
};

export const getConditionById = (id) => {
  return rboConditionsMap.find(condition => condition.id === id);
};

export const getConditionsBySeverity = (severity) => {
  return rboConditionsMap.filter(condition => condition.severity === severity);
};

export const getAntibioticsForCondition = (conditionId) => {
  const condition = getConditionById(conditionId);
  if (!condition) return [];
  
  return condition.mappedAntibiotics.map(antibioticName => {
    return simpleAntibiotics.find(ab => 
      ab.name.toLowerCase() === antibioticName.toLowerCase() ||
      ab.name.toLowerCase().includes(antibioticName.toLowerCase())
    );
  }).filter(Boolean);
};

export const getPathogensForCondition = (conditionId) => {
  const condition = getConditionById(conditionId);
  if (!condition) return [];
  
  return condition.mappedPathogens.map(pathogenName => {
    return simplePathogens.find(pathogen => 
      pathogen.name.toLowerCase() === pathogenName.toLowerCase() ||
      pathogen.name.toLowerCase().includes(pathogenName.toLowerCase()) ||
      pathogen.commonName.toLowerCase().includes(pathogenName.toLowerCase())
    );
  }).filter(Boolean);
};

export const getConditionsForAntibiotic = (antibioticName) => {
  return rboConditionsMap.filter(condition =>
    condition.mappedAntibiotics.some(ab => 
      ab.toLowerCase().includes(antibioticName.toLowerCase())
    )
  );
};

export const getConditionsForPathogen = (pathogenName) => {
  return rboConditionsMap.filter(condition =>
    condition.mappedPathogens.some(pathogen => 
      pathogen.toLowerCase().includes(pathogenName.toLowerCase())
    )
  );
};

// Data validation for RBO mapping
export const validateRBOMapping = () => {
  const errors = [];
  
  rboConditionsMap.forEach(condition => {
    // Check if mapped antibiotics exist in our data
    condition.mappedAntibiotics.forEach(antibioticName => {
      const found = simpleAntibiotics.find(ab => 
        ab.name.toLowerCase() === antibioticName.toLowerCase() ||
        ab.name.toLowerCase().includes(antibioticName.toLowerCase())
      );
      if (!found) {
        errors.push(`Antibiotic '${antibioticName}' in condition '${condition.name}' not found in application data`);
      }
    });
    
    // Check if mapped pathogens exist in our data
    condition.mappedPathogens.forEach(pathogenName => {
      const found = simplePathogens.find(pathogen => 
        pathogen.name.toLowerCase() === pathogenName.toLowerCase() ||
        pathogen.name.toLowerCase().includes(pathogenName.toLowerCase()) ||
        pathogen.commonName.toLowerCase().includes(pathogenName.toLowerCase())
      );
      if (!found) {
        errors.push(`Pathogen '${pathogenName}' in condition '${condition.name}' not found in application data`);
      }
    });
  });
  
  return errors.length === 0 ? null : errors;
};

// Statistics about RBO coverage
export const getRBOCoverageStats = () => {
  const totalConditions = rboConditionsMap.length;
  const uniqueAntibiotics = new Set();
  const uniquePathogens = new Set();
  
  rboConditionsMap.forEach(condition => {
    condition.mappedAntibiotics.forEach(ab => uniqueAntibiotics.add(ab.toLowerCase()));
    condition.mappedPathogens.forEach(pathogen => uniquePathogens.add(pathogen.toLowerCase()));
  });
  
  return {
    totalConditions,
    uniqueAntibiotics: uniqueAntibiotics.size,
    uniquePathogens: uniquePathogens.size,
    categories: [...new Set(rboConditionsMap.map(c => c.category))].length,
    severityDistribution: {
      high: rboConditionsMap.filter(c => c.severity === 'high').length,
      medium: rboConditionsMap.filter(c => c.severity === 'medium').length,
      low: rboConditionsMap.filter(c => c.severity === 'low').length
    }
  };
};

export default rboConditionsMap;