/**
 * SimplePathogenNetwork Component
 * A simplified pathogen network visualization that doesn't hang
 */

import React from 'react';
import { Network, Users, Microscope } from 'lucide-react';

const SimplePathogenNetwork = ({ pathogenData }) => {
  // Get some basic pathogen stats for display
  const pathogens = pathogenData?.pathogens || [];
  const gramPositive = pathogens.filter(p => p.gramStatus === 'positive').length;
  const gramNegative = pathogens.filter(p => p.gramStatus === 'negative').length;
  
  // Create a simple grid layout for pathogens
  const getGramColor = (gramStatus) => {
    return gramStatus === 'positive' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="w-full h-96 bg-gray-50 rounded-lg p-6">
      <div className="text-center mb-6">
        <Network size={48} className="mx-auto text-blue-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Pathogen Overview</h3>
        <p className="text-gray-600">Interactive network visualization</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="font-medium">Gram-Positive</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{gramPositive}</div>
          <div className="text-sm text-gray-500">pathogens</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium">Gram-Negative</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{gramNegative}</div>
          <div className="text-sm text-gray-500">pathogens</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
        {pathogens.slice(0, 12).map((pathogen, index) => (
          <div
            key={pathogen.id}
            className={`p-2 rounded-lg text-xs ${getGramColor(pathogen.gramStatus)} border`}
          >
            <div className="flex items-center gap-1 mb-1">
              <Microscope size={12} />
              <span className="font-medium">{pathogen.commonName}</span>
            </div>
            <div className="text-xs opacity-75">{pathogen.shape}</div>
          </div>
        ))}
        {pathogens.length > 12 && (
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600 text-xs flex items-center justify-center">
            +{pathogens.length - 12} more
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
          <Users size={16} />
          <span>{pathogens.length} Total Pathogens</span>
        </div>
      </div>
    </div>
  );
};

export default SimplePathogenNetwork;