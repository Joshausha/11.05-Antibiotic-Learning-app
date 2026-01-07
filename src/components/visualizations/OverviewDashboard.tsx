/**
 * OverviewDashboard Component
 * Displays high-level statistics and key metrics for the visualization tab
 * Extracted from VisualizationsTab.tsx during Phase 4 refactoring
 */

import React, { memo, FC } from 'react';
import {
  Target,
  Microscope,
  Activity,
  TrendingUp,
  PieChart
} from 'lucide-react';

interface OverviewDashboardProps {
  overviewStats?: {
    totalConditions: number;
    totalPathogens: number;
    totalAntibiotics: number;
    gramPositive: number;
    gramNegative: number;
    [key: string]: any;
  };
  categoryDistribution?: Record<string, number>;
}

const OverviewDashboard: FC<OverviewDashboardProps> = memo(({
  overviewStats = {
    totalConditions: 0,
    totalPathogens: 0,
    totalAntibiotics: 0,
    gramPositive: 0,
    gramNegative: 0
  },
  categoryDistribution = {}
}) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Target}
          iconColor="text-blue-600"
          value={overviewStats.totalConditions}
          label="Medical Conditions"
        />

        <MetricCard
          icon={Microscope}
          iconColor="text-green-600"
          value={overviewStats.totalPathogens}
          label="Pathogens"
        />

        <MetricCard
          icon={Activity}
          iconColor="text-purple-600"
          value={overviewStats.totalAntibiotics}
          label="Antibiotics"
        />

        <MetricCard
          icon={TrendingUp}
          iconColor="text-orange-600"
          value={Object.keys(categoryDistribution).length}
          label="Categories"
        />
      </div>

      {/* Quick Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <GramStatusCard
          gramPositive={overviewStats.gramPositive}
          gramNegative={overviewStats.gramNegative}
          totalPathogens={overviewStats.totalPathogens}
        />

        <TopCategoriesCard categoryDistribution={categoryDistribution} />
      </div>
    </div>
  );
});

OverviewDashboard.displayName = 'OverviewDashboard';

/**
 * Individual metric card component
 */
interface MetricCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  value: number;
  label: string;
}

const MetricCard: FC<MetricCardProps> = memo(({ icon: Icon, iconColor, value, label }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <div className="flex items-center gap-3">
      <Icon className={iconColor} size={24} />
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  </div>
));

MetricCard.displayName = 'MetricCard';

/**
 * Gram status distribution card
 */
interface GramStatusCardProps {
  gramPositive: number;
  gramNegative: number;
  totalPathogens: number;
}

const GramStatusCard: FC<GramStatusCardProps> = memo(({
  gramPositive,
  gramNegative,
  totalPathogens
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Microscope size={20} className="text-green-600" />
      Gram Status Distribution
    </h3>
    <div className="space-y-3">
      <GramStatusBar
        label="Gram-Positive"
        count={gramPositive}
        total={totalPathogens}
        colorClass="bg-green-500"
      />
      <GramStatusBar
        label="Gram-Negative"
        count={gramNegative}
        total={totalPathogens}
        colorClass="bg-red-500"
      />
    </div>
  </div>
));

GramStatusCard.displayName = 'GramStatusCard';

/**
 * Individual gram status progress bar
 */
interface GramStatusBarProps {
  label: string;
  count: number;
  total: number;
  colorClass: string;
}

const GramStatusBar: FC<GramStatusBarProps> = memo(({
  label,
  count,
  total,
  colorClass
}) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div
            className={`${colorClass} h-2 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium">{count}</span>
      </div>
    </div>
  );
});

GramStatusBar.displayName = 'GramStatusBar';

/**
 * Top categories card
 */
interface TopCategoriesCardProps {
  categoryDistribution: Record<string, number>;
}

const TopCategoriesCard: FC<TopCategoriesCardProps> = memo(({ categoryDistribution }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <PieChart size={20} className="text-blue-600" />
      Top Categories
    </h3>
    <div className="space-y-2">
      {Object.entries(categoryDistribution)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([category, count]) => (
          <div key={category} className="flex items-center justify-between">
            <span className="text-gray-700 text-sm">{category}</span>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {count as number}
            </span>
          </div>
        ))}
    </div>
  </div>
));

TopCategoriesCard.displayName = 'TopCategoriesCard';

export default OverviewDashboard;
