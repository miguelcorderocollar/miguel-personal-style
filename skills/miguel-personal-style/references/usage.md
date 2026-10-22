# Using the kit

All shell examples here run from the skill folder, the directory containing `SKILL.md`. Keep generated work in the destination project or a local ignored `work/` directory.

## Choose a starting point

| Request | Start with | Result |
| --- | --- | --- |
| Web page or small UI | `assets/examples/component-starter.html` | Local fonts, both themes and accessible component markup |
| Loader, notice or pagination | Components tab in `assets/examples/design-system.html` | CSS plus the relevant example's state handling |
| Cover or slide | `assets/examples/preview.html?variant=dark` | A black-default composition to adapt at delivery size |
| Occasional white variation | `assets/examples/preview.html?variant=light` | Same typography and grid on white, for deliberate contrast |
| Data graphic | `assets/examples/preview.html?variant=data` | A chart composition; replace the illustrative values |
| Decorative vector or background | Assets tab in `assets/examples/design-system.html` | Transparent SVG or PNG from the playground |
| Motion study | Motion tab in `assets/examples/design-system.html` | Pause, pace, palette and still-frame controls |
| Treated photograph | `scripts/preprocess_shader.py` | A baked PNG or WebP for a cleared source image |

## Browse locally

The examples work offline after their dependencies are available. Serve this skill folder over HTTP so local fonts, module imports and WebGL resources share an origin.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/assets/examples/design-system.html`. Use `#components`, `#assets` or `#motion` to open a particular tab. The smaller starting page is at `http://127.0.0.1:8000/assets/examples/component-starter.html`.

## Reuse components

Copy the `assets/` folder into the destination project. Preserve relative paths and licence files. The component stylesheet uses the `--mcc-*` tokens declared by `personal-style.css`.

```html
<link rel="stylesheet" href="assets/personal-style.css">
<link rel="stylesheet" href="assets/components.css">
<main class="mcc-style">
  <div role="status">
    <span class="mcc-loader" aria-hidden="true">
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </span>
    <span>Loading collection…</span>
  </div>
</main>
```

The square chase uses eight pixels. Add `mcc-loader--small` or `mcc-loader--large` to change its size. The `mcc-loader--steps` variant uses four pixels. The `mcc-style` container starts black. Use `mcc-light` on the same container for an occasional white variation; remove it to return to black. `mcc-dark` is an explicit dark alias. The styles include still alternatives for reduced motion.

`mcc-progress` styles a native labelled `<progress>` element. Set its value from real work completed. `mcc-badge`, `mcc-notice`, `mcc-empty` and `mcc-pagination` provide styling; the application owns their state, labels and interactions. The full showcase demonstrates dismiss and restore, add and reset, page selection and loading completion. For the optional native motion helper, API and exact recipes, read [ui-motion.md](ui-motion.md). Transfer the relevant behavior with the markup.

Do not announce individual pixels or every animation frame. Keep a single status message for the operation. A skeleton is decorative; expose loading through the containing region or nearby status text. Remove busy states when the operation completes or fails.

## Treat a photograph

Requires Python 3.9+ and Pillow. Install Pillow in the project's chosen Python environment if it is missing.

```bash
python3 scripts/preprocess_shader.py /path/to/cleared-photo.jpg work/photo-halftone.png \
  --settings assets/shader-recipe.json --max-size 640
```

Crop square portraits deliberately before processing. The script keeps the input aspect ratio. Use the same dot pitch for a series and inspect the result at delivery size. The CPU helper is related to the browser shader but does not promise identical pixels.

For browser treatment, inspect the helper's exported `drawHalftone(canvas, image, settings, pixelRatio)` API in `assets/halftone.js` and its use in `assets/examples/preview.html`. Pass a decoded, same-origin image and an explicitly sized canvas. Handle WebGL failure with a baked image or a clear fallback.

## Filter a halftone for display

For a pre-rendered halftone shown below its master size, use [`assets/image-rendering.js`](../assets/image-rendering.js) to make a display copy by default. It accepts decoded, origin-clean images and canvases. `displayImage(source, cssWidth, dpr)` returns a separate canvas with the source aspect ratio preserved and a backing width sized for the CSS width and device-pixel ratio, capped at the master's native resolution. It uses a Gaussian low-pass only for a real downscale, then exact area averages. At the master size it leaves the pixels alone; it never mutates the source. Crop first when the destination uses `object-fit: cover`.

```js
import { displayImage } from './assets/image-rendering.js';

await image.decode(); // Use a decoded, same-origin image or an origin-clean canvas.
const output = displayImage(image, imageElement.clientWidth, window.devicePixelRatio || 1);
canvas.width = output.width;
canvas.height = output.height;
canvas.getContext('2d').drawImage(output, 0, 0);
```

`areaResize(source, width, height)` is available when the destination pixels are already known. It uses exact area averages when downscaling; when either axis upscales, it uses the browser's high-quality smoothing. `drawHalftoneForDisplay(canvas, image, settings, options)` runs the existing WebGL shader at the target backing size. Its `options` take `cssWidth`, `cssHeight`, optional positive `dpr`, and optional integer `supersample` (default `1`). A value of `2` renders at twice the target pixel dimensions and area-resizes the result; it can improve edge aliasing at extra GPU and memory cost. The default recipe remains the shader's existing `DEFAULT_RECIPE`.

These operations create display copies; they do not improve an undersized source or replace a final-size review. A pre-halftoned face may lose detail when filtered, so compare facial detail and dot texture at the actual display size. For a photograph that has not yet been halftoned, render the shader at the destination size before considering blur. Do not filter text or other geometry that should remain crisp. The runnable [moire-filter example](../assets/examples/moire-filter.html) shows a cleared mountain reference before and after at the same responsive width.

## Capture and check examples

Requires Node.js 18+, Playwright and a Chromium browser. These tools are needed only for automated captures, not to browse the kit. Install Playwright in a temporary tools folder or use an existing installation. Both capture scripts accept `--playwright` with the package entry point and `--chrome` with a browser executable when auto-discovery is unavailable.

```bash
node scripts/capture-previews.mjs
node scripts/capture-showcase.mjs --output work/showcase-captures
node scripts/verify-motion.mjs
```

The first command regenerates the four 1920×1080 still examples and the overview board. It can also capture website references with `--site /path/to/website`. The second captures the showcase, components and motion at desktop size, checks narrow layouts and reduced-motion loader behavior, and reports browser or resource errors. The motion verifier checks native focus, Escape, interruption, controller teardown, reduced motion and narrow layouts. Both tools start and close their own local HTTP server.

For example, with a separate tools installation and a system Chromium:

```bash
node scripts/capture-showcase.mjs \
  --playwright /path/to/node_modules/playwright/index.mjs \
  --chrome /usr/bin/chromium --output work/showcase-captures
```

Inspect the PNGs as well as the command result. A screenshot records a single motion frame; it does not prove motion timing, keyboard usability or the correctness of production data.

## Example requests

- "Use $miguel-personal-style to build a collection page with an orange pixel loader, empty state and pagination. Use placeholder copy clearly marked as an example."
- "Use $miguel-personal-style for a 1920×1080 cover. Start with the black treatment, my supplied headline and this cleared photograph."
- "Use $miguel-personal-style to mock up the opening and closing frames for this transcript. Keep black as the default and use white only occasionally and wait for storyboard approval before animation."

Preserve the user's requested scope. Save finished artifacts in their project; do not add private project material to the reusable bundle.
