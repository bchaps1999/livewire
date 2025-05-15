export async function onRequest(context) {
    // Use the correct environment variable name from .dev.vars
    const apiKey = context.env.WAVEFORM_API_KEY; 
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    // Get the request body
    const requestData = await context.request.json();
    
    // Forward the request to the new event API with your secret key
    const API_URL = "https://po8ob8r11k.execute-api.us-east-1.amazonaws.com/Prod/event/";
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ event_id: requestData.event_id })
      });
      
      if (!response.ok) {
        // Try to get more error details from the upstream API response
        let errorBody = `API responded with status: ${response.status}`;
        try {
            const upstreamError = await response.json();
            errorBody += ` - ${JSON.stringify(upstreamError)}`;
        } catch (e) {
            // Ignore if error body isn't JSON
        }
        throw new Error(errorBody);
      }
      
      // Parse the initial response from the upstream API
      const upstreamData = await response.json();

      // Check if the 'event' field exists and is a string (double-encoded JSON)
      if (upstreamData && typeof upstreamData.event === 'string') {
        try {
          // Parse the nested JSON string
          const parsedEvent = JSON.parse(upstreamData.event);
          
          // Return the *parsed event object* directly
          return new Response(JSON.stringify(parsedEvent), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (parseError) {
          console.error("Error parsing nested event JSON:", parseError);
          throw new Error("Failed to parse event data from upstream API");
        }
      } else if (upstreamData && typeof upstreamData.event === 'object') {
        // If 'event' is already an object (unlikely based on error, but good practice)
         return new Response(JSON.stringify(upstreamData.event), {
            headers: { "Content-Type": "application/json" }
          });
      } else {
         // If the response format is unexpected
         console.warn("Unexpected upstream API response format:", upstreamData);
         throw new Error("Unexpected data format received from upstream API");
      }

    } catch (error) {
      console.error("Error in Cloudflare worker:", error); // Log the detailed error server-side
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }