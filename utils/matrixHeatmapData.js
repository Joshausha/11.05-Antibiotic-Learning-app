/**
 * Matrix Heatmap Data Structure and Layout Logic
 * Transforms pathogen-antibiotic effectiveness data into interactive heatmap visualization
 */

import simpleAntibiotics from '../data/SimpleAntibioticData.js';
import simplePathogens from '../data/SimplePathogenData.js';
import pathogenAntibioticMap from '../data/pathogenAntibioticMap.js';

/**
 * Generate matrix heatmap data structure
 * @returns {Object} Matrix data with rows, columns, and cells
 */
export const generateMatrixData = () => {
  // Create sorted pathogen rows (grouped by gram status)
  const pathogenRows = createPathogenRows();
  
  // Create sorted antibiotic columns (grouped by drug class)
  const antibioticColumns = createAntibioticColumns();
  
  // Generate matrix cells with effectiveness data
  const matrixCells = generateMatrixCells(pathogenRows, antibioticColumns);
  
  return {
    rows: pathogenRows,
    columns: antibioticColumns,
    cells: matrixCells,
    metadata: {
      totalRows: pathogenRows.length,
      totalColumns: antibioticColumns.length,
      totalCells: matrixCells.length,
      effectivenessDistribution: calculateMatrixEffectivenessDistribution(matrixCells),
      gramStatusDistribution: calculateGramStatusDistribution(pathogenRows),
      drugClassDistribution: calculateDrugClassDistribution(antibioticColumns)
    }
  };
};

/**
 * Create pathogen rows sorted by gram status and name
 * @returns {Array} Array of pathogen row objects
 */
const createPathogenRows = () => {
  const pathogens = [...simplePathogens];
  
  // Sort by gram status first, then by name
  pathogens.sort((a, b) => {
    if (a.gramStatus !== b.gramStatus) {
      // Order: positive, negative, atypical
      const statusOrder = { 'positive': 0, 'negative': 1, 'atypical': 2 };
      return statusOrder[a.gramStatus] - statusOrder[b.gramStatus];
    }
    return a.name.localeCompare(b.name);
  });
  
  return pathogens.map((pathogen, index) => ({
    id: pathogen.id,
    name: pathogen.name,
    commonName: pathogen.commonName,
    gramStatus: pathogen.gramStatus,
    severity: pathogen.severity,
    shape: pathogen.shape,
    description: pathogen.description,
    index,
    color: getPathogenRowColor(pathogen.gramStatus),
    groupLabel: getGramStatusLabel(pathogen.gramStatus)
  }));
};

/**
 * Create antibiotic columns sorted by drug class and name
 * @returns {Array} Array of antibiotic column objects
 */
const createAntibioticColumns = () => {
  const antibiotics = [...simpleAntibiotics];
  
  // Sort by drug class first, then by name
  antibiotics.sort((a, b) => {
    if (a.class !== b.class) {
      return a.class.localeCompare(b.class);
    }
    return a.name.localeCompare(b.name);
  });
  
  return antibiotics.map((antibiotic, index) => ({
    id: antibiotic.id,
    name: antibiotic.name,
    class: antibiotic.class,
    category: antibiotic.category,
    mechanism: antibiotic.mechanism,
    route: antibiotic.route,
    description: antibiotic.description,
    index,
    color: getAntibioticColumnColor(antibiotic.class),
    groupLabel: antibiotic.class
  }));
};

/**
 * Generate matrix cells with effectiveness data
 * @param {Array} pathogenRows - Array of pathogen rows
 * @param {Array} antibioticColumns - Array of antibiotic columns
 * @returns {Array} Array of matrix cell objects
 */
const generateMatrixCells = (pathogenRows, antibioticColumns) => {
  const cells = [];
  
  pathogenRows.forEach(pathogen => {
    antibioticColumns.forEach(antibiotic => {
      const pathogenData = pathogenAntibioticMap[pathogen.id];
      let effectiveness = null;
      let notes = '';
      
      if (pathogenData) {
        const antibioticData = pathogenData.antibiotics.find(ab => ab.antibioticId === antibiotic.id);
        if (antibioticData) {
          effectiveness = antibioticData.effectiveness;
          notes = antibioticData.notes;
        }
      }
      
      cells.push({
        id: `cell-${pathogen.id}-${antibiotic.id}`,
        pathogenId: pathogen.id,
        pathogenName: pathogen.name,
        antibioticId: antibiotic.id,
        antibioticName: antibiotic.name,
        effectiveness,
        notes,
        rowIndex: pathogen.index,
        columnIndex: antibiotic.index,
        color: getEffectivenessColor(effectiveness),
        value: getEffectivenessValue(effectiveness),
        displayText: getEffectivenessDisplayText(effectiveness),
        hasData: effectiveness !== null
      });
    });
  });
  
  return cells;
};

