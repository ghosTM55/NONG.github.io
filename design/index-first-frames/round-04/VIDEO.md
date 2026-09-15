# INDEX Round 04 — directional physical motion

Status: complete. Intro iteration 2 selected for continuous sequential page
turns; Partnerships and Originals use their initial round-04 outputs.
All three are connected to the shared INDEX and verified.

Runway via BrowserOS, Thomas / Personal / Unlimited (Explore), Gen-4.5,
9:16, 5 seconds, MP4, HDR off. No credit-mode generation.

Session: https://app.runwayml.com/video-tools/teams/nongstudio/ai-tools/generate?mode=tools&sessionId=efa1e19e-f930-4e71-b5dd-3f7d23ed315e

Intro and Originals retain their round-03 input PNGs. Partnerships uses the new
`03-partnerships.png`: two separate green and ivory hanging curtains, not a knot.
Curation and Contact remain unchanged. All previous files remain available.

## Intro

Locked-off cinematic close-up of the open handmade paper folio in the input image. A steady breeze blows across the book and turns its blank pages ONE AT A TIME: the raised page curls upward, rolls across the binding and settles on the opposite stack; then the next thin sheet lifts and turns, followed by another sheet. Three distinct sequential wind-blown page turns, not the whole stack moving together. Each page bends with real paper stiffness, its free edge flutters before settling under gravity. The binding and book remain resting on the green linen. Continuous forward action, visible page movement throughout the shot. Preserve the warm sunlight, paper fibers and quiet green shadows. One fixed camera, real physical paper, no loose flying sheets, no hands, people, lettering, new objects, cuts or camera movement.

## Intro iteration 2 — stronger sequential wind action

A sustained gust of wind riffles through the open book. Several individual thin paper pages peel up from the stack ONE AFTER ANOTHER, flutter upright in the breeze, then turn over the binding. The next sheet starts rising as the previous sheet lands: a continuous cascade of sequential page turns throughout the shot, like a book left open beside a windy window. The initially raised page is caught and carried upward by the gust immediately. Each sheet remains attached to the book and bends independently with natural paper stiffness. The heavy book stays on the green linen. Locked camera, tactile photographic realism, warm sunlight and green shadows unchanged. Only wind moves the pages; an empty scene without people or hands. No loose sheets flying away. One continuous shot.

## Partnerships prompt

One continuous locked-off photographic shot of the two separate curtains in the input image. A breeze builds between the forest-green curtain on the left and the ivory curtain on the right. Their free lower halves billow inward, meet at the center, cross, and slowly wind around each other into one loose intertwined embrace. Show the complete transition from two separated panels to two fabrics loosely wrapped together once. Both upper ends remain hanging from above the frame; the broad fabric folds ripple and the free hems lift, curl and settle with believable cloth weight and wind inertia. The distinct green and ivory materials remain recognizable. Warm natural backlight, quiet art-house realism. No people, hands, human silhouettes, ropes, extra curtains, tight knots, morphing, magical flying cloth, camera movement or cuts.

## Originals

A locked-off macro shot of the real amber celluloid strip in the input image. Gentle steady tension from beyond the left edge pulls the free end of the film sideways across the dark surface. As the film advances along its length, its upright curved loop progressively unrolls and opens into a longer flatter strip. The sprocket holes and frame divisions visibly travel with the strip, staying evenly spaced and unchanged. Natural elastic flex, slight friction against the surface, a small realistic settling recoil as the pull eases. The base slides in contact with the surface; the film does not float. One continuous forward unspooling and pulling action, not simply swaying in place. Preserve the translucent amber material, warm highlights and deep green background. No hands, people, new reels or machinery, new objects, image frames, letters, rigid spinning, melting geometry, camera movement or cuts.

## Delivery

Keep the complete forward action; do not create a reversed ping-pong loop.
The three replacement clips play once on hover and hold the final frame, then
reset to the actual encoded first-frame poster on pointer leave.
Use versioned round-04 H.264 / yuv420p / fast-start MP4s, no audio, 24 fps,
and WebP posters extracted from their first frames. Preserve hover-only loading,
touch and reduced-motion behavior.

## Observed motion

- Intro iteration 1 had insufficient continuity: the initial raised page
  settled before a later page turned. It remains preserved but is not selected.
