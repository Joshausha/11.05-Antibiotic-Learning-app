/**
 * Development Error Logger
 *
 * Provides detailed, structured error logging in development mode.
 * In production, errors are minimal to avoid exposing internal details.
 *
 * WHY: "Failed to load data" is useless. "Failed to load Amoxicillin:
 * missing gramPositiveCocci coverage" helps fix issues.
 */

interface DevErrorLogOptions {
  file: string;
  operation: string;
  error: Error | unknown;
  data?: unknown;
  context?: Record<string, unknown>;
}

/**
 * Log a detailed error in development mode
 * @param options - Error details and context
 */
export const logDevError = (options: DevErrorLogOptions): void => {
  const { file, operation, error, data, context } = options;
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  if (process.env.NODE_ENV === 'development') {
    console.error(`🔴 Data Error: ${operation}`, {
      file,
      operation,
      error: errorMessage,
      stack: errorStack,
      data: data !== undefined ? data : '[no data provided]',
      context: context || {},
      timestamp: new Date().toISOString()
    });
  } else {
    // Minimal production logging
    console.error(`Error: ${operation} - ${errorMessage}`);
  }
};

/**
 * Log a validation warning (non-fatal issues)
 */
export const logDevWarning = (message: string, details?: Record<string, unknown>): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`🟡 Data Warning: ${message}`, details || {});
  }
};

/**
 * Validate antibiotic data and return issues
 */
export const validateAntibioticData = (
  antibiotic: { name: string; northwesternSpectrum?: Record<string, number>; [key: string]: unknown }
): string[] => {
  const issues: string[] = [];

  if (!antibiotic.name) {
    issues.push('Missing antibiotic name');
  }

  if (!antibiotic.northwesternSpectrum) {
    issues.push(`Missing Northwestern coverage data for ${antibiotic.name || 'unknown'}`);
  } else {
    const spectrum = antibiotic.northwesternSpectrum;
    const requiredSegments = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals', 'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];

    requiredSegments.forEach(segment => {
      if (spectrum[segment] === undefined) {
        issues.push(`Missing ${segment} coverage for ${antibiotic.name}`);
      }
    });
  }

  return issues;
};

/**
 * Validate pathogen data and return issues
 */
export const validatePathogenData = (
  pathogen: { name: string; gramStatus?: string; conditions?: string[]; [key: string]: unknown }
): string[] => {
  const issues: string[] = [];

  if (!pathogen.name) {
    issues.push('Missing pathogen name');
  }

  if (!pathogen.gramStatus || pathogen.gramStatus === 'unknown') {
    issues.push(`Unknown gram status for ${pathogen.name || 'unknown'}`);
  }

  if (!pathogen.conditions || pathogen.conditions.length === 0) {
    issues.push(`No conditions associated with ${pathogen.name || 'unknown'}`);
  }

  return issues;
};

/**
 * Validate quiz question and return issues
 */
export const validateQuizQuestion = (
  question: { id?: string | number; question?: string; options?: unknown[]; correctAnswer?: unknown; [key: string]: unknown }
): string[] => {
  const issues: string[] = [];
  const id = question.id || 'unknown';

  if (!question.question) {
    issues.push(`Quiz question ${id} has no question text`);
  }

  if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
    issues.push(`Quiz question ${id} has invalid options (need at least 2)`);
  }

  if (question.correctAnswer === undefined) {
    issues.push(`Quiz question ${id} has no correct answer defined`);
  }

  return issues;
};

/**
 * Create a data loading error with helpful context
 */
export class DataLoadingError extends Error {
  file: string;
  operation: string;
  originalError?: Error;
  data?: unknown;

  constructor(message: string, options: { file: string; operation: string; originalError?: Error; data?: unknown }) {
    super(message);
    this.name = 'DataLoadingError';
    this.file = options.file;
    this.operation = options.operation;
    this.originalError = options.originalError;
    this.data = options.data;

    // Log in development
    logDevError({
      file: this.file,
      operation: this.operation,
      error: this.originalError || this,
      data: this.data
    });
  }
}

export default {
  logDevError,
  logDevWarning,
  validateAntibioticData,
  validatePathogenData,
  validateQuizQuestion,
  DataLoadingError
};
