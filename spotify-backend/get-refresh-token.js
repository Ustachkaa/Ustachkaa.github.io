/* ============================================================
   One-time helper: get your Spotify refresh token.

   1. Create an app at https://developer.spotify.com/dashboard
      and add this Redirect URI in its settings (exactly):
        http://127.0.0.1:8888/callback
   2. Run:
        node get-refresh-token.js <client_id> <client_secret>
   3. A URL is printed — open it, approve, and the refresh
      token appears here. Paste it into Vercel's env vars.

   Needs Node 18+. Nothing is sent anywhere except Spotify.
   ============================================================ */

import http from "node:http";

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error("usage: node get-refresh-token.js <client_id> <client_secret>");
  process.exit(1);
}

const REDIRECT = "http://127.0.0.1:8888/callback";
const SCOPES = "user-read-currently-playing user-read-recently-played";

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT,
    scope: SCOPES
  });

console.log("\nOpen this URL in your browser and approve:\n\n" + authUrl + "\n");

http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== "/callback") { res.end(); return; }
  const code = url.searchParams.get("code");
  if (!code) { res.end("No code in callback."); return; }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT
    })
  });
  const j = await r.json();

  if (j.refresh_token) {
    res.end("Done! Your refresh token is in the terminal. You can close this tab.");
    console.log("\nSPOTIFY_REFRESH_TOKEN:\n\n" + j.refresh_token + "\n");
  } else {
    res.end("Something went wrong — check the terminal.");
    console.error("\nNo refresh token in response:", j);
  }
  process.exit(0);
}).listen(8888, "127.0.0.1", () =>
  console.log("Waiting for Spotify to redirect back on port 8888…")
);
