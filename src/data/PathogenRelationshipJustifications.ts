/**
 * Pathogen Relationship Medical Justifications
 *
 * Comprehensive clinical rationales for all pathogen relationships
 * Each justification includes anatomic associations, resistance patterns,
 * clinical context, and evidence-based source attributions.
 *
 * All content is evidence-based and references:
 * - AAP Red Book Online (https://publications.aap.org/redbook)
 * - IDSA Guidelines (https://www.idsociety.org)
 * - AAP Pediatric Clinical Informatics
 *
 * Medical validation: Josh Pankin, PGY-3 Pediatrics
 * Created: 2025-11-29
 */

/**
 * Medical justifications keyed by "sourceId_targetId" relationship
 * Each justification includes clinical context, teaching points, and board relevance
 */

export type BoardRelevanceLevel = 'CRITICAL' | 'IMPORTANT' | 'additional';
export type ImportanceLevel = 'high' | 'medium' | 'low';

export interface PathogenRelationshipJustification {
  clinicalRationale: string;
  anatomicAssociation: string;
  sharedResistance: string[];
  clinicalContext: string;
  medicalSource: string;
  teachingPoints: string[];
  boardRelevance: string;
  importance: ImportanceLevel;
}

export type RelationshipJustificationsMap = Record<string, PathogenRelationshipJustification>;

