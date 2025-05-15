/**
 * API client for making requests to the backend APIs via Cloudflare Functions
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Generic function to make API requests to the backend
 */
export async function apiRequest<T>(
  endpoint: string, 
  data: any = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const responseData = await response.json();
    return { data: responseData };
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Fetch top stories from the API
 */
export async function fetchTopStories(params: { 
  limit?: number, 
  channel?: string,
  next_token?: string,
  tags?: string[]
} = {}) {
  // Create proper payload matching the API format
  const payload: any = {
    last_event_key: params.next_token,
    min_significance: 0
  };
  
  // Convert channel param to tags if provided (for compatibility with the API)
  if (params.channel && !params.tags) {
    payload.tags = [params.channel];
  } else if (params.tags) {
    payload.tags = params.tags;
  }
  
  if (params.limit) {
    payload.limit = params.limit;
  }
  
  return apiRequest('top-stories', payload);
}

/**
 * Fetch a single event by ID
 */
export async function fetchEvent(eventId: string) {
  return apiRequest('event', { event_id: eventId });
}

/**
 * Fetch breaking news events
 */
export async function fetchBreakingNews(params: {
  limit?: number,
  next_token?: string,
  tags?: string[]
} = {}) {
  // Create proper payload matching the API format
  const payload: any = {
    last_event_key: params.next_token,
    min_significance: 0
  };
  
  if (params.tags) {
    payload.tags = params.tags;
  }
  
  if (params.limit) {
    payload.limit = params.limit;
  }
  
  return apiRequest('breaking-news', payload);
}

/**
 * Fetch an article by ID
 */
export async function fetchArticle(articleId: string) {
  return apiRequest('article', { article_id: articleId });
}

// Import the LinkPreviewData interface
import { LinkPreviewData } from '../types';

/**
 * Fetch link preview metadata
 */
export async function fetchLinkPreview(url: string, context: string = 'default') {
  return apiRequest<LinkPreviewData>('link-preview', { url, context });
}
