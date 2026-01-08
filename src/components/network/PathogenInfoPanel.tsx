/**
 * PathogenInfoPanel Component
 * Detailed information panel for selected pathogen
 * Extracted from PathogenNetworkVisualization.js during Phase 4 refactoring
 */

import React, { memo, ReactNode } from 'react';
import { getDetailedAntibioticInfo } from '../../utils/networkFilterUtils';
import { StatItemProps, EffectivenessSectionProps, PathogenInfoPanelProps, EFFECTIVENESS_COLORS } from '../../types/network-ui.types';

/**
 * Stat grid item component
 */
const StatItem = memo<StatItemProps>(({ label, value, valueClassName = '' }) => (
  <div className="bg-gray-50 p-3 rounded">
    <div className="text-sm text-gray-600">{label}</div>
    <div className={`font-medium capitalize ${valueClassName}`}>
      {value}
    </div>
  </div>
));

StatItem.displayName = 'StatItem';

/**
 * Antibiotic effectiveness section component
 */
const EffectivenessSection = memo<EffectivenessSectionProps>(({ title, antibiotics, colorScheme }) => {
  if (antibiotics.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 ${colorScheme.dot} rounded-full`} />
        <span className={`font-medium ${colorScheme.text}`}>{title}</span>
      </div>
      <div className="space-y-2">
        {antibiotics.map((antibiotic, index) => (
          <div
            key={index}
            className={`${colorScheme.bg} p-3 rounded border-l-4 ${colorScheme.border}`}
          >
            <div className={`font-medium ${colorScheme.textDark}`}>
              {antibiotic.name}
            </div>
            <div className={`text-sm ${colorScheme.textLight}`}>
              {antibiotic.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

EffectivenessSection.displayName = 'EffectivenessSection';

/**
 * Pathogen info panel component
 * @param {Object} props
 * @param {Object} props.pathogen - Selected pathogen data
 * @param {boolean} props.isVisible - Panel visibility
 * @param {Function} props.onClose - Close handler
 */
const PathogenInfoPanel = memo<PathogenInfoPanelProps>(({ pathogen, isVisible, onClose }) => {
  if (!isVisible || !pathogen) return null;

  const antibiotics = getDetailedAntibioticInfo?.(String(pathogen.pathogenId ?? '')) || { high: [], medium: [], low: [], resistant: [] };
  const resistancePercentage = pathogen.resistanceInfo?.resistancePercentage || 0;

  const getSeverityColor = (): string => {
    if (pathogen.severity === 'high') return 'text-red-600';
    if (pathogen.severity === 'medium') return 'text-yellow-600';
    return 'text-green-600';
  };

  const getResistanceColor = (): string => {
    if (resistancePercentage > 50) return 'text-red-600';
    if (resistancePercentage > 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l z-50 transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Pathogen Details</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-full">
        {/* Pathogen Overview */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-2">{pathogen.id}</h4>
          <p className="text-gray-600 mb-4">{pathogen.description}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <StatItem label="Gram Status" value={pathogen.gramStatus || 'Unknown'} />
            <StatItem label="Shape" value={pathogen.shape || 'Unknown'} />
            <StatItem
              label="Severity"
              value={pathogen.severity || 'Unknown'}
              valueClassName={getSeverityColor()}
            />
            <StatItem
              label="Resistance"
              value={`${resistancePercentage.toFixed(0)}%`}
              valueClassName={getResistanceColor()}
            />
          </div>

          {/* Common Infection Sites */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Common Infection Sites</div>
            <div className="flex flex-wrap gap-2">
              {pathogen.commonSites?.map((site, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {site}
                </span>
              ))}
            </div>
          </div>

          {/* Resistance Notes */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Resistance Notes</div>
            <div className="text-sm bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              {pathogen.resistance}
            </div>
          </div>
        </div>

        {/* Antibiotic Effectiveness */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Antibiotic Effectiveness</h4>
          <div className="space-y-4">
            <EffectivenessSection
              title="High Effectiveness"
              antibiotics={(antibiotics.high || []) as any}
              colorScheme={EFFECTIVENESS_COLORS.high}
            />
            <EffectivenessSection
              title="Medium Effectiveness"
              antibiotics={(antibiotics.medium || []) as any}
              colorScheme={EFFECTIVENESS_COLORS.medium}
            />
            <EffectivenessSection
              title="Low Effectiveness"
              antibiotics={(antibiotics.low || []) as any}
              colorScheme={EFFECTIVENESS_COLORS.low}
            />
            <EffectivenessSection
              title="Resistant"
              antibiotics={(antibiotics.resistant || []) as any}
              colorScheme={EFFECTIVENESS_COLORS.resistant}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

PathogenInfoPanel.displayName = 'PathogenInfoPanel';

export default PathogenInfoPanel;
