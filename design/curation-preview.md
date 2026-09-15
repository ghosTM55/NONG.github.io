# Curation preview

## Public scope

Two projects in development: Tanbo Museum and UpVerse. Each receives a short description and a structured list of NONG's responsibilities. Per the user's 2026-09-13 direction, NONG takes full responsibility for Tanbo's cultural assets, digitalization and ongoing operations, and is the organizer of UpVerse. Do not imply that either project has launched or announce dates, venues, scale, external partners, collections, budgets or a confirmed program. English only during the current site review phase.

Content was checked against the company KBS Tanbo museum planning notes and the UPVERSE planning master v3.0, updated 2026-09-11, together with the related Codex tasks.

## Visual direction

Two vertically arranged project features: a project heading, a wide image, and a parallel column for the description and responsibilities. Mobile stacks each image and its copy at the same left edge. No numbered project labels or image captions. The page closes with a short forthcoming notice.

Intro and Curation use `src/components/PageTitle.astro` for identical title typography, colors and section-number styling. Their page headings retain section numbers; body content and Intro practice navigation have no numbered labels.

The existing NONG Tektur typography and green/gold palette take precedence over new font or color choices. Images are static; Curation adds no page-specific motion or JavaScript.

## Image provenance

Both images reuse existing NONG company-deck concept studies from `对外材料/Pencil/assets/nong-company-deck/`. They illustrate intent; neither depicts a completed project or a confirmed venue. Their conceptual nature remains recorded in alt text and this source note. Visible captions were removed at the user's request.

| Website asset | Existing concept source |
| --- | --- |
| `public/assets/curation/tanbo-concept.webp` | `tanbo-longterm-partnership-v1.png` |
| `public/assets/curation/upverse-concept.webp` | `upverse-crossindustry-event-v1.png` |

Delivery copies are 1200 × 675 WebP at quality 84, encoded using the already installed Sharp package. Image framing is handled by CSS. The museum reference photographs marked for internal use in the deck's source register are not used on this page.
