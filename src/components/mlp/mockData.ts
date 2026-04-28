// LoreVault MLP — mock data for the lovable minimum
// Shaped to match the live Atlas API contract once it lands. Until then,
// every page reads from this file. Replace this module's exports with API
// calls when the Atlas spec is wired in.

import type {
  Card,
  Pane,
  PaneId,
  SetProgress,
  Drop,
  Listing,
  Challenge,
  Tier,
  ConflictEvent,
  CollectorProfile,
} from './types';
import { PANE_COLORS } from './tokens';

// ─── Panes ───────────────────────────────────────────────────────────────────

export const PANES: Record<PaneId, Pane> = {
  'lud-border': {
    id: 'lud-border',
    displayName: 'Lud-Border',
    axiom: 'The border between the towns and Faerie is a permeable civic boundary, and contraband fruit crosses it nightly.',
    register: 'Mirrlees-civic',
    color: PANE_COLORS['lud-border'].accent,
    contraband: 'fairy fruit',
    thirdHourFear: 'that the orchard wall has thinned again',
    verbForToDie: 'to take the long road',
  },
  'old-ones-persist': {
    id: 'old-ones-persist',
    displayName: 'Old-Ones-Persist',
    axiom: 'The elder gods never left; they are only sleeping at depths the calendar has agreed to forget.',
    register: 'Marlon-James-warping',
    color: PANE_COLORS['old-ones-persist'].accent,
    contraband: 'the names that wake them',
    thirdHourFear: 'that the dreaming has begun to look back',
    verbForToDie: 'to be remembered against',
  },
  'sinterklaas-reigns': {
    id: 'sinterklaas-reigns',
    displayName: 'Sinterklaas-Reigns',
    axiom: 'A judging saint walks the rooftops with a black-cloaked companion, and the ledger of every household is open to him.',
    register: 'Clarke-footnoted',
    color: PANE_COLORS['sinterklaas-reigns'].accent,
    contraband: 'the unanswered letter',
    thirdHourFear: 'the sound of boots on the chimney',
    verbForToDie: 'to be left out of the book',
  },
};

export const PANE_LIST: Pane[] = Object.values(PANES);

// ─── Cards ───────────────────────────────────────────────────────────────────

