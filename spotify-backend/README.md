# now-playing backend

A single serverless function that tells the portfolio what Mariam is listening
to on Spotify (or the last song she played). The site's girl-with-headphones
widget polls it every 30 seconds.

GitHub Pages can't keep secrets, so this tiny function lives on
[Vercel](https://vercel.com) (free) and holds the Spotify tokens for you.

## One-time setup (~10 minutes)

**1. Create a Spotify app** at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
→ *Create app*. Any name. Under **Redirect URIs** add exactly:

```
http://127.0.0.1:8888/callback
```

Save, then copy the **Client ID** and **Client Secret**.

**2. Get your refresh token** — in this folder run:

```
node get-refresh-token.js <client_id> <client_secret>
```

Open the printed URL, approve, and copy the `SPOTIFY_REFRESH_TOKEN` it prints.

**3. Deploy to Vercel** — in this folder:

```
npm i -g vercel
vercel login
vercel
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET
vercel env add SPOTIFY_REFRESH_TOKEN
vercel --prod
```

(Each `env add` asks for the value; choose *Production*.)

**4. Point the site at it** — in `js/content.js` set:

```js
music: {
  endpoint: "https://<your-project>.vercel.app/api/now-playing",
  ...
}
```

Commit, push, done. Play a song on Spotify and watch the girl start dancing.

## What it exposes

Only ever: track name, artist, album, cover URL, and a Spotify link —
never your account details. Response shape:

```json
{ "isPlaying": true, "title": "...", "artist": "...", "album": "...",
  "albumArt": "https://...", "trackId": "...", "trackUrl": "https://..." }
```
