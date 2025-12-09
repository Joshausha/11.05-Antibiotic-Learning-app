/**
 * OverviewDashboard Component
 * Displays high-level statistics and key metrics for the visualization tab
 * Extracted from VisualizationsTab.js during Phase 4 refactoring
 */

import React, { memo } from 'react';
import {
  Target,
  Microscope,
  Activity,
  TrendingUp,
  PieChart
} from 'lucide-react';

/**
 * Overview Dashboard displaying key metrics and quick insights
 * @param {Object} props
 * @param {Object} props.overviewStats - Statistics object with counts
 * @param {Object} props.categoryDistribution - Category distribution object
 */
const OverviewDashboard = ({ overviewStats, categoryDistribution }) => {
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
};

/**
 * Individual metric card component
 */
const MetricCard = memo(({ icon: Icon, iconColor, value, label }) => (
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
const GramStatusCard = memo(({ gramPositive, gramNegative, totalPathogens }) => (
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
const GramStatusBar = memo(({ label, count, total, colorClass }) => {
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
const TopCategoriesCard = memo(({ categoryDistribution }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <PieChart size={20} className="text-blue-600" />
      Top Categories
    </h3>
    <div className="space-y-2">
      {Object.entries(categoryDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => (
          <div key={category} className="flex items-center justify-between">
            <span className="text-gray-700 text-sm">{category}</span>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {count}
            </span>
          </div>
        ))}
    </div>
  </div>
));

TopCategoriesCard.displayName = 'TopCategoriesCard';

export default memo(OverviewDashboard);
