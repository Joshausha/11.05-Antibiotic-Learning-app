/**
 * Text Formatting Utilities for Cytoscape Labels
 *
 * Provides intelligent line breaking based on syllables and phonemes
 * for medical terminology to create more balanced, readable multi-line labels.
 */

/**
 * Type definitions for text formatting
 */

interface SyllablePatterns {
  [key: string]: string;
}

interface CytoscapeNodeData {
  type: 'pathogen' | 'antibiotic' | string;
  label: string;
  [key: string]: any;
}

interface CytoscapeNode {
  data: CytoscapeNodeData;
  [key: string]: any;
}

/**
 * Smart line breaking for medical pathogen names
 * Uses syllable-aware breaking to create more balanced line distribution
 *
 * @param text - The text to format
 * @param maxCharsPerLine - Approximate max characters per line
 * @returns - Text with newline characters inserted
 */
export function formatPathogenLabel(text: string, maxCharsPerLine: number = 10): string {
  // Medical term syllable breaking patterns
  const syllablePatterns: SyllablePatterns = {
    // Common medical prefixes and suffixes
    'Staph aureus': 'Staph\naureus',
    'Group A Strep': 'Group A\nStrep',
    'Pneumococcus': 'Pneumo-\ncoccus',
    'Pseudomonas': 'Pseudo-\nmonas',
    'Enterococcus': 'Entero-\ncoccus',
    'Acinetobacter': 'Acinet-\nobacter',
    'Meningococcus': 'Meningo-\ncoccus',
    'Microaerophilic strep': 'Microaero-\nphilic strep',
    'Fusobacterium': 'Fuso-\nbacterium',
    'Enterobacter': 'Entero-\nbacter',
    'Citrobacter': 'Citro-\nbacter',
    'Bartonella': 'Barton-\nella',
    'Mycoplasma': 'Myco-\nplasma',
    'Klebsiella': 'Kleb-\nsiella',

    // Abbreviated forms
    'M. catarrhalis': 'M. catar-\nrhalis',
    'S. anginosus': 'S. angi-\nnosus',
    'K. kingae': 'K.\nkingae',
    'S. saprophyticus': 'S. sapro-\nphyticus',
    'E. coli': 'E.\ncoli',
    'E. faecium': 'E.\nfaecium',
    'H. flu': 'H.\nflu',
    'C. diff': 'C.\ndiff',

    // Special cases
    'CoNS': 'CoNS', // Too short to break
    'GBS': 'GBS', // Too short to break
    'NTM': 'NTM', // Too short to break
    'HSV': 'HSV', // Too short to break
    'Anaerobes': 'Ana-\nerobes',
    'Respiratory viruses': 'Respira-\ntory viruses',
    'Proteus': 'Pro-\nteus'
  };

  // Check if we have a pre-defined pattern
  if (syllablePatterns[text]) {
    return syllablePatterns[text];
  }

  // Fallback: Simple word-based breaking for unknown terms
  const words = text.split(' ');
  if (words.length === 1) {
    // Single word: try to break at middle
    const mid = Math.ceil(text.length / 2);
    return text.slice(0, mid) + '-\n' + text.slice(mid);
  } else if (words.length === 2) {
    // Two words: break between words
    return words.join('\n');
  } else {
    // Multiple words: group intelligently
    const half = Math.ceil(words.length / 2);
    return words.slice(0, half).join(' ') + '\n' + words.slice(half).join(' ');
  }
}

/**
 * Smart line breaking for antibiotic names
 * Creates balanced lines for medication names
 *
 * @param text - The antibiotic name
 * @param maxCharsPerLine - Approximate max characters per line
 * @returns - Text with newline characters inserted
 */
