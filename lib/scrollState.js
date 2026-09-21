// A plain mutable object, not React state. The scroll director writes to it
// on scroll; the R3F scene's useFrame loop reads it every frame. Keeping
// this out of React state is what keeps the 60fps loop cheap — nothing here
// causes a re-render.
export const scrollState = {
  p: 0,       // 0..1 through the whole document
  act: 0,     // continuous act position, 0..6 (integer = parked act)
  work: 0,    // 0..1 through the "Work" section (drives the phone screen swap)
  finale: 0,  // 0..1 through "Contact" (drives the closing composition)
  mx: 0,      // pointer x, -1..1
  my: 0,      // pointer y, -1..1
  transit: 0, // 0..1, mid-flight between acts (CameraRig; dims plaques/screens)
  narrow: false, // viewport < 900px (CameraRig; stacked-layout framing)
  targets: {
    arch: 0.3,
    journey: 0,
    phone: 0,
    lattice: 0,
    timeline: 0,
  },
}

