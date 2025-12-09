/**
 * useNetworkLayoutSimulation Hook
 * Force-directed graph layout simulation for pathogen network visualization
 * Extracted from PathogenNetworkVisualization.js during Phase 4 refactoring
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Physics parameters for force simulation
 */
const PHYSICS_CONFIG = {
  repulsionStrength: 1000,
  attractionStrength: 0.1,
  centeringStrength: 0.02,
  damping: 0.8,
  minDistance: 50,
  maxRepulsionDistance: 150,
  stabilityThreshold: 0.1,
  maxIterations: 300,
  margin: 50
};

/**
 * Initialize random node positions around center
 * @param {Array} nodes - Network nodes
 * @param {Object} dimensions - SVG dimensions { width, height }
 * @returns {Object} Initial positions map
 */
export const initializePositions = (nodes, dimensions) => {
  const positions = {};
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.2;

  nodes.forEach((node) => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * maxRadius;

    positions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      vx: 0,
      vy: 0,
      fx: 0,
      fy: 0
    };
  });

  return positions;
};

/**
 * Calculate repulsion forces between nodes
 */
const calculateRepulsion = (nodes, positions, config) => {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];
      const posA = positions[nodeA.id];
      const posB = positions[nodeB.id];

      if (!posA || !posB) continue;

      const dx = posA.x - posB.x;
      const dy = posA.y - posB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < config.maxRepulsionDistance) {
        const force = config.repulsionStrength / (distance * distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        posA.fx += fx;
        posA.fy += fy;
        posB.fx -= fx;
        posB.fy -= fy;
      }
    }
  }
};

/**
 * Calculate attraction forces for connected nodes
 */
const calculateAttraction = (edges, positions, config) => {
  edges.forEach(edge => {
    const posA = positions[edge.source];
    const posB = positions[edge.target];

    if (!posA || !posB) return;

    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > config.minDistance) {
      const force = config.attractionStrength * (distance - config.minDistance);
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;

      posA.fx += fx;
      posA.fy += fy;
      posB.fx -= fx;
      posB.fy -= fy;
    }
  });
};

/**
 * Calculate centering force toward SVG center
 */
const calculateCentering = (positions, dimensions, config) => {
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  Object.values(positions).forEach(pos => {
    const dx = centerX - pos.x;
    const dy = centerY - pos.y;

    pos.fx += dx * config.centeringStrength;
    pos.fy += dy * config.centeringStrength;
  });
};

/**
 * Apply forces and update positions
 * @returns {number} Total movement for stability detection
 */
const applyForces = (positions, dimensions, config) => {
  let totalMovement = 0;

  Object.values(positions).forEach(pos => {
    // Update velocity
    pos.vx = (pos.vx + pos.fx) * config.damping;
    pos.vy = (pos.vy + pos.fy) * config.damping;

    // Update position
    pos.x += pos.vx;
    pos.y += pos.vy;

    // Keep within bounds
    pos.x = Math.max(config.margin, Math.min(dimensions.width - config.margin, pos.x));
    pos.y = Math.max(config.margin, Math.min(dimensions.height - config.margin, pos.y));

    // Track movement for stability detection
    totalMovement += Math.abs(pos.vx) + Math.abs(pos.vy);

    // Reset forces for next iteration
    pos.fx = 0;
    pos.fy = 0;
  });

  return totalMovement;
};

/**
 * Custom hook for force-directed layout simulation
 * @param {Object} params
 * @param {Array} params.nodes - Network nodes
 * @param {Array} params.edges - Network edges
 * @param {Object} params.dimensions - SVG dimensions { width, height }
 * @param {Object} params.config - Optional physics configuration overrides
 * @returns {Object} { nodePositions, isLayoutStable, resetLayout }
 */
const useNetworkLayoutSimulation = ({
  nodes,
  edges,
  dimensions,
  config = {}
}) => {
  const [nodePositions, setNodePositions] = useState({});
  const [isLayoutStable, setIsLayoutStable] = useState(false);
  const animationRef = useRef(null);
  const iterationsRef = useRef(0);

  // Merge config with defaults
  const physicsConfig = { ...PHYSICS_CONFIG, ...config };

  // Simulate forces for one frame
  const simulateForces = useCallback((positions) => {
    const newPositions = {};

    // Deep copy positions
    Object.keys(positions).forEach(key => {
      newPositions[key] = { ...positions[key] };
    });

    // Calculate all forces
    calculateRepulsion(nodes, newPositions, physicsConfig);
    calculateAttraction(edges, newPositions, physicsConfig);
    calculateCentering(newPositions, dimensions, physicsConfig);

    // Apply forces and get total movement
    const totalMovement = applyForces(newPositions, dimensions, physicsConfig);

    return { newPositions, totalMovement };
  }, [nodes, edges, dimensions, physicsConfig]);

  // Animation loop
  useEffect(() => {
    if (!isLayoutStable && Object.keys(nodePositions).length > 0) {
      const animate = () => {
        const { newPositions, totalMovement } = simulateForces(nodePositions);
        setNodePositions(newPositions);

        iterationsRef.current++;

        // Check if layout is stable
        if (totalMovement < physicsConfig.stabilityThreshold ||
            iterationsRef.current > physicsConfig.maxIterations) {
          setIsLayoutStable(true);
        } else {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodePositions, isLayoutStable, simulateForces, physicsConfig]);

  // Initialize positions when dimensions or nodes change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0 && nodes.length > 0) {
      setNodePositions(initializePositions(nodes, dimensions));
      setIsLayoutStable(false);
      iterationsRef.current = 0;
    }
  }, [dimensions.width, dimensions.height, nodes.length]);

  // Reset layout function
  const resetLayout = useCallback(() => {
    setNodePositions(initializePositions(nodes, dimensions));
    setIsLayoutStable(false);
    iterationsRef.current = 0;
  }, [nodes, dimensions]);

  // Get position for a specific node
  const getNodePosition = useCallback((nodeId) => {
    return nodePositions[nodeId] || { x: dimensions.width / 2, y: dimensions.height / 2 };
  }, [nodePositions, dimensions]);

  return {
    nodePositions,
    isLayoutStable,
    resetLayout,
    getNodePosition
  };
};

export default useNetworkLayoutSimulation;
