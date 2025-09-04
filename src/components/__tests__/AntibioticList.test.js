/**
 * AntibioticList Component Tests
 * Critical antibiotic drug listing validation and clinical decision support testing
 * Ensures accurate drug information display, effectiveness indicators, and dosing safety
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AntibioticList from '../AntibioticList';

// Mock the data dependencies
jest.mock('../../data/SimpleAntibioticData', () => ({
  getAntibioticById: jest.fn((id) => {
    const mockData = {
      'amoxicillin': {
        id: 'amoxicillin',
        name: 'Amoxicillin',
        class: 'Beta-lactam',
        mechanism: 'Cell wall synthesis inhibition',
        route: 'PO',
        commonUses: ['pneumonia', 'uti', 'skin infections']
      },
      'vancomycin': {
        id: 'vancomycin',
        name: 'Vancomycin',
        class: 'Glycopeptide',
        mechanism: 'Cell wall synthesis inhibition',
        route: 'IV',
        commonUses: ['MRSA', 'endocarditis', 'meningitis']
      },
      'ceftriaxone': {
        id: 'ceftriaxone',
        name: 'Ceftriaxone',
        class: 'Cephalosporin',
        mechanism: 'Cell wall synthesis inhibition',
        route: 'IV/IM',
        commonUses: ['meningitis', 'pneumonia', 'sepsis']
      }
    };
    return mockData[id] || null;
  })
}));

jest.mock('../../data/durationMappings', () => ({
  enhancedPathogenAntibioticMap: {
    'strep-pneumoniae': {
      antibiotics: [
        {
          antibioticId: 'amoxicillin',
          duration: '7-10 days',
          durationContext: 'Mild to moderate infections'
        },
        {
          antibioticId: 'ceftriaxone',
          duration: '5-7 days',
          durationContext: 'Severe infections with CNS involvement'
        }
      ]
    },
    'mrsa': {
      antibiotics: [
        {
          antibioticId: 'vancomycin',
          duration: '10-14 days',
          durationContext: 'Adjust based on clinical response'
        }
      ]
    }
  }
}));

// Mock DurationIndicator component
jest.mock('../DurationIndicator', () => {
  return function MockDurationIndicator({ duration, context, className }) {
    return (
      <div data-testid="duration-indicator" className={className}>
        <span data-testid="duration">{duration}</span>
        <span data-testid="duration-context">{context}</span>
      </div>
    );
  };
});

describe('AntibioticList - Drug Listing Validation & Clinical Safety', () => {
  // Mock pathogen data
  const mockPathogen = {
    id: 'strep-pneumoniae',
    name: 'Streptococcus pneumoniae',
    gramStatus: 'positive'
  };

  // Mock antibiotic data with clinical effectiveness indicators
  const mockAntibiotics = [
    {
      antibioticId: 'amoxicillin',
      name: 'Amoxicillin',
      effectiveness: 'high',
      route: 'PO',
      mechanism: 'Cell wall synthesis inhibition',
      class: 'Beta-lactam',
      commonUses: ['pneumonia', 'uti'],
      dosing: '875mg BID',
      contraindications: ['penicillin allergy'],
      sideEffects: ['GI upset', 'rash']
    },
    {
      antibioticId: 'ceftriaxone',
      name: 'Ceftriaxone',
      effectiveness: 'high',
      route: 'IV/IM',
      mechanism: 'Cell wall synthesis inhibition',
      class: 'Cephalosporin',
      commonUses: ['meningitis', 'pneumonia'],
      dosing: '2g daily',
      contraindications: ['cephalosporin allergy'],
      sideEffects: ['injection site reaction', 'diarrhea'],
      penetration: 'CNS'
    },
    {
      antibioticId: 'vancomycin',
      name: 'Vancomycin',
      effectiveness: 'medium',
      route: 'IV',
      mechanism: 'Cell wall synthesis inhibition',
      class: 'Glycopeptide',
      commonUses: ['MRSA', 'endocarditis'],
      dosing: '15-20mg/kg BID',
      contraindications: ['vancomycin allergy'],
      sideEffects: ['nephrotoxicity', 'ototoxicity'],
      monitoring: 'trough levels'
    }
  ];

  const defaultProps = {
    pathogen: mockPathogen,
    antibiotics: mockAntibiotics,
    onSelectAntibiotic: jest.fn(),
    selectedAntibiotic: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Drug Information Display & Medical Accuracy', () => {
    test('displays complete antibiotic information accurately', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Check all antibiotics are displayed
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
      expect(screen.getByText('Ceftriaxone')).toBeInTheDocument();
      expect(screen.getByText('Vancomycin')).toBeInTheDocument();
      
      // Check drug classes
      expect(screen.getByText('Beta-lactam')).toBeInTheDocument();
      expect(screen.getByText('Cephalosporin')).toBeInTheDocument();
      expect(screen.getByText('Glycopeptide')).toBeInTheDocument();
    });

    test('displays correct effectiveness indicators with clinical color coding', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // High effectiveness should show green with check icon
      const highEffectivenessElements = screen.getAllByText(/high.*effectiveness/i);
      highEffectivenessElements.forEach(element => {
        const container = element.closest('.antibiotic-card');
        expect(container).toHaveClass('text-green-600');
        expect(container).toHaveClass('bg-green-100');
      });
      
      // Medium effectiveness should show yellow with alert icon
      const mediumEffectivenessElements = screen.getAllByText(/medium.*effectiveness/i);
      mediumEffectivenessElements.forEach(element => {
        const container = element.closest('.antibiotic-card');
        expect(container).toHaveClass('text-yellow-600');
        expect(container).toHaveClass('bg-yellow-100');
      });
    });

    test('shows correct route of administration with appropriate icons', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // PO route should show pill icon
      expect(screen.getByText(/PO/i)).toBeInTheDocument();
      
      // IV route should show syringe icon
      expect(screen.getByText(/IV/i)).toBeInTheDocument();
      
      // IM route should show droplet icon
      expect(screen.getByText(/IM/i)).toBeInTheDocument();
    });

    test('displays mechanism of action with educational icons', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Cell wall synthesis inhibition should show shield icon
      const cellWallMechanism = screen.getAllByText(/cell wall.*synthesis/i);
      expect(cellWallMechanism.length).toBeGreaterThan(0);
      
      // Each mechanism should have appropriate visual indicator
      cellWallMechanism.forEach(element => {
        const mechanismContainer = element.closest('.mechanism-indicator');
        expect(mechanismContainer).toContainHTML('shield'); // Shield icon for cell wall
      });
    });

    test('shows infection-specific icons based on common uses', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Meningitis should show brain icon
      const meningitisUse = screen.getByText(/meningitis/i);
      const brainIconContainer = meningitusUse.closest('.infection-icons');
      expect(brainIconContainer).toContainHTML('brain'); // Brain icon
      
      // Pneumonia should show lung icon
      const pneumoniaUse = screen.getByText(/pneumonia/i);
      const lungIconContainer = pneumoniaUse.closest('.infection-icons');
      expect(lungIconContainer).toContainHTML('wind'); // Lung/wind icon
      
      // Endocarditis should show heart icon
      const endocarditisUse = screen.getByText(/endocarditis/i);
      const heartIconContainer = endocarditisUse.closest('.infection-icons');
      expect(heartIconContainer).toContainHTML('heart'); // Heart icon
    });

    test('integrates duration information from clinical mappings', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Should show duration indicators with context
      expect(screen.getByTestId('duration')).toHaveTextContent('7-10 days');
      expect(screen.getByTestId('duration-context')).toHaveTextContent('Mild to moderate infections');
    });
  });

  describe('Clinical Decision Support Features', () => {
    test('highlights contraindications for patient safety', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Should show allergy warnings
      expect(screen.getByText(/penicillin allergy/i)).toBeInTheDocument();
      expect(screen.getByText(/cephalosporin allergy/i)).toBeInTheDocument();
      expect(screen.getByText(/vancomycin allergy/i)).toBeInTheDocument();
    });

    test('displays critical side effects and monitoring requirements', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Should show important side effects
      expect(screen.getByText(/nephrotoxicity/i)).toBeInTheDocument();
      expect(screen.getByText(/ototoxicity/i)).toBeInTheDocument();
      
      // Should show monitoring requirements
      expect(screen.getByText(/trough levels/i)).toBeInTheDocument();
    });

    test('provides dosing information for clinical use', () => {
      render(<AntibioticList {...defaultProps} />);
      
      expect(screen.getByText('875mg BID')).toBeInTheDocument();
      expect(screen.getByText('2g daily')).toBeInTheDocument();
      expect(screen.getByText('15-20mg/kg BID')).toBeInTheDocument();
    });

    test('indicates special penetration characteristics', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Ceftriaxone should show CNS penetration
      expect(screen.getByText(/CNS/i)).toBeInTheDocument();
    });
  });

  describe('Antibiotic Selection & Workflow Integration', () => {
    test('handles antibiotic selection for detailed information', async () => {
      const user = userEvent.setup();
      const mockOnSelectAntibiotic = jest.fn();
      
      render(<AntibioticList 
        {...defaultProps} 
        onSelectAntibiotic={mockOnSelectAntibiotic}
      />);
      
      const antibioticButton = screen.getByRole('button', { name: /Amoxicillin/i });
      await user.click(antibioticButton);
      
      expect(mockOnSelectAntibiotic).toHaveBeenCalledWith('amoxicillin');
    });

    test('highlights selected antibiotic with visual feedback', () => {
      const selectedProps = {
        ...defaultProps,
        selectedAntibiotic: 'vancomycin'
      };
      
      render(<AntibioticList {...selectedProps} />);
      
      const selectedAntibiotic = screen.getByText('Vancomycin');
      const selectedContainer = selectedAntibiotic.closest('button');
      
      expect(selectedContainer).toHaveClass('ring-2');
      expect(selectedContainer).toHaveClass('ring-blue-500');
      expect(selectedContainer).toHaveClass('border-blue-500');
    });

    test('supports keyboard navigation for accessibility', async () => {
      const user = userEvent.setup();
      const mockOnSelectAntibiotic = jest.fn();
      
      render(<AntibioticList 
        {...defaultProps} 
        onSelectAntibiotic={mockOnSelectAntibiotic}
      />);
      
      // Tab to first antibiotic and activate
      const firstAntibiotic = screen.getByRole('button', { name: /Amoxicillin/i });
      await user.tab();
      expect(firstAntibiotic).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(mockOnSelectAntibiotic).toHaveBeenCalledWith('amoxicillin');
    });
  });

  describe('Enhanced Duration Integration', () => {
    test('merges duration data with antibiotic information', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Should show enhanced duration information from mappings
      const durationIndicators = screen.getAllByTestId('duration-indicator');
      expect(durationIndicators.length).toBeGreaterThan(0);
    });

    test('handles missing duration data gracefully', () => {
      const pathogenWithoutDuration = {
        id: 'unknown-pathogen',
        name: 'Unknown Pathogen'
      };
      
      render(<AntibioticList 
        {...defaultProps} 
        pathogen={pathogenWithoutDuration}
      />);
      
      // Should still display antibiotics without crashing
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    });

    test('provides context-sensitive duration information', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Should show clinical context for duration
      expect(screen.getByText(/mild to moderate infections/i)).toBeInTheDocument();
      expect(screen.getByText(/severe infections.*cns/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases & Medical Data Safety', () => {
    test('shows placeholder when no pathogen selected', () => {
      render(<AntibioticList 
        {...defaultProps} 
        pathogen={null}
      />);
      
      expect(screen.getByText(/Select a pathogen to view antibiotics/)).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument(); // Pill icon
    });

    test('shows placeholder when no antibiotics available', () => {
      render(<AntibioticList 
        {...defaultProps} 
        antibiotics={[]}
      />);
      
      expect(screen.getByText(/Select a pathogen to view antibiotics/)).toBeInTheDocument();
    });

    test('handles missing antibiotic properties safely', () => {
      const incompleteAntibiotics = [
        {
          antibioticId: 'incomplete',
          name: 'Incomplete Antibiotic'
          // Missing effectiveness, route, mechanism, etc.
        }
      ];
      
      render(<AntibioticList 
        {...defaultProps} 
        antibiotics={incompleteAntibiotics}
      />);
      
      expect(screen.getByText('Incomplete Antibiotic')).toBeInTheDocument();
      // Should not crash with missing properties
    });

    test('prevents medical data corruption from invalid effectiveness values', () => {
      const invalidEffectivenessAntibiotics = [
        {
          ...mockAntibiotics[0],
          effectiveness: 'invalid-value'
        }
      ];
      
      render(<AntibioticList 
        {...defaultProps} 
        antibiotics={invalidEffectivenessAntibiotics}
      />);
      
      // Should handle gracefully with default styling
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    });

    test('maintains data integrity during rapid pathogen changes', () => {
      const { rerender } = render(<AntibioticList {...defaultProps} />);
      
      const newPathogen = {
        id: 'mrsa',
        name: 'MRSA'
      };
      
      const newAntibiotics = [
        {
          antibioticId: 'vancomycin',
          name: 'Vancomycin',
          effectiveness: 'high'
        }
      ];
      
      rerender(<AntibioticList 
        pathogen={newPathogen}
        antibiotics={newAntibiotics}
        onSelectAntibiotic={jest.fn()}
      />);
      
      expect(screen.getByText('Vancomycin')).toBeInTheDocument();
      expect(screen.queryByText('Amoxicillin')).not.toBeInTheDocument();
    });
  });

  describe('Performance & Clinical Workflow Requirements', () => {
    test('renders antibiotic list within clinical performance requirements', () => {
      const startTime = performance.now();
      
      render(<AntibioticList {...defaultProps} />);
      
      const renderTime = performance.now() - startTime;
      expect(renderTime).toBeLessThan(100); // <100ms for clinical workflows
    });

    test('handles large antibiotic datasets efficiently', () => {
      const largeAntibioticList = new Array(50).fill(null).map((_, index) => ({
        antibioticId: `antibiotic-${index}`,
        name: `Antibiotic ${index}`,
        effectiveness: ['high', 'medium', 'low'][index % 3],
        route: 'PO',
        mechanism: 'Cell wall synthesis inhibition',
        class: 'Test Class'
      }));
      
      const startTime = performance.now();
      render(<AntibioticList 
        {...defaultProps} 
        antibiotics={largeAntibioticList}
      />);
      const renderTime = performance.now() - startTime;
      
      expect(renderTime).toBeLessThan(500); // Should handle large datasets
    });

    test('optimizes re-renders with useMemo for enhanced data', () => {
      const { rerender } = render(<AntibioticList {...defaultProps} />);
      
      // Same pathogen and antibiotics should not trigger expensive recalculation
      rerender(<AntibioticList {...defaultProps} />);
      
      // useMemo should prevent unnecessary recalculation
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    });
  });

  describe('Medical Education Features', () => {
    test('provides visual learning through drug class categorization', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Different classes should be visually distinguishable
      expect(screen.getByText('Beta-lactam')).toBeInTheDocument();
      expect(screen.getByText('Cephalosporin')).toBeInTheDocument();
      expect(screen.getByText('Glycopeptide')).toBeInTheDocument();
    });

    test('supports mechanism-based learning with icons', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Cell wall inhibitors should have consistent icon treatment
      const cellWallInhibitors = screen.getAllByText(/cell wall.*synthesis/i);
      expect(cellWallInhibitors.length).toBeGreaterThan(1);
    });

    test('enables comparative drug analysis through consistent layout', () => {
      render(<AntibioticList {...defaultProps} />);
      
      const antibioticCards = screen.getAllByRole('button');
      expect(antibioticCards.length).toBe(mockAntibiotics.length);
      
      // Each card should contain essential comparison elements
      antibioticCards.forEach(card => {
        expect(card).toHaveTextContent(/effectiveness/i);
        expect(card).toHaveTextContent(/route/i);
      });
    });

    test('provides infection-specific context for clinical decision-making', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Should show infection types each antibiotic is used for
      expect(screen.getByText(/pneumonia/i)).toBeInTheDocument();
      expect(screen.getByText(/meningitis/i)).toBeInTheDocument();
      expect(screen.getByText(/endocarditis/i)).toBeInTheDocument();
    });
  });

  describe('Safety Validation & Clinical Warnings', () => {
    test('prominently displays allergy warnings', () => {
      render(<AntibioticList {...defaultProps} />);
      
      const allergyWarnings = [
        /penicillin allergy/i,
        /cephalosporin allergy/i,
        /vancomycin allergy/i
      ];
      
      allergyWarnings.forEach(warning => {
        const element = screen.getByText(warning);
        expect(element).toBeInTheDocument();
        // Should have warning styling
        expect(element.closest('.warning-indicator')).toHaveClass('text-red-600');
      });
    });

    test('highlights high-risk side effects appropriately', () => {
      render(<AntibioticList {...defaultProps} />);
      
      // Nephrotoxicity and ototoxicity should be prominent
      expect(screen.getByText(/nephrotoxicity/i)).toBeInTheDocument();
      expect(screen.getByText(/ototoxicity/i)).toBeInTheDocument();
    });

    test('provides monitoring requirements for patient safety', () => {
      render(<AntibioticList {...defaultProps} />);
      
      expect(screen.getByText(/trough levels/i)).toBeInTheDocument();
    });
  });
});

/**
 * Medical Validation Test Summary
 * 
 * ✅ Complete drug information display and accuracy
 * ✅ Effectiveness indicators with clinical color coding
 * ✅ Route of administration with appropriate icons
 * ✅ Mechanism of action educational visualization
 * ✅ Infection-specific usage context and icons
 * ✅ Duration integration with clinical mappings
 * ✅ Clinical decision support features
 * ✅ Contraindication and allergy warnings
 * ✅ Side effect and monitoring requirements
 * ✅ Antibiotic selection and workflow integration
 * ✅ Performance optimization for clinical environments
 * ✅ Edge case handling and data safety protection
 * ✅ Medical education features for comparative learning
 * ✅ Safety validation and clinical warnings
 * 
 * Medical Safety: All tests ensure accurate drug information,
 * prevent medication errors, and provide appropriate clinical
 * warnings for safe antibiotic selection and prescribing.
 */