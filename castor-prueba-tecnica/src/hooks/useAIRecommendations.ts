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

interface AIState {
  tracks: Track[];
  response: string;
  loading: boolean;
  error: string;
}

export function useAIRecommendations() {
  const [aiState, setAiState] = useState<AIState>({
    tracks: [],
    response: '',
    loading: false,
    error: '',
  });

  const getRecommendations = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setAiState({ tracks: [], response: '', loading: false, error: '' });
      return;
    }

    setAiState(prev => ({ ...prev, loading: true, error: '', response: '', tracks: [] }));

    try {
      const res = await fetch('/api/spotify/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.tracks) {
          setAiState({
            tracks: data.tracks,
            response: '',
            loading: false,
            error: '',
          });
        } else if (data.text) {
          setAiState({
            tracks: [],
            response: data.text,
            loading: false,
            error: '',
          });
        }
      } else {
        setAiState({
          tracks: [],
          response: '',
          loading: false,
          error: data.error || 'Failed to get recommendations',
        });
      }
    } catch (error) {
      setAiState({
        tracks: [],
        response: '',
        loading: false,
        error: 'Failed to fetch AI recommendations',
      });
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    setAiState({ tracks: [], response: '', loading: false, error: '' });
  }, []);

  return {
    ...aiState,
    getRecommendations,
    clearRecommendations,
  };
} 