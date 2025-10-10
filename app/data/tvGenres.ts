// TV Series Genres - Static Data
export interface TVGenre {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export const TV_GENRES: TVGenre[] = [
  {
    id: 'action',
    name: 'Action',
    slug: 'action',
    description: 'High-energy TV shows with exciting sequences',
    count: 1250
  },
  {
    id: 'drama',
    name: 'Drama',
    slug: 'drama',
    description: 'Character-driven stories with emotional depth',
    count: 2100
  },
  {
    id: 'comedy',
    name: 'Comedy',
    slug: 'comedy',
    description: 'Humorous and entertaining TV series',
    count: 1800
  },
  {
    id: 'sci-fi',
    name: 'Science Fiction',
    slug: 'sci-fi',
    description: 'Futuristic and technology-based series',
    count: 450
  },
  {
    id: 'horror',
    name: 'Horror',
    slug: 'horror',
    description: 'Scary and suspenseful TV shows',
    count: 320
  },
  {
    id: 'thriller',
    name: 'Thriller',
    slug: 'thriller',
    description: 'Suspenseful and intense series',
    count: 680
  },
  {
    id: 'romance',
    name: 'Romance',
    slug: 'romance',
    description: 'Love stories and romantic relationships',
    count: 890
  },
  {
    id: 'mystery',
    name: 'Mystery',
    slug: 'mystery',
    description: 'Puzzle-solving and investigative series',
    count: 560
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    slug: 'fantasy',
    description: 'Magical and supernatural elements',
    count: 380
  },
  {
    id: 'crime',
    name: 'Crime',
    slug: 'crime',
    description: 'Criminal activities and law enforcement',
    count: 720
  },
  {
    id: 'adventure',
    name: 'Adventure',
    slug: 'adventure',
    description: 'Exciting journeys and exploration',
    count: 420
  },
  {
    id: 'family',
    name: 'Family',
    slug: 'family',
    description: 'Suitable for all family members',
    count: 650
  },
  {
    id: 'documentary',
    name: 'Documentary',
    slug: 'documentary',
    description: 'Real-world events and information',
    count: 280
  },
  {
    id: 'animation',
    name: 'Animation',
    slug: 'animation',
    description: 'Animated TV series and cartoons',
    count: 340
  },
  {
    id: 'reality',
    name: 'Reality',
    slug: 'reality',
    description: 'Unscripted real-life situations',
    count: 180
  }
];

// Helper function to get genre by slug
export function getTVGenreBySlug(slug: string): TVGenre | undefined {
  return TV_GENRES.find(genre => genre.slug === slug);
}

// Helper function to get all genres
export function getAllTVGenres(): TVGenre[] {
  return TV_GENRES;
}
