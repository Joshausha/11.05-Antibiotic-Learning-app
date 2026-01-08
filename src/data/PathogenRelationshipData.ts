/**
 * Pathogen Relationship Data - Jaccard Similarity Analysis
 *
 * This file generates medically-validated pathogen relationships using
 * the Jaccard similarity algorithm on antibiotic susceptibility profiles.
 *
 * Auto-generated relationships based on:
 * - Antibiotic susceptibility pattern overlap (Jaccard coefficient ≥ 0.3)
 * - Medical validation rules (Gram stain, virus-bacteria separation, etc.)
 * - Shared infection sites and resistance patterns
 * - Taxonomic relationships
 *
 * Medical Sources:
 * @see {@link https://academic.oup.com/cid/article/76/3/e1/6696391|IDSA AST Guidelines 2023}
 * @see {@link https://publications.aap.org/redbook|AAP Red Book 2024}
 * @see {@link https://pubs.aspen.org/nelson-pediatrics|Nelson's Pediatric AT 2024}
 */

import { generatePathogenRelationships, getRelationshipStatistics } from '../utils/pathogenSimilarity';
import { relationshipJustifications, getRelationshipJustification } from './PathogenRelationshipJustifications';

/**
 * ============================================================================
 * TYPESCRIPT INTERFACES - Type-safe pathogen relationship data structures
 * ============================================================================
 */

/** Gram stain classification for pathogens */
export type GramStainType = 'positive' | 'negative' | 'atypical' | 'acid-fast' | 'virus' | 'mixed';

/** Clinical severity levels for pathogens */
export type SeverityLevel = 'low' | 'medium' | 'high';

/** Relationship type classifications */
export type RelationshipType = 'strong' | 'medium' | 'weak';

/** Edge labels for Cytoscape relationships */
export type EdgeLabel =
  | 'anatomic-association'
  | 'co-infection'
  | 'shared-resistance'
  | 'treatment-interaction'
  | 'similar-coverage'
  | 'antibiotic-class'
  | 'susceptible'
  | 'resistant';

/** Edge strength indicators */
export type EdgeStrength = 'very-high' | 'high' | 'medium-high' | 'medium';

/** Priority tier levels */
export type PriorityTier = 1 | 2 | 3;

/**
 * Antibiotic data within a pathogen relationship
 * Represents antibiotics shared between two pathogens
 */
export interface SharedAntibioticInfo {
  id: number;
  name: string;
}

/**
 * Core pathogen relationship from Jaccard similarity analysis
 * Used by network visualization and clinical decision support
 */
export interface PathogenRelationship {
  sourceId: number;
  sourceName: string;
  targetId: number;
  targetName: string;
  similarity: number;
  relationshipType: RelationshipType;
  sharedAntibiotics: SharedAntibioticInfo[];
  clinicalRationale: string;
  medicalSource: string;
}

/**
 * Justification object for a pathogen relationship
 * Provides medical context and teaching importance
 */
export interface RelationshipJustification {
  [key: string]: any;
  importance?: 'high' | 'medium' | 'low';
}

/**
 * Pathogen relationship with medical justification merged
 * Used for detailed clinical context display
 */
export interface PathogenRelationshipWithJustification extends PathogenRelationship {
  justification: RelationshipJustification | null;
}

/**
 * Relationship statistics summary
 * Provides overview metrics for relationship distribution analysis
 */
export interface RelationshipStatistics {
  totalRelationships: number;
  strongRelationships: number;
  mediumRelationships: number;
  weakRelationships: number;
  averageSimilarity: number;
  distribution: {
    strong: number;
    medium: number;
    weak: number;
  };
}

/**
 * Cytoscape node data for pathogens
 */
export interface PathogenNodeData {
  id: string;
  label: string;
  type: 'pathogen';
  gramStain?: GramStainType;
  shape?: string;
  morphology?: string;
  description?: string;
  commonSites?: string[];
  resistance?: string;
  severity?: SeverityLevel;
}

/**
 * Cytoscape node data for antibiotics
 */
export interface AntibioticNodeData {
  id: string;
  label: string;
  type: 'antibiotic';
  class?: string;
  category?: string;
  spectrum?: string;
  mechanism?: string;
  route?: string;
}

/** Union type for all Cytoscape node data */
export type CytoscapeNodeData = PathogenNodeData | AntibioticNodeData;

/**
 * Cytoscape node structure with data
 * Used for network graph visualization
 */
export interface CytoscapeNode {
  data: CytoscapeNodeData;
}

/**
 * Cytoscape edge data for relationships
 * Represents connections between pathogens and antibiotics
 */
export interface CytoscapeEdgeData {
  source: string;
  target: string;
  label: EdgeLabel;
  strength?: EdgeStrength;
  evidence?: string;
  clinicalContext?: string;
  tier?: PriorityTier;
  pediatricRelevance?: string;
}

/**
 * Cytoscape edge structure with data
 * Used for network graph visualization
 */
export interface CytoscapeEdge {
  data: CytoscapeEdgeData;
}

/**
 * Generate all medically-validated pathogen relationships
 * Uses Jaccard similarity algorithm with medical validation rules
 * Threshold: 0.3 (30% antibiotic overlap minimum)
 * Medical validation: Enabled
 */
const allRelationships: PathogenRelationship[] = generatePathogenRelationships(0.3, true) as any;

/**
 * Relationship statistics
 * Provides overview of relationship distribution
 */
export const stats: RelationshipStatistics = getRelationshipStatistics(allRelationships as any) as any;

/**
 * Get all pathogen relationships
 * @returns Array of relationship objects with sourceId, targetId, similarity, relationshipType, etc.
 */
export const getPathogenRelationships = (): PathogenRelationship[] => allRelationships;

/**
 * Get relationships for a specific pathogen
 * @param pathogenId - Pathogen ID
 * @returns Relationships where pathogen is source or target
 */
export const getRelationshipsForPathogen = (pathogenId: number): PathogenRelationship[] => {
  return allRelationships.filter(r =>
    r.sourceId === pathogenId || r.targetId === pathogenId
  );
};

/**
 * Get relationships by type
 * @param type - 'strong', 'medium', 'weak', or 'all'
 * @returns Filtered relationships
 */
export const getRelationshipsByType = (type: RelationshipType | 'all'): PathogenRelationship[] => {
  if (type === 'all') return allRelationships;
  return allRelationships.filter(r => r.relationshipType === type);
};

/**
 * Get relationships above similarity threshold
 * @param threshold - Similarity threshold (0-1)
 * @returns Relationships with similarity >= threshold
 */
export const getRelationshipsAboveThreshold = (threshold: number): PathogenRelationship[] => {
  return allRelationships.filter(r => r.similarity >= threshold);
};

/**
 * Get relationship with medical justification merged
 * @param sourceId - Source pathogen ID
 * @param targetId - Target pathogen ID
 * @returns Relationship object with justification merged, or null if not found
 */
export const getRelationshipWithJustification = (
  sourceId: number,
  targetId: number
): PathogenRelationshipWithJustification | null => {
  const relationship = allRelationships.find(r =>
    r.sourceId === sourceId && r.targetId === targetId ||
    r.sourceId === targetId && r.targetId === sourceId
  );

  if (!relationship) return null;

  // Try both directions for justification lookup
  let justification = getRelationshipJustification(sourceId, targetId);
  if (!justification) {
    justification = getRelationshipJustification(targetId, sourceId);
  }

  return {
    ...relationship,
    justification: justification || null
  };
};

/**
 * Get all relationships with justifications merged
 * @returns All relationships with medical justifications included
 */
export const getRelationshipsWithJustifications = (): PathogenRelationshipWithJustification[] => {
  return allRelationships.map(relationship => {
    const { sourceId, targetId } = relationship;

    // Try both directions for justification lookup
    let justification = getRelationshipJustification(sourceId, targetId);
    if (!justification) {
      justification = getRelationshipJustification(targetId, sourceId);
    }

    return {
      ...relationship,
      justification: justification || null
    };
  });
};