/**
 * Get color for pathogen rows based on gram status
 * @param {string} gramStatus - Gram status
 * @returns {string} Background color for row header
 */
const getPathogenRowColor = (gramStatus) => {
  const colorMap = {
    'positive': '#FEE2E2', // Light red
    'negative': '#DBEAFE', // Light blue
    'atypical': '#D1FAE5'  // Light green
  };
  return colorMap[gramStatus] || '#F3F4F6';
};

/**
 * Get color for antibiotic columns based on drug class
 * @param {string} drugClass - Drug class
 * @returns {string} Background color for column header
 */
const getAntibioticColumnColor = (drugClass) => {
  // Use a lighter version of the colors from networkGraphData
  const colorMap = {
    'Penicillin': '#DBEAFE',
    'Glycopeptide': '#EDE9FE',
    'Quinolone': '#FEF3C7',
    '3rd generation cephalosporin': '#D1FAE5',
    'Macrolide': '#FCE7F3',
    'Lincosamide': '#CCFBF1',
    'Aminoglycoside': '#E0E7FF',
    'Carbapenem': '#FEE2E2',
    'Tetracycline': '#ECFCCB',
    'Sulfonamide combination': '#FFEDD5',
    'Oxazolidinone': '#CFFAFE',
    'Nitroimidazole': '#F1F5F9',
    '1st generation cephalosporin': '#DCFCE7',
    'Penicillin + Beta-lactamase inhibitor': '#F3E8FF'
  };
  return colorMap[drugClass] || '#F3F4F6';
};

/**
 * Get color for effectiveness cells
 * @param {string} effectiveness - Effectiveness rating
 * @returns {string} Cell background color
 */
const getEffectivenessColor = (effectiveness) => {
  const colorMap = {
    'high': '#10B981',      // Green
    'medium': '#F59E0B',    // Yellow
    'low': '#F97316',       // Orange
    'resistant': '#EF4444', // Red
    null: '#F3F4F6'         // Gray for no data
  };
  return colorMap[effectiveness] || '#F3F4F6';
};

/**
 * Get numerical value for effectiveness (for sorting/filtering)
 * @param {string} effectiveness - Effectiveness rating
 * @returns {number} Numerical value
 */
const getEffectivenessValue = (effectiveness) => {
  const valueMap = {
    'high': 4,
    'medium': 3,
    'low': 2,
    'resistant': 1,
    null: 0
  };
  return valueMap[effectiveness] || 0;
};

/**
 * Get display text for effectiveness
 * @param {string} effectiveness - Effectiveness rating
 * @returns {string} Display text
 */
const getEffectivenessDisplayText = (effectiveness) => {
  const textMap = {
    'high': 'High',
    'medium': 'Med',
    'low': 'Low',
    'resistant': 'Res',
    null: 'N/A'
  };
  return textMap[effectiveness] || 'N/A';
};

/**
 * Get gram status label for grouping
 * @param {string} gramStatus - Gram status
 * @returns {string} Group label
 */
const getGramStatusLabel = (gramStatus) => {
  const labelMap = {
    'positive': 'Gram-Positive',
    'negative': 'Gram-Negative',
    'atypical': 'Atypical'
  };
  return labelMap[gramStatus] || 'Unknown';
};

/**
 * Calculate effectiveness distribution across all cells
 * @param {Array} cells - Array of matrix cells
 * @returns {Object} Distribution statistics
 */
const calculateMatrixEffectivenessDistribution = (cells) => {
  const distribution = { high: 0, medium: 0, low: 0, resistant: 0, noData: 0 };
  
  cells.forEach(cell => {
    if (cell.effectiveness) {
      distribution[cell.effectiveness]++;
    } else {
      distribution.noData++;
    }
  });
  
  return distribution;
};

/**
 * Calculate gram status distribution
 * @param {Array} pathogenRows - Array of pathogen rows
 * @returns {Object} Distribution statistics
 */
const calculateGramStatusDistribution = (pathogenRows) => {
  const distribution = { positive: 0, negative: 0, atypical: 0 };
  
  pathogenRows.forEach(pathogen => {
    distribution[pathogen.gramStatus]++;
  });
  
  return distribution;
};

/**
 * Calculate drug class distribution
 * @param {Array} antibioticColumns - Array of antibiotic columns
 * @returns {Object} Distribution statistics
 */
