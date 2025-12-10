/**
 * Simple Antibiotic Data
 * Sophomore-level data structure for 15 common antibiotics
 * Easy to understand and modify
 */

export interface SimpleAntibiotic {
  id: number;
  name: string;
  category: string;
  class: string;
  description: string;
  mechanism: string;
  spectrum: string;
  route: string;
  commonUses: string[];
  resistance: string;
  sideEffects: string;
}

const simpleAntibiotics: SimpleAntibiotic[] = [
  {
    id: 1,
    name: "Penicillin",
    category: "Beta-lactam",
    class: "Penicillins",
    description: "First antibiotic discovered, effective against gram-positive bacteria",
    mechanism: "Cell wall synthesis inhibition via peptidoglycan binding",
    spectrum: "Narrow; gram-positive cocci including streptococci",
    route: "IV/PO",
    commonUses: ["Strep throat", "Pneumococcal infections"],
    resistance: "Beta-lactamase producing bacteria",
    sideEffects: "Allergic reactions and gastrointestinal upset commonly observed"
  },
  {
    id: 2,
    name: "Vancomycin",
    category: "Glycopeptide",
    class: "Glycopeptides",
    description: "Reserve antibiotic for MRSA and severe gram-positive infections",
    mechanism: "Cell wall synthesis inhibition via peptidoglycan binding",
    spectrum: "Narrow; gram-positive coverage including MRSA and resistant organisms",
    route: "IV",
    commonUses: ["MRSA infections", "C. diff colitis"],
    resistance: "VRE (vancomycin-resistant enterococci)",
    sideEffects: "Nephrotoxicity and infusion-related red man syndrome possible"
  },
  {
    id: 3,
    name: "Ciprofloxacin",
    category: "Fluoroquinolone",
    class: "Fluoroquinolones",
    description: "Broad-spectrum antibiotic effective against gram-negative bacteria",
    mechanism: "DNA gyrase and topoisomerase IV inhibition disrupting replication",
    spectrum: "Broad; excellent gram-negative and atypical coverage",
    route: "IV/PO",
    commonUses: ["UTI", "Pseudomonas infections"],
    resistance: "Chromosomal mutations",
    sideEffects: "Tendon rupture risk and central nervous system effects"
  },
  {
    id: 4,
    name: "Ceftriaxone",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "Third-generation cephalosporin with broad spectrum activity",
    mechanism: "Cell wall synthesis inhibition via beta-lactam binding",
    spectrum: "Broad; gram-positive and gram-negative including meningeal penetration",
    route: "IV/IM",
    commonUses: ["Pneumonia", "Meningitis", "Gonorrhea"],
    resistance: "ESBL-producing bacteria",
    sideEffects: "Diarrhea and injection site reactions commonly reported"
  },
  {
    id: 5,
    name: "Azithromycin",
    category: "Macrolide",
    class: "Macrolides",
    description: "Macrolide antibiotic with good tissue penetration",
    mechanism: "Protein synthesis inhibition via 50S ribosomal subunit binding",
    spectrum: "Moderate; atypical organisms and some gram-positive coverage",
    route: "PO/IV",
    commonUses: ["Atypical pneumonia", "Chlamydia"],
    resistance: "Ribosomal mutations",
    sideEffects: "Gastrointestinal upset and QT interval prolongation possible"
  },
  {
    id: 6,
    name: "Clindamycin",
    category: "Lincosamide",
    class: "Lincosamides",
    description: "Good anaerobic coverage and skin/soft tissue infections",
    mechanism: "Protein synthesis inhibition via 50S ribosomal subunit binding",
    spectrum: "Moderate; gram-positive and excellent anaerobic coverage",
    route: "IV/PO",
    commonUses: ["Skin infections", "Anaerobic infections"],
    resistance: "Ribosomal methylation",
    sideEffects: "Clostridioides difficile colitis risk and diarrhea possible"
  },
  {
    id: 7,
    name: "Gentamicin",
    category: "Aminoglycoside",
    class: "Aminoglycosides",
    description: "Aminoglycoside with gram-negative activity",
    mechanism: "Protein synthesis inhibition via 30S ribosomal subunit binding",
    spectrum: "Narrow to moderate; primarily gram-negative coverage",
    route: "IV/IM",
    commonUses: ["Gram-negative sepsis", "Endocarditis"],
    resistance: "Enzymatic modification",
    sideEffects: "Nephrotoxicity and ototoxicity requiring therapeutic monitoring"
  },
  {
    id: 8,
    name: "Meropenem",
    category: "Beta-lactam",
    class: "Carbapenems",
    description: "Broad-spectrum carbapenem for serious infections",
    mechanism: "Cell wall synthesis inhibition via beta-lactam binding",
    spectrum: "Ultra-broad; gram-positive, gram-negative, and anaerobic coverage",
    route: "IV",
    commonUses: ["Multi-drug resistant infections", "Severe sepsis"],
    resistance: "Carbapenemases (CRE)",
    sideEffects: "Seizure risk at high doses and diarrhea commonly reported"
  },
  {
    id: 9,
    name: "Doxycycline",
    category: "Tetracycline",
    class: "Tetracyclines",
    description: "Tetracycline with good oral bioavailability",
    mechanism: "Protein synthesis inhibition via 30S ribosomal subunit binding",
    spectrum: "Broad; atypical organisms and tick-borne pathogen coverage",
    route: "PO/IV",
    commonUses: ["Atypical infections", "Tick-borne diseases"],
    resistance: "Efflux pumps",
    sideEffects: "Photosensitivity reactions and tooth discoloration in children"
  },
  {
    id: 10,
    name: "Trimethoprim-Sulfamethoxazole",
    category: "Folate inhibitor",
    class: "Sulfonamides",
    description: "Combination antibiotic with broad activity",
    mechanism: "Folate synthesis inhibition via sequential enzymatic blockade",
    spectrum: "Broad; gram-positive including MRSA and gram-negative coverage",
    route: "PO/IV",
    commonUses: ["UTI", "PCP pneumonia", "MRSA skin infections"],
    resistance: "Folate pathway mutations",
    sideEffects: "Hyperkalemia risk and severe skin reactions possible"
  },
  {
    id: 11,
    name: "Linezolid",
    category: "Oxazolidinone",
    class: "Oxazolidinones",
    description: "MRSA and VRE active antibiotic",
    mechanism: "Protein synthesis inhibition via unique 23S ribosomal binding",
    spectrum: "Narrow; gram-positive including MRSA and VRE coverage",
    route: "PO/IV",
    commonUses: ["MRSA pneumonia", "VRE infections"],
    resistance: "Ribosomal mutations (rare)",
    sideEffects: "Thrombocytopenia and peripheral neuropathy with prolonged use"
  },
  {
    id: 12,
    name: "Metronidazole",
    category: "Nitroimidazole",
    class: "Nitroimidazoles",
    description: "Excellent anaerobic and protozoal coverage",
    mechanism: "DNA damage via free radical generation in anaerobes",
    spectrum: "Narrow; obligate anaerobic bacteria and protozoal coverage",
    route: "PO/IV",
    commonUses: ["Anaerobic infections", "C. diff", "Giardia"],
    resistance: "Uncommon",
    sideEffects: "Metallic taste and disulfiram-like reaction with alcohol"
  },
  {
    id: 13,
    name: "Cefazolin",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "First-generation cephalosporin for gram-positive infections",
    mechanism: "Cell wall synthesis inhibition via beta-lactam binding",
    spectrum: "Narrow; excellent gram-positive coverage for surgical prophylaxis",
    route: "IV/IM",
    commonUses: ["Skin infections", "Surgical prophylaxis"],
    resistance: "Beta-lactamases",
    sideEffects: "Allergic reactions and diarrhea commonly reported"
  },
  {
    id: 14,
    name: "Piperacillin-Tazobactam",
    category: "Beta-lactam",
    class: "Penicillins",
    description: "Broad-spectrum penicillin with beta-lactamase inhibitor",
    mechanism: "Cell wall synthesis inhibition with beta-lactamase protection",
    spectrum: "Ultra-broad; gram-positive, gram-negative, and Pseudomonas coverage",
    route: "IV",
    commonUses: ["Hospital-acquired pneumonia", "Intra-abdominal infections"],
    resistance: "AmpC beta-lactamases",
    sideEffects: "Diarrhea and electrolyte abnormalities including hypokalemia"
  },
  {
    id: 15,
    name: "Ampicillin",
    category: "Beta-lactam",
    class: "Penicillins",
    description: "Extended-spectrum penicillin",
    mechanism: "Cell wall synthesis inhibition via peptidoglycan binding",
    spectrum: "Moderate; gram-positive and some gram-negative coverage",
    route: "IV/PO",
    commonUses: ["Enterococcal infections", "Listeria meningitis"],
    resistance: "Beta-lactamase producing bacteria",
    sideEffects: "Maculopapular rash and gastrointestinal upset commonly seen"
  },
  {
    id: 16,
    name: "Amoxicillin",
    category: "Beta-lactam",
    class: "Penicillins",
    description: "Oral penicillin commonly used for outpatient infections",
    mechanism: "Cell wall synthesis inhibition via peptidoglycan binding",
    spectrum: "Moderate; gram-positive and selected gram-negative coverage",
    route: "PO",
    commonUses: ["Strep throat", "Otitis media", "Sinusitis"],
    resistance: "Beta-lactamase producing bacteria",
    sideEffects: "Rash, diarrhea, and gastrointestinal upset frequently observed"
  },
  {
    id: 17,
    name: "Amoxicillin-clavulanate",
    category: "Beta-lactam",
    class: "Penicillins",
    description: "Amoxicillin with clavulanic acid to overcome beta-lactamase resistance",
    mechanism: "Cell wall synthesis with beta-lactamase inhibition combination",
    spectrum: "Broad; expanded gram-positive and gram-negative coverage",
    route: "PO",
    commonUses: ["Otitis media", "Sinusitis", "Pneumonia"],
    resistance: "AmpC beta-lactamases",
    sideEffects: "Diarrhea, hepatotoxicity risk, and gastrointestinal intolerance"
  },
  {
    id: 18,
    name: "Ampicillin/sulbactam",
    category: "Beta-lactam",
    class: "Penicillins",
    description: "Ampicillin with sulbactam for broader spectrum coverage",
    mechanism: "Cell wall synthesis inhibition with beta-lactamase protection",
    spectrum: "Broad; gram-positive, gram-negative, and anaerobic coverage",
    route: "IV/IM",
    commonUses: ["Skin infections", "Intra-abdominal infections", "Aspiration pneumonia"],
    resistance: "AmpC beta-lactamases",
    sideEffects: "Injection site reactions and diarrhea commonly reported"
  },
  {
    id: 19,
    name: "Cefdinir",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "Oral third-generation cephalosporin for outpatient use",
    mechanism: "Cell wall synthesis inhibition via beta-lactam binding",
    spectrum: "Broad; gram-positive and moderate gram-negative coverage",
    route: "PO",
    commonUses: ["Otitis media", "Sinusitis", "Pharyngitis"],
    resistance: "ESBL-producing bacteria",
    sideEffects: "Diarrhea, red stools from iron complex, and gastrointestinal upset"
  },
  {
    id: 20,
    name: "Cefepime",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "Fourth-generation cephalosporin with anti-pseudomonal activity",
    mechanism: "Cell wall synthesis inhibition with enhanced stability",
    spectrum: "Ultra-broad; gram-positive, gram-negative, and Pseudomonas coverage",
    route: "IV/IM",
    commonUses: ["Hospital-acquired pneumonia", "Febrile neutropenia", "Pseudomonas infections"],
    resistance: "Carbapenemases",
    sideEffects: "Seizures at high doses, encephalopathy, and diarrhea possible"
  },
  {
    id: 21,
    name: "Cefotaxime",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "Third-generation cephalosporin for serious infections",
    mechanism: "Cell wall synthesis inhibition via beta-lactam binding",
    spectrum: "Broad; excellent central nervous system penetration",
    route: "IV/IM",
    commonUses: ["Meningitis", "Severe pneumonia", "Sepsis"],
    resistance: "ESBL-producing bacteria",
    sideEffects: "Injection site reactions and diarrhea commonly reported"
  },
  {
    id: 22,
    name: "Cefpodoxime",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "Oral third-generation cephalosporin",
    mechanism: "Cell wall synthesis inhibition via beta-lactam binding",
    spectrum: "Broad; gram-positive and gram-negative outpatient coverage",
    route: "PO",
    commonUses: ["Otitis media", "Pharyngitis", "UTI"],
    resistance: "ESBL-producing bacteria",
    sideEffects: "Diarrhea and gastrointestinal upset frequently observed"
  },
  {
    id: 23,
    name: "Ceftaroline",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "Advanced cephalosporin active against MRSA",
    mechanism: "Cell wall synthesis inhibition with MRSA-specific binding",
    spectrum: "Broad; gram-positive including MRSA and gram-negative coverage",
    route: "IV",
    commonUses: ["MRSA pneumonia", "Complicated skin infections"],
    resistance: "Rare resistance mechanisms",
    sideEffects: "Diarrhea, nausea, and infusion-related reactions possible"
  },
  {
    id: 24,
    name: "Cefuroxime",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "Second-generation cephalosporin with good gram-positive coverage",
    mechanism: "Cell wall synthesis inhibition via beta-lactam binding",
    spectrum: "Moderate; gram-positive and selected gram-negative coverage",
    route: "IV/PO",
    commonUses: ["Pneumonia", "Skin infections", "UTI"],
    resistance: "Beta-lactamases",
    sideEffects: "Diarrhea and gastrointestinal upset commonly reported"
  },
  {
    id: 25,
    name: "Cephalexin",
    category: "Beta-lactam",
    class: "Cephalosporins",
    description: "Oral first-generation cephalosporin for outpatient use",
    mechanism: "Cell wall synthesis inhibition via beta-lactam binding",
    spectrum: "Narrow; primarily gram-positive outpatient coverage",
    route: "PO",
    commonUses: ["Skin infections", "UTI", "Strep throat"],
    resistance: "Beta-lactamases",
    sideEffects: "Diarrhea, gastrointestinal upset, and allergic reactions possible"
  },
  {
    id: 26,
    name: "Daptomycin",
    category: "Lipopeptide",
    class: "Lipopeptides",
    description: "Lipopeptide antibiotic for gram-positive infections",
    mechanism: "Cell membrane disruption causing rapid depolarization",
    spectrum: "Narrow; gram-positive including MRSA and VRE coverage",
    route: "IV",
    commonUses: ["MRSA bacteremia", "Endocarditis", "Complicated skin infections"],
    resistance: "Membrane modifications (rare)",
    sideEffects: "Muscle toxicity with creatine phosphokinase elevation requiring monitoring"
  },
  {
    id: 27,
    name: "Levofloxacin",
    category: "Fluoroquinolone",
    class: "Fluoroquinolones",
    description: "Broad-spectrum fluoroquinolone with good tissue penetration",
    mechanism: "DNA gyrase and topoisomerase IV inhibition disrupting replication",
    spectrum: "Broad; respiratory pathogens, atypicals, and gram-negative coverage",
    route: "IV/PO",
    commonUses: ["Pneumonia", "UTI", "Sinusitis"],
    resistance: "Chromosomal mutations",
    sideEffects: "Tendon rupture risk, central nervous system effects, and QT prolongation"
  },
  {
    id: 28,
    name: "Nafcillin",
    category: "Beta-lactam",
    class: "Penicillins",
    description: "Anti-staphylococcal penicillin resistant to beta-lactamases",
    mechanism: "Cell wall synthesis inhibition resistant to staphylococcal beta-lactamase",
    spectrum: "Narrow; methicillin-sensitive Staphylococcus aureus coverage",
    route: "IV/IM",
    commonUses: ["MSSA infections", "Endocarditis", "Osteomyelitis"],
    resistance: "Methicillin resistance (MRSA)",
    sideEffects: "Injection site reactions and phlebitis commonly observed"
  },
  {
    id: 29,
    name: "Oxacillin",
    category: "Beta-lactam",
    class: "Penicillins",
    description: "Anti-staphylococcal penicillin for MSSA infections",
    mechanism: "Cell wall synthesis inhibition resistant to staphylococcal beta-lactamase",
    spectrum: "Narrow; methicillin-sensitive Staphylococcus aureus coverage",
    route: "IV/IM",
    commonUses: ["MSSA infections", "Skin infections", "Pneumonia"],
    resistance: "Methicillin resistance (MRSA)",
    sideEffects: "Injection site reactions and hepatotoxicity risk requiring monitoring"
  },
  {
    id: 30,
    name: "TMP-SMX",
    category: "Folate inhibitor",
    class: "Sulfonamides",
    description: "Trimethoprim-sulfamethoxazole combination (same as Trimethoprim-Sulfamethoxazole)",
    mechanism: "Folate synthesis inhibition via sequential enzymatic blockade",
    spectrum: "Broad; gram-positive including MRSA and gram-negative coverage",
    route: "PO/IV",
    commonUses: ["UTI", "PCP pneumonia", "MRSA skin infections"],
    resistance: "Folate pathway mutations",
    sideEffects: "Hyperkalemia risk and severe skin reactions including Stevens-Johnson"
  }
];

