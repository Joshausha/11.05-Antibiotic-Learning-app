/**
 * WeakSpotsList Component
 * Displays weak areas from quiz progress with actionable study buttons
 * Board-prep aesthetic - professional, clean, no gamification
 */

import React from 'react';
import { BookOpen } from 'lucide-react';

/**
 * WeakArea interface matching useQuizProgress stats.weakAreas
 */
interface WeakArea {
  topic: string;
  accuracy: number;
  totalQuestions: number;
}

interface WeakSpotsListProps {
  weakAreas: WeakArea[];
  onStudyTopic: (topic: string) => void;
}

/**
 * Get background color class based on accuracy percentage
 * < 50%: red background (critical)
 * 50-69%: amber/orange background (needs work)
 */
const getAccuracyColorClass = (accuracy: number): string => {
  if (accuracy < 50) {
    return 'bg-red-100 text-red-800 border-red-200';
  }
  return 'bg-amber-100 text-amber-800 border-amber-200';
};

/**
 * Capitalize first letter of topic
 */
const capitalizeFirst = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const WeakSpotsList: React.FC<WeakSpotsListProps> = ({ weakAreas, onStudyTopic }) => {
  // Empty state
  if (!weakAreas || weakAreas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No weak areas identified yet.</p>
        <p className="text-sm mt-1">Complete more quizzes to see personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {weakAreas.map((area, index) => {
        const colorClass = getAccuracyColorClass(area.accuracy);

        return (
          <div
            key={`${area.topic}-${index}`}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
          >
            {/* Left side: Topic info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">
                  {capitalizeFirst(area.topic)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${colorClass}`}>
                  {area.accuracy}% accuracy
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Based on {area.totalQuestions} question{area.totalQuestions !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Right side: Study button */}
            <button
              onClick={() => onStudyTopic(area.topic)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BookOpen size={16} />
              Study
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default WeakSpotsList;
