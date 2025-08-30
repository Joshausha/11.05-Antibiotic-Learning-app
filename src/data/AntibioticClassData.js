/**
 * AntibioticClassData.js - Comprehensive antibiotic classification system
 * 
 * Defines antibiotic classes, mechanisms of action, and relationships
 * for Northwestern Coverage Wheel class-based clustering and educational visualization
 * 
 * @module AntibioticClassData
 * @version 1.0.0
 * @created 2025-08-30
 * @medical-validation All classifications verified against AAP/IDSA guidelines
 * @educational-level Appropriate for medical students through residency training
 */

/**
 * Main antibiotic classes with detailed pharmacological information
 * Organized by mechanism of action for educational clustering
 */
export const ANTIBIOTIC_CLASSES = {
  // Cell Wall Synthesis Inhibitors
  'beta-lactam-penicillins': {
    id: 'beta-lactam-penicillins',
    name: 'Penicillins',
    parentClass: 'beta-lactams',
    mechanismOfAction: 'cell-wall-synthesis-inhibition',
    mechanism: 'Inhibits peptidoglycan cross-linking in bacterial cell wall',
    targetSite: 'Penicillin-binding proteins (PBPs)',
    spectrum: 'narrow-to-moderate',
    resistanceMechanism: 'Beta-lactamase production, PBP alteration',
    clinicalUse: 'Gram-positive infections, some gram-negative',
    sideEffects: ['Hypersensitivity reactions', 'GI upset'],
    monitoring: ['Allergic reactions', 'C. diff risk'],
    color: '#3B82F6', // Blue - cell wall inhibitors
    clusterPosition: { x: -100, y: 0 },
    antibiotics: [1, 15], // Penicillin, Ampicillin
    educationalNotes: 'First discovered antibiotic class, narrow spectrum but still important'
  },

  'beta-lactam-cephalosporins': {
    id: 'beta-lactam-cephalosporins',
    name: 'Cephalosporins',
    parentClass: 'beta-lactams',
    mechanismOfAction: 'cell-wall-synthesis-inhibition',
    mechanism: 'Inhibits peptidoglycan synthesis, broader spectrum than penicillins',
    targetSite: 'Penicillin-binding proteins (PBPs)',
    spectrum: 'broad',
    generations: {
      '1st': 'Gram-positive focus (cefazolin)',
      '2nd': 'Enhanced gram-negative (cefuroxime)', 
      '3rd': 'Extended gram-negative, CSF penetration (ceftriaxone)',
      '4th': 'Anti-pseudomonal activity (cefepime)',
      '5th': 'MRSA coverage (ceftaroline)'
    },
    resistanceMechanism: 'Beta-lactamase production, ESBL',
    clinicalUse: 'Broad-spectrum empiric therapy',
    sideEffects: ['Cross-reactivity with penicillin allergies', 'Bleeding (rare)'],
    monitoring: ['Allergic reactions', 'Renal function'],
    color: '#2563EB', // Darker blue
    clusterPosition: { x: -50, y: 50 },
    antibiotics: [4, 13], // Ceftriaxone, Cefazolin
    educationalNotes: 'Generation system reflects increasing gram-negative coverage'
  },

  'beta-lactam-carbapenems': {
    id: 'beta-lactam-carbapenems',
    name: 'Carbapenems',
    parentClass: 'beta-lactams',
    mechanismOfAction: 'cell-wall-synthesis-inhibition',
    mechanism: 'Broadest spectrum beta-lactam, resistant to most beta-lactamases',
    targetSite: 'Penicillin-binding proteins (PBPs)',
    spectrum: 'ultra-broad',
    resistanceMechanism: 'Carbapenemases (KPC, NDM, OXA), impermeability',
    clinicalUse: 'Severe infections, ESBL producers, last-line therapy',
    sideEffects: ['Seizures (high doses)', 'C. diff risk'],
    monitoring: ['CNS toxicity', 'Superinfections'],
    color: '#1D4ED8', // Deep blue
    clusterPosition: { x: 0, y: 100 },
    antibiotics: [8], // Meropenem
    educationalNotes: 'Reserved for serious infections to preserve effectiveness'
  },

  'beta-lactam-extended': {
    id: 'beta-lactam-extended',
    name: 'Extended Beta-lactams',
    parentClass: 'beta-lactams',
    mechanismOfAction: 'cell-wall-synthesis-inhibition',
    mechanism: 'Beta-lactam with beta-lactamase inhibitor combination',
    targetSite: 'PBPs with beta-lactamase protection',
    spectrum: 'extended',
    resistanceMechanism: 'ESBLs, impermeability',
    clinicalUse: 'Anaerobic and gram-negative coverage',
    sideEffects: ['GI upset', 'Bleeding (rare)'],
    monitoring: ['Liver function', 'Bleeding time'],
    color: '#1E40AF', // Navy blue
    clusterPosition: { x: 50, y: 50 },
    antibiotics: [14], // Piperacillin-Tazobactam
    educationalNotes: 'Combines beta-lactam with inhibitor to overcome resistance'
  },

  // Protein Synthesis Inhibitors - 30S Ribosome
  'aminoglycosides': {
    id: 'aminoglycosides',
    name: 'Aminoglycosides',
    parentClass: 'protein-synthesis-inhibitors',
    mechanismOfAction: 'protein-synthesis-inhibition-30s',
    mechanism: 'Binds 30S ribosomal subunit, causes misreading of mRNA',
    targetSite: '30S ribosomal subunit (16S rRNA)',
    spectrum: 'gram-negative-focused',
    resistanceMechanism: 'Enzymatic modification, impermeability, ribosomal methylation',
    clinicalUse: 'Gram-negative infections, synergy with cell wall inhibitors',
    sideEffects: ['Nephrotoxicity', 'Ototoxicity', 'Neuromuscular blockade'],
    monitoring: ['Serum levels', 'Creatinine', 'Hearing'],
    color: '#DC2626', // Red - protein synthesis 30S
    clusterPosition: { x: 100, y: -50 },
    antibiotics: [7], // Gentamicin
    educationalNotes: 'Concentration-dependent killing, requires therapeutic monitoring'
  },

  // Protein Synthesis Inhibitors - 50S Ribosome  
  'macrolides': {
    id: 'macrolides',
    name: 'Macrolides',
    parentClass: 'protein-synthesis-inhibitors',
    mechanismOfAction: 'protein-synthesis-inhibition-50s',
    mechanism: 'Binds 50S ribosomal subunit, blocks peptide exit tunnel',
    targetSite: '50S ribosomal subunit (23S rRNA)',
    spectrum: 'gram-positive-atypicals',
    resistanceMechanism: 'rRNA methylation, efflux pumps, enzymatic modification',
    clinicalUse: 'Atypical pneumonia, gram-positive infections',
    sideEffects: ['GI upset', 'QT prolongation', 'Drug interactions'],
    monitoring: ['ECG (QT interval)', 'Drug interactions'],
    color: '#EF4444', // Bright red
    clusterPosition: { x: 150, y: 0 },
    antibiotics: [5], // Azithromycin
    educationalNotes: 'Excellent tissue penetration, anti-inflammatory effects'
  },

  'lincosamides': {
    id: 'lincosamides',
    name: 'Lincosamides',
    parentClass: 'protein-synthesis-inhibitors',
    mechanismOfAction: 'protein-synthesis-inhibition-50s',
    mechanism: 'Binds 50S ribosomal subunit, similar to macrolides',
    targetSite: '50S ribosomal subunit',
    spectrum: 'gram-positive-anaerobic',
    resistanceMechanism: 'rRNA methylation, enzymatic modification',
    clinicalUse: 'Anaerobic infections, gram-positive, toxin suppression',
    sideEffects: ['C. diff colitis', 'GI upset'],
    monitoring: ['C. diff symptoms', 'Liver function'],
    color: '#F87171', // Light red
    clusterPosition: { x: 120, y: 50 },
    antibiotics: [6], // Clindamycin
    educationalNotes: 'Excellent anaerobic coverage, suppresses toxin production'
  },

  'oxazolidinones': {
    id: 'oxazolidinones',
    name: 'Oxazolidinones',
    parentClass: 'protein-synthesis-inhibitors',
    mechanismOfAction: 'protein-synthesis-inhibition-50s',
    mechanism: 'Binds 50S ribosomal subunit, prevents formation of initiation complex',
    targetSite: '50S ribosomal subunit (unique binding site)',
    spectrum: 'gram-positive-mrsa-vre',
    resistanceMechanism: 'rRNA mutations, ribosomal protection',
    clinicalUse: 'MRSA, VRE, resistant gram-positive infections',
    sideEffects: ['Thrombocytopenia', 'Peripheral neuropathy', 'Optic neuritis'],
    monitoring: ['CBC', 'Neurological symptoms', 'Visual symptoms'],
    color: '#DC2626', // Deep red
    clusterPosition: { x: 180, y: -25 },
    antibiotics: [11], // Linezolid
    educationalNotes: 'Reserved for resistant infections, unique mechanism'
  },

  // Glycopeptides
  'glycopeptides': {
    id: 'glycopeptides',
    name: 'Glycopeptides',
    parentClass: 'cell-wall-synthesis-inhibitors',
    mechanismOfAction: 'cell-wall-synthesis-inhibition',
    mechanism: 'Binds D-Ala-D-Ala terminus, prevents peptidoglycan cross-linking',
    targetSite: 'Peptidoglycan precursor molecules',
    spectrum: 'gram-positive-only',
    resistanceMechanism: 'D-Ala-D-Lac substitution (VRE)',
    clinicalUse: 'MRSA, C. diff colitis, serious gram-positive infections',
    sideEffects: ['Nephrotoxicity', 'Red man syndrome', 'Ototoxicity'],
    monitoring: ['Serum levels', 'Creatinine', 'Hearing'],
    color: '#7C3AED', // Purple - unique mechanism
    clusterPosition: { x: -150, y: -50 },
    antibiotics: [2], // Vancomycin
    educationalNotes: 'Gold standard for MRSA, requires therapeutic monitoring'
  },

  // DNA/RNA Synthesis Inhibitors
  'fluoroquinolones': {
    id: 'fluoroquinolones',
    name: 'Fluoroquinolones',
    parentClass: 'nucleic-acid-synthesis-inhibitors',
    mechanismOfAction: 'dna-synthesis-inhibition',
    mechanism: 'Inhibits DNA gyrase and topoisomerase IV',
    targetSite: 'DNA gyrase (gram-negative), topoisomerase IV (gram-positive)',
    spectrum: 'broad-spectrum',
    resistanceMechanism: 'Chromosomal mutations, efflux pumps, plasmid-mediated',
    clinicalUse: 'UTIs, respiratory infections, gram-negative coverage',
    sideEffects: ['Tendon rupture', 'CNS effects', 'QT prolongation'],
    monitoring: ['Tendon pain', 'CNS symptoms', 'ECG'],
    color: '#059669', // Green - DNA synthesis
    clusterPosition: { x: 0, y: -100 },
    antibiotics: [3], // Ciprofloxacin
    educationalNotes: 'Concentration-dependent killing, avoid in children/pregnancy'
  },

  'nitroimidazoles': {
    id: 'nitroimidazoles',
    name: 'Nitroimidazoles',
    parentClass: 'nucleic-acid-synthesis-inhibitors',
    mechanismOfAction: 'dna-synthesis-inhibition',
    mechanism: 'DNA strand breaks through free radical formation',
    targetSite: 'DNA (anaerobic metabolism required)',
    spectrum: 'anaerobic-specific',
    resistanceMechanism: 'Reduced drug uptake, altered metabolism',
    clinicalUse: 'Anaerobic infections, C. diff, protozoal infections',
    sideEffects: ['Metallic taste', 'Disulfiram-like reaction', 'Peripheral neuropathy'],
    monitoring: ['Neurological symptoms', 'Alcohol avoidance'],
    color: '#10B981', // Bright green
    clusterPosition: { x: -50, y: -100 },
    antibiotics: [12], // Metronidazole
    educationalNotes: 'Specific for anaerobic bacteria and certain protozoa'
  },

  // Folate Synthesis Inhibitors
  'sulfonamides': {
    id: 'sulfonamides',
    name: 'Sulfonamides/Trimethoprim',
    parentClass: 'folate-synthesis-inhibitors',
    mechanismOfAction: 'folate-synthesis-inhibition',
    mechanism: 'Inhibits folic acid synthesis pathway (sequential blockade)',
    targetSite: 'Dihydropteroate synthase and dihydrofolate reductase',
    spectrum: 'gram-positive-negative-selected',
    resistanceMechanism: 'Altered enzymes, increased folate production',
    clinicalUse: 'UTIs, PCP prophylaxis, MRSA (oral)',
    sideEffects: ['Rash', 'Hyperkalemia', 'Folate deficiency'],
    monitoring: ['Electrolytes', 'CBC', 'Rash'],
    color: '#F59E0B', // Amber - metabolic pathway
    clusterPosition: { x: 50, y: -150 },
    antibiotics: [10], // Trimethoprim-Sulfamethoxazole
    educationalNotes: 'Synergistic combination, bacteriostatic to bactericidal'
  },

  // Tetracyclines
  'tetracyclines': {
    id: 'tetracyclines',
    name: 'Tetracyclines',
    parentClass: 'protein-synthesis-inhibitors',
    mechanismOfAction: 'protein-synthesis-inhibition-30s',
    mechanism: 'Binds 30S ribosomal subunit, blocks aminoacyl-tRNA binding',
    targetSite: '30S ribosomal subunit (A site)',
    spectrum: 'broad-spectrum-atypicals',
    resistanceMechanism: 'Efflux pumps, ribosomal protection, enzymatic modification',
    clinicalUse: 'Atypical pneumonia, tick-borne diseases, acne',
    sideEffects: ['Teeth staining', 'Photosensitivity', 'GI upset'],
    monitoring: ['Sun exposure', 'Pregnancy status'],
    color: '#F97316', // Orange - broad spectrum
    clusterPosition: { x: 100, y: -100 },
    antibiotics: [9], // Doxycycline
    educationalNotes: 'Avoid in pregnancy and children <8 years due to teeth staining'
  }
};

