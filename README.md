# AN EPIC SAGA

Saga’s personal project notebook. Music, poems, handstands, pickup games, and whatever theme comes next live here as painted squares on yellowed graph paper.

Photos and videos stay in this browser. There is no account and no server database. The first visit fills the grid with painted stand-ins you can replace, edit, or tear out.

## Run it locally

```bash
npm install
npm run dev
```

The dev server listens on [http://127.0.0.1:47291](http://127.0.0.1:47291) (and on the local network, bound to `0.0.0.0`).

## What the page does

- A bingo-card grid of projects. Tap a square to read it, edit the lines, change its status, swap the photo or video, or delete it.
- Status is one of three: started, in progress, finished.
- The plus square adds a project. Pick a photo or a video from the gallery, or save the words first and add the picture later.
- Videos show a still on the grid and on the theme map. The clip plays, with controls, only after you open the square. Clips over 50MB are refused.
- The map icon opens a hand-drawn cluster of projects by theme.
- Everything is stored in IndexedDB on this phone or computer.
