/* ============================================================
   JUKEBOX.JS — the girl with headphones in the corner.

   Shows what Mariam is listening to on Spotify right now, or
   the last song she played. Data comes from the endpoint set
   in PORTFOLIO.music.endpoint (see spotify-backend/README.md);
   without one it shows PORTFOLIO.music.fallback. "Listen with
   Mariam" opens Spotify's embedded player for the same track.
   ============================================================ */

(() => {
  "use strict";

  const cfg = (typeof PORTFOLIO !== "undefined" && PORTFOLIO.music) || {};
  const root = document.getElementById("jukebox");
  if (!root) return;

  const toggle = document.getElementById("jukebox-toggle");
  const panel = document.getElementById("jukebox-panel");
  const labelEl = document.getElementById("jukebox-label");
  const artEl = document.getElementById("jukebox-art");
  const titleEl = document.getElementById("jukebox-title");
  const artistEl = document.getElementById("jukebox-artist");
  const listenBtn = document.getElementById("jukebox-listen");
  const embedWrap = document.getElementById("jukebox-embed");

  let current = null;

  function fallbackData() {
    const f = cfg.fallback || {};
    return {
      isPlaying: false,
      title: f.title || "Nothing on right now",
      artist: f.artist || "",
      albumArt: f.albumArt || "",
      trackId: f.trackId || ""
    };
  }

  function render(d) {
    current = d;
    labelEl.textContent = d.isPlaying ? "Mariam is listening to" : "Mariam last played";
    titleEl.textContent = d.title;
    artistEl.textContent = d.artist;
    if (d.albumArt) { artEl.src = d.albumArt; artEl.hidden = false; }
    else artEl.hidden = true;
    root.classList.toggle("live", Boolean(d.isPlaying));
    listenBtn.hidden = !d.trackId;
    // Mariam moved on to another song: offer it fresh unless one is playing
    if (!isPlaying && loadedTrackId && d.trackId !== loadedTrackId) setButton("idle");
  }

  async function poll() {
    if (!cfg.endpoint) { render(fallbackData()); return; }
    try {
      const r = await fetch(cfg.endpoint, { cache: "no-store" });
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      if (!j || !j.title) throw new Error("empty");
      render(j);
    } catch (e) {
      if (!current) render(fallbackData());
    }
  }

  /* ---------- playback: Spotify's iframe API drives a hidden
     player, our button just shows play / pause and reacts ---------- */

  let controller = null;
  let loadedTrackId = null;
  let isPlaying = false;
  let apiPromise = null;

  function setButton(state) {
    // state: "idle" | "loading" | "playing" | "paused"
    listenBtn.disabled = state === "loading";
    listenBtn.textContent =
      state === "playing" ? "⏸ Pause" :
      state === "paused" ? "▶ Resume" :
      state === "loading" ? "· · ·" :
      "▶ Listen with Mariam";
    root.classList.toggle("audible", state === "playing");
  }

  function ensureApi() {
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      window.onSpotifyIframeApiReady = resolve;
      const s = document.createElement("script");
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      s.onerror = () => reject(new Error("spotify api blocked"));
      document.body.appendChild(s);
    });
    return apiPromise;
  }

  async function play(trackId) {
    setButton("loading");
    try {
      const api = await ensureApi();
      if (!controller) {
        await new Promise((resolve) => {
          const mount = document.createElement("div");
          embedWrap.appendChild(mount);
          api.createController(mount,
            { uri: `spotify:track:${trackId}`, width: "100%", height: "80" },
            (c) => {
              controller = c;
              controller.addListener("playback_update", (e) => {
                isPlaying = !e.data.isPaused;
                setButton(isPlaying ? "playing" : "paused");
              });
              controller.addListener("ready", resolve);
            });
        });
        loadedTrackId = trackId;
        controller.play();
      } else if (loadedTrackId !== trackId) {
        loadedTrackId = trackId;
        controller.loadUri(`spotify:track:${trackId}`);
        controller.play();
      } else {
        controller.togglePlay();
      }
    } catch (e) {
      // script blocked (ad blocker etc.) — open the track on Spotify instead
      setButton("idle");
      if (current && current.trackId)
        window.open(`https://open.spotify.com/track/${current.trackId}`, "_blank", "noopener");
    }
  }

  listenBtn.addEventListener("click", () => {
    if (!current || !current.trackId) return;
    if (controller && loadedTrackId === current.trackId) {
      controller.togglePlay();
    } else {
      play(current.trackId);
    }
  });

  toggle.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) poll();
  });

  render(fallbackData());
  poll();
  setInterval(() => { if (!document.hidden) poll(); }, 30000);
})();
