'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, Sphere, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';

function GlassOrb({ position = [0,0,0], hue = 0.6 }) {
  const mesh = useRef<any>();
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.18;
    mesh.current.position.y = Math.sin(t * 0.9) * 0.15 + (position as any)[1];
  });
  const color = new THREE.Color().setHSL(hue, 0.6, 0.6);
  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh ref={mesh} position={position as any} castShadow>
        <icosahedronGeometry args={[1.1, 2]} />
        <MeshTransmissionMaterial
          thickness={0.8}
          chromaticAberration={0.06}
          anisotropy={0.4}
          distortion={0.05}
          metalness={0.1}
          roughness={0.05}
          transmission={1}
          transparent
          ior={1.25}
          color={color}
        />
      </mesh>
    </Float>
  );
}

function MinimalBackdrop() {
  return (
    <group>
      <Sphere args={[6, 64, 64]} scale={[1,1,1]}>
        <meshBasicMaterial color={new THREE.Color(0x0e1116)} side={THREE.BackSide} />
      </Sphere>
      <ambientLight intensity={0.6} />
      <directionalLight intensity={1.2} position={[3,4,2]} castShadow />
    </group>
  );
}

export function Scene({ minimal }: { minimal?: boolean }) {
  return (
    <Canvas dpr={[1,2]} camera={{ position: [0, 0, 6], fov: 42 }} shadows>
      <color attach="background" args={[minimal ? '#0b0b0d' : '#050507']} />
      <MinimalBackdrop />
      <GlassOrb position={[-1.6, 0.2, 0]} hue={0.58} />
      <GlassOrb position={[1.6, -0.1, 0]} hue={0.72} />
      <Environment preset="city" />
    </Canvas>
  );
}



