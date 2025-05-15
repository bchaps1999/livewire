// Cloudflare Pages logout handler
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Determine the correct redirect URI for after Cognito logout
  let postCognitoRedirectUri = url.origin;
  if (url.hostname === 'localhost' && url.port === '8788') {
    const vitePort = env.VITE_PORT || '5173';
    postCognitoRedirectUri = `http://localhost:${vitePort}`;
  }

  // Clear all authentication cookies
  const clearCookies = [
    'waveform_auth=; Path=/; Max-Age=0',
    'waveform_user=; Path=/; Max-Age=0',
    'waveform_username=; Path=/; Max-Age=0',
    // Add Secure and HttpOnly flags appropriately if they were set initially
    // For simplicity, this example clears them broadly. Consider specificity.
    'waveform_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0', // Assuming it might have Secure
    'cognito_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    'cognito_nonce=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    // If cookies were set with Secure, their clearing directive also needs Secure
    // This logic can be enhanced by checking isSecureEnvironment like in login.js for clearing
  ];
  
  // Construct the Cognito logout URL
  const clientId = env.COGNITO_CLIENT_ID || '5b41a138ftr13geqmprcvigs17';
  
  const cognitoLogoutUrl = `https://us-east-1t94vrvwek.auth.us-east-1.amazoncognito.com/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(postCognitoRedirectUri)}`;
  
  // HTML content to clear cookies via JavaScript before redirect
  // The final client-side redirect within the script should also use postCognitoRedirectUri
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Logging Out...</title>
      <script>
        // Clear localStorage data
        localStorage.removeItem('waveformUserDisplay');
        localStorage.removeItem('authData');
        
        // Clear all cookies via JavaScript as well
        document.cookie = "waveform_user=; path=/; max-age=0";
        document.cookie = "cognito_state=; path=/; max-age=0";
        document.cookie = "cognito_nonce=; path=/; max-age=0";
        // Dispatch an event that the auth state might have changed
        window.dispatchEvent(new CustomEvent('authChange'));
        
        // Redirect to Cognito logout, which will then redirect to postCognitoRedirectUri
        setTimeout(function() {
          window.location.href = "${cognitoLogoutUrl}";
        }, 100);
      </script>
    </head>
    <body style="background-color: #2a2a2a; color: white; font-family: Arial, sans-serif; text-align: center; padding-top: 100px;">
      <h2>Logging out of Waveform...</h2>
      <p>You will be redirected shortly.</p>
    </body>
    </html>
  `;
  
  return new Response(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie': clearCookies
    }
  });
}