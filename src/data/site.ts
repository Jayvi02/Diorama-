// All page content lives here. When the final media arrives, drop the files
// into /public and update the paths below — no other code needs to change.

export const project = {
  caseNo: "SE3041-26",
  title: "The Last Bath",
  tagline: "A miniature post-crime scene, rebuilt frame by frame.",
  summary:
    "A hand-built diorama of an abandoned, survival-horror style bathroom moments after a crime. Chalk outlines, evidence markers, police tape and blood spatter — every piece made by hand at miniature scale, then filmed, composited and brought to life with VFX.",
  module: "SE3041 · Digital Video Production and Delivery",
  institution: "Faculty of Computing · SLIIT",
  year: "Year 3, Semester 2 · 2026",
};

export type Member = { name: string; itNumber: string; role: string };

// TODO: fill in real names and IT numbers (required for submission).
export const team: Member[] = [
  { name: "Member Name 01", itNumber: "IT2XXXXXXX", role: "Web development · Diorama build" },
  { name: "Member Name 02", itNumber: "IT2XXXXXXX", role: "Video editing · VFX" },
  { name: "Member Name 03", itNumber: "IT2XXXXXXX", role: "Photography · 360° capture" },
];

export type VideoItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  // Path under /public, e.g. "/media/final-30s.mp4". Leave empty until the file is ready.
  src: string;
  poster?: string;
  duration?: string;
};

export const videos: { final: VideoItem; making: VideoItem } = {
  final: {
    id: "final",
    label: "Exhibit A",
    title: "Final Film",
    description:
      "The 30 second final cut — diorama, miniatures and live action combined with set extension, chroma keying and CGI.",
    src: "",
    poster: "/images/scene-01.jpg",
    duration: "0:30",
  },
  making: {
    id: "making",
    label: "Exhibit B",
    title: "Making Of",
    description:
      "Behind the scenes — from the first sketch and foundation to painting, lighting the set and the green-screen shoot.",
    src: "",
    poster: "/images/scene-01.jpg",
  },
};

export type EvidenceObject = {
  marker: number;
  name: string;
  description: string;
  details: string[];
  // Folder under /public holding frames named 1.<ext>, 2.<ext>, ... <frames>.<ext>
  imageDir: string;
  imageExt: "jpg" | "png" | "webp";
  frames: number;
  // Shows a "sample frames" badge until real 360° photos replace the lecture demo set.
  placeholder?: boolean;
};

// TODO: replace imageDir/frames with the real 360° captures, e.g. "/360/bathtub", 36 frames, "jpg".
export const evidence: EvidenceObject[] = [
  {
    marker: 1,
    name: "The Bathtub",
    description: "Sculpted and textured by hand, weathered to look decades past its last clean.",
    details: ["Clay & plaster", "Hand painted", "Aged finish"],
    imageDir: "/360/demo",
    imageExt: "png",
    frames: 64,
    placeholder: true,
  },
  {
    marker: 2,
    name: "The Toilet",
    description: "A cracked, stained porcelain fixture built at 1:12 scale beside the chalk outline.",
    details: ["Clay & plaster", "Grime wash", "1:12 scale"],
    imageDir: "/360/demo",
    imageExt: "png",
    frames: 64,
    placeholder: true,
  },
  {
    marker: 3,
    name: "The Cabinet",
    description: "The blood-streaked cabinet at the heart of the scene — the first thing investigators saw.",
    details: ["Foam board", "Blood spatter", "Distressed paint"],
    imageDir: "/360/demo",
    imageExt: "png",
    frames: 64,
    placeholder: true,
  },
];

export const process = [
  { step: "01", title: "Concept", text: "A daily-life space turned crime scene — an old, survival-horror style bathroom." },
  { step: "02", title: "Sketch & Scale", text: "Layout planned on paper between A4 and A3 before a single cut was made." },
  { step: "03", title: "Foundation", text: "Base, walls and a hand-cut tiled floor built to match the sketch." },
  { step: "04", title: "Miniatures", text: "Three main objects plus markers, police tape, chalk outline and blood spatter." },
  { step: "05", title: "360° Capture", text: "Each main object photographed in sequence under consistent light." },
  { step: "06", title: "Storyboard & Shoot", text: "Scenes, angles and transitions planned, then live action shot on green screen." },
  { step: "07", title: "VFX & Edit", text: "Set extension, compositing, colour matching and CGI brought into one cut." },
];

// Stills for the gallery. Add more paths under /public/images as they come in.
export const gallery = [
  { src: "/images/scene-01.jpg", alt: "The diorama: evidence markers 1–3, chalk outline and police tape across the tiled bathroom floor" },
];

// Full-screen image behind the title at the top of the page.
export const coverImage = "/images/cover.webp";
