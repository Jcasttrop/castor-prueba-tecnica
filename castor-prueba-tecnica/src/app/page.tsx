"use client"

import Navbar from "@/components/ui/Navbar";
import FavoriteButton from "@/components/FavoriteButton";
import SpotifyLikeButton from "@/components/SpotifyLikeButton";
import React, { useState, useEffect } from "react";
import { Search, Sparkles, Clock, Music, Play, ExternalLink } from 'lucide-react';
import { useSearch } from "@/hooks/useSearch";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";

function UserSearchHistory() {
  const [history, setHistory] = useState<{ query: string; type?: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/spotify/user-stats");
        const data = await res.json();
        if (res.ok) {
          setHistory(data.history || []);
        } else {
          setError(data.error || "Failed to fetch search history");
        }
      } catch (err) {
        setError("Failed to fetch search history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const handleSearchClick = (query: string) => {
    const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
    window.open(spotifySearchUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
          <span>Loading search history...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
        <div className="flex items-center gap-2 text-red-600">
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  if (!history.length) {
    return (
      <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 mb-6 text-center">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No recent searches yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Your Recent Searches</h2>
      </div>
      
      <div className="grid gap-3">
        {history.map((item, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleSearchClick(item.query)}
                className="flex-1 text-left group-hover:text-blue-600 transition-colors"
                title={`Click to search "${item.query}" on Spotify`}
              >
                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.query}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {item.type || 'track'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </button>
              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  
  // Use custom hooks for state management
  const { results, loading, error, searchSongs } = useSearch();
  const { tracks: aiTracks, response: aiResponse, loading: aiLoading, error: aiError, getRecommendations } = useAIRecommendations();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchSongs(query);
  };

  const handleAIPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    await getRecommendations(aiPrompt);
  };

  const renderTrackList = (tracks: any[], title: string, icon: React.ReactNode) => (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{tracks.length} songs found</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {tracks.map((track: any) => (
          <div key={track.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-green-300 hover:shadow-lg">
            <div className="flex items-start gap-4">
              {/* Album Art */}
              <div className="relative flex-shrink-0">
                {track.albumArt ? (
                  <img 
                    src={track.albumArt} 
                    alt={track.album} 
                    className="h-16 w-16 rounded-lg shadow-md object-cover transition-transform duration-200 group-hover:scale-105" 
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                    <Music className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-all duration-200 group-hover:bg-black/20">
                  <Play className="h-6 w-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </div>
              </div>
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{track.name}</h4>
                <p className="text-sm text-gray-600 truncate">{track.artists}</p>
                <p className="text-xs text-gray-500 truncate">{track.album}</p>
                
                {/* Audio Player */}
                {track.previewUrl && (
                  <div className="mt-3">
                    <audio 
                      controls 
                      src={track.previewUrl} 
                      className="w-full h-8 rounded-lg"
                    />
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <FavoriteButton track={track} />
                <SpotifyLikeButton spotifyUrl={track.externalUrl} trackName={track.name} />
                <a
                  href={track.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/spotify flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover/spotify:scale-110" />
                  <span>Open</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl lg:text-6xl">
              Discover Your
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Perfect Music</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search for your favorite songs or let AI recommend new tracks based on your preferences
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Search Songs</h2>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                  placeholder="Enter song name, artist, or album..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-white font-medium shadow-lg transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {results.length > 0 && renderTrackList(results, "Search Results", <Search className="h-5 w-5 text-white" />)}
          
          {/* Search History */}
          <UserSearchHistory />
          
          {/* AI Section */}
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">AI Music Recommendations</h2>
            </div>
            
            <form onSubmit={handleAIPrompt} className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                  placeholder="Describe the music you want to discover..."
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={aiLoading}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 text-white font-medium shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-pink-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {aiLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Ask AI</span>
                  </>
                )}
              </button>
            </form>
            
            {aiError && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <span>{aiError}</span>
                </div>
              </div>
            )}
            
            {/* AI Recommendations */}
            {aiTracks.length > 0 && renderTrackList(aiTracks, "AI Recommendations", <Sparkles className="h-5 w-5 text-white" />)}
            
            {/* Fallback for plain text AI response */}
            {aiResponse && !aiTracks.length && (
              <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">AI Response</h3>
                </div>
                <p className="text-purple-800 whitespace-pre-line">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
