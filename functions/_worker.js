export function onRequest(context) {
  // Get the response from the origin
  const response = context.next();
  
  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, response);
  
  // Set CORS headers
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  
  return newResponse;
} 