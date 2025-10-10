import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TVSeries from '@/models/TVSeries';
import Episode from '@/models/Episode';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Get all series
    const series = await TVSeries.find({})
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await TVSeries.countDocuments();

    // Get episode count for each series
    const seriesWithCounts = await Promise.all(
      series.map(async (s) => {
        const episodeCount = await Episode.countDocuments({ series_tmdb_id: s.tmdb_id });
        return {
          ...s,
          episodeCount
        };
      })
    );

    return NextResponse.json({
      series: seriesWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    );
  }
}


