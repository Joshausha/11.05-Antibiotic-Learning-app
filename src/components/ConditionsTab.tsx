/**
 * ConditionsTab Component
 * Displays searchable list of medical conditions
 *
 * Props:
 * - filteredConditions: array - conditions filtered by search term
 * - setSelectedCondition: function - function to select a condition for the modal
 * - searchTerm: string - current search term
 * - setSearchTerm: function - function to update search term
 */

import React, { memo, useState, useEffect, ReactNode } from 'react';
import {
  Search,
  Brain,
  Heart,
  Wind,
  Circle,
  Eye,
  Droplets,
  Bone,
  Users,
  Stethoscope,
  Baby,
  Ear
} from 'lucide-react';
import SkeletonLoader, { ConditionCardSkeleton } from './SkeletonLoader';
import ErrorMessage from './ErrorMessage';

interface MedicalCondition {
  id: string;
  name: string;
  category: string;
  commonPathogens?: string[];
  [key: string]: unknown;
}

interface CategoryIcon {
  icon: ReactNode;
  color: string;
}

interface ConditionsTabProps {
  filteredConditions?: MedicalCondition[] | null;
  setSelectedCondition?: (condition: MedicalCondition) => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const ConditionsTab: React.FC<ConditionsTabProps> = ({
  filteredConditions = null,
  setSelectedCondition = () => {},
  searchTerm = '',
  setSearchTerm = () => {}
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get medical category icon with enhanced context
  const getCategoryIcon = (category?: string): CategoryIcon => {
    // Handle undefined or null category gracefully
    if (!category || typeof category !== 'string') {
      return { icon: <Circle className="w-5 h-5 text-gray-500" />, color: "gray" };
    }

    const categoryString = category.toLowerCase();

    // Central Nervous System
    if (categoryString.includes('central nervous') || categoryString.includes('cns') || categoryString.includes('brain')) {
      return { icon: <Brain className="w-5 h-5 text-purple-600" />, color: "purple" };
    }

    // Bloodstream/Cardiovascular
    if (categoryString.includes('bloodstream') || categoryString.includes('cardiovascular') || categoryString.includes('heart')) {
      return { icon: <Heart className="w-5 h-5 text-red-600" />, color: "red" };
    }

    // Respiratory
    if (categoryString.includes('respiratory') || categoryString.includes('pneumonia') || categoryString.includes('lung')) {
      return { icon: <Wind className="w-5 h-5 text-blue-600" />, color: "blue" };
    }

    // Genitourinary
    if (categoryString.includes('genitourinary') || categoryString.includes('urinary') || categoryString.includes('kidney')) {
      return { icon: <Circle className="w-5 h-5 text-yellow-600" />, color: "yellow" };
    }

    // Ophthalmologic
    if (categoryString.includes('ophthalmologic') || categoryString.includes('eye') || categoryString.includes('ophthalm')) {
      return { icon: <Eye className="w-5 h-5 text-teal-600" />, color: "teal" };
    }

    // Skin and Soft Tissue
    if (categoryString.includes('skin') || categoryString.includes('soft tissue') || categoryString.includes('wound')) {
      return { icon: <Droplets className="w-5 h-5 text-green-600" />, color: "green" };
    }

    // Bone/Joint
    if (categoryString.includes('bone') || categoryString.includes('joint') || categoryString.includes('osteomyelitis')) {
      return { icon: <Bone className="w-5 h-5 text-orange-600" />, color: "orange" };
    }

    // Intra-abdominal/GI
    if (categoryString.includes('intra-abdominal') || categoryString.includes('abdominal') || categoryString.includes('gi')) {
      return { icon: <Users className="w-5 h-5 text-indigo-600" />, color: "indigo" };
    }

    // Neonatal
    if (categoryString.includes('neonatal') || categoryString.includes('neonate') || categoryString.includes('newborn')) {
      return { icon: <Baby className="w-5 h-5 text-pink-600" />, color: "pink" };
    }

    // Ear, Nose, Throat
    if (categoryString.includes('ear') || categoryString.includes('nose') || categoryString.includes('throat') || categoryString.includes('ent')) {
      return { icon: <Ear className="w-5 h-5 text-amber-600" />, color: "amber" };
    }

    // Default medical icon
    return { icon: <Stethoscope className="w-5 h-5 text-gray-600" />, color: "gray" };
  };

  // Simulate loading when conditions change
  useEffect(() => {
    // Set loading to false when we have data (array) or explicitly no data (null/undefined)
    if (filteredConditions !== undefined && filteredConditions !== null) {
      setIsLoading(false);
    } else if (filteredConditions === undefined) {
      // Handle undefined case - should show no results, not loading
      setIsLoading(false);
    }
  }, [filteredConditions]);

  // Get color class based on category color
  const getCategoryColorClass = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      purple: 'bg-purple-100 text-purple-700',
      red: 'bg-red-100 text-red-700',
      blue: 'bg-blue-100 text-blue-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      teal: 'bg-teal-100 text-teal-700',
      green: 'bg-green-100 text-green-700',
      orange: 'bg-orange-100 text-orange-700',
      indigo: 'bg-indigo-100 text-indigo-700',
      pink: 'bg-pink-100 text-pink-700',
      amber: 'bg-amber-100 text-amber-700',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-700';
  };

  // Show loading state
  if (isLoading) {
    return (
      <div>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conditions, pathogens, or treatments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full pl-10 pr-4 py-3 text-lg"
            aria-label="Search medical conditions"
            tabIndex={0}
          />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ConditionCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <ErrorMessage
        title="Unable to load conditions"
        message={error}
        onRetry={() => {
          setError(null);
          setIsLoading(true);
        }}
      />
    );
  }

  const handleConditionSelect = (condition: MedicalCondition): void => {
    try {
      setSelectedCondition(condition);
    } catch (err) {
      console.error('Error selecting condition:', err);
      // Provide user feedback for network/API errors
      alert('Unable to load condition details. Please try again.');
    }
  };

  const handleConditionKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, condition: MedicalCondition): void => {
    try {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setSelectedCondition(condition);
      }
    } catch (err) {
      console.error('Error selecting condition via keyboard:', err);
      alert('Unable to load condition details. Please try again.');
    }
  };

  const conditions = filteredConditions || [];
  const categoryIcon = (condition: MedicalCondition) => getCategoryIcon(condition.category);

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search conditions, pathogens, or treatments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full pl-10 pr-4 py-3 text-lg"
          aria-label="Search medical conditions"
          tabIndex={0}
        />
      </div>

      {/* Conditions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {conditions.map((condition) => {
          const icon = categoryIcon(condition);
          return (
            <div
              key={condition.id}
              className="bg-white rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
              onClick={() => handleConditionSelect(condition)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleConditionKeyDown(e, condition)}
              aria-label={`View details for ${condition.name}`}
            >
              {/* Category Header with Medical Icon */}
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {icon.icon}
                </div>
                <div className={`px-3 py-1 text-xs font-semibold rounded-full flex-1 ${getCategoryColorClass(icon.color)}`}>
                  {condition.category}
                </div>
              </div>

              {/* Condition Name */}
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {condition.name}
              </h3>

              {/* Common Pathogens Preview */}
              <div className="text-sm text-gray-600">
                <strong>Common Pathogens:</strong><br />
                {(condition.commonPathogens || []).slice(0, 3).join(', ')}
                {(condition.commonPathogens || []).length > 3 && '...'}
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {conditions.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search size={48} className="mx-auto mb-4" />
          <p>No conditions found matching your search.</p>
          <p className="text-sm mt-2">Try searching for a different term or browse all conditions.</p>
        </div>
      )}
    </div>
  );
};

export default memo(ConditionsTab);
