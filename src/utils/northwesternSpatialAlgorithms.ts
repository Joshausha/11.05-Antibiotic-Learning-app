/**
 * Northwestern Spatial Layout Algorithms
 *
 * Core spatial positioning and clustering algorithms for organizing 30 antibiotics
 * based on Northwestern methodology, drug classes, and clinical relationships.
 *
 * Created by: Agent 3.1 - Spatial Layout Architect
 * Phase: 3 - Spatial Organization System
 *
 * Features:
 * - Drug class clustering algorithms
 * - Generation-based sub-clustering
 * - Responsive grid calculations
 * - Northwestern methodology spatial grouping
 * - Performance optimization utilities
 *
 * @module northwesternSpatialAlgorithms
 */

// Type definitions
interface GridBreakpoint {
  min: number;
  max: number;
}

interface GridConfig {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
  chartSize: string;
  breakpoint: GridBreakpoint;
}

interface SpatialGroup {
  name: string;
  position: string;
  priority: number;
  classes: string[];
  color: string;
  reasoning: string;
  clinicalContext: string;
}

interface GenerationConfig {
  priority: number;
  adjacency?: string;
  positioning?: string;
  clinicalContext?: string;
}

interface Antibiotic {
  id?: number;
  name: string;
  class?: string;
  generation?: string;
  routeColor?: string;
  northwesternSpectrum?: { [key: string]: number };
  [key: string]: any;
}

interface GroupedAntibiotics {
  [key: string]: Antibiotic[];
}

interface SpatialGroupsData {
  [key: string]: SpatialGroup & {
    antibiotics: Antibiotic[];
    classes: { [key: string]: Antibiotic[] };
  };
}

interface GridPosition {
  row: number;
  col: number;
  group: string;
  groupName: string;
}

interface PositionedAntibiotic extends Antibiotic {
  gridPosition: GridPosition;
  coverageScore?: number;
}

interface AvailableCell {
  row: number;
  col: number;
}

interface Viewport {
  cellHeight: number;
  scrollY: number;
  height: number;
}

interface UserFocus {
  activeGroup?: string;
  hoveredPosition?: GridPosition;
}

interface ContainerDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

interface ResponsiveLayoutResult {
  gridTemplate: string;
  gap: string;
  chartSize: string;
  breakpoint: string;
  config: GridConfig;
  containerDimensions: ContainerDimensions;
  performance: {
    virtualizationThreshold: number;
    shouldVirtualize: boolean;
  };
}

interface GroupBoundary {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
  label: string;
  color: string;
}

interface ValidationStats {
  totalAntibiotics: number;
  spatialGroups: number;
  drugClasses: number;
}

interface NorthwesternValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: ValidationStats;
}

/**
 * Grid configuration for different screen sizes
 * Based on clinical device usage patterns and Northwestern teaching methodology
 */
export const GRID_CONFIGURATIONS: { [key: string]: GridConfig } = {
  mobile: {
    columns: 3,
    rows: 10,
    cellWidth: 32,
    cellHeight: 80,
    gap: 2,
    chartSize: 'small',
    breakpoint: { min: 320, max: 767 }
  },
  tablet: {
    columns: 5,
    rows: 6,
    cellWidth: 18,
    cellHeight: 120,
    gap: 2.5,
    chartSize: 'medium',
    breakpoint: { min: 768, max: 1023 }
  },
  desktop: {
    columns: 6,
    rows: 5,
    cellWidth: 15,
    cellHeight: 140,
    gap: 2,
    chartSize: 'medium',
    breakpoint: { min: 1024, max: Infinity }
  }
};

/**
 * Northwestern spatial grouping configuration
 * Based on teaching methodology from Northwestern medical education
 */
