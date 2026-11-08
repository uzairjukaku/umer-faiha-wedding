# Umer Azzam & Faiha — wedding invitation website

A self-contained static site: plain HTML/CSS/JS, no build step, no server code, no external
dependencies except the Google Maps embed. Fonts and images are bundled.

```
index.html                 all text content + link-preview tags
css/style.css              styles + animations
js/main.js                 curtain intro, petals, countdown, share, music (config at the top)
assets/img/                card artwork (text removed), rings, florals, og-image.jpg, invitation-card.jpg, icons
assets/fonts/              Great Vibes, Cormorant Garamond, Cinzel, Amiri Quran (SIL OFL)
assets/calendar/           nikah-umer-faiha.ics, lunch-umer-faiha.ics
assets/audio/              put music.mp3 here (optional)
```

## Deploy on Vercel

1. Vercel → **Add New… → Project** → import this GitHub repo.
2. Framework preset: **Other**. Leave Build Command and Output Directory empty (it's a static site).
3. Keep the project name **umer-faiha-wedding** so the address is `https://umer-faiha-wedding.vercel.app`.
   That address is already set in `index.html` for the WhatsApp/link preview (`og:url`, `og:image`).
   If Vercel gives you a different address, change it in those 2 places and push.

Every push to `main` redeploys automatically.

**Music (optional):** add your track as `assets/audio/music.mp3` and push. It starts on the guest's
first tap (browsers block sound before that), and a music button appears. No music? Delete the
`<audio>` line near the end of `index.html`.

**Testing the WhatsApp preview:** WhatsApp caches previews per URL. After changing the preview image
or title, share the link with a query string (e.g. `…/?v=2`) to get a fresh preview.

Preview locally: `python3 -m http.server 8080` → http://localhost:8080

## Editing

- **Text on the card / sections:** `index.html`. Each card line has its own vertical position
  (`--y`, in pixels of the original 1142×1600 card) and entrance delay (`--d`).
- **Countdown + share text:** top of `js/main.js` (`NIKAH_START`, `LUNCH_END`, `SHARE_TEXT`).
- **Calendar:** Google Calendar links are in `index.html`; Apple/Outlook files in
  `assets/calendar/`. The Nikah entry assumes **5:00–7:00 PM** (the card gives no end time).
- **Map:** the hall couldn't be confirmed on Google Maps, so the map searches
  *"M.M. Siddique Shadi Hall, Bunder Road, Bhatkal"*. If you have the exact pin: Google Maps →
  *Share → Embed a map* → copy the `src` into the `<iframe>`; put the normal share link in the
  *Get directions* button (`#dirBtn`).
- **Downloadable card:** `assets/img/invitation-card.jpg` is the web version of the card
  (corrected spelling). Swap in another image if you prefer the printed original.

## Notes

- `noindex` is set, so search engines won't list the page. Link previews still work.
- Respects *Reduce motion* (no curtains/petals, everything shown at once) and works without JavaScript.
- The curtains open on their own after a moment (tap to open sooner). Tap the card to skip its animation.
