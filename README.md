# GEM Workout Tracker

Mobile-first workout tracker app. No build step required — pure HTML + vanilla JS.

## Files

```
gym_tracker/
├── index.html      ← Main entry point (open this in browser)
├── app.js          ← All React app logic
├── style.css       ← Styles
├── images/         ← Put exercise images here (referenced from app)
└── README.md
```

## Usage

Open `index.html` in any modern browser — works offline.

## GitHub Pages deployment

1. Push all files to a GitHub repo
2. Go to Settings → Pages → Source: main branch / root
3. Your tracker will be live at `https://<username>.github.io/<repo>/`

## Exercise images

- In Edit mode, tap "📷 Upload image" on any exercise
- Images are stored in browser localStorage (tied to the device)
- For permanent images across devices: add image files to the `images/` folder and reference them by filename — contact developer to wire up path-based loading

## Features

- Workout groups (Push A, Pull B, Legs, Core, Home — all editable)
- Add / delete workout groups and exercises
- Per-exercise image upload (shows during active workout)
- Yellow countdown timer during rest periods
- Set button: "▶ Start" on first set → "✓ Complete Set" → "🏁 Complete Workout" on last set of last exercise
- Workout history
- All data saved to localStorage (persists between sessions)
