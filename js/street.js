/* ============================================================
   STREET.JS — the Education Street overlay.
   A parallax night street you walk with ← → keys, drag, or the
   on-screen buttons. Milestones come from PORTFOLIO.education.
   Exposes: Street.open(), Street.close()
   ============================================================ */

const Street = (() => {
  const overlay  = document.getElementById("street");
  const far      = document.getElementById("street-far");
  const mid      = document.getElementById("street-mid");
  const front    = document.getElementById("street-front");
  const btnLeft  = document.getElementById("street-left");
  const btnRight = document.getElementById("street-right");
  const btnClose = document.getElementById("street-close");

  const GAP = 620;                 // distance between milestone lampposts
  const PAD = Math.max(window.innerWidth * 0.55, 500);
  const worldWidth = PAD * 2 + (PORTFOLIO.education.length - 1) * GAP;

  let camera = 0;
  let target = 0;
  let built = false;
  let rafId = null;
  let holdDir = 0;

  /* deterministic pseudo-random so the skyline never shifts between visits */
  function rng(seed) {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function build() {
    if (built) return;
    built = true;

    const rand = rng(42);
    const totalW = worldWidth + window.innerWidth;

    // far silhouettes
    for (let x = 0; x < totalW; x += 90 + rand() * 120) {
      const b = document.createElement("div");
      b.className = "bldg";
      b.style.left = x + "px";
      b.style.width = (60 + rand() * 110) + "px";
      b.style.height = (12 + rand() * 22) + "%";
      far.appendChild(b);
    }

    // mid buildings with lit windows
    for (let x = 0; x < totalW; x += 170 + rand() * 200) {
      const b = document.createElement("div");
      b.className = "bldg";
      b.style.left = x + "px";
      const w = 90 + rand() * 90;
      const h = 18 + rand() * 26;
      b.style.width = w + "px";
      b.style.height = h + "%";
      const windows = 2 + Math.floor(rand() * 5);
      for (let i = 0; i < windows; i++) {
        const win = document.createElement("i");
        win.style.left = (10 + rand() * (w - 26)) + "px";
        win.style.top = (12 + rand() * 60) + "%";
        win.style.opacity = .3 + rand() * .7;
        b.appendChild(win);
      }
      mid.appendChild(b);
    }

    // road
    const road = document.createElement("div");
    road.className = "street-road";
    road.style.width = totalW + "px";
    front.appendChild(road);

    // milestones
    PORTFOLIO.education.forEach((m, i) => {
      const el = document.createElement("div");
      el.className = "milestone";
      el.style.left = (PAD + i * GAP) + "px";
      el.innerHTML = `
        <div class="lamppost"></div>
        <div class="milestone-card">
          <p class="milestone-years">${m.years}</p>
          <p class="milestone-title">${m.title}</p>
          ${m.place ? `<p class="milestone-place">${m.place}</p>` : ""}
          ${m.note ? `<p class="milestone-note">${m.note}</p>` : ""}
        </div>`;
      front.appendChild(el);
    });

    // the walker orb, fixed at screen center
    const walker = document.createElement("div");
    walker.className = "walker";
    overlay.appendChild(walker);
  }

  /* the camera walks from the first lamppost to the last */
  function clamp(v) {
    return Math.min(Math.max(v, PAD), worldWidth - PAD);
  }

  function render() {
    camera += (target - camera) * 0.08;
    if (holdDir) target = clamp(target + holdDir * 14);
    far.style.transform   = `translateX(${-camera * 0.22}px)`;
    mid.style.transform   = `translateX(${-camera * 0.55}px)`;
    front.style.transform = `translateX(${window.innerWidth * 0.5 - camera}px)`;
    rafId = requestAnimationFrame(render);
  }

  function step(dir) {
    target = clamp(target + dir * 260);
  }

  function onKey(e) {
    if (overlay.hidden) return;
    if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    else if (e.key === "Escape") close();
  }

  /* drag / swipe */
  let dragX = null;
  function onDown(e) { dragX = (e.touches ? e.touches[0] : e).clientX; }
  function onMove(e) {
    if (dragX === null) return;
    const x = (e.touches ? e.touches[0] : e).clientX;
    target = clamp(target - (x - dragX) * 1.6);
    dragX = x;
  }
  function onUp() { dragX = null; }

  function hold(dir) { holdDir = dir; }
  function release() { holdDir = 0; }

  function open() {
    build();
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    camera = PAD;
    target = PAD;
    if (!rafId) rafId = requestAnimationFrame(render);
    btnClose.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  document.addEventListener("keydown", onKey);
  overlay.addEventListener("mousedown", onDown);
  overlay.addEventListener("mousemove", onMove);
  overlay.addEventListener("mouseup", onUp);
  overlay.addEventListener("mouseleave", onUp);
  overlay.addEventListener("touchstart", onDown, { passive: true });
  overlay.addEventListener("touchmove", onMove, { passive: true });
  overlay.addEventListener("touchend", onUp);

  btnLeft.addEventListener("mousedown", () => hold(-1));
  btnRight.addEventListener("mousedown", () => hold(1));
  btnLeft.addEventListener("touchstart", (e) => { e.preventDefault(); hold(-1); });
  btnRight.addEventListener("touchstart", (e) => { e.preventDefault(); hold(1); });
  ["mouseup", "mouseleave", "touchend"].forEach(ev => {
    btnLeft.addEventListener(ev, release);
    btnRight.addEventListener(ev, release);
  });
  btnLeft.addEventListener("click", () => step(-1));
  btnRight.addEventListener("click", () => step(1));
  btnClose.addEventListener("click", close);

  return { open, close };
})();
