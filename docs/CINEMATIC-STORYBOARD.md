# Cinematic Storyboard

| Chapter | Protagonist | Initial composition | Scroll development | Final composition / handoff | Technique | Mobile | Reduced motion |
|---|---|---|---|---|---|---|---|
| Introduction | Alexander Lemos wordmark | Masked editorial title with negative space | Reveal → lateral separation → controlled scale | Title contracts left while the background adopts the portrait chapter tone | Pinned GSAP timeline, scrub, labels | Shorter travel and smaller lateral offset | Static title and metadata |
| Portrait | Real portrait | Text first; photograph concealed by a horizontal mask | Mask opens → portrait rests fully visible → statement enters | Portrait recedes to the right as the background becomes the geographic scene | Pinned DOM timeline with image decode before refresh | 1:1 portrait remains fully inside viewport; no lateral facial crop | Full 1:1 image and readable statement |
| World to Montevideo | Earth canvas and real map | Recognizable globe and contextual headline | 120 deterministic canvas frames → South America coordinates → map camera parameters scrub toward Montevideo | Map becomes a product surface | Pinned frame-sequence timeline plus MapLibre camera scrub | Shorter pin distance; same narrative states | Static map with attribution and text |
| Rumbo | Map and mobile product surface | Full-screen Montevideo map | Map contracts → device rises → product copy resolves | Map fades into the selected systems introduction | Continuation inside geographic pinned timeline | Device centered and enlarged; copy below | Static product composition after map |
| REGCRIM | Conceptual private-system interface | Distant interface in perspective | Approach → synthetic panels build → feature close-up | Interface moves laterally out of frame | Pinned GSAP timeline with scrub and labels | Reduced perspective and shorter distance | Complete conceptual interface, no hidden content |
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
