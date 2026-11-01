# Cinematic rebuild QA

Validated locally on 2026-11-01. Production was not changed.

## Deterministic chapter review

- Captured intro, portrait, place/Rumbo, REGCRIM, Secretaría, and Nexus at 0%, 25%, 50%, 75%, and 100% scroll progress.
- Confirmed ScrollTrigger and animation progress converge to the same value at every checkpoint.
- Confirmed all six chapters use `pin`, `scrub`, named timeline labels, and responsive end distances.
- Confirmed reverse scrolling restores the exact prior state (`1.00 -> 0.25`).
- Confirmed mid-page reloads do not inherit an exit-frame opacity or hide a protagonist.

## Responsive review

Portrait hero reviewed at 1920x1080, 1440x900, 768x1024, 390x844, and 360x800. The image remains inside its intended stage at the hero/rest phase and the document has no horizontal overflow.

## Interaction and resilience review

- Mobile menu opens, reports `aria-expanded`, navigates to a chapter, and closes.
- Direct chapter hashes resolve after ScrollTrigger geometry is measured.
- Spanish/English content switching remains functional.
- Project context dialog opens with the selected project and closes correctly.
- Browsers that report reduced motion still initialize the cinematic chapters; this avoids silently disabling the portfolio in embedded and privacy-focused browsers that force that preference.
- Missing portrait image preserves layout dimensions and alternative text.
- Failed map tiles activate the designed map fallback while the chapter timelines remain active.

## Static checks

- `node --check index.js`
- `git diff --check`
- VS Code problem scan for HTML, CSS, JavaScript, and documentation
