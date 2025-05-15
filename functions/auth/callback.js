// Cloudflare Pages auth callback handler
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = url.searchParams;
  const isSecureEnvironment = url.protocol === 'https:';
  
  // Get authorization code and state from URL parameters
  const code = params.get('code');
  const state = params.get('state');
  
  // Get stored state and nonce from cookies
  const cookies = request.headers.get('Cookie') || '';
  const storedState = getCookie(cookies, 'cognito_state');
  const storedNonce = getCookie(cookies, 'cognito_nonce');
  
  // Validate state to prevent CSRF
  if (!state || !storedState || state !== storedState) {
    console.error('Invalid state parameter details:', { 
      receivedState: state, 
      retrievedStoredState: storedState, 
      cookiesReceived: cookies 
    });
    return new Response('Invalid state parameter', { status: 400 });
  }
  
  try {
    // Exchange code for tokens
    const clientId = env.COGNITO_CLIENT_ID || '5b41a138ftr13geqmprcvigs17';
    const clientSecret = 'gr4unbr7jc9t7fef6tiu7a75adk22r9vlgq6bbqdm6vcvnia4uq'; // Consider moving to env variables
    const redirectUri = `${url.origin}/auth/callback`;
    
    const tokenUrl = 'https://us-east-1t94vrvwek.auth.us-east-1.amazoncognito.com/oauth2/token';
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('client_id', clientId);
    formData.append('redirect_uri', redirectUri);
    
    const authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader
      },
      body: formData.toString()
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      return new Response('Failed to exchange code for tokens', { status: 500 });
    }
    
    const tokenData = await tokenResponse.json();
    
    const userInfoUrl = 'https://us-east-1t94vrvwek.auth.us-east-1.amazoncognito.com/oauth2/userInfo';
    const userInfoResponse = await fetch(userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    if (!userInfoResponse.ok) {
      return new Response('Failed to fetch user info', { status: 500 });
    }
    
    const userData = await userInfoResponse.json();
    
    const sessionData = btoa(JSON.stringify(userData));
    let sessionCookie = `waveform_session=${sessionData}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
    let userCookie = `waveform_user=${sessionData}; Path=/; SameSite=Lax; Max-Age=86400`; // Not HttpOnly

    if (isSecureEnvironment) {
      sessionCookie += '; Secure';
      userCookie += '; Secure';
    }
    
    const clearStateCookie = 'cognito_state=; Path=/; Max-Age=0';
    const clearNonceCookie = 'cognito_nonce=; Path=/; Max-Age=0';

    let finalRedirectUrl = '/';
    // Check if running in local dev environment (Wrangler serves on 8788)
    // and redirect back to Vite dev server (typically 5173)
    if (url.hostname === 'localhost' && url.port === '8788') {
      const vitePort = env.VITE_PORT || '5173'; // Allow VITE_PORT to be configurable via .dev.vars
      finalRedirectUrl = `http://localhost:${vitePort}/`;
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting...</title>
        <style> body { display: none; } </style>
        <script>
          document.cookie = "${userCookie.replace(/; Secure/i, '').replace(/; HttpOnly/i, '')}";
          window.location.replace('${finalRedirectUrl}');
        </script>
      </head>
      <body>Redirecting...</body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': [userCookie, sessionCookie, clearStateCookie, clearNonceCookie].filter(Boolean)
      }
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    return new Response('Authentication error: ' + error.message, { status: 500 });
  }
}

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