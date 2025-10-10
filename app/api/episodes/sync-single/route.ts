import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Episode from '@/models/Episode';
import TVSeries from '@/models/TVSeries';
import { getEpisodeByImdbId, getTVSeriesById } from '@/api/tmdb-tv';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('imdb_id');
    
    if (!imdbId) {
      return NextResponse.json(
        { error: 'IMDB ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Check if episode already exists
    const existingEpisode = await Episode.findOne({ episode_imdb_id: imdbId });
    
    if (existingEpisode) {
      return NextResponse.json({
        message: 'Episode already exists',
        episode: existingEpisode
      }, { status: 200 });
    }
    
    // Fetch episode data from TMDB
    const episodeData = await getEpisodeByImdbId(imdbId);
    
    if (!episodeData) {
      return NextResponse.json(
        { error: 'Episode not found in TMDB' },
        { status: 404 }
      );
    }
    
    // Save episode to database
    const episode = new Episode({
      episode_imdb_id: episodeData.imdb_id,
      tmdb_episode_id: episodeData.id,
      series_tmdb_id: episodeData.series_id,
      series_imdb_id: episodeData.series_imdb_id,
      series_name: episodeData.series_name,
      season_number: episodeData.season_number,
      episode_number: episodeData.episode_number,
      episode_name: episodeData.name,
      overview: episodeData.overview,
      still_path: episodeData.still_path,
      air_date: episodeData.air_date,
      vote_average: episodeData.vote_average,
      runtime: episodeData.runtime,
    });
    
    await episode.save();
    
    // Check if series exists in database, if not fetch and save it
    const existingSeries = await TVSeries.findOne({ tmdb_id: episodeData.series_id });
    
    if (!existingSeries) {
      const seriesData = await getTVSeriesById(episodeData.series_id);
      
      if (seriesData) {
        const series = new TVSeries({
          tmdb_id: seriesData.id,
          imdb_id: seriesData.imdb_id,
          name: seriesData.name,
          original_name: seriesData.original_name,
          overview: seriesData.overview,
          poster_path: seriesData.poster_path,
          backdrop_path: seriesData.backdrop_path,
          first_air_date: seriesData.first_air_date,
          last_air_date: seriesData.last_air_date,
          number_of_seasons: seriesData.number_of_seasons,
          number_of_episodes: seriesData.number_of_episodes,
          status: seriesData.status,
          vote_average: seriesData.vote_average,
          genres: seriesData.genres?.map(g => g.name) || [],
          created_by: seriesData.created_by?.map(c => c.name) || [],
          networks: seriesData.networks?.map(n => n.name) || [],
          origin_country: seriesData.origin_country,
          original_language: seriesData.original_language,
          popularity: seriesData.popularity,
        });
        
        await series.save();
      }
    }
    
    return NextResponse.json({
      message: 'Episode added successfully',
      series_name: episodeData.series_name,
      season: episodeData.season_number,
      episode: episodeData.episode_number,
      episode_name: episodeData.name
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error syncing single episode:', error);
    return NextResponse.json(
      { error: 'Failed to sync episode', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


