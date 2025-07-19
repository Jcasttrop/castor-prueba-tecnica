"use client"

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SpotifyLikeButtonProps {
  spotifyUrl: string;
  trackName: string;
}

export default function SpotifyLikeButton({ spotifyUrl, trackName }: SpotifyLikeButtonProps) {
  const handleSpotifyLike = () => {
    // Open the song in Spotify in a new tab
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleSpotifyLike}
      className="group relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      title={`Open "${trackName}" in Spotify to like it`}
    >
      {/* Spotify logo background */}
      <div className="relative">
        <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        {/* Subtle glow effect */}
        <div className="absolute inset-0 h-4 w-4 rounded-full bg-white/20 blur-sm group-hover:bg-white/30 transition-all duration-200" />
      </div>
      
      <span className="font-medium">Like on Spotify</span>
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </button>
  );
} 