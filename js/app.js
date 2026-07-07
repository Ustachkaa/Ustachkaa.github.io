/* ============================================================
   APP.JS — the sudoku game and everything it unlocks.

   The rules of this page:
   · complete a 3×3 block  → fireworks + that project lights up
   · complete the diagonal → Education Street opens
   · complete the board    → grand finale
   ============================================================ */

(() => {
  "use strict";

  const SIZE = 9;
  const BOX = 3;
  const boxOf = (r, c) => Math.floor(r / BOX) * BOX + Math.floor(c / BOX);
  const STORAGE_KEY = "mariam-sudoku-portfolio-v4";

  /* ---------- puzzle generator: a fresh board for every visitor ----------
     Start from a known-valid grid, then relabel the digits and shuffle
     bands, stacks, and the rows/columns inside them — every one of those
     moves keeps the sudoku valid. The givens mask leaves exactly 3 cells
     empty per block (fast to finish) and most of the diagonal open (the
     street has to be earned). Entries are checked against the stored
     solution, so the puzzle never needs to be uniquely solvable. */

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generatePuzzle() {
    const base = Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (_, c) => (r * BOX + Math.floor(r / BOX) + c) % SIZE + 1));

    const digits = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const lineOrder = () =>
      shuffled([0, 1, 2]).flatMap(band => shuffled([0, 1, 2]).map(i => band * BOX + i));
    const rowOrder = lineOrder();
    const colOrder = lineOrder();

    const solution = Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (_, c) => digits[base[rowOrder[r]][colOrder[c]] - 1]));

    /* givens mask: both diagonals mostly empty (the two streets have
       to be earned), then top every block up to exactly 3 empties */
    const empties = new Set();
    const take = (cells, n) => shuffled(cells).slice(0, n).forEach(([r, c]) => empties.add(r * SIZE + c));
    take([[0, 0], [1, 1], [2, 2]], 2);           // main diagonal, corners
    take([[6, 6], [7, 7], [8, 8]], 2);
    take([[0, 8], [1, 7], [2, 6]], 2);           // anti diagonal, corners
    take([[6, 2], [7, 1], [8, 0]], 2);
    empties.add(4 * SIZE + 4);                    // the crossing cell
    take([[3, 3], [5, 5]], 1);                    // one more from each diagonal
    take([[3, 5], [5, 3]], 1);                    // keeps the center block at 3
    for (let b = 0; b < SIZE; b++) {
      const r0 = Math.floor(b / BOX) * BOX, c0 = (b % BOX) * BOX;
      const cells = [];
      for (let r = r0; r < r0 + BOX; r++)
        for (let c = c0; c < c0 + BOX; c++) cells.push(r * SIZE + c);
      const have = cells.filter(i => empties.has(i)).length;
      shuffled(cells.filter(i => !empties.has(i))).slice(0, Math.max(3 - have, 0))
        .forEach(i => empties.add(i));
    }
    const given = Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (_, c) => (empties.has(r * SIZE + c) ? 0 : 1)));

    return { solution, given };
  }

  /* resume a saved puzzle, or deal a fresh one */
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { /* fresh deal */ }
  if (saved && (!Array.isArray(saved.solution) || saved.solution.length !== SIZE ||
                !Array.isArray(saved.given) || !Array.isArray(saved.values))) saved = null;

  const deal = saved ? { solution: saved.solution, given: saved.given } : generatePuzzle();
  const SOLUTION = deal.solution;
  const GIVEN = deal.given;

  /* ---------- state ---------- */

  let values = SOLUTION.map((row, r) => row.map((v, c) => (GIVEN[r][c] ? v : 0)));
  let litBoxes = new Set();
  let diagDone = false;        // main diagonal → Education Street
  let diag2Done = false;       // anti diagonal → Experience Street
  let solved = false;
  let selected = null;
  let cells = [];

  /* ---------- dom ---------- */

  const boardEl = document.getElementById("board");
  const padEl = document.getElementById("pad");
  const lampsEl = document.getElementById("progress-lamps");
  const progressText = document.getElementById("progress-text");
  const storefrontsEl = document.getElementById("storefronts");
  const toastEl = document.getElementById("toast");
  const streetBtn = document.getElementById("street-btn");
  const streetBtn2 = document.getElementById("street-btn2");
  const cheatTab = document.getElementById("cheat-tab");
  const cheatPanel = document.getElementById("cheat-panel");
  const cheatGrid = document.getElementById("cheat-grid");
  const contactEl = document.getElementById("footer-contact");

  document.getElementById("tagline").textContent = PORTFOLIO.tagline;

  /* ---------- build the board ---------- */

  for (let r = 0; r < SIZE; r++) {
    cells.push([]);
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.setAttribute("role", "gridcell");
      if (r === c) cell.classList.add("diag");
      if (r + c === SIZE - 1) cell.classList.add("diag2");
      if (GIVEN[r][c]) {
        cell.classList.add("given");
        cell.textContent = SOLUTION[r][c];
        cell.tabIndex = -1;
      }
      cell.addEventListener("click", () => onCellClick(r, c));
      updateAria(cell, r, c);
      boardEl.appendChild(cell);
      cells[r].push(cell);
    }
  }

  function onCellClick(r, c) {
    // a finished block becomes a doorway to its project
    const b = boxOf(r, c);
    if (litBoxes.has(b)) {
      openStoreModal(b, document.getElementById("store-" + b));
      return;
    }
    if (!GIVEN[r][c]) select(r, c);
  }

  function updateAria(cell, r, c) {
    const v = GIVEN[r][c] ? SOLUTION[r][c] : values[r][c];
    const marks = [];
    if (r === c) marks.push("on the Education Street diagonal");
    if (r + c === SIZE - 1) marks.push("on the Experience Street diagonal");
    cell.setAttribute("aria-label",
      `Row ${r + 1}, column ${c + 1}${marks.length ? ", " + marks.join(" and ") : ""}: ${v ? v : "empty"}`);
  }

  /* ---------- number pad ---------- */

  for (let n = 1; n <= SIZE; n++) {
    const b = document.createElement("button");
    b.textContent = n;
    b.setAttribute("aria-label", `Enter ${n}`);
    b.addEventListener("click", () => enter(n));
    padEl.appendChild(b);
  }
  const erase = document.createElement("button");
  erase.textContent = "⌫";
  erase.className = "pad-erase";
  erase.setAttribute("aria-label", "Erase");
  erase.addEventListener("click", () => enter(0));
  padEl.appendChild(erase);

  /* ---------- progress lamps ---------- */

  for (let i = 0; i < SIZE; i++) lampsEl.appendChild(document.createElement("i"));

  /* ---------- project storefronts ---------- */

  PORTFOLIO.projects.forEach((p, i) => {
    const store = document.createElement("article");
    store.className = "store";
    store.id = "store-" + i;
    store.innerHTML = `
      <h3 class="store-sign">${p.sign}</h3>
      <div class="store-body">
        ${p.tag ? `<div class="store-item-meta">${p.tag}</div>` : ""}
        ${p.note ? `<p class="store-item-note">${p.note}</p>` : ""}
        <button class="store-more" aria-haspopup="dialog">More about this ↗</button>
      </div>
      <div class="store-shutter"><span>Block ${i + 1} opens this</span></div>`;
    storefrontsEl.appendChild(store);
  });

  /* ---------- the project window: grows out of a clicked card ---------- */

  const modal = document.getElementById("store-modal");
  const modalPanel = document.getElementById("store-modal-panel");
  const modalSign = document.getElementById("store-modal-sign");
  const modalTag = document.getElementById("store-modal-tag");
  const modalBody = document.getElementById("store-modal-body");
  const modalLink = document.getElementById("store-modal-link");
  const modalClose = document.getElementById("store-modal-close");
  const modalBackdrop = document.getElementById("store-modal-backdrop");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastFocus = null;

  function openStoreModal(i, cardEl) {
    const p = PORTFOLIO.projects[i];
    modalSign.textContent = p.sign;
    modalTag.textContent = p.tag || "";
    modalTag.hidden = !p.tag;
    modalBody.innerHTML =
      (p.note ? `<p class="store-modal-note">${p.note}</p>` : "") +
      (p.details || []).map(par => `<p>${par}</p>`).join("");
    modalLink.innerHTML = p.href
      ? `<a href="${p.href}" target="_blank" rel="noopener">Visit this project ↗</a>` : "";

    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    if (!reducedMotion && cardEl) {
      /* start at the card's size and position, grow to center */
      const from = cardEl.getBoundingClientRect();
      const to = modalPanel.getBoundingClientRect();
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top + from.height / 2 - (to.top + to.height / 2);
      modalPanel.style.transition = "none";
      modalPanel.style.transform =
        `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`;
      modalPanel.style.opacity = ".35";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        modalPanel.style.transition = "";
        modalPanel.style.transform = "";
        modalPanel.style.opacity = "";
      }));
    }
    modalClose.focus();
  }

  function closeStoreModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modalClose.addEventListener("click", closeStoreModal);
  modalBackdrop.addEventListener("click", closeStoreModal);

  storefrontsEl.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;               // links still just link
    const store = e.target.closest(".store");
    if (!store || !store.classList.contains("lit")) return;
    openStoreModal(Number(store.id.replace("store-", "")), store);
  });

  /* ---------- about me (always visible) ---------- */

  const aboutEl = document.getElementById("about");
  aboutEl.innerHTML = (PORTFOLIO.about || []).map(par => `<p>${par}</p>`).join("");

  /* voice intro: press play, hear Mariam say it herself */
  if (PORTFOLIO.aboutAudio) {
    const row = document.createElement("div");
    row.className = "about-voice";
    row.innerHTML = `
      <button class="about-play" id="about-play" aria-label="Hear this in Mariam's voice">▶</button>
      <div class="about-voice-meta">
        <p class="about-voice-label">Hear it in my voice</p>
        <div class="about-progress"><i id="about-progress-bar"></i></div>
      </div>
      <div class="eq" aria-hidden="true"><span></span><span></span><span></span></div>`;
    aboutEl.appendChild(row);

    const voice = new Audio(PORTFOLIO.aboutAudio);
    voice.preload = "none";
    const playBtn = document.getElementById("about-play");
    const bar = document.getElementById("about-progress-bar");

    playBtn.addEventListener("click", () => {
      if (voice.paused) voice.play().catch(() => row.remove());
      else voice.pause();
    });
    voice.addEventListener("play", () => { playBtn.textContent = "⏸"; row.classList.add("playing"); });
    voice.addEventListener("pause", () => { playBtn.textContent = "▶"; row.classList.remove("playing"); });
    voice.addEventListener("ended", () => { voice.currentTime = 0; });
    voice.addEventListener("timeupdate", () => {
      if (voice.duration) bar.style.width = (voice.currentTime / voice.duration * 100) + "%";
    });
    voice.addEventListener("error", () => row.remove());   // file missing — hide quietly
  }

  /* ---------- footer contact (always visible) ---------- */

  contactEl.innerHTML = PORTFOLIO.contact
    .filter(ct => ct.href)               // entries without a URL stay hidden
    .map(ct =>
      `<a href="${ct.href}" target="_blank" rel="noopener"><span>${ct.label}</span>${ct.value}</a>`
    ).join("");

  /* ---------- cheat sheet ---------- */

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const s = document.createElement("span");
      s.textContent = SOLUTION[r][c];
      if (c === 2 || c === 5) s.classList.add("cg-boxr");
      if (r === 2 || r === 5) s.classList.add("cg-boxb");
      cheatGrid.appendChild(s);
    }
  }

  cheatTab.addEventListener("click", () => {
    const open = cheatPanel.hidden;
    cheatPanel.hidden = !open;
    cheatTab.setAttribute("aria-expanded", String(open));
  });

  document.getElementById("autosolve").addEventListener("click", () => {
    cheatPanel.hidden = true;
    cheatTab.setAttribute("aria-expanded", "false");
    autosolve();
  });

  /* ---------- selection & input ---------- */

  function select(r, c) {
    if (GIVEN[r][c]) return;
    if (selected) cells[selected.r][selected.c].classList.remove("selected");
    selected = { r, c };
    const cell = cells[r][c];
    cell.classList.add("selected");
    cell.focus({ preventScroll: true });
  }

  function enter(n) {
    if (!selected || solved) return;
    const { r, c } = selected;
    if (GIVEN[r][c] || litBoxes.has(boxOf(r, c))) return;
    const cell = cells[r][c];

    values[r][c] = n;
    cell.textContent = n || "";
    cell.classList.remove("entry", "wrong");
    if (n) {
      if (n === SOLUTION[r][c]) {
        cell.classList.add("entry");
      } else {
        void cell.offsetWidth;      // restart the shake animation
        cell.classList.add("wrong");
      }
    }
    updateAria(cell, r, c);
    save();
    checkEvents();
  }

  document.addEventListener("keydown", (e) => {
    if (!modal.hidden) {
      if (e.key === "Escape") closeStoreModal();
      return;
    }
    if (!document.getElementById("street").hidden) return;
    if (e.target.closest(".cheat")) return;

    if (selected) {
      if (e.key >= "1" && e.key <= "9") { enter(Number(e.key)); return; }
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") { enter(0); return; }
    }
    const arrows = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (arrows[e.key] && selected) {
      e.preventDefault();
      let { r, c } = selected;
      do {
        r = (r + arrows[e.key][0] + SIZE) % SIZE;
        c = (c + arrows[e.key][1] + SIZE) % SIZE;
      } while (GIVEN[r][c]);
      select(r, c);
    }
  });

  /* ---------- completion events ---------- */

  function boxCells(b) {
    const r0 = Math.floor(b / BOX) * BOX;
    const c0 = (b % BOX) * BOX;
    const out = [];
    for (let r = r0; r < r0 + BOX; r++)
      for (let c = c0; c < c0 + BOX; c++)
        out.push([r, c]);
    return out;
  }

  function isCorrect(r, c) {
    return values[r][c] === SOLUTION[r][c];
  }

  function checkEvents() {
    for (let b = 0; b < SIZE; b++) {
      if (litBoxes.has(b)) continue;
      if (boxCells(b).every(([r, c]) => isCorrect(r, c))) lightBox(b, true);
    }
    if (!diagDone) {
      let all = true;
      for (let i = 0; i < SIZE; i++) if (!isCorrect(i, i)) all = false;
      if (all) lightDiagonal("education", true);
    }
    if (!diag2Done) {
      let all = true;
      for (let i = 0; i < SIZE; i++) if (!isCorrect(i, SIZE - 1 - i)) all = false;
      if (all) lightDiagonal("experience", true);
    }
    if (!solved) {
      let all = true;
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
          if (!isCorrect(r, c)) all = false;
      if (all) finale();
    }
    save();
  }

  function lightBox(b, celebrate) {
    litBoxes.add(b);
    const cellsList = boxCells(b);
    cellsList.forEach(([r, c]) => {
      const cell = cells[r][c];
      cell.classList.add("done-box");
      cell.classList.remove("selected");
      cell.title = `Open “${PORTFOLIO.projects[b].sign}”`;
    });
    if (selected && boxOf(selected.r, selected.c) === b) selected = null;

    document.getElementById("store-" + b).classList.add("lit");

    [...lampsEl.children].forEach((l, i) => l.classList.toggle("lit", i < litBoxes.size));
    progressText.textContent = `${litBoxes.size} of 9 blocks lit`;

    if (celebrate) {
      const mid = cellsList[4];
      const rect = cells[mid[0]][mid[1]].getBoundingClientRect();
      Fireworks.burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      toast(`“${PORTFOLIO.projects[b].sign}” just switched on — click the block to visit ↓`);
    }
  }

  function lightDiagonal(kind, celebrate) {
    if (kind === "education") {
      diagDone = true;
      for (let i = 0; i < SIZE; i++) cells[i][i].classList.add("diag-lit");
      streetBtn.hidden = false;
    } else {
      diag2Done = true;
      for (let i = 0; i < SIZE; i++) cells[i][SIZE - 1 - i].classList.add("diag2-lit");
      streetBtn2.hidden = false;
    }
    if (celebrate) {
      toast(kind === "education" ? "The street lights are on…" : "The office lights are on…");
      setTimeout(() => Street.open(kind), 900);
    }
  }

  function finale() {
    solved = true;
    Fireworks.finale();
    toast("You solved it — the whole street is yours. 🎆");
  }

  streetBtn.addEventListener("click", () => Street.open("education"));
  streetBtn2.addEventListener("click", () => Street.open("experience"));

  /* ---------- autosolve (the cheat) ---------- */

  function autosolve() {
    const empties = [];
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (!GIVEN[r][c] && values[r][c] !== SOLUTION[r][c] && !litBoxes.has(boxOf(r, c)))
          empties.push([r, c]);

    empties.forEach(([r, c], i) => {
      setTimeout(() => {
        selected = { r, c };
        enter(SOLUTION[r][c]);
        if (i === empties.length - 1 && selected) {
          cells[selected.r][selected.c].classList.remove("selected");
          selected = null;
        }
      }, i * 110);
    });
  }

  /* ---------- toast ---------- */

  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3600);
  }

  /* ---------- reset ---------- */

  document.getElementById("reset").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  /* ---------- persistence ---------- */

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        solution: SOLUTION, given: GIVEN,
        values, lit: [...litBoxes], diagDone, diag2Done, solved
      }));
    } catch (e) { /* private browsing — play on without saving */ }
  }

  function restore() {
    const data = saved;
    if (!data || !Array.isArray(data.values) || data.values.length !== SIZE) return;

    values = data.values;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (GIVEN[r][c]) continue;
        const v = values[r][c];
        const cell = cells[r][c];
        cell.textContent = v || "";
        if (v) cell.classList.add(v === SOLUTION[r][c] ? "entry" : "wrong");
        updateAria(cell, r, c);
      }
    }
    (data.lit || []).forEach(b => lightBox(b, false));
    if (data.diagDone) lightDiagonal("education", false);
    if (data.diag2Done) lightDiagonal("experience", false);
    solved = Boolean(data.solved);
  }

  restore();
})();
