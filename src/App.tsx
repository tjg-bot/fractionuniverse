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
        <meshStandardMaterial color="#c9a84c" roughness={0.6} metalness={0.4} />
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

const ASSETS = [
  {
    id: 'luxicon',
    emoji: '🖖',
    tag: 'Fine Art · Collectibles',
    tagColor: '#a78bfa',
    title: 'LUXICON-ST60',
    subtitle: 'William Shatner × Bruce Sulzberg',
    description:
      'A 1-of-1 original glass painting personally signed by William Shatner at Star Trek Las Vegas 2025. Official Paramount Pictures license for the Star Trek 60th Anniversary. Heritage Auctions designated exit.',
    meta: [
      { label: 'Raise Target', value: '$500,000' },
      { label: 'Horizon', value: '18–24 mo' },
    ],
    href: 'https://fractionkings.com/spaceroyalty',
    gradient: 'linear-gradient(135deg, #0d0b1a 0%, #1a1030 100%)',
    glow: 'rgba(167,139,250,0.15)',
  },
  {
    id: 'nimble',
    emoji: '🛸',
    tag: 'AI · Space Technology',
    tagColor: '#60a5fa',
    title: 'NIMBLE-AI',
    subtitle: 'E3S × NASA × SpaceX',
    description:
      'The patented autonomous AI that flew to orbit aboard SpaceX Transporter 10 in 2024. NASA Stennis partner. Artemis pipeline. Commercial licensing revenue distributed quarterly to investors.',
    meta: [
      { label: 'Raise Target', value: '$5,000,000' },
      { label: 'Horizon', value: '36–60 mo' },
    ],
    href: 'https://fractionkings.com/spaceroyalty',
    gradient: 'linear-gradient(135deg, #0a0f1a 0%, #0d1f35 100%)',
    glow: 'rgba(96,165,250,0.15)',
  },
]

export default function App() {
  return (
    <div className="universe-root">
      {/* Fixed 3D background */}
      <Canvas
        className="universe-canvas"
        camera={{ position: [0, 2, 6], fov: 50 }}
      >
        <UniverseScene />
      </Canvas>

      {/* Scrollable content */}
      <div className="universe-scroll">

        {/* ── HERO ── */}
        <section className="universe-hero">
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

          <div className="universe-scroll-hint" aria-hidden="true">
            <span>Space Royalty</span>
            <span className="universe-scroll-arrow">↓</span>
          </div>
        </section>

        {/* ── SPACE ROYALTY ASSETS ── */}
        <section className="universe-assets">
          <div className="universe-assets-inner">
            <p className="universe-eyebrow" style={{ textAlign: 'center', marginBottom: '8px' }}>
              Space Royalty · Fraction Universe
            </p>
            <h2 className="universe-assets-title">
              Star Trek Taught Us to Reach for the Stars.<br />
              <span className="universe-assets-title-gold">Now We Actually Go.</span>
            </h2>
            <p className="universe-assets-sub">
              Two offerings. One program. Invite-only access to the assets bridging
              60 years of space culture with the machines building humanity's next chapter.
            </p>

            <div className="universe-cards">
              {ASSETS.map(a => (
                <a
                  key={a.id}
                  href={a.href}
                  className="universe-card"
                  style={{ background: a.gradient, boxShadow: `0 0 60px ${a.glow}` }}
                >
                  <div className="universe-card-header">
                    <span className="universe-card-emoji">{a.emoji}</span>
                    <span
                      className="universe-card-tag"
                      style={{ color: a.tagColor, borderColor: `${a.tagColor}44`, background: `${a.tagColor}15` }}
                    >
                      {a.tag}
                    </span>
                  </div>
                  <h3 className="universe-card-title">{a.title}</h3>
                  <p className="universe-card-subtitle">{a.subtitle}</p>
                  <p className="universe-card-desc">{a.description}</p>
                  <div className="universe-card-meta">
                    {a.meta.map(m => (
                      <div key={m.label} className="universe-card-meta-item">
                        <span className="universe-card-meta-label">{m.label}</span>
                        <span className="universe-card-meta-value">{m.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="universe-card-cta">
                    View Offering →
                  </div>
                </a>
              ))}
            </div>

            <p className="universe-assets-legal">
              Invite-only · Rule 506(c) Reg D · Accredited investors only · Not a public offering
            </p>
          </div>
        </section>

        <footer className="universe-footer">
          <p>More worlds coming.</p>
          <span className="universe-domain">fractionuniverse.com</span>
        </footer>

      </div>
    </div>
  )
}
