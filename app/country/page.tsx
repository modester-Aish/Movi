"use client";

import Link from "next/link";

export default function CountryPage() {
  const countries = [
    { name: "United States", slug: "us", count: "15,000+" },
    { name: "United Kingdom", slug: "uk", count: "3,500+" },
    { name: "India", slug: "india", count: "2,800+" },
    { name: "France", slug: "france", count: "2,200+" },
    { name: "Japan", slug: "japan", count: "1,900+" },
    { name: "South Korea", slug: "south-korea", count: "1,600+" },
    { name: "Germany", slug: "germany", count: "1,400+" },
    { name: "Italy", slug: "italy", count: "1,200+" },
    { name: "Spain", slug: "spain", count: "1,100+" },
    { name: "Canada", slug: "canada", count: "1,000+" },
    { name: "Australia", slug: "australia", count: "900+" },
    { name: "Brazil", slug: "brazil", count: "800+" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">Movies by Country</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/country/${country.slug}`}
              className="group bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-green-400 transition-colors">
                {country.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {country.count} movies
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
