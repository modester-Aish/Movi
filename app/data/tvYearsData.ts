// TV Series Years Data

export interface TVYear {
  year: number;
  count: number;
  series: string[];
}

// Extract years from our TV series data
export const TV_YEARS_DATA: TVYear[] = [
  {
    year: 2024,
    count: 1,
    series: ["The Bear"]
  },
  {
    year: 2023,
    count: 1,
    series: ["The Last of Us"]
  },
  {
    year: 2022,
    count: 2,
    series: ["House of the Dragon", "Wednesday"]
  },
  {
    year: 2021,
    count: 1,
    series: ["Squid Game"]
  },
  {
    year: 2020,
    count: 0,
    series: []
  },
  {
    year: 2019,
    count: 3,
    series: ["The Mandalorian", "The Witcher", "The Boys", "Euphoria", "The Umbrella Academy"]
  },
  {
    year: 2018,
    count: 1,
    series: ["Cobra Kai"]
  },
  {
    year: 2017,
    count: 1,
    series: ["Ozark", "Money Heist"]
  },
  {
    year: 2016,
    count: 2,
    series: ["Stranger Things", "The Crown"]
  },
  {
    year: 2015,
    count: 1,
    series: ["Better Call Saul"]
  },
  {
    year: 2014,
    count: 0,
    series: []
  },
  {
    year: 2013,
    count: 1,
    series: ["Peaky Blinders"]
  },
  {
    year: 2012,
    count: 0,
    series: []
  },
  {
    year: 2011,
    count: 1,
    series: ["Game of Thrones"]
  },
  {
    year: 2010,
    count: 1,
    series: ["The Walking Dead"]
  },
  {
    year: 2009,
    count: 0,
    series: []
  },
  {
    year: 2008,
    count: 1,
    series: ["Breaking Bad"]
  },
  {
    year: 2005,
    count: 1,
    series: ["The Office"]
  },
  {
    year: 1994,
    count: 1,
    series: ["Friends"]
  }
];

// Helper function to get all years
export function getAllTVYears(): number[] {
  return TV_YEARS_DATA.map(yearData => yearData.year).sort((a, b) => b - a);
}

// Helper function to get years by decade
export function getTVYearsByDecade(): Array<{decade: string, years: number[]}> {
  const decades: {[key: string]: number[]} = {};
  
  TV_YEARS_DATA.forEach(yearData => {
    const decade = Math.floor(yearData.year / 10) * 10;
    const decadeKey = `${decade}s`;
    
    if (!decades[decadeKey]) {
      decades[decadeKey] = [];
    }
    decades[decadeKey].push(yearData.year);
  });
  
  return Object.entries(decades).map(([decade, years]) => ({
    decade,
    years: years.sort((a, b) => b - a)
  })).sort((a, b) => {
    const aDecade = parseInt(a.decade.replace('s', ''));
    const bDecade = parseInt(b.decade.replace('s', ''));
    return bDecade - aDecade;
  });
}

// Helper function to get year data by year
export function getTVYearData(year: number): TVYear | undefined {
  return TV_YEARS_DATA.find(yearData => yearData.year === year);
}
