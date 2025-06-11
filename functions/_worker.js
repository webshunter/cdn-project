export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Handle OPTIONS request for CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': 'https://appstore.gugusdarmayanto.my.id',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // Get the response from the origin
    const response = await context.next();
    
    // Create new response with modified headers
    const newHeaders = new Headers(response.headers);
    
    // Set CORS headers only if they don't exist
    if (!newHeaders.has('Access-Control-Allow-Origin')) {
      newHeaders.set('Access-Control-Allow-Origin', 'https://appstore.gugusdarmayanto.my.id');
    }
    if (!newHeaders.has('Access-Control-Allow-Methods')) {
      newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    }
    if (!newHeaders.has('Access-Control-Allow-Headers')) {
      newHeaders.set('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    }
    
    // Set content type for JavaScript files
    if (url.pathname.endsWith('.js')) {
      newHeaders.set('Content-Type', 'application/javascript');
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
} 