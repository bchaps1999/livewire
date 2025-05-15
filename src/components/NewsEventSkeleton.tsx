import React from 'react';

const NewsEventSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-ink-800 rounded-lg overflow-hidden mb-0 shadow-feed-item">
      <div className="flex flex-col sm:flex-row">
        {/* Image Skeleton */}
        <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0 aspect-square sm:aspect-auto bg-gray-200 dark:bg-ink-700 animate-pulse"></div>
        
        {/* Text Content Skeleton */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              {/* Category Skeleton */}
              <div className="h-5 w-20 bg-gray-200 dark:bg-ink-600 rounded-full animate-pulse"></div>
              {/* Date Skeleton */}
              <div className="h-4 w-24 bg-gray-200 dark:bg-ink-600 rounded animate-pulse"></div>
            </div>
            
            {/* Title Skeleton */}
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-ink-600 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-1/2 bg-gray-200 dark:bg-ink-600 rounded animate-pulse mb-1 sm:mb-2"></div>
            
            {/* Summary Skeleton */}
            <div className="h-4 w-full bg-gray-200 dark:bg-ink-600 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-ink-600 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-ink-600 rounded animate-pulse"></div>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3">
            <div className="flex space-x-1 sm:space-x-2">
              {/* Button Skeletons */}
              <div className="h-8 w-8 bg-gray-200 dark:bg-ink-600 rounded-full animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-ink-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEventSkeleton; 