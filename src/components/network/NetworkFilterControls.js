/**
 * NetworkFilterControls Component
 * Filter controls for pathogen network visualization
 * Extracted from PathogenNetworkVisualization.js during Phase 4 refactoring
 */

import React, { memo } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { FILTER_OPTIONS } from '../../utils/networkFilterUtils';

/**
 * Filter dropdown component
 */
const FilterDropdown = memo(({ id, label, value, options, onChange }) => (
  <div className="flex items-center gap-2">
    <label htmlFor={id} className="text-gray-600">{label}:</label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

FilterDropdown.displayName = 'FilterDropdown';

/**
 * Network filter controls component
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Function} props.onClearFilters - Clear all filters handler
 * @param {Function} props.onResetLayout - Reset layout handler
 * @param {boolean} props.showLabels - Show labels state
 * @param {Function} props.onToggleLabels - Toggle labels handler
 * @param {boolean} props.isLayoutStable - Layout stability state
 */
const NetworkFilterControls = ({
  filters,
  onFilterChange,
  onClearFilters,
  onResetLayout,
  showLabels,
  onToggleLabels,
  isLayoutStable
}) => {
  const handleFilterChange = (filterName) => (value) => {
    onFilterChange(filterName, value);
  };

  return (
    <div className="space-y-3">
      {/* Filter Controls */}
      <div className="flex items-center gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-600" />
          <span className="font-medium text-gray-700">Filters:</span>
        </div>

        <FilterDropdown
          id="gram-filter"
          label="Gram"
          value={filters.gramFilter}
          options={FILTER_OPTIONS.gram}
          onChange={handleFilterChange('gramFilter')}
        />

        <FilterDropdown
          id="severity-filter"
          label="Severity"
          value={filters.severityFilter}
          options={FILTER_OPTIONS.severity}
          onChange={handleFilterChange('severityFilter')}
        />

        <FilterDropdown
          id="shape-filter"
          label="Shape"
          value={filters.shapeFilter}
          options={FILTER_OPTIONS.shape}
          onChange={handleFilterChange('shapeFilter')}
        />

        <FilterDropdown
          id="resistance-filter"
          label="Resistance"
          value={filters.resistanceFilter}
          options={FILTER_OPTIONS.resistance}
          onChange={handleFilterChange('resistanceFilter')}
        />

        <FilterDropdown
          id="connection-filter"
          label="Connections"
          value={filters.connectionFilter}
          options={FILTER_OPTIONS.connection}
          onChange={handleFilterChange('connectionFilter')}
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => onToggleLabels(e.target.checked)}
            className="rounded"
          />
          Show Labels
        </label>

        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>

        <button
          onClick={onResetLayout}
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          Reset Layout
        </button>

        {!isLayoutStable && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Stabilizing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(NetworkFilterControls);
