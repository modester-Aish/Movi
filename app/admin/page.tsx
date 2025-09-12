"use client";

import { useState, useEffect } from "react";
import { getTotalMovieCount } from "../utils/movieIds";

export default function AdminPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [importStatus, setImportStatus] = useState<string>("");

  const categories = [
    'FEATURED', 'TRENDING', 'NEW_RELEASES', 'TOP_RATED',
    'ACTION', 'DRAMA', 'COMEDY', 'THRILLER', 'HORROR', 
    'ROMANCE', 'SCI_FI', 'ANIMATION', 'DOCUMENTARY', 'FAMILY'
  ];

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const statsData: Record<string, number> = {};
      
      // Get total count
      const totalCount = await getTotalMovieCount();
      statsData['TOTAL'] = totalCount;
      
      // For now, distribute movies across categories (you can modify this logic)
      const moviesPerCategory = Math.floor(totalCount / categories.length);
      for (const category of categories) {
        statsData[category] = moviesPerCategory;
      }
      
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const importSampleData = async () => {
    setImportStatus("Your MongoDB already contains movie IDs. No need to import sample data.");
    loadStats(); // Refresh stats
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear all movie IDs? This action cannot be undone.')) {
      return;
    }

    setImportStatus("This would clear your movie IDs. For safety, this action is disabled.");
    loadStats(); // Refresh stats
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
                     <h1 className="text-4xl font-bold text-white mb-4">MongoDB Admin Panel</h1>
           <p className="text-gray-300">Monitor your movie database statistics</p>
        </div>

        {/* Status Message */}
        {importStatus && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400">{importStatus}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
                       <button
               onClick={importSampleData}
               className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
             >
               Check Database
             </button>
                       <button
               onClick={clearAllData}
               className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
             >
               Clear Data (Disabled)
             </button>
          <button
            onClick={loadStats}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Refresh Stats
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
              <span className="ml-4 text-gray-400 text-lg">Loading statistics...</span>
            </div>
          ) : (
            <>
              {/* Total Movies */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Total Movies</h3>
                    <p className="text-3xl font-bold text-purple-400">{stats['TOTAL']?.toLocaleString() || 0}</p>
                  </div>
                  <div className="text-4xl">🎬</div>
                </div>
              </div>

              {/* Category Stats */}
              {categories.map((category) => (
                <div key={category} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{category}</h3>
                      <p className="text-2xl font-bold text-blue-400">{stats[category]?.toLocaleString() || 0}</p>
                    </div>
                    <div className="text-2xl">
                      {category === 'FEATURED' && '⭐'}
                      {category === 'TRENDING' && '🔥'}
                      {category === 'NEW_RELEASES' && '🆕'}
                      {category === 'TOP_RATED' && '🏆'}
                      {category === 'ACTION' && '💥'}
                      {category === 'DRAMA' && '🎭'}
                      {category === 'COMEDY' && '😂'}
                      {category === 'THRILLER' && '😱'}
                      {category === 'HORROR' && '👻'}
                      {category === 'ROMANCE' && '💕'}
                      {category === 'SCI_FI' && '🚀'}
                      {category === 'ANIMATION' && '🎨'}
                      {category === 'DOCUMENTARY' && '📹'}
                      {category === 'FAMILY' && '👨‍👩‍👧‍👦'}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Instructions</h3>
                     <div className="text-gray-300 space-y-2">
             <p>• <strong>Check Database:</strong> Verifies your MongoDB connection and data</p>
             <p>• <strong>Clear Data:</strong> Disabled for safety (protects your movie IDs)</p>
             <p>• <strong>Refresh Stats:</strong> Updates the statistics display</p>
             <p>• <strong>Your Data:</strong> Your 90K+ movie IDs are already in MongoDB</p>
           </div>
        </div>

        {/* API Endpoints */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">API Endpoints</h3>
                     <div className="text-gray-300 space-y-2 font-mono text-sm">
             <p>GET /api/movie-ids?limit=20&page=1</p>
             <p>GET /api/movies?category=FEATURED&limit=20</p>
             <p>GET /api/movies/search?q=inception</p>
             <p>Your MongoDB: Contains {stats['TOTAL'] || 0} movie IDs</p>
           </div>
        </div>
      </div>
    </div>
  );
}
