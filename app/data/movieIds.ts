// Movie IDs organized by categories
// User can add their IMDB IDs here

export const MOVIE_CATEGORIES = {
  TODAY: [
    // Add your IMDB IDs here for Today's movies
    'tt0111161', // The Shawshank Redemption
    'tt0068646', // The Godfather
    'tt0071562', // The Godfather Part II
    'tt0468569', // The Dark Knight
    'tt0050083', // 12 Angry Men
    'tt0108052', // Schindler's List
    'tt0167260', // The Lord of the Rings: The Return of the King
    'tt0110912', // Pulp Fiction
    'tt0060196', // The Good, the Bad and the Ugly
    'tt0137523', // Fight Club
  ],
  
  WEEK: [
    // Add your IMDB IDs here for This Week's movies
    'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
    'tt0109830', // Forrest Gump
    'tt0167261', // The Lord of the Rings: The Two Towers
    'tt0080684', // Star Wars: Episode V - The Empire Strikes Back
    'tt1375666', // Inception
    'tt0099685', // Goodfellas
    'tt0073486', // One Flew Over the Cuckoo's Nest
    'tt0047478', // Seven Samurai
    'tt0114369', // Se7en
    'tt0317248', // City of God
  ],
  
  BEST: [
    // Add your IMDB IDs here for Best movies
    'tt0102926', // The Silence of the Lambs
    'tt0038650', // It's a Wonderful Life
    'tt0076759', // Star Wars: Episode IV - A New Hope
    'tt0118799', // Life Is Beautiful
    'tt0816692', // Interstellar
    'tt0114814', // The Usual Suspects
    'tt0120815', // Saving Private Ryan
    'tt0245429', // Spirited Away
    'tt0120689', // The Green Mile
    'tt0054215', // Psycho
  ],
  
  TRENDING: [
    // Add your IMDB IDs here for Trending movies
    'tt0021749', // The Gold Rush
    'tt0027977', // Modern Times
    'tt0253474', // The Pianist
    'tt0407887', // The Departed
    'tt0103064', // Terminator 2: Judgment Day
    'tt0172495', // Gladiator
    'tt0482571', // The Prestige
    'tt0110413', // Léon: The Professional
    'tt0088763', // Back to the Future
    'tt0078748', // Alien
  ]
};

// Function to get all movie IDs
export function getAllMovieIds(): string[] {
  return [
    ...MOVIE_CATEGORIES.TODAY,
    ...MOVIE_CATEGORIES.WEEK,
    ...MOVIE_CATEGORIES.BEST,
    ...MOVIE_CATEGORIES.TRENDING
  ];
}

// Function to get movie IDs by category
export function getMovieIdsByCategory(category: keyof typeof MOVIE_CATEGORIES): string[] {
  return MOVIE_CATEGORIES[category] || [];
}

// Function to add more movie IDs to a category
export function addMovieIdsToCategory(category: keyof typeof MOVIE_CATEGORIES, ids: string[]): void {
  MOVIE_CATEGORIES[category].push(...ids);
}