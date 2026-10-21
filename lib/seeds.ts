import type { Project } from "@/lib/types";

const day = 86_400_000;
const base = Date.UTC(2026, 3, 2, 15, 0, 0);

export const SEEDS: Project[] = [
  {
    id: "seed-handstand",
    title: "Handstand against the wall",
    story:
      "Tuesday, kitchen wall, socks off. I got my hips over my shoulders for three breaths before the fridge magnet judged me. Left heel still hunts for the baseboard.",
    theme: "learning to handstand",
    status: "in progress",
    kind: "illustration",
    illustrationKey: "handstand",
    rotation: -1.2,
    createdAt: base,
    updatedAt: base,
    standIn: true,
  },
  {
    id: "seed-poem",
    title: "A short poem",
    story:
      "Wrote it on the bus back from the night shift, four lines about the sodium lights on 4th. The last line is still wrong. I like that it is still wrong.",
    theme: "poetry",
    status: "in progress",
    kind: "illustration",
    illustrationKey: "poem",
    rotation: 1.1,
    createdAt: base + day,
    updatedAt: base + day,
    standIn: true,
  },
  {
    id: "seed-basketball",
    title: "Pickup game",
    story:
      "Ran with the regulars at the cracked court behind the library. My jumper was late all night. Somebody passed me the ball anyway, and I made the one that mattered.",
    theme: "basketball",
    status: "finished",
    kind: "illustration",
    illustrationKey: "basketball",
    rotation: -0.6,
    createdAt: base + day * 2,
    updatedAt: base + day * 2,
    standIn: true,
  },
  {
    id: "seed-miles",
    title: "Morning miles",
    story:
      "Three miles before the kettle. Fog sat on the canal and my lungs argued until mile two. I kept the same playlist and did not skip the hill.",
    theme: "sports",
    status: "in progress",
    kind: "illustration",
    illustrationKey: "miles",
    rotation: 1.4,
    createdAt: base + day * 3,
    updatedAt: base + day * 3,
    standIn: true,
  },
  {
    id: "seed-markers",
    title: "Marker studies",
    story:
      "Filled a page with the same tomato square until the edge stopped looking nervous. Black outline, then ochre, then I let one corner stay messy on purpose.",
    theme: "graphic design",
    status: "finished",
    kind: "illustration",
    illustrationKey: "markers",
    rotation: -1.5,
    createdAt: base + day * 4,
    updatedAt: base + day * 4,
    standIn: true,
  },
  {
    id: "seed-dream",
    title: "Dream journal",
    story:
      "Woke at 4:12 with the stairwell still in my hands. I wrote the color of the door before it faded: chipped blue, a brass number that was not ours.",
    theme: "lucid dreaming",
    status: "started",
    kind: "illustration",
    illustrationKey: "dream",
    rotation: 0.8,
    createdAt: base + day * 5,
    updatedAt: base + day * 5,
    standIn: true,
  },
  {
    id: "seed-screen",
    title: "First screen",
    story:
      "The button finally did the thing. It is ugly and it saves. I screenshotted it like it was a finish line, then immediately found three things to hate.",
    theme: "app building",
    status: "started",
    kind: "illustration",
    illustrationKey: "screen",
    rotation: -0.9,
    createdAt: base + day * 6,
    updatedAt: base + day * 6,
    standIn: true,
  },
  {
    id: "seed-granny",
    title: "A granny square",
    story:
      "First granny square that lies flat. Sage, mustard, a tomato center. I counted wrong twice and ripped it back on the couch while the game was on.",
    theme: "crochet",
    status: "finished",
    kind: "illustration",
    illustrationKey: "granny",
    rotation: 1.3,
    createdAt: base + day * 7,
    updatedAt: base + day * 7,
    standIn: true,
  },
  {
    id: "seed-melody",
    title: "Voice-memo melody",
    story:
      "Hummed it into the phone in the stairwell so the neighbors would not hear. Four notes, then a fifth I did not plan. It sounds like walking home.",
    theme: "music",
    status: "started",
    kind: "illustration",
    illustrationKey: "melody",
    rotation: -0.4,
    createdAt: base + day * 8,
    updatedAt: base + day * 8,
    standIn: true,
  },
];

export const SEED_IDS = new Set(SEEDS.map((seed) => seed.id));