export const SPATIAL_GROUPS: { [key: string]: SpatialGroup } = {
  betaLactams: {
    name: 'β-Lactams',
    position: 'top-left',
    priority: 1,
    classes: ['Penicillins', 'Cephalosporins', 'Carbapenems', 'Monobactams'],
    color: '#e3f2fd',
    reasoning: 'Cell wall active antibiotics - fundamental mechanism grouping',
    clinicalContext: 'First-line agents for most bacterial infections'
  },
  proteinSynthesis: {
    name: 'Protein Synthesis Inhibitors',
    position: 'top-right',
    priority: 2,
    classes: ['Aminoglycosides', 'Macrolides', 'Lincosamides', 'Chloramphenicol'],
    color: '#f3e5f5',
    reasoning: 'Ribosome-targeting antibiotics',
    clinicalContext: 'Bacteriostatic/bactericidal protein synthesis disruption'
  },
  dnaGyrase: {
    name: 'DNA/RNA Synthesis Inhibitors',
    position: 'middle-left',
    priority: 3,
    classes: ['Fluoroquinolones', 'Metronidazole'],
    color: '#e8f5e8',
    reasoning: 'DNA gyrase and topoisomerase inhibitors',
    clinicalContext: 'Broad-spectrum with unique resistance patterns'
  },
  specialized: {
    name: 'Specialized Agents',
    position: 'bottom',
    priority: 4,
    classes: ['Glycopeptides', 'Lipopeptides', 'Oxazolidinones', 'Others'],
    color: '#fff3e0',
    reasoning: 'Reserve agents and specialized mechanisms',
    clinicalContext: 'Last-resort and targeted therapy antibiotics'
  }
};

/**
 * Generation-based clustering within drug classes
 * For antibiotics with generational classifications (especially cephalosporins)
 */
export const GENERATION_CLUSTERING: {
  [key: string]: { [key: string]: GenerationConfig };
} = {
  cephalosporins: {
    '1st generation': {
      priority: 1,
      adjacency: 'left',
      positioning: 'cluster-start',
      clinicalContext: 'Gram-positive focus, skin/soft tissue'
    },
    '2nd generation': {
      priority: 2,
      adjacency: 'center-left',
      positioning: 'cluster-middle',
      clinicalContext: 'Enhanced gram-negative, respiratory'
    },
    '3rd generation': {
      priority: 3,
      adjacency: 'center-right',
      positioning: 'cluster-middle',
      clinicalContext: 'Broad spectrum, CNS penetration'
    },
    '4th generation': {
      priority: 4,
      adjacency: 'right',
      positioning: 'cluster-end',
      clinicalContext: 'Anti-pseudomonal, ICU infections'
    },
    '5th generation': {
      priority: 5,
      adjacency: 'separate',
      positioning: 'cluster-special',
      clinicalContext: 'MRSA coverage, advanced spectrum'
    }
  },
  penicillins: {
    Natural: { priority: 1, adjacency: 'left' },
    'Penicillinase-resistant': { priority: 2, adjacency: 'center' },
    'Extended-spectrum': { priority: 3, adjacency: 'right' }
  }
};

/**
 * Determine appropriate screen size breakpoint
 * @param {number} width - Container width in pixels
 * @returns {string} Breakpoint identifier (mobile|tablet|desktop)
 */
export const determineBreakpoint = (width: number): string => {
  if (width <= GRID_CONFIGURATIONS.mobile.breakpoint.max) {
    return 'mobile';
  }
  if (width <= GRID_CONFIGURATIONS.tablet.breakpoint.max) {
    return 'tablet';
  }
  return 'desktop';
};

/**
 * Group antibiotics by drug class
 * @param {Array} antibiotics - Array of enhanced antibiotic objects
 * @returns {Object} Grouped antibiotics by class
 */
