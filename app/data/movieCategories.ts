// Movie Categories for organizing 80k-90k movies
// This will replace the old category system and handle bulk movies efficiently

export const MOVIE_CATEGORIES = {
  // Main Categories for Homepage
  FEATURED: {
    name: 'Featured Movies',
    icon: '⭐',
    color: 'bg-yellow-500',
    description: 'Hand-picked best movies'
  },
  TRENDING: {
    name: 'Trending Now',
    icon: '🔥',
    color: 'bg-red-500',
    description: 'Most popular movies right now'
  },
  NEW_RELEASES: {
    name: 'New Releases',
    icon: '🆕',
    color: 'bg-green-500',
    description: 'Latest movie releases'
  },
  TOP_RATED: {
    name: 'Top Rated',
    icon: '🏆',
    color: 'bg-purple-500',
    description: 'Highest rated movies'
  },
  
  // Genre Categories
  ACTION: {
    name: 'Action',
    icon: '💥',
    color: 'bg-orange-500',
    description: 'Action and adventure movies'
  },
  DRAMA: {
    name: 'Drama',
    icon: '🎭',
    color: 'bg-blue-500',
    description: 'Dramatic and emotional stories'
  },
  COMEDY: {
    name: 'Comedy',
    icon: '😂',
    color: 'bg-yellow-400',
    description: 'Funny and entertaining movies'
  },
  THRILLER: {
    name: 'Thriller',
    icon: '😱',
    color: 'bg-red-600',
    description: 'Suspenseful and thrilling movies'
  },
  HORROR: {
    name: 'Horror',
    icon: '👻',
    color: 'bg-gray-800',
    description: 'Scary and horror movies'
  },
  ROMANCE: {
    name: 'Romance',
    icon: '💕',
    color: 'bg-pink-500',
    description: 'Love and romantic stories'
  },
  SCI_FI: {
    name: 'Sci-Fi',
    icon: '🚀',
    color: 'bg-indigo-500',
    description: 'Science fiction movies'
  },
  ANIMATION: {
    name: 'Animation',
    icon: '🎨',
    color: 'bg-teal-500',
    description: 'Animated movies and cartoons'
  },
  DOCUMENTARY: {
    name: 'Documentary',
    icon: '📹',
    color: 'bg-gray-600',
    description: 'Documentary films'
  },
  FAMILY: {
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-green-400',
    description: 'Family-friendly movies'
  }
};

export type CategoryKey = keyof typeof MOVIE_CATEGORIES;

// Function to get category info
export function getCategoryInfo(category: CategoryKey) {
  return MOVIE_CATEGORIES[category];
}

// Function to get all category keys
export function getAllCategoryKeys(): CategoryKey[] {
  return Object.keys(MOVIE_CATEGORIES) as CategoryKey[];
}

// Function to get homepage categories (first 4)
export function getHomepageCategories(): CategoryKey[] {
  return ['FEATURED', 'TRENDING', 'NEW_RELEASES', 'TOP_RATED'];
}

// Function to get genre categories
export function getGenreCategories(): CategoryKey[] {
  return ['ACTION', 'DRAMA', 'COMEDY', 'THRILLER', 'HORROR', 'ROMANCE', 'SCI_FI', 'ANIMATION', 'DOCUMENTARY', 'FAMILY'];
}
