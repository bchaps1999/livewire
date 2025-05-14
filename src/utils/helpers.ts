/**
 * Format a date string into a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Truncate text to a specific length and add ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Generate a random ID for new items
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Debounce function for inputs like search
 */
export function debounce<F extends (...args: any[]) => any>(
  func: F, 
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
};

/**
 * Generate a duotone filter string for images
 * Creates a distinctive visual style for event images
 */
export const generateDuotoneFilter = (
  primaryColor: string = '#6C5CE7',
  secondaryColor: string = '#00CEC9'
): string => {
  // Convert hex colors to RGB values for filter
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const expandedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);
    
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 };
  };
  
  const primary = hexToRgb(primaryColor);
  const secondary = hexToRgb(secondaryColor);
  
  return `
    filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="duotone"><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"/><feComponentTransfer color-interpolation-filters="sRGB"><feFuncR type="table" tableValues="0 ${primary.r/255}"/><feFuncG type="table" tableValues="0 ${primary.g/255}"/><feFuncB type="table" tableValues="0 ${primary.b/255}"/></feComponentTransfer><feComponentTransfer color-interpolation-filters="sRGB"><feFuncR type="table" tableValues="${secondary.r/255} 1"/><feFuncG type="table" tableValues="${secondary.g/255} 1"/><feFuncB type="table" tableValues="${secondary.b/255} 1"/></feComponentTransfer></filter></svg>#duotone');
  `;
};

/**
 * Generate a unique news category color
 * Maps content categories to consistent colors throughout the application
 */
export const getCategoryColor = (category: string): { bg: string; text: string } => {
  const categories: Record<string, { bg: string; text: string }> = {
    technology: { bg: 'rgba(108, 92, 231, 0.1)', text: '#6C5CE7' },
    business: { bg: 'rgba(0, 184, 148, 0.1)', text: '#00B894' },
    sports: { bg: 'rgba(255, 118, 117, 0.1)', text: '#FF7675' },
    entertainment: { bg: 'rgba(0, 206, 201, 0.1)', text: '#00CEC9' },
    politics: { bg: 'rgba(253, 121, 168, 0.1)', text: '#FD79A8' },
    health: { bg: 'rgba(46, 204, 113, 0.1)', text: '#2ECC71' },
    science: { bg: 'rgba(85, 239, 196, 0.1)', text: '#55EFC4' },
    world: { bg: 'rgba(129, 236, 236, 0.1)', text: '#81ECEC' }
  };
  
  return categories[category.toLowerCase()] || { bg: 'rgba(178, 190, 195, 0.1)', text: '#B2BEC3' };
};

/**
 * Calculate reading time for an event
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Generate a random skewed background style for accent elements
 */
export const generateSkewedBackground = (): string => {
  const angle = Math.floor(Math.random() * 10) - 5; // Between -5 and 5 degrees
  return `transform: skew(${angle}deg);`;
};

/**
 * Generate random ID for React components when needed
 */
export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format an image URL with a fallback
 */
export const getImageWithFallback = (url?: string, fallback: string = '/images/placeholder.jpg'): string => {
  if (!url) return fallback;
  return url;
};

/**
 * Safely parse JSON with error handling
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

/**
 * Create a shareable link for an event
 */
export const createShareableLink = (eventId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/event/${eventId}`;
};

/**
 * Utility to handle keyboard navigation detection
 * Used to only show focus styles when using keyboard
 */
export const setupKeyboardNavigation = (): void => {
  // Add a global class to detect keyboard navigation
  function handleFirstTab(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      
      // Only need this listener for the first tab keydown
      window.removeEventListener('keydown', handleFirstTab);
      
      // Add listener to detect mouse clicks (to disable focus styles when mouse is used again)
      window.addEventListener('mousedown', handleMouseDownOnce);
    }
  }
  
  // Remove the class when mouse is used
  function handleMouseDownOnce(): void {
    document.body.classList.remove('user-is-tabbing');
    
    // Re-attach the tab listener to detect next keyboard navigation
    window.addEventListener('keydown', handleFirstTab);
  }
  
  // Start listening for the first tab keypress
  window.addEventListener('keydown', handleFirstTab);
};

/**
 * Format time to read for events
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return 'Less than a minute read';
  return `${minutes} min read`;
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Detect if device is touch-enabled
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
