/**
 * AntibioticList Component
 * Displays antibiotics for a selected pathogen with effectiveness indicators
 * Sophomore-level React component with simple functionality
 */

import React, { useMemo } from 'react';
import { 
  Pill, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Syringe,
  Dna,
  Activity,
  Zap,
  Droplets,
  Brain,
  Heart,
  Eye,
  Wind,
  Circle,
  Clock
} from 'lucide-react';
import { getAntibioticById } from '../data/SimpleAntibioticData';
import DurationIndicator from './DurationIndicator';
import { enhancedPathogenAntibioticMap } from '../data/durationMappings.ts';

const AntibioticList = ({ 
  pathogen = null, 
  antibiotics = [], 
  onSelectAntibiotic = () => {},
  selectedAntibiotic = null
}) => {
  // Get enhanced antibiotic data with duration information
  const enhancedAntibiotics = useMemo(() => {
    if (!pathogen || !antibiotics) return [];
    
    const pathogenKey = pathogen.id?.toString();
    const enhancedData = enhancedPathogenAntibioticMap[pathogenKey];
    
    if (!enhancedData) return antibiotics;
    
    // Merge original antibiotics with enhanced duration data
    return antibiotics.map(antibiotic => {
      const enhanced = enhancedData.antibiotics.find(
        enhanced => enhanced.antibioticId === antibiotic.antibioticId
      );
      
      return {
        ...antibiotic,
        duration: enhanced?.duration || null,
        durationContext: enhanced?.durationContext || null
      };
    });
  }, [pathogen, antibiotics]);

  if (!pathogen || !antibiotics || antibiotics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-500">
        <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Select a pathogen to view antibiotics</p>
      </div>
    );
  }

  // Get route administration icon
  const getRouteIcon = (route) => {
    if (!route) return <Pill className="w-3 h-3" />;
    
    if (route.includes('IV')) {
      return <Syringe className="w-3 h-3" />;
    } else if (route.includes('PO')) {
      return <Pill className="w-3 h-3" />;
    } else if (route.includes('IM')) {
      return <Droplets className="w-3 h-3" />;
    }
    return <Pill className="w-3 h-3" />;
  };

  // Get mechanism of action icon
  const getMechanismIcon = (mechanism) => {
    if (!mechanism) return <Activity className="w-3 h-3" />;
    
    if (mechanism.includes('Cell wall')) {
      return <Shield className="w-3 h-3" />;
    } else if (mechanism.includes('Protein synthesis')) {
      return <Activity className="w-3 h-3" />;
    } else if (mechanism.includes('DNA')) {
      return <Dna className="w-3 h-3" />;
    } else if (mechanism.includes('membrane')) {
      return <Zap className="w-3 h-3" />;
    } else if (mechanism.includes('Folate')) {
      return <Target className="w-3 h-3" />;
    }
    return <Activity className="w-3 h-3" />;
  };

  // Get infection type icon based on common uses
  const getInfectionIcon = (commonUses) => {
    if (!commonUses || commonUses.length === 0) return null;
    
    const usesString = commonUses.join(' ').toLowerCase();
    
    if (usesString.includes('meningitis') || usesString.includes('brain')) {
      return <Brain className="w-3 h-3 text-purple-600" />;
    } else if (usesString.includes('pneumonia') || usesString.includes('lung')) {
      return <Wind className="w-3 h-3 text-blue-600" />;
    } else if (usesString.includes('endocarditis') || usesString.includes('heart')) {
      return <Heart className="w-3 h-3 text-red-600" />;
    } else if (usesString.includes('uti') || usesString.includes('kidney')) {
      return <Circle className="w-3 h-3 text-yellow-600" />;
    } else if (usesString.includes('eye') || usesString.includes('conjunctiv')) {
      return <Eye className="w-3 h-3 text-green-600" />;
    }
    return null;
  };

  // Get effectiveness color and icon with enhanced shield-based indicators
  const getEffectivenessDisplay = (effectiveness) => {
    switch (effectiveness) {
      case 'high':
        return {
          color: 'text-green-600 bg-green-100 border-green-200',
          icon: (
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <CheckCircle className="w-3 h-3" />
            </div>
          ),
          label: 'High Effectiveness',
          simpleIcon: <ShieldCheck className="w-4 h-4" />
        };
      case 'medium':
        return {
          color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
          icon: (
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <AlertCircle className="w-3 h-3" />
            </div>
          ),
          label: 'Medium Effectiveness',
          simpleIcon: <Shield className="w-4 h-4" />
        };
      case 'low':
        return {
          color: 'text-orange-600 bg-orange-100 border-orange-200',
          icon: (
            <div className="flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" />
              <AlertCircle className="w-3 h-3" />
            </div>
          ),
          label: 'Low Effectiveness',
          simpleIcon: <ShieldAlert className="w-4 h-4" />
        };
      case 'resistant':
        return {
          color: 'text-red-600 bg-red-100 border-red-200',
          icon: (
            <div className="flex items-center gap-1">
              <ShieldOff className="w-4 h-4" />
              <XCircle className="w-3 h-3" />
            </div>
          ),
          label: 'Resistant',
          simpleIcon: <ShieldOff className="w-4 h-4" />
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100 border-gray-200',
          icon: <Shield className="w-4 h-4" />,
          label: 'Unknown',
          simpleIcon: <Shield className="w-4 h-4" />
        };
    }
  };

  // Group antibiotics by effectiveness
  const groupedAntibiotics = enhancedAntibiotics.reduce((groups, antibiotic) => {
    const effectiveness = antibiotic.effectiveness;
    if (!groups[effectiveness]) {
      groups[effectiveness] = [];
    }
    groups[effectiveness].push(antibiotic);
    return groups;
  }, {});

  // Order groups by effectiveness
  const effectivenessOrder = ['high', 'medium', 'low', 'resistant'];
  const orderedGroups = effectivenessOrder.filter(key => groupedAntibiotics[key]);

  return (
    <div className="bg-white rounded-lg shadow-sm border" data-testid="antibiotic-list">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Pill className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Antibiotics for {pathogen.commonName}
            </h2>
            <p className="text-sm text-gray-600">
              {enhancedAntibiotics.length} treatment option{enhancedAntibiotics.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Effectiveness Legend with Enhanced Icons */}
        <div className="flex flex-wrap gap-3 text-xs mb-2">
          <div className="flex items-center gap-1 text-green-600">
            <ShieldCheck className="w-3 h-3" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Shield className="w-3 h-3" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1 text-orange-600">
            <ShieldAlert className="w-3 h-3" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <ShieldOff className="w-3 h-3" />
            <span>Resistant</span>
          </div>
        </div>
        
        {/* Duration Legend */}
        <div className="flex flex-wrap gap-3 text-xs border-t pt-2">
          <div className="flex items-center gap-1 text-green-600">
            <Clock className="w-3 h-3" />
            <span>Short (1-7 days)</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Activity className="w-3 h-3" />
            <span>Standard (1-3 weeks)</span>
          </div>
          <div className="flex items-center gap-1 text-orange-600">
            <AlertCircle className="w-3 h-3" />
            <span>Extended (3+ weeks)</span>
          </div>
        </div>
      </div>

      {/* Antibiotic Groups */}
      <div className="max-h-96 overflow-y-auto">
        {orderedGroups.map((effectiveness) => {
          const display = getEffectivenessDisplay(effectiveness);
          const groupAntibiotics = groupedAntibiotics[effectiveness];

          return (
            <div key={effectiveness} className="border-b last:border-b-0">
              {/* Group Header */}
              <div className="p-3 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${display.color}`}>
                    {display.icon}
                    {display.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {groupAntibiotics.length} antibiotic{groupAntibiotics.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Antibiotics in Group */}
              <div className="space-y-1 p-2">
                {groupAntibiotics.map((antibiotic, index) => (
                  <div
                    key={`${antibiotic.antibioticId}-${index}`}
                    data-testid={`antibiotic-${index}`}
                    onClick={() => onSelectAntibiotic && onSelectAntibiotic(antibiotic)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedAntibiotic?.antibioticId === antibiotic.antibioticId
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {antibiotic.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${display.color}`}>
                            {display.simpleIcon}
                          </span>
                          {antibiotic.duration && (
                            <DurationIndicator 
                              duration={antibiotic.duration}
                              size="xs"
                              variant="badge"
                              showTooltip={true}
                            />
                          )}
                          {(() => {
                            const fullAntibiotic = getAntibioticById(antibiotic.antibioticId);
                            const infectionIcon = fullAntibiotic ? getInfectionIcon(fullAntibiotic.commonUses) : null;
                            return infectionIcon ? (
                              <span className="flex items-center gap-1">
                                {infectionIcon}
                              </span>
                            ) : null;
                          })()}
                        </div>
                        
                        {antibiotic.notes && (
                          <p className="text-xs text-gray-600 mb-2">
                            {antibiotic.notes}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Effectiveness: {effectiveness}</span>
                          {antibiotic.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{antibiotic.duration}</span>
                            </span>
                          )}
                          {(() => {
                            const fullAntibiotic = getAntibioticById(antibiotic.antibioticId);
                            return fullAntibiotic ? (
                              <>
                                <span className="flex items-center gap-1">
                                  {getRouteIcon(fullAntibiotic.route)}
                                  <span>{fullAntibiotic.route}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  {getMechanismIcon(fullAntibiotic.mechanism)}
                                  <span>{fullAntibiotic.mechanism?.split(' ')[0]}</span>
                                </span>
                              </>
                            ) : (
                              <span>ID: #{antibiotic.antibioticId}</span>
                            );
                          })()}
                        </div>
                        
                        {/* Duration Context Information */}
                        {antibiotic.durationContext && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                            <div className="flex items-center gap-1 text-blue-800 font-medium mb-1">
                              <Clock className="w-3 h-3" />
                              <span>Clinical Context</span>
                            </div>
                            <p className="text-blue-700">
                              <span className="font-medium">{antibiotic.durationContext.conditionName}:</span> {antibiotic.duration}
                            </p>
                            {antibiotic.durationContext.severity && (
                              <p className="text-blue-600 mt-1">
                                Severity: <span className="capitalize">{antibiotic.durationContext.severity}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedAntibiotic?.antibioticId === antibiotic.antibioticId && (
                        <div className="text-blue-600 flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <CheckCircle className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            Total: {enhancedAntibiotics.length} antibiotic{enhancedAntibiotics.length !== 1 ? 's' : ''}
          </span>
          <span>
            Effective: {enhancedAntibiotics.filter(ab => ab.effectiveness === 'high' || ab.effectiveness === 'medium').length}
          </span>
          <span>
            With Duration: {enhancedAntibiotics.filter(ab => ab.duration).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AntibioticList;