// Helper functions for sophomore developers
export const getAntibioticById = (id: number): SimpleAntibiotic | undefined => {
  return simpleAntibiotics.find(antibiotic => antibiotic.id === id);
};

export const getAntibioticByName = (name: string): SimpleAntibiotic | undefined => {
  return simpleAntibiotics.find(antibiotic =>
    antibiotic.name.toLowerCase() === name.toLowerCase()
  );
};

export const getAntibioticsByClass = (drugClass: string): SimpleAntibiotic[] => {
  return simpleAntibiotics.filter(antibiotic => antibiotic.class === drugClass);
};

export const getAntibioticsByCategory = (category: string): SimpleAntibiotic[] => {
  return simpleAntibiotics.filter(antibiotic => antibiotic.category === category);
};

export const searchAntibiotics = (searchTerm?: string): SimpleAntibiotic[] => {
  if (!searchTerm) return simpleAntibiotics;

  const term = searchTerm.toLowerCase();
  return simpleAntibiotics.filter(antibiotic =>
    antibiotic.name.toLowerCase().includes(term) ||
    antibiotic.class.toLowerCase().includes(term) ||
    antibiotic.description.toLowerCase().includes(term)
  );
};

export const getAllDrugClasses = (): string[] => {
  const classes = simpleAntibiotics.map(antibiotic => antibiotic.class);
  return [...new Set(classes)].sort();
};

export const getAllCategories = (): string[] => {
  const categories = simpleAntibiotics.map(antibiotic => antibiotic.category);
  return [...new Set(categories)].sort();
};

// Data validation function
export const validateAntibioticData = (): string[] | null => {
  const errors: string[] = [];

  simpleAntibiotics.forEach(antibiotic => {
    if (!antibiotic.name) errors.push(`Antibiotic ${antibiotic.id} missing name`);
    if (!antibiotic.class) errors.push(`Antibiotic ${antibiotic.id} missing class`);
    if (!antibiotic.mechanism) errors.push(`Antibiotic ${antibiotic.id} missing mechanism`);
  });

  return errors.length === 0 ? null : errors;
};

export default simpleAntibiotics;
