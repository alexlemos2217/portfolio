# Cinematic QA

Validated locally on 2026-11-01 before production deployment.

## Final Rumbo restructure

- Permanently removed the 3D smartphone, its Three.js dependency, WebGL scene, phone-specific overlays, interaction handlers, demo modal, triggers, and fallback code.
- Preserved Montevideo as a shorter map-only chapter: world context, automatic city approach, centered city state, and a clean exit. MapLibre remains `pointer-events: none`, so wheel input always scrolls the page.
- Added Rumbo as project 04, after Secretaría and before NEXUS, with a responsive editorial gallery and a dedicated case-study dialog.
- Kept product claims honest: the page identifies the visible MapLibre/OpenStreetMap prototype and separates confirmed concepts from planned functionality. It does not claim unpublished APIs, services, or frameworks.
- Retained the independent DAW, REGCRIM, Secretaría, and NEXUS presentations and the corrected DAW project classification in Spanish and English.

## Measured desktop runtime

At 1440×900 the document registers 12 valid ScrollTriggers and eight cinematic chapters. Chapter distances are 1.15, 1.20, 1.35, 1.15, 1.25, 1.15, 1.15, and 1.15 viewport heights. The document has no horizontal overflow, contains one Rumbo project, and loads no Three.js or phone presentation.

## Required interaction review

- Verify Rumbo card and case-study dialog in Spanish and English.
- Verify desktop, tablet, and 390×844 mobile layouts have no horizontal overflow.
- Verify reduced-motion mode exposes Rumbo content without transform-dependent hiding.
- Verify a wheel gesture over the map advances document scroll.
- Verify forward, reverse, and fast scrolling leave no residual map or project layers.
- Verify `#projects` and `#portrait` deep links resolve after ScrollTrigger measurement.
- Verify every project detail dialog still opens and closes correctly.
- Verify all three conceptual Rumbo images load successfully and are labeled as conceptual imagery.

## Static checks

- `node --check index.js`
- `git diff --check`
- Search for removed Three.js, phone, WebGL, and demo identifiers
- VS Code problem scan for HTML, CSS, JavaScript, and documentation
