/**
 * Comparison Control Panel Component
 *
 * Antibiotic selector with search, filtering, and comparison controls for
 * Northwestern wheel comparison mode.
 *
 * Created by: Agent - Phase 7 Visualization Enhancement
 * Medical Accuracy: Integrates with EnhancedAntibioticData.ts
 * Performance Target: <200ms filter response
 *
 * Features:
 * - Autocomplete antibiotic search
 * - Multi-select with visual chips
 * - Filter by drug class, route, generation
 * - Quick selection presets (common comparisons)
 * - Export comparison functionality
 * - Responsive mobile-friendly design
 *
 * @component
 * @example
 * <ComparisonControlPanel
 *   allAntibiotics={enhancedAntibiotics}
 *   selectedAntibiotics={selectedList}
 *   onSelectionChange={(selected) => setSelected(selected)}
 *   maxSelection={4}
 * />
 */

import React, { useState, useMemo, useRef, ReactNode } from 'react';
import {
  Search,
  X,
  Filter,
  RotateCcw,
  Download,
  Plus,
  Check,
  ChevronDown,
  Pill
} from 'lucide-react';

interface AntibioticData {
  id: string | number;
  name: string;
  class?: string;
  route?: string | string[];
  generation?: string;
  northwesternSpectrum?: Record<string, any>;
  [key: string]: any;
}

interface ComparisonPreset {
  id: string;
  name: string;
  description: string;
  antibioticNames: string[];
}

interface FilterOptions {
  classes: string[];
  routes: string[];
  generations: string[];
}

interface ComparisonControlPanelProps {
  allAntibiotics?: AntibioticData[];
  selectedAntibiotics?: AntibioticData[];
  onSelectionChange: (selected: AntibioticData[]) => void;
  maxSelection?: number;
  className?: string;
}

/**
 * Preset comparison configurations for common clinical scenarios
 */
const COMPARISON_PRESETS: ComparisonPreset[] = [
  {
    id: 'gram-positive-coverage',
    name: 'Gram-Positive Coverage',
    description: 'Compare common gram-positive coverage options',
    antibioticNames: ['Vancomycin', 'Linezolid', 'Daptomycin']
  },
  {
    id: 'gram-negative-coverage',
    name: 'Gram-Negative Coverage',
    description: 'Compare broad-spectrum gram-negative options',
    antibioticNames: ['Ceftriaxone', 'Meropenem', 'Piperacillin-Tazobactam']
  },
  {
    id: 'pseudomonas-coverage',
    name: 'Pseudomonas Coverage',
    description: 'Compare anti-pseudomonal antibiotics',
    antibioticNames: ['Cefepime', 'Meropenem', 'Piperacillin-Tazobactam', 'Ciprofloxacin']
  },
  {
    id: 'oral-vs-iv',
    name: 'Oral vs IV Options',
    description: 'Compare oral and IV formulations',
    antibioticNames: ['Amoxicillin', 'Ceftriaxone', 'Levofloxacin', 'Vancomycin']
  }
];

