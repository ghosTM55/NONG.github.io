## NONG Studio Official Website

The site is built with Astro and deployed as static files to GitHub Pages.

## Local development

Install dependencies once:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Astro will print the local URL, normally `http://localhost:4321`.

To preview the responsive layout on a phone connected to the same Wi-Fi, expose
the development server to the local network:

```bash
npm run dev -- --host
```

Then open the network URL printed by Astro on the phone. Stop either server with
`Ctrl+C`.

Run the production checks and preview the generated static site:

```bash
npm run check
npm test
npm run build
npm exec -- playwright install chromium --only-shell
npm run test:browser
npm run preview
```

## Site structure

- `/` and `/zh/`: single-screen landing page.
- `/intro/`: concise English practice descriptions, illustrative films and collaboration scope. Content lives in `src/content/intro.ts`, with page styles and motion in `src/styles/intro.css` and `src/motion/intro.ts`.
- `/zh/intro/`: redirects to `/intro/` while localization is deferred. The language switcher is hidden; Chinese content will be handled after English content and design approval.
- `/curation/`: concise previews of the Tanbo Museum and UpVerse projects in development. Page-specific layout and copy live in `src/components/CurationPage.astro` and `src/styles/curation-page.css`; image provenance is recorded in `design/curation-preview.md`.
- `/zh/curation/`: redirects to `/curation/` while localization is deferred.
- `/partnerships/`: capability-led page presenting our strategic partners through attributed projects and a static character concept. The character feature leads directly into an aspirational vision of what future partners could create together, with a link to `/contact/#partnerships` that opens a dedicated enquiry guide. The three business practices are explained in Intro. Asset sources and claim boundaries live in `design/partnerships-preview.md`. `/zh/partnerships/` redirects to the English page.
- `/contact/`: direct email contact and four expandable enquiry guides, with prefilled emails for Development, Digitalization, Activation and Strategic partnerships. Content lives in `src/content/contact.ts`; native disclosures work without JavaScript, and fragment links reveal the matching guide with JavaScript enabled. `/zh/contact/` redirects here while localization is deferred.
- `/demo/` and `/zh/demo/`: unlisted demo directory, accessed by entering the URL directly. No public navigation entry is rendered on desktop or mobile. This is not access control; anyone with the URL can visit. Navigation within the demo area remains available.
- `/demo/objects/` and `/demo/space/` (also available under `/zh/`): existing object and spatial demonstrations.
- `/curation/demo/` and `/curation/space/`: compatibility redirects to the new demo routes.

`SiteLayout.astro` owns the shared masthead, Index panel and navigation behavior.
The centered wordmark links back to the landing page. `site.ts` initializes landing-only motion, while `navigation.ts`
initializes the shared controls without loading the demo's 3D code elsewhere.

