import {
  Suspense, useState, useRef, useMemo, useEffect, useCallback,
  type CSSProperties,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { WORLDS, type World } from './worlds'
import './App.css'

const IS_MOBILE = typeof window !== 'undefined' && (
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.innerWidth < 768
)

// ─── Galaxy spiral disc ───────────────────────────────────────────────────────
function GalaxyDisc() {
  const COUNT = IS_MOBILE ? 3500 : 7000

  const { geo, mat } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const arm     = Math.floor(Math.random() * 3)
      const r       = 12 + Math.pow(Math.random(), 0.6) * 60
      const baseAng = arm * (Math.PI * 2 / 3)
      const twist   = r * 0.06
      const scatter = (1 - r / 72) * 0.8 + 0.2
      const angle   = baseAng + twist + (Math.random() - 0.5) * scatter

      positions[i * 3]     = Math.cos(angle) * r + (Math.random() - 0.5) * r * 0.1
      positions[i * 3 + 1] = (Math.random() - 0.5) * Math.max(0.5, 4 - r * 0.04)
      positions[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * r * 0.1 - 30

      const t = r / 72
      const b = 0.35 + Math.random() * 0.55
      if (Math.random() < 0.35) {
        colors[i * 3]     = b * (1.0 - t * 0.1)
        colors[i * 3 + 1] = b * (0.75 - t * 0.25)
        colors[i * 3 + 2] = b * (0.3 + t * 0.4)
      } else {
        colors[i * 3]     = b * 0.4
        colors[i * 3 + 1] = b * (0.55 + t * 0.2)
        colors[i * 3 + 2] = b * (0.85 + Math.random() * 0.15)
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    const m = new THREE.PointsMaterial({
      size: IS_MOBILE ? 0.28 : 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geo: g, mat: m }
  }, [COUNT])

  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.006
  })

  return <points ref={ref} geometry={geo} material={mat} />
}

// ─── Deep star field ──────────────────────────────────────────────────────────
function DeepStars() {
  const COUNT = IS_MOBILE ? 1800 : 3500

  const { geo, mat } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const r     = 65 + Math.random() * 110
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const type = Math.random()
      const b = 0.5 + Math.random() * 0.5
      if      (type < 0.08) { colors[i*3]=b;      colors[i*3+1]=b*0.35; colors[i*3+2]=b*0.2  }
      else if (type < 0.18) { colors[i*3]=b*0.95; colors[i*3+1]=b*0.6;  colors[i*3+2]=b*0.15 }
      else if (type < 0.32) { colors[i*3]=b;      colors[i*3+1]=b*0.9;  colors[i*3+2]=b*0.45 }
      else                  { colors[i*3]=b*0.6;  colors[i*3+1]=b*0.75; colors[i*3+2]=b      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    const m = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geo: g, mat: m }
  }, [COUNT])

  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.0025
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.0018) * 0.04
    }
  })

  return <points ref={ref} geometry={geo} material={mat} />
}

// ─── Nebula clouds ────────────────────────────────────────────────────────────
const NEBULA_CONFIG = [
  { color: [0.18, 0.04, 0.55], count: 700, spread: [34, 14, 28], center: [10,  5, -28] },
  { color: [0.04, 0.15, 0.42], count: 600, spread: [28, 10, 22], center: [-16,-3, -32] },
  { color: [0.35, 0.03, 0.28], count: 550, spread: [22,  9, 20], center: [3,  10, -38] },
  { color: [0.02, 0.28, 0.22], count: 480, spread: [20,  8, 17], center: [-8, -7, -22] },
  { color: [0.28, 0.12, 0.04], count: 420, spread: [25,  9, 20], center: [18, -4, -30] },
]

