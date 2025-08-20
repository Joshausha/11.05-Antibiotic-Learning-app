/**
 * Simple Antibiotic Data
 * Sophomore-level data structure for 15 common antibiotics
 * Easy to understand and modify
 */

const simpleAntibiotics = [
  {
    id: 1,
    name: "Penicillin",
    category: "Beta-lactam",
    class: "Penicillin",
    description: "First antibiotic discovered, effective against gram-positive bacteria",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/PO",
    commonUses: ["Strep throat", "Pneumococcal infections"],
    resistance: "Beta-lactamase producing bacteria",
    sideEffects: ["Allergic reactions", "GI upset"]
  },
  {
    id: 2,
    name: "Vancomycin",
    category: "Glycopeptide",
    class: "Glycopeptide",
    description: "Reserve antibiotic for MRSA and severe gram-positive infections",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV",
    commonUses: ["MRSA infections", "C. diff colitis"],
    resistance: "VRE (vancomycin-resistant enterococci)",
    sideEffects: ["Kidney toxicity", "Red man syndrome"]
  },
  {
    id: 3,
    name: "Ciprofloxacin",
    category: "Fluoroquinolone",
    class: "Quinolone",
    description: "Broad-spectrum antibiotic effective against gram-negative bacteria",
    mechanism: "DNA synthesis inhibition",
    route: "IV/PO",
    commonUses: ["UTI", "Pseudomonas infections"],
    resistance: "Chromosomal mutations",
    sideEffects: ["Tendon rupture", "CNS effects"]
  },
  {
    id: 4,
    name: "Ceftriaxone",
    category: "Beta-lactam",
    class: "3rd generation cephalosporin",
    description: "Third-generation cephalosporin with broad spectrum activity",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/IM",
    commonUses: ["Pneumonia", "Meningitis", "Gonorrhea"],
    resistance: "ESBL-producing bacteria",
    sideEffects: ["Diarrhea", "Injection site reactions"]
  },
  {
    id: 5,
    name: "Azithromycin",
    category: "Macrolide",
    class: "Macrolide",
    description: "Macrolide antibiotic with good tissue penetration",
    mechanism: "Protein synthesis inhibition",
    route: "PO/IV",
    commonUses: ["Atypical pneumonia", "Chlamydia"],
    resistance: "Ribosomal mutations",
    sideEffects: ["GI upset", "QT prolongation"]
  },
  {
    id: 6,
    name: "Clindamycin",
    category: "Lincosamide",
    class: "Lincosamide",
    description: "Good anaerobic coverage and skin/soft tissue infections",
    mechanism: "Protein synthesis inhibition",
    route: "IV/PO",
    commonUses: ["Skin infections", "Anaerobic infections"],
    resistance: "Ribosomal methylation",
    sideEffects: ["C. diff colitis", "Diarrhea"]
  },
  {
    id: 7,
    name: "Gentamicin",
    category: "Aminoglycoside",
    class: "Aminoglycoside",
    description: "Aminoglycoside with gram-negative activity",
    mechanism: "Protein synthesis inhibition",
    route: "IV/IM",
    commonUses: ["Gram-negative sepsis", "Endocarditis"],
    resistance: "Enzymatic modification",
    sideEffects: ["Kidney toxicity", "Hearing loss"]
  },
  {
    id: 8,
    name: "Meropenem",
    category: "Beta-lactam",
    class: "Carbapenem",
    description: "Broad-spectrum carbapenem for serious infections",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV",
    commonUses: ["Multi-drug resistant infections", "Severe sepsis"],
    resistance: "Carbapenemases (CRE)",
    sideEffects: ["Seizures", "Diarrhea"]
  },
  {
    id: 9,
    name: "Doxycycline",
    category: "Tetracycline",
    class: "Tetracycline",
    description: "Tetracycline with good oral bioavailability",
    mechanism: "Protein synthesis inhibition",
    route: "PO/IV",
    commonUses: ["Atypical infections", "Tick-borne diseases"],
    resistance: "Efflux pumps",
    sideEffects: ["Photosensitivity", "Tooth discoloration"]
  },
  {
    id: 10,
    name: "Trimethoprim-Sulfamethoxazole",
    category: "Folate inhibitor",
    class: "Sulfonamide combination",
    description: "Combination antibiotic with broad activity",
    mechanism: "Folate synthesis inhibition",
    route: "PO/IV",
    commonUses: ["UTI", "PCP pneumonia", "MRSA skin infections"],
    resistance: "Folate pathway mutations",
    sideEffects: ["Hyperkalemia", "Skin reactions"]
  },
  {
    id: 11,
    name: "Linezolid",
    category: "Oxazolidinone",
    class: "Oxazolidinone",
    description: "MRSA and VRE active antibiotic",
    mechanism: "Protein synthesis inhibition",
    route: "PO/IV",
    commonUses: ["MRSA pneumonia", "VRE infections"],
    resistance: "Ribosomal mutations (rare)",
    sideEffects: ["Thrombocytopenia", "Neuropathy"]
  },
  {
    id: 12,
    name: "Metronidazole",
    category: "Nitroimidazole",
    class: "Nitroimidazole",
    description: "Excellent anaerobic and protozoal coverage",
    mechanism: "DNA damage",
    route: "PO/IV",
    commonUses: ["Anaerobic infections", "C. diff", "Giardia"],
    resistance: "Uncommon",
    sideEffects: ["Metallic taste", "Disulfiram reaction"]
  },
  {
    id: 13,
    name: "Cefazolin",
    category: "Beta-lactam",
    class: "1st generation cephalosporin",
    description: "First-generation cephalosporin for gram-positive infections",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/IM",
    commonUses: ["Skin infections", "Surgical prophylaxis"],
    resistance: "Beta-lactamases",
    sideEffects: ["Allergic reactions", "Diarrhea"]
  },
  {
    id: 14,
    name: "Piperacillin-Tazobactam",
    category: "Beta-lactam",
    class: "Penicillin + Beta-lactamase inhibitor",
    description: "Broad-spectrum penicillin with beta-lactamase inhibitor",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV",
    commonUses: ["Hospital-acquired pneumonia", "Intra-abdominal infections"],
    resistance: "AmpC beta-lactamases",
    sideEffects: ["Diarrhea", "Electrolyte abnormalities"]
  },
  {
    id: 15,
    name: "Ampicillin",
    category: "Beta-lactam",
    class: "Penicillin",
    description: "Extended-spectrum penicillin",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/PO",
    commonUses: ["Enterococcal infections", "Listeria meningitis"],
    resistance: "Beta-lactamase producing bacteria",
    sideEffects: ["Rash", "GI upset"]
  },
  {
    id: 16,
    name: "Amoxicillin",
    category: "Beta-lactam",
    class: "Penicillin",
    description: "Oral penicillin commonly used for outpatient infections",
    mechanism: "Cell wall synthesis inhibition",
    route: "PO",
    commonUses: ["Strep throat", "Otitis media", "Sinusitis"],
    resistance: "Beta-lactamase producing bacteria",
    sideEffects: ["Rash", "Diarrhea", "GI upset"]
  },
  {
    id: 17,
    name: "Amoxicillin-clavulanate",
    category: "Beta-lactam",
    class: "Penicillin + Beta-lactamase inhibitor",
    description: "Amoxicillin with clavulanic acid to overcome beta-lactamase resistance",
    mechanism: "Cell wall synthesis inhibition",
    route: "PO",
    commonUses: ["Otitis media", "Sinusitis", "Pneumonia"],
    resistance: "AmpC beta-lactamases",
    sideEffects: ["Diarrhea", "Hepatotoxicity", "GI upset"]
  },
  {
    id: 18,
    name: "Ampicillin/sulbactam",
    category: "Beta-lactam",
    class: "Penicillin + Beta-lactamase inhibitor",
    description: "Ampicillin with sulbactam for broader spectrum coverage",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/IM",
    commonUses: ["Skin infections", "Intra-abdominal infections", "Aspiration pneumonia"],
    resistance: "AmpC beta-lactamases",
    sideEffects: ["Injection site reactions", "Diarrhea"]
  },
  {
    id: 19,
    name: "Cefdinir",
    category: "Beta-lactam",
    class: "3rd generation cephalosporin",
    description: "Oral third-generation cephalosporin for outpatient use",
    mechanism: "Cell wall synthesis inhibition",
    route: "PO",
    commonUses: ["Otitis media", "Sinusitis", "Pharyngitis"],
    resistance: "ESBL-producing bacteria",
    sideEffects: ["Diarrhea", "Red stools", "GI upset"]
  },
  {
    id: 20,
    name: "Cefepime",
    category: "Beta-lactam",
    class: "4th generation cephalosporin",
    description: "Fourth-generation cephalosporin with anti-pseudomonal activity",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/IM",
    commonUses: ["Hospital-acquired pneumonia", "Febrile neutropenia", "Pseudomonas infections"],
    resistance: "Carbapenemases",
    sideEffects: ["Seizures", "Encephalopathy", "Diarrhea"]
  },
  {
    id: 21,
    name: "Cefotaxime",
    category: "Beta-lactam",
    class: "3rd generation cephalosporin",
    description: "Third-generation cephalosporin for serious infections",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/IM",
    commonUses: ["Meningitis", "Severe pneumonia", "Sepsis"],
    resistance: "ESBL-producing bacteria",
    sideEffects: ["Injection site reactions", "Diarrhea"]
  },
  {
    id: 22,
    name: "Cefpodoxime",
    category: "Beta-lactam",
    class: "3rd generation cephalosporin",
    description: "Oral third-generation cephalosporin",
    mechanism: "Cell wall synthesis inhibition",
    route: "PO",
    commonUses: ["Otitis media", "Pharyngitis", "UTI"],
    resistance: "ESBL-producing bacteria",
    sideEffects: ["Diarrhea", "GI upset"]
  },
  {
    id: 23,
    name: "Ceftaroline",
    category: "Beta-lactam",
    class: "5th generation cephalosporin",
    description: "Advanced cephalosporin active against MRSA",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV",
    commonUses: ["MRSA pneumonia", "Complicated skin infections"],
    resistance: "Rare resistance mechanisms",
    sideEffects: ["Diarrhea", "Nausea", "Infusion reactions"]
  },
  {
    id: 24,
    name: "Cefuroxime",
    category: "Beta-lactam",
    class: "2nd generation cephalosporin",
    description: "Second-generation cephalosporin with good gram-positive coverage",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/PO",
    commonUses: ["Pneumonia", "Skin infections", "UTI"],
    resistance: "Beta-lactamases",
    sideEffects: ["Diarrhea", "GI upset"]
  },
  {
    id: 25,
    name: "Cephalexin",
    category: "Beta-lactam",
    class: "1st generation cephalosporin",
    description: "Oral first-generation cephalosporin for outpatient use",
    mechanism: "Cell wall synthesis inhibition",
    route: "PO",
    commonUses: ["Skin infections", "UTI", "Strep throat"],
    resistance: "Beta-lactamases",
    sideEffects: ["Diarrhea", "GI upset", "Allergic reactions"]
  },
  {
    id: 26,
    name: "Daptomycin",
    category: "Lipopeptide",
    class: "Lipopeptide",
    description: "Lipopeptide antibiotic for gram-positive infections",
    mechanism: "Cell membrane disruption",
    route: "IV",
    commonUses: ["MRSA bacteremia", "Endocarditis", "Complicated skin infections"],
    resistance: "Membrane modifications (rare)",
    sideEffects: ["Muscle toxicity", "Elevated CPK"]
  },
  {
    id: 27,
    name: "Levofloxacin",
    category: "Fluoroquinolone",
    class: "Quinolone",
    description: "Broad-spectrum fluoroquinolone with good tissue penetration",
    mechanism: "DNA synthesis inhibition",
    route: "IV/PO",
    commonUses: ["Pneumonia", "UTI", "Sinusitis"],
    resistance: "Chromosomal mutations",
    sideEffects: ["Tendon rupture", "CNS effects", "QT prolongation"]
  },
  {
    id: 28,
    name: "Nafcillin",
    category: "Beta-lactam",
    class: "Penicillin",
    description: "Anti-staphylococcal penicillin resistant to beta-lactamases",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/IM",
    commonUses: ["MSSA infections", "Endocarditis", "Osteomyelitis"],
    resistance: "Methicillin resistance (MRSA)",
    sideEffects: ["Injection site reactions", "Phlebitis"]
  },
  {
    id: 29,
    name: "Oxacillin",
    category: "Beta-lactam",
    class: "Penicillin",
    description: "Anti-staphylococcal penicillin for MSSA infections",
    mechanism: "Cell wall synthesis inhibition",
    route: "IV/IM",
    commonUses: ["MSSA infections", "Skin infections", "Pneumonia"],
    resistance: "Methicillin resistance (MRSA)",
    sideEffects: ["Injection site reactions", "Hepatotoxicity"]
  },
  {
    id: 30,
    name: "TMP-SMX",
    category: "Folate inhibitor",
    class: "Sulfonamide combination",
    description: "Trimethoprim-sulfamethoxazole combination (same as Trimethoprim-Sulfamethoxazole)",
    mechanism: "Folate synthesis inhibition",
    route: "PO/IV",
    commonUses: ["UTI", "PCP pneumonia", "MRSA skin infections"],
    resistance: "Folate pathway mutations",
    sideEffects: ["Hyperkalemia", "Skin reactions"]
  }
];

