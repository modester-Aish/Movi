import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import MovieIds from '../../models/MovieIds';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Get all movie IDs from all documents
    const allMovieIdsDocs = await MovieIds.find({});
    
    if (!allMovieIdsDocs || allMovieIdsDocs.length === 0) {
      return NextResponse.json({
        movieIds: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }

    // Combine all imdb_ids from all documents without removing duplicates
    let allMovieIds: string[] = [];
    allMovieIdsDocs.forEach(doc => {
      if (doc.imdb_ids && Array.isArray(doc.imdb_ids)) {
        allMovieIds = [...allMovieIds, ...doc.imdb_ids];
      }
    });
    
    // Do not remove duplicates to keep all IDs
    // allMovieIds = [...new Set(allMovieIds)];
    
    const total = allMovieIds.length;
    console.log(`Total movie IDs: ${total}`);
    
    // Apply pagination
    const paginatedIds = allMovieIds.slice(skip, skip + limit);

    return NextResponse.json({
      movieIds: paginatedIds,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching movie IDs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie IDs' },
      { status: 500 }
    );
  }
}