export const groupByDrugClass = (antibiotics: Antibiotic[]): GroupedAntibiotics => {
  const grouped: GroupedAntibiotics = {};

  antibiotics.forEach(antibiotic => {
    const drugClass = antibiotic.class || 'Unknown';
    if (!grouped[drugClass]) {
      grouped[drugClass] = [];
    }
    grouped[drugClass].push(antibiotic);
  });

  // Sort within each group by generation if available, then by name
  Object.keys(grouped).forEach(drugClass => {
    grouped[drugClass].sort((a, b) => {
      // First sort by generation if available
      if (a.generation && b.generation) {
        const genOrder: { [key: string]: number } = {
          '1st generation': 1,
          '2nd generation': 2,
          '3rd generation': 3,
          '4th generation': 4,
          '5th generation': 5,
          Natural: 1,
          'Penicillinase-resistant': 2,
          'Extended-spectrum': 3
        };
        const aGen = genOrder[a.generation] || 999;
        const bGen = genOrder[b.generation] || 999;
        if (aGen !== bGen) return aGen - bGen;
      }

      // Then sort by name
      return a.name.localeCompare(b.name);
    });
  });

  return grouped;
};

/**
 * Group antibiotics by administration route
 * @param {Array} antibiotics - Array of enhanced antibiotic objects
 * @returns {Object} Grouped antibiotics by route (Oral Only, IV Only, Both)
 */
export const groupByRoute = (antibiotics: Antibiotic[]): GroupedAntibiotics => {
  const grouped: GroupedAntibiotics = {
    'Oral Only': [],
    'IV Only': [],
    'Oral + IV': []
  };

  antibiotics.forEach(antibiotic => {
    const routeColor = antibiotic.routeColor || 'blue';
    if (routeColor === 'red') {
      grouped['Oral Only'].push(antibiotic);
    } else if (routeColor === 'blue') {
      grouped['IV Only'].push(antibiotic);
    } else if (routeColor === 'purple') {
      grouped['Oral + IV'].push(antibiotic);
    }
  });

  // Sort within each group alphabetically
  Object.keys(grouped).forEach(route => {
    grouped[route].sort((a, b) => a.name.localeCompare(b.name));
  });

  return grouped;
};

/**
 * Group antibiotics alphabetically (A-Z)
 * @param {Array} antibiotics - Array of enhanced antibiotic objects
 * @returns {Object} Single group with alphabetically sorted antibiotics
 */
export const groupByAlphabetical = (antibiotics: Antibiotic[]): GroupedAntibiotics => {
  const sorted = [...antibiotics].sort((a, b) => a.name.localeCompare(b.name));
  return { 'All Antibiotics (A-Z)': sorted };
};

/**
 * Group antibiotics by coverage breadth (narrow to broad spectrum)
 * Coverage score = sum of all 8 Northwestern segment values (0-2 each, max 16)
 * @param {Array} antibiotics - Array of enhanced antibiotic objects
 * @returns {Object} Grouped antibiotics by spectrum breadth
 */
export const groupByCoverageBreadth = (antibiotics: Antibiotic[]): GroupedAntibiotics => {
  // Calculate coverage score for each antibiotic
  const withCoverageScore: PositionedAntibiotic[] = antibiotics.map(ab => {
    const spectrum = ab.northwesternSpectrum || {};
    const coverageScore = Object.values(spectrum).reduce(
      (sum: number, val: any) => sum + (val || 0),
      0
    );
    return { ...ab, coverageScore };
  });

  // Sort by coverage score (ascending: narrow to broad)
  withCoverageScore.sort((a, b) => (a.coverageScore || 0) - (b.coverageScore || 0));

  // Group into narrow/moderate/broad categories
  const grouped: GroupedAntibiotics = {
    'Narrow Spectrum (0-4)': withCoverageScore.filter(
      ab => (ab.coverageScore || 0) <= 4
    ),
    'Moderate Spectrum (5-8)': withCoverageScore.filter(
      ab => (ab.coverageScore || 0) > 4 && (ab.coverageScore || 0) <= 8
    ),
    'Broad Spectrum (9+)': withCoverageScore.filter(
      ab => (ab.coverageScore || 0) > 8
    )
  };

  // Remove empty groups
  Object.keys(grouped).forEach(key => {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  });

  return grouped;
};

