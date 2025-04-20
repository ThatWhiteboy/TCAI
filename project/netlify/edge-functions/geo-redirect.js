export default async (request, context) => {
  // Get country from Netlify context
  const country = context.geo?.country?.code || 'US';
  const url = new URL(request.url);
  
  // Check if we should redirect based on country
  if (url.pathname === '/' && country !== 'US') {
    // Create a new URL for the redirect
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = `/${country.toLowerCase()}`;
    
    // Return a redirect response
    return Response.redirect(redirectUrl.toString(), 302);
  }
  
  // Add country info to request headers
  const response = await context.next();
  response.headers.set('X-Country', country);
  
  return response;
};