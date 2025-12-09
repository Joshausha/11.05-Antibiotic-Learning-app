/**
 * NorthwesternFallbackInterface Component
 * Fallback interface for error recovery in Northwestern Integration
 * Extracted from OptimizedNorthwesternIntegration.js during Phase 4 refactoring
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Antibiotic item in fallback view
 */
const AntibioticItem = memo(({ antibiotic, onSelectAntibiotic }) => (
  <div
    className="antibiotic-item-fallback"
    onClick={() => onSelectAntibiotic(antibiotic)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onSelectAntibiotic(antibiotic);
      }
    }}
  >
    <div className="antibiotic-name">{antibiotic.name}</div>
    <div className="antibiotic-class">{antibiotic.class}</div>
    <div className="antibiotic-routes">
      {antibiotic.routes?.join(', ') || 'Multiple routes'}
    </div>
  </div>
));

AntibioticItem.displayName = 'AntibioticItem';

AntibioticItem.propTypes = {
  antibiotic: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onSelectAntibiotic: PropTypes.func.isRequired
};

/**
 * Northwestern Fallback Interface Component
 * @param {Object} props
 * @param {Array} props.antibiotics - List of antibiotics
 * @param {Function} props.onClinicalDecision - Clinical decision handler
 */
const NorthwesternFallbackInterface = ({ antibiotics, onClinicalDecision }) => {
  const handleSelect = (antibiotic) => {
    onClinicalDecision?.({
      type: 'antibiotic-selection',
      antibiotic
    }, { interface: 'fallback' });
  };

  return (
    <div className="northwestern-fallback-interface">
      <div className="fallback-header">
        <h2>Northwestern Antibiotic Reference</h2>
        <div className="status-indicator status-fallback">
          Simplified Mode - Core functionality available
        </div>
      </div>

      <div className="antibiotic-list-fallback">
        {antibiotics.map(antibiotic => (
          <AntibioticItem
            key={antibiotic.id}
            antibiotic={antibiotic}
            onSelectAntibiotic={handleSelect}
          />
        ))}
      </div>

      <div className="fallback-footer">
        <button
          onClick={() => window.location.reload()}
          className="recovery-button"
        >
          Restart System
        </button>
      </div>

      <style jsx>{`
        .northwestern-fallback-interface {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .fallback-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .status-fallback {
          background: #fff3cd;
          color: #856404;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 8px;
        }

        .antibiotic-list-fallback {
          display: grid;
          gap: 8px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .antibiotic-item-fallback {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .antibiotic-item-fallback:hover,
        .antibiotic-item-fallback:focus {
          background: #f5f5f5;
          outline: 2px solid #1976d2;
        }

        .antibiotic-name {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .antibiotic-class {
          color: #666;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .antibiotic-routes {
          color: #888;
          font-size: 12px;
        }

        .fallback-footer {
          text-align: center;
          margin-top: 20px;
        }

        .recovery-button {
          background: #1976d2;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .recovery-button:hover {
          background: #1565c0;
        }
      `}</style>
    </div>
  );
};

NorthwesternFallbackInterface.propTypes = {
  antibiotics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      class: PropTypes.string.isRequired,
      routes: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  onClinicalDecision: PropTypes.func
};

NorthwesternFallbackInterface.defaultProps = {
  onClinicalDecision: null
};

export default memo(NorthwesternFallbackInterface);
