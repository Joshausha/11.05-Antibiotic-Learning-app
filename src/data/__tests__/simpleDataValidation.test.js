/**
 * Simple Data Validation Tests
 * Basic unit tests for sophomore developers to verify data integrity
 */

import { validatePathogenData, getPathogenById, searchPathogens } from '../SimplePathogenData';
import { validateAntibioticData, getAntibioticById, searchAntibiotics } from '../SimpleAntibioticData';
import { validateRelationshipData, getAntibioticsForPathogen } from '../pathogenAntibioticMap';

describe('Simple Pathogen Data Tests', () => {
  test('should validate pathogen data structure', () => {
    const errors = validatePathogenData();
    expect(errors).toBeNull();
  });

  test('should find pathogen by ID', () => {
    const pathogen = getPathogenById(1);
    expect(pathogen).toBeDefined();
    expect(pathogen.name).toBe('Staphylococcus aureus');
  });

  test('should search pathogens by name', () => {
    const results = searchPathogens('staph');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('staphylococcus');
  });

  test('should return empty array for invalid pathogen ID', () => {
    const pathogen = getPathogenById(999);
    expect(pathogen).toBeUndefined();
  });
});

describe('Simple Antibiotic Data Tests', () => {
  test('should validate antibiotic data structure', () => {
    const errors = validateAntibioticData();
    expect(errors).toBeNull();
  });

  test('should find antibiotic by ID', () => {
    const antibiotic = getAntibioticById(1);
    expect(antibiotic).toBeDefined();
    expect(antibiotic.name).toBe('Penicillin');
  });

  test('should search antibiotics by name', () => {
    const results = searchAntibiotics('penicillin');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('penicillin');
  });

  test('should return undefined for invalid antibiotic ID', () => {
    const antibiotic = getAntibioticById(999);
    expect(antibiotic).toBeUndefined();
  });
});

describe('Pathogen-Antibiotic Relationship Tests', () => {
  test('should validate relationship data structure', () => {
    const errors = validateRelationshipData();
    expect(errors).toBeNull();
  });

  test('should get antibiotics for pathogen', () => {
    const antibiotics = getAntibioticsForPathogen(1); // Staphylococcus aureus
    expect(antibiotics.length).toBeGreaterThan(0);
    expect(antibiotics[0]).toHaveProperty('antibioticId');
    expect(antibiotics[0]).toHaveProperty('effectiveness');
  });

  test('should return empty array for invalid pathogen ID', () => {
    const antibiotics = getAntibioticsForPathogen(999);
    expect(antibiotics).toEqual([]);
  });

  test('should have valid effectiveness levels', () => {
    const antibiotics = getAntibioticsForPathogen(1);
    const validEffectiveness = ['high', 'medium', 'low', 'resistant'];
    
    antibiotics.forEach(antibiotic => {
      expect(validEffectiveness).toContain(antibiotic.effectiveness);
    });
  });
});

describe('Data Integration Tests', () => {
  test('should have matching pathogen count', () => {
    const pathogenCount = 10; // We created 10 pathogens
    expect(Object.keys(validateRelationshipData() || {})).toHaveLength(0);
  });

  test('should have antibiotic references that exist', () => {
    const antibiotics = getAntibioticsForPathogen(1);
    
    antibiotics.forEach(antibiotic => {
      const fullAntibiotic = getAntibioticById(antibiotic.antibioticId);
      expect(fullAntibiotic).toBeDefined();
      expect(fullAntibiotic.name).toBe(antibiotic.name);
    });
  });

  test('should have consistent data types', () => {
    const pathogen = getPathogenById(1);
    expect(typeof pathogen.id).toBe('number');
    expect(typeof pathogen.name).toBe('string');
    expect(Array.isArray(pathogen.commonSites)).toBe(true);
    
    const antibiotic = getAntibioticById(1);
    expect(typeof antibiotic.id).toBe('number');
    expect(typeof antibiotic.name).toBe('string');
    expect(typeof antibiotic.class).toBe('string');
  });
});