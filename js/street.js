/* ============================================================
   STREET.JS — the walkable streets, a tiny platformer.

   A pixel girl walks with ← →, jumps with space. Jump the
   cones, collect the stars. Near each milestone a building
   rises behind the banner and her outfit changes.

   Two streets share the engine:
   · Education Street  — PORTFOLIO.education  (amber diagonal)
   · Experience Street — PORTFOLIO.experience (cyan diagonal)

   Milestone `type` picks the building + outfit:
     school / university / certificate / office / internship / future

   Exposes: Street.open(key), Street.close()
   ============================================================ */

const Street = (() => {
  const overlay  = document.getElementById("street");
  const nameEl   = overlay.querySelector(".street-name");
  const far      = document.getElementById("street-far");
  const mid      = document.getElementById("street-mid");
  const front    = document.getElementById("street-front");
  const btnLeft  = document.getElementById("street-left");
  const btnRight = document.getElementById("street-right");
  const btnJump  = document.getElementById("street-jump");
  const btnClose = document.getElementById("street-close");
  const starsEl  = document.getElementById("street-stars");

  const STREETS = {
    education:  { title: "Education Street",  items: () => PORTFOLIO.education },
    experience: { title: "Experience Street", items: () => PORTFOLIO.experience }
  };

  const GAP = 900;                 // distance between milestone lampposts
  const PAD = Math.max(window.innerWidth * 0.55, 520);
  const NEAR = 300;                // how close counts as "at" a milestone

  /* ---------- the pixel girl ---------- */

  const PAL = {
    k: "#14101E",  // outline / shoes / eyeliner
    h: "#B79762",  // dirty blonde hair
    s: "#F2C79E",  // skin
    w: "#22283F",  // tank top (ink, like the DJ girl's)
    j: "#45619B",  // jeans
    g: "#2E3557",  // graduation gown
    c: "#FFB347",  // amber: cap, sash, helmet, badge, tank print
    v: "#8B7CF7"   // violet: backpack, lanyard
  };

  const HEAD = [
    "...hhhhh....",
    "..hhhhhhh...",
    "..hsssssh...",
    "..hsksskh...",
    "..hsssssh...",
    "...ssss.....",
    "...wwww.....",
    "..wwcwww....",
    ".swwwwwws...",
    "..wwwwww....",
    "..jjjjjj....",
    "..jjjjjj...."
  ];

  const LEGS = {
    idle: ["...j..j.....", "...j..j.....", "...j..j.....", "..kk..kk...."],
    walk1: ["..j....j....", "..j....j....", ".j......j...", ".kk.....kk.."],
    walk2: ["....jj......", "...j..j.....", "...j...j....", "..kk...kk..."],
    jump: ["...jj.jj....", "...j...j....", "..kk...kk...", "............"]
  };

  function frameGrid(legs) {
    return HEAD.concat(LEGS[legs]).map(row => row.split(""));
  }

  /* outfit transforms stamped over the base sprite */
  function applyOutfit(grid, outfit) {
    const set = (r, c, ch) => { if (grid[r] && grid[r][c] !== undefined) grid[r][c] = ch; };
    if (outfit === "university") {
      for (let r = 6; r < grid.length; r++)      // gown over tank and jeans
        for (let c = 0; c < 12; c++)
          if (grid[r][c] === "w" || grid[r][c] === "j" || grid[r][c] === "c") grid[r][c] = "g";
      grid[0] = "..ccccccc...".split("");        // mortarboard
      set(1, 9, "c"); set(2, 9, "c");            // tassel
    } else if (outfit === "school") {
      for (let r = 6; r <= 10; r++) { set(r, 1, "v"); set(r, 2, "v"); }   // backpack
    } else if (outfit === "certificate") {
      for (let r = 6; r <= 10; r++) set(r, 9 - (r - 6), "c");             // sash
      set(10, 5, "c");                                                     // medal
    } else if (outfit === "office") {
      set(6, 5, "v"); set(7, 5, "v");            // lanyard
      set(8, 5, "c"); set(8, 6, "c");            // badge
    } else if (outfit === "future") {
      grid[0] = "...ccccc....".split("");        // hard hat
      grid[1] = "..ccccccc...".split("");
    }
    return grid;
  }

  const OUTFIT_FOR = {
    school: "school", university: "university", certificate: "certificate",
    office: "office", internship: "office", future: "future"
  };

  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = 12;
  spriteCanvas.height = 16;
  spriteCanvas.className = "player-sprite";

  const sctx = spriteCanvas.getContext("2d");
  let drawnKey = "";

  function drawSprite(legs, outfit, facing) {
    const key = legs + "|" + outfit + "|" + facing;
    if (key === drawnKey) return;
    drawnKey = key;
    const grid = applyOutfit(frameGrid(legs), outfit);
    sctx.clearRect(0, 0, 12, 16);
    sctx.save();
    if (facing < 0) { sctx.translate(12, 0); sctx.scale(-1, 1); }
    for (let r = 0; r < 16; r++)
      for (let c = 0; c < 12; c++) {
        const col = PAL[grid[r][c]];
        if (col) { sctx.fillStyle = col; sctx.fillRect(c, r, 1, 1); }
      }
    sctx.restore();
  }

  /* ---------- buildings that rise behind the banners ---------- */

  function buildingSVG(type) {
    const W = "#161C36", L = "#2A3354", A = "#FFB347", V = "#8B7CF7", C = "#55E6FF";
    const win = (x, y, o) => `<rect x="${x}" y="${y}" width="16" height="22" rx="2" fill="${A}" opacity="${o}"/>`;
    if (type === "university") {
      let windows = "";
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 8; c++)
          windows += win(66 + c * 50, 150 + r * 60, (0.25 + ((r * 3 + c) % 5) * 0.16).toFixed(2));
      return `<svg width="520" height="430" viewBox="0 0 520 430" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="120" width="440" height="310" fill="${W}" stroke="${L}"/>
        <polygon points="260,20 60,120 460,120" fill="${W}" stroke="${L}"/>
        <circle cx="260" cy="88" r="20" fill="none" stroke="${A}" stroke-width="3"/>
        <line x1="260" y1="88" x2="260" y2="76" stroke="${A}" stroke-width="3"/>
        <line x1="260" y1="88" x2="269" y2="92" stroke="${A}" stroke-width="2"/>
        <rect x="256" y="0" width="4" height="26" fill="${L}"/>
        <path d="M260 2 L296 10 L260 18 Z" fill="${A}"/>
        ${[90, 160, 230, 300, 370].map(x => `<rect x="${x}" y="330" width="14" height="100" fill="${L}"/>`).join("")}
        <rect x="228" y="350" width="64" height="80" rx="4" fill="${A}" opacity=".8"/>
        <line x1="260" y1="350" x2="260" y2="430" stroke="${W}" stroke-width="4"/>
        ${windows}</svg>`;
    }
    if (type === "school") {
      return `<svg width="340" height="300" viewBox="0 0 340 300" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="120" width="280" height="180" fill="${W}" stroke="${L}"/>
        <polygon points="170,30 10,120 330,120" fill="${W}" stroke="${L}"/>
        <circle cx="170" cy="86" r="14" fill="none" stroke="${A}" stroke-width="3"/>
        <path d="M164 92 Q170 100 176 92" fill="${A}"/>
        ${win(60, 160, .8)}${win(110, 160, .45)}${win(214, 160, .65)}${win(264, 160, .35)}
        <rect x="146" y="210" width="48" height="90" rx="4" fill="${A}" opacity=".8"/>
      </svg>`;
    }
    if (type === "certificate") {
      return `<svg width="440" height="320" viewBox="0 0 440 320" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="400" height="260" rx="14" fill="${W}" stroke="${A}" stroke-width="3"/>
        <rect x="36" y="36" width="368" height="228" rx="8" fill="none" stroke="${L}" stroke-width="2" stroke-dasharray="6 6"/>
        ${[80, 110, 140].map((y, i) => `<line x1="90" y1="${y}" x2="${350 - i * 40}" y2="${y}" stroke="${L}" stroke-width="6" stroke-linecap="round"/>`).join("")}
        <circle cx="330" cy="210" r="34" fill="${A}" opacity=".9"/>
        <circle cx="330" cy="210" r="24" fill="none" stroke="#EDEBF7" stroke-width="3"/>
        <polygon points="316,238 330,300 344,238" fill="${V}"/>
        <text x="330" y="220" text-anchor="middle" font-size="26" fill="#EDEBF7">★</text>
      </svg>`;
    }
    if (type === "office") {
      let windows = "";
      for (let r = 0; r < 8; r++)
        for (let c = 0; c < 4; c++)
          windows += `<rect x="${64 + c * 44}" y="${90 + r * 40}" width="26" height="24" rx="2"
            fill="${(r * 5 + c) % 3 ? A : C}" opacity="${(0.2 + ((r * 7 + c * 3) % 6) * 0.13).toFixed(2)}"/>`;
      return `<svg width="300" height="440" viewBox="0 0 300 440" xmlns="http://www.w3.org/2000/svg">
        <rect x="46" y="70" width="208" height="370" fill="${W}" stroke="${L}"/>
        <rect x="46" y="70" width="208" height="14" fill="${L}"/>
        <line x1="150" y1="70" x2="150" y2="30" stroke="${L}" stroke-width="4"/>
        <circle cx="150" cy="26" r="5" fill="${C}"/>
        <rect x="86" y="34" width="128" height="26" rx="6" fill="${W}" stroke="${C}" stroke-width="2"/>
        <text x="150" y="53" text-anchor="middle" font-size="16" fill="${C}" font-family="monospace">WORK</text>
        ${windows}
        <rect x="122" y="384" width="56" height="56" rx="4" fill="${A}" opacity=".75"/>
      </svg>`;
    }
    if (type === "internship") {
      return `<svg width="320" height="300" viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="80" width="260" height="220" fill="${W}" stroke="${L}"/>
        <rect x="20" y="64" width="280" height="20" rx="6" fill="${L}"/>
        ${win(60, 120, .7)}${win(110, 120, .35)}${win(194, 120, .55)}${win(244, 120, .8)}
        ${win(60, 180, .3)}${win(244, 180, .45)}
        <path d="M110 220 L210 220 L226 250 L94 250 Z" fill="${V}" opacity=".8"/>
        <rect x="134" y="220" width="52" height="80" rx="4" fill="${A}" opacity=".8"/>
        <text x="160" y="108" text-anchor="middle" font-size="15" fill="${A}" font-family="monospace">FIRST BADGE</text>
      </svg>`;
    }
    /* future: a building still under construction */
    return `<svg width="420" height="380" viewBox="0 0 420 380" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="140" width="220" height="240" fill="none" stroke="${L}" stroke-width="3" stroke-dasharray="10 8"/>
      <rect x="40" y="300" width="220" height="80" fill="${W}" stroke="${L}"/>
      <rect x="300" y="60" width="10" height="320" fill="${L}"/>
      <rect x="180" y="52" width="220" height="10" fill="${L}"/>
      <line x1="305" y1="52" x2="230" y2="140" stroke="${L}" stroke-width="4"/>
      <line x1="380" y1="62" x2="380" y2="120" stroke="${A}" stroke-width="2"/>
      <rect x="368" y="120" width="24" height="18" fill="${A}" opacity=".85"/>
      <text x="150" y="120" text-anchor="middle" font-size="34" fill="${A}" font-family="monospace">?</text>
    </svg>`;
  }

  /* ---------- world state ---------- */

  const player = { x: 0, y: 0, vy: 0, facing: 1, grounded: true, moving: false };
  const input = { left: false, right: false };
  const PSPEED = 4.4, GRAV = 0.6, JUMP = 12.6;
  const PBOX = { w: 30 };

  let currentKey = null;
  let worldWidth = 0;
  let milestones = [];     // {x, type, buildingEl}
  let obstacles = [];      // {x, w, h}
  let stars = [];          // {x, y, el, got}
  let starCount = 0;

  let camera = 0, target = 0;
  let rafId = null, playerEl = null, walkTimer = 0, walkFrame = false;

  function rng(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  /* ---------- build a street's world ---------- */

  function build(key) {
    currentKey = key;
    const items = STREETS[key].items();
    worldWidth = PAD * 2 + (items.length - 1) * GAP;
    overlay.dataset.street = key;
    nameEl.textContent = STREETS[key].title;

    far.innerHTML = "";
    mid.innerHTML = "";
    front.innerHTML = "";
    milestones = [];
    obstacles = [];
    stars = [];
    starCount = 0;

    const rand = rng(key === "education" ? 42 : 77);
    const totalW = worldWidth + window.innerWidth;

    for (let x = 0; x < totalW; x += 90 + rand() * 120) {
      const b = document.createElement("div");
      b.className = "bldg";
      b.style.left = x + "px";
      b.style.width = (60 + rand() * 110) + "px";
      b.style.height = (12 + rand() * 22) + "%";
      far.appendChild(b);
    }

    for (let x = 0; x < totalW; x += 170 + rand() * 200) {
      const b = document.createElement("div");
      b.className = "bldg";
      b.style.left = x + "px";
      const w = 90 + rand() * 90;
      b.style.width = w + "px";
      b.style.height = (18 + rand() * 26) + "%";
      const windows = 2 + Math.floor(rand() * 5);
      for (let i = 0; i < windows; i++) {
        const winEl = document.createElement("i");
        winEl.style.left = (10 + rand() * (w - 26)) + "px";
        winEl.style.top = (12 + rand() * 60) + "%";
        winEl.style.opacity = .3 + rand() * .7;
        b.appendChild(winEl);
      }
      mid.appendChild(b);
    }

    /* big buildings first, so they paint behind the lampposts */
    items.forEach((m, i) => {
      const type = m.type || "school";
      const bg = document.createElement("div");
      bg.className = "building";
      bg.style.left = (PAD + i * GAP) + "px";
      bg.innerHTML = buildingSVG(type);
      front.appendChild(bg);
      milestones.push({ x: PAD + i * GAP, type, buildingEl: bg });
    });

    const road = document.createElement("div");
    road.className = "street-road";
    road.style.width = totalW + "px";
    front.appendChild(road);

    items.forEach((m, i) => {
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

    /* challenges between the lampposts */
    for (let i = 0; i < milestones.length - 1; i++) {
      const x0 = milestones[i].x;

      const cone = rand() > 0.5;
      const ob = document.createElement("div");
      ob.className = cone ? "obstacle cone" : "obstacle trash";
      const ow = cone ? 30 : 34, oh = cone ? 30 : 46;
      const ox = x0 + GAP * (0.42 + rand() * 0.16);
      ob.style.left = ox + "px";
      front.appendChild(ob);
      obstacles.push({ x: ox, w: ow, h: oh });

      for (let sIdx = 0; sIdx < 4; sIdx++) {
        const sx = x0 + GAP * (0.3 + sIdx * 0.13);
        const sy = 34 + Math.sin(sIdx / 3 * Math.PI) * 90;
        const st = document.createElement("span");
        st.className = "star";
        st.textContent = "✦";
        st.style.left = sx + "px";
        st.style.bottom = `calc(22% + ${sy}px)`;
        front.appendChild(st);
        stars.push({ x: sx, y: sy, el: st, got: false });
      }
    }
    starsEl.textContent = `✦ 0 / ${stars.length}`;

    playerEl = document.createElement("div");
    playerEl.className = "player";
    playerEl.appendChild(spriteCanvas);
    front.appendChild(playerEl);
  }

  /* ---------- physics & rendering ---------- */

  function clampCam(v) {
    const half = window.innerWidth / 2;
    return Math.min(Math.max(v, half), worldWidth - half);
  }

  function update() {
    let vx = 0;
    if (input.left) { vx = -PSPEED; player.facing = -1; }
    if (input.right) { vx = PSPEED; player.facing = 1; }
    player.moving = vx !== 0;
    const prevX = player.x;
    player.x = Math.min(Math.max(player.x + vx, 50), worldWidth - 50);

    player.y += player.vy;
    player.vy -= GRAV;
    if (player.y <= 0) { player.y = 0; player.vy = 0; player.grounded = true; }
    else player.grounded = false;

    /* solid obstacles: walk into one and you stop — jump over it */
    for (const ob of obstacles) {
      const overlapX = Math.abs(player.x - ob.x) < (PBOX.w + ob.w) / 2;
      if (overlapX && player.y < ob.h) { player.x = prevX; break; }
    }

    for (const st of stars) {
      if (st.got) continue;
      if (Math.abs(player.x - st.x) < 34 && Math.abs(player.y + 30 - st.y) < 44) {
        st.got = true;
        st.el.classList.add("got");
        starCount++;
        starsEl.textContent = `✦ ${starCount} / ${stars.length}`;
        if (starCount === stars.length) starsEl.textContent = "✦ all stars — nice walk ✦";
      }
    }

    /* milestones: buildings rise, outfits change */
    let outfit = "base";
    for (const m of milestones) {
      const near = Math.abs(player.x - m.x) < NEAR;
      m.buildingEl.classList.toggle("show", near);
      if (near) outfit = OUTFIT_FOR[m.type] || "base";
    }

    let legs = "idle";
    if (!player.grounded) legs = "jump";
    else if (player.moving) {
      if (++walkTimer % 9 === 0) walkFrame = !walkFrame;
      legs = walkFrame ? "walk1" : "walk2";
    }
    drawSprite(legs, outfit, player.facing);

    playerEl.style.left = player.x + "px";
    playerEl.style.bottom = `calc(22% + ${player.y}px)`;

    target = clampCam(player.x);
    camera += (target - camera) * 0.1;
    far.style.transform   = `translateX(${-camera * 0.22}px)`;
    mid.style.transform   = `translateX(${-camera * 0.55}px)`;
    front.style.transform = `translateX(${window.innerWidth * 0.5 - camera}px)`;

    rafId = requestAnimationFrame(update);
  }

  function jump() {
    if (player.grounded) { player.vy = JUMP; player.grounded = false; }
  }

  /* ---------- input ---------- */

  function onKeyDown(e) {
    if (overlay.hidden) return;
    if (e.key === "ArrowRight") { input.right = true; e.preventDefault(); }
    else if (e.key === "ArrowLeft") { input.left = true; e.preventDefault(); }
    else if (e.key === " " || e.key === "ArrowUp") { jump(); e.preventDefault(); }
    else if (e.key === "Escape") close();
  }

  function onKeyUp(e) {
    if (e.key === "ArrowRight") input.right = false;
    else if (e.key === "ArrowLeft") input.left = false;
  }

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  function bindHold(btn, prop) {
    btn.addEventListener("mousedown", () => { input[prop] = true; });
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); input[prop] = true; }, { passive: false });
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(ev =>
      btn.addEventListener(ev, () => { input[prop] = false; }));
  }
  bindHold(btnLeft, "left");
  bindHold(btnRight, "right");
  btnJump.addEventListener("mousedown", jump);
  btnJump.addEventListener("touchstart", (e) => { e.preventDefault(); jump(); }, { passive: false });
  btnClose.addEventListener("click", close);

  /* ---------- open / close ---------- */

  function open(key) {
    if (!STREETS[key]) key = "education";
    if (currentKey !== key) build(key);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    player.x = Math.max(PAD - 320, 60);
    player.y = 0; player.vy = 0; player.facing = 1;
    camera = clampCam(player.x);
    target = camera;
    drawnKey = "";
    if (!rafId) rafId = requestAnimationFrame(update);
    btnClose.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    input.left = input.right = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  return { open, close };
})();
