import React, { useState, useEffect } from 'react';
import { getSavedevents, saveevent } from '../services/newsService';
import { event } from '../types';
import Newsevent from './Newsevent';

const SavedEvents: React.FC = () => {
  const [events, setevents] = useState<event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  useEffect(() => {
    const fetchSavedevents = async () => {
      try {
        setLoading(true);
        const savedevents = await getSavedevents();
        setevents(savedevents.map(a => ({ ...a, isSaved: true })));
        setLastUpdated(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        setError(null);
      } catch (err) {
        setError('Failed to load saved events');
        console.error('Error loading saved events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedevents();
  }, []);

  const handleeventSaveToggle = async (eventId: string, newSaveState: boolean) => {
    try {
      await saveevent(eventId, newSaveState);
      if (!newSaveState) {
        setevents(prevevents => 
          prevevents.filter(event => event.id !== eventId)
        );
      }
    } catch (err) {
      console.error('Error updating save state for event:', err);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-paper-50 dark:bg-ink-900">
      <div className="mb-8 pb-4 border-b border-paper-300 dark:border-ink-700">
        <div className="flex flex-col mb-4">
          <span className="text-ink-500 dark:text-paper-400 text-sm mb-1 font-serif">{today}</span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 dark:text-paper-50 mb-1 leading-tight">
            Reading List
          </h1>
          <div className="flex items-center text-sm text-ink-500 dark:text-paper-400">
            <span>Last updated: {lastUpdated}</span>
            <span className="mx-2">•</span>
            <span className="font-serif italic">events you've saved for later reading</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-ink-600 dark:text-paper-400 font-serif italic">Retrieving your saved events...</p>
        </div>
      ) : error ? (
        <div className="bg-accent-red/10 dark:bg-accent-red/20 p-6 rounded-sm text-accent-red dark:text-accent-red/90 border border-accent-red/30 dark:border-accent-red/40 text-center">
          <p className="font-serif">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-paper-100 dark:bg-ink-800 p-6 rounded-sm border border-paper-300 dark:border-ink-700 text-center">
          <h2 className="text-xl font-display font-semibold text-ink-800 dark:text-paper-100 mb-2">Your Reading List is Empty</h2>
          <p className="text-ink-600 dark:text-paper-400 font-serif">events you save will appear here for later reading.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event, index) => (
            <Newsevent 
              key={event.id} 
              event={{...event, isSaved: true}}
              channelName="Reading List"
              animationDelay={index * 100}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedEvents;
