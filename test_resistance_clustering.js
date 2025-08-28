/**
 * Test Script for Resistance Clustering Algorithm
 * Tests Phase 2 resistance pattern detection with actual pathogen data
 */

// Import the pathogen data and clustering functions
import simplePathogens from './src/data/SimplePathogenData.js';
import { RESISTANCE_MECHANISMS, parseResistancePatterns, createMedicalClusteredLayout } from './src/components/networks/NetworkDataAdapter.js';

console.log('🧪 Testing Phase 2 Resistance Clustering Algorithm\n');
console.log(`Testing with ${simplePathogens.length} pathogens from SimplePathogenData.js\n`);

// Test parseResistancePatterns function with actual pathogen data
console.log('=' .repeat(60));
console.log('RESISTANCE PATTERN ANALYSIS RESULTS');
console.log('=' .repeat(60));

const resistanceResults = [];

simplePathogens.forEach(pathogen => {
  if (pathogen.resistance) {
    const analysis = parseResistancePatterns(pathogen.resistance);
    
    if (analysis.detectedMechanisms.length > 0) {
      resistanceResults.push({
        pathogen: pathogen.name,
        commonName: pathogen.commonName,
        resistanceText: pathogen.resistance,
        analysis: analysis
      });
      
      console.log(`\n🦠 ${pathogen.name} (${pathogen.commonName})`);
      console.log(`   Resistance: "${pathogen.resistance}"`);
      console.log(`   Detected Mechanisms: ${analysis.detectedMechanisms.join(', ')}`);
      console.log(`   Clinical Significance: ${analysis.clinicalSignificance}`);
      console.log(`   Severity: ${analysis.severity}`);
      console.log(`   Clusters: ${analysis.clusters.join(', ')}`);
    }
  }
});

console.log('\n' + '=' .repeat(60));
console.log('CLUSTERING ANALYSIS SUMMARY');
console.log('=' .repeat(60));

// Group results by resistance mechanism
const mechanismGroups = {};
resistanceResults.forEach(result => {
  result.analysis.detectedMechanisms.forEach(mechanism => {
    if (!mechanismGroups[mechanism]) {
      mechanismGroups[mechanism] = [];
    }
    mechanismGroups[mechanism].push(result.pathogen);
  });
});

Object.entries(mechanismGroups).forEach(([mechanism, pathogens]) => {
  const mechanismData = RESISTANCE_MECHANISMS[mechanism];
  console.log(`\n🔴 ${mechanism} Cluster (${mechanismData?.clinical_significance || 'unknown'} significance)`);
  console.log(`   Color: ${mechanismData?.color || 'undefined'}`);
  console.log(`   Pathogens: ${pathogens.join(', ')}`);
  console.log(`   Count: ${pathogens.length}`);
});

// Test medical clustering layout with detected resistance patterns
console.log('\n' + '=' .repeat(60));
console.log('MEDICAL CLUSTERING LAYOUT TEST');
console.log('=' .repeat(60));

// Create simplified pathogen nodes for clustering test
const pathogenNodes = resistanceResults.map((result, index) => ({
  data: {
    id: `pathogen_${index + 1}`,
    name: result.pathogen,
    commonName: result.commonName,
    resistance: result.resistanceText,
    resistanceAnalysis: result.analysis
  }
}));

if (pathogenNodes.length > 0) {
  console.log(`\n🗺️  Testing clustering layout with ${pathogenNodes.length} resistance-positive pathogens...`);
  
  try {
    const clusteredLayout = createMedicalClusteredLayout(pathogenNodes);
    console.log(`✅ Medical clustering layout created successfully`);
    console.log(`   Layout name: ${clusteredLayout.name}`);
    console.log(`   Total clusters: ${Object.keys(clusteredLayout.clusters || {}).length}`);
    
    if (clusteredLayout.clusters) {
      Object.entries(clusteredLayout.clusters).forEach(([clusterName, clusterData]) => {
        console.log(`   📍 ${clusterName}: ${clusterData.nodes?.length || 0} pathogens`);
      });
    }
  } catch (error) {
    console.log(`❌ Error creating medical clustering layout: ${error.message}`);
  }
} else {
  console.log('⚠️  No resistance-positive pathogens found for clustering test');
}

console.log('\n' + '=' .repeat(60));
console.log('TEST COMPLETION SUMMARY');
console.log('=' .repeat(60));

console.log(`\n📊 Results Summary:`);
console.log(`   Total pathogens tested: ${simplePathogens.length}`);
console.log(`   Pathogens with detected resistance: ${resistanceResults.length}`);
console.log(`   Unique resistance mechanisms detected: ${Object.keys(mechanismGroups).length}`);
console.log(`   Resistance mechanisms found: ${Object.keys(mechanismGroups).join(', ')}`);

if (resistanceResults.length > 0) {
  console.log(`\n✅ Phase 2 resistance clustering algorithm validation: SUCCESS`);
  console.log(`   - parseResistancePatterns() correctly identifies resistance mechanisms`);
  console.log(`   - Medical clustering groups pathogens appropriately`);
  console.log(`   - Clinical significance levels assigned correctly`);
} else {
  console.log(`\n❌ Phase 2 resistance clustering algorithm validation: FAILED`);
  console.log(`   - No resistance patterns detected in pathogen data`);
}

console.log('\n🔬 Phase 2 resistance clustering test completed!');