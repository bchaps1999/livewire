/**
 * Represents a news event in the application
 */
export interface Newsevent {
  /** Unique identifier for the event */
  id: string;
  /** event headline */
  title: string;
  /** Brief summary of the event */
  description: string;
  /** Full event content */
  content: string;
  /** Link to the original event */
  url: string;
  /** URL to the event's featured image */
  imageUrl?: string;
  /** Publication date and time in ISO format */
  publishedAt: string;
  /** Publisher or author of the event */
  source: string;
  /** event category (e.g., technology, business) */
  category: string;
  /** Whether the event has been saved by the user */
  isSaved?: boolean;
  /** User's reading progress (0-100) */
  readingProgress?: number;
}

export interface event {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  date: string;
  imageUrl?: string;
  url: string;
  source?: string;
  category?: string;
  author?: string;
  isSaved?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export type ViewOption = 'cards' | 'list' | 'compact';
