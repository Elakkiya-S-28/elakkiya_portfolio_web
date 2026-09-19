# Elakkiya Selvarajan — portfolio (Next.js + R3F)

Same design, copy and scroll behaviour as the single-file build, restructured
as an editable Next.js project. The 3D layer uses React Three Fiber + Drei
instead of raw Three.js, and GSAP ScrollTrigger + Lenis drive both the scroll
feel and the scene.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build && npm run start` for a
production check (this is what was used to verify the project builds clean).

## Structure

```
app/
  layout.js       fonts + <html>/<body>, metadata
  globals.css     all design tokens + section styles (unchanged from the original)
  page.js         assembles the sections + mounts the 3D Stage (client-only)

components/       the UI, one file per section — edit copy/markup here
  Nav.jsx  Hero.jsx  Approach.jsx  Work.jsx  Toolkit.jsx  Experience.jsx  Contact.jsx  Footer.jsx

canvas/           the 3D layer
  Stage.jsx       <Canvas> wrapper, renderer + tone-mapping settings
  Scene.jsx       composes environment/lighting/camera + the five acts
  Lighting.jsx    key/rim/bounce lights; rim tracks the CSS --accent variable
  CameraRig.jsx   shot list sampled by scroll position (edit SHOTS here)
  Colonnade.jsx   Act 1+2: hero architecture that morphs into the journey corridor
  Device.jsx      Act 3: the Aayush phone + watch, live canvas-drawn screens
  Lattice.jsx     Act 4: the technology lattice (edit TECH here)
  CareerPath.jsx  Act 5: the career-progression rail (edit STOPS here)
  materials.js    shared PBR materials
  textures.js     canvas-drawn plaque/phone/watch textures

lib/
  scrollState.js       plain mutable object the 3D loop reads every frame —
                        not React state, so scrolling never re-renders React
  useScrollDirector.js  wires Lenis + GSAP ScrollTrigger, writes into scrollState,
                        drives the --accent hue travel and the spine fill
```

## Editing the 3D

Each act is its own file under `canvas/`. The pattern in every act is the
same: a `HOME`/`FIN` vector pair for where it sits normally vs. in the
Contact-section finale, a `reveal` ref smoothed from `scrollState.targets.*`
each frame, and geometry built with `useMemo` so it isn't rebuilt every
render. Change camera framing in `CameraRig.jsx`'s `SHOTS` array — each entry
lines up by index with `hero / approach / work / toolkit / experience /
contact` in DOM order.

## Notes

- `Stage` is loaded with `next/dynamic` and `ssr: false` — the 3D layer
  touches `window`/canvas and must never run server-side.
- `Environment preset="apartment"` (drei) replaces the manual
  `PMREMGenerator(RoomEnvironment)` from the single-file build; same effect,
  fewer lines.
- Reduced-motion users skip Lenis entirely and get a static, undamped scene
  (see `useScrollDirector.js` and `CameraRig.jsx`).
