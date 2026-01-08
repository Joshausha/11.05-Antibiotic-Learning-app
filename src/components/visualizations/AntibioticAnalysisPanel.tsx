/**
 * AntibioticAnalysisPanel Component
 * Displays interactive antibiotic coverage analysis with Northwestern pie charts
 * Extracted from VisualizationsTab.tsx during Phase 4 refactoring
 */

import React, { memo, FC } from 'react';
import { Activity } from 'lucide-react';
import ErrorBoundary from '../ErrorBoundary';
import AnimatedNorthwesternPieChart from '../AnimatedNorthwesternPieChart';
import { getDrugClassColor } from '../../config/visualizationConfig';
import { Antibiotic } from '../../types/medical.types';

interface AntibioticAnalysisPanelProps {
  antibioticData?: {
    antibiotics?: Antibiotic[];
    [key: string]: any;
  };
  drugClassDistribution?: Record<string, number>;
  overviewStats?: {
    totalAntibiotics: number;
    [key: string]: any;
  };
}

const AntibioticAnalysisPanel: FC<AntibioticAnalysisPanelProps> = memo(({
  antibioticData = { antibiotics: [] },
  drugClassDistribution = {},
  overviewStats = { totalAntibiotics: 0 }
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Activity size={24} className="text-purple-600" />
        Interactive Antibiotic Coverage Analysis
      </h3>

      {/* Northwestern Pie Charts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {antibioticData?.antibiotics?.slice(0, 6).map((antibiotic, index) => (
          <AntibioticPieChartCard
            key={antibiotic.name || index}
            antibiotic={antibiotic}
            index={index}
          />
        ))}
      </div>

      {/* Fallback for missing data */}
      {(!antibioticData?.antibiotics || antibioticData.antibiotics.length === 0) && (
        <NoDataPlaceholder />
      )}

      {/* Drug Class Distribution Summary */}
      <DrugClassDistribution
        drugClassDistribution={drugClassDistribution}
        totalAntibiotics={overviewStats.totalAntibiotics}
      />
    </div>
  );
});

AntibioticAnalysisPanel.displayName = 'AntibioticAnalysisPanel';

/**
 * Individual antibiotic pie chart card
 */
interface AntibioticPieChartCardProps {
  antibiotic: Antibiotic;
  index: number;
}

const AntibioticPieChartCard: FC<AntibioticPieChartCardProps> = memo(({ antibiotic, index }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="text-lg font-medium text-gray-900 mb-3 text-center">
      {antibiotic.name || `Antibiotic ${index + 1}`}
    </h4>
    <div className="flex justify-center">
      <ErrorBoundary>
        <AnimatedNorthwesternPieChart
          antibiotic={antibiotic}
          size="small"
          interactive={true}
          showTooltips={true}
          onSegmentHover={(segment) => {
            console.log('Hovered segment:', segment);
          }}
        />
      </ErrorBoundary>
    </div>
    <div className="mt-2 text-sm text-gray-600 text-center">
      {antibiotic.class || 'Unknown class'}
    </div>
  </div>
));

AntibioticPieChartCard.displayName = 'AntibioticPieChartCard';

/**
 * No data placeholder
 */
const NoDataPlaceholder: FC = memo(() => (
  <div className="text-center py-8">
    <Activity size={48} className="mx-auto text-gray-400 mb-4" />
    <p className="text-gray-500">Antibiotic data loading...</p>
    <p className="text-sm text-gray-400 mt-2">
      Interactive Northwestern pie charts will display when data is available
    </p>
  </div>
));

NoDataPlaceholder.displayName = 'NoDataPlaceholder';

/**
 * Drug class distribution section
 */
interface DrugClassDistributionProps {
  drugClassDistribution: Record<string, number>;
  totalAntibiotics: number;
}

const DrugClassDistribution: FC<DrugClassDistributionProps> = memo(({
  drugClassDistribution,
  totalAntibiotics
}) => (
  <div className="border-t pt-6">
    <h4 className="text-lg font-medium text-gray-900 mb-4">Drug Class Distribution</h4>
    <div className="space-y-3">
      {Object.entries(drugClassDistribution)
        .sort(([, a], [, b]) => b - a)
        .map(([drugClass, count]) => {
          const percentage = totalAntibiotics > 0
            ? ((count / totalAntibiotics) * 100).toFixed(1)
            : '0';
          const colorClass = getDrugClassColor(drugClass);

          return (
            <div key={drugClass} className="flex items-center justify-between p-2 rounded">
              <span className="font-medium text-gray-900">{drugClass}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {count} drugs ({percentage}%)
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  </div>
));

DrugClassDistribution.displayName = 'DrugClassDistribution';

export default AntibioticAnalysisPanel;