function NebulaClouds() {
  const { geo, mat } = useMemo(() => {
    const total     = NEBULA_CONFIG.reduce((s, n) => s + n.count, 0)
    const positions = new Float32Array(total * 3)
    const colors    = new Float32Array(total * 3)
    let idx = 0

    for (const nc of NEBULA_CONFIG) {
      for (let i = 0; i < nc.count; i++) {
        positions[idx*3]   = nc.center[0] + (Math.random()-0.5)*nc.spread[0]
        positions[idx*3+1] = nc.center[1] + (Math.random()-0.5)*nc.spread[1]
        positions[idx*3+2] = nc.center[2] + (Math.random()-0.5)*nc.spread[2]
        const f = 0.25 + Math.random() * 0.75
        colors[idx*3]   = nc.color[0] * f
        colors[idx*3+1] = nc.color[1] * f
        colors[idx*3+2] = nc.color[2] * f
        idx++
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    const m = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geo: g, mat: m }
  }, [])

  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  return <points geometry={geo} material={mat} />
}

// ─── Shooting stars ───────────────────────────────────────────────────────────
type StarState = {
  active: boolean; life: number; maxLife: number
  x: number; y: number; z: number
  dx: number; dy: number; dz: number
  delay: number
}

function ShootingStars() {
  const COUNT  = 5
  const grpRef = useRef<THREE.Group>(null)
  const stRef  = useRef<StarState[]>(
    Array.from({ length: COUNT }, (_, i) => ({
      active: false, life: 0, maxLife: 0,
      x: 0, y: 0, z: 0, dx: 0, dy: 0, dz: 0,
      delay: i * 4.5 + Math.random() * 10,
    }))
  )

  useFrame((_, dt) => {
    if (!grpRef.current) return
    const meshes = grpRef.current.children as THREE.Mesh[]

    stRef.current.forEach((s, i) => {
      const mesh = meshes[i]
      if (!mesh) return

      if (!s.active) {
        s.delay -= dt
        if (s.delay <= 0) {
          s.active = true; s.life = 0
          s.maxLife = 1.5 + Math.random() * 1.5
          s.x = (Math.random() - 0.5) * 60
          s.y = 12 + Math.random() * 18
          s.z = -5 - Math.random() * 25
          s.dx = (Math.random() - 0.5) * 0.4
          s.dy = -(0.5 + Math.random() * 0.5)
          s.dz = -0.05
          s.delay = 9 + Math.random() * 14
          mesh.visible = true
        } else { mesh.visible = false }
        return
      }

      s.life += dt
      s.x += s.dx * dt * 60
      s.y += s.dy * dt * 60
      s.z += s.dz * dt * 60
      mesh.position.set(s.x, s.y, s.z)

      const t    = s.life / s.maxLife
      const fade = t < 0.1 ? t / 0.1 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      ;(mesh.material as THREE.MeshBasicMaterial).opacity = fade * 0.9

      if (s.life >= s.maxLife) { s.active = false; mesh.visible = false }
    })
  })

  return (
    <group ref={grpRef}>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh key={i} visible={false}>
          <sphereGeometry args={[0.08, 4, 4]} />
          <meshBasicMaterial color="#e8f0ff" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Kingdom castle (on planet surface) ──────────────────────────────────────
function KingdomCastle() {
  const stoneMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8a7a68',
    emissive: '#3a2a1a',
    emissiveIntensity: 0.5,
    roughness: 0.8,
    metalness: 0.15,
  }), [])
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c9a84c',
    emissive: '#8a6010',
    emissiveIntensity: 1.5,
    roughness: 0.2,
    metalness: 0.8,
  }), [])
  useEffect(() => () => { stoneMat.dispose(); goldMat.dispose() }, [stoneMat, goldMat])

  const towers: [number, number, number][] = [
    [-0.38, 0, -0.38], [0.38, 0, -0.38],
    [-0.38, 0,  0.38], [0.38, 0,  0.38],
  ]

  return (
    <group>
      {/* Foundation */}
      <mesh material={stoneMat} position={[0, -0.04, 0]}>
        <boxGeometry args={[0.92, 0.08, 0.92]} />
      </mesh>
      {/* Main keep */}
      <mesh material={stoneMat} position={[0, 0.55, 0]}>
        <boxGeometry args={[0.42, 1.0, 0.42]} />
      </mesh>
      {/* Keep merlons front/back */}
      {[-0.14, 0, 0.14].map(x => (
        <mesh key={`mf${x}`} material={stoneMat} position={[x, 1.12,  0.22]}><boxGeometry args={[0.1, 0.12, 0.04]} /></mesh>
      ))}
      {[-0.14, 0, 0.14].map(x => (
        <mesh key={`mb${x}`} material={stoneMat} position={[x, 1.12, -0.22]}><boxGeometry args={[0.1, 0.12, 0.04]} /></mesh>
      ))}
      {/* Corner towers + gold cones */}
      {towers.map(([x,, z]) => (
        <group key={`t${x}${z}`}>
          <mesh material={stoneMat} position={[x, 0.52, z]}>
            <cylinderGeometry args={[0.13, 0.15, 1.04, 8]} />
          </mesh>
          <mesh material={goldMat} position={[x, 1.14, z]}>
            <coneGeometry args={[0.14, 0.44, 8]} />
          </mesh>
        </group>
      ))}
      {/* Curtain walls */}
      <mesh material={stoneMat} position={[0,  0.22, -0.38]}><boxGeometry args={[0.76, 0.44, 0.06]} /></mesh>
      <mesh material={stoneMat} position={[0,  0.22,  0.38]}><boxGeometry args={[0.76, 0.44, 0.06]} /></mesh>
      <mesh material={stoneMat} position={[-0.38, 0.22, 0]}><boxGeometry args={[0.06, 0.44, 0.76]} /></mesh>
      <mesh material={stoneMat} position={[ 0.38, 0.22, 0]}><boxGeometry args={[0.06, 0.44, 0.76]} /></mesh>
      {/* Flagpole + banner */}
      <mesh material={goldMat} position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.72, 4]} />
      </mesh>
      <mesh material={goldMat} position={[0.11, 1.76, 0]}>
        <boxGeometry args={[0.22, 0.13, 0.02]} />
      </mesh>
    </group>
  )
}

