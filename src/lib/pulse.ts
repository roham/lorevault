'use client';

// Pulse Engine — Live activity feed with phantom reactions and FOMO mechanics
// All deterministic from seeded hash — no backend, no new localStorage writes for generation

import { SOCIAL_FEED, SocialFeedItem, SOCIAL_FEED_CONFIG, SocialFeedType } from '@/data/social-feed';
import { getOwnedCards, getCardMeta } from '@/lib/store';

// ===== Seeded PRNG =====
function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ===== Reaction Types =====
export const REACTION_TYPES = [
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'jealous', emoji: '😤', label: 'Jealous' },
  { id: 'respect', emoji: '🫡', label: 'Respect' },
  { id: 'want', emoji: '🤩', label: 'Want' },
  { id: 'gg', emoji: '🎯', label: 'GG' },
] as const;

export type ReactionId = typeof REACTION_TYPES[number]['id'];

// ===== Phantom Collectors =====
const PHANTOM_NAMES = [
  'NeonPhoenix', 'ShadowKing', 'CryptoCollector99', 'VaultKeeper',
  'MythHunter', 'DarkMage42', 'LoreMaster', 'GoldenDrake',
  'ArcaneRider', 'PhantomWolf', 'StarForge', 'BladeRunner77',
  'ThunderGod', 'IceQueen', 'SunKnight', 'MoonStalker',
  'DiamondHands', 'LegendSeeker', 'RuneWeaver', 'StormBringer',
  'OdinsFury', 'FrostGiant', 'DragonSlayer', 'NightWatch',
];

const PHANTOM_ACTIONS: { template: string; type: SocialFeedType; icon: string }[] = [
  { template: '{name} pulled Legendary {card}', type: 'pull', icon: '🔥' },
  { template: '{name} opened a {set} pack', type: 'pull', icon: '📦' },
  { template: '{name} completed {set}', type: 'milestone', icon: '🏆' },
  { template: '{name} reached Level {level}', type: 'milestone', icon: '⭐' },
  { template: '{name} won 5 battles in a row', type: 'challenge', icon: '⚔️' },
  { template: '{name} unlocked a secret lore thread', type: 'milestone', icon: '📖' },
  { template: '{name} forged their first Epic', type: 'milestone', icon: '🔨' },
  { template: '{name} hit #1 in {set} rankings', type: 'leaderboard', icon: '📊' },
];

const SET_NAMES = ['Baker Street', 'Enchanted Kingdom', 'Wonderland', 'Gothic Horror', 'Olympus', 'Asgard'];
const LEGENDARY_CARDS = ['Zeus', 'Odin', 'Sherlock', 'Dracula', 'Snow White', 'Alice', 'Thor', 'Medusa', 'Hades', 'Loki'];

// Narrative Fusion Events — cross-set character interactions
const NARRATIVE_FUSIONS: { text: string; subtext: string }[] = [
  { text: 'Odin met Sherlock Holmes at the crossroads of worlds', subtext: 'The All-Father asked a question. The detective answered with silence.' },
  { text: 'Dracula challenged Zeus to a game of shadows', subtext: 'Lightning met darkness. The shadows won.' },
  { text: 'Alice found a door in the Enchanted Forest', subtext: 'Red Riding Hood warned her not to open it. She opened it anyway.' },
  { text: 'Thor and Hercules argued over whose father was worse', subtext: 'Neither won. Both were right.' },
  { text: 'The Cheshire Cat appeared in Baker Street', subtext: '"We\'re all mad here," he told Watson. Watson agreed.' },
  { text: 'Loki offered Rumpelstiltskin a deal', subtext: 'For the first time, the spinner refused.' },
  { text: 'Medusa gazed into the Evil Queen\'s mirror', subtext: 'The mirror cracked. But not from the gaze — from the truth.' },
  { text: 'Odysseus traded stories with Sherlock Holmes', subtext: 'One sailed the world to find home. The other never left home to find the world.' },
  { text: 'Frankenstein\'s Monster met the Beast', subtext: 'They spoke of what it means to be made, not born.' },
  { text: 'Snow White visited the Underworld', subtext: 'Hades offered her a pomegranate. She knew better.' },
  { text: 'The Jabberwock flew over Asgard', subtext: 'Fenrir howled. The nonsense beast howled back.' },
  { text: 'Prometheus shared fire with the Mad Hatter', subtext: 'Time unfroze for exactly one second. The Hatter wept.' },
];

// ===== Pulse Event =====
export interface PulseEvent {
  id: string;
  type: SocialFeedType;
  text: string;
  subtext?: string;
  icon: string;
  accent: string;
  timestamp: string;
  reactions: Record<ReactionId, number>; // phantom reaction counts
  link?: string;
  isPlayerEvent?: boolean;
}

// Generate phantom pulse events — deterministic from date seed
export function generatePulseEvents(count: number = 20): PulseEvent[] {
  const dateSeed = hashCode(new Date().toISOString().slice(0, 10));
  const rand = seeded(dateSeed);
  const events: PulseEvent[] = [];

  // Seed from existing social feed first
  for (const item of SOCIAL_FEED) {
    const eventRand = seeded(hashCode(item.id) + dateSeed);
    events.push({
      id: `pulse-${item.id}`,
      type: item.type,
      text: item.text,
      subtext: item.subtext,
      icon: item.icon,
      accent: item.accent,
      timestamp: item.timestamp,
      reactions: generatePhantomReactions(item.id, dateSeed),
      link: item.link,
    });
  }

  // Generate additional phantom events to fill the feed
  const needed = count - events.length;
  for (let i = 0; i < needed; i++) {
    const actionIdx = Math.floor(rand() * PHANTOM_ACTIONS.length);
    const action = PHANTOM_ACTIONS[actionIdx];
    const nameIdx = Math.floor(rand() * PHANTOM_NAMES.length);
    const setIdx = Math.floor(rand() * SET_NAMES.length);
    const cardIdx = Math.floor(rand() * LEGENDARY_CARDS.length);
    const level = 5 + Math.floor(rand() * 25);

    const text = action.template
      .replace('{name}', PHANTOM_NAMES[nameIdx])
      .replace('{card}', LEGENDARY_CARDS[cardIdx])
      .replace('{set}', SET_NAMES[setIdx])
      .replace('{level}', String(level));

    const config = SOCIAL_FEED_CONFIG[action.type];
    const minutesAgo = Math.floor(rand() * 120);
    const timestamp = minutesAgo < 1 ? 'just now' : minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo / 60)}h ago`;

    const eventId = `phantom-${dateSeed}-${i}`;
    events.push({
      id: eventId,
      type: action.type,
      text,
      icon: action.icon,
      accent: config.color,
      timestamp,
      reactions: generatePhantomReactions(eventId, dateSeed),
    });
  }

  // Inject 2-3 narrative fusion events (cross-set character interactions)
  const fusionCount = 2 + (dateSeed % 2); // 2 or 3 per day
  const fusionRand = seeded(dateSeed + 777);
  for (let i = 0; i < fusionCount; i++) {
    const fusionIdx = Math.floor(fusionRand() * NARRATIVE_FUSIONS.length);
    const fusion = NARRATIVE_FUSIONS[fusionIdx];
    const minutesAgo = 5 + Math.floor(fusionRand() * 90);
    const timestamp = minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo / 60)}h ago`;
    const eventId = `fusion-${dateSeed}-${i}`;
    events.push({
      id: eventId,
      type: 'milestone' as SocialFeedType,
      text: fusion.text,
      subtext: fusion.subtext,
      icon: '📜',
      accent: '#a855f7',
      timestamp,
      reactions: generatePhantomReactions(eventId, dateSeed),
    });
  }

  // Sort by recency impression (shuffle slightly for variety)
  events.sort((a, b) => {
    const aMin = parseTimestamp(a.timestamp);
    const bMin = parseTimestamp(b.timestamp);
    return aMin - bMin;
  });

  return events.slice(0, count);
}

function parseTimestamp(ts: string): number {
  if (ts === 'just now' || ts === 'now') return 0;
  const match = ts.match(/(\d+)(m|h)/);
  if (!match) return 999;
  const val = parseInt(match[1]);
  return match[2] === 'h' ? val * 60 : val;
}

