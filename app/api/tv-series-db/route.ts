// API Route: Fetch TV Series from MongoDB
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const sortBy = searchParams.get('sortBy') || 'first_air_date';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    const client = await clientPromise;
    const db = client.db('moviesDB');
    const collection = db.collection('tvSeries');

    // Get total count
    const total = await collection.countDocuments({ name: { $exists: true, $ne: null } });

    // Fetch series with pagination and sorting
    const series = await collection
      .find({ name: { $exists: true, $ne: null } })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: series,
      total,
      limit,
      skip
    });

  } catch (error) {
    console.error('Error fetching TV series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch TV series' },
      { status: 500 }
    );
  }
}

