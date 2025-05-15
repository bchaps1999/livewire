import React, { useState, useEffect } from 'react';
import { event as EventType } from '../types';
import { fetchLinkPreview } from '../services/apiClient';
import { LinkPreviewData } from '../types';

interface NewsEventProps {
  event: EventType;
  animationDelay?: number;
  onSaveToggle?: (eventId: string, isSaved: boolean) => void;
  channelName?: string;
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

// Date Formatting Utilities (internal to this component)
const parseTimestampInternal = (ts: string | undefined): Date | null => {
  if (!ts) return null;
  return new Date(ts.endsWith('Z') ? ts : ts + 'Z');
};

const formatDateInternal = (date: Date | null): string => {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleDateString('en-US', options);
};

const getTimeAgoInternal = (date: Date | null): string => {
  if (!date) return '';
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  const days = Math.floor(diffInSeconds / 86400);
  return `${days}d ago`;
};

// Helper to fetch article details for slider
const fetchArticleDetails = async (articleId: string) => {
  try {
    const response = await fetch('/api/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article_id: articleId })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

const NewsEvent: React.FC<NewsEventProps> = ({ event, animationDelay = 0 }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeSourcePage, setActiveSourcePage] = useState(0);
  const [sources, setSources] = useState<any[]>([]);
  const [previews, setPreviews] = useState<Record<string, any>>({});

  // New state for the primary card image preview, using imported LinkPreviewData
  const [primaryImagePreview, setPrimaryImagePreview] = useState<LinkPreviewData | null>(null);
  const [isPrimaryImageLoading, setIsPrimaryImageLoading] = useState<boolean>(false);
  const [primaryImageError, setPrimaryImageError] = useState<string | null>(null);

  const animationStyle = {
    animationDelay: `${animationDelay}ms`
  };

  // Log tags and category for debugging
  console.log('[NewsEvent] Event data for tags/category:', { tags: event.tags, category: event.category, title: event.title });

  // Determine Tag/Category to display
  let displayTagOrCategory = '';
  if (event.tags && Array.isArray(event.tags)) {
    const firstValidTag = event.tags.find(tag => typeof tag === 'string' && tag.trim() !== '');
    if (firstValidTag) {
      displayTagOrCategory = firstValidTag.trim();
    }
  }
  if (!displayTagOrCategory && event.category && typeof event.category === 'string' && event.category.trim() !== '') {
    displayTagOrCategory = event.category.trim();
  }
  if (!displayTagOrCategory) {
    displayTagOrCategory = 'General'; // Default if nothing else
  }
  const categoryOrTagClass = getCategoryClass(displayTagOrCategory);

  // Determine firstLinkUrl in the component scope
  const getFirstLinkUrl = React.useCallback(() => { // useCallback to memoize if event doesn't change
    if (event.links && event.links.length > 0 && event.links[0]) {
      return event.links[0];
    }
    if (event.sources && event.sources.length > 0) {
      const firstSourceWithUrl = event.sources.find(s => (s.url || s.link) && typeof (s.url || s.link) === 'string');
      if (firstSourceWithUrl) {
          return firstSourceWithUrl.url || firstSourceWithUrl.link;
      }
    }
    return null;
  }, [event.links, event.sources]);

  const firstLinkUrl = getFirstLinkUrl();

  // Format Date
  const parsedDate = parseTimestampInternal(event.date);
  const timeAgo = getTimeAgoInternal(parsedDate);
  const formattedDatePart = formatDateInternal(parsedDate);
  const formattedDateString = parsedDate ? `${timeAgo} — ${formattedDatePart}` : (event.date || 'Date unavailable');

  // Load sources for slider: prefer article_ids, fallback to links/sources
  useEffect(() => {
    let ignore = false;
    const loadSources = async () => {
      if (event.article_ids && event.article_ids.length > 0) {
        const articles = await Promise.all(event.article_ids.map(id => fetchArticleDetails(id)));
        if (!ignore) {
          // Filter out null values and mark these as needing previews
          setSources(articles.filter(Boolean).map(article => ({
            ...article,
            noPreview: false // These articles may need previews
          })));
        }
      } else if (event.links && event.links.length > 0) {
        // For simple links, we'll need to fetch previews
        setSources(event.links.map(link => ({ 
          url: link,
          noPreview: false // Need to fetch previews
        })));
      } else if (event.sources && event.sources.length > 0) {
        // For sources that might already have metadata, only fetch missing previews
        setSources(event.sources.map(source => ({
          ...source,
          noPreview: Boolean(source.image) // Don't fetch preview if we already have an image
        })));
      } else {
        setSources([]);
      }
    };
    if (expanded) loadSources();
    return () => { ignore = true; };
  }, [expanded, event.article_ids, event.links, event.sources]);

  // After sources load and expansion, fetch link previews but only for the slider sources (TEXT ONLY)
  useEffect(() => {
    if (expanded) {
      sources.forEach(src => {
        const url = src.url || src.link;
        // Only fetch preview if we don't already have it and if we're going to show it in the slider
        if (url && !previews[url] && !src.noPreview) {
          // Using 'card-slider-text' context for slider text previews
          fetchLinkPreview(url, 'card-slider-text').then(res => {
            if (res.data) {
              setPreviews(prev => ({ ...prev, [url]: res.data }));
            }
          }).catch(() => {});
        }
      });
    }
  }, [expanded, sources, previews]);

  // Effect to fetch the primary image for the card from the first link/source
  useEffect(() => {
    let isMounted = true;

    if (event.imageUrl) {
      // If event.imageUrl (from mapping) is already available, use it directly
      console.log(`[NewsEvent] Using pre-fetched event.imageUrl: ${event.imageUrl}`);
      setPrimaryImagePreview({ image: event.imageUrl, title: event.title, description: event.summary, url: firstLinkUrl || '' });
      setIsPrimaryImageLoading(false);
      setPrimaryImageError(null);
      return; // Exit early
    }

    // If no event.imageUrl, and we have a firstLinkUrl, try to fetch preview
    if (firstLinkUrl) {
      console.log(`[NewsEvent] Fetching primary image for: ${firstLinkUrl}`);
      setIsPrimaryImageLoading(true);
      setPrimaryImageError(null); // Reset error before new fetch
      setPrimaryImagePreview(null); // Reset preview before new fetch
      fetchLinkPreview(firstLinkUrl, 'card-primary-image')
        .then(res => {
          if (!isMounted) return;
          if (res.data && res.data.image) {
            console.log('[NewsEvent] Primary image data received:', res.data);
            setPrimaryImagePreview(res.data);
          } else {
            console.warn('[NewsEvent] Primary image preview data missing image URL:', res.data);
            setPrimaryImageError('No image in preview'); // This error won't be shown if block is hidden
            setPrimaryImagePreview(null);
          }
        })
        .catch(err => {
          if (!isMounted) return;
          console.error('[NewsEvent] Error fetching primary image preview:', err);
          setPrimaryImageError(err.message || 'Failed to load preview'); // This error won't be shown
          setPrimaryImagePreview(null); 
        })
        .finally(() => {
          if (isMounted) {
            setIsPrimaryImageLoading(false);
          }
        });
    } else {
      // No event.imageUrl and no firstLinkUrl to fetch from
      console.log('[NewsEvent] No image URL or link found for primary image.');
      setPrimaryImagePreview(null);
      setIsPrimaryImageLoading(false);
      setPrimaryImageError(null);
    }
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [event.imageUrl, firstLinkUrl, event.title, event.summary]); // Added event.imageUrl, title, summary to dependencies

  // Slider pagination logic (3 per page)
  const linksPerPage = 3;
  const totalPages = Math.ceil(sources.length / linksPerPage);
  const currentPageSources = sources.slice(activeSourcePage * linksPerPage, (activeSourcePage + 1) * linksPerPage);

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSourcePage(p => Math.max(0, p - 1));
  };
  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSourcePage(p => Math.min(totalPages - 1, p + 1));
  };

  return (
    <div 
      className="bg-white dark:bg-ink-800 rounded-lg overflow-hidden mb-0 animate-fade-in-up shadow-feed-item transition-all duration-200"
      style={animationStyle}
    >
      {/* Main card content: Image on left (sm+), text content on right */}
      <div className="flex flex-col sm:flex-row"> 
        {/* Primary Image Display Area - Render only if loading or an image is available */}
        {(isPrimaryImageLoading || (primaryImagePreview && primaryImagePreview.image)) && (
          <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0 relative aspect-square sm:aspect-auto bg-paper-100 dark:bg-ink-700">
            {isPrimaryImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-500">Loading image...</span>
              </div>
            )}
            {/* Only attempt to render the image if preview and image URL exist and not loading */}
            {!isPrimaryImageLoading && primaryImagePreview && primaryImagePreview.image && (
              <a href={primaryImagePreview.url || firstLinkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full group">
                <img 
                  src={primaryImagePreview.image} 
                  alt={primaryImagePreview.title || event.title || 'News event image'} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={() => {
                    // Handle image load error for this specific image if needed
                    console.error(`[NewsEvent] Failed to load image: ${primaryImagePreview?.image}`);
                    // Set image to undefined to effectively remove it from preview, hiding the image area
                    setPrimaryImagePreview(prev => prev ? { ...prev, image: undefined } : null); 
                  }}
                />
                {/* Site name overlay - keep if desired */}
                {primaryImagePreview.site_name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 truncate">
                    {primaryImagePreview.site_name}
                  </div>
                )}
              </a>
            )}
            {/* Fallback for error *if* we still want to show the box. 
                However, the outer condition (isPrimaryImageLoading || primaryImagePreview?.image)
                means this specific error fallback might not be displayed if primaryImagePreview.image is null.
                If an error state that occupies the image box is desired even if no image is present, 
                the outer condition would need `|| primaryImageError`.
                For now, sticking to "remove the image area entirely if no image".
            */}
            {/* 
            {!isPrimaryImageLoading && primaryImageError && (!primaryImagePreview || !primaryImagePreview.image) && (
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <span className="text-xs text-gray-500 text-center">Image not available</span>
              </div>
            )}
            */}
          </div>
        )}
        
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <div className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center ${categoryOrTagClass} truncate`}>
                <span className="truncate">{displayTagOrCategory}</span>
              </div>
              <div className="text-xs text-ink-500 dark:text-paper-400 font-mono whitespace-nowrap pl-2">
                {formattedDateString}
              </div>
            </div>
            
            <h3 className="font-display font-bold text-base sm:text-lg mb-1 sm:mb-2 text-ink-900 dark:text-paper-100 truncate">
              {event.title}
            </h3>
            
            {/* Full summary - no line clamp */}
            <p className="text-sm text-ink-700 dark:text-paper-300 mb-2 sm:mb-3 leading-relaxed">
              {event.summary}
            </p>
          </div>
          
          {/* Expanded Content - Sources Slider MOVED OUTSIDE this content block */}
          {/* Action Buttons - Pushed to bottom of content area */}
          <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3"> 
            <div className="flex space-x-1 sm:space-x-2">
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
          </div>
        </div>
      </div>

      {/* Sources Drawer - Appears below the main card content when expanded */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}> 
        {/* Apply border, padding, and background when expanded and content exists */}
        {expanded && sources.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-ink-750 p-3 sm:p-4">
            <div className="link-slider-container"> {/* Removed original my-2 sm:my-3 margin */}
                <div className="link-slider-header flex justify-between items-center">
                  <span className="font-mono text-xs text-ink-500 dark:text-paper-400">Sources</span>
                  {totalPages > 1 && (
                    <div className="slider-nav flex items-center space-x-1">
                      <button 
                        onClick={handlePrevPage} 
                        disabled={activeSourcePage === 0} 
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-accent-blue"
                        aria-label="Previous sources page"
                      >
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{activeSourcePage + 1}/{totalPages}</span>
                      <button 
                        onClick={handleNextPage} 
                        disabled={activeSourcePage >= totalPages - 1} 
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-accent-blue"
                        aria-label="Next sources page"
                      >
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="link-list mt-2 space-y-1.5">
                  {currentPageSources.map((src, idx) => {
                    const url = src.url || src.link;
                    const meta = previews[url] || {};
                    return (
                      <div key={url || idx} className="link-item p-1.5 rounded bg-paper-100 dark:bg-ink-700 hover:bg-paper-200 dark:hover:bg-ink-600">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col group">
                          <span className="font-medium text-xs sm:text-sm text-accent-blue dark:text-blue-400 group-hover:underline truncate">
                            {meta.title || src.title || url}
                          </span>
                          {(meta.site_name || src.publisher) && (
                            <span className="text-xs text-ink-500 dark:text-paper-400 mt-0.5 truncate">
                              {meta.site_name || src.publisher}
                            </span>
                          )}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(NewsEvent);