// Generate deterministic phantom reactions for an event
function generatePhantomReactions(eventId: string, dateSeed: number): Record<ReactionId, number> {
  const rand = seeded(hashCode(eventId) + dateSeed);
  const total = 3 + Math.floor(rand() * 10); // 3-12 phantom reactions
  const reactions: Record<ReactionId, number> = { fire: 0, jealous: 0, respect: 0, want: 0, gg: 0 };

  for (let i = 0; i < total; i++) {
    const idx = Math.floor(rand() * REACTION_TYPES.length);
    reactions[REACTION_TYPES[idx].id]++;
  }

  return reactions;
}

// ===== Player Activity Events =====
export function getPlayerActivityEvents(): PulseEvent[] {
  const owned = getOwnedCards();
  const meta = getCardMeta();
  const events: PulseEvent[] = [];
  const dateSeed = hashCode(new Date().toISOString().slice(0, 10));

  for (const card of owned) {
    const cardMeta = meta[card.id];
    if (!cardMeta) continue;

    for (const event of cardMeta.history) {
      let text = '';
      let icon = '';
      let type: SocialFeedType = 'milestone';

      switch (event.type) {
        case 'pulled':
          text = `You pulled ${card.scarcity === 'legendary' ? 'Legendary ' : card.scarcity === 'epic' ? 'Epic ' : ''}${card.character}`;
          icon = '🎴';
          type = 'pull';
          break;
        case 'revealed':
          text = `You revealed ${card.character}`;
          icon = '✨';
          type = 'pull';
          break;
        case 'battle_win':
          text = `${card.character} won a battle`;
          icon = '⚔️';
          type = 'challenge';
          break;
        case 'battle_loss':
          text = `${card.character} lost a battle`;
          icon = '💔';
          type = 'challenge';
          break;
        case 'showcased':
          text = `You showcased ${card.character}`;
          icon = '🖼';
          type = 'milestone';
          break;
        default:
          continue;
      }

      const config = SOCIAL_FEED_CONFIG[type];
      events.push({
        id: `player-${card.id}-${event.type}-${event.date}`,
        type,
        text,
        subtext: `${card.set} · ${card.scarcity}`,
        icon,
        accent: config.color,
        timestamp: formatRelativeTime(event.date),
        reactions: generatePhantomReactions(`player-${card.id}-${event.type}`, dateSeed),
        isPlayerEvent: true,
      });
    }
  }

  // Sort newest first
  events.sort((a, b) => {
    const aMin = parseTimestamp(a.timestamp);
    const bMin = parseTimestamp(b.timestamp);
    return aMin - bMin;
  });

  return events;
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ===== FOMO Counter =====
// "X legendaries pulled today" — deterministic daily count + increments for player pulls
export function getFomoCount(): { legendaries: number; epics: number; packs: number } {
  const dateSeed = hashCode(new Date().toISOString().slice(0, 10));
  const rand = seeded(dateSeed);

  // Base phantom counts
  const baseLegendaries = 12 + Math.floor(rand() * 40); // 12-51 per day
  const baseEpics = 80 + Math.floor(rand() * 120);      // 80-199 per day
  const basePacks = 500 + Math.floor(rand() * 1500);     // 500-1999 per day

  // Add player's own legendary/epic pulls today
  const owned = getOwnedCards();
  const meta = getCardMeta();
  const today = new Date().toISOString().slice(0, 10);
  let playerLegendaries = 0;
  let playerEpics = 0;

  for (const card of owned) {
    const cardMeta = meta[card.id];
    if (!cardMeta) continue;
    const pulled = cardMeta.history.find(e => e.type === 'pulled' && e.date.startsWith(today));
    if (pulled) {
      if (card.scarcity === 'legendary') playerLegendaries++;
      if (card.scarcity === 'epic') playerEpics++;
    }
  }

  return {
    legendaries: baseLegendaries + playerLegendaries,
    epics: baseEpics + playerEpics,
    packs: basePacks,
  };
}

// ===== User Reactions (localStorage) =====
const REACTIONS_KEY = 'lorevault_reactions';

export function getUserReactions(): Record<string, ReactionId[]> {
  try {
    const raw = localStorage.getItem(REACTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function toggleUserReaction(eventId: string, reactionId: ReactionId): ReactionId[] {
  const all = getUserReactions();
  const current = all[eventId] || [];

  if (current.includes(reactionId)) {
    all[eventId] = current.filter(r => r !== reactionId);
  } else {
    all[eventId] = [...current, reactionId];
  }

  localStorage.setItem(REACTIONS_KEY, JSON.stringify(all));
  return all[eventId];
}