const ComparisonControlPanel: React.FC<ComparisonControlPanelProps> = ({
  allAntibiotics = [],
  selectedAntibiotics = [],
  onSelectionChange,
  maxSelection = 4,
  className = ''
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterRoute, setFilterRoute] = useState('all');
  const [filterGeneration, setFilterGeneration] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract unique drug classes, routes, and generations for filters
  const filterOptions = useMemo((): FilterOptions => {
    const classes = new Set<string>();
    const routes = new Set<string>();
    const generations = new Set<string>();

    allAntibiotics.forEach(ab => {
      if (ab.class) classes.add(ab.class);
      if (ab.route) {
        if (Array.isArray(ab.route)) {
          ab.route.forEach(r => routes.add(r));
        } else {
          routes.add(ab.route);
        }
      }
      if (ab.generation) generations.add(ab.generation);
    });

    return {
      classes: Array.from(classes).sort(),
      routes: Array.from(routes).sort(),
      generations: Array.from(generations).sort()
    };
  }, [allAntibiotics]);

  // Filter and search antibiotics
  const filteredAntibiotics = useMemo((): AntibioticData[] => {
    return allAntibiotics.filter(ab => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesName = ab.name?.toLowerCase().includes(search);
        const matchesClass = ab.class?.toLowerCase().includes(search);
        if (!matchesName && !matchesClass) return false;
      }

      // Class filter
      if (filterClass !== 'all' && ab.class !== filterClass) return false;

      // Route filter
      if (filterRoute !== 'all') {
        const routes = Array.isArray(ab.route) ? ab.route : [ab.route || ''];
        if (!routes.includes(filterRoute)) return false;
      }

      // Generation filter
      if (filterGeneration !== 'all' && ab.generation !== filterGeneration) return false;

      return true;
    });
  }, [allAntibiotics, searchTerm, filterClass, filterRoute, filterGeneration]);

  // Check if antibiotic is selected
  const isSelected = (antibioticId: string | number): boolean => {
    return selectedAntibiotics.some(ab => ab.id === antibioticId);
  };

  // Handle antibiotic selection toggle
  const handleToggleSelection = (antibiotic: AntibioticData) => {
    const isCurrentlySelected = isSelected(antibiotic.id);

    if (isCurrentlySelected) {
      // Remove from selection
      onSelectionChange(selectedAntibiotics.filter(ab => ab.id !== antibiotic.id));
    } else {
      // Add to selection if not at max
      if (selectedAntibiotics.length < maxSelection) {
        onSelectionChange([...selectedAntibiotics, antibiotic]);
      }
    }
  };

  // Handle preset selection
  const handlePresetSelection = (preset: ComparisonPreset) => {
    const antibiotics = allAntibiotics.filter(ab =>
      preset.antibioticNames.includes(ab.name)
    ).slice(0, maxSelection);

    onSelectionChange(antibiotics);
    setSearchTerm('');
  };

  // Clear all selections
  const handleClearAll = () => {
    onSelectionChange([]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterClass('all');
    setFilterRoute('all');
    setFilterGeneration('all');
  };

  // Export comparison (placeholder for future implementation)
  const handleExport = () => {
    console.log('Export comparison:', selectedAntibiotics);
    // Future: Generate PDF/PNG export
  };

  const canAddMore = selectedAntibiotics.length < maxSelection;
  const activeFilterCount = [filterClass, filterRoute, filterGeneration].filter(f => f !== 'all').length;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Antibiotics to Compare</h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose 2-4 antibiotics for side-by-side Northwestern coverage comparison
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={selectedAntibiotics.length < 2}
              className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Export comparison"
            >
              <Download size={16} />
              Export
            </button>

            {/* Clear All Button */}
            {selectedAntibiotics.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                title="Clear all selections"
              >
                <X size={16} />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Selection Status */}
        <div className="mt-4 flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-gray-900">{selectedAntibiotics.length}</span> / {maxSelection}
          </div>
          {!canAddMore && (
            <div className="text-sm text-orange-600">
              Maximum selection reached
            </div>
          )}
        </div>
      </div>

      {/* Selected Antibiotics Chips */}
      {selectedAntibiotics.length > 0 && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex flex-wrap gap-2">
            {selectedAntibiotics.map(ab => (
              <div
                key={ab.id}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm"
              >
                <Pill size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{ab.name}</span>
                <button
                  onClick={() => handleToggleSelection(ab)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={`Remove ${ab.name}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 border-b bg-gray-50">
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search antibiotics by name or class..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <Filter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Drug Class</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classes</option>
                {filterOptions.classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Route</label>
              <select
                value={filterRoute}
                onChange={(e) => setFilterRoute(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Routes</option>
                {filterOptions.routes.map(route => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Generation</label>
              <select
                value={filterGeneration}
                onChange={(e) => setFilterGeneration(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Generations</option>
                {filterOptions.generations.map(gen => (
                  <option key={gen} value={gen}>{gen}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Quick Presets */}
      <div className="p-4 border-b bg-gray-50">
        <div className="text-xs font-medium text-gray-700 mb-2">Quick Comparisons:</div>
        <div className="flex flex-wrap gap-2">
          {COMPARISON_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelection(preset)}
              className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Antibiotic List */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {filteredAntibiotics.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No antibiotics found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAntibiotics.map(ab => {
              const selected = isSelected(ab.id);
              const disabled = !selected && !canAddMore;

              return (
                <button
                  key={ab.id}
                  onClick={() => !disabled && handleToggleSelection(ab)}
                  disabled={disabled}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selected
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : disabled
                        ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{ab.name}</span>
                        {selected && (
                          <Check size={16} className="text-blue-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {ab.class}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Route: {Array.isArray(ab.route) ? ab.route.join(', ') : ab.route}
                      </div>
                    </div>

                    {!selected && canAddMore && (
                      <Plus size={20} className="text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonControlPanel;

// Export presets for testing
export { COMPARISON_PRESETS };
