# Umer Azzam & Faiha — Nikah invitation (Emerald & Gold)

A static site: plain HTML/CSS/JS, no build step, no dependencies. Fonts and graphics are bundled
(all ornaments — arches, lanterns, geometric pattern — are drawn in code, so they stay sharp).

```
index.html            content + link-preview tags + the SVG ornaments
css/style.css         emerald & gold styles and animations
js/main.js            curtains, arch drawing, gold dust, countdown, calendar menu, music
assets/fonts/         Alex Brush, Marcellus SC, Cormorant Garamond, Amiri Quran (SIL OFL)
assets/img/           og-image.jpg (WhatsApp preview), favicon.svg, apple-touch-icon.png
assets/calendar/      nikah-umer-faiha.ics, lunch-umer-faiha.ics
assets/audio/         put music.mp3 here (optional)
```

## Deploy (Vercel)

The repo is connected to Vercel, so every push to `main` redeploys automatically:

```
git add -A
git commit -m "Update invitation"
git push
```

First-time setup, if needed: Vercel → **Add New… → Project** → import this repo → framework preset **Other**
(no build command, no output directory).

The link preview (`og:url`, `og:image` in `index.html`) points to `https://umer-faiha-wedding.vercel.app`.
If your Vercel address is different, change it in those 2 places.

## Page flow

1. **Curtains**: emerald velvet with gold trim, open on their own after a moment (tap to open sooner).
2. **Hero**: a Mughal arch draws itself in gold under swaying lanterns; Bismillah, names, date.
3. Invitation from the family → the couple → Quran verse (Ar-Rum 30:21) → countdown →
   Nikah & Lunch cards with Add to Calendar → venue map → closing monogram.

## Editing

- **Text:** `index.html`.
- **Countdown:** top of `js/main.js` (`NIKAH_START`, `LUNCH_END`).
- **Colours:** CSS variables at the top of `css/style.css` (`--em-*` emerald, `--gold*`).
- **Calendar:** Google Calendar links in `index.html`, Apple/Outlook files in `assets/calendar/`.
  The Nikah entry assumes **5:00–7:00 PM** (the card gives no end time).
- **Map:** searches "M.M. Siddique Shadi Hall, Bunder Road, Bhatkal". For an exact pin: Google Maps →
  Share → Embed a map → copy its `src` into the `<iframe>`; put the share link in the *Get directions* button.
- **Music (optional):** add `assets/audio/music.mp3` and push. It starts on the guest's first tap (browsers
  block sound before that) and a music button appears. No music? Delete the `<audio>` line in `index.html`.

## Notes

- `noindex` is set, so search engines won't list the page; link previews still work.
- WhatsApp caches previews per link: after changing the preview, share `…/?v=2` to get a fresh one.
- Respects *Reduce motion* and works without JavaScript. Tap the hero to skip its animation.
