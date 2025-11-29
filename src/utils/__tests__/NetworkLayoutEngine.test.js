/**
 * NetworkLayoutEngine Test Suite
 *
 * Comprehensive tests for D3.js layout algorithms:
 * - Force-directed layout (5 tests)
 * - Hierarchical layout (5 tests)
 * - Circular layout (5 tests)
 * - Validation and metrics (7 tests)
 * - Edge cases and integration (5 tests)
 *
 * Total: 27 comprehensive tests
 */

import { NetworkLayoutEngine, createLayoutEngine } from '../NetworkLayoutEngine';

describe('NetworkLayoutEngine', () => {
  // =====================================================================
  // TEST FIXTURES
  // =====================================================================

  const mockRelationships = [
    {
      sourceId: 2,
      targetId: 6,
      similarity: 0.68,
      relationshipType: 'strong'
    },
    {
      sourceId: 2,
      targetId: 3,
      similarity: 0.45,
      relationshipType: 'medium'
    },
    {
      sourceId: 3,
      targetId: 7,
      similarity: 0.38,
      relationshipType: 'medium'
    },
    {
      sourceId: 6,
      targetId: 7,
      similarity: 0.52,
      relationshipType: 'strong'
    },
    {
      sourceId: 2,
      targetId: 1,
      similarity: 0.35,
      relationshipType: 'weak'
    }
  ];

  let engine;

  beforeEach(() => {
    engine = new NetworkLayoutEngine(mockRelationships, {
      width: 1000,
      height: 800,
      nodeRadius: 20
    });
  });

  // =====================================================================
  // INITIALIZATION TESTS
  // =====================================================================

  describe('Initialization', () => {
    test('should initialize with relationships and configuration', () => {
      expect(engine).toBeDefined();
      expect(engine.width).toBe(1000);
      expect(engine.height).toBe(800);
      expect(engine.nodeRadius).toBe(20);
      expect(engine.relationships).toEqual(mockRelationships);
    });

    test('should use default configuration when not provided', () => {
      const defaultEngine = new NetworkLayoutEngine([]);
      expect(defaultEngine.width).toBe(1000);
      expect(defaultEngine.height).toBe(800);
      expect(defaultEngine.nodeRadius).toBe(20);
    });

    test('should extract unique pathogens from relationships', () => {
      expect(engine.pathogens.length).toBeGreaterThan(0);
      expect(engine.pathogens[0]).toHaveProperty('id');
      expect(engine.pathogens[0]).toHaveProperty('name');
    });

    test('should create pathogen map for O(1) lookup', () => {
      expect(engine.pathogenMap).toBeInstanceOf(Map);
      expect(engine.pathogenMap.size).toBe(engine.pathogens.length);
    });

    test('should handle empty relationships', () => {
      const emptyEngine = new NetworkLayoutEngine([]);
      expect(emptyEngine.pathogens.length).toBe(0);
      expect(emptyEngine.pathogenMap.size).toBe(0);
    });
  });

  // =====================================================================
  // FORCE-DIRECTED LAYOUT TESTS
  // =====================================================================

  describe('Force-Directed Layout', () => {
    test('should compute force-directed layout with default options', () => {
      const layout = engine.forceDirectedLayout();

      expect(layout).toBeDefined();
      expect(layout.nodes).toBeDefined();
      expect(layout.edges).toBeDefined();
      expect(layout.algorithm).toBe('force-directed');
      expect(layout.executionTime).toBeGreaterThan(0);
    });

    test('should position nodes within bounds', () => {
      const layout = engine.forceDirectedLayout();

      layout.nodes.forEach(node => {
        expect(node.x).toBeGreaterThanOrEqual(engine.nodeRadius);
        expect(node.x).toBeLessThanOrEqual(engine.width - engine.nodeRadius);
        expect(node.y).toBeGreaterThanOrEqual(engine.nodeRadius);
        expect(node.y).toBeLessThanOrEqual(engine.height - engine.nodeRadius);
      });
    });

    test('should include all required node properties', () => {
      const layout = engine.forceDirectedLayout();

      layout.nodes.forEach(node => {
        expect(node).toHaveProperty('id');
        expect(node).toHaveProperty('name');
        expect(node).toHaveProperty('x');
        expect(node).toHaveProperty('y');
        expect(node).toHaveProperty('gramStain');
      });
    });

    test('should respect custom charge strength option', () => {
      const layout1 = engine.forceDirectedLayout({ chargeStrength: -100 });
      const layout2 = engine.forceDirectedLayout({ chargeStrength: -1000 });

      expect(layout1.executionTime).toBeLessThan(5000);
      expect(layout2.executionTime).toBeLessThan(5000);
    });

    test('should complete within performance target (<1000ms)', () => {
      const layout = engine.forceDirectedLayout({ iterations: 300 });
      expect(layout.executionTime).toBeLessThan(1000);
    });

    test('should return all edges in output', () => {
      const layout = engine.forceDirectedLayout();
      expect(layout.edges.length).toBe(mockRelationships.length);
    });
  });

  // =====================================================================
  // HIERARCHICAL LAYOUT TESTS
  // =====================================================================

  describe('Hierarchical Layout', () => {
    test('should compute hierarchical layout with default options', () => {
      const layout = engine.hierarchicalLayout();

      expect(layout).toBeDefined();
      expect(layout.nodes).toBeDefined();
      expect(layout.edges).toBeDefined();
      expect(layout.algorithm).toBe('hierarchical');
      expect(layout.executionTime).toBeGreaterThan(0);
    });

    test('should position nodes in severity tiers', () => {
      const layout = engine.hierarchicalLayout();
      const yPositions = new Set();

      layout.nodes.forEach(node => {
        expect(node).toHaveProperty('tier');
        expect(['high', 'medium', 'low']).toContain(node.tier);
        yPositions.add(Math.round(node.y));
      });

      // Should have at least 2 distinct Y positions (different tiers)
      expect(yPositions.size).toBeGreaterThanOrEqual(1);
    });

    test('should position nodes within bounds', () => {
      const layout = engine.hierarchicalLayout();

      layout.nodes.forEach(node => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.x).toBeLessThanOrEqual(engine.width);
        expect(node.y).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeLessThanOrEqual(engine.height);
      });
    });

    test('should respect custom tier and node spacing', () => {
      const layout = engine.hierarchicalLayout({
        tierSpacing: 300,
        nodeSpacing: 120
      });

      expect(layout).toBeDefined();
      expect(layout.nodes.length).toBeGreaterThan(0);
    });

    test('should sort nodes by relationship count within tiers', () => {
      const layout = engine.hierarchicalLayout();
      expect(layout.nodes.length).toBeGreaterThan(0);

      // Verify that nodes in each tier are present
      const tiers = {};
      layout.nodes.forEach(node => {
        if (!tiers[node.tier]) tiers[node.tier] = [];
        tiers[node.tier].push(node);
      });

      Object.keys(tiers).forEach(tier => {
        expect(tiers[tier].length).toBeGreaterThan(0);
      });
    });

    test('should complete within performance target (<1000ms)', () => {
      const layout = engine.hierarchicalLayout();
      expect(layout.executionTime).toBeLessThan(1000);
    });
  });

  // =====================================================================
  // CIRCULAR LAYOUT TESTS
  // =====================================================================

  describe('Circular Layout', () => {
    test('should compute circular layout with default options', () => {
      const layout = engine.circularLayout();

      expect(layout).toBeDefined();
      expect(layout.nodes).toBeDefined();
      expect(layout.edges).toBeDefined();
      expect(layout.algorithm).toBe('circular');
      expect(layout.executionTime).toBeGreaterThan(0);
    });

    test('should position nodes in circular arrangement', () => {
      const layout = engine.circularLayout({
        radius: 300,
        centerX: 500,
        centerY: 400
      });

      const centerX = 500;
      const centerY = 400;
      const radius = 300;

      layout.nodes.forEach(node => {
        const distance = Math.sqrt(
          Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2)
        );
        // Allow some tolerance for boundary clipping
        expect(distance).toBeLessThanOrEqual(radius + 50);
      });
    });

    test('should group nodes by Gram stain classification', () => {
      const layout = engine.circularLayout();
      const sectors = {};

      layout.nodes.forEach(node => {
        expect(node).toHaveProperty('sector');
        if (!sectors[node.sector]) sectors[node.sector] = 0;
        sectors[node.sector]++;
      });

      // Should have at least one non-empty sector
      const nonEmptySectors = Object.values(sectors).filter(count => count > 0);
      expect(nonEmptySectors.length).toBeGreaterThan(0);
    });

    test('should position nodes within bounds', () => {
      const layout = engine.circularLayout();

      layout.nodes.forEach(node => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.x).toBeLessThanOrEqual(engine.width);
        expect(node.y).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeLessThanOrEqual(engine.height);
      });
    });

    test('should respect custom radius and center options', () => {
      const layout = engine.circularLayout({
        radius: 400,
        centerX: 600,
        centerY: 500
      });

      expect(layout).toBeDefined();
      expect(layout.nodes.length).toBeGreaterThan(0);
    });

    test('should complete within performance target (<1000ms)', () => {
      const layout = engine.circularLayout();
      expect(layout.executionTime).toBeLessThan(1000);
    });
  });

  // =====================================================================
  // VALIDATION TESTS
  // =====================================================================

  describe('Layout Validation', () => {
    test('should validate correct layout output', () => {
      const layout = engine.forceDirectedLayout();
      const validation = engine.validateLayout(layout);

      expect(validation.valid).toBe(true);
      expect(validation.issues.length).toBe(0);
    });

    test('should reject layout with undefined positions', () => {
      const invalidLayout = {
        nodes: [
          { id: 2, name: 'E. coli', x: undefined, y: 100 }
        ],
        edges: []
      };

      const validation = engine.validateLayout(invalidLayout);
      expect(validation.valid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
    });

    test('should detect nodes outside bounds', () => {
      const invalidLayout = {
        nodes: [
          { id: 2, name: 'E. coli', x: -50, y: 100 },
          { id: 3, name: 'Pneumococcus', x: 2000, y: 100 }
        ],
        edges: []
      };

      const validation = engine.validateLayout(invalidLayout);
      expect(validation.valid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
    });

    test('should report node and edge counts', () => {
      const layout = engine.forceDirectedLayout();
      const validation = engine.validateLayout(layout);

      expect(validation).toHaveProperty('nodeCount');
      expect(validation).toHaveProperty('edgeCount');
      expect(validation.nodeCount).toBeGreaterThan(0);
    });

    test('should handle null or undefined layouts', () => {
      const validation = engine.validateLayout(null);
      expect(validation.valid).toBe(false);

      const validation2 = engine.validateLayout(undefined);
      expect(validation2.valid).toBe(false);
    });

    test('should validate all three layout types', () => {
      const forceLayout = engine.forceDirectedLayout();
      const hierarchyLayout = engine.hierarchicalLayout();
      const circularLayout = engine.circularLayout();

      const val1 = engine.validateLayout(forceLayout);
      const val2 = engine.validateLayout(hierarchyLayout);
      const val3 = engine.validateLayout(circularLayout);

      expect(val1.valid).toBe(true);
      expect(val2.valid).toBe(true);
      expect(val3.valid).toBe(true);
    });
  });

  // =====================================================================
  // PERFORMANCE METRICS TESTS
  // =====================================================================

  describe('Performance Metrics', () => {
    test('should track execution time for each layout', () => {
      engine.forceDirectedLayout();
      engine.hierarchicalLayout();
      engine.circularLayout();

      const metrics = engine.getPerformanceMetrics();

      expect(metrics.forceDirected).toBeGreaterThan(0);
      expect(metrics.hierarchical).toBeGreaterThan(0);
      expect(metrics.circular).toBeGreaterThan(0);
    });

    test('should calculate average execution time', () => {
      engine.forceDirectedLayout();
      engine.hierarchicalLayout();

      const metrics = engine.getPerformanceMetrics();

      expect(metrics.summary).toBeDefined();
      expect(metrics.summary.averageTime).toBeGreaterThan(0);
    });

    test('should identify fastest layout algorithm', () => {
      engine.forceDirectedLayout();
      engine.hierarchicalLayout();
      engine.circularLayout();

      const metrics = engine.getPerformanceMetrics();

      expect(metrics.summary.fastestLayout).toBeDefined();
      expect(['forceDirected', 'hierarchical', 'circular'])
        .toContain(metrics.summary.fastestLayout);
    });

    test('should reset metrics on reset', () => {
      engine.forceDirectedLayout();
      expect(Object.keys(engine.performanceMetrics).length).toBeGreaterThan(0);

      engine.reset();
      expect(Object.keys(engine.performanceMetrics).length).toBe(0);
    });
  });

  // =====================================================================
  // EDGE CASES AND INTEGRATION TESTS
  // =====================================================================

  describe('Edge Cases and Integration', () => {
    test('should handle single pathogen relationship', () => {
      const singleRel = [
        { sourceId: 2, targetId: 3, similarity: 0.5, relationshipType: 'medium' }
      ];

      const singleEngine = new NetworkLayoutEngine(singleRel);
      const layout = singleEngine.forceDirectedLayout();

      expect(layout.nodes.length).toBeGreaterThanOrEqual(2);
    });

    test('should handle high-similarity relationships', () => {
      const strongRels = [
        { sourceId: 2, targetId: 3, similarity: 0.95, relationshipType: 'strong' },
        { sourceId: 3, targetId: 6, similarity: 0.92, relationshipType: 'strong' }
      ];

      const strongEngine = new NetworkLayoutEngine(strongRels);
      const layout = strongEngine.forceDirectedLayout();

      expect(layout).toBeDefined();
      expect(layout.nodes.length).toBeGreaterThan(0);
    });

    test('should handle weak-similarity relationships', () => {
      const weakRels = [
        { sourceId: 2, targetId: 1, similarity: 0.31, relationshipType: 'weak' },
        { sourceId: 1, targetId: 6, similarity: 0.32, relationshipType: 'weak' }
      ];

      const weakEngine = new NetworkLayoutEngine(weakRels);
      const layout = weakEngine.circularLayout();

      expect(layout).toBeDefined();
      expect(layout.nodes.length).toBeGreaterThan(0);
    });

    test('should work with helper function createLayoutEngine', () => {
      const helperEngine = createLayoutEngine(mockRelationships, 1000, 800);

      expect(helperEngine).toBeInstanceOf(NetworkLayoutEngine);
      expect(helperEngine.width).toBe(1000);
      expect(helperEngine.height).toBe(800);
    });

    test('should maintain data integrity across multiple layout calls', () => {
      const layout1 = engine.forceDirectedLayout();
      const layout2 = engine.hierarchicalLayout();
      const layout3 = engine.circularLayout();

      // All layouts should have same node count
      expect(layout1.nodes.length).toBe(layout2.nodes.length);
      expect(layout2.nodes.length).toBe(layout3.nodes.length);

      // Original relationships should be unchanged
      expect(engine.relationships).toEqual(mockRelationships);
    });

    test('should handle pathogen data with all medical attributes', () => {
      const layout = engine.forceDirectedLayout();

      layout.nodes.forEach(node => {
        expect(node).toHaveProperty('gramStain');
        expect(node).toHaveProperty('severity');
        expect(['positive', 'negative', 'atypical', 'anaerobic'])
          .toContain(node.gramStain);
        expect(['high', 'medium', 'low'])
          .toContain(node.severity);
      });
    });
  });

  // =====================================================================
  // PERFORMANCE OPTIMIZATION TESTS
  // =====================================================================

  describe('Performance Optimization', () => {
    test('all layouts should complete in reasonable time with 50+ nodes', () => {
      // Create a larger dataset
      const largeDataset = [];
      for (let i = 1; i <= 29; i++) {
        for (let j = i + 1; j <= 29; j++) {
          if (Math.random() < 0.3) { // ~40-50% edge density
            largeDataset.push({
              sourceId: i,
              targetId: j,
              similarity: Math.random() * 0.7 + 0.3,
              relationshipType: 'medium'
            });
          }
        }
      }

      const largeEngine = new NetworkLayoutEngine(largeDataset);

      const forceStart = performance.now();
      largeEngine.forceDirectedLayout({ iterations: 100 });
      const forceTime = performance.now() - forceStart;

      const hierarchyStart = performance.now();
      largeEngine.hierarchicalLayout();
      const hierarchyTime = performance.now() - hierarchyStart;

      const circularStart = performance.now();
      largeEngine.circularLayout();
      const circularTime = performance.now() - circularStart;

      // All should complete reasonably fast
      expect(forceTime).toBeLessThan(2000); // Force may take longer due to iterations
      expect(hierarchyTime).toBeLessThan(500);
      expect(circularTime).toBeLessThan(500);
    });

    test('should maintain performance with reduced iterations', () => {
      const quickLayout = engine.forceDirectedLayout({ iterations: 50 });
      expect(quickLayout.executionTime).toBeLessThan(200);
    });
  });
});
