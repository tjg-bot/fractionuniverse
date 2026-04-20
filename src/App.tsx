import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import './App.css'

function KingdomPlanet() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshStandardMaterial
          color="#c9a84c"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.1, 0.08, 16, 100]} />
        <meshStandardMaterial color="#c9a84c" opacity={0.4} transparent />
      </mesh>
    </group>
  )
}

function UniverseScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#4466ff" />
      <Stars radius={120} depth={60} count={6000} factor={5} fade speed={0.5} />
      <KingdomPlanet />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.6}
      />
    </>
  )
}

export default function App() {
  return (
    <div className="universe-root">
      <Canvas
        className="universe-canvas"
        camera={{ position: [0, 2, 6], fov: 50 }}
      >
        <UniverseScene />
      </Canvas>

      <div className="universe-overlay">
        <header className="universe-header">
          <span className="universe-wordmark">FRACTION UNIVERSE</span>
        </header>

        <main className="universe-main">
          <p className="universe-eyebrow">World 01 — Now Live</p>
          <h1 className="universe-title">The Kingdom</h1>
          <p className="universe-subtitle">
            Fractional investing through an immersive 3D castle experience.
            Explore real assets. Own a piece of something real.
          </p>
          <a
            href="https://fractionkings.com"
            className="universe-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter The Kingdom →
          </a>
        </main>

        <footer className="universe-footer">
          <p>More worlds coming.</p>
          <span className="universe-domain">fractionuniverse.com</span>
        </footer>
      </div>
    </div>
  )
}
