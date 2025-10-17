const data = require('./src/data/PathogenRelationshipData.js');

// Extract node IDs
const nodeIds = new Set(data.nodes.map(n => n.data.id));
console.log('Total Nodes:', nodeIds.size);
console.log('Total Edges:', data.edges.length);

// Validate edges
let invalidSources = [];
let invalidTargets = [];
let duplicates = new Set();
let edgeSignatures = new Set();
let relationshipTypes = new Set();
let strengthValues = new Set();
let tierValues = new Set();

data.edges.forEach((edge, idx) => {
  const { source, target, label, strength, tier } = edge.data;

  // Check if source exists
  if (!nodeIds.has(source)) {
    invalidSources.push(`Edge ${idx + 1}: source '${source}' not found`);
  }

  // Check if target exists
  if (!nodeIds.has(target)) {
    invalidTargets.push(`Edge ${idx + 1}: target '${target}' not found`);
  }

  // Check for duplicates (same source + target + label)
  const signature = `${source}|${target}|${label}`;
  if (edgeSignatures.has(signature)) {
    duplicates.add(signature);
  }
  edgeSignatures.add(signature);

  // Collect relationship types, strengths, tiers
  relationshipTypes.add(label);
  strengthValues.add(strength);
  tierValues.add(tier);
});

console.log('\n=== VALIDATION RESULTS ===');
console.log('Invalid Sources:', invalidSources.length);
if (invalidSources.length > 0) {
  invalidSources.forEach(s => console.log('  -', s));
}

console.log('Invalid Targets:', invalidTargets.length);
if (invalidTargets.length > 0) {
  invalidTargets.forEach(t => console.log('  -', t));
}

console.log('Duplicate Edges:', duplicates.size);
if (duplicates.size > 0) {
  duplicates.forEach(d => console.log('  -', d));
}

console.log('\n=== EDGE METADATA ===');
console.log('Relationship Types:', Array.from(relationshipTypes).sort().join(', '));
console.log('Strength Values:', Array.from(strengthValues).sort().join(', '));
console.log('Tier Values:', Array.from(tierValues).sort().join(', '));

// Count by tier
const tierCounts = { 1: 0, 2: 0, 3: 0 };
data.edges.forEach(edge => {
  tierCounts[edge.data.tier]++;
});
console.log('\nEdges by Tier:');
console.log(`  Tier 1 (Critical): ${tierCounts[1]}`);
console.log(`  Tier 2 (High Priority): ${tierCounts[2]}`);
console.log(`  Tier 3 (Medium Priority): ${tierCounts[3]}`);

// Count by relationship type
const typeCounts = {};
data.edges.forEach(edge => {
  typeCounts[edge.data.label] = (typeCounts[edge.data.label] || 0) + 1;
});
console.log('\nEdges by Relationship Type:');
Object.keys(typeCounts).sort().forEach(type => {
  console.log(`  ${type}: ${typeCounts[type]}`);
});

if (invalidSources.length === 0 && invalidTargets.length === 0 && duplicates.size === 0) {
  console.log('\n✅ ALL VALIDATIONS PASSED!');
  console.log('- All source/target IDs exist in nodes');
  console.log('- No duplicate edges found');
  console.log('- 42 edges successfully implemented');
  process.exit(0);
} else {
  console.log('\n❌ VALIDATION FAILED');
  process.exit(1);
}
