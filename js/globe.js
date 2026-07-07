/* ============================================================
   GLOBE.JS — the little planet in the bottom-right corner.

   Click the globe button and the world spins a full turn,
   slows down over the Caucasus, and drops a pin on Tbilisi.
   The landing spot is set by TBILISI_X below (map is 400px
   wide = 360° of longitude, x = (lon + 180) / 360 * 400).
   ============================================================ */

(() => {
  "use strict";

  const toggle = document.getElementById("geo-toggle");
  const panel = document.getElementById("geo-panel");
  const map = document.getElementById("globe-map");
  const pin = document.getElementById("globe-pin");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Tbilisi: 44.8°E → map x 249.8; the globe centers svg x=100 */
  const TBILISI_X = (44.8 + 180) / 360 * 400;
  const END = 100 - TBILISI_X;      // ≈ -150: Georgia front and center
  const START = END + 400;          // one full spin away

  function spin() {
    if (reduced) {
      map.style.transition = "none";
      map.style.transform = `translateX(${END}px)`;
      pin.classList.add("landed");
      return;
    }
    pin.classList.remove("landed");
    map.style.transition = "none";
    map.style.transform = `translateX(${START}px)`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      map.style.transition = "transform 1.8s cubic-bezier(.3, .7, .25, 1)";
      map.style.transform = `translateX(${END}px)`;
    }));
    setTimeout(() => pin.classList.add("landed"), 1700);
  }

  toggle.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) spin();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
