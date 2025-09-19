/**
 * Get the current domain dynamically based on the request
 * This ensures canonical URLs always match the current domain
 */
export function getCurrentDomain(request?: Request): string {
  // In server-side rendering, use the request headers
  if (request) {
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    return `${protocol}://${host}`;
  }
  
  // In client-side or when no request is available, use window.location
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Fallback for build time or when neither is available
  return 'https://ww1.n123movie.me';
}

/**
 * Get the current domain for use in metadata generation
 * This is a simplified version that works in all contexts
 */
export function getBaseUrl(): string {
  // Check if we're in a server environment with headers
  if (typeof window === 'undefined') {
    // In server-side rendering, we'll use environment variables or fallback
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://ww1.n123movie.me';
  }
  
  // In client-side, use the current domain
  return `${window.location.protocol}//${window.location.host}`;
}

/**
 * Get the current domain for use in metadata generation during build time
 * This ensures the build process works correctly
 */
export function getBaseUrlForBuild(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://ww1.n123movie.me';
}