/**
 * Apply Northwestern spatial grouping logic
 * @param {Object} groupedAntibiotics - Antibiotics grouped by class
 * @returns {Object} Spatially organized groups
 */
export const applySpatialGrouping = (
  groupedAntibiotics: GroupedAntibiotics
): SpatialGroupsData => {
  const spatialGroups: SpatialGroupsData = {};

  // Initialize spatial groups
  Object.keys(SPATIAL_GROUPS).forEach(groupKey => {
    spatialGroups[groupKey] = {
      ...SPATIAL_GROUPS[groupKey],
      antibiotics: [],
      classes: {}
    };
  });

  // Assign drug classes to spatial groups
  Object.keys(groupedAntibiotics).forEach(drugClass => {
    const antibiotics = groupedAntibiotics[drugClass];
    let assignedGroup: string | null = null;

    // Find which spatial group this drug class belongs to
    Object.keys(SPATIAL_GROUPS).forEach(groupKey => {
      if (SPATIAL_GROUPS[groupKey].classes.includes(drugClass)) {
        assignedGroup = groupKey;
      }
    });

    // Assign to specialized group if no specific group found
    if (!assignedGroup) {
      assignedGroup = 'specialized';
    }

    spatialGroups[assignedGroup].antibiotics.push(...antibiotics);
    spatialGroups[assignedGroup].classes[drugClass] = antibiotics;
  });

  return spatialGroups;
};

/**
 * Calculate grid coordinates for spatial groups
 * @param {Object} spatialGroups - Spatially organized antibiotic groups
 * @param {Object} gridConfig - Grid configuration for current breakpoint
 * @returns {Array} Array of positioned antibiotics with grid coordinates
 */
export const calculateGridCoordinates = (
  spatialGroups: SpatialGroupsData,
  gridConfig: GridConfig
): PositionedAntibiotic[] => {
  const positioned: PositionedAntibiotic[] = [];
  const { columns, rows } = gridConfig;
  const occupiedCells = new Set<string>();

  // Define spatial positioning areas for each group
  const positionAreas: {
    [key: string]: {
      startRow: number;
      endRow: number;
      startCol: number;
      endCol: number;
    };
  } = {
    betaLactams: {
      startRow: 0,
      endRow: Math.floor(rows / 2),
      startCol: 0,
      endCol: Math.floor(columns / 2)
    },
    proteinSynthesis: {
      startRow: 0,
      endRow: Math.floor(rows / 2),
      startCol: Math.ceil(columns / 2),
      endCol: columns
    },
    dnaGyrase: {
      startRow: Math.ceil(rows / 2),
      endRow: rows,
      startCol: 0,
      endCol: Math.floor(columns / 2)
    },
    specialized: {
      startRow: Math.ceil(rows / 2),
      endRow: rows,
      startCol: Math.ceil(columns / 2),
      endCol: columns
    }
  };

  // Position antibiotics within their assigned spatial areas
  Object.keys(spatialGroups).forEach(groupKey => {
    const group = spatialGroups[groupKey];
    const area = positionAreas[groupKey];

    if (!area) return;

    let currentRow = area.startRow;
    let currentCol = area.startCol;

    group.antibiotics.forEach(antibiotic => {
      // Find next available position within the group's area
      while (occupiedCells.has(`${currentRow}-${currentCol}`)) {
        currentCol++;
        if (currentCol >= area.endCol) {
          currentCol = area.startCol;
          currentRow++;
          if (currentRow >= area.endRow) {
            // Overflow to any available cell
            const availableCell = findNextAvailableCell(occupiedCells, columns, rows);
            if (availableCell) {
              currentRow = availableCell.row;
              currentCol = availableCell.col;
            } else {
              // Fallback: place at grid bounds
              currentRow = Math.min(currentRow, rows - 1);
              currentCol = Math.min(currentCol, columns - 1);
            }
            break;
          }
        }
      }

      // Ensure positions are within bounds
      currentRow = Math.min(currentRow, rows - 1);
      currentCol = Math.min(currentCol, columns - 1);

      // Assign position
      const position: PositionedAntibiotic = {
        ...antibiotic,
        gridPosition: {
          row: currentRow,
          col: currentCol,
          group: groupKey,
          groupName: group.name
        }
      };

      positioned.push(position);
      occupiedCells.add(`${currentRow}-${currentCol}`);

      // Move to next position
      currentCol++;
      if (currentCol >= area.endCol) {
        currentCol = area.startCol;
        currentRow++;
      }
    });
  });

  return positioned;
};

