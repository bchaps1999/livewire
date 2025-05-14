import { event, Channel } from '../types';

// Mock channels data
const channels: Channel[] = [
  { id: '1', name: 'Technology', slug: 'technology', icon: 'fa-laptop-code' },
  { id: '2', name: 'Business', slug: 'business', icon: 'fa-chart-line' },
  { id: '3', name: 'Science', slug: 'science', icon: 'fa-flask' },
  { id: '4', name: 'Health', slug: 'health', icon: 'fa-heartbeat' },
  { id: '5', name: 'Entertainment', slug: 'entertainment', icon: 'fa-film' },
  { id: '6', name: 'Sports', slug: 'sports', icon: 'fa-basketball-ball' },
  { id: '7', name: 'Politics', slug: 'politics', icon: 'fa-landmark' },
  { id: '8', name: 'World', slug: 'world', icon: 'fa-globe-americas' }
];

// Mock events data - convert from the provided JSON format to our event type
const mockevents: event[] = [
  {
    id: "1",
    title: "Global Climate Summit Yields New Emissions Targets",
    source: "Reuters",
    date: "2023-05-12",
    summary: "World leaders from 195 countries have agreed to more ambitious carbon emission reduction targets at the latest UN Climate Summit. The agreement aims to limit global warming to 1.5°C above pre-industrial levels by 2030.",
    url: "https://example.com/climate-summit",
    category: "Politics",
    imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Climate+Summit"
  },
  {
    id: "2",
    title: "Tech Giants Form AI Ethics Coalition",
    source: "The Verge",
    date: "2023-05-11",
    summary: "Five major technology companies announced the formation of a coalition dedicated to establishing ethical guidelines for artificial intelligence development. The coalition will focus on addressing concerns about bias, privacy, and accountability.",
    url: "https://example.com/ai-coalition",
    category: "Technology",
    imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=AI+Ethics"
  },
  {
    id: "3",
    title: "Global Chip Shortage Expected to Ease by Q4",
    source: "Bloomberg",
    date: "2023-05-10",
    summary: "Industry analysts predict that the global semiconductor shortage that has affected everything from automobiles to consumer electronics will begin to ease by the fourth quarter of 2023, as new production capacity comes online.",
    url: "https://example.com/chip-shortage",
    category: "Business",
    imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=Chip+Shortage"
  },
  {
    id: "4",
    title: "New Breakthrough in Quantum Computing Announced",
    source: "Nature",
    date: "2023-05-09",
    summary: "Researchers have achieved a significant breakthrough in quantum error correction, potentially bringing fault-tolerant quantum computing closer to reality. The new technique demonstrates an error rate below the threshold required for scalable quantum computing.",
    url: "https://example.com/quantum-breakthrough",
    category: "Science",
    imageUrl: "https://placehold.co/600x400/f1c40f/ffffff?text=Quantum+Computing"
  },
  {
    id: "5",
    title: "European Parliament Passes Digital Markets Act",
    source: "Financial Times",
    date: "2023-05-08",
    summary: "The European Parliament has passed the Digital Markets Act, which aims to regulate large technology platforms and ensure fair competition in digital markets. The legislation introduces new obligations for 'gatekeeper' platforms.",
    url: "https://example.com/eu-digital-act",
    category: "Politics",
    imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=EU+Legislation"
  },
  {
    id: "6",
    title: "Space Tourism Company Completes First Commercial Flight",
    source: "CNN",
    date: "2023-05-07",
    summary: "A leading space tourism company has successfully completed its first commercial flight, carrying six passengers to the edge of space. The milestone flight marks the beginning of a new era in commercial space travel.",
    url: "https://example.com/space-tourism",
    category: "Technology",
    imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Space+Tourism"
  },
  {
    id: "7",
    title: "Global Renewable Energy Investment Hits Record High",
    source: "The Economist",
    date: "2023-05-06",
    summary: "Global investment in renewable energy reached a record $500 billion in 2022, with solar and wind power accounting for more than 70% of the total. The surge in investment reflects falling costs and supportive government policies.",
    url: "https://example.com/renewable-investment",
    category: "Business",
    imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Renewable+Energy"
  },
  {
    id: "8",
    title: "Major Cybersecurity Breach Affects Financial Institutions",
    source: "Wall Street Journal",
    date: "2023-05-05",
    summary: "A sophisticated cyber attack has compromised the systems of several major financial institutions, potentially exposing sensitive customer data. Security experts attribute the attack to a state-sponsored hacking group.",
    url: "https://example.com/cybersecurity-breach",
    category: "Technology",
    imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=Cybersecurity"
  }
];

export const getChannels = (): Channel[] => {
  return channels;
};

export const getChannelBySlug = (slug: string): Channel | undefined => {
  return channels.find(channel => channel.slug === slug);
};

export const fetchevents = async (categorySlug?: string): Promise<event[]> => {
  // In a real application, this would be an API call
  try {
    // Simulate a network request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let events = [...mockevents];
          
          if (categorySlug) {
            events = events.filter(event => 
              event.category?.toLowerCase() === categorySlug.toLowerCase()
            );
          }
          
          // Randomly fail 5% of the time to demonstrate error handling
          if (Math.random() < 0.05) {
            throw new Error('Random network error occurred');
          }
          
          resolve(events);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error(error instanceof Error 
      ? `Failed to fetch events: ${error.message}` 
      : 'Failed to fetch events'
    );
  }
};

export const saveevent = async (eventId: string, isSaved: boolean = true): Promise<void> => {
  try {
    console.log(`event ${eventId} ${isSaved ? 'saved' : 'unsaved'}`);
    
    const saved = await getSavedevents();
    
    if (isSaved) {
      // Add to saved if not already there
      const eventToSave = mockevents.find(a => a.id === eventId);
      if (eventToSave && !saved.find(a => a.id === eventId)) {
        const updatedSaved = [...saved, {...eventToSave, isSaved: true}];
        localStorage.setItem('savedNewsevents', JSON.stringify(updatedSaved));
      }
    } else {
      // Remove from saved
      const updatedSaved = saved.filter(a => a.id !== eventId);
      localStorage.setItem('savedNewsevents', JSON.stringify(updatedSaved));
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving event:', error);
    throw new Error('Failed to save event');
  }
};

export const getSavedevents = async (): Promise<event[]> => {
  // Retrieve saved events from localStorage
  console.log('getSavedevents called');
  const saved = localStorage.getItem('savedNewsevents');
  return saved ? JSON.parse(saved) : [];
};
