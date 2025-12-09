/**
 * EnhancedPathogenNetwork.test.js - Medical Network Component Tests
 * 
 * Basic functionality tests for medical-grade network visualization.
 * 
 * @version 1.0.0
 * @created 2025-08-27
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedPathogenNetwork from '../EnhancedPathogenNetwork';

// Mock the CytoscapeWrapper component
jest.mock('../CytoscapeWrapper', () => {
  const mockReact = require('react');
  return mockReact.forwardRef((props, ref) => {
    mockReact.useImperativeHandle(ref, () => ({
      getCytoscape: () => null,
      getPerformanceMetrics: () => ({ renderTime: 100, nodeCount: 10, edgeCount: 5 }),
      fit: jest.fn(),
      center: jest.fn(),
      reset: jest.fn()
    }));

    return mockReact.createElement(
      'div',
      { 'data-testid': 'cytoscape-wrapper-mock' },
      `Mock Network (${props.elements?.length || 0} elements)`
    );
  });
});

// Mock the NetworkDataAdapter
jest.mock('../NetworkDataAdapter', () => ({
  transformMedicalDataToCytoscape: () => ({
    elements: [
      {
        data: {
          id: 'pathogen-test',
          label: 'Test Pathogen',
          type: 'pathogen',
          gramStatus: 'positive',
          clinicalSeverity: 'high'
        }
      },
      {
        data: {
          id: 'antibiotic-test',
          label: 'Test Antibiotic',
          type: 'antibiotic'
        }
      }
    ],
    metadata: {
      pathogenCount: 1,
      antibioticCount: 1,
      relationshipCount: 0
    }
  }),
  getNetworkStatistics: () => ({
    nodeCount: 2,
    edgeCount: 0,
    pathogenCount: 1,
    antibioticCount: 1,
    gramPositive: 1,
    gramNegative: 0,
    effectiveConnections: 0,
    resistantConnections: 0
  })
}));

// Mock data sources
jest.mock('../../../data/SimplePathogenData', () => ({
  SimplePathogenData: {
    pathogens: [
      {
        id: 'test-pathogen',
        name: 'Test Pathogen',
        gramStain: 'positive',
        clinicalSeverity: 'high'
      }
    ]
  }
}));

jest.mock('../../../data/pathogenAntibioticMap', () => ({
  pathogenAntibioticMap: {
    'test-pathogen': [
      {
        antibioticId: 'test-antibiotic',
        name: 'Test Antibiotic',
        effectiveness: 'high'
      }
    ]
  }
}));

describe('EnhancedPathogenNetwork', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders network container with default props', async () => {
    render(<EnhancedPathogenNetwork />);
    
    await waitFor(() => {
      expect(screen.getByTestId('enhanced-pathogen-network')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByTestId('cytoscape-wrapper-mock')).toBeInTheDocument();
  });

  test('applies custom dimensions and className', () => {
    const { container } = render(
      <EnhancedPathogenNetwork 
        width="800px" 
        height="400px" 
        className="custom-network" 
      />
    );
    
    const networkContainer = container.querySelector('.enhanced-pathogen-network');
    expect(networkContainer).toHaveClass('custom-network');
    expect(networkContainer).toHaveStyle({ width: '800px', height: '400px' });
  });

  test('shows control panel when showControls is true', async () => {
    render(<EnhancedPathogenNetwork showControls={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Network Controls')).toBeInTheDocument();
    });
    
    // Click on Filters tab to access filter controls
    const filtersTab = screen.getByText('Filters');
    fireEvent.click(filtersTab);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Gram Stain')).toBeInTheDocument();
      expect(screen.getByLabelText('Clinical Severity')).toBeInTheDocument();
      expect(screen.getByLabelText('Evidence Level')).toBeInTheDocument(); // New evidence filter
      expect(screen.getByLabelText('Show Antibiotics')).toBeInTheDocument();
    });
  });

  test('hides control panel when showControls is false', async () => {
    render(<EnhancedPathogenNetwork showControls={false} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('enhanced-pathogen-network')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Network Controls')).not.toBeInTheDocument();
  });

  test('shows statistics when showStatistics is true', async () => {
    render(<EnhancedPathogenNetwork showStatistics={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Network Statistics')).toBeInTheDocument();
    });
    
    // Use getAllByText to handle multiple occurrences and check that we have at least one
    const pathogenTexts = screen.getAllByText(/Pathogens:/);
    const antibioticTexts = screen.getAllByText(/Antibiotics:/);
    
    expect(pathogenTexts.length).toBeGreaterThan(0);
    expect(antibioticTexts.length).toBeGreaterThan(0);
  });

  test('hides statistics when showStatistics is false', async () => {
    render(<EnhancedPathogenNetwork showStatistics={false} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('enhanced-pathogen-network')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Network Statistics')).not.toBeInTheDocument();
  });

  test('gram stain filter works correctly', async () => {
    render(<EnhancedPathogenNetwork showControls={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Network Controls')).toBeInTheDocument();
    });
    
    // Click on Filters tab to access filter controls
    const filtersTab = screen.getByText('Filters');
    fireEvent.click(filtersTab);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Gram Stain')).toBeInTheDocument();
    });
    
    const gramSelect = screen.getByLabelText('Gram Stain');
    
    act(() => {
      fireEvent.change(gramSelect, { target: { value: 'positive' } });
    });
    
    expect(gramSelect.value).toBe('positive');
  });

  test('antibiotic toggle works correctly', async () => {
    render(<EnhancedPathogenNetwork showControls={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Network Controls')).toBeInTheDocument();
    });
    
    // Click on Filters tab to access filter controls
    const filtersTab = screen.getByText('Filters');
    fireEvent.click(filtersTab);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Show Antibiotics')).toBeInTheDocument();
    });
    
    const antibioticToggle = screen.getByLabelText('Show Antibiotics');
    expect(antibioticToggle).toBeChecked();
    
    act(() => {
      fireEvent.click(antibioticToggle);
    });
    
    expect(antibioticToggle).not.toBeChecked();
  });

  test('evidence level filter works correctly', async () => {
    render(<EnhancedPathogenNetwork showControls={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Network Controls')).toBeInTheDocument();
    });
    
    // Click on Filters tab to access filter controls
    const filtersTab = screen.getByText('Filters');
    fireEvent.click(filtersTab);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Evidence Level')).toBeInTheDocument();
    });
    
    const evidenceSelect = screen.getByLabelText('Evidence Level');
    
    act(() => {
      fireEvent.change(evidenceSelect, { target: { value: 'A' } });
    });
    
    expect(evidenceSelect.value).toBe('A');
    
    // Test high-quality filter option
    act(() => {
      fireEvent.change(evidenceSelect, { target: { value: 'high-quality' } });
    });
    
    expect(evidenceSelect.value).toBe('high-quality');
  });

  test('displays network with mock elements', async () => {
    render(<EnhancedPathogenNetwork />);
    
    await waitFor(() => {
      expect(screen.getByText(/Mock Network \(2 elements\)/)).toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', async () => {
    render(<EnhancedPathogenNetwork />);
    
    await waitFor(() => {
      const networkContainer = screen.getByTestId('enhanced-pathogen-network');
      expect(networkContainer).toBeInTheDocument();
    });
  });

  test('calls onNetworkReady when network is loaded', async () => {
    const mockNetworkReady = jest.fn();
    
    render(<EnhancedPathogenNetwork onNetworkReady={mockNetworkReady} />);
    
    await waitFor(() => {
      expect(mockNetworkReady).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.any(Array),
          metadata: expect.objectContaining({
            pathogenCount: expect.any(Number),
            antibioticCount: expect.any(Number)
          })
        }),
        expect.objectContaining({
          nodeCount: expect.any(Number),
          edgeCount: expect.any(Number)
        })
      );
    });
  });
});