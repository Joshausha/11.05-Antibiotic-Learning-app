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
import { Pathogen, Antibiotic, Coverage } from '../types/medical.types';
import { applyFilters } from '../utils/networkFilterUtils';

export function useNetworkFiltering(
  pathogens: Pathogen[],
  antibiotics: Antibiotic[],
  coverage: Coverage[]
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
