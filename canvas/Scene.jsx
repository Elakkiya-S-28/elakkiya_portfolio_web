'use client'

import { Environment as DreiEnv } from '@react-three/drei'
import Lighting from './Lighting'
import CameraRig from './CameraRig'
import Environment from './Environment'
import HeroCluster from './HeroCluster'
import StackBoard from './StackBoard'
import TimelineBeam from './TimelineBeam'
import SkillOrbit from './SkillOrbit'
import ProjectFan from './ProjectFan'
import ContactOrb from './ContactOrb'

export default function Scene({ reduced, narrow }) {
  return (
    <>
      <fogExp2 attach="fog" args={[0x0e0e12, 0.018]} />
      {/* Real image-based lighting for the reflective floor / steel / glass,
          in place of a manual PMREMGenerator — drei does the work for us. */}
      <DreiEnv preset="apartment" />
      <Lighting />
      <CameraRig reduced={reduced} />

      {/* the set: liquid floor, rock, ribbons, dust */}
      <Environment narrow={narrow} />

      {/* the acts, in DOM order */}
      <HeroCluster />
      <StackBoard />
      <TimelineBeam />
      <SkillOrbit />
      <ProjectFan />
      <ContactOrb />
    </>
  )
}
