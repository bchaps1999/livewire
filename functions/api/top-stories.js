export async function onRequest(context) {
    // Log all available environment variables in the Cloudflare Function context
    console.log("Cloudflare Function Environment Variables (top-stories):", JSON.stringify(context.env, null, 2));

    const apiKey = context.env.WAVEFORM_API_KEY;
    
    if (!apiKey) {
      console.error("WAVEFORM_API_KEY is missing from context.env in top-stories.js. Check .dev.vars and ensure Wrangler was restarted after .dev.vars was created/updated.");
      return new Response(JSON.stringify({ error: "API key not configured in function. Check .dev.vars and Wrangler restart." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    // Get the request body
    let requestData;
    try {
      requestData = await context.request.json();
    } catch (err) {
        console.error("Failed to parse request JSON in top-stories.js:", err);
        return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
            status: 400, // Bad Request
            headers: { "Content-Type": "application/json" }
        });
    }
    
    // Forward the request to the actual API with your secret key
    const TOP_STORIES_API_URL = "https://qxo4xa3yoa.execute-api.us-east-1.amazonaws.com/Prod/top-stories/";
    
    try {
      const response = await fetch(TOP_STORIES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API responded with status: ${response.status} in top-stories.js. Body: ${errorBody}`);
        throw new Error(`API responded with status: ${response.status}. Body: ${errorBody}`);
      }
      
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error in top-stories.js function execution:", error.message);
      return new Response(JSON.stringify({ error: error.message, details: "Error during API proxy in top-stories.js" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }