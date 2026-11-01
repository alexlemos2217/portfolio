# Cinematic rebuild QA

Validated locally on 2026-11-01. Production was not changed.

Emergency recovery validation: captured 35 checkpoints (0/25/50/75/100 for all seven cinematic chapters) in full motion, then repeated transform/progress assertions in reduced motion. Both modes registered 11 valid ScrollTriggers; reduced motion retained the 3D Rumbo device with immediate scrub and 28% shorter pin ranges.

## V4 surgical correction

The final pacing pass was measured at 1440x900 before and after the change. Values are pinned distances in viewport heights; the scrub column shows the new full-motion smoothing value.

| Chapter | Before | After | Scrub |
| --- | ---: | ---: | ---: |
| Intro | 1.35 | 1.15 | 0.18 |
| Portrait | 1.45 | 1.20 | 0.20 |
| Montevideo / Rumbo | 2.35 | 1.90 | 0.16 |
| REGCRIM | 1.40 | 1.15 | 0.18 |
| DAW | 1.50 | 1.25 | 0.20 |
| Secretaría | 1.40 | 1.15 | 0.18 |
| NEXUS | 1.40 | 1.15 | 0.18 |
| **Total** | **10.85** | **8.95** | — |

The cinematic pin distance fell 17.5%. The complete document fell from 19,874px to 18,164px (8.6%) because its non-pinned content was intentionally left unchanged. Reduced motion still initializes all 11 triggers and the WebGL device; its measured chapter distances are 0.83, 0.86, 1.37, 0.83, 0.90, 0.83, and 0.83 viewport heights.

- Replaced the translated Rumbo heading's HTML-like dataset value with two semantic translated spans. ES and EN both render two block lines; neither visible document text contains `<br>`.
- Exercised the 3D device at 0%, 20%, 40%, 60%, 80%, and 100%. Every checkpoint changes geometry/camera state and the screen stages progress 0, 0, 1, 2, 3, 3; the last 20% continues approaching instead of clamping early.
- At 20% on 1440x900, the device projects inside the viewport (`749..1303 x 128..870`). Later crops are progressive and intentional for immersion.
- Reversed the place scene through 100% -> 60% -> 20%; device progress/state reconstructed as 1.00/screen 3 -> 0.33/screen 1 -> 0.00/screen 0.
- A real 420px wheel gesture over the map advanced the document 364px while `#map` remained `pointer-events: none`.
- A fast jump into REGCRIM left the place stage and WebGL canvas 1,107px above the viewport with canvas opacity 0.
- `#projects` resolves at the 70px header offset and `#portrait` at the measured chapter start.
- Mobile 390x844 registers 11 triggers, uses 0.95–1.70 viewport chapter ranges, and has no horizontal overflow.

## Deterministic chapter review

- Captured intro, portrait, place/Rumbo, REGCRIM, Secretaría, and Nexus at 0%, 25%, 50%, 75%, and 100% scroll progress.
- Reviewed DAW at 0%, 30%, 62%, 87%, and 100%, then reversed through the same scene; verified its English copy, private technical dialog, mobile layout, and absence from archive/trajectory classifications.
- Rechecked the Montevideo/Rumbo triggers and WebGL initialization after inserting the new project chapter.
- Rebuilt Rumbo hardware from separate metal chassis, bezel, screen and glass layers; replaced gradient placeholders with three original conceptual travel photographs and a richer four-state app UI.
- Disabled all MapLibre pointer interaction so wheel input always remains page scroll while the timeline controls the automatic Montevideo camera.
- Reduced the seven pinned chapters from 16.9 to 10.85 viewport heights on desktop (35.8% less pinned distance). At 1440x900 the document fell from 25,319px to 19,874px (21.5% shorter).
- Reduced the default cinematic scrub from 0.8s to 0.26s and the Montevideo/Rumbo scrub from 0.48s to 0.22s.
- Confirmed ScrollTrigger and animation progress converge to the same value at every checkpoint.
- Confirmed all seven chapters use `pin`, low-latency `scrub`, named timeline labels, and shorter responsive end distances.
- Confirmed reverse scrolling restores the exact prior state (`1.00 -> 0.25`).
- Confirmed mid-page reloads do not inherit an exit-frame opacity or hide a protagonist.

## Responsive review

Portrait hero reviewed at 1920x1080, 1440x900, 768x1024, 390x844, and 360x800. The image remains inside its intended stage at the hero/rest phase and the document has no horizontal overflow.

## Interaction and resilience review

- Mobile menu opens, reports `aria-expanded`, navigates to a chapter, and closes.
- Direct chapter hashes resolve after ScrollTrigger geometry is measured.
- Spanish/English content switching remains functional.
- Project context dialog opens with the selected project and closes correctly.
- `prefers-reduced-motion: reduce` keeps the seven scroll-driven chapters and the Rumbo WebGL device, but shortens pin distances by 28% and uses immediate scrub. It no longer collapses the portfolio into a static layout.
- Missing portrait image preserves layout dimensions and alternative text.
- Failed map tiles activate the designed map fallback while the chapter timelines remain active.
- The Rumbo WebGL canvas initializes at the device pixel ratio cap, renders on scroll updates, and does not run a permanent animation loop.
- Rumbo was exercised at 0%, 12%, 28%, 45%, 62%, 78%, 92%, and 100%, then reversed through 62%, 28%, and 0% before a direct fast jump to 100%.
- The interactive Rumbo demo exposes home, map, places, and detail views in a modal product surface; closing it restores the page.
- The final CTA explicitly accepts pointer input above MapLibre on desktop and mobile.
- A 420px wheel gesture over the map advanced the document by 364px; MapLibre remained non-interactive.
- Fast-scroll testing left the entire place/Rumbo stage 1,000px above the viewport before REGCRIM began, with no residual fixed canvas.
- Deep links landed at the measured chapter starts (`#portrait`) or the intended header offset (`#projects`).
- Desktop, tablet and mobile checks reported no horizontal overflow; mobile uses 1.15–2.05 viewport heights per pinned chapter.

## Static checks

- `node --check index.js`
- `git diff --check`
- VS Code problem scan for HTML, CSS, JavaScript, and documentation
