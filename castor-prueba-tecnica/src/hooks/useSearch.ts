import { useState, useCallback } from 'react';

interface Track {
  id: string;
  name: string;
  artists: string;
  album: string;
  albumArt?: string;
  previewUrl?: string;
  externalUrl: string;
}

interface SearchState {
  results: Track[];
  loading: boolean;
  error: string;
}

export function useSearch() {
  const [searchState, setSearchState] = useState<SearchState>({
    results: [],
    loading: false,
    error: '',
  });

  const searchSongs = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchState({ results: [], loading: false, error: '' });
      return;
    }

    setSearchState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (res.ok) {
        setSearchState({
          results: data.tracks || [],
          loading: false,
          error: '',
        });
      } else {
        setSearchState({
          results: [],
          loading: false,
          error: data.error || 'Search failed',
        });
      }
    } catch (error) {
      setSearchState({
        results: [],
        loading: false,
        error: 'Failed to fetch results',
      });
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({ results: [], loading: false, error: '' });
  }, []);

  return {
    ...searchState,
    searchSongs,
    clearSearch,
  };
} 