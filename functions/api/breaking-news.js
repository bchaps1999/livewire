export async function onRequest(context) {
    console.log("Breaking News API handler called with env:", JSON.stringify(context.env, null, 2));
    const apiKey = context.env.WAVEFORM_API_KEY;
    
    if (!apiKey) {
      console.error("WAVEFORM_API_KEY is missing from context.env in breaking-news.js");
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    // Get the request body
    const requestData = await context.request.json();
    console.log("Breaking News API request data:", JSON.stringify(requestData));
    
    // Forward the request to the actual API with your secret key
    const API_URL = "https://z4sqpmcefg.execute-api.us-east-1.amazonaws.com/Prod/events";
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Breaking News API responded with status: ${response.status}`, errorText);
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Breaking News API success, returning data");
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error in Breaking News API:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }