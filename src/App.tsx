import {
  Suspense, useState, useRef, useMemo, useEffect, useCallback,
  type CSSProperties,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { WORLDS, type World } from './worlds'
import './App.css'

// ─── Platform detection ───────────────────────────────────────────────────────
const IS_MOBILE = typeof window !== 'undefined' && (
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.innerWidth < 768
)

// ─── 3D: Deep space star field ────────────────────────────────────────────────
function DeepStars() {
  const ref = useRef<THREE.Points>(null)
  const COUNT = 2800
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const r = 55 + Math.random() * 85
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.004
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.002) * 0.04
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c8d4ff" size={0.2} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── 3D: Nebula particle clouds ────────────────────────────────────────────────
function NebulaClouds() {
  const defs = useMemo(() => [
    { color: '#2a1a6a', count: 550, spread: 26, offset: [10, 5, -16] as [number,number,number] },
    { color: '#0f3a1a', count: 480, spread: 20, offset: [-13, -4, -18] as [number,number,number] },
    { color: '#3d0a5a', count: 500, spread: 24, offset: [2, 9, -22] as [number,number,number] },
  ], [])

  return (
    <>
      {defs.map((d, ci) => {
        const pos = new Float32Array(d.count * 3)
        for (let i = 0; i < d.count; i++) {
          pos[i * 3]     = d.offset[0] + (Math.random() - 0.5) * d.spread
          pos[i * 3 + 1] = d.offset[1] + (Math.random() - 0.5) * d.spread * 0.5
          pos[i * 3 + 2] = d.offset[2] + (Math.random() - 0.5) * d.spread * 0.7
        }
        return (
          <points key={ci}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pos, 3]} />
            </bufferGeometry>
            <pointsMaterial color={d.color} size={0.5} transparent opacity={0.16} sizeAttenuation depthWrite={false} />
          </points>
        )
      })}
    </>
  )
}

