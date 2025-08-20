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

import React, { memo, useState, useEffect } from 'react';
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

const ConditionsTab = ({ 
  filteredConditions, 
  setSelectedCondition, 
  searchTerm, 
  setSearchTerm 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get medical category icon with enhanced context
  const getCategoryIcon = (category) => {
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
    if (filteredConditions) {
      setIsLoading(false);
    }
  }, [filteredConditions]);

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
        showRetry={true}
      />
    );
  }
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
        />
      </div>

      {/* Conditions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(filteredConditions || []).map((condition) => (
          <div
            key={condition.id}
            className="bg-white rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
            onClick={() => setSelectedCondition(condition)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedCondition(condition);
              }
            }}
            aria-label={`View details for ${condition.name}`}
          >
            {/* Category Header with Medical Icon */}
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                {getCategoryIcon(condition.category).icon}
              </div>
              <div className={`px-3 py-1 text-xs font-semibold rounded-full flex-1 ${
                getCategoryIcon(condition.category).color === 'purple' ? 'bg-purple-100 text-purple-700' :
                getCategoryIcon(condition.category).color === 'red' ? 'bg-red-100 text-red-700' :
                getCategoryIcon(condition.category).color === 'blue' ? 'bg-blue-100 text-blue-700' :
                getCategoryIcon(condition.category).color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                getCategoryIcon(condition.category).color === 'teal' ? 'bg-teal-100 text-teal-700' :
                getCategoryIcon(condition.category).color === 'green' ? 'bg-green-100 text-green-700' :
                getCategoryIcon(condition.category).color === 'orange' ? 'bg-orange-100 text-orange-700' :
                getCategoryIcon(condition.category).color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                getCategoryIcon(condition.category).color === 'pink' ? 'bg-pink-100 text-pink-700' :
                getCategoryIcon(condition.category).color === 'amber' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-700'
              }`}>
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
        ))}
      </div>

      {/* No Results Message */}
      {(filteredConditions || []).length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search size={48} className="mx-auto mb-4" />
          <p>No conditions found matching your search.</p>
          <p className="text-sm mt-2">Try searching for a different term or browse all conditions.</p>
        </div>
      )}
    </div>
  );
};

export default ConditionsTab;