export const MOCK_CARDS: Card[] = [
  {
    id: 'lud-001',
    name: 'Master Nathaniel Chanticleer',
    pane: 'lud-border',
    paneDisplayName: 'Lud-Border',
    flavorLine: 'He kept the Mayor\'s ledger straight for thirty years and dreamed of fruit only on Tuesdays.',
    silhouetteUrl: null,
    rarity: 'rare',
    serial: 47,
    editionSize: 800,
    contrabandRelation: 'refuses',
    setId: 'lud-starter',
    scars: [],
    iceberg: {
      surface: [
        'A civic functionary in Lud who guards the law of the towns.',
        'His son ate a fairy fruit and now will not speak of it.',
      ],
      echo: 'Every refusal is a remembering of what was once carried.',
      deep: [
        'The mayoralty of Lud was founded on a treaty no one alive can read.',
        'The first contraband fruit arrived inside a customs box marked "stationery."',
        'Chanticleer\'s ledger has a page numbered between 47 and 48.',
        'His refusal IS the door — the longer he holds the office, the more permeable the border becomes.',
        'The fairy fruit ages him backwards, one Tuesday at a time.',
        'His son\'s silence is itself a fruit, ripened in the mouth.',
        'The Mayor\'s seal is identical to a seal used in Faerie three centuries ago.',
        'Lud was always Faerie. The towns were the heresy.',
      ],
    },
    lampblack: {
      gesture: 'pressing the seal to the ledger as if to keep something inside',
      cosmologicalRelation: 'standing exactly on the border, refusing to acknowledge that he stands on it',
      wound: 'his son\'s silence',
      forbiddenAct: 'opening the customs box',
      role: 'civic functionary',
      silhouette: 'a thin man bent over a desk, lamp at his right',
      prop: 'a brass seal',
    },
  },
  {
    id: 'lud-002',
    name: 'The Customs Box',
    pane: 'lud-border',
    paneDisplayName: 'Lud-Border',
    flavorLine: 'Marked stationery on the manifest. Heavier than stationery has any right to be.',
    silhouetteUrl: null,
    rarity: 'contraband',
    serial: 12,
    editionSize: 99,
    contrabandRelation: 'carries',
    setId: 'lud-starter',
    scars: [{ conflictId: 'conflict-0', conflictName: 'Conflict 0: The Transit', outcome: 'won' }],
    iceberg: {
      surface: [
        'A wooden crate from the customs warehouse.',
        'It hums softly when no one is looking at it.',
      ],
      echo: 'The box is not the contraband; the box is the way the contraband travels.',
      deep: [
        'It was built by a Lud carpenter to specifications dictated by a man no one remembers.',
        'Each fruit inside is wrapped in a page from Lud\'s lost civic record.',
        'The box has appeared on three customs manifests across two centuries — same serial, same weight.',
        'When opened by the wrong hand, the fruit turns to ash; by the right hand, to honey.',
        'The carpenter\'s name is on the lid, hand-burned, but only visible when the lamp is shielded.',
        'Lud\'s ban on the fruit was written by someone who had eaten one.',
        'The box was the model for the seal of the Mayor.',
        'A second box exists. It has been on a customs manifest in Old-Ones-Persist for ninety years.',
      ],
    },
    lampblack: {
      gesture: 'a crate sitting still on a counter, refusing to be inspected',
      cosmologicalRelation: 'the literal vehicle of cross-Pane traffic',
      wound: 'the manifest entry that does not match its weight',
      forbiddenAct: 'opening it',
      role: 'object',
      silhouette: 'a low rectangle, lamplit',
      prop: 'iron banding',
    },
  },
  {
    id: 'lud-003',
    name: 'A Page Numbered Forty-Seven and a Half',
    pane: 'lud-border',
    paneDisplayName: 'Lud-Border',
    flavorLine: 'It is bound between forty-seven and forty-eight, and the ink on it is wet to the touch even in winter.',
    silhouetteUrl: null,
    rarity: 'legendary',
    serial: 9,
    editionSize: 200,
    contrabandRelation: 'mediates',
    setId: 'lud-starter',
    scars: [],
    iceberg: {
      surface: [
        'A page in the Mayor\'s ledger that exists between two consecutive numbered pages.',
        'It does not appear in the index but is always present when the ledger is opened.',
      ],
      echo: 'The half-page is where Lud and Faerie meet on the same paper.',
      deep: [
        'The page is wet with an ink that does not stain the surrounding pages.',
        'Reading it sideways reveals a different entry than reading it upright.',
        'The Mayor\'s seal on the page is reversed — a mirror seal.',
        'The page predates the founding of Lud by an undisclosed measure.',
        'Three generations of mayors have refused to amend it.',
        'The page lists the names of every household that has eaten the contraband fruit.',
        'A torn corner is in a customs box in a different Pane.',
        'When Lud falls — if it falls — this page will be the last to burn.',
      ],
    },
    lampblack: {
      gesture: 'a page lying flat, ink wet, neither read nor closed',
      cosmologicalRelation: 'the page is the membrane through which Faerie writes itself into Lud\'s civic record',
      wound: 'the wet ink',
      forbiddenAct: 'amending it',
      role: 'object',
      silhouette: 'a single page mid-ledger',
      prop: 'a fountain pen, dry',
    },
  },
  {
    id: 'oop-001',
    name: 'Father Erasmus Vey',
    pane: 'old-ones-persist',
    paneDisplayName: 'Old-Ones-Persist',
    flavorLine: 'He preached a sermon from the pulpit; the congregation woke remembering a different prayer.',
    silhouetteUrl: null,
    rarity: 'rare',
    serial: 113,
    editionSize: 600,
    contrabandRelation: 'mediates',
    setId: 'oop-starter',
    scars: [],
    iceberg: {
      surface: [
        'A coastal-town priest in a Pane where the sea remembers.',
        'His Sunday sermons end on a different word than they began.',
      ],
      echo: 'The Old Ones do not speak; they pronounce changes in what is said about them.',
      deep: [
        'The sermon-words are recorded in the parish register; the recorded words shift between rereadings.',
        'Vey\'s wedding ring belonged to a priest dead two centuries who spoke the same names.',
        'The fishermen avoid his confessional after a haul.',
        'A sermon from 1893 is the only one with the same first and last word in the register.',
        'The bishop has never visited, and writes only in November.',
        'Vey dreams the names of his next sermon and forgets them upon waking.',
        'The town\'s contraband — the names that wake them — is whispered through Vey without his consent.',
        'When Vey dies, his successor will preach the same shift, in the same direction.',
      ],
    },
    lampblack: {
      gesture: 'pronouncing a benediction whose words have already changed',
      cosmologicalRelation: 'the priest is the transcription error that lets the elder gods speak',
      wound: 'his ring',
      forbiddenAct: 'naming what wakes',
      role: 'mediator',
      silhouette: 'a tall figure at a pulpit, hands folded',
      prop: 'a worn breviary',
    },
  },
  {
    id: 'oop-002',
    name: 'The Litany at Low Tide',
    pane: 'old-ones-persist',
    paneDisplayName: 'Old-Ones-Persist',
    flavorLine: 'When the water draws back, the litany rises through the wet stones.',
    silhouetteUrl: null,
    rarity: 'legendary',
    serial: 7,
    editionSize: 250,
    contrabandRelation: 'exposes',
    setId: 'oop-starter',
    scars: [],
    iceberg: {
      surface: [
        'A coastal ritual whispered when the tide pulls farthest out.',
        'The fishermen mouth it without sound.',
      ],
      echo: 'A litany is what the dreaming Pane does when no one is watching.',
      deep: [
        'It is recited only on the days when the harbor goes silent before the gulls.',
        'The names in it correspond to no living person, but every line is a household name two villages over.',
        'Father Vey will not say it.',
        'Reciting it backwards causes the speaker to forget the litany permanently.',
        'It pre-dates the parish; one line is in a language the priest does not recognize.',
        'The first recorded recitation is in a ship\'s log lost in 1718.',
        'When the litany is over, the tide returns slightly higher than before.',
        'A child in Lud once mouthed it without ever having heard it.',
      ],
    },
    lampblack: {
      gesture: 'mouthing words at the wet stone, eyes downcast',
      cosmologicalRelation: 'the litany makes the buried weight of the Pane speak through the throat of the speaker',
      wound: 'the tide that always returns higher',
      forbiddenAct: 'reciting it backwards',
      role: 'ritual',
      silhouette: 'figures bent at the waterline',
      prop: 'wet stones',
    },
  },
  {
    id: 'oop-003',
    name: 'The Bishop\'s November Letter',
    pane: 'old-ones-persist',
    paneDisplayName: 'Old-Ones-Persist',
    flavorLine: 'It arrives every November, sealed in the same hand. He has never visited.',
    silhouetteUrl: null,
    rarity: 'uncommon',
    serial: 312,
    editionSize: 1200,
    contrabandRelation: 'refuses',
    setId: 'oop-starter',
    scars: [],
    iceberg: {
      surface: [
        'A monthly letter from a bishop who has never set foot in the parish.',
        'The seal does not crack until precisely the third Sunday.',
      ],
      echo: 'A letter that arrives but never visits is the parish\'s only buffer against the Old Ones.',
      deep: [
        'The handwriting predates the bishop\'s installation by forty years.',
        'The contents are identical year on year, but the envelopes age normally.',
        'The seal carries an emblem that pre-dates the diocese.',
        'Father Vey does not read it; he places it on the altar unopened.',
        'A previous priest who opened it did not survive Christmas.',
        'The bishop\'s residence cannot be located on any diocesan map.',
        'The letter is the only correspondence Father Vey has not transcribed.',
        'It is rumored to be a list of the names that wake them — and a refusal.',
      ],
    },
    lampblack: {
      gesture: 'a letter set on an altar, unopened, lamp at the side',
      cosmologicalRelation: 'a refusal letter from a higher authority that holds the cosmology in check',
      wound: 'the previous priest who opened it',
      forbiddenAct: 'opening it before the third Sunday',
      role: 'object',
      silhouette: 'a sealed envelope on a stone altar',
      prop: 'wax seal of an unfamiliar diocese',
    },
  },
  {
    id: 'sinter-001',
    name: 'The Black-Cloaked Companion',
    pane: 'sinterklaas-reigns',
    paneDisplayName: 'Sinterklaas-Reigns',
    flavorLine: 'He carries the rod and the sack, and the sack has been heavier this year than last.',
    silhouetteUrl: null,
    rarity: 'rare',
    serial: 33,
    editionSize: 700,
    contrabandRelation: 'carries',
    setId: 'sinter-starter',
    scars: [],
    iceberg: {
      surface: [
        'The companion who walks behind the saint with a sack and a switch.',
        'He keeps the count of households whose children went unanswered.',
      ],
      echo: 'A judging saint without a companion is only a parade; the companion is the law.',
      deep: [
        'The sack is sewn from cloaks taken from those who did not answer their letters.',
        'The companion\'s face is a question that the household must answer before he passes.',
        'In some northern villages, his footprints in the snow are the only sign he came.',
        'The rod is the same wood as the saint\'s crook, cut from the same tree.',
        'Children who go in the sack come back to a different home that has been waiting for them.',
        'The companion has appeared in three Pane\'s ledgers under three names.',
        'He cannot enter a house that has been swept on the eve.',
        'The saint cannot judge without him; the companion cannot judge alone.',
      ],
    },
    lampblack: {
      gesture: 'pausing at a threshold to count something on his fingers',
      cosmologicalRelation: 'the household ledger is the Pane\'s only theology, and the companion is the auditor',
      wound: 'the unanswered letter',
      forbiddenAct: 'sweeping on the eve to deny him entry',
      role: 'auditor',
      silhouette: 'a tall cloaked figure, sack over the shoulder',
      prop: 'a switch and a sack',
    },
  },
  {
    id: 'sinter-002',
    name: 'A Letter Unanswered',
    pane: 'sinterklaas-reigns',
    paneDisplayName: 'Sinterklaas-Reigns',
    flavorLine: 'It sat on the kitchen table for three weeks. The handwriting was a child\'s. The household had no children.',
    silhouetteUrl: null,
    rarity: 'uncommon',
    serial: 244,
    editionSize: 1500,
    contrabandRelation: 'exposes',
    setId: 'sinter-starter',
    scars: [],
    iceberg: {
      surface: [
        'A letter addressed to the saint, never answered.',
        'The household ledger now has a question it cannot close.',
      ],
      echo: 'The unanswered letter is the contraband — the household is ashamed.',
      deep: [
        'The handwriting matches no member of the household, living or dead.',
        'The seal is wax of a kind not made in this Pane.',
        'The companion has paused at this household three winters running.',
        'The letter is dated three weeks before it appeared on the table.',
        'The child who wrote it does not yet exist.',
        'Burning it does not destroy it; the ashes form the same letter again.',
        'The mayor of Lud has had a similar letter.',
        'The first recorded unanswered letter dates to the founding of the parish.',
      ],
    },
    lampblack: {
      gesture: 'a letter laid on a table, untouched for weeks',
      cosmologicalRelation: 'the household ledger is unbalanced because of this letter',
      wound: 'no living child wrote it',
      forbiddenAct: 'burning it',
      role: 'object',
      silhouette: 'an envelope on a wood table, lamp at the side',
      prop: 'wax seal',
    },
  },
  {
    id: 'sinter-003',
    name: 'The Sweep at Eve',
    pane: 'sinterklaas-reigns',
    paneDisplayName: 'Sinterklaas-Reigns',
    flavorLine: 'They swept the threshold at dusk. He could not enter. The house went unjudged.',
    silhouetteUrl: null,
    rarity: 'rare',
    serial: 18,
    editionSize: 600,
    contrabandRelation: 'refuses',
    setId: 'sinter-starter',
    scars: [],
    iceberg: {
      surface: [
        'The household sweeps the threshold on the eve to deny the companion entry.',
        'It is the only known refusal of the auditor, and it costs the household its standing.',
      ],
      echo: 'A house unjudged is a house erased from the ledger; the children of that house are not counted.',
      deep: [
        'The broom must be made of birch from a tree that has never seen frost.',
        'The sweep must be done by the eldest woman of the house.',
        'The dust collected is not ordinary dust — it is the year\'s sins, made visible.',
        'A swept household is invisible to the saint for one calendar year.',
        'The companion has been seen waiting at swept thresholds nonetheless.',
        'The practice is forbidden by the parish, but never punished.',
        'A swept threshold can never be unswept; the year of erasure is permanent.',
        'Some households sweep every eve. Their children grow up nameless to the ledger.',
      ],
    },
    lampblack: {
      gesture: 'a woman sweeping the threshold at dusk, eyes downcast',
      cosmologicalRelation: 'the only act that successfully refuses the auditor of the Pane',
      wound: 'the children rendered invisible to the ledger',
      forbiddenAct: 'sweeping at eve',
      role: 'ritual',
      silhouette: 'an old woman with a broom at a doorway',
      prop: 'a birch broom',
    },
  },
];

