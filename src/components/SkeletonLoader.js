import React from 'react';

/**
 * SkeletonLoader Component
 * Provides skeleton screens for different content types
 */

// Basic skeleton item
const SkeletonItem = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

// Card skeleton for condition cards
export const ConditionCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="skeleton-title w-3/4"></div>
    <div className="skeleton-text w-1/2 mb-4"></div>
    <div className="skeleton-text w-full"></div>
    <div className="skeleton-text w-4/5"></div>
    <div className="skeleton-text w-2/3"></div>
    <div className="mt-4 flex justify-between items-center">
      <div className="skeleton-button"></div>
      <div className="skeleton h-5 w-16"></div>
    </div>
  </div>
);

// List skeleton for pathogen lists
export const PathogenListSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center p-3 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="skeleton w-12 h-12 rounded-full mr-3"></div>
        <div className="flex-1">
          <div className="skeleton-text w-3/4"></div>
          <div className="skeleton-text w-1/2"></div>
        </div>
        <div className="skeleton-button"></div>
      </div>
    ))}
  </div>
);

// Quiz skeleton
export const QuizSkeleton = () => (
  <div className="card animate-pulse">
    <div className="skeleton h-2 w-full mb-6"></div>
    <div className="skeleton-text w-1/4 mb-4"></div>
    <div className="skeleton-title w-full mb-6"></div>
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton h-12 w-full rounded-lg"></div>
      ))}
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="card animate-pulse">
    <div className="skeleton-title w-1/2 mb-4"></div>
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          {[...Array(columns)].map((_, j) => (
            <div key={j} className="skeleton h-6 flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Generic content skeleton
export const ContentSkeleton = ({ lines = 3, title = true }) => (
  <div className="animate-pulse">
    {title && <div className="skeleton-title w-2/3 mb-4"></div>}
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="skeleton-text" style={{ width: `${90 - i * 10}%` }}></div>
    ))}
  </div>
);

// Default skeleton loader
const SkeletonLoader = ({ type = 'content', ...props }) => {
  switch (type) {
    case 'card':
      return <ConditionCardSkeleton {...props} />;
    case 'list':
      return <PathogenListSkeleton {...props} />;
    case 'quiz':
      return <QuizSkeleton {...props} />;
    case 'table':
      return <TableSkeleton {...props} />;
    default:
      return <ContentSkeleton {...props} />;
  }
};

export default SkeletonLoader;