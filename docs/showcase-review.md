# Showcase review

A critical pass over the live showcase (`skills/miguel-personal-style/assets/examples/design-system.html`, built to `public/`). This review was written on 8 November 2026, before any changes. It is based on full-page captures of every tab at 1440px, at 390px and in the white view. Each finding below is followed by the planned change. Anything left for Miguel to decide is listed at the end.

## Overall verdict

The page is well made at the level of detail: consistent type, square geometry, real working controls and honest labels. As a whole it reads like a stack of good parts more than an edited publication. Its weaknesses are structural:

1. **It never says how to use the kit.** A visitor can admire the components, but the page has no install command, no `<link>` snippet and no indication of which classes ship in `components.css` and which exist only on this page. For a design system, this is the biggest gap.
2. **The rules are implied, never stated.** Black by default, orange with a job, square corners and no glow, glass, neon or glitch are the identity, and they appear only in the skill files. The Basics tab shows tokens but not the judgement behind them.
3. **The grids don't close.** Asset tiles have two heights, so rows misalign, and 29 tiles leave a hole. Seven motion studies leave an empty half-row. Two Components cells span the full width for no reason, and the mobile palette leaves two empty slots.
4. **Some sections open twice.** Motion has two stacked section headings with an "Exploration" tag between them. Assets has a heading, a tag row, a filter row, a summary row and a link before the first tile.
5. **The signature object is static and disconnected.** The hero sphere is a flat 2D shading with a separate orange plus beside it. The README banner, the promo film and the Motion study all treat the sphere as a 3D globe with an orange accent. The orange should be a wedge that belongs to the surface.

## Global, header, hero and footer

| Finding | Change |
| --- | --- |
| Landing on `#basics` (or any tab hash) focuses the panel. The focus-visible rule then draws a large orange box around the first heading, which is the first thing a visitor sees. | Release the browser's fragment focus on initial load. Keyboard focus styling stays unchanged. |
| The hero sphere shades a flat disc with a 2D light and a separate orange plus. It is the only sphere in the kit that isn't a globe. | Render the hero as a projected, tilted dot globe with a fixed orange wedge (task 1). Drop the separate plus so that one orange item carries the hero. |
| The hero has no action. The only way into the kit is a tiny footer link. | Add a copyable install command beneath the hero copy (`npx skills add …`), with the page's existing copy feedback. |
| On phones the hero art is hidden, so the identity's main graphic never appears. | Show a smaller sphere on phones beside the kicker, sized so the headline still fits. |
| The tab-bar note "ONE FAMILY / MANY APPLICATIONS" is filler in a sticky bar. | Replace it with a "Get the skill ↗" link, the action people want from anywhere on the page. |
| The footer is two small lines and a reference to "mikelon_kit" without context. | Make the footer a short three-column colophon: what this is, where to get it, and licences and sources. |

## Basics

| Finding | Change |
| --- | --- |
| The palette has no reading guide. The footnote asks visitors to click swatches but doesn't explain the roles. | Keep the swatches, then add a principles section (below) that explains the roles. |
| At 390px the five swatches sit 3 + 2 and leave holes. | On phones, use two columns and give the orange accent a full-width row. |
| The kit's rules are never stated on the page. | Add **"Principles. What to keep, what to leave out."**: a Do / Leave out board drawn from the style guide. It covers black dominance, orange as one marked item, square corners and thin rules, one family, labelled sample data, and no glow, glass, neon or glitch. |
| The Structure section is three small, weak vignettes. The spacing bars are decorative and the copy describes the website rather than the kit. | Keep the rules board but tighten the copy. Fold it into the same rhythm as the principles section. |
| Nothing shows how to start. | End Basics with **"Start with two stylesheets."**: the install command and the `<link>` / `mcc-style` snippet, each with a copy action. |

## Components

