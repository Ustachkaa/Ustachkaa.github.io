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
      note: "Add a one-line description of what SideQuest is and does.",
      href: "https://github.com/playmode-labs"
    },
    {
      sign: "DemoBlaze Automation",
      tag: "QA automation · Selenium",
      note: "Automated test suite for the DemoBlaze demo shop. Add details.",
      href: ""
    },
    {
      sign: "Saucedemo Testing",
      tag: "Software testing",
      note: "Testing project for the Saucedemo store. Add details.",
      href: "https://github.com/Ustachkaa/SaucedemoSoftwareTestingProject"
    },
    {
      sign: "Chameleon Color Detector",
      tag: "Computer vision",
      note: "Add a one-line description and a link.",
      href: ""
    },
    {
      sign: "Movie Genre Identifier",
      tag: "NLP · machine learning",
      note: "Add a one-line description and a link.",
      href: ""
    },
    {
      sign: "Student Den",
      tag: "Student platform",
      note: "Add a one-line description and a link.",
      href: ""
    },
    {
      sign: "ML-Agents Experiments",
      tag: "Unity · reinforcement learning",
      note: "Trained agents with rays, sensors and continuous control. Add details.",
      href: ""
    },
    {
      sign: "Queen of Hearts",
      tag: "CSS art",
      note: "A playing card drawn entirely in CSS. Add a link.",
      href: ""
    },
    {
      sign: "This Website",
      tag: "Vanilla JS · you're playing it",
      note: "A portfolio you have to solve. View source — it's all there.",
      href: "https://github.com/Ustachkaa/Ustachkaa.github.io"
    }
  ],

  /* ------------------------------------------------------------
     EDUCATION STREET
     One entry per glowing sign along the street, oldest first.
     Unlocked by completing the marked diagonal on the board.
     ------------------------------------------------------------ */
  education: [
    { years: "20XX – 20XX", title: "High School", place: "City, Country", note: "Where it started." },
    { years: "20XX – 20XX", title: "BSc — Your Degree", place: "University name", note: "Thesis, favourite courses, honours…" },
    { years: "20XX – …",    title: "What's next", place: "", note: "The street keeps going." }
  ],

  /* ------------------------------------------------------------
     CONTACT — always visible in the footer, no puzzle required.
     ------------------------------------------------------------ */
  contact: [
    { label: "Email", value: "your@email.here", href: "mailto:your@email.here" },
    { label: "GitHub", value: "github.com/Ustachkaa", href: "https://github.com/Ustachkaa" },
    { label: "LinkedIn", value: "linkedin.com/in/your-handle", href: "https://linkedin.com" }
  ]
};
