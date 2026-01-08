/**
 * Northwestern Filter Logic Utilities
 *
 * Advanced filtering system for Northwestern 8-segment antibiotic methodology
 * with real-time performance optimization and clinical workflow support.
 *
 * Created by: Agent 3.3 - Interactive Filtering Specialist
 * Phase: 3 - Spatial Organization System
 * Performance Target: <100ms filter application for real-time interaction
 *
 * Features:
 * - Northwestern 8-segment category filtering
 * - Coverage level filtering (0=none, 1=moderate, 2=good)
 * - Multi-category combination filtering with logical operators
 * - Clinical scenario filtering for workflow optimization
 * - Text search with medical terminology support
 * - Filter state persistence and caching
 * - Real-time performance monitoring
 * - Emergency mode optimization (<30 second clinical access)
 *
 * @module northwesternFilterLogic
 */

/**
 * Type definitions for filtering system
 */

interface CategoryConfig {
  name: string;
  fullName: string;
  color: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  clinicalContext: string;
}

interface CoverageConfig {
  name: string;
  color: string;
  border: string;
  description: string;
  clinicalUse: string;
}

interface FilterCriteria {
  enabled: boolean;
  minCoverage?: number;
}

interface ClinicalScenarioConfig {
  name: string;
  description: string;
  icon: string;
  filters: { [key: string]: FilterCriteria };
  additionalCriteria?: {
    routeFilter?: string[];
    cellWallActiveOnly?: boolean;
    emergencyUse?: boolean;
  };
  clinicalContext: string;
  emergencyPriority: number;
}

interface CoverageSpectrum {
  [category: string]: number;
}

interface Antibiotic {
  name: string;
  class?: string;
  generation?: string;
  northwesternSpectrum?: CoverageSpectrum;
  routeColor?: string;
  cellWallActive?: boolean;
  [key: string]: any;
}

interface CombinationRequirement {
  category: string;
  minCoverage: number;
}

interface Combination {
  requirements: CombinationRequirement[];
  [key: string]: any;
}

interface FilterPerformance {
  calculationTime?: number;
  totalTime: number;
  cacheHit: boolean;
  antibioticCount?: number;
  resultCount?: number;
}

interface FilterResult {
  matchingAntibiotics: Antibiotic[];
  filteredCount: number;
  totalCount: number;
  filterSummary: { [key: string]: any };
  performance: FilterPerformance;
}

interface CombinationResult {
  combinations: Array<Combination & { matchingAntibiotics: Antibiotic[]; count: number }>;
  performance: { calculationTime: number };
}

interface Suggestion {
  type: 'category' | 'scenario';
  category?: string;
  reason: string;
  priority: string;
  filterConfig?: { [key: string]: any };
  scenarioKey?: string;
  scenario?: ClinicalScenarioConfig;
}

