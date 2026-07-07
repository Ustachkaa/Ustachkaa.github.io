/* ============================================================
   CAT.JS — the orange cat who lives at the bottom of the page.

   He watches your cursor, swats at it when it comes close,
   narrows his eyes in judgement when you shake the mouse,
   blinks occasionally, wanders to a new spot now and then,
   and falls asleep if you leave him alone. He never blocks a
   click — he is decoration with opinions.
   ============================================================ */

(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- the cat ---------- */

  const root = document.createElement("div");
  root.className = "cat";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <span class="cat-zzz">z z z</span>
    <svg viewBox="0 0 120 110" width="96" height="88" xmlns="http://www.w3.org/2000/svg">
      <!-- tail -->
      <g class="cat-tail">
        <path d="M0 0 Q24 -6 19 -36" fill="none" stroke="#E8913A" stroke-width="9" stroke-linecap="round"/>
        <path d="M8 -10 l6 3 M13 -22 l6 2" stroke="#C96F23" stroke-width="3" stroke-linecap="round"/>
      </g>
      <!-- body -->
      <ellipse cx="60" cy="82" rx="32" ry="26" fill="#E8913A"/>
      <path d="M32 74 q8 4 12 12 M88 74 q-8 4 -12 12" stroke="#C96F23" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="90" rx="13" ry="15" fill="#F7E8D6"/>
      <!-- forelegs (each can swat) -->
      <g class="cat-leg cat-leg-left">
        <rect x="44" y="76" width="9" height="28" rx="4.5" fill="#E8913A"/>
        <ellipse cx="48.5" cy="103" rx="6" ry="4.5" fill="#F7E8D6"/>
      </g>
      <g class="cat-leg cat-leg-right">
        <rect x="67" y="76" width="9" height="28" rx="4.5" fill="#E8913A"/>
        <ellipse cx="71.5" cy="103" rx="6" ry="4.5" fill="#F7E8D6"/>
      </g>
      <!-- head -->
      <g class="cat-head">
        <polygon points="38,26 43,3 57,19" fill="#E8913A"/>
        <polygon points="82,26 77,3 63,19" fill="#E8913A"/>
        <polygon points="42,21 45,9 53,18" fill="#F2A9B8"/>
        <polygon points="78,21 75,9 67,18" fill="#F2A9B8"/>
        <circle cx="60" cy="40" r="24" fill="#E8913A"/>
        <path d="M52 18 v7 M60 16 v8 M68 18 v7" stroke="#C96F23" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="60" cy="52" rx="13" ry="9" fill="#F7E8D6"/>
        <!-- eyes -->
        <g class="cat-eye">
          <ellipse cx="50" cy="38" rx="5.5" ry="6" fill="#F5F2E8"/>
          <g class="cat-pupil"><ellipse cx="50" cy="38.5" rx="2.4" ry="3.6" fill="#14101E"/></g>
          <rect class="cat-lid" x="43" y="29" width="14" height="6.5" rx="3" fill="#E8913A"/>
        </g>
        <g class="cat-eye">
          <ellipse cx="70" cy="38" rx="5.5" ry="6" fill="#F5F2E8"/>
          <g class="cat-pupil"><ellipse cx="70" cy="38.5" rx="2.4" ry="3.6" fill="#14101E"/></g>
          <rect class="cat-lid" x="63" y="29" width="14" height="6.5" rx="3" fill="#E8913A"/>
        </g>
        <!-- nose, mouth, whiskers -->
        <polygon points="57,48 63,48 60,52" fill="#F2A9B8"/>
        <path d="M60 52 q0 3 -4 4 M60 52 q0 3 4 4" stroke="#C96F23" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M44 48 h-12 M45 52 l-11 3 M76 48 h12 M75 52 l11 3" stroke="#F5F2E8" stroke-width="1.2" opacity=".7"/>
      </g>
    </svg>`;
  document.body.appendChild(root);

  const svg = root.querySelector("svg");
  const head = root.querySelector(".cat-head");
  const pupils = root.querySelectorAll(".cat-pupil");
  const legL = root.querySelector(".cat-leg-left");
  const legR = root.querySelector(".cat-leg-right");

  /* ---------- state ---------- */
  /* he lives next to the girl with the headphones (position in CSS) */

  let mouseX = -1, mouseY = -1;
  let lastMove = Date.now();
  let lastSwat = 0;
  let judgeUntil = 0;
  let speedEma = 0;
  let prevMX = 0, prevMY = 0;

  /* eyes follow the cursor; head tilts a little */
  function look() {
    const rect = svg.getBoundingClientRect();
    if (mouseX < 0 || rect.width === 0) return;
    const scale = rect.width / 120;
    const sx = (mouseX - rect.left) / scale;
    const sy = (mouseY - rect.top) / scale;

    for (const pupil of pupils) {
      const eye = pupil.previousElementSibling;      // the white
      const cx = Number(eye.getAttribute("cx"));
      const cy = Number(eye.getAttribute("cy"));
      const ang = Math.atan2(sy - cy, sx - cx);
      pupil.setAttribute("transform",
        `translate(${(Math.cos(ang) * 2.4).toFixed(2)} ${(Math.sin(ang) * 2.2).toFixed(2)})`);
    }
    const tilt = Math.max(-8, Math.min(8, (sx - 60) / 22));
    head.setAttribute("transform", `rotate(${tilt.toFixed(1)} 60 40)`);
  }

  function onMove(x, y) {
    const speed = Math.hypot(x - prevMX, y - prevMY);
    prevMX = x; prevMY = y;
    speedEma = speedEma * 0.8 + speed * 0.2;
    mouseX = x; mouseY = y;
    lastMove = Date.now();
    root.classList.remove("sleeping");

    /* frantic mouse → the look of quiet disapproval */
    if (speedEma > 46) {
      judgeUntil = Date.now() + 1800;
      root.classList.add("judging");
    }

    /* cursor within paw range → swat (with a cooldown, he has dignity) */
    const rect = svg.getBoundingClientRect();
    const dx = x - (rect.left + rect.width / 2);
    const dy = y - (rect.top + rect.height * 0.6);
    if (!reduced && Math.hypot(dx, dy) < 130 && Date.now() - lastSwat > 1400) {
      lastSwat = Date.now();
      const paw = dx < 0 ? legL : legR;
      paw.classList.add("swatting");
      setTimeout(() => paw.classList.remove("swatting"), 500);
    }
    look();
  }

  document.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY), { passive: true });
  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (t) onMove(t.clientX, t.clientY);
  }, { passive: true });

  /* ---------- moods on a heartbeat ---------- */

  setInterval(() => {
    const now = Date.now();
    if (now > judgeUntil) root.classList.remove("judging");
    if (now - lastMove > 25000) root.classList.add("sleeping");
  }, 800);

  /* occasional slow blink */
  (function blink() {
    setTimeout(() => {
      if (!root.classList.contains("sleeping")) {
        root.classList.add("blinking");
        setTimeout(() => root.classList.remove("blinking"), 180);
      }
      blink();
    }, 3500 + Math.random() * 5500);
  })();

})();