/**
 * Find next available cell in the grid
 * @param {Set} occupiedCells - Set of occupied cell coordinates
 * @param {number} columns - Total grid columns
 * @param {number} rows - Total grid rows
 * @returns {Object|null} Available cell coordinates or null
 */
const findNextAvailableCell = (
  occupiedCells: Set<string>,
  columns: number,
  rows: number
): AvailableCell | null => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (!occupiedCells.has(`${row}-${col}`)) {
        return { row, col };
      }
    }
  }
  return null;
};

/**
 * Calculate responsive layout CSS properties
 * @param {number} containerWidth - Container width in pixels
 * @param {number} containerHeight - Container height in pixels
 * @param {number} antibioticCount - Number of antibiotics to display
 * @returns {Object} CSS grid properties and configuration
 */
export const calculateResponsiveLayout = (
  containerWidth: number,
  containerHeight: number,
  antibioticCount: number
): ResponsiveLayoutResult => {
  const breakpoint = determineBreakpoint(containerWidth);
  const gridConfig = GRID_CONFIGURATIONS[breakpoint];

  const cellWidth = `${gridConfig.cellWidth}%`;
  const cellHeight = `${gridConfig.cellHeight}px`;
  const gap = `${gridConfig.gap}%`;

  return {
    gridTemplate: `repeat(${gridConfig.rows}, ${cellHeight}) / repeat(${gridConfig.columns}, ${cellWidth})`,
    gap: gap,
    chartSize: gridConfig.chartSize,
    breakpoint: breakpoint,
    config: gridConfig,
    containerDimensions: {
      width: containerWidth,
      height: containerHeight,
      aspectRatio: containerWidth / containerHeight
    },
    performance: {
      virtualizationThreshold: 50,
      shouldVirtualize: antibioticCount > 50
    }
  };
};

/**
 * Get spatial group boundaries for visual rendering
 * @param {string} groupKey - Spatial group identifier
 * @param {Object} gridConfig - Grid configuration
 * @returns {Object} Boundary coordinates and styling
 */
export const getGroupBoundaries = (
  groupKey: string,
  gridConfig: GridConfig
): GroupBoundary | null => {
  const { columns, rows } = gridConfig;

  const boundaries: { [key: string]: GroupBoundary } = {
    betaLactams: {
      startRow: 0,
      endRow: Math.floor(rows / 2),
      startCol: 0,
      endCol: Math.floor(columns / 2),
      label: 'β-Lactams',
      color: SPATIAL_GROUPS.betaLactams.color
    },
    proteinSynthesis: {
      startRow: 0,
      endRow: Math.floor(rows / 2),
      startCol: Math.ceil(columns / 2),
      endCol: columns,
      label: 'Protein Synthesis',
      color: SPATIAL_GROUPS.proteinSynthesis.color
    },
    dnaGyrase: {
      startRow: Math.ceil(rows / 2),
      endRow: rows,
      startCol: 0,
      endCol: Math.floor(columns / 2),
      label: 'DNA/RNA Synthesis',
      color: SPATIAL_GROUPS.dnaGyrase.color
    },
    specialized: {
      startRow: Math.ceil(rows / 2),
      endRow: rows,
      startCol: Math.ceil(columns / 2),
      endCol: columns,
      label: 'Specialized Agents',
      color: SPATIAL_GROUPS.specialized.color
    }
  };

  return boundaries[groupKey] || null;
};

