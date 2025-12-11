/**
 * AntibioticCard Component - Northwestern Integration Enhanced
 * Comprehensive antibiotic display card with Northwestern pie chart visualization
 * Created for Phase 2 Northwestern integration
 *
 * Created by: Agent 2.5 - Component Integration Guardian
 * Date: 2025-08-18
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  Pill,
  AlertTriangle,
  Activity,
  X,
  Shield,
  Droplets,
  Users,
  ShieldAlert,
  PieChart,
  Navigation,
  Target,
  TrendingUp
} from 'lucide-react';
import NorthwesternPieChart from './NorthwesternPieChart';
import { getAntibioticById } from '../data/EnhancedAntibioticData';
import { Antibiotic } from '../types/medical.types';

interface AntibioticCardProps {
  antibiotic?: Antibiotic | null;
  onClose?: () => void;
  showNorthwestern?: boolean;
  size?: string;
  interactive?: boolean;
  educationLevel?: 'student' | 'resident' | 'attending';
}

const AntibioticCard: React.FC<AntibioticCardProps> = ({
  antibiotic,
  onClose,
  showNorthwestern = true,
  size = 'medium',
  interactive = true,
  educationLevel = 'resident'
}) => {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Get enhanced antibiotic data with Northwestern information
  const enhancedAntibiotic = useMemo(() => {
    if (!antibiotic) return null;
    return getAntibioticById(antibiotic.id) || antibiotic;
  }, [antibiotic]);

  // Northwestern interaction handlers
  const handleSegmentHover = useCallback((segmentKey: string) => {
    setSelectedSegment(segmentKey);
  }, []);

  const handleSegmentClick = useCallback(() => {
    // Toggle detailed view for selected segment
    setShowDetailedView(prev => !prev);
  }, []);

  if (!antibiotic) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-500">
        <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Select an antibiotic to view details</p>
      </div>
    );
  }

  // Get drug class color scheme
  const getDrugClassColor = (drugClass: string): string => {
    const colors: Record<string, string> = {
      'Penicillins': 'text-blue-600 bg-blue-100 border-blue-200',
      'Cephalosporins': 'text-green-600 bg-green-100 border-green-200',
      'Glycopeptides': 'text-purple-600 bg-purple-100 border-purple-200',
      'Fluoroquinolones': 'text-orange-600 bg-orange-100 border-orange-200',
      'Macrolides': 'text-pink-600 bg-pink-100 border-pink-200',
      'Aminoglycosides': 'text-indigo-600 bg-indigo-100 border-indigo-200',
      'Lincosamides': 'text-teal-600 bg-teal-100 border-teal-200',
      'Oxazolidinones': 'text-red-600 bg-red-100 border-red-200'
    };
    return colors[drugClass] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  // Get route information with icons
  const getRouteIcon = (route: string | string[]): {
    icon: React.FC<any>;
    color: string;
    label: string;
  } => {
    let routeStr = Array.isArray(route) ? route.join(', ') : route;

    if (routeStr.toLowerCase().includes('iv') && routeStr.toLowerCase().includes('oral')) {
      return { icon: Navigation, color: 'text-purple-600', label: 'IV/Oral' };
    } else if (routeStr.toLowerCase().includes('iv')) {
      return { icon: Droplets, color: 'text-blue-600', label: 'IV' };
    } else {
      return { icon: Pill, color: 'text-red-600', label: 'Oral' };
    }
  };

  const routeInfo = getRouteIcon(antibiotic.route);
  const RouteIcon = routeInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {antibiotic.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDrugClassColor(antibiotic.class)}`}>
                {antibiotic.class}
              </span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${routeInfo.color} bg-white border`}>
                <RouteIcon size={12} />
                {routeInfo.label}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {antibiotic.description || 'Antimicrobial agent for bacterial infections'}
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close card"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Northwestern Visualization Section */}
      {showNorthwestern && enhancedAntibiotic?.northwesternSpectrum && (
        <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieChart size={18} className="text-blue-600" />
              <h4 className="font-medium text-blue-800">Northwestern Coverage</h4>
            </div>
            <button
              onClick={() => setShowDetailedView(!showDetailedView)}
              className="text-xs text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded-full"
            >
              {showDetailedView ? 'Simple' : 'Detailed'} View
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <NorthwesternPieChart
              antibiotic={enhancedAntibiotic}
              size={(size === 'small' ? 'small' : 'medium') as any}
              interactive={interactive}
              showLabels={showDetailedView}
              onSegmentHover={handleSegmentHover}
              onSegmentClick={handleSegmentClick}
              educationLevel={educationLevel}
              className="cursor-pointer"
            />
          </div>

          {selectedSegment && (
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-sm">
                <span className="font-medium text-blue-900">
                  {selectedSegment.replace('_', ' ')} Coverage:
                </span>
                <span className="ml-2">
                  {enhancedAntibiotic.northwesternSpectrum?.[selectedSegment as keyof typeof enhancedAntibiotic.northwesternSpectrum] === 0 && (
                    <span className="text-red-600 font-medium">No coverage</span>
                  )}
                  {enhancedAntibiotic.northwesternSpectrum?.[selectedSegment as keyof typeof enhancedAntibiotic.northwesternSpectrum] === 1 && (
                    <span className="text-yellow-600 font-medium">Moderate coverage</span>
                  )}
                  {enhancedAntibiotic.northwesternSpectrum?.[selectedSegment as keyof typeof enhancedAntibiotic.northwesternSpectrum] === 2 && (
                    <span className="text-green-600 font-medium">Good coverage</span>
                  )}
                </span>
              </div>

              {/* Clinical significance for the selected segment */}
              <div className="text-xs text-gray-600 mt-1">
                {selectedSegment === 'MRSA' && 'Methicillin-resistant Staph aureus - Major healthcare concern'}
                {selectedSegment === 'VRE_faecium' && 'Vancomycin-resistant Enterococcus - Challenging to treat'}
                {selectedSegment === 'anaerobes' && 'Anaerobic bacteria - Common in abdominal infections'}
                {selectedSegment === 'atypicals' && 'Atypical pathogens - Respiratory infections'}
                {selectedSegment === 'pseudomonas' && 'P. aeruginosa - Opportunistic gram-negative'}
                {selectedSegment === 'gramNegative' && 'Gram-negative bacteria - Broad category'}
                {selectedSegment === 'MSSA' && 'Methicillin-sensitive Staph aureus'}
                {selectedSegment === 'enterococcus_faecalis' && 'Enterococcus faecalis - UTIs and bacteremia'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clinical Information */}
      <div className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Mechanism of Action */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-green-600" />
              <h4 className="font-medium text-gray-800">Mechanism</h4>
            </div>
            <p className="text-sm text-gray-600">
              {antibiotic.mechanism || 'Antimicrobial activity against bacterial infections'}
            </p>
          </div>

          {/* Common Uses */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-blue-600" />
              <h4 className="font-medium text-gray-800">Common Uses</h4>
            </div>
            <div className="text-sm text-gray-600">
              {Array.isArray(antibiotic.commonUses) ? (
                <ul className="space-y-1">
                  {antibiotic.commonUses.slice(0, 3).map((use: string, index: number) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-blue-400 mt-1">•</span>
                      {use}
                    </li>
                  ))}
                  {antibiotic.commonUses.length > 3 && (
                    <li className="text-gray-500 italic">
                      +{antibiotic.commonUses.length - 3} more uses
                    </li>
                  )}
                </ul>
              ) : (
                <p>{antibiotic.commonUses || 'Various bacterial infections'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Resistance Information */}
        {antibiotic.resistance && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={16} className="text-yellow-600" />
              <h4 className="font-medium text-yellow-800">Resistance Considerations</h4>
            </div>
            <p className="text-sm text-yellow-700">{antibiotic.resistance}</p>
          </div>
        )}

        {/* Side Effects */}
        {antibiotic.sideEffects && (
          <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-orange-600" />
              <h4 className="font-medium text-orange-800">Side Effects</h4>
            </div>
            <p className="text-sm text-orange-700">{antibiotic.sideEffects}</p>
          </div>
        )}

        {/* Additional Enhanced Information */}
        {enhancedAntibiotic && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                {enhancedAntibiotic.cellWallActive && (
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-green-600" />
                    <span>Cell wall active</span>
                  </div>
                )}
                {enhancedAntibiotic.generation && (
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-blue-600" />
                    <span>Generation {enhancedAntibiotic.generation}</span>
                  </div>
                )}
              </div>

              {antibiotic.conditions && (
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-purple-600" />
                  <span>{antibiotic.conditions.length} conditions</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AntibioticCard;
