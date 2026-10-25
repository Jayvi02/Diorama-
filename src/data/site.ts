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

export type Member = { name: string; itNumber: string };

export const team: Member[] = [
  { name: "Jayavi T P W N", itNumber: "IT23682382" },
  { name: "Gunawardhana E W C I", itNumber: "IT23542174" },
  { name: "R M V S Rathnayaka", itNumber: "IT23434950" },
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
    poster: "/images/cover.webp",
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
  // Where the object sits in the cover image, as % of its width / height (for the scene hotspots).
  spot: { x: number; y: number };
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
    spot: { x: 39, y: 36 },
    imageDir: "/360/demo",
    imageExt: "png",
    frames: 64,
    placeholder: true,
  },
  {
    marker: 2,
    name: "The Toilet",
    description: "A cracked, stained porcelain fixture built at 1:12 scale, metres from the chalk outline.",
    details: ["Clay & plaster", "Grime wash", "1:12 scale"],
    spot: { x: 62, y: 37 },
    imageDir: "/360/demo",
    imageExt: "png",
    frames: 64,
    placeholder: true,
  },
  {
    marker: 3,
    name: "The Sink",
    description: "The blood-streaked sink and pedestal at the heart of the scene — the first thing investigators saw.",
    details: ["Foam board", "Blood spatter", "Distressed paint"],
    spot: { x: 87, y: 38 },
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

// Full-screen image behind the title, also used for the interactive scene.
export const coverImage = "/images/cover.webp";
export const coverSize = { width: 1672, height: 941 };