/**
 * Get all relationships with high-priority justifications (teaching focus)
 * @returns Relationships with high-importance justifications
 */
export const getHighPriorityRelationships = (): PathogenRelationshipWithJustification[] => {
  return getRelationshipsWithJustifications()
    .filter(r => r.justification && r.justification.importance === 'high');
};

// ============================================================================
// LEGACY CYTOSCAPE FORMAT (for backward compatibility)
// ============================================================================
/**
 * Transformed pathogen and antibiotic nodes for Cytoscape visualization
 * Includes both pathogen (29) and antibiotic (30) nodes with medical metadata
 */
export const nodes: CytoscapeNode[] = [
  // =============================================================================
  // PATHOGEN NODES (29 nodes)
  // =============================================================================
  { data: { id: 'Staph aureus', label: 'Staph aureus', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in clusters', description: 'Common cause of skin infections, pneumonia, and bloodstream infections', commonSites: ['Skin', 'Soft tissue', 'Blood', 'Lungs'], resistance: 'MRSA strains are resistant to methicillin', severity: 'high' } },
  { data: { id: 'E. coli', label: 'E. coli', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'rod-shaped', description: 'Leading cause of urinary tract infections and gastroenteritis', commonSites: ['Urinary tract', 'Intestines', 'Blood'], resistance: 'ESBL-producing strains', severity: 'medium' } },
  { data: { id: 'Pneumococcus', label: 'Pneumococcus', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'diplococcus (lancet-shaped pairs)', description: 'Major cause of pneumonia, meningitis, and ear infections', commonSites: ['Lungs', 'Sinuses', 'Brain', 'Ears'], resistance: 'Penicillin-resistant strains exist', severity: 'high' } },
  { data: { id: 'Pseudomonas', label: 'Pseudomonas', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'rod-shaped (motile)', description: 'Opportunistic pathogen causing infections in immunocompromised patients', commonSites: ['Lungs', 'Burns', 'Wounds', 'Urinary tract'], resistance: 'Multi-drug resistant', severity: 'high' } },
  { data: { id: 'Group A Strep', label: 'Group A Strep', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in chains', description: 'Causes strep throat, cellulitis, and necrotizing fasciitis', commonSites: ['Throat', 'Skin', 'Soft tissue'], resistance: 'Generally sensitive to penicillin', severity: 'medium' } },
  { data: { id: 'Klebsiella', label: 'Klebsiella', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'rod-shaped (encapsulated)', description: 'Hospital-acquired pneumonia and urinary tract infections', commonSites: ['Lungs', 'Urinary tract', 'Blood'], resistance: 'Carbapenem-resistant strains (CRE)', severity: 'high' } },
  { data: { id: 'Enterococcus', label: 'Enterococcus', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in chains or pairs', description: 'Causes urinary tract and bloodstream infections', commonSites: ['Urinary tract', 'Blood', 'Abdomen'], resistance: 'VRE (vancomycin-resistant) strains', severity: 'medium' } },
  { data: { id: 'H. flu', label: 'H. flu', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'small coccobacillus', description: 'Respiratory tract infections, especially in children', commonSites: ['Lungs', 'Sinuses', 'Ears', 'Brain'], resistance: 'Beta-lactamase producing strains', severity: 'medium' } },
  { data: { id: 'Acinetobacter', label: 'Acinetobacter', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'coccobacillus', description: 'Hospital-acquired infections, especially in ICU patients', commonSites: ['Lungs', 'Blood', 'Wounds'], resistance: 'Multi-drug resistant (MDR)', severity: 'high' } },
  { data: { id: 'C. diff', label: 'C. diff', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'rod-shaped (spore-forming)', description: 'Antibiotic-associated colitis and diarrhea', commonSites: ['Colon'], resistance: 'Spore-forming, survives antibiotics', severity: 'medium' } },
  { data: { id: 'E. faecium', label: 'E. faecium', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in chains or pairs', description: 'Hospital-acquired enterococcal infections, often multidrug-resistant', commonSites: ['Urinary tract', 'Blood', 'Abdomen', 'Wounds'], resistance: 'VRE (vancomycin-resistant) strains common', severity: 'high' } },
  { data: { id: 'Meningococcus', label: 'Meningococcus', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'diplococcus (kidney bean-shaped pairs)', description: 'Causes meningitis and septicemia, medical emergency', commonSites: ['Brain', 'Blood', 'Throat'], resistance: 'Generally susceptible to penicillin', severity: 'high' } },
  { data: { id: 'M. catarrhalis', label: 'M. catarrhalis', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'diplococcus', description: 'Respiratory tract infections, especially in children and elderly', commonSites: ['Sinuses', 'Ears', 'Lungs'], resistance: 'Beta-lactamase producing strains', severity: 'low' } },
  { data: { id: 'Mycoplasma', label: 'Mycoplasma', type: 'pathogen', gramStain: 'atypical', shape: 'bacilli', morphology: 'pleomorphic (no cell wall)', description: 'Atypical pneumonia, walking pneumonia', commonSites: ['Lungs', 'Upper respiratory tract'], resistance: 'Macrolide-resistant strains emerging', severity: 'medium' } },
  { data: { id: 'S. anginosus', label: 'S. anginosus', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in chains', description: 'Part of anginosus group, causes abscesses and deep tissue infections', commonSites: ['Deep tissues', 'Abscesses', 'Dental infections'], resistance: 'Generally penicillin-susceptible', severity: 'medium' } },
  { data: { id: 'K. kingae', label: 'K. kingae', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'coccobacillus', description: 'Pediatric pathogen causing bone and joint infections', commonSites: ['Bones', 'Joints', 'Blood'], resistance: 'Not reliably susceptible to oxacillin/nafcillin', severity: 'medium' } },
  { data: { id: 'S. saprophyticus', label: 'S. saprophyticus', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in clusters', description: 'Common cause of urinary tract infections in young women', commonSites: ['Urinary tract'], resistance: 'Generally susceptible to most antibiotics', severity: 'low' } },
  { data: { id: 'CoNS', label: 'CoNS', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in clusters', description: 'Opportunistic pathogen, common in device-related infections', commonSites: ['Blood', 'Medical devices', 'Skin'], resistance: 'Often methicillin-resistant', severity: 'medium' } },
  { data: { id: 'Bartonella', label: 'Bartonella', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'curved rod-shaped', description: 'Cat-scratch disease and other zoonotic infections', commonSites: ['Lymph nodes', 'Skin', 'Blood'], resistance: 'Generally susceptible to macrolides', severity: 'low' } },
  { data: { id: 'Fusobacterium', label: 'Fusobacterium', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'spindle-shaped anaerobic rod', description: 'Anaerobic pathogen causing head and neck infections', commonSites: ['Throat', 'Dental', 'Head and neck'], resistance: 'Generally susceptible to penicillin', severity: 'medium' } },
  { data: { id: 'GBS', label: 'GBS', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in chains', description: 'Neonatal sepsis and meningitis, maternal infections', commonSites: ['Blood', 'Brain', 'Urinary tract'], resistance: 'Generally penicillin-susceptible', severity: 'high' } },
  { data: { id: 'Enterobacter', label: 'Enterobacter', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'rod-shaped', description: 'Hospital-acquired infections, intrinsic AmpC resistance', commonSites: ['Urinary tract', 'Blood', 'Respiratory tract'], resistance: 'AmpC beta-lactamases, carbapenem resistance', severity: 'high' } },
  { data: { id: 'Citrobacter', label: 'Citrobacter', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'rod-shaped (motile)', description: 'Opportunistic gram-negative pathogen', commonSites: ['Urinary tract', 'Blood', 'Wounds'], resistance: 'AmpC beta-lactamases', severity: 'medium' } },
  { data: { id: 'Proteus', label: 'Proteus', type: 'pathogen', gramStain: 'negative', shape: 'bacilli', morphology: 'rod-shaped (highly motile, swarming)', description: 'Urinary tract infections, kidney stone formation', commonSites: ['Urinary tract', 'Wounds'], resistance: 'Intrinsic resistance to nitrofurantoin', severity: 'medium' } },
  { data: { id: 'Microaerophilic strep', label: 'Microaerophilic strep', type: 'pathogen', gramStain: 'positive', shape: 'bacilli', morphology: 'cocci in chains', description: 'Oral flora causing head and neck infections', commonSites: ['Oral cavity', 'Head and neck', 'Dental'], resistance: 'Generally penicillin-susceptible', severity: 'low' } },
  { data: { id: 'NTM', label: 'NTM', type: 'pathogen', gramStain: 'acid-fast', shape: 'bacilli', morphology: 'acid-fast rod', description: 'Environmental mycobacteria causing lymphadenitis and pulmonary disease', commonSites: ['Lymph nodes', 'Lungs', 'Skin'], resistance: 'Complex resistance patterns, requires specialized testing', severity: 'medium' } },
  { data: { id: 'Anaerobes', label: 'Anaerobes', type: 'pathogen', gramStain: 'mixed', shape: 'bacilli', morphology: 'mixed (various morphologies)', description: 'Mixed anaerobic flora in abscesses and polymicrobial infections', commonSites: ['Abdomen', 'Pelvis', 'Deep tissues', 'Oral cavity'], resistance: 'Variable, often sensitive to metronidazole', severity: 'medium' } },
  { data: { id: 'HSV', label: 'HSV', type: 'pathogen', gramStain: 'virus', shape: 'bacilli', morphology: 'enveloped DNA virus', description: 'DNA virus causing neonatal infections and encephalitis', commonSites: ['Brain', 'Skin', 'Mucous membranes', 'Genital tract'], resistance: 'Antiviral resistance (acyclovir)', severity: 'high' } },
  { data: { id: 'Respiratory viruses', label: 'Respiratory viruses', type: 'pathogen', gramStain: 'virus', shape: 'bacilli', morphology: 'various viral morphologies', description: 'Including influenza, adenovirus, RSV, coronavirus, human metapneumovirus', commonSites: ['Respiratory tract', 'Lungs'], resistance: 'Variable antiviral resistance', severity: 'medium' } },

  // =============================================================================
  // ANTIBIOTIC NODES (30 nodes)
  // =============================================================================
  { data: { id: 'Penicillin', label: 'Penicillin', type: 'antibiotic', class: 'Penicillins', category: 'Beta-lactam', spectrum: 'Narrow; gram-positive cocci', mechanism: 'Cell wall synthesis inhibition', route: 'IV/PO' } },
  { data: { id: 'Vancomycin', label: 'Vancomycin', type: 'antibiotic', class: 'Glycopeptides', category: 'Glycopeptide', spectrum: 'Narrow; gram-positive including MRSA', mechanism: 'Cell wall synthesis inhibition', route: 'IV' } },
  { data: { id: 'Ciprofloxacin', label: 'Ciprofloxacin', type: 'antibiotic', class: 'Fluoroquinolones', category: 'Fluoroquinolone', spectrum: 'Broad; gram-negative and atypical', mechanism: 'DNA gyrase inhibition', route: 'IV/PO' } },
  { data: { id: 'Ceftriaxone', label: 'Ceftriaxone', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Broad; gram-positive and gram-negative', mechanism: 'Cell wall synthesis inhibition', route: 'IV/IM' } },
  { data: { id: 'Azithromycin', label: 'Azithromycin', type: 'antibiotic', class: 'Macrolides', category: 'Macrolide', spectrum: 'Moderate; atypical and gram-positive', mechanism: 'Protein synthesis inhibition', route: 'PO/IV' } },
  { data: { id: 'Clindamycin', label: 'Clindamycin', type: 'antibiotic', class: 'Lincosamides', category: 'Lincosamide', spectrum: 'Moderate; gram-positive and anaerobic', mechanism: 'Protein synthesis inhibition', route: 'IV/PO' } },
  { data: { id: 'Gentamicin', label: 'Gentamicin', type: 'antibiotic', class: 'Aminoglycosides', category: 'Aminoglycoside', spectrum: 'Narrow to moderate; gram-negative', mechanism: 'Protein synthesis inhibition', route: 'IV/IM' } },
  { data: { id: 'Meropenem', label: 'Meropenem', type: 'antibiotic', class: 'Carbapenems', category: 'Beta-lactam', spectrum: 'Ultra-broad; gram-positive, gram-negative, anaerobic', mechanism: 'Cell wall synthesis inhibition', route: 'IV' } },
  { data: { id: 'Doxycycline', label: 'Doxycycline', type: 'antibiotic', class: 'Tetracyclines', category: 'Tetracycline', spectrum: 'Broad; atypical and tick-borne', mechanism: 'Protein synthesis inhibition', route: 'PO/IV' } },
  { data: { id: 'TMP-SMX', label: 'TMP-SMX', type: 'antibiotic', class: 'Sulfonamides', category: 'Folate inhibitor', spectrum: 'Broad; gram-positive including MRSA', mechanism: 'Folate synthesis inhibition', route: 'PO/IV' } },
  { data: { id: 'Linezolid', label: 'Linezolid', type: 'antibiotic', class: 'Oxazolidinones', category: 'Oxazolidinone', spectrum: 'Narrow; gram-positive including MRSA and VRE', mechanism: 'Protein synthesis inhibition', route: 'PO/IV' } },
  { data: { id: 'Metronidazole', label: 'Metronidazole', type: 'antibiotic', class: 'Nitroimidazoles', category: 'Nitroimidazole', spectrum: 'Narrow; anaerobic and protozoal', mechanism: 'DNA damage via free radicals', route: 'PO/IV' } },
  { data: { id: 'Cefazolin', label: 'Cefazolin', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Narrow; gram-positive', mechanism: 'Cell wall synthesis inhibition', route: 'IV/IM' } },
  { data: { id: 'Piperacillin-Tazobactam', label: 'Pip-Tazo', type: 'antibiotic', class: 'Penicillins', category: 'Beta-lactam', spectrum: 'Ultra-broad; including Pseudomonas', mechanism: 'Cell wall synthesis inhibition + β-lactamase inhibition', route: 'IV' } },
  { data: { id: 'Ampicillin', label: 'Ampicillin', type: 'antibiotic', class: 'Penicillins', category: 'Beta-lactam', spectrum: 'Moderate; gram-positive and some gram-negative', mechanism: 'Cell wall synthesis inhibition', route: 'IV/PO' } },
  { data: { id: 'Amoxicillin', label: 'Amoxicillin', type: 'antibiotic', class: 'Penicillins', category: 'Beta-lactam', spectrum: 'Moderate; gram-positive and selected gram-negative', mechanism: 'Cell wall synthesis inhibition', route: 'PO' } },
  { data: { id: 'Amoxicillin-clavulanate', label: 'Amox-clav', type: 'antibiotic', class: 'Penicillins', category: 'Beta-lactam', spectrum: 'Broad; gram-positive and gram-negative', mechanism: 'Cell wall synthesis + β-lactamase inhibition', route: 'PO' } },
  { data: { id: 'Ampicillin-sulbactam', label: 'Amp-sulb', type: 'antibiotic', class: 'Penicillins', category: 'Beta-lactam', spectrum: 'Broad; gram-positive, gram-negative, anaerobic', mechanism: 'Cell wall synthesis + β-lactamase inhibition', route: 'IV/IM' } },
  { data: { id: 'Cefdinir', label: 'Cefdinir', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Broad; gram-positive and moderate gram-negative', mechanism: 'Cell wall synthesis inhibition', route: 'PO' } },
  { data: { id: 'Cefepime', label: 'Cefepime', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Ultra-broad; including Pseudomonas', mechanism: 'Cell wall synthesis inhibition', route: 'IV/IM' } },
  { data: { id: 'Cefotaxime', label: 'Cefotaxime', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Broad; excellent CNS penetration', mechanism: 'Cell wall synthesis inhibition', route: 'IV/IM' } },
  { data: { id: 'Cefpodoxime', label: 'Cefpodoxime', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Broad; gram-positive and gram-negative', mechanism: 'Cell wall synthesis inhibition', route: 'PO' } },
  { data: { id: 'Ceftaroline', label: 'Ceftaroline', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Broad; including MRSA', mechanism: 'Cell wall synthesis inhibition', route: 'IV' } },
  { data: { id: 'Cefuroxime', label: 'Cefuroxime', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Moderate; gram-positive and selected gram-negative', mechanism: 'Cell wall synthesis inhibition', route: 'IV/PO' } },
  { data: { id: 'Cephalexin', label: 'Cephalexin', type: 'antibiotic', class: 'Cephalosporins', category: 'Beta-lactam', spectrum: 'Narrow; primarily gram-positive', mechanism: 'Cell wall synthesis inhibition', route: 'PO' } },
  { data: { id: 'Daptomycin', label: 'Daptomycin', type: 'antibiotic', class: 'Lipopeptides', category: 'Lipopeptide', spectrum: 'Narrow; gram-positive including MRSA and VRE', mechanism: 'Cell membrane disruption', route: 'IV' } },
  { data: { id: 'Levofloxacin', label: 'Levofloxacin', type: 'antibiotic', class: 'Fluoroquinolones', category: 'Fluoroquinolone', spectrum: 'Broad; respiratory and gram-negative', mechanism: 'DNA gyrase inhibition', route: 'IV/PO' } },
  { data: { id: 'Nafcillin', label: 'Nafcillin', type: 'antibiotic', class: 'Penicillins', category: 'Beta-lactam', spectrum: 'Narrow; MSSA', mechanism: 'Cell wall synthesis inhibition', route: 'IV/IM' } },
  { data: { id: 'Oxacillin', label: 'Oxacillin', type: 'antibiotic', class: 'Penicillins', category: 'Beta-lactam', spectrum: 'Narrow; MSSA', mechanism: 'Cell wall synthesis inhibition', route: 'IV/IM' } },
  { data: { id: 'Acyclovir', label: 'Acyclovir', type: 'antibiotic', class: 'Antivirals', category: 'Antiviral', spectrum: 'Antiviral; HSV and VZV', mechanism: 'DNA polymerase inhibition', route: 'IV/PO' } },
];

/**
 * Evidence-Based Pathogen Relationships
 *
 * All 42 edges derived from systematic analysis of AAP Red Book Online (RBO.json)
 * covering 22 clinical syndromes. Each relationship includes:
 * - source/target: Pathogen IDs (matching node IDs exactly)
 * - label: Relationship type (anatomic-association, co-infection, shared-resistance,
 *          treatment-interaction, similar-coverage, antibiotic-class)
 * - strength: Clinical strength rating (very-high, high, medium-high, medium)
 * - evidence: AAP Red Book syndrome ID(s)
 * - clinicalContext: Brief teaching note (1-2 sentences)
 * - tier: Priority ranking (1=critical, 2=high, 3=medium)
 * - pediatricRelevance: Why it matters for pediatric learners
 *
 * Medical validation: Josh Pankin, PGY-3 Pediatrics
 * Created: 2025-10-14
 * Source: AAP Red Book Online (RBO.json) - 22 syndromes analyzed
 */
export const edges: CytoscapeEdge[] = [
  // =============================================================================
  // TIER 1 - CRITICAL RELATIONSHIPS (8 edges)
  // =============================================================================

  // Edge 1: GBS ↔ E. coli
  {
    data: {
      source: 'GBS',
      target: 'E. coli',
      label: 'anatomic-association',
      strength: 'very-high',
      evidence: 'neonatal_fever_term_neonates, unclear_source_neonatal_fever, suspected_meningitis_neonatal_fever',
      clinicalContext: 'Two most important neonatal sepsis/meningitis pathogens. GBS predominates early-onset (<7d), E. coli in late-onset and meningitis.',
      tier: 1,
      pediatricRelevance: 'CRITICAL - Ampicillin + gentamicin empiric coverage targets both organisms'
    }
  },

  // Edge 2: Pneumococcus ↔ H. flu
  {
    data: {
      source: 'Pneumococcus',
      target: 'H. flu',
      label: 'anatomic-association',
      strength: 'very-high',
      evidence: 'acute_otitis_media, acute_sinusitis, meningitis_non_neonates',
      clinicalContext: '"The big 3" for pediatric AOM/sinusitis (with M. cat). Post-Hib vaccine, non-typeable H. flu remains common.',
      tier: 1,
      pediatricRelevance: 'CRITICAL - First-line amoxicillin/amoxicillin-clavulanate designed to cover both'
    }
  },

  // Edge 3: Pneumococcus ↔ M. catarrhalis
  {
    data: {
      source: 'Pneumococcus',
      target: 'M. catarrhalis',
      label: 'anatomic-association',
      strength: 'very-high',
      evidence: 'acute_otitis_media, acute_sinusitis',
      clinicalContext: 'Completes "big 3" AOM/sinusitis trio. M. cat 100% β-lactamase producers requiring amox-clav in failures.',
      tier: 1,
      pediatricRelevance: 'CRITICAL - Understanding when to escalate from amoxicillin to amox-clav'
    }
  },

  // Edge 4: Staph aureus ↔ Group A Strep
  {
    data: {
      source: 'Staph aureus',
      target: 'Group A Strep',
      label: 'anatomic-association',
      strength: 'very-high',
      evidence: 'cellulitis_nonpurulent, purulent_cellulitis_abscess, lymphadenitis',
      clinicalContext: 'Dominant SSTI pathogens. Staph (MRSA) in purulent/abscesses; GAS in non-purulent cellulitis.',
      tier: 1,
      pediatricRelevance: 'CRITICAL - Empiric therapy differs: purulent (I&D + MRSA coverage) vs non-purulent (β-lactam)'
    }
  },

  // Edge 5: Staph aureus ↔ K. kingae
  {
    data: {
      source: 'Staph aureus',
      target: 'K. kingae',
      label: 'anatomic-association',
      strength: 'high',
      evidence: 'osteomyelitis, septic_arthritis',
      clinicalContext: 'Pediatric bone/joint infections. Staph most common all ages; K. kingae critical in <5yo (esp 6-36mo).',
      tier: 1,
      pediatricRelevance: 'CRITICAL - Pediatric-specific: Clindamycin does NOT cover K. kingae'
    }
  },

  // Edge 6: E. coli ↔ Anaerobes
  {
    data: {
      source: 'E. coli',
      target: 'Anaerobes',
      label: 'co-infection',
      strength: 'very-high',
      evidence: 'intra_abdominal_infection',
      clinicalContext: 'Polymicrobial intra-abdominal infections require coverage of aerobic GNRs (E. coli) and anaerobes (B. fragilis).',
      tier: 1,
      pediatricRelevance: 'CRITICAL - Pip-tazo OR ceftriaxone + metronidazole for dual coverage'
    }
  },

  // Edge 7: Pneumococcus ↔ Meningococcus
  {
    data: {
      source: 'Pneumococcus',
      target: 'Meningococcus',
      label: 'anatomic-association',
      strength: 'high',
      evidence: 'meningitis_non_neonates',
      clinicalContext: 'Post-Hib era leading causes of pediatric bacterial meningitis. Vanc + ceftriaxone empiric.',
      tier: 1,
      pediatricRelevance: 'CRITICAL - Medical emergency requiring immediate empiric therapy'
    }
  },

  // Edge 8: H. flu ↔ M. catarrhalis
  {
    data: {
      source: 'H. flu',
      target: 'M. catarrhalis',
      label: 'anatomic-association',
      strength: 'high',
      evidence: 'acute_otitis_media, acute_sinusitis',
      clinicalContext: 'Both β-lactamase producers (~30-50% H. flu, ~100% M. cat) requiring amox-clav in failures.',
      tier: 1,
      pediatricRelevance: 'CRITICAL - Completes AOM trio understanding'
    }
  },

  // =============================================================================
  // TIER 2 - HIGH PRIORITY RELATIONSHIPS (12 edges)
  // =============================================================================

  // Edge 9: E. coli ↔ Proteus
  {
    data: {
      source: 'E. coli',
      target: 'Proteus',
      label: 'anatomic-association',
      strength: 'high',
      evidence: 'uti_pyelonephritis',
      clinicalContext: 'Common UTI pathogens. E. coli 75-90%; Proteus notable for struvite stones (urease production).',
      tier: 2,
      pediatricRelevance: 'Proteus associated with staghorn calculi and alkaline urine'
    }
  },

  // Edge 10: E. coli ↔ Enterococcus
  {
    data: {
      source: 'E. coli',
      target: 'Enterococcus',
      label: 'anatomic-association',
      strength: 'medium-high',
      evidence: 'uti_pyelonephritis, neonatal_fever_term_neonates',
      clinicalContext: 'Both cause UTI. Enterococcus more common in neonates/complicated UTIs. Requires ampicillin (not cephalosporins).',
      tier: 2,
      pediatricRelevance: 'Critical gap in cephalosporin coverage - why amp + gent needed in neonatal UTI'
    }
  },

  // Edge 11: Pneumococcus ↔ Staph aureus
  {
    data: {
      source: 'Pneumococcus',
      target: 'Staph aureus',
      label: 'anatomic-association',
      strength: 'high',
      evidence: 'community_acquired_pneumonia, mastoiditis',
      clinicalContext: 'CAP pathogens. Staph CAP increased in MRSA era, can cause severe necrotizing pneumonia.',
      tier: 2,
      pediatricRelevance: 'Severe CAP: consider MRSA coverage (vanc/clinda) esp with cavitary lesions/effusion'
    }
  },

  // Edge 12: Staph aureus ↔ Respiratory viruses
  {
    data: {
      source: 'Staph aureus',
      target: 'Respiratory viruses',
      label: 'treatment-interaction',
      strength: 'high',
      evidence: 'community_acquired_pneumonia',
      clinicalContext: 'Viral infections (esp influenza) predispose to bacterial superinfection, particularly Staph aureus.',
      tier: 2,
      pediatricRelevance: 'During flu season, severe CAP after viral illness requires empiric MRSA coverage'
    }
  },

  // Edge 13: S. anginosus ↔ Anaerobes
  {
    data: {
      source: 'S. anginosus',
      target: 'Anaerobes',
      label: 'co-infection',
      strength: 'high',
      evidence: 'retropharyngeal_abscess, mastoiditis',
      clinicalContext: 'Polymicrobial head/neck deep space infections. Both are oral flora causing abscesses.',
      tier: 2,
      pediatricRelevance: 'Ampicillin-sulbactam or clindamycin for dual coverage + surgical drainage'
    }
  },

  // Edge 14: Staph aureus ↔ CoNS
  {
    data: {
      source: 'Staph aureus',
      target: 'CoNS',
      label: 'shared-resistance',
      strength: 'high',
      evidence: 'uncomplicated_bloodstream_infection_nonneonates',
      clinicalContext: 'Both share mecA gene (methicillin resistance). CoNS common contaminant but true pathogen with catheters.',
      tier: 2,
      pediatricRelevance: 'Shared mecA-mediated resistance. Clinical judgment needed: true infection vs contamination'
    }
  },

  // Edge 15: E. coli ↔ Klebsiella (ENHANCED)
  {
    data: {
      source: 'E. coli',
      target: 'Klebsiella',
      label: 'shared-resistance',
      strength: 'high',
      evidence: 'uti_pyelonephritis, uncomplicated_bloodstream_infection_nonneonates',
      clinicalContext: 'Similar coverage AND shared ESBL resistance. Both require carbapenems when ESBL-producing.',
      tier: 2,
      pediatricRelevance: 'ESBL organisms require carbapenem therapy (meropenem/ertapenem) - critical stewardship point'
    }
  },

  // Edge 16: C. diff ↔ E. coli
  {
    data: {
      source: 'C. diff',
      target: 'E. coli',
      label: 'treatment-interaction',
      strength: 'medium-high',
      evidence: 'antibiotic_stewardship_principles',
      clinicalContext: 'Broad-spectrum antibiotics for Gram-negatives (esp cephalosporins) increase C. diff risk.',
      tier: 2,
      pediatricRelevance: 'Antibiotic stewardship: minimize unnecessary antibiotics, prefer narrow-spectrum agents'
    }
  },

  // Edge 17: Enterococcus ↔ E. faecium
  {
    data: {
      source: 'Enterococcus',
      target: 'E. faecium',
      label: 'shared-resistance',
      strength: 'high',
      evidence: 'uncomplicated_bloodstream_infection_nonneonates',
      clinicalContext: 'E. faecalis typically ampicillin-susceptible; E. faecium often ampicillin-resistant and VRE.',
      tier: 2,
      pediatricRelevance: 'CRITICAL distinction: E. faecalis→ampicillin; E. faecium→vancomycin (or linezolid/dapto if VRE)'
    }
  },

  // Edge 18: GBS ↔ HSV
  {
    data: {
      source: 'GBS',
      target: 'HSV',
      label: 'co-infection',
      strength: 'high',
      evidence: 'neonatal_fever_term_neonates, suspected_meningitis_neonatal_fever',
      clinicalContext: 'Neonatal fever workup must consider both bacterial and viral (HSV) causes.',
      tier: 2,
      pediatricRelevance: 'Add acyclovir if high-risk: seizures, CSF pleocytosis, vesicles, hepatitis'
    }
  },

  // Edge 19: Klebsiella ↔ Enterobacter
  {
    data: {
      source: 'Klebsiella',
      target: 'Enterobacter',
      label: 'shared-resistance',
      strength: 'medium-high',
      evidence: 'uncomplicated_bloodstream_infection_nonneonates',
      clinicalContext: 'Both can acquire CRE. Enterobacter has inducible AmpC (cephalosporin resistance with exposure).',
      tier: 2,
      pediatricRelevance: 'CRE requires ID consultation. Enterobacter AmpC: cephalosporins select for resistance'
    }
  },

  // Edge 20: Pneumococcus ↔ Mycoplasma
  {
    data: {
      source: 'Pneumococcus',
      target: 'Mycoplasma',
      label: 'anatomic-association',
      strength: 'high',
      evidence: 'community_acquired_pneumonia',
      clinicalContext: 'Classic "typical vs atypical" CAP distinction, though clinical overlap significant.',
      tier: 2,
      pediatricRelevance: 'School-age/adolescents: add azithromycin to β-lactam for atypical coverage'
    }
  },

  // =============================================================================
  // TIER 3 - MEDIUM PRIORITY RELATIONSHIPS (22 edges)
  // =============================================================================

  // Edge 21: E. coli ↔ Enterobacter
  {
    data: {
      source: 'E. coli',
      target: 'Enterobacter',
      label: 'anatomic-association',
      strength: 'medium',
      evidence: 'uti_pyelonephritis, uncomplicated_bloodstream_infection_nonneonates',
      clinicalContext: 'Both cause UTI/BSI. E. coli community-acquired; Enterobacter healthcare-associated.',
      tier: 3,
      pediatricRelevance: 'Enterobacter suggests healthcare exposure or complicated infection'
    }
  },

  // Edge 22: Klebsiella ↔ Proteus
  {
    data: {
      source: 'Klebsiella',
      target: 'Proteus',
      label: 'anatomic-association',
      strength: 'medium',
      evidence: 'uti_pyelonephritis',
      clinicalContext: 'Less common UTI pathogens vs E. coli. Proteus associated with stones.',
      tier: 3,
      pediatricRelevance: 'Proteus UTI should prompt urinary tract abnormality evaluation'
    }
  },

  // Edge 23: E. coli ↔ S. saprophyticus
  {
    data: {
      source: 'E. coli',
      target: 'S. saprophyticus',
      label: 'anatomic-association',
      strength: 'medium',
      evidence: 'uti_sexually_active_adolescents',
      clinicalContext: 'S. saprophyticus is 2nd most common UTI pathogen in sexually active adolescent females (10-20%).',
      tier: 3,
      pediatricRelevance: 'Age/gender-specific. Exception to "CoNS = contaminant" rule'
    }
  },

  // Edge 24: GBS ↔ Enterococcus
  {
    data: {
      source: 'GBS',
      target: 'Enterococcus',
      label: 'anatomic-association',
      strength: 'medium-high',
      evidence: 'neonatal_fever_term_neonates',
      clinicalContext: 'Both Gram-positive cocci in neonatal infections. Both covered by ampicillin.',
      tier: 3,
      pediatricRelevance: 'Reinforces ampicillin component of amp + gent regimen'
    }
  },

  // Edge 25: E. coli ↔ HSV
  {
    data: {
      source: 'E. coli',
      target: 'HSV',
      label: 'co-infection',
      strength: 'medium',
      evidence: 'suspected_meningitis_neonatal_fever',
      clinicalContext: 'Neonatal meningitis: bacterial (E. coli) and viral (HSV) etiologies both considered.',
      tier: 3,
      pediatricRelevance: 'Triple therapy (amp + gent/cefotaxime + acyclovir) in high-risk scenarios'
    }
  },

  // Edge 26: K. kingae ↔ Group A Strep
  {
    data: {
      source: 'K. kingae',
      target: 'Group A Strep',
      label: 'anatomic-association',
      strength: 'medium',
      evidence: 'septic_arthritis, osteomyelitis',
      clinicalContext: 'Pediatric septic arthritis pathogens (Staph most common).',
      tier: 3,
      pediatricRelevance: 'Empiric therapy must cover all three organisms'
    }
  },

  // Edge 27: Staph aureus ↔ Enterococcus
  {
    data: {
      source: 'Staph aureus',
      target: 'Enterococcus',
      label: 'anatomic-association',
      strength: 'medium',
      evidence: 'uncomplicated_bloodstream_infection_nonneonates',
      clinicalContext: 'Different BSI sources: Staph (skin/catheters); Enterococcus (GI/GU).',
      tier: 3,
      pediatricRelevance: 'Different coverage needs: Staph (anti-staph agent); Entero (amp or vanc)'
    }
  },

  // Edge 28: Staph aureus ↔ Anaerobes
  {
    data: {
      source: 'Staph aureus',
      target: 'Anaerobes',
      label: 'co-infection',
      strength: 'medium',
      evidence: 'necrotizing_fasciitis_polymicrobial_ssti',
      clinicalContext: 'Polymicrobial necrotizing SSTI can include Staph (MRSA) and anaerobes.',
      tier: 3,
      pediatricRelevance: 'Surgical emergency. Broad-spectrum antibiotics + aggressive debridement'
    }
  },

  // Edge 29: E. coli ↔ Pseudomonas
  {
    data: {
      source: 'E. coli',
      target: 'Pseudomonas',
      label: 'anatomic-association',
      strength: 'medium',
      evidence: 'uncomplicated_bloodstream_infection_nonneonates',
      clinicalContext: 'Gram-negative bacteremia. Pseudomonas more healthcare-associated/immunocompromised.',
      tier: 3,
      pediatricRelevance: 'Pseudomonas requires specific coverage (cefepime, pip-tazo, meropenem)'
    }
  },

  // Edge 30: Pneumococcus ↔ Group A Strep
  {
    data: {
      source: 'Pneumococcus',
      target: 'Group A Strep',
      label: 'anatomic-association',
      strength: 'medium',
      evidence: 'community_acquired_pneumonia',
      clinicalContext: 'CAP pathogens. Pneumococcus far more common; GAS can cause severe pneumonia with empyema.',
      tier: 3,
      pediatricRelevance: 'Standard β-lactam covers both organisms'
    }
  },

  // Edge 31: Pneumococcus ↔ Fusobacterium
  {
    data: {
      source: 'Pneumococcus',
      target: 'Fusobacterium',
      label: 'co-infection',
      strength: 'medium',
      evidence: 'mastoiditis',
      clinicalContext: 'Polymicrobial mastoiditis. Fusobacterium (anaerobe) co-infects in complicated cases.',
      tier: 3,
      pediatricRelevance: 'Chronic/severe mastoiditis may require anaerobic coverage'
    }
  },

  // Edge 32: Microaerophilic strep ↔ Fusobacterium
  {
    data: {
      source: 'Microaerophilic strep',
      target: 'Fusobacterium',
      label: 'co-infection',
      strength: 'medium',
      evidence: 'mastoiditis, retropharyngeal_abscess',
      clinicalContext: 'Oral flora polymicrobial head/neck infections.',
      tier: 3,
      pediatricRelevance: 'Amp-sulbactam or clindamycin covers both'
    }
  },

  // Edge 33: S. anginosus ↔ Fusobacterium
  {
    data: {
      source: 'S. anginosus',
      target: 'Fusobacterium',
      label: 'co-infection',
      strength: 'medium-high',
      evidence: 'retropharyngeal_abscess',
      clinicalContext: 'Classic polymicrobial pairing in head/neck deep space infections.',
      tier: 3,
      pediatricRelevance: 'Requires aerobic + anaerobic coverage plus surgical drainage'
    }
  },

  // Edge 34: S. anginosus ↔ Microaerophilic strep
  {
    data: {
      source: 'S. anginosus',
      target: 'Microaerophilic strep',
      label: 'co-infection',
      strength: 'medium',
      evidence: 'oral_flora_polymicrobial_infections',
      clinicalContext: 'Both oral streptococci causing abscesses and endocarditis (viridans group).',
      tier: 3,
      pediatricRelevance: 'Both covered by ampicillin/penicillin. Endocarditis prophylaxis considerations'
    }
  },

  // Edge 35: Klebsiella ↔ Anaerobes
  {
    data: {
      source: 'Klebsiella',
      target: 'Anaerobes',
      label: 'co-infection',
      strength: 'medium',
      evidence: 'intra_abdominal_infection',
      clinicalContext: 'Polymicrobial intra-abdominal infections.',
      tier: 3,
      pediatricRelevance: 'Pip-tazo or ceftriaxone + metronidazole for dual coverage'
    }
  },

  // Edge 36: Meningococcus ↔ H. flu
  {
    data: {
      source: 'Meningococcus',
      target: 'H. flu',
      label: 'anatomic-association',
      strength: 'medium-high',
      evidence: 'meningitis_non_neonates',
      clinicalContext: 'Meningitis trio (pneumo, meningo, H. flu). All encapsulated with effective vaccines.',
      tier: 3,
      pediatricRelevance: 'Vaccine-preventable diseases demonstrating public health impact'
    }
  },

  // Edge 38: C. diff ↔ Klebsiella
  {
    data: {
      source: 'C. diff',
      target: 'Klebsiella',
      label: 'treatment-interaction',
      strength: 'medium',
      evidence: 'antibiotic_stewardship_principles',
      clinicalContext: 'Broad-spectrum antibiotics (cephalosporins for Klebsiella) increase C. diff risk.',
      tier: 3,
      pediatricRelevance: 'Minimize cephalosporin duration, prefer narrow-spectrum agents'
    }
  },

  // Edge 39: C. diff ↔ Pseudomonas
  {
    data: {
      source: 'C. diff',
      target: 'Pseudomonas',
      label: 'treatment-interaction',
      strength: 'medium',
      evidence: 'antibiotic_stewardship_principles',
      clinicalContext: 'Prolonged anti-pseudomonal therapy increases C. diff risk.',
      tier: 3,
      pediatricRelevance: 'Limit broad-spectrum duration. De-escalate when cultures available'
    }
  },

  // Edge 40: Group A Strep ↔ Anaerobes
  {
    data: {
      source: 'Group A Strep',
      target: 'Anaerobes',
      label: 'co-infection',
      strength: 'medium',
      evidence: 'retropharyngeal_abscess',
      clinicalContext: 'Polymicrobial retropharyngeal abscesses.',
      tier: 3,
      pediatricRelevance: 'Amp-sulbactam or clindamycin for dual coverage'
    }
  },

  // Edge 41: Staph aureus ↔ S. anginosus
  {
    data: {
      source: 'Staph aureus',
      target: 'S. anginosus',
      label: 'co-infection',
      strength: 'medium',
      evidence: 'orbital_cellulitis',
      clinicalContext: 'Polymicrobial orbital cellulitis, especially with sinusitis.',
      tier: 3,
      pediatricRelevance: 'Ophthalmologic emergency: ceftriaxone + vancomycin (or amp-sulbactam)'
    }
  },

  // =============================================================================
  // ANTIBIOTIC SUSCEPTIBILITY EDGES - CRITICAL GRAM-POSITIVE COVERAGE
  // =============================================================================

  // MRSA Coverage - Vancomycin, TMP-SMX, Linezolid, Daptomycin, Ceftaroline
  { data: { source: 'Staph aureus', target: 'Vancomycin', label: 'susceptible', strength: 'very-high', clinicalContext: 'Gold standard for MRSA treatment', tier: 1 } },
  { data: { source: 'Staph aureus', target: 'TMP-SMX', label: 'susceptible', strength: 'high', clinicalContext: 'Oral option for uncomplicated MRSA skin infections', tier: 1 } },
  { data: { source: 'Staph aureus', target: 'Linezolid', label: 'susceptible', strength: 'high', clinicalContext: 'MRSA pneumonia alternative to vancomycin', tier: 1 } },
  { data: { source: 'Staph aureus', target: 'Daptomycin', label: 'susceptible', strength: 'high', clinicalContext: 'MRSA bacteremia (NOT for pneumonia)', tier: 1 } },
  { data: { source: 'Staph aureus', target: 'Ceftaroline', label: 'susceptible', strength: 'high', clinicalContext: 'Advanced cephalosporin with MRSA activity', tier: 1 } },

  // MSSA Coverage - Anti-staphylococcal penicillins
  { data: { source: 'Staph aureus', target: 'Nafcillin', label: 'susceptible', strength: 'very-high', clinicalContext: 'First-line for MSSA infections', tier: 1 } },
  { data: { source: 'Staph aureus', target: 'Oxacillin', label: 'susceptible', strength: 'very-high', clinicalContext: 'Alternative anti-staphylococcal penicillin', tier: 1 } },
  { data: { source: 'Staph aureus', target: 'Cefazolin', label: 'susceptible', strength: 'high', clinicalContext: 'MSSA alternative with better PK/PD', tier: 1 } },

  // MRSA Resistance
  { data: { source: 'Staph aureus', target: 'Penicillin', label: 'resistant', strength: 'very-high', clinicalContext: 'Beta-lactamase production', tier: 1 } },
  { data: { source: 'Staph aureus', target: 'Ampicillin', label: 'resistant', strength: 'very-high', clinicalContext: 'Not stable against staphylococcal beta-lactamase', tier: 1 } },

  // Streptococcal Coverage - Penicillin remains gold standard
  { data: { source: 'Group A Strep', target: 'Penicillin', label: 'susceptible', strength: 'very-high', clinicalContext: 'First-line for GAS pharyngitis, cellulitis', tier: 1 } },
  { data: { source: 'Group A Strep', target: 'Amoxicillin', label: 'susceptible', strength: 'very-high', clinicalContext: 'Oral alternative to penicillin', tier: 1 } },
  { data: { source: 'Group A Strep', target: 'Cephalexin', label: 'susceptible', strength: 'high', clinicalContext: 'Alternative for penicillin-allergic patients', tier: 1 } },

  { data: { source: 'Pneumococcus', target: 'Penicillin', label: 'susceptible', strength: 'high', clinicalContext: 'Effective for non-meningeal infections despite resistance', tier: 1 } },
  { data: { source: 'Pneumococcus', target: 'Amoxicillin', label: 'susceptible', strength: 'high', clinicalContext: 'High-dose for AOM/sinusitis with resistance', tier: 1 } },
  { data: { source: 'Pneumococcus', target: 'Ceftriaxone', label: 'susceptible', strength: 'very-high', clinicalContext: 'Empiric for meningitis, severe CAP', tier: 1 } },
  { data: { source: 'Pneumococcus', target: 'Vancomycin', label: 'susceptible', strength: 'very-high', clinicalContext: 'Meningitis coverage for resistant strains', tier: 1 } },
  { data: { source: 'Pneumococcus', target: 'Azithromycin', label: 'susceptible', strength: 'medium', clinicalContext: 'Resistance increasing, avoid monotherapy for severe infections', tier: 2 } },

  { data: { source: 'GBS', target: 'Ampicillin', label: 'susceptible', strength: 'very-high', clinicalContext: 'First-line for neonatal GBS infections', tier: 1 } },
  { data: { source: 'GBS', target: 'Penicillin', label: 'susceptible', strength: 'very-high', clinicalContext: 'Standard for GBS prophylaxis and treatment', tier: 1 } },

  // Enterococcal Coverage
  { data: { source: 'Enterococcus', target: 'Ampicillin', label: 'susceptible', strength: 'very-high', clinicalContext: 'First-line for E. faecalis', tier: 1 } },
  { data: { source: 'Enterococcus', target: 'Vancomycin', label: 'susceptible', strength: 'high', clinicalContext: 'Alternative for beta-lactam allergy', tier: 1 } },
  { data: { source: 'Enterococcus', target: 'Ceftriaxone', label: 'resistant', strength: 'very-high', clinicalContext: 'No enterococcal coverage - important gap', tier: 1 } },
  { data: { source: 'Enterococcus', target: 'Cefepime', label: 'resistant', strength: 'very-high', clinicalContext: 'No enterococcal coverage', tier: 1 } },

  { data: { source: 'E. faecium', target: 'Ampicillin', label: 'resistant', strength: 'high', clinicalContext: 'Intrinsically resistant unlike E. faecalis', tier: 1 } },
  { data: { source: 'E. faecium', target: 'Vancomycin', label: 'susceptible', strength: 'medium', clinicalContext: 'VRE common - requires susceptibility testing', tier: 1 } },
  { data: { source: 'E. faecium', target: 'Linezolid', label: 'susceptible', strength: 'high', clinicalContext: 'VRE alternative', tier: 1 } },
  { data: { source: 'E. faecium', target: 'Daptomycin', label: 'susceptible', strength: 'high', clinicalContext: 'VRE alternative for bacteremia', tier: 1 } },

  // =============================================================================
  // ANTIBIOTIC SUSCEPTIBILITY EDGES - GRAM-NEGATIVE COVERAGE
  // =============================================================================

  // E. coli - Common UTI/GI pathogen
  { data: { source: 'E. coli', target: 'Ceftriaxone', label: 'susceptible', strength: 'high', clinicalContext: 'Standard for pyelonephritis', tier: 1 } },
  { data: { source: 'E. coli', target: 'Gentamicin', label: 'susceptible', strength: 'high', clinicalContext: 'Neonatal sepsis coverage (amp + gent)', tier: 1 } },
  { data: { source: 'E. coli', target: 'TMP-SMX', label: 'susceptible', strength: 'medium', clinicalContext: 'Oral for uncomplicated cystitis (resistance increasing)', tier: 2 } },
  { data: { source: 'E. coli', target: 'Ciprofloxacin', label: 'susceptible', strength: 'high', clinicalContext: 'Effective but reserve for resistant organisms', tier: 2 } },
  { data: { source: 'E. coli', target: 'Meropenem', label: 'susceptible', strength: 'very-high', clinicalContext: 'ESBL-producing E. coli requires carbapenem', tier: 1 } },
  { data: { source: 'E. coli', target: 'Ampicillin', label: 'resistant', strength: 'high', clinicalContext: 'High resistance rates in community', tier: 2 } },

  // Klebsiella
  { data: { source: 'Klebsiella', target: 'Ceftriaxone', label: 'susceptible', strength: 'high', clinicalContext: 'Effective for non-ESBL strains', tier: 1 } },
  { data: { source: 'Klebsiella', target: 'Gentamicin', label: 'susceptible', strength: 'high', clinicalContext: 'Hospital-acquired coverage', tier: 1 } },
  { data: { source: 'Klebsiella', target: 'Meropenem', label: 'susceptible', strength: 'very-high', clinicalContext: 'CRE/ESBL treatment', tier: 1 } },
  { data: { source: 'Klebsiella', target: 'Ampicillin', label: 'resistant', strength: 'very-high', clinicalContext: 'Intrinsic ampicillin resistance', tier: 1 } },

  // Pseudomonas - Requires specific anti-pseudomonal coverage
  { data: { source: 'Pseudomonas', target: 'Piperacillin-Tazobactam', label: 'susceptible', strength: 'very-high', clinicalContext: 'Broad-spectrum with anti-pseudomonal activity', tier: 1 } },
  { data: { source: 'Pseudomonas', target: 'Cefepime', label: 'susceptible', strength: 'very-high', clinicalContext: 'Anti-pseudomonal cephalosporin', tier: 1 } },
  { data: { source: 'Pseudomonas', target: 'Meropenem', label: 'susceptible', strength: 'very-high', clinicalContext: 'Reserve for MDR Pseudomonas', tier: 1 } },
  { data: { source: 'Pseudomonas', target: 'Ciprofloxacin', label: 'susceptible', strength: 'high', clinicalContext: 'Oral option for susceptible strains', tier: 1 } },
  { data: { source: 'Pseudomonas', target: 'Gentamicin', label: 'susceptible', strength: 'high', clinicalContext: 'Combination therapy with beta-lactam', tier: 1 } },
  { data: { source: 'Pseudomonas', target: 'Ceftriaxone', label: 'resistant', strength: 'very-high', clinicalContext: 'No anti-pseudomonal activity', tier: 1 } },
  { data: { source: 'Pseudomonas', target: 'Ampicillin', label: 'resistant', strength: 'very-high', clinicalContext: 'Intrinsically resistant', tier: 1 } },

  // H. flu - Respiratory pathogen
  { data: { source: 'H. flu', target: 'Amoxicillin-clavulanate', label: 'susceptible', strength: 'very-high', clinicalContext: 'Covers beta-lactamase producers for AOM', tier: 1 } },
  { data: { source: 'H. flu', target: 'Ceftriaxone', label: 'susceptible', strength: 'very-high', clinicalContext: 'Standard for meningitis, severe infections', tier: 1 } },
  { data: { source: 'H. flu', target: 'Azithromycin', label: 'susceptible', strength: 'high', clinicalContext: 'Alternative for AOM/sinusitis', tier: 2 } },
  { data: { source: 'H. flu', target: 'Amoxicillin', label: 'susceptible', strength: 'medium', clinicalContext: '30-50% beta-lactamase producers', tier: 1 } },

  { data: { source: 'M. catarrhalis', target: 'Amoxicillin-clavulanate', label: 'susceptible', strength: 'very-high', clinicalContext: '100% beta-lactamase - requires inhibitor', tier: 1 } },
  { data: { source: 'M. catarrhalis', target: 'Azithromycin', label: 'susceptible', strength: 'high', clinicalContext: 'Effective for AOM/sinusitis', tier: 1 } },
  { data: { source: 'M. catarrhalis', target: 'Amoxicillin', label: 'resistant', strength: 'very-high', clinicalContext: '100% beta-lactamase production', tier: 1 } },

  { data: { source: 'Meningococcus', target: 'Ceftriaxone', label: 'susceptible', strength: 'very-high', clinicalContext: 'First-line for meningococcal meningitis', tier: 1 } },
  { data: { source: 'Meningococcus', target: 'Penicillin', label: 'susceptible', strength: 'very-high', clinicalContext: 'Historical standard, ceftriaxone preferred', tier: 1 } },

  // =============================================================================
  // ANTIBIOTIC SUSCEPTIBILITY EDGES - ATYPICAL & SPECIAL PATHOGENS
  // =============================================================================

  // Mycoplasma (atypical - no cell wall)
  { data: { source: 'Mycoplasma', target: 'Azithromycin', label: 'susceptible', strength: 'very-high', clinicalContext: 'First-line for atypical pneumonia', tier: 1 } },
  { data: { source: 'Mycoplasma', target: 'Doxycycline', label: 'susceptible', strength: 'high', clinicalContext: 'Alternative for atypical coverage', tier: 1 } },
  { data: { source: 'Mycoplasma', target: 'Penicillin', label: 'resistant', strength: 'very-high', clinicalContext: 'No cell wall - beta-lactams ineffective', tier: 1 } },
  { data: { source: 'Mycoplasma', target: 'Ceftriaxone', label: 'resistant', strength: 'very-high', clinicalContext: 'Beta-lactams ineffective against atypicals', tier: 1 } },

  // Anaerobes
  { data: { source: 'Anaerobes', target: 'Metronidazole', label: 'susceptible', strength: 'very-high', clinicalContext: 'Gold standard for anaerobic coverage', tier: 1 } },
  { data: { source: 'Anaerobes', target: 'Clindamycin', label: 'susceptible', strength: 'high', clinicalContext: 'Alternative with gram-positive coverage', tier: 1 } },
  { data: { source: 'Anaerobes', target: 'Ampicillin-sulbactam', label: 'susceptible', strength: 'high', clinicalContext: 'Broad-spectrum including anaerobes', tier: 1 } },
  { data: { source: 'Anaerobes', target: 'Piperacillin-Tazobactam', label: 'susceptible', strength: 'high', clinicalContext: 'Ultra-broad including anaerobic coverage', tier: 1 } },
  { data: { source: 'Anaerobes', target: 'Gentamicin', label: 'resistant', strength: 'very-high', clinicalContext: 'Aminoglycosides do not cover anaerobes', tier: 1 } },

  // C. diff
  { data: { source: 'C. diff', target: 'Metronidazole', label: 'susceptible', strength: 'high', clinicalContext: 'First-line for mild-moderate C. diff', tier: 1 } },
  { data: { source: 'C. diff', target: 'Vancomycin', label: 'susceptible', strength: 'very-high', clinicalContext: 'Oral vancomycin for severe C. diff (not absorbed)', tier: 1 } },

  // HSV (viral)
  { data: { source: 'HSV', target: 'Acyclovir', label: 'susceptible', strength: 'very-high', clinicalContext: 'Antiviral for neonatal HSV and encephalitis', tier: 1 } },
  { data: { source: 'HSV', target: 'Vancomycin', label: 'resistant', strength: 'very-high', clinicalContext: 'Antibiotics ineffective against viruses', tier: 1 } },
  { data: { source: 'HSV', target: 'Ceftriaxone', label: 'resistant', strength: 'very-high', clinicalContext: 'Antibiotics ineffective against viruses', tier: 1 } },

  // Respiratory viruses
  { data: { source: 'Respiratory viruses', target: 'Azithromycin', label: 'resistant', strength: 'very-high', clinicalContext: 'Antibiotics do not treat viral infections', tier: 2 } },
  { data: { source: 'Respiratory viruses', target: 'Amoxicillin', label: 'resistant', strength: 'very-high', clinicalContext: 'Viral URI - antibiotics not indicated', tier: 2 } }
];

// Note: Original plan had 42 edges, but 2 were duplicates removed:
// - Pneumococcus ↔ H. flu appeared twice (Edge 2 covers AOM/sinusitis AND meningitis)
// - Pneumococcus ↔ Staph aureus appeared twice (Edge 11 covers CAP AND mastoiditis)
// Final count: 40 unique evidence-based edges

const pathogenGraphData = {
  nodes,
  edges,
};

/**
 * Default export: Complete pathogen relationship data structure
 * Combines both legacy Cytoscape format and new Jaccard similarity-based relationships
 */
export default {
  ...pathogenGraphData,
  relationships: allRelationships,
  relationshipStats: stats,
  getRelationshipsForPathogen,
  getRelationshipsByType,
  getRelationshipsAboveThreshold,
};
