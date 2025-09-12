import mongoose from 'mongoose';

export interface IMovieIds {
  _id: mongoose.Types.ObjectId;
  imdb_ids: string[];
}

const movieIdsSchema = new mongoose.Schema<IMovieIds>({
  imdb_ids: {
    type: [String],
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Prevent duplicate models in development
export default mongoose.models.movie_ids || mongoose.model<IMovieIds>('movie_ids', movieIdsSchema);