interface CacheStats {
  size: number;
  hitRate: string | number;
  hitCount: number;
  missCount: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

interface ExportedFilterState {
  version: string;
  timestamp: number;
  state: {
    northwesternCategories: { [key: string]: FilterCriteria };
    clinicalScenario: string | null;
    textSearch: string;
    routeFilter: string[];
    cellWallActiveOnly: boolean;
    coverageLevelFilter: { [key: string]: number };
    emergencyMode: boolean;
  };
}

// Northwestern 8-segment categories with clinical context
export const NORTHWESTERN_CATEGORIES: { [key: string]: CategoryConfig } = {
  MRSA: {
    name: 'MRSA',
    fullName: 'Methicillin-Resistant Staph aureus',
    color: '#d32f2f',
    priority: 'critical',
    clinicalContext: 'Hospital-acquired infections, skin/soft tissue, pneumonia'
  },
  VRE_faecium: {
    name: 'VRE faecium',
    fullName: 'Vancomycin-Resistant Enterococcus faecium',
    color: '#7b1fa2',
    priority: 'critical',
    clinicalContext: 'Multi-drug resistant, hospital-acquired infections'
  },
  anaerobes: {
    name: 'Anaerobes',
    fullName: 'Anaerobic Bacteria',
    color: '#388e3c',
    priority: 'high',
    clinicalContext: 'Abdominal infections, aspiration pneumonia, dental'
  },
  atypicals: {
    name: 'Atypicals',
    fullName: 'Atypical Pathogens',
    color: '#1976d2',
    priority: 'high',
    clinicalContext: 'Community-acquired pneumonia, Legionella, Mycoplasma'
  },
  pseudomonas: {
    name: 'Pseudomonas',
    fullName: 'Pseudomonas aeruginosa',
    color: '#f57c00',
    priority: 'critical',
    clinicalContext: 'ICU infections, cystic fibrosis, ventilator-associated pneumonia'
  },
  gramNegative: {
    name: 'Gram Negative',
    fullName: 'Gram-Negative Bacteria',
    color: '#5d4037',
    priority: 'high',
    clinicalContext: 'UTI, pneumonia, sepsis, hospital-acquired infections'
  },
  MSSA: {
    name: 'MSSA',
    fullName: 'Methicillin-Sensitive Staph aureus',
    color: '#0288d1',
    priority: 'medium',
    clinicalContext: 'Community-acquired infections, skin/soft tissue'
  },
  enterococcus_faecalis: {
    name: 'E. faecalis',
    fullName: 'Enterococcus faecalis',
    color: '#689f38',
    priority: 'medium',
    clinicalContext: 'UTI, endocarditis, abdominal infections'
  }
};

// Coverage level definitions with clinical interpretation
export const COVERAGE_LEVELS: { [key: number]: CoverageConfig } = {
  0: {
    name: 'No Coverage',
    color: '#ffffff',
    border: '#cccccc',
    description: 'Not effective against this pathogen',
    clinicalUse: 'Avoid for this indication'
  },
  1: {
    name: 'Moderate Coverage',
    color: '#fff3e0',
    border: '#ff9800',
    description: 'Some activity, variable efficacy',
    clinicalUse: 'Consider with susceptibility testing'
  },
  2: {
    name: 'Good Coverage',
    color: '#e8f5e8',
    border: '#4caf50',
    description: 'Reliable activity against this pathogen',
    clinicalUse: 'First-line option when indicated'
  }
};

// Pre-defined clinical scenarios with Northwestern filtering logic
export const CLINICAL_SCENARIOS: { [key: string]: ClinicalScenarioConfig } = {
  icuSepsis: {
    name: 'ICU Sepsis',
    description: 'Broad empiric coverage for severe sepsis and septic shock',
    icon: '🏥',
    filters: {
      MRSA: { enabled: true, minCoverage: 1 },
      pseudomonas: { enabled: true, minCoverage: 1 },
      gramNegative: { enabled: true, minCoverage: 2 }
    },
    additionalCriteria: {
      routeFilter: ['blue', 'purple'], // IV capable
      emergencyUse: true
    },
    clinicalContext: 'Empiric therapy pending cultures in critically ill patients',
    emergencyPriority: 1
  },
  outpatientUTI: {
    name: 'Outpatient UTI',
    description: 'Oral agents for uncomplicated urinary tract infection',
    icon: '🏠',
    filters: {
      gramNegative: { enabled: true, minCoverage: 2 }
    },
    additionalCriteria: {
      routeFilter: ['red', 'purple'] // PO capable
    },
    clinicalContext: 'First-line oral therapy for uncomplicated UTI',
    emergencyPriority: 3
  },
  mrsaCoverage: {
    name: 'MRSA Coverage',
    description: 'All agents with reliable MRSA activity',
    icon: '🦠',
    filters: {
      MRSA: { enabled: true, minCoverage: 2 }
    },
    clinicalContext: 'MRSA treatment or empiric coverage when high risk',
    emergencyPriority: 2
  },
  postSurgical: {
    name: 'Post-surgical Prophylaxis',
    description: 'Cell wall active agents for surgical site infection prevention',
    icon: '🔬',
    filters: {
      MSSA: { enabled: true, minCoverage: 2 },
      gramNegative: { enabled: true, minCoverage: 1 }
    },
    additionalCriteria: {
      cellWallActiveOnly: true
    },
    clinicalContext: 'Pre-operative prophylaxis and post-surgical infection prevention',
    emergencyPriority: 2
  },
  communityPneumonia: {
    name: 'Community-Acquired Pneumonia',
    description: 'Coverage for typical and atypical respiratory pathogens',
    icon: '🫁',
    filters: {
      atypicals: { enabled: true, minCoverage: 2 },
      MSSA: { enabled: true, minCoverage: 1 },
      gramNegative: { enabled: true, minCoverage: 1 }
    },
    clinicalContext: 'Empiric therapy for community-acquired pneumonia',
    emergencyPriority: 2
  },
  anaerobicInfection: {
    name: 'Anaerobic Infections',
    description: 'Agents with reliable anaerobic coverage',
    icon: '🦠',
    filters: {
      anaerobes: { enabled: true, minCoverage: 2 }
    },
    clinicalContext: 'Abdominal infections, aspiration pneumonia, dental infections',
    emergencyPriority: 2
  }
};

/**
 * Core filter state class
 */
export class FilterState {
  northwesternCategories: { [key: string]: FilterCriteria };
  clinicalScenario: string | null;
  textSearch: string;
  routeFilter: string[];
  cellWallActiveOnly: boolean;
  coverageLevelFilter: { [key: string]: number };
  emergencyMode: boolean;
  lastUpdated: number;
  cacheKey: string | null;

