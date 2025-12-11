/**
 * NetworkLegend Component
 * Legend display for pathogen network visualization
 * Extracted from PathogenNetworkVisualization.js during Phase 4 refactoring
 */

import React, { memo, ReactNode } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';
import { LegendSectionProps, LegendItemProps } from '../../types/network-ui.types';

/**
 * Legend section component
 */
const LegendSection = memo<LegendSectionProps>(({ title, children }) => (
  <div className="space-y-1">
    <div className="font-semibold text-gray-700">{title}</div>
    {children}
  </div>
));

LegendSection.displayName = 'LegendSection';

/**
 * Legend item component
 */
const LegendItem = memo<LegendItemProps>(({ indicator, label }) => (
  <div className="flex items-center gap-2">
    {indicator}
    <span>{label}</span>
  </div>
));

LegendItem.displayName = 'LegendItem';

/**
 * Network legend component
 */
const NetworkLegend = memo(() => {
  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
        {/* Gram Status */}
        <LegendSection title="Gram Status">
          <LegendItem
            indicator={<div className="w-3 h-3 rounded-full bg-purple-500" />}
            label="Gram Positive"
          />
          <LegendItem
            indicator={<div className="w-3 h-3 rounded-full bg-red-500" />}
            label="Gram Negative"
          />
        </LegendSection>

        {/* Severity */}
        <LegendSection title="Severity">
          <LegendItem
            indicator={<div className="w-5 h-5 rounded-full bg-purple-800" />}
            label="High (large)"
          />
          <LegendItem
            indicator={<div className="w-4 h-4 rounded-full bg-purple-500" />}
            label="Medium"
          />
          <LegendItem
            indicator={<div className="w-3 h-3 rounded-full bg-purple-300" />}
            label="Low (small)"
          />
        </LegendSection>

        {/* Resistance */}
        <LegendSection title="Resistance">
          <LegendItem
            indicator={<div className="w-3 h-3 rounded-full border-2 border-red-600" />}
            label="High (>50%)"
          />
          <LegendItem
            indicator={<div className="w-3 h-3 rounded-full border-2 border-yellow-500" />}
            label="Medium (25-50%)"
          />
          <LegendItem
            indicator={<div className="w-3 h-3 rounded-full border-2 border-green-600" />}
            label="Low (<25%)"
          />
        </LegendSection>

        {/* Connections */}
        <LegendSection title="Connections">
          <LegendItem
            indicator={<div className="w-6 h-1 bg-emerald-500 rounded-full" />}
            label="Strong"
          />
          <LegendItem
            indicator={<div className="w-6 h-0.5 bg-amber-500 rounded-full" />}
            label="Medium"
          />
          <LegendItem
            indicator={
              <div
                className="w-6 h-0.5 rounded-full"
                style={{ borderTop: '1px dashed #94a3b8', backgroundColor: 'transparent' }}
              />
            }
            label="Weak"
          />
        </LegendSection>

        {/* Indicators */}
        <LegendSection title="Indicators">
          <LegendItem
            indicator={
              <div className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle size={8} className="text-white" />
              </div>
            }
            label="High Resistance"
          />
          <LegendItem
            indicator={
              <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                <Zap size={8} className="text-white" />
              </div>
            }
            label="High Severity"
          />
          <LegendItem
            indicator={<div className="w-3 h-2 bg-gray-400 rounded-sm" />}
            label="Rod-shaped"
          />
        </LegendSection>
      </div>
    </div>
  );
});

NetworkLegend.displayName = 'NetworkLegend';

export default NetworkLegend;
