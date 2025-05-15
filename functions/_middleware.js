// Middleware for Cloudflare Pages
export async function onRequest(context) {
    const { request, env, next } = context;
    const url = new URL(request.url);
    
    // Check if it's an API request
    if (url.pathname.startsWith('/api/')) {
      // Handle API routes
      if (url.pathname === '/api/user') {
        // Get session cookie
        const cookies = request.headers.get('Cookie') || '';
        const sessionCookie = getCookie(cookies, 'waveform_session');
        
        // If no session cookie, return not authenticated
        if (!sessionCookie) {
          return new Response(JSON.stringify({ 
            isAuthenticated: false, 
            user: null 
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        
        try {
          // Decode the session
          const userData = JSON.parse(atob(sessionCookie));
          return new Response(JSON.stringify({
            isAuthenticated: true,
            user: userData
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          // Error parsing the session
          return new Response(JSON.stringify({ 
            isAuthenticated: false, 
            user: null,
            error: 'Invalid session'
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      }
    }
    
    // For all other routes, pass through to the next handler
    return next();
  }
  
  // Helper function to get a specific cookie value
  function getCookie(cookieString, name) {
    const cookies = cookieString.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }