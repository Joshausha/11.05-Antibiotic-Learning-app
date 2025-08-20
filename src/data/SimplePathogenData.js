/**
 * Simple Pathogen Data
 * Sophomore-level data structure for 10 common pathogens
 * Easy to understand and modify
 */

const simplePathogens = [
  {
    id: 1,
    name: "Staphylococcus aureus",
    commonName: "Staph aureus",
    gramStatus: "positive",
    shape: "cocci",
    description: "Common cause of skin infections, pneumonia, and bloodstream infections",
    commonSites: ["Skin", "Soft tissue", "Blood", "Lungs"],
    resistance: "MRSA strains are resistant to methicillin",
    severity: "high"
  },
  {
    id: 2,
    name: "Escherichia coli",
    commonName: "E. coli",
    gramStatus: "negative",
    shape: "rod",
    description: "Leading cause of urinary tract infections and gastroenteritis",
    commonSites: ["Urinary tract", "Intestines", "Blood"],
    resistance: "ESBL-producing strains",
    severity: "medium"
  },
  {
    id: 3,
    name: "Streptococcus pneumoniae",
    commonName: "Pneumococcus",
    gramStatus: "positive",
    shape: "cocci",
    description: "Major cause of pneumonia, meningitis, and ear infections",
    commonSites: ["Lungs", "Sinuses", "Brain", "Ears"],
    resistance: "Penicillin-resistant strains exist",
    severity: "high"
  },
  {
    id: 4,
    name: "Pseudomonas aeruginosa",
    commonName: "Pseudomonas",
    gramStatus: "negative",
    shape: "rod",
    description: "Opportunistic pathogen causing infections in immunocompromised patients",
    commonSites: ["Lungs", "Burns", "Wounds", "Urinary tract"],
    resistance: "Multi-drug resistant",
    severity: "high"
  },
  {
    id: 5,
    name: "Streptococcus pyogenes",
    commonName: "Group A Strep",
    gramStatus: "positive",
    shape: "cocci",
    description: "Causes strep throat, cellulitis, and necrotizing fasciitis",
    commonSites: ["Throat", "Skin", "Soft tissue"],
    resistance: "Generally sensitive to penicillin",
    severity: "medium"
  },
  {
    id: 6,
    name: "Klebsiella pneumoniae",
    commonName: "Klebsiella",
    gramStatus: "negative",
    shape: "rod",
    description: "Hospital-acquired pneumonia and urinary tract infections",
    commonSites: ["Lungs", "Urinary tract", "Blood"],
    resistance: "Carbapenem-resistant strains (CRE)",
    severity: "high"
  },
  {
    id: 7,
    name: "Enterococcus faecalis",
    commonName: "Enterococcus",
    gramStatus: "positive",
    shape: "cocci",
    description: "Causes urinary tract and bloodstream infections",
    commonSites: ["Urinary tract", "Blood", "Abdomen"],
    resistance: "VRE (vancomycin-resistant) strains",
    severity: "medium"
  },
  {
    id: 8,
    name: "Haemophilus influenzae",
    commonName: "H. flu",
    gramStatus: "negative",
    shape: "rod",
    description: "Respiratory tract infections, especially in children",
    commonSites: ["Lungs", "Sinuses", "Ears", "Brain"],
    resistance: "Beta-lactamase producing strains",
    severity: "medium"
  },
  {
    id: 9,
    name: "Acinetobacter baumannii",
    commonName: "Acinetobacter",
    gramStatus: "negative",
    shape: "rod",
    description: "Hospital-acquired infections, especially in ICU patients",
    commonSites: ["Lungs", "Blood", "Wounds"],
    resistance: "Multi-drug resistant (MDR)",
    severity: "high"
  },
  {
    id: 10,
    name: "Clostridium difficile",
    commonName: "C. diff",
    gramStatus: "positive",
    shape: "rod",
    description: "Antibiotic-associated colitis and diarrhea",
    commonSites: ["Colon"],
    resistance: "Spore-forming, survives antibiotics",
    severity: "medium"
  },
  {
    id: 11,
    name: "Enterococcus faecium",
    commonName: "E. faecium",
    gramStatus: "positive",
    shape: "cocci",
    description: "Hospital-acquired enterococcal infections, often multidrug-resistant",
    commonSites: ["Urinary tract", "Blood", "Abdomen", "Wounds"],
    resistance: "VRE (vancomycin-resistant) strains common",
    severity: "high"
  },
  {
    id: 12,
    name: "Neisseria meningitidis",
    commonName: "Meningococcus",
    gramStatus: "negative",
    shape: "cocci",
    description: "Causes meningitis and septicemia, medical emergency",
    commonSites: ["Brain", "Blood", "Throat"],
    resistance: "Generally susceptible to penicillin",
    severity: "high"
  },
  {
    id: 13,
    name: "Moraxella catarrhalis",
    commonName: "M. catarrhalis",
    gramStatus: "negative",
    shape: "cocci",
    description: "Respiratory tract infections, especially in children and elderly",
    commonSites: ["Sinuses", "Ears", "Lungs"],
    resistance: "Beta-lactamase producing strains",
    severity: "low"
  },
  {
    id: 14,
    name: "Mycoplasma pneumoniae",
    commonName: "Mycoplasma",
    gramStatus: "atypical",
    shape: "pleomorphic",
    description: "Atypical pneumonia, walking pneumonia",
    commonSites: ["Lungs", "Upper respiratory tract"],
    resistance: "Macrolide-resistant strains emerging",
    severity: "medium"
  },
  {
    id: 15,
    name: "Streptococcus anginosus",
    commonName: "S. anginosus",
    gramStatus: "positive",
    shape: "cocci",
    description: "Part of anginosus group, causes abscesses and deep tissue infections",
    commonSites: ["Deep tissues", "Abscesses", "Dental infections"],
    resistance: "Generally penicillin-susceptible",
    severity: "medium"
  },
  {
    id: 16,
    name: "Kingella kingae",
    commonName: "K. kingae",
    gramStatus: "negative",
    shape: "rod",
    description: "Pediatric pathogen causing bone and joint infections",
    commonSites: ["Bones", "Joints", "Blood"],
    resistance: "Not reliably susceptible to oxacillin/nafcillin",
    severity: "medium"
  },
  {
    id: 17,
    name: "Staphylococcus saprophyticus",
    commonName: "S. saprophyticus",
    gramStatus: "positive",
    shape: "cocci",
    description: "Common cause of urinary tract infections in young women",
    commonSites: ["Urinary tract"],
    resistance: "Generally susceptible to most antibiotics",
    severity: "low"
  },
  {
    id: 18,
    name: "Coagulase-negative Staphylococcus",
    commonName: "CoNS",
    gramStatus: "positive",
    shape: "cocci",
    description: "Opportunistic pathogen, common in device-related infections",
    commonSites: ["Blood", "Medical devices", "Skin"],
    resistance: "Often methicillin-resistant",
    severity: "medium"
  },
  {
    id: 19,
    name: "Bartonella species",
    commonName: "Bartonella",
    gramStatus: "negative",
    shape: "rod",
    description: "Cat-scratch disease and other zoonotic infections",
    commonSites: ["Lymph nodes", "Skin", "Blood"],
    resistance: "Generally susceptible to macrolides",
    severity: "low"
  },
  {
    id: 20,
    name: "Fusobacterium species",
    commonName: "Fusobacterium",
    gramStatus: "negative",
    shape: "rod",
    description: "Anaerobic pathogen causing head and neck infections",
    commonSites: ["Throat", "Dental", "Head and neck"],
    resistance: "Generally susceptible to penicillin",
    severity: "medium"
  },
  {
    id: 21,
    name: "Group B Streptococcus",
    commonName: "GBS",
    gramStatus: "positive",
    shape: "cocci",
    description: "Neonatal sepsis and meningitis, maternal infections",
    commonSites: ["Blood", "Brain", "Urinary tract"],
    resistance: "Generally penicillin-susceptible",
    severity: "high"
  },
  {
    id: 22,
    name: "Enterobacter species",
    commonName: "Enterobacter",
    gramStatus: "negative",
    shape: "rod",
    description: "Hospital-acquired infections, intrinsic AmpC resistance",
    commonSites: ["Urinary tract", "Blood", "Respiratory tract"],
    resistance: "AmpC beta-lactamases, carbapenem resistance",
    severity: "high"
  },
  {
    id: 23,
    name: "Citrobacter species",
    commonName: "Citrobacter",
    gramStatus: "negative",
    shape: "rod",
    description: "Opportunistic gram-negative pathogen",
    commonSites: ["Urinary tract", "Blood", "Wounds"],
    resistance: "AmpC beta-lactamases",
    severity: "medium"
  },
  {
    id: 24,
    name: "Proteus species",
    commonName: "Proteus",
    gramStatus: "negative",
    shape: "rod",
    description: "Urinary tract infections, kidney stone formation",
    commonSites: ["Urinary tract", "Wounds"],
    resistance: "Intrinsic resistance to nitrofurantoin",
    severity: "medium"
  },
  {
    id: 25,
    name: "Microaerophilic streptococci",
    commonName: "Microaerophilic strep",
    gramStatus: "positive",
    shape: "cocci",
    description: "Oral flora causing head and neck infections",
    commonSites: ["Oral cavity", "Head and neck", "Dental"],
    resistance: "Generally penicillin-susceptible",
    severity: "low"
  },
  {
    id: 26,
    name: "Nontuberculous mycobacteria",
    commonName: "NTM",
    gramStatus: "acid-fast",
    shape: "rod",
    description: "Environmental mycobacteria causing lymphadenitis and pulmonary disease",
    commonSites: ["Lymph nodes", "Lungs", "Skin"],
    resistance: "Complex resistance patterns, requires specialized testing",
    severity: "medium"
  },
  {
    id: 27,
    name: "Anaerobes",
    commonName: "Anaerobic bacteria",
    gramStatus: "mixed",
    shape: "various",
    description: "Mixed anaerobic flora in abscesses and polymicrobial infections",
    commonSites: ["Abdomen", "Pelvis", "Deep tissues", "Oral cavity"],
    resistance: "Variable, often sensitive to metronidazole",
    severity: "medium"
  },
  {
    id: 28,
    name: "Herpes Simplex Virus",
    commonName: "HSV",
    gramStatus: "virus",
    shape: "enveloped",
    description: "DNA virus causing neonatal infections and encephalitis",
    commonSites: ["Brain", "Skin", "Mucous membranes", "Genital tract"],
    resistance: "Antiviral resistance (acyclovir)",
    severity: "high"
  },
  {
    id: 29,
    name: "Respiratory viruses",
    commonName: "Respiratory viruses",
    gramStatus: "virus",
    shape: "various",
    description: "Including influenza, adenovirus, RSV, coronavirus, human metapneumovirus",
    commonSites: ["Respiratory tract", "Lungs"],
    resistance: "Variable antiviral resistance",
    severity: "medium"
  }
];

