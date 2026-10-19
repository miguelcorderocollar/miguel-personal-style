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
| Editorial reveal | Introduce occasional editorial compositions once | 240ms, 8px, 45ms stagger capped at 180ms |
| Graphic replacement | Bridge a discrete form change | 180ms, 4px and opacity |
| Copy confirmation | Confirm success at the action | 160ms label change; restore after 1600ms |
| Determinate progress | Connect actual work completed to its fill | 200ms linear transform; native value updates immediately |
| Anchored popover | Make the relation to its trigger clear | 200ms scale .95 and opacity, viewport-aware placement |
| Side panel | Bring occasional supporting context from the page edge | 280ms enter / 200ms exit, drawer curve |
| Removal with undo | Explain disappearance while keeping the action reversible | 160ms exit / 180ms restore |
| Hold confirmation | Prevent an accidental destructive click | 2s linear fill; cancel over 200ms, keyboard confirmation alternative |
| Disclosure | Show the relation between a question and its answer | 180ms height and opacity; interruptible |

The interface curve is `cubic-bezier(.23,1,.32,1)`. Reduced motion keeps short opacity feedback. Keyboard actions are immediate. Disclosures are the only layout-property animation; all other new effects animate transform and opacity. No continuous loop is added by the UI helper.

## What stays still

Tabs, pagination, filters, chart values and continuous design controls stay immediate. The existing decorative dot and pixel studies have their own Motion tab, including pause controls, offscreen suspension and reduced-motion stills. Editorial headings and composition studies can reveal once when seen. This does not apply to functional rows or repeated view navigation. Theme wipes, bouncing menus and scattered confetti are excluded.

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

## Additional opportunity pass

| Location | Prior behavior | Purpose | Frequency | Decision |
| --- | --- | --- | --- | --- |
| Editorial opener and application compositions | Everything appeared together | Explanation and rare-first-visit delight | Occasional visit, once per element | Reveal in 240ms with 45ms stagger and the existing curve |
| Halftone form and dot selection | Different artwork replaced the previous form abruptly | Preventing a jarring change | Occasional pointer selection | Incoming artwork enters over 180ms; sliders and keyboard actions stay immediate |
| Palette/background copy action | Confirmation appeared only at the distant toast | Feedback | Occasional copy | Confirm at the button over 160ms, only after success |
| Preparation progress | Native fill stepped between measured values | State indication | Occasional task | Interpolate the decorative fill over 200ms; preserve native semantics and real values |

Rejected additional candidates include animated chart values and filter-row rearrangement because users read that information, theme wipes because they add no needed feedback, and repeated hover choreography because it would be seen too often. The replayable examples make the approved additions visible without adding repeated motion throughout the page.

## Context and safety pass

| Opportunity | Gate result | Implementation |
| --- | --- | --- |
| Card options popover | Occasional; spatial consistency; within the 200ms budget; keeps options near their target | Native `popover="auto"`, CSS scale/opacity, trigger-based origin and viewport clamping |
| Supporting side panel | Occasional; spatial consistency; 280ms in / 200ms out; supplies context without replacing the page | Native dialog positioned at the right edge, shared drawer curve and focus return |
| Removal and undo | Occasional edit; state indication; 160/180ms; bridges a reversible change | Generation-guarded presence helper, inert during exit and immediate undo |
| Deliberate hold | Infrequent destructive action; feedback and accident prevention; two-second linear decision interval is intentional | Primary-pointer capture, cancellation on early release/leave/blur, separate keyboard confirmation |

Rejected additions include gesture physics without a real draggable object, ambient bounce on functional controls and artificial delay for routine saves. These would add movement without improving this kit's common interactions. Popovers, dialogs and confirmations retain native browser semantics. The new examples remain black by default with an occasional white variation available.
