// Episode Mapping from VidSrc
// Format: tt0041038_1x1 (series_id_seasonxepisode)

export interface EpisodeInfo {
  seriesImdbId: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeImdbId: string;
}

// Parse episode line: "tt0041038_1x1" -> { seriesImdbId: "tt0041038", seasonNumber: 1, episodeNumber: 1 }
function parseEpisodeLine(line: string): EpisodeInfo | null {
  const match = line.match(/^(tt\d+)_(\d+)x(\d+)$/);
  if (!match) return null;
  
  return {
    seriesImdbId: match[1],
    seasonNumber: parseInt(match[2], 10),
    episodeNumber: parseInt(match[3], 10),
    episodeImdbId: line // Use the full line as episode ID for VidSrc
  };
}

// Get episodes for a specific series
export function getEpisodesForSeries(seriesImdbId: string): { [seasonNumber: number]: EpisodeInfo[] } {
  const episodesBySeason: { [seasonNumber: number]: EpisodeInfo[] } = {};
  
  // For now, return empty object - we'll populate this from the actual file
  // This will be populated when we process the episodes_raw.txt file
  return episodesBySeason;
}

// Get episodes for a specific series and season
export function getEpisodesForSeriesSeason(seriesImdbId: string, seasonNumber: number): EpisodeInfo[] {
  const allEpisodes = getEpisodesForSeries(seriesImdbId);
  return allEpisodes[seasonNumber] || [];
}