// Pierre-Menard triptych — same axiom, three Pane attributions.
export const PIERRE_MENARD_TRIPTYCH: Card[] = [
  {
    id: 'pm-lud',
    name: 'The Refusal',
    pane: 'lud-border',
    paneDisplayName: 'Lud-Border',
    flavorLine: 'I will not admit that I do not know what is in the box.',
    silhouetteUrl: null,
    rarity: 'legendary',
    serial: 4,
    editionSize: 100,
    contrabandRelation: 'refuses',
    setId: 'pm-cycle',
    scars: [],
    iceberg: {
      surface: ['The functionary refuses, and the refusal IS the door.', 'In Lud, refusal is civic.'],
      echo: 'Refusal in Lud is the law\'s thinnest skin.',
      deep: ['The same words as the Vey card.', 'The same words as the Companion card.', 'Three meanings.', '', '', '', '', ''],
    },
    lampblack: {
      gesture: 'standing very still while saying it', cosmologicalRelation: 'civic refusal',
      wound: 'the customs box', forbiddenAct: 'admitting ignorance',
      role: 'functionary', silhouette: 'a clerk', prop: 'a ledger',
    },
  },
  {
    id: 'pm-oop',
    name: 'The Refusal',
    pane: 'old-ones-persist',
    paneDisplayName: 'Old-Ones-Persist',
    flavorLine: 'I will not admit that I do not know what is in the box.',
    silhouetteUrl: null,
    rarity: 'legendary',
    serial: 4,
    editionSize: 100,
    contrabandRelation: 'mediates',
    setId: 'pm-cycle',
    scars: [],
    iceberg: {
      surface: ['The priest refuses, and the refusal is a sermon.', 'In Old-Ones-Persist, refusal is theological.'],
      echo: 'Refusal here means the names have already arrived.',
      deep: ['', '', '', '', '', '', '', ''],
    },
    lampblack: {
      gesture: 'pronouncing it from a pulpit', cosmologicalRelation: 'theological refusal',
      wound: 'the breviary', forbiddenAct: 'admitting that the names speak',
      role: 'priest', silhouette: 'a robed figure', prop: 'a breviary',
    },
  },
  {
    id: 'pm-sinter',
    name: 'The Refusal',
    pane: 'sinterklaas-reigns',
    paneDisplayName: 'Sinterklaas-Reigns',
    flavorLine: 'I will not admit that I do not know what is in the box.',
    silhouetteUrl: null,
    rarity: 'legendary',
    serial: 4,
    editionSize: 100,
    contrabandRelation: 'carries',
    setId: 'pm-cycle',
    scars: [],
    iceberg: {
      surface: ['The companion refuses, and the refusal is a sentence.', 'In Sinterklaas-Reigns, refusal is judgement.'],
      echo: 'Refusal at the threshold is the verdict of the household.',
      deep: ['', '', '', '', '', '', '', ''],
    },
    lampblack: {
      gesture: 'shaking the head once at the door', cosmologicalRelation: 'judicial refusal',
      wound: 'the unanswered letter', forbiddenAct: 'admitting the household is unjudged',
      role: 'auditor', silhouette: 'a cloaked figure at a threshold', prop: 'a switch',
    },
  },
];

