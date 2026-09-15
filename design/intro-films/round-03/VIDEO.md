# Intro Digitalization — Round 03

Status: complete, reviewed and connected to the Intro page.

## Direction

Replace the rough clay character with an intricately ornamented bronze antiquity. Preserve the juxtaposition of a physical cultural object and its digital twin, and the warm gold / deep green documentary palette. Remove all physical scanning beams, luminous rods and projected lines. Keep digital wireframe graphics confined to the monitor.

## Generation

Runway via BrowserOS, Thomas / Personal / Unlimited, Gen-4.5, text to video, 16:9, five seconds, MP4, HDR off. Unlimited was selected and Credits was unselected. Runway stated that this mode does not use credits.

Session: https://app.runwayml.com/video-tools/teams/nongstudio/ai-tools/generate?mode=tools&sessionId=ec42647b-a5ce-4587-89c6-3816cc971d18

### Prompt

A photorealistic museum-conservation documentary, one locked-off five-second shot. On a dark walnut workbench sits a finely crafted ancient Chinese bronze ritual vessel, with two sculpted animal-head handles, a flared rim and a short pedestal foot. Its surface is extraordinarily intricate: crisp miniature relief ornament, dense interlocking scroll patterns, delicate incised borders, naturally aged green patina, tiny corrosion pits and subtle warm bronze highlights. It has the material complexity and gravitas of a genuine museum antiquity, beautifully lit and in sharp focus. Immediately beside it, a real desktop monitor displays the EXACT SAME vessel as a very detailed 3D digital twin, matching its handles, silhouette and ornament. The monitor model turns slowly through a small angle, a fine dense amber wire mesh softly resolves into its high-resolution bronze surface. The physical vessel turns almost imperceptibly on a discreet low conservation turntable, preserving its exact solid shape and fine ornament throughout. The two objects stay close together and completely visible in the central 60 percent of the image, with generous empty margins on both sides. A conservator and a photogrammetry camera are softly out of focus in the background. Constant soft warm side lighting, deep olive-green shadows, restrained gold highlights, tactile photographic realism and subtle 35mm grain, like a premium cultural documentary. Lighting stays entirely steady. All wireframe graphics remain INSIDE the monitor. Clean unobstructed physical scene: absolutely no laser, no scanning line, no luminous rod, no moving light stripe, no projection on the artifact, no floating graphics. No clay creature, toy, coarse polygons, cartoon rendering, cracks opening, deformation, camera push-in or cuts.

## Preserved active assets

Development remains in round-01. Activation retains its approved lowered crop in round-02. All previous Digitalization sources and encodes remain available.

## Selected result and delivery

The bronze vessel has raised scrollwork, dotted relief and ornamented handles. The physical object turns on its low platform while the corresponding model rotates on the monitor. The shot uses constant lighting and a stable camera; no scanning line, luminous rod or projected beam appears in the physical scene. This is an illustrative generated antiquity, not a claim about a specific museum collection.

The raw 1280 × 720 source is preserved as `digitalization-raw.mp4`. Encode with `crop=900:720:200:0,scale=720:576,setsar=1`, H.264 / yuv420p, CRF 22, fast preset, no audio, and fast-start. Retain the full 5.041667 seconds at 24 fps. The fixed crop keeps both vessel representations in view through their rotation.

Delivery: `public/assets/intro/round-03/digitalization.mp4` (557,290 bytes) and `digitalization.webp` (32,028 bytes). The quality-85 WebP is extracted from the encoded first frame through Sharp.

## Verification

- Reviewed sampled frames across the entire raw and cropped shots: stable vessel detail and shape; no physical scanning line.
- Full decode passes: one video stream, H.264 / yuv420p, 720 × 576, 24 fps, 5.041667 seconds, `moov` before `mdat`.
- Poster matches regeneration from the encoded first frame.
- BrowserOS at 1280 × 900 and 390 × 844: expected new media URLs, no overflow, readable object details and intact 5:4 composition.
- Observed muted playback loop back to the start; no controls or captured browser/media errors. Reduced motion pauses playback and displays the new poster.
- `npm run check`: 45 files, zero errors/warnings/hints. `npm run build` passes with the existing large demo chunk warning.
- SHA-256 confirms Development, Activation and both previous Digitalization assets remain unchanged.
