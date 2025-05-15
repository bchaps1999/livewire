export async function onRequest(context) {
  // Get API key for any needed authentication
  const apiKey = context.env.WAVEFORM_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Get the URL from the request body
    const requestData = await context.request.json();
    const url = requestData.url;
    const contextType = requestData.context || 'default';
    
    if (!url) {
      return new Response(JSON.stringify({ error: "URL parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Fetch the HTML content of the URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WaveformBot/1.0; +https://waveform.com)'
      },
      cf: {
        // Cache page for 1 hour (3600 seconds)
        cacheTtl: 3600,
        cacheEverything: true,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract metadata using regex
    const metadata = {
      title: extractMetaTag(html, 'og:title') || extractMetaTag(html, 'twitter:title') || extractTitle(html),
      description: extractMetaTag(html, 'og:description') || extractMetaTag(html, 'twitter:description') || extractMetaTag(html, 'description'),
      site_name: extractMetaTag(html, 'og:site_name')
    };
    
    // Only include image metadata if not in card context (to prevent image conflicts)
    if (contextType !== 'card') {
      metadata.image = extractMetaTag(html, 'og:image') || extractMetaTag(html, 'twitter:image');
    }

    return new Response(JSON.stringify(metadata), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "max-age=3600" // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error("Error in link preview function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Helper function to extract meta tags
function extractMetaTag(html, property) {
  // Check for Open Graph and Twitter Card meta tags
  const ogRegex = new RegExp(`<meta\\s+(?:property|name)=["']${property}["']\\s+content=["']([^"']+)["']`, 'i');
  const altRegex = new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+(?:property|name)=["']${property}["']`, 'i');
  
  const match = html.match(ogRegex) || html.match(altRegex);
  return match ? match[1] : null;
}

// Helper function to extract title
function extractTitle(html) {
  const titleRegex = /<title>(.*?)<\/title>/i;
  const match = html.match(titleRegex);
  return match ? match[1] : null;
}
