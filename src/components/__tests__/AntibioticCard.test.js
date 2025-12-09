/**
 * Tests for AntibioticCard
 * @description Comprehensive test coverage for the AntibioticCard component
 * Medical safety-critical: Yes
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AntibioticCard from '../AntibioticCard';

// Mocks
const mockGetAntibioticById = jest.fn();

jest.mock('../NorthwesternPieChart', () => {
  return function MockNorthwesternPieChart({ antibiotic, size, interactive, educationLevel, onSegmentHover, onSegmentClick }) {
    return (
      <div 
        data-testid="mock-northwestern-pie" 
        data-size={size}
        onClick={() => onSegmentClick && onSegmentClick('MRSA')}
        onMouseEnter={() => onSegmentHover && onSegmentHover('MRSA')}
      >
        Northwestern Pie Mock
      </div>
    );
  };
});

jest.mock('../../data/EnhancedAntibioticData', () => ({
  getAntibioticById: (id) => mockGetAntibioticById(id)
}));

describe('AntibioticCard', () => {
  const mockOnClose = jest.fn();
  
  const mockAntibiotic = {
    id: 'penicillin_g',
    name: 'Penicillin G',
    class: 'Penicillins',
    route: 'IV',
    description: 'Natural penicillin',
    mechanism: 'Inhibits cell wall synthesis',
    commonUses: ['Syphilis', 'Streptococcal infections'],
    resistance: 'Beta-lactamase producing bacteria',
    sideEffects: 'Hypersensitivity',
    conditions: ['c1', 'c2']
  };

  const mockEnhancedData = {
    id: 'penicillin_g',
    name: 'Penicillin G',
    class: 'Penicillins',
    northwesternSpectrum: {
      MRSA: 0,
      MSSA: 2,
      gramNegative: 1
    },
    cellWallActive: true,
    generation: 1
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockGetAntibioticById.mockReset();
    mockGetAntibioticById.mockReturnValue(mockEnhancedData);
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders placeholder when antibiotic is null', () => {
      render(<AntibioticCard antibiotic={null} />);
      expect(screen.getByText(/select an antibiotic to view details/i)).toBeInTheDocument();
    });

    test('renders antibiotic name and details when provided', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      expect(screen.getByRole('heading', { name: /penicillin g/i })).toBeInTheDocument();
      expect(screen.getByText(/natural penicillin/i)).toBeInTheDocument();
    });
  });

  describe('Drug Class Color Mapping', () => {
    const testClassColor = (drugClass, expectedClassPart) => {
      const antibiotic = { ...mockAntibiotic, class: drugClass };
      render(<AntibioticCard antibiotic={antibiotic} />);
      const classBadge = screen.getByText(drugClass);
      expect(classBadge.className).toContain(expectedClassPart);
    };

    test('maps Penicillins correctly', () => testClassColor('Penicillins', 'text-blue-600'));
    test('maps Cephalosporins correctly', () => testClassColor('Cephalosporins', 'text-green-600'));
    test('maps Glycopeptides correctly', () => testClassColor('Glycopeptides', 'text-purple-600'));
    test('maps Fluoroquinolones correctly', () => testClassColor('Fluoroquinolones', 'text-orange-600'));
    test('maps Macrolides correctly', () => testClassColor('Macrolides', 'text-pink-600'));
    test('maps Aminoglycosides correctly', () => testClassColor('Aminoglycosides', 'text-indigo-600'));
    test('maps Lincosamides correctly', () => testClassColor('Lincosamides', 'text-teal-600'));
    test('maps Oxazolidinones correctly', () => testClassColor('Oxazolidinones', 'text-red-600'));
    test('maps Unknown class correctly', () => testClassColor('Unknown', 'text-gray-600'));
  });

  describe('Route Icon Determination', () => {
    test('displays IV route correctly', () => {
      render(<AntibioticCard antibiotic={{ ...mockAntibiotic, route: 'IV' }} />);
      expect(screen.getByText('IV')).toBeInTheDocument();
    });

    test('displays Oral route correctly', () => {
      render(<AntibioticCard antibiotic={{ ...mockAntibiotic, route: 'Oral' }} />);
      expect(screen.getByText('Oral')).toBeInTheDocument();
    });

    test('displays IV/Oral route correctly', () => {
      render(<AntibioticCard antibiotic={{ ...mockAntibiotic, route: 'IV/Oral' }} />);
      expect(screen.getByText('IV/Oral')).toBeInTheDocument();
    });

    test('handles array route format', () => {
      render(<AntibioticCard antibiotic={{ ...mockAntibiotic, route: ['IV', 'Oral'] }} />);
      expect(screen.getByText(/IV\/Oral/)).toBeInTheDocument();
    });
  });

  describe('Northwestern Visualization', () => {
    test('renders pie chart when enabled and data exists', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} showNorthwestern={true} />);
      expect(screen.getByTestId('mock-northwestern-pie')).toBeInTheDocument();
      expect(screen.getByText(/northwestern coverage/i)).toBeInTheDocument();
    });

    test('hides pie chart when showNorthwestern is false', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} showNorthwestern={false} />);
      expect(screen.queryByTestId('mock-northwestern-pie')).not.toBeInTheDocument();
    });

    test('toggles detailed view', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      const toggleButton = screen.getByText(/detailed view/i);
      fireEvent.click(toggleButton);
      expect(screen.getByText(/simple view/i)).toBeInTheDocument();
    });

    test('displays segment details on interaction', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      const chart = screen.getByTestId('mock-northwestern-pie');
      fireEvent.mouseEnter(chart); // Simulates segment hover handled by mock
      expect(screen.getByText(/mrsa coverage:/i)).toBeInTheDocument();
      expect(screen.getByText(/no coverage/i)).toBeInTheDocument();
    });
  });

  describe('Clinical Info Sections', () => {
    test('displays mechanism of action', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      expect(screen.getByText(/inhibits cell wall synthesis/i)).toBeInTheDocument();
    });

    test('displays common uses', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      expect(screen.getByText('Syphilis')).toBeInTheDocument();
      expect(screen.getByText('Streptococcal infections')).toBeInTheDocument();
    });

    test('displays resistance information', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      expect(screen.getByText(/resistance considerations/i)).toBeInTheDocument();
      expect(screen.getByText(/beta-lactamase/i)).toBeInTheDocument();
    });

    test('displays side effects', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      expect(screen.getByText(/side effects/i)).toBeInTheDocument();
      expect(screen.getByText(/hypersensitivity/i)).toBeInTheDocument();
    });

    test('displays enhanced data (cell wall active)', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      expect(screen.getByText(/cell wall active/i)).toBeInTheDocument();
      expect(screen.getByText(/generation 1/i)).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    test('renders close button when onClose is provided', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /close card/i });
      expect(closeButton).toBeInTheDocument();
    });

    test('calls onClose when clicked', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /close card/i });
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not render close button when onClose is undefined', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      expect(screen.queryByRole('button', { name: /close card/i })).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('close button has aria-label', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} onClose={mockOnClose} />);
      expect(screen.getByLabelText(/close card/i)).toBeInTheDocument();
    });

    test('has proper heading structure', () => {
      render(<AntibioticCard antibiotic={mockAntibiotic} />);
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });
});
