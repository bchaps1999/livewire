// Main worker file to handle all API routes
import { onRequest as topStoriesHandler } from './top-stories.js';
import { onRequest as breakingNewsHandler } from './breaking-news.js';
import { onRequest as eventHandler } from './event.js';
import { onRequest as articleHandler } from './article.js';
import { onRequest as linkPreviewHandler } from './link-preview.js';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      console.log(`Handling API request to: ${path}`);
      
      // Route the request to the appropriate handler
      if (path === '/api/top-stories') {
        return topStoriesHandler({ request, env, ctx });
      } else if (path === '/api/breaking-news') {
        return breakingNewsHandler({ request, env, ctx });
      } else if (path === '/api/event') {
        return eventHandler({ request, env, ctx });
      } else if (path === '/api/article') {
        return articleHandler({ request, env, ctx });
      } else if (path === '/api/link-preview') {
        return linkPreviewHandler({ request, env, ctx });
      }
      
      // Return 404 for unknown routes
      return new Response(JSON.stringify({ 
        error: 'Not found',
        path: path,
        availableRoutes: ['/api/top-stories', '/api/breaking-news', '/api/event', '/api/article', '/api/link-preview']
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error in worker:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
