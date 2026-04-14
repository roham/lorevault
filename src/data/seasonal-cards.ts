import { Card } from './types';

// Season 1: Ragnarok — 3 exclusive legendary cards
// Only pullable during active season window, marked "Vault Sealed" after expiry

export const SEASONAL_CARDS: Card[] = [
  {
    id: 'seasonal-ragnarok-odin',
    name: 'Odin — The All-Father\'s Last Stand',
    character: 'Odin',
    set: 'Season 1: Ragnarok',
    setSlug: 'asgard',
    moment: 'The All-Father\'s Last Stand',
    scarcity: 'legendary',
    parallel: 'holographic',
    serialNumber: 1,
    maxSerial: 10,
    loreText: '"I know that I hung on a wind-rocked tree, nine whole nights, wounded with a spear. I peered downward, I took up the runes, screaming I took them, then I fell back from there." In the twilight of the gods, Odin rides Sleipnir one final time into the jaws of Fenrir.',
    price: 499,
    listed: false,
    owned: false,
    gradientFrom: '#2e1a0a',
    gradientTo: '#1a0a2e',
    symbol: '⚡',
  },
  {
    id: 'seasonal-fenrir-unbound',
    name: 'Fenrir — The Chain-Breaker',
    character: 'Fenrir',
    set: 'Season 1: Ragnarok',
    setSlug: 'asgard',
    moment: 'The Chain-Breaker',
    scarcity: 'legendary',
    parallel: 'obsidian',
    serialNumber: 1,
    maxSerial: 10,
    loreText: '"The wolf Fenrir broke free of Gleipnir, the fetter forged from the sound of a cat\'s footsteps, the beard of a woman, and the breath of a fish. His jaws stretch from earth to sky, and fire blazes from his eyes and nostrils." The beast that swallows the sun.',
    price: 599,
    listed: false,
    owned: false,
    gradientFrom: '#0a0a2e',
    gradientTo: '#1a0a0a',
    symbol: '🐺',
  },
  {
    id: 'seasonal-twilight-valkyrie',
    name: 'Valkyrie — Twilight\'s Last Ride',
    character: 'Valkyrie',
    set: 'Season 1: Ragnarok',
    setSlug: 'asgard',
    moment: 'Twilight\'s Last Ride',
    scarcity: 'legendary',
    parallel: 'gold',
    serialNumber: 1,
    maxSerial: 10,
    loreText: '"The choosers of the slain ride forth for the final time. Their armor gleams with the light of dying stars, their spears trailing flames across the darkening sky. This is not a battle to win — it is a battle to be worthy of." The last harvest of heroes.',
    price: 449,
    listed: false,
    owned: false,
    gradientFrom: '#2e2e0a',
    gradientTo: '#0a1a2e',
    symbol: '⚔️',
  },
];

export function getSeasonalCardIds(): string[] {
  return SEASONAL_CARDS.map(c => c.id);
}
