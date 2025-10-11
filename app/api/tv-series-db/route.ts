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
    
    // Filter parameters
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const maxRating = parseFloat(searchParams.get('maxRating') || '10');
    const minYear = parseInt(searchParams.get('minYear') || '1900');
    const maxYear = parseInt(searchParams.get('maxYear') || '2030');
    const genre = searchParams.get('genre');
    const category = searchParams.get('category');
    const year = parseInt(searchParams.get('year') || '0');

    const client = await clientPromise;
    const db = client.db('moviesDB');
    const collection = db.collection('tvSeries');

    // Build query filters
    const query: any = { 
      name: { $exists: true, $ne: null },
      vote_average: { $gte: minRating, $lte: maxRating }
    };

    // Year filter
    if (year > 0) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      query.first_air_date = { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] };
    } else {
      const startDate = new Date(`${minYear}-01-01`);
      const endDate = new Date(`${maxYear}-12-31`);
      query.first_air_date = { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] };
    }

    // Genre filter
    if (genre) {
      query.genres = genre;
    }

    // Category filter
    if (category) {
      query.categories = category;
    }

    // Get total count
    const total = await collection.countDocuments(query);

    // Fetch series with pagination and sorting
    const series = await collection
      .find(query)
      .sort({ [sortBy]: sortOrder, random_order: 1 }) // Add random for variety
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

