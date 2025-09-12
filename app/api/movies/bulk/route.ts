import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Movie from '../../../models/Movie';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { movies } = body;

    if (!movies || !Array.isArray(movies)) {
      return NextResponse.json(
        { error: 'Movies array is required' },
        { status: 400 }
      );
    }

    // Use bulkWrite for efficient insertion
    const operations = movies.map((movie: Record<string, unknown>) => ({
      updateOne: {
        filter: { imdbId: movie.imdbId },
        update: { $set: movie },
        upsert: true
      }
    }));

    const result = await Movie.bulkWrite(operations);

    return NextResponse.json({
      message: 'Bulk import completed',
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
      total: movies.length
    });

  } catch (error) {
    console.error('Error in bulk import:', error);
    return NextResponse.json(
      { error: 'Failed to import movies' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query: Record<string, unknown> = {};
    
    if (category) {
      query.category = category;
    }

    const result = await Movie.deleteMany(query);

    return NextResponse.json({
      message: 'Movies deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting movies:', error);
    return NextResponse.json(
      { error: 'Failed to delete movies' },
      { status: 500 }
    );
  }
}
