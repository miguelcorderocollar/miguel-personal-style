# Style guide

## Approved theme roles

Black is the default, using pale ink and the lighter orange accent. Use white only occasionally for contrast or an editorial pause; return to black for the main presentation. Keep the same font family, alignment and halftone language across both. A theme change should have a clear editorial purpose and must not introduce flashing. There is no fixed percentage, but black should clearly dominate. This policy was updated by Miguel on 19 October 2026 and supersedes the earlier light-default direction.

## Type and colour, from the website

JetBrains Mono is the single family. Medium 500 is the base, SemiBold 600 supplies emphasis, and ExtraBold 800 carries headings. Set tabular lining numbers for dates, axes and counters. Preserve natural letter spacing for body copy; tighten large headings modestly, around -0.035em. Use italics only when the content needs them, rather than synthesizing a missing weight.

| Role | Light | Dark |
| --- | --- | --- |
| Paper | #ffffff | #000000 |
| Main ink | #000000 | #d3d3d3 |
| Secondary ink | #666666 | #aaaaaa |
| Secondary surface | #eeeeee | #111111 |
| Accent | #e8512a | #ff8561 |
| Internal rules | black at 18% | pale ink at 22% |
| Shader ink | #090909 | choose a declared reverse-print adaptation |

Use orange to identify one important item. Its role is selection and annotation, not a blanket background. For small text on white, use black and an orange marker; the light-theme orange is better suited to large text and graphics than small body labels. In dark scenes, the lighter accent is the source-backed choice.

## Proposed sizes for video and covers

At 1920x1080, start with 80px safe margins, 100 to 160px main headings, 32 to 44px body text, 24 to 28px labels and 36 to 44px captions. Keep structural rules around 2 to 3px. These are adaptations, not copied web pixels. At 1080x1920, recompose the page deliberately and use at least 60px side margins; do not simply crop a landscape frame.

Use a shared left edge for title, image and rows. Permit a large image or diagram to dominate while keeping one main reading target. Use an index like 01 or 02 when there are real chapters or collection entries. Do not invent decorative counts. Keep outer rules dark and internal separators quiet. Square frames and restrained image crops are the default; an illustrated circle is an image device, not a new rounded-card system.

## Halftone treatment

The canonical recipe is bundled in assets/shader-recipe.json. It uses cell 3, contrast 1.75, brightness 0.02, gamma 0.85, nine tonal levels, roughness 0.36, grain 0.06, softness 0.8, ink #090909 and white paper. Normalize square portraits to 640x640 before processing, as the People pipeline does. Record the crop and source with the image. Preserve the same dot pitch across a series.

The browser helper keeps the site's GLSL. The offline helper retains the site's CPU preprocessor. Bake the treatment for motion, then move the whole image gently; recomputing a shifting dot grid every frame can shimmer. Check compression at the final resolution because very small dots can alias. Increase cell size for a lower-resolution export only as a deliberate adaptation, with a new still for review.

When an already-halftoned raster must display smaller than its master, use `../assets/image-rendering.js` to create a separate Gaussian-prefiltered, area-resized display copy. Keep the master unchanged and compare at the intended size: filtering reduces moiré but also softens dot edges, and no resampling can restore detail lost in a small source. For a photograph that is meant to receive the halftone treatment, prefer running `drawHalftoneForDisplay` from the source image at the target backing size; avoid blurring facial detail in the master. Keep text, logos and flat graphics crisp instead of applying photographic filtering. Optional shader supersampling is available for stubborn edge aliasing, but the canonical recipe and its default output stay unchanged.

The dark sample's reverse-print procedural sphere is a proposed texture study, not a new photographic asset or a website screenshot. Its neutral shape demonstrates the shader; other subject matter should come from the actual story.

## Proposed motion grammar

A rule can draw on and become a chart axis. A selected collection row can expand into its detail scene. An image crop frame can become a live speaker window. The chapter index can stay at the same grid point across shots. Carry one of these objects through a transition so the motion has a reason.

Use short drawing or reveal movements, typically 0.35 to 0.8s, followed by a readable hold. Give a closing at least 2 to 3s. Clear an outgoing heading before introducing the next one. Prefer word or line reveals to slow typing; a zero-progress reveal must draw no partial glyphs. For numerical data, animate the actual data or a clearly illustrative sequence, not arbitrary reassuring scores.

A small image push may keep a hold alive. Avoid handheld jitter, scrolling noise textures, particle confetti, lens flares and constant page wipes. Use an accessible still alternative when motion is unnecessary.

## Reference compositions

- Light editorial opener: white paper, large personal collection title, an orange index and the published mountain halftone.
- Dark editorial card: black paper, pale type, a light orange marker and reverse-print shader study. The headline is sample copy, not an attributed quote.
- Trends/data card: clean axes, exact mono number alignment, one orange series and selective focus. Demo data is labelled illustrative; real work needs its dataset and source.
- Reference board: fonts, palette and texture are shown together for direction review.

Choose the composition from the information. Do not force every film to have the same opener or a three-card layout.

## Live motion studies

The showcase's Motion tab is a place to try slow dot fields, rotating dotted cubes and circles, dotted terrain and pointer-responsive grids. The orange accent can travel across the rotating objects and selected fields. The fixed photo shader and the procedural motion studies keep separate implementations. Dot Orbit and Dithering use the locally bundled Paper Shaders runtime; the remaining studies use Canvas 2D.

Keep pause, pace and palette controls available when reusing these demonstrations. Start with stills for reduced-motion preferences, stop rendering hidden/offscreen studies, and retain a readable still if WebGL2 is unavailable. Save-frame downloads capture a PNG; they do not export an editable SVG or a finished video. When redistributing the Paper runtime, retain its Apache 2.0 LICENSE and NOTICE with the pinned version's provenance.
