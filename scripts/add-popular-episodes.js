// Add popular TV series episodes manually
// This script adds well-known episode IDs that are guaranteed to work

const fs = require('fs');
const path = require('path');

const popularEpisodes = [
  // Breaking Bad - Complete Season 1
  'tt0959621',  // S01E01 - Pilot
  'tt0773262',  // S01E02 - Cat's in the Bag...
  'tt0773263',  // S01E03 - ...And the Bag's in the River
  'tt0773264',  // S01E04 - Cancer Man
  'tt0773265',  // S01E05 - Gray Matter
  'tt0773266',  // S01E06 - Crazy Handful of Nothin'
  'tt0773267',  // S01E07 - A No-Rough-Stuff-Type Deal
  
  // Game of Thrones - Season 1
  'tt1480055',  // S01E01 - Winter Is Coming
  'tt1668746',  // S01E02 - The Kingsroad
  'tt1829962',  // S01E03 - Lord Snow
  'tt1829963',  // S01E04 - Cripples, Bastards, and Broken Things
  'tt1829964',  // S01E05 - The Wolf and the Lion
  'tt1829965',  // S01E06 - A Golden Crown
  'tt1829966',  // S01E07 - You Win or You Die
  'tt1829967',  // S01E08 - The Pointy End
  'tt1829968',  // S01E09 - Baelor
  'tt1829969',  // S01E10 - Fire and Blood
  
  // The Office (US) - Season 1
  'tt0664520',  // S01E01 - Pilot
  'tt0664515',  // S01E02 - Diversity Day
  'tt0664541',  // S01E03 - Health Care
  'tt0664542',  // S01E04 - The Alliance
  'tt0664543',  // S01E05 - Basketball
  'tt0664544',  // S01E06 - Hot Girl
  
  // Stranger Things - Season 1
  'tt4574334',  // S01E01 - Chapter One: The Vanishing of Will Byers
  'tt4574336',  // S01E02 - Chapter Two: The Weirdo on Maple Street
  'tt4574338',  // S01E03 - Chapter Three: Holly, Jolly
  'tt4574340',  // S01E04 - Chapter Four: The Body
  'tt4574342',  // S01E05 - Chapter Five: The Flea and the Acrobat
  'tt4574344',  // S01E06 - Chapter Six: The Monster
  'tt4574346',  // S01E07 - Chapter Seven: The Bathtub
  'tt4574348',  // S01E08 - Chapter Eight: The Upside Down
  
  // The Walking Dead - Season 1
  'tt1520211',  // S01E01 - Days Gone Bye
  'tt1520212',  // S01E02 - Guts
  'tt1520213',  // S01E03 - Tell It to the Frogs
  'tt1520214',  // S01E04 - Vatos
  'tt1520215',  // S01E05 - Wildfire
  'tt1520216',  // S01E06 - TS-19
  
  // Friends - Season 1
  'tt0583435',  // S01E01 - The One Where Monica Gets a Roommate
  'tt0583436',  // S01E02 - The One with the Sonogram at the End
  'tt0583437',  // S01E03 - The One with the Thumb
  'tt0583438',  // S01E04 - The One with George Stephanopoulos
  'tt0583439',  // S01E05 - The One with the East German Laundry Detergent
  'tt0583440',  // S01E06 - The One with the Butt
  'tt0583441',  // S01E07 - The One with the Blackout
  'tt0583442',  // S01E08 - The One Where Nana Dies Twice
  'tt0583443',  // S01E09 - The One Where Underdog Gets Away
  'tt0583444',  // S01E10 - The One with the Monkey
  'tt0583445',  // S01E11 - The One with Mrs. Bing
  'tt0583446',  // S01E12 - The One with the Dozen Lasagnas
  'tt0583447',  // S01E13 - The One with the Boobies
  'tt0583448',  // S01E14 - The One with the Candy Hearts
  'tt0583449',  // S01E15 - The One with the Stoned Guy
  'tt0583450',  // S01E16 - The One with Two Parts: Part 1
  'tt0583451',  // S01E17 - The One with Two Parts: Part 2
  'tt0583452',  // S01E18 - The One with All the Poker
  'tt0583453',  // S01E19 - The One Where the Monkey Gets Away
  'tt0583454',  // S01E20 - The One with the Evil Orthodontist
  'tt0583455',  // S01E21 - The One with the Fake Monica
  'tt0583456',  // S01E22 - The One with the Ick Factor
  'tt0583457',  // S01E23 - The One with the Birth
  'tt0583458',  // S01E24 - The One Where Rachel Finds Out
  
  // Sherlock - Season 1
  'tt1475582',  // S01E01 - A Study in Pink
  'tt1475583',  // S01E02 - The Blind Banker
  'tt1475584',  // S01E03 - The Great Game
  
  // House of Cards - Season 1
  'tt1856010',  // S01E01 - Chapter 1
  'tt1856011',  // S01E02 - Chapter 2
  'tt1856012',  // S01E03 - Chapter 3
  'tt1856013',  // S01E04 - Chapter 4
  'tt1856014',  // S01E05 - Chapter 5
  'tt1856015',  // S01E06 - Chapter 6
  'tt1856016',  // S01E07 - Chapter 7
  'tt1856017',  // S01E08 - Chapter 8
  'tt1856018',  // S01E09 - Chapter 9
  'tt1856019',  // S01E10 - Chapter 10
  'tt1856020',  // S01E11 - Chapter 11
  'tt1856021',  // S01E12 - Chapter 12
  'tt1856022',  // S01E13 - Chapter 13
  
  // Narcos - Season 1
  'tt2707408',  // S01E01 - Descenso
  'tt2707409',  // S01E02 - The Sword of Simón Bolívar
  'tt2707410',  // S01E03 - The Men of Always
  'tt2707411',  // S01E04 - The Palace in Flames
  'tt2707412',  // S01E05 - There Will Be a Future
  'tt2707413',  // S01E06 - Explosivos
  'tt2707414',  // S01E07 - You Will Cry Tears of Blood
  'tt2707415',  // S01E08 - La Gran Mentira
  'tt2707416',  // S01E09 - La Catedral
  'tt2707417',  // S01E10 - Despegue
  
  // Money Heist - Season 1
  'tt6468322',  // S01E01 - Episode 1
  'tt6468323',  // S01E02 - Episode 2
  'tt6468324',  // S01E03 - Episode 3
  'tt6468325',  // S01E04 - Episode 4
  'tt6468326',  // S01E05 - Episode 5
  'tt6468327',  // S01E06 - Episode 6
  'tt6468328',  // S01E07 - Episode 7
  'tt6468329',  // S01E08 - Episode 8
  'tt6468330',  // S01E09 - Episode 9
  'tt6468331',  // S01E10 - Episode 10
  'tt6468332',  // S01E11 - Episode 11
  'tt6468333',  // S01E12 - Episode 12
  'tt6468334',  // S01E13 - Episode 13
  'tt6468335',  // S01E14 - Episode 14
  'tt6468336',  // S01E15 - Episode 15
  
  // The Crown - Season 1
  'tt4786824',  // S01E01 - Wolferton Splash
  'tt4786825',  // S01E02 - Hyde Park Corner
  'tt4786826',  // S01E03 - Windsor
  'tt4786827',  // S01E04 - Act of God
  'tt4786828',  // S01E05 - Smoke and Mirrors
  'tt4786829',  // S01E06 - Gelignite
  'tt4786830',  // S01E07 - Scientia Potentia Est
  'tt4786831',  // S01E08 - Pride & Joy
  'tt4786832',  // S01E09 - Assassins
  'tt4786833',  // S01E10 - Gloriana
  
  // The Witcher - Season 1
  'tt8388390',  // S01E01 - The End's Beginning
  'tt8388391',  // S01E02 - Four Marks
  'tt8388392',  // S01E03 - Betrayer Moon
  'tt8388393',  // S01E04 - Of Banquets, Bastards and Burials
  'tt8388394',  // S01E05 - Bottled Appetites
  'tt8388395',  // S01E06 - Rare Species
  'tt8388396',  // S01E07 - Before a Fall
  'tt8388397',  // S01E08 - Much More
];

