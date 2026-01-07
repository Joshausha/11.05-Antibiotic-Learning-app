/**
 * NetworkFilterControls Component
 * Filter controls for pathogen network visualization
 * Clinical design system styling
 */

import React, { memo, ReactNode } from 'react';
import { Filter, RotateCcw, Loader2 } from 'lucide-react';
import { FILTER_OPTIONS } from '../../utils/networkFilterUtils';
import { FilterDropdownProps, NetworkFilterControlsProps, FilterOption } from '../../types/network-ui.types';

/**
 * Filter dropdown component with clinical styling
 */
const FilterDropdown = memo<FilterDropdownProps>(({ id, label, value, options, onChange }) => (
  <div className="flex items-center gap-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-slate-600 whitespace-nowrap"
    >
      {label}:
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        border border-slate-200 rounded-md px-3 py-1.5 text-sm
        bg-white text-slate-700
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
        hover:border-slate-300
        transition-all duration-150
        shadow-sm
        cursor-pointer
      "
    >
      {options.map((option: FilterOption) => (
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
 */
const NetworkFilterControls = memo<NetworkFilterControlsProps>(({
  filters,
  onFilterChange,
  onClearFilters,
  onResetLayout,
  showLabels,
  onToggleLabels,
  isLayoutStable
}) => {
  const handleFilterChange = (filterName: string) => (value: string) => {
    onFilterChange(filterName, value);
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2 text-slate-700">
          <Filter size={16} className="text-blue-600" />
          <span className="font-semibold">Filters:</span>
        </div>

        <FilterDropdown
          id="gram-filter"
          label="Gram"
          value={filters.gramFilter}
          options={FILTER_OPTIONS?.gram || []}
          onChange={handleFilterChange('gramFilter')}
        />

        <FilterDropdown
          id="severity-filter"
          label="Severity"
          value={filters.severityFilter}
          options={FILTER_OPTIONS?.severity || []}
          onChange={handleFilterChange('severityFilter')}
        />

        <FilterDropdown
          id="shape-filter"
          label="Shape"
          value={filters.shapeFilter}
          options={FILTER_OPTIONS?.shape || []}
          onChange={handleFilterChange('shapeFilter')}
        />

        <FilterDropdown
          id="resistance-filter"
          label="Resistance"
          value={filters.resistanceFilter}
          options={FILTER_OPTIONS?.resistance || []}
          onChange={handleFilterChange('resistanceFilter')}
        />

        <FilterDropdown
          id="connection-filter"
          label="Connections"
          value={filters.connectionFilter}
          options={FILTER_OPTIONS?.connection || []}
          onChange={handleFilterChange('connectionFilter')}
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 text-sm flex-wrap">
        {/* Show Labels Toggle */}
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => onToggleLabels(e.target.checked)}
            className="
              w-4 h-4 rounded border-slate-300
              text-blue-600
              focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0
              cursor-pointer
            "
          />
          <span className="text-slate-600 group-hover:text-slate-800 transition-colors">
            Show Labels
          </span>
        </label>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200" />

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            bg-slate-100 text-slate-700
            border border-slate-200
            rounded-md
            hover:bg-slate-200 hover:border-slate-300
            active:scale-[0.98]
            transition-all duration-150
            text-sm font-medium
          "
        >
          Clear Filters
        </button>

        {/* Reset Layout Button */}
        <button
          onClick={onResetLayout}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            bg-gradient-to-r from-blue-600 to-blue-500
            text-white
            border border-blue-600
            rounded-md
            hover:from-blue-700 hover:to-blue-600
            active:scale-[0.98]
            transition-all duration-150
            shadow-sm shadow-blue-500/20
            text-sm font-medium
          "
        >
          <RotateCcw size={14} />
          Reset Layout
        </button>

        {/* Stabilizing Indicator */}
        {!isLayoutStable && (
          <div className="flex items-center gap-2 text-blue-600 ml-2">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-sm font-medium">Stabilizing...</span>
          </div>
        )}
      </div>
    </div>
  );
});

NetworkFilterControls.displayName = 'NetworkFilterControls';

export default NetworkFilterControls;