export const relationshipJustifications: RelationshipJustificationsMap = {
  // ============================================================================
  // TIER 1 - CRITICAL NEONATAL RELATIONSHIPS
  // ============================================================================

  'GBS_E. coli': {
    clinicalRationale: 'Two most important causes of neonatal sepsis and meningitis. GBS predominates in early-onset disease (<7 days); E. coli dominates late-onset infections and meningitis.',
    anatomicAssociation: 'Both colonize maternal genital/GI tract; vertical transmission during delivery or ascending infection.',
    sharedResistance: ['Beta-lactamase variable', 'Generally penicillin-susceptible'],
    clinicalContext: 'Empiric ampicillin + gentamicin covers both; cephalosporins DO NOT cover GBS (critical gap). Neonatal meningitis requires gram-negative CNS penetration.',
    medicalSource: 'AAP Red Book - Neonatal Fever (Term Neonates, Age 0-7 days and 7-28 days)',
    teachingPoints: [
      'Ampicillin required for GBS coverage (cephalosporins ineffective)',
      'Gentamicin synergy with ampicillin increases drug uptake',
      'E. coli K1 strains have enhanced meningitis potential',
      'Maternal GBS colonization status affects empiric therapy'
    ],
    boardRelevance: 'CRITICAL - Distinguishing early vs late-onset neonatal sepsis directly affects antibiotic selection',
    importance: 'high'
  },

  'Pneumococcus_H. flu': {
    clinicalRationale: 'The "big 2" (with M. catarrhalis = "big 3") for community-acquired AOM and sinusitis. Post-Hib vaccine, pneumococcus remains most common; H. flu less frequent but important.',
    anatomicAssociation: 'Both colonize nasopharynx; cause otitis media, sinusitis, and respiratory infections via local spread.',
    sharedResistance: ['Beta-lactamase variable (H. flu)', 'Penicillin resistance emerging (pneumococcus)'],
    clinicalContext: 'Amoxicillin covers both in non-resistant strains. Amox-clav needed if beta-lactamase positive. High-dose amoxicillin for penicillin-resistant pneumococcus.',
    medicalSource: 'AAP Red Book - Acute Otitis Media and Acute Sinusitis',
    teachingPoints: [
      'Amoxicillin first-line for AOM despite resistance',
      'Amox-clav for failures or suspicious beta-lactamase',
      'High-dose amoxicillin targets penicillin-resistant pneumococcus',
      'Post-Hib vaccine, H. flu now primarily non-typeable'
    ],
    boardRelevance: 'CRITICAL - Understanding "big 3" AOM pathogens is foundational for pediatric infectious diseases',
    importance: 'high'
  },

  'Pneumococcus_M. catarrhalis': {
    clinicalRationale: 'Completes the "big 3" AOM/sinusitis pathogens. M. catarrhalis 100% beta-lactamase producers requiring amox-clav in cases of treatment failure.',
    anatomicAssociation: 'Both nasopharyngeal commensals causing AOM via eustachian tube obstruction and sinusitis via sinus obstruction.',
    sharedResistance: ['M. catarrhalis: 100% beta-lactamase producers', 'Pneumococcus: variable resistance'],
    clinicalContext: 'Initial therapy often amoxicillin; amox-clav if failure or suspicion of resistance. M. catarrhalis resistance explains treatment failures on plain amoxicillin.',
    medicalSource: 'AAP Red Book - Acute Otitis Media',
    teachingPoints: [
      'M. catarrhalis 100% beta-lactamase (NOT penetration resistance)',
      'Understanding beta-lactamase explains clinical failures',
      'Amox-clav specifically chosen to cover beta-lactamase producers',
      'M. catarrhalis coverage is KEY to successful AOM therapy'
    ],
    boardRelevance: 'CRITICAL - Understanding beta-lactamase production is essential for antibiotic stewardship',
    importance: 'high'
  },

  'Staph aureus_Group A Strep': {
    clinicalRationale: 'Dominant SSTI pathogens with different clinical presentations. Staph (especially MRSA) in purulent/suppurative lesions; GAS in non-purulent cellulitis.',
    anatomicAssociation: 'Both cause skin and soft tissue infections via breaks in skin barrier.',
    sharedResistance: ['GAS: uniformly penicillin-susceptible', 'Staph: variable (MSSA vs MRSA)'],
    clinicalContext: 'Empiric therapy differs: purulent infections require I&D and MRSA coverage (vanc/doxycycline); non-purulent respond to beta-lactams. Critical distinction for pediatric management.',
    medicalSource: 'AAP Red Book - Skin and Soft Tissue Infections (SSTI)',
    teachingPoints: [
      'Purulent vs non-purulent distinction drives therapy',
      'MRSA prevalence makes MRSA coverage mandatory in purulent SSTI',
      'GAS causes non-purulent cellulitis (affects choice)',
      'Incision and drainage required for staph abscesses'
    ],
    boardRelevance: 'CRITICAL - MRSA prevalence fundamentally changed pediatric SSTI management',
    importance: 'high'
  },

  'Staph aureus_K. kingae': {
    clinicalRationale: 'Pediatric bone and joint infection pathogens. Staph aureus most common all ages; K. kingae critical in <5 yo (especially 6-36 months). Often overlooked in young children.',
    anatomicAssociation: 'Both cause osteomyelitis and septic arthritis via hematogenous spread.',
    sharedResistance: ['Both susceptible to first-line agents', 'MRSA coverage important for staph'],
    clinicalContext: 'CRITICAL: Clindamycin does NOT cover K. kingae. Cephalosporins are first-line because they cover BOTH organisms. Incomplete empiric coverage is a common pitfall.',
    medicalSource: 'AAP Red Book - Osteomyelitis and Septic Arthritis; Pediatric Orthopedic Society guidelines',
    teachingPoints: [
      'K. kingae is common in young children (<5 yo)',
      'Clindamycin fails against K. kingae (CRITICAL PITFALL)',
      'Cephalosporins cover both staph and K. kingae',
      'Kingella kingae culture techniques differ (enriched media needed)',
      'Often cultured from bone and joint fluids in young children'
    ],
    boardRelevance: 'CRITICAL - K. kingae is pediatric-specific and often missed; causes significant morbidity',
    importance: 'high'
  },

  'E. coli_Anaerobes': {
    clinicalRationale: 'Polymicrobial intra-abdominal infections require dual coverage. E. coli represents aerobic gram-negative flora; anaerobes (B. fragilis, others) represent obligate anaerobic flora.',
    anatomicAssociation: 'Both normally colonize GI tract; IAI from perforation requires coverage of both.',
    sharedResistance: ['E. coli: variable resistance', 'Anaerobes: variable metronidazole resistance'],
    clinicalContext: 'Pip-tazo OR ceftriaxone + metronidazole for dual coverage. Anaerobic coverage essential for intra-abdominal infections. Monotherapy with cephalosporin incomplete.',
    medicalSource: 'AAP Red Book - Intra-abdominal Infections; IDSA IAI Guidelines',
    teachingPoints: [
      'IAI are almost always polymicrobial',
      'Anaerobic coverage is NON-NEGOTIABLE',
      'Pip-tazo is single agent covering both',
      'B. fragilis resistance to ampicillin/amox requires special coverage',
      'Aminoglycosides do NOT cover anaerobes'
    ],
    boardRelevance: 'CRITICAL - Understanding polymicrobial IAI is essential for surgical pediatrics',
    importance: 'high'
  },

  'Pneumococcus_Meningococcus': {
    clinicalRationale: 'Post-Hib era leading causes of pediatric bacterial meningitis. Both vaccine-preventable but still cause disease. Mortality 15-20% even with treatment.',
    anatomicAssociation: 'Both cause meningitis via hematogenous spread after respiratory colonization.',
    sharedResistance: ['Both variable penicillin resistance', 'Both susceptible to cephalosporins'],
    clinicalContext: 'Medical EMERGENCY. Empiric vancomycin + ceftriaxone mandatory. Empiric therapy must cover before culture results. Dexamethasone controversial but often given.',
    medicalSource: 'AAP Red Book - Meningitis (Non-neonatal); IDSA Meningitis Guidelines',
    teachingPoints: [
      'Bacterial meningitis is medical emergency',
      'Empiric therapy based on clinical suspicion, NOT culture results',
      'Vancomycin covers penicillin-resistant organisms',
      'Ceftriaxone provides excellent CNS penetration',
      'Meningococcal septicemia requires immediate recognition'
    ],
    boardRelevance: 'CRITICAL - Meningitis requires immediate recognition and empiric therapy',
    importance: 'high'
  },

  'H. flu_M. catarrhalis': {
    clinicalRationale: 'Both beta-lactamase producers (30-50% H. flu, ~100% M. cat). When amoxicillin fails AOM, beta-lactamase production is often responsible.',
    anatomicAssociation: 'Both nasopharyngeal commensals causing respiratory infections.',
    sharedResistance: ['Both beta-lactamase producers', 'Both susceptible to amox-clav'],
    clinicalContext: 'Beta-lactamase production explains clinical failures on amoxicillin. Understanding mechanism clarifies why amox-clav works when amoxicillin fails.',
    medicalSource: 'AAP Red Book - Acute Otitis Media',
    teachingPoints: [
      'Beta-lactamase destroys amoxicillin',
      'Clavulanic acid inactivates beta-lactamase',
      'Prevalence of beta-lactamase varies geographically',
      'Complete "big 3" understanding requires knowing resistance mechanisms'
    ],
    boardRelevance: 'IMPORTANT - Beta-lactamase resistance explains many AOM treatment failures',
    importance: 'high'
  },

  // ============================================================================
  // TIER 2 - HIGH PRIORITY RELATIONSHIPS
  // ============================================================================

  'E. coli_Proteus': {
    clinicalRationale: 'Both common UTI pathogens. E. coli 75-90% of community UTIs; Proteus notable for struvite stone formation (urease production).',
    anatomicAssociation: 'Both gram-negative enteric pathogens causing ascending UTI.',
    sharedResistance: ['Both variable resistance', 'Proteus resistant to nitrofurantoin'],
    clinicalContext: 'Standard UTI coverage addresses both. Proteus associated with alkaline urine and stone formation - imaging may be indicated.',
    medicalSource: 'AAP Red Book - Urinary Tract Infection',
    teachingPoints: [
      'Proteus urease production causes ammonia (alkaline urine)',
      'Staghorn calculi associated with Proteus',
      'Both treatable with standard UTI antibiotics',
      'Different resistance patterns may affect drug choice'
    ],
    boardRelevance: 'IMPORTANT - Proteus stone formation affects long-term management',
    importance: 'medium'
  },

  'E. coli_Enterococcus': {
    clinicalRationale: 'Both cause UTI. Enterococcus more common in neonates and complicated UTIs. Requires ampicillin (NOT cephalosporins) - critical coverage gap.',
    anatomicAssociation: 'Both colonize urinary and GI tracts.',
    sharedResistance: ['E. coli: variable', 'Enterococcus: intrinsically resistant to cephalosporins'],
    clinicalContext: 'CRITICAL: Cephalosporins have no enterococcal coverage. This explains why cephalosporin monotherapy fails in some neonatal UTIs. Ampicillin specifically added for coverage.',
    medicalSource: 'AAP Red Book - Urinary Tract Infection in Neonates',
    teachingPoints: [
      'Enterococcus intrinsically resistant to cephalosporins',
      'Ampicillin required for enterococcal coverage',
      'This is key gap in neonatal UTI therapy',
      'Explains why amp + gent used instead of cephalosporin'
    ],
    boardRelevance: 'CRITICAL - Enterococcal resistance to cephalosporins is a common knowledge gap',
    importance: 'high'
  },

  'Pneumococcus_Staph aureus': {
    clinicalRationale: 'CAP pathogens. Staph CAP increased in MRSA era; can cause severe necrotizing pneumonia. Pneumococcus remains most common.',
    anatomicAssociation: 'Both cause community-acquired pneumonia via respiratory colonization.',
    sharedResistance: ['Both variable resistance', 'MRSA in Staph CAP'],
    clinicalContext: 'Severe CAP with cavitary lesions/effusion suggests staph. Consider MRSA coverage (vanc/clinda) if severe presentation or risk factors.',
    medicalSource: 'AAP Red Book - Community-Acquired Pneumonia',
    teachingPoints: [
      'Staph CAP often more severe (cavitation, pneumatoceles)',
      'MRSA prevalence increased in post-2000 CAP',
      'Clinical presentation may suggest organism',
      'Parapneumonic effusions common with both'
    ],
    boardRelevance: 'IMPORTANT - MRSA prevalence fundamentally changed CAP empiric therapy',
    importance: 'medium'
  },

  'Staph aureus_Respiratory viruses': {
    clinicalRationale: 'Viral infections (especially influenza) predispose to bacterial superinfection, particularly Staph aureus. Post-influenza MRSA pneumonia is well-described.',
    anatomicAssociation: 'Viral damage to respiratory epithelium allows bacterial superinfection.',
    sharedResistance: ['Staph: variable MRSA', 'Viruses: no antibiotic resistance'],
    clinicalContext: 'During flu season, severe CAP after viral illness should include empiric MRSA coverage. Secondary bacterial infection increases mortality.',
    medicalSource: 'AAP Red Book - Influenza; Community-Acquired Pneumonia',
    teachingPoints: [
      'Viral infections impair mucociliary clearance',
      'Post-influenza MRSA pneumonia is deadly',
      'Clinical worsening after initial improvement suggests secondary infection',
      'Supports empiric broad-spectrum coverage in severe viral CAP'
    ],
    boardRelevance: 'IMPORTANT - Post-viral superinfection is clinical pearl in pediatric practice',
    importance: 'medium'
  },

  'S. anginosus_Anaerobes': {
    clinicalRationale: 'Polymicrobial head/neck deep space infections. Both are oral flora causing abscesses with difficulty localizing source.',
    anatomicAssociation: 'Both part of oral microbiota causing deep space infections via local spread.',
    sharedResistance: ['Both susceptible to appropriate coverage'],
    clinicalContext: 'Ampicillin-sulbactam OR clindamycin for dual coverage plus surgical drainage. Source control essential.',
    medicalSource: 'AAP Red Book - Head and Neck Infections',
    teachingPoints: [
      'Viridans group streptococci often polymicrobial',
      'Both aerobic and anaerobic coverage needed',
      'Surgical drainage essential (antibiotics insufficient)',
      'Brain abscess risk with inadequate therapy'
    ],
    boardRelevance: 'IMPORTANT - Head/neck polymicrobial infections require dual coverage and source control',
    importance: 'medium'
  },

  'Staph aureus_CoNS': {
    clinicalRationale: 'Both share mecA gene (methicillin resistance). CoNS common contaminant but true pathogen with catheters. Shared resistance patterns.',
    anatomicAssociation: 'Both skin flora; CoNS common on catheters and medical devices.',
    sharedResistance: ['Both share mecA gene for methicillin resistance'],
    clinicalContext: 'Shared resistance but different clinical significance. CoNS BSI requires clinical judgment: true infection vs contamination. Multiple positive cultures suggest true infection.',
    medicalSource: 'AAP Red Book - Device-Related Infections',
    teachingPoints: [
      'CoNS is common contaminant (skin flora)',
      'Single positive culture likely contamination',
      'Multiple positives from different sites suggests true infection',
      'Both need vancomycin if MRSA'
    ],
    boardRelevance: 'IMPORTANT - Distinguishing true infection from contamination affects therapy',
    importance: 'medium'
  },

  'E. coli_Klebsiella': {
    clinicalRationale: 'Similar coverage AND shared ESBL resistance. Both gram-negative enteric pathogens. ESBL-producing strains require carbapenem therapy.',
    anatomicAssociation: 'Both gram-negative enteric flora causing UTI and BSI.',
    sharedResistance: ['Both can produce ESBL', 'E. coli: variable', 'Klebsiella: often encapsulated (mucoid)'],
    clinicalContext: 'Standard therapy covers both until ESBL identified. ESBL organisms require meropenem/ertapenem. Critical stewardship point.',
    medicalSource: 'IDSA ESBL Guidelines; AAP Red Book',
    teachingPoints: [
      'ESBL-producing organisms require carbapenems',
      'Extended-spectrum cephalosporins NOT adequate',
      'ESBL prevalence varies geographically',
      'Carbapenem stewardship important but safety mandatory'
    ],
    boardRelevance: 'CRITICAL - ESBL resistance is emerging threat requiring appropriate therapy',
    importance: 'high'
  },

  'C. diff_E. coli': {
    clinicalRationale: 'Treatment interaction: broad-spectrum antibiotics for gram-negatives (especially cephalosporins) increase C. diff risk.',
    anatomicAssociation: 'Antibiotic stewardship principle: minimizing unnecessary antibiotics reduces C. diff risk.',
    sharedResistance: ['No direct resistance', 'Stewardship principle'],
    clinicalContext: 'Antibiotic stewardship principle: use narrow-spectrum agents when appropriate. E. coli UTI can often use TMP-SMX instead of broad-spectrum.',
    medicalSource: 'IDSA Antibiotic Stewardship Guidelines',
    teachingPoints: [
      'C. diff is consequence of broad-spectrum therapy',
      'Minimize unnecessary antibiotics',
      'Prefer narrow-spectrum agents',
      'De-escalate when culture results available'
    ],
    boardRelevance: 'IMPORTANT - Antibiotic stewardship reduces C. diff incidence',
    importance: 'medium'
  },

  'Enterococcus_E. faecium': {
    clinicalRationale: 'E. faecalis typically ampicillin-susceptible; E. faecium often ampicillin-resistant and VRE. Distinction is critical for therapy.',
    anatomicAssociation: 'Both part of GI tract flora causing UTI and BSI.',
    sharedResistance: ['E. faecalis: ampicillin-susceptible', 'E. faecium: intrinsically ampicillin-resistant, VRE common'],
    clinicalContext: 'CRITICAL: E. faecalis→ampicillin; E. faecium→vancomycin (or linezolid/daptomycin if VRE). Species identification changes therapy.',
    medicalSource: 'IDSA Enterococcal Infection Guidelines',
    teachingPoints: [
      'Species matters: E. faecalis vs E. faecium',
      'E. faecalis ampicillin-susceptible (different resistance)',
      'VRE common in healthcare settings',
      'Daptomycin excellent for VRE BSI'
    ],
    boardRelevance: 'CRITICAL - Enterococcal species identification directly affects therapy',
    importance: 'high'
  },

  'GBS_HSV': {
    clinicalRationale: 'Neonatal fever workup must consider both bacterial and viral (HSV) causes. Neonatal herpes mortality 30-40% without treatment.',
    anatomicAssociation: 'Both cause neonatal infection via different pathogenesis (vertical transmission).',
    sharedResistance: ['No overlap', 'Different treatment'],
    clinicalContext: 'Add acyclovir if high-risk: seizures, CSF pleocytosis, vesicles, hepatitis. Early acyclovir crucial for improved outcomes.',
    medicalSource: 'AAP Red Book - Herpes Simplex Virus (Neonatal); Neonatal Fever Guidelines',
    teachingPoints: [
      'Neonatal HSV mortality is HIGH',
      'Clinical presentation may be vague',
      'CSF pleocytosis (lymphocytic) suggests HSV',
      'Empiric acyclovir recommended in high-risk neonates'
    ],
    boardRelevance: 'CRITICAL - Neonatal HSV is often missed; early treatment saves lives',
    importance: 'high'
  },

  'Klebsiella_Enterobacter': {
    clinicalRationale: 'Both can acquire CRE. Enterobacter has inducible AmpC (cephalosporin resistance can develop with exposure).',
    anatomicAssociation: 'Both gram-negative enteric pathogens.',
    sharedResistance: ['Both can be CRE', 'Enterobacter: AmpC beta-lactamase (inducible)'],
    clinicalContext: 'CRE requires ID consultation. Enterobacter AmpC: cephalosporins select for resistance - avoid if possible.',
    medicalSource: 'IDSA Multidrug-Resistant Gram-Negative Pathogen Guidelines',
    teachingPoints: [
      'CRE is serious multidrug-resistant pathogen',
      'Enterobacter AmpC is INDUCIBLE (develops with exposure)',
      'Carbapenems often only option',
      'ID consultation strongly recommended'
    ],
    boardRelevance: 'CRITICAL - CRE is emerging threat with few treatment options',
    importance: 'high'
  },

  'Pneumococcus_Mycoplasma': {
    clinicalRationale: 'Classic "typical vs atypical" CAP distinction, though clinical overlap significant. Mycoplasma typically older children/adolescents.',
    anatomicAssociation: 'Both cause community-acquired pneumonia via respiratory route.',
    sharedResistance: ['Pneumococcus: beta-lactam susceptible', 'Mycoplasma: beta-lactam resistant (no cell wall)'],
    clinicalContext: 'School-age/adolescents: add azithromycin to β-lactam for atypical coverage. Covers both typical and atypical pathogens.',
    medicalSource: 'AAP Red Book - Community-Acquired Pneumonia',
    teachingPoints: [
      'Typical pneumonia = pneumococcus',
      'Atypical presentation suggests Mycoplasma',
      'Clinical features can overlap',
      'Azithromycin covers both organisms'
    ],
    boardRelevance: 'IMPORTANT - Understanding CAP pathogen epidemiology by age group',
    importance: 'medium'
  },

  // ============================================================================
  // TIER 3 - MEDIUM PRIORITY RELATIONSHIPS (partial list for brevity)
  // ============================================================================

  'E. coli_Enterobacter': {
    clinicalRationale: 'Both cause UTI/BSI. E. coli community-acquired; Enterobacter healthcare-associated.',
    anatomicAssociation: 'Both gram-negative enteric flora.',
    sharedResistance: ['Both variable', 'Enterobacter: intrinsic AmpC'],
    clinicalContext: 'Enterobacter presence suggests healthcare exposure or complicated infection. Different empiric approach may be indicated.',
    medicalSource: 'AAP Red Book',
    teachingPoints: ['Epidemiology guides empiric therapy', 'Healthcare association increases resistance risk'],
    boardRelevance: 'IMPORTANT - Epidemiology distinguishes community vs healthcare pathogens',
    importance: 'medium'
  },

  'Klebsiella_Proteus': {
    clinicalRationale: 'Less common UTI pathogens vs E. coli. Proteus associated with stones.',
    anatomicAssociation: 'Both gram-negative UTI pathogens.',
    sharedResistance: ['Variable'],
    clinicalContext: 'Proteus UTI should prompt urinary tract abnormality evaluation.',
    medicalSource: 'AAP Red Book - Urinary Tract Infection',
    teachingPoints: ['Proteus stone formation affects imaging decisions'],
    boardRelevance: 'IMPORTANT - Specific pathogens guide diagnostic workup',
    importance: 'medium'
  },

  'E. coli_S. saprophyticus': {
    clinicalRationale: 'S. saprophyticus is 2nd most common UTI pathogen in sexually active adolescent females (10-20%).',
    anatomicAssociation: 'Both cause UTI via ascending infection.',
    sharedResistance: ['Both variable'],
    clinicalContext: 'Age/gender-specific pathogen. Exception to "CoNS = contaminant" rule.',
    medicalSource: 'AAP Red Book - Urinary Tract Infection in Adolescents',
    teachingPoints: ['S. saprophyticus epidemiology is age/gender-specific', 'Not a contaminant in sexually active adolescent females'],
    boardRelevance: 'IMPORTANT - Recognizing age/gender-specific pathogens',
    importance: 'medium'
  },

  'GBS_Enterococcus': {
    clinicalRationale: 'Both gram-positive cocci in neonatal infections. Both covered by ampicillin.',
    anatomicAssociation: 'Both maternal flora colonizing neonate.',
    sharedResistance: ['Both ampicillin-susceptible'],
    clinicalContext: 'Reinforces ampicillin component of amp + gent regimen.',
    medicalSource: 'AAP Red Book - Neonatal Infections',
    teachingPoints: ['Ampicillin coverage is crucial for both organisms'],
    boardRelevance: 'IMPORTANT - Understanding empiric neonatal therapy',
    importance: 'medium'
  },

  'E. coli_HSV': {
    clinicalRationale: 'Neonatal meningitis: bacterial (E. coli) and viral (HSV) etiologies both considered.',
    anatomicAssociation: 'Both cause neonatal meningitis via different mechanisms.',
    sharedResistance: ['No overlap'],
    clinicalContext: 'Triple therapy (amp + gent/cefotaxime + acyclovir) in high-risk scenarios.',
    medicalSource: 'AAP Red Book - Neonatal Meningitis',
    teachingPoints: ['Triple coverage required if HSV cannot be excluded'],
    boardRelevance: 'CRITICAL - Neonatal meningitis requires comprehensive empiric coverage',
    importance: 'high'
  },

  'K. kingae_Group A Strep': {
    clinicalRationale: 'Pediatric septic arthritis pathogens with Staph as most common.',
    anatomicAssociation: 'Both cause bone/joint infections.',
    sharedResistance: ['Both susceptible to cephalosporins'],
    clinicalContext: 'Empiric therapy must cover all three organisms.',
    medicalSource: 'AAP Red Book - Septic Arthritis',
    teachingPoints: ['Empiric coverage must address K. kingae in young children'],
    boardRelevance: 'IMPORTANT - Kingella is pediatric-specific concern',
    importance: 'medium'
  }
};

