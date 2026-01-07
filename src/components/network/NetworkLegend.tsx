/**
 * NetworkLegend Component
 * Legend display for pathogen network visualization
 * Clinical design system styling
 */

import React, { memo, ReactNode } from 'react';
import { AlertTriangle, Zap, Info } from 'lucide-react';
import { LegendSectionProps, LegendItemProps } from '../../types/network-ui.types';

/**
 * Legend section component with clinical styling
 */
const LegendSection = memo<LegendSectionProps>(({ title, children }) => (
  <div className="space-y-2">
    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {title}
    </div>
    <div className="space-y-1.5">
      {children}
    </div>
  </div>
));

LegendSection.displayName = 'LegendSection';

/**
 * Legend item component with clinical styling
 */
const LegendItem = memo<LegendItemProps>(({ indicator, label }) => (
  <div className="flex items-center gap-2 text-slate-600">
    {indicator}
    <span className="text-xs">{label}</span>
  </div>
));

LegendItem.displayName = 'LegendItem';

/**
 * Network legend component
 */
const NetworkLegend = memo(() => {
  return (
    <div className="p-5 border-t border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
      {/* Legend Header */}
      <div className="flex items-center gap-2 mb-4">
        <Info size={14} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Legend
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Gram Status */}
        <LegendSection title="Gram Status">
          <LegendItem
            indicator={
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' }}
              />
            }
            label="Gram Positive"
          />
          <LegendItem
            indicator={
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' }}
              />
            }
            label="Gram Negative"
          />
        </LegendSection>

        {/* Severity */}
        <LegendSection title="Severity">
          <LegendItem
            indicator={
              <div
                className="w-[18px] h-[18px] rounded-full shadow-sm"
                style={{ background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)' }}
              />
            }
            label="High (large)"
          />
          <LegendItem
            indicator={
              <div
                className="w-[14px] h-[14px] rounded-full shadow-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' }}
              />
            }
            label="Medium"
          />
          <LegendItem
            indicator={
              <div
                className="w-[10px] h-[10px] rounded-full shadow-sm"
                style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)' }}
              />
            }
            label="Low (small)"
          />
        </LegendSection>

        {/* Resistance */}
        <LegendSection title="Resistance">
          <LegendItem
            indicator={
              <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-red-50" />
            }
            label="High (>50%)"
          />
          <LegendItem
            indicator={
              <div className="w-3 h-3 rounded-full border-2 border-amber-500 bg-amber-50" />
            }
            label="Medium (25-50%)"
          />
          <LegendItem
            indicator={
              <div className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-emerald-50" />
            }
            label="Low (<25%)"
          />
        </LegendSection>

        {/* Connections */}
        <LegendSection title="Connections">
          <LegendItem
            indicator={
              <div
                className="w-6 h-1 rounded-full shadow-sm"
                style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)' }}
              />
            }
            label="Strong"
          />
          <LegendItem
            indicator={
              <div
                className="w-6 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)' }}
              />
            }
            label="Medium"
          />
          <LegendItem
            indicator={
              <div
                className="w-6 h-px rounded-full"
                style={{
                  background: 'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 3px, transparent 3px, transparent 6px)'
                }}
              />
            }
            label="Weak"
          />
        </LegendSection>

        {/* Indicators */}
        <LegendSection title="Indicators">
          <LegendItem
            indicator={
              <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                <AlertTriangle size={9} className="text-white" />
              </div>
            }
            label="High Resistance"
          />
          <LegendItem
            indicator={
              <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                <Zap size={9} className="text-white" />
              </div>
            }
            label="High Severity"
          />
          <LegendItem
            indicator={
              <div className="w-4 h-2.5 bg-gradient-to-r from-slate-400 to-slate-500 rounded-sm shadow-sm" />
            }
            label="Rod-shaped"
          />
        </LegendSection>
      </div>
    </div>
  );
});

NetworkLegend.displayName = 'NetworkLegend';

export default NetworkLegend;
