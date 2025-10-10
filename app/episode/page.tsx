import Link from "next/link";

export default function EpisodePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">TV Episodes</h1>
        <p className="text-gray-400 mb-6">Browse TV series to watch episodes</p>
        <Link 
          href="/series"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
        >
          Browse TV Series
        </Link>
      </div>
    </div>
  );
}