/**
 * Get justification for a specific pathogen relationship
 * @param sourceId - Source pathogen ID or name
 * @param targetId - Target pathogen ID or name
 * @returns Justification object or null if not found
 */
export const getRelationshipJustification = (sourceId: string | number, targetId: string | number): PathogenRelationshipJustification | null => {
  const key = `${sourceId}_${targetId}`;
  return relationshipJustifications[key] || null;
};

/**
 * Get all high-priority justifications (teaching focus)
 * @returns Array of high-importance relationships
 */
export const getHighPriorityJustifications = (): Array<PathogenRelationshipJustification & { key: string }> => {
  return Object.entries(relationshipJustifications)
    .filter(([, data]) => data.importance === 'high')
    .map(([key, data]) => ({ key, ...data }));
};

/**
 * Get justifications by board relevance level
 * @param level - 'CRITICAL', 'IMPORTANT', or 'additional'
 * @returns Filtered justifications
 */
export const getJustificationsByBoardRelevance = (level: BoardRelevanceLevel): Array<PathogenRelationshipJustification & { key: string }> => {
  return Object.entries(relationshipJustifications)
    .filter(([, data]) => data.boardRelevance?.startsWith(level))
    .map(([key, data]) => ({ key, ...data }));
};

export default relationshipJustifications;
