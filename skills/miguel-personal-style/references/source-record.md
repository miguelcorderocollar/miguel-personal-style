# Sources and asset roles

Snapshot taken 4 October 2026 from Miguel's local website checkout. Repository HEAD 4bc17b8daf624396ce30b57db04701e4d8690339. Source file hashes describe the actual observed working files in source-snapshot.json, so any local changes are distinguishable from HEAD.

| Source | What it establishes | Use |
| --- | --- | --- |
| [Homepage](https://miguelcorderocollar.com/) and index.css | JetBrains Mono, weights 500/600/800, light/dark neutrals, ruled page structure and collection labels | Personal identity base |
| [People](https://miguelcorderocollar.com/people/) | Orange selection, monochrome portraits, rows and metadata hierarchy | Reference screenshots only; individual portraits require their own source/permission |
| [Trends](https://miguelcorderocollar.com/trends/) | Orange focus, data hierarchy and selective chart emphasis | Reference screenshot and layout inspiration |
| [Quotes](https://miguelcorderocollar.com/quotes/) | Quiet reading layout, warm accent and dark-mode treatment | Reference screenshots and layout inspiration; quotations need real attribution |
| Local shader/shader.js and docs/image-shader.md | Preferred recipe and GLSL image treatment | Bundled recipe and standalone adapter of the user's referenced code |
| Local scripts/preprocess_shader.py | Offline stable-image counterpart | Bundled unchanged helper; Python and Pillow are optional dependencies |
| Published images/bg/mountains-halftone.png | Existing site header treatment | Bundled reference image, credited to the user's site; retain any underlying photography credit or usage restriction with the asset |
| [JetBrains Mono 2.304](https://github.com/JetBrains/JetBrainsMono/tree/v2.304) | Exact unmodified font binaries | Bundled under SIL OFL 1.1; licence retained in assets/fonts/OFL.txt |

The font binaries are Medium, SemiBold and ExtraBold, matching the website's actual weight choices. They are the upstream font, not a patched icon-font substitute. No system font settings are changed.

The preview sphere and graphic layouts are original procedural design studies. Preview titles are sample editorial copy. The trends curve uses invented demonstration values and is labelled illustrative. Those values do not establish a trend, recommendation or measured result.

The interactive `assets/examples/design-system.html` adds original component compositions, orange dot/pixel/coordinate motif experiments and downloadable SVG backgrounds. Its sphere is an original vector-dot study, not an output of the canonical photographic shader. The extension mark is the unchanged SVG from the mikelon extension’s `public/icons/icon.svg`, observed on 15 October 2026. Its JetBrains Mono-derived glyph retains the font's bundled OFL licence. All other sample headlines and chart values in that showcase are illustrative.

The expanded exploration library adds original mathematical halftone forms, fine-line marks, textures and background fields. The halftone playground varies the sampled geometry, dot shape, grid pitch, contrast and source-palette ink. SVG exports preserve vector marks; PNG exports rasterize that same SVG at 1600×1100 with optional paper. These procedural graphic studies are independent of the canonical photographic shader and do not introduce new approved identity tokens. New cover and chapter compositions contain sample copy.

The Motion tab uses the vanilla JavaScript [Paper Shaders](https://github.com/paper-design/shaders) package `@paper-design/shaders@0.0.81` for Dot Orbit and Dithering. A small bundle with just the required runtime and helpers lives in `assets/vendor/paper-shaders/`, together with the original Apache 2.0 LICENSE, NOTICE and tarball provenance. Noise data is embedded locally. Five other animations and the Canvas fallbacks are original studies in this showcase. The rotating circle samples a spherical dot surface; the cube projects its rotating, visible dot faces. A travelling orange band can move across these objects, the wave field and the terrain. Animation frame exports are raster PNGs. The library effects use WebGL2; Canvas fallbacks keep the studies visible when it is unavailable.

Website screenshots are captured from the local site with the bundled font replacing its remote font request. Content remains unchanged. Their purpose is visual reference, not transferable rights to third-party photos or quotations. The banners and restrained UI motion were approved by Miguel on 18 October 2026; that approval applies to this kit, not to unrelated stories or future productions. No private conversation, friend photo, interview footage or corporate branding is bundled.

## Theme direction approval

On 4 October 2026, Miguel approved light as the default and dark for highlights or variation. On 18 October 2026, he approved the README banners, the restrained UI-motion implementation and publication of this kit as a standalone public repository. Unrelated content and storylines remain outside that scope.

## UI motion implementation

The optional motion helper uses native dialog, CSS transitions and the Web Animations API. Its original implementation follows the interaction and performance guidance in [Emil Kowalski’s skills](https://github.com/emilkowalski/skills), read at commit `2d228630ba1446365f614a108cb8252f1feda202` on 18 October 2026. The bundled helper needs no external skill or motion library. The README banners are original HTML/SVG compositions exported to JPEG with local fonts.

On 19 October 2026, the UI helper gained one-time editorial reveals, discrete graphic replacement, local copy confirmation and a transform-based determinate progress fill. The Motion tab includes replayable examples of these methods. The copy feedback follows actual clipboard success, and progress continues to use the native element as its semantic source.
