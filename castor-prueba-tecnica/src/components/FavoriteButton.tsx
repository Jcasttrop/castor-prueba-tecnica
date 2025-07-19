"use client"

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';

interface FavoriteButtonProps {
  track: {
    id: string;
    name: string;
    artists: string;
    album: string;
    albumArt?: string;
    previewUrl?: string;
    externalUrl: string;
  };
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({ track, onToggle }: FavoriteButtonProps) {
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentIsFavorite = isFavorite(track.id);

  const handleToggleFavorite = async () => {
    if (loading) return;
    
    setLoading(true);
    setIsAnimating(true);
    
    try {
      if (currentIsFavorite) {
        // Find the favorite ID to remove
        const favorite = favorites.find(fav => fav.spotifyId === track.id);
        if (favorite) {
          await removeFavorite(favorite.id);
          onToggle?.(false);
        }
      } else {
        // Add to favorites
        await addFavorite({
          spotifyId: track.id,
          name: track.name,
          artists: track.artists,
          album: track.album,
          albumArt: track.albumArt,
          previewUrl: track.previewUrl,
          externalUrl: track.externalUrl,
        });
        onToggle?.(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
      // Keep animation for a bit longer for visual feedback
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-out
        ${currentIsFavorite 
          ? 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25' 
          : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-pink-300 hover:bg-pink-50'
        }
        ${loading ? 'scale-95 cursor-not-allowed' : 'hover:scale-110 active:scale-95 cursor-pointer'}
        ${isAnimating && currentIsFavorite ? 'animate-pulse' : ''}
        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
      `}
      title={currentIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Background animation */}
      {isAnimating && !currentIsFavorite && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 animate-ping opacity-20" />
      )}
      
      {/* Heart icon */}
      <Heart 
        className={`
          h-5 w-5 transition-all duration-300 ease-out
          ${currentIsFavorite 
            ? 'text-white fill-current scale-110' 
            : 'text-gray-400 group-hover:text-pink-500 group-hover:scale-110'
          }
          ${loading ? 'animate-spin' : ''}
        `} 
      />
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
    </button>
  );
} 