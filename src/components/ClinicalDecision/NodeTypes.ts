/**
 * Decision Tree Node Types
 * Shared constant file to prevent circular dependencies
 */

export const NODE_TYPES = {
  ROOT: 'root',
  DECISION: 'decision',
  OUTCOME: 'outcome',
  INPUT: 'input',
  WARNING: 'warning'
} as const;

export type NodeTypeValue = typeof NODE_TYPES[keyof typeof NODE_TYPES];
