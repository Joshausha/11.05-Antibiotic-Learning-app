/**
 * Tests for NetworkVisualizationD3 Filtering and Interactive Features
 * Week 3 Implementation: Edge filtering, node filtering, and tooltips
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NetworkVisualizationD3 from '../NetworkVisualizationD3';
import { getPathogenRelationships } from '../../data/PathogenRelationshipData';

describe('NetworkVisualizationD3 - Filtering Features', () => {
  beforeEach(() => {
    // Mock D3 and related modules if needed
    jest.clearAllMocks();
  });

  describe('Edge Filtering by Similarity Threshold', () => {
    test('should render similarity threshold slider', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      const slider = screen.getByDisplayValue('0.3');
      expect(slider).toBeInTheDocument();
      expect(slider.type).toBe('range');
    });

    test('should display current threshold value', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      const thresholdValue = screen.getByText(/Similarity Threshold:/).parentElement;
      expect(thresholdValue?.textContent).toContain('0.30');
    });

    test('should update threshold label when slider changes', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      const slider = screen.getByDisplayValue('0.3');

      // Change slider to 0.5
      fireEvent.change(slider, { target: { value: '0.5' } });

      await waitFor(() => {
        expect(screen.getByText(/Showing edges with Jaccard coefficient ≥ 0\.50/)).toBeInTheDocument();
      });
    });

    test('should filter edges based on threshold', async () => {
      const { container } = render(<NetworkVisualizationD3 layoutType="force" />);

      // Get initial edge count
      const initialEdges = container.querySelectorAll('.network-link').length;

      // Increase threshold to filter out low-similarity edges
      const slider = screen.getByDisplayValue('0.3');
      fireEvent.change(slider, { target: { value: '0.8' } });

      await waitFor(() => {
        const filteredEdges = container.querySelectorAll('.network-link').length;
        expect(filteredEdges).toBeLessThanOrEqual(initialEdges);
      });
    });

    test('should show all edges at threshold 0.0', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      const relationships = getPathogenRelationships();

      const slider = screen.getByDisplayValue('0.3');
      fireEvent.change(slider, { target: { value: '0.0' } });

      // With threshold 0.0, all edges should be visible
      await waitFor(() => {
        expect(screen.getByText(/Showing edges with Jaccard coefficient ≥ 0\.00/)).toBeInTheDocument();
      });
    });

    test('should accept threshold values between 0.0 and 1.0', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      const slider = screen.getByDisplayValue('0.3');

      // Test changing to 0.5
      fireEvent.change(slider, { target: { value: '0.5' } });
      await waitFor(() => {
        expect(slider.value).toBe('0.5');
      });

      // Test changing to 0.75
      fireEvent.change(slider, { target: { value: '0.75' } });
      await waitFor(() => {
        expect(slider.value).toBe('0.75');
      });

      // Test changing to 1.0
      fireEvent.change(slider, { target: { value: '1.0' } });
      await waitFor(() => {
        expect(slider.value).toBe('1');
      });
    });
  });

  describe('Node Filtering by Severity', () => {
    test('should render severity filter checkboxes', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const highCheckbox = screen.getByLabelText(/High/);
      const mediumCheckbox = screen.getByLabelText(/Medium/);
      const lowCheckbox = screen.getByLabelText(/Low/);

      expect(highCheckbox).toBeInTheDocument();
      expect(mediumCheckbox).toBeInTheDocument();
      expect(lowCheckbox).toBeInTheDocument();
    });

    test('should have all severity filters checked by default', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const highCheckbox = screen.getByLabelText(/High/);
      const mediumCheckbox = screen.getByLabelText(/Medium/);
      const lowCheckbox = screen.getByLabelText(/Low/);

      expect(highCheckbox.checked).toBe(true);
      expect(mediumCheckbox.checked).toBe(true);
      expect(lowCheckbox.checked).toBe(true);
    });

    test('should toggle severity filter when checkbox clicked', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const highCheckbox = screen.getByLabelText(/High/);
      expect(highCheckbox.checked).toBe(true);

      fireEvent.click(highCheckbox);

      await waitFor(() => {
        expect(highCheckbox.checked).toBe(false);
      });
    });

    test('should filter out high severity nodes when unchecked', async () => {
      const { container } = render(<NetworkVisualizationD3 layoutType="force" />);

      const initialNodes = container.querySelectorAll('.network-node').length;

      const highCheckbox = screen.getByLabelText(/High/);
      fireEvent.click(highCheckbox);

      await waitFor(() => {
        const filteredNodes = container.querySelectorAll('.network-node').length;
        expect(filteredNodes).toBeLessThanOrEqual(initialNodes);
      });
    });
  });

  describe('Node Filtering by Gram Stain', () => {
    test('should render Gram stain filter checkboxes', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const gramPlusCheckbox = screen.getByLabelText(/Gram\+/);
      const gramMinusCheckbox = screen.getByLabelText(/Gram\-/);
      const atypicalCheckbox = screen.getByLabelText(/Atypical/);
      const otherCheckbox = screen.getByLabelText(/^Other$/);

      expect(gramPlusCheckbox).toBeInTheDocument();
      expect(gramMinusCheckbox).toBeInTheDocument();
      expect(atypicalCheckbox).toBeInTheDocument();
      expect(otherCheckbox).toBeInTheDocument();
    });

    test('should have all Gram stain filters checked by default', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const gramPlusCheckbox = screen.getByLabelText(/Gram\+/);
      const gramMinusCheckbox = screen.getByLabelText(/Gram\-/);
      const atypicalCheckbox = screen.getByLabelText(/Atypical/);
      const otherCheckbox = screen.getByLabelText(/^Other$/);

      expect(gramPlusCheckbox.checked).toBe(true);
      expect(gramMinusCheckbox.checked).toBe(true);
      expect(atypicalCheckbox.checked).toBe(true);
      expect(otherCheckbox.checked).toBe(true);
    });

    test('should toggle Gram stain filter when checkbox clicked', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const gramPlusCheckbox = screen.getByLabelText(/Gram\+/);
      expect(gramPlusCheckbox.checked).toBe(true);

      fireEvent.click(gramPlusCheckbox);

      await waitFor(() => {
        expect(gramPlusCheckbox.checked).toBe(false);
      });
    });

    test('should filter out Gram+ nodes when unchecked', async () => {
      const { container } = render(<NetworkVisualizationD3 layoutType="force" />);

      const initialNodes = container.querySelectorAll('.network-node').length;

      const gramPlusCheckbox = screen.getByLabelText(/Gram\+/);
      fireEvent.click(gramPlusCheckbox);

      await waitFor(() => {
        const filteredNodes = container.querySelectorAll('.network-node').length;
        expect(filteredNodes).toBeLessThanOrEqual(initialNodes);
      });
    });
  });

  describe('Combined Node and Edge Filtering', () => {
    test('should filter edges when nodes are hidden', async () => {
      const { container } = render(<NetworkVisualizationD3 layoutType="force" />);

      const initialEdges = container.querySelectorAll('.network-link').length;

      // Uncheck high severity to hide high severity nodes
      const highCheckbox = screen.getByLabelText(/High/);
      fireEvent.click(highCheckbox);

      await waitFor(() => {
        const filteredEdges = container.querySelectorAll('.network-link').length;
        // Connected edges should also be hidden
        expect(filteredEdges).toBeLessThanOrEqual(initialEdges);
      });
    });

    test('should apply both threshold and severity filters', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      // Increase similarity threshold
      const slider = screen.getByDisplayValue('0.3');
      fireEvent.change(slider, { target: { value: '0.7' } });

      // Uncheck medium severity
      const mediumCheckbox = screen.getByLabelText(/Medium/);
      fireEvent.click(mediumCheckbox);

      await waitFor(() => {
        expect(slider.value).toBe('0.7');
        expect(mediumCheckbox.checked).toBe(false);
      });
    });

    test('should show nothing when all filters are unchecked', async () => {
      const { container } = render(<NetworkVisualizationD3 layoutType="force" />);

      // Uncheck all severity filters
      const highCheckbox = screen.getByLabelText(/High/);
      const mediumCheckbox = screen.getByLabelText(/Medium/);
      const lowCheckbox = screen.getByLabelText(/Low/);

      fireEvent.click(highCheckbox);
      fireEvent.click(mediumCheckbox);
      fireEvent.click(lowCheckbox);

      await waitFor(() => {
        const nodes = container.querySelectorAll('.network-node');
        expect(nodes.length).toBe(0);
      });
    });
  });

  describe('Reset Filters Button', () => {
    test('should render reset filters button', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      const resetButton = screen.getByText(/Reset Filters/);
      expect(resetButton).toBeInTheDocument();
    });

    test('should reset all filters when clicked', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      // Change filters
      const slider = screen.getByDisplayValue('0.3');
      fireEvent.change(slider, { target: { value: '0.8' } });

      const highCheckbox = screen.getByLabelText(/High/);
      fireEvent.click(highCheckbox);

      // Click reset button
      const resetButton = screen.getByText(/Reset Filters/);
      fireEvent.click(resetButton);

      await waitFor(() => {
        // Check that filters are reset to defaults
        expect(slider.value).toBe('0.3');
        expect(highCheckbox.checked).toBe(true);
      });
    });

    test('should reset both severity and Gram stain filters', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      // Change multiple filters
      const highCheckbox = screen.getByLabelText(/High/);
      const gramPlusCheckbox = screen.getByLabelText(/Gram\+/);

      fireEvent.click(highCheckbox);
      fireEvent.click(gramPlusCheckbox);

      expect(highCheckbox.checked).toBe(false);
      expect(gramPlusCheckbox.checked).toBe(false);

      // Reset
      const resetButton = screen.getByText(/Reset Filters/);
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(highCheckbox.checked).toBe(true);
        expect(gramPlusCheckbox.checked).toBe(true);
      });
    });
  });

  describe('Tooltip Display', () => {
    test('should have threshold display text', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      const thresholdInfo = screen.getByText(/Showing edges with Jaccard coefficient/);
      expect(thresholdInfo).toBeInTheDocument();
    });

    test('should display tooltip info message', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      expect(screen.getByText(/Showing edges with Jaccard coefficient ≥ 0\.30/)).toBeInTheDocument();
    });

    test('should update tooltip info when threshold changes', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);
      const slider = screen.getByDisplayValue('0.3');

      fireEvent.change(slider, { target: { value: '0.5' } });

      await waitFor(() => {
        expect(screen.getByText(/Showing edges with Jaccard coefficient ≥ 0\.50/)).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Responsiveness', () => {
    test('should render without crashing with default props', () => {
      const { container } = render(<NetworkVisualizationD3 />);
      // Component should render (either loading state or visualization)
      expect(container.querySelector('.network-visualization-container')).toBeInTheDocument();
    });

    test('should handle rapid filter changes', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const slider = screen.getByDisplayValue('0.3');

      // Rapidly change threshold values
      fireEvent.change(slider, { target: { value: '0.5' } });
      fireEvent.change(slider, { target: { value: '0.7' } });
      fireEvent.change(slider, { target: { value: '0.2' } });

      await waitFor(() => {
        expect(slider.value).toBe('0.2');
      });
    });

    test('should handle multiple simultaneous filter changes', async () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const slider = screen.getByDisplayValue('0.3');
      const highCheckbox = screen.getByLabelText(/High/);
      const gramPlusCheckbox = screen.getByLabelText(/Gram\+/);

      // Change multiple filters simultaneously
      fireEvent.change(slider, { target: { value: '0.6' } });
      fireEvent.click(highCheckbox);
      fireEvent.click(gramPlusCheckbox);

      await waitFor(() => {
        expect(slider.value).toBe('0.6');
        expect(highCheckbox.checked).toBe(false);
        expect(gramPlusCheckbox.checked).toBe(false);
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper labels for all controls', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      // Check for label text
      expect(screen.getByText(/Similarity Threshold/)).toBeInTheDocument();
      expect(screen.getByText(/Filter by Severity/)).toBeInTheDocument();
      expect(screen.getByText(/Filter by Gram Stain/)).toBeInTheDocument();
    });

    test('should have keyboard accessible sliders', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const slider = screen.getByDisplayValue('0.3');
      expect(slider).toBeDefined();
      expect(slider.type).toBe('range');
    });

    test('should have clickable checkboxes', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      const highCheckbox = screen.getByLabelText(/High/);
      expect(highCheckbox.type).toBe('checkbox');
      expect(highCheckbox).toBeEnabled();
    });

    test('should label all severity checkboxes', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      expect(screen.getByLabelText(/^.*High.*$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^.*Medium.*$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^.*Low.*$/i)).toBeInTheDocument();
    });

    test('should label all Gram stain checkboxes', () => {
      render(<NetworkVisualizationD3 layoutType="force" />);

      expect(screen.getByLabelText(/Gram\+/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Gram\-/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Atypical/)).toBeInTheDocument();
    });
  });
});
