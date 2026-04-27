import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ViewInARButton } from '../components/ViewInARButton'

// ─── INDIGO palette ────────────────────────────────────────────────────────────
const INDIGO_COLOR  = '#8877dd'
const INDIGO_DARK   = '#1a0d2e'
const INDIGO_MID    = '#2d1a4e'
const INDIGO_GLOW   = '#6644cc'

// ─── Password gate ─────────────────────────────────────────────────────────────
const INDIGO_PW     = 'INDIGO2026'
const INDIGO_PW_KEY = 'fu_indigo_auth'

function IndigoPasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [val, setVal]     = useState('')
  const [err, setErr]     = useState(false)
  const [shake, setShake] = useState(false)

  const attempt = () => {
    if (val.trim().toUpperCase() === INDIGO_PW) {
      sessionStorage.setItem(INDIGO_PW_KEY, '1')
      onUnlock()
    } else {
      setErr(true); setShake(true)
      setTimeout(() => setShake(false), 500)
      setVal('')
    }
  }

  return (
    <div className="io-gate-root" style={{ background: INDIGO_DARK }}>
      {/* Star field */}
      <div className="io-gate-stars" aria-hidden>
        {Array.from({ length: 80 }, (_, i) => (
          <div key={i} className="io-gate-star" style={{
            left:  `${(i * 137.5) % 100}%`,
            top:   `${(i * 93.7)  % 100}%`,
            width: i % 9 === 0 ? 2 : 1,
            height: i % 9 === 0 ? 2 : 1,
            opacity: 0.15 + (i * 0.011) % 0.65,
          } as CSSProperties} />
        ))}
      </div>

      <motion.div
        className={`io-gate-box${shake ? ' io-shake' : ''}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="io-gate-planet" style={{
          background: `radial-gradient(circle at 33% 30%, #a090ee 0%, ${INDIGO_COLOR} 45%, #0d0820 100%)`,
          boxShadow: `0 0 40px ${INDIGO_COLOR}55`,
        }} />
        <p className="io-gate-wm">FRACTION UNIVERSE</p>
        <h2 className="io-gate-title">INDIGO</h2>
        <p className="io-gate-sub">Supernatural Thriller · Reg CF Offering</p>
        <p className="io-gate-label">This offering is currently in pre-launch. Enter your access code.</p>
        <input
          className={`io-gate-input${err ? ' io-gate-input-err' : ''}`}
          type="password"
          placeholder="Access code"
          value={val}
          autoFocus
          onChange={e => { setVal(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{ '--gc': INDIGO_COLOR } as CSSProperties}
        />
        {err && <p className="io-gate-err">Incorrect access code</p>}
        <button className="io-gate-btn" style={{ background: INDIGO_COLOR }} onClick={attempt}>
          Enter →
        </button>
        <p className="io-gate-note">
          This page is password-protected. Fraction Universe is in pre-launch. No investment can be
          made until FINRA funding portal registration is complete.
        </p>
      </motion.div>
    </div>
  )
}

// ─── The Void   canvas particle field ─────────────────────────────────────────
function IndigoVoidCanvas({ height = 320 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height

    // Particles
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; da: number; hue: number }
    const particles: P[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.14,
      r: 0.5 + Math.random() * 1.8,
      a: Math.random(), da: (Math.random() - 0.5) * 0.003,
      hue: 240 + Math.random() * 60,
    }))

    // Creatures   abstract drifting entities
    type C = { x: number; y: number; vx: number; vy: number; a: number; da: number; scale: number; type: number; rot: number; drot: number }
    const creatures: C[] = Array.from({ length: 5 }, (_, i) => ({
      x: (i + 0.5) * (W / 5), y: H * 0.3 + Math.random() * H * 0.4,
      vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.06,
      a: 0, da: 0.0008 + Math.random() * 0.0006,
      scale: 0.6 + Math.random() * 0.6,
      type: i % 3,
      rot: Math.random() * Math.PI * 2,
      drot: (Math.random() - 0.5) * 0.002,
    }))

    // Consciousness wave
    let wavePhase = 0

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      // Deep void gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#04010f')
      bg.addColorStop(0.5, '#080318')
      bg.addColorStop(1, '#04010f')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Consciousness sine wave   the brain-wave flatline that isn't
      ctx.save()
      ctx.beginPath()
      for (let x = 0; x < W; x++) {
        const amp = 8 + 6 * Math.sin(wavePhase * 0.7 + x * 0.03)
        const y = H * 0.5 + Math.sin(x * 0.018 + wavePhase) * amp + Math.sin(x * 0.044 + wavePhase * 1.3) * (amp * 0.4)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      const wGrad = ctx.createLinearGradient(0, 0, W, 0)
      wGrad.addColorStop(0,   'rgba(136,119,221,0)')
      wGrad.addColorStop(0.15,'rgba(136,119,221,0.35)')
      wGrad.addColorStop(0.5, 'rgba(180,160,255,0.55)')
      wGrad.addColorStop(0.85,'rgba(136,119,221,0.35)')
      wGrad.addColorStop(1,   'rgba(136,119,221,0)')
      ctx.strokeStyle = wGrad
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.restore()

      wavePhase += 0.012

      // Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.a += p.da
        if (p.a > 0.75) p.da = -Math.abs(p.da)
        if (p.a < 0.02) p.da =  Math.abs(p.da)
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},70%,75%,${p.a * 0.5})`
        ctx.fill()
      }

      // Creatures
      for (const c of creatures) {
        c.x += c.vx; c.y += c.vy; c.rot += c.drot
        c.a += c.da
        const maxA = 0.12
        if (c.a > maxA) c.da = -Math.abs(c.da)
        if (c.a < 0)    { c.da = Math.abs(c.da); c.x = Math.random() * W; c.y = H * 0.2 + Math.random() * H * 0.6 }
        if (c.x < -80) c.x = W + 80; if (c.x > W + 80) c.x = -80
        if (c.y < -80) c.y = H + 80; if (c.y > H + 80) c.y = -80

        ctx.save()
        ctx.translate(c.x, c.y)
        ctx.rotate(c.rot)
        ctx.scale(c.scale, c.scale)
        ctx.globalAlpha = c.a

        const col = `rgba(160,140,255,1)`
        ctx.strokeStyle = col
        ctx.lineWidth = 0.8
        ctx.fillStyle = 'rgba(100,80,200,0.08)'

        if (c.type === 0) {
          // The Remnant   fragmented shards
          ctx.beginPath()
          ctx.moveTo(0, -40); ctx.lineTo(14, -10); ctx.lineTo(30, -20); ctx.lineTo(22, 10)
          ctx.lineTo(40, 30); ctx.lineTo(8, 20); ctx.lineTo(0, 45); ctx.lineTo(-8, 20)
          ctx.lineTo(-40, 30); ctx.lineTo(-22, 10); ctx.lineTo(-30, -20); ctx.lineTo(-14, -10)
          ctx.closePath(); ctx.fill(); ctx.stroke()
          // Fracture lines
          ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(5, 0); ctx.moveTo(0, -40); ctx.lineTo(-5, 0)
          ctx.stroke()
        } else if (c.type === 1) {
          // The Keeper   tall elongated form with too many limbs
          ctx.beginPath()
          ctx.ellipse(0, -20, 8, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
          // Body
          ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(0, 38); ctx.stroke()
          // Limbs   pairs at wrong angles
          const limbs = [[-5, 8, -28, -8], [5, 8, 28, -8], [-4, 16, -32, 26], [4, 16, 32, 26],
                         [-3, 24, -20, 40], [3, 24, 20, 40], [-5, 30, -35, 18], [5, 30, 35, 18]]
          for (const [x1,y1,x2,y2] of limbs) {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
          }
          // Eyes (two too many)
          for (let e = -3; e <= 3; e += 2) {
            ctx.beginPath(); ctx.arc(e, -22, 1.5, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(200,180,255,0.8)'; ctx.fill()
          }
        } else {
          // The Mirror   perfect human silhouette, hollow inside
          ctx.beginPath()
          // Head
          ctx.arc(0, -34, 10, 0, Math.PI * 2)
          ctx.fill(); ctx.stroke()
          // Body
          ctx.beginPath()
          ctx.moveTo(-12, -24); ctx.lineTo(-16, 10); ctx.lineTo(-10, 40)
          ctx.lineTo(-4, 40); ctx.lineTo(0, 20); ctx.lineTo(4, 40)
          ctx.lineTo(10, 40); ctx.lineTo(16, 10); ctx.lineTo(12, -24)
          ctx.closePath(); ctx.fill(); ctx.stroke()
          // Arms
          ctx.beginPath()
          ctx.moveTo(-12, -18); ctx.lineTo(-38, 2)
          ctx.moveTo(12, -18);  ctx.lineTo(38, 2)
          ctx.stroke()
          // The hollow   what makes it wrong
          ctx.globalAlpha = c.a * 0.8
          ctx.fillStyle = '#04010f'
          ctx.beginPath()
          ctx.arc(0, -34, 5, 0, Math.PI * 2); ctx.fill()
          ctx.beginPath()
          ctx.moveTo(-7, -20); ctx.lineTo(-9, 8); ctx.lineTo(-2, 8); ctx.lineTo(0, -5)
          ctx.lineTo(2, 8); ctx.lineTo(9, 8); ctx.lineTo(7, -20); ctx.closePath(); ctx.fill()
        }
        ctx.restore()
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)
    const cleanup = draw()
    return () => { window.removeEventListener('resize', resize); cleanup?.() }
  }, [draw, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, display: 'block', borderRadius: '12px', opacity: 0.92 }}
      aria-hidden
    />
  )
}

// ─── Sensory deprivation pod SVG ───────────────────────────────────────────────
function IndigoPod({ color = '#8877dd' }: { color?: string }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 400, height: 'auto', filter: `drop-shadow(0 0 18px ${color}44)` }}>
      {/* Pod outer shell */}
      <ellipse cx="160" cy="100" rx="148" ry="78" stroke={color} strokeWidth="1.5" fill={`${color}08`} />
      {/* Inner chamber */}
      <ellipse cx="160" cy="100" rx="132" ry="64" stroke={`${color}55`} strokeWidth="1" fill={`${color}04`} />
      {/* Water surface */}
      <path d="M 32 108 Q 80 102 130 108 Q 180 114 230 108 Q 265 104 288 108" stroke={`${color}66`} strokeWidth="1.2" fill="none" />
      {/* Salt water depth */}
      <ellipse cx="160" cy="130" rx="130" ry="38" fill={`${color}12`} />
      {/* Floating figure */}
      {/* Head */}
      <circle cx="160" cy="96" r="9" fill={`${color}30`} stroke={`${color}88`} strokeWidth="0.8" />
      {/* Body */}
      <ellipse cx="160" cy="115" rx="18" ry="8" fill={`${color}20`} stroke={`${color}66`} strokeWidth="0.8" />
      {/* Arms */}
      <path d="M 142 112 L 118 118 M 178 112 L 202 118" stroke={`${color}55`} strokeWidth="0.8" />
      {/* Legs */}
      <path d="M 148 122 L 140 138 M 172 122 L 180 138" stroke={`${color}55`} strokeWidth="0.8" />
      {/* Electrode sensors */}
      <circle cx="155" cy="92" r="1.5" fill={color} opacity="0.7" />
      <circle cx="165" cy="92" r="1.5" fill={color} opacity="0.7" />
      <circle cx="160" cy="90" r="1.5" fill={color} opacity="0.7" />
      {/* EEG lines from head */}
      <path d="M 155 92 L 80 78 M 165 92 L 240 78 M 160 90 L 160 60"
        stroke={`${color}44`} strokeWidth="0.6" strokeDasharray="3 3" />
      {/* Monitors left */}
      <rect x="22" y="70" width="24" height="16" rx="2" fill={`${color}15`} stroke={`${color}44`} strokeWidth="0.8" />
      <path d="M 24 80 L 28 76 L 32 80 L 36 74 L 40 78 L 44 76" stroke={color} strokeWidth="0.8" fill="none" />
      {/* Monitors right */}
      <rect x="274" y="70" width="24" height="16" rx="2" fill={`${color}15`} stroke={`${color}44`} strokeWidth="0.8" />
      <path d="M 276 80 L 280 74 L 284 80 L 288 76 L 292 80 L 296 76" stroke={color} strokeWidth="0.8" fill="none" />
      {/* Hatch/entry seam */}
      <path d="M 120 24 Q 160 18 200 24" stroke={`${color}66`} strokeWidth="1" strokeDasharray="4 3" fill="none" />
      {/* Depth sensor */}
      <line x1="160" y1="152" x2="160" y2="165" stroke={`${color}33`} strokeWidth="0.6" />
      <text x="160" y="174" textAnchor="middle" fill={`${color}55`} fontSize="7" fontFamily="monospace">12" EPSOM SALT SOLUTION</text>
      {/* Glow at head   the moment of crossing */}
      <circle cx="160" cy="96" r="22" fill="none" stroke={`${color}22`} strokeWidth="8" />
      <circle cx="160" cy="96" r="32" fill="none" stroke={`${color}10`} strokeWidth="12" />
    </svg>
  )
}

// ─── The In-Between   creatures and lore ──────────────────────────────────────
const IN_BETWEEN_ENTITIES = [
  {
    name: 'The Purgs',
    glyph: (c: string) => (
      <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
        {/* Frost-covered figure, slumped, looping */}
        <ellipse cx="40" cy="18" rx="7" ry="8" fill="none" stroke={c} strokeWidth="1.2" opacity="0.7" />
        <line x1="40" y1="26" x2="40" y2="56" stroke={c} strokeWidth="1.2" opacity="0.6" />
        <line x1="40" y1="34" x2="28" y2="44" stroke={c} strokeWidth="1" opacity="0.5" />
        <line x1="40" y1="34" x2="52" y2="44" stroke={c} strokeWidth="1" opacity="0.5" />
        <line x1="40" y1="56" x2="34" y2="70" stroke={c} strokeWidth="1" opacity="0.5" />
        <line x1="40" y1="56" x2="46" y2="70" stroke={c} strokeWidth="1" opacity="0.5" />
        {/* Frost crystals */}
        {[[22,30],[58,30],[18,50],[62,50],[25,64],[55,64]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill={c} opacity="0.35" />
        ))}
        {/* Loop arrow   the memory repeating */}
        <path d="M 14 40 Q 10 20 30 14" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5" strokeDasharray="3 2" />
        <polygon points="30,10 28,17 35,16" fill={c} opacity="0.5" />
      </svg>
    ),
    tagline: 'They didn\'t take their door. Now they can\'t find it.',
    body: 'Souls who refused or missed their door, now lost in Indigo. Frost-covered, mumbling the last loop of their living memory on repeat. They are drawn to the energy of lifelines. They are not malicious. They are desperate. And there are thousands of them.',
  },
  {
    name: 'The Door',
    glyph: (c: string) => (
      <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
        {/* Monolithic door frame */}
        <rect x="20" y="8" width="40" height="64" rx="2" fill="none" stroke={c} strokeWidth="1.5" opacity="0.9" />
        {/* Blue glow at edges */}
        <rect x="20" y="8" width="40" height="64" rx="2" fill="none" stroke="#4466ff" strokeWidth="3" opacity="0.25" />
        {/* The void inside   deep space darkness */}
        <rect x="22" y="10" width="36" height="60" rx="1" fill="#04010f" />
        {/* Stars inside the void */}
        {[[30,20],[45,25],[35,40],[50,35],[28,55],[42,60],[38,30],[55,50]].map(([sx,sy],i) => (
          <circle key={i} cx={sx} cy={sy} r="0.8" fill="#8899ff" opacity={0.3 + i * 0.05} />
        ))}
        {/* Ripple on door face */}
        <ellipse cx="40" cy="40" rx="14" ry="22" fill="none" stroke={c} strokeWidth="0.6" opacity="0.3" />
        <ellipse cx="40" cy="40" rx="8" ry="13" fill="none" stroke={c} strokeWidth="0.5" opacity="0.2" />
      </svg>
    ),
    tagline: 'Around its edges: blue light. Inside: a darkness that could be deep space.',
    body: 'A monolithic black door. It appears behind you. Your reflection ripples in its surface. It does not wait. It calls. Every minute you spend in Indigo makes the door more visible. The door is already claiming you.',
  },
  {
    name: 'The Mirror',
    glyph: (c: string) => (
      <svg viewBox="0 0 80 80" style={{ width: 64, height: 64 }}>
        <circle cx="40" cy="16" r="9" fill="none" stroke={c} strokeWidth="1.2" opacity="0.8" />
        <path d="M28,25 L24,52 L30,68 L36,68 L40,54 L44,68 L50,68 L56,52 L52,25 Z" fill="none" stroke={c} strokeWidth="1.2" opacity="0.8" />
        <line x1="28" y1="32" x2="8" y2="44" stroke={c} strokeWidth="1" opacity="0.7" />
        <line x1="52" y1="32" x2="72" y2="44" stroke={c} strokeWidth="1" opacity="0.7" />
        {/* The hollow */}
        <circle cx="40" cy="16" r="4" fill="#04010f" stroke="none" />
        <path d="M32,30 L34,46 L38,46 L40,36 L42,46 L46,46 L48,30 Z" fill="#04010f" />
      </svg>
    ),
    tagline: 'It knows everything about you. Then it comes back wearing your face.',
    body: 'The central question of INDIGO: Sarah enters the pod at 11:04 PM. Her EEG flatlines. Not death. Not sleep. Something the monitors have no category for. She resurfaces at 12:03 AM knowing the name of every person who has ever died in that facility. She was never told. When Sarah comes back through the door, is she the one who went in?',
  },
]

// ─── Section tab navigation ────────────────────────────────────────────────────
const TABS = ['Overview', 'The Film', 'The In-Between', 'Team', 'Deal Terms', 'Use of Proceeds', 'Risk Factors', 'Disclosures']

// ─── Main offering page ────────────────────────────────────────────────────────
export function IndigoOffering({ onBack }: { onBack: () => void }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(INDIGO_PW_KEY) === '1'
  )
  const [tab, setTab] = useState(0)
  const [riskOpen, setRiskOpen] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab])

  if (!unlocked) return <IndigoPasswordGate onUnlock={() => setUnlocked(true)} />

  return (
    <div className="io-root" style={{ '--ic': INDIGO_COLOR, '--id': INDIGO_DARK, '--im': INDIGO_MID, '--ig': INDIGO_GLOW } as CSSProperties}>

      {/* Starfield */}
      <div className="io-stars" aria-hidden>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className="io-star" style={{
            left: `${(i * 137.5) % 100}%`, top: `${(i * 93.7) % 100}%`,
            width: i % 9 === 0 ? 2 : 1, height: i % 9 === 0 ? 2 : 1,
            opacity: 0.1 + (i * 0.012) % 0.5,
          } as CSSProperties} />
        ))}
      </div>

      {/* Top bar */}
      <div className="io-topbar">
        <button className="io-back" onClick={onBack}>← Fraction Universe</button>
        <span className="io-topbar-wm">FRACTION UNIVERSE</span>
        <span className="io-draft-badge">DRAFT · PRE-LAUNCH</span>
      </div>

      {/* Hero */}
      <div className="io-hero">
        <motion.div className="io-hero-inner"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="io-eyebrow">Featured Offering · Film · Reg CF</p>
          <h1 className="io-hero-title">INDIGO</h1>
          <p className="io-hero-logline">"He died for sixteen minutes. She never came back. He found a way in."</p>
          <p className="io-hero-genre">Supernatural Thriller · Drama</p>
          <div className="io-hero-meta">
            <div className="io-hero-stat">
              <span className="io-stat-n" style={{ color: INDIGO_COLOR }}>$5M</span>
              <span className="io-stat-l">Indicative Reg CF Target</span>
            </div>
            <div className="io-stat-div" />
            <div className="io-hero-stat">
              <span className="io-stat-n" style={{ color: INDIGO_COLOR }}>Open to All</span>
              <span className="io-stat-l">No accreditation required</span>
            </div>
            <div className="io-stat-div" />
            <div className="io-hero-stat">
              <span className="io-stat-n" style={{ color: INDIGO_COLOR }}>$4B+</span>
              <span className="io-stat-l">Producer box office</span>
            </div>
          </div>
          <div className="io-hero-badges">
            <span className="io-badge">ANVL Entertainment</span>
            <span className="io-badge">Fraction Kings Capital Partner</span>
            <span className="io-badge">Reg CF · Phase 4</span>
            <span className="io-badge io-badge-draft">DRAFT · Not Yet Live</span>
          </div>
          <ViewInARButton
            glbUrl="/worlds/indigo-planet.glb"
            usdzUrl="/worlds/indigo-planet.usdz"
            color={INDIGO_COLOR}
            label="View INDIGO World in AR"
            style={{ marginTop: 8 }}
          />
        </motion.div>

        {/* Planet */}
        <div className="io-hero-planet-wrap">
          <div className="io-hero-haze" style={{ animation: 'io-pulse 4s ease-in-out infinite' }} />
          <motion.div className="io-hero-planet"
            animate={{ boxShadow: [
              `0 0 60px ${INDIGO_COLOR}55, 0 0 120px ${INDIGO_COLOR}18`,
              `0 0 90px ${INDIGO_COLOR}88, 0 0 180px ${INDIGO_COLOR}33`,
              `0 0 60px ${INDIGO_COLOR}55, 0 0 120px ${INDIGO_COLOR}18`,
            ] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: `radial-gradient(circle at 33% 28%, #b8a8f0 0%, ${INDIGO_COLOR} 42%, #0d0820 100%)`,
            }} />
          <div className="io-hero-ring" />
        </div>
      </div>

      {/* Pre-launch notice */}
      <div className="io-prelim-notice">
        <span className="io-prelim-icon">⚠</span>
        <p>
          <strong>Pre-Launch Notice:</strong> INDIGO's Reg CF community tranche has not yet launched. Fraction Universe Inc. is currently completing FINRA funding portal registration required to conduct Reg CF offerings. All figures, terms, and deal structure on this page are indicative and subject to change. No investment can be made at this time. This page is for pre-launch awareness and interest registration only.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="io-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`io-tab${tab === i ? ' active' : ''}`}
            style={tab === i ? { color: INDIGO_COLOR, borderBottomColor: INDIGO_COLOR } : undefined}
            onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="io-content">
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}>

            {/* ── OVERVIEW ── */}
            {tab === 0 && (
              <div className="io-section">
                <h2 className="io-section-h">What is INDIGO?</h2>
                <p className="io-section-body">
                  INDIGO is an original supernatural thriller screenplay produced by ANVL Entertainment, the production company led by Lucas Foster, one of Hollywood's most accomplished independent producers with over $4 billion in worldwide box office across 50+ feature films.
                </p>
                <p className="io-section-body">
                  Written by Alex Torres, INDIGO is an original vision: a man who died and came back, a woman who didn't, and a door between them. A supernatural thriller with the scope of a wide-release theatrical film and the intimacy of a story about what grief does to the people left behind.
                </p>
                <p className="io-section-body">
                  The offering is structured in phases. Phase 1 (Reg D 506(c), Packaging, $2M, accredited investors only) is live at FractionKings.com. Phase 4, the Reg CF Community Tranche, is what this page describes: up to $5,000,000 open to all US investors, once Fraction Universe's FINRA funding portal registration is complete.
                </p>

                <div className="io-structure-card">
                  <p className="io-structure-title">Capital Structure Summary</p>
                  <div className="io-structure-rows">
                    {[
                      { phase: 'Phase 1 · Packaging',    reg: 'Reg D 506(c)', amount: '$2M',   who: 'Accredited only',     where: 'FractionKings.com',   status: 'OPEN' },
                      { phase: 'Phase 2 · Production',   reg: 'Reg D 506(c)', amount: '$20M',  who: 'Accredited only',     where: 'FractionKings.com',   status: 'PENDING PHASE 1' },
                      { phase: 'Phase 4 · Community',    reg: 'Reg CF',       amount: '$5M',   who: 'Open to all US',      where: 'FractionUniverse.com', status: 'PRE-LAUNCH' },
                    ].map(r => (
                      <div key={r.phase} className="io-struct-row">
                        <div className="io-struct-phase">{r.phase}</div>
                        <div className="io-struct-detail">
                          <span className="io-struct-reg">{r.reg}</span>
                          <span className="io-struct-amount" style={{ color: INDIGO_COLOR }}>{r.amount}</span>
                          <span className="io-struct-who">{r.who}</span>
                          <span className="io-struct-where">{r.where}</span>
                          <span className={`io-struct-status io-struct-status--${r.status === 'OPEN' ? 'open' : 'pending'}`}>{r.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="io-reg-cf-explainer">
                  <p className="io-reg-cf-title">What is Regulation Crowdfunding (Reg CF)?</p>
                  <p className="io-reg-cf-body">
                    Reg CF, established under Title III of the JOBS Act (15 U.S.C. § 77d-1) and implemented by SEC rules at 17 CFR Part 227, allows companies to raise up to $5,000,000 in a 12-month period from both accredited and non-accredited investors through a FINRA-registered funding portal. Investors are subject to annual investment limits based on their income and net worth. Securities purchased under Reg CF are subject to a 12-month resale restriction.
                  </p>
                </div>
              </div>
            )}

            {/* ── THE FILM ── */}
            {tab === 1 && (
              <div className="io-section">
                <h2 className="io-section-h">The Film</h2>

                <div className="io-film-hero">
                  <div className="io-film-planet-sm" style={{
                    background: `radial-gradient(circle at 33% 28%, #b8a8f0 0%, ${INDIGO_COLOR} 42%, #0d0820 100%)`,
                    boxShadow: `0 0 40px ${INDIGO_COLOR}55`,
                  }} />
                  <div className="io-film-copy">
                    <p className="io-film-logline-lrg">"He died for sixteen minutes. She never came back. He found a way in."</p>
                    <p className="io-film-genre-tag">Supernatural Thriller · Drama · Original Screenplay by Lucas Foster</p>
                    <p className="io-section-body">
                      Jonas Marker is twenty-two. MIT-bound. The night he proposes to Sarah Hudson, a car runs a red light on a mountain road. He dies for sixteen minutes, the longest documented legal death on record. He comes back. She doesn't. What Jonas can't accept is that while he was dead, he was somewhere. A world of perpetual twilight lit by a deep indigo hue. He saw Sarah there. He watched her door open. He has been trying to get back ever since.
                    </p>
                    <p className="io-section-body">
                      Dr. Nicholas Nyborg finds him in the hospital. Ex-CIA. Project Farsight. Dying of cancer. He runs a private clinic for people who died and came back: a re-purposed seminary, sensory deprivation pods, a community of NDE survivors. He also needs to get back in. The pods are the mechanism. And every minute you spend in Indigo makes the door more visible.
                    </p>
                    <p className="io-section-body" style={{ fontStyle: 'italic', color: 'rgba(200,210,255,0.65)' }}>
                      This is Lucas Foster's original screenplay. The film he chose to make after $4B at the worldwide box office. INDIGO is the first film by a producer of his calibre structured for retail investors under Reg CF. That is not a marketing line. It is a fact.
                    </p>
                  </div>
                </div>

                <div className="io-film-credits">
                  <p className="io-film-credits-label">From the producer of</p>
                  <div className="io-film-credits-list">
                    {['Bad Boys', 'Crimson Tide', 'The Mask of Zorro', 'Enemy of the State', 'Man on Fire',
                      'Mr. & Mrs. Smith', 'Ford v Ferrari', 'Morbius'].map(f => (
                      <span key={f} className="io-film-credit-item">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="io-film-phases">
                  <div className="io-phase-card">
                    <span className="io-phase-n">Phase 1</span>
                    <p className="io-phase-title">Packaging</p>
                    <p className="io-phase-body">Director engagement, lead cast attachment, sales agent, packaging materials. Foundation of the project's market value.</p>
                    <span className="io-phase-status open">Live · FractionKings.com</span>
                  </div>
                  <div className="io-phase-card">
                    <span className="io-phase-n">Phase 2</span>
                    <p className="io-phase-title">Production</p>
                    <p className="io-phase-body">Principal photography, VFX, post-production, deliverables, insurance, contingency. The full $20M production budget.</p>
                    <span className="io-phase-status pending">Pending Phase 1</span>
                  </div>
                  <div className="io-phase-card" style={{ borderColor: `${INDIGO_COLOR}55` }}>
                    <span className="io-phase-n" style={{ color: INDIGO_COLOR }}>Phase 4</span>
                    <p className="io-phase-title">Community (You Are Here)</p>
                    <p className="io-phase-body">Reg CF open to all US investors. Up to $5M. The community tranche, the part of INDIGO the public can own.</p>
                    <span className="io-phase-status pre">Pre-Launch · FractionUniverse.com</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── THE IN-BETWEEN ── */}
            {tab === 2 && (
              <div className="io-section">
                <h2 className="io-section-h">The In-Between</h2>
                <p className="io-section-body" style={{ fontStyle: 'italic', color: `${INDIGO_COLOR}cc`, fontSize: 17, lineHeight: 1.7 }}>
                  "A sensory deprivation pod. A procedure that clinics already offer. And a woman who comes back from the other side with knowledge no living person should have."
                </p>

                {/* The void canvas */}
                <div style={{ margin: '28px 0', borderRadius: 12, overflow: 'hidden', border: `1px solid ${INDIGO_COLOR}22` }}>
                  <IndigoVoidCanvas height={280} />
                  <div style={{ background: '#04010f', padding: '10px 16px', borderTop: `1px solid ${INDIGO_COLOR}18` }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${INDIGO_COLOR}55`, margin: 0, textAlign: 'center' }}>
                      The In-Between · Rendered in real time · Each visit is unique
                    </p>
                  </div>
                </div>

                {/* The science */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                  <div style={{ background: `${INDIGO_COLOR}08`, border: `1px solid ${INDIGO_COLOR}22`, borderRadius: 10, padding: '20px 18px' }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${INDIGO_COLOR}66`, marginBottom: 10 }}>The Science</p>
                    <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(210,220,255,0.75)', margin: 0 }}>
                      Flotation REST (Restricted Environmental Stimulation Therapy) removes all external sensory input. No light. No sound. No gravity. The brain, deprived of external signal, turns inward, and in some subjects, further. Clinical studies at Laureate Institute for Brain Research document measurable altered states. INDIGO begins with the question: what if the altered state isn't inside the brain at all?
                    </p>
                  </div>
                  <div style={{ background: `${INDIGO_COLOR}08`, border: `1px solid ${INDIGO_COLOR}22`, borderRadius: 10, padding: '20px 18px' }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${INDIGO_COLOR}66`, marginBottom: 10 }}>The Breach</p>
                    <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(210,220,255,0.75)', margin: 0 }}>
                      Sarah enters the pod at 11:04 PM. Her EEG flatlines at 11:47   not death, not sleep, something the monitors have no category for. She resurfaces at 12:03 AM. She knows the name of every person who has died in that facility. She has never been told. The facility doesn't know she knows. The film begins here.
                    </p>
                  </div>
                </div>

                {/* The chamber */}
                <div style={{ background: '#04010f', border: `1px solid ${INDIGO_COLOR}22`, borderRadius: 12, padding: 28, marginBottom: 28, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${INDIGO_COLOR}55`, marginBottom: 20 }}>The Chamber · Model SP-7 Flotation Unit</p>
                  <IndigoPod color={INDIGO_COLOR} />
                  <p style={{ fontSize: 11, color: `${INDIGO_COLOR}44`, marginTop: 14, fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                    800LBS EPSOM SALT SOLUTION · 93.5°F BODY TEMPERATURE · 90 MIN SESSION · COMPLETE SENSORY ISOLATION
                  </p>
                </div>

                {/* Entities */}
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${INDIGO_COLOR}55`, marginBottom: 16 }}>
                  Entities of the In-Between
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
                  {IN_BETWEEN_ENTITIES.map((entity) => (
                    <motion.div key={entity.name}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                      whileHover={{ borderColor: `${INDIGO_COLOR}55`, boxShadow: `0 0 24px ${INDIGO_COLOR}18` }}
                      style={{ background: `${INDIGO_COLOR}06`, border: `1px solid ${INDIGO_COLOR}22`, borderRadius: 10, padding: '22px 20px', cursor: 'default' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                        <div style={{ flexShrink: 0, filter: `drop-shadow(0 0 8px ${INDIGO_COLOR}55)` }}>
                          {entity.glyph(INDIGO_COLOR)}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(220,215,255,0.92)', margin: '0 0 4px', letterSpacing: '0.04em' }}>{entity.name}</p>
                          <p style={{ fontSize: 11, color: `${INDIGO_COLOR}88`, margin: 0, fontStyle: 'italic' }}>{entity.tagline}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(190,200,240,0.65)', margin: 0 }}>{entity.body}</p>
                    </motion.div>
                  ))}
                </div>

                {/* The franchise hook */}
                <div style={{ background: `linear-gradient(135deg, ${INDIGO_COLOR}12, transparent)`, border: `1px solid ${INDIGO_COLOR}33`, borderRadius: 10, padding: '22px 24px' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${INDIGO_COLOR}66`, marginBottom: 10 }}>The World</p>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(220,225,255,0.8)', margin: 0 }}>
                    INDIGO is not a closed story. The in-between is a place with geography, rules, and history. Sarah's crossing is the first documented breach. The film ends with the question of whether it can be closed, or whether opening it changed everything permanently. The world is already built. The franchise is already here.
                  </p>
                </div>
              </div>
            )}

            {/* ── TEAM ── */}
            {tab === 3 && (
              <div className="io-section">

                {/* Lucas Foster   full cinematic hero card */}
                <motion.div className="io-lucas-hero"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="io-lucas-img-wrap">
                    <img src="/lucas-foster.webp" alt="Lucas Foster, Producer, ANVL Entertainment" className="io-lucas-img" />
                    <div className="io-lucas-img-vignette" />
                    <div className="io-lucas-img-glow" style={{ background: `radial-gradient(ellipse at 50% 100%, ${INDIGO_COLOR}33 0%, transparent 65%)` }} />
                  </div>
                  <div className="io-lucas-body">
                    <p className="io-lucas-eyebrow">Producer · ANVL Entertainment</p>
                    <h2 className="io-lucas-name">Lucas Foster</h2>
                    <div className="io-lucas-stats">
                      <div className="io-lstat">
                        <span className="io-lstat-n" style={{ color: INDIGO_COLOR }}>$4B+</span>
                        <span className="io-lstat-l">Worldwide Box Office</span>
                      </div>
                      <div className="io-lstat-div" />
                      <div className="io-lstat">
                        <span className="io-lstat-n" style={{ color: INDIGO_COLOR }}>50+</span>
                        <span className="io-lstat-l">Feature Films</span>
                      </div>
                      <div className="io-lstat-div" />
                      <div className="io-lstat">
                        <span className="io-lstat-n" style={{ color: INDIGO_COLOR }}>Princeton</span>
                        <span className="io-lstat-l">Applied Physics</span>
                      </div>
                    </div>
                    <p className="io-lucas-bio">
                      Lucas Foster has produced, executive produced, or supervised more than 50 feature films. Films he has managed have grossed more than <strong>four billion dollars</strong> in worldwide sales. He attended Princeton University (applied physics) and UCLA (film studies), founded Warp Film at Columbia Pictures in 1996, and is a partner at ANVL Entertainment in Malibu, California.
                    </p>
                    <p className="io-lucas-bio" style={{ color: 'rgba(200,212,255,0.6)', fontStyle: 'italic', marginTop: 12 }}>
                      INDIGO is his original screenplay. For the first time, through Reg CF, a filmmaker with this track record is offering retail investors the chance to participate before the studio deal, before the cast, before the poster. This opportunity has not existed before at this price point. That is not marketing. That is the structure.
                    </p>
                    <div className="io-lucas-films">
                      <p className="io-lucas-films-label">Filmography includes</p>
                      <div className="io-lucas-films-list">
                        {['Bad Boys', 'Crimson Tide', 'The Mask of Zorro', 'Enemy of the State',
                          'Man on Fire', 'Mr. & Mrs. Smith', 'Ford v Ferrari', 'Morbius'].map(f => (
                          <span key={f} className="io-lucas-film-chip">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Supporting team */}
                <div className="io-support-team">
                  {[
                    {
                      initials: 'AT',
                      name: 'Alex Torres',
                      role: 'Screenwriter · INDIGO',
                      bio: 'Alex Torres wrote the original screenplay for INDIGO. His script constructs the In-Between with logical rigor: a sensory deprivation pod, a monitored flatline, a woman who returns knowing things she was never told. He does not rely on mythology or spectacle. He trusts the premise and follows it to its most extreme human conclusion. INDIGO is his first collaboration with Lucas Foster and ANVL Entertainment.',
                      note: null,
                    },
                    {
                      initials: 'BL',
                      name: 'Brian LaRoda',
                      role: 'Executive Producer · ANVL / WARP / PATH',
                      bio: 'Thirty-five years in the music and entertainment industry. Manager of Stevie Wonder. Worked with Michael Jackson, Lionel Richie, and Quincy Jones on We Are the World. Chairman of the LaRoda Group. Currently Executive Producing NBC\'s eight-part miniseries FREEDOM RUN.',
                      note: null,
                    },
                    {
                      initials: 'GF',
                      name: 'Gus Fernandez',
                      role: 'Executive, Sponsorship & Commercial · ANVL',
                      bio: 'ANVL\'s designated representative for sponsorship and commercial partnerships on INDIGO.',
                      note: 'Full bio to be confirmed by ANVL Entertainment before offering launch.',
                    },
                  ].map((m, i) => (
                    <motion.div key={m.name} className="io-support-card"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                      <div className="io-support-avatar" style={{ background: `linear-gradient(135deg, ${INDIGO_COLOR}22, ${INDIGO_COLOR}08)`, borderColor: `${INDIGO_COLOR}33` }}>
                        <span style={{ color: INDIGO_COLOR }}>{m.initials}</span>
                      </div>
                      <div className="io-support-info">
                        <p className="io-support-name">{m.name}</p>
                        <p className="io-support-role">{m.role}</p>
                        <p className="io-support-bio">{m.bio}</p>
                        {m.note && <p className="io-support-note">{m.note}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="io-mou-note">
                  <span className="io-mou-dot" style={{ background: INDIGO_COLOR }} />
                  ANVL Entertainment × Fraction Kings MOU signed April 23, 2026. Definitive agreement and PPM pending securities counsel review.
                </div>

                {/* TODO: Replace /lucas-foster.webp with licensed or ANVL-provided image before public launch */}
              </div>
            )}

            {/* ── DEAL TERMS ── */}
            {tab === 4 && (
              <div className="io-section">
                <div className="io-draft-banner">
                  <strong>DRAFT</strong>   All terms are preliminary and subject to change pending securities counsel review and FINRA funding portal registration.
                </div>
                <h2 className="io-section-h">Reg CF Community Tranche · Deal Terms</h2>
                <p className="io-section-body">
                  The following represents indicative terms for the INDIGO Reg CF community offering on Fraction Universe. No terms are final. No investment can be made at this time.
                </p>

                <div className="io-terms-grid">
                  {[
                    { label: 'Regulation',             val: 'Regulation Crowdfunding (Reg CF), 17 CFR Part 227' },
                    { label: 'Offering Status',        val: 'Pre-Launch, portal registration pending' },
                    { label: 'Indicative Maximum',     val: '$5,000,000' },
                    { label: 'Securities Offered',     val: 'Community Units (class and exact terms TBD by counsel)' },
                    { label: 'Price Per Unit',         val: 'TBD (indicative: $5.00/unit subject to counsel review)' },
                    { label: 'Minimum Investment',     val: 'TBD ($100–$500 indicative range)' },
                    { label: 'Eligibility',            val: 'All US investors subject to Reg CF investment limits' },
                    { label: 'Portal',                 val: 'Fraction Universe Inc. (FINRA registration pending)' },
                    { label: 'Issuer',                 val: 'TBD LLC, to be formed by ANVL counsel (WY or DE)' },
                    { label: 'PPM Date',               val: 'TBD, pending definitive agreement and counsel review' },
                    { label: 'Transfer Restrictions',  val: '12-month resale restriction per Reg CF Rule 501' },
                  ].map(r => (
                    <div key={r.label} className="io-term-row">
                      <span className="io-term-label">{r.label}</span>
                      <span className="io-term-val">{r.val}</span>
                    </div>
                  ))}
                </div>

                <h3 className="io-sub-h">Investment Limits (Reg CF)</h3>
                <p className="io-section-body">
                  Under 17 CFR § 227.100(a)(2), the amount any individual investor may invest in all Reg CF offerings in a 12-month period is limited as follows:
                </p>
                <div className="io-invest-limits">
                  <div className="io-limit-card">
                    <p className="io-limit-title">Annual income or net worth below $124,000</p>
                    <p className="io-limit-rule">May invest the greater of $2,500 or 5% of the lesser of annual income or net worth</p>
                  </div>
                  <div className="io-limit-card">
                    <p className="io-limit-title">Annual income and net worth both ≥ $124,000</p>
                    <p className="io-limit-rule">May invest up to 10% of the lesser of annual income or net worth, not to exceed $124,000 in aggregate</p>
                  </div>
                </div>

                <h3 className="io-sub-h">Revenue Waterfall (Indicative)</h3>
                <p className="io-section-body io-small">All waterfall terms are preliminary. Subject to counsel review and definitive LLC operating agreement.</p>
                <div className="io-waterfall">
                  {[
                    { tier: '1', label: 'First, pari passu, cumulative basis', items: ['75% Class A Units, until distributions equal full purchase price', '25% Talent Pool, deferred fixed compensation and guild payments'] },
                    { tier: '2', label: 'Second', items: ['100% Talent Pool Contractual Deferred Fixed Compensation (if any remains unpaid)'] },
                    { tier: '3', label: 'Third', items: ['100% Class B Unit holders, operating costs capped at 13% of project budget in aggregate'] },
                    { tier: '4', label: 'Fourth, continuing, pari passu', items: ['37.5% Class A Units', '37.5% Class B Units', '25% Talent Pool Profit Participants (up to 25%; overage borne pro rata by A and B)'] },
                  ].map(w => (
                    <div key={w.tier} className="io-waterfall-tier">
                      <div className="io-waterfall-tier-header">
                        <span className="io-waterfall-n" style={{ background: `${INDIGO_COLOR}22`, color: INDIGO_COLOR }}>{w.tier}</span>
                        <span className="io-waterfall-label">{w.label}</span>
                      </div>
                      {w.items.map(item => (
                        <div key={item} className="io-waterfall-item">
                          <span style={{ color: INDIGO_COLOR }}>◈</span> {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <h3 className="io-sub-h">Distribution Schedule (Indicative)</h3>
                <div className="io-dist-grid">
                  <div className="io-dist-card"><p className="io-dist-period">Years 1–2</p><p className="io-dist-val">Quarterly, within 60 days of quarter-end (post initial public release)</p></div>
                  <div className="io-dist-card"><p className="io-dist-period">Years 3–4</p><p className="io-dist-val">Bi-annually, within 90 days of 6-month period end</p></div>
                  <div className="io-dist-card"><p className="io-dist-period">Year 5+</p><p className="io-dist-val">Annually, within 90 days of 12-month period end, in perpetuity</p></div>
                </div>
              </div>
            )}

            {/* ── USE OF PROCEEDS ── */}
            {tab === 5 && (
              <div className="io-section">
                <div className="io-draft-banner">
                  <strong>DRAFT</strong>   Proceeds allocation is indicative and subject to final PPM and counsel review.
                </div>
                <h2 className="io-section-h">Use of Proceeds</h2>
                <p className="io-section-body">
                  The following illustrates how INDIGO's Reg CF community tranche proceeds would be allocated, subject to finalization of the full $22M capital stack and the terms of the definitive offering agreement.
                </p>

                <h3 className="io-sub-h">Phase 1   Packaging ($2M indicative)</h3>
                {[
                  { cat: 'Director engagement & attachment',             amt: '$400,000' },
                  { cat: 'Lead cast attachment fees & holds',             amt: '$800,000' },
                  { cat: 'Sales agent engagement',                        amt: '$150,000' },
                  { cat: 'Packaging materials (deck, lookbook, sizzle)',   amt: '$200,000' },
                  { cat: 'Securities counsel & legal',                     amt: '$250,000' },
                  { cat: 'Fraction Kings capital formation services',       amt: '$150,000' },
                  { cat: 'Contingency',                                    amt: '$50,000' },
                ].map(r => (
                  <div key={r.cat} className="io-proceeds-row">
                    <span className="io-proceeds-cat">{r.cat}</span>
                    <span className="io-proceeds-amt" style={{ color: INDIGO_COLOR }}>{r.amt}</span>
                  </div>
                ))}

                <h3 className="io-sub-h" style={{ marginTop: '32px' }}>Phase 2   Production ($20M indicative)</h3>
                <p className="io-section-body io-small">Phase 2 breakdown is indicative. Final amounts subject to production budget, tax credits, pre-sales, and financing.</p>
                {[
                  { cat: 'Above-the-line (cast, director, producer fees)',            amt: '$4,500,000' },
                  { cat: 'Below-the-line (crew, locations, equipment)',               amt: '$8,000,000' },
                  { cat: 'Post-production (edit, VFX, sound, color, music)',          amt: '$3,500,000' },
                  { cat: 'Insurance, finance, bond, deliverables',                    amt: '$2,000,000' },
                  { cat: 'Contingency (10%)',                                          amt: '$2,000,000' },
                ].map(r => (
                  <div key={r.cat} className="io-proceeds-row io-proceeds-row--p2">
                    <span className="io-proceeds-cat">{r.cat}</span>
                    <span className="io-proceeds-amt" style={{ color: `${INDIGO_COLOR}88` }}>{r.amt}</span>
                  </div>
                ))}

                <p className="io-proceeds-note">
                  The Reg CF community tranche ($5M indicative) would be applied toward Phase 2 production costs alongside Phase 1 packaging equity, senior debt/gap financing, tax credits, and international pre-sales. The exact priority and application of proceeds will be specified in the final PPM.
                </p>
              </div>
            )}

            {/* ── RISK FACTORS ── */}
            {tab === 6 && (
              <div className="io-section">
                <div className="io-draft-banner">
                  <strong>Risk Factors</strong>   Investing in early-stage film securities involves substantial risk. You should carefully consider all risk factors before investing.
                </div>
                <h2 className="io-section-h">Risk Factors</h2>
                <p className="io-section-body">
                  The following risk factors are not exhaustive. They are derived from the INDIGO offering's structural template and are subject to revision in the final PPM. <strong>You may lose your entire investment.</strong>
                </p>

                {[
                  {
                    cat: 'Company Risks',
                    risks: [
                      'Newly formed entity with no operating history',
                      'Reliance on Manager for all management decisions',
                      'Reliance on services of Lucas Foster, Keri Nakamoto, and additional senior producers',
                      'Limited liability protections and potential capital call considerations',
                      'Potential dilution from future interests issued at Manager\'s discretion',
                      'Not subject to Sarbanes-Oxley financial controls',
                      'No audited financial statements at time of offering',
                      'No assurance of tax distributions to investors',
                    ],
                  },
                  {
                    cat: 'Project / Industry Risks',
                    risks: [
                      'Sole asset is an interest in the INDIGO project',
                      'Lack of portfolio diversification, single project exposure',
                      'No investor approval of day-to-day production decisions',
                      'Uncertain terms for loan facilities, distribution, and production agreements',
                      'No guaranteed distributions at any time',
                      'Class A Units are subordinate to senior loan facilities',
                      'Dependence on securing domestic and international distribution',
                      'Distributor rights to certain payments before equity recoupment',
                      'Commercial success depends on unpredictable audience response',
                      'Competition for theatrical distribution and audience attention',
                      'International distribution risks including foreign law, currency, censorship, and political instability',
                      'Piracy of distributed content',
                      'Rapidly changing technology and consumer entertainment behavior',
                      'Potential intellectual property infringement claims',
                      'Risk of budget overruns',
                      'Strike or union job actions affecting production timeline',
                      'Government regulation changes affecting content or distribution',
                      'Commercial success is not certain and past box office is not indicative of this project\'s performance',
                    ],
                  },
                  {
                    cat: 'Securities Risks',
                    risks: [
                      'General investment risk: you may lose your entire principal',
                      'Significant restrictions on transferability of units for 12 months (Reg CF Rule 501)',
                      'Price per unit not established by independent valuation, set by the issuer',
                      'This is a private offering, not reviewed or approved by any state or federal agency except as noted',
                      'Must comply with Reg CF exemption requirements, non-compliance would require registration or return of funds',
                      'All financial projections are speculative, actual results may differ materially',
                      'No guarantee of return on investment',
                      'Securities are equity, junior to all indebtedness of the company',
                      'No assurance of a liquidity event or opportunity to exit your investment',
                    ],
                  },
                ].map((group, gi) => (
                  <div key={gi} className="io-risk-group">
                    <p className="io-risk-cat">{group.cat}</p>
                    {group.risks.map((r, ri) => {
                      const key = gi * 100 + ri
                      return (
                        <div key={ri} className="io-risk-item"
                          onClick={() => setRiskOpen(riskOpen === key ? null : key)}>
                          <span style={{ color: INDIGO_COLOR }}>▸</span>
                          <span>{r}</span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* ── DISCLOSURES ── */}
            {tab === 7 && (
              <div className="io-section">
                <h2 className="io-section-h">Full Regulatory Disclosures</h2>

                <div className="io-disc-block">
                  <p className="io-disc-title">Pre-Launch Status & No Investment</p>
                  <p className="io-disc-body">
                    This page is a pre-launch informational presentation only. Fraction Universe Inc. has not yet completed FINRA funding portal registration required to conduct securities offerings under Regulation Crowdfunding. No investment can be accepted, solicited, or committed at this time. Nothing on this page constitutes an offer to sell or a solicitation of an offer to buy securities.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">Regulation Crowdfunding</p>
                  <p className="io-disc-body">
                    The INDIGO Reg CF community tranche, when launched, will be conducted pursuant to Section 4(a)(6) of the Securities Act of 1933, as amended (15 U.S.C. § 77d(a)(6)), as added by Title III of the Jumpstart Our Business Startups Act of 2012 (JOBS Act), Pub. L. No. 112-106, 126 Stat. 306, and the implementing rules of the U.S. Securities and Exchange Commission (SEC) codified at 17 CFR Part 227 (Regulation Crowdfunding).
                  </p>
                  <p className="io-disc-body">
                    Issuers conducting Reg CF offerings must file required forms with the SEC (Form C for the offering, Form C-U for updates, Form C-AR for annual reports) and provide ongoing disclosure to investors. Offerings must be conducted exclusively through FINRA-registered funding portals or registered broker-dealers.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">FINRA Funding Portal Registration</p>
                  <p className="io-disc-body">
                    Fraction Universe Inc. intends to register as a funding portal with FINRA pursuant to Section 4A(a) of the Securities Act and Rule 400 under Regulation Crowdfunding (17 CFR § 227.400). Until registration is complete and FINRA membership is granted, Fraction Universe cannot lawfully facilitate securities offerings under Reg CF. Investors will be notified when registration is complete and the offering goes live.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">Investment Limits (17 CFR § 227.100)</p>
                  <p className="io-disc-body">
                    Reg CF imposes investment limits on all investors. In any 12-month period, an investor may not invest more than the greatest of: (a) $2,500; (b) 5% of the lesser of annual income or net worth, if both annual income and net worth are below $124,000; or (c) 10% of the lesser of annual income or net worth, not to exceed $124,000, if either annual income or net worth is equal to or more than $124,000. These limits apply in aggregate across all Reg CF offerings in the same 12-month period.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">Transfer Restrictions</p>
                  <p className="io-disc-body">
                    Securities acquired in a Reg CF offering cannot be resold for a period of one year from the date of purchase, except in certain limited circumstances: (i) transfer to the issuer; (ii) transfer to an accredited investor; (iii) transfer as part of a registered offering; (iv) transfer to a family member or in connection with certain personal events. See 17 CFR § 227.501 for full details.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">Risk of Loss</p>
                  <p className="io-disc-body">
                    Investing in INDIGO or any film project involves substantial risk of loss, including the risk of losing your entire investment. Film production is speculative by nature. Box office performance, distribution availability, and market conditions are unpredictable. The production of the film may be delayed, abandoned, or materially altered. Past performance of the producer's prior projects is not indicative of future results for this offering.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">Draft Status</p>
                  <p className="io-disc-body">
                    All deal terms, figures, percentages, and structures presented on this page are in DRAFT status as of April 2026 and are subject to revision pending: (a) final review and approval by ANVL Entertainment and its counsel; (b) execution of a definitive offering agreement; (c) completion of the Private Placement Memorandum (PPM) by qualified securities counsel; and (d) FINRA review. The figures presented here are for informational purposes only and may change materially.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">No Investment Advice</p>
                  <p className="io-disc-body">
                    Nothing on this page constitutes investment, legal, tax, or financial advice. Fraction Universe does not provide investment advice. Investors should consult their own legal, tax, and financial advisors before making any investment decision. This page does not take into account any individual investor's particular circumstances, objectives, financial situation, or needs.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">Forward-Looking Statements</p>
                  <p className="io-disc-body">
                    This page contains forward-looking statements, including projections about the film's production timeline, distribution, financial returns, and market performance. All forward-looking statements involve risks and uncertainties. Actual results may differ materially from those anticipated in the forward-looking statements. Fraction Universe and ANVL Entertainment undertake no obligation to publicly update or revise any forward-looking statements.
                  </p>
                </div>

                <div className="io-disc-block">
                  <p className="io-disc-title">State Securities Laws</p>
                  <p className="io-disc-body">
                    Reg CF offerings are subject to applicable federal and state securities laws. Certain states may impose additional requirements or restrictions. Investors are responsible for understanding their state's securities laws before investing. In some states, additional filings or registrations may be required before the offering can be made available to residents of that state.
                  </p>
                </div>

                <div className="io-final-disc">
                  <p>
                    <strong>Fraction Universe Inc.</strong> · Pre-Launch · FINRA Funding Portal Registration Pending ·
                    © 2026 Fraction Universe Inc. All rights reserved. INDIGO is a trademark of ANVL Entertainment.
                    All financial figures are preliminary and subject to change. This is not an offer to sell or solicitation to buy securities.
                    Securities offered through Fraction Universe when registered with FINRA as a funding portal.
                  </p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interest registration CTA */}
      <div className="io-interest-bar" style={{ borderTopColor: `${INDIGO_COLOR}33` }}>
        <div className="io-interest-inner">
          <div>
            <p className="io-interest-title">Register Your Interest in INDIGO</p>
            <p className="io-interest-sub">We'll notify you when the Reg CF offering goes live. No commitment. No investment accepted until FINRA registration is complete.</p>
          </div>
          <a
            href="mailto:tyler@fractionuniverse.com?subject=INDIGO%20Reg%20CF%20Interest&body=I'm%20interested%20in%20the%20INDIGO%20Reg%20CF%20offering%20on%20Fraction%20Universe."
            className="io-interest-btn"
            style={{ background: INDIGO_COLOR }}
          >
            Register Interest →
          </a>
        </div>
      </div>

    </div>
  )
}
