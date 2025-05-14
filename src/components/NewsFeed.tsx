import React, { useState, useEffect } from 'react';
import Newsevent from './Newsevent';
import { fetchevents, getChannelBySlug } from '../services/newsService';
import { event, Channel } from '../types'; // Ensure Channel type is imported

interface NewsFeedProps {
  categorySlug?: string;
  specialView?: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ categorySlug, specialView }) => {
  const [events, setevents] = useState<event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [regenerateCount, setRegenerateCount] = useState(3);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const eventsPerPage = 10;

  const [currentChannel, setCurrentChannel] = useState<Partial<Channel> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const loadevents = async () => {
      try {
        const data = await fetchevents(categorySlug);
        setevents(data);
        setLastUpdated(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadevents();

    if (categorySlug) {
      setCurrentChannel(getChannelBySlug(categorySlug) || { name: 'Category', description: 'events from this category' });
    } else if (specialView === 'annotated') {
      setCurrentChannel({ name: 'Annotated events', description: 'events you have annotated' });
    } else {
      setCurrentChannel({ name: 'Today\'s Top Stories', description: 'Your personalized news digest' });
    }
  }, [categorySlug, specialView]);

  const indexOfLastevent = currentPage * eventsPerPage;
  const indexOfFirstevent = indexOfLastevent - eventsPerPage;
  const currentevents = events.slice(indexOfFirstevent, indexOfLastevent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const regenerateFeed = () => {
    if (regenerateCount > 0) {
      setIsLoading(true);
      setRegenerateCount(regenerateCount - 1);
      
      setTimeout(async () => {
        try {
          const data = await fetchevents(categorySlug);
          setevents(data);
          setLastUpdated(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        } catch (error) {
          console.error('Error fetching events:', error);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    }
  };

  const adjustContext = () => {
    alert(`Adjust context for ${currentChannel?.name} (UI not implemented).`);
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="max-w-feed mx-auto px-4 sm:px-6 py-2 bg-paper-50 dark:bg-ink-900 min-h-full border border-paper-200 dark:border-ink-700 shadow-newspaper rounded-sm relative -mt-8">
      {/* Glassy header that spans the entire feed */}
      <div className="sticky -top-4 sm:-mx-6 px-4 sm:px-6 pt-1 pb-5 backdrop-blur-md bg-paper-50/90 dark:bg-ink-900/90 border-b border-paper-300 dark:border-ink-700 z-10 shadow-sm mb-6">
        <div className="flex flex-col mb-4 mt-4">
          <span className="text-ink-500 dark:text-paper-400 text-sm mb-1 font-mono">{today}</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink-900 dark:text-paper-50 mb-1 leading-tight">
            {currentChannel?.name}
          </h1>
          <div className="flex items-center text-sm text-ink-600 dark:text-paper-400 font-sans">
            <span>Last updated: <span className="font-mono">{lastUpdated}</span></span>
            <span className="mx-2">•</span>
            <span className="italic">{currentChannel?.description}</span>
          </div>
        </div>
        
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button 
            type="button" 
            onClick={adjustContext}
            className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-md shadow-sm hover:shadow-md transition-all w-full sm:w-auto flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-ink-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Customize
          </button>
          <button 
            type="button" 
            onClick={regenerateFeed}
            disabled={regenerateCount <= 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-md shadow-sm hover:shadow-md transition-all w-full sm:w-auto flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-ink-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate (<span className="font-semibold">{regenerateCount}</span>)
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-ink-600 dark:text-paper-400 font-display italic text-lg">Loading your personalized edition...</p>
        </div>
      ) : (
        <>
          <div className="space-y-5 pt-2" id="feed-items-container"> {/* Added pt-2 to create some space after the sticky header */}
            {currentevents.length > 0 ? (
              currentevents.map((event, index) => (
                <Newsevent 
                  key={event.id} 
                  event={event} 
                  channelName={currentChannel?.name || "Personal"}
                  animationDelay={index * 80}
                />
              ))
            ) : (
              <div className="bg-paper-100 dark:bg-ink-800 p-8 rounded-lg border border-paper-300 dark:border-ink-700 text-center my-8">
                <p className="text-ink-600 dark:text-paper-400 font-display text-xl">No events found.</p>
                <p className="text-ink-500 dark:text-paper-500 mt-2">Try a different category or check back later.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 pt-6 border-t border-paper-300 dark:border-ink-700 flex justify-between items-center">
              <button 
                className="action-button action-button-secondary flex items-center disabled:opacity-60 disabled:cursor-not-allowed" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="text-sm text-ink-500 dark:text-paper-400 font-mono">Page {currentPage} of {totalPages}</div>
              <button 
                className="action-button action-button-secondary flex items-center disabled:opacity-60 disabled:cursor-not-allowed" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsFeed;
