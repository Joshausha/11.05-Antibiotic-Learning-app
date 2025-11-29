/**
 * Verification script for pathogen relationships
 * This script generates and displays sample relationships for accuracy verification
 */

// Import the pathogenSimilarity functions directly
const pathogenAntibioticMap = require('./src/data/pathogenAntibioticMap.js').default;
const simplePathogens = require('./src/data/SimplePathogenData.js').default;

// Import similarity functions
const {
  calculateJaccardSimilarity,
  getEffectiveAntibiotics,
  classifyRelationshipType,
  validateRelationshipMedically,
  generatePathogenRelationships,
  getRelationshipStatistics,
} = require('./src/utils/pathogenSimilarity.js');

console.log('========================================');
console.log('PATHOGEN RELATIONSHIP VERIFICATION');
console.log('========================================\n');

// Generate relationships
console.log('Generating relationships with threshold 0.3 and medical validation...\n');
const relationships = generatePathogenRelationships(0.3, true);
const stats = getRelationshipStatistics(relationships);

console.log(`Total relationships generated: ${stats.total}`);
console.log(`Strong (>0.5): ${stats.strong}`);
console.log(`Medium (0.35-0.5): ${stats.medium}`);
console.log(`Weak (0.2-0.35): ${stats.weak}`);
console.log(`Average similarity: ${stats.averageSimilarity}`);
console.log(`Min similarity: ${stats.minSimilarity}`);
console.log(`Max similarity: ${stats.maxSimilarity}\n`);

console.log('========================================');
console.log('SAMPLE RELATIONSHIPS (First 10)');
console.log('========================================\n');

relationships.slice(0, 10).forEach((rel, idx) => {
  console.log(`[${idx + 1}] ${rel.source} ↔ ${rel.target}`);
  console.log(`    Similarity: ${(rel.similarity * 100).toFixed(1)}% (${rel.relationshipType})`);
  console.log(`    Shared antibiotics: ${rel.sharedAntibioticNames.join(', ')}`);
  console.log(`    Rationale: ${rel.clinicalRationale}`);
  console.log();
});

console.log('========================================');
console.log('MEDICAL ACCURACY SPOT CHECKS');
console.log('========================================\n');

// Check: E. coli (ID 2) relationships
const ecoliRels = relationships.filter(r => r.sourceId === 2 || r.targetId === 2);
console.log(`E. coli (ID 2) has ${ecoliRels.length} relationships:`);
ecoliRels.forEach(rel => {
  const otherPathogen = rel.sourceId === 2 ? rel.target : rel.source;
  console.log(`  - ${otherPathogen}: ${(rel.similarity * 100).toFixed(1)}%`);
});

console.log();

// Check: Staph aureus (ID 1) relationships
const staphRels = relationships.filter(r => r.sourceId === 1 || r.targetId === 1);
console.log(`Staph aureus (ID 1) has ${staphRels.length} relationships:`);
staphRels.forEach(rel => {
  const otherPathogen = rel.sourceId === 1 ? rel.target : rel.source;
  console.log(`  - ${otherPathogen}: ${(rel.similarity * 100).toFixed(1)}%`);
});

console.log();

// Check: Virus isolation (should not mix with bacteria)
const viruses = [28, 29]; // HSV (ID 28), Respiratory viruses (ID 29)
const virusBacteriaRelationships = relationships.filter(rel => {
  const sourceIsVirus = viruses.includes(rel.sourceId);
  const targetIsVirus = viruses.includes(rel.targetId);
  const sourceIsBacteria = !viruses.includes(rel.sourceId);
  const targetIsBacteria = !viruses.includes(rel.targetId);

  return (sourceIsVirus && targetIsBacteria) || (sourceIsBacteria && targetIsVirus);
});

console.log(`Virus-Bacteria relationships (should be 0): ${virusBacteriaRelationships.length}`);
if (virusBacteriaRelationships.length > 0) {
  console.log('  WARNING: Found virus-bacteria mixing:');
  virusBacteriaRelationships.forEach(rel => {
    console.log(`    ${rel.source} ↔ ${rel.target}: ${(rel.similarity * 100).toFixed(1)}%`);
  });
}

console.log();

// Check: Gram-positive vs Gram-negative clustering
console.log('========================================');
console.log('GRAM STAIN ANALYSIS');
console.log('========================================\n');

// Correct Gram stain classifications from SimplePathogenData
const gramPositives = [1, 3, 5, 7, 10, 11, 15, 17, 18, 21, 25]; // Staph, Strep, Enterococcus, etc.
const gramNegatives = [2, 4, 6, 8, 9, 12, 13, 16, 19, 20, 22, 23, 24]; // E. coli, Klebsiella, Proteus, etc.
const acidFast = [26]; // Mycobacterium
const atypical = [14]; // Mycoplasma, Chlamydia

const crossGramRels = relationships.filter(rel => {
  const sourceIsPos = gramPositives.includes(rel.sourceId);
  const targetIsPos = gramPositives.includes(rel.targetId);
  return sourceIsPos !== targetIsPos; // Different gram stains
});

console.log(`Cross-Gram relationships: ${crossGramRels.length}`);
const strongCrossGram = crossGramRels.filter(r => r.similarity > 0.5);
console.log(`Strong cross-Gram relationships (>0.5): ${strongCrossGram.length}`);
if (strongCrossGram.length > 0) {
  console.log('  Note: These relationships were validated by medical rules');
}

console.log('\n========================================');
console.log('VERIFICATION COMPLETE');
console.log('========================================');
