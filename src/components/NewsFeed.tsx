import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import NewsEvent from './NewsEvent';
import NewsEventSkeleton from './NewsEventSkeleton'; // Import the skeleton component
import { event } from '../types'; // Removed Channel as it's not used here

interface NewsFeedProps {
  categorySlug?: string; // Re-introduced categorySlug
  specialView?: string;
}

const NEWS_ITEMS_PER_PAGE = 10; // Number of items to fetch per page/request

// Modified to use last_event_key for pagination
const fetchNewsFromAPI = async (mode: string, tag?: string, lastEventKey: string | null = null) => {
  let apiUrl = '/api/top-stories';
  if (mode === 'breaking-news') {
    apiUrl = '/api/breaking-news';
  }
  
  const payload: any = {
    min_significance: 0,
    limit: NEWS_ITEMS_PER_PAGE,
  };

  if (lastEventKey) {
    payload.last_event_key = lastEventKey;
  }
  
  if (tag) {
    payload.tags = [tag];
  }
  
  console.log(`Fetching news from ${apiUrl} with payload:`, JSON.stringify(payload));
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    const eventsReturned = data.events || [];
    // Determine hasMore based on the presence of a new last_event_key from the API
    // If last_event_key is null or undefined, it means no more pages.
    const newLastEventKey = data.last_event_key || null;
    const hasMore = !!newLastEventKey; 
    // An additional check could be: `const hasMore = !!newLastEventKey && eventsReturned.length > 0;`
    // But sticking to the old app's logic: if last_event_key is present, there might be more.
    // The old app also had a counter for empty results, we'll simplify for now.
    
    return {
        events: eventsReturned,
        newLastEventKey: newLastEventKey,
        hasMore: hasMore 
    };
  } catch (error) {
    console.error(`Error fetching from ${apiUrl}:`, error);
    return { events: [], newLastEventKey: null, hasMore: false };
  }
};

const mapApiEventToNewsEvent = (apiEvent: any): event => {
  let imageUrl = apiEvent.image_url || apiEvent.imageUrl || apiEvent.image ||
                 (apiEvent.images && apiEvent.images.length > 0 ? apiEvent.images[0] : null) ||
                 (apiEvent.media && apiEvent.media.length > 0 && apiEvent.media[0].url ? apiEvent.media[0].url : null);

  // If no image found yet, try to find one in the links array
  if (!imageUrl && apiEvent.links && Array.isArray(apiEvent.links)) {
    for (const link of apiEvent.links) {
      if (typeof link === 'string') {
        const lowerLink = link.toLowerCase();
        if (lowerLink.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
          imageUrl = link;
          break; // Found an image link
        }
      } else if (typeof link === 'object' && link !== null && typeof link.url === 'string') {
        // Assuming link might be an object like { url: "...", type: "image/jpeg" }
        // Or just check its url property for image extension
        const lowerLinkUrl = link.url.toLowerCase();
        if (lowerLinkUrl.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
          imageUrl = link.url;
          break; // Found an image link
        }
        // Optional: Check for link.type if available and indicates an image
        // if (link.type && link.type.startsWith('image/')) {
        //   imageUrl = link.url;
        //   break;
        // }
      }
    }
  }

  return {
    id: apiEvent.event_id || apiEvent.id || '',
    title: apiEvent.headline || apiEvent.title || '',
    summary: apiEvent.description || apiEvent.summary || '',
    content: apiEvent.content || '',
    url: apiEvent.url || 
         (apiEvent.links && apiEvent.links.length > 0 && typeof apiEvent.links[0] === 'string' ? apiEvent.links[0] : 
         (apiEvent.links && apiEvent.links.length > 0 && typeof apiEvent.links[0] === 'object' && apiEvent.links[0]?.url ? apiEvent.links[0].url : '')),
    imageUrl: imageUrl || '', // Ensure it's always a string
    date: apiEvent.created_at || apiEvent.date || '',
    source: apiEvent.publisher || apiEvent.source || '',
    category: apiEvent.category || '',
    author: apiEvent.author || '',
    isSaved: apiEvent.isSaved || false,
    readingProgress: apiEvent.readingProgress || 0,
    // Pass through extra fields for the sources slider
    links: apiEvent.links || [],
    article_ids: apiEvent.article_ids || [],
    sources: apiEvent.sources || [],
  };
};

