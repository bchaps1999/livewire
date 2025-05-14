import React, { useState } from 'react';
import { event } from '../types';

interface NewseventProps {
  event: event;
  animationDelay?: number;
}

const getCategoryClass = (category?: string): string => {
  // Match category to background colors, handle undefined
  const lowerCategory = (category || '').toLowerCase();
  
  if (lowerCategory.includes('climate') || lowerCategory.includes('environment')) {
    return 'bg-climate text-white';
  } else if (lowerCategory.includes('ai') || lowerCategory.includes('ethics')) {
    return 'bg-ai-ethics text-white';
  } else if (lowerCategory.includes('chip') || lowerCategory.includes('semiconductor') || lowerCategory.includes('tech')) {
    return 'bg-chip text-white';
  } else if (lowerCategory.includes('quantum')) {
    return 'bg-quantum text-gray-800';
  }
  
  return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white';
};

const NewsEvent: React.FC<NewseventProps> = ({ event, animationDelay = 0 }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const animationStyle = {
    animationDelay: `${animationDelay}ms`
  };

  const categoryClass = getCategoryClass(event.category);
  
  return (
    <div 
      className="bg-white dark:bg-ink-800 rounded-lg overflow-hidden mb-0 animate-fade-in-up shadow-feed-item transition-all duration-200"
      style={animationStyle}
    >
      <div className="flex flex-col sm:flex-row">
        {event.imageUrl && (
          <div className="sm:w-40 md:w-48 flex-shrink-0">
            <div className="relative h-28 sm:h-full">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-2 py-1">
                {event.source}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center ${categoryClass}`}>
              <span>{event.category}</span>
            </div>
            <div className="text-xs text-ink-500 dark:text-paper-400 font-mono">{event.date}</div>
          </div>
          
          <h3 className="font-display font-bold text-lg mb-2 text-ink-900 dark:text-paper-100">{event.title}</h3>
          
          <p className={`text-sm text-ink-700 dark:text-paper-300 mb-4 ${!expanded && 'line-clamp-3'}`}>
            {event.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className="p-2 text-ink-600 dark:text-paper-400 hover:text-accent-blue dark:hover:text-accent-blue rounded-full hover:bg-paper-200 dark:hover:bg-ink-700 transition-colors focus:outline-none"
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {bookmarked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
              </button>
              
              <button 
                onClick={() => setExpanded(!expanded)}
                className="p-2 text-ink-600 dark:text-paper-400 hover:text-accent-blue dark:hover:text-accent-blue rounded-full hover:bg-paper-200 dark:hover:bg-ink-700 transition-colors focus:outline-none"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>
            
            <a 
              href={event.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-white bg-accent-green hover:bg-green-800 px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center"
            >
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEvent;