/**
 * Mechanism of action groupings for educational clustering
 * Groups antibiotics by their primary target for Northwestern visualization
 */
export const MECHANISM_CLUSTERS = {
  'cell-wall-synthesis': {
    id: 'cell-wall-synthesis',
    name: 'Cell Wall Synthesis Inhibitors',
    description: 'Target bacterial cell wall construction',
    color: '#3B82F6', // Blue theme
    position: { x: -100, y: 0 },
    classes: ['beta-lactam-penicillins', 'beta-lactam-cephalosporins', 'beta-lactam-carbapenems', 'beta-lactam-extended', 'glycopeptides'],
    educationalNote: 'Most selective toxicity - humans lack cell walls'
  },
  
  'protein-synthesis-30s': {
    id: 'protein-synthesis-30s',
    name: '30S Ribosomal Inhibitors',
    description: 'Target 30S ribosomal subunit',
    color: '#DC2626', // Red theme
    position: { x: 100, y: -50 },
    classes: ['aminoglycosides', 'tetracyclines'],
    educationalNote: 'Bactericidal through ribosome binding'
  },
  
  'protein-synthesis-50s': {
    id: 'protein-synthesis-50s',
    name: '50S Ribosomal Inhibitors',
    description: 'Target 50S ribosomal subunit',
    color: '#EF4444', // Bright red theme
    position: { x: 150, y: 25 },
    classes: ['macrolides', 'lincosamides', 'oxazolidinones'],
    educationalNote: 'Generally bacteriostatic, some bactericidal'
  },
  
  'dna-synthesis': {
    id: 'dna-synthesis',
    name: 'DNA/RNA Synthesis Inhibitors',
    description: 'Target nucleic acid synthesis',
    color: '#059669', // Green theme
    position: { x: 0, y: -125 },
    classes: ['fluoroquinolones', 'nitroimidazoles'],
    educationalNote: 'Interfere with DNA replication and repair'
  },
  
  'metabolic-pathways': {
    id: 'metabolic-pathways',
    name: 'Metabolic Pathway Inhibitors',
    description: 'Target essential metabolic processes',
    color: '#F59E0B', // Amber theme
    position: { x: 50, y: -150 },
    classes: ['sulfonamides'],
    educationalNote: 'Target pathways unique to bacteria'
  }
};

