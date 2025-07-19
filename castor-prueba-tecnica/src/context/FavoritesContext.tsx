"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoriteSong {
  id: string;
  spotifyId: string;
  name: string;
  artists: string;
  album: string;
  albumArt?: string;
  previewUrl?: string;
  externalUrl: string;
  createdAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteSong[];
  addFavorite: (song: Omit<FavoriteSong, 'id' | 'createdAt'>) => Promise<void>;
  removeFavorite: (favoriteId: string) => Promise<void>;
  isFavorite: (spotifyId: string) => boolean;
  refreshFavorites: () => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addFavorite = async (song: Omit<FavoriteSong, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotifyId: song.spotifyId,
          name: song.name,
          artists: song.artists,
          album: song.album,
          albumArt: song.albumArt,
          previewUrl: song.previewUrl,
          externalUrl: song.externalUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(prev => [data.favorite, ...prev]);
      } else if (response.status === 409) {
        // Song already in favorites, refresh the list
        await fetchFavorites();
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorite = (spotifyId: string) => {
    return favorites.some(fav => fav.spotifyId === spotifyId);
  };

  const refreshFavorites = async () => {
    await fetchFavorites();
  };

  const value: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    refreshFavorites,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 