const calculateDrugClassDistribution = (antibioticColumns) => {
  const distribution = {};
  
  antibioticColumns.forEach(antibiotic => {
    if (!distribution[antibiotic.class]) {
      distribution[antibiotic.class] = 0;
    }
    distribution[antibiotic.class]++;
  });
  
  return distribution;
};

/**
 * Sort matrix data by specified criteria
 * @param {Object} matrixData - Matrix data object
 * @param {Object} sortOptions - Sort options
 * @returns {Object} Sorted matrix data
 */
export const sortMatrixData = (matrixData, sortOptions = {}) => {
  const { rowSort = 'name', columnSort = 'name', ascending = true } = sortOptions;
  
  let sortedRows = [...matrixData.rows];
  let sortedColumns = [...matrixData.columns];
  
  // Sort rows
  if (rowSort === 'name') {
    sortedRows.sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  } else if (rowSort === 'gramStatus') {
    sortedRows.sort((a, b) => {
      const statusOrder = { 'positive': 0, 'negative': 1, 'atypical': 2 };
      return ascending ? statusOrder[a.gramStatus] - statusOrder[b.gramStatus] : statusOrder[b.gramStatus] - statusOrder[a.gramStatus];
    });
  } else if (rowSort === 'severity') {
    sortedRows.sort((a, b) => {
      const severityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      return ascending ? severityOrder[a.severity] - severityOrder[b.severity] : severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
  
  // Sort columns
  if (columnSort === 'name') {
    sortedColumns.sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  } else if (columnSort === 'class') {
    sortedColumns.sort((a, b) => ascending ? a.class.localeCompare(b.class) : b.class.localeCompare(a.class));
  }
  
  // Update indices
  sortedRows.forEach((row, index) => { row.index = index; });
  sortedColumns.forEach((column, index) => { column.index = index; });
  
  // Regenerate cells with new indices
  const sortedCells = generateMatrixCells(sortedRows, sortedColumns);
  
  return {
    ...matrixData,
    rows: sortedRows,
    columns: sortedColumns,
    cells: sortedCells
  };
};

/**
 * Filter matrix data based on criteria
 * @param {Object} matrixData - Matrix data object
 * @param {Object} filters - Filter criteria
 * @returns {Object} Filtered matrix data
 */
export const filterMatrixData = (matrixData, filters = {}) => {
  let filteredRows = [...matrixData.rows];
  let filteredColumns = [...matrixData.columns];
  
  // Filter by gram status
  if (filters.gramStatus && filters.gramStatus.length > 0) {
    filteredRows = filteredRows.filter(row => filters.gramStatus.includes(row.gramStatus));
  }
  
  // Filter by drug class
  if (filters.drugClass && filters.drugClass.length > 0) {
    filteredColumns = filteredColumns.filter(column => filters.drugClass.includes(column.class));
  }
  
  // Filter by effectiveness
  if (filters.effectiveness && filters.effectiveness.length > 0) {
    // Only keep rows/columns that have at least one cell with desired effectiveness
    const validCells = matrixData.cells.filter(cell => 
      cell.effectiveness && filters.effectiveness.includes(cell.effectiveness)
    );
    
    const validPathogenIds = new Set(validCells.map(cell => cell.pathogenId));
    const validAntibioticIds = new Set(validCells.map(cell => cell.antibioticId));
    
    filteredRows = filteredRows.filter(row => validPathogenIds.has(row.id));
    filteredColumns = filteredColumns.filter(column => validAntibioticIds.has(column.id));
  }
  
  // Update indices
  filteredRows.forEach((row, index) => { row.index = index; });
  filteredColumns.forEach((column, index) => { column.index = index; });
  
  // Generate filtered cells
  const filteredCells = generateMatrixCells(filteredRows, filteredColumns);
  
  return {
    rows: filteredRows,
    columns: filteredColumns,
    cells: filteredCells,
    metadata: {
      totalRows: filteredRows.length,
      totalColumns: filteredColumns.length,
      totalCells: filteredCells.length,
      effectivenessDistribution: calculateMatrixEffectivenessDistribution(filteredCells),
      gramStatusDistribution: calculateGramStatusDistribution(filteredRows),
      drugClassDistribution: calculateDrugClassDistribution(filteredColumns)
    }
  };
};

/**
 * Generate tooltip data for a matrix cell
 * @param {Object} cell - Matrix cell object
 * @param {Object} matrixData - Full matrix data for context
 * @returns {Object} Tooltip data
 */
export const generateCellTooltip = (cell, matrixData) => {
  const pathogen = matrixData.rows.find(row => row.id === cell.pathogenId);
  const antibiotic = matrixData.columns.find(col => col.id === cell.antibioticId);
  
  return {
    title: `${antibiotic.name} vs ${pathogen.name}`,
    effectiveness: cell.effectiveness,
    effectivenessText: cell.displayText,
    notes: cell.notes,
    pathogenInfo: {
      name: pathogen.name,
      commonName: pathogen.commonName,
      gramStatus: pathogen.gramStatus,
      severity: pathogen.severity,
      description: pathogen.description
    },
    antibioticInfo: {
      name: antibiotic.name,
      class: antibiotic.class,
      mechanism: antibiotic.mechanism,
      route: antibiotic.route,
      description: antibiotic.description
    },
    clinicalGuidance: generateClinicalGuidance(cell.effectiveness, cell.notes)
  };
};

/**
 * Generate clinical guidance text based on effectiveness
 * @param {string} effectiveness - Effectiveness rating
 * @param {string} notes - Clinical notes
 * @returns {string} Clinical guidance text
 */
const generateClinicalGuidance = (effectiveness, notes) => {
  const guidanceMap = {
    'high': 'Excellent choice - first-line therapy',
    'medium': 'Good option - consider for treatment',
    'low': 'Limited utility - consider alternatives',
    'resistant': 'Not recommended - use alternative therapy',
    null: 'No data available - consult guidelines'
  };
  
  const baseGuidance = guidanceMap[effectiveness] || 'Consult clinical guidelines';
  return notes ? `${baseGuidance}. ${notes}` : baseGuidance;
};

/**
 * Generate export data for matrix (CSV/PDF)
 * @param {Object} matrixData - Matrix data object
 * @param {string} format - Export format ('csv' or 'pdf')
 * @returns {Object} Export data
 */
export const generateExportData = (matrixData, format = 'csv') => {
  if (format === 'csv') {
    const headers = ['Pathogen', 'Gram Status', ...matrixData.columns.map(col => col.name)];
    const rows = matrixData.rows.map(row => {
      const rowData = [row.name, row.gramStatus];
      matrixData.columns.forEach(col => {
        const cell = matrixData.cells.find(c => c.pathogenId === row.id && c.antibioticId === col.id);
        rowData.push(cell ? cell.displayText : 'N/A');
      });
      return rowData;
    });
    
    return {
      headers,
      rows,
      filename: `antibiotic_effectiveness_matrix_${new Date().toISOString().split('T')[0]}.csv`
    };
  }
  
  // PDF export data structure
  return {
    title: 'Antibiotic Effectiveness Matrix',
    subtitle: `Generated on ${new Date().toLocaleDateString()}`,
    matrix: matrixData,
    summary: matrixData.metadata,
    filename: `antibiotic_effectiveness_matrix_${new Date().toISOString().split('T')[0]}.pdf`
  };
};

/**
 * Validate matrix heatmap data structure
 * @returns {Array} Array of validation errors, empty if valid
 */
export const validateMatrixData = () => {
  const errors = [];
  
  try {
    const matrixData = generateMatrixData();
    
    // Validate basic structure
    if (!matrixData.rows || matrixData.rows.length === 0) {
      errors.push('No pathogen rows generated');
    }
    
    if (!matrixData.columns || matrixData.columns.length === 0) {
      errors.push('No antibiotic columns generated');
    }
    
    if (!matrixData.cells || matrixData.cells.length === 0) {
      errors.push('No matrix cells generated');
    }
    
    // Validate expected dimensions
    const expectedCells = matrixData.rows.length * matrixData.columns.length;
    if (matrixData.cells.length !== expectedCells) {
      errors.push(`Expected ${expectedCells} cells, got ${matrixData.cells.length}`);
    }
    
    // Test sorting
    const sortedData = sortMatrixData(matrixData, { rowSort: 'name', ascending: true });
    if (sortedData.rows.length !== matrixData.rows.length) {
      errors.push('Matrix sorting failed');
    }
    
    // Test filtering
    const filteredData = filterMatrixData(matrixData, { effectiveness: ['high'] });
    if (filteredData.cells.length === 0) {
      errors.push('Matrix filtering failed');
    }
    
    // Test tooltip generation
    const sampleCell = matrixData.cells[0];
    const tooltip = generateCellTooltip(sampleCell, matrixData);
    if (!tooltip.title || !tooltip.pathogenInfo || !tooltip.antibioticInfo) {
      errors.push('Tooltip generation failed');
    }
    
  } catch (error) {
    errors.push(`Matrix data validation error: ${error.message}`);
  }
  
  return errors;
};

export default {
  generateMatrixData,
  sortMatrixData,
  filterMatrixData,
  generateCellTooltip,
  generateExportData,
  validateMatrixData
};