// ─── Sets ────────────────────────────────────────────────────────────────────

export const MOCK_SET_PROGRESS: SetProgress[] = [
  {
    setId: 'lud-starter',
    setName: 'Lud-Border Starter',
    pane: PANES['lud-border'],
    owned: 3,
    total: 12,
    missingCards: [
      { id: 'lud-004', name: 'The Cobbler\'s Shop', floorPrice: 24 },
      { id: 'lud-005', name: 'The Mayor\'s Wife', floorPrice: 31 },
      { id: 'lud-006', name: 'The Orchard Wall', floorPrice: 18 },
      { id: 'lud-007', name: 'The Shut Customs House', floorPrice: 47 },
      { id: 'lud-008', name: 'The Mayor\'s Son\'s Silence', floorPrice: 12 },
      { id: 'lud-009', name: 'The Honey-Maker', floorPrice: 22 },
      { id: 'lud-010', name: 'The Lamp on Chanticleer\'s Desk', floorPrice: null },
      { id: 'lud-011', name: 'The Treaty Unread', floorPrice: 64 },
      { id: 'lud-012', name: 'The Customs Inspector Who Vanished', floorPrice: 156 },
    ],
  },
  {
    setId: 'oop-starter',
    setName: 'Old-Ones-Persist Starter',
    pane: PANES['old-ones-persist'],
    owned: 3,
    total: 10,
    missingCards: [
      { id: 'oop-004', name: 'The 1718 Ship\'s Log', floorPrice: 142 },
      { id: 'oop-005', name: 'The Fisherman Who Hauled Quiet', floorPrice: 28 },
      { id: 'oop-006', name: 'A Sermon Whose Words Are Identical', floorPrice: 78 },
      { id: 'oop-007', name: 'The Sea That Returns Higher', floorPrice: 41 },
      { id: 'oop-008', name: 'The Confessional Avoided', floorPrice: 15 },
      { id: 'oop-009', name: 'The Predecessor\'s Ring', floorPrice: 92 },
      { id: 'oop-010', name: 'The Dream That Is Forgotten Awake', floorPrice: null },
    ],
  },
  {
    setId: 'sinter-starter',
    setName: 'Sinterklaas-Reigns Starter',
    pane: PANES['sinterklaas-reigns'],
    owned: 3,
    total: 11,
    missingCards: [
      { id: 'sinter-004', name: 'The Saint Himself', floorPrice: 56 },
      { id: 'sinter-005', name: 'The Sack', floorPrice: 32 },
      { id: 'sinter-006', name: 'The Rod', floorPrice: 21 },
      { id: 'sinter-007', name: 'The Crook of the Same Tree', floorPrice: 68 },
      { id: 'sinter-008', name: 'The Returned Child', floorPrice: 88 },
      { id: 'sinter-009', name: 'The Northern Footprint', floorPrice: 25 },
      { id: 'sinter-010', name: 'The Three Names of the Companion', floorPrice: 110 },
      { id: 'sinter-011', name: 'The Household Ledger', floorPrice: 39 },
    ],
  },
];