// Helper to capitalize tag names for display
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const NewsFeed: React.FC<NewsFeedProps> = ({ specialView, categorySlug }) => {
  const location = useLocation(); // Get location object to read query params
  const [events, setEvents] = useState<event[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // For initial load
  const [isLoadingMore, setIsLoadingMore] = useState(false); // For subsequent loads
  const [lastEventKey, setLastEventKey] = useState<string | null>(null); // Changed from offset
  const [hasMore, setHasMore] = useState(true); // Whether more items can be loaded
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [currentDisplayTitle, setCurrentDisplayTitle] = useState<string>("Today's Top Stories");
  const [currentDisplayDescription, setCurrentDisplayDescription] = useState<string>('Your personalized news digest');
  const [mode, setMode] = useState('top-stories');
  
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingInitial || isLoadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        console.log('IntersectionObserver triggered, loading more...');
        loadMoreEvents();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoadingInitial, isLoadingMore, hasMore]); // Dependencies for useCallback

  const loadEvents = async (isInitialLoad: boolean, tagForLoad?: string, currentMode?: string) => {
    if (isInitialLoad) {
      setIsLoadingInitial(true);
    } else {
      setIsLoadingMore(true);
    }
    
    const determinedMode = currentMode || mode;
    // Use tagForLoad if provided (from initial load or refresh), otherwise derive from categorySlug or query.
    const actualTag = tagForLoad || categorySlug || new URLSearchParams(location.search).get('tag'); 

    // Use `null` for lastEventKey on initial load, otherwise use current state.
    const keyForFetch = isInitialLoad ? null : lastEventKey;

    try {
      // Pass the determinedMode, actualTag, and the correct key for this fetch
      const { events: newApiEvents, newLastEventKey: updatedLastEventKey, hasMore: newHasMore } = 
        await fetchNewsFromAPI(determinedMode, actualTag || undefined, keyForFetch);
      
      const newMappedEvents = newApiEvents.map(mapApiEventToNewsEvent);
      
      setEvents(prevEvents => isInitialLoad ? newMappedEvents : [...prevEvents, ...newMappedEvents]);
      setHasMore(newHasMore);
      setLastEventKey(updatedLastEventKey); // Update with the key from the API response
      
      if (isInitialLoad) {
          setLastUpdated(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
      }

    } catch (error) {
      console.error('Error fetching events:', error);
      setHasMore(false); 
    } finally {
      if (isInitialLoad) {
        setIsLoadingInitial(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };
  
  const loadMoreEvents = () => {
    if (!isLoadingMore && hasMore) {
        console.log('loadMoreEvents called, current lastEventKey:', lastEventKey);
        // For loading more, the tag context should already be set by the initial load/useEffect.
        // We can rely on categorySlug prop or the tag from the current URL search query.
        const tagFromQuery = new URLSearchParams(location.search).get('tag');
        const currentContextTag = categorySlug || tagFromQuery;
        // Pass false for isInitialLoad because this is for loading more items
        loadEvents(false, currentContextTag || undefined, mode);
    }
  };

  useEffect(() => {
    // This effect handles initial load and re-loads when filters/mode change
    const queryParams = new URLSearchParams(location.search);
    const tagFromQuery = queryParams.get('tag');
    const currentDisplayTag = categorySlug || tagFromQuery; // Use this for display and initial load

    let determinedMode = 'top-stories';
    if (location.pathname.startsWith('/breaking') || specialView === 'breaking-news') {
      determinedMode = 'breaking-news';
    }
    
    setMode(determinedMode);
    setEvents([]); // Reset events
    setLastEventKey(null); // Reset lastEventKey for new filter/mode
    setHasMore(true); // Reset hasMore
    
    console.log(`Initial load triggered by useEffect. Mode: ${determinedMode}, Tag: ${currentDisplayTag}`);
    // Pass true for isInitialLoad, pass currentDisplayTag
    loadEvents(true, currentDisplayTag || undefined, determinedMode);

    // Update title and description based on mode and tag
    if (determinedMode === 'breaking-news') {
      setCurrentDisplayTitle('Breaking News');
      setCurrentDisplayDescription('The latest breaking news');
    } else if (currentDisplayTag) {
      setCurrentDisplayTitle(`Top Stories: ${capitalize(currentDisplayTag)}`);
      setCurrentDisplayDescription(`News about ${currentDisplayTag}`);
    } else if (specialView === 'annotated') { // Keep annotated view logic if needed
        setCurrentDisplayTitle('Annotated News');
        setCurrentDisplayDescription('News you have annotated');
    } else {
      setCurrentDisplayTitle("Today's Top Stories");
      setCurrentDisplayDescription('Your personalized news digest');
    }
  // Add categorySlug to dependency array
  }, [specialView, location.search, location.pathname, categorySlug]); 

  const handleRefresh = () => {
    setEvents([]);
    setLastEventKey(null); // Reset for refresh
    setHasMore(true);
    const queryParams = new URLSearchParams(location.search);
    const tagFromQuery = queryParams.get('tag');
    const currentContextTag = categorySlug || tagFromQuery; // Tag for refresh logic
    console.log(`Refresh triggered. Mode: ${mode}, Tag: ${currentContextTag}`);
    // Pass true for isInitialLoad, pass currentContextTag
    loadEvents(true, currentContextTag || undefined, mode);
  };
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="relative -mt-8 w-full">
      {/* Glassy header that spans the entire feed */}
      <div className="sticky top-0 inset-x-0 px-4 sm:px-6 pt-6 pb-5 backdrop-blur-md bg-paper-50/90 dark:bg-ink-900/90 border-b border-paper-300 dark:border-ink-700 z-10 shadow-sm mb-6">
        <div className="flex flex-col mb-4 mt-4">
          <span className="text-ink-500 dark:text-paper-400 text-sm mb-1 font-mono leading-relaxed">{today}</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink-900 dark:text-paper-50 mb-1 leading-tight">
            {currentDisplayTitle} {/* Use dynamic title */}
          </h1>
          <div className="flex items-center text-sm text-ink-600 dark:text-paper-400 font-sans leading-relaxed">
            <span>Last updated: <span className="font-mono">{lastUpdated}</span></span>
            <span className="mx-2">•</span>
            <span className="italic">{currentDisplayDescription}</span> {/* Use dynamic description */}
          </div>
        </div>
        
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button 
            type="button" 
            onClick={handleRefresh} // Changed to handleRefresh
            className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-md shadow-sm hover:shadow-md transition-all w-full sm:w-auto flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-ink-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button 
            type="button" 
            className="px-4 py-2 text-sm font-medium text-ink-700 bg-paper-200 hover:bg-paper-300 dark:bg-ink-700 dark:text-paper-200 dark:hover:bg-ink-600 rounded-md shadow-sm hover:shadow-md transition-all w-full sm:w-auto flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-ink-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            View Options
          </button>
        </div>
      </div>

      {isLoadingInitial ? (
        <div className="flex flex-col items-start pt-4 space-y-0 px-4 sm:px-6">
          {/* Display multiple skeleton loaders */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-full p-4">
              <NewsEventSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-start pt-4 space-y-0 px-4 sm:px-6" id="feed-items-container"> {/* Centered feed cards with padding */}
            {events.length > 0 ? (
              events.map((event, index) => (
                // The ref for IntersectionObserver should ideally be on a sentinel element
                // at the end of the list, or on the last item if that's simpler.
                // For simplicity, placing it on each item, but only the last one matters.
                // A dedicated sentinel div after the map is better.
                <div key={event.id} className="w-full p-4">
                  <NewsEvent 
                    event={event}
                    animationDelay={index * 80} // Consider if this animation needs adjustment for infinite scroll
                  />
                </div>
              ))
            ) : (
              <div className="bg-paper-100 dark:bg-ink-800 p-8 rounded-lg border border-paper-300 dark:border-ink-700 text-center my-8">
                <p className="text-ink-600 dark:text-paper-400 font-display text-xl">No events found for this filter.</p>
                <p className="text-ink-500 dark:text-paper-500 mt-2">Try a different channel or check back later.</p>
              </div>
            )}
          </div>
          
          {/* Sentinel element for IntersectionObserver */}
          {hasMore && !isLoadingMore && events.length > 0 && (
            <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
              {/* Optional: You can put a mini-loader here if preferred over direct scroll loading */}
            </div>
          )}

          {/* Loader for when loading more items */}
          {isLoadingMore && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Message when all items are loaded */}
          {!hasMore && events.length > 0 && (
            <div className="text-center text-ink-500 dark:text-paper-500 py-8 font-sans">
              You've reached the end of the feed.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsFeed;
