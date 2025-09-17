import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!genre) {
      return NextResponse.json({ error: 'Genre parameter is required' }, { status: 400 });
    }

    await dbConnect();
    const db = require('mongoose').connection.db;
    const moviesCollection = db.collection('movies');

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Find movies by genre (case insensitive)
    const movies = await moviesCollection
      .find({ 
        $or: [
          { genre: { $regex: new RegExp(genre, 'i') } },
          { genres: { $regex: new RegExp(genre, 'i') } }
        ]
      })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await moviesCollection.countDocuments({ 
      $or: [
        { genre: { $regex: new RegExp(genre, 'i') } },
        { genres: { $regex: new RegExp(genre, 'i') } }
      ]
    });

    return NextResponse.json({
      movies,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
