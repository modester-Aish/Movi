import mongoose from 'mongoose';

export interface IEpisode {
  episode_imdb_id: string;
  tmdb_episode_id: number;
  series_tmdb_id: number;
  series_imdb_id?: string;
  series_name: string;
  season_number: number;
  episode_number: number;
  episode_name: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  vote_average?: number;
  runtime?: number;
  crew?: string[];
  guest_stars?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const episodeSchema = new mongoose.Schema<IEpisode>({
  episode_imdb_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  tmdb_episode_id: {
    type: Number,
    required: true,
    index: true
  },
  series_tmdb_id: {
    type: Number,
    required: true,
    index: true
  },
  series_imdb_id: {
    type: String,
    index: true
  },
  series_name: {
    type: String,
    required: true,
    index: true
  },
  season_number: {
    type: Number,
    required: true,
    index: true
  },
  episode_number: {
    type: Number,
    required: true,
    index: true
  },
  episode_name: {
    type: String,
    required: true
  },
  overview: String,
  still_path: String,
  air_date: String,
  vote_average: Number,
  runtime: Number,
  crew: [String],
  guest_stars: [String]
}, {
  timestamps: true
});

// Compound indexes for efficient queries
episodeSchema.index({ series_tmdb_id: 1, season_number: 1, episode_number: 1 });
episodeSchema.index({ series_name: 1, season_number: 1 });

export default mongoose.models.Episode || mongoose.model<IEpisode>('Episode', episodeSchema);


