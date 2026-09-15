# Intro films — Round 02

## Digitalization

Status: complete and connected to the Intro page.

Generated through BrowserOS in Thomas / Personal / Unlimited. Gen-4.5, text to video, 16:9, five seconds, MP4, HDR off. The live Unlimited control was selected and Credits was unselected; Runway explicitly stated that this mode does not use credits.

Session: https://app.runwayml.com/video-tools/teams/nongstudio/ai-tools/generate?mode=tools&sessionId=ec42647b-a5ce-4587-89c6-3816cc971d18

The selected shot shows a terracotta character rotating on a scanning turntable beside a monitor displaying its digital representation. The monitor model rotates through several views; its wireframe becomes less prominent near the end. Warm practical light and deep green shadows connect it to the Development and Activation films.

The original 1280 × 720 MP4 is preserved as `digitalization-raw.mp4`. Delivery uses `crop=900:720:150:0,scale=720:576,setsar=1`, retaining the full 5.041667 seconds at 24 fps. H.264 / yuv420p, CRF 22, fast preset, no audio, fast-start MP4. The fixed crop keeps the physical character and digital model visible through the camera push-in.

Delivery: `public/assets/intro/round-02/digitalization.mp4` (602,399 bytes) and its actual first-frame WebP poster (32,522 bytes, quality 85 through Sharp).

### Prompt

Cinematic documentary shot in a cultural digitization workshop. On a dark wooden workbench, a small original terracotta guardian-creature maquette sits on a scanning turntable beside a real computer monitor. Both the complete physical figure and the complete monitor are clearly visible side by side in the central two-thirds of the frame. On the monitor, a precise amber wireframe of the SAME creature gradually resolves into a detailed clay-textured 3D digital twin, with a smooth subtle rotation that reveals its dimensional form. A narrow scanning light slowly travels over the real sculpture; the physical sculpture stays solid and unchanged. An operator in a dark olive shirt is softly visible behind the workbench, watching the capture. Warm late-afternoon tungsten side light, deep forest-green shadows, restrained gold highlights, tactile clay and wood, subtle 35mm film grain, premium art-documentary realism. Quiet purposeful motion, gentle slow camera push-in, one continuous five-second shot. Screen is integrated naturally into the workshop, with restrained neutral light, no floating holograms, no neon blue, no text or logos, no cuts. The visual story is clearly a physical creative character being captured as a reusable digital asset.

## Activation

Source: `design/index-first-frames/round-02/video/raw/curation.mp4`.

The 720 × 576 crop starts at y=352, moved down 56 source pixels from round-01's y=296. Playback retains the original 5.041667 seconds and 24 fps; H.264 / yuv420p, CRF 22, fast preset, no audio, fast-start MP4. The WebP poster is extracted from the encoded first frame at quality 85 through Sharp.

Delivery: `public/assets/intro/round-02/activation.mp4` and `activation.webp`. Prior files remain untouched.

## Verification

- Both replacements fully decode: 720 × 576, H.264 / yuv420p, 24 fps, no audio, 5.041667 seconds, `moov` before `mdat`.
- Both WebP posters match regeneration from their encoded first frames.
- BrowserOS desktop and 390 × 844 mobile: new URLs load, 5:4 frames retain the intended subjects, no horizontal overflow, no video controls, muted playback loops while visible and pauses offscreen.
- Observed both replacement videos wrap back to the start during playback; no captured browser errors or media errors.
- Reduced motion pauses Digitalization and displays its loaded poster.
- `npm run check`: 45 files, zero errors, warnings or hints. Final `npm run build` passes; the pre-existing large demo chunk warning remains.
