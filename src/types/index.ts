/**
 * Represents a news event in the application
 */
export interface NewsEvent {
  /** Unique identifier for the event */
  id: string;
  /** Event headline */
  title: string;
  /** Brief summary of the event */
  summary?: string;
  /** Full event content */
  content?: string;
  /** Link to the original event */
  url: string;
  /** URL to the event's featured image */
  imageUrl?: string;
  /** Publication date and time in ISO format */
  date: string;
  /** Publisher or author of the event */
  source?: string;
  /** Event category (e.g., technology, business) */
  category?: string;
  /** Author of the event */
  author?: string;
  /** Whether the event has been saved by the user */
  isSaved?: boolean;
  /** User's reading progress (0-100) */
  readingProgress?: number;
}

// Remove redundant 'event' interface since it's now unified with NewsEvent

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export type ViewOption = 'cards' | 'list' | 'compact';
