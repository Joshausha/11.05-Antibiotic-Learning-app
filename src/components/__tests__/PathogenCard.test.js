/**
 * Tests for PathogenCard
 * @description Comprehensive test coverage for PathogenCard component
 * Medical safety-critical: Yes (Infection control data)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PathogenCard from '../PathogenCard';

// Mocks
const mockGetPathogenDurationInfo = jest.fn();

jest.mock('../DurationIndicator', () => ({
  DurationSummary: ({ durations, title }) => (
    <div data-testid="mock-duration-summary" data-title={title}>
      {durations.length} durations
    </div>
  )
}));

jest.mock('../../data/durationMappings', () => ({
  getPathogenDurationInfo: (id) => mockGetPathogenDurationInfo(id)
}));

describe('PathogenCard', () => {
  const mockOnClose = jest.fn();
  
  const mockPathogen = {
    id: 'staph_aureus',
    name: 'Staphylococcus aureus',
    commonName: 'Staph Aureus',
    description: 'Common skin bacteria',
    gramStatus: 'positive',
    shape: 'cocci',
    severity: 'high',
    commonSites: ['Skin', 'Blood'],
    resistance: 'Methicillin resistance is common (MRSA)'
  };

  const mockDurationInfo = {
    durations: [{ condition: 'Bacteremia', days: 14 }],
    hasMultipleDurations: true
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockGetPathogenDurationInfo.mockReset();
    mockGetPathogenDurationInfo.mockReturnValue(mockDurationInfo);
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders placeholder when pathogen is null', () => {
      render(<PathogenCard pathogen={null} />);
      expect(screen.getByText(/select a pathogen to view details/i)).toBeInTheDocument();
    });

    test('renders pathogen details when provided', () => {
      render(<PathogenCard pathogen={mockPathogen} />);
      expect(screen.getByRole('heading', { name: 'Staphylococcus aureus' })).toBeInTheDocument();
      expect(screen.getByText('Staph Aureus')).toBeInTheDocument();
      expect(screen.getByText('Common skin bacteria')).toBeInTheDocument();
    });
  });

  describe('Gram Status Styling', () => {
    test('renders positive gram status correctly', () => {
      render(<PathogenCard pathogen={{ ...mockPathogen, gramStatus: 'positive' }} />);
      const badge = screen.getByText('Gram Positive');
      expect(badge).toHaveClass('text-purple-600');
    });

    test('renders negative gram status correctly', () => {
      render(<PathogenCard pathogen={{ ...mockPathogen, gramStatus: 'negative' }} />);
      const badge = screen.getByText('Gram Negative');
      expect(badge).toHaveClass('text-red-600');
    });

    test('renders basic gram status fallback', () => {
      render(<PathogenCard pathogen={{ ...mockPathogen, gramStatus: 'unknown' }} />);
      expect(screen.getByText(/gram negative/i)).toBeInTheDocument();
      const badge = screen.getByText('Gram Negative');
      expect(badge).toHaveClass('text-gray-600');
    });
  });

  describe('Severity Styling', () => {
    test('renders high severity correctly', () => {
      render(<PathogenCard pathogen={{ ...mockPathogen, severity: 'high' }} />);
      const badge = screen.getByText(/high severity/i);
      expect(badge).toHaveClass('text-red-600');
    });

    test('renders medium severity correctly', () => {
      render(<PathogenCard pathogen={{ ...mockPathogen, severity: 'medium' }} />);
      const badge = screen.getByText(/medium severity/i);
      expect(badge).toHaveClass('text-yellow-600');
    });

    test('renders low severity correctly', () => {
      render(<PathogenCard pathogen={{ ...mockPathogen, severity: 'low' }} />);
      const badge = screen.getByText(/low severity/i);
      expect(badge).toHaveClass('text-green-600');
    });
  });

  describe('Infection Site Icons', () => {
    test('renders common infection sites', () => {
      render(<PathogenCard pathogen={mockPathogen} />);
      expect(screen.getByText('Skin')).toBeInTheDocument();
      expect(screen.getByText('Blood')).toBeInTheDocument();
    });
  });

  describe('Resistance Alert Section', () => {
    test('displays resistance alert when provided', () => {
      render(<PathogenCard pathogen={mockPathogen} />);
      expect(screen.getByText(/RESISTANCE ALERT/)).toBeInTheDocument();
      expect(screen.getByText(/clinical awareness required/i)).toBeInTheDocument();
      expect(screen.getByText(/methicillin resistance is common/i)).toBeInTheDocument();
      expect(screen.getByText(/always verify susceptibility/i)).toBeInTheDocument();
    });
  });

  describe('Duration Section', () => {
    test('renders duration summary when data exists', () => {
      render(<PathogenCard pathogen={mockPathogen} />);
      expect(screen.getByTestId('mock-duration-summary')).toBeInTheDocument();
      expect(screen.getByText(/treatment duration varies/i)).toBeInTheDocument();
    });

    test('hides duration section when no data exists', () => {
      mockGetPathogenDurationInfo.mockReturnValueOnce(null);
      
      render(<PathogenCard pathogen={{ ...mockPathogen, id: 'unknown_bug' }} />);
      expect(screen.queryByTestId('mock-duration-summary')).not.toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    test('renders close button when onClose provided', () => {
      render(<PathogenCard pathogen={mockPathogen} onClose={mockOnClose} />);
      expect(screen.getByLabelText('Close pathogen details')).toBeInTheDocument();
    });

    test('calls onClose when clicked', () => {
      render(<PathogenCard pathogen={mockPathogen} onClose={mockOnClose} />);
      fireEvent.click(screen.getByLabelText('Close pathogen details'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('renders footer disclaimer', () => {
      render(<PathogenCard pathogen={mockPathogen} />);
      expect(screen.getByText(/clinical information for educational purposes only/i)).toBeInTheDocument();
    });

    test('has accessible structure', () => {
      render(<PathogenCard pathogen={mockPathogen} />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });
});
