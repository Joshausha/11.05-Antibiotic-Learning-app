/**
 * Performance Benchmark Tests
 * Agent 1.3: Measure performance impact of Northwestern-enhanced data
 */

import enhancedAntibiotics from '../../data/EnhancedAntibioticData.js';
import simpleAntibiotics from '../../data/SimpleAntibioticData.js';

describe('Performance Benchmark - Northwestern Enhancement Impact', () => {
  
  describe('Data Size Analysis', () => {
    test('should measure data structure size increase', () => {
      const originalSize = JSON.stringify(simpleAntibiotics).length;
      const enhancedSize = JSON.stringify(enhancedAntibiotics).length;
      const sizeIncrease = ((enhancedSize - originalSize) / originalSize) * 100;
      
      console.log(`Original data size: ${originalSize} characters`);
      console.log(`Enhanced data size: ${enhancedSize} characters`);
      console.log(`Size increase: ${sizeIncrease.toFixed(1)}%`);
      
      // Should be reasonable increase (less than 100%)
      expect(sizeIncrease).toBeLessThan(100);
      expect(sizeIncrease).toBeGreaterThan(30); // Should have meaningful enhancement
    });

    test('should measure field count increase', () => {
      const originalFields = Object.keys(simpleAntibiotics[0]).length;
      const enhancedFields = Object.keys(enhancedAntibiotics[0]).length;
      const fieldIncrease = ((enhancedFields - originalFields) / originalFields) * 100;
      
      console.log(`Original fields per antibiotic: ${originalFields}`);
      console.log(`Enhanced fields per antibiotic: ${enhancedFields}`);
      console.log(`Field increase: ${fieldIncrease.toFixed(1)}%`);
      
      expect(enhancedFields).toBeGreaterThan(originalFields);
      expect(fieldIncrease).toBeGreaterThan(20); // Meaningful enhancement
    });
  });

  describe('Search Performance', () => {
    const searchTerms = ['beta', 'gram', 'infection', 'pneumonia', 'mrsa', 'vancomycin'];
    
    test('should maintain fast search performance', () => {
      const iterations = 100;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const term = searchTerms[i % searchTerms.length];
        enhancedAntibiotics.filter(antibiotic =>
          antibiotic.name.toLowerCase().includes(term.toLowerCase()) ||
          antibiotic.class.toLowerCase().includes(term.toLowerCase()) ||
          antibiotic.description.toLowerCase().includes(term.toLowerCase())
        );
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const avgPerSearch = duration / iterations;
      
      console.log(`${iterations} searches completed in ${duration.toFixed(2)}ms`);
      console.log(`Average per search: ${avgPerSearch.toFixed(2)}ms`);
      
      // Should complete searches quickly
      expect(avgPerSearch).toBeLessThan(1); // Less than 1ms per search
    });

    test('should measure enhanced search with commonUses', () => {
      const iterations = 50;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const term = searchTerms[i % searchTerms.length];
        enhancedAntibiotics.filter(antibiotic =>
          antibiotic.name.toLowerCase().includes(term.toLowerCase()) ||
          antibiotic.class.toLowerCase().includes(term.toLowerCase()) ||
          antibiotic.description.toLowerCase().includes(term.toLowerCase()) ||
          (antibiotic.commonUses && antibiotic.commonUses.some(use => 
            use.toLowerCase().includes(term.toLowerCase())
          ))
        );
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const avgPerSearch = duration / iterations;
      
      console.log(`Enhanced search (${iterations} iterations): ${duration.toFixed(2)}ms`);
      console.log(`Average enhanced search: ${avgPerSearch.toFixed(2)}ms`);
      
      // Enhanced search should still be fast
      expect(avgPerSearch).toBeLessThan(2); // Less than 2ms per enhanced search
    });
  });

  describe('Data Access Performance', () => {
    test('should measure ID-based lookup performance', () => {
      const iterations = 1000;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const id = (i % 30) + 1; // IDs 1-30
        enhancedAntibiotics.find(antibiotic => antibiotic.id === id);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const avgPerLookup = duration / iterations;
      
      console.log(`${iterations} ID lookups: ${duration.toFixed(2)}ms`);
      console.log(`Average per lookup: ${avgPerLookup.toFixed(3)}ms`);
      
      // Should be very fast
      expect(avgPerLookup).toBeLessThan(0.1); // Less than 0.1ms per lookup
    });

    test('should measure name-based lookup performance', () => {
      const names = ['Penicillin', 'Vancomycin', 'Ciprofloxacin', 'Meropenem', 'Doxycycline'];
      const iterations = 500;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const name = names[i % names.length];
        enhancedAntibiotics.find(antibiotic => 
          antibiotic.name.toLowerCase() === name.toLowerCase()
        );
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const avgPerLookup = duration / iterations;
      
      console.log(`${iterations} name lookups: ${duration.toFixed(2)}ms`);
      console.log(`Average per name lookup: ${avgPerLookup.toFixed(3)}ms`);
      
      // Should be reasonably fast
      expect(avgPerLookup).toBeLessThan(0.5); // Less than 0.5ms per lookup
    });
  });

  describe('Northwestern Function Performance', () => {
    test('should measure Northwestern spectrum extraction', () => {
      const iterations = 100;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        enhancedAntibiotics.forEach(antibiotic => {
          const spectrum = antibiotic.northwesternSpectrum;
          // Simulate using the spectrum data
          Object.values(spectrum).reduce((sum, val) => sum + val, 0);
        });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`Northwestern spectrum extraction (${iterations} iterations): ${duration.toFixed(2)}ms`);
      
      // Should complete quickly even with nested object access
      expect(duration).toBeLessThan(50); // Less than 50ms for 100 iterations
    });

    test('should measure coverage filtering performance', () => {
      const categories = ['MRSA', 'VRE_faecium', 'anaerobes', 'pseudomonas'];
      const iterations = 50;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        categories.forEach(category => {
          enhancedAntibiotics.filter(antibiotic => 
            antibiotic.northwesternSpectrum && 
            antibiotic.northwesternSpectrum[category] >= 1
          );
        });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const totalOperations = iterations * categories.length;
      const avgPerFilter = duration / totalOperations;
      
      console.log(`Coverage filtering (${totalOperations} operations): ${duration.toFixed(2)}ms`);
      console.log(`Average per filter: ${avgPerFilter.toFixed(2)}ms`);
      
      // Should be efficient for filtering operations
      expect(avgPerFilter).toBeLessThan(1); // Less than 1ms per filter operation
    });
  });

  describe('Memory Usage Estimation', () => {
    test('should estimate memory footprint', () => {
      // Rough estimation based on JSON string length
      const originalMemory = JSON.stringify(simpleAntibiotics).length * 2; // Rough bytes
      const enhancedMemory = JSON.stringify(enhancedAntibiotics).length * 2; // Rough bytes
      
      const memoryIncrease = enhancedMemory - originalMemory;
      const memoryIncreasePercent = (memoryIncrease / originalMemory) * 100;
      
      console.log(`Estimated original memory: ${(originalMemory / 1024).toFixed(1)}KB`);
      console.log(`Estimated enhanced memory: ${(enhancedMemory / 1024).toFixed(1)}KB`);
      console.log(`Memory increase: ${(memoryIncrease / 1024).toFixed(1)}KB (${memoryIncreasePercent.toFixed(1)}%)`);
      
      // Memory increase should be reasonable for a browser application
      expect(enhancedMemory).toBeLessThan(1024 * 1024); // Less than 1MB total
      expect(memoryIncreasePercent).toBeLessThan(200); // Less than 200% increase
    });
  });

  describe('Serialization Performance', () => {
    test('should measure JSON serialization performance', () => {
      const iterations = 10;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        JSON.stringify(enhancedAntibiotics);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const avgPerSerialization = duration / iterations;
      
      console.log(`JSON serialization (${iterations} iterations): ${duration.toFixed(2)}ms`);
      console.log(`Average per serialization: ${avgPerSerialization.toFixed(2)}ms`);
      
      // Should serialize quickly for browser storage/transfer
      expect(avgPerSerialization).toBeLessThan(5); // Less than 5ms per serialization
    });

    test('should measure JSON parsing performance', () => {
      const serialized = JSON.stringify(enhancedAntibiotics);
      const iterations = 10;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        JSON.parse(serialized);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const avgPerParse = duration / iterations;
      
      console.log(`JSON parsing (${iterations} iterations): ${duration.toFixed(2)}ms`);
      console.log(`Average per parse: ${avgPerParse.toFixed(2)}ms`);
      
      // Should parse quickly for browser operations
      expect(avgPerParse).toBeLessThan(3); // Less than 3ms per parse
    });
  });

  describe('Comparative Performance Analysis', () => {
    test('should compare simple vs enhanced data access', () => {
      const iterations = 100;
      
      // Test with simple data
      const simpleStartTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        simpleAntibiotics.find(ab => ab.id === ((i % 30) + 1));
        simpleAntibiotics.filter(ab => ab.class === 'Beta-lactam');
      }
      const simpleEndTime = performance.now();
      const simpleDuration = simpleEndTime - simpleStartTime;
      
      // Test with enhanced data
      const enhancedStartTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        enhancedAntibiotics.find(ab => ab.id === ((i % 30) + 1));
        enhancedAntibiotics.filter(ab => ab.class === 'Beta-lactam');
      }
      const enhancedEndTime = performance.now();
      const enhancedDuration = enhancedEndTime - enhancedStartTime;
      
      const performanceImpact = ((enhancedDuration - simpleDuration) / simpleDuration) * 100;
      
      console.log(`Simple data operations: ${simpleDuration.toFixed(2)}ms`);
      console.log(`Enhanced data operations: ${enhancedDuration.toFixed(2)}ms`);
      console.log(`Performance impact: ${performanceImpact.toFixed(1)}%`);
      
      // Performance degradation should be minimal
      expect(performanceImpact).toBeLessThan(50); // Less than 50% performance impact
    });
  });

  describe('Real-World Usage Simulation', () => {
    test('should simulate typical component usage patterns', () => {
      const startTime = performance.now();
      
      // Simulate a typical component lifecycle
      for (let i = 0; i < 10; i++) {
        // Initial data load
        const allData = enhancedAntibiotics;
        
        // Search operation
        const searchResults = allData.filter(ab => 
          ab.name.toLowerCase().includes('penicillin') ||
          ab.description.toLowerCase().includes('gram')
        );
        
        // Filter by category
        const betaLactams = allData.filter(ab => ab.category === 'Beta-lactam');
        
        // Get specific antibiotic
        const vancomycin = allData.find(ab => ab.name === 'Vancomycin');
        
        // Access Northwestern data
        if (vancomycin && vancomycin.northwesternSpectrum) {
          const mrsaCoverage = vancomycin.northwesternSpectrum.MRSA;
        }
        
        // Filter by Northwestern criteria
        const mrsaActive = allData.filter(ab => 
          ab.northwesternSpectrum && ab.northwesternSpectrum.MRSA >= 1
        );
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`Real-world usage simulation: ${duration.toFixed(2)}ms`);
      
      // Should complete typical operations quickly
      expect(duration).toBeLessThan(20); // Less than 20ms for comprehensive operations
    });
  });
});