`SiteBackground.astro` provides the shared fixed background. The landing routes
(`/` and `/zh/`) retain their animated sequin light field; Demo routes keep a static
sequin frame. Intro, Contact and Curation use `motion/flowBackground.ts`: two low-luminance
green advection fields, inspired by the particle/momentum-feedback principle in
[Tendrils](https://epok.tech/work/tendrils/). Intro stretches into open streams;
Curation descends in long, gently swaying curtain-like folds. This is a lightweight original
Canvas implementation, not the reference's full audiovisual simulation. Contact shares Intro's open streams.

The fields continuously renew individual trails without a whole-screen reset
(not a frame-identical video loop). Finite trails prevent accumulated brightness.
Rendering is capped at 30 fps and 1.25 DPR, with fewer particles on mobile, and
pauses when hidden or the Index is open. Reduced motion shows a static field.
There is no pointer highlight. On Intro and Curation the field continues behind
the transparent masthead; scrolling content is clipped below it to protect the
wordmark without a different-colored header cover.

`motion/background.ts` initializes backgrounds independently of GSAP and restores
them after a back/forward-cache navigation. Content imagery, Index videos and the
immersive 3D scene remain in front of the background.

Landing motion also restores its current practice selection after back/forward-cache
navigation. The landing background, indicator and practice timer pause while Index
is open, then resume when it closes. Their visible animation speed is unchanged.

Browser regression tests are in `tests/browser/`. Run them after `npm run build`;
Playwright starts a dedicated local preview on port 4323 and stops it afterward.
CI runs the existing direction tests and browser regressions before deployment.

On phones, the landing title and description share a single flowing layout below
the masthead. Menu and email icons flank the centered wordmark in one row, with
44px touch targets. Explore has a larger label and a minimum 74px touch height; short
screens can scroll instead of overlapping or clipping content. Navigation marks
respond to touch presses. On phone layouts and touch devices, Index uses horizontal
rows with a square video on the left and a large chapter title on the right,
automatically playing and looping every preview while Index is open. Titles are
white by default; only the current page's chapter is gold. Phone-width mouse
previews use the same playback and press feedback. Tapping a link navigates
immediately. Videos load when needed, stop when Index closes or the tab is hidden,
and retain static posters when reduced motion is enabled or playback is blocked.
Desktop retains hover and keyboard-focus previews.

### Fonts and responsive images

The site preloads the local Tektur WOFF2 font (60,396 bytes). It preserves all 1,129
glyphs and both original variable axes. The original TTF and OFL license remain in
`public/fonts/Tektur/`. To regenerate the WOFF2 in a temporary Python environment:

```bash
python3 -m venv /tmp/nong-font-tools
/tmp/nong-font-tools/bin/python -m pip install 'fonttools[woff]==4.65.0'
/tmp/nong-font-tools/bin/fonttools ttLib.woff2 compress 'public/fonts/Tektur/Tektur-VariableFont_wdth,wght.ttf'
```

Curation provides 600/900/1200-pixel WebP candidates. The original 1200-pixel files
are unchanged; the smaller candidates use Sharp 0.35.4, a width-only resize and
WebP quality 85. `srcset` and `sizes` let browsers select for layout width and DPR.

Historical, unreferenced public assets are preserved in
[`design/asset-archive/2026-09-15/`](design/asset-archive/2026-09-15/README.md),
with original paths and checksums. They are excluded from Astro delivery by living
outside `public/`. Keep `public/sitemap.xml` aligned with published content pages.

### Intro films

The Intro page uses three five-second concept films, separate from the current Index selection:

| Intro asset | Source | FFmpeg crop |
| --- | --- | --- |
| `round-01/development.mp4` | Index round-02 raw `originals.mp4` | `crop=720:576:0:246` |
| `round-03/digitalization.mp4` | Bronze vessel film from Runway Gen-4.5 in `design/intro-films/round-03/digitalization-raw.mp4` | `crop=900:720:200:0,scale=720:576` |
| `round-02/activation.mp4` | Index round-02 raw `curation.mp4` | `crop=720:576:0:352` |

Active assets are under `public/assets/intro/`. Earlier Index sources remain in `design/index-first-frames/round-02/video/raw/`. Activation's crop moves down 56 source pixels from round-01's y=296 to show more of the lower exhibition floor. Superseded Intro exports are preserved in `design/asset-archive/2026-09-15/public/assets/intro/`. Digitalization's Runway session, prompt and delivery notes are in `design/intro-films/round-03/VIDEO.md`; it shows an ornamented bronze vessel and its digital model without physical scanning beams.

Encode at original speed with `setsar=1`, no audio, H.264 (`libx264`, preset `fast`, CRF 22) and `+faststart`. WebP posters use the encoded first frame at quality 85 via Sharp. Preserve the 5:4 frame at every breakpoint; playback loops only while visible and respects reduced motion.

## License

Original text, images, brand materials, and visual assets are licensed under
[Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nc-nd/4.0/)
(CC BY-NC-ND 4.0).

Code is made available for non-commercial use under the
[PolyForm Noncommercial License 1.0.0](./LICENSE).

Third-party fonts, icons, libraries, templates, and other dependencies remain
under their respective original licenses.
