import { notFound } from 'next/navigation';

// Helper function to extract episode ID from slug
function extractEpisodeIdFromSlug(slug: string): string | null {
  // Match both old format (tt0959621) and new format (tt0903747_1x1)
  const match = slug.match(/(tt\d+)(?:_\d+x\d+)?$/);
  return match ? match[1] : null;
}

export default async function EpisodePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const episodeId = extractEpisodeIdFromSlug(slug);
  
  if (!episodeId) {
    notFound();
  }
  
  // Static data lookup removed - episode pages will use MongoDB API
  // For now, return 404 until MongoDB episode API is implemented
  notFound(); // Temporary - will implement MongoDB episode lookup later
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const episodeId = extractEpisodeIdFromSlug(slug);
  
  if (!episodeId) {
    return {
      title: 'Episode Not Found',
      description: 'The requested episode could not be found.',
    };
  }
  
  // Static data lookup removed - using MongoDB API instead
  // Return default metadata for episode pages
  
  return {
    title: 'Episode Not Found',
    description: 'The requested episode could not be found.',
  };
}