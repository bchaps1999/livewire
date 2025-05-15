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
  /** Alternative image URLs (fallback) */
  image?: string;
  image_url?: string;
  /** Image alt text for accessibility */
  imageAlt?: string;
  /** Publication date and time in ISO format */
  date: string;
  /** Publisher or author of the event */
  source?: string;
  /** Event category (e.g., technology, business) */
  category?: string;
  /** Event tags */
  tags?: string[];
  /** Author of the event */
  author?: string;
  /** Whether the event has been saved by the user */
  isSaved?: boolean;
  /** User's reading progress (0-100) */
  readingProgress?: number;
  /** Waveform integration: allow extra fields for sources slider and richer card */
  links?: any[];
  article_ids?: string[];
  sources?: any[];
}

// For backward compatibility with existing code
export type event = NewsEvent;

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export type ViewOption = 'cards' | 'list' | 'compact';

/**
 * Article returned from the article API
 */
export interface Article {
  id: string;
  title: string;
  content: string;
  url: string;
  source?: string;
  author?: string;
  published_date?: string;
  image_url?: string;
}

export interface Source {
  url?: string;
  link?: string; // Keep link for compatibility if used
  title?: string;
  image?: string; // If source might already have image directly
  publisher?: string;
  // any other relevant fields from source objects
}

export interface LinkPreviewData {
  image?: string;
  title?: string;
  description?: string;
  site_name?: string;
  url?: string; // The original URL that was previewed
}