/**
 * Cross-resistance patterns between antibiotic classes
 * Important for understanding resistance mechanisms and therapy planning
 */
export const RESISTANCE_PATTERNS = {
  'beta-lactam-resistance': {
    mechanism: 'Beta-lactamase production',
    affectedClasses: ['beta-lactam-penicillins', 'beta-lactam-cephalosporins', 'beta-lactam-extended'],
    exceptions: ['beta-lactam-carbapenems'], // More resistant to beta-lactamases
    clinicalRelevance: 'ESBL producers resist most beta-lactams except carbapenems'
  },
  
  'ribosomal-protection': {
    mechanism: 'Ribosomal methylation/modification',
    affectedClasses: ['macrolides', 'lincosamides'],
    crossResistance: true,
    clinicalRelevance: 'MLSB resistance affects macrolides and lincosamides'
  },
  
  'efflux-pumps': {
    mechanism: 'Active efflux systems',
    affectedClasses: ['fluoroquinolones', 'tetracyclines', 'macrolides'],
    organism: 'Gram-negative bacteria especially',
    clinicalRelevance: 'Multi-drug efflux pumps cause broad resistance'
  },
  
  'target-modification': {
    mechanism: 'Altered drug targets',
    examples: {
      'vancomycin': 'D-Ala-D-Lac substitution (VRE)',
      'fluoroquinolones': 'DNA gyrase mutations',
      'linezolid': 'ribosomal mutations'
    },
    clinicalRelevance: 'Specific mutations can cause high-level resistance'
  }
};

