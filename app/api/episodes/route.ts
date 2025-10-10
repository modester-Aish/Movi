import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Episode from '@/models/Episode';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('series_id');
    const seasonNumber = searchParams.get('season');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    
    if (seriesId) {
      query.series_tmdb_id = parseInt(seriesId);
    }
    
    if (seasonNumber) {
      query.season_number = parseInt(seasonNumber);
    }

    const episodes = await Episode.find(query)
      .sort({ season_number: 1, episode_number: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Episode.countDocuments(query);

    return NextResponse.json({
      episodes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching episodes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
}