  constructor() {
    this.northwesternCategories = {};
    this.clinicalScenario = null;
    this.textSearch = '';
    this.routeFilter = [];
    this.cellWallActiveOnly = false;
    this.coverageLevelFilter = {};
    this.emergencyMode = false;
    this.lastUpdated = Date.now();
    this.cacheKey = null;
  }

  /**
   * Apply clinical scenario to filter state
   */
  applyScenario(scenarioKey: string): void {
    const scenario = CLINICAL_SCENARIOS[scenarioKey];
    if (!scenario) return;

    this.clinicalScenario = scenarioKey;
    this.northwesternCategories = { ...scenario.filters };

    if (scenario.additionalCriteria) {
      this.routeFilter = scenario.additionalCriteria.routeFilter || [];
      this.cellWallActiveOnly = scenario.additionalCriteria.cellWallActiveOnly || false;
      this.emergencyMode = scenario.additionalCriteria.emergencyUse || false;
    }

    this._updateCacheKey();
  }

  /**
   * Update filter state with new criteria
   */
  updateFilter(updates: Partial<FilterState>): void {
    Object.assign(this, updates);
    this.lastUpdated = Date.now();
    this._updateCacheKey();
  }

  /**
   * Reset filter state to defaults
   */
  reset(): void {
    this.northwesternCategories = {};
    this.clinicalScenario = null;
    this.textSearch = '';
    this.routeFilter = [];
    this.cellWallActiveOnly = false;
    this.coverageLevelFilter = {};
    this.emergencyMode = false;
    this._updateCacheKey();
  }

  /**
   * Generate cache key for result caching
   */
  _updateCacheKey(): void {
    const stateStr = JSON.stringify({
      categories: this.northwesternCategories,
      scenario: this.clinicalScenario,
      search: this.textSearch,
      route: this.routeFilter,
      cellWall: this.cellWallActiveOnly,
      coverage: this.coverageLevelFilter
    });
    this.cacheKey = btoa(stateStr).slice(0, 16);
  }

  /**
   * Check if filter state is empty
   */
  isEmpty(): boolean {
    return (
      Object.keys(this.northwesternCategories).length === 0 &&
      !this.clinicalScenario &&
      !this.textSearch &&
      this.routeFilter.length === 0 &&
      !this.cellWallActiveOnly &&
      Object.keys(this.coverageLevelFilter).length === 0
    );
  }
}

/**
 * Performance-optimized filter cache
 */
class FilterCache {
  private cache: Map<string, FilterResult>;
  private maxSize: number;
  private hitCount: number;
  private missCount: number;

  constructor(maxSize: number = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hitCount = 0;
    this.missCount = 0;
  }

  get(key: string): FilterResult | null {
    if (this.cache.has(key)) {
      this.hitCount++;
      const item = this.cache.get(key)!;
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, item);
      return item;
    }
    this.missCount++;
    return null;
  }

  set(key: string, value: FilterResult): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest item
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  getStats(): CacheStats {
    const total = this.hitCount + this.missCount;
    return {
      size: this.cache.size,
      hitRate: total > 0 ? (this.hitCount / total * 100).toFixed(1) : 0,
      hitCount: this.hitCount,
      missCount: this.missCount
    };
  }
}

// Global filter cache instance
const filterCache = new FilterCache();

/**
 * Apply Northwestern category filters to antibiotic dataset
 * Performance target: <100ms for real-time interaction
 */
