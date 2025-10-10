import mongoose from 'mongoose';

export interface ITVSeries {
  tmdb_id: number;
  imdb_id?: string;
  name: string;
  original_name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  first_air_date?: string;
  last_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  vote_average?: number;
  genres?: string[];
  created_by?: string[];
  networks?: string[];
  origin_country?: string[];
  original_language?: string;
  popularity?: number;
  createdAt: Date;
  updatedAt: Date;
}

const tvSeriesSchema = new mongoose.Schema<ITVSeries>({
  tmdb_id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  imdb_id: {
    type: String,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  original_name: String,
  overview: String,
  poster_path: String,
  backdrop_path: String,
  first_air_date: String,
  last_air_date: String,
  number_of_seasons: Number,
  number_of_episodes: Number,
  status: String,
  vote_average: Number,
  genres: [String],
  created_by: [String],
  networks: [String],
  origin_country: [String],
  original_language: String,
  popularity: Number
}, {
  timestamps: true
});

// Indexes for efficient queries
tvSeriesSchema.index({ name: 'text' });
tvSeriesSchema.index({ vote_average: -1 });
tvSeriesSchema.index({ popularity: -1 });

export default mongoose.models.TVSeries || mongoose.model<ITVSeries>('TVSeries', tvSeriesSchema);


