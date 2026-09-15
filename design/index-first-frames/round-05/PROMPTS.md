# INDEX Round 05 — Partnerships and Originals

Status: complete — both videos generated, inspected, encoded and integrated into the shared INDEX.
Intro remains round-04 iteration 2; Curation/Contact unchanged.

Runway via BrowserOS, Thomas / Personal / Unlimited. Kling 3.0 Pro selected
because its Frames input accepts first and last frames. The Unlimited mode
dialog explicitly confirms generations do not use credits and lists Kling 3.0 Pro.
5 seconds, portrait 9:16, audio off, HDR off.

Session: https://app.runwayml.com/video-tools/teams/nongstudio/ai-tools/generate?mode=tools&sessionId=efa1e19e-f930-4e71-b5dd-3f7d23ed315e

## Partnerships inputs

- First: `03-partnerships-start.png`, copied from round-04 separate curtains.
- Last: `03-partnerships-end.png`, copied from the user's preferred round-03 interwoven image.

## Partnerships video prompt

A continuous cinematic textile shot guided by the supplied first and last frames. The two separated green and ivory curtains are caught by a slow curling breeze. Their free lengths float inward and pass gently over and under each other, creating a broad open interwoven loop that settles into the exact graceful arrangement in the last frame. The green fabric and ivory fabric remain distinct and continuous. The wind moves the loose cloth edges and folds with natural weight and inertia. A loose airy interlacing, never a tight twisted rope or cinched knot. Preserve the tactile weave and warm backlight. One smooth continuous transition, no cuts, no people or hands, no new fabric, no dissolving or melting. Restrained motion, the final interwoven form is held briefly.

## Originals image prompt

Generated using the built-in imagegen tool, with round-03 Originals as a palette
and lighting reference only. New first frame: `04-originals.png`.

Use case: photorealistic-natural. Asset: 9:16 portrait first frame for the Originals chapter of NONG Studio's website. Input image 1 is ONLY a palette and photographic lighting reference, not a shape or composition to reproduce. Create a new physically believable still life of real 35mm motion-picture film: a modest loosely wound coil of translucent amber-brown celluloid rests on its lower edge on a matte dark olive tabletop, with two or three nested turns clearly visible. One continuous free length exits the coil naturally and lies flat along the tabletop toward the lower foreground, ready to be pulled and unwound. All parts obey gravity, with clear contact shadows, thin realistic film thickness, constant strip width, continuous evenly spaced sprocket perforations along BOTH edges and subtle blank frame divisions. No tall upright sculptural arch, no floating strip, no impossible self-intersections. Camera looks down at a gentle oblique angle, macro editorial cinematography; coil and flat lead occupy the central half of the portrait so the object reads in a narrow vertical crop. Warm soft side light travels through the amber film; deep forest-green background falls out of focus. Quiet tactile art-house mood, subtle analog grain, nuanced material detail, no glaring beam or exaggerated shadow projection. Keep the lower 15% calm and dark enough for a website title overlay, but render NO text. The physical subject is the film itself: no people, hands, human shadows, pictures inside the frames, camera, projector, extra props, labels, logos, typography or watermark. One single photorealistic image, not a collage, not CGI.

## Originals video prompt

Locked-off photographic close-up of the real film coil. The free end lying in the foreground is slowly pulled forward by a steady force outside the frame. The outer turn gently slides free and unwinds from the coil, becoming a longer flat strip on the tabletop. Only the loose outer turn moves substantially; the remaining coil stays resting on its lower edge and rotates just slightly under tension. Constant film width, coherent evenly spaced sprocket holes, realistic thin flexible celluloid, friction and contact shadows. Smooth deliberate physical unwinding and pulling, not wind-blown dancing or floating, not an object turning rigidly as a whole. Preserve the camera, warm daylight and green tabletop. No hands, people, extra reels, machinery, new objects, text, cuts or camera movement.

## Delivery

All earlier assets retained. Complete downloads are in `video/raw/partnerships.mp4`
and `video/raw/originals.mp4`. BrowserOS was used for Runway generation and download;
both jobs completed in Unlimited mode without selecting Credits mode.

Partnerships uses actual first/last frame inputs. The final decoded frame was
visually checked against the preferred round-03 interwoven image: the separate
curtains settle into the supplied broad, loose loop rather than a cinched knot.

Originals uses the new coil first frame above. Its raw generation briefly included
a fingertip at the lower-right edge despite the no-hands prompt. A fixed
`crop=864:1536:108:0` from the 1080×1916 source removes that edge throughout the
clip and retains the coil and unwinding strip. The 40-sample cropped sequence
was visually inspected without a visible hand. Raw source is preserved unchanged;
this is a fixed framing crop, not AI masking. Review images are in `video/review/`.