- Selected Intro iteration 2: the initial page rises and additional sheets
  lift and turn successively, overlapping naturally as the wind continues.
  Delivered as `intro-v2.mp4` / `intro-v2.webp`; the first iteration's `intro.*`
  and both raw sources remain untouched for comparison.
- Partnerships: separate panels billow apart, sweep inward, cross and wrap
  together; both fabric colors remain distinct throughout.
- Originals: the film moves across the surface, the upright curve opens and
  settles into a flatter strip. Preserve this full action instead of reversing it.

## Encoding

All sources remain in `video/raw/`; sampled review strips are in `video/review/`.
The complete 5.041667 s source is sped up 1.6×, producing 76 frames / 3.166667 s.

```sh
ffmpeg -i INPUT.mp4 -vf 'setpts=(PTS-STARTPTS)/1.6,fps=24,format=yuv420p' \
  -an -c:v libx264 -preset slow -crf 24 -movflags +faststart OUTPUT.mp4
```

Partnerships uses CRF 27 after a separate visual compression comparison.
Posters are extracted from the encoded MP4 first frame and converted through
the existing Sharp dependency to WebP quality 85. No new dependencies.

| Section | MP4 bytes | WebP bytes | Poster PSNR vs decoded first frame |
| --- | ---: | ---: | ---: |
| Intro (iteration 2) | 1121541 | 67984 | 42.23 dB |
| Partnerships | 936783 | 108188 | 40.44 dB |
| Originals | 502682 | 42696 | 43.09 dB |

## Verification

- All three files fully decode without errors; H.264, yuv420p, 720×1280,
  24 fps, 76 frames, one video stream, no audio, `moov` before `mdat`.
- Built HTML checked across all 12 shared-navigation pages: the three new URLs,
  `loop` absent for the new clips and retained for Curation/Contact, `preload=none`,
  no eager video `src` attribute.
- BrowserOS desktop: hover plays, the final frame remains visible at 3.166667 s,
  and pointer leave pauses/resets to zero. Other clips remain unloaded/paused.
- BrowserOS mobile 390×844 `/zh/`: five rows fit, posters load, no horizontal
  overflow and no video sources requested. Final replacement set rechecked.
- BrowserOS reduced motion: hover does not load or play any video.
- Captured browser errors/unhandled rejections and HTTP resource errors: none.
- `npm run check`: 42 files, zero errors/warnings/hints.
- `npm run build`: passes; existing >500 KB demo chunk warning remains.
- `node --test scripts/curation-controls.test.mjs`: passes.
- All ten preserved asset hashes below still match; no previous asset replaced.

## Preserved asset baseline (SHA-256)

```text
baefed1d8abfb2d6d4bf88626c6df4e717db7f15272b84a04950ccc38d0acefb  public/assets/index/round-03/curation.mp4
1805fb8f73ddb71392dddf0da19465e25d08f8e7dae8bd6d86f53217dd12bc3d  public/assets/index/round-03/curation.webp
ca5a88b7131b93a4d98caad6cf694a319a40f14975ef8362bb52d60a5a354349  public/assets/index/round-03/intro.mp4
b32f644b45e8dade84921ee5acb0b0918cf1eb9327332a7a0dc3221823726115  public/assets/index/round-03/intro.webp
0367eeb3b2253687e23e578785a20e79038eaa489d4f5184502abd9ea2c4e26b  public/assets/index/round-03/originals.mp4
93906c5889a08d8032ae7f7008e751d0e6dc97f2352bd787ec54da4261750e9d  public/assets/index/round-03/originals.webp
9e46564c96a9221d118d26df3baf4fc9c299879d9e535ecb7116ea798354d05e  public/assets/index/round-03/partnerships.mp4
4111f09d4bf8f60d6eebdbf914a79704d1ef994b7244a4c52e69fbd985c908e9  public/assets/index/round-03/partnerships.webp
428e6ee02d265e06f5ef72c645ce9362dc025bbe9bf5a5c67d91041fa0256d48  public/assets/index/contact.mp4
1e8422fb9106826552a0ce6ca36aa4c68a458637184ccd324e0f6d608acb7f65  public/assets/index/contact.webp
```
