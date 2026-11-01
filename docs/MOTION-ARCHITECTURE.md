# Motion architecture

The cinematic system is initialized by `boot()` in `index.js` after the portrait and fonts have had a bounded opportunity to load.

## Runtime layers

- GSAP + ScrollTrigger own seven pinned chapter timelines: intro, portrait, place/Rumbo, REGCRIM, DAW, Secretaría, and NEXUS.
- `RumboDeviceScene` owns the Three.js device and renders only when its scroll progress changes; it has no permanent animation loop.
- MapLibre is presentation-only. Pointer interaction remains disabled and the place timeline owns its camera.
- CSS provides layout, stacking contexts, and the photographic Rumbo landscape. Timelines animate inner stages rather than pinned containers.

## Motion modes

- Full motion uses short numeric scrub values and the standard responsive chapter distances.
- Reduced motion still preserves the scroll narrative. It uses immediate scrub and 72% of the normal pin distance so it is shorter and does not lag behind input.
- Static fallback is reserved for missing GSAP/ScrollTrigger or a failed WebGL renderer; it is not selected merely because reduced motion is reported.

## Regression guards

When changing motion code, verify:

1. Eleven total ScrollTriggers and seven `chapter-*` triggers exist.
2. Every trigger has finite `start`/`end` values and `end > start`.
3. Progress checkpoints change transforms, opacity, masks, or Three.js object state—not only trigger counters.
4. Forward, reverse, fast-scroll, `#portrait`, and `#projects` paths reconstruct coherent states.
5. Wheel input over `#map` scrolls the document.
6. DAW remains under projects and absent from trajectory/archive.
7. Both full and reduced motion modes initialize timelines; reduced mode must not add `motion-static`.

Use `?motion-debug=1` locally to show ScrollTrigger markers, print measured ranges, and expose the Rumbo scene for transform inspection. Never add that query to production links.

## Recovery comparison

- Version A (`e61a9d6`): cinematic engine active, but longer pin distances and less clean Rumbo handoff.
- Version B (`ea3046f`): improved pacing and landscape hierarchy, but reduced-motion exited before initializing every timeline and the WebGL device.
- Version C: retains B's shorter pacing and clean layer transition while restoring the cinematic engine in both motion modes.
