# Motion architecture

The cinematic system is initialized by `boot()` in `index.js` after the portrait and fonts have had a bounded opportunity to load.

## Runtime layers

- GSAP + ScrollTrigger own eight pinned chapter timelines: intro, portrait, place/Montevideo, REGCRIM, DAW, Secretaría, Rumbo, and NEXUS.
- The place chapter uses MapLibre as a presentation-only map. Pointer interaction remains disabled and the timeline owns its camera and clean exit.
- Rumbo is a standard portfolio project chapter with an editorial image composition and a native HTML case-study dialog. It has no Three.js, WebGL device, phone overlay, or independent demo runtime.
- CSS provides layout and stacking contexts. Timelines animate inner stages rather than pinned containers.

## Motion modes

- Full motion uses short numeric scrub values and responsive chapter distances.
- Reduced motion preserves the content and navigation while exposing the project compositions without transform-dependent reveals.
- Static fallback is reserved for a missing GSAP/ScrollTrigger runtime; it is not selected merely because reduced motion is reported.

## Regression guards

1. Twelve total ScrollTriggers and eight `chapter-*` triggers exist.
2. Every trigger has finite `start`/`end` values and `end > start`.
3. Forward, reverse, fast-scroll, `#portrait`, and `#projects` paths reconstruct coherent states.
4. Wheel input over `#map` scrolls the document; the map never captures pointer input.
5. DAW remains under projects and absent from trajectory/archive classifications.
6. Rumbo remains project 04, between Secretaría and NEXUS, with verified and planned functionality clearly separated.
7. Both full and reduced motion preserve readable project content and have no horizontal overflow.

Use `?motion-debug=1` locally to show ScrollTrigger markers and print measured ranges. Never add that query to production links.