Web assets: `public/assets/index/round-05/`. Both videos are H.264 / yuv420p,
720×1280, 24 fps, 76 frames (3.166667 seconds), silent, with faststart metadata.
Playback is baked to 1.6× source speed. Posters are WebP quality 85, generated
with the existing Sharp dependency from the actual encoded first frames.

| Asset | Video bytes | Poster bytes | Poster/decoded-first-frame PSNR |
| --- | ---: | ---: | ---: |
| Partnerships | 720255 | 95988 | 40.70 dB |
| Originals | 449726 | 51328 | 42.57 dB |

Encoding filters (FFmpeg, libx264 preset slow, audio removed, faststart):

- Partnerships, CRF 27: `setpts=(PTS-STARTPTS)/1.6,fps=24,scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280,setsar=1,format=yuv420p`
- Originals, CRF 24: `crop=864:1536:108:0,setpts=(PTS-STARTPTS)/1.6,fps=24,scale=720:1280:flags=lanczos,setsar=1,format=yuv420p`

## Verification

- `src/content/home.ts`: only Partnerships/Originals select round-05. Intro stays
  round-04 `intro-v2`; Curation and Contact remain unchanged. No layout changes.
- BrowserOS desktop: each new clip plays on hover, reaches its end at 3.166667 s,
  holds the final frame and resets to time zero/poster on leaving. Screenshots
  of both final frames visually inspected in the INDEX layout.
- BrowserOS 390×844 `/zh/`: all five posters loaded at natural width 720,
  page/viewport width both 390, navigation and five rows visible. Coarse-pointer
  mode leaves all video sources unset and paused. No captured runtime errors or
  HTTP resource responses >=400 during this check.
- BrowserOS desktop reduced motion: hovering both changed chapters leaves all
  sources unset and paused; no captured runtime errors.
- Both MP4 files decoded fully without errors. Codec, dimensions, frame count,
  frame rate, single video-only stream, faststart atom order and poster matching
  were checked programmatically.
- All 12 built pages contain the round-05 URLs and preserved Intro URL; videos
  have `preload="none"`, no initial `src`, and the intended per-item loop flags.
- `npm run check`: 42 files, zero errors/warnings/hints.
- `npm run build`: 12 pages successful; existing large demo chunk warning remains.
- `node --test scripts/curation-controls.test.mjs`: passed.
- SHA-256 comparison with the baseline below: all preserved assets match.
- No production dependencies added, no Git commit or worktree created.

## Preserved baseline (SHA-256)

```text
16290cde2964d4b0a1d95bb6c3ed90472a0aee07d57c0073b6a2f2595bbc97ec  public/assets/index/round-04/intro-v2.mp4
b4e140c9a7711dc455f4e65bafc49544aceeff69e2331d4ae4fc4be0f811b302  public/assets/index/round-04/intro-v2.webp
35036eff096e3775876d86a490a88fa7f8b870514df19b18b33641c867b75a48  public/assets/index/round-04/intro.mp4
a261aa7325b0ba79fac91d940090eda8b21bf1ff6927f4a70216b9fc899972c7  public/assets/index/round-04/intro.webp
78312da4c76dd715281aa84bd5babc44815b360ce02aca7b69ce8e6c3c2aca04  public/assets/index/round-04/originals.mp4
bbde68aaca461d29bd10f127ff197d340619ed4b8531c61db00401eae70bd2aa  public/assets/index/round-04/originals.webp
df49aa33d72e87f91ec601a8398db372431e9bcfe31ada12d1d1bd5586c5ce36  public/assets/index/round-04/partnerships.mp4
35c9371274f2689776f8e924566e31256546f3c7ec9bebfd7cbfa74c1e85e37d  public/assets/index/round-04/partnerships.webp
baefed1d8abfb2d6d4bf88626c6df4e717db7f15272b84a04950ccc38d0acefb  public/assets/index/round-03/curation.mp4
1805fb8f73ddb71392dddf0da19465e25d08f8e7dae8bd6d86f53217dd12bc3d  public/assets/index/round-03/curation.webp
428e6ee02d265e06f5ef72c645ce9362dc025bbe9bf5a5c67d91041fa0256d48  public/assets/index/contact.mp4
1e8422fb9106826552a0ce6ca36aa4c68a458637184ccd324e0f6d608acb7f65  public/assets/index/contact.webp
```
