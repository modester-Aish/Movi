import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get('imdbId');

  if (!imdbId) {
    return NextResponse.json({ error: 'IMDB ID is required' }, { status: 400 });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB_API_KEY is not set' }, { status: 500 });
  }

  try {
    // First, find the episode by IMDb ID
    const findResponse = await fetch(
      `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );
    const findData = await findResponse.json();

    if (!findResponse.ok) {
      console.error(`TMDB Find API error for ${imdbId}:`, findData);
      return NextResponse.json({ error: 'Failed to find episode on TMDB' }, { status: findResponse.status });
    }

    const tvEpisodeResults = findData.tv_episode_results;

    if (!tvEpisodeResults || tvEpisodeResults.length === 0) {
      return NextResponse.json({ error: 'Episode not found on TMDB' }, { status: 404 });
    }

    const episode = tvEpisodeResults[0];

    return NextResponse.json(episode);
  } catch (error) {
    console.error('Error in TMDB Episode API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
