---
name: miguel-personal-style
description: Apply Miguel Cordero Collar's personal visual identity to web interfaces, UI components, graphics, covers, slides and videos. Use when the user requests Miguel's personal style or work for his personal brand. Includes JetBrains Mono, orange accents, halftone imagery and pixel motion. Excludes unrelated client brands and private friend-to-friend films.
---

# Miguel personal style

Create artifacts using the identity from miguelcorderocollar.com. This folder is the complete skill bundle; resolve the paths below from this folder, wherever it is installed. No website checkout, proprietary font or other skill is required to use its assets.

## Start here

1. Identify the audience, format, exact copy and any image or data sources. Read [references/style-guide.md](references/style-guide.md) for the visual rules.
2. For implementation details, runnable examples and dependency requirements, read [references/usage.md](references/usage.md). Choose only the resources needed for the requested artifact.
3. Inspect the matching example before composing. Use `assets/examples/design-system.html` for interactive UI, assets and motion studies; `assets/examples/component-starter.html` for a small reusable page; `assets/examples/preview.html` for still compositions.
4. Reuse the bundled type, palette and helpers. Keep text and charts crisp. Apply the photographic shader only to images.
5. Verify the actual delivery size, theme, loading behavior and motion settings. Check clipping, contrast, long copy, font loading and halftone aliasing before delivery.

## Identity

- Use the supplied JetBrains Mono Medium 500, SemiBold 600 and ExtraBold 800. Build hierarchy through weight, scale and spacing.
- Start with black paper, pale ink and the lighter orange accent. White paper with black ink is an occasional contrast or editorial variation; use it sparingly. Preserve the same type and grid across themes.
- Use warm orange to mark selection, a chart point, an annotation or an active loading state. For small labels on white, use black text beside an orange marker.
- Keep square corners, thin rules, aligned rows and tabular numbers. Let the information determine the composition.
- Use the fixed-grid monochrome photographic treatment from `assets/shader-recipe.json`. Procedural dot shapes in the showcase are graphic studies, not photographic shader outputs.
- Use direct copy. Label demonstration numbers and sample headlines. Never invent a quotation or attribution.

## Resources

| Need | Resource |
| --- | --- |
| Tokens, fonts and themes | `assets/tokens.json`, `assets/personal-style.css`, `assets/fonts/` |
| Pixel loaders, progress, skeletons, badges, notices, empty states and pagination | `assets/components.css`, `assets/examples/component-starter.html` and the showcase's Components tab |
| Native UI transitions and interaction rules | `assets/motion.css`, `assets/motion.js`, [references/ui-motion.md](references/ui-motion.md) |
| WebGL image treatment | `assets/halftone.js`, `assets/shader-recipe.json` |
| Offline image treatment | `scripts/preprocess_shader.py`, requires Python and Pillow |
| Still layouts and reference board | `assets/examples/preview.html`, `assets/examples/overview.html` |
| Shapes, textures, backgrounds and motion | `assets/examples/design-system.html`, locally bundled Paper Shaders in `assets/vendor/` |
| Preview capture | `scripts/capture-previews.mjs`, `scripts/capture-showcase.mjs`, requires Node.js, Playwright and Chromium |
| Attribution and reference-only material | [references/source-record.md](references/source-record.md), `references/source-snapshot.json`, `assets/references/` |

Copy `assets/` as a unit to retain relative font and runtime paths. Preserve `assets/fonts/OFL.txt` and the Paper Shaders LICENSE, NOTICE and provenance when using those assets. `agents/openai.yaml` supplies optional Codex UI metadata; the skill instructions and assets work independently of it.

## UI and motion

Load `personal-style.css` before `components.css`; add `mcc-style` to a container for the black default. Add `mcc-light` only for a deliberate white variation. `mcc-dark` remains an explicit dark alias. Keep loader pixels decorative with `aria-hidden="true"` and expose the actual loading state through adjacent status text. Show determinate progress only when the application knows it. Reuse the examples' keyboard focus, labels and state handling when adapting controls.

Read [references/ui-motion.md](references/ui-motion.md) when implementing interactive UI. Use the optional native helper for action presses, dialogs, toasts, loading-label changes, first-item states, notices and disclosure. The helper also supports one-time editorial reveals, discrete graphic replacements, local copy confirmation, determinate progress, anchored native popovers, side panels, reversible removal and deliberate hold confirmation. Choose these only when they clarify the content or result; use the replayable Motion tab recipes to inspect them. Use hold confirmation only for actions that benefit from preventing an accidental click, with a keyboard-accessible confirmation alternative. Keep keyboard actions, tabs, filters, data and continuous controls immediate. Respect reduced-motion preferences. Prefer brief reveals followed by a readable hold. A still is sufficient for a decorative study when motion is unnecessary. The Motion tab's Dot Orbit and Dithering use the locally bundled Paper Shaders runtime with Canvas fallbacks. Adapt the relevant example rather than copying the full showcase into a production app.

For video, use a deterministic timeline, clear outgoing copy before its replacement, and preserve live footage as live footage. A poster is only a mockup. Review actual motion and sound; stills cannot verify either. Pitch the complete story, transcript-aligned storyboard and still mockups before animating a new direction unless that scope is already approved. A style choice alone does not approve a storyline.

## Boundaries

Keep employer identities and other brands' fonts, logos and tokens out unless requested. Do not add glow, glass panels, neon gradients or noisy glitch effects to make the identity feel technical.

Use supplied or cleared production imagery and real sources for quotations and data. Website People screenshots are reference-only and contain third-party portraits. Do not bundle private messages, friends' photographs or confidential material into this skill. Friend-to-friend notebook films use a separate visual direction.
