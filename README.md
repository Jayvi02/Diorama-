# The Last Bath — Diorama Case File

SE3041 Digital Video Production and Delivery: project site for the post-crime-scene bathroom diorama.
Built with Next.js (static, no backend) and hosted on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Adding the final media

All text and media paths are in `src/data/site.ts`. Nothing else needs editing.

| What | Put the file in | Then in `src/data/site.ts` |
| --- | --- | --- |
| Final 30s video | `public/media/final-30s.mp4` | `videos.final.src = "/media/final-30s.mp4"` |
| Making-of video | `public/media/making-of.mp4` | `videos.making.src = "/media/making-of.mp4"` |
| 360° frames (×3) | `public/360/<object>/1.jpg … N.jpg` | for each `evidence` item set `imageDir`, `imageExt`, `frames`, and remove `placeholder` |
| Extra stills | `public/images/…` | add to `gallery` |
| Team names / IT numbers | — | edit `team` (required for submission) |

Notes:
- 360° frames must be numbered from `1` with no gaps (`1.jpg, 2.jpg, …`), all the same size, ideally square.
  Around 1080×1080 JPG keeps them sharp and light. Export as JPG rather than PNG to keep the site fast.
- Export videos as H.264 MP4. Keep each one under ~50 MB (1080p, ~8 Mbps is plenty for 30 s).
- `public/360/demo` holds the lecture's sample mouse frames used as placeholders. Delete it once the real frames are in.

## 360° viewer

`public/js/tikslus360.js` is the lecture-provided Tikslus360 plugin, updated so it:
- scales mouse position to the canvas (works when the viewer is resized for mobile/desktop)
- supports touch (drag a finger to rotate)
- resets the canvas blend mode after zooming, so later frames don't go blank

`src/components/Viewer360.tsx` loads jQuery and the plugin and starts each viewer when it scrolls into view.

## Deploy to Vercel

Option A, CLI (no GitHub needed):

```bash
npx vercel login
npx vercel --prod
```

Accept the defaults (framework is detected as Next.js). The command prints the live URL.

Option B, GitHub: push this folder to a GitHub repo, then on vercel.com choose **Add New → Project**, import the repo, and press **Deploy**.
Every later push redeploys automatically.
