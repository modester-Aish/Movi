const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Sample movie data with 90k+ movies structure
const sampleMovies = [
  // Featured Movies
  {
    imdbId: 'tt0111161',
    title: 'The Shawshank Redemption',
    year: 1994,
    category: 'FEATURED',
    genre: 'Drama',
    rating: 9.3,
    poster: '/posters/shawshank.jpg',
    backdrop: '/backdrops/shawshank.jpg',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    runtime: 142,
    language: 'en',
    status: 'Released',
    budget: 25000000,
    revenue: 58800000
  },
  {
    imdbId: 'tt0068646',
    title: 'The Godfather',
    year: 1972,
    category: 'FEATURED',
    genre: 'Crime',
    rating: 9.2,
    poster: '/posters/godfather.jpg',
    backdrop: '/backdrops/godfather.jpg',
    overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    runtime: 175,
    language: 'en',
    status: 'Released',
    budget: 6000000,
    revenue: 245066411
  },
  {
    imdbId: 'tt0468569',
    title: 'The Dark Knight',
    year: 2008,
    category: 'FEATURED',
    genre: 'Action',
    rating: 9.0,
    poster: '/posters/dark-knight.jpg',
    backdrop: '/backdrops/dark-knight.jpg',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    runtime: 152,
    language: 'en',
    status: 'Released',
    budget: 185000000,
    revenue: 1004558444
  },
  
  // Trending Movies
  {
    imdbId: 'tt1375666',
    title: 'Inception',
    year: 2010,
    category: 'TRENDING',
    genre: 'Sci-Fi',
    rating: 8.8,
    poster: '/posters/inception.jpg',
    backdrop: '/backdrops/inception.jpg',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    runtime: 148,
    language: 'en',
    status: 'Released',
    budget: 160000000,
    revenue: 836836967
  },
  {
    imdbId: 'tt0816692',
    title: 'Interstellar',
    year: 2014,
    category: 'TRENDING',
    genre: 'Sci-Fi',
    rating: 8.6,
    poster: '/posters/interstellar.jpg',
    backdrop: '/backdrops/interstellar.jpg',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    runtime: 169,
    language: 'en',
    status: 'Released',
    budget: 165000000,
    revenue: 677463813
  },
  
  // New Releases
  {
    imdbId: 'tt15398776',
    title: 'Oppenheimer',
    year: 2023,
    category: 'NEW_RELEASES',
    genre: 'Biography',
    rating: 8.4,
    poster: '/posters/oppenheimer.jpg',
    backdrop: '/backdrops/oppenheimer.jpg',
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    runtime: 180,
    language: 'en',
    status: 'Released',
    budget: 100000000,
    revenue: 950000000
  },
  {
    imdbId: 'tt6710474',
    title: 'Everything Everywhere All at Once',
    year: 2022,
    category: 'NEW_RELEASES',
    genre: 'Action',
    rating: 7.8,
    poster: '/posters/everything-everywhere.jpg',
    backdrop: '/backdrops/everything-everywhere.jpg',
    overview: 'A middle-aged Chinese immigrant is swept up into an insane adventure, where she alone can save what\'s important to her by connecting with the lives she could have led in other universes.',
    runtime: 139,
    language: 'en',
    status: 'Released',
    budget: 25000000,
    revenue: 140000000
  },
  
  // Top Rated
  {
    imdbId: 'tt0110912',
    title: 'Pulp Fiction',
    year: 1994,
    category: 'TOP_RATED',
    genre: 'Crime',
    rating: 8.9,
    poster: '/posters/pulp-fiction.jpg',
    backdrop: '/backdrops/pulp-fiction.jpg',
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    runtime: 154,
    language: 'en',
    status: 'Released',
    budget: 8000000,
    revenue: 213928762
  },
  {
    imdbId: 'tt0060196',
    title: 'The Good, the Bad and the Ugly',
    year: 1966,
    category: 'TOP_RATED',
    genre: 'Western',
    rating: 8.8,
    poster: '/posters/good-bad-ugly.jpg',
    backdrop: '/backdrops/good-bad-ugly.jpg',
    overview: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
    runtime: 161,
    language: 'it',
    status: 'Released',
    budget: 1200000,
    revenue: 25100000
  },
  
  // Action Movies
  {
    imdbId: 'tt0103064',
    title: 'Terminator 2: Judgment Day',
    year: 1991,
    category: 'ACTION',
    genre: 'Action',
    rating: 8.6,
    poster: '/posters/terminator2.jpg',
    backdrop: '/backdrops/terminator2.jpg',
    overview: 'A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten year old son John from an even more advanced and powerful cyborg.',
    runtime: 137,
    language: 'en',
    status: 'Released',
    budget: 102000000,
    revenue: 520000000
  },
  {
    imdbId: 'tt0172495',
    title: 'Gladiator',
    year: 2000,
    category: 'ACTION',
    genre: 'Action',
    rating: 8.5,
    poster: '/posters/gladiator.jpg',
    backdrop: '/backdrops/gladiator.jpg',
    overview: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    runtime: 155,
    language: 'en',
    status: 'Released',
    budget: 103000000,
    revenue: 460583960
  },
  
  // Drama Movies
  {
    imdbId: 'tt0109830',
    title: 'Forrest Gump',
    year: 1994,
    category: 'DRAMA',
    genre: 'Drama',
    rating: 8.8,
    poster: '/posters/forrest-gump.jpg',
    backdrop: '/backdrops/forrest-gump.jpg',
    overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    runtime: 142,
    language: 'en',
    status: 'Released',
    budget: 55000000,
    revenue: 677945399
  },
  {
    imdbId: 'tt0120815',
    title: 'Saving Private Ryan',
    year: 1998,
    category: 'DRAMA',
    genre: 'Drama',
    rating: 8.6,
    poster: '/posters/saving-private-ryan.jpg',
    backdrop: '/backdrops/saving-private-ryan.jpg',
    overview: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.',
    runtime: 169,
    language: 'en',
    status: 'Released',
    budget: 70000000,
    revenue: 481840909
  },
  
  // Comedy Movies
  {
    imdbId: 'tt0088763',
    title: 'Back to the Future',
    year: 1985,
    category: 'COMEDY',
    genre: 'Comedy',
    rating: 8.5,
    poster: '/posters/back-to-future.jpg',
    backdrop: '/backdrops/back-to-future.jpg',
    overview: 'Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown.',
    runtime: 116,
    language: 'en',
    status: 'Released',
    budget: 19000000,
    revenue: 381109762
  },
  {
    imdbId: 'tt0118715',
    title: 'The Big Lebowski',
    year: 1998,
    category: 'COMEDY',
    genre: 'Comedy',
    rating: 8.1,
    poster: '/posters/big-lebowski.jpg',
    backdrop: '/backdrops/big-lebowski.jpg',
    overview: 'Jeff "The Dude" Lebowski, mistaken for a millionaire of the same name, seeks restitution for his ruined rug and enlists his bowling buddies to help get it.',
    runtime: 117,
    language: 'en',
    status: 'Released',
    budget: 15000000,
    revenue: 46189568
  },
  
  // Thriller Movies
  {
    imdbId: 'tt0114369',
    title: 'Se7en',
    year: 1995,
    category: 'THRILLER',
    genre: 'Thriller',
    rating: 8.6,
    poster: '/posters/se7en.jpg',
    backdrop: '/backdrops/se7en.jpg',
    overview: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.',
    runtime: 127,
    language: 'en',
    status: 'Released',
    budget: 33000000,
    revenue: 327311859
  },
  {
    imdbId: 'tt0110413',
    title: 'Léon: The Professional',
    year: 1994,
    category: 'THRILLER',
    genre: 'Thriller',
    rating: 8.5,
    poster: '/posters/leon.jpg',
    backdrop: '/backdrops/leon.jpg',
    overview: 'Mathilda, a 12-year-old girl, is reluctantly taken in by Léon, a professional assassin, after her family is murdered.',
    runtime: 110,
    language: 'en',
    status: 'Released',
    budget: 16000000,
    revenue: 19500000
  },
  
  // Horror Movies
  {
    imdbId: 'tt0078748',
    title: 'Alien',
    year: 1979,
    category: 'HORROR',
    genre: 'Horror',
    rating: 8.4,
    poster: '/posters/alien.jpg',
    backdrop: '/backdrops/alien.jpg',
    overview: 'The crew of a commercial spacecraft encounter a deadly lifeform after investigating a mysterious transmission of unknown origin.',
    runtime: 117,
    language: 'en',
    status: 'Released',
    budget: 11000000,
    revenue: 104931801
  },
  {
    imdbId: 'tt0081505',
    title: 'The Shining',
    year: 1980,
    category: 'HORROR',
    genre: 'Horror',
    rating: 8.4,
    poster: '/posters/shining.jpg',
    backdrop: '/backdrops/shining.jpg',
    overview: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.',
    runtime: 146,
    language: 'en',
    status: 'Released',
    budget: 19000000,
    revenue: 44017374
  },
  
  // Romance Movies
  {
    imdbId: 'tt0118799',
    title: 'Life Is Beautiful',
    year: 1997,
    category: 'ROMANCE',
    genre: 'Romance',
    rating: 8.6,
    poster: '/posters/life-is-beautiful.jpg',
    backdrop: '/backdrops/life-is-beautiful.jpg',
    overview: 'When an open-minded Jewish librarian and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son from the dangers around their camp.',
    runtime: 116,
    language: 'it',
    status: 'Released',
    budget: 20000000,
    revenue: 229163264
  },
  {
    imdbId: 'tt0112573',
    title: 'Braveheart',
    year: 1995,
    category: 'ROMANCE',
    genre: 'Romance',
    rating: 8.3,
    poster: '/posters/braveheart.jpg',
    backdrop: '/backdrops/braveheart.jpg',
    overview: 'Scottish warrior William Wallace leads his countrymen in a rebellion to free his homeland from the tyranny of King Edward I of England.',
    runtime: 178,
    language: 'en',
    status: 'Released',
    budget: 72000000,
    revenue: 210409945
  },
  
  // Sci-Fi Movies
  {
    imdbId: 'tt0076759',
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
    category: 'SCI_FI',
    genre: 'Sci-Fi',
    rating: 8.6,
    poster: '/posters/star-wars.jpg',
    backdrop: '/backdrops/star-wars.jpg',
    overview: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station.',
    runtime: 121,
    language: 'en',
    status: 'Released',
    budget: 11000000,
    revenue: 775398007
  },
  {
    imdbId: 'tt0080684',
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
    category: 'SCI_FI',
    genre: 'Sci-Fi',
    rating: 8.7,
    poster: '/posters/empire-strikes-back.jpg',
    backdrop: '/backdrops/empire-strikes-back.jpg',
    overview: 'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda.',
    runtime: 124,
    language: 'en',
    status: 'Released',
    budget: 18000000,
    revenue: 538375067
  },
  
  // Animation Movies
  {
    imdbId: 'tt0245429',
    title: 'Spirited Away',
    year: 2001,
    category: 'ANIMATION',
    genre: 'Animation',
    rating: 8.6,
    poster: '/posters/spirited-away.jpg',
    backdrop: '/backdrops/spirited-away.jpg',
    overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    runtime: 125,
    language: 'ja',
    status: 'Released',
    budget: 15000000,
    revenue: 395802706
  },
  {
    imdbId: 'tt0114709',
    title: 'Toy Story',
    year: 1995,
    category: 'ANIMATION',
    genre: 'Animation',
    rating: 8.3,
    poster: '/posters/toy-story.jpg',
    backdrop: '/backdrops/toy-story.jpg',
    overview: 'A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy\'s room.',
    runtime: 81,
    language: 'en',
    status: 'Released',
    budget: 30000000,
    revenue: 373554033
  },
  
  // Documentary Movies
  {
    imdbId: 'tt0111161',
    title: 'The Last Dance',
    year: 2020,
    category: 'DOCUMENTARY',
    genre: 'Documentary',
    rating: 9.1,
    poster: '/posters/last-dance.jpg',
    backdrop: '/backdrops/last-dance.jpg',
    overview: 'Charting the rise of the 1990\'s Chicago Bulls, led by Michael Jordan, one of the most notable dynasties in sports history.',
    runtime: 50,
    language: 'en',
    status: 'Released',
    budget: 0,
    revenue: 0
  },
  {
    imdbId: 'tt0111162',
    title: 'Planet Earth',
    year: 2006,
    category: 'DOCUMENTARY',
    genre: 'Documentary',
    rating: 9.4,
    poster: '/posters/planet-earth.jpg',
    backdrop: '/backdrops/planet-earth.jpg',
    overview: 'Emmy Award-winning, 11 episodes, five years in the making, the most expensive nature documentary series ever commissioned by the BBC.',
    runtime: 50,
    language: 'en',
    status: 'Released',
    budget: 25000000,
    revenue: 0
  },
  
  // Family Movies
  {
    imdbId: 'tt0111163',
    title: 'The Lion King',
    year: 1994,
    category: 'FAMILY',
    genre: 'Family',
    rating: 8.5,
    poster: '/posters/lion-king.jpg',
    backdrop: '/backdrops/lion-king.jpg',
    overview: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    runtime: 88,
    language: 'en',
    status: 'Released',
    budget: 45000000,
    revenue: 968483777
  },
  {
    imdbId: 'tt0111164',
    title: 'Finding Nemo',
    year: 2003,
    category: 'FAMILY',
    genre: 'Family',
    rating: 8.1,
    poster: '/posters/finding-nemo.jpg',
    backdrop: '/backdrops/finding-nemo.jpg',
    overview: 'After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.',
    runtime: 100,
    language: 'en',
    status: 'Released',
    budget: 94000000,
    revenue: 940335536
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Import movies
async function importMovies() {
  try {
    await connectDB();
    
    // Import movies in batches
    const batchSize = 100;
    for (let i = 0; i < sampleMovies.length; i += batchSize) {
      const batch = sampleMovies.slice(i, i + batchSize);
      
      // Use bulkWrite for efficient insertion
      const operations = batch.map(movie => ({
        updateOne: {
          filter: { imdbId: movie.imdbId },
          update: { $set: movie },
          upsert: true
        }
      }));
      
      const result = await mongoose.connection.db.collection('movies').bulkWrite(operations);
      console.log(`Batch ${Math.floor(i/batchSize) + 1}: Inserted ${result.upsertedCount}, Modified ${result.modifiedCount}`);
    }
    
    console.log('Sample movies imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing movies:', error);
    process.exit(1);
  }
}

importMovies();
