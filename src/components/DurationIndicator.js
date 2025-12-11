/**
 * DurationIndicator Component
 * Reusable component for displaying treatment durations with clock icons
 * Integrates with RBO clinical guidelines and duration helper functions
 * Created: 2025-08-03
 */

import React, { useMemo } from 'react';
import { Clock, Timer, AlarmClock, Calendar, Info } from 'lucide-react';
import {
  parseDurationString,
  getDurationIcon,
  getDurationColor,
  formatDurationDisplay
} from '../utils/durationHelpers';

const DurationIndicator = ({ 
  duration,
  size = 'sm',
  showLabel = true,
  showTooltip = true,
  className = '',
  variant = 'badge' // 'badge', 'inline', 'card'
}) => {
  // Parse duration and get display properties
  const parsedDuration = useMemo(() => {
    return parseDurationString(duration);
  }, [duration]);

  const IconComponent = useMemo(() => {
    return getDurationIcon(parsedDuration);
  }, [parsedDuration]);

  const colorScheme = useMemo(() => {
    return getDurationColor(parsedDuration);
  }, [parsedDuration]);

  // Size configurations
  const sizeConfig = {
    xs: {
      icon: 'w-3 h-3',
      text: 'text-xs',
      padding: 'px-2 py-1',
      gap: 'gap-1'
    },
    sm: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      padding: 'px-3 py-1',
      gap: 'gap-2'
    },
    md: {
      icon: 'w-5 h-5',
      text: 'text-base',
      padding: 'px-4 py-2',
      gap: 'gap-2'
    },
    lg: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      padding: 'px-5 py-3',
      gap: 'gap-3'
    }
  };

  const config = sizeConfig[size] || sizeConfig.sm;

  // Tooltip content for complex durations
  const getTooltipContent = () => {
    if (!parsedDuration.isComplex) {
      return formatDurationDisplay(parsedDuration, 'tooltip');
    }

    if (parsedDuration.type === 'age-based' && parsedDuration.ageGroups) {
      return (
        <div className="space-y-1">
          <div className="font-medium">Age-based duration:</div>
          {parsedDuration.ageGroups.map((group, index) => (
            <div key={index} className="text-xs">
              <span className="font-medium">{group.ageRange}:</span> {group.duration}
            </div>
          ))}
        </div>
      );
    }

    if (parsedDuration.type === 'conditional' && parsedDuration.condition) {
      return (
        <div className="space-y-1">
          <div className="font-medium">Conditional duration:</div>
          <div className="text-xs">{parsedDuration.display}</div>
          <div className="text-xs opacity-80">Condition: {parsedDuration.condition}</div>
        </div>
      );
    }

    return formatDurationDisplay(parsedDuration, 'tooltip');
  };

  // Render different variants
  const renderBadge = () => (
    <span 
      className={`
        inline-flex items-center font-medium rounded-full border
        ${config.gap} ${config.padding} ${config.text}
        ${colorScheme.text} ${colorScheme.bg} ${colorScheme.border}
        ${className}
      `}
      title={showTooltip ? formatDurationDisplay(parsedDuration, 'tooltip') : undefined}
    >
      <IconComponent className={`${config.icon} ${colorScheme.icon}`} />
      {showLabel && (
        <span>{formatDurationDisplay(parsedDuration, 'compact')}</span>
      )}
    </span>
  );

  const renderInline = () => (
    <div 
      className={`inline-flex items-center ${config.gap} ${className}`}
      title={showTooltip ? formatDurationDisplay(parsedDuration, 'tooltip') : undefined}
    >
      <IconComponent className={`${config.icon} ${colorScheme.icon}`} />
      {showLabel && (
        <span className={`${config.text} ${colorScheme.text} font-medium`}>
          {formatDurationDisplay(parsedDuration, 'compact')}
        </span>
      )}
    </div>
  );

  const renderCard = () => (
    <div 
      className={`
        flex items-start ${config.gap} p-3 rounded-lg border
        ${colorScheme.bg} ${colorScheme.border} ${className}
      `}
    >
      <div className={`p-2 rounded-full bg-white/50`}>
        <IconComponent className={`${config.icon} ${colorScheme.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        {showLabel && (
          <div className={`${config.text} ${colorScheme.text} font-medium`}>
            Treatment Duration
          </div>
        )}
        <div className={`text-sm ${colorScheme.text} font-medium`}>
          {formatDurationDisplay(parsedDuration, 'compact')}
        </div>
        
        {/* Show additional info for complex durations */}
        {parsedDuration.isComplex && (
          <div className="mt-2">
            {parsedDuration.type === 'age-based' && parsedDuration.ageGroups && (
              <div className="space-y-1">
                {parsedDuration.ageGroups.map((group, index) => (
                  <div key={index} className="text-xs text-gray-600 flex justify-between">
                    <span className="font-medium">{group.ageRange}:</span>
                    <span>{group.duration}</span>
                  </div>
                ))}
              </div>
            )}
            
            {parsedDuration.type === 'conditional' && parsedDuration.condition && (
              <div className="text-xs text-gray-600 mt-1">
                <span className="font-medium">Condition:</span> {parsedDuration.condition}
              </div>
            )}
          </div>
        )}
        
        {/* Category indicator */}
        {!parsedDuration.isComplex && parsedDuration.category !== 'unknown' && (
          <div className="text-xs opacity-75 mt-1 capitalize">
            {parsedDuration.category === 'short' && 'Short-term treatment'}
            {parsedDuration.category === 'medium' && 'Standard treatment'}
            {parsedDuration.category === 'long' && 'Extended treatment'}
            {parsedDuration.category === 'extended' && 'Long-term treatment'}
          </div>
        )}
      </div>
    </div>
  );

  // Handle missing or invalid duration
  if (!duration || parsedDuration.category === 'unknown') {
    const fallbackColor = {
      text: 'text-gray-500',
      bg: 'bg-gray-100',
      border: 'border-gray-200',
      icon: 'text-gray-500'
    };

    if (variant === 'badge') {
      return (
        <span 
          className={`
            inline-flex items-center font-medium rounded-full border
            ${config.gap} ${config.padding} ${config.text}
            ${fallbackColor.text} ${fallbackColor.bg} ${fallbackColor.border}
            ${className}
          `}
          title="Duration not specified"
        >
          <Clock className={`${config.icon} ${fallbackColor.icon}`} />
          {showLabel && <span>Duration TBD</span>}
        </span>
      );
    }

    if (variant === 'inline') {
      return (
        <div className={`inline-flex items-center ${config.gap} ${className}`}>
          <Clock className={`${config.icon} ${fallbackColor.icon}`} />
          {showLabel && (
            <span className={`${config.text} ${fallbackColor.text}`}>
              Duration TBD
            </span>
          )}
        </div>
      );
    }

    return null; // Don't render card variant for unknown durations
  }

  // Render based on variant
  switch (variant) {
    case 'inline':
      return renderInline();
    case 'card':
      return renderCard();
    case 'badge':
    default:
      return renderBadge();
  }
};

/**
 * DurationLegend Component
 * Shows legend explaining duration categories and icons
 */
export const DurationLegend = ({ className = '' }) => {
  const legendItems = [
    {
      icon: Clock,
      label: 'Short-term',
      description: '1-7 days',
      color: 'text-green-600'
    },
    {
      icon: Timer,
      label: 'Standard',
      description: '1-3 weeks',
      color: 'text-yellow-600'
    },
    {
      icon: AlarmClock,
      label: 'Extended',
      description: '3+ weeks',
      color: 'text-orange-600'
    },
    {
      icon: Calendar,
      label: 'Complex',
      description: 'Age/condition specific',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className={`flex flex-wrap gap-4 text-xs ${className}`}>
      {legendItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="flex items-center gap-1">
            <IconComponent className={`w-3 h-3 ${item.color}`} />
            <span className="font-medium">{item.label}</span>
            <span className="text-gray-500">({item.description})</span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * DurationSummary Component
 * Shows summary of durations for multiple conditions
 */
export const DurationSummary = ({ 
  durations, 
  title = "Treatment Durations",
  className = '' 
}) => {
  if (!durations || durations.length === 0) {
    return null;
  }

  // Group durations by category
  const groupedDurations = durations.reduce((groups, duration) => {
    const parsed = parseDurationString(duration.duration);
    const category = parsed.isComplex ? 'complex' : parsed.category;
    
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push({
      ...duration,
      parsed
    });
    return groups;
  }, {});

  const categoryOrder = ['short', 'medium', 'long', 'extended', 'complex'];
  const orderedCategories = categoryOrder.filter(cat => groupedDurations[cat]);

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        {title}
      </h3>
      
      <div className="space-y-3">
        {orderedCategories.map(category => (
          <div key={category}>
            <div className="text-xs font-medium text-gray-600 mb-1 capitalize">
              {category === 'complex' ? 'Complex Durations' : `${category} Duration`}
            </div>
            <div className="space-y-1">
              {groupedDurations[category].map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">{item.conditionName}</span>
                  <DurationIndicator 
                    duration={item.duration}
                    size="xs"
                    variant="badge"
                    showTooltip={true}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {durations.length > 1 && (
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-gray-500">
            {durations.length} condition{durations.length !== 1 ? 's' : ''} with duration guidelines
          </div>
        </div>
      )}
    </div>
  );
};

export default DurationIndicator;