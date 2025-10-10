import { NextResponse } from 'next/server';
import { getAllTVYears, getTVYearsByDecade } from '@/data/tvYearsData';

export async function GET() {
  try {
    const years = getAllTVYears();
    const decades = getTVYearsByDecade();
    
    return NextResponse.json({
      years,
      decades,
      totalYears: years.length,
      processedYears: years.length,
      foundYears: years.length
    });
  } catch (error) {
    console.error('Error fetching TV years:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV years' },
      { status: 500 }
    );
  }
}