/**
 * Get antibiotic class information by antibiotic ID
 * @param {number} antibioticId - ID from SimpleAntibioticData
 * @returns {Object|null} Class information or null if not found
 */
export const getAntibioticClass = (antibioticId) => {
  for (const classData of Object.values(ANTIBIOTIC_CLASSES)) {
    if (classData.antibiotics.includes(antibioticId)) {
      return classData;
    }
  }
  return null;
};

/**
 * Get all antibiotics in a specific class
 * @param {string} classId - Class ID from ANTIBIOTIC_CLASSES
 * @returns {Array} Array of antibiotic IDs
 */
export const getAntibioticsInClass = (classId) => {
  const classData = ANTIBIOTIC_CLASSES[classId];
  return classData ? classData.antibiotics : [];
};

/**
 * Get mechanism cluster for an antibiotic
 * @param {number} antibioticId - Antibiotic ID
 * @returns {Object|null} Mechanism cluster data
 */
export const getMechanismCluster = (antibioticId) => {
  const classData = getAntibioticClass(antibioticId);
  if (!classData) return null;
  
  for (const cluster of Object.values(MECHANISM_CLUSTERS)) {
    if (cluster.classes.includes(classData.id)) {
      return cluster;
    }
  }
  return null;
};

/**
 * Get educational information for class-based learning
 * @param {number} antibioticId - Antibiotic ID
 * @returns {Object} Educational metadata
 */
export const getEducationalMetadata = (antibioticId) => {
  const classData = getAntibioticClass(antibioticId);
  const mechanismData = getMechanismCluster(antibioticId);
  
  if (!classData) return null;
  
  return {
    className: classData.name,
    mechanism: classData.mechanism,
    spectrum: classData.spectrum,
    clinicalUse: classData.clinicalUse,
    keyMonitoring: classData.monitoring,
    mechanismGroup: mechanismData?.name,
    educationalNotes: classData.educationalNotes,
    resistancePattern: classData.resistanceMechanism
  };
};

export default ANTIBIOTIC_CLASSES;