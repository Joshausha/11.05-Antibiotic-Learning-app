/**
 * PathogenList Component
 * Simple list component for displaying pathogens
 * Sophomore-level React component with basic functionality
 */

import React from 'react';
import {
  Search,
  Filter,
  Microscope,
  AlertTriangle,
  Stethoscope,
  Plus,
  Minus,
  Brain,
  Heart,
  Wind,
  Circle,
  Eye,
  Droplets,
  Bone,
  Users,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Pathogen } from '../types/medical.types';

interface PathogenListProps {
  pathogens?: Pathogen[];
  onSelectPathogen?: (pathogen: Pathogen) => void;
  selectedPathogen?: Pathogen | null;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  gramFilter?: string;
  onGramFilter?: (filter: string) => void;
  severityFilter?: string;
  onSeverityFilter?: (filter: string) => void;
  durationFilter?: string;
  onDurationFilter?: (filter: string) => void;
}

const PathogenList: React.FC<PathogenListProps> = ({
  pathogens = [],
  onSelectPathogen = () => {},
  selectedPathogen = null,
  searchTerm = '',
  onSearch = () => {},
  gramFilter = 'all',
  onGramFilter = () => {},
  severityFilter = 'all',
  onSeverityFilter = () => {},
  durationFilter = 'all',
  onDurationFilter = () => {}
}) => {
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  // Handle gram filter change
  const handleGramFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onGramFilter(event.target.value);
  };

  // Handle severity filter change
  const handleSeverityFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSeverityFilter(event.target.value);
  };

  // Handle duration filter change
  const handleDurationFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onDurationFilter(event.target.value);
  };

  // Get display color for gram status
  const getGramColor = (gramStatus: string): string => {
    switch (gramStatus) {
      case 'positive':
        return 'text-purple-600 bg-purple-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get display color for severity
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get infection site icons based on common infection sites
  const getInfectionSiteIcons = (commonSites?: string[]): Array<{
    icon: React.ReactNode;
    label: string;
  }> => {
    if (!commonSites || commonSites.length === 0) return [];

    const iconMap: Array<{ icon: React.ReactNode; label: string }> = [];
    const sitesString = commonSites.join(' ').toLowerCase();

    // Central nervous system infections
    if (sitesString.includes('brain') || sitesString.includes('csf') || sitesString.includes('meninges')) {
      iconMap.push({ icon: <Brain className="w-3 h-3 text-purple-600" />, label: "CNS" });
    }

    // Cardiovascular infections
    if (sitesString.includes('blood') || sitesString.includes('endocarditis') || sitesString.includes('heart')) {
      iconMap.push({ icon: <Heart className="w-3 h-3 text-red-600" />, label: "Cardiovascular" });
    }

    // Respiratory infections
    if (sitesString.includes('lungs') || sitesString.includes('pneumonia') || sitesString.includes('respiratory')) {
      iconMap.push({ icon: <Wind className="w-3 h-3 text-blue-600" />, label: "Respiratory" });
    }

    // Genitourinary infections
    if (sitesString.includes('urinary') || sitesString.includes('kidney') || sitesString.includes('bladder') || sitesString.includes('uti')) {
      iconMap.push({ icon: <Circle className="w-3 h-3 text-yellow-600" />, label: "Genitourinary" });
    }

    // Skin and soft tissue
    if (sitesString.includes('skin') || sitesString.includes('soft tissue') || sitesString.includes('wound')) {
      iconMap.push({ icon: <Droplets className="w-3 h-3 text-green-600" />, label: "Skin/Soft tissue" });
    }

    // Bone and joint
    if (sitesString.includes('bone') || sitesString.includes('joint') || sitesString.includes('osteomyelitis')) {
      iconMap.push({ icon: <Bone className="w-3 h-3 text-orange-600" />, label: "Bone/Joint" });
    }

    // Gastrointestinal
    if (sitesString.includes('intestines') || sitesString.includes('gi') || sitesString.includes('abdominal')) {
      iconMap.push({ icon: <Users className="w-3 h-3 text-indigo-600" />, label: "GI tract" });
    }

    // Ophthalmic
    if (sitesString.includes('eye') || sitesString.includes('conjunctiv') || sitesString.includes('ophthalm')) {
      iconMap.push({ icon: <Eye className="w-3 h-3 text-teal-600" />, label: "Ophthalmic" });
    }

    // Return up to 3 most relevant icons
    return iconMap.slice(0, 3);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Microscope className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Pathogens ({pathogens.length})
          </h2>
        </div>

        {/* Enhanced Search with Medical Icons */}
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Search className="text-gray-400 w-4 h-4" />
            <Stethoscope className="text-blue-500 w-3 h-3" />
          </div>
          <input
            type="text"
            placeholder="Search pathogens..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Enhanced Filters with Medical Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Filter className="w-4 h-4 text-gray-500" />
              <Microscope className="w-3 h-3 text-purple-500" />
            </div>
            <select
              value={gramFilter}
              onChange={handleGramFilterChange}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Gram Status</option>
              <option value="positive">Gram Positive</option>
              <option value="negative">Gram Negative</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Filter className="w-4 h-4 text-gray-500" />
              <AlertTriangle className="w-3 h-3 text-red-500" />
            </div>
            <select
              value={severityFilter}
              onChange={handleSeverityFilterChange}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="low">Low Severity</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Filter className="w-4 h-4 text-gray-500" />
              <Clock className="w-3 h-3 text-orange-500" />
            </div>
            <select
              value={durationFilter}
              onChange={handleDurationFilterChange}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Durations</option>
              <option value="short">Short (1-7 days)</option>
              <option value="medium">Standard (1-3 weeks)</option>
              <option value="long">Extended (3+ weeks)</option>
              <option value="complex">Complex (Age/Condition)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pathogen List */}
      <div className="max-h-96 overflow-y-auto">
        {pathogens.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Microscope className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No pathogens found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {pathogens.map((pathogen) => (
              <div
                key={pathogen.id}
                role="button"
                tabIndex={0}
                data-testid={`pathogen-${pathogen.id}`}
                onClick={() => onSelectPathogen(pathogen)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPathogen(pathogen);
                  }
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedPathogen?.id === pathogen.id
                    ? 'bg-blue-50 border-2 border-blue-200 selected'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {pathogen.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getGramColor(pathogen.gramStatus)}`}>
                        {pathogen.gramStatus === 'positive' ? (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Gram +</span>
                          </>
                        ) : (
                          <>
                            <Minus className="w-3 h-3" />
                            <span>Gram -</span>
                          </>
                        )}
                      </span>

                      {/* Infection Site Icons */}
                      {(() => {
                        const siteIcons = getInfectionSiteIcons(pathogen.commonSites);
                        return siteIcons.length > 0 ? (
                          <div className="flex items-center gap-1 ml-1">
                            {siteIcons.map((site, index) => (
                              <div
                                key={index}
                                className="flex items-center"
                                title={site.label}
                              >
                                {site.icon}
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })()}
                    </div>

                    <p className="text-xs text-gray-600 mb-2">
                      {pathogen.commonName}
                    </p>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {pathogen.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">Shape:</span>
                      <span className="text-xs text-gray-600">{pathogen.shape}</span>

                      <span className="text-xs text-gray-400">Severity:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(pathogen.severity)}`}>
                        {pathogen.severity}
                      </span>

                      {/* Resistance Warning Indicator */}
                      {pathogen.resistance && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 flex items-center gap-1" title={`Resistance: ${pathogen.resistance}`}>
                          <ShieldAlert className="w-3 h-3" />
                          <span>Resistant</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedPathogen?.id === pathogen.id && (
                    <div className="text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with count */}
      {pathogens.length > 0 && (
        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
          Showing {pathogens.length} pathogen{pathogens.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default PathogenList;
