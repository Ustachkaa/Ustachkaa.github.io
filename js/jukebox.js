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
  let embedTrackId = null;

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

  /* the embedded player mounts on demand so polling never
     restarts a song the visitor is already playing */
  function mountEmbed(trackId) {
    if (embedTrackId === trackId) return;
    embedTrackId = trackId;
    embedWrap.innerHTML =
      `<iframe src="https://open.spotify.com/embed/track/${encodeURIComponent(trackId)}?theme=0"
        width="100%" height="80" frameborder="0" title="Play this song on Spotify"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>`;
  }

  listenBtn.addEventListener("click", () => {
    if (!current || !current.trackId) return;
    mountEmbed(current.trackId);
    listenBtn.hidden = true;
  });

  toggle.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      poll();
      if (current && current.trackId && !embedTrackId) listenBtn.hidden = false;
    }
  });

  render(fallbackData());
  poll();
  setInterval(() => { if (!document.hidden) poll(); }, 30000);
})();
