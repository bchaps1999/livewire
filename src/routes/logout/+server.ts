import { redirect } from '@sveltejs/kit';
import { COGNITO_CLIENT_ID, COGNITO_DOMAIN } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    // Clear authentication cookies
    // These are the main cookies we set in the auth callback
    cookies.delete('waveform_session', { path: '/' });
    cookies.delete('waveform_user', { path: '/' });

    // Also clear any temporary auth state cookies that might have persisted
    cookies.delete('cognito_state', { path: '/' });
    cookies.delete('cognito_nonce', { path: '/' });

    // Construct the Cognito logout URL
    const clientId = COGNITO_CLIENT_ID || '5b41a138ftr13geqmprcvigs17'; // Fallback for now
    const cognitoLogoutDomain = COGNITO_DOMAIN; // e.g., your-cognito-domain.auth.us-east-1.amazoncognito.com
    
    if (!cognitoLogoutDomain) {
        console.error('COGNITO_DOMAIN environment variable is not set for logout.');
        // Fallback: redirect to home, but user might still be logged into Cognito
        throw redirect(302, '/'); 
    }

    const logoutRedirectUri = `${url.origin}/`; // Redirect to homepage after Cognito logout
    const cognitoLogoutUrl = `https://${cognitoLogoutDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutRedirectUri)}`;

    // Redirect to the Cognito logout URL
    // This will log the user out of Cognito itself and then redirect back to your app (logoutRedirectUri)
    throw redirect(302, cognitoLogoutUrl);
}

// Note: The original Cloudflare function also included HTML to clear localStorage
// and additional JS cookie clearing. If you use localStorage for auth-related state on the client,
// you'll need to handle that clearing on the client-side (e.g., in your Svelte components
// when a logout action is triggered, before navigating to this /logout endpoint). 