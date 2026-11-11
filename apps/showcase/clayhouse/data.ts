// Clayhouse is a made-up studio. Every person, piece and price here is invented.

export const images = {
  hero: require('./assets/hero.jpg'),
  kiln: require('./assets/kiln.jpg'),
  celadon: require('./assets/glaze-celadon.jpg'),
  tenmoku: require('./assets/glaze-tenmoku.jpg'),
  shino: require('./assets/glaze-shino.jpg'),
  wheel: require('./assets/wheel.jpg'),
  testTiles: require('./assets/test-tiles.jpg'),
  pickupShelf: require('./assets/pickup-shelf.jpg'),
  glazeBuckets: require('./assets/glaze-buckets.jpg'),
} as const;

export type ImageKey = keyof typeof images;

export const MEMBER = {
  name: 'Mara Lind',
  initials: 'ML',
  since: 2022,
  number: '0427',
  bio: 'Functional stoneware, mostly bowls.',
};

/** Mara's pieces on the shelves of tonight's firing. */
export const PIECES: { id: string; name: string; glaze: string; spot: string; image: ImageKey }[] =
  [
    {
      id: 'bowl',
      name: 'Rice bowl',
      glaze: 'Ash Celadon',
      spot: 'Shelf 2 · back',
      image: 'celadon',
    },
    {
      id: 'cup',
      name: 'Tall cup',
      glaze: 'Temmoku Rust',
      spot: 'Shelf 3 · left',
      image: 'tenmoku',
    },
    {
      id: 'plate',
      name: 'Side plate',
      glaze: 'Carbon Shino',
      spot: 'Shelf 1 · front',
      image: 'shino',
    },
  ];

export type GlazeFamily = 'celadon' | 'iron' | 'shino';

export interface Glaze {
  id: string;
  name: string;
  family: GlazeFamily;
  image: ImageKey;
  cone: string;
  atmosphere: string;
  price: string;
  note: string;
  /** Percent of the bucket left. */
  stock: number;
}

export const GLAZES: Glaze[] = [
  {
    id: 'ash-celadon',
    name: 'Ash Celadon',
    family: 'celadon',
    image: 'celadon',
    cone: 'Cone 10',
    atmosphere: 'Reduction',
    price: '$18',
    note: 'Pools jade in carved lines and crazes beautifully on porcelain.',
    stock: 72,
  },
  {
    id: 'temmoku-rust',
    name: 'Temmoku Rust',
    family: 'iron',
    image: 'tenmoku',
    cone: 'Cone 10',
    atmosphere: 'Reduction',
    price: '$16',
    note: 'Glossy iron black that breaks to persimmon on rims and edges.',
    stock: 34,
  },
  {
    id: 'carbon-shino',
    name: 'Carbon Shino',
    family: 'shino',
    image: 'shino',
    cone: 'Cone 10',
    atmosphere: 'Early reduction',
    price: '$21',
    note: 'Creamy white with carbon-trap flashes. Apply thick and fire slow.',
    stock: 12,
  },
];

export type Tone = 'primary' | 'accent' | 'muted';

export const STUDIO_BOARD: {
  id: string;
  initials: string;
  author: string;
  tone: Tone;
  message: string;
  time: string;
  image?: ImageKey;
}[] = [
  {
    id: 'unload',
    initials: 'JN',
    author: 'Jun',
    tone: 'primary',
    message: 'Unloaded Kiln 1. 42 bisque pieces are on the pickup shelf, rack B.',
    time: '12m',
    image: 'pickupShelf',
  },
  {
    id: 'test-tile',
    initials: 'AO',
    author: 'Ada',
    tone: 'accent',
    message: 'Ash Celadon over iron slip came out of the last firing. Top row is worth a look.',
    time: '1h',
    image: 'testTiles',
  },
  {
    id: 'reclaim',
    initials: 'RK',
    author: 'Rui',
    tone: 'muted',
    message: 'Reclaim day is Saturday. Bring your trimmings; the pugmill runs from 10 until noon.',
    time: '3h',
  },
];

export type FiringKind = 'bisque' | 'glaze' | 'raku';

export const FIRING_LOG: {
  id: string;
  kind: FiringKind;
  title: string;
  detail: string;
  when: string;
}[] = [
  {
    id: 'tonight',
    kind: 'glaze',
    title: 'Glaze · cone 10 reduction',
    detail: 'Kiln 2 · 64 pieces · loaded by Mara',
    when: 'Tonight',
  },
  {
    id: 'monday',
    kind: 'bisque',
    title: 'Bisque · cone 04',
    detail: 'Kiln 1 · 42 pieces · unloaded',
    when: 'Mon',
  },
  {
    id: 'saturday',
    kind: 'raku',
    title: 'Raku · outdoor',
    detail: 'Yard kiln · 18 pieces · smoke reduction',
    when: 'Sat',
  },
  {
    id: 'last-week',
    kind: 'glaze',
    title: 'Glaze · cone 6 oxidation',
    detail: 'Kiln 1 · 51 pieces · 2 cracked',
    when: 'Last Thu',
  },
];

/** The planned ramp as [hour, °C] points: what the firing curve draws behind the live climb. */
export const FIRING_PLAN: readonly (readonly [number, number])[] = [
  [0, 20],
  [1.5, 100],
  [5, 600],
  [8, 1010],
  [10.5, 1200],
  [12, 1285],
  [12.5, 1285],
];

/** A cone 10 reduction schedule. Each stage begins at `from` °C. */
export const FIRING_STAGES = [
  { key: 'candle', label: 'Candling', detail: 'Drive off water below boiling', from: 0 },
  { key: 'climb', label: 'Climb', detail: '150°C an hour to body reduction', from: 600 },
  { key: 'reduce', label: 'Body reduction', detail: 'Damper in at 1,010°C', from: 1010 },
  { key: 'peak', label: 'Final climb', detail: 'Light reduction to cone 10', from: 1200 },
  { key: 'soak', label: 'Soak', detail: 'Hold 15 minutes at cone 10', from: 1285 },
] as const;

export const FIRING_START = 1090;
export const FIRING_PEAK = 1285;

/** Witness cones and the temperature each one bends at. */
export const WITNESS_CONES = [
  { label: '09', bendsAt: 1260 },
  { label: '10', bendsAt: 1285 },
  { label: '11', bendsAt: 1300 },
];

/** What's open at the studio this week; each one books through the same sheet. */
export const FEATURED_SESSION = {
  title: 'Wheel 3',
  when: 'Friday · 9 – 12',
  image: 'wheel' as ImageKey,
};

export const SESSIONS: {
  id: string;
  title: string;
  when: string;
  icon: 'moon' | 'droplet';
  tint: 'primary' | 'accent';
}[] = [
  { id: 'open', title: 'Open studio', when: 'Tonight · 6 – 10', icon: 'moon', tint: 'primary' },
  { id: 'glaze', title: 'Glaze day', when: 'Saturday · 10 – 4', icon: 'droplet', tint: 'accent' },
];
