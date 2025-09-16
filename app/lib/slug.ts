/**
 * Generate a URL-friendly slug from a movie title
 * @param title - The movie title
 * @returns URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate a complete movie URL with slug and IMDB ID
 * @param title - The movie title
 * @param imdbId - The IMDB ID
 * @returns Complete movie URL
 */
export function generateMovieUrl(title: string, imdbId: string): string {
  const slug = generateSlug(title);
  return `/${slug}-${imdbId}`;
}

/**
 * Extract IMDB ID from a movie URL slug
 * @param slug - The URL slug (e.g., "the-godfather-tt0068646")
 * @returns The IMDB ID
 */
export function extractImdbIdFromSlug(slug: string): string | null {
  // Match pattern: anything ending with tt followed by 7-8 digits
  const match = slug.match(/tt\d{7,8}$/);
  return match ? match[0] : null;
}

/**
 * Extract movie title from a movie URL slug
 * @param slug - The URL slug (e.g., "the-godfather-tt0068646")
 * @returns The movie title
 */
export function extractTitleFromSlug(slug: string): string {
  // Remove the IMDB ID part and convert back to title
  const titlePart = slug.replace(/tt\d{7,8}$/, '');
  return titlePart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate if a slug is properly formatted
 * @param slug - The URL slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidMovieSlug(slug: string): boolean {
  // Should contain IMDB ID pattern at the end
  return /tt\d{7,8}$/.test(slug);
}
