/* ============================================================
   FIREWORKS.JS — canvas particle bursts for completed blocks.
   Exposes: Fireworks.burst(x, y), Fireworks.finale()
   Respects prefers-reduced-motion (bursts become a soft flash).
   ============================================================ */

const Fireworks = (() => {
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const COLORS = ["#FFB347", "#55E6FF", "#FF5C8A", "#8B7CF7", "#EDEBF7"];
  let particles = [];
  let running = false;

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function spawn(x, y, count, power) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * .75 + .25) * power;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - power * .25,
        life: 1,
        decay: Math.random() * .012 + .008,
        size: Math.random() * 2.5 + 1.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter(p => p.life > 0);
    if (!particles.length) { running = false; return; }

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;           // gravity
      p.vx *= 0.985;
      p.life -= p.decay;
      const alive = Math.max(p.life, 0);
      ctx.globalAlpha = alive;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alive, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  function flash() {
    // reduced-motion alternative: one gentle full-screen glow
    canvas.style.transition = "none";
    canvas.style.background = "radial-gradient(circle at 50% 40%, rgba(255,179,71,.18), transparent 60%)";
    setTimeout(() => {
      canvas.style.transition = "background 1s";
      canvas.style.background = "transparent";
    }, 120);
  }

  return {
    burst(x, y) {
      if (reduced) { flash(); return; }
      spawn(x, y, 70, 7);
      setTimeout(() => spawn(x + 40, y - 30, 40, 5), 180);
    },
    finale() {
      if (reduced) { flash(); return; }
      const w = window.innerWidth, h = window.innerHeight;
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          spawn(w * (0.15 + Math.random() * 0.7), h * (0.15 + Math.random() * 0.4), 90, 8);
        }, i * 260);
      }
    }
  };
})();