/**
 * Performance optimization utilities
 */
export const performanceUtils = {
  /**
   * Calculate visible positions within viewport
   * @param {Object} viewport - Viewport dimensions and scroll position
   * @param {Array} gridPositions - All grid positions
   * @returns {Array} Visible positions for rendering
   */
  getVisiblePositions: (
    viewport: Viewport,
    gridPositions: PositionedAntibiotic[]
  ): PositionedAntibiotic[] => {
    const buffer = 100;

    return gridPositions.filter(position => {
      const positionTop = position.gridPosition.row * viewport.cellHeight;
      const positionBottom = positionTop + viewport.cellHeight;

      return (
        positionBottom >= viewport.scrollY - buffer &&
        positionTop <= viewport.scrollY + viewport.height + buffer
      );
    });
  },

  /**
   * Calculate render priority based on user focus and interaction
   * @param {Array} positions - All grid positions
   * @param {Object} userFocus - User interaction focus data
   * @returns {Array} Positions sorted by render priority
   */
  calculateRenderPriority: (
    positions: PositionedAntibiotic[],
    userFocus: UserFocus = {}
  ): PositionedAntibiotic[] => {
    const focusedGroup = userFocus.activeGroup;
    const hoveredPosition = userFocus.hoveredPosition;

    return positions.sort((a, b) => {
      let priorityA = 0;
      let priorityB = 0;

      if (focusedGroup && a.gridPosition.group === focusedGroup) priorityA += 100;
      if (focusedGroup && b.gridPosition.group === focusedGroup) priorityB += 100;

      if (
        hoveredPosition &&
        a.gridPosition.row === hoveredPosition.row &&
        a.gridPosition.col === hoveredPosition.col
      )
        priorityA += 1000;
      if (
        hoveredPosition &&
        b.gridPosition.row === hoveredPosition.row &&
        b.gridPosition.col === hoveredPosition.col
      )
        priorityB += 1000;

      return priorityB - priorityA;
    });
  }
};

/**
 * Validation utilities for Northwestern compliance
 */
export const validationUtils = {
  /**
   * Validate spatial grouping against Northwestern methodology
   * @param {Array} positionedAntibiotics - Positioned antibiotic data
   * @returns {Object} Validation results
   */
  validateNorthwesternCompliance: (
    positionedAntibiotics: PositionedAntibiotic[]
  ): NorthwesternValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check that all major drug classes are properly grouped
    const classCounts: { [key: string]: { [key: string]: number } } = {};
    positionedAntibiotics.forEach(antibiotic => {
      const drugClass = antibiotic.class || 'Unknown';
      const group = antibiotic.gridPosition.group;

      if (!classCounts[drugClass]) {
        classCounts[drugClass] = {};
      }
      classCounts[drugClass][group] = (classCounts[drugClass][group] || 0) + 1;
    });

    // Validate that drug classes are not scattered across multiple groups
    Object.keys(classCounts).forEach(drugClass => {
      const groups = Object.keys(classCounts[drugClass]);
      if (groups.length > 1) {
        warnings.push(
          `Drug class ${drugClass} is spread across multiple spatial groups: ${groups.join(', ')}`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      stats: {
        totalAntibiotics: positionedAntibiotics.length,
        spatialGroups: [
          ...new Set(positionedAntibiotics.map(ab => ab.gridPosition.group))
        ].length,
        drugClasses: Object.keys(classCounts).length
      }
    };
  }
};

export default {
  GRID_CONFIGURATIONS,
  SPATIAL_GROUPS,
  GENERATION_CLUSTERING,
  determineBreakpoint,
  groupByDrugClass,
  groupByRoute,
  groupByAlphabetical,
  groupByCoverageBreadth,
  applySpatialGrouping,
  calculateGridCoordinates,
  calculateResponsiveLayout,
  getGroupBoundaries,
  performanceUtils,
  validationUtils
};
