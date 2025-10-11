// API Route: Get All TV Genres
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('moviesDB');
    const collection = db.collection('tvGenres');

    const genres = await collection.find({}).sort({ series_count: -1 }).toArray();

    return NextResponse.json({
      success: true,
      data: genres
    });

  } catch (error) {
    console.error('Error fetching TV genres:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch TV genres' },
      { status: 500 }
    );
  }
}
