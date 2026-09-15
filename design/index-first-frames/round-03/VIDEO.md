# INDEX Round 03 — Runway motion

Status: complete. All four videos generated, visually reviewed, compressed and
connected to the shared INDEX through `src/content/home.ts`. Contact unchanged.

Source: the four approved round-03 PNGs. Contact is unchanged.
Runway via BrowserOS, Thomas / Personal / Unlimited, Gen-4.5, image-to-video,
9:16, 5 seconds, MP4, HDR off. Unlimited mode; no credit-mode generation.

Session: https://app.runwayml.com/video-tools/teams/nongstudio/ai-tools/generate?mode=tools&sessionId=5adebc57-eca4-4f99-9a7c-76da44b47bdc

## Intro

Locked-off intimate still life, one continuous shot. The existing raised blank paper page lifts just a few millimeters in a faint breeze, softly trembles, then settles close to its starting position. Very subtle natural dappled daylight drifts across the paper fibers and green linen. The book remains stationary and preserves its exact shape. Quiet art-house cinema, restrained tactile motion. Preserve the input composition, materials and colors. No full page turn, no camera movement, no cuts, no people, hands, human shadows, writing or new objects.

## Curation

Locked-off close view of the ceramic vessel behind the olive linen scrim. A faint breeze moves the existing translucent scrim a few centimeters sideways, gently revealing a little more of the vessel, then it softly settles toward its starting position. The ceramic vessel and dark plinth remain perfectly still and unchanged. Quiet warm natural sidelight, delicate fabric weave, restrained art-house cinema. One continuous shot preserving the exact first-frame composition and colors. No camera movement, cuts, people, hands, human shadows, text, new exhibits or new objects.

## Partnerships

Locked-off close textile still life. The existing green and ivory fabric ribbons breathe gently together in a faint breeze, moving only a few millimeters. Their shared loose interwoven loop remains intact and keeps its exact structure. The folds ease softly back toward the starting pose. Warm natural light reveals the fibers with only a very slight shift. Quiet tactile art-house cinema, one continuous shot. Preserve the input composition and colors. No untying, morphing, spinning, camera movement, cuts, people, hands, human shadows, text or new objects.

## Originals

Locked-off intimate still life of the existing amber celluloid strip. Its base stays fixed on the dark surface while the upright curve flexes very slightly in a faint breeze, then eases back toward its starting shape. A restrained warm natural highlight drifts softly through the translucent film and its delicate shadow. Preserve the sprocket holes, empty frames, exact composition and colors. Quiet analog art-house cinema, one continuous shot. No flying film, reels, frame pictures, people, hands, human shadows, text, new objects, camera movement or cuts.

## Web delivery

- Versioned output: `/assets/index/round-03/{intro,curation,partnerships,originals}.{mp4,webp}`.
- Keep all previous `/assets/index/*.mp4` and `.webp` untouched.
- Match previous short hover length (~3.17 s), 720×1280, 24 fps, H.264/yuv420p,
  no audio, fast-start MP4. Extract posters from the compressed videos' actual
  first frames. Existing hover-only loading and reduced-motion behavior remain.

## Encoding and loop treatment

The generated paper lowers toward the end instead of returning to its initial
pose. Use a restrained forward/reverse loop from the early motion, not a hard
cut back to the beginning. Full 5-second Runway originals remain in `video/raw/`.

The filter below speeds the selected motion up 1.6×, keeps 39 forward frames,
and appends the reverse with its duplicated endpoints omitted (37 frames).
The result is exactly 76 frames at 24 fps (3.166667 seconds), with no crossfade
ghosting and the original first frame intact.

```sh
ffmpeg -i INPUT.mp4 -filter_complex \
  '[0:v]setpts=(PTS-STARTPTS)/1.6,fps=24,trim=end_frame=39,split[f][r];[r]reverse,trim=start_frame=1:end_frame=38,setpts=PTS-STARTPTS[b];[f][b]concat=n=2:v=1:a=0,format=yuv420p[v]' \
  -map '[v]' -an -c:v libx264 -preset slow -crf 24 -movflags +faststart OUTPUT.mp4
```

Curation uses CRF 28 to control the bitrate of the moving woven scrim. Posters
are extracted from the final MP4 as PNG and converted with existing project
dependency Sharp, WebP quality 85. No new dependency is needed.

## Verification

- All four outputs: H.264, yuv420p, 720×1280, 24 fps, 76 frames / 3.166667 s,
  one video stream and no audio; `moov` precedes `mdat` for fast start.
- All four MP4s pass complete ffmpeg decode without errors.
- WebP posters are actual encoded first frames; PSNR against the decoded PNG
  first frames ranges from 41.15 to 43.09 dB.
- Old assets: all 10 SHA-256 checksums below still match after replacement.
- BrowserOS desktop: all four hover targets play individually; leaving resets
  to time 0, previous target pauses, unopened videos have no `src`.
- BrowserOS 390×844 `/zh/`: five full-width rows, no horizontal overflow,
  all posters load, touch mode downloads/plays no videos.
- Reduced-motion desktop: hover leaves all videos paused with no `src`.
- Captured browser errors/unhandled rejections and HTTP resource errors: none.
- `npm run check`: 42 files, 0 errors/warnings/hints.
- `npm run build`: passes; existing >500 KB demo chunk warning remains.
- `node --test scripts/curation-controls.test.mjs`: passes.

| Section | MP4 bytes | WebP bytes |
| --- | ---: | ---: |
| Intro | 686139 | 68026 |
| Curation | 975435 | 73994 |
| Partnerships | 1140510 | 67794 |
| Originals | 602484 | 42138 |

## Previous asset checksums (SHA-256)

These paths remain unchanged and available for rollback:

```text
428e6ee02d265e06f5ef72c645ce9362dc025bbe9bf5a5c67d91041fa0256d48  public/assets/index/contact.mp4
1d7094b9a2c5ae9c2ab6760510116e76b218a834e1304b4539f8fb6fc495e635  public/assets/index/curation.mp4
cc4033828177a556a1dff57c7c94dc98dfdfc32bade12c29b8ed119ff97c5770  public/assets/index/intro.mp4
cdc7e3426ebb2f75b642b30ee370853f24823fb0864fd6d305e043a11d90a8cb  public/assets/index/originals.mp4
f407344da2f51de7a0644354b06a8920b7dd50dc25f4b5f6b52e07b30cad647a  public/assets/index/partnerships.mp4
1e8422fb9106826552a0ce6ca36aa4c68a458637184ccd324e0f6d608acb7f65  public/assets/index/contact.webp
2a55e4d964a9f0a29743a0008a33f48df311eeb0a847ad90771196c2df2db180  public/assets/index/curation.webp
0d0ce03190d24cdb0f13d179faa2c8b9522d4879ed18a36def2c9b7cc8fc1589  public/assets/index/intro.webp
f8df3fd2789cda2be5bb6b26b0a7daf1813c85062da73435ae9386f8bab7499b  public/assets/index/originals.webp
2759630409817e3593e805c5f403f98253a27ee1df9dd79cd0ec72c429b4175b  public/assets/index/partnerships.webp
```