// ─── 3D: World planet ─────────────────────────────────────────────────────────
function WorldPlanet({
  world, isSelected, isAny, onClick,
}: {
  world: World; isSelected: boolean; isAny: boolean; onClick: (w: World) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const [hovered, setHovered] = useState(false)

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: world.color,
    emissive: new THREE.Color(world.emissiveColor),
    emissiveIntensity: isSelected ? 1.8 : hovered ? 1.1 : 0.6,
    roughness: 0.5,
    metalness: 0.5,
  }), [world, isSelected, hovered])

  const ringMat = useMemo(() => world.hasRing ? new THREE.MeshStandardMaterial({
    color: world.ringColor ?? world.color,
    emissive: new THREE.Color(world.emissiveColor),
    emissiveIntensity: 0.9,
    roughness: 0.5,
    metalness: 0.5,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  }) : null, [world])

  useEffect(() => () => { mat.dispose(); ringMat?.dispose() }, [mat, ringMat])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += 0.0018 + world.scale * 0.0008
    meshRef.current.position.y = world.position[1] + Math.sin(clock.elapsedTime * 0.45 + world.position[0]) * 0.18
    const target = isSelected ? 1.2 : hovered ? 1.1 : 1.0
    const cur = meshRef.current.scale.x
    meshRef.current.scale.setScalar(cur + (target - cur) * 0.09)

    if (glowRef.current) {
      const pulse = 0.78 + 0.22 * Math.sin(clock.elapsedTime * 1.3 + world.position[0])
      glowRef.current.intensity = (isSelected ? 5.5 : hovered ? 3.2 : isAny ? 0.8 : 2.2) * pulse
    }
  })

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
    return () => { document.body.style.cursor = 'default' }
  }, [hovered])

  return (
    <group position={world.position}>
      <mesh
        ref={meshRef}
        material={mat}
        onClick={e => { e.stopPropagation(); onClick(world) }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[world.scale, 52, 36]} />
      </mesh>

      {world.hasRing && ringMat && (
        <mesh rotation={[Math.PI / 2.5, 0, 0.25]} material={ringMat}>
          <torusGeometry args={[world.scale * 1.65, world.scale * 0.055, 4, 90]} />
        </mesh>
      )}

      <pointLight ref={glowRef} color={world.color} intensity={2.2} distance={isSelected ? 16 : 9} decay={2} />

      {!IS_MOBILE && (
        <Html position={[0, world.scale * 1.38, 0]} center distanceFactor={13} occlude={false} style={{ pointerEvents: 'none' }}>
          <div className={`world-label${isSelected ? ' selected' : ''}${isAny && !isSelected ? ' dimmed' : ''}`}
               style={{ '--wc': world.color } as CSSProperties}>
            <span className="wl-name">{world.name}</span>
            {world.status === 'LIVE' && <span className="wl-live">LIVE</span>}
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── 3D: Camera easing toward selected world ──────────────────────────────────
function CameraFocus({ target }: { target: [number,number,number] | null }) {
  const { camera } = useThree()
  const dest = useRef(new THREE.Vector3(0, 3, 13))

  useEffect(() => {
    if (target) {
      const [tx, ty, tz] = target
      const d = new THREE.Vector3(tx, ty, tz)
      const n = d.clone().normalize()
      dest.current.set(tx - n.x * 5.5, ty + 1.2, tz - n.z * 3.5 + 4)
    } else {
      dest.current.set(0, 3, 13)
    }
  }, [target])

  useFrame(() => { camera.position.lerp(dest.current, 0.022) })
  return null
}

// ─── 3D: Scene ────────────────────────────────────────────────────────────────
function UniverseScene({
  selectedWorld, onSelectWorld,
}: {
  selectedWorld: World | null; onSelectWorld: (w: World | null) => void
}) {
  return (
    <>
      <color attach="background" args={['#010208']} />
      <fog attach="fog" args={['#010208', 45, 115]} />
      <ambientLight intensity={0.1} color="#1a1a3a" />
      <pointLight position={[0, 20, 8]} color="#ffffff" intensity={0.25} />
      <DeepStars />
      <NebulaClouds />
      {WORLDS.map(w => (
        <WorldPlanet
          key={w.id}
          world={w}
          isSelected={selectedWorld?.id === w.id}
          isAny={selectedWorld !== null}
          onClick={onSelectWorld}
        />
      ))}
      <CameraFocus target={selectedWorld?.position ?? null} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.22}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        makeDefault
      />
      {!IS_MOBILE && (
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.45} intensity={3.8} />
        </EffectComposer>
      )}
    </>
  )
}

// ─── 2D: World info panel ─────────────────────────────────────────────────────
function WorldPanel({ world, onClose }: { world: World; onClose: () => void }) {
  return (
    <motion.div
      className="world-panel"
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 48 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      style={{ '--wc': world.color } as CSSProperties}
    >
      <button className="panel-close" onClick={onClose}>×</button>
      <div className="panel-header">
        <p className="panel-eyebrow">{world.regulation} · {world.regLabel}</p>
        <h2 className="panel-name">{world.name}</h2>
        <p className="panel-subtitle">{world.subtitle}</p>
        <span className={`panel-badge ${world.status === 'LIVE' ? 'live' : 'coming'}`}>
          {world.status === 'LIVE' ? 'Live Now' : 'Coming Soon'}
        </span>
      </div>
      <p className="panel-tagline">"{world.tagline}"</p>
      <p className="panel-desc">{world.description}</p>
      <ul className="panel-features">
        {world.features.map(f => <li key={f}>{f}</li>)}
      </ul>
      {world.href ? (
        <a href={world.href} className="panel-cta" target="_blank" rel="noopener noreferrer">
          Enter The Kingdom →
        </a>
      ) : (
        <a href="https://fractionkings.com/contact" className="panel-cta-coming" target="_blank" rel="noopener noreferrer">
          Request Early Access →
        </a>
      )}
    </motion.div>
  )
}

// ─── 2D: Worlds grid ──────────────────────────────────────────────────────────
function WorldsSection({ onFocus }: { onFocus: (w: World) => void }) {
  return (
    <section className="section" id="worlds">
      <div className="section-inner">
        <p className="eyebrow">The Universe</p>
        <h2 className="section-h">Five Worlds. One Platform.</h2>
        <p className="section-sub">
          Each world is a fully immersive 3D experience built around a specific asset class.
          Explore, learn, and invest — in the universe, everything is connected.
        </p>
        <div className="worlds-grid">
          {WORLDS.map(w => (
            <div
              key={w.id}
              className={`wcard${w.status === 'COMING' ? ' coming' : ''}`}
              style={{ '--wc': w.color } as CSSProperties}
              onClick={() => onFocus(w)}
            >
              <div className="wcard-orb" />
              <div className="wcard-body">
                <div className="wcard-top">
                  <span className="wcard-reg">{w.regulation}</span>
                  <span className={`wcard-status ${w.status === 'LIVE' ? 'live' : 'coming'}`}>
                    {w.status === 'LIVE' ? 'Live' : 'Coming'}
                  </span>
                </div>
                <h3 className="wcard-name">{w.name}</h3>
                <p className="wcard-sub">{w.subtitle}</p>
                <p className="wcard-tagline">{w.tagline}</p>
                <div className="wcard-footer">
                  <span className="wcard-reglabel">{w.regLabel}</span>
                  <span className="wcard-arrow">↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 2D: How it works ─────────────────────────────────────────────────────────
function HowSection() {
  const steps = [
    { n: '01', title: 'Enter a World', body: "Every offering lives inside a purpose-built 3D universe. Walk through it. Understand what you're investing in before you commit a single dollar." },
    { n: '02', title: 'Choose Your Stake', body: 'Select your investment amount. Reg CF offerings are open to all investors — no accreditation required. Reg D offerings require accreditation verification.' },
    { n: '03', title: 'Own a Fraction', body: 'Receive your units, track distributions, and watch your portfolio grow inside your personal universe. Every asset, every return — all in one place.' },
  ]
  return (
    <section className="section section-dark">
      <div className="section-inner">
        <p className="eyebrow">The Process</p>
        <h2 className="section-h">How It Works</h2>
        <div className="how-grid">
          {steps.map(s => (
            <div key={s.n} className="how-step">
              <span className="how-n">{s.n}</span>
              <h3 className="how-title">{s.title}</h3>
              <p className="how-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 2D: Two paths ────────────────────────────────────────────────────────────
function TwoPathsSection() {
  return (
    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Open to Everyone</p>
        <h2 className="section-h">Two Paths. One Universe.</h2>
        <p className="section-sub">
          Fraction Universe is the first platform where accredited and non-accredited investors
          explore the same worlds — just through different doors.
        </p>
        <div className="paths-grid">
          <div className="path-card path-cf">
            <p className="path-label">Reg CF</p>
            <h3 className="path-title">Open to All</h3>
            <p className="path-desc">No accreditation required. Anyone can invest — the general public, first-time investors, community supporters. Investment limits apply based on income and net worth.</p>
            <ul className="path-list">
              <li>No accreditation required</li>
              <li>Up to $5M per offering per year</li>
              <li>The Studio, The Estate, The Stage, The Lab</li>
            </ul>
          </div>
          <div className="path-card path-d">
            <p className="path-label">Reg D 506(c)</p>
            <h3 className="path-title">Accredited Investors</h3>
            <p className="path-desc">Verified accredited investors access higher-minimum, premium offerings inside FractionKings — the castle world. More exclusive, larger raises, deeper deal access.</p>
            <ul className="path-list">
              <li>Accreditation verification required</li>
              <li>No raise limit</li>
              <li>The Kingdom — fractionkings.com</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 2D: Build Your World ─────────────────────────────────────────────────────
function BuildSection() {
  const cards = [
    { icon: '◈', title: 'Custom 3D Universe', body: 'A purpose-built virtual world themed to your brand — not a template. Your story, your architecture, your experience.' },
    { icon: '◎', title: 'AR & VR Ready', body: 'Every world we build is AR and VR compatible. Investors walk through your project on a headset before committing capital.' },
    { icon: '◉', title: 'Compliance Built In', body: 'Securities compliance is baked into every offering structure. Reg CF, Reg D, and hybrid offerings — handled end to end.' },
    { icon: '⬡', title: 'Investor Dashboard', body: 'Your investors get a personal universe — all holdings, distributions, and updates in one immersive portfolio.' },
  ]
  return (
    <section className="section section-dark">
      <div className="section-inner">
        <p className="eyebrow">For Creators & Companies</p>
        <h2 className="section-h">We Build Your Universe</h2>
        <p className="section-sub">
          Every company, film, artist, and property deserves its own world.
          We replace the generic crowdfunding page with an immersive 3D experience
          that gives your investors something worth entering.
        </p>
        <div className="build-grid">
          {cards.map(c => (
            <div key={c.title} className="build-card">
              <span className="build-icon">{c.icon}</span>
              <h3 className="build-title">{c.title}</h3>
              <p className="build-body">{c.body}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '52px' }}>
          <a href="https://fractionkings.com/contact" className="build-cta" target="_blank" rel="noopener noreferrer">
            Apply to Launch Your World →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── 2D: CTA ──────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="section cta-section">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div className="cta-orb" />
        <p className="eyebrow">The Universe Is Expanding</p>
        <h2 className="cta-h">New worlds are opening.</h2>
        <p className="cta-sub">
          Get early access to The Studio, The Estate, The Stage, and The Lab
          the moment their doors open.
        </p>
        <div className="cta-btns">
          <a href="https://fractionkings.com" className="cta-primary" target="_blank" rel="noopener noreferrer">
            Enter The Kingdom Now →
          </a>
          <a href="https://fractionkings.com/contact" className="cta-secondary" target="_blank" rel="noopener noreferrer">
            Get Early Access
          </a>
        </div>
        <p className="cta-legal">
          Fraction Universe is an investment platform operating under applicable federal securities laws.
          Reg CF offerings are available to all US investors. Reg D 506(c) offerings are limited to
          verified accredited investors. Investing involves risk, including loss of principal.
        </p>
      </div>
    </section>
  )
}

// ─── 2D: Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="fu-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-wm">FRACTION UNIVERSE</span>
          <p className="footer-tag">Every world. Every investor. One universe.</p>
        </div>
        <div className="footer-links">
          <a href="https://fractionkings.com" target="_blank" rel="noopener noreferrer">The Kingdom</a>
          <a href="https://fractionkings.com/legal" target="_blank" rel="noopener noreferrer">Legal</a>
          <a href="https://fractionkings.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
          <a href="https://fractionkings.com/contact" target="_blank" rel="noopener noreferrer">Contact</a>
        </div>
        <p className="footer-copy">© 2026 Fraction Universe Inc. · All rights reserved · fractionuniverse.com</p>
      </div>
    </footer>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const handleSelect = useCallback((w: World | null) => {
    if (!w) return
    setSelectedWorld(p => p?.id === w.id ? null : w)
  }, [])

  const handleClose = useCallback(() => setSelectedWorld(null), [])

  const handleFocusFromGrid = useCallback((w: World) => {
    setSelectedWorld(w)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="universe-root">

      {/* Fixed 3D canvas */}
      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 3, 13], fov: 52 }}
          dpr={IS_MOBILE ? [1, 1] : [1, 1.5]}
          gl={{
            antialias: !IS_MOBILE,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.4,
          }}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <UniverseScene selectedWorld={selectedWorld} onSelectWorld={handleSelect} />
          </Suspense>
        </Canvas>
      </div>

      {/* Fixed UI overlay */}
      <div className="overlay">

        {/* Nav */}
        <nav className={`fu-nav${scrolled ? ' scrolled' : ''}`}>
          <span className="fu-wordmark">FRACTION UNIVERSE</span>
          <div className="nav-right">
            <a href="#worlds" className="nav-link">Worlds</a>
            <a href="https://fractionkings.com" className="nav-kingdom" target="_blank" rel="noopener noreferrer">
              The Kingdom ↗
            </a>
          </div>
        </nav>

        {/* Hero text — hidden when a world is selected */}
        <AnimatePresence>
          {!selectedWorld && (
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <p className="hero-eyebrow">AR + VR Crowdfunding Platform</p>
              <h1 className="hero-title">The Universe<br />is Open.</h1>
              <p className="hero-sub">
                Five immersive 3D worlds. Every asset class.<br />
                All investors welcome.
              </p>
              <div className="hero-ctas">
                <a href="https://fractionkings.com" className="hero-btn-primary" target="_blank" rel="noopener noreferrer">
                  Enter The Kingdom →
                </a>
                <a href="#worlds" className="hero-btn-secondary">Explore Worlds ↓</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop: click hint */}
        <AnimatePresence>
          {!selectedWorld && !IS_MOBILE && (
            <motion.p
              className="click-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.4 }}
            >
              Click any world to explore
            </motion.p>
          )}
        </AnimatePresence>

        {/* Mobile: world buttons */}
        {IS_MOBILE && !selectedWorld && (
          <div className="mobile-btns">
            {WORLDS.map(w => (
              <button
                key={w.id}
                className="mobile-world-btn"
                style={{ '--wc': w.color } as CSSProperties}
                onClick={() => handleSelect(w)}
              >
                {w.name}
                {w.status === 'LIVE' && <span className="mobile-live" />}
              </button>
            ))}
          </div>
        )}

        {/* World info panel */}
        <AnimatePresence>
          {selectedWorld && (
            <WorldPanel world={selectedWorld} onClose={handleClose} />
          )}
        </AnimatePresence>

      </div>

      {/* Scrollable 2D content — sits below the 100vh canvas */}
      <div className="scroll-content">
        <WorldsSection onFocus={handleFocusFromGrid} />
        <HowSection />
        <TwoPathsSection />
        <BuildSection />
        <CTASection />
        <Footer />
      </div>

    </div>
  )
}
