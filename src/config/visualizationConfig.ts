/**
 * Visualization Configuration
 * Defines visualization options for VisualizationsTab
 * Extracted from VisualizationsTab.js during Phase 4 refactoring
 */

import {
  Network,
  PieChart,
  Activity,
  Microscope,
  Grid
} from 'lucide-react';

/**
 * Default overview visualization option (always visible)
 */
export const overviewOption = {
  id: 'overview',
  title: 'Overview Dashboard',
  icon: Grid,
  description: 'High-level statistics and key metrics',
  group: 'default'
};

/**
 * Explore relationships visualization options
 */
export const exploreOptions = [
  {
    id: 'pathogen-network',
    title: 'Pathogen Network',
    icon: Network,
    description: 'Interactive network of pathogen relationships',
    group: 'explore'
  },
  {
    id: 'antibiotic-comparison',
    title: 'Antibiotic Comparison',
    icon: PieChart,
    description: 'Side-by-side Northwestern coverage comparison',
    group: 'explore'
  }
];

/**
 * Analyze patterns visualization options
 */
export const analyzeOptions = [
  {
    id: 'category-distribution',
    title: 'Category Distribution',
    icon: PieChart,
    description: 'Distribution of medical conditions by category',
    group: 'analyze'
  },
  {
    id: 'antibiotic-analysis',
    title: 'Antibiotic Analysis',
    icon: Activity,
    description: 'Drug class distribution and usage patterns',
    group: 'analyze'
  },
  {
    id: 'pathogen-analysis',
    title: 'Pathogen Analysis',
    icon: Microscope,
    description: 'Gram status and morphology analysis',
    group: 'analyze'
  }
];

/**
 * All visualization options combined
 */
export const allVisualizationOptions = [
  overviewOption,
  ...exploreOptions,
  ...analyzeOptions
];

/**
 * Network layout options for the pathogen network visualization
 */
export const networkLayoutOptions = [
  { value: 'd3-interactive', label: 'D3 Interactive (Click-to-Explore)' },
  { value: 'd3', label: 'D3 Force-Directed' },
  { value: 'd3-pro', label: 'D3 Multi-Layout (New)' },
  { value: 'spatial', label: 'Northwestern Spatial' },
  { value: 'enhanced', label: 'Enhanced Clinical Lab' }
];

/**
 * Spatial view mode options
 */
export const spatialViewOptions = [
  { value: 'clustered', label: 'Clustered' },
  { value: 'grid', label: 'Grid Layout' },
  { value: 'radial', label: 'Radial' }
];

/**
 * Drug class color mapping for charts
 */
export const drugClassColors = {
  'Penicillins': 'bg-blue-500',
  'Cephalosporins': 'bg-green-500',
  'Fluoroquinolones': 'bg-orange-500',
  'Macrolides': 'bg-pink-500',
  'Aminoglycosides': 'bg-indigo-500',
  'Glycopeptides': 'bg-purple-500',
  'default': 'bg-gray-500'
};

/**
 * Get color class for a drug class
 * @param {string} drugClass - Drug class name
 * @returns {string} Tailwind CSS color class
 */
export const getDrugClassColor = (drugClass: string): string => {
  return (drugClassColors as Record<string, string>)[drugClass] || drugClassColors.default;
};

/**
 * Filter options for data display
 */
export const filterOptions = [
  { value: 'all', label: 'All Data' },
  { value: 'gram-positive', label: 'Gram-Positive Only' },
  { value: 'gram-negative', label: 'Gram-Negative Only' }
];
