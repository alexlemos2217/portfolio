# Cinematic Storyboard

| Chapter | Protagonist | Initial composition | Scroll development | Final composition / handoff | Technique | Mobile | Reduced motion |
|---|---|---|---|---|---|---|---|
| Introduction | Alexander Lemos wordmark | Masked editorial title with negative space | Reveal → lateral separation → controlled scale | Title contracts left while the background adopts the portrait chapter tone | Pinned GSAP timeline, scrub, labels | Shorter travel and smaller lateral offset | Static title and metadata |
| Portrait | Real portrait | Text first; photograph concealed by a horizontal mask | Mask opens → portrait rests fully visible → statement enters | Portrait recedes to the right as the background becomes the geographic scene | Pinned DOM timeline with image decode before refresh | 1:1 portrait remains fully inside viewport; no lateral facial crop | Full 1:1 image and readable statement |
| World to Montevideo | Earth canvas and real map | Recognizable globe and contextual headline | 120 deterministic canvas frames → South America coordinates → map camera parameters scrub toward Montevideo | Map becomes a product surface | Pinned frame-sequence timeline plus MapLibre camera scrub | Shorter pin distance; same narrative states | Static map with attribution and text |
| Rumbo | Real-time 3D phone and product world | Full-screen Montevideo map | Map becomes a dark product stage → metal/glass device approaches and rotates → four conceptual UI states advance on the screen → camera crosses the display → Uruguayan coast world opens full-screen | Editorial landscape and interactive product-demo CTA hand off to selected systems | Three.js scene driven directly by the geographic GSAP/ScrollTrigger timeline; no autonomous render loop | Shallower camera travel, centered device, compact editorial overlays | Designed static landscape and product copy when WebGL is unavailable |
| REGCRIM | Conceptual private-system interface | Distant interface in perspective | Approach → synthetic panels build → feature close-up | Interface moves laterally out of frame | Pinned GSAP timeline with scrub and labels | Reduced perspective and shorter distance | Complete conceptual interface, no hidden content |
| DAW | Conceptual private institutional information system | Dark field and distant horizontal digital surface | Name resolves → surface rises from depth → search and information panels assemble → camera inspects the system | Interface lifts and drifts into the operational chapter | Independent pinned GSAP timeline with a low-angle entrance and vertical/lateral handoff | Shallower tilt, centered surface, shorter travel | Complete conceptual interface with synthetic data and no claimed technology |
| Secretaría | Operational dashboard | Digital surface at depth | Surface approaches → metrics and flow assemble → dashboard close-up | Dashboard exits horizontally | Pinned GSAP timeline distinct from REGCRIM | Shallower depth and shorter distance | Complete dashboard and project description |
| NEXUS | Editorial surfaces | Typographic product introduction | Editorial planes assemble → sphere and categories resolve → reading close-up | Layers disperse for archive handoff | Pinned GSAP timeline with independent layer motion | Reduced separation and shorter distance | Complete editorial composition |
| Archive / trajectory | Secondary work and professional history | Editorial list | Coordinated, readable progression | Opens into minimal contact field | Scrubbed reveals without pinning | Natural vertical reading | Fully static |
| Contact | Name and real contact channels | Light field with large closing statement | Typography rises into final position | Stable final frame | Short scrubbed closing reveal | Natural vertical reading | Fully static |

## Motion invariants

- Main chapters use one GSAP timeline, `pin: true`, `scrub`, named labels, and reversible transforms.
- The earth canvas renders only when its integer frame changes; it has no autonomous animation loop.
- Map camera values derive from the chapter timeline and use `jumpTo`, so pausing or reversing scroll preserves the exact state.
- Images and fonts settle before `ScrollTrigger.refresh()`.
- Hash navigation resolves to the relevant ScrollTrigger start position after refresh.
- No Lenis or second scroll engine is used.

## Rumbo checkpoints

| Rumbo progress | Composition |
|---:|---|
| 0% | Montevideo map resolves into the dark product stage. |
| 12% | The physical phone arrives from depth. |
| 28% | Device rests front-facing with the Rumbo home screen. |
| 45% | Camera enters the display while the UI advances. |
| 62% | The product world expands beyond the physical screen. |
| 78% | Full-screen Uruguay coast composition and editorial message. |
| 92% | Interactive “Explorar Rumbo” handoff becomes available. |
| 100% | Stable closing frame before the next portfolio chapter. |