| Finding | Change |
| --- | --- |
| In the black view the editorial card is black on black. It reads as loose text with a line, not a card. | Give it the dark rule border and paper-level contrast in both views. |
| Pagination and Disclosure span the full width, so the grid ends with two thin, wide rows. | Return both to normal cells so the 12 examples close as six balanced rows. |
| The chart has no numbers, although tabular figures are a core rule. | Add a small tabular axis (illustrative values, still labelled). |
| A stray "Explore the visual assets" link sits inside the Selection card. | Remove it. Tabs already do this. |
| No indication of what is reusable. `.mcc-loader`, `.mcc-progress`, `.mcc-badge`, `.mcc-notice`, `.mcc-empty`, `.mcc-skeleton` and `.mcc-pagination` ship in `components.css`. Buttons, fields, switches, filters and rows are page-level patterns. | Tag each card's corner with the class that ships, or "Page pattern" where nothing ships. This is honest and makes the kit usable. |

## Assets & backgrounds

| Finding | Change |
| --- | --- |
| Halftone tiles are 220px tall and other tiles 170px. In "Everything", rows mix both heights and the info rows misalign. | Use one preview height for every tile. |
| 29 tiles in 3 columns leave a hole, and the nth-child border rules break when a filter changes the count. | Draw the grid with a 1px gap on a rule-coloured background instead of per-tile borders, and let the last tile span the remaining columns. |
| The top of the tab carries a heading, an "Exploration" tag row, filters, a summary and a separate link. That is too many bands before the first image. | Fold the tag sentence into the heading paragraph. Keep filters and the playground link on one row and the count on the next. |
| The sphere tile has no orange, while "Ink + orange detail" paints a screen-fixed corner on it. | The sphere gets the surface-fixed orange wedge, and its tile defaults to ink + orange. |
| The background studio opens on a dot field at 16%, which is nearly invisible. It undersells the strongest tool on the tab. | Open on the halftone corner, so the first view shows what the studio does. |
| "In context" uses arbitrary card heights. The slide study is half empty. | Give covers and slides real aspect ratios (16:9 slides) and put the wedge sphere on the slide study. |

## Motion

| Finding | Change |
| --- | --- |
| Two stacked section heads ("Motion you can put to work" and "A few useful moves") with a tag row between them. | One tab heading, then two numbered parts: **01 Interface recipes** and **02 Dot studies**. |
| The study toolbar floats between the recipes and the studies without a heading. | Place it directly under the "Dot studies" heading, with the status line inside its band. |
| Seven studies leave an empty half-row. | Give the interactive magnetic grid the full width. It benefits from the room. |
| The rotating circle's orange is a band fixed to the screen. The globe rotates under it, which looks like a light rather than a part of the object. | Task 1: an orange wedge of longitude from pole to pole, fixed to the surface, turning with the globe, visible only on the front hemisphere. |

## Light view

The white view holds up. The same structural fixes apply, and the new sections use tokens, so they follow the theme. Check the editorial card and wedge contrast in white after the changes.

## Task 1: the orange wedge

Every place where orange crosses a sphere switches from a screen-fixed band or corner to a wedge of longitude fixed to the sphere's surface:

- **Motion › Rotating circle** (Canvas): colour dots whose source longitude falls within a narrow wedge. The rotation is applied after the test, so the wedge turns with the globe. Only front-facing dots are drawn. The wedge is centred on a sampled meridian, so every ring contributes at least one dot and the segment converges at the poles like an orange slice.
- **Hero sphere, Assets › Halftone sphere, the halftone playground and the "Changing form" recipe** (vector halftone on a fixed grid): un-project each grid dot onto the tilted globe, rotate it back into the globe's frame, and test its longitude. The result is a curved lune that meets at both poles. Dot shading is unchanged.
- **README identity banner** (`banners/graphics.js`): the same un-projection replaces the bottom-right orange corner. The JPEG is re-exported.
- The light, motion and components banners have no orange on a sphere (a ring, a wave and pixels), so they are unchanged. The turning cube keeps its band, because it isn't a sphere.

The reference promo, `film.js` `sphereAt`, still contains the screen-fixed `bandX` test on disk. The wedge here follows the description in the brief, not that file.

## Out of scope / for Miguel

- Moving the button, field, switch and filter styles from this page into `components.css`. They are good enough to ship, but that changes the installable kit's API.
- A slowly turning hero globe. A still is used, because the motion guide keeps continuous loops in the Motion tab.
- The Dither current study's large flat fill in the black view. It comes from the bundled Paper Shaders preset, and its parameters are a taste call.