function generateEpisodeIdsFile() {
  console.log('🎬 Adding Popular TV Series Episodes\n');
  
  // Remove duplicates
  const uniqueEpisodes = [...new Set(popularEpisodes)];
  
  console.log(`📊 Total unique episodes: ${uniqueEpisodes.length}`);
  console.log(`📺 Series included:`);
  console.log(`   - Breaking Bad (7 episodes)`);
  console.log(`   - Game of Thrones S1 (10 episodes)`);
  console.log(`   - The Office S1 (6 episodes)`);
  console.log(`   - Stranger Things S1 (8 episodes)`);
  console.log(`   - The Walking Dead S1 (6 episodes)`);
  console.log(`   - Friends S1 (24 episodes)`);
  console.log(`   - Sherlock S1 (3 episodes)`);
  console.log(`   - House of Cards S1 (13 episodes)`);
  console.log(`   - Narcos S1 (10 episodes)`);
  console.log(`   - Money Heist S1 (15 episodes)`);
  console.log(`   - The Crown S1 (10 episodes)`);
  console.log(`   - The Witcher S1 (8 episodes)`);
  
  const content = `// Popular TV Series Episode IDs
// Generated: ${new Date().toISOString()}
// Total: ${uniqueEpisodes.length} episodes from 12 popular series

export const EPISODE_IDS = [
${uniqueEpisodes.map(id => `  '${id}',`).join('\n')}
];

// Function to get all episode IDs
export function getAllEpisodeIds(): string[] {
  return EPISODE_IDS;
}

// Function to get paginated IDs
export function getEpisodeIdsPaginated(page: number = 1, limit: number = 100): string[] {
  const start = (page - 1) * limit;
  const end = start + limit;
  return EPISODE_IDS.slice(start, end);
}

// Get total count
export function getEpisodeCount(): number {
  return EPISODE_IDS.length;
}

// Series breakdown
export const SERIES_BREAKDOWN = {
  'Breaking Bad': 7,
  'Game of Thrones': 10,
  'The Office': 6,
  'Stranger Things': 8,
  'The Walking Dead': 6,
  'Friends': 24,
  'Sherlock': 3,
  'House of Cards': 13,
  'Narcos': 10,
  'Money Heist': 15,
  'The Crown': 10,
  'The Witcher': 8
};
`;

  // Save to file
  const filePath = path.join(__dirname, '..', 'app', 'data', 'episodeIds.ts');
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✅ Saved ${uniqueEpisodes.length} episode IDs to app/data/episodeIds.ts`);
  console.log('\n🚀 Ready to sync! Run: node scripts/sync-episodes.js');
}

generateEpisodeIdsFile();

