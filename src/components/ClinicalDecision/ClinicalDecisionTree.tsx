/**
 * ClinicalDecisionTree.tsx
 *
 * Core component for interactive clinical decision support that guides
 * antibiotic selection through evidence-based visual pathways.
 *
 * Features:
 * - Interactive decision tree navigation
 * - Evidence-based antibiotic recommendations
 * - Integration with Northwestern animation system
 * - Real-time clinical input validation
 * - <15 second decision completion target
 * - Pediatric-focused clinical pathways
 *
 * Medical Accuracy: Based on AAP/IDSA guidelines
 * Educational Level: Medical students, residents, practicing clinicians
 *
 * @author Claude Code Assistant
 * @version 1.0.0
 * @medical-disclaimer Educational purposes only - not for clinical practice
 */

import React, { useState, useCallback, useMemo, useRef, useEffect, FC } from 'react';
import { groupAntibioticsByClass, analyzeCoveragePatterns } from '../../utils/medicalGroupingLogic';
import DecisionPathwayRenderer from './DecisionPathwayRenderer';
import ClinicalInputPanel from './ClinicalInputPanel';
import { getDecisionTree, validateClinicalInputs } from './DecisionTreeDataStructure';
import { NODE_TYPES } from './NodeTypes';
import type { ClinicalInputData, ClinicalDecisionTreeProps, TreeNode, AntibioticRecommendation } from '../../types/clinical-decision.types';

interface DecisionHistory {
  nodeId: string;
  timestamp: number;
  inputsSnapshot: ClinicalInputData;
}

interface ProcessedNode {
  id: string;
  type: string;
  name: string;
  label: string;  // Required by TreeNode
  shortLabel: string;
  data: Record<string, unknown>;
  children: ProcessedNode[];
}

/**
 * Clinical decision tree component
 * Guides clinicians through evidence-based antibiotic selection
 */
