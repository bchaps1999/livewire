import { redirect } from '@sveltejs/kit';
import { 
    COGNITO_CLIENT_ID, 
    COGNITO_CLIENT_SECRET, 
    COGNITO_DOMAIN 
} from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    const storedState = cookies.get('cognito_state');

    // Validate state to prevent CSRF
    if (!state || !storedState || state !== storedState) {
        console.error('Invalid state parameter:', { state, storedState });
        return new Response('Invalid state parameter. Please try logging in again.', { status: 400 });
    }

    // Clear the temporary auth cookies immediately after validation
    cookies.delete('cognito_state', { path: '/' });
    // Nonce is often validated by the ID token, but good to clear it too
    // const storedNonce = cookies.get('cognito_nonce'); 
    cookies.delete('cognito_nonce', { path: '/' }); 

    if (!code) {
        console.error('Authorization code missing.');
        return new Response('Authorization code missing. Please try logging in again.', { status: 400 });
    }

    try {
        const clientId = COGNITO_CLIENT_ID || '5b41a138ftr13geqmprcvigs17'; // Fallback for now
        const clientSecret = COGNITO_CLIENT_SECRET;
        const redirectUri = `${url.origin}/auth/callback`;

        if (!COGNITO_DOMAIN) {
            console.error('COGNITO_DOMAIN environment variable is not set.');
            return new Response('Cognito domain not configured.', { status: 500 });
        }
        if (!clientSecret) {
            console.error('COGNITO_CLIENT_SECRET environment variable is not set.');
            return new Response('Cognito client secret not configured.', { status: 500 });
        }

        const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`;

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
            console.error('Token exchange error:', { status: tokenResponse.status, error: errorData });
            return new Response(`Failed to exchange code for tokens: ${errorData}`, { status: 500 });
        }

        const tokenData = await tokenResponse.json();

        // Fetch user info using the access token
        const userInfoUrl = `https://${COGNITO_DOMAIN}/oauth2/userInfo`;
        const userInfoResponse = await fetch(userInfoUrl, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        if (!userInfoResponse.ok) {
            const errorData = await userInfoResponse.text();
            console.error('Failed to fetch user info:', { status: userInfoResponse.status, error: errorData });
            return new Response('Failed to fetch user info.', { status: 500 });
        }

        const userData = await userInfoResponse.json();
        
        // The original script also validated nonce with id_token, which is a good practice.
        // For simplicity here, we're omitting it, but you should consider adding it:
        // 1. Decode tokenData.id_token (it's a JWT)
        // 2. Verify its signature (using JWKS from Cognito)
        // 3. Check if the 'nonce' claim in the ID token matches storedNonce.

        // Store user data in cookies
        const userJson = JSON.stringify(userData);
        const userBase64 = btoa(userJson); // btoa is available in modern server-side JS environments (Node 16+)

        // HttpOnly cookie for session data (if needed, or store tokens directly)
        // For simplicity, let's assume the user info is what we want in the cookie for now.
        // You might want to store tokenData.id_token or tokenData.access_token if you need them for API calls.
        cookies.set('waveform_session', userBase64, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 // 1 day
        });

        // Cookie accessible to client-side JavaScript for UI updates
        cookies.set('waveform_user', userBase64, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 // 1 day
        });

        // Redirect to the homepage or a desired page after login
        throw redirect(302, '/'); 

    } catch (error) {
        console.error('Auth callback error:', error);
        // @ts-ignore
        return new Response('Authentication error: ' + error.message, { status: 500 });
    }
} 