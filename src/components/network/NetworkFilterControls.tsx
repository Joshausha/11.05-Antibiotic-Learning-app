/**
 * NetworkFilterControls Component
 * Filter controls for network visualization - updated for centralized filter state
 * Clinical design system styling
 */

import React, { memo } from 'react';
import { Filter, X } from 'lucide-react';
import { NetworkFilters, initialFilters } from '../../types/network-ui.types';

interface FilterControlsProps {
  filters: NetworkFilters;
  onChange: (filters: NetworkFilters) => void;
}

/**
 * Network filter controls component - simplified for centralized state
 */
const NetworkFilterControls = memo<FilterControlsProps>(({ filters, onChange }) => {
  const handleClearFilters = () => {
    onChange(initialFilters);
  };

  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Filter size={16} className="text-blue-600" />
          <span className="font-semibold text-sm">Network Filters</span>
        </div>

        <button
          onClick={handleClearFilters}
          className="
            flex items-center gap-1.5 px-2 py-1
            text-xs text-slate-600
            hover:text-slate-800 hover:bg-slate-200
            rounded transition-colors
          "
          title="Clear all filters"
        >
          <X size={14} />
          Clear
        </button>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Gram Stain Filter */}
        <div className="flex flex-col gap-1">
          <label htmlFor="gram-stain" className="text-xs font-medium text-slate-600">
            Gram Stain
          </label>
          <select
            id="gram-stain"
            value={filters.gramStain}
            onChange={(e) => onChange({ ...filters, gramStain: e.target.value as any })}
            className="
              border border-slate-200 rounded px-2 py-1.5 text-sm
              bg-white text-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
              hover:border-slate-300 transition-all
              cursor-pointer
            "
          >
            <option value="all">All</option>
            <option value="positive">Gram Positive</option>
            <option value="negative">Gram Negative</option>
          </select>
        </div>

        {/* Formulation Filter */}
        <div className="flex flex-col gap-1">
          <label htmlFor="formulation" className="text-xs font-medium text-slate-600">
            Formulation
          </label>
          <select
            id="formulation"
            value={filters.formulation}
            onChange={(e) => onChange({ ...filters, formulation: e.target.value as any })}
            className="
              border border-slate-200 rounded px-2 py-1.5 text-sm
              bg-white text-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
              hover:border-slate-300 transition-all
              cursor-pointer
            "
          >
            <option value="all">All</option>
            <option value="oral">Oral</option>
            <option value="IV">IV</option>
            <option value="topical">Topical</option>
          </select>
        </div>

        {/* Coverage Threshold Filter */}
        <div className="flex flex-col gap-1">
          <label htmlFor="coverage-threshold" className="text-xs font-medium text-slate-600">
            Coverage Level
          </label>
          <select
            id="coverage-threshold"
            value={filters.coverageThreshold}
            onChange={(e) => onChange({ ...filters, coverageThreshold: e.target.value as any })}
            className="
              border border-slate-200 rounded px-2 py-1.5 text-sm
              bg-white text-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
              hover:border-slate-300 transition-all
              cursor-pointer
            "
          >
            <option value="all">All</option>
            <option value="high">High (2)</option>
            <option value="medium">Medium (1)</option>
            <option value="low">Low (0)</option>
          </select>
        </div>

        {/* Show Resistance Toggle */}
        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            id="show-resistance"
            checked={filters.showResistance}
            onChange={(e) => onChange({ ...filters, showResistance: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
          />
          <label htmlFor="show-resistance" className="text-sm text-slate-700 cursor-pointer">
            Show Resistance
          </label>
        </div>
      </div>
    </div>
  );
});

NetworkFilterControls.displayName = 'NetworkFilterControls';

export default NetworkFilterControls;
