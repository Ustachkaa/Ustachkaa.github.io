/* ============================================================
   CONTENT.JS — everything written on the site lives here.
   Edit this file to add your real projects and details; you
   never need to touch the other files.
   ============================================================ */

const PORTFOLIO = {

  tagline:
    "My portfolio is locked behind a sudoku. Each of the nine blocks " +
    "reveals one project — or grab the cheat sheet in the corner.",

  /* ------------------------------------------------------------
     ABOUT ME — always visible, right under the board.
     One string per paragraph.
     ------------------------------------------------------------ */
  about: [
    "I'm Mariam Ustiashvili — a software engineer from Georgia who likes problems that look like games, and games that are secretly problems.",
    "I studied Software Engineering at the University of Debrecen in Hungary, where I gravitated toward quality assurance and testing — I enjoy breaking software carefully so that users never see it break. Along the way I've automated test suites, trained Unity ML-Agents, classified movies with NLP, and built things for students like me.",
    "This site is how I think: give people something playful, and keep the serious work just underneath. Every solved block below opens a piece of it."
  ],

  /* ------------------------------------------------------------
     THE NINE PROJECTS
     They sit in a 3×3 grid that mirrors the sudoku blocks:
     finishing the top-left block lights project 1, and so on.
     Titles are seeded from your existing project folders —
     rewrite the tags/notes and add real links.
     ------------------------------------------------------------ */
  projects: [
    {
      sign: "SideQuest",
      tag: "Mobile app · in progress",
      note: "A mobile side-project I'm building under the playmode-labs flag.",
      href: "https://github.com/playmode-labs",
      details: [
        "Still under wraps — the repo goes public when it's ready. Ask me about it and I'll happily talk your ear off."
      ]
    },
    {
      sign: "DemoBlaze Automation",
      tag: "QA automation · Selenium",
      note: "An automated end-to-end test suite for the DemoBlaze demo shop.",
      href: "",
      details: [
        "Covers the core shopping flows — browsing, cart, checkout — with automated UI tests built around Selenium, structured so new test cases drop in without touching the plumbing."
      ]
    },
    {
      sign: "Saucedemo Testing",
      tag: "Software testing",
      note: "A software-testing deep dive into the Saucedemo store.",
      href: "https://github.com/Ustachkaa/SaucedemoSoftwareTestingProject",
      details: [
        "Test design, execution and reporting for the classic Saucedemo application — from exploratory passes to repeatable automated checks."
      ]
    },
    {
      sign: "Chameleon Color Detector",
      tag: "Computer vision",
      note: "A chameleon that turns whatever color you show it.",
      href: "",
      details: [
        "A computer-vision toy: show it a color and the chameleon shifts to match. Equal parts image processing and fun."
      ]
    },
    {
      sign: "Movie Genre Identifier",
      tag: "NLP · machine learning",
      note: "Guessing a film's genre from its description alone.",
      href: "",
      details: [
        "An NLP project that classifies movies by their plot summaries — text preprocessing, feature extraction, and a classifier trained to tell a thriller from a romcom."
      ]
    },
    {
      sign: "Student Den",
      tag: "Student platform",
      note: "A platform made for students, by a student.",
      href: "",
      details: [
        "Built around what students actually need day to day — from finding their footing in a new city to finding each other."
      ]
    },
    {
      sign: "ML-Agents Experiments",
      tag: "Unity · reinforcement learning",
      note: "Teaching Unity agents to see, steer and survive.",
      href: "",
      details: [
        "A series of reinforcement-learning experiments in Unity ML-Agents — ray perception sensors, continuous control, and a hummingbird that learned to feed itself."
      ]
    },
    {
      sign: "Queen of Hearts",
      tag: "CSS art",
      note: "A playing card drawn entirely in CSS — no images.",
      href: "",
      details: [
        "Every heart, curve and crown is a styled div. Pointless in the best way, and a great exercise in layout control."
      ]
    },
    {
      sign: "This Website",
      tag: "Vanilla JS · you're playing it",
      note: "A portfolio you have to solve. View source — it's all there.",
      href: "https://github.com/Ustachkaa/Ustachkaa.github.io",
      details: [
        "A 9×9 sudoku dealt fresh for every visitor, nine project storefronts that light up per solved block, a platformer Education Street behind the diagonal, live Spotify in the corner — all vanilla HTML, CSS and JavaScript with no build step.",
        "Designed and built together with Claude."
      ]
    }
  ],

  /* ------------------------------------------------------------
     EDUCATION STREET
     One entry per glowing sign along the street, oldest first.
     Unlocked by completing the marked diagonal on the board.
     `type` picks the building that rises behind the banner and
     the outfit the girl wears there:
       "school"      → schoolhouse, backpack
       "university"  → grand campus building, graduation cap & gown
       "certificate" → giant sealed certificate, honour sash
       "future"      → building under construction, hard hat
     ------------------------------------------------------------ */
  education: [
    { type: "school",      years: "20XX – 20XX", title: "High School", place: "Georgia", note: "Where the puzzle habit started." },
    { type: "university",  years: "20XX – 20XX", title: "BSc Software Engineering", place: "University of Debrecen, Hungary", note: "Thesis: a mobile companion system for students." },
    { type: "certificate", years: "Ongoing", title: "Certifications & Trainings", place: "", note: "The collection keeps growing — ask me about the latest." },
    { type: "future",      years: "…", title: "What's next", place: "", note: "The street keeps going." }
  ],

  /* ------------------------------------------------------------
     MUSIC — the girl with headphones in the corner.
     `endpoint` is your deployed now-playing URL (see
     spotify-backend/README.md). Until it's set — or whenever it
     can't be reached — the widget shows `fallback` instead.
     To get a track's id: Spotify → Share → Copy song link →
     the id is the part after /track/ (before any ?).
     ------------------------------------------------------------ */
  music: {
    endpoint: "https://mariam-now-playing.vercel.app/api/now-playing",
    /* shown only if the endpoint can't be reached */
    fallback: {
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      trackId: "7snQQk1zcKl8gZ92AnueZW",
      albumArt: "https://i.scdn.co/image/ab67616d0000485121ebf49b3292c3f0f575f0f5"
    }
  },

  /* ------------------------------------------------------------
     CONTACT — always visible in the footer, no puzzle required.
     ------------------------------------------------------------ */
  contact: [
    { label: "Email", value: "mariam.ustiashvili@ngt.ge", href: "mailto:mariam.ustiashvili@ngt.ge" },
    { label: "GitHub", value: "github.com/Ustachkaa", href: "https://github.com/Ustachkaa" }
    /* add LinkedIn when ready:
    { label: "LinkedIn", value: "linkedin.com/in/your-handle", href: "https://www.linkedin.com/in/your-handle" } */
  ]
};