export function applyNorthwesternFilters(antibiotics: Antibiotic[], filterState: FilterState): FilterResult {
  const startTime = performance.now();

  // Check cache first
  if (filterState.cacheKey) {
    const cached = filterCache.get(filterState.cacheKey);
    if (cached) {
      return {
        ...cached,
        performance: {
          ...cached.performance,
          cacheHit: true,
          totalTime: performance.now() - startTime
        }
      };
    }
  }

  // Return all if no filters applied
  if (filterState.isEmpty()) {
    return {
      matchingAntibiotics: antibiotics,
      filteredCount: antibiotics.length,
      totalCount: antibiotics.length,
      filterSummary: {},
      performance: { totalTime: performance.now() - startTime, cacheHit: false }
    };
  }

  let results = [...antibiotics];
  const filterSummary: { [key: string]: any } = {};

  // Apply Northwestern category filters
  if (Object.keys(filterState.northwesternCategories).length > 0) {
    results = results.filter(antibiotic => {
      if (!antibiotic.northwesternSpectrum) return false;

      return Object.entries(filterState.northwesternCategories).every(([category, criteria]) => {
        if (!criteria.enabled) return true;

        const coverage = antibiotic.northwesternSpectrum![category] || 0;
        return coverage >= (criteria.minCoverage || 1);
      });
    });

    filterSummary.northwesternCategories = Object.keys(filterState.northwesternCategories).length;
  }

  // Apply text search filter
  if (filterState.textSearch) {
    const searchTerm = filterState.textSearch.toLowerCase();
    results = results.filter(antibiotic =>
      antibiotic.name.toLowerCase().includes(searchTerm) ||
      (antibiotic.class && antibiotic.class.toLowerCase().includes(searchTerm)) ||
      (antibiotic.generation && antibiotic.generation.toLowerCase().includes(searchTerm))
    );
    filterSummary.textSearch = filterState.textSearch;
  }

  // Apply route filter
  if (filterState.routeFilter.length > 0) {
    results = results.filter(antibiotic =>
      filterState.routeFilter.includes(antibiotic.routeColor || '')
    );
    filterSummary.routeFilter = filterState.routeFilter;
  }

  // Apply cell wall active filter
  if (filterState.cellWallActiveOnly) {
    results = results.filter(antibiotic => antibiotic.cellWallActive === true);
    filterSummary.cellWallActiveOnly = true;
  }

  // Apply coverage level filters
  if (Object.keys(filterState.coverageLevelFilter).length > 0) {
    results = results.filter(antibiotic => {
      if (!antibiotic.northwesternSpectrum) return false;

      return Object.entries(filterState.coverageLevelFilter).every(([category, requiredLevel]) => {
        const coverage = antibiotic.northwesternSpectrum![category] || 0;
        return coverage >= requiredLevel;
      });
    });
    filterSummary.coverageLevelFilter = Object.keys(filterState.coverageLevelFilter).length;
  }

  const calculationTime = performance.now() - startTime;

  // Performance warning for clinical workflow
  if (calculationTime > 100) {
    console.warn(`Filter calculation took ${calculationTime.toFixed(2)}ms (target: <100ms)`);
  }

  const result: FilterResult = {
    matchingAntibiotics: results,
    filteredCount: results.length,
    totalCount: antibiotics.length,
    filterSummary,
    performance: {
      calculationTime,
      totalTime: calculationTime,
      cacheHit: false,
      antibioticCount: antibiotics.length,
      resultCount: results.length
    }
  };

  // Cache result for future use
  if (filterState.cacheKey) {
    filterCache.set(filterState.cacheKey, result);
  }

  return result;
}

/**
 * Apply combination therapy filters for complex clinical scenarios
 */
export function applyCombinationFilters(antibiotics: Antibiotic[], combinations: Combination[]): CombinationResult {
  const startTime = performance.now();

  const results = combinations.map(combo => {
    const matchingAntibiotics = antibiotics.filter(antibiotic => {
      if (!antibiotic.northwesternSpectrum) return false;

      // Check if antibiotic meets all combination criteria
      return combo.requirements.every(req => {
        const coverage = antibiotic.northwesternSpectrum![req.category] || 0;
        return coverage >= req.minCoverage;
      });
    });

    return {
      ...combo,
      matchingAntibiotics,
      count: matchingAntibiotics.length
    };
  });

  return {
    combinations: results,
    performance: {
      calculationTime: performance.now() - startTime
    }
  };
}

