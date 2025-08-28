/**
 * Debug Script for PathogenExplorer Test Output Analysis
 * Captures exact rendered text to update test expectations
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PathogenExplorer from './src/components/PathogenExplorer';

// Import real medical data
import medicalConditions from './src/data/medicalConditions';
import { buildIndexes } from './src/utils/dataIndexer';

// Mock dependencies
jest.mock('./src/components/research/ResearchIntegration', () => {
  return function MockResearchIntegration() {
    return <div data-testid="research-integration">Research Integration</div>;
  };
});

jest.mock('./src/components/PathogenNetworkVisualization', () => {
  return function MockPathogenNetworkVisualization() {
    return <div data-testid="pathogen-network-viz">Network Visualization</div>;
  };
});

jest.mock('./src/components/PathogenDetailPanel', () => {
  return function MockPathogenDetailPanel() {
    return <div data-testid="pathogen-detail-panel">Detail Panel</div>;
  };
});

jest.mock('./src/components/PathogenConnectionExplorer', () => {
  return function MockPathogenConnectionExplorer() {
    return <div data-testid="pathogen-connection-explorer">Connection Explorer</div>;
  };
});

// Enhanced Mock Strategy for recommendations
const mockPathogenRecommendations = {
  getRecommendations: jest.fn(() => []),
  updateRecommendations: jest.fn(),
  recordInteraction: jest.fn(),
  userPreferences: {},
  length: 0
};

jest.mock('./src/hooks/usePathogenRecommendations', () => {
  return () => mockPathogenRecommendations;
});

// Debug function to capture exact rendered content
async function debugRenderedContent() {
  const realMedicalConditions = medicalConditions.slice(0, 3);
  const realIndexes = buildIndexes(realMedicalConditions);
  
  const mockPathogenData = {
    pathogens: realIndexes.pathogens.map(p => ({ ...p, pediatricRelevance: 'high' })),
    selectedPathogen: null,
    selectedPathogenConditions: [],
    selectedPathogenAntibiotics: [],
    pathogenStats: { 
      total: realIndexes.pathogens.length, 
      gramPositive: realIndexes.pathogens.filter(p => p.gramStatus === 'positive').length,
      gramNegative: realIndexes.pathogens.filter(p => p.gramStatus === 'negative').length
    },
    filteredStats: { 
      total: realIndexes.pathogens.length, 
      gramPositive: realIndexes.pathogens.filter(p => p.gramStatus === 'positive').length,
      gramNegative: realIndexes.pathogens.filter(p => p.gramStatus === 'negative').length
    },
    searchQuery: '',
    gramFilter: 'all',
    typeFilter: 'all',
    sortBy: 'name',
    searchPathogens: jest.fn(),
    filterByGramStatus: jest.fn(),
    filterByType: jest.fn(),
    setSortOrder: jest.fn(),
    selectPathogen: jest.fn(),
    clearSelection: jest.fn(),
    clearFilters: jest.fn(),
    findSimilarPathogens: jest.fn(() => []),
    isLoading: false,
    indexes: realIndexes
  };

  const { container } = render(
    <PathogenExplorer 
      pathogenData={mockPathogenData} 
      onSelectCondition={jest.fn()}
    />
  );

  console.log('=== DEBUGGING PathogenExplorer RENDERED OUTPUT ===');
  console.log('Total pathogens in data:', mockPathogenData.pathogens.length);
  console.log('First pathogen:', mockPathogenData.pathogens[0]);
  console.log('Second pathogen:', mockPathogenData.pathogens[1] || 'N/A');
  console.log('Stats:', mockPathogenData.pathogenStats);
  console.log('Filtered Stats:', mockPathogenData.filteredStats);

  // Capture all text content
  console.log('\n=== ALL TEXT CONTENT ===');
  console.log(container.textContent);

  // Try specific queries
  console.log('\n=== SPECIFIC PATTERN ANALYSIS ===');
  
  // Test pathogen count patterns
  const pathogenCountRegexes = [
    /\d+ found/i,
    /\d+ pathogen/i,
    /total.*?\d+/i,
    /\d+ total/i
  ];

  pathogenCountRegexes.forEach(regex => {
    const match = container.textContent.match(regex);
    if (match) {
      console.log(`Pattern '${regex}' found: "${match[0]}"`);
    }
  });

  // Test gram status patterns
  const gramRegexes = [
    /gram.*?\(\+\)/i,
    /gram.*?\(\-\)/i,
    /gram\(\+\)/i,
    /gram\(\-\)/i,
    /gram.*?positive/i,
    /gram.*?negative/i
  ];

  gramRegexes.forEach(regex => {
    const matches = container.textContent.match(new RegExp(regex, 'gi'));
    if (matches) {
      console.log(`Pattern '${regex}' found ${matches.length} times:`, matches);
    }
  });

  // Pathogen names
  console.log('\n=== PATHOGEN NAMES IN DOM ===');
  mockPathogenData.pathogens.forEach((pathogen, index) => {
    try {
      const element = screen.getByText(pathogen.name);
      console.log(`Pathogen ${index} "${pathogen.name}": FOUND`);
    } catch (e) {
      console.log(`Pathogen ${index} "${pathogen.name}": NOT FOUND`);
    }
  });
}

// Run debug
try {
  debugRenderedContent();
} catch (error) {
  console.error('Debug failed:', error);
}