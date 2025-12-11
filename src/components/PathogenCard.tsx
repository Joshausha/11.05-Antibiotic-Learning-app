/**
 * PathogenCard Component
 * Basic pathogen display card
 * Sophomore-level React component showing pathogen details
 */

import React, { useMemo } from 'react';
import {
  Microscope,
  MapPin,
  AlertTriangle,
  Info,
  Skull,
  Activity,
  Plus,
  Minus,
  X,
  Brain,
  Heart,
  Wind,
  Circle,
  Eye,
  Droplets,
  Bone,
  Users,
  Clock,
  ShieldAlert,
  ShieldOff
} from 'lucide-react';
import { DurationSummary } from './DurationIndicator';
import { getPathogenDurationInfo } from '../data/durationMappings';
import { Pathogen } from '../types/medical.types';

interface PathogenCardProps {
  pathogen?: Pathogen | null;
  onClose?: () => void;
}

const PathogenCard: React.FC<PathogenCardProps> = ({ pathogen = null, onClose = () => {} }) => {
  // Get duration information for this pathogen
  const pathogenDurationInfo = useMemo(() => {
    if (!pathogen) return null;
    return getPathogenDurationInfo(pathogen.id);
  }, [pathogen]);

  if (!pathogen) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-500">
        <Microscope className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Select a pathogen to view details</p>
      </div>
    );
  }

  // Get display color for gram status
  const getGramColor = (gramStatus: string): string => {
    switch (gramStatus) {
      case 'positive':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'negative':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Get Gram status icon
  const getGramIcon = (gramStatus: string): React.ReactNode => {
    switch (gramStatus) {
      case 'positive':
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white">
            <Plus className="w-3 h-3" />
          </div>
        );
      case 'negative':
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white">
            <Minus className="w-3 h-3" />
          </div>
        );
      default:
        return null;
    }
  };

  // Get display color for severity
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Get severity icon with enhanced medical indicators
  const getSeverityIcon = (severity: string): React.ReactNode => {
    switch (severity) {
      case 'high':
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            <Skull className="w-3 h-3" />
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            <Activity className="w-3 h-3" />
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-1">
            <Info className="w-4 h-4" />
            <Plus className="w-3 h-3" />
          </div>
        );
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Get infection site icon with enhanced medical context
  const getInfectionSiteIcon = (site: string): React.ReactNode => {
    const siteString = site.toLowerCase();

    // Central nervous system
    if (siteString.includes('brain') || siteString.includes('csf') || siteString.includes('meninges')) {
      return <Brain className="w-4 h-4 text-purple-600" />;
    }

    // Cardiovascular system
    if (siteString.includes('blood') || siteString.includes('heart') || siteString.includes('endocarditis')) {
      return <Heart className="w-4 h-4 text-red-600" />;
    }

    // Respiratory system
    if (siteString.includes('lungs') || siteString.includes('pneumonia') || siteString.includes('respiratory')) {
      return <Wind className="w-4 h-4 text-blue-600" />;
    }

    // Genitourinary system
    if (siteString.includes('urinary') || siteString.includes('kidney') || siteString.includes('bladder')) {
      return <Circle className="w-4 h-4 text-yellow-600" />;
    }

    // Skin and soft tissue
    if (siteString.includes('skin') || siteString.includes('soft tissue') || siteString.includes('wound')) {
      return <Droplets className="w-4 h-4 text-green-600" />;
    }

    // Bone and joint
    if (siteString.includes('bone') || siteString.includes('joint') || siteString.includes('osteomyelitis')) {
      return <Bone className="w-4 h-4 text-orange-600" />;
    }

    // Gastrointestinal
    if (siteString.includes('intestines') || siteString.includes('gi') || siteString.includes('abdominal')) {
      return <Users className="w-4 h-4 text-indigo-600" />;
    }

    // Ophthalmic
    if (siteString.includes('eye') || siteString.includes('conjunctiv') || siteString.includes('ophthalm')) {
      return <Eye className="w-4 h-4 text-teal-600" />;
    }

    // Default medical site icon
    return <MapPin className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border" data-testid="pathogen-card">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Microscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {pathogen.name}
              </h2>
              <p className="text-sm text-gray-600">
                {pathogen.commonName}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close pathogen details"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex gap-2 mt-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getGramColor(pathogen.gramStatus)}`}>
            {getGramIcon(pathogen.gramStatus)}
            {pathogen.gramStatus === 'positive' ? 'Gram Positive' : 'Gram Negative'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getSeverityColor(pathogen.severity)}`}>
            {getSeverityIcon(pathogen.severity)}
            {pathogen.severity} severity
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium border text-blue-600 bg-blue-100 border-blue-200">
            {pathogen.shape}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {pathogen.description}
          </p>
        </div>

        {/* Common Sites with Enhanced Medical Icons */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Common Infection Sites
          </h3>
          <div className="flex flex-wrap gap-2">
            {pathogen.commonSites?.map((site: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center gap-1 hover:bg-gray-200 transition-colors"
              >
                {getInfectionSiteIcon(site)}
                <span>{site}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Enhanced Resistance Information with Shield and Alert Icons */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <ShieldAlert className="w-4 h-4 text-orange-600" />
            Resistance Pattern
          </h3>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-3 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldOff className="w-5 h-5 text-red-600" />
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full border border-red-200">
                    ⚠️ RESISTANCE ALERT
                  </span>
                  <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full border border-orange-200">
                    Clinical Awareness Required
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {pathogen.resistance}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-red-700">
                  <Skull className="w-3 h-3" />
                  <span className="font-medium">Always verify susceptibility before treatment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Duration Information */}
        {pathogenDurationInfo && pathogenDurationInfo.durations && pathogenDurationInfo.durations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Treatment Durations
            </h3>
            <DurationSummary
              durations={pathogenDurationInfo.durations}
              title={`Duration Guidelines for ${pathogen.commonName}`}
              className="border border-blue-200"
            />
            {pathogenDurationInfo.hasMultipleDurations && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <p className="text-blue-700">
                  <strong>Note:</strong> Treatment duration varies by clinical condition and severity.
                  Multiple guidelines available based on infection site and patient factors.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Basic Properties */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <span className="text-xs text-gray-500">Gram Status</span>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {pathogen.gramStatus}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Shape</span>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {pathogen.shape}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Severity</span>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {pathogen.severity}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Pathogen ID</span>
            <p className="text-sm font-medium text-gray-900">
              #{pathogen.id}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg">
        <p className="text-xs text-gray-500 text-center">
          Clinical information for educational purposes only
        </p>
      </div>
    </div>
  );
};

export default PathogenCard;