export function formatAntibioticLabel(text: string, maxCharsPerLine: number = 12): string {
  // Antibiotic name syllable breaking patterns
  const syllablePatterns: SyllablePatterns = {
    // Penicillins
    'Penicillin': 'Peni-\ncillin',
    'Ampicillin': 'Ampi-\ncillin',
    'Amoxicillin': 'Amoxi-\ncillin',
    'Piperacillin-Tazobactam': 'Piperacillin-\nTazobactam',
    'Nafcillin': 'Naf-\ncillin',
    'Oxacillin': 'Oxa-\ncillin',

    // Cephalosporins
    'Cefazolin': 'Cefa-\nzolin',
    'Ceftriaxone': 'Ceftri-\naxone',
    'Cefepime': 'Cefi-\npime',
    'Ceftazidime': 'Ceftazi-\ndime',
    'Ceftaroline': 'Ceftaro-\nline',

    // Carbapenems
    'Meropenem': 'Mero-\npenem',
    'Ertapenem': 'Erta-\npenem',
    'Imipenem': 'Imi-\npenem',

    // Aminoglycosides
    'Gentamicin': 'Genta-\nmicin',
    'Tobramycin': 'Tobra-\nmycin',
    'Amikacin': 'Ami-\nkacin',

    // Fluoroquinolones
    'Ciprofloxacin': 'Cipro-\nfloxacin',
    'Levofloxacin': 'Levo-\nfloxacin',
    'Moxifloxacin': 'Moxi-\nfloxacin',

    // Macrolides
    'Azithromycin': 'Azithro-\nmycin',
    'Clarithromycin': 'Clarithro-\nmycin',

    // Glycopeptides
    'Vancomycin': 'Vanco-\nmycin',

    // Others
    'Clindamycin': 'Clinda-\nmycin',
    'Linezolid': 'Line-\nzolid',
    'Metronidazole': 'Metro-\nnidazole',
    'TMP-SMX': 'TMP-\nSMX',
    'Doxycycline': 'Doxy-\ncycline',
    'Daptomycin': 'Dapto-\nmycin',
    'Acyclovir': 'Acy-\nclovir'
  };

  // Check if we have a pre-defined pattern
  if (syllablePatterns[text]) {
    return syllablePatterns[text];
  }

  // Fallback for unknown antibiotics
  if (text.includes('-')) {
    // Combination drugs: break at hyphen
    return text.replace('-', '-\n');
  }

  // Single word: try to break at middle
  if (text.length > maxCharsPerLine) {
    const mid = Math.ceil(text.length / 2);
    return text.slice(0, mid) + '-\n' + text.slice(mid);
  }

  return text; // Return as-is if short enough
}

/**
 * Process all pathogen nodes to add formatted labels
 * @param nodes - Array of Cytoscape node data
 * @returns - Nodes with formatted labels
 */
export function formatAllPathogenLabels(nodes: CytoscapeNode[]): CytoscapeNode[] {
  return nodes.map(node => {
    if (node.data.type === 'pathogen') {
      return {
        ...node,
        data: {
          ...node.data,
          label: formatPathogenLabel(node.data.label)
        }
      };
    }
    return node;
  });
}

/**
 * Process all antibiotic nodes to add formatted labels
 * @param nodes - Array of Cytoscape node data
 * @returns - Nodes with formatted labels
 */
export function formatAllAntibioticLabels(nodes: CytoscapeNode[]): CytoscapeNode[] {
  return nodes.map(node => {
    if (node.data.type === 'antibiotic') {
      return {
        ...node,
        data: {
          ...node.data,
          label: formatAntibioticLabel(node.data.label)
        }
      };
    }
    return node;
  });
}

/**
 * Process all nodes (both pathogens and antibiotics) with formatted labels
 * @param nodes - Array of Cytoscape node data
 * @returns - Nodes with formatted labels
 */
export function formatAllNodeLabels(nodes: CytoscapeNode[]): CytoscapeNode[] {
  return nodes.map(node => {
    if (node.data.type === 'pathogen') {
      return {
        ...node,
        data: {
          ...node.data,
          label: formatPathogenLabel(node.data.label)
        }
      };
    } else if (node.data.type === 'antibiotic') {
      return {
        ...node,
        data: {
          ...node.data,
          label: formatAntibioticLabel(node.data.label)
        }
      };
    }
    return node;
  });
}
