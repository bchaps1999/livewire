// API endpoint to get current user information
export async function onRequestGet(context) {
    const { request } = context;
    
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
        },
        status: 400
      });
    }
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