// Helper functions for sophomore developers
export const getAntibioticById = (id) => {
  return simpleAntibiotics.find(antibiotic => antibiotic.id === id);
};

export const getAntibioticByName = (name) => {
  return simpleAntibiotics.find(antibiotic => 
    antibiotic.name.toLowerCase() === name.toLowerCase()
  );
};

export const getAntibioticsByClass = (drugClass) => {
  return simpleAntibiotics.filter(antibiotic => antibiotic.class === drugClass);
};

export const getAntibioticsByCategory = (category) => {
  return simpleAntibiotics.filter(antibiotic => antibiotic.category === category);
};

export const searchAntibiotics = (searchTerm) => {
  if (!searchTerm) return simpleAntibiotics;
  
  const term = searchTerm.toLowerCase();
  return simpleAntibiotics.filter(antibiotic =>
    antibiotic.name.toLowerCase().includes(term) ||
    antibiotic.class.toLowerCase().includes(term) ||
    antibiotic.description.toLowerCase().includes(term)
  );
};

export const getAllDrugClasses = () => {
  const classes = simpleAntibiotics.map(antibiotic => antibiotic.class);
  return [...new Set(classes)].sort();
};

export const getAllCategories = () => {
  const categories = simpleAntibiotics.map(antibiotic => antibiotic.category);
  return [...new Set(categories)].sort();
};

// Data validation function
export const validateAntibioticData = () => {
  const errors = [];
  
  simpleAntibiotics.forEach(antibiotic => {
    if (!antibiotic.name) errors.push(`Antibiotic ${antibiotic.id} missing name`);
    if (!antibiotic.class) errors.push(`Antibiotic ${antibiotic.id} missing class`);
    if (!antibiotic.mechanism) errors.push(`Antibiotic ${antibiotic.id} missing mechanism`);
  });
  
  return errors.length === 0 ? null : errors;
};

export default simpleAntibiotics;