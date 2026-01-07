/**
 * Central type exports for the entire application
 * Re-exports all types for convenient importing
 *
 * Barrel file pattern allows clean imports:
 * import { Antibiotic, QuizQuestion, NorthwesternSpectrum } from '@/types';
 */

// Application types
export * from './app.types';

// Medical domain types (antibiotics, pathogens, quiz, learning)
export * from './medical.types';

// Component-specific types
export * from './component.types';

// Clinical decision support types
export * from './clinical-decision.types';

// Clinical UI types
export * from './clinical-ui.types';

// Network visualization types
export * from './network-ui.types';
