// This file is no longer used - years data is now fetched dynamically from the API
// Keeping for backward compatibility

export const MOVIE_YEARS_DATA = {
  recent: [2025, 2024, 2023, 2022, 2021, 2020],
  decade2010s: [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010],
  decade2000s: [2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000],
  decade1990s: [1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990],
  decade1980s: [1989, 1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980],
  decade1970s: [1979, 1978, 1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970],
  decade1960s: [1969, 1968, 1967, 1966, 1965, 1964, 1963, 1962, 1961, 1960],
  decade1950s: [1959, 1958, 1957, 1956, 1955, 1954, 1953, 1952, 1951, 1950],
  decade1940s: [1949, 1948, 1947, 1946, 1945, 1944, 1943, 1942, 1941, 1940],
  decade1930s: [1939, 1938, 1937, 1936, 1935, 1934, 1933, 1932, 1931, 1930],
  decade1920s: [1929, 1928, 1927, 1926, 1925, 1924, 1923, 1922, 1921, 1920],
  decade1910s: [1919, 1918, 1917, 1916, 1915, 1914, 1913, 1912, 1911, 1910],
  decade1900s: [1909, 1908, 1907, 1906, 1905, 1904, 1903, 1902, 1901, 1900]
};

export const getYearsForDecade = (decade: string): number[] => {
  switch (decade) {
    case "2020s": return MOVIE_YEARS_DATA.recent;
    case "2010s": return MOVIE_YEARS_DATA.decade2010s;
    case "2000s": return MOVIE_YEARS_DATA.decade2000s;
    case "1990s": return MOVIE_YEARS_DATA.decade1990s;
    case "1980s": return MOVIE_YEARS_DATA.decade1980s;
    case "1970s": return MOVIE_YEARS_DATA.decade1970s;
    case "1960s": return MOVIE_YEARS_DATA.decade1960s;
    case "1950s": return MOVIE_YEARS_DATA.decade1950s;
    case "1940s": return MOVIE_YEARS_DATA.decade1940s;
    case "1930s": return MOVIE_YEARS_DATA.decade1930s;
    case "1920s": return MOVIE_YEARS_DATA.decade1920s;
    case "1910s": return MOVIE_YEARS_DATA.decade1910s;
    case "1900s": return MOVIE_YEARS_DATA.decade1900s;
    default: return [];
  }
};