/**
 * NetworkTooltip Component
 * Layer 2: Tooltip information on hover
 * Shows mechanism (antibiotics) and vulnerability (pathogens)
 */

import React from 'react';

interface TooltipContent {
  name: string;
  type: 'pathogen' | 'antibiotic';
  gramStain?: string;
  clinicalRelevance?: string;
  mechanism?: string;
  antibioticClass?: string;
  coverageCount?: number;
}

interface NetworkTooltipProps {
  content: TooltipContent;
  position: { x: number; y: number };
}

/**
 * Network Tooltip Component
 *
 * Displays additional information on hover:
 * - Pathogens: gram status, clinical relevance, coverage count
 * - Antibiotics: mechanism of action, antibiotic class
 *
 * Part of 3-layer information architecture:
 * Layer 1: Visual encoding (colors, sizes)
 * Layer 2: Tooltips (this component) ← You are here
 * Layer 3: Detail panels (PathogenInfoPanel)
 */
export const NetworkTooltip: React.FC<NetworkTooltipProps> = ({
  content,
  position
}) => {
  return (
    <foreignObject
      x={position.x + 25}
      y={position.y - 50}
      width={280}
      height={150}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="bg-white border border-slate-200 rounded-lg shadow-lg p-3"
        style={{
          fontSize: '12px',
          lineHeight: '1.4'
        }}
      >
        {/* Tooltip header */}
        <div className="font-semibold text-slate-900 mb-2 border-b border-slate-100 pb-1">
          {content.name}
        </div>

        {/* Pathogen-specific info */}
        {content.type === 'pathogen' && (
          <div className="space-y-1 text-slate-600">
            {content.gramStain && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700">Gram:</span>
                <span>{content.gramStain}</span>
              </div>
            )}
            {content.clinicalRelevance && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700">Clinical:</span>
                <span className="text-xs">
                  {content.clinicalRelevance.length > 80
                    ? content.clinicalRelevance.substring(0, 80) + '...'
                    : content.clinicalRelevance}
                </span>
              </div>
            )}
            {content.coverageCount !== undefined && (
              <div className="flex items-start gap-2 mt-2 pt-2 border-t border-slate-100">
                <span className="text-emerald-600 font-medium">
                  {content.coverageCount} effective antibiotics
                </span>
              </div>
            )}
          </div>
        )}

        {/* Antibiotic-specific info */}
        {content.type === 'antibiotic' && (
          <div className="space-y-1 text-slate-600">
            {content.antibioticClass && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700">Class:</span>
                <span>{content.antibioticClass}</span>
              </div>
            )}
            {content.mechanism && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700">Mechanism:</span>
                <span className="text-xs">
                  {content.mechanism.length > 100
                    ? content.mechanism.substring(0, 100) + '...'
                    : content.mechanism}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </foreignObject>
  );
};

export default NetworkTooltip;
