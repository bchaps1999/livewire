import { redirect } from '@sveltejs/kit';
import { COGNITO_CLIENT_ID, COGNITO_DOMAIN } from '$env/static/private'; // Or dynamic, depending on your setup

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    // Generate state and nonce
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();

    // Store in temporary cookies
    cookies.set('cognito_state', state, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax',
        maxAge: 3600 // 1 hour
    });
    cookies.set('cognito_nonce', nonce, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 // 1 hour
    });

    // Build the authorization URL for the Cognito hosted UI
    const cognitoParams = new URLSearchParams({
        client_id: COGNITO_CLIENT_ID || '5b41a138ftr13geqmprcvigs17', // Fallback for now
        response_type: 'code',
        scope: 'email openid phone profile', // Added profile for more user info
        redirect_uri: `${url.origin}/auth/callback`,
        state: state,
        nonce: nonce
    });
    
    // Ensure COGNITO_DOMAIN is defined, e.g., your-cognito-domain.auth.us-east-1.amazoncognito.com
    if (!COGNITO_DOMAIN) {
        console.error('COGNITO_DOMAIN environment variable is not set.');
        // Potentially return an error response or redirect to an error page
        return new Response('Cognito domain not configured.', { status: 500 });
    }

    const authUrl = `https://${COGNITO_DOMAIN}/login?${cognitoParams.toString()}`;

    // Redirect to Cognito hosted UI login
    throw redirect(302, authUrl);
} 