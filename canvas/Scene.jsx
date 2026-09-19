'use client'

import { Environment } from '@react-three/drei'
import Lighting from './Lighting'
import CameraRig from './CameraRig'
import Colonnade from './Colonnade'
import Device from './Device'
import Lattice from './Lattice'
import CareerPath from './CareerPath'

export default function Scene({ reduced }) {
  return (
    <>
      <fogExp2 attach="fog" args={[0x140f1c, 0.021]} />
      {/* Real image-based lighting for reflective floor / steel / glass, in
          place of the manual PMREMGenerator(RoomEnvironment) used by the
          vanilla build — same idea, drei does the PMREM work for us. */}
      <Environment preset="apartment" />
      <Lighting />
      <CameraRig reduced={reduced} />

      <Colonnade />
      <Device />
      <Lattice />
      <CareerPath />
    </>
  )
}