// Helper functions for sophomore developers
export const getPathogenById = (id) => {
  return simplePathogens.find(pathogen => pathogen.id === id);
};

export const getPathogenByName = (name) => {
  return simplePathogens.find(pathogen => 
    pathogen.name.toLowerCase() === name.toLowerCase() ||
    pathogen.commonName.toLowerCase() === name.toLowerCase()
  );
};

export const getPathogensByGramStatus = (gramStatus) => {
  return simplePathogens.filter(pathogen => pathogen.gramStatus === gramStatus);
};

export const getPathogensBySeverity = (severity) => {
  return simplePathogens.filter(pathogen => pathogen.severity === severity);
};

export const searchPathogens = (searchTerm) => {
  if (!searchTerm) return simplePathogens;
  
  const term = searchTerm.toLowerCase();
  return simplePathogens.filter(pathogen =>
    pathogen.name.toLowerCase().includes(term) ||
    pathogen.commonName.toLowerCase().includes(term) ||
    pathogen.description.toLowerCase().includes(term)
  );
};

// Data validation function
export const validatePathogenData = () => {
  const errors = [];
  
  simplePathogens.forEach(pathogen => {
    if (!pathogen.name) errors.push(`Pathogen ${pathogen.id} missing name`);
    if (!pathogen.gramStatus) errors.push(`Pathogen ${pathogen.id} missing gram status`);
    if (!pathogen.description) errors.push(`Pathogen ${pathogen.id} missing description`);
  });
  
  return errors.length === 0 ? null : errors;
};

export default simplePathogens;