// ─── Drops ───────────────────────────────────────────────────────────────────

const FUTURE_TIMESTAMP = (hoursFromNow: number) =>
  new Date(Date.now() + hoursFromNow * 3600 * 1000).toISOString();

export const MOCK_DROPS: Drop[] = [
  {
    id: 'drop-conflict1',
    name: 'Conflict 1 Drop',
    pane: PANES['old-ones-persist'],
    scheduledAt: FUTURE_TIMESTAMP(36),
    packCount: 1200,
    pricePerPack: 19,
    rarityBands: [
      { rarity: 'common', pct: 70 },
      { rarity: 'uncommon', pct: 20 },
      { rarity: 'rare', pct: 8 },
      { rarity: 'legendary', pct: 1.8 },
      { rarity: 'contraband', pct: 0.2 },
    ],
    status: 'upcoming',
  },
  {
    id: 'drop-lud-2',
    name: 'Lud-Border · The Orchard Wall',
    pane: PANES['lud-border'],
    scheduledAt: FUTURE_TIMESTAMP(96),
    packCount: 800,
    pricePerPack: 14,
    rarityBands: [
      { rarity: 'common', pct: 72 },
      { rarity: 'uncommon', pct: 20 },
      { rarity: 'rare', pct: 7 },
      { rarity: 'legendary', pct: 0.9 },
      { rarity: 'contraband', pct: 0.1 },
    ],
    status: 'upcoming',
  },
  {
    id: 'drop-conflict0',
    name: 'Conflict 0 · The Transit',
    pane: PANES['lud-border'],
    scheduledAt: FUTURE_TIMESTAMP(-168),
    packCount: 1000,
    pricePerPack: 19,
    rarityBands: [
      { rarity: 'common', pct: 70 },
      { rarity: 'uncommon', pct: 20 },
      { rarity: 'rare', pct: 8 },
      { rarity: 'legendary', pct: 1.8 },
      { rarity: 'contraband', pct: 0.2 },
    ],
    status: 'sold-out',
    floorPriceAfterDrop: 42,
    trendingPct: 12,
  },
  {
    id: 'drop-sinter-1',
    name: 'Sinterklaas-Reigns · The Black-Cloaked Companion',
    pane: PANES['sinterklaas-reigns'],
    scheduledAt: FUTURE_TIMESTAMP(-360),
    packCount: 700,
    pricePerPack: 14,
    rarityBands: [
      { rarity: 'common', pct: 72 },
      { rarity: 'uncommon', pct: 20 },
      { rarity: 'rare', pct: 7 },
      { rarity: 'legendary', pct: 0.9 },
      { rarity: 'contraband', pct: 0.1 },
    ],
    status: 'sold-out',
    floorPriceAfterDrop: 28,
    trendingPct: -4,
  },
];