// ─── Atmosphere glow ──────────────────────────────────────────────────────────
function AtmosphereGlow({ color, radius }: { color: string; radius: number }) {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.13,
    side: THREE.BackSide,
    depthWrite: false,
  }), [color])

  useEffect(() => () => mat.dispose(), [mat])

  return (
    <mesh material={mat}>
      <sphereGeometry args={[radius * 1.24, 24, 18]} />
    </mesh>
  )
}

// ─── World planet ─────────────────────────────────────────────────────────────
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
    emissiveIntensity: isSelected ? 2.0 : hovered ? 1.3 : 0.7,
    roughness: 0.42,
    metalness: 0.55,
  }), [world, isSelected, hovered])

  const ringMat = useMemo(() => world.hasRing
    ? new THREE.MeshStandardMaterial({
        color: world.ringColor ?? world.color,
        emissive: new THREE.Color(world.emissiveColor),
        emissiveIntensity: 1.2,
        roughness: 0.4,
        metalness: 0.6,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    : null, [world])

  useEffect(() => () => { mat.dispose(); ringMat?.dispose() }, [mat, ringMat])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += 0.0016 + world.scale * 0.0007
    meshRef.current.position.y =
      world.position[1] + Math.sin(clock.elapsedTime * 0.42 + world.position[0]) * 0.2

    const target = isSelected ? 1.22 : hovered ? 1.1 : 1.0
    const cur    = meshRef.current.scale.x
    meshRef.current.scale.setScalar(cur + (target - cur) * 0.08)

    if (glowRef.current) {
      const pulse = 0.75 + 0.25 * Math.sin(clock.elapsedTime * 1.2 + world.position[0])
      glowRef.current.intensity = (isSelected ? 6 : hovered ? 3.5 : isAny ? 1 : 2.5) * pulse
    }
  })

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
    return () => { document.body.style.cursor = 'default' }
  }, [hovered])

  return (
    <group position={world.position}>
      <AtmosphereGlow color={world.color} radius={world.scale} />

      <mesh
        ref={meshRef}
        material={mat}
        onClick={e => { e.stopPropagation(); onClick(world) }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[world.scale, 64, 48]} />
        {world.hasCastle && (
          <group position={[0, world.scale + 0.05, 0]} scale={world.scale * 0.13}>
            <KingdomCastle />
          </group>
        )}
      </mesh>

      {world.hasRing && ringMat && (
        <mesh rotation={[Math.PI / 2.5, 0, 0.25]} material={ringMat}>
          <torusGeometry args={[world.scale * 1.65, world.scale * 0.065, 3, 120]} />
        </mesh>
      )}

      <pointLight
        ref={glowRef}
        color={world.color}
        intensity={2.5}
        distance={isSelected ? 18 : 10}
        decay={2}
      />

      {!IS_MOBILE && (
        <Html
          position={[0, world.scale * 1.42, 0]}
          center
          distanceFactor={13}
          occlude={false}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`world-label${isSelected ? ' selected' : ''}${isAny && !isSelected ? ' dimmed' : ''}`}
            style={{ '--wc': world.color } as CSSProperties}
          >
            <span className="wl-name">{world.name}</span>
            {world.status === 'LIVE' && <span className="wl-live">LIVE</span>}
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── Camera easing ────────────────────────────────────────────────────────────
function CameraFocus({ target }: { target: [number,number,number] | null }) {
  const { camera } = useThree()
  const dest = useRef(new THREE.Vector3(0, 3, 13))

  useEffect(() => {
    if (target) {
      const [tx, ty, tz] = target
      const n = new THREE.Vector3(tx, ty, tz).normalize()
      dest.current.set(tx - n.x * 5.5, ty + 1.2, tz - n.z * 3.5 + 4)
    } else {
      dest.current.set(0, 3, 13)
    }
  }, [target])

  useFrame(() => { camera.position.lerp(dest.current, 0.022) })
  return null
}

// ─── Universe scene ───────────────────────────────────────────────────────────
function UniverseScene({
  selectedWorld, onSelectWorld,
}: {
  selectedWorld: World | null; onSelectWorld: (w: World | null) => void
}) {
  return (
    <>
      <color attach="background" args={['#010208']} />
      <fog attach="fog" args={['#010208', 55, 130]} />
      <ambientLight intensity={0.08} color="#1a1535" />
      <pointLight position={[0, 25, 10]} color="#ffffff" intensity={0.2} />

      <GalaxyDisc />
      <DeepStars />
      <NebulaClouds />
      {!IS_MOBILE && <ShootingStars />}

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
        autoRotateSpeed={0.18}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        makeDefault
      />
    </>
  )
}

// ─── World info panel ─────────────────────────────────────────────────────────
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

// ─── 2D: Opening statement ────────────────────────────────────────────────────
function OpeningSection() {
  return (
    <section className="section manifesto-section">
      <div className="section-inner manifesto-inner">
        <p className="manifesto-label">You've Always Watched From the Outside</p>
        <h2 className="manifesto-title">
          The world's most extraordinary<br />assets were never meant for you.
        </h2>
        <div className="manifesto-divider" />
        <p className="manifesto-body">
          Blockbuster films. Museum-quality paintings. Boutique hotels. The rising artist about to
          sell out stadiums. The celebrity brand worth hundreds of millions. These were investments
          for the ultra-wealthy — the insiders who already had everything.
        </p>
        <p className="manifesto-body">
          We built the technology to change that. Every offering on Fraction Universe is an
          immersive 3D world you step inside — not a checkout page. You don't just buy a fraction
          of something extraordinary. You enter it. You own it. You feel it.
        </p>
        <div className="manifesto-stats">
          <div className="mstat">
            <span className="mstat-n">$0</span>
            <span className="mstat-l">Minimum to Explore</span>
          </div>
          <div className="mstat-sep" />
          <div className="mstat">
            <span className="mstat-n">3D</span>
            <span className="mstat-l">Every Experience</span>
          </div>
          <div className="mstat-sep" />
          <div className="mstat">
            <span className="mstat-n">All</span>
            <span className="mstat-l">Investors Welcome</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 2D: What you can own ─────────────────────────────────────────────────────
const ASSET_TYPES = [
  {
    icon: '◎',
    category: 'Film & Entertainment',
    headline: 'Own a piece of the next blockbuster.',
    body: 'Invest in feature films before they hit screens. Walk through the world, see the team, understand the deal — then own a fraction of the box office.',
    example: 'INDIGO — A film by Lucas Foster ($4B+ WW box office)',
    color: '#5548d4',
  },
  {
    icon: '◈',
    category: 'Fine Art & Collectibles',
    headline: 'Own what hangs in the museum.',
    body: 'Fractional ownership of museum-quality works, iconic collectibles, and cultural artifacts. Pieces most people can only photograph through glass.',
    example: 'William Shatner × Star Trek — iconic screen collectibles',
    color: '#c9a84c',
  },
  {
    icon: '⬡',
    category: 'Real Estate',
    headline: 'Own the hotel. The building. The view.',
    body: 'Fractional real estate across residential, commercial, and hospitality. Walk through the property in 3D before you invest a single dollar.',
    example: 'Boutique hotels, luxury residential, mixed-use developments',
    color: '#2d8a4e',
  },
  {
    icon: '◉',
    category: 'Artists & Musicians',
    headline: 'Back the next icon before the world knows their name.',
    body: 'Invest in recording artists, touring musicians, and cultural figures at the moment their trajectory is obvious — before it becomes expensive.',
    example: 'Rising artists, labels, touring IP, and streaming originals',
    color: '#8b2fc9',
  },
  {
    icon: '△',
    category: 'Celebrities & Brands',
    headline: 'Own a fraction of the brand everyone knows.',
    body: 'Celebrity ventures, personal brands, and cultural IP built on massive existing audiences. The kind of deal that used to require a private introduction.',
    example: 'Celebrity brands, licensing deals, and signature IP',
    color: '#c9a84c',
  },
  {
    icon: '✦',
    category: 'Space & Deep Tech',
    headline: 'Own the next frontier.',
    body: 'Aerospace, AI, clean energy, and biotech. The companies building the infrastructure of the next century — fractional, accessible, immersive.',
    example: 'Space Royalty — NASA × SpaceX orbital technology',
    color: '#0e7490',
  },
]

function WhatYouCanOwnSection() {
  return (
    <section className="section section-dark" id="worlds">
      <div className="section-inner">
        <p className="eyebrow">What You Can Own</p>
        <h2 className="section-h">Assets that were never available to you. Until now.</h2>
        <p className="section-sub">
          Every offering lives inside a fully immersive 3D world. You don't click through a PDF.
          You walk through the experience — the film set, the gallery, the property — then decide
          whether to own a fraction of it.
        </p>
        <div className="asset-grid">
          {ASSET_TYPES.map(a => (
            <div key={a.category} className="asset-card" style={{ '--wc': a.color } as CSSProperties}>
              <div className="asset-orb" />
              <span className="asset-icon">{a.icon}</span>
              <p className="asset-category">{a.category}</p>
              <h3 className="asset-headline">{a.headline}</h3>
              <p className="asset-body">{a.body}</p>
              <p className="asset-example">{a.example}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 2D: Proof — FractionKings ───────────────────────────────────────────────
function ProofSection() {
  return (
    <section className="section proof-section">
      <div className="section-inner proof-inner">
        <div className="proof-left">
          <p className="eyebrow">We Proved It First</p>
          <h2 className="section-h" style={{ marginBottom: '20px' }}>
            FractionKings.com —<br />the first world we built.
          </h2>
          <p className="proof-body">
            Before there was a universe, there was a castle. FractionKings.com was the first
            immersive 3D investment platform ever built — a medieval world that accredited
            investors could walk through to explore real offerings in film, fine art, and
            space technology.
          </p>
          <p className="proof-body">
            It worked. Now FractionKings lives inside Fraction Universe as The Kingdom —
            one world among five, the original. Reg D 506(c), accredited investors, no
            raise limit. The proof of concept for everything we're now opening to everyone.
          </p>
          <div className="proof-stats">
            <div className="pstat">
              <span className="pstat-n">$4B+</span>
              <span className="pstat-l">Producer box office</span>
            </div>
            <div className="pstat">
              <span className="pstat-n">3</span>
              <span className="pstat-l">Live offerings</span>
            </div>
            <div className="pstat">
              <span className="pstat-n">1st</span>
              <span className="pstat-l">Immersive 3D investment platform</span>
            </div>
          </div>
          <a href="https://fractionkings.com" className="proof-link" target="_blank" rel="noopener noreferrer">
            Visit FractionKings.com →
          </a>
        </div>
        <div className="proof-right">
          <div className="proof-castle-card">
            <div className="proof-castle-glow" />
            <p className="proof-castle-label">The Kingdom</p>
            <p className="proof-castle-sub">FractionKings.com</p>
            <div className="proof-castle-badges">
              <span className="proof-badge live">Live Now</span>
              <span className="proof-badge reg">Reg D 506(c)</span>
              <span className="proof-badge accredited">Accredited Only</span>
            </div>
            <p className="proof-castle-desc">
              Film · Fine Art · Space Technology
            </p>
            <p className="proof-castle-offerings">
              INDIGO · Space Royalty · William Shatner collectibles
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 2D: The experience ───────────────────────────────────────────────────────
function ExperienceSection() {
  const steps = [
    { n: '01', title: 'Enter the World', body: "You don't read a prospectus. You walk through a 3D environment built specifically for the offering — the film's world, the artist's stage, the property you're about to own a fraction of." },
    { n: '02', title: 'Understand What You Own', body: 'Every world shows you the team, the deal, the upside. You see the offering like an insider — not a footnote in a filing. Then you decide.' },
    { n: '03', title: 'Own Your Fraction', body: 'Invest at your level. Receive your units. Track your returns. Every asset you own lives in your personal universe — not a spreadsheet.' },
  ]
  return (
    <section className="section section-dark">
      <div className="section-inner">
        <p className="eyebrow">The Experience</p>
        <h2 className="section-h">You don't fill out a form. You enter a world.</h2>
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

// ─── 2D: Two doors ────────────────────────────────────────────────────────────
function TwoDoorsSection() {
  return (
    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Open to Everyone</p>
        <h2 className="section-h">One Universe. Two Doors.</h2>
        <p className="section-sub">
          Fraction Universe runs both Reg CF offerings open to the general public, and Reg D
          offerings for accredited investors — often on the same deal, at the same time.
        </p>
        <div className="paths-grid">
          <div className="path-card path-cf">
            <p className="path-label">Reg CF · Fraction Universe</p>
            <h3 className="path-title">Open to All</h3>
            <p className="path-desc">
              No accreditation required. Any US investor can own a fraction of a film, a piece of
              art, a property, or a rising artist. FINRA-regulated. Investment limits apply.
            </p>
            <ul className="path-list">
              <li>No accreditation required</li>
              <li>Up to $5M per offering per year</li>
              <li>Film, art, real estate, artists, celebrities, deep tech</li>
              <li>fractionuniverse.com — coming 2026</li>
            </ul>
          </div>
          <div className="path-card path-d">
            <p className="path-label">Reg D 506(c) · The Kingdom</p>
            <h3 className="path-title">Accredited Investors</h3>
            <p className="path-desc">
              Verified accredited investors access higher-minimum offerings inside FractionKings —
              the original world. Larger raises, deeper access, premium deal terms. Live now.
            </p>
            <ul className="path-list">
              <li>Accreditation verification required</li>
              <li>No raise limit</li>
              <li>fractionkings.com — live now</li>
              <li>Simultaneous raises with Fraction Universe offerings</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 2D: Build ───────────────────────────────────────────────────────────────
function BuildSection() {
  const cards = [
    { icon: '◈', title: 'Your Own 3D World', body: 'A purpose-built immersive experience around your film, property, artist, or brand. Not a template — a world. Investors step inside what they\'re investing in.' },
    { icon: '◎', title: 'AR & VR Compatible', body: 'Every world we build works on desktop, mobile, headset, and AR. Investors can literally walk through your project before committing capital.' },
    { icon: '◉', title: 'Compliance Built In', body: 'We handle the securities structure — Reg CF, Reg D, or simultaneous raises. The world is the offering. The compliance is already there.' },
    { icon: '⬡', title: 'Massive Audience Access', body: 'Fraction Universe brings your offering to an audience of everyday investors who want to own something extraordinary. Not just capital — community.' },
  ]
  return (
    <section className="section section-dark">
      <div className="section-inner">
        <p className="eyebrow">For Filmmakers, Artists & Developers</p>
        <h2 className="section-h">We build the world. You raise the capital.</h2>
        <p className="section-sub">
          If you have a film, a property, a brand, an artist, or anything people aspire to own
          a piece of — we build you a 3D world and put it in front of everyone.
          FractionKings.com is proof. You could be next.
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
            Apply to Open Your World →
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
        <h2 className="cta-h">The door is open.<br />Step through it.</h2>
        <p className="cta-sub">
          The Kingdom is live now. The Studio, The Estate, The Stage, and The Lab are opening.
          Get in early — and own a fraction of everything.
        </p>
        <div className="cta-btns">
          <a href="https://fractionkings.com" className="cta-primary" target="_blank" rel="noopener noreferrer">
            Enter The Kingdom →
          </a>
          <a href="https://fractionkings.com/contact" className="cta-secondary" target="_blank" rel="noopener noreferrer">
            Get Early Access
          </a>
        </div>
        <p className="cta-legal">
          Fraction Universe Inc. is building a FINRA-registered Reg CF crowdfunding portal.
          Reg CF offerings will be available to all US investors subject to individual investment limits.
          Reg D 506(c) offerings on FractionKings.com are limited to verified accredited investors.
          Investing involves risk, including loss of principal.
        </p>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="fu-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-wm">FRACTION UNIVERSE</span>
          <p className="footer-tag">Own a fraction of everything that matters.</p>
        </div>
        <div className="footer-links">
          <a href="https://fractionkings.com" target="_blank" rel="noopener noreferrer">The Kingdom</a>
          <a href="https://fractionkings.com/legal" target="_blank" rel="noopener noreferrer">Legal</a>
          <a href="https://fractionkings.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
          <a href="https://fractionkings.com/contact" target="_blank" rel="noopener noreferrer">Contact</a>
        </div>
        <p className="footer-copy">© 2026 Fraction Universe Inc. · fractionuniverse.com</p>
      </div>
    </footer>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null)
  const [scrolled, setScrolled]           = useState(false)

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

  return (
    <div className="universe-root">

      {/* Fixed 3D canvas */}
      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 3, 13], fov: 52 }}
          dpr={IS_MOBILE ? [1, 1] : [1, 1.5]}
          gl={{ antialias: !IS_MOBILE, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.4
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

        <nav className={`fu-nav${scrolled ? ' scrolled' : ''}`}>
          <span className="fu-wordmark">FRACTION UNIVERSE</span>
          <div className="nav-right">
            <a href="#worlds" className="nav-link">Worlds</a>
            <a href="https://fractionkings.com" className="nav-kingdom" target="_blank" rel="noopener noreferrer">
              The Kingdom ↗
            </a>
          </div>
        </nav>

        <AnimatePresence>
          {!selectedWorld && (
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <p className="hero-eyebrow">Immersive 3D Investment Platform</p>
              <h1 className="hero-title">You've always<br />watched. Now<br />you own it.</h1>
              <p className="hero-sub">
                Film. Art. Real estate. Artists. Celebrities.<br />
                In 3D worlds built for everyday investors.
              </p>
              <div className="hero-ctas">
                <a href="https://fractionkings.com" className="hero-btn-primary" target="_blank" rel="noopener noreferrer">
                  Enter The Kingdom →
                </a>
                <a href="#worlds" className="hero-btn-secondary">See What You Can Own ↓</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        <AnimatePresence>
          {selectedWorld && (
            <WorldPanel world={selectedWorld} onClose={handleClose} />
          )}
        </AnimatePresence>

      </div>

      {/* Scrollable 2D content */}
      <div className="scroll-content">
        <OpeningSection />
        <WhatYouCanOwnSection />
        <ProofSection />
        <ExperienceSection />
        <TwoDoorsSection />
        <BuildSection />
        <CTASection />
        <Footer />
      </div>

    </div>
  )
}
