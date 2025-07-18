# Castor Prueba Tecnica

## 🎵 User Spotify Statistics & Charts

This app now displays your Spotify user statistics as interactive charts!

- **Top Artists** and **Top Tracks** are shown as bar charts on the main page (below the AI recommendations section).
- Data is fetched securely from Spotify using your authenticated session (requires Spotify OAuth and that your access token is stored in Supabase user metadata as `spotify_access_token`).
- Charts are powered by [Recharts](https://recharts.org/).

**How it works:**
- The backend route `/api/spotify/user-stats` fetches your top artists and tracks from Spotify.
- The frontend component `UserStatsCharts` displays this data as charts.

**Requirements:**
- You must be logged in and have connected your Spotify account.
- Your Supabase user metadata must include a valid `spotify_access_token`.

---