// ─── Listings ────────────────────────────────────────────────────────────────

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'list-1',
    card: MOCK_CARDS[1], // Customs Box (contraband)
    askingPrice: 312,
    floorPrice: 295,
    seller: 'orchard-keeper',
    listedAt: FUTURE_TIMESTAMP(-2),
  },
  {
    id: 'list-2',
    card: MOCK_CARDS[3], // Litany at Low Tide
    askingPrice: 148,
    floorPrice: 152,
    seller: 'tide-counter',
    listedAt: FUTURE_TIMESTAMP(-12),
  },
  {
    id: 'list-3',
    card: MOCK_CARDS[0], // Master Nathaniel
    askingPrice: 41,
    floorPrice: 38,
    seller: 'ledger-keeper',
    listedAt: FUTURE_TIMESTAMP(-26),
  },
  {
    id: 'list-4',
    card: MOCK_CARDS[2], // Father Vey
    askingPrice: 33,
    floorPrice: 36,
    seller: 'november-letter',
    listedAt: FUTURE_TIMESTAMP(-48),
  },
  {
    id: 'list-5',
    card: MOCK_CARDS[4], // Black-Cloaked Companion
    askingPrice: 51,
    floorPrice: 49,
    seller: 'door-counter',
    listedAt: FUTURE_TIMESTAMP(-72),
  },
];

