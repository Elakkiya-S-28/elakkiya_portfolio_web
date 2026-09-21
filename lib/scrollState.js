// A plain mutable object, not React state. The scroll director writes to it
// on scroll; the R3F scene's useFrame loop reads it every frame. Keeping
// this out of React state is what keeps the 60fps loop cheap — nothing here
// causes a re-render.
//
// One act per DOM section, in order:
//   hero → About → Experience → Skills → Projects → Approach → Contact
export const scrollState = {
  p: 0,       // 0..1 through the whole document
  act: 0,     // continuous act position, 0..7 (integer = parked act)
  mx: 0,      // pointer x, -1..1
  my: 0,      // pointer y, -1..1
  transit: 0, // 0..1, mid-flight between acts (CameraRig; dims panels/tiles)
  narrow: false, // viewport < 900px (CameraRig; stacked-layout framing)
  timeline: 0,   // 0..1 experience scroll fill (TimelineBeam + .timeline__fill)
  pfan: 0,    // 0..1 projects scroll progress (ProjectFan card fan spread)
  targets: {
    hero: 0,      // hero phone composition
    phone: 0,     // alias of the hero ramp (HeroCluster listens here)
    about: 0,     // orbiting stack board behind the About copy
    experience: 0,// vertical timeline beam
    skills: 0,    // the tech-stack orbit
    projects: 0,  // project card fan
  },
  finale: 0,   // 0..1 through Contact — drives the closing orb
}

