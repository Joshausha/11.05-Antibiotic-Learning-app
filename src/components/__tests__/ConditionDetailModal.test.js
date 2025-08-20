/**
 * Tests for ConditionDetailModal component
 * @description Comprehensive test suite for the condition details modal component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConditionDetailModal from '../ConditionDetailModal';

describe('ConditionDetailModal Component', () => {
  const mockOnClose = jest.fn();

  const sampleCondition = {
    name: 'Pneumonia',
    category: 'Respiratory',
    description: 'Infection of the lungs caused by bacteria, viruses, or fungi.',
    commonPathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae', 'Mycoplasma pneumoniae'],
    empiricTherapy: {
      'First Line': 'Amoxicillin OR Azithromycin',
      'Alternative': 'Cefuroxime OR Clarithromycin'
    },
    duration: '7-10 days',
    keyPoints: ['Consider atypical pathogens in school-age children'],
    clinicalPearls: ['Higher dose amoxicillin may be needed for resistant organisms']
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('does not render when condition is null', () => {
    render(<ConditionDetailModal condition={null} onClose={mockOnClose} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders modal when condition is provided', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Pneumonia')).toBeInTheDocument();
  });

  test('displays all condition information', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    // Check main information
    expect(screen.getByText('Pneumonia')).toBeInTheDocument();
    expect(screen.getByText('Respiratory')).toBeInTheDocument();
    expect(screen.getByText(/infection of the lungs/i)).toBeInTheDocument();
    
    // Check pathogens
    expect(screen.getByText('Streptococcus pneumoniae')).toBeInTheDocument();
    expect(screen.getByText('Haemophilus influenzae')).toBeInTheDocument();
    expect(screen.getByText('Mycoplasma pneumoniae')).toBeInTheDocument();
    
    // Check antibiotics (in therapy format)
    expect(screen.getByText(/Amoxicillin OR Azithromycin/i)).toBeInTheDocument();
    expect(screen.getByText(/Cefuroxime OR Clarithromycin/i)).toBeInTheDocument();
    
    // Check duration
    expect(screen.getByText(/7-10 days/i)).toBeInTheDocument();
    
    // Check key points and clinical pearls
    expect(screen.getByText(/consider atypical pathogens/i)).toBeInTheDocument();
    expect(screen.getByText(/higher dose amoxicillin/i)).toBeInTheDocument();
  });

  test('close button calls onClose', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('clicking backdrop calls onClose', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('pressing Escape key calls onClose', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('modal content does not trigger onClose when clicked', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    const modalContent = screen.getByText('Pneumonia').closest('.bg-white');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('has proper accessibility attributes', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-labelledby');
    expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('prevents body scroll when open', () => {
    const originalStyle = document.body.style.overflow;
    
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    // Cleanup
    document.body.style.overflow = originalStyle;
  });

  test('restores body scroll when closed', () => {
    const { rerender } = render(
      <ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<ConditionDetailModal condition={null} onClose={mockOnClose} />);
    
    expect(document.body.style.overflow).toBe('unset');
  });

  test('displays section headers correctly', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    expect(screen.getByText(/common pathogens/i)).toBeInTheDocument();
    expect(screen.getByText(/empiric antibiotic therapy/i)).toBeInTheDocument();
    expect(screen.getByText(/duration of therapy/i)).toBeInTheDocument();
    expect(screen.getByText(/key clinical points/i)).toBeInTheDocument();
    expect(screen.getByText(/clinical pearls/i)).toBeInTheDocument();
  });

  test('handles missing optional fields gracefully', () => {
    const minimalCondition = {
      name: 'Test Condition',
      category: 'Test Category',
      description: 'Test description',
      commonPathogens: ['Test Pathogen']
      // Missing empiricTherapy, duration, keyPoints, clinicalPearls
    };

    render(<ConditionDetailModal condition={minimalCondition} onClose={mockOnClose} />);
    
    expect(screen.getByText('Test Condition')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('Test Pathogen')).toBeInTheDocument();
    expect(screen.getByText('Duration not specified')).toBeInTheDocument();
  });

  test('close button is keyboard accessible', () => {
    render(<ConditionDetailModal condition={sampleCondition} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.keyDown(closeButton, { key: 'Enter' });
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});