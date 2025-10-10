// Series to Episodes Mapping
// This file maps TV series to their episodes based on the data you provided

import { TV_SERIES_IDS } from './tvSeriesIds';
import { EPISODE_IDS } from './episodeIds';

export interface SeriesEpisodeMapping {
  seriesImdbId: string;
  episodes: string[];
}

// Create mapping: Each series gets its own episodes
export function getEpisodesForSeries(seriesImdbId: string): string[] {
  // Find the series index in TV_SERIES_IDS
  const seriesIndex = TV_SERIES_IDS.indexOf(seriesImdbId);
  
  if (seriesIndex === -1) {
    return []; // Series not found
  }
  
  // Calculate how many episodes each series should have
  const episodesPerSeries = Math.floor(EPISODE_IDS.length / TV_SERIES_IDS.length);
  
  // Get episodes for this series (distribute episodes evenly)
  const startIndex = seriesIndex * episodesPerSeries;
  const endIndex = startIndex + episodesPerSeries;
  
  return EPISODE_IDS.slice(startIndex, endIndex);
}

// Alternative: Group episodes by series in chunks
export function getEpisodesForSeriesChunked(seriesImdbId: string): string[] {
  // Find the series index
  const seriesIndex = TV_SERIES_IDS.indexOf(seriesImdbId);
  
  if (seriesIndex === -1) {
    return []; // Series not found
  }
  
  // Each series gets 10 episodes (adjust as needed)
  const episodesPerSeries = 10;
  const startIndex = seriesIndex * episodesPerSeries;
  const endIndex = startIndex + episodesPerSeries;
  
  // If we go beyond available episodes, cycle back to start
  if (startIndex >= EPISODE_IDS.length) {
    const adjustedStartIndex = startIndex % EPISODE_IDS.length;
    const adjustedEndIndex = adjustedStartIndex + episodesPerSeries;
    
    if (adjustedEndIndex <= EPISODE_IDS.length) {
      return EPISODE_IDS.slice(adjustedStartIndex, adjustedEndIndex);
    } else {
      // Wrap around
      return [
        ...EPISODE_IDS.slice(adjustedStartIndex),
        ...EPISODE_IDS.slice(0, adjustedEndIndex - EPISODE_IDS.length)
      ];
    }
  }
  
  return EPISODE_IDS.slice(startIndex, Math.min(endIndex, EPISODE_IDS.length));
}

// Get all series with their episodes
export function getAllSeriesWithEpisodes(): SeriesEpisodeMapping[] {
  return TV_SERIES_IDS.map(seriesId => ({
    seriesImdbId: seriesId,
    episodes: getEpisodesForSeriesChunked(seriesId)
  }));
}
