"use client"

import Navbar from "@/components/ui/Navbar";
import React, { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.tracks);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  const handleAIPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError("");
    setAiResponse("");
    try {
      const res = await fetch("/api/spotify/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiResponse(data.text);
      } else {
        setAiError(data.error || "Unknown error");
      }
    } catch (err) {
      setAiError("Failed to fetch AI response");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Spotify Song Search</h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            placeholder="Enter song name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <ul className="space-y-4">
          {results.map((track: any) => (
            <li key={track.id} className="flex items-center gap-4 border-b pb-4">
              {track.albumArt && (
                <img src={track.albumArt} alt={track.album} className="w-16 h-16 rounded shadow" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{track.name}</div>
                <div className="text-sm text-muted-foreground">{track.artists}</div>
                <div className="text-xs text-muted-foreground">{track.album}</div>
                {track.previewUrl && (
                  <audio controls src={track.previewUrl} className="mt-1" />
                )}
              </div>
              <a
                href={track.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Open in Spotify
              </a>
            </li>
          ))}
        </ul>
        {/* AI Prompt Section */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-2">Ask AI (OpenAI GPT-4 Turbo)</h2>
          <form onSubmit={handleAIPrompt} className="flex gap-2 mb-4">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Ask anything..."
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded disabled:opacity-50"
              disabled={aiLoading}
            >
              {aiLoading ? "Generating..." : "Ask"}
            </button>
          </form>
          {aiError && <div className="text-red-600 mb-2">{aiError}</div>}
          {aiResponse && (
            <div className="bg-gray-100 p-4 rounded shadow whitespace-pre-line">
              {aiResponse}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
