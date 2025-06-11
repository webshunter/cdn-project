export async function onRequest(context) {
  // Handle OPTIONS request for CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // Get the response from the origin
    const response = await context.next();
    
    // Clone the response so we can modify headers
    const newResponse = new Response(response.body, response);
    
    // Set CORS headers
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    
    // Set content type for JavaScript files
    if (context.request.url.endsWith('.js')) {
      newResponse.headers.set('Content-Type', 'application/javascript');
    }
    
    return newResponse;
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
} 