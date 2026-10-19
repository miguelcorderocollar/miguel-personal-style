# Motion decisions

The kit uses short transitions for occasional changes of state. The approved UI motion lives in the installable skill's `assets/motion.css` and `assets/motion.js`, with API documentation in [the motion guide](../skills/miguel-personal-style/references/ui-motion.md).

## What moves

| Interaction | Why | Timing |
| --- | --- | --- |
| Action press | Immediate pointer feedback | 120ms press, 100ms release, scale .98 |
| Native dialog | Show a change of context | 240ms enter, 180ms exit, scale .97 and opacity |
| Toast | Confirm an action from a consistent edge | 200ms enter, 160ms exit, translateY 100% and opacity |
| Loading label | Make loading and completion legible | 160ms, 4px and opacity |
| Empty state to first item | Connect the first-use state to its result | 180ms, 6px and opacity; preserve the slot |
| Notice dismiss and restore | Explain the feedback's arrival and removal | 120ms exit, 180ms enter |
| Disclosure | Show the relation between a question and its answer | 180ms height and opacity; interruptible |

The interface curve is `cubic-bezier(.23,1,.32,1)`. Reduced motion keeps short opacity feedback. Keyboard actions are immediate. Disclosures are the only layout-property animation; all other new effects animate transform and opacity. No continuous loop is added by the UI helper.

## What stays still

Tabs, pagination, filters, chart values and continuous design controls stay immediate. The existing decorative dot and pixel studies have their own Motion tab, including pause controls, offscreen suspension and reduced-motion stills. Nothing needs a theme wipe, bouncing menus, scattered confetti or scrolling entrance choreography.

## Emil's skills

Read through the GitHub CLI from [emilkowalski/skills](https://github.com/emilkowalski/skills) at commit `2d228630ba1446365f614a108cb8252f1feda202`. The complete skill catalog was considered; only guidance applicable to this vanilla web kit was used.

| Guidance | Use here |
| --- | --- |
| find-animation-opportunities | Frequency, purpose, speed and function gates |
| animate and its recipes | Native implementation, exact curve, short transitions |
| improve-animations and review-animations | Audit, interruption, asymmetric timing, removal of navigation animation |
| animation-performance | CSS/WAAPI, explicit properties, no added library or blanket GPU hints |
| animation-vocabulary | Consistent names for the effects |
| emil-design-eng and apple-design | Feedback on press, spatial consistency, current-value interruption, restraint |
| mobile-native | Touch-aware controls, capability-gated hover, safe-area placement, readable form controls |
| break-ui | Long messages, empty content, rapid reversal, narrow viewport and keyboard checks |
| prototype | Used during the earlier Current/Proposed review; no variant picker is needed in the shipped kit |
| pick-ui-library and ask-sonner | Considered; native browser controls suit this framework-free kit, so no React library was introduced |
| animate-expo and write-swift | Read and excluded because this project does not use React Native or Swift |

These external skills are design references. They are not copied into the distributable bundle and are not required at runtime. The implementation retains this kit's square geometry, mono typography, orange details and light/dark themes.

## Verification

Run `scripts/verify-motion.mjs` from the skill directory with Playwright and Chromium available. It checks real state changes, focus, Escape, keyboard behavior, toast interruption, disclosure reversal, narrow layouts and reduced-motion handling. The capture script records the actual rendered demo separately. A real phone recording is still needed to assess device-specific smoothness; desktop checks do not establish mobile frame rates.
