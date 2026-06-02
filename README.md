# GEM Workout Tracker

Mobile-friendly workout tracker for the GEM Flexible Workout Plan.
**47 yo · 74 kg · 174 cm** — Push / Pull / Legs / Core / Home

## Files

```
workout-app/
├── index.html          ← Open this in your browser
├── css/styles.css      ← All styles
├── js/
│   ├── data.js         ← Default workout data (from Excel)
│   └── app.js          ← App logic (vanilla JS, no dependencies)
└── images/
    └── README.txt      ← Put exercise images here
```

## Usage

1. Open `index.html` in Chrome, Safari, or any modern browser
2. **Add to Home Screen** (mobile) for app-like experience:
   - iPhone: Safari → Share → "Add to Home Screen"
   - Android: Chrome → Menu → "Install App"

## Features

- ✅ Push (A) / Pull (B) / Legs / Core / Home Evening workouts
- ✅ Exercise-by-exercise guided workout
- ✅ Set counter with "Start" / "Complete" buttons
- ✅ Rest countdown timer (yellow ring)
- ✅ Upload image per exercise
- ✅ Edit exercises — name, sets, reps, weight, rest, notes
- ✅ Add new workout groups
- ✅ Workout history
- ✅ All data saved locally (localStorage)

## GitHub Pages Deploy

1. Push all files to a GitHub repo
2. Settings → Pages → Deploy from main branch
3. Your app is live at `https://username.github.io/repo-name`

## Exercise Images

Upload images directly in the app (Edit → exercise → Upload Image).
Images are saved in your browser's localStorage.

For GitHub Pages, you can also place images in the `images/` folder:
- Naming: `workoutKey-exerciseId.jpg` (e.g. `A-1.jpg` for DB Bench Press)
