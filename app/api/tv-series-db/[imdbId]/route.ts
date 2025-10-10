// API Route: Fetch Single TV Series by IMDB ID from MongoDB
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { imdbId: string } }
) {
  try {
    const { imdbId } = params;

    const client = await clientPromise;
    const db = client.db('moviesDB');
    const collection = db.collection('tvSeries');

    const series = await collection.findOne({ imdb_id: imdbId });

    if (!series) {
      return NextResponse.json(
        { success: false, error: 'Series not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: series
    });

  } catch (error) {
    console.error('Error fetching TV series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch TV series' },
      { status: 500 }
    );
  }
}

