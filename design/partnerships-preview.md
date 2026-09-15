# Partnerships preview

Local English page at `/partnerships/`. Strategic partner capabilities support
NONG Studio's existing Development, Digitalization and Activation practices. Company
biographies are omitted; project roles and character artwork illustrate the capabilities.

## Assets and provenance

Assets live in `public/assets/partnerships/`. All originals remain untouched.

| Asset | Source | Processing |
| --- | --- | --- |
| `immersive-v2/alif-{960,1920}.webp` | User-provided `~/Desktop/Immersive_International_精选项目集_2025.pdf`, page 16, embedded `Image66.jpg` | Embedded photograph extracted, resized to 960 / 1920 px wide, WebP quality 87 |
| `immersive-v2/osaka-pix-{640,1280}.webp` | Same PDF, page 11, embedded `Image45.jpg` | Embedded photograph extracted, resized to 640 / 1280 px wide, WebP quality 87 |
| `immersive-v2/smithsonian-gallery-{640,1280}.webp` | Same PDF, page 29, embedded `Image117.jpg` | Embedded photograph extracted, resized to 640 / 1280 px wide, WebP quality 87 |
| `realnpc-character-{400,800}.webp` | `~/Library/CloudStorage/OneDrive-Personal/RealNPC/demo/RealNPC Intro 202503.pdf`, page 1, image object 21 with its original soft mask | Original 1992 × 4070 character artwork extracted with authored transparency, resized to 400 / 800 px wide, WebP quality 90 |
| `unwritten-world-{640,1254}.webp` | Generated with the built-in imagegen tool on 2026-09-15 | Square artwork, resized to 640 / 1254 px, WebP quality 89; exact prompt and generated source in `partnerships-vision-image.md` |

RealNPC now uses a static character image from its project presentation, clearly
captioned as a character concept. It makes no claim of a deployed client project.
The previous `realnpc-qin-demo.mp4` and `realnpc-qin-poster.webp` assets remain on
disk but are no longer referenced by the page. No video player or demo link is
present in the RealNPC section.

The revised Immersive section leads with Alif at a 2:1 desktop ratio, followed by
two 3:2 images showing PIX and the Smithsonian gallery. Each image has one
capability heading, a concise scope statement and an attributed project link.
Mobile uses a single column and a 3:2 ratio for all three images. Responsive
sources reduce the image payload on smaller screens. The first preview's
`osaka-uk-pavilion.webp` and `smithsonian.webp` remain on disk but are no longer
referenced by the page.

## Attribution and claim boundaries

- Public copy uses “Our strategic partners”; company names appear once each in
  source credits. Immersive project links point to the official project pages.
  The projects are not presented as NONG Studio's portfolio.
- Alif: film, animation and interactive content within the pavilion's present
  and future mobility experiences. No attribution of the pavilion architecture.
- UK Pavilion responsibilities: experience strategy, exhibition design, original
  characters, animation and interactive software.
- Smithsonian West Wing: media content and interactive experiences across nine
  installations. No attribution of the entire museum redesign.
- RealNPC copy focuses on character development and interaction. Roadmap features
  such as a complete runtime, persistent cross-device memory, an IP marketplace
  and a task network are not represented as shipped capabilities.
- Three-practice rows describe the proposed collaboration model. “Imagine the
  possibilities” invites prospective partners into a larger creative vision,
  without a division of work or a specific project implementation. The scroll
  artwork is captioned “An unwritten world, waiting to be explored.” It is an
  artistic metaphor, not an existing project by the studio or its partners.
- Preview only. Publication and final public use of partner imagery remain for
  the user's review.

Official references checked 2026-09-14:

- https://www.immersive.international/projects/mobility-pavilion-2020
- https://www.immersive.international/projects/the-uk-pavilion-osaka-2025
- https://www.immersive.international/projects/west-end-galleries-smithsonian-national-air-space-museum

## Integration

Index links to `/partnerships/`; Curation's next chapter is Partnerships. The
Partnerships footer proceeds to Contact while Originals remains unavailable.
`/zh/partnerships/` redirects to the English page, matching the other chapters.
The page reuses the Curation flow background and shared title/navigation, with
page-scoped CSS and no new dependencies or page-specific JavaScript.

The partner invitation links to `/contact/#partnerships`. Contact reveals the
matching native details element, with prompts about expertise, relevant work and
collaboration. Its email action prepares an editable draft to the existing studio
address; no form submission, new backend or automatic email sending is involved.

The earlier `museum-encounter-{640,1254}.webp` assets and their generation record
remain on disk for history, but the page no longer references them.
