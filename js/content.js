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
    "I'm Mariam Ustiashvili — a full-stack software engineer from Tbilisi, Georgia who likes problems that look like games, and games that are secretly problems.",
    "I studied Computer Science at the University of Debrecen in Hungary, after four years as a freelance QA tester on uTest, carefully breaking products like Disney+, Google and Wolt so their users never saw them break. Today I'm a Junior Software Engineer at NGT Group, building Qmatic-based queue management systems and leading my team's adoption of agentic AI tools like Claude Code.",
    "This site is how I think: give people something playful, and keep the serious work just underneath. Every solved block below opens a piece of it."
  ],

  /* ------------------------------------------------------------
     VOICE INTRO — a recording of you reading the About text.
     Record on your phone, save the file into the assets/ folder,
     and put its path here (e.g. "assets/about-mariam.mp3" or .m4a).
     Empty keeps the player hidden.
     ------------------------------------------------------------ */
  aboutAudio: "",

  /* ------------------------------------------------------------
     THE NINE PROJECTS
     They sit in a 3×3 grid that mirrors the sudoku blocks:
     finishing the top-left block lights project 1, and so on.
     ------------------------------------------------------------ */
  projects: [
    {
      sign: "Bearings",
      tag: "TypeScript · Express + React",
      note: "An investing tutor: lessons, calculators, a practice portfolio and market alerts.",
      href: "https://github.com/Ustachkaa/Bearings",
      details: [
        "A personal investing companion for first-time, long-term investors: a 26-lesson course with worked maths and quizzes, 18 calculators, and live prices for any stock, ETF, index or crypto with a transparent, rule-based stance explained in plain words.",
        "Watchlist rules (dips, RSI, golden cross, big daily moves) fire in-app and email alerts, and a practice portfolio trades pretend money at real prices with a journal that asks why on every trade."
      ]
    },
    {
      sign: "Anyform",
      tag: "SaaS · Next.js + Fastify",
      note: "Any file, any format: a file-converter SaaS with job queues, workers and billing.",
      href: "https://github.com/Ustachkaa/anyform",
      details: [
        "Converts video, audio, images, documents, spreadsheets, presentations and ebooks between formats. A Next.js 15 front end talks to a Fastify API; jobs run on a Postgres-backed pg-boss queue and a worker driving ffmpeg, LibreOffice, pandoc, ImageMagick and more.",
        "PostgreSQL with Prisma, S3-compatible storage, Stripe billing behind a provider interface, and Docker Compose for a single-host deploy."
      ]
    },
    {
      sign: "Student Den",
      tag: "Flutter · Firebase · BSc thesis",
      note: "A mobile companion app for international students.",
      href: "https://github.com/Ustachkaa/student_den",
      details: [
        "My Computer Science thesis project: a Flutter app that helps international students with local services, maps, student discounts and cultural integration.",
        "Firebase Authentication and Firestore for real-time user data, custom UI components, navigation flow and error-state handling."
      ]
    },
    {
      sign: "Web Locker",
      tag: "Android · Kotlin + Compose",
      note: "Locks a tablet into a single web app — built for ticket machines and kiosks.",
      href: "https://github.com/Ustachkaa/Web_Locker",
      details: [
        "A kiosk app running in Device Owner mode: hardware buttons are blocked, the app can't be unpinned, and the web app fills an immersive full-screen WebView.",
        "Administrators exit with an X button or a 10-second press. Built with Kotlin, Jetpack Compose and Material 3."
      ]
    },
    {
      sign: "Spots",
      tag: "Express + React + Leaflet",
      note: "A map of places you want to see, with routes between them.",
      href: "https://github.com/Ustachkaa/Spots",
      details: [
        "Paste a TikTok, Instagram or Google Maps link and the place lands on the map, with its caption, thumbnail or address pulled in automatically.",
        "Filter by category or visited status, then plan a walking, cycling or driving route through your picks, reorder it into the shortest trip, and hand it to Google Maps."
      ]
    },
    {
      sign: "Saucedemo Automation",
      tag: "QA · Selenium + Cucumber",
      note: "A BDD test suite for the Saucedemo store, written in Java.",
      href: "https://github.com/Ustachkaa/Saucedemo_Website_Automation_Testing_Project",
      details: [
        "Automated end-to-end tests covering login, product browsing and sorting, the cart and the full checkout flow.",
        "Scenarios written in Gherkin and run with Cucumber, Selenium WebDriver, JUnit and Maven."
      ]
    },
    {
      sign: "Library REST API",
      tag: "API design",
      note: "A complete REST API design for a library management system.",
      href: "https://github.com/Ustachkaa/REST_API_for_Library_System",
      details: [
        "40+ documented endpoints for books, borrowing and returns, reservation queues and fines, plus scheduled jobs for overdue checks and due-date reminders.",
        "HATEOAS (Richardson level 3), JWT authentication, pagination, meaningful status codes and a caching strategy."
      ]
    },
    {
      sign: "Movie Genre Identifier",
      tag: "NLP · TensorFlow",
      note: "Guessing a film's genre from its synopsis alone.",
      href: "https://github.com/Ustachkaa/Movie_Genre_Identifier_NLP_Project",
      details: [
        "An NLP classifier that predicts genres from plot summaries: tokenisation, stop-word removal and lemmatisation, then models built with TensorFlow, Keras and scikit-learn.",
        "Evaluated with accuracy, precision, recall and F1, and runnable straight from Google Colab."
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
    { type: "certificate", years: "02/2021", title: "Responsive Web Design", place: "Certification", note: "Where the front-end habit started." },
    { type: "certificate", years: "09/2024", title: "Microsoft Certified: Azure Fundamentals", place: "Microsoft", note: "Cloud concepts, Azure services, security and governance." },
    { type: "certificate", years: "10/2024", title: "IT Specialist in Python", place: "Certification", note: "Information Technology Specialist in Python." },
    { type: "certificate", years: "02/2025", title: "HTML5 Application Development", place: "Certification", note: "Building apps with HTML5, CSS and JavaScript." },
    { type: "university",  years: "Graduated 06/2025", title: "BSc Computer Science", place: "University of Debrecen, Hungary", note: "Thesis: Student Den, a mobile companion app for international students." },
    { type: "certificate", years: "06/2026", title: "Anthropic Claude courses", place: "Anthropic", note: "Claude Code in Action, Claude Code 101, AI Fluency, AI Capabilities and Limitations, Claude 101." },
    { type: "future",      years: "…", title: "What's next", place: "", note: "The street keeps going." }
  ],

  /* ------------------------------------------------------------
     EXPERIENCE STREET — jobs and work, oldest first.
     Unlocked by completing the second (cyan) diagonal.
     `type` options here: internship (mid-rise with an awning),
     office (glass tower), future (under construction).
     ------------------------------------------------------------ */
  experience: [
    { type: "office",     years: "01/2020 – 04/2024", title: "Freelance QA Tester", place: "uTest · remote", note: "Functional, exploratory, regression and localisation testing for products including Disney+, Google and Wolt." },
    { type: "internship", years: "02/2025 – 04/2025", title: "Web Development Intern", place: "Lime Light Renhold AS, Oslo · remote", note: "A 320-hour full-stack internship: responsive front ends in HTML, CSS and JavaScript, versioned with Git." },
    { type: "office",     years: "12/2025 – now", title: "Junior Software Engineer (Full-Stack)", place: "NGT Group, Tbilisi", note: "Full-stack features for Qmatic-based queue management systems; led the team's adoption of Claude Code and agentic AI tools." },
    { type: "future",     years: "…", title: "Your company here?", place: "", note: "The street has room for more buildings." }
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
    { label: "Email", value: "ustachka@gmail.com", href: "mailto:ustachka@gmail.com" },
    { label: "GitHub", value: "github.com/Ustachkaa", href: "https://github.com/Ustachkaa" },
    { label: "LinkedIn", value: "linkedin.com/in/mariam-ustiashvili-949992204", href: "https://www.linkedin.com/in/mariam-ustiashvili-949992204" }
  ],

  /* ------------------------------------------------------------
     INSTAGRAM — the button above the globe, bottom-right.
     Paste your profile URL to switch it on; empty keeps it hidden.
     ------------------------------------------------------------ */
  instagram: ""
};
