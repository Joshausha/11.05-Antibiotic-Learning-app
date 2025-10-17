/**
 * Cytoscape Stylesheet
 *
 * Defines the visual appearance of the pathogen-antibiotic network graph.
 * This includes medical color-coding, severity-based sizing, resistance indicators,
 * antibiotic nodes, and susceptibility/resistance edge relationships.
 * All colors are selected to meet WCAG AAA contrast ratios where possible.
 */

export const cytoscapeStylesheet = [
  // =============================================================================
  // PATHOGEN NODE STYLES
  // =============================================================================

  // 1. Default Pathogen Node Style
  {
    selector: 'node[type = "pathogen"]',
    style: {
      'label': 'data(label)',
      'font-size': '12px',
      'color': '#fff', // White text for high contrast on dark nodes
      'text-halign': 'center',
      'text-valign': 'center',
      'text-wrap': 'wrap',
      'text-max-width': '80px',
      'background-color': '#888', // Default color
      'border-width': 2,
      'border-color': '#333',
      'shape': 'ellipse' // Circular pathogen nodes
    }
  },

  // 2. Node Sizing based on Severity
  {
    selector: 'node[severity = "low"]',
    style: {
      'width': '40px',
      'height': '40px'
    }
  },
  {
    selector: 'node[severity = "medium"]',
    style: {
      'width': '50px',
      'height': '50px'
    }
  },
  {
    selector: 'node[severity = "high"]',
    style: {
      'width': '60px',
      'height': '60px'
    }
  },

  // 3. Medical Color-Coding for Gram Stain
  {
    selector: 'node[gramStain = "positive"]',
    style: {
      'background-color': '#6a0dad' // Purple
    }
  },
  {
    selector: 'node[gramStain = "negative"]',
    style: {
      'background-color': '#d9534f' // Red
    }
  },
  {
    selector: 'node[gramStain = "atypical"]',
    style: {
      'background-color': '#5bc0de' // Light Blue
    }
  },
  {
    selector: 'node[gramStain = "acid-fast"]',
    style: {
      'background-color': '#f0ad4e' // Orange
    }
  },
    {
    selector: 'node[gramStain = "virus"]',
    style: {
      'background-color': '#5cb85c' // Green
    }
  },
  {
    selector: 'node[gramStain = "mixed"]',
    style: {
      'background-color': '#777' // Gray
    }
  },

  // 4. Resistance Visualization (Borders)
  {
    selector: 'node[resistance *= "resistant"]',
    style: {
      'border-color': '#d9534f', // Red border for resistance
      'border-width': 4
    }
  },
  {
    selector: 'node[resistance *= "sensitive"], node[resistance *= "susceptible"]',
    style: {
      'border-color': '#5cb85c', // Green border for susceptible
      'border-width': 4
    }
  },

  // 5. Default Edge Style
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'label': 'data(label)',
      'font-size': '10px',
      'color': '#777'
    }
  },

  // 6. Edge Styling by Relationship Type
  {
    selector: 'edge[label = "anatomic-association"]',
    style: {
      'line-color': '#5bc0de' // Light Blue
    }
  },
  {
    selector: 'edge[label = "similar-coverage"]',
    style: {
      'line-color': '#5cb85c' // Green
    }
  },
  {
    selector: 'edge[label = "co-infection"]',
    style: {
      'line-color': '#f0ad4e' // Orange
    }
  },
  {
    selector: 'edge[label = "shared-resistance"]',
    style: {
      'line-color': '#d9534f', // Red (resistance patterns)
      'target-arrow-color': '#d9534f',
      'line-style': 'dashed' // Distinctive pattern for resistance
    }
  },
  {
    selector: 'edge[label = "treatment-interaction"]',
    style: {
      'line-color': '#9b59b6', // Purple (C. diff risk, safety)
      'target-arrow-color': '#9b59b6',
      'line-style': 'dotted' // Alert pattern for safety concerns
    }
  },
  {
    selector: 'edge[label = "antibiotic-class"]',
    style: {
      'line-color': '#777', // Gray (pharmacology)
      'target-arrow-color': '#777'
    }
  },

  // Edge Strength Visualization (line width)
  {
    selector: 'edge[strength = "very-high"]',
    style: {
      'width': 4
    }
  },
  {
    selector: 'edge[strength = "high"]',
    style: {
      'width': 3
    }
  },
  {
    selector: 'edge[strength = "medium-high"]',
    style: {
      'width': 2.5
    }
  },
  {
    selector: 'edge[strength = "medium"]',
    style: {
      'width': 2
    }
  },

  // Tier-based Opacity (priority)
  {
    selector: 'edge[tier = 1]',
    style: {
      'opacity': 1.0 // Solid - most important
    }
  },
  {
    selector: 'edge[tier = 2]',
    style: {
      'opacity': 0.8 // Slightly transparent
    }
  },
  {
    selector: 'edge[tier = 3]',
    style: {
      'opacity': 0.6 // More transparent
    }
  },

  // =============================================================================
  // ANTIBIOTIC NODE STYLES
  // =============================================================================

  // Antibiotic Nodes - Distinguished from pathogens
  {
    selector: 'node[type = "antibiotic"]',
    style: {
      'label': 'data(label)',
      'font-size': '11px',
      'color': '#000', // Black text for antibiotics
      'text-halign': 'center',
      'text-valign': 'center',
      'text-wrap': 'wrap',
      'text-max-width': '70px',
      'background-color': '#3498db', // Bright blue for antibiotics
      'border-width': 2,
      'border-color': '#2980b9',
      'shape': 'roundrectangle', // Rectangular antibiotic nodes (distinct from pathogen circles)
      'width': '45px',
      'height': '45px'
    }
  },

  // Antibiotic Class Color-Coding
  {
    selector: 'node[class = "Penicillins"]',
    style: {
      'background-color': '#16a085' // Teal - Penicillins
    }
  },
  {
    selector: 'node[class = "Cephalosporins"]',
    style: {
      'background-color': '#27ae60' // Green - Cephalosporins
    }
  },
  {
    selector: 'node[class = "Carbapenems"]',
    style: {
      'background-color': '#2ecc71' // Light Green - Carbapenems (ultra-broad)
    }
  },
  {
    selector: 'node[class = "Aminoglycosides"]',
    style: {
      'background-color': '#f39c12' // Orange - Aminoglycosides
    }
  },
  {
    selector: 'node[class = "Fluoroquinolones"]',
    style: {
      'background-color': '#e74c3c' // Red - Fluoroquinolones
    }
  },
  {
    selector: 'node[class = "Macrolides"]',
    style: {
      'background-color': '#9b59b6' // Purple - Macrolides
    }
  },
  {
    selector: 'node[class = "Glycopeptides"]',
    style: {
      'background-color': '#c0392b' // Dark Red - Glycopeptides (Vancomycin)
    }
  },
  {
    selector: 'node[class = "Lincosamides"]',
    style: {
      'background-color': '#8e44ad' // Dark Purple - Clindamycin
    }
  },
  {
    selector: 'node[class = "Oxazolidinones"]',
    style: {
      'background-color': '#c39bd3' // Light Purple - Linezolid
    }
  },
  {
    selector: 'node[class = "Nitroimidazoles"]',
    style: {
      'background-color': '#d35400' // Dark Orange - Metronidazole
    }
  },
  {
    selector: 'node[class = "Sulfonamides"]',
    style: {
      'background-color': '#e67e22' // Orange - TMP-SMX
    }
  },
  {
    selector: 'node[class = "Tetracyclines"]',
    style: {
      'background-color': '#f39c12' // Yellow-Orange - Doxycycline
    }
  },
  {
    selector: 'node[class = "Lipopeptides"]',
    style: {
      'background-color': '#e91e63' // Pink - Daptomycin
    }
  },
  {
    selector: 'node[class = "Antivirals"]',
    style: {
      'background-color': '#00bcd4' // Cyan - Antivirals
    }
  },

  // =============================================================================
  // ANTIBIOTIC SUSCEPTIBILITY EDGE STYLES
  // =============================================================================

  // Susceptible edges (pathogen → antibiotic) - GREEN
  {
    selector: 'edge[label = "susceptible"]',
    style: {
      'line-color': '#27ae60', // Green - effective treatment
      'target-arrow-color': '#27ae60',
      'width': 2,
      'line-style': 'solid',
      'curve-style': 'bezier'
    }
  },

  // Resistant edges (pathogen → antibiotic) - RED
  {
    selector: 'edge[label = "resistant"]',
    style: {
      'line-color': '#e74c3c', // Red - ineffective treatment
      'target-arrow-color': '#e74c3c',
      'width': 2,
      'line-style': 'dashed', // Dashed for resistance
      'curve-style': 'bezier'
    }
  },

  // =============================================================================
  // INTERACTION STYLES
  // =============================================================================

  // 7. Interaction Styles
  {
    selector: 'node:selected',
    style: {
      'border-color': '#337ab7', // Blue
      'border-width': 4
    }
  },
  {
    selector: 'node:hover',
    style: {
      'background-color': '#555',
      'border-color': '#fff'
    }
  }
];

export default cytoscapeStylesheet;
