# UI motion

Use motion for feedback and occasional state changes. Functional navigation, chart values, filters and continuous preview controls stay immediate. The helper is optional; the base components work without it.

## Include the helper

Copy the assets folder as a unit. Load the styles in this order:

```html
<link rel="stylesheet" href="assets/personal-style.css">
<link rel="stylesheet" href="assets/components.css">
<link rel="stylesheet" href="assets/motion.css">
<script type="module">
  import {createMotion} from './assets/motion.js';
  const motion = createMotion();
  const dialog = motion.bindDialog(document.querySelector('dialog'));
  document.querySelector('#open').addEventListener('click', () => dialog.open());
  document.querySelector('#close').addEventListener('click', () => dialog.close());
</script>
```

Use a native `<dialog aria-labelledby="heading-id">` with a real heading and labelled controls. Its built-in focus containment and Escape behavior remain intact. The helper returns focus to the opener. Keyboard actions open and close immediately; pointer actions receive the transition.

`createMotion({root})` defaults to `document.documentElement`. It adds the `mcc-motion` class, tracks pointer/keyboard modality and listens for system reduced-motion changes. Pass an ancestor of all animated elements when scoping it to part of a page. Create one controller per document or scope and call `destroy()` when that scope is removed. Do not create multiple controllers for the same root.

## Recipes

The shared curve is `--mcc-ease-out: cubic-bezier(.23,1,.32,1)`. These are interface timings, separate from longer video/editorial motion.

| Moment | Normal motion | Reduced motion |
| --- | --- | --- |
| Action press | Add `data-mcc-press`; scale .98 over 120ms, release over 100ms | Immediate, no transform |
| Dialog | Centered scale .97 to 1 and opacity, 240ms enter / 180ms exit; matching backdrop | 80ms opacity only |
| Toast | Opacity and translateY 100% to 0, 200ms enter / 160ms exit; CSS transitions retarget smoothly | 80ms opacity only |
| Loading label | `enter(label, {duration:160})`, opacity and 4px displacement | 80ms opacity only |
| First item | `enter(item, {duration:180, offset:6})` | 80ms opacity only |
| Notice | `exit(notice, {duration:120})`, then hide it; restore with `enter()` over 180ms | 80ms opacity only |
| Editorial entrance | `revealOnce(elements)`, 240ms, 8px, 45ms stagger; runs once when seen | 80ms opacity, no stagger |
| Graphic form change | `replace(art, render)`, 180ms opacity and 4px displacement | 80ms opacity only |
| Copy confirmation | `feedback(label, "Copied")`, 160ms; returns after 1600ms | 80ms opacity only |
| Determinate progress | `bindProgress(progress)`, actual value sets a transform-based fill over 200ms linear | Immediate value update |
| Disclosure | `bindDisclosure(details)`, 180ms content height and opacity | 80ms opacity only, immediate final layout |

All keyboard-triggered recipes are immediate. Press feedback is for action buttons, not tab navigation or densely repeated filters. Preserve the static state when motion adds no useful information.

## Helper API

- `enter(element, {duration, offset, scale, origin})` animates an already-visible element. Set its content and unhide it first. It resolves with a boolean indicating whether it finished. The operation itself should start immediately.
- `exit(element, {duration, offset, origin})` holds the final hidden-looking frame. After it resolves, hide or remove the element and call `cancel(element)` to release the animation. Guard asynchronous hide operations against a newer restore action. The demo's notice handlers show this pattern.
- `replace(element, update, options)` runs the update immediately and animates the incoming content. Use it for discrete graphic-form changes, not continuously dragged settings. It accepts the same options as `enter()`.
- `feedback(label, text, {restoreAfter:1600})` changes a dedicated label span, then restores its original text. Call it only after a real successful operation. It does not run the copy or export itself. Repeated calls reset the timer; `destroy()` clears it and restores the label. A changing action label should keep a stable accessible name when needed, or be paired with a status announcement.
- `revealOnce(elements, {duration:240, offset:8, stagger:45})` observes a collection of editorial elements and reveals each once. Stagger is capped at 180ms. Content stays accessible and keyboard interaction cancels pending motion. Use this on occasional editorial headings or composition studies, never on core navigation, data rows or controls used repeatedly. The first unprompted entrance is allowed to animate before any input; keyboard-triggered views stay immediate. The returned function disconnects the observer.
- `bindProgress(progress)` keeps the native `<progress>` element as the semantic source and adds a decorative transform-based fill. Update the native `value` and `max` as usual. Determinate changes interpolate for 200ms with linear easing; indeterminate progress falls back to the native element. The helper returns `{sync}` and removes generated markup on `destroy()`. Do not use this to invent progress the application cannot measure.
- `cancel(element)` releases that element's current animation. A new transition uses the current rendered transform and opacity when the previous one is interrupted.
- `bindDialog(dialog)` returns `{open, close}`. `close({immediate:true})` skips motion. The native dialog manages focus and Escape; use a close button inside it.
- `bindToast(host, {duration:3200})` returns `{show, dismiss}`. The host supplies its visual styles and should use `role="status"` with polite, atomic announcements. The timer pauses while hovered or while the document is hidden. Keep a single host for routine confirmations. The helper does not turn it into a stacked notification manager.
- `bindDisclosure(details)` attaches to a native details/summary pair. It wraps the detail content for measurement, supports reversal and leaves keyboard interaction immediate. Prefer a single content block after the summary. The native `open` state remains authoritative after each transition.
- `reserveSlot(slot, first, second)` reserves the largest visible state measured in that slot. It returns a function for remeasurement. Use it only where preserving space makes sense, such as empty-to-first-item changes.
- `destroy()` cancels motion, settles pending state, releases observers/listeners and removes the motion root class.

The root's motion tokens are set once. No animated parent CSS variables, scroll listeners or continuous animation loops are introduced. `height` is animated only for disclosure, where it expresses the actual expansion; all other new effects animate transform and opacity.

## Example: a short editorial entrance

```js
const motion = createMotion();
motion.revealOnce(document.querySelectorAll('.cover-title, .cover-note'), {
  duration: 240,
  offset: 8,
  stagger: 45
});

const progress = document.querySelector('progress');
motion.bindProgress(progress);
progress.value = 3; // Real work completed; the native element stays authoritative.

// When a discrete form selection changes:
motion.replace(document.querySelector('.graphic'), () => renderSelectedForm());

// Only after the clipboard operation succeeds:
motion.feedback(document.querySelector('[data-mcc-feedback-label]'), 'Copied');
```

The Motion tab contains replayable examples for all four additions. The actual showcase uses the same methods for its opening, composition cards, halftone form selector, palette/background copy actions and progress examples.

## Check the whole interaction

Test rapid repeated actions and reversals, not only the first click. Verify focus after dismissal, Escape, disabled loading controls, long text, zero items, narrow viewports and reduced-motion changes while motion is playing. Keep meaningful completion messages accessible even when all movement is removed.

The showcase's Motion tab is separate from these UI transitions. Its pause button controls the decorative studies, and the studies stop offscreen or in hidden tabs. A desktop browser test cannot establish smoothness on a real mid-range phone.

## Design sources

The implementation uses native browser APIs and original code, guided by [Emil Kowalski's skills](https://github.com/emilkowalski/skills), particularly find-animation-opportunities, animate, review-animations, animation-performance, emil-design-eng, apple-design and mobile-native. No external skill or motion package is required to use this helper. The personal identity's typography, palette and image rules remain in the style guide.