// ─── Challenges ──────────────────────────────────────────────────────────────

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'daily-1',
    cadence: 'daily',
    title: 'Open one card detail',
    description: 'Tap into any card in your vault and read its surface flavor.',
    progress: { current: 0, total: 1 },
    reward: '+1 daily pack credit fragment',
    rewardDetail: 'Five fragments combine into a free Common-tier pack at any /drops surface.',
  },
  {
    id: 'daily-2',
    cadence: 'daily',
    title: 'Visit the marketplace',
    description: 'Browse one listing in /market.',
    progress: { current: 0, total: 1 },
    reward: '+1 daily pack credit fragment',
  },
  {
    id: 'weekly-1',
    cadence: 'weekly',
    title: 'Reach a set milestone',
    description: 'Move any started set forward by one card.',
    progress: { current: 1, total: 1 },
    reward: '+1 free pack credit',
    rewardDetail: 'Redeemable on any upcoming drop at common-tier price.',
  },
  {
    id: 'weekly-2',
    cadence: 'weekly',
    title: 'Stake one card in Pane Prediction',
    description: 'Stake any card from either Pane in this week\'s Conflict.',
    progress: { current: 0, total: 1 },
    reward: 'Narrative-scar guarantee',
    rewardDetail: 'If your Pane wins, your staked card earns the scar. If it loses, you receive a consolation Lampblack-mark instead — a softer marker that you participated.',
  },
  {
    id: 'seasonal-1',
    cadence: 'seasonal',
    title: 'The Contraband-Hunt',
    description: 'Hold all four contraband-rare cards in any single Pane by the close of Series 1.',
    progress: { current: 1, total: 4 },
    reward: 'Exclusive contraband-relic card',
    rewardDetail: 'A Series-1-bound legendary that records every contraband you held. Only minted for completers.',
  },
];

