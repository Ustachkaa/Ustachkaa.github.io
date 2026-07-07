# mariam ustiashvili — solve to enter

A portfolio locked behind a mini sudoku, live at **[ustachkaa.github.io](https://ustachkaa.github.io)**.

## How it works

The homepage is a playable 9×9 sudoku on a night street. A fresh puzzle is dealt for every visitor (returning visitors resume theirs; "Start over" deals a new one), and most of the board is pre-filled so each block only takes a few entries:

- **Complete a 3×3 block** → fireworks, and one of the nine project storefronts below the board switches on. The project grid mirrors the sudoku's block layout, and a finished block becomes clickable — it jumps to its project.
- **Complete the marked diagonal** (the amber dashes) → *Education Street* opens: a tiny platformer. A pixel girl walks with ← →, jumps with space, dodges cones and collects stars. Near each milestone banner a building rises behind it — a grand campus at university, a schoolhouse at school, a giant sealed certificate, a construction crane for what's next — and her outfit changes to match (graduation gown, backpack, sash, hard hat).
- **Complete the whole board** → grand finale.
- **In a hurry?** The cheat sheet folded into the top-right corner shows the full solution and can solve the board for you.

Progress is saved in the browser, and "Start over" resets it.

## Editing the content

Everything written on the site lives in **`js/content.js`** — the tagline, the nine projects, the Education Street milestones, and the contact links. Edit that one file to add real qualifications; no other file needs to change.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies — just open `index.html` or serve the folder.

```
index.html        page structure
css/style.css     the night-street design system
js/content.js     ✏️ all editable content
js/app.js         sudoku game + unlock logic
js/fireworks.js   canvas particle bursts
js/street.js      the Education Street overlay
```
