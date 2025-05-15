// Cloudflare Pages login handler
export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const isSecureEnvironment = url.protocol === 'https:';
    
    // Generate state and nonce
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();
    
    // Store in a temporary cookie
    let stateCookie = `cognito_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;
    let nonceCookie = `cognito_nonce=${nonce}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;

    if (isSecureEnvironment) {
      stateCookie += '; Secure';
      nonceCookie += '; Secure';
    }
    
    // Build the authorization URL for the hosted UI
    const cognitoParams = new URLSearchParams({
      client_id: env.COGNITO_CLIENT_ID || '5b41a138ftr13geqmprcvigs17',
      response_type: 'code',
      scope: 'email openid phone',
      redirect_uri: `${url.origin}/auth/callback`,
      state: state,
      nonce: nonce
    });
    
    // Use the correct domain format that works
    const authUrl = `https://us-east-1t94vrvwek.auth.us-east-1.amazoncognito.com/login?${cognitoParams.toString()}`;
    
    // Redirect to Cognito hosted UI login
    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl,
        'Set-Cookie': [stateCookie, nonceCookie]
      }
    });
  }