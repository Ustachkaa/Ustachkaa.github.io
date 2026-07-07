/* ============================================================
   GET /api/now-playing — what Mariam is playing on Spotify.

   Deployed on Vercel (free). Needs three environment variables:
     SPOTIFY_CLIENT_ID
     SPOTIFY_CLIENT_SECRET
     SPOTIFY_REFRESH_TOKEN
   See ../README.md for the one-time setup.

   Response:
     { isPlaying, title, artist, album, albumArt, trackId, trackUrl }
   Falls back to the most recently played track when nothing is on.
   ============================================================ */

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

/* trim defensively: env values added from a Windows shell can
   arrive with a stray carriage return attached */
const env = (name) => (process.env[name] || "").trim();

async function getAccessToken() {
  const basic = Buffer.from(
    `${env("SPOTIFY_CLIENT_ID")}:${env("SPOTIFY_CLIENT_SECRET")}`
  ).toString("base64");

  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env("SPOTIFY_REFRESH_TOKEN")
    })
  });
  if (!r.ok) throw new Error(`token refresh failed: ${r.status}`);
  return (await r.json()).access_token;
}

function shape(track, isPlaying) {
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map(a => a.name).join(", "),
    album: track.album?.name || "",
    albumArt: track.album?.images?.[track.album.images.length - 1]?.url || "",
    trackId: track.id,
    trackUrl: track.external_urls?.spotify || ""
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=40");

  try {
    const token = await getAccessToken();
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    const now = await fetch(NOW_URL, auth);
    if (now.status === 200) {
      const j = await now.json();
      if (j?.item && j.currently_playing_type === "track") {
        return res.status(200).json(shape(j.item, Boolean(j.is_playing)));
      }
    }

    const recent = await fetch(RECENT_URL, auth);
    if (recent.ok) {
      const j = await recent.json();
      const track = j?.items?.[0]?.track;
      if (track) return res.status(200).json(shape(track, false));
    }

    return res.status(200).json({ isPlaying: false });
  } catch (e) {
    return res.status(502).json({
      error: String(e.message || e),
      env: {
        id: Boolean(process.env.SPOTIFY_CLIENT_ID),
        secret: Boolean(process.env.SPOTIFY_CLIENT_SECRET),
        refresh: Boolean(process.env.SPOTIFY_REFRESH_TOKEN)
      }
    });
  }
}
