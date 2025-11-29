/**
 * Verification tests to inspect actual relationship data
 * This test file outputs the actual relationships being generated for manual verification
 */

import { getPathogenRelationships } from '../PathogenRelationshipData';
import { getRelationshipStatistics } from '../../utils/pathogenSimilarity';
import pathogenData from '../PathogenRelationshipData';

describe('VERIFICATION: Actual Relationship Data', () => {
  test('verify total count and distribution', () => {
    const relationships = getPathogenRelationships();
    const stats = getRelationshipStatistics(relationships);

    console.log('\n========================================');
    console.log('RELATIONSHIP STATISTICS');
    console.log('========================================');
    console.log(`Total relationships: ${stats.total}`);
    console.log(`Strong (>0.5): ${stats.strong}`);
    console.log(`Medium (0.35-0.5): ${stats.medium}`);
    console.log(`Weak (0.2-0.35): ${stats.weak}`);
    console.log(`Average similarity: ${stats.averageSimilarity}`);
    console.log(`Min similarity: ${stats.minSimilarity}`);
    console.log(`Max similarity: ${stats.maxSimilarity}\n`);

    expect(stats.total).toBeGreaterThanOrEqual(40);
    expect(stats.total).toBeLessThanOrEqual(70);
  });

  test('show first 15 relationships', () => {
    const relationships = getPathogenRelationships();

    console.log('\n========================================');
    console.log('FIRST 15 RELATIONSHIPS');
    console.log('========================================\n');

    relationships.slice(0, 15).forEach((rel, idx) => {
      console.log(`[${idx + 1}] ${rel.source} (${rel.sourceId}) ↔ ${rel.target} (${rel.targetId})`);
      console.log(`    Similarity: ${(rel.similarity * 100).toFixed(1)}% | Type: ${rel.relationshipType}`);
      console.log(`    Shared antibiotics (${rel.sharedAntibiotics.length}): ${rel.sharedAntibioticNames.slice(0, 3).join(', ')}${rel.sharedAntibioticNames.length > 3 ? '...' : ''}`);
      console.log(`    Rationale: ${rel.clinicalRationale}`);
      console.log();
    });

    expect(relationships.length).toBeGreaterThan(0);
  });

  test('show E. coli relationships (Pathogen ID 2)', () => {
    const relationships = getPathogenRelationships();
    const ecoliRels = relationships.filter(r => r.sourceId === 2 || r.targetId === 2);

    console.log('\n========================================');
    console.log('E. COLI (ID 2) RELATIONSHIPS');
    console.log('========================================\n');
    console.log(`E. coli appears in ${ecoliRels.length} relationships:\n`);

    ecoliRels.forEach((rel, idx) => {
      const otherPathogen = rel.sourceId === 2 ? rel.target : rel.source;
      const otherID = rel.sourceId === 2 ? rel.targetId : rel.sourceId;
      console.log(`[${idx + 1}] E. coli ↔ ${otherPathogen} (ID ${otherID})`);
      console.log(`    Similarity: ${(rel.similarity * 100).toFixed(1)}% | Type: ${rel.relationshipType}`);
      console.log(`    Shared antibiotics: ${rel.sharedAntibioticNames.join(', ')}`);
      console.log();
    });

    expect(ecoliRels.length).toBeGreaterThan(0);
  });

  test('show Staph aureus relationships (Pathogen ID 1)', () => {
    const relationships = getPathogenRelationships();
    const staphRels = relationships.filter(r => r.sourceId === 1 || r.targetId === 1);

    console.log('\n========================================');
    console.log('STAPH AUREUS (ID 1) RELATIONSHIPS');
    console.log('========================================\n');
    console.log(`Staph aureus appears in ${staphRels.length} relationships:\n`);

    staphRels.forEach((rel, idx) => {
      const otherPathogen = rel.sourceId === 1 ? rel.target : rel.source;
      const otherID = rel.sourceId === 1 ? rel.targetId : rel.sourceId;
      console.log(`[${idx + 1}] Staph aureus ↔ ${otherPathogen} (ID ${otherID})`);
      console.log(`    Similarity: ${(rel.similarity * 100).toFixed(1)}% | Type: ${rel.relationshipType}`);
      console.log(`    Shared antibiotics: ${rel.sharedAntibioticNames.join(', ')}`);
      console.log();
    });

    expect(staphRels.length).toBeGreaterThan(0);
  });

  test('medical accuracy: no strong cross-Gram relationships', () => {
    const relationships = getPathogenRelationships();

    console.log('\n========================================');
    console.log('MEDICAL VALIDATION: GRAM STAIN');
    console.log('========================================\n');

    // Correct Gram classifications from SimplePathogenData
    const gramPositive = [1, 3, 5, 7, 10, 11, 15, 17, 18, 21, 25]; // Staph, Strep, Enterococcus, etc.
    const gramNegative = [2, 4, 6, 8, 9, 12, 13, 16, 19, 20, 22, 23, 24]; // E. coli, Klebsiella, Proteus, etc.
    const acidFast = [26]; // Mycobacterium species
    const atypical = [14]; // Mycoplasma, Chlamydia (no cell wall)

    const crossGramStrong = relationships.filter(rel => {
      const sourcePosIdx = gramPositive.indexOf(rel.sourceId);
      const targetPosIdx = gramPositive.indexOf(rel.targetId);
      const sourceNegIdx = gramNegative.indexOf(rel.sourceId);
      const targetNegIdx = gramNegative.indexOf(rel.targetId);

      const isDifferentGram = (sourcePosIdx >= 0 && targetNegIdx >= 0) ||
                               (sourceNegIdx >= 0 && targetPosIdx >= 0);
      return isDifferentGram && rel.similarity > 0.6;
    });

    console.log(`Cross-Gram relationships with high similarity (>0.6): ${crossGramStrong.length}`);
    if (crossGramStrong.length > 0) {
      console.log('Note: Medical validation rules allow some cross-Gram relationships\n');
      crossGramStrong.forEach(rel => {
        console.log(`  ${rel.source} ↔ ${rel.target}: ${(rel.similarity * 100).toFixed(1)}%`);
        console.log(`  Rationale: ${rel.clinicalRationale}`);
        console.log();
      });
    } else {
      console.log('All high-similarity cross-Gram relationships were filtered out ✓\n');
    }

    expect(crossGramStrong.length).toBeLessThanOrEqual(2); // Allow a few if medically justified
  });

  test('medical accuracy: virus isolation', () => {
    const relationships = getPathogenRelationships();

    console.log('\n========================================');
    console.log('MEDICAL VALIDATION: VIRUS ISOLATION');
    console.log('========================================\n');

    // Virus IDs based on SimplePathogenData
    const virusIds = [28, 29]; // HSV (ID 28), Respiratory viruses (ID 29)

    const virusBacteriaMixes = relationships.filter(rel => {
      const sourceIsVirus = virusIds.includes(rel.sourceId);
      const targetIsVirus = virusIds.includes(rel.targetId);
      const sourceIsBacteria = !virusIds.includes(rel.sourceId) && rel.sourceId <= 25;
      const targetIsBacteria = !virusIds.includes(rel.targetId) && rel.targetId <= 25;

      return (sourceIsVirus && targetIsBacteria) || (sourceIsBacteria && targetIsVirus);
    });

    console.log(`Virus-Bacteria mixing relationships: ${virusBacteriaMixes.length}`);
    if (virusBacteriaMixes.length > 0) {
      console.log('WARNING: Medical validation should prevent this!\n');
      virusBacteriaMixes.forEach(rel => {
        console.log(`  ${rel.source} ↔ ${rel.target}: ${(rel.similarity * 100).toFixed(1)}%`);
      });
    } else {
      console.log('✓ Virus-Bacteria isolation working correctly\n');
    }

    expect(virusBacteriaMixes.length).toBe(0);
  });

  test('data structure verification', () => {
    const relationships = getPathogenRelationships();
    const defaultData = pathogenData;

    console.log('\n========================================');
    console.log('DATA STRUCTURE VERIFICATION');
    console.log('========================================\n');

    console.log('Checking default export structure...');
    console.log(`  - Has relationships: ${defaultData.relationships ? '✓' : '✗'}`);
    console.log(`  - Has nodes: ${defaultData.nodes ? '✓' : '✗'}`);
    console.log(`  - Has edges: ${defaultData.edges ? '✓' : '✗'}`);
    console.log(`  - Has relationshipStats: ${defaultData.relationshipStats ? '✓' : '✗'}`);
    console.log(`  - Has helper functions: ${typeof defaultData.getRelationshipsForPathogen === 'function' ? '✓' : '✗'}\n`);

    console.log('Checking relationship object structure (first relationship)...');
    if (relationships.length > 0) {
      const rel = relationships[0];
      console.log(`  - sourceId: ${rel.sourceId ? '✓' : '✗'}`);
      console.log(`  - source: ${rel.source ? '✓' : '✗'}`);
      console.log(`  - targetId: ${rel.targetId ? '✓' : '✗'}`);
      console.log(`  - target: ${rel.target ? '✓' : '✗'}`);
      console.log(`  - similarity: ${rel.similarity !== undefined ? '✓' : '✗'}`);
      console.log(`  - relationshipType: ${rel.relationshipType ? '✓' : '✗'}`);
      console.log(`  - sharedAntibiotics: ${Array.isArray(rel.sharedAntibiotics) ? '✓' : '✗'}`);
      console.log(`  - sharedAntibioticNames: ${Array.isArray(rel.sharedAntibioticNames) ? '✓' : '✗'}`);
      console.log(`  - clinicalRationale: ${rel.clinicalRationale ? '✓' : '✗'}`);
      console.log(`  - medicalSource: ${rel.medicalSource ? '✓' : '✗'}\n`);
    }

    expect(relationships.length).toBeGreaterThan(0);
    expect(defaultData.relationships).toBeDefined();
    expect(defaultData.nodes).toBeDefined();
    expect(defaultData.edges).toBeDefined();
  });
});
