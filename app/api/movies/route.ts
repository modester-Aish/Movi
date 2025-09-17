import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Movie from '../../models/Movie';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const random = searchParams.get('random') === 'true';
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    
    if (category) {
      query.category = category;
    }
    
    if (country) {
      query.country = country;
    }

    let movies;

    if (random) {
      // Use MongoDB's $sample for random selection
      movies = await Movie.aggregate([
        { $match: query },
        { $sample: { size: limit } }
      ]);
    } else {
      movies = await Movie.find(query)
        .sort({ rating: -1, year: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    }
    const total = await Movie.countDocuments(query);

    return NextResponse.json({
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const movie = new Movie(body);
    await movie.save();

    return NextResponse.json(movie, { status: 201 });

  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}
