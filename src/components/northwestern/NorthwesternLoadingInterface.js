/**
 * NorthwesternLoadingInterface Component
 * Loading interface with priority indicators for Northwestern Integration
 * Extracted from OptimizedNorthwesternIntegration.js during Phase 4 refactoring
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Priority item component
 */
const PriorityItem = memo(({ component, index, isLoaded }) => (
  <div className={`priority-item ${isLoaded ? 'loaded' : 'loading'}`}>
    <span className="priority-number">P{index + 1}</span>
    <span className="component-name">{component}</span>
    {isLoaded && <span className="status-check">✓</span>}
  </div>
));

PriorityItem.displayName = 'PriorityItem';

PriorityItem.propTypes = {
  component: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isLoaded: PropTypes.bool.isRequired
};

/**
 * Progress bar component
 */
const ProgressBar = memo(({ progress }) => (
  <div className="loading-progress">
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
));

ProgressBar.displayName = 'ProgressBar';

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};

/**
 * Northwestern Loading Interface Component
 * @param {Object} props
 * @param {Set} props.loadedComponents - Set of loaded component names
 * @param {Array} props.loadingPriority - Priority-ordered component list
 * @param {boolean} props.emergencyMode - Emergency mode flag
 * @param {string} props.clinicalContext - Current clinical context
 * @param {string} props.performanceTarget - Performance target type
 */
const NorthwesternLoadingInterface = ({
  loadedComponents,
  loadingPriority,
  emergencyMode,
  clinicalContext,
  performanceTarget
}) => {
  const loadedCount = loadedComponents.size;
  const totalComponents = loadingPriority.length;
  const loadingProgress = totalComponents > 0 ? (loadedCount / totalComponents) * 100 : 0;

  return (
    <div className="northwestern-loading-interface">
      <div className="loading-header">
        <h2>Northwestern Antibiotic System</h2>
        <div className="loading-context">
          {emergencyMode ? 'Emergency Mode' : `${clinicalContext} Mode`}
        </div>
      </div>

      <ProgressBar progress={loadingProgress} />

      <div className="progress-text">
        Loading components: {loadedCount}/{totalComponents}
      </div>

      <div className="loading-priorities">
        {loadingPriority.map((component, index) => (
          <PriorityItem
            key={component}
            component={component}
            index={index}
            isLoaded={loadedComponents.has(component)}
          />
        ))}
      </div>

      <div className="loading-footer">
        <div className="clinical-context">
          Optimizing for {performanceTarget} performance
        </div>
      </div>

      <style jsx>{`
        .northwestern-loading-interface {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 40px;
        }

        .loading-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .loading-header h2 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .loading-context {
          color: #666;
          font-size: 16px;
        }

        .loading-progress {
          width: 100%;
          max-width: 400px;
          margin-bottom: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #1976d2;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-bottom: 40px;
        }

        .loading-priorities {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 40px;
          width: 100%;
          max-width: 400px;
        }

        .priority-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 4px;
          background: #f5f5f5;
          transition: background-color 0.3s;
        }

        .priority-item.loaded {
          background: #e8f5e8;
        }

        .priority-number {
          font-weight: bold;
          color: #1976d2;
          min-width: 24px;
        }

        .component-name {
          flex: 1;
          color: #333;
        }

        .status-check {
          color: #4caf50;
          font-weight: bold;
        }

        .loading-footer {
          text-align: center;
        }

        .clinical-context {
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

NorthwesternLoadingInterface.propTypes = {
  loadedComponents: PropTypes.instanceOf(Set).isRequired,
  loadingPriority: PropTypes.arrayOf(PropTypes.string).isRequired,
  emergencyMode: PropTypes.bool,
  clinicalContext: PropTypes.string,
  performanceTarget: PropTypes.string
};

NorthwesternLoadingInterface.defaultProps = {
  emergencyMode: false,
  clinicalContext: 'clinical',
  performanceTarget: 'clinical'
};

export default memo(NorthwesternLoadingInterface);
