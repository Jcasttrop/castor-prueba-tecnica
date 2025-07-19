"use client"

import React, { useState } from 'react';
import { Heart, ChevronDown, X, ExternalLink, Music } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';

export default function FavoritesDropdown() {
  const { favorites, removeFavorite, loading } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await removeFavorite(favoriteId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-pink-600 hover:to-rose-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        <Heart className="h-4 w-4" />
        <span>Favorites</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
          {favorites.length}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-3 w-96 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 z-50">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">My Favorites</h3>
                  <p className="text-xs text-gray-500">{favorites.length} songs saved</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent"></div>
                    <span>Loading favorites...</span>
                  </div>
                </div>
              ) : favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Music className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="mt-4 font-medium text-gray-900">No favorites yet</h4>
                  <p className="mt-1 text-sm text-gray-500">Start adding songs to your favorites!</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-pink-200 hover:shadow-md">
                      <div className="flex items-start gap-4">
                        {favorite.albumArt ? (
                          <img 
                            src={favorite.albumArt} 
                            alt={favorite.album} 
                            className="h-12 w-12 rounded-lg shadow-sm object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                            <Music className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{favorite.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{favorite.artists}</p>
                          <p className="text-xs text-gray-500 truncate">{favorite.album}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <a
                            href={favorite.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            title="Open in Spotify"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleRemoveFavorite(favorite.id)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Remove from favorites"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 