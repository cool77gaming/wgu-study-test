# WGU C190 Introduction to Biology — Mock OA

A 70-question mock Objective Assessment for WGU C190 (Introduction to Biology): instant feedback with a
"confuser trap" on every question, optional memory boosters (blind recall, confidence rating, spaced repetition,
re-queue on a miss…), a 120-minute timer and a per-competency coaching report. It is a static site — no build
step, no server, no accounts.

**Live site:** https://cool77gaming.github.io/wgu-study-test/ (once GitHub Pages is switched on, see below)

## Publish with GitHub Pages (one-time, ~1 minute)

1. Repository **Settings → Pages**.
2. **Source:** *Deploy from a branch*.
3. **Branch:** the branch that has these files (`claude/epic-gauss-tavjse`, or `main` after you merge it) and
   **Folder:** `/ (root)`. Click **Save**.
4. After about a minute the site is live at the URL above. Every push to that branch redeploys it.

## You can always pick up where you left off

The whole exam is saved on the device automatically (answers, bookmarks, position, question and answer order,
timer, booster state, even the results screen) and restored after any interruption:

| What happens | What you see |
| --- | --- |
| Reload, close the tab/browser, phone kills the tab, battery dies | **Welcome back** screen with your question number, answers and time left → *Resume exam* |
| Internet drops mid-exam | Nothing is lost. After the first visit the page itself is cached, so it even reloads offline. |
| You walk away (5 min with no interaction) | Timer pauses automatically and the question is hidden → *Resume exam* |
| Laptop sleeps, tab in background, app switch | Time spent away is **not** counted against the timer |
| You want a break | Tap the timer to pause |
| Exam finished, tab closed | Results and review reappear until you start a new attempt |
| Same exam opened in two tabs | The older tab pauses instead of overwriting newer progress |

Notes:
- Progress lives in this browser on this device (`localStorage`); it does not sync between devices.
  Clearing site data deletes it. Safari may purge data for sites not visited in 7 days.
- Private/incognito windows may block storage; the app shows a warning and still works, but cannot keep progress.

## Neural voice

The optional "Piper" reader loads its libraries (pinned versions) from jsDelivr/cdnjs and a ~60 MB voice model from
Hugging Face the first time it is used, then caches them in the browser. It then works offline too. If it can't load
(first visit while offline, slow connection) the question text is shown instead — after 10 s at most — and the
voice retries on the next question.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (UI, 70-question bank, exam logic) |
| `sw.js` | Service worker: offline support and background updates |
| `manifest.webmanifest`, `icon*.png`, `icon.svg`, `apple-touch-icon.png` | "Add to Home Screen" install support |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

Run locally: `python3 -m http.server` in this folder, then open http://localhost:8000
(opening `index.html` directly also works; offline caching needs `http(s)`).
