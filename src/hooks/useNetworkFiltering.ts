/**
 * Network Filtering Hook
 * Centralized filter state management for network visualization
 *
 * Design: Single filter object (not separate states) prevents 2^n state combinations
 * Pattern: Pure filtering functions keep logic testable and predictable
 * Performance: useMemo prevents expensive recalculation on every render
 */

import { useState, useMemo } from 'react';
import { NetworkFilters, initialFilters } from '../types/network-ui.types';
import { Pathogen, Antibiotic } from '../types/medical.types';
import { applyFilters } from '../utils/networkFilterUtils';

// Coverage edge type for network visualization
type CoverageEdge = { id: number; pathogenId: number; antibioticId: number; coverageLevel: number };

export function useNetworkFiltering(
  pathogens: Pathogen[],
  antibiotics: Antibiotic[],
  coverage: CoverageEdge[]
) {
  const [filters, setFilters] = useState<NetworkFilters>(initialFilters);

  // Memoize filtered results to prevent expensive recalculation
  // Only recalculates when input data or filters change
  const filteredData = useMemo(() => {
    return applyFilters(pathogens, antibiotics, coverage, filters);
  }, [pathogens, antibiotics, coverage, filters]);

  return {
    filters,
    setFilters,
    filteredPathogens: filteredData.pathogens,
    filteredAntibiotics: filteredData.antibiotics,
    filteredCoverage: filteredData.coverage
  };
}
