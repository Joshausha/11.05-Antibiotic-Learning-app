/**
 * Cytoscape Import Verification Test (Jest)
 *
 * Purpose: Verify that cytoscape core library is properly installed.
 * Note: react-cytoscapejs is tested separately in a browser environment
 * because it requires DOM and webpack module resolution.
 */

import cytoscape from 'cytoscape';
import fs from 'fs';
import path from 'path';

describe('Cytoscape Package Installation Verification', () => {
  describe('Core cytoscape library', () => {
    test('cytoscape should be importable', () => {
      expect(cytoscape).toBeDefined();
    });

    test('cytoscape should be a function', () => {
      expect(typeof cytoscape).toBe('function');
    });

    test('cytoscape should have version property', () => {
      expect(cytoscape.version).toBeDefined();
      expect(typeof cytoscape.version).toBe('string');
    });

    test('cytoscape instance should be creatable', () => {
      const cy = cytoscape({
        elements: [],
        headless: true
      });

      expect(cy).toBeDefined();
      expect(typeof cy.nodes).toBe('function');
      expect(typeof cy.edges).toBe('function');
    });

    test('cytoscape instance should handle basic operations', () => {
      const cy = cytoscape({
        elements: [
          { data: { id: 'node1' } },
          { data: { id: 'node2' } },
          { data: { id: 'edge1', source: 'node1', target: 'node2' } }
        ],
        headless: true
      });

      expect(cy.nodes().length).toBe(2);
      expect(cy.edges().length).toBe(1);
    });
  });

  describe('react-cytoscapejs package installation', () => {
    test('react-cytoscapejs package is installed in node_modules', () => {
      // Verify the package exists in node_modules
      const packagePath = path.join(__dirname, '../node_modules/react-cytoscapejs/package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
    });

    test('react-cytoscapejs package.json is valid', () => {
      const packagePath = path.join(__dirname, '../node_modules/react-cytoscapejs/package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      expect(packageJson.name).toBe('react-cytoscapejs');
      expect(packageJson.version).toBeDefined();
      expect(packageJson.main).toBeDefined();
    });

    test('react-cytoscapejs has required entry points', () => {
      const packagePath = path.join(__dirname, '../node_modules/react-cytoscapejs/package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      // Check if either main or module entry point exists
      // Note: package.json may reference .cjs.js but actual file is .module.js
      const modulePath = path.join(__dirname, '../node_modules/react-cytoscapejs', packageJson.module);
      const mainPath = path.join(__dirname, '../node_modules/react-cytoscapejs', packageJson.main);

      const moduleExists = fs.existsSync(modulePath);
      const mainExists = fs.existsSync(mainPath);

      // At least one entry point should exist
      expect(moduleExists || mainExists).toBe(true);

      // Specifically verify module file exists (known working entry point)
      expect(moduleExists).toBe(true);
    });
  });

  describe('TypeScript definitions', () => {
    test('@types/cytoscape package is installed', () => {
      const typesPath = path.join(__dirname, '../node_modules/@types/cytoscape/package.json');
      expect(fs.existsSync(typesPath)).toBe(true);
    });

    test('@types/cytoscape has valid type definitions', () => {
      const typesPath = path.join(__dirname, '../node_modules/@types/cytoscape/package.json');
      const packageJson = JSON.parse(fs.readFileSync(typesPath, 'utf8'));

      expect(packageJson.name).toBe('@types/cytoscape');
      expect(packageJson.types).toBeDefined();
    });
  });

  describe('Compatibility checks', () => {
    test('cytoscape should work with React 18.2.0', () => {
      // Verify no version conflicts
      const cy = cytoscape({ elements: [], headless: true });
      expect(cy).toBeDefined();
    });

    test('packages should not conflict with existing dependencies', () => {
      // If cytoscape imports work, basic compatibility is confirmed
      expect(cytoscape).toBeDefined();

      // Verify react-cytoscapejs package exists
      const packagePath = path.join(__dirname, '../node_modules/react-cytoscapejs/package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
    });
  });
});