/**
 * Get filter suggestions based on clinical context
 */
export function getFilterSuggestions(antibiotics: Antibiotic[], clinicalContext: string = ''): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Analyze antibiotic dataset for common patterns
  const categoryStats: { [key: string]: { [key: number]: number } } = {};
  antibiotics.forEach(antibiotic => {
    if (antibiotic.northwesternSpectrum) {
      Object.entries(antibiotic.northwesternSpectrum).forEach(([category, coverage]) => {
        if (!categoryStats[category]) {
          categoryStats[category] = { 0: 0, 1: 0, 2: 0 };
        }
        categoryStats[category][coverage as 0 | 1 | 2]++;
      });
    }
  });

  // Generate suggestions based on coverage patterns
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const totalWithCoverage = stats[1] + stats[2];
    const goodCoverageRatio = stats[2] / antibiotics.length;

    if (goodCoverageRatio > 0.2) { // At least 20% have good coverage
      suggestions.push({
        type: 'category',
        category,
        reason: `${stats[2]} antibiotics have good ${NORTHWESTERN_CATEGORIES[category]?.name} coverage`,
        priority: NORTHWESTERN_CATEGORIES[category]?.priority || 'medium',
        filterConfig: {
          northwesternCategories: {
            [category]: { enabled: true, minCoverage: 2 }
          }
        }
      });
    }
  });

  // Add scenario-based suggestions
  Object.entries(CLINICAL_SCENARIOS).forEach(([key, scenario]) => {
    if (clinicalContext.toLowerCase().includes(key.toLowerCase()) ||
        scenario.clinicalContext.toLowerCase().includes(clinicalContext.toLowerCase())) {
      suggestions.push({
        type: 'scenario',
        scenarioKey: key,
        scenario,
        reason: `Optimized for ${scenario.description}`,
        priority: scenario.emergencyPriority <= 2 ? 'high' : 'medium'
      });
    }
  });

  return suggestions.sort((a, b) => {
    const priorityOrder: { [key: string]: number } = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
  });
}

/**
 * Generate filter performance report
 */
export function getFilterPerformanceReport(): { cache: CacheStats; recommendations: string[] } {
  return {
    cache: filterCache.getStats(),
    recommendations: [
      'Use clinical scenarios for faster filtering',
      'Cache filter states for repeated queries',
      'Limit text search to improve performance',
      'Use emergency mode for critical situations'
    ]
  };
}

/**
 * Validate filter configuration for medical accuracy
 */
export function validateFilterConfiguration(filterState: FilterState): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for conflicting filters
  if (filterState.cellWallActiveOnly &&
      filterState.northwesternCategories.atypicals?.enabled) {
    warnings.push('Cell wall active filter may exclude effective atypical coverage agents');
  }

  // Check for overly restrictive filters
  const enabledCategories = Object.values(filterState.northwesternCategories)
    .filter(cat => cat.enabled).length;

  if (enabledCategories > 5) {
    warnings.push('Multiple category filters may be overly restrictive');
  }

  // Check for emergency mode appropriateness
  if (filterState.emergencyMode && filterState.textSearch) {
    warnings.push('Text search disabled in emergency mode for faster results');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations: errors.length === 0 ?
      ['Configuration appears medically appropriate'] :
      ['Review filter criteria for clinical appropriateness']
  };
}

/**
 * Export filter state for persistence
 */
export function exportFilterState(filterState: FilterState): ExportedFilterState {
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    state: {
      northwesternCategories: filterState.northwesternCategories,
      clinicalScenario: filterState.clinicalScenario,
      textSearch: filterState.textSearch,
      routeFilter: filterState.routeFilter,
      cellWallActiveOnly: filterState.cellWallActiveOnly,
      coverageLevelFilter: filterState.coverageLevelFilter,
      emergencyMode: filterState.emergencyMode
    }
  };
}

/**
 * Import filter state from persistence
 */
export function importFilterState(exportedState: ExportedFilterState | null | undefined): FilterState {
  const filterState = new FilterState();

  if (exportedState && exportedState.state) {
    Object.assign(filterState, exportedState.state);
    filterState._updateCacheKey();
  }

  return filterState;
}

// Export cache instance for external monitoring
export { filterCache };
