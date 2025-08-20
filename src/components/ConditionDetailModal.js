/**
 * ConditionDetailModal Component
 * Displays detailed information about a selected medical condition in a modal
 * 
 * Props:
 * - condition: object - the medical condition to display (null if modal should be closed)
 * - onClose: function - function to call when modal should be closed
 * - isBookmarked: boolean - whether this condition is bookmarked
 * - onToggleBookmark: function - function to toggle bookmark status
 */

import React, { useEffect, useMemo } from 'react';
import { X, Target, BookOpen, Clock, AlertTriangle, Brain, Star, Microscope, Pill, ArrowRight } from 'lucide-react';
import { buildIndexes } from '../utils/dataIndexer';

const ConditionDetailModal = ({ condition, onClose, isBookmarked = false, onToggleBookmark, allConditions = [] }) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (condition) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [condition, onClose]);

  // Process cross-reference data with comprehensive error handling
  const crossReferences = useMemo(() => {
    // Early return if essential data is missing
    if (!condition || !allConditions || !Array.isArray(allConditions) || allConditions.length === 0) {
      return null;
    }
    
    try {
      // Safe index building with error handling
      let indexes;
      try {
        indexes = buildIndexes(allConditions);
      } catch (indexError) {
        console.warn('Error building indexes:', indexError);
        return null;
      }

      // Validate indexes structure
      if (!indexes || !indexes.pathogenToConditions || !indexes.antibioticToConditions) {
        console.warn('Invalid indexes structure');
        return null;
      }
      
      // Safe pathogen extraction
      const currentConditionPathogens = Array.isArray(condition.commonPathogens) 
        ? condition.commonPathogens 
        : [];
      const currentConditionAntibiotics = [];
      
      // Safe antibiotic extraction from empiric therapy
      try {
        if (condition.empiricTherapy && typeof condition.empiricTherapy === 'object') {
          Object.values(condition.empiricTherapy).forEach(therapy => {
            if (typeof therapy === 'string') {
              const antibiotics = therapy.split(/\s+(?:OR|or|PLUS|plus|\+)\s+/i);
              antibiotics.forEach(antibiotic => {
                try {
                  const cleaned = antibiotic
                    .replace(/Consider surgical.*?\./i, '')
                    .replace(/Choice depends.*?\./i, '')
                    .replace(/\([^)]*\)/g, '')
                    .trim();
                  
                  if (cleaned && cleaned.length > 2 && 
                      !cleaned.match(/^(if|for|consider|add|days?|weeks?)/i)) {
                    currentConditionAntibiotics.push(cleaned);
                  }
                } catch (cleanError) {
                  console.warn('Error cleaning antibiotic name:', cleanError);
                }
              });
            }
          });
        }
      } catch (antibioticError) {
        console.warn('Error extracting antibiotics:', antibioticError);
      }
      
      // Safe pathogen relationship building
      const relatedByPathogen = new Map();
      try {
        currentConditionPathogens.forEach(pathogen => {
          if (typeof pathogen === 'string') {
            const cleanPathogen = pathogen.replace(/\[cite.*?\]/g, '').trim();
            if (cleanPathogen && indexes.pathogenToConditions && indexes.pathogenToConditions.has(cleanPathogen)) {
              const relatedConditions = indexes.pathogenToConditions.get(cleanPathogen);
              if (Array.isArray(relatedConditions)) {
                const filteredConditions = relatedConditions.filter(cond => 
                  cond && cond !== condition.name
                );
                if (filteredConditions.length > 0) {
                  relatedByPathogen.set(cleanPathogen, filteredConditions);
                }
              }
            }
          }
        });
      } catch (pathogenError) {
        console.warn('Error building pathogen relationships:', pathogenError);
      }
      
      // Safe antibiotic relationship building
      const relatedByAntibiotic = new Map();
      try {
        currentConditionAntibiotics.forEach(antibiotic => {
          if (typeof antibiotic === 'string' && indexes.antibioticToConditions && indexes.antibioticToConditions.has(antibiotic)) {
            const relatedConditions = indexes.antibioticToConditions.get(antibiotic);
            if (Array.isArray(relatedConditions)) {
              const filteredConditions = relatedConditions.filter(cond => 
                cond && cond !== condition.name
              );
              if (filteredConditions.length > 0) {
                relatedByAntibiotic.set(antibiotic, filteredConditions);
              }
            }
          }
        });
      } catch (antibioticError) {
        console.warn('Error building antibiotic relationships:', antibioticError);
      }
      
      return {
        relatedByPathogen,
        relatedByAntibiotic,
        currentPathogens: currentConditionPathogens,
        currentAntibiotics: currentConditionAntibiotics
      };
    } catch (error) {
      console.warn('Error building cross-references:', error);
      return null;
    }
  }, [condition, allConditions]);

  // Don't render if no condition is selected
  if (!condition) return null;

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 id="modal-title" className="text-2xl font-semibold">
            {condition.name}
          </h2>
          <div className="flex items-center gap-2">
            {/* Bookmark Button */}
            {onToggleBookmark && (
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200' 
                    : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
                onClick={onToggleBookmark}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Star size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            )}
            
            {/* Close Button */}
            <button 
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClose();
                }
              }}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8">
          {/* Category and Description */}
          {condition.category && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-700 mb-1">Category</div>
              <div className="text-blue-900">{condition.category}</div>
            </div>
          )}
          
          {condition.description && (
            <div className="text-gray-700 text-lg leading-relaxed">
              {condition.description}
            </div>
          )}

          {/* Common Pathogens Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Target size={20} />
              Common Pathogens
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {(condition.commonPathogens || []).map((pathogen, index) => (
                <li key={index}>{pathogen}</li>
              ))}
            </ul>
          </section>

          {/* Empiric Antibiotic Therapy Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <BookOpen size={20} />
              Empiric Antibiotic Therapy
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {condition.empiricTherapy && Object.entries(condition.empiricTherapy).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="font-semibold text-blue-700 mb-2">{key}</div>
                  <div className="text-gray-700">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Duration of Therapy Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Clock size={20} />
              Duration of Therapy
            </h3>
            <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
              {condition.duration || 'Duration not specified'}
            </p>
          </section>

          {/* Key Clinical Points Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <AlertTriangle size={20} />
              Key Clinical Points
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {(condition.keyPoints || []).map((point, index) => (
                <li key={index} className="leading-relaxed">{point}</li>
              ))}
            </ul>
          </section>

          {/* Clinical Pearls Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Brain size={20} />
              Clinical Pearls
            </h3>
            <div className="space-y-3">
              {(condition.clinicalPearls || []).map((pearl, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="font-semibold text-green-800 mb-1">
                    Pearl {index + 1}
                  </div>
                  <div className="text-green-700 leading-relaxed">{pearl}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Cross-References Section */}
          {crossReferences && (crossReferences.relatedByPathogen.size > 0 || crossReferences.relatedByAntibiotic.size > 0) && (
            <section>
              <h3 className="text-lg font-semibold mb-4">Related Conditions</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Related by Pathogen */}
                {crossReferences.relatedByPathogen.size > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-base font-medium mb-3 text-purple-700">
                      <Microscope size={16} />
                      Shared Pathogens
                    </h4>
                    <div className="space-y-3">
                      {Array.from(crossReferences.relatedByPathogen.entries()).slice(0, 3).map(([pathogen, conditions]) => (
                        <div key={pathogen} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="font-medium text-purple-800 text-sm mb-2">
                            {pathogen}
                          </div>
                          <div className="space-y-1">
                            {conditions.slice(0, 3).map((conditionName, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-purple-700">{conditionName}</span>
                                <ArrowRight size={12} className="text-purple-400" />
                              </div>
                            ))}
                            {conditions.length > 3 && (
                              <div className="text-xs text-purple-600">
                                +{conditions.length - 3} more conditions
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related by Antibiotic */}
                {crossReferences.relatedByAntibiotic.size > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-base font-medium mb-3 text-blue-700">
                      <Pill size={16} />
                      Shared Antibiotics
                    </h4>
                    <div className="space-y-3">
                      {Array.from(crossReferences.relatedByAntibiotic.entries()).slice(0, 3).map(([antibiotic, conditions]) => (
                        <div key={antibiotic} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="font-medium text-blue-800 text-sm mb-2">
                            {antibiotic}
                          </div>
                          <div className="space-y-1">
                            {conditions.slice(0, 3).map((conditionName, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-blue-700">{conditionName}</span>
                                <ArrowRight size={12} className="text-blue-400" />
                              </div>
                            ))}
                            {conditions.length > 3 && (
                              <div className="text-xs text-blue-600">
                                +{conditions.length - 3} more conditions
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <div className="text-sm text-gray-600">
                  <strong>Cross-Reference Summary:</strong>{' '}
                  {crossReferences.relatedByPathogen.size} shared pathogen(s), {crossReferences.relatedByAntibiotic.size} shared antibiotic(s)
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConditionDetailModal;