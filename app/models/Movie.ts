import mongoose from 'mongoose';

export interface IMovie {
  imdbId: string;
  title: string;
  year?: number;
  category: string;
  genre?: string;
  rating?: number;
  poster?: string;
  backdrop?: string;
  overview?: string;
  runtime?: number;
  language?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new mongoose.Schema<IMovie>({
  imdbId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  year: {
    type: Number,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'FEATURED', 'TRENDING', 'NEW_RELEASES', 'TOP_RATED',
      'ACTION', 'DRAMA', 'COMEDY', 'THRILLER', 'HORROR', 
      'ROMANCE', 'SCI_FI', 'ANIMATION', 'DOCUMENTARY', 'FAMILY'
    ],
    index: true
  },
  genre: {
    type: String,
    index: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  poster: String,
  backdrop: String,
  overview: String,
  runtime: Number,
  language: String,
  status: String,
  budget: Number,
  revenue: Number
}, {
  timestamps: true
});

// Compound index for efficient category queries
movieSchema.index({ category: 1, rating: -1 });
movieSchema.index({ category: 1, year: -1 });

// Prevent duplicate models in development
export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', movieSchema);
