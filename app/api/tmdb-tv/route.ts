import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = 'b31d2e5f33b74ffa7b3b483ff353f760';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('imdbId');

    if (!imdbId) {
      return NextResponse.json({ error: 'IMDB ID is required' }, { status: 400 });
    }

    // First, find TV series by IMDB ID
    const findResponse = await fetch(
      `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );

    if (!findResponse.ok) {
      throw new Error(`TMDB API error: ${findResponse.status}`);
    }

    const findData = await findResponse.json();
    
    if (!findData.tv_results || findData.tv_results.length === 0) {
      return NextResponse.json({ 
        error: 'TV series not found',
        imdbId: imdbId 
      }, { status: 404 });
    }

    const tvSeries = findData.tv_results[0];
    
    // Get detailed information
    const detailResponse = await fetch(
      `${TMDB_BASE_URL}/tv/${tvSeries.id}?api_key=${TMDB_API_KEY}`
    );

    if (!detailResponse.ok) {
      // Return basic info if detail fetch fails
      return NextResponse.json({
        id: tvSeries.id,
        imdb_id: imdbId,
        name: tvSeries.name || `TV Series ${imdbId}`,
        original_name: tvSeries.original_name || tvSeries.name,
        overview: tvSeries.overview || 'No overview available',
        poster_path: tvSeries.poster_path,
        backdrop_path: tvSeries.backdrop_path,
        first_air_date: tvSeries.first_air_date,
        vote_average: tvSeries.vote_average || 0,
        popularity: tvSeries.popularity || 0
      });
    }

    const detailData = await detailResponse.json();

    return NextResponse.json({
      id: detailData.id,
      imdb_id: imdbId,
      name: detailData.name || `TV Series ${imdbId}`,
      original_name: detailData.original_name || detailData.name,
      overview: detailData.overview || 'No overview available',
      poster_path: detailData.poster_path,
      backdrop_path: detailData.backdrop_path,
      first_air_date: detailData.first_air_date,
      last_air_date: detailData.last_air_date,
      number_of_seasons: detailData.number_of_seasons || 1,
      number_of_episodes: detailData.number_of_episodes || 0,
      status: detailData.status,
      vote_average: detailData.vote_average || 0,
      popularity: detailData.popularity || 0,
      genres: detailData.genres || []
    });

  } catch (error) {
    console.error('Error fetching TV series data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV series data' },
      { status: 500 }
    );
  }
}