// ─── Tier ladder ─────────────────────────────────────────────────────────────

export const TIER_LADDER: Tier[] = [
  { num: 0, name: 'Observer', locked: false },
  { num: 1, name: 'Collector', locked: false },
  { num: 2, name: 'Challenger', locked: true, unlockHint: 'Unlocks in Series 2' },
  { num: 3, name: 'Contributor', locked: true, unlockHint: 'Unlocks in Series 2' },
  { num: 4, name: 'Canon', locked: true, unlockHint: 'Promoted by the Council' },
];

export const CURRENT_TIER: Tier = TIER_LADDER[1]; // Collector

// ─── Conflict ────────────────────────────────────────────────────────────────

export const CURRENT_CONFLICT: ConflictEvent = {
  id: 'conflict-1',
  name: 'Conflict 1: The Boundary Leaks',
  panes: [PANES['old-ones-persist'], PANES['lud-border']],
  description:
    'A litany has been heard at low tide on the Lud side of the border. The customs box has stopped humming. Two Panes are pulling on the same boundary. Stake a card on the side you believe will hold.',
  stakesCloseAt: FUTURE_TIMESTAMP(72),
  stakeCount: {
    'old-ones-persist': 217,
    'lud-border': 184,
  },
  status: 'open',
  outcome: null,
};

export const PAST_CONFLICTS: ConflictEvent[] = [
  {
    id: 'conflict-0',
    name: 'Conflict 0: The Transit',
    panes: [PANES['lud-border'], PANES['old-ones-persist']],
    description:
      'The first conflict. A customs box was inspected; the inspector vanished. Lud-Border claimed the transit. Old-Ones-Persist claimed it was always theirs.',
    stakesCloseAt: FUTURE_TIMESTAMP(-336),
    stakeCount: {
      'lud-border': 423,
      'old-ones-persist': 424,
    },
    status: 'resolved',
    outcome: { winner: PANES['old-ones-persist'], scarsAwarded: 424 },
  },
];

// ─── Profile ─────────────────────────────────────────────────────────────────

export const MOCK_PROFILE: CollectorProfile = {
  handle: 'orchard-keeper',
  joinedAt: FUTURE_TIMESTAMP(-720),
  tier: CURRENT_TIER,
  paneMastery: [
    { pane: PANES['lud-border'], owned: 3, total: 12 },
    { pane: PANES['old-ones-persist'], owned: 3, total: 10 },
    { pane: PANES['sinterklaas-reigns'], owned: 3, total: 11 },
  ],
  showcaseCardIds: ['lud-002', 'lud-001', 'oop-002', 'oop-001', 'sinter-001'],
  stats: {
    cardsOwned: 9,
    setsCompleted: 0,
    conflictsStaked: 1,
    contrabandHeld: 1,
  },
  recentLedger: [
    { txHash: '0xa1b2c3', timestamp: FUTURE_TIMESTAMP(-1), kind: 'conflict-stake', note: 'Staked The Customs Box on Lud-Border in Conflict 1' },
    { txHash: '0xb2c3d4', timestamp: FUTURE_TIMESTAMP(-26), kind: 'pack-open', note: 'Opened Lud-Border Starter Pack #41' },
    { txHash: '0xc3d4e5', timestamp: FUTURE_TIMESTAMP(-48), kind: 'secondary-buy', note: 'Bought Father Erasmus Vey from confessor-of-tides for $33' },
    { txHash: '0xd4e5f6', timestamp: FUTURE_TIMESTAMP(-96), kind: 'drop-purchase', note: 'Bought 2 packs from Conflict 0 · The Transit' },
    { txHash: '0xe5f6a7', timestamp: FUTURE_TIMESTAMP(-144), kind: 'pack-open', note: 'Opened Old-Ones-Persist Starter Pack #18' },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function findCardById(id: string): Card | undefined {
  return MOCK_CARDS.find((c) => c.id === id);
}

export function ownedCardsByPane(paneId: PaneId): Card[] {
  return MOCK_CARDS.filter((c) => c.pane === paneId);
}

export function listingsForSet(setId: string): Listing[] {
  return MOCK_LISTINGS.filter((l) => l.card.setId === setId);
}
