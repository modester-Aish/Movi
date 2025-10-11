// API Route: Search TV Series
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const client = await clientPromise;
    const db = client.db('moviesDB');
    const collection = db.collection('tvSeries');

    // Search TV series by name
    const series = await collection
      .find({
        name: { 
          $regex: query, 
          $options: 'i' // Case insensitive
        }
      })
      .limit(limit)
      .sort({ vote_average: -1 })
      .toArray();

    // Format for search results
    const searchResults = series.map(s => ({
      imdb_id: s.imdb_id,
      tmdb_id: s.tmdb_id,
      title: s.name,
      name: s.name,
      poster_path: s.poster_path,
      backdrop_path: s.backdrop_path,
      overview: s.overview,
      release_date: s.first_air_date,
      first_air_date: s.first_air_date,
      vote_average: s.vote_average,
      media_type: 'tv',
      episode_count: s.seasons?.reduce((sum: number, season: any) => sum + season.episodes.length, 0) || 0,
      number_of_seasons: s.number_of_seasons || s.seasons?.length || 0
    }));

    return NextResponse.json({
      success: true,
      data: searchResults
    });

  } catch (error) {
    console.error('Error searching TV series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search TV series' },
      { status: 500 }
    );
  }
}