const ClinicalDecisionTree: FC<ClinicalDecisionTreeProps> = ({
  condition = 'community-acquired-pneumonia',
  patientAge = null,
  emergencyMode = false,
  onRecommendationComplete = () => {},
  onDecisionPathChange = () => {},
  className = '',
  antibioticData = [],
  pathogenData = [],
  selectedPathogen = null
}) => {
  // Core decision state management
  const [currentNode, setCurrentNode] = useState<string>('root');
  const [decisionHistory, setDecisionHistory] = useState<DecisionHistory[]>([]);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [availableNodes, setAvailableNodes] = useState<string[]>(['root']);
  const [clinicalInputs, setClinicalInputs] = useState<ClinicalInputData>({
    age: patientAge ?? undefined,
    weight: undefined,
    gender: undefined,
    allergies: [],
    severity: undefined,
    comorbidities: [],
    recentAntibiotics: [],
    localResistance: undefined,
    presentation: undefined,
    bacterial_likely: undefined,
    aom_confirmed: undefined,
    outpatient_suitable: undefined,
    observation_appropriate: undefined
  });
  const [recommendation, setRecommendation] = useState<AntibioticRecommendation | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [showInputPanel, setShowInputPanel] = useState<boolean>(false);

  // Performance tracking
  const decisionTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Container references
  const containerRef = useRef<HTMLDivElement>(null);
  const inputPanelRef = useRef<HTMLDivElement>(null);
  const recommendationRef = useRef<HTMLDivElement>(null);

  // Get decision tree data
  const decisionTreeData = useMemo(() => {
    return getDecisionTree(condition);
  }, [condition]);

  /**
   * Process decision tree hierarchical data for D3 visualization
   */
  const processedTreeForVisualization = useMemo(() => {
    if (!decisionTreeData?.nodes) return null;

    try {
      const nodes = decisionTreeData.nodes as unknown as Record<string, Record<string, unknown>>;
      const rootId = 'root';

      const createHierarchy = (nodeId: string): ProcessedNode | null => {
        const node = nodes[nodeId];
        if (!node) return null;

        const children: (ProcessedNode | null)[] = [];

        // Add direct next node if available
        const nextNode = node.next as string | undefined;
        if (nextNode && nodes[nextNode]) {
          children.push(createHierarchy(nextNode));
        }

        // Add branch children for decision nodes
        const branches = node.branches as Array<{ next: string }> | undefined;
        if (branches) {
          branches.forEach(branch => {
            if (branch.next && nodes[branch.next]) {
              children.push(createHierarchy(branch.next));
            }
          });
        }

        const title = (node.title || nodeId) as string;
        return {
          id: nodeId,
          type: (node.type || 'decision') as string,
          name: title,
          label: title,  // Required by TreeNode
          shortLabel: title.substring(0, 10),
          data: node,
          children: children.filter((c): c is ProcessedNode => c !== null)
        };
      };

      return createHierarchy(rootId);
    } catch (error) {
      console.error('Error processing tree data:', error);
      return null;
    }
  }, [decisionTreeData]);

  /**
   * Evaluate decision tree branch conditions against clinical inputs
   */
  const evaluateBranchCondition = useCallback((condition: Record<string, unknown>, inputs: ClinicalInputData): boolean => {
    if (!condition || !inputs) return false;

    // Handle 'and' conditions
    const andConditions = condition.and as Array<Record<string, unknown>> | undefined;
    if (andConditions) {
      return andConditions.every(subCondition => evaluateBranchCondition(subCondition, inputs));
    }

    const fieldValue = inputs[condition.field as keyof ClinicalInputData];
    const conditionValue = condition.value;
    const operator = condition.operator as string | undefined;

    // Handle different operators
    switch (operator) {
      case '<':
        return (fieldValue as number) < (conditionValue as number);
      case '>':
        return (fieldValue as number) > (conditionValue as number);
      case '>=':
        return (fieldValue as number) >= (conditionValue as number);
      case '<=':
        return (fieldValue as number) <= (conditionValue as number);
      case '=':
      case '==':
        return fieldValue === conditionValue;
      default:
        return fieldValue === conditionValue;
    }
  }, []);

  /**
   * Navigate to next node based on branch evaluation
   */
  const navigateToNextNode = useCallback((nodeId: string) => {
    if (!decisionTreeData?.nodes) return;

    const nodes = decisionTreeData.nodes as unknown as Record<string, Record<string, unknown>>;
    const currentNodeData = nodes[nodeId];

    if (!currentNodeData) return;

    // Record in history
    const historyEntry: DecisionHistory = {
      nodeId,
      timestamp: Date.now(),
      inputsSnapshot: { ...clinicalInputs }
    };
    setDecisionHistory(prev => [...prev, historyEntry]);

    // Mark as completed
    setCompletedNodes(prev => [...new Set([...prev, nodeId])]);

    // Determine next node based on branches
    const branches = currentNodeData.branches as Array<{ condition: Record<string, unknown>; next: string }> | undefined;
    if (branches && branches.length > 0) {
      const matchingBranch = branches.find(branch =>
        evaluateBranchCondition(branch.condition, clinicalInputs)
      );

      if (matchingBranch?.next) {
        setCurrentNode(matchingBranch.next);
        onDecisionPathChange(matchingBranch.next);
        return;
      }
    }

    // Fallback to direct next node
    const nextNode = currentNodeData.next as string | undefined;
    if (nextNode) {
      setCurrentNode(nextNode);
      onDecisionPathChange(nextNode);
    }
  }, [decisionTreeData, clinicalInputs, evaluateBranchCondition, onDecisionPathChange]);

  /**
   * Handle clinical input changes
   */
  const handleInputChange = useCallback((newInputs: ClinicalInputData) => {
    setClinicalInputs(newInputs);

    // Validate inputs
    const validation = validateClinicalInputs(newInputs, condition);
    if (validation.isValid) {
      setShowInputPanel(false);
    }
  }, [condition]);

  /**
   * Handle node click in pathway renderer
   */
  const handleNodeClick = useCallback((nodeId: string) => {
    if (availableNodes.includes(nodeId) || availableNodes.length === 0) {
      setCurrentNode(nodeId);
      onDecisionPathChange(nodeId);
    }
  }, [availableNodes, onDecisionPathChange]);

  /**
   * Initialize decision pathway on component mount
   */
  useEffect(() => {
    decisionTimeRef.current = Date.now() - startTime;
  }, [startTime]);

  /**
   * Process current recommendation when at outcome node
   */
  useEffect(() => {
    if (!decisionTreeData?.nodes) return;

    const nodes = decisionTreeData.nodes as unknown as Record<string, Record<string, unknown>>;
    const currentNodeData = nodes[currentNode];

    if (currentNodeData?.type === NODE_TYPES.OUTCOME) {
      const recommendations = (currentNodeData as Record<string, unknown>).recommendations as AntibioticRecommendation | undefined;
      if (recommendations) {
        setRecommendation(recommendations);
        onRecommendationComplete(recommendations);
      }
    }
  }, [currentNode, decisionTreeData, onRecommendationComplete]);

  return (
    <div
      ref={containerRef}
      className={`clinical-decision-tree ${className} ${emergencyMode ? 'emergency-mode' : ''}`}
      role="application"
      aria-label="Clinical Decision Support"
    >
      {/* Main content container */}
      <div className="decision-tree-layout">
        {/* Input Panel Section */}
        <div ref={inputPanelRef} className="input-section">
          <ClinicalInputPanel
            initialData={clinicalInputs}
            onInputChange={handleInputChange}
            emergencyMode={emergencyMode}
            condition={condition}
          />
        </div>

        {/* Decision Pathway Visualization */}
        {processedTreeForVisualization && (
          <div className="pathway-section">
            <DecisionPathwayRenderer
              treeData={processedTreeForVisualization as unknown as TreeNode}
              currentNode={currentNode}
              completedNodes={completedNodes}
              availableNodes={availableNodes}
              onNodeClick={handleNodeClick}
              onNodeHover={() => {}}
              emergencyMode={emergencyMode}
            />
          </div>
        )}

        {/* Recommendation Display Section */}
        {recommendation && (
          <div ref={recommendationRef} className="recommendation-section">
            <div className="recommendation-card">
              <h3>Clinical Recommendation</h3>
              <p>
                <strong>Antibiotic:</strong> {recommendation.antibioticName}
              </p>
              {recommendation.dosing && (
                <p>
                  <strong>Dosing:</strong> {recommendation.dosing}
                </p>
              )}
              {recommendation.duration && (
                <p>
                  <strong>Duration:</strong> {recommendation.duration}
                </p>
              )}
              {recommendation.notes && (
                <p>
                  <strong>Notes:</strong> {recommendation.notes}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Mode Indicator */}
      {emergencyMode && (
        <div className="emergency-indicator" role="status">
          <span>⚡ Emergency Mode</span>
        </div>
      )}
    </div>
  );
};

export default ClinicalDecisionTree;
