export interface World {
  id: string
  name: string
  subtitle: string
  tagline: string
  regulation: string
  regLabel: string
  description: string
  features: string[]
  color: string
  emissiveColor: string
  ringColor?: string
  position: [number, number, number]
  scale: number
  hasRing: boolean
  status: 'LIVE' | 'COMING'
  href: string | null
}

export const WORLDS: World[] = [
  {
    id: 'kingdom',
    name: 'The Kingdom',
    subtitle: 'FractionKings.com',
    tagline: 'The original fractional kingdom — film, fine art, space technology.',
    regulation: 'Reg D 506(c)',
    regLabel: 'Accredited Investors',
    description:
      'Enter a 3D medieval castle and explore real investment offerings across film, fine art, and space technology. The Kingdom is the first world inside Fraction Universe — built for accredited investors who want more than a checkout page.',
    features: [
      'INDIGO — A film by Lucas Foster ($4B+ WW box office)',
      'Space Royalty — NASA × SpaceX orbital technology',
      'Fine Art — William Shatner × Star Trek collectibles',
      '3D castle experience with offering rooms',
    ],
    color: '#c9a84c',
    emissiveColor: '#7a5a18',
    ringColor: '#b89030',
    position: [0, 0, 0],
    scale: 1.5,
    hasRing: true,
    status: 'LIVE',
    href: 'https://fractionkings.com',
  },
  {
    id: 'studio',
    name: 'The Studio',
    subtitle: 'Film & Entertainment',
    tagline: 'Own a fraction of what moves the world.',
    regulation: 'Reg CF',
    regLabel: 'Open to All Investors',
    description:
      'The first Reg CF universe built for film and entertainment. Original screenplays, music, and cultural IP — anyone can own a piece of the story before it reaches the world.',
    features: [
      'Feature films & original screenplays',
      'Music releases & touring IP',
      'Streaming originals',
      'Live events & festivals',
    ],
    color: '#5548d4',
    emissiveColor: '#2a1a8a',
    position: [7.5, 2.2, -3.5],
    scale: 1.12,
    hasRing: false,
    status: 'COMING',
    href: null,
  },
  {
    id: 'estate',
    name: 'The Estate',
    subtitle: 'Real Estate',
    tagline: 'The land has always belonged to those who hold it.',
    regulation: 'Reg CF',
    regLabel: 'Open to All Investors',
    description:
      'Fractional real estate for everyone. Residential, commercial, hospitality — in a 3D property universe you can explore before you invest.',
    features: [
      'Residential & multi-family',
      'Commercial & mixed-use',
      'Hospitality & boutique hotels',
      'Development projects',
    ],
    color: '#2d8a4e',
    emissiveColor: '#0f4a22',
    position: [-7.5, -1.5, -2.5],
    scale: 1.08,
    hasRing: false,
    status: 'COMING',
    href: null,
  },
  {
    id: 'stage',
    name: 'The Stage',
    subtitle: 'Artists, Athletes & Culture',
    tagline: 'Back the artists before the world knows their name.',
    regulation: 'Reg CF',
    regLabel: 'Open to All Investors',
    description:
      'Invest in artists, musicians, athletes, and cultural icons. Your portfolio, your culture. The Stage is where community meets capital.',
    features: [
      'Recording artists & labels',
      'Athletes & sports IP',
      'Celebrity brands & ventures',
      'Cultural & fashion IP',
    ],
    color: '#8b2fc9',
    emissiveColor: '#4a1069',
    position: [4.5, -3.5, -5.5],
    scale: 1.0,
    hasRing: false,
    status: 'COMING',
    href: null,
  },
  {
    id: 'lab',
    name: 'The Lab',
    subtitle: 'Technology & Deep Science',
    tagline: 'The next frontier belongs to those who fund it.',
    regulation: 'Reg CF',
    regLabel: 'Open to All Investors',
    description:
      'Aerospace, AI, clean energy, biotech — the assets building the next century. The Lab puts you inside the facilities, not just the term sheet.',
    features: [
      'Aerospace & space technology',
      'Artificial intelligence',
      'Clean energy & climate tech',
      'Biotech & life sciences',
    ],
    color: '#0e7490',
    emissiveColor: '#053d4e',
    position: [-5, 3.5, -4.5],
    scale: 0.95,
    hasRing: false,
    status: 'COMING',
    href: null